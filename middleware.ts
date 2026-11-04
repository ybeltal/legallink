import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Fallback to project keys if environment variables are not yet linked in Vercel dashboard
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. PUBLIC ROUTES: Landing page, authentication, APIs, and legal policies NEVER require sign-up
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/privacy');

  // Immediately render public routes without invoking database checks
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES: Check authentication inside a safe try-catch wrapper
  let user = null;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.error('Middleware auth check error:', err);
  }

  // 3. If unauthenticated visitor attempts to access any feature page, redirect to /signup
  if (!user) {
    const signupUrl = new URL('/signup', request.url);
    signupUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signupUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static build files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser icon)
     * - static image/asset files (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
