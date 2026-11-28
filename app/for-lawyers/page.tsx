'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  Globe,
  GraduationCap,
  TrendingUp,
  Plus,
  Briefcase,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  RevealOnScroll,
  KineticHeadline,
  SpotlightCard,
} from '@/components/MotionPrimitives';
import { useLanguage } from '@/context/LanguageContext';

export default function ForLawyersPage() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Structured Client Briefs',
      desc: 'Receive pre-organized inquiries with practice area, urgency, city, voice briefs, and language preferences.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified MOJ Credibility',
      desc: 'Display your bar license standing and Federal or Regional court admission clearly to prospective clients.',
    },
    {
      icon: Globe,
      title: 'Reach Local & Diaspora',
      desc: 'Connect with clients across Addis Ababa, regional cities, and the Ethiopian diaspora abroad.',
    },
    {
      icon: GraduationCap,
      title: 'NextGen Pupillage',
      desc: 'Discover law graduate apprentices under Federal Advocacy Proclamation No. 1249/2021.',
    },
  ];

  const onboardingSteps = [
    {
      num: '01',
      title: 'Register Your Chamber',
      desc: 'Complete the advocate chamber & CV registration form with your bar license number, education, practice areas, and contact details.',
    },
    {
      num: '02',
      title: 'Credential Verification',
      desc: 'Our oversight team reviews your Ministry of Justice or Regional Bar license and activates your MOJ Verified badge.',
    },
    {
      num: '03',
      title: 'Manage Client Inquiries',
      desc: 'Sign in to your Advocate Portal anytime to review, accept, listen to voice briefs, or complete client consultation requests directly.',
    },
  ];

  const faqs = [
    {
      q: 'Is there any fee to join LegalLink?',
      a: 'No. LegalLink is completely free for licensed Ethiopian advocates during our public launch — zero listing fees, zero subscriptions, and zero commission.',
    },
    {
      q: 'How does advocate verification work?',
      a: 'When you register your chamber, you submit your Federal Ministry of Justice or Regional Justice Bureau license number along with your full professional CV. Our oversight team verifies your active standing before activating your public MOJ Verified badge.',
    },
    {
      q: 'How do clients reach me?',
      a: 'Prospective clients select your profile on Find a Lawyer and submit a structured written or voice brief. Their inquiry appears immediately in your private Advocate Portal with their phone number and email so you can reach out directly.',
    },
    {
      q: 'Can I set my own consultation terms and fees?',
      a: 'Yes. LegalLink never interferes in advocate-client fee agreements. You discuss scope, retainers, and representation terms directly with your clients in full compliance with Proclamation No. 1249/2021.',
    },
    {
      q: 'Can I recruit law student interns or pupillage apprentices?',
      a: 'Yes. Opt into NextGen Pupillage during registration or post internship openings on the NextGen Hub to receive structured applications from Ethiopian law schools.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      <Navbar />

      {/* Sky Azure Hero Section */}
      <section className="relative overflow-hidden ll-sky-canvas pt-16 pb-20 md:pt-20 md:pb-28">
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-10 -left-20 w-[420px] h-[200px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-24 -right-20 w-[480px] h-[220px] rounded-full bg-white/30 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/35 backdrop-blur-md text-xs font-bold">
                <Scale className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'am'
                    ? 'ፈቃድ ላላቸው የኢትዮጵያ ጠበቆች • ነፃ ምዝገባ'
                    : 'For Licensed Ethiopian Advocates • Free Launch'}
                </span>
              </div>

              <KineticHeadline
                primaryText={language === 'am' ? 'የጥብቅና አገልግሎትዎን ያስፋፉ።' : 'Expand your practice.'}
                accentText={language === 'am' ? 'ብዙ ደንበኞችን ያግኙ።' : 'Serve more clients.'}
              />

              <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                List your verified chamber on Ethiopia’s digital legal directory. Receive structured client briefs, manage inquiries in one workspace, and serve both local and diaspora clients — completely free.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                <Link
                  href="/advocate/register"
                  className="px-7 py-3.5 bg-white hover:bg-slate-50 text-[#182235] font-black text-xs rounded-full inline-flex items-center justify-center gap-2 shadow-md transition-all group"
                >
                  <span>Register Your Chamber (Free)</span>
                  <ArrowRight className="w-4 h-4 text-[#3B66B8] group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/advocate/portal"
                  className="px-7 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/35 backdrop-blur-md font-bold text-xs rounded-full inline-flex items-center justify-center gap-2 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Open Advocate Portal</span>
                </Link>
              </div>
            </div>

            {/* Right 4-Card Benefit Grid with Subtle 3D Lift */}
            <div className="lg:col-span-6 ll-window-rise">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <SpotlightCard
                      key={idx}
                      className="p-6 rounded-3xl space-y-3 bg-white/95 backdrop-blur-md"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#EEF3FB] text-[#3B66B8] flex items-center justify-center relative z-10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-sm font-black text-[#182235] relative z-10">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                        {item.desc}
                      </p>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Advocate Onboarding Works */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono font-bold uppercase tracking-widest text-[#3B66B8]">
              ONBOARDING PROCESS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#182235]">
              How Advocate Onboarding Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Three quick steps to go live on LegalLink.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onboardingSteps.map((step, idx) => (
              <RevealOnScroll key={step.num} delayMs={idx * 80}>
                <SpotlightCard className="p-8 rounded-3xl h-full space-y-3">
                  <span className="text-3xl font-black font-mono text-[#3B66B8] block relative z-10">
                    {step.num}
                  </span>
                  <h3 className="text-base font-black text-[#182235] relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                    {step.desc}
                  </p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll className="text-center pt-2">
            <Link
              href="/advocate/register"
              className="px-8 py-4 bg-[#182235] hover:bg-[#24324d] text-white font-bold text-xs rounded-full inline-flex items-center gap-2 shadow-sm transition-all group"
            >
              <span>Complete Advocate Registration</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Smooth Animated FAQ Section */}
      <section className="py-20 bg-[#F5F7FB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <RevealOnScroll className="text-center space-y-2.5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono font-bold uppercase tracking-widest text-[#3B66B8]">
              ADVOCATE FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
              Frequently Asked Questions
            </h2>
          </RevealOnScroll>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? 'bg-white border-[#B8CCF0] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#182235]">{item.q}</span>
                    <Plus
                      className={`w-4 h-4 text-[#3B66B8] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#182235] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/advocate/register" className="hover:text-white font-bold text-amber-300">
              Register Chamber
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}