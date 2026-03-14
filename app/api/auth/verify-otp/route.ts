import { NextResponse } from 'next/server';
import { getSessionCookieName, verifyOtp } from '@/lib/server/auth-service';
import { UserRole } from '@/lib/types';

const sessionCookieName = getSessionCookieName();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const otp = String(body.otp ?? '').trim();
    const role = body.role as UserRole | undefined;

    if (!email || !otp) {
      return NextResponse.json({ ok: false, error: 'Email and OTP are required' }, { status: 400 });
    }

    const result = await verifyOtp({ email, otp, role });

    const response = NextResponse.json({ ok: true, data: { user: result.user } });
    response.cookies.set({
      name: sessionCookieName,
      value: result.sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: result.expiresInDays * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OTP verification failed';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
