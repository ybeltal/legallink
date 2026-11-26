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
  const code = requestUrl.searchParams.get('code');
  const roleParam = requestUrl.searchParams.get('role');
  const role: 'client' | 'advocate' =
    roleParam === 'advocate' ? 'advocate' : 'client';
  const redirectParam = requestUrl.searchParams.get('redirect') || '/';
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_auth_code`);
  }

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

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data?.user) {
      console.error('Supabase code exchange failed:', error?.message);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const user = data.user;
    const meta = user.user_metadata || {};
    const userEmail = user.email || '';
    const userName =
      meta.full_name ||
      meta.name ||
      (meta.first_name
        ? `${meta.first_name} ${meta.last_name || ''}`.trim()
        : '') ||
      (userEmail
        ? userEmail.split('@')[0]
        : role === 'advocate'
        ? 'Advocate'
        : 'Member');

    const resolvedRole: 'client' | 'advocate' =
      meta.role === 'advocate' || role === 'advocate' ? 'advocate' : 'client';

    // Send welcome email once per user account via Gmail SMTP
    if (userEmail && meta.welcome_email_sent !== true) {
      try {
        const emailRes = await fetch(`${origin}/api/welcome-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            fullName: userName,
            role: resolvedRole,
          }),
        });

        if (emailRes.ok) {
          await supabase.auth.updateUser({
            data: {
              role: resolvedRole,
              welcome_email_sent: true,
            },
          });
        }
      } catch (emailErr) {
        console.error('Welcome email dispatch error:', emailErr);
      }
    }

    const safeRedirect = redirectParam.startsWith('/') ? redirectParam : '/';
    const destination =
      safeRedirect === '/' && resolvedRole === 'advocate'
        ? `${origin}/advocate/portal`
        : `${origin}${safeRedirect}`;

    const response = NextResponse.redirect(destination);

    // Attach Supabase SSR session cookies safely
    cookiesToSet.forEach(({ name, value, options }) => {
      try {
        response.cookies.set(
          name,
          value,
          options as Parameters<typeof response.cookies.set>[2]
        );
      } catch {
        response.cookies.set(name, value, { path: '/', sameSite: 'lax' });
      }
    });

    // Attach lightweight UI cookies for Navbar & WelcomeBanner
    const maxAge = 60 * 60 * 24 * 7;
    response.cookies.set('legallink_auth', 'authenticated', {
      path: '/',
      maxAge,
      sameSite: 'lax',
    });
    response.cookies.set('legallink_role', resolvedRole, {
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
      response.cookies.set(
        'legallink_user_email',
        encodeURIComponent(userEmail),
        {
          path: '/',
          maxAge,
          sameSite: 'lax',
        }
      );
    }
    response.cookies.set('legallink_welcome', 'true', {
      path: '/',
      maxAge: 60 * 5,
      sameSite: 'lax',
    });

    return response;
  } catch (err) {
    console.error('Unhandled /auth/callback error:', err);
    return NextResponse.redirect(`${origin}/login?error=callback_exception`);
  }
}