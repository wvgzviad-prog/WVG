/**
 * lib/session.server.ts — Server-only session helpers using iron-session.
 * Encrypted, signed HttpOnly cookies. Token never leaves the server.
 */
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
export type { AdminSession } from './session.config';
export { SESSION_OPTIONS } from './session.config';
import type { AdminSession } from './session.config';
import { SESSION_OPTIONS } from './session.config';

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) throw new Error('UNAUTHORIZED');
  return session;
}
