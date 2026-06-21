import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import type { AdminSession } from '@/lib/session.server';
import { SESSION_OPTIONS } from '@/lib/session.server';
import createI18nMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const i18nMiddleware = createI18nMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Login page itself is always accessible
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check session cookie — iron-session works with NextRequest/NextResponse
    const res = NextResponse.next();
    const session = await getIronSession<AdminSession>(req, res, SESSION_OPTIONS);

    if (!session.isAdmin) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return res;
  }

  // ── API routes for admin — double-check auth (belt + suspenders) ──────────
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
    const res = NextResponse.next();
    const session = await getIronSession<AdminSession>(req, res, SESSION_OPTIONS);

    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return res;
  }

  // ── i18n for public site ───────────────────────────────────────────────────
  // Inject x-pathname into the request before i18nMiddleware so server
  // components can build correct hreflang links. We modify the request, not
  // the response, to preserve all rewrites i18nMiddleware performs for locale
  // routing (/en, /ru etc. are handled via rewrite, not redirect).
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-pathname', pathname);
  return i18nMiddleware(new NextRequest(req.url, {
    headers: reqHeaders,
    method: req.method,
  }));
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    // Exclude _next, static files, and ALL /api/* routes from i18n middleware
    '/((?!_next|_vercel|favicon.ico|api/|.*\\..*).*)',
  ],
};
