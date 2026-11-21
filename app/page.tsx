'use client';

import React from 'react';
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
  MapPin,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroBookingCard from '@/components/HeroBookingCard';
import LexDraftPreview from '@/components/LexDraftPreview';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language, t } = useLanguage();

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* 01. Global Navigation Bar */}
      <Navbar />

      {/* 02. Asymmetric Hero Section */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        {/* Unobstructed Lady Justice Background Accent */}
        <div className="absolute right-[-4%] md:right-[2%] lg:right-[6%] top-1/2 -translate-y-1/2 w-[320px] sm:w-[460px] lg:w-[540px] h-full pointer-events-none z-0 flex items-center justify-center select-none">
          <div className="absolute w-[360px] h-[360px] bg-amber-400/20 rounded-full blur-3xl animate-pulse-glow" />
          <img
            src="/lady-justice.png"
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain animate-float-slow mask-radial-fade filter drop-shadow-2xl opacity-35 md:opacity-50"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-950 border border-amber-200 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>{t('hero_badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-tight">
              {t('hero_title_1')}
              <br className="hidden sm:inline" />
              <span className="text-amber-700">{t('hero_title_2')}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              {language === 'am'
                ? 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር በነፃ በቀጥታ ይገናኙ፣ በአማርኛ እና በእንግሊዝኛ ህጋዊ ሰነዶችን ያዘጋጁ እንዲሁም የፌዴራል አዋጆችን በቀላሉ ያንብቡ።'
                : 'Connect directly with MOJ-verified Ethiopian advocates, draft bilingual Amharic & English legal forms, and search 122 federal proclamations — completely free during public launch.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
              <Link
                href="/find-a-lawyer"
                className="px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer"
              >
                <span>{t('hero_cta_find')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
              </Link>
              <Link
                href="/lexdraft"
                className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer"
              >
                <span>{language === 'am' ? 'ህጋዊ ሰነዶችን ያዘጋጁ (LexDraft)' : 'Draft Legal Forms Free'}</span>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0">
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-[#0A1128]">MOJ</div>
                <span className="text-[11px] text-slate-600 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'የተረጋገጠ ፍቃድ' : 'Licensed Bar'}
                </span>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-700 font-mono">100% Free</div>
                <span className="text-[11px] text-slate-600 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ያለ ክፍያ' : 'Zero Platform Fee'}
                </span>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-amber-700 font-mono">122 Laws</div>
                <span className="text-[11px] text-slate-600 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ይፋዊ አዋጆች' : 'Gazette Vault'}
                </span>
              </div>
              <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200 text-center shadow-xs">
                <div className="text-base sm:text-lg font-black text-[#0A1128] font-mono">አማ / EN</div>
                <span className="text-[11px] text-slate-600 font-bold uppercase block mt-0.5">
                  {language === 'am' ? 'ባለሁለት ቋንቋ' : 'Bilingual Access'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. Direct Consultation Spotlight */}
      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'am' ? 'ቀጥተኛ የህግ ማማከር' : 'Direct Advocate Matching'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
                {language === 'am'
                  ? 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር በቀጥታ ይገናኙ'
                  : 'Connect with Verified Counsel in Minutes'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {language === 'am'
                  ? 'ጉዳይዎን በአጭሩ ይግለጹና ከሚመለከተው የፌዴራል ወይም የክልል ጠበቃ ጋር በቀጥታ ይገናኙ። ሊጋልሊንክ ምንም አይነት የመድረክ ክፍያ አያስከፍልም።'
                  : 'Submit your legal matter by practice area, court standing, and preferred language. LegalLink routes your inquiry directly to your chosen advocate at zero platform cost.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-bold text-slate-700 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'ሙሉ በሙሉ ነፃ የመድረክ አገልግሎት' : 'No platform fees or hidden commissions'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'በስልክ፣ በቪዲዮ ወይም በቢሮ መገናኘት' : 'Phone, video, or chamber office visits'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'በፍትህ ሚኒስቴር ፍቃድ የተረጋገጡ ጠበቆች' : 'Ministry of Justice license checks'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'am' ? 'ሚስጥራዊ የደንበኛ መረጃ አያያዝ' : 'Private, role-restricted inquiry handling'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <HeroBookingCard />
            </div>
          </div>
        </div>
      </section>

      {/* 04. How It Works */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
              {t('hiw_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">{t('hiw_title')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">{t('hiw_sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-slate-300 font-mono block">01</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step1_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{t('hiw_step1_desc')}</p>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-amber-400 font-mono block">02</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step2_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {language === 'am'
                  ? 'በህግ ዘርፍ፣ በከተማ፣ በቋንቋ እና በፍርድ ቤት ደረጃ የተጣሩ የጠበቆችን መገለጫ ይምረጡ።'
                  : 'Choose a verified Ethiopian advocate filtered by practice area, location, language, and court tier.'}
              </p>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <span className="text-3xl font-black text-emerald-400 font-mono block">03</span>
              <h3 className="text-base font-bold text-[#0A1128]">{t('hiw_step3_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {language === 'am'
                  ? 'ጠበቃው ጉዳይዎን ተመልክቶ በስልክ፣ በቪዲዮ ወይም በቢሮ በቀጥታ ያገኝዎታል።'
                  : 'Your selected advocate reviews your brief and contacts you directly by phone, video, or in-person at their chambers.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 05. Practice Areas */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
                {t('pa_tag')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">{t('pa_title')}</h2>
              <p className="text-xs text-slate-600">{t('pa_sub')}</p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
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
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{area.desc}</p>
                  </div>
                  <div className="pt-2 text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06. Featured Lawyers */}
      <section className="py-16 md:py-20 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
                {t('fl_tag')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">{t('fl_title')}</h2>
              <p className="text-xs text-slate-600">{t('fl_sub')}</p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <strong className="text-xs font-bold text-[#0A1128] truncate">
                          {lawyer.name}
                        </strong>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <span className="text-[11px] text-slate-600 block truncate">{lawyer.role}</span>
                      <span className="text-[10px] text-slate-500 block">{lawyer.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{lawyer.rating}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px]">
                      Free Inquiry
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 text-center font-mono">
                    <div className="p-1.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase block">
                        {language === 'am' ? 'ችሎት' : 'Standing'}
                      </span>
                      <strong className="text-[11px] text-slate-900">{lawyer.standing}</strong>
                    </div>
                    <div className="p-1.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase block">{t('fl_yrs_exp')}</span>
                      <strong className="text-[11px] text-slate-900">{lawyer.experience} yrs</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                  </p>
                </div>

                <Link
                  href={`/find-a-lawyer?category=${lawyer.category}`}
                  className="w-full py-2 bg-slate-100 hover:bg-[#0A1128] hover:text-white rounded-xl text-xs font-bold text-slate-800 transition-colors flex items-center justify-center gap-1 group"
                >
                  <span>{language === 'am' ? 'ምክክር ይጠይቁ' : 'Request Consultation'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. Diaspora Legal Desk (Free Direct Connection) */}
      <section className="bg-gradient-to-r from-blue-950 via-[#0A1128] to-slate-950 text-white py-16 md:py-20 border-y border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              {t('diaspora_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">{t('diaspora_title')}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {language === 'am'
                ? 'በኢትዮጵያ የሚገኙ የመሬት ካርታዎችን፣ የኤምባሲ ውክልናዎችን፣ የውርስ ሀብቶችን እና የንግድ ኢንቨስትመንቶችን ከውጭ ሀገር ሆነው ከተረጋገጡ ጠበቆች ጋር በቀጥታ ያስፈጽሙ።'
                : 'Coordinate embassy powers of attorney, land title verification, estate succession, and Ethiopian business investments remotely with verified local advocates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                ው
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_poa_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{t('diaspora_poa_desc')}</p>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                ካ
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_land_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{t('diaspora_land_desc')}</p>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                ውር
              </div>
              <h3 className="text-sm font-bold text-white">{t('diaspora_est_title')}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{t('diaspora_est_desc')}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-300">
              Free initial advocate matching for Ethiopian diaspora clients worldwide.
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

      {/* 08. LexDraft Document Automation */}
      <section id="lexdraft" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-200 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-700" />
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
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
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
                  href="/library"
                  className="px-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <span>{language === 'am' ? '122 የፌዴራል አዋጆችን ያንብቡ' : 'Browse 122 Federal Laws'}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <LexDraftPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 09. LegalTalk Knowledge Hub */}
      <section className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                {t('lt_pill')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">{t('lt_title')}</h2>
              <p className="text-xs text-slate-600">{t('lt_sub')}</p>
            </div>
            <Link
              href="/legaltalk"
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t('lt_explore_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/legaltalk/starting-a-business-ethiopia-2026"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group"
            >
              <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-300">Commercial Code 1243/2021</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                    {t('lt_art1_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-700 transition-colors">
                    {t('lt_art1_title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{t('lt_art1_desc')}</p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">May 28, 2026 • 8 min read</div>
              </div>
            </Link>

            <Link
              href="/legaltalk/wrongful-termination-ethiopia"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group"
            >
              <div className="h-40 bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-300">Labour Proclamation 1156/2019</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                    {t('lt_art3_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-700 transition-colors">
                    {t('lt_art3_title')}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{t('lt_art3_desc')}</p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">June 15, 2026 • 6 min read</div>
              </div>
            </Link>

            <Link
              href="/legaltalk/ethiopian-diaspora-property-ownership"
              className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-950 to-slate-900 flex items-center justify-center p-6 text-white text-center">
                <span className="font-mono text-xs font-bold text-slate-300">Proclamation No. 270/2002</span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                    {t('diaspora_tag')}
                  </span>
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-amber-700 transition-colors">
                    Can the Ethiopian Diaspora Own Property in Ethiopia?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Understanding yellow card property rights, municipal land lease transfers, and succession rules.
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">March 22, 2026 • 5 min read</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. About & Trust Standards (#about) */}
      <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
              {t('why_tag')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">{t('why_title')}</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'am'
                ? 'ለኢትዮጵያውያን ግልጽ፣ ታማኝ እና ነፃ የህግ ተደራሽነት ለመፍጠር የተገነባ።'
                : 'Built to make Ethiopian legal access transparent, verifiable, and accessible for citizens, businesses, and advocates.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#0A1128]">{t('why_c1_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('why_c1_desc')}</p>
            </div>
            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3">
              <Lock className="w-6 h-6 text-[#0A1128]" />
              <h3 className="text-sm font-bold text-[#0A1128]">{t('why_c2_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'am'
                  ? 'የደንበኞች ጥያቄዎች ለተመረጠው ጠበቃ ብቻ እንዲታዩ በደህንነት ደንቦች የተጠበቁ ናቸው።'
                  : 'Consultation requests are protected by role-based access rules so only you and your chosen advocate see your inquiry.'}
              </p>
            </div>
            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3">
              <Scale className="w-6 h-6 text-amber-700" />
              <h3 className="text-sm font-bold text-[#0A1128]">
                {language === 'am' ? 'ነፃ የመድረክ አገልግሎት' : 'Free Public Launch'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'am'
                  ? 'ጠበቃ ለመፈለግ፣ ሰነዶችን ለማዘጋጀት እና ህጎችን ለማንበብ ምንም አይነት የመድረክ ክፍያ አይጠየቅም።'
                  : 'Browse advocates, draft bilingual legal forms, and access 122 proclamations with zero platform fees.'}
              </p>
            </div>
            <div className="p-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 space-y-3">
              <Languages className="w-6 h-6 text-blue-700" />
              <h3 className="text-sm font-bold text-[#0A1128]">{t('why_c4_title')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('why_c4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Clean Footer */}
      <footer className="bg-[#0A1128] text-slate-300 text-xs">
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
                {language === 'am'
                  ? 'ደንበኞችን ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር የሚያገናኝ ዲጂታል የህግ መድረክ።'
                  : 'Ethiopia’s digital legal directory, bilingual drafting hub, and proclamation vault.'}
              </p>

              <div className="space-y-1.5 text-slate-300 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>hello@legallink.et</span>
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
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/find-a-lawyer" className="hover:text-white transition-colors">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-white transition-colors">{t('nav_for_lawyers')}</Link></li>
                <li><Link href="/lexdraft" className="hover:text-white transition-colors">{t('nav_lexdraft')}</Link></li>
                <li><Link href="/nextgen" className="hover:text-white transition-colors">NextGen Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_resources_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/library" className="hover:text-white transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white transition-colors">LegalTalk Guides</Link></li>
                <li><Link href="/advocate/register" className="hover:text-white transition-colors">Register as Advocate</Link></li>
                <li><Link href="/advocate/portal" className="hover:text-white transition-colors">Advocate Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                {t('footer_company_title')}
              </strong>
              <ul className="space-y-2 text-[11px] text-slate-400">
                <li><Link href="/#about" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><span className="text-slate-500">Proc. No. 1249/2021</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}