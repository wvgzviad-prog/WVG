import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords, createRecord } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

export async function GET() {
  try {
    await requireAdmin();
    return ok(await listRecords('projects', { maxRecords: 200, sort: [{ field: 'Position Name', direction: 'asc' }] }));
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
    const allowed = ['Position Name', 'Country', 'Salary', 'Workers Needed', 'Status', 'Schedule', 'Accommodation', 'Notes', 'Experience Required'];
    const fields: Record<string, unknown> = {};
    for (const key of allowed) { if (body[key] !== undefined && body[key] !== '') fields[key] = body[key]; }
    if (!fields['Position Name']) return err('Position Name is required', 400);
    return ok(await createRecord('projects', fields), 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
