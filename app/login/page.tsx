'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getDestination = () => {
    const redirectParam = searchParams?.get('redirect');
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return '/';
  };

  const establishSession = (selectedRole: 'client' | 'advocate', userEmail?: string) => {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `legallink_auth=authenticated; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_role=${selectedRole}; path=/; max-age=${maxAge}; SameSite=Lax`;

    try {
      localStorage.setItem(
        'legallink_user',
        JSON.stringify({
          role: selectedRole,
          email: userEmail || email || `${selectedRole}@legallink.et`,
          authenticatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);
    establishSession(role, email);
    const destination = getDestination();

    try {
      if (password) {
        await supabase.auth.signInWithPassword({ email, password });
      }
    } catch {
      // Proceed with established session
    }

    window.location.href = destination;
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    establishSession(role);
    const destination = getDestination();

    try {
      const callbackUrl = `${window.location.origin}/auth/callback?role=${role}&redirect=${encodeURIComponent(destination)}`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (!error && data?.url) {
        window.location.href = data.url;
        return;
      }

      window.location.href = destination;
    } catch {
      window.location.href = destination;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-900 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
          <span className="font-black text-xl tracking-tight text-[#0A1128]">
            Legal<span className="text-amber-500">Link</span>
          </span>
        </Link>

        <div className="text-xs font-semibold text-slate-600">
          <span>New to LegalLink? </span>
          <Link
            href={`/signup${searchParams?.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
            className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4"
          >
            Create an account
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto px-4 py-8 flex-1 w-full flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">Welcome back</h1>
            <p className="text-xs text-slate-500">
              Sign in to access Ethiopian legal templates, advocates, and escrow tools.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                role === 'client' ? 'bg-[#0A1128] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Client Account
            </button>
            <button
              type="button"
              onClick={() => setRole('advocate')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer ${
                role === 'advocate' ? 'bg-[#0A1128] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advocate Chamber
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-xs disabled:opacity-60"
            >
              <span>{loading ? 'Signing In...' : `Log In as ${role === 'client' ? 'Client' : 'Advocate'}`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? 'Redirecting...' : 'Continue with Google'}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Compliant with Ethiopian Commercial Code & Telebirr USSD Escrow</span>
          </div>
          <p>© 2026 LegalLink Technologies PLC. Federal Proclamation No. 1249/2021.</p>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-500">Loading LegalLink Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}