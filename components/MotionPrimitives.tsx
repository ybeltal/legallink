'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Scale,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Search,
  BookOpen,
  LayoutDashboard,
  Headphones,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* =========================================================================
   1. STAGGERED SCROLL-TRIGGERED REVEAL WRAPPER (VIDEO 00:07–00:09)
   ========================================================================= */
export function RevealOnScroll({
  children,
  className = '',
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`ll-reveal ${visible ? 'll-reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   2. CRISP WHITE OVER SKY BLUR-TO-FOCUS HEADLINE (VIDEO 00:00–00:02)
   ========================================================================= */
export function KineticHeadline({
  primaryText,
  accentText,
}: {
  primaryText: string;
  accentText: string;
}) {
  const primaryWords = primaryText.trim().split(/\s+/);
  const accentWords = accentText.trim().split(/\s+/);

  return (
    <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black tracking-tight leading-[1.08] text-white drop-shadow-xs">
      <span className="block">
        {primaryWords.map((word, idx) => (
          <span
            key={`p-${idx}`}
            style={{ animationDelay: `${idx * 90}ms` }}
            className="ll-word-reveal mr-3 last:mr-0"
          >
            {word}
          </span>
        ))}
      </span>
      <span className="block mt-1 text-white">
        {accentWords.map((word, idx) => (
          <span
            key={`a-${idx}`}
            style={{ animationDelay: `${(primaryWords.length + idx) * 90 + 100}ms` }}
            className="ll-word-reveal mr-3 last:mr-0"
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
}

/* =========================================================================
   3. OVERLAPPING FLOATING LEGALLINK WORKSPACE PREVIEW (VIDEO 00:01–00:03.5)
   ========================================================================= */
export function SkyDashboardPreview() {
  const { language } = useLanguage();

  return (
    <div className="ll-window-rise max-w-5xl mx-auto rounded-[28px] border border-white/80 bg-white/95 backdrop-blur-xl shadow-[0_28px_80px_-16px_rgba(30,58,118,0.24)] overflow-hidden text-left text-[#182235]">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Left App Sidebar (Matches Credix Left Sidebar) */}
        <div className="hidden md:flex md:col-span-3 bg-[#F8FAFE] border-r border-slate-200/80 p-5 flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2 px-2">
              <img src="/logo.png" alt="LegalLink" className="w-6 h-6 object-contain" />
              <span className="font-black text-sm text-[#182235]">
                Legal<span className="text-[#3B66B8]">Link</span>
              </span>
            </div>

            <div className="space-y-1 text-xs font-bold">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#EEF3FB] text-[#3B66B8]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{language === 'am' ? 'አጠቃላይ እይታ' : 'Overview'}</span>
              </Link>
              <Link
                href="/find-a-lawyer"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span>{language === 'am' ? 'ጠበቆች' : 'Find Advocates'}</span>
              </Link>
              <Link
                href="/lexdraft"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>LexDraft Studio</span>
              </Link>
              <Link
                href="/legaltalk"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Headphones className="w-4 h-4 text-slate-500" />
                <span>LegalTalk Audio</span>
              </Link>
              <Link
                href="/library"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Federal Laws</span>
              </Link>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] space-y-1">
            <strong className="text-[#182235] block">Proclamation 1249/2021</strong>
            <span className="text-slate-600 block">MOJ Verified Directory</span>
          </div>
        </div>

        {/* Right Main App Preview Area */}
        <div className="md:col-span-9 p-5 sm:p-7 space-y-6 bg-white">
          {/* Top Search & User Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F5F7FB] border border-slate-200/80 text-xs text-slate-500 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search advocates, laws, forms...</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                ● Live Platform
              </span>
              <Link
                href="/find-a-lawyer"
                className="px-3.5 py-1.5 rounded-full bg-[#3B66B8] hover:bg-[#2F56A6] text-white font-bold text-[11px] transition-colors"
              >
                + New Inquiry
              </Link>
            </div>
          </div>

          {/* Dashboard Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Blue Verified Chamber Card (Mirrors Credix Blue Card) */}
            <div className="lg:col-span-5 rounded-2xl p-5 text-white bg-gradient-to-br from-[#3B66B8] via-[#4D79CE] to-[#749CE2] shadow-md flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                  Verified Counsel
                </span>
                <Scale className="w-4 h-4 text-white/90" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] text-white/80 block">Federal Supreme Court</span>
                <strong className="text-lg font-black block tracking-tight">
                  Adv. Mulu Haile
                </strong>
                <span className="text-[11px] font-mono text-white/90 block">
                  ETH-BAR-2018-0492 • Addis Ababa
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/20">
                <span>Amharic &amp; English</span>
                <span className="font-bold">★ 5.0 Verified</span>
              </div>
            </div>

            {/* Middle Quick Status Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-slate-200/70 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#182235] text-white flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="pt-3">
                  <span className="text-[11px] text-slate-500 block">LexDraft</span>
                  <strong className="text-base font-black text-[#182235]">Bilingual</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] border border-slate-200/70 flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#3B66B8] text-white flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="pt-3">
                  <span className="text-[11px] text-slate-500 block">LegalTalk</span>
                  <strong className="text-base font-black text-[#182235]">Audio</strong>
                </div>
              </div>

              <div className="col-span-2 p-3.5 rounded-2xl bg-[#EEF3FB]/70 border border-[#D6E2F5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#3B66B8] font-bold block">
                    Client Continuity
                  </span>
                  <strong className="text-xs font-black text-[#182235]">
                    Text &amp; Voice Brief Tracking
                  </strong>
                </div>
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-[#3B66B8] hover:underline"
                >
                  Open →
                </Link>
              </div>
            </div>

            {/* Right Quick Launch Panel */}
            <div className="lg:col-span-3 p-4 rounded-2xl bg-[#F8FAFE] border border-slate-200/80 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Quick Access
                </span>
                <strong className="text-sm font-black text-[#182235] block mt-0.5">
                  3-Step Flow
                </strong>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Choose Practice Area</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Select Verified Counsel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Track in Dashboard</span>
                </div>
              </div>
              <Link
                href="/find-a-lawyer"
                className="w-full py-2 rounded-xl bg-[#182235] hover:bg-[#24324d] text-white font-bold text-[11px] text-center block transition-colors"
              >
                Start Now
              </Link>
            </div>
          </div>

          {/* Bottom Activity Rows (Mirrors Credix Recent Transactions List) */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              href="/lexdraft"
              className="p-3 rounded-xl bg-[#F5F7FB] hover:bg-[#EEF3FB] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#3B66B8]" />
                <div>
                  <strong className="text-[#182235] block text-[11px]">Employment Contract</strong>
                  <span className="text-[10px] text-slate-500">Proc. No. 1156/2019</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#3B66B8]">Draft →</span>
            </Link>

            <Link
              href="/diaspora"
              className="p-3 rounded-xl bg-[#F5F7FB] hover:bg-[#EEF3FB] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div>
                  <strong className="text-[#182235] block text-[11px]">Diaspora PoA Desk</strong>
                  <span className="text-[10px] text-slate-500">Embassy &amp; DARS Guide</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700">Open →</span>
            </Link>

            <Link
              href="/legal-center"
              className="p-3 rounded-xl bg-[#F5F7FB] hover:bg-[#EEF3FB] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-amber-600" />
                <div>
                  <strong className="text-[#182235] block text-[11px]">Legal Dictionary</strong>
                  <span className="text-[10px] text-slate-500">Amharic &amp; English Terms</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-700">Explore →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. POINTER-TRACKING SPOTLIGHT CARD
   ========================================================================= */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`ll-spotlight-card ${className}`}
    >
      {children}
    </div>
  );
}

/* =========================================================================
   5. CLEAN HORIZONTAL ECOSYSTEM STRIP (VIDEO 00:06.5)
   ========================================================================= */
export function KineticMarquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <div className="ll-marquee-wrapper relative overflow-hidden py-7 border-y border-slate-200/80 bg-white select-none">
      <div className="ll-marquee-track items-center">
        {doubled.map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="inline-flex items-center gap-2.5 text-lg sm:text-2xl font-extrabold tracking-tight px-8 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-[#3B66B8]" />
              <span>{item}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   6. INTERACTIVE 3-STEP SKY-SILK STAGE ("HOW IT WORKS")
   ========================================================================= */
export function InteractiveSilkHowItWorks() {
  const { language, t } = useLanguage();
  const [activeStep, setActiveStep] = useState<0 | 1 | 2>(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 4500);
    return () => clearInterval(interval);
  }, [paused]);

  const steps = [
    {
      num: 'STEP 1',
      title: t('hiw_step1_title'),
      desc: t('hiw_step1_desc'),
      badge: language === 'am' ? 'በአማርኛ ወይም በእንግሊዝኛ' : 'Text or Voice Brief',
      cardTitle: language === 'am' ? 'የህግ ጉዳይ መግለጫ' : 'Structured Matter Intake',
      cardSub:
        language === 'am'
          ? 'የስራ ውል፣ የቤት ኪራይ፣ የንግድ ምዝገባ ወይም የዲያስፖራ ጉዳይ'
          : 'Corporate • Property • Family • Labour • Diaspora',
      highlights: [
        language === 'am' ? 'ግልጽ የዘርፍ ምርጫ' : 'Guided practice area selection',
        language === 'am' ? 'በድምፅ ወይም በጽሑፍ መግለጽ' : '2-minute Amharic/English voice brief option',
        language === 'am' ? 'ሚስጥራዊ የመረጃ ጥበቃ' : 'Private, role-protected submission',
      ],
      ctaLabel: language === 'am' ? 'ጉዳይዎን ያስገቡ' : 'Start Your Brief',
      ctaHref: '/find-a-lawyer',
      icon: MessageSquare,
    },
    {
      num: 'STEP 2',
      title: t('hiw_step2_title'),
      desc: t('hiw_step2_desc'),
      badge: language === 'am' ? 'የተረጋገጡ ጠበቆች' : 'Verified Advocate Match',
      cardTitle: language === 'am' ? 'ጠበቃ ሙሉ ኃይሌ • MOJ Verified' : 'Adv. Mulu Haile • MOJ Verified',
      cardSub:
        language === 'am'
          ? 'የፌዴራል ጠቅላይ ፍርድ ቤት ጠበቃ • አዲስ አበባ'
          : 'Federal Supreme Court • 12 yrs exp. • Addis Ababa',
      highlights: [
        language === 'am' ? 'የጥብቅና ፍቃድ ማረጋገጫ' : 'Ministry of Justice credential check',
        language === 'am' ? 'በቋንቋና በከተማ የተጣራ' : 'Matched by language, city & specialty',
        language === 'am' ? 'ቀጥተኛ የጠበቃ ግንኙነት' : 'Direct routing to advocate portal',
      ],
      ctaLabel: language === 'am' ? 'ጠበቆችን ይመልከቱ' : 'Browse Advocates',
      ctaHref: '/find-a-lawyer',
      icon: ShieldCheck,
    },
    {
      num: 'STEP 3',
      title: t('hiw_step3_title'),
      desc: t('hiw_step3_desc'),
      badge: language === 'am' ? 'ቀጣይነት ያለው ክትትል' : 'Consult & Draft Continuity',
      cardTitle: language === 'am' ? 'የደንበኛ መከታተያ እና LexDraft' : 'Client Workspace & LexDraft',
      cardSub:
        language === 'am'
          ? 'የጥያቄ ሁኔታ መከታተያ + ዝግጁ የውል ሰነዶች'
          : 'Live status tracker + bilingual Word documents',
      highlights: [
        language === 'am' ? 'የምክክር ሁኔታ በቀጥታ መከታተል' : 'Track Pending → Accepted → Completed live',
        language === 'am' ? 'በአማርኛና እንግሊዝኛ ሰነድ ማዘጋጀት' : 'Generate Amharic & English forms on LexDraft',
        language === 'am' ? 'የዝግጅት መመሪያ ከምክክር በፊት' : 'Pre-call document preparation checklist',
      ],
      ctaLabel: language === 'am' ? 'ሰነድ ያዘጋጁ' : 'Try LexDraft Forms',
      ctaHref: '/lexdraft',
      icon: FileText,
    },
  ];

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <section className="py-20 md:py-28 bg-[#F5F7FB] border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono font-bold uppercase tracking-widest text-[#3B66B8]">
            {t('hiw_tag')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#182235] tracking-tight">
            {t('hiw_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">{t('hiw_sub')}</p>
        </RevealOnScroll>

        {/* Sky-Tinted Glass Stage */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative rounded-[2rem] border border-[#D6E2F5] bg-gradient-to-b from-[#EEF3FB] via-white to-[#F5F7FB] overflow-hidden p-6 sm:p-12 shadow-sm"
        >
          {/* Animated Flowing Sky Silk Ribbons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ll-silk-ribbon absolute -inset-x-24 top-1/4 h-56 bg-gradient-to-r from-[#3B66B8]/15 via-[#7AA4E4]/20 to-amber-300/15 blur-3xl rounded-full" />
            <div
              style={{ animationDelay: '-4s' }}
              className="ll-silk-ribbon absolute -inset-x-16 bottom-10 h-44 bg-gradient-to-r from-[#9EC0F2]/20 via-[#3B66B8]/10 to-emerald-300/15 blur-2xl rounded-full"
            />
          </div>

          {/* Floating White Glass Preview Card */}
          <div className="relative z-10 max-w-xl mx-auto">
            <div
              key={activeStep}
              className="ll-word-reveal w-full rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/[0.06] space-y-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[#3B66B8] text-[11px] font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{current.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#182235]">
                  0{activeStep + 1} / 03
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#3B66B8] text-white flex items-center justify-center shrink-0 shadow-md">
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#182235]">{current.cardTitle}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{current.cardSub}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href={current.ctaHref}
                  className="px-5 py-2.5 rounded-full bg-[#182235] hover:bg-[#24324d] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{current.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom 3-Step Selector Tabs */}
          <div className="relative z-10 mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveStep(idx as 0 | 1 | 2)}
                  className={`text-left space-y-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#3B66B8]/40 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-white/70 opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono font-black tracking-wider ${
                        isSelected ? 'text-[#3B66B8]' : 'text-slate-500'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span
                      className={`h-1 rounded-full transition-all duration-500 ${
                        isSelected ? 'w-12 bg-[#3B66B8]' : 'w-4 bg-slate-300'
                      }`}
                    />
                  </div>
                  <h4 className="text-sm font-black text-[#182235]">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. VERTICAL SINUSOIDAL KINETIC STACK (SKY BLUE & DEEP SLATE)
   ========================================================================= */
export function VerticalKineticWaveStack() {
  const { language } = useLanguage();

  const rows =
    language === 'am'
      ? [
          'ውሎችን ያዘጋጁ',
          'ጠበቃ ያግኙ',
          'አዋጆችን ያንብቡ',
          'መብትዎን ይወቁ',
          'ውክልና ያውጡ',
          'በቀላሉ ይጀምሩ',
        ]
      : [
          'Draft Contracts',
          'Verify Counsel',
          'Access Statutes',
          'Know Your Rights',
          'Empower Teams',
          'Start Today',
        ];

  return (
    <div className="relative py-7 px-6 select-none overflow-hidden rounded-3xl border border-[#D6E2F5] bg-gradient-to-br from-[#EEF3FB] via-white to-[#F5F7FB] shadow-xs">
      <div className="space-y-1.5 relative z-10">
        {rows.map((phrase, idx) => (
          <div
            key={idx}
            style={{ animationDelay: `${idx * -0.55}s` }}
            className={`ll-wave-row text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none whitespace-nowrap ${
              idx % 2 === 0
                ? 'text-[#182235]'
                : 'bg-gradient-to-r from-[#2E55A5] via-[#3B66B8] to-[#6B99DF] bg-clip-text text-transparent'
            }`}
          >
            {phrase}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   8. CONCENTRIC RADAR PULSE + GLASS LENSES CTA (SKY BLUE & WHITE)
   ========================================================================= */
export function RadarPulseEcosystemCTA() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#D6E2F5] bg-gradient-to-b from-[#EEF3FB] via-white to-[#F5F7FB] px-6 py-16 sm:py-20 text-center shadow-sm">
      {/* Concentric Pulsing Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-dashed border-[#3B66B8]/30 ll-radar-ring" />
        <div
          style={{ animationDelay: '1.5s' }}
          className="absolute w-64 h-64 rounded-full border border-dashed border-amber-500/30 ll-radar-ring"
        />
        <div
          style={{ animationDelay: '3s' }}
          className="absolute w-64 h-64 rounded-full border border-[#3B66B8]/20 ll-radar-ring"
        />
      </div>

      {/* Overlapping Translucent Frosted Glass Lenses */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 pointer-events-none opacity-80">
        <div className="w-36 h-36 rounded-full border border-[#D6E2F5] bg-gradient-to-tr from-[#3B66B8]/10 to-white/60 backdrop-blur-md ll-glass-lens" />
        <div
          style={{ animationDelay: '-2.5s' }}
          className="w-44 h-44 rounded-full border border-[#B8CCF0] bg-gradient-to-tr from-[#4E7CD1]/15 to-amber-300/10 backdrop-blur-md ll-glass-lens"
        />
        <div
          style={{ animationDelay: '-5s' }}
          className="w-36 h-36 rounded-full border border-[#D6E2F5] bg-gradient-to-tr from-[#3B66B8]/10 to-white/60 backdrop-blur-md ll-glass-lens"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#3B66B8] shadow-md flex items-center justify-center mx-auto">
          <Scale className="w-7 h-7 text-white" />
        </div>

        <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white border border-[#D6E2F5] text-[10px] font-mono uppercase tracking-widest text-[#3B66B8] font-bold">
          INSTITUTIONS, UNIVERSITIES &amp; DEVELOPMENT PARTNERS
        </span>

        <h3 className="text-2xl sm:text-4xl font-black text-[#182235] tracking-tight">
          Building a More Connected Legal Ecosystem Across Ethiopia
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Explore our mission, values, founding leadership, and institutional partnership tracks for universities, legal aid NGOs, corporates, and donors.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-[#182235] font-bold text-xs transition-all"
          >
            About LegalLink
          </Link>
          <Link
            href="/about#partnerships"
            className="px-6 py-3 rounded-full bg-[#182235] hover:bg-[#24324d] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}