import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: 'connected' });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        database: 'disconnected',
        error: error?.message ?? 'Unknown database error',
      },
      { status: 500 }
    );
  }
}
