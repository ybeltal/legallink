'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowDown,
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-200 selection:text-[#0A1128] flex flex-col">
      {/* 01. Crisp Frosted White Navigation Bar */}
      <Navbar />

      {/* 02. Volumetric Light-Blue Spotlight Hero Section (White Major) */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-[#F8FCFF] to-white">
        {/* Top-Down Volumetric Light-Blue Spotlight Beam */}
        <div className="ll-volumetric-beam" aria-hidden="true" />

        {/* Subtle Floating Legal Motes */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="ll-mote absolute top-24 left-[8%] font-mono text-xs text-sky-500/45">
            § Proc. 1249/2021
          </span>
          <span
            style={{ animationDelay: '-3s' }}
            className="ll-mote absolute top-36 right-[14%] font-mono text-xs text-blue-500/40"
          >
            አዋጅ 1156/2019
          </span>
          <span
            style={{ animationDelay: '-5s' }}
            className="ll-mote absolute bottom-28 left-[14%] font-mono text-xs text-sky-600/35"
          >
            Civil Code Art. 1731
          </span>
          <span
            style={{ animationDelay: '-2s' }}
            className="ll-mote absolute bottom-36 right-[20%] font-mono text-xs text-sky-500/40"
          >
            Commercial Code 1243/2021
          </span>
        </div>

        {/* Floating Lady Justice Watermark */}
        <div
          className="absolute right-[-4%] md:right-[2%] lg:right-[6%] top-1/2 -translate-y-1/2 w-[320px] sm:w-[460px] lg:w-[540px] h-full pointer-events-none z-0 flex items-center justify-center select-none"
          aria-hidden="true"
        >
          <div className="absolute w-[360px] h-[360px] bg-sky-200/45 rounded-full blur-3xl" />
          <img
            src="/lady-justice.png"
            alt=""
            className="w-full h-auto object-contain animate-float-slow mask-radial-fade opacity-35 md:opacity-45"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto lg:mx-0 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>{t('hero_badge')}</span>
            </div>

            {/* Word-by-Word Blur-to-Focus Kinetic Headline */}
            <KineticHeadline primaryText={t('hero_title_1')} accentText={t('hero_title_2')} />

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              {t('hero_sub')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-2 justify-center lg:justify-start">
              <Link
                href="/find-a-lawyer"
                className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-200 group cursor-pointer"
              >
                <span>{t('hero_cta_find')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/lexdraft"
                className="px-8 py-4 bg-white hover:bg-sky-50 text-[#0A1128] border border-sky-200 font-bold text-xs rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <span>{language === 'am' ? 'ህጋዊ ሰነዶችን ያዘጋጁ (LexDraft)' : 'Draft Legal Forms'}</span>
              </Link>
            </div>

            {/* 4 Generic Ecosystem Pillars */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto lg:mx-0">
              {heroPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <SpotlightCard
                    key={pillar.title}
                    className="p-3.5 rounded-2xl text-center space-y-1"
                  >
                    <Icon className="w-4 h-4 text-sky-600 mx-auto relative z-10" />
                    <div className="text-xs font-black text-[#0A1128] leading-snug relative z-10">
                      {pillar.title}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block relative z-10">
                      {pillar.sub}
                    </span>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>

          {/* Bottom-Right Scroll Indicator */}
          <div className="hidden md:flex justify-end pt-8">
            <a
              href="#consultation-spotlight"
              className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 hover:text-sky-600 transition-colors"
            >
              <span>Scroll to explore</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce text-sky-500" />
            </a>
          </div>
        </div>
      </section>

      {/* 03. Giant Horizontal Kinetic Marquee */}
      <KineticMarquee
        items={[
          'Verified Ethiopian Advocates',
          'Bilingual LexDraft Forms',
          'Federal Legal Library',
          'LegalTalk Audio Guides',
          'Diaspora Legal Desk',
        ]}
      />

      {/* 04. Direct Consultation Spotlight */}
      <section
        id="consultation-spotlight"
        className="py-20 md:py-28 bg-white border-b border-sky-100 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'am' ? 'ቀጥተኛ የህግ ማማከር' : 'Direct Advocate Matching'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
                {language === 'am'
                  ? 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር በቀጥታ ይገናኙ'
                  : 'Connect with Verified Counsel in Minutes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {language === 'am'
                  ? 'ጉዳይዎን በአጭሩ ይግለጹና ከሚመለከተው የኢትዮጵያ ጠበቃ ጋር በቀጥታ ይገናኙ።'
                  : 'Submit your legal matter by practice area, city, and preferred language — by text or voice brief. LegalLink routes your inquiry directly to verified advocates with full continuity.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{language === 'am' ? 'ቀላል እና ግልጽ የጥያቄ ሂደት' : 'Structured, transparent inquiry flow'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{language === 'am' ? 'በስልክ፣ በቪዲዮ ወይም በቢሮ መገናኘት' : 'Phone, video, or chamber office visits'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{language === 'am' ? 'በፍትህ ሚኒስቴር ፍቃድ የተረጋገጡ ጠበቆች' : 'Ministry of Justice license checks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{language === 'am' ? 'ሚስጥራዊ የደንበኛ መረጃ አያያዝ' : 'Private, role-restricted inquiry handling'}</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={140} className="lg:col-span-5 flex justify-center">
              <HeroBookingCard />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 05. Interactive 3-Step Silk-Wave Stage ("How It Works") */}
      <InteractiveSilkHowItWorks />

      {/* 06. Practice Areas (Pointer-Tracking White & Light-Blue Spotlight Grid) */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#F8FCFF] to-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
                {t('pa_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">{t('pa_title')}</h2>
              <p className="text-xs text-slate-600">{t('pa_sub')}</p>
            </div>
            <Link
              href="/practice-areas"
              className="px-4 py-2.5 border border-sky-200 hover:border-sky-400 rounded-xl bg-white text-xs font-bold text-[#0A1128] flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('pa_browse_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {practiceAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <RevealOnScroll key={idx} delayMs={idx * 45}>
                  <Link href={`/find-a-lawyer?category=${area.slug}`} className="block h-full group">
                    <SpotlightCard className="p-6 rounded-3xl h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-[#0A1128]">{area.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {area.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 relative z-10">
                        <span>→</span>
                      </div>
                    </SpotlightCard>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07. Featured Advocates */}
      <section className="py-20 md:py-28 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
                {t('fl_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">{t('fl_title')}</h2>
              <p className="text-xs text-slate-600">{t('fl_sub')}</p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2.5 border border-sky-200 hover:border-sky-400 rounded-xl bg-white text-xs font-bold text-[#0A1128] flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('fl_view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLawyers.map((lawyer, idx) => (
              <RevealOnScroll key={idx} delayMs={idx * 65}>
                <SpotlightCard className="rounded-3xl p-6 h-full flex flex-col justify-between space-y-5">
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                        {lawyer.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <strong className="text-xs font-bold text-[#0A1128] truncate">
                            {lawyer.name}
                          </strong>
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-600 block truncate">
                          {lawyer.role}
                        </span>
                        <span className="text-[10px] text-slate-500 block">{lawyer.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                        <span>{lawyer.rating}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[10px]">
                        Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-sky-100 text-center font-mono">
                      <div className="p-1.5 bg-sky-50/70 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          {language === 'am' ? 'ችሎት' : 'Standing'}
                        </span>
                        <strong className="text-[11px] text-[#0A1128]">{lawyer.standing}</strong>
                      </div>
                      <div className="p-1.5 bg-sky-50/70 rounded-xl">
                        <span className="text-[10px] text-slate-500 uppercase block">
                          {t('fl_yrs_exp')}
                        </span>
                        <strong className="text-[11px] text-[#0A1128]">{lawyer.experience} yrs</strong>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                    </p>
                  </div>

                  <Link
                    href={`/find-a-lawyer?category=${lawyer.category}`}
                    className="relative z-10 w-full py-2.5 bg-sky-50 hover:bg-sky-500 text-sky-800 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 group"
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

      {/* 08. Ethiopian Diaspora Legal Desk with Glowing Light-Blue Horizon Dome & Shooting Streaks */}
      <section className="relative bg-gradient-to-b from-[#E0F2FE]/60 via-[#F0F9FF] to-white text-[#0A1128] py-20 md:py-28 border-y border-sky-200/70 overflow-hidden">
        {/* Light-Blue Shooting Light Streaks */}
        <div className="ll-shooting-star top-12 left-[28%]" aria-hidden="true" />
        <div
          style={{ animationDelay: '3.4s' }}
          className="ll-shooting-star top-20 right-[18%]"
          aria-hidden="true"
        />

        {/* Glowing White & Sky-Blue Planetary Horizon Dome */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-72 left-1/2 -translate-x-1/2 w-[150vw] max-w-[1700px] h-[440px] rounded-[100%] bg-white border-t-2 border-sky-300 shadow-[0_-24px_80px_rgba(56,189,248,0.28)]"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <RevealOnScroll className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono text-sky-700 uppercase tracking-widest font-bold block">
              {t('diaspora_tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0A1128]">
              {t('diaspora_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {t('diaspora_sub')}
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevealOnScroll delayMs={0}>
              <SpotlightCard className="p-7 rounded-3xl h-full space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold relative z-10">
                  ው
                </div>
                <h3 className="text-sm font-bold text-[#0A1128] relative z-10">
                  {t('diaspora_poa_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal relative z-10">
                  {t('diaspora_poa_desc')}
                </p>
              </SpotlightCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={90}>
              <SpotlightCard className="p-7 rounded-3xl h-full space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold relative z-10">
                  ካ
                </div>
                <h3 className="text-sm font-bold text-[#0A1128] relative z-10">
                  {t('diaspora_land_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal relative z-10">
                  {t('diaspora_land_desc')}
                </p>
              </SpotlightCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={180}>
              <SpotlightCard className="p-7 rounded-3xl h-full space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold relative z-10">
                  ውር
                </div>
                <h3 className="text-sm font-bold text-[#0A1128] relative z-10">
                  {t('diaspora_est_title')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal relative z-10">
                  {t('diaspora_est_desc')}
                </p>
              </SpotlightCard>
            </RevealOnScroll>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sky-200/70">
            <span className="text-xs text-slate-600">
              Remote advocate access for Ethiopian diaspora clients worldwide.
            </span>
            <Link
              href="/diaspora"
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-sky-200 group cursor-pointer"
            >
              <span>{t('diaspora_cta_btn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 09. LexDraft Document Automation with Sinusoidal Kinetic Wave Stack */}
      <section id="lexdraft" className="py-20 md:py-28 bg-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>{t('lex_pill')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
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
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lexdraft"
                  className="px-6 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-sky-200 group cursor-pointer"
                >
                  <span>{t('lex_cta_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/library"
                  className="px-6 py-3.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
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
      <section className="py-20 md:py-28 bg-[#F8FCFF] border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider">
                {t('lt_pill')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">{t('lt_title')}</h2>
              <p className="text-xs text-slate-600">{t('lt_sub')}</p>
            </div>
            <Link
              href="/legaltalk"
              className="px-4 py-2.5 border border-sky-200 hover:border-sky-400 rounded-xl bg-white text-xs font-bold text-[#0A1128] flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('lt_explore_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGuides.map((guide, idx) => (
              <RevealOnScroll key={guide.href} delayMs={idx * 80}>
                <Link href={guide.href} className="block h-full group">
                  <SpotlightCard className="rounded-3xl overflow-hidden h-full flex flex-col">
                    <div className="h-44 relative overflow-hidden bg-sky-900 flex flex-col justify-end p-4">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128]/80 via-[#0A1128]/20 to-transparent" />
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[#0A1128] text-[10px] font-black uppercase tracking-wider">
                          {guide.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-mono font-black">
                          <Headphones className="w-3 h-3" />
                          <span>{guide.audio}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4 relative z-10">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-sky-700 transition-colors leading-snug">
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

      {/* 12. Why LegalLink Spotlight Bento + Smooth Accordion FAQ + Radar CTA */}
      <section id="about" className="py-20 md:py-28 bg-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Why LegalLink */}
          <div className="space-y-12">
            <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
                {t('why_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">{t('why_title')}</h2>
              <p className="text-xs sm:text-sm text-slate-600">{t('why_sub')}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, title: t('why_c1_title'), desc: t('why_c1_desc') },
                { icon: Lock, title: t('why_c2_title'), desc: t('why_c2_desc') },
                { icon: Scale, title: t('why_c3_title'), desc: t('why_c3_desc') },
                { icon: Languages, title: t('why_c4_title'), desc: t('why_c4_desc') },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <RevealOnScroll key={idx} delayMs={idx * 70}>
                    <SpotlightCard className="p-6 rounded-3xl h-full space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center relative z-10">
                        <Icon className="w-5 h-5 text-sky-600" />
                      </div>
                      <h3 className="text-sm font-bold text-[#0A1128] relative z-10">{card.title}</h3>
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
            <RevealOnScroll className="text-center space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-600 block">
                COMMON QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
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
                        ? 'bg-sky-50/70 border-sky-300'
                        : 'bg-white border-sky-100 hover:border-sky-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-[#0A1128]">{item.q}</span>
                      <Plus
                        className={`w-4 h-4 text-sky-600 shrink-0 transition-transform duration-300 ${
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
                        <p className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-sky-100 pt-3">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Concentric Radar Pulse & Light-Blue Glass Lenses CTA */}
          <RevealOnScroll>
            <RadarPulseEcosystemCTA />
          </RevealOnScroll>
        </div>
      </section>

      {/* 13. Clean Light-Blue Accent Footer */}
      <footer className="bg-[#F0F9FF] text-slate-600 border-t border-sky-200/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-black text-base text-[#0A1128]">
                  Legal<span className="text-sky-600">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
                {t('footer_tagline')}
              </p>

              <div className="space-y-1.5 text-slate-700 text-xs pt-1">
                <a
                  href="mailto:info.legallinkethiopia@gmail.com"
                  className="flex items-center gap-2 hover:text-sky-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>info.legallinkethiopia@gmail.com</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>+251-964-600-737 / +251-905-941-865</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{t('footer_address')}</span>
                </div>
              </div>

              <p className="text-[11px] italic text-sky-800 font-medium pt-1">
                “{t('footer_motto')}”
              </p>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-[#0A1128] uppercase tracking-wider block">
                {t('footer_platform_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-600">
                <li><Link href="/find-a-lawyer" className="hover:text-sky-700 transition-colors">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-sky-700 transition-colors">{t('nav_for_lawyers')}</Link></li>
                <li><Link href="/lexdraft" className="hover:text-sky-700 transition-colors">{t('nav_lexdraft')}</Link></li>
                <li><Link href="/diaspora" className="hover:text-sky-700 transition-colors">Diaspora Legal Hub</Link></li>
                <li><Link href="/nextgen" className="hover:text-sky-700 transition-colors">NextGen Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-[#0A1128] uppercase tracking-wider block">
                {t('footer_resources_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-600">
                <li><Link href="/legal-center" className="hover:text-sky-700 transition-colors">Legal Center &amp; Dictionary</Link></li>
                <li><Link href="/library" className="hover:text-sky-700 transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-sky-700 transition-colors">LegalTalk Audio Guides</Link></li>
                <li><Link href="/tools" className="hover:text-sky-700 transition-colors">Severance &amp; DARS Tools</Link></li>
                <li><Link href="/dashboard" className="hover:text-sky-700 transition-colors">Client Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-[#0A1128] uppercase tracking-wider block">
                {t('footer_company_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-600">
                <li><Link href="/about" className="hover:text-sky-700 transition-colors">About LegalLink</Link></li>
                <li><Link href="/about#partnerships" className="hover:text-sky-700 text-sky-600 font-bold transition-colors">Partnerships &amp; Donors</Link></li>
                <li><Link href="/terms" className="hover:text-sky-700 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-sky-700 transition-colors">Privacy Policy</Link></li>
                <li><span className="text-slate-500">Proc. No. 1249/2021</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}