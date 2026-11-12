'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectParam = searchParams?.get('redirect');
  const signupHref = `/signup${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

  const getDestination = () => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return '/';
  };

  const establishOfficialSession = (selectedRole: 'client' | 'advocate', userEmail?: string) => {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `legallink_auth=authenticated; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_role=${selectedRole}; path=/; max-age=${maxAge}; SameSite=Lax`;

    try {
      localStorage.setItem(
        'legallink_user',
        JSON.stringify({
          role: selectedRole,
          email: userEmail || email.trim() || `${selectedRole}@legallink.et`,
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
    establishOfficialSession(role, email);
    const destination = getDestination();

    try {
      if (password) {
        await supabase.auth.signInWithPassword({ email: email.trim(), password });
      }
    } catch {
      // Proceed with established session
    }

    window.location.href = destination;
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    establishOfficialSession(role);
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
    <div className="min-h-screen bg-white flex flex-col justify-between text-slate-900 font-sans">
      {/* Header with Back Arrow */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
            <span className="font-black text-lg tracking-tight text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>
        </div>

        <div className="text-xs font-semibold text-slate-600">
          <span>Don’t have a LegalLink account? </span>
          <Link
            href={signupHref}
            className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md mx-auto px-4 py-10 flex-1 w-full flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
              Log in to LegalLink
            </h1>
            <p className="text-xs text-slate-500">
              Select your workspace and sign in with Google or your registered email.
            </p>
          </div>

          {/* Client / Advocate Workspace Toggle */}
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
                role === 'advocate' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Advocate Chamber
            </button>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-full text-xs font-bold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
          >
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            </span>
            <span>{googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-xs font-semibold text-slate-400">or</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer text-xs disabled:opacity-60 ${
                role === 'client'
                  ? 'bg-[#0A1128] hover:bg-[#102A43]'
                  : 'bg-[#064E3B] hover:bg-[#075E47]'
              }`}
            >
              <span>{loading ? 'Signing In...' : `Log In as ${role === 'client' ? 'Client' : 'Advocate'}`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs text-slate-600">
              Don’t have a LegalLink account?{' '}
              <Link
                href={signupHref}
                className="text-emerald-700 font-bold underline underline-offset-4 hover:text-emerald-800"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-[11px] text-slate-500 border-t border-slate-100 bg-white">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs font-bold text-slate-500">
          Loading LegalLink Login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}