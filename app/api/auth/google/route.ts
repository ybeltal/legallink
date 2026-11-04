import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const role = requestUrl.searchParams.get('role') || 'client';
  const redirect = requestUrl.searchParams.get('redirect') || (role === 'advocate' ? '/advocate/portal' : '/find-a-lawyer');
  const origin = requestUrl.origin;

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error?.message || 'oauth_init_failed')}`);
  }

  return NextResponse.redirect(data.url);
}