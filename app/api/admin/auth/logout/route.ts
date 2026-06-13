import { getSession } from '@/lib/session.server';
import { ok } from '@/lib/api';

export async function POST() {
  const session = await getSession();
  session.destroy();
  return ok({ ok: true });
}
