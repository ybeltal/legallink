import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const role = requestUrl.searchParams.get('role') || 'client';
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  const supabaseUrl = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/['"]/g, '')
    .trim();

  let userName = role === 'advocate' ? 'Advocate' : 'Member';
  let userEmail = '';

  if (code && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase.auth.exchangeCodeForSession(code);
      const user = data?.user;
      const meta = user?.user_metadata || {};

      userEmail = user?.email || '';
      userName =
        meta.full_name ||
        meta.name ||
        (userEmail ? userEmail.split('@')[0] : '') ||
        userName;
    } catch {
      // Proceed cleanly even if session exchange already completed
    }
  }

  const destination = redirect.startsWith('/') ? `${origin}${redirect}` : `${origin}/`;
  const response = NextResponse.redirect(destination);
  const maxAge = 60 * 60 * 24 * 7; // 7 days

  response.cookies.set('legallink_auth', 'authenticated', {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  response.cookies.set('legallink_role', role, {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  response.cookies.set('legallink_user_name', encodeURIComponent(userName), {
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
  if (userEmail) {
    response.cookies.set('legallink_user_email', encodeURIComponent(userEmail), {
      path: '/',
      maxAge,
      sameSite: 'lax',
    });
  }
  response.cookies.set('legallink_welcome', 'true', {
    path: '/',
    maxAge: 60 * 5, // Show welcome banner for 5 minutes after login
    sameSite: 'lax',
  });

  return response;
}