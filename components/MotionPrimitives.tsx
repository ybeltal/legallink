'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Scale,
  CheckCircle2,
  Sparkles,
  Search,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Users,
  Globe,
  Clock,
  Sliders,
  Zap,
  Lock,
  Mic,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

/* =========================================================================
   1. SCROLL-TRIGGERED FADE-UP REVEAL
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
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
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
   2. AIRY WHITE CARD WITH SOFT PERIWINKLE HOVER
   ========================================================================= */
export function SkyGlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`ll-air-card ${className}`}>{children}</div>;
}

/* =========================================================================
   3. SKY HERO + SCROLL-DRIVEN 3D PERSPECTIVE WORKSPACE (VIDEO 00:00–00:05)
   ========================================================================= */
export function SkyHeroAndScroll3DWorkspace() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const stageTrackRef = useRef<HTMLDivElement>(null);

  const [quickQuery, setQuickQuery] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsDesktop(window.innerWidth >= 1024);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      const el = stageTrackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const passed = -rect.top;
      const next = Math.min(1, Math.max(0, passed / scrollable));
      setScrollProgress(next);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleQuickLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = quickQuery.trim().toLowerCase();
    if (!cleaned) {
      router.push('/find-a-lawyer');
      return;
    }
    if (cleaned.includes('draft') || cleaned.includes('contract') || cleaned.includes('ውል')) {
      router.push('/lexdraft');
      return;
    }
    if (cleaned.includes('diaspora') || cleaned.includes('poa') || cleaned.includes('ውክልና')) {
      router.push('/diaspora');
      return;
    }
    if (cleaned.includes('family') || cleaned.includes('divorce') || cleaned.includes('ፍቺ')) {
      router.push('/find-a-lawyer?category=family');
      return;
    }
    if (cleaned.includes('land') || cleaned.includes('lease') || cleaned.includes('ቤት')) {
      router.push('/find-a-lawyer?category=property');
      return;
    }
    if (cleaned.includes('work') || cleaned.includes('labour') || cleaned.includes('ስራ')) {
      router.push('/find-a-lawyer?category=employment');
      return;
    }
    router.push('/find-a-lawyer');
  };

  // Smoothly animate dashboard from centered flat -> right-shifted 3D perspective (matches video 00:02–00:05)
  const easeProgress =
    scrollProgress < 0.5
      ? 2 * scrollProgress * scrollProgress
      : 1 - Math.pow(-2 * scrollProgress + 2, 2) / 2;

  const dashboardTransform = isDesktop
    ? `perspective(1600px) translate3d(${easeProgress * 24}%, ${easeProgress * 10}px, 0) rotateY(${easeProgress * -13}deg) rotateX(${easeProgress * 4}deg) scale(${1 - easeProgress * 0.05})`
    : 'none';

  const leftNarrativeOpacity = isDesktop
    ? Math.min(1, Math.max(0, (scrollProgress - 0.28) / 0.42))
    : 1;

  const leftNarrativeTranslate = isDesktop ? (1 - leftNarrativeOpacity) * -28 : 0;

  return (
    <section className="relative overflow-x-clip">
      {/* UPPER SKY HERO CANVAS (VIDEO 00:00–00:01) */}
      <div className="ll-sky-canvas relative pt-28 sm:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Drifting Soft White Cloud Layers */}
        <div className="ll-cloud-layer-a absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="ll-cloud-layer-b absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="ll-sky-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-white text-[11px] font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>{t('hero_badge')}</span>
          </div>

          <h1
            style={{ animationDelay: '90ms' }}
            className="ll-sky-reveal text-4xl sm:text-6xl lg:text-[64px] font-semibold tracking-tight leading-[1.08] text-white drop-shadow-[0_2px_18px_rgba(32,64,124,0.22)]"
          >
            {language === 'am' ? (
              <>
                የህግ አገልግሎት ቀጣይ ዘመን፣
                <br />
                ዛሬ እዚህ ይጀምራል።
              </>
            ) : (
              <>
                Your Law. Your Clarity.
                <br />
                Your Future is here.
              </>
            )}
          </h1>

          <p
            style={{ animationDelay: '180ms' }}
            className="ll-sky-reveal text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed font-normal"
          >
            {t('hero_sub')}
          </p>

          {/* Frosted Glass Input + White Pill CTA (Video 00:00.5–00:02.0) */}
          <form
            onSubmit={handleQuickLaunch}
            style={{ animationDelay: '260ms' }}
            className="ll-sky-reveal ll-sky-glass max-w-md mx-auto rounded-full p-1.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder={
                language === 'am'
                  ? 'ጉዳይዎን ይጻፉ (ውል፣ ቤት ኪራይ፣ ዲያስፖራ)...'
                  : 'e.g. Company setup, lease, family law...'
              }
              className="flex-1 bg-transparent pl-4 pr-2 py-2 text-xs sm:text-sm text-white placeholder:text-white/75 focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F5F7FC] text-[#141B2D] text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 inline-flex items-center gap-1.5"
            >
              <span>{t('hero_cta_find')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5D6DF7]" />
            </button>
          </form>

          {/* Subtle Secondary Pill Links */}
          <div
            style={{ animationDelay: '340ms' }}
            className="ll-sky-reveal flex flex-wrap items-center justify-center gap-2.5 pt-1 text-[11px] text-white/90 font-medium"
          >
            <Link
              href="/lexdraft"
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-sm transition-colors"
            >
              {language === 'am' ? 'ሌክስ ድራፍት ውሎች' : 'Draft Bilingual Forms (LexDraft)'}
            </Link>
            <Link
              href="/for-lawyers"
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 backdrop-blur-sm transition-colors"
            >
              {language === 'am' ? 'ለጠበቆች መመዝገቢያ' : 'Register Advocate Chamber'}
            </Link>
          </div>
        </div>
      </div>

      {/* SCROLL-LINKED 3D PERSPECTIVE LEGALLINK DASHBOARD STAGE (VIDEO 00:01–00:05.5) */}
      <div
        ref={stageTrackRef}
        className="relative bg-[#F5F7FC] -mt-12 sm:-mt-16 pt-4 pb-16 lg:pb-0 lg:h-[160vh]"
      >
        <div className="lg:sticky lg:top-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center lg:min-h-[78vh] relative">
          {/* LEFT EDITORIAL CALLOUT (Fades in as dashboard tilts right — Video 00:04–00:05.5) */}
          <div
            style={{
              opacity: leftNarrativeOpacity,
              transform: `translate3d(${leftNarrativeTranslate}px, 0, 0)`,
            }}
            className="lg:absolute lg:left-8 lg:max-w-sm w-full mb-10 lg:mb-0 z-10 space-y-4 text-center lg:text-left transition-opacity duration-150"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'am' ? 'የተቀናጀ የህግ መድረክ' : 'ONE ORGANIZED WORKSPACE'}</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141B2D] leading-tight">
              {language === 'am' ? (
                <>
                  የህግ ድጋፍ፣ በማንኛውም ጊዜ፣
                  <br />
                  ባሉበት ቦታ ሁሉ
                </>
              ) : (
                <>
                  Legal Support, Anytime,
                  <br />
                  Wherever You Are
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#647087] leading-relaxed">
              {language === 'am'
                ? 'በአዲስ አበባ፣ በክልል ከተሞች ወይም በዲያስፖራ ይሁኑ — ከተረጋገጡ ጠበቆች ጋር መገናኘት፣ ውሎችን ማዘጋጀት እና የጥያቄ ሁኔታን መከታተል አንድ ቦታ ላይ።'
                : 'Manage consultations, track advocate responses, draft bilingual contracts, and explore Ethiopian statutes with a seamless digital experience — whether in Addis Ababa or abroad.'}
            </p>

            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-2.5">
              <Link
                href="/find-a-lawyer"
                className="px-5 py-2.5 rounded-full bg-[#5D6DF7] hover:bg-[#4B5CE8] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm shadow-[#5D6DF7]/25 transition-all"
              >
                <span>{t('hero_cta_find')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#EEF2FA] text-[#141B2D] border border-[#DCE3F2] text-xs font-semibold transition-all"
              >
                {language === 'am' ? 'የደንበኛ ዳሽቦርድ' : 'Client Dashboard'}
              </Link>
            </div>
          </div>

          {/* FLOATING 3D LEGALLINK APP WORKSPACE MOCKUP */}
          <div
            style={{ transform: dashboardTransform }}
            className="ll-dashboard-frame w-full max-w-5xl rounded-[1.75rem] overflow-hidden z-20"
          >
            {/* App Top Chrome Bar */}
            <div className="px-5 py-3.5 border-b border-[#EDF1FA] bg-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-5 h-5 object-contain" />
                <span className="font-bold text-sm text-[#141B2D]">
                  Legal<span className="text-[#5D6DF7]">Link</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F7FC] border border-[#E6EBF6] text-[11px] text-[#7A859E] w-64">
                <Search className="w-3.5 h-3.5 text-[#8A94AC]" />
                <span>Search advocates, laws, templates...</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold">
                  MOJ Verified
                </span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#5D6DF7] to-[#8EA2FF] text-white text-[10px] font-bold flex items-center justify-center">
                  YS
                </div>
              </div>
            </div>

            {/* App Interior Grid: Sidebar + Main Cards + Right Activity Column */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-[#FAFBFD]">
              {/* Left App Sidebar */}
              <aside className="hidden md:flex md:col-span-3 flex-col justify-between p-4 border-r border-[#EDF1FA] bg-white text-[11px] font-medium text-[#647087]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#ECEFFE] text-[#4F61F0] font-semibold">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F5F7FC]">
                    <span className="flex items-center gap-2.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Inquiries</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#5D6DF7] text-white text-[9px] font-bold">
                      3
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F7FC]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>LexDraft Forms</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F7FC]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Federal Laws</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F5F7FC]">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Diaspora Desk</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#EDF1FA] space-y-1 text-[10px] text-[#8A94AC]">
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5D6DF7]" />
                    <span>Proc. No. 1249/2021</span>
                  </div>
                </div>
              </aside>

              {/* Center Dashboard Column */}
              <div className="md:col-span-6 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#141B2D]">Legal Workspace</span>
                  <span className="text-[10px] font-medium text-[#7A859E]">Addis Ababa • Live</span>
                </div>

                {/* Top Cards Row: Soft Periwinkle Advocate Card + 2 Mini Status Tiles (Matches Credix Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Soft Periwinkle Gradient Advocate Credential Card */}
                  <div className="sm:col-span-6 rounded-2xl p-4 bg-gradient-to-br from-[#E2E8FD] via-[#EEF2FE] to-[#DCE4FC] border border-[#D4DDFB] flex flex-col justify-between min-h-[118px]">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-full bg-white text-[#5D6DF7] flex items-center justify-center shadow-2xs">
                        <Scale className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#4F61F0] bg-white/80 px-2 py-0.5 rounded-full">
                        Verified Counsel
                      </span>
                    </div>
                    <div className="space-y-0.5 pt-4">
                      <strong className="text-xs font-bold text-[#141B2D] block">
                        Adv. Mulu Haile
                      </strong>
                      <span className="text-[10px] font-mono text-[#526080] block">
                        ETH-BAR-2018-0492 • Supreme Court
                      </span>
                    </div>
                  </div>

                  {/* Mini Tile 1 */}
                  <div className="sm:col-span-3 rounded-2xl p-3.5 bg-white border border-[#E6EBF6] flex flex-col justify-between">
                    <div className="w-7 h-7 rounded-xl bg-[#141B2D] text-white flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <div className="pt-3">
                      <span className="text-[10px] text-[#7A859E] block">Voice Brief</span>
                      <strong className="text-xs font-bold text-[#141B2D]">Amharic / EN</strong>
                    </div>
                  </div>

                  {/* Mini Tile 2 */}
                  <div className="sm:col-span-3 rounded-2xl p-3.5 bg-white border border-[#E6EBF6] flex flex-col justify-between">
                    <div className="w-7 h-7 rounded-xl bg-[#5D6DF7] text-white flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div className="pt-3">
                      <span className="text-[10px] text-[#7A859E] block">LexDraft</span>
                      <strong className="text-xs font-bold text-[#141B2D]">Word Ready</strong>
                    </div>
                  </div>
                </div>

                {/* Recent Inquiries List (Matches Credix Recent Transactions) */}
                <div className="bg-white rounded-2xl border border-[#E6EBF6] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#141B2D]">Recent Legal Matters</span>
                    <span className="text-[10px] text-[#5D6DF7] font-semibold">Live Sync</span>
                  </div>

                  <div className="divide-y divide-[#F1F4FA] text-[11px]">
                    {[
                      {
                        title: 'PLC Articles & Registration',
                        sub: 'Corporate Law • Addis Ababa',
                        badge: 'Accepted',
                        badgeClass: 'bg-emerald-50 text-emerald-700',
                      },
                      {
                        title: 'Embassy Power of Attorney (ውክልና)',
                        sub: 'Diaspora Desk • Remote Video',
                        badge: 'In Review',
                        badgeClass: 'bg-[#ECEFFE] text-[#4F61F0]',
                      },
                      {
                        title: 'Commercial Lease Review',
                        sub: 'Property Law • Bole Sub-City',
                        badge: 'Draft Ready',
                        badgeClass: 'bg-slate-100 text-[#141B2D]',
                      },
                    ].map((row, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <strong className="text-[#141B2D] font-semibold block truncate">
                            {row.title}
                          </strong>
                          <span className="text-[10px] text-[#7A859E] block">{row.sub}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${row.badgeClass}`}
                        >
                          {row.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Curve Visual + Quick Document Cards (Matches Credix Right Rail) */}
              <div className="md:col-span-3 p-5 border-t md:border-t-0 md:border-l border-[#EDF1FA] bg-white space-y-5">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7A859E] font-medium block">
                    Resolution Clarity
                  </span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-lg font-bold text-[#141B2D]">Bilingual</strong>
                    <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> Fast Match
                    </span>
                  </div>
                  {/* Smooth Minimal Wave SVG Curve */}
                  <svg viewBox="0 0 180 68" className="w-full h-16 mt-2 overflow-visible">
                    <defs>
                      <linearGradient id="llCurveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5D6DF7" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#5D6DF7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 54 C 28 46, 38 18, 66 28 C 92 38, 108 10, 134 22 C 154 32, 166 14, 180 12 L 180 68 L 0 68 Z"
                      fill="url(#llCurveFill)"
                    />
                    <path
                      d="M0 54 C 28 46, 38 18, 66 28 C 92 38, 108 10, 134 22 C 154 32, 166 14, 180 12"
                      fill="none"
                      stroke="#5D6DF7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="108" cy="20" r="3.5" fill="#141B2D" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#EDF1FA]">
                  <span className="text-[10px] font-bold text-[#141B2D] block">
                    Ready Legal Modules
                  </span>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#ECEFFE] to-[#F5F7FC] border border-[#DCE3FB] flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#141B2D]">LexDraft Studio</span>
                    <span className="text-[10px] font-bold text-[#5D6DF7]">EN / አማ</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F7FC] border border-[#E6EBF6] flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#141B2D]">LegalTalk Audio</span>
                    <span className="text-[10px] font-bold text-[#647087]">10 Guides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4. MINIMAL MONOCHROME ECOSYSTEM TICKER (VIDEO 00:06–00:08)
   ========================================================================= */
export function EcosystemLogoTicker() {
  const items = [
    { label: 'Verified Advocates', icon: ShieldCheck },
    { label: 'LexDraft Bilingual', icon: FileText },
    { label: 'LegalTalk Audio', icon: BookOpen },
    { label: 'Diaspora Desk', icon: Globe },
    { label: 'NextGen Law Hub', icon: Users },
    { label: 'Federal Statutes', icon: Scale },
  ];

  const doubled = [...items, ...items, ...items];

  return (
    <div className="ll-ticker-wrapper py-8 border-y border-[#E6EBF6] bg-[#F5F7FC] overflow-hidden select-none">
      <div className="ll-ticker-track">
        {doubled.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-8 text-[#8C96AD] hover:text-[#141B2D] transition-colors shrink-0"
            >
              <Icon className="w-4 h-4 opacity-80" />
              <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   5. CREDIX-STYLE CENTERED FEATURES 3x2 ICON GRID (VIDEO 00:07.5–00:09.5)
   ========================================================================= */
export function FeaturesCleanSixGrid() {
  const { language } = useLanguage();

  const features = [
    {
      icon: ShieldCheck,
      title: language === 'am' ? 'የተረጋገጡ ጠበቆች' : 'Verified Credentials',
      desc:
        language === 'am'
          ? 'የፍትህ ሚኒስቴር እና የክልል ፍቃድ ማረጋገጫ ያላቸው ጠበቆች በአንድ መድረክ።'
          : 'Connect effortlessly with advocates vetted under Proclamation No. 1249/2021.',
    },
    {
      icon: Zap,
      title: language === 'am' ? 'ፈጣን ምላሽና ግንኙነት' : 'Rapid Matching',
      desc:
        language === 'am'
          ? 'በጽሑፍ ወይም በድምፅ ጉዳይዎን አስገብተው ከተስማሚ ጠበቃ ጋር በደቂቃዎች ይገናኙ።'
          : 'Submit a structured text or voice brief and route directly to the right specialist.',
    },
    {
      icon: Sliders,
      title: language === 'am' ? 'ቀላል የውል ዝግጅት' : 'Guided LexDraft',
      desc:
        language === 'am'
          ? 'በአማርኛ እና በእንግሊዝኛ ዝግጁ ውሎችን እና የፍርድ ቤት ማመልከቻዎችን ያዘጋጁ።'
          : 'Tailor bilingual Ethiopian contracts, leases, and PoA drafts ready for Word export.',
    },
    {
      icon: Lock,
      title: language === 'am' ? 'ሚስጥራዊ እና የተጠበቀ' : 'Private Continuity',
      desc:
        language === 'am'
          ? 'የደንበኛ መረጃዎች በደህንነት ደንቦች የተጠበቁ እና በዳሽቦርድ የሚከታተሉ ናቸው።'
          : 'Track every consultation from submission to completion in your private dashboard.',
    },
    {
      icon: BookOpen,
      title: language === 'am' ? 'ግልጽ የህግ እውቀት' : 'Practical Insights',
      desc:
        language === 'am'
          ? 'በድምፅ የሚደመጡ የሊጋልቶክ ጽሑፎች፣ መዝገበ ቃላት እና የፌዴራል አዋጆች።'
          : 'Plain-language LegalTalk audio guides, bilingual dictionary, and federal statutes.',
    },
    {
      icon: Globe,
      title: language === 'am' ? 'የዲያስፖራ ድጋፍ' : 'Access Beyond Borders',
      desc:
        language === 'am'
          ? 'በውጭ ሀገር ለሚኖሩ ኢትዮጵያውያን የኤምባሲ ውክልና እና የንብረት ድጋፍ።'
          : 'Seamless remote access to verified Ethiopian counsel from anywhere in the world.',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F5F7FC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
            {language === 'am' ? 'ዋና ዋና ባህሪያት' : 'FEATURES'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#141B2D] tracking-tight leading-tight">
            {language === 'am'
              ? 'የህግ አገልግሎት ቀላል፣ አስተማማኝ እና ዘመናዊ'
              : 'Legal Access Made Simple, Secure, and Smart'}
          </h2>
          <p className="text-xs sm:text-sm text-[#647087] leading-relaxed max-w-lg mx-auto">
            {language === 'am'
              ? 'በግልጽነት እና በቴክኖሎጂ ላይ የተገነባ — መብትዎን እና ጉዳይዎን በአንድ ቦታ ለማስተዳደር።'
              : 'Built on a foundation of trust and clarity, ensuring your legal matters are organized from discovery to resolution.'}
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <RevealOnScroll
                key={idx}
                delayMs={idx * 75}
                className="text-center space-y-3 px-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-[#E4E9F5] shadow-xs flex items-center justify-center mx-auto text-[#141B2D]">
                  <Icon className="w-5 h-5 text-[#4F61F0]" />
                </div>
                <h3 className="text-base font-semibold text-[#141B2D]">{item.title}</h3>
                <p className="text-xs sm:text-[13px] text-[#647087] leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   6. SKY-GRADIENT INSTITUTIONAL & PARTNERSHIPS CTA
   ========================================================================= */
export function SkyPartnersCTA() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] ll-sky-canvas px-6 py-16 sm:py-20 text-center shadow-lg shadow-[#4A74BA]/15">
      <div className="ll-cloud-layer-a absolute inset-0 pointer-events-none opacity-80" aria-hidden="true" />
      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-[10px] font-bold uppercase tracking-widest">
          <Scale className="w-3.5 h-3.5" />
          <span>INSTITUTIONS, UNIVERSITIES &amp; PARTNERS</span>
        </span>

        <h3 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(25,52,108,0.2)]">
          Building a More Connected Legal Ecosystem Across Ethiopia
        </h3>

        <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
          Explore our mission, values, founding leadership, and institutional partnership tracks for universities, legal aid NGOs, corporates, and donors.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold text-xs transition-all"
          >
            About LegalLink
          </Link>
          <Link
            href="/about#partnerships"
            className="px-6 py-3 rounded-full bg-white hover:bg-[#F5F7FC] text-[#141B2D] font-bold text-xs inline-flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#5D6DF7]" />
          </Link>
        </div>
      </div>
    </div>
  );
}