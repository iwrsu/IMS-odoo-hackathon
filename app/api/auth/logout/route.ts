import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookieName, logoutBySessionToken } from '@/lib/server/auth-service';

const sessionCookieName = getSessionCookieName();

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(sessionCookieName)?.value;

    await logoutBySessionToken(sessionToken);

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: sessionCookieName,
      value: '',
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
