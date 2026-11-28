'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  BookOpen,
  Scale,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialRoleParam = searchParams?.get('role');
  const [step, setStep] = useState<'select-role' | 'form'>(
    initialRoleParam === 'client' || initialRoleParam === 'advocate' ? 'form' : 'select-role'
  );
  const [role, setRole] = useState<'client' | 'advocate'>(
    initialRoleParam === 'advocate' ? 'advocate' : 'client'
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [clientLegalNeed, setClientLegalNeed] = useState(
    'Consult a Verified Ethiopian Advocate'
  );
  const [clientLocation, setClientLocation] = useState('Addis Ababa');

  const [barLicenseNo, setBarLicenseNo] = useState('');
  const [courtTier, setCourtTier] = useState('Federal High Court');
  const [practiceArea, setPracticeArea] = useState('Commercial & Corporate Law');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null);

  const redirectParam = searchParams?.get('redirect');
  const loginHref = `/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

  const getDestination = (selectedRole: 'client' | 'advocate') => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return selectedRole === 'advocate' ? '/advocate/register' : '/dashboard';
  };

  const syncUiSession = (
    selectedRole: 'client' | 'advocate',
    userEmail: string,
    fullName: string
  ) => {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `legallink_auth=authenticated; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_role=${selectedRole}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_user_name=${encodeURIComponent(fullName)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_user_email=${encodeURIComponent(userEmail)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_welcome=true; path=/; max-age=300; SameSite=Lax`;

    try {
      localStorage.setItem(
        'legallink_user',
        JSON.stringify({
          role: selectedRole,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: userEmail,
          phone: phone.trim(),
          authenticatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const handleSelectRolePanel = (chosenRole: 'client' | 'advocate') => {
    setRole(chosenRole);
    setErrorMsg(null);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignUp = () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    const destination = getDestination(role);
    window.location.href = `/api/auth/google?role=${role}&redirect=${encodeURIComponent(destination)}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const fullName = `${trimmedFirst} ${trimmedLast}`.trim();

    if (!trimmedFirst || !trimmedLast) {
      setErrorMsg('Please enter your first and last name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (role === 'advocate' && !barLicenseNo.trim()) {
      setErrorMsg('Please enter your Ministry of Justice or Regional Bar License Number.');
      return;
    }
    if (!agreedToTerms) {
      setErrorMsg('Please agree to the LegalLink Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const destination = getDestination(role);
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}&redirect=${encodeURIComponent(destination)}`,
          data: {
            role,
            first_name: trimmedFirst,
            last_name: trimmedLast,
            full_name: fullName,
            phone: phone.trim(),
            location: clientLocation,
            legal_need: role === 'client' ? clientLegalNeed : practiceArea,
            bar_license_no: role === 'advocate' ? barLicenseNo.trim().toUpperCase() : undefined,
            court_tier: role === 'advocate' ? courtTier : undefined,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || 'Could not create your account. Please try again.');
        setLoading(false);
        return;
      }

      await Promise.allSettled([
        fetch('/api/track-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            email: trimmedEmail,
            fullName,
            role,
            phone: phone.trim(),
            location: role === 'client' ? clientLocation : 'Ethiopia',
            legalNeed: role === 'client' ? clientLegalNeed : `${practiceArea} (${barLicenseNo.trim()})`,
            provider: 'email',
            eventType: 'signup',
          }),
        }),
        fetch('/api/welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            email: trimmedEmail,
            fullName,
            role,
          }),
        }),
      ]);

      if (data?.session) {
        syncUiSession(role, trimmedEmail, fullName);
        window.location.href = destination;
        return;
      }

      setConfirmationEmail(trimmedEmail);
      setLoading(false);
    } catch {
      setErrorMsg('Network error while creating your account. Please check your connection.');
      setLoading(false);
    }
  };

  if (step === 'select-role') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7FB] font-sans selection:bg-[#3B66B8] selection:text-white">
        <header className="w-full px-5 sm:px-10 py-4 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F7FB] hover:bg-[#EEF3FB] text-[#182235] text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#3B66B8]" />
              <span>Back</span>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#182235]">
                Legal<span className="text-[#3B66B8]">Link</span>
              </span>
            </Link>
          </div>

          <div className="text-xs font-semibold text-slate-600">
            <span className="hidden sm:inline">Already have an account? </span>
            <Link
              href={loginHref}
              className="text-[#3B66B8] font-bold hover:text-[#2E55A5] underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* Left Panel: Client (Cloud Alabaster & Soft Sky) */}
          <section
            onClick={() => handleSelectRolePanel('client')}
            className="relative overflow-hidden bg-gradient-to-br from-[#F5F7FB] via-white to-[#EEF3FB] hover:to-[#E1ECFC] text-[#182235] px-8 py-14 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group border-b md:border-b-0 md:border-r border-slate-200"
          >
            <div className="ll-window-rise max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[#3B66B8] text-[10px] font-mono uppercase tracking-widest font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B66B8]" />
                <span>Client &amp; Public Access • የደንበኞች መግቢያ</span>
              </div>

              <div className="flex justify-center">
                <svg
                  className="w-24 h-24 animate-float-slow group-hover:scale-105 transition-transform"
                  viewBox="0 0 120 120"
                  fill="none"
                >
                  <path
                    d="M60 12L95 26V58C95 82 80 102 60 108C40 102 25 82 25 58V26L60 12Z"
                    fill="#EEF3FB"
                    stroke="#3B66B8"
                    strokeWidth="2.5"
                  />
                  <circle cx="60" cy="46" r="14" fill="#182235" />
                  <path d="M40 78C40 68 49 64 60 64C71 64 80 68 80 78V84H40V78Z" fill="#182235" />
                  <circle cx="78" cy="74" r="10" fill="#10B981" />
                  <path
                    d="M74 74L77 77L83 71"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#182235] leading-tight">
                  I’m seeking legal solutions
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Connect directly with MOJ-verified Ethiopian advocates, draft bilingual Amharic &amp; English legal forms, and explore federal proclamations — completely free.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <FileText className="w-3 h-3 text-[#3B66B8]" />
                  LexDraft Forms (አማ / EN)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  Proclamations &amp; LegalTalk
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#182235]" />
                  Verified Advocates
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRolePanel('client');
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#182235] group-hover:bg-[#3B66B8] text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continue as Client (Free)</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </section>

          {/* Right Panel: Advocate (Sunlit Sky Azure Gradient with Drifting Clouds) */}
          <section
            onClick={() => handleSelectRolePanel('advocate')}
            className="relative overflow-hidden bg-gradient-to-br from-[#2E55A5] via-[#3B66B8] to-[#6B99DF] text-white px-8 py-14 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <div
              aria-hidden="true"
              className="ll-cloud-left pointer-events-none absolute top-12 -left-16 w-80 h-44 rounded-full bg-white/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="ll-cloud-right pointer-events-none absolute bottom-10 -right-16 w-96 h-48 rounded-full bg-white/20 blur-3xl"
            />

            <div className="ll-window-rise max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/35 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest font-bold">
                <Scale className="w-3.5 h-3.5 text-amber-300" />
                <span>Proclamation No. 1249/2021 • የጠበቆች መግቢያ</span>
              </div>

              <div className="flex justify-center">
                <svg
                  className="w-24 h-24 animate-float-slow group-hover:scale-105 transition-transform"
                  viewBox="0 0 120 120"
                  fill="none"
                >
                  <rect x="25" y="90" width="70" height="8" rx="2" fill="rgba(255,255,255,0.35)" />
                  <rect x="30" y="24" width="60" height="6" rx="2" fill="rgba(255,255,255,0.5)" />
                  <path d="M60 10L30 24H90L60 10Z" fill="#FCD34D" />
                  <path d="M60 28V84" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <path d="M38 42H82" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M38 42L30 58M38 42L46 58" stroke="#FCD34D" strokeWidth="1.8" />
                  <path d="M26 58H50C50 64 26 64 26 58Z" fill="#FCD34D" />
                  <path d="M82 42L74 58M82 42L90 58" stroke="#FCD34D" strokeWidth="1.8" />
                  <path d="M70 58H94C94 64 70 64 70 58Z" fill="#FCD34D" />
                  <circle cx="60" cy="56" r="7" fill="#34D399" />
                </svg>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  I’m an advocate or legal professional
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Verify your Federal or Regional Bar credentials, receive direct client inquiries in your portal, and mentor NextGen law interns — zero listing fees.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-xs">
                  <Scale className="w-3 h-3 text-amber-300" />
                  Verified Advocate Profile
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-xs">
                  <Users className="w-3 h-3 text-emerald-300" />
                  NextGen Mentorship
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRolePanel('advocate');
                  }}
                  className="px-8 py-3.5 rounded-full bg-white group-hover:bg-slate-100 text-[#182235] font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Join as Advocate (Free)</span>
                  <ArrowRight className="w-4 h-4 text-[#3B66B8]" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-between text-[#182235] font-sans">
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setStep('select-role')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F7FB] hover:bg-[#EEF3FB] text-[#182235] text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#3B66B8]" />
              <span>Back</span>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#182235]">
                Legal<span className="text-[#3B66B8]">Link</span>
              </span>
            </Link>
          </div>

          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <span className="hidden sm:inline">
              {role === 'client' ? 'Are you a licensed advocate?' : 'Looking for legal help?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setRole(role === 'client' ? 'advocate' : 'client');
                setErrorMsg(null);
              }}
              className="text-[#3B66B8] font-bold hover:text-[#2E55A5] underline underline-offset-4 cursor-pointer"
            >
              {role === 'client' ? 'Switch to Advocate' : 'Switch to Client'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-10 flex-1 w-full flex flex-col justify-center">
        <div className="ll-window-rise bg-white rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-sm space-y-6">
          {confirmationEmail ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-7 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h1 className="text-xl font-black text-emerald-950">Check Your Email Inbox</h1>
              <p className="text-xs text-emerald-900 leading-relaxed">
                We sent a verification link to <strong>{confirmationEmail}</strong>. Click the link in your email to activate your LegalLink {role === 'advocate' ? 'Advocate' : 'Client'} account and sign in.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Link
                  href="/login"
                  className="px-6 py-3 bg-[#182235] text-white font-bold text-xs rounded-full hover:bg-[#24324d]"
                >
                  Go to Login
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-full hover:bg-slate-50"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1.5">
                <span className="inline-block text-[10px] font-mono uppercase tracking-widest font-bold px-3.5 py-1 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5]">
                  {role === 'client'
                    ? 'Free Client Account • LexDraft, Library & Advocates'
                    : 'Free Advocate Account • Proclamation No. 1249/2021'}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-[#182235] tracking-tight pt-1">
                  {role === 'client'
                    ? 'Create your LegalLink account'
                    : 'Create your Advocate account'}
                </h1>
                <p className="text-xs text-slate-600">
                  {role === 'client'
                    ? 'Access bilingual legal templates, Ethiopian proclamations, and MOJ-verified advocates for free.'
                    : 'Create your login first, then complete your Ministry of Justice chamber profile to receive direct client inquiries.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading || loading}
                className="w-full py-3 px-4 bg-[#3B66B8] hover:bg-[#2F56A6] text-white rounded-full text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </span>
                <span>
                  {googleLoading
                    ? 'Connecting with Google...'
                    : `Continue with Google (${role === 'client' ? 'Client' : 'Advocate'})`}
                </span>
              </button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400">or</span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#182235]">First name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g., Abebe"
                      className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#182235]">Last name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g., Kebede"
                      className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#182235]">
                      {role === 'client' ? 'Email address *' : 'Chamber email address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#182235]">
                      {role === 'client' ? 'Phone (Optional)' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required={role === 'advocate'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 911 000 000"
                      className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                    />
                  </div>
                </div>

                {role === 'client' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#182235]">
                        What brings you to LegalLink?
                      </label>
                      <select
                        value={clientLegalNeed}
                        onChange={(e) => setClientLegalNeed(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Consult a Verified Ethiopian Advocate">
                          Consult a Verified Ethiopian Advocate
                        </option>
                        <option value="Draft Amharic & English Legal Forms (LexDraft)">
                          Draft Legal Forms (LexDraft)
                        </option>
                        <option value="Explore Ethiopian Proclamations & LegalTalk">
                          Explore Proclamations &amp; LegalTalk
                        </option>
                        <option value="Business & PLC Incorporation">
                          Business &amp; PLC Formation
                        </option>
                        <option value="Diaspora Power of Attorney & Services">
                          Diaspora Legal Support
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#182235]">Location / Region</label>
                      <select
                        value={clientLocation}
                        onChange={(e) => setClientLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Addis Ababa">Addis Ababa</option>
                        <option value="Adama / Oromia">Adama / Oromia</option>
                        <option value="Bahir Dar / Amhara">Bahir Dar / Amhara</option>
                        <option value="Hawassa / Sidama">Hawassa / Sidama</option>
                        <option value="Mekelle / Tigray">Mekelle / Tigray</option>
                        <option value="Dire Dawa">Dire Dawa</option>
                        <option value="Ethiopian Diaspora (International)">
                          Ethiopian Diaspora (International)
                        </option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#182235]">
                        MOJ / Bar License Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={barLicenseNo}
                        onChange={(e) => setBarLicenseNo(e.target.value)}
                        placeholder="e.g., MOJ/FED/1842/2021"
                        className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#182235]">
                        Court Admission Tier
                      </label>
                      <select
                        value={courtTier}
                        onChange={(e) => setCourtTier(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Federal Supreme & Cassation Court">
                          Federal Supreme &amp; Cassation Court
                        </option>
                        <option value="Federal High Court">Federal High Court</option>
                        <option value="Federal First Instance Court">
                          Federal First Instance Court
                        </option>
                        <option value="Regional Supreme / High Court">
                          Regional Supreme / High Court
                        </option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-xs font-bold text-[#182235]">
                        Primary Practice Specialization
                      </label>
                      <select
                        value={practiceArea}
                        onChange={(e) => setPracticeArea(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Commercial & Corporate Law">Commercial &amp; Corporate Law</option>
                        <option value="Civil, Appellate & Cassation Litigation">
                          Civil, Appellate &amp; Cassation Litigation
                        </option>
                        <option value="Real Estate, Land & Construction Law">
                          Real Estate, Land &amp; Construction Law
                        </option>
                        <option value="Tax, Customs & Investment Law">
                          Tax, Customs &amp; Investment Law
                        </option>
                        <option value="Labor, Family & Administrative Law">
                          Labor, Family &amp; Administrative Law
                        </option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#182235]">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (8 or more characters)"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#182235] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#3B66B8] cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="font-bold text-[#182235] underline hover:text-[#3B66B8]"
                      >
                        LegalLink Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="font-bold text-[#182235] underline hover:text-[#3B66B8]"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex flex-col items-center space-y-4">
                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-3.5 bg-[#182235] hover:bg-[#24324d] text-white font-bold rounded-full text-xs inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {loading
                        ? 'Creating Account...'
                        : role === 'client'
                        ? 'Create Free Account'
                        : 'Create Advocate Account & Continue'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <p className="text-xs text-slate-600">
                    Already have an account?{' '}
                    <Link
                      href={loginHref}
                      className="text-[#3B66B8] font-bold underline underline-offset-4 hover:text-[#2E55A5]"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="w-full py-5 text-center text-[11px] text-slate-500 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3B66B8] shrink-0" />
            <span>Free Public Access • MOJ-Verified Ethiopian Advocate Directory</span>
          </div>
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com</p>
        </div>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center text-xs font-bold text-slate-500">
          Loading LegalLink...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}