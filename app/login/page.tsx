'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, User, Scale } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy to sign in.');
      return;
    }

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please provide both your credential and password.');
      return;
    }

    setIsLoading(true);

    try {
      setTimeout(() => {
        setIsLoading(false);
        if (role === 'advocate') {
          // Store advocate session identity for the Advocate Workspace
          const trimmedId = identifier.trim().toUpperCase();
          if (trimmedId.includes('BAR') || trimmedId.includes('ETH')) {
            sessionStorage.setItem('ll_active_advocate_id', trimmedId);
          } else {
            sessionStorage.setItem('ll_active_advocate_id', 'ETH-BAR-2015-0081');
          }
          router.push('/advocate/portal');
        } else {
          router.push('/find-a-lawyer');
        }
      }, 700);
    } catch {
      setIsLoading(false);
      setErrorMessage('Authentication failed. Please verify your credentials and try again.');
    }
  };

  const handleGoogleSignIn = () => {
    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy before continuing with Google.');
      return;
    }
    // Route advocate Google logins to advocate portal
    if (role === 'advocate') {
      sessionStorage.setItem('ll_active_advocate_id', 'ETH-BAR-2015-0081');
      window.location.href = `/api/auth/google?role=advocate&redirect=/advocate/portal`;
    } else {
      window.location.href = `/api/auth/google?role=client&redirect=/find-a-lawyer`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-10 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Navigation Row */}
      <div className="max-w-md w-full flex items-center justify-between mb-5 px-1">
        <Link 
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to LegalLink</span>
        </Link>

        <Link href="/" className="flex items-center gap-1.5 group">
          <img src="/logo.png" alt="LegalLink Logo" className="w-6 h-6 object-contain" />
          <span className="font-black text-base text-[#0A1128] tracking-tight">
            Legal<span className="text-amber-500">Link</span>
          </span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-9 shadow-xs space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
            Sign In
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto font-normal leading-relaxed">
            Access your consultation briefs, documents, and Telebirr escrow records.
          </p>
        </div>

        {/* Portal Workspace Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200/50">
          <button
            type="button"
            onClick={() => {
              setRole('client');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'client'
                ? 'bg-white text-[#0A1128] shadow-xs'
                : 'hover:text-[#0A1128]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Client Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('advocate');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              role === 'advocate'
                ? 'bg-white text-[#0A1128] shadow-xs'
                : 'hover:text-[#0A1128]'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Advocate Workspace</span>
          </button>
        </div>

        {/* Google OAuth Provider */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google as {role === 'client' ? 'Client' : 'Advocate'}</span>
        </button>

        {/* Visual Credential Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
            Or with credentials
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              {role === 'advocate' ? 'Bar License Number or Email' : 'Email or Telebirr Phone Number'}
            </label>
            <input
              type="text"
              required
              placeholder={role === 'advocate' ? 'ETH-BAR-2015-0081 or advocate@chambers.et' : '0911 000 000 or name@example.com'}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1128] focus:ring-1 focus:ring-[#0A1128] transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Password
              </label>
              <Link 
                href="/forgot-password"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full p-3 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1128] focus:ring-1 focus:ring-[#0A1128] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mandatory Terms & Policy Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0A1128] focus:ring-[#0A1128] accent-[#0A1128] cursor-pointer shrink-0"
              />
              <span className="text-[11px] text-slate-600 leading-snug font-normal">
                I agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0A1128] hover:text-amber-600 underline underline-offset-2 transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0A1128] hover:text-amber-600 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span>
              {isLoading 
                ? 'Signing In...' 
                : role === 'advocate' 
                ? 'Sign In to Advocate Workspace' 
                : 'Sign In to Client Portal'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Account Creation Section */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-3">
          <span className="text-xs text-slate-400 block font-normal">
            First time using LegalLink?
          </span>

          <Link
            href="/signup"
            className="w-full py-3 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs"
          >
            <span>Create an Account</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
          </Link>
        </div>

      </div>

      {/* Trust Compliance Notice */}
      <div className="flex items-center justify-center gap-2 mt-6 text-[11px] font-medium text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Compliant with Ethiopian Commercial Code & Telebirr USSD Escrow</span>
      </div>

    </div>
  );
}