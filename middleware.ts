import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/signup', '/login', '/terms', '/privacy'];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow Next.js internals, API routes, auth callbacks, and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow the landing page and public authentication/legal pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Require authentication before advancing into platform pages
  const isAuthenticated = request.cookies.get('legallink_auth')?.value === 'authenticated';

  if (!isAuthenticated) {
    const signupUrl = new URL('/signup', request.url);
    signupUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(signupUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};