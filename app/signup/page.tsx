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
  Scale,
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
  const [clientLegalNeed, setClientLegalNeed] = useState('Contract & Legal Form Drafting (LexDraft)');
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
          firstName: firstName.trim() || (selectedRole === 'advocate' ? 'Advocate' : 'Client'),
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
      // Ignore storage errors in restricted environments
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
  // VIEW 1: UNIQUE LEGALLINK TWO-PANEL SPLIT SCREEN (ONLY TWO CHOICES VISIBLE)
  // =========================================================================
  if (step === 'select-role') {
    return (
      <div className="min-h-screen flex flex-col bg-[#0A1128] font-sans selection:bg-amber-400 selection:text-[#0A1128]">
        {/* Top Floating Bar */}
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

        {/* Full-Height Split Screen: Left = Client (Deep Sovereign Navy) | Right = Advocate (Ethiopian Emerald) */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* LEFT PANEL: CLIENT */}
          <section
            onClick={() => handleSelectRolePanel('client')}
            className="relative overflow-hidden bg-[#0A1128] hover:bg-[#0E1838] text-white px-8 py-16 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group border-b md:border-b-0 md:border-r border-white/10"
          >
            {/* Subtle Architectural Justice Watermark */}
            <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-amber-500/5 blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />

            <div className="max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-[11px] font-mono uppercase tracking-widest font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Portal • Telebirr Escrow</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                I’m a client
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Consult MOJ-licensed Ethiopian advocates, generate court-ready legal forms, and protect retainers in escrow.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRolePanel('client');
                  }}
                  className="px-8 py-3.5 rounded-full bg-amber-500 group-hover:bg-amber-400 text-[#0A1128] font-black text-sm inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Hire an Advocate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: ADVOCATE */}
          <section
            onClick={() => handleSelectRolePanel('advocate')}
            className="relative overflow-hidden bg-[#064E3B] hover:bg-[#075E47] text-white px-8 py-16 sm:px-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            {/* Subtle Sovereign Emerald Watermark */}
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none group-hover:bg-emerald-300/15 transition-all" />

            <div className="max-w-md space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-[11px] font-mono uppercase tracking-widest font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>Proclamation No. 1249/2021</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                I’m an advocate
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                Verify your Federal or Regional Bar credentials, manage digital chambers, and receive secured client retainers.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRolePanel('advocate');
                  }}
                  className="px-8 py-3.5 rounded-full bg-white group-hover:bg-emerald-50 text-[#064E3B] font-black text-sm inline-flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <span>Offer Legal Counsel</span>
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
  // VIEW 2: ROLE-CUSTOMIZED REGISTRATION FORM (CLIENT OR ADVOCATE)
  // =========================================================================
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-slate-900 font-sans">
      {/* Clean Top Header with Back Button & Role Switcher */}
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
            {role === 'client' ? 'Are you a licensed lawyer?' : 'Seeking legal representation?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setRole(role === 'client' ? 'advocate' : 'client');
              setErrorMsg(null);
            }}
            className="text-emerald-700 font-bold hover:text-emerald-800 underline underline-offset-4 cursor-pointer"
          >
            {role === 'client' ? 'Register as Advocate' : 'Join as Client'}
          </button>
        </div>
      </header>

      {/* Main Registration Form Container */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 flex-1 w-full flex flex-col justify-center space-y-6">
        <div className="text-center space-y-1.5">
          <span
            className={`inline-block text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
              role === 'client'
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {role === 'client'
              ? 'Client Registration • Telebirr Escrow Protected'
              : 'Advocate Chamber Registration • Proclamation No. 1249/2021'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight pt-1">
            {role === 'client'
              ? 'Sign up to access legal counsel'
              : 'Sign up to register your chambers'}
          </h1>
          <p className="text-xs text-slate-500">
            {role === 'client'
              ? 'Create your client profile to draft legal forms, consult advocates, and manage retainers.'
              : 'Verify your bar credentials to accept client briefs, digital retainers, and interns.'}
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
              : `Continue with Google (${role === 'client' ? 'Client' : 'Advocate'})`}
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

          {/* Email & Ethiopian Phone */}
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
                {role === 'client' ? 'Phone (Telebirr / SMS)' : 'Chamber Phone Number'}
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

          {/* ROLE-SPECIFIC TASK FIELDS */}
          {role === 'client' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Primary Legal Task
                </label>
                <select
                  value={clientLegalNeed}
                  onChange={(e) => setClientLegalNeed(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                >
                  <option value="Contract & Legal Form Drafting (LexDraft)">
                    Contract & Court Form Drafting (LexDraft)
                  </option>
                  <option value="Book Verified Advocate Consultation">
                    Book Verified Advocate Consultation
                  </option>
                  <option value="Business & PLC Incorporation">
                    Business & PLC Incorporation
                  </option>
                  <option value="Civil, Commercial or Cassation Litigation">
                    Civil, Commercial or Cassation Litigation
                  </option>
                  <option value="Property, Land & Lease Agreement">
                    Property, Land & Lease Agreement
                  </option>
                  <option value="Diaspora Power of Attorney & Representation">
                    Diaspora Power of Attorney
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
                  Primary Practice Area
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
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#064E3B] cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-snug">
                Yes, I understand and agree to the{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-bold text-emerald-700 underline hover:text-emerald-800"
                >
                  LegalLink Terms of Service
                </Link>
                , including Escrow Rules and{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-bold text-emerald-700 underline hover:text-emerald-800"
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
              className={`w-full sm:w-auto px-10 py-3.5 text-white font-bold rounded-full text-xs inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 ${
                role === 'client'
                  ? 'bg-[#0A1128] hover:bg-[#102A43]'
                  : 'bg-[#064E3B] hover:bg-[#075E47]'
              }`}
            >
              <span>
                {loading
                  ? 'Creating Account...'
                  : role === 'client'
                  ? 'Create my Client Account'
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
          Loading LegalLink Sign Up...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}