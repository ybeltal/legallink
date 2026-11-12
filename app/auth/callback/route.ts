import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const role = requestUrl.searchParams.get('role') || 'client';
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  const supabaseUrl = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

  if (code && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await supabase.auth.exchangeCodeForSession(code);
    } catch {
      // Proceed to redirect even if code exchange has already occurred
    }
  }

  const destination = redirect.startsWith('/') ? `${origin}${redirect}` : `${origin}/`;
  const response = NextResponse.redirect(destination);

  response.cookies.set('legallink_auth', 'authenticated', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });
  response.cookies.set('legallink_role', role, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });

  return response;
}