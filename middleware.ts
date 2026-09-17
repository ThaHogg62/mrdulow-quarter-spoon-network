import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_EMAILS = ['qse6209@gmail.com', 'mrdulow12@gmail.com'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin paths and /api/admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Whitelist the security-alert endpoint itself so it can process reports
    if (pathname === '/api/admin/security-alert') {
      return NextResponse.next();
    }

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const userEmail = (token?.email ? String(token.email).trim().toLowerCase() : '');
    const isAuthorized = Boolean(userEmail && ADMIN_EMAILS.includes(userEmail));

    if (!isAuthorized) {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      // Dispatch security breach alert asynchronously
      try {
        fetch('https://formspree.io/f/xqarrpvl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            alertType: 'CRITICAL_SECURITY_BREACH_ATTEMPT',
            attemptedEmail: userEmail || 'UNAUTHENTICATED_GUEST',
            targetPath: pathname,
            clientIp: ip,
            userAgent,
            timestamp: new Date().toISOString(),
            action: 'ACCESS_BLOCKED_HTTP_403',
            recipient: 'mrdulow12@gmail.com',
          }),
        }).catch(() => {});
      } catch {
        // Edge fetch failure fallback
      }

      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            error: 'FORBIDDEN: Administrative clearance required. Security alert dispatched to mrdulow12@gmail.com.',
            code: 403,
          }),
          {
            status: 403,
            headers: { 'content-type': 'application/json' },
          }
        );
      }

      // Rewrite to custom 403 page
      const url = req.nextUrl.clone();
      url.pathname = '/403';
      url.searchParams.set('unauthorized', userEmail || 'guest');
      url.searchParams.set('target', pathname);
      return NextResponse.rewrite(url, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
