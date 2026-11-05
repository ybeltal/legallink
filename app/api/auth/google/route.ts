import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const role = requestUrl.searchParams.get('role') || 'client';
    const redirect = requestUrl.searchParams.get('redirect') || (role === 'advocate' ? '/advocate/portal' : '/find-a-lawyer');
    const origin = requestUrl.origin;

    // Hardcoded project URL to eliminate Vercel environment sync issues
    const supabaseUrl = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseAnonKey) {
      return NextResponse.json({
        error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel environment variables.',
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey.replace(/['"]/g, '').trim());

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error || !data?.url) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error?.message || 'oauth_failed')}`);
    }

    return NextResponse.redirect(data.url);
  } catch (err: any) {
    return NextResponse.json({
      error: err?.message || 'Internal Server Error',
      stack: err?.stack,
    }, { status: 500 });
  }
}