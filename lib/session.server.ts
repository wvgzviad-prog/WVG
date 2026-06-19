/**
 * lib/session.server.ts — Server-only session helpers using iron-session.
 * Encrypted, signed HttpOnly cookies. Token never leaves the server.
 */
import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface AdminSession {
  isAdmin?: boolean;
  username?: string;
  loginAt?: number;
}

export const SESSION_OPTIONS: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET ?? 'fallback-dev-secret-change-in-production-32chars!!',
  cookieName: 'wvg_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, SESSION_OPTIONS);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) throw new Error('UNAUTHORIZED');
  return session;
}
