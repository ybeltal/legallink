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

function getAllowedAdmins(): string[] {
  const raw = (process.env.ADMIN_EMAILS || 'ybeltalsemagn8899@gmail.com')
    .replace(/['"]/g, '')
    .trim();

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET() {
  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    const cookieStore = await cookies();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Read-only session verification
        },
      },
    });

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.email) {
      return NextResponse.json(
        { isAdmin: false, email: null },
        { status: 401 }
      );
    }

    const userEmail = data.user.email.trim().toLowerCase();
    const isAdmin = getAllowedAdmins().includes(userEmail);

    return NextResponse.json(
      { isAdmin, email: userEmail },
      { status: isAdmin ? 200 : 403 }
    );
  } catch (err) {
    console.error('Unhandled /api/admin/session error:', err);
    return NextResponse.json(
      { isAdmin: false, email: null, error: 'Session verification failed' },
      { status: 500 }
    );
  }
}