import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { getRecord, updateRecord, deleteRecord } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    return ok(await getRecord('candidates', id));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();

    const allowed = [
      'Candidate Status', 'Registration Fee Paid', 'Security Deposit Paid',
      'Document Status', 'Profession', 'Destination Country', 'Phone',
      'WhatsApp', 'Notes', 'Work Experience', 'Has Passport', 'Worked in Israel',
    ];

    const fields: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (Object.keys(fields).length === 0) return err('No valid fields', 400);

    return ok(await updateRecord('candidates', id, fields));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    return ok(await deleteRecord('candidates', id));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
