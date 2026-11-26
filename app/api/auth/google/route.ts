import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const FALLBACK_SUPABASE_URL = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

function getSupabaseConfig() {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    .replace(/['"]/g, '')
    .trim();
  const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/['"]/g, '')
    .trim();

  return {
    supabaseUrl: rawUrl.startsWith('https://') ? rawUrl : FALLBACK_SUPABASE_URL,
    supabaseAnonKey: rawKey.length > 20 ? rawKey : FALLBACK_SUPABASE_ANON_KEY,
  };
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const role =
    requestUrl.searchParams.get('role') === 'advocate' ? 'advocate' : 'client';
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;
  const safeRedirect = redirect.startsWith('/') ? redirect : '/';

  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    const cookieStore = await cookies();
    const cookiesToSet: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }> = [];

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          list.forEach((c) => cookiesToSet.push(c));
        },
      },
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?role=${role}&redirect=${encodeURIComponent(safeRedirect)}`,
      },
    });

    if (error || !data?.url) {
      console.error('Google OAuth initiation failed:', error?.message);
      return NextResponse.redirect(`${origin}/login?error=google_oauth_failed`);
    }

    const response = NextResponse.redirect(data.url);
    cookiesToSet.forEach(({ name, value, options }) => {
      try {
        response.cookies.set(
          name,
          value,
          options as Parameters<typeof response.cookies.set>[2]
        );
      } catch (cookieErr) {
        console.warn('Skipped non-standard cookie option:', cookieErr);
        response.cookies.set(name, value, { path: '/', sameSite: 'lax' });
      }
    });

    return response;
  } catch (err) {
    console.error('Unhandled /api/auth/google error:', err);
    return NextResponse.redirect(`${origin}/login?error=google_oauth_exception`);
  }
}