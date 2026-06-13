import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { updateRecord } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();

    const allowed = [
      'Status In Israel', 'Notes', 'Last Contact',
      'Contract End Date', 'Employer', 'Arrival Date',
    ];
    const fields: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) fields[key] = body[key];
    }
    if (Object.keys(fields).length === 0) return err('No valid fields', 400);

    return ok(await updateRecord('monitoring', id, fields));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
