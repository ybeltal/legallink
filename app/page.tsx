'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  Building2,
  Users,
  Home as HomeIcon,
  Briefcase,
  Scale,
  Globe,
  CheckCircle2,
  Lock,
  Languages,
  Mail,
  Phone,
  MapPin,
  Headphones,
  FileText,
  BookOpen,
  Plus,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroBookingCard from '@/components/HeroBookingCard';
import ClientTestimonialsCarousel from '@/components/ClientTestimonialsCarousel';
import {
  RevealOnScroll,
  KineticHeadline,
  SkyDashboardPreview,
  SpotlightCard,
  KineticMarquee,
  InteractiveSilkHowItWorks,
  VerticalKineticWaveStack,
  RadarPulseEcosystemCTA,
} from '@/components/MotionPrimitives';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const practiceAreas = [
    { title: t('pa_corp_title'), desc: t('pa_corp_desc'), icon: Building2, slug: 'corporate' },
    { title: t('pa_family_title'), desc: t('pa_family_desc'), icon: Users, slug: 'family' },
    { title: t('pa_prop_title'), desc: t('pa_prop_desc'), icon: HomeIcon, slug: 'property' },
    { title: t('pa_ip_title'), desc: t('pa_ip_desc'), icon: Sparkles, slug: 'ip' },
    { title: t('pa_labor_title'), desc: t('pa_labor_desc'), icon: Briefcase, slug: 'employment' },
    { title: t('pa_crim_title'), desc: t('pa_crim_desc'), icon: Scale, slug: 'criminal' },
    { title: t('pa_imm_title'), desc: t('pa_imm_desc'), icon: Globe, slug: 'immigration' },
    { title: t('pa_ngo_title'), desc: t('pa_ngo_desc'), icon: ShieldCheck, slug: 'ngo' },
  ];

  const featuredLawyers = [
    {
      initials: 'MH',
      name: language === 'am' ? 'ጠበቃ ሙሉ ኃይሌ' : 'Adv. Mulu Haile',
      role: language === 'am' ? 'የንግድና ኩባንያ ሕግ' : 'Corporate & Business Law',
      location: 'Addis Ababa',
      rating: '5.0',
      standing: 'Supreme Court',
      experience: '12',
      bio: 'Specializes in company formation, M&A transactions, and corporate governance.',
      amharicBio: 'በኩባንያ ምስረታ፣ የንግድ ውህደት እና ኮርፖሬት ተገዢነት ላይ ልዩ ልምድ ያካበቱ።',
      category: 'corporate',
    },
    {
      initials: 'TB',
      name: language === 'am' ? 'ጠበቃ ትዕግሥት በቀለ' : 'Adv. Tigist Bekele',
      role: language === 'am' ? 'የቤተሰብ ሕግ' : 'Family Law',
      location: 'Addis Ababa',
      rating: '4.9',
      standing: 'High Court',
      experience: '9',
      bio: 'Experienced in divorce proceedings, child custody, adoption, and inheritance.',
      amharicBio: 'በፍቺ ስምምነት፣ የልጆች አስተዳደግና የውርስ ሀብት ክፍፍል ላይ የ9 ዓመታት የሙግት ልምድ።',
      category: 'family',
    },
    {
      initials: 'DT',
      name: language === 'am' ? 'ጠበቃ ዳዊት ተስፋዬ' : 'Adv. Dawit Tesfaye',
      role: language === 'am' ? 'የመሬትና ይዞታ ሕግ' : 'Property & Real Estate',
      location: 'Bahir Dar',
      rating: '4.9',
      standing: 'Supreme Court',
      experience: '15',
      bio: 'Handles land rights, title transfers, lease agreements, and property disputes.',
      amharicBio: 'በይዞታ መብት፣ የካርታ ትክክለኛነት ማረጋገጫና የሪል እስቴት ክርክሮች ላይ የ15 ዓመታት ልምድ።',
      category: 'property',
    },
    {
      initials: 'SG',
      name: language === 'am' ? 'ጠበቃ ሰላማዊት ግርማ' : 'Adv. Selamawit Girma',
      role: language === 'am' ? 'ኢሚግሬሽንና ዲያስፖራ' : 'Immigration & Diaspora Law',
      location: 'Addis Ababa',
      rating: '4.9',
      standing: 'Supreme Court',
      experience: '8',
      bio: 'Expert in Ethiopian immigration law, diaspora powers of attorney, and cross-border estates.',
      amharicBio: 'በኢሚግሬሽን፣ የዲያስፖራ ውክልናዎችና የድንበር ተሻጋሪ ንብረት አስተዳደር ላይ የካበተ ልምድ።',
      category: 'immigration',
    },
  ];

  const featuredGuides = [
    {
      href: '/legaltalk/starting-a-business-ethiopia-2026',
      image: '/images/legaltalk/starting-business.jpg',
      tag: t('lt_art1_tag'),
      title: t('lt_art1_title'),
      desc: t('lt_art1_desc'),
      meta: 'May 28, 2026 • 8 min read',
      audio: '3:10',
    },
    {
      href: '/legaltalk/wrongful-termination-ethiopia',
      image: '/images/legaltalk/wrongful-termination.jpg',
      tag: t('lt_art3_tag'),
      title: t('lt_art3_title'),
      desc: t('lt_art3_desc'),
      meta: 'June 15, 2026 • 6 min read',
      audio: '2:45',
    },
    {
      href: '/legaltalk/ethiopian-diaspora-property-ownership',
      image: '/images/legaltalk/diaspora-property.jpg',
      tag: language === 'am' ? 'የዲያስፖራ መብት' : 'Diaspora',
      title:
        language === 'am'
          ? 'የኢትዮጵያ ዲያስፖራ በአገሩ ንብረት ባለቤት መሆን ይችላል?'
          : 'Can the Ethiopian Diaspora Own Property in Ethiopia? A Legal Explainer',
      desc:
        language === 'am'
          ? 'የቢጫ ካርድ ባለመብቶች በመኖሪያና በንግድ ቤቶች ላይ ያላቸው ህጋዊ የይዞታና የባለቤትነት መብት።'
          : 'Understanding Yellow Card property rights, municipal land lease transfers, and succession rules.',
      meta: 'March 22, 2026 • 5 min read',
      audio: '2:15',
    },
  ];

  const heroPillars = [
    {
      icon: ShieldCheck,
      title: language === 'am' ? 'የተረጋገጡ ጠበቆች' : 'Verified Advocates',
      sub: language === 'am' ? 'የተፈቀደ የጥብቅና መረብ' : 'Licensed Counsel',
    },
    {
      icon: FileText,
      title: language === 'am' ? 'ቀላል ሰነድ ዝግጅት' : 'Guided Drafting',
      sub: language === 'am' ? 'ዝግጁ የውል ቅጾች' : 'Structured Templates',
    },
    {
      icon: BookOpen,
      title: language === 'am' ? 'ግልጽ የህግ እውቀት' : 'Legal Knowledge',
      sub: language === 'am' ? 'ጽሑፎች እና አዋጆች' : 'Guides & Statutes',
    },
    {
      icon: Languages,
      title: language === 'am' ? 'ባለሁለት ቋንቋ' : 'Bilingual Access',
      sub: language === 'am' ? 'አማርኛ እና እንግሊዝኛ' : 'Amharic & English',
    },
  ];

  const faqItems = [
    {
      q: 'How does LegalLink connect clients with verified Ethiopian advocates?',
      a: 'You choose your practice area, city, and preferred language, then describe your matter by text or voice brief. LegalLink routes your inquiry directly to your chosen advocate and lets you track updates inside your private Client Dashboard.',
    },
    {
      q: 'Are advocates on LegalLink verified under Ethiopian law?',
      a: 'Yes. Advocates submit their Federal Ministry of Justice or Regional Bar license numbers, court standing, and full professional CV for review under Proclamation No. 1249/2021 before receiving a verified badge.',
    },
    {
      q: 'Can Ethiopians living abroad use LegalLink for property or Power of Attorney matters?',
      a: 'Yes. Our Ethiopian Diaspora Legal Hub connects you remotely with local advocates in Addis Ababa and regional cities for Embassy Powers of Attorney (ውክልና), title deed (ካርታ) audits, and estate succession.',
    },
    {
      q: 'What documents can I generate with LexDraft?',
      a: 'LexDraft helps you draft bilingual Amharic and English employment contracts, commercial leases, powers of attorney, PLC articles of association, and court applications ready to download as Word documents.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      {/* 01. Adaptive Navigation Bar (Transparent over Sky -> Frosted White on Scroll) */}
      <Navbar />

      {/* 02. Sky Azure Hero Section with Creative Sky-Sculpted Lady Justice & Floating Workspace */}
      <section className="relative -mt-16 sm:-mt-20 pt-28 sm:pt-36 pb-20 md:pb-28 overflow-hidden ll-sky-canvas">
        {/* Drifting Sunlit Cloud Wisps */}
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-14 -left-24 w-[480px] h-[220px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-28 -right-24 w-[520px] h-[240px] rounded-full bg-white/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-72 left-1/4 w-[620px] h-[200px] rounded-full bg-white/35 blur-3xl"
        />

        {/* Creative Lady Justice Rising Through the Sky Behind the Hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-10 sm:top-12 flex justify-center items-start z-0 select-none overflow-hidden"
        >
          {/* Warm Sunlit Halo Behind Lady Justice */}
          <div className="ll-justice-halo absolute top-6 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full bg-radial from-white/55 via-amber-200/25 to-transparent blur-2xl" />
          <img
            src="/lady-justice.png"
            alt=""
            className="w-[330px] sm:w-[460px] lg:w-[520px] h-auto object-contain animate-float-slow mask-radial-fade opacity-30 sm:opacity-35 mix-blend-luminosity drop-shadow-[0_18px_40px_rgba(24,34,53,0.18)]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Centered Sky Hero Copy & Glass Pill Bar (Matches Video 00:00.500–00:02.000) */}
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/35 backdrop-blur-md text-xs font-bold shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
              <span>{t('hero_badge')}</span>
            </div>

            <KineticHeadline primaryText={t('hero_title_1')} accentText={t('hero_title_2')} />

            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium max-w-xl mx-auto drop-shadow-2xs">
              {t('hero_sub')}
            </p>

            {/* Frosted Glass Pill Action Bar (Mirrors Credix Email/Open Account Pill) */}
            <div className="max-w-lg mx-auto p-1.5 rounded-full bg-white/25 border border-white/45 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Link
                href="/find-a-lawyer"
                className="flex-1 px-5 py-3 rounded-full text-left text-xs font-bold text-white hover:bg-white/15 transition-colors flex items-center justify-between"
              >
                <span>{t('hero_cta_find')}</span>
                <span className="text-[11px] font-mono text-white/80">MOJ Verified</span>
              </Link>
              <Link
                href="/lexdraft"
                className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-[#182235] font-black text-xs inline-flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <span>{language === 'am' ? 'ሰነድ ያዘጋጁ' : 'Draft Forms'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3B66B8]" />
              </Link>
            </div>

            {/* 4 Generic Ecosystem Glass Pills */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {heroPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="p-3 rounded-2xl bg-white/75 backdrop-blur-md border border-white/80 text-center shadow-xs space-y-1"
                  >
                    <Icon className="w-4 h-4 text-[#3B66B8] mx-auto" />
                    <div className="text-xs font-black text-[#182235] leading-snug">
                      {pillar.title}
                    </div>
                    <span className="text-[10px] text-slate-600 font-semibold block">
                      {pillar.sub}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overlapping Floating LegalLink Workspace Preview Window (Video 00:01–00:03.5) */}
          <SkyDashboardPreview />
        </div>
      </section>

      {/* 03. Clean Horizontal Capability Strip (Video 00:06.5) */}
      <KineticMarquee
        items={[
          'Verified Ethiopian Advocates',
          'Bilingual LexDraft Forms',
          'Federal Legal Library',
          'LegalTalk Audio Guides',
          'Diaspora Legal Desk',
          'NextGen Student Hub',
        ]}
      />

      {/* 04. Asymmetric Split Section with 3D-Tilted Floating Consultation Card (Video 00:04–00:06) */}
      <section
        id="consultation-spotlight"
        className="py-20 md:py-28 bg-white border-b border-slate-200/80 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5] text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3B66B8]" />
                <span>{language === 'am' ? 'ቀጥተኛ የህግ ማማከር' : 'Direct Advocate Matching'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-[#182235] tracking-tight leading-tight">
                {language === 'am'
                  ? 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር በቀጥታ ይገናኙ'
                  : 'Connect with Verified Counsel in Minutes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {language === 'am'
                  ? 'ጉዳይዎን በአጭሩ ይግለጹና ከሚመለከተው የኢትዮጵያ ጠበቃ ጋር በቀጥታ ይገናኙ።'
                  : 'Submit your legal matter by practice area, city, and preferred language — by text or voice brief. LegalLink routes your inquiry directly to verified advocates with full continuity.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-[#182235] max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                  <span>{language === 'am' ? 'ቀላል እና ግልጽ የጥያቄ ሂደት' : 'Structured, transparent inquiry flow'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                  <span>{language === 'am' ? 'በስልክ፣ በቪዲዮ ወይም በቢሮ መገናኘት' : 'Phone, video, or chamber office visits'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                  <span>{language === 'am' ? 'በፍትህ ሚኒስቴር ፍቃድ የተረጋገጡ ጠበቆች' : 'Ministry of Justice license checks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                  <span>{language === 'am' ? 'ሚስጥራዊ የደንበኛ መረጃ አያያዝ' : 'Private, role-restricted inquiry handling'}</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* 3D Perspective-Tilted Floating Consultation Card (Video 00:04.5) */}
            <RevealOnScroll
              delayMs={140}
              className="lg:col-span-6 flex justify-center ll-perspective-stage"
            >
              <div className="ll-tilt-card w-full flex justify-center">
                <HeroBookingCard />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 05. Interactive 3-Step Sky-Silk Stage ("How It Works") */}
      <InteractiveSilkHowItWorks />

      {/* 06. Practice Areas (Centered Pill Badge + Staggered Grid — Video 00:07–00:09) */}
      <section className="py-20 md:py-28 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-bold text-[#3B66B8] uppercase tracking-widest font-mono">
              {t('pa_tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#182235]">{t('pa_title')}</h2>
            <p className="text-xs sm:text-sm text-slate-600">{t('pa_sub')}</p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {practiceAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <RevealOnScroll key={idx} delayMs={idx * 45}>
                  <Link href={`/find-a-lawyer?category=${area.slug}`} className="block h-full group">
                    <SpotlightCard className="p-6 rounded-3xl h-full flex flex-col justify-between space-y-4 text-center items-center">
                      <div className="space-y-3 relative z-10 flex flex-col items-center">
                        <div className="w-11 h-11 rounded-2xl bg-[#182235] text-white flex items-center justify-center group-hover:bg-[#3B66B8] transition-colors shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-[#182235]">{area.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {area.desc}
                        </p>
                      </div>
                      <div className="pt-1 text-xs font-bold text-[#3B66B8] group-hover:translate-x-1 transition-transform flex items-center gap-1 relative z-10">
                        <span>Explore →</span>
                      </div>
                    </SpotlightCard>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 hover:border-[#3B66B8] bg-white text-xs font-bold text-[#182235] transition-all"
            >
              <span>{t('pa_browse_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3B66B8]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 07. Featured Advocates */}
      <section className="py-20 md:py-28 bg-[#F5F7FB] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-bold text-[#3B66B8] uppercase tracking-widest font-mono">
                {t('fl_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#182235]">{t('fl_title')}</h2>
              <p className="text-xs text-slate-600">{t('fl_sub')}</p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-5 py-2.5 border border-slate-300 hover:border-[#3B66B8] rounded-full bg-white text-xs font-bold text-[#182235] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>{t('fl_view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3B66B8]" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLawyers.map((lawyer, idx) => (
              <RevealOnScroll key={idx} delayMs={idx * 65}>
                <SpotlightCard className="rounded-3xl p-6 h-full flex flex-col justify-between space-y-5">
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#3B66B8] text-white font-black flex items-center justify-center text-xs shrink-0">
                        {lawyer.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <strong className="text-xs font-bold text-[#182235] truncate">
                            {lawyer.name}
                          </strong>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-600 block truncate">
                          {lawyer.role}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{lawyer.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-[#182235]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{lawyer.rating}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                        Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-center font-mono">
                      <div className="p-1.5 bg-[#F5F7FB] rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          {language === 'am' ? 'ችሎት' : 'Standing'}
                        </span>
                        <strong className="text-[11px] text-[#182235]">{lawyer.standing}</strong>
                      </div>
                      <div className="p-1.5 bg-[#F5F7FB] rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          {t('fl_yrs_exp')}
                        </span>
                        <strong className="text-[11px] text-[#182235]">{lawyer.experience} yrs</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                    </p>
                  </div>

                  <Link
                    href={`/find-a-lawyer?category=${lawyer.category}`}
                    className="relative z-10 w-full py-2.5 bg-[#EEF3FB] hover:bg-[#3B66B8] text-[#3B66B8] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 group"
                  >
                    <span>{t('fl_view_profile')}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 08. Ethiopian Diaspora Legal Desk (Sky-Blue Horizon Banner) */}
      <section className="relative bg-gradient-to-br from-[#2E55A5] via-[#3B66B8] to-[#5784D6] text-white py-20 md:py-28 overflow-hidden">
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute -top-20 right-10 w-[440px] h-[220px] rounded-full bg-white/15 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <RevealOnScroll className="max-w-3xl space-y-3">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-mono text-white uppercase tracking-widest font-bold">
              {t('diaspora_tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {t('diaspora_title')}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              {t('diaspora_sub')}
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealOnScroll delayMs={0}>
              <div className="p-7 rounded-3xl h-full space-y-3 bg-white/12 backdrop-blur-md border border-white/25">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B66B8] flex items-center justify-center font-black">
                  ው
                </div>
                <h3 className="text-sm font-bold text-white">{t('diaspora_poa_title')}</h3>
                <p className="text-xs text-white/85 leading-relaxed font-normal">
                  {t('diaspora_poa_desc')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <div className="p-7 rounded-3xl h-full space-y-3 bg-white/12 backdrop-blur-md border border-white/25">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B66B8] flex items-center justify-center font-black">
                  ካ
                </div>
                <h3 className="text-sm font-bold text-white">{t('diaspora_land_title')}</h3>
                <p className="text-xs text-white/85 leading-relaxed font-normal">
                  {t('diaspora_land_desc')}
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={180}>
              <div className="p-7 rounded-3xl h-full space-y-3 bg-white/12 backdrop-blur-md border border-white/25">
                <div className="w-10 h-10 rounded-xl bg-white text-[#3B66B8] flex items-center justify-center font-black">
                  ውር
                </div>
                <h3 className="text-sm font-bold text-white">{t('diaspora_est_title')}</h3>
                <p className="text-xs text-white/85 leading-relaxed font-normal">
                  {t('diaspora_est_desc')}
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/20">
            <span className="text-xs text-white/90">
              Remote advocate access for Ethiopian diaspora clients worldwide.
            </span>
            <Link
              href="/diaspora"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-[#182235] font-black text-xs rounded-full flex items-center gap-2 transition-all shadow-md group cursor-pointer"
            >
              <span>{t('diaspora_cta_btn')}</span>
              <ArrowRight className="w-4 h-4 text-[#3B66B8] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 09. LexDraft Document Automation with Sinusoidal Kinetic Wave Stack */}
      <section id="lexdraft" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#3B66B8]" />
                <span>{t('lex_pill')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#182235] tracking-tight">
                {t('lex_title')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
                {t('lex_sub')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  t('lex_item1'),
                  t('lex_item2'),
                  t('lex_item3'),
                  t('lex_item4'),
                  t('lex_item5'),
                  t('lex_item6'),
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#182235]">
                    <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lexdraft"
                  className="px-6 py-3.5 bg-[#182235] hover:bg-[#24324d] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer"
                >
                  <span>{t('lex_cta_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/library"
                  className="px-6 py-3.5 bg-[#F5F7FB] hover:bg-slate-100 text-[#182235] border border-slate-200 font-bold text-xs rounded-full flex items-center justify-center transition-all cursor-pointer"
                >
                  <span>{language === 'am' ? 'የፌዴራል አዋጆችን ያንብቡ' : 'Browse Federal Laws'}</span>
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={140} className="lg:col-span-6">
              <VerticalKineticWaveStack />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 10. LegalTalk Knowledge Hub */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[#3B66B8] text-[10px] font-bold uppercase tracking-wider font-mono">
                {t('lt_pill')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#182235]">{t('lt_title')}</h2>
              <p className="text-xs text-slate-600">{t('lt_sub')}</p>
            </div>
            <Link
              href="/legaltalk"
              className="px-5 py-2.5 border border-slate-300 hover:border-[#3B66B8] rounded-full bg-white text-xs font-bold text-[#182235] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>{t('lt_explore_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3B66B8]" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGuides.map((guide, idx) => (
              <RevealOnScroll key={guide.href} delayMs={idx * 80}>
                <Link href={guide.href} className="block h-full group">
                  <SpotlightCard className="rounded-3xl overflow-hidden h-full flex flex-col">
                    <div className="h-44 relative overflow-hidden bg-[#182235] flex flex-col justify-end p-4">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#182235]/90 via-[#182235]/25 to-transparent" />
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#182235]/80 border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                          {guide.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#182235] text-[10px] font-mono font-black">
                          <Headphones className="w-3 h-3 text-[#3B66B8]" />
                          <span>{guide.audio}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4 relative z-10">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#182235] group-hover:text-[#3B66B8] transition-colors leading-snug">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                          {guide.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-[11px] text-slate-500 font-mono">{guide.meta}</div>
                    </div>
                  </SpotlightCard>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Auto-Rotating "What Our Clients Say" (Managed Live via /admin) */}
      <ClientTestimonialsCarousel />

      {/* 12. Why LegalLink Grid + Smooth Accordion FAQ + Radar CTA */}
      <section id="about" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Why LegalLink */}
          <div className="space-y-12">
            <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2.5">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-bold text-[#3B66B8] uppercase tracking-widest font-mono">
                {t('why_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#182235]">{t('why_title')}</h2>
              <p className="text-xs sm:text-sm text-slate-600">{t('why_sub')}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, color: 'text-emerald-600', title: t('why_c1_title'), desc: t('why_c1_desc') },
                { icon: Lock, color: 'text-[#182235]', title: t('why_c2_title'), desc: t('why_c2_desc') },
                { icon: Scale, color: 'text-[#3B66B8]', title: t('why_c3_title'), desc: t('why_c3_desc') },
                { icon: Languages, color: 'text-amber-600', title: t('why_c4_title'), desc: t('why_c4_desc') },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <RevealOnScroll key={idx} delayMs={idx * 70}>
                    <SpotlightCard className="p-6 rounded-3xl h-full space-y-3 text-center flex flex-col items-center">
                      <div className="w-11 h-11 rounded-2xl bg-[#EEF3FB] flex items-center justify-center relative z-10">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <h3 className="text-sm font-black text-[#182235] relative z-10">{card.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                        {card.desc}
                      </p>
                    </SpotlightCard>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>

          {/* Smooth Animated FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-6">
            <RevealOnScroll className="text-center space-y-2.5">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono font-bold uppercase tracking-widest text-[#3B66B8]">
                COMMON QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
                Answers to Frequently Asked Questions
              </h2>
            </RevealOnScroll>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-colors ${
                      isOpen
                        ? 'bg-[#F5F7FB] border-[#B8CCF0]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
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
                        <p className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/70 pt-3">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concentric Radar Pulse & Glass Lenses CTA */}
          <RevealOnScroll>
            <RadarPulseEcosystemCTA />
          </RevealOnScroll>
        </div>
      </section>

      {/* 13. Official Footer */}
      <footer className="bg-[#182235] text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-black text-base text-white">
                  Legal<span className="text-amber-400">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
                {t('footer_tagline')}
              </p>

              <div className="space-y-1.5 text-slate-300 text-xs pt-1">
                <a
                  href="mailto:info.legallinkethiopia@gmail.com"
                  className="flex items-center gap-2 hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>info.legallinkethiopia@gmail.com</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>+251-964-600-737 / +251-905-941-865</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('footer_address')}</span>
                </div>
              </div>

              <p className="text-[11px] italic text-amber-300/90 pt-1">
                “{t('footer_motto')}”
              </p>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_platform_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/find-a-lawyer" className="hover:text-white transition-colors">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-white transition-colors">{t('nav_for_lawyers')}</Link></li>
                <li><Link href="/lexdraft" className="hover:text-white transition-colors">{t('nav_lexdraft')}</Link></li>
                <li><Link href="/diaspora" className="hover:text-white transition-colors">Diaspora Legal Hub</Link></li>
                <li><Link href="/nextgen" className="hover:text-white transition-colors">NextGen Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_resources_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/legal-center" className="hover:text-white transition-colors">Legal Center &amp; Dictionary</Link></li>
                <li><Link href="/library" className="hover:text-white transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white transition-colors">LegalTalk Audio Guides</Link></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Severance &amp; DARS Tools</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Client Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_company_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About LegalLink</Link></li>
                <li><Link href="/about#partnerships" className="hover:text-amber-300 text-amber-400 font-bold transition-colors">Partnerships &amp; Donors</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><span className="text-slate-500">Proc. No. 1249/2021</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}