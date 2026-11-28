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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* =========================================================================
   1. SCROLL-TRIGGERED REVEAL WRAPPER
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
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
   2. WORD-BY-WORD BLUR-TO-FOCUS KINETIC HEADLINE (LIGHT BLACK INK)
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
    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#18181B]">
      <span className="block">
        {primaryWords.map((word, idx) => (
          <span
            key={`p-${idx}`}
            style={{ animationDelay: `${idx * 95}ms` }}
            className="ll-word-reveal mr-3 last:mr-0"
          >
            {word}
          </span>
        ))}
      </span>
      <span className="block mt-1 bg-gradient-to-r from-[#18181B] via-amber-700 to-amber-600 bg-clip-text text-transparent">
        {accentWords.map((word, idx) => (
          <span
            key={`a-${idx}`}
            style={{ animationDelay: `${(primaryWords.length + idx) * 95 + 120}ms` }}
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
   3. POINTER-TRACKING RADIAL SPOTLIGHT CARD (WHITE MAJOR + LIGHT BLACK)
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
   4. GIANT HORIZONTAL KINETIC MARQUEE BANNER (WHITE MAJOR + LIGHT BLACK)
   ========================================================================= */
export function KineticMarquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="ll-marquee-wrapper relative overflow-hidden py-6 border-y border-slate-200 bg-[#F8FAFC] select-none">
      <div className={reverse ? 'll-marquee-track-reverse' : 'll-marquee-track'}>
        {doubled.map((item, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span
              className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight px-6 ${
                idx % 2 === 0 ? 'text-[#18181B]' : 'text-slate-400'
              }`}
            >
              {item}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. INTERACTIVE 3-STEP SILK-WAVE STAGE ("HOW IT WORKS" — LIGHT MODE)
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
    <section className="py-20 md:py-28 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700 block">
            {t('hiw_tag')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#18181B] tracking-tight">
            {t('hiw_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">{t('hiw_sub')}</p>
        </RevealOnScroll>

        {/* White Major Silk-Wave Glass Stage */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative rounded-[2rem] border border-slate-200/90 bg-[#F8FAFC] overflow-hidden p-6 sm:p-12 shadow-sm"
        >
          {/* Animated Flowing Silk Aurora Ribbons (Subtle Amber & Light Black) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="ll-silk-ribbon absolute -inset-x-24 top-1/4 h-56 bg-gradient-to-r from-amber-400/20 via-slate-900/[0.06] to-emerald-400/15 blur-3xl rounded-full" />
            <div
              style={{ animationDelay: '-4s' }}
              className="ll-silk-ribbon absolute -inset-x-16 bottom-10 h-44 bg-gradient-to-r from-slate-900/[0.05] via-amber-300/20 to-slate-400/15 blur-2xl rounded-full"
            />
          </div>

          {/* Floating White Glass Preview Card Inside the Silk Stage */}
          <div className="relative z-10 max-w-xl mx-auto">
            <div
              key={activeStep}
              className="ll-word-reveal w-full rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/[0.06] space-y-5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{current.badge}</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#18181B]">
                  0{activeStep + 1} / 03
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#18181B] text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <StepIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#18181B]">{current.cardTitle}</h3>
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
                  className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{current.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom 3-Step Selector Tabs + Progress Line */}
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
                      ? 'bg-white border-slate-300 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-white/60 opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-mono font-black tracking-wider ${
                        isSelected ? 'text-[#18181B]' : 'text-slate-500'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span
                      className={`h-1 rounded-full transition-all duration-500 ${
                        isSelected ? 'w-12 bg-[#18181B]' : 'w-4 bg-slate-300'
                      }`}
                    />
                  </div>
                  <h4 className="text-sm font-black text-[#18181B]">{step.title}</h4>
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
   6. VERTICAL SINUSOIDAL KINETIC STACK (WHITE MAJOR + LIGHT BLACK)
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
    <div className="relative py-7 px-6 select-none overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFC] shadow-xs">
      <div className="absolute inset-0 bg-radial from-amber-400/12 via-transparent to-transparent pointer-events-none" />
      <div className="space-y-1.5 relative z-10">
        {rows.map((phrase, idx) => (
          <div
            key={idx}
            style={{ animationDelay: `${idx * -0.55}s` }}
            className={`ll-wave-row text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none whitespace-nowrap ${
              idx % 2 === 0
                ? 'text-[#18181B]'
                : 'bg-gradient-to-r from-[#18181B] via-amber-700 to-amber-600 bg-clip-text text-transparent'
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
   7. CONCENTRIC RADAR PULSE + GLASS LENSES CTA (WHITE MAJOR + LIGHT BLACK)
   ========================================================================= */
export function RadarPulseEcosystemCTA() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-16 sm:py-20 text-center shadow-sm">
      {/* Concentric Pulsing Radar Rings (Light Black & Warm Amber) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border border-dashed border-slate-900/20 ll-radar-ring" />
        <div
          style={{ animationDelay: '1.5s' }}
          className="absolute w-64 h-64 rounded-full border border-dashed border-amber-600/25 ll-radar-ring"
        />
        <div
          style={{ animationDelay: '3s' }}
          className="absolute w-64 h-64 rounded-full border border-slate-900/15 ll-radar-ring"
        />
      </div>

      {/* Overlapping Translucent Frosted Glass Lenses */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 pointer-events-none opacity-75">
        <div className="w-36 h-36 rounded-full border border-slate-300/70 bg-gradient-to-tr from-slate-900/[0.06] to-white/40 backdrop-blur-md ll-glass-lens" />
        <div
          style={{ animationDelay: '-2.5s' }}
          className="w-44 h-44 rounded-full border border-amber-300/60 bg-gradient-to-tr from-amber-500/[0.10] to-slate-900/[0.04] backdrop-blur-md ll-glass-lens"
        />
        <div
          style={{ animationDelay: '-5s' }}
          className="w-36 h-36 rounded-full border border-slate-300/70 bg-gradient-to-tr from-slate-900/[0.06] to-white/40 backdrop-blur-md ll-glass-lens"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-[#18181B] shadow-md flex items-center justify-center mx-auto">
          <Scale className="w-7 h-7 text-amber-400" />
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block">
          INSTITUTIONS, UNIVERSITIES &amp; DEVELOPMENT PARTNERS
        </span>

        <h3 className="text-2xl sm:text-4xl font-black text-[#18181B] tracking-tight">
          Building a More Connected Legal Ecosystem Across Ethiopia
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Explore our mission, values, founding leadership, and institutional partnership tracks for universities, legal aid NGOs, corporates, and donors.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#18181B] font-bold text-xs transition-all"
          >
            About LegalLink
          </Link>
          <Link
            href="/about#partnerships"
            className="px-6 py-3 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}