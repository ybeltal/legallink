import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://rkvqnywbsnxzjtwkgbny.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnFueXdic254emp0d2tnYm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAyNjIsImV4cCI6MjEwNzgwNjI2Mn0.tIdqzeI77ErBFZYrYATO4-cDxO3VOJ4dSRuTM7FMOrg';

export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate that the URL starts with http/https before using it
  const url = envUrl && envUrl.startsWith('http') ? envUrl : FALLBACK_URL;
  const key = envKey && envKey.length > 20 ? envKey : FALLBACK_KEY;

  return createBrowserClient(url, key);
}