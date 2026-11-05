'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ShieldCheck, Check, AlertCircle 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setErrorMsg(null);
    if (!agreedToTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    try {
      setGoogleLoading(true);
      // Determine final landing page after successful auth
      const finalDestination = role === 'advocate' ? '/advocate/portal' : '/find-a-lawyer';
      
      // Route through /auth/callback to establish session correctly
      const redirectTo = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(finalDestination)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleProceed = () => {
    setErrorMsg(null);
    if (!agreedToTerms) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    if (role === 'advocate') {
      router.push('/advocate/register');
    } else {
      router.push('/find-a-lawyer');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
          <span className="font-black text-xl tracking-tight text-[#0A1128]">
            Legal<span className="text-amber-500">Link</span>
          </span>
        </Link>

        {/* Top-Right Toggle to Log In */}
        <div className="text-xs font-semibold text-slate-600">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Main Dual-Folder Selection */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col justify-center space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Join as a client or advocate
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Select your account type to access verified legal counsel or manage your chambers.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TWO FOLDER CARDS ONLY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          
          {/* CLIENT FOLDER */}
          <div
            onClick={() => {
              setRole('client');
              setErrorMsg(null);
            }}
            className={`p-7 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 relative group ${
              role === 'client'
                ? 'bg-white border-[#0A1128] ring-2 ring-[#0A1128]/15 shadow-xl'
                : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                CLIENT PORTAL
              </span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                role === 'client' ? 'border-[#0A1128] bg-[#0A1128] text-white' : 'border-slate-300 bg-white'
              }`}>
                {role === 'client' && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="py-2 flex justify-center">
              <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 12L95 26V58C95 82 80 102 60 108C40 102 25 82 25 58V26L60 12Z" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" />
                <circle cx="60" cy="46" r="14" fill="#0A1128" />
                <path d="M40 78C40 68 49 64 60 64C71 64 80 68 80 78V84H40V78Z" fill="#0A1128" />
                <circle cx="78" cy="74" r="10" fill="#10B981" />
                <path d="M74 74L77 77L83 71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-[#0A1128]">
                I’m a client, seeking legal counsel
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Find and book verified advocates, draft bilingual contracts, and protect retainers in Telebirr escrow.
              </p>
            </div>

            <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
              role === 'client' ? 'bg-[#0A1128] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              {role === 'client' ? 'Selected • Client Account' : 'Select Client'}
            </div>
          </div>

          {/* ADVOCATE FOLDER */}
          <div
            onClick={() => {
              setRole('advocate');
              setErrorMsg(null);
            }}
            className={`p-7 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 relative group ${
              role === 'advocate'
                ? 'bg-white border-[#0A1128] ring-2 ring-[#0A1128]/15 shadow-xl'
                : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                PROCLAMATION NO. 1249/2021
              </span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                role === 'advocate' ? 'border-[#0A1128] bg-[#0A1128] text-white' : 'border-slate-300 bg-white'
              }`}>
                {role === 'advocate' && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="py-2 flex justify-center">
              <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="25" y="90" width="70" height="8" rx="2" fill="#E2E8F0" />
                <rect x="30" y="24" width="60" height="6" rx="2" fill="#E2E8F0" />
                <path d="M60 10L30 24H90L60 10Z" fill="#CBD5E1" />
                <path d="M60 28V84" stroke="#0A1128" strokeWidth="3" strokeLinecap="round" />
                <path d="M38 42H82" stroke="#0A1128" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M38 42L30 58M38 42L46 58" stroke="#D97706" strokeWidth="1.5" />
                <path d="M26 58H50C50 64 26 64 26 58Z" fill="#D97706" />
                <path d="M82 42L74 58M82 42L90 58" stroke="#D97706" strokeWidth="1.5" />
                <path d="M70 58H94C94 64 70 64 70 58Z" fill="#D97706" />
                <circle cx="60" cy="56" r="7" fill="#F59E0B" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-[#0A1128]">
                I’m an advocate, offering legal counsel
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Verify Federal Bar credentials under Proclamation No. 1249/2021, manage retainers, and mentor interns.
              </p>
            </div>

            <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
              role === 'advocate' ? 'bg-[#0A1128] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
            }`}>
              {role === 'advocate' ? 'Selected • Advocate Workspace' : 'Select Advocate'}
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="max-w-md mx-auto w-full space-y-3.5 pt-2">
          
          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleProceed}
            className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer text-xs"
          >
            <span>{role === 'client' ? 'Join as Client' : 'Register Chamber as Advocate'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2.5 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{googleLoading ? 'Connecting...' : `Sign Up with Google (${role === 'client' ? 'Client' : 'Advocate'})`}</span>
          </button>

          {/* Terms & Privacy Policy */}
          <div className="text-center pt-2">
            <label className="flex items-center justify-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-3.5 h-3.5 rounded border-slate-300 text-[#0A1128] accent-[#0A1128] cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 leading-snug">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="font-bold text-[#0A1128] underline hover:text-amber-600">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="font-bold text-[#0A1128] underline hover:text-amber-600">
                  Privacy Policy
                </Link>.
              </span>
            </label>
          </div>

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