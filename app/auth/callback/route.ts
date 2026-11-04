import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirect = requestUrl.searchParams.get('redirect') || '/find-a-lawyer';
    const origin = requestUrl.origin;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (code && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(`${origin}${redirect}`);
  } catch (err: any) {
    return NextResponse.redirect(`${new URL(request.url).origin}/login?error=auth_callback_failed`);
  }
}