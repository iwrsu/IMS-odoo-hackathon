import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query<{ now: string }>('SELECT NOW()::text AS now');

    return NextResponse.json({
      ok: true,
      database: 'postgres',
      connectedAt: result.rows[0]?.now ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';

    return NextResponse.json(
      {
        ok: false,
        database: 'postgres',
        error: message,
      },
      { status: 500 }
    );
  }
}
