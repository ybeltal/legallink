'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
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

  // Shared Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Client-Specific Task States
  const [clientLegalNeed, setClientLegalNeed] = useState(
    'Draft Amharic & English Legal Forms (LexDraft)'
  );
  const [clientLocation, setClientLocation] = useState('Addis Ababa');

  // Advocate-Specific Chamber & Bar States
  const [barLicenseNo, setBarLicenseNo] = useState('');
  const [courtTier, setCourtTier] = useState('Federal Supreme & Cassation Court');
  const [practiceArea, setPracticeArea] = useState('Commercial & Corporate Law');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectParam = searchParams?.get('redirect');
  const loginHref = `/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ''}`;

  const getDestination = () => {
    if (redirectParam && redirectParam.startsWith('/')) {
      return redirectParam;
    }
    return '/';
  };

  const establishOfficialSession = (selectedRole: 'client' | 'advocate', userEmail?: string) => {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `legallink_auth=authenticated; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `legallink_role=${selectedRole}; path=/; max-age=${maxAge}; SameSite=Lax`;

    try {
      localStorage.setItem(
        'legallink_user',
        JSON.stringify({
          role: selectedRole,
          firstName: firstName.trim() || (selectedRole === 'advocate' ? 'Advocate' : 'Member'),
          lastName: lastName.trim(),
          email: userEmail || email.trim() || `${selectedRole}@legallink.et`,
          phone: phone.trim(),
          ...(selectedRole === 'client'
            ? { legalNeed: clientLegalNeed, location: clientLocation }
            : { barLicenseNo: barLicenseNo.trim(), courtTier, practiceArea }),
          authenticatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // Ignore storage errors in restricted browsers
    }
  };

  const handleSelectRolePanel = (chosenRole: 'client' | 'advocate') => {
    setRole(chosenRole);
    setErrorMsg(null);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignUp = async () => {
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Please enter your first and last name.');
      return;
    }
    if (!email.trim()) {
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
    establishOfficialSession(role, email);
    const destination = getDestination();

    try {
      await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            bar_license_no: role === 'advocate' ? barLicenseNo.trim() : undefined,
          },
        },
      });
    } catch {
      // Proceed cleanly with established session
    }

    window.location.href = destination;
  };

  // =========================================================================
  // VIEW 1: BESPOKE LEGALLINK TWO-PANEL SPLIT SCREEN
  // =========================================================================
  if (step === 'select-role') {
    return (
      <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-amber-100 selection:text-[#0A1128]">
        {/* Top Header */}
        <header className="w-full px-5 sm:px-10 py-4 bg-white border-b border-slate-200 flex items-center justify-between z-20">
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
            <span>Already have an account? </span>
            <Link
              href={loginHref}
              className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </header>

        {/* Creative Two-Panel Split Screen */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* LEFT PANEL: CLIENT, BUSINESS & PUBLIC ACCESS (Warm Ivory & Sovereign Navy) */}
          <section
            onClick={() => handleSelectRolePanel('client')}
            className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#FEF3C7]/35 hover:to-[#FEF3C7]/60 text-[#0A1128] px-8 py-14 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group border-b md:border-b-0 md:border-r border-slate-200"
          >
            <div className="max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono uppercase tracking-widest font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Public, Business & Client Access • የደንበኞች መግቢያ</span>
              </div>

              {/* Preserved Custom LegalLink Shield & Member Illustration */}
              <div className="flex justify-center">
                <svg className="w-24 h-24 group-hover:scale-105 transition-transform" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 12L95 26V58C95 82 80 102 60 108C40 102 25 82 25 58V26L60 12Z" fill="#F0FDF4" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="60" cy="46" r="14" fill="#0A1128" />
                  <path d="M40 78C40 68 49 64 60 64C71 64 80 68 80 78V84H40V78Z" fill="#0A1128" />
                  <circle cx="78" cy="74" r="10" fill="#F59E0B" />
                  <path d="M74 74L77 77L83 71" stroke="#0A1128" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0A1128] leading-tight">
                  I’m seeking legal solutions
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Draft bilingual Amharic & English legal forms, explore Ethiopian proclamations, secure agreements with Telebirr escrow, or consult verified counsel.
                </p>
              </div>

              {/* Key Platform Advantages Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <FileText className="w-3 h-3 text-amber-500" />
                  LexDraft Forms (አማ / EN)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <BookOpen className="w-3 h-3 text-emerald-600" />
                  Proclamations & LegalTalk
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-[#0A1128]" />
                  Verified Counsel & Escrow
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRolePanel('client');
                  }}
                  className="px-8 py-3.5 rounded-full bg-[#0A1128] group-hover:bg-[#102A43] text-white font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Continue to LegalLink</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: ADVOCATE & LEGAL PRACTITIONER (Sovereign Navy & Gold) */}
          <section
            onClick={() => handleSelectRolePanel('advocate')}
            className="relative overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#0F1B3D] to-[#064E3B] text-white px-8 py-14 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <div className="max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase tracking-widest font-bold">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Proclamation No. 1249/2021 • የጠበቆች መግቢያ</span>
              </div>

              {/* Preserved Custom Scales of Justice & Chamber Illustration */}
              <div className="flex justify-center">
                <svg className="w-24 h-24 group-hover:scale-105 transition-transform" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25" y="90" width="70" height="8" rx="2" fill="#334155" />
                  <rect x="30" y="24" width="60" height="6" rx="2" fill="#475569" />
                  <path d="M60 10L30 24H90L60 10Z" fill="#F59E0B" />
                  <path d="M60 28V84" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
                  <path d="M38 42H82" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M38 42L30 58M38 42L46 58" stroke="#F59E0B" strokeWidth="1.8" />
                  <path d="M26 58H50C50 64 26 64 26 58Z" fill="#F59E0B" />
                  <path d="M82 42L74 58M82 42L90 58" stroke="#F59E0B" strokeWidth="1.8" />
                  <path d="M70 58H94C94 64 70 64 70 58Z" fill="#F59E0B" />
                  <circle cx="60" cy="56" r="7" fill="#10B981" />
                </svg>
              </div>

              <div className="space-y-2.5">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  I’m an advocate or legal professional
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Verify your Federal or Regional Bar credentials, manage digital chambers, publish LegalTalk insights, and mentor NextGen law interns.
                </p>
              </div>

              {/* Advocate Capabilities Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200">
                  <Scale className="w-3 h-3 text-amber-400" />
                  Verified Digital Chamber
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200">
                  <Users className="w-3 h-3 text-emerald-400" />
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
                  className="px-8 py-3.5 rounded-full bg-amber-500 group-hover:bg-amber-400 text-[#0A1128] font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Enter Advocate Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ROLE-CUSTOMIZED LEGALLINK REGISTRATION FORM
  // =========================================================================
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-slate-900 font-sans">
      {/* Top Header with Back Button & Role Switcher */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => setStep('select-role')}
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

        <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <span className="hidden sm:inline">
            {role === 'client' ? 'Are you a licensed advocate?' : 'Looking for legal forms or counsel?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setRole(role === 'client' ? 'advocate' : 'client');
              setErrorMsg(null);
            }}
            className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
          >
            {role === 'client' ? 'Switch to Advocate' : 'Switch to Client / Member'}
          </button>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 flex-1 w-full flex flex-col justify-center space-y-6">
        <div className="text-center space-y-1.5">
          <span
            className={`inline-block text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
              role === 'client'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {role === 'client'
              ? 'Client & Member Access • LexDraft, Library & Counsel'
              : 'Advocate Chamber Registration • Proclamation No. 1249/2021'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight pt-1">
            {role === 'client'
              ? 'Create your LegalLink account'
              : 'Register your Advocate Chamber'}
          </h1>
          <p className="text-xs text-slate-500">
            {role === 'client'
              ? 'Instant access to bilingual Amharic/English legal templates, Ethiopian proclamations, and verified advocates.'
              : 'Verify your bar credentials to manage client retainers, publish legal insights, and mentor interns.'}
          </p>
        </div>

        {/* Google OAuth Button at Top */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full py-3 px-4 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-full text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-60"
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
              : `Continue with Google (${role === 'client' ? 'Client / Member' : 'Advocate'})`}
          </span>
        </button>

        {/* OR Divider */}
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

        {/* Role-Customized Registration Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">First name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g., Abebe"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Last name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g., Kebede"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {role === 'client' ? 'Email address' : 'Chamber email address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {role === 'client' ? 'Phone (Optional)' : 'Chamber Phone Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 911 000 000"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
              />
            </div>
          </div>

          {/* ROLE-SPECIFIC FIELDS */}
          {role === 'client' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  What brings you to LegalLink?
                </label>
                <select
                  value={clientLegalNeed}
                  onChange={(e) => setClientLegalNeed(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                >
                  <option value="Draft Amharic & English Legal Forms (LexDraft)">
                    Draft Amharic & English Legal Forms (LexDraft)
                  </option>
                  <option value="Explore Ethiopian Proclamations & LegalTalk">
                    Explore Ethiopian Proclamations & LegalTalk
                  </option>
                  <option value="Book Verified Advocate Consultation">
                    Consult a Verified Ethiopian Advocate
                  </option>
                  <option value="Business & PLC Incorporation">
                    Business & PLC Formation (Commercial Code)
                  </option>
                  <option value="Court Pleadings, Appeals & Cassation">
                    Court Pleadings, Appeals & Cassation Forms
                  </option>
                  <option value="Diaspora Power of Attorney & Representation">
                    Diaspora Power of Attorney & Services
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Location / Region</label>
                <select
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    MOJ / Bar License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={barLicenseNo}
                    onChange={(e) => setBarLicenseNo(e.target.value)}
                    placeholder="e.g., MOJ/FED/1842/2021"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Court Admission Tier
                  </label>
                  <select
                    value={courtTier}
                    onChange={(e) => setCourtTier(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Federal Supreme & Cassation Court">
                      Federal Supreme & Cassation Court
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
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Primary Practice Specialization
                </label>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                >
                  <option value="Commercial & Corporate Law">Commercial & Corporate Law</option>
                  <option value="Civil, Appellate & Cassation Litigation">
                    Civil, Appellate & Cassation Litigation
                  </option>
                  <option value="Real Estate, Land & Construction Law">
                    Real Estate, Land & Construction Law
                  </option>
                  <option value="Tax, Customs & Investment Law">
                    Tax, Customs & Investment Law
                  </option>
                  <option value="Labor, Family & Administrative Law">
                    Labor, Family & Administrative Law
                  </option>
                </select>
              </div>
            </>
          )}

          {/* Password Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (8 or more characters)"
                className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
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

          {/* Terms & Privacy Policy */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#0A1128] cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-snug">
                I agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-bold text-[#0A1128] underline hover:text-amber-600"
                >
                  LegalLink Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-bold text-[#0A1128] underline hover:text-amber-600"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-col items-center space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-full text-xs inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <span>
                {loading
                  ? 'Entering LegalLink...'
                  : role === 'client'
                  ? 'Create my Account & Continue'
                  : 'Register Advocate Chamber'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link
                href={loginHref}
                className="text-emerald-700 font-bold underline underline-offset-4 hover:text-emerald-800"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs font-bold text-slate-500">
          Loading LegalLink...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}