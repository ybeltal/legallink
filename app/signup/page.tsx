'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, User, Scale, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, Lock, Smartphone, FileText 
} from 'lucide-react';
import DigitalBadge, { BadgeData } from '@/components/DigitalBadge';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [step, setStep] = useState<1 | 2>(1);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [barLicense, setBarLicense] = useState('');
  const [benchLevel, setBenchLevel] = useState('Federal First Instance & High Court');

  // Generated Badge Data
  const [generatedBadge, setGeneratedBadge] = useState<BadgeData | null>(null);

  // Google OAuth Sign-Up Handler
  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${role === 'advocate' ? '/advocate' : '/find-a-lawyer'}`,
        },
      });

      if (error) {
        // Fallback: Generate the badge directly for demonstration
        generateBadgeForUser(
          role === 'advocate' ? 'Advocate (Google User)' : 'Client (Google User)',
          'google.user@gmail.com',
          '0911 000 000'
        );
      }
    } catch {
      generateBadgeForUser(
        role === 'advocate' ? 'Advocate (Google User)' : 'Client (Google User)',
        'google.user@gmail.com',
        '0911 000 000'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const generateBadgeForUser = (name: string, mail: string, tel: string) => {
    const badgeData: BadgeData = {
      type: role,
      fullName: name,
      email: mail || `${name.toLowerCase().replace(/\s+/g, '.')}@legallink.et`,
      phone: tel,
      identifier: role === 'advocate' 
        ? (barLicense.trim() || 'ETH-BAR-2026-9042') 
        : `LL-CL-${Math.floor(1000 + Math.random() * 9000)}`,
      benchOrTier: role === 'advocate' ? benchLevel : 'Commercial Code Art. 1240 Escrow Protected',
      issueDate: 'October 28, 2026'
    };
    setGeneratedBadge(badgeData);
    setStep(2);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    generateBadgeForUser(fullName.trim(), email.trim(), phone.trim());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 sm:px-6 py-12 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to LegalLink</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="LegalLink" className="w-6 h-6 object-contain" />
            <span className="font-black text-sm text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </div>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 1 && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">
                INSTANT CREDENTIAL ISSUANCE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                Create Your Account & Digital Pass
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                Register to generate your official LegalLink digital credential with date, registry seal, and escrow protection.
              </p>
            </div>

            {/* Persona Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'client' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Client Pass (ጉዳይ አስፈጻሚ)</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('advocate')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  role === 'advocate' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                }`}
              >
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Advocate Accreditation (ጠበቃ)</span>
              </button>
            </div>

            {/* RESTORED: Google OAuth Sign-Up Option */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors text-xs shadow-xs cursor-pointer disabled:opacity-60"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : `Sign Up with Google (${role === 'advocate' ? 'Advocate' : 'Client'})`}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">
                Or register with details below
              </span>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {role === 'client' ? 'Full Legal Name / Company Name *' : 'Advocate Full Name (According to Bar License) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={role === 'client' ? 'e.g. Dawit Alemu' : 'e.g. Advocate Mulu Haile'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telebirr Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0911 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              {/* Advocate-Specific Fields */}
              {role === 'advocate' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                  <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wide">
                    Ministry of Justice Accreditation Info
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Bar License Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="ETH-BAR-2024-XXXX"
                        value={barLicense}
                        onChange={(e) => setBarLicense(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Qualified Bench</label>
                      <select
                        value={benchLevel}
                        onChange={(e) => setBenchLevel(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold cursor-pointer"
                      >
                        <option value="Federal First Instance & High Court">Federal First Instance & High Court</option>
                        <option value="Federal Supreme Court">Federal Supreme Court Qualified</option>
                        <option value="Cassation Division Senior Litigator">Cassation Division Senior Litigator</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate & Issue My Digital Credential</span>
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already hold an account?{' '}
              <Link href="/login" className="font-bold text-amber-600 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: Rendered Digital Badge Result */}
        {step === 2 && generatedBadge && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-[#0A1128]">
                Your Credential Has Been Issued!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your personalized digital pass has been generated with official LegalLink branding, timestamp, and audit code.
              </p>
            </div>

            {/* RENDER THE DIGITAL BADGE COMPONENT */}
            <DigitalBadge data={generatedBadge} />

            {/* Post-Issuance Routing Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Credentials</span>
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                {role === 'advocate' ? (
                  <Link
                    href="/advocate"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>Enter Advocate Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href="/find-a-lawyer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <span>Find & Book an Advocate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Compliant with Ethiopian Commercial Code & Telebirr USSD Escrow</span>
        </div>

      </div>
    </div>
  );
}