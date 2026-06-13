import { getSession } from '@/lib/session.server';
import { ok } from '@/lib/api';

export async function GET() {
  const session = await getSession();
  if (session.isAdmin) {
    return ok({ authenticated: true, username: session.username });
  }
  return ok({ authenticated: false });
}
