import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords, createRecord } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const candidateId = new URL(req.url).searchParams.get('candidateId');
    const records = await listRecords('payments', {
      maxRecords: 500,
      filterFormula: candidateId ? `FIND("${candidateId}", ARRAYJOIN({Candidate}, ","))` : undefined,
      sort: [{ field: 'Date', direction: 'desc' }],
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

    const VALID_TYPES = ['Registration Fee 300 GEL', 'Security Deposit', 'Service Fee'];
    if (!VALID_TYPES.includes(body['Payment Type'])) {
      return err(`Payment Type must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }

    const fields: Record<string, unknown> = {};
    const allowed = ['Candidate', 'Payment Type', 'Amount GEL', 'Date', 'Notes', 'Method'];
    for (const key of allowed) {
      if (body[key] !== undefined && body[key] !== '') fields[key] = body[key];
    }

    if (!fields['Candidate']) return err('Candidate link is required', 400);

    const record = await createRecord('payments', fields);
    return ok(record, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
