import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { listRecords, createRecord } from '@/lib/google-sheets.server';
import { ok, err } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('q')?.toLowerCase();
    const country = searchParams.get('country');

    let records = await listRecords('candidates', {
      maxRecords: 500,
      sort: [{ field: 'Name', direction: 'asc' }],
      filterFormula: status ? `{Candidate Status} = "${status}"` : undefined,
    });

    if (country) records = records.filter(r => r.fields['Destination Country'] === country);
    if (search) records = records.filter(r =>
      ((r.fields['Name'] as string) ?? '').toLowerCase().includes(search) ||
      ((r.fields['Profession'] as string) ?? '').toLowerCase().includes(search)
    );

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
      'Name', 'Phone', 'WhatsApp', 'Profession', 'Destination Country',
      'Candidate Status', 'Date of Birth', 'Work Experience', 'Has Passport',
      'Worked in Israel', 'Tried Israel Entry', 'Ready to Travel Date', 'Notes',
    ];

    const fields: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined && body[key] !== '') fields[key] = body[key];
    }
    if (!fields['Name']) return err('Name is required', 400);

    const record = await createRecord('candidates', fields);
    return ok(record, 201);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
