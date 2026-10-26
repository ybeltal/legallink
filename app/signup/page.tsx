'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        
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

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#0A1128]">Create Account</h1>
            <p className="text-xs text-slate-500">Select how you will be using LegalLink Ethiopia.</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/find-a-lawyer"
              className="p-5 rounded-2xl border border-slate-200 hover:border-[#0A1128] hover:shadow-sm transition-all flex items-start gap-4 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0A1128]">I Need Legal Consultation</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A1128] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Find licensed advocates, review transparent fixed retainers, and pay through Telebirr escrow.
                </p>
              </div>
            </Link>

            <Link
              href="/for-lawyers"
              className="p-5 rounded-2xl border border-slate-200 hover:border-[#0A1128] hover:shadow-sm transition-all flex items-start gap-4 group block"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0A1128] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#0A1128]">I am a Licensed Advocate</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A1128] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Submit your Ministry of Justice bar license, receive pre-screened client briefs, and automate billing.
                </p>
              </div>
            </Link>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-amber-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Fayda ID and MOJ Bar verification enforced</span>
        </div>
      </div>
    </div>
  );
}