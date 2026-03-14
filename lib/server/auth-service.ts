import 'server-only';

import { createHash, randomInt, randomUUID } from 'node:crypto';
import { PoolClient } from 'pg';
import { query, withTransaction } from '@/lib/db';
import { User, UserRole } from '@/lib/types';
import { sendOtpEmail } from '@/lib/server/mailer';

type OtpPurpose = 'login' | 'reset';

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  warehouse: string | null;
  is_active: boolean;
}

interface SessionRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
}

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'ims_session';
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES ?? 10);
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? 7);

function hashValue(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    warehouse: row.warehouse ?? undefined,
  };
}

function generateOtpCode() {
  return randomInt(100000, 1000000).toString();
}

function generateSessionToken() {
  return `${randomUUID()}-${randomUUID()}`;
}

function ensureRole(role: unknown): role is UserRole {
  return role === 'admin' || role === 'manager' || role === 'staff';
}

function deriveDisplayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? 'user';
  const normalized = localPart.replace(/[._-]+/g, ' ').trim();
  if (!normalized) return 'User';
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

async function getOrCreateActiveUser(email: string, role?: UserRole) {
  const existingResult = await query<UserRow>(
    'SELECT * FROM users WHERE email = $1 AND is_active = TRUE LIMIT 1',
    [email]
  );

  const existing = existingResult.rows[0];
  if (existing) {
    if (role && existing.role !== role) {
      throw new Error('Email and role do not match');
    }
    return existing;
  }

  const resolvedRole: UserRole = role ?? 'staff';
  const createdResult = await query<UserRow>(
    `
      INSERT INTO users (id, email, name, role, warehouse, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NULL, TRUE, NOW(), NOW())
      RETURNING *
    `,
    [randomUUID(), email, deriveDisplayNameFromEmail(email), resolvedRole]
  );

  return createdResult.rows[0];
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export async function requestOtp(params: {
  email: string;
  role?: UserRole;
  purpose?: OtpPurpose;
}) {
  const email = params.email.trim().toLowerCase();
  if (params.role && !ensureRole(params.role)) {
    throw new Error('Invalid role');
  }
  const purpose: OtpPurpose = params.purpose ?? 'login';

  const user = await getOrCreateActiveUser(email, params.role);

  const otp = generateOtpCode();
  const codeHash = hashValue(`${email}:${otp}`);

  await withTransaction(async (client: PoolClient) => {
    await client.query(
      `
        DELETE FROM otp_codes
        WHERE user_id = $1
          AND purpose = $2
          AND used_at IS NULL
      `,
      [user.id, purpose]
    );

    await client.query(
      `
        INSERT INTO otp_codes (id, user_id, code_hash, purpose, expires_at, created_at, attempts)
        VALUES ($1, $2, $3, $4, NOW() + ($5 || ' minutes')::interval, NOW(), 0)
      `,
      [randomUUID(), user.id, codeHash, purpose, String(OTP_TTL_MINUTES)]
    );
  });

  await sendOtpEmail({
    to: user.email,
    name: user.name,
    otp,
    ttlMinutes: OTP_TTL_MINUTES,
    role: user.role,
  });

  return {
    ok: true,
    email: user.email,
    role: user.role,
    expiresInMinutes: OTP_TTL_MINUTES,
  };
}

export async function verifyOtp(params: { email: string; otp: string; role?: UserRole }) {
  const email = params.email.trim().toLowerCase();
  const role = params.role;
  if (role && !ensureRole(role)) {
    throw new Error('Invalid role');
  }

  const userResult = await query<UserRow>(
    'SELECT * FROM users WHERE email = $1 AND is_active = TRUE LIMIT 1',
    [email]
  );
  const user = userResult.rows[0];

  if (!user) {
    throw new Error('No active user found for this email');
  }

  if (role && user.role !== role) {
    throw new Error('Email and role do not match');
  }

  const codeHash = hashValue(`${email}:${params.otp.trim()}`);

  const sessionToken = await withTransaction(async (client: PoolClient) => {
    const otpResult = await client.query<{
      id: string;
      code_hash: string;
      attempts: number;
      expires_at: string;
      used_at: string | null;
    }>(
      `
        SELECT id, code_hash, attempts, expires_at, used_at
        FROM otp_codes
        WHERE user_id = $1
          AND purpose = 'login'
        ORDER BY created_at DESC
        LIMIT 1
        FOR UPDATE
      `,
      [user.id]
    );

    const otpRow = otpResult.rows[0];

    if (!otpRow || otpRow.used_at) {
      throw new Error('No valid OTP request found');
    }

    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      throw new Error('OTP expired. Request a new code');
    }

    if (otpRow.attempts >= 5) {
      throw new Error('Too many invalid attempts. Request a new code');
    }

    if (otpRow.code_hash !== codeHash) {
      await client.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1', [otpRow.id]);
      throw new Error('Invalid OTP code');
    }

    await client.query('UPDATE otp_codes SET used_at = NOW() WHERE id = $1', [otpRow.id]);

    const rawToken = generateSessionToken();
    const tokenHash = hashValue(rawToken);

    await client.query(
      `
        INSERT INTO user_sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at)
        VALUES ($1, $2, $3, NOW() + ($4 || ' days')::interval, NOW(), NOW())
      `,
      [randomUUID(), user.id, tokenHash, String(SESSION_TTL_DAYS)]
    );

    return rawToken;
  });

  return {
    sessionToken,
    user: toUser(user),
    expiresInDays: SESSION_TTL_DAYS,
  };
}

export async function getCurrentUserBySessionToken(rawToken: string | undefined) {
  if (!rawToken) return null;

  const tokenHash = hashValue(rawToken);

  const sessionResult = await query<SessionRow>(
    `
      SELECT id, user_id, token_hash, expires_at
      FROM user_sessions
      WHERE token_hash = $1
      LIMIT 1
    `,
    [tokenHash]
  );

  const session = sessionResult.rows[0];
  if (!session) return null;

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await query('DELETE FROM user_sessions WHERE id = $1', [session.id]);
    return null;
  }

  await query('UPDATE user_sessions SET last_seen_at = NOW() WHERE id = $1', [session.id]);

  const userResult = await query<UserRow>(
    'SELECT * FROM users WHERE id = $1 AND is_active = TRUE LIMIT 1',
    [session.user_id]
  );
  const user = userResult.rows[0];
  if (!user) return null;

  return toUser(user);
}

export async function logoutBySessionToken(rawToken: string | undefined) {
  if (!rawToken) return;

  const tokenHash = hashValue(rawToken);
  await query('DELETE FROM user_sessions WHERE token_hash = $1', [tokenHash]);
}
