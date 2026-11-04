'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, UserCheck, 
  Scale, Briefcase, CheckCircle2, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [role, setRole] = useState<'advocate' | 'client'>('advocate');
  const [emailOrLicense, setEmailOrLicense] = useState('ETH-BAR-2015-0081');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (role === 'advocate') {
        // Store advocate session and route directly to Advocate Portal
        sessionStorage.setItem('ll_active_advocate_id', 'ETH-BAR-2015-0081');
        router.push('/advocate/portal');
      } else {
        router.push('/find-a-lawyer');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-xs space-y-6 animate-scaleUp">
          
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
              Sign In to LegalLink
            </h1>
            <p className="text-xs text-slate-500 font-normal">
              Access your confidential advocate chambers or client account.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRole('advocate');
                setEmailOrLicense('ETH-BAR-2015-0081');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'advocate'
                  ? 'bg-white text-[#0A1128] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Advocate</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('client');
                setEmailOrLicense('client@example.com');
              }}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                role === 'client'
                  ? 'bg-white text-[#0A1128] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Client</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                {role === 'advocate' ? 'Bar License Number or Email *' : 'Client Email or Phone *'}
              </label>
              <input
                type="text"
                required
                value={emailOrLicense}
                onChange={(e) => setEmailOrLicense(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <span>{loading ? 'Authenticating...' : role === 'advocate' ? 'Enter Advocate Portal' : 'Sign In as Client'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </form>

          {role === 'advocate' && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
              <strong>Advocate Quick Link:</strong> Signing in routes you directly to your confidential escrow balances, assigned client briefs, and NextGen intern applications.
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
              ← Return to Public Marketplace
            </Link>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center text-[11px]">
          © 2026 LegalLink Technologies PLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}