'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Star, Sparkles, Building2, 
  Users, Home as HomeIcon, Briefcase, Scale, Globe, 
  CheckCircle2, FileText, ChevronRight, Lock, DollarSign,
  Languages, Quote, Phone, Mail, MapPin, Calendar, Clock
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroBookingCard from '@/components/HeroBookingCard';
import LexDraftPreview from '@/components/LexDraftPreview';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language, t } = useLanguage();

  const practiceAreas = [
    {
      title: t('pa_corp_title'),
      desc: t('pa_corp_desc'),
      icon: Building2,
      slug: 'corporate',
    },
    {
      title: t('pa_family_title'),
      desc: t('pa_family_desc'),
      icon: Users,
      slug: 'family',
    },
    {
      title: t('pa_prop_title'),
      desc: t('pa_prop_desc'),
      icon: HomeIcon,
      slug: 'property',
    },
    {
      title: t('pa_ip_title'),
      desc: t('pa_ip_desc'),
      icon: Sparkles,
      slug: 'ip',
    },
    {
      title: t('pa_labor_title'),
      desc: t('pa_labor_desc'),
      icon: Briefcase,
      slug: 'employment',
    },
    {
      title: t('pa_crim_title'),
      desc: t('pa_crim_desc'),
      icon: Scale,
      slug: 'criminal',
    },
    {
      title: t('pa_imm_title'),
      desc: t('pa_imm_desc'),
      icon: Globe,
      slug: 'immigration',
    },
    {
      title: t('pa_ngo_title'),
      desc: t('pa_ngo_desc'),
      icon: ShieldCheck,
      slug: 'ngo',
    },
  ];

  const featuredLawyers = [
    {
      initials: 'MH',
      name: language === 'am' ? 'ጠበቃ ሙሉ ኃይሌ' : 'Adv. Mulu Haile',
      role: language === 'am' ? 'የንግድና ኩባንያ ሕግ' : 'Corporate & Business Law',
      location: 'Addis Ababa',
      rating: '5.0',
      reviews: '248',
      consultations: 'Senior',
      experience: '12',
      rate: '1,500',
      bio: 'Specializes in company formation, M&A transactions, and corporate governance.',
      amharicBio: 'በኩባንያ ምስረታ፣ የንግድ ውህደት እና ኮርፖሬት ተገዢነት ላይ ልዩ ልምድ ያካበቱ።',
      slug: 'ETH-BAR-2018-0492'
    },
    {
      initials: 'TB',
      name: language === 'am' ? 'ጠበቃ ትዕግሥት በቀለ' : 'Adv. Tigist Bekele',
      role: language === 'am' ? 'የቤተሰብ ሕግ' : 'Family Law',
      location: 'Addis Ababa',
      rating: '4.9',
      reviews: '193',
      consultations: 'Senior',
      experience: '9',
      rate: '1,200',
      bio: 'Experienced in divorce proceedings, child custody, adoption, and inheritance.',
      amharicBio: 'በፍቺ ስምምነት፣ የልጆች አስተዳደግና የውርስ ሀብት ክፍፍል ላይ የ9 ዓመታት የሙግት ልምድ።',
      slug: 'ETH-BAR-2020-1104'
    },
    {
      initials: 'DT',
      name: language === 'am' ? 'ጠበቃ ዳዊት ተስፋዬ' : 'Adv. Dawit Tesfaye',
      role: language === 'am' ? 'የመሬትና ይዞታ ሕግ' : 'Property & Real Estate',
      location: 'Bahir Dar',
      rating: '4.8',
      reviews: '167',
      consultations: 'Senior',
      experience: '15',
      rate: '1,800',
      bio: 'Handles land rights, title transfers, lease agreements, and property disputes.',
      amharicBio: 'በይዞታ መብት፣ የካርታ ትክክለኛነት ማረጋገጫና የሪል እስቴት ክርክሮች ላይ የ15 ዓመታት ልምድ።',
      slug: 'ETH-BAR-2015-0081'
    },
    {
      initials: 'SG',
      name: language === 'am' ? 'ጠበቃ ሰላማዊት ግርማ' : 'Adv. Selamawit Girma',
      role: language === 'am' ? 'ኢሚግሬሽንና ዲያስፖራ' : 'Immigration Law',
      location: 'Addis Ababa',
      rating: '4.9',
      reviews: '142',
      consultations: 'Senior',
      experience: '8',
      rate: '2,000',
      bio: 'Expert in Ethiopian immigration law, diaspora legal matters, and cross-border estates.',
      amharicBio: 'በኢሚግሬሽን፣ የዲያስፖራ ውክልናዎችና የድንበር ተሻጋሪ ንብረት አስተዳደር ላይ የካበተ ልምድ።',
      slug: 'ETH-BAR-2019-0921'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Global Navigation Bar */}
      <Navbar />

      {/* 02. Asymmetric Hero Section with Unobstructed Lady Justice */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        
        {/* Layer: Unobstructed Lady Justice on the Right */}
        <div className="absolute right-[-4%] md:right-[2%] lg:right-[6%] top-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[560px] h-full pointer-events-none z-0 flex items-center justify-center select-none">
          <div className="absolute w-[380px] h-[380px] bg-amber-400/25 rounded-full blur-3xl animate-pulse-glow" />
          <img 
            src="/lady-justice.png" 
            alt="Lady Justice" 
            aria-hidden="true" 
            className="w-full h-auto object-contain animate-float-slow mask-radial-fade filter drop-shadow-2xl opacity-40 md:opacity-50" 
          />
        </div>

        {/* Foreground Hero Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-tight">
              {t('hero_title_1')}<br className="hidden sm:inline" />
              <span className="text-amber-500">{t('hero_title_2')}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              {t('hero_sub')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
              <Link
                href="/find-a-lawyer"
                className="px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer"
              >
                <span>{t('hero_cta_find')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
              </Link>
              <a
                href="#consultation-spotlight"
                className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <span>{language === 'am' ? 'ቀጠሮ መያዣን ይመልከቱ' : 'Quick Consultation'}</span>
              </a>
            </div>

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
              <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-[#0A1128]">100%</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'በፍትህ ሚ/ር የተረጋገጠ' : 'MOJ Licensed'}
                </span>
              </div>
              <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-700 font-mono">Escrow</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ቴሌብር ዋስትና' : 'Telebirr Custody'}
                </span>
              </div>
              <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-amber-600 font-mono">Fixed</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ግልጽ ተመን' : 'Clear Retainers'}
                </span>
              </div>
              <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-[#0A1128] font-mono">Direct</div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ባለሁለት ቋንቋ' : 'Bilingual Counsel'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03. Dedicated Instant Consultation Spotlight Section (HeroBookingCard) */}
      <section id="consultation-spotlight" className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'am' ? 'ቀጥተኛ የህግ ማማከር ቀጠሮ' : 'Verified Direct Consultation'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
                {language === 'am' 
                  ? 'ከከፍተኛ የኢትዮጵያ ጠበቆች ጋር በቀጥታ ቀጠሮ ይያዙ' 
                  : 'Book Verified Counsel in Minutes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {language === 'am'
                  ? 'የተረጋገጡ የከፍተኛና ጠቅላይ ፍርድ ቤት ጠበቆችን የዛሬ ክፍት ሰዓታት ይመልከቱ። እያንዳንዱ ክፍያ በኢትዮጵያ ንግድ ህግ አዋጅ 1240/2021 መሰረት በቴሌብር ዋስትና ሂሳብ ውስጥ አገልግሎቱ እስከሚሰጥ ድረስ በጥንቃቄ ይቀመጣል።'
                  : 'Review real-time advocate docket openings across corporate, property, and civil disputes. Every fee is safely locked in Telebirr two-party escrow until your consultation is completed.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'ምንም ያልተጠበቀ ተጨማሪ ወጪ የለም' : 'Transparent fixed consultation rates'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'በቪዲዮ፣ በስልክ ወይም በቢሮ መገናኘት' : 'Video, phone, or office chamber visit'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'በቴሌብር USSD ቀጥታ ክፍያ ማጽደቅ' : 'Direct Telebirr USSD authorization'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'ሙሉ ሚስጥራዊነት የተጠበቀ' : 'End-to-end confidential client intake'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <HeroBookingCard />
            </div>

          </div>
        </div>
      </section>

      {/* 04. Process Section: How It Works */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
              {t('hiw_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
              {t('hiw_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {t('hiw_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-slate-200 font-mono block">01</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step1_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {t('hiw_step1_desc')}
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-amber-300 font-mono block">02</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step2_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {t('hiw_step2_desc')}
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-emerald-300 font-mono block">03</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step3_title')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {t('hiw_step3_desc')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 05. Practice Areas */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
                {t('pa_tag')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
                {t('pa_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('pa_sub')}
              </p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('pa_browse_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {practiceAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <Link
                  key={idx}
                  href={`/find-a-lawyer?category=${area.slug}`}
                  className="card-hover bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 hover:border-slate-300 flex flex-col justify-between space-y-4 shadow-xs group"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#0A1128] group-hover:bg-[#0A1128] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0A1128]">{area.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {area.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 06. Featured Lawyers */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
                {t('fl_tag')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
                {t('fl_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('fl_sub')}
              </p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('fl_view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLawyers.map((lawyer, idx) => (
              <div
                key={idx}
                className="card-hover bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0A1128] text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {lawyer.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <strong className="text-xs font-bold text-[#0A1128]">{lawyer.name}</strong>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">{lawyer.role}</span>
                      <span className="text-[9px] text-slate-400 block">{lawyer.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{lawyer.rating}</span>
                    <span className="text-slate-400 font-normal">({lawyer.reviews})</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-center font-mono">
                    <div className="p-1.5 bg-slate-50 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block">{language === 'am' ? 'ደረጃ' : 'Standing'}</span>
                      <strong className="text-xs text-slate-800">{lawyer.consultations}</strong>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-xl">
                      <span className="text-[9px] text-slate-400 uppercase block">{t('fl_yrs_exp')}</span>
                      <strong className="text-xs text-slate-800">{lawyer.experience}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-[#0A1128]">
                    ETB {lawyer.rate}/hr
                  </span>
                  <Link
                    href={`/find-a-lawyer`}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#0A1128] hover:text-white rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 group"
                  >
                    <span>{t('fl_view_profile')}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 07. Diaspora Hub (International Escrow) */}
      <section className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-slate-950 text-white py-16 md:py-24 border-y border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              {t('diaspora_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t('diaspora_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {t('diaspora_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                ው
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_poa_title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {t('diaspora_poa_desc')}
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-400">
                Starting: $75 USD Escrow Hold
              </div>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ካ
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_land_title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {t('diaspora_land_desc')}
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-400">
                Starting: $120 USD Escrow Hold
              </div>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                ውር
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_est_title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {t('diaspora_est_desc')}
              </p>
              <div className="pt-2 text-[10px] font-mono text-amber-400">
                Starting: $150 USD Escrow Hold
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              Protected by swift USD / EUR / Telebirr two-party custody.
            </span>
            <Link
              href="/find-a-lawyer?category=immigration"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md group cursor-pointer"
            >
              <span>{t('diaspora_cta_btn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* 08. LexDraft Document Automation Section (LexDraftPreview) */}
      <section id="lexdraft" className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{t('lex_pill')}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
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
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lexdraft"
                  className="px-6 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer"
                >
                  <span>{t('lex_cta_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
                </Link>

                <Link
                  href="/lexdraft"
                  className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <span>Browse All 12 Templates</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <LexDraftPreview />
            </div>

          </div>
        </div>
      </section>

      {/* 09. LegalTalk Knowledge */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                <span>{t('lt_pill')}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
                {t('lt_title')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('lt_sub')}
              </p>
            </div>
            <Link
              href="/legaltalk"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>{t('lt_explore_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/legaltalk/starting-a-business-ethiopia-2026"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group cursor-pointer"
            >
              <div className="h-44 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-400">Commercial Code 1240/2021</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">
                    {t('lt_art1_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-600 transition-colors">
                    {t('lt_art1_title')}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {t('lt_art1_desc')}
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  May 28, 2026 • 8 min read
                </div>
              </div>
            </Link>

            <Link
              href="/legaltalk/wrongful-termination-ethiopia"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group cursor-pointer"
            >
              <div className="h-44 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-400">Labour Proclamation 1156/2019</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">
                    {t('lt_art3_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-600 transition-colors">
                    {t('lt_art3_title')}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {t('lt_art3_desc')}
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  June 15, 2026 • 6 min read
                </div>
              </div>
            </Link>

            <Link
              href="/legaltalk/ethiopian-diaspora-property-ownership"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group cursor-pointer"
            >
              <div className="h-44 bg-gradient-to-br from-emerald-950 to-slate-900 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-400">Proclamation No. 270/2002</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">
                    {t('diaspora_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-600 transition-colors">
                    Can the Ethiopian Diaspora Own Property in Ethiopia?
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Understanding yellow card property rights, municipal land lease transfers, and succession rules.
                  </p>
                </div>
                <div className="pt-2 text-[10px] text-slate-400 font-mono">
                  March 22, 2026 • 5 min read
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 10. Verified Client Testimonials */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
              {t('test_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
              {t('test_title')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('test_sub')}
            </p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xs text-left relative">
            <span className="text-4xl font-serif text-amber-400 block -mb-2">“</span>
            
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              {t('test_quote')}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0A1128] text-white font-bold flex items-center justify-center text-xs">
                  YA
                </div>
                <div>
                  <strong className="text-xs font-bold text-[#0A1128] block">{t('test_author')}</strong>
                  <span className="text-[10px] text-slate-500 block">{t('test_role')}</span>
                </div>
              </div>

              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 11. Enterprise Footer (Restored with all links and contact information) */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-black text-base text-white">
                  Legal<span className="text-amber-500">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
                {t('footer_tagline')}
              </p>
              
              <div className="space-y-1.5 text-slate-300 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>hello@legallink.et</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('footer_phone')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('footer_address')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_platform_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/find-a-lawyer" className="hover:text-white transition-colors">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-white transition-colors">{t('nav_for_lawyers')}</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white transition-colors">{t('nav_legaltalk')}</Link></li>
                <li><Link href="/lexdraft" className="hover:text-white transition-colors">{t('nav_lexdraft')}</Link></li>
                <li><Link href="/nextgen" className="hover:text-white transition-colors">NextGen Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_resources_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/library" className="hover:text-white transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white transition-colors">LegalTalk Blog</Link></li>
                <li><Link href="/#escrow" className="hover:text-white transition-colors">Escrow Protection</Link></li>
                <li><Link href="/admin" className="hover:text-white text-amber-400 font-bold transition-colors">Admin Console</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_company_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/#about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><span className="text-slate-500">Commercial Code 1240/2021</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}