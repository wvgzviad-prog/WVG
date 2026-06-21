import { NextResponse } from 'next/server';
import { getWorkforceData } from '@/lib/workforce.server';

export const revalidate = 300;

export async function GET() {
  try {
    const data = await getWorkforceData();
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
