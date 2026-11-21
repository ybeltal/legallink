import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const role = requestUrl.searchParams.get('role') === 'advocate' ? 'advocate' : 'client';
  const redirect = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/['"]/g, '')
    .trim();

  if (!supabaseAnonKey) {
    return NextResponse.redirect(`${origin}/login?error=oauth_not_configured`);
  }

  const cookieStore = await cookies();
  const cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }> = [];

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

  const safeRedirect = redirect.startsWith('/') ? redirect : '/';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?role=${role}&redirect=${encodeURIComponent(safeRedirect)}`,
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(`${origin}/login?error=google_oauth_failed`);
  }

  const response = NextResponse.redirect(data.url);
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  });
  return response;
}