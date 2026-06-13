import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { updateRecord } from '@/lib/airtable.server';
import { ok, err } from '@/lib/api';

const VALID = ['Pending', 'Approved', 'Active', 'Rejected'];
type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const { status } = await req.json();
    if (!VALID.includes(status)) return err(`Status must be one of: ${VALID.join(', ')}`, 400);
    return ok(await updateRecord('employers', id, { 'Request Status': status }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
