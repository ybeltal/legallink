import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getAllowedAdmins(): string[] {
  const raw = process.env.ADMIN_EMAILS || 'ybeltalsemagn8899@gmail.com';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    .replace(/['"]/g, '')
    .trim();

  if (!supabaseAnonKey) {
    return NextResponse.json({ isAdmin: false, email: null }, { status: 500 });
  }

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
    return NextResponse.json({ isAdmin: false, email: null }, { status: 401 });
  }

  const userEmail = data.user.email.trim().toLowerCase();
  const isAdmin = getAllowedAdmins().includes(userEmail);

  return NextResponse.json(
    { isAdmin, email: userEmail },
    { status: isAdmin ? 200 : 403 }
  );
}