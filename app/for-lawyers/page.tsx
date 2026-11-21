'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Globe,
  ArrowRight,
  ChevronDown,
  Scale,
  GraduationCap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ForLawyersPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Is there any fee to join LegalLink?',
      a: 'No. LegalLink is completely free for licensed Ethiopian advocates during our public launch — zero listing fees, zero subscriptions, and zero commission.',
    },
    {
      q: 'How does advocate verification work?',
      a: 'When you register your chamber profile, you submit your Federal Ministry of Justice or Regional Justice Bureau license number and court jurisdiction standing. Our team verifies your standing before marking your profile as MOJ Verified.',
    },
    {
      q: 'How do clients reach me?',
      a: 'Clients submit structured consultation briefs via Find a Lawyer. Every inquiry assigned to you appears immediately inside your Advocate Portal with the client’s contact details, practice area, and timeline.',
    },
    {
      q: 'Can I set my own consultation terms and fees?',
      a: 'Yes. LegalLink connects you directly with prospective clients. You agree on scope, engagement terms, and representation fees directly with your client under Ethiopian advocacy ethics.',
    },
    {
      q: 'Can I recruit law student interns or pupillage apprentices?',
      a: 'Yes. Opt into NextGen Pupillage on your profile to review applications from Ethiopian LL.B students and graduates under Proclamation No. 1249/2021.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>For Licensed Ethiopian Advocates • Free Launch</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
                Expand your practice.<br />
                <span className="text-amber-700">Serve more clients.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                List your verified chamber on Ethiopia’s digital legal directory. Receive structured client briefs, manage inquiries in one workspace, and serve both local and diaspora clients — completely free.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                <Link
                  href="/advocate/register"
                  className="px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Register Your Chamber (Free)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
                <Link
                  href="/advocate/portal"
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs"
                >
                  <span>Open Advocate Portal</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Structured Client Briefs</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive pre-organized inquiries with practice area, urgency, court tier, and language preferences.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Verified MOJ Credibility</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Display your bar license standing and Federal or Regional court admission clearly to prospective clients.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Reach Local & Diaspora</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect with clients across Addis Ababa, regional cities, and the Ethiopian diaspora abroad.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">NextGen Pupillage</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover law graduate apprentices under Federal Advocacy Proclamation No. 1249/2021.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Onboarding */}
      <section className="py-16 md:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">How Advocate Onboarding Works</h2>
            <p className="text-xs sm:text-sm text-slate-600">Three quick steps to go live on LegalLink.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-slate-200 font-mono block">01</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Register Your Chamber</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete the single chamber registration form with your bar license number, jurisdiction, and contact details.
              </p>
            </div>
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-amber-400 font-mono block">02</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Credential Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our oversight team reviews your Ministry of Justice or Regional Bar license and activates your verified badge.
              </p>
            </div>
            <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-emerald-400 font-mono block">03</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Manage Client Inquiries</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign in to your Advocate Portal anytime to review, accept, or complete client consultation requests directly.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/advocate/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <span>Complete Advocate Registration</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left text-xs font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/70"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180 text-[#0A1128]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/70">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/advocate/register" className="text-amber-400 font-bold hover:text-amber-300">
              Register Chamber
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}