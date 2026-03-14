import { NextResponse } from 'next/server';
import { requestOtp } from '@/lib/server/auth-service';
import { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const role = body.role as UserRole | undefined;

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    const data = await requestOtp({ email, role, purpose: 'login' });
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
