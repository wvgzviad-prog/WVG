import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const status = new URL(req.url).searchParams.get('status');
    return ok(await listRecords('employers', {
      maxRecords: 200,
      filterFormula: status ? `{Request Status} = "${status}"` : undefined,
    }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
