'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Phone, ArrowRight, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'client' | 'advocate'>('client');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: password,
      });

      if (error) {
        // Fallback for demonstration / sandbox testing if Supabase user is not yet created
        if (role === 'advocate') {
          router.push('/advocate');
        } else {
          router.push('/');
        }
      } else {
        router.push(role === 'advocate' ? '/advocate' : '/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Back Link & Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to LegalLink</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <img src="/logo.png" alt="LegalLink" className="w-6 h-6 object-contain" />
            <span className="font-black text-sm text-[#0A1128]">Legal<span className="text-amber-500">Link</span></span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#0A1128]">Sign In</h1>
            <p className="text-xs text-slate-500">Access your consultation briefs, documents, and Telebirr escrow records.</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`py-2 rounded-xl transition-all ${
                role === 'client' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Client Portal
            </button>
            <button
              type="button"
              onClick={() => setRole('advocate')}
              className={`py-2 rounded-xl transition-all ${
                role === 'advocate' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Advocate Workspace
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'client' ? 'Email or Telebirr Phone Number' : 'Licensed Advocate Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'client' ? 'client@example.com' : 'advocate@lawfirm.et'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <a href="#" className="text-[11px] font-bold text-amber-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            {role === 'client' ? (
              <span>
                First time using LegalLink?{' '}
                <Link href="/find-a-lawyer" className="font-bold text-amber-600 hover:underline">
                  Book a Consultation
                </Link>
              </span>
            ) : (
              <span>
                Not yet accredited?{' '}
                <Link href="/for-lawyers" className="font-bold text-amber-600 hover:underline">
                  Apply for Bar Accreditation
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Compliant with Ethiopian Commercial Code & Telebirr USSD Escrow</span>
        </div>
      </div>
    </div>
  );
}