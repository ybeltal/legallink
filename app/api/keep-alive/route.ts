import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
    const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
      .replace(/['"]/g, '')
      .trim();

    if (!supabaseAnonKey) {
      return NextResponse.json(
        { ok: false, error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.auth.getSession();

    return NextResponse.json({
      ok: !error,
      project: 'legallink',
      supabaseId: 'rkvqnywbsnxzjtwkgbny',
      pingedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}