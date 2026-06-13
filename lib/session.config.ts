import type { SessionOptions } from 'iron-session';

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
    maxAge: 60 * 60 * 8,
  },
};
