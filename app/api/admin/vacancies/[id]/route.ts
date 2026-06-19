import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/session.server';
import { updateRecord, deleteRecord } from '@/lib/google-sheets.server';
import { ok, err } from '@/lib/api';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const allowed = ['Position Name', 'Country', 'Salary', 'Workers Needed', 'Status', 'Schedule', 'Accommodation', 'Notes'];
    const fields: Record<string, unknown> = {};
    for (const key of allowed) { if (body[key] !== undefined) fields[key] = body[key]; }
    if (Object.keys(fields).length === 0) return err('No valid fields', 400);
    return ok(await updateRecord('projects', id, fields));
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
    return ok(await deleteRecord('projects', id));
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error';
    if (msg === 'UNAUTHORIZED') return err('Unauthorized', 401);
    return err(msg, 500);
  }
}
