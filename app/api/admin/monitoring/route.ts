import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords, updateRecord, createRecord } from '@/lib/google-sheets.server';
import { ok, err } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();
    const records = await listRecords('monitoring', {
      maxRecords: 500,
      sort: [{ field: 'Name', direction: 'asc' }],
    });
    return ok(records);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const allowed = [
      'Name', 'Candidate', 'Arrival Date', 'Employer', 'Status In Israel',
      'Contract End Date', 'Notes', 'Last Contact',
    ];
    const fields: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined && body[key] !== '') fields[key] = body[key];
    }
    const record = await createRecord('monitoring', fields);
    return ok(record, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
