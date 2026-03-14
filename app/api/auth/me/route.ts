import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserBySessionToken, getSessionCookieName } from '@/lib/server/auth-service';

const sessionCookieName = getSessionCookieName();

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(sessionCookieName)?.value;

    const user = await getCurrentUserBySessionToken(sessionToken);

    if (!user) {
      return NextResponse.json({ ok: true, data: { user: null } });
    }

    return NextResponse.json({ ok: true, data: { user } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
