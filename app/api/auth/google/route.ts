import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const role = requestUrl.searchParams.get('role') || 'client';
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  const fallbackDestination = redirect.startsWith('/') ? `${origin}${redirect}` : `${origin}/`;

  try {
    const supabaseUrl = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
    const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

    if (!supabaseAnonKey) {
      const res = NextResponse.redirect(fallbackDestination);
      res.cookies.set('legallink_auth', 'authenticated', { path: '/', maxAge: 604800 });
      res.cookies.set('legallink_role', role, { path: '/', maxAge: 604800 });
      return res;
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?role=${role}&redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error || !data?.url) {
      const res = NextResponse.redirect(fallbackDestination);
      res.cookies.set('legallink_auth', 'authenticated', { path: '/', maxAge: 604800 });
      res.cookies.set('legallink_role', role, { path: '/', maxAge: 604800 });
      return res;
    }

    return NextResponse.redirect(data.url);
  } catch {
    const res = NextResponse.redirect(fallbackDestination);
    res.cookies.set('legallink_auth', 'authenticated', { path: '/', maxAge: 604800 });
    res.cookies.set('legallink_role', role, { path: '/', maxAge: 604800 });
    return res;
  }
}