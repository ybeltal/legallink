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
  Mail,
  Phone,
  MapPin,
  Headphones,
  FileText,
  Plus,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ClientTestimonialsCarousel from '@/components/ClientTestimonialsCarousel';
import {
  RevealOnScroll,
  SkyGlassCard,
  SkyHeroAndScroll3DWorkspace,
  EcosystemLogoTicker,
  FeaturesCleanSixGrid,
  SkyPartnersCTA,
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

  const faqItems = [
    {
      q: 'How does LegalLink connect clients with verified Ethiopian advocates?',
      a: 'Choose your practice area, city, and preferred language, then describe your matter by text or voice brief. LegalLink routes your inquiry directly to your chosen advocate and lets you track updates inside your private Client Dashboard.',
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
    <div className="min-h-screen bg-[#F5F7FC] text-[#141B2D] font-sans selection:bg-[#ECEFFE] selection:text-[#4F61F0] flex flex-col">
      {/* 01. Adaptive Sky-Glass -> Crisp White Sticky Navbar */}
      <Navbar />

      {/* 02. Daylight Sky Hero + Scroll-Driven 3D LegalLink Workspace (Video 00:00–00:05.5) */}
      <SkyHeroAndScroll3DWorkspace />

      {/* 03. Clean Monochrome Ecosystem Ticker (Video 00:06–00:08) */}
      <EcosystemLogoTicker />

      {/* 04. Centered Pill Badge & 3x2 Features Icon Grid (Video 00:07.5–00:09.5) */}
      <FeaturesCleanSixGrid />

      {/* 05. Practice Areas */}
      <section className="py-20 md:py-28 bg-white border-t border-[#E6EBF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
                {t('pa_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#141B2D] tracking-tight">
                {t('pa_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#647087]">{t('pa_sub')}</p>
            </div>
            <Link
              href="/practice-areas"
              className="px-5 py-2.5 border border-[#DCE3F2] hover:border-[#5D6DF7] rounded-full bg-[#F5F7FC] text-xs font-semibold text-[#141B2D] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>{t('pa_browse_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5D6DF7]" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {practiceAreas.map((area, idx) => {
              const Icon = area.icon;
              return (
                <RevealOnScroll key={idx} delayMs={idx * 45}>
                  <Link href={`/find-a-lawyer?category=${area.slug}`} className="block h-full group">
                    <SkyGlassCard className="p-6 rounded-3xl h-full flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#ECEFFE] text-[#5D6DF7] flex items-center justify-center group-hover:bg-[#5D6DF7] group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-[#141B2D]">{area.title}</h3>
                        <p className="text-xs text-[#647087] leading-relaxed font-normal">
                          {area.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-xs font-semibold text-[#5D6DF7] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Explore →</span>
                      </div>
                    </SkyGlassCard>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06. Featured Advocates */}
      <section className="py-20 md:py-28 bg-[#F5F7FC] border-t border-[#E6EBF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
                {t('fl_tag')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#141B2D] tracking-tight">
                {t('fl_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#647087]">{t('fl_sub')}</p>
            </div>
            <Link
              href="/find-a-lawyer"
              className="px-5 py-2.5 border border-[#DCE3F2] hover:border-[#5D6DF7] rounded-full bg-white text-xs font-semibold text-[#141B2D] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>{t('fl_view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5D6DF7]" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLawyers.map((lawyer, idx) => (
              <RevealOnScroll key={idx} delayMs={idx * 65}>
                <SkyGlassCard className="rounded-3xl p-6 h-full flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4F61F0] to-[#879BFF] text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {lawyer.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <strong className="text-xs font-bold text-[#141B2D] truncate">
                            {lawyer.name}
                          </strong>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#5D6DF7] shrink-0" />
                        </div>
                        <span className="text-[11px] text-[#647087] block truncate">
                          {lawyer.role}
                        </span>
                        <span className="text-[10px] text-[#8C96AD] block">{lawyer.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1 font-semibold text-[#141B2D]">
                        <Star className="w-3.5 h-3.5 fill-[#5D6DF7] text-[#5D6DF7]" />
                        <span>{lawyer.rating}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECEFFE] text-[#4F61F0] font-semibold text-[10px]">
                        Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-[#F1F4FA] text-center">
                      <div className="p-1.5 bg-[#F5F7FC] rounded-xl">
                        <span className="text-[10px] text-[#7A859E] uppercase block">
                          {language === 'am' ? 'ችሎት' : 'Standing'}
                        </span>
                        <strong className="text-[11px] text-[#141B2D]">{lawyer.standing}</strong>
                      </div>
                      <div className="p-1.5 bg-[#F5F7FC] rounded-xl">
                        <span className="text-[10px] text-[#7A859E] uppercase block">
                          {t('fl_yrs_exp')}
                        </span>
                        <strong className="text-[11px] text-[#141B2D]">{lawyer.experience} yrs</strong>
                      </div>
                    </div>

                    <p className="text-xs text-[#647087] line-clamp-2 leading-relaxed font-normal">
                      {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                    </p>
                  </div>

                  <Link
                    href={`/find-a-lawyer?category=${lawyer.category}`}
                    className="w-full py-2.5 bg-[#F5F7FC] hover:bg-[#5D6DF7] text-[#141B2D] hover:text-white rounded-full text-xs font-semibold transition-colors flex items-center justify-center gap-1 group"
                  >
                    <span>{t('fl_view_profile')}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </SkyGlassCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 07. LexDraft & Diaspora Split Highlight */}
      <section id="lexdraft" className="py-20 md:py-28 bg-white border-t border-[#E6EBF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* LexDraft Feature Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll className="lg:col-span-6 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
                <FileText className="w-3 h-3" />
                <span>{t('lex_pill')}</span>
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold text-[#141B2D] tracking-tight">
                {t('lex_title')}
              </h2>

              <p className="text-xs sm:text-sm text-[#647087] leading-relaxed max-w-xl">
                {t('lex_sub')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  t('lex_item1'),
                  t('lex_item2'),
                  t('lex_item3'),
                  t('lex_item4'),
                  t('lex_item5'),
                  t('lex_item6'),
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#141B2D]">
                    <CheckCircle2 className="w-4 h-4 text-[#5D6DF7] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link
                  href="/lexdraft"
                  className="px-6 py-3 rounded-full bg-[#5D6DF7] hover:bg-[#4B5CE8] text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm shadow-[#5D6DF7]/25 transition-all"
                >
                  <span>{t('lex_cta_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/library"
                  className="px-6 py-3 rounded-full bg-[#F5F7FC] hover:bg-[#ECEFFE] text-[#141B2D] border border-[#DCE3F2] font-semibold text-xs inline-flex items-center transition-all"
                >
                  <span>{language === 'am' ? 'የፌዴራል አዋጆችን ያንብቡ' : 'Browse Federal Laws'}</span>
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120} className="lg:col-span-6">
              <div className="rounded-3xl p-7 sm:p-9 bg-gradient-to-br from-[#EEF2FE] via-[#F5F7FC] to-[#E6ECFC] border border-[#DCE3FA] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white text-[#5D6DF7] text-[10px] font-bold uppercase shadow-2xs">
                    {t('diaspora_tag')}
                  </span>
                  <Globe className="w-5 h-5 text-[#5D6DF7]" />
                </div>

                <h3 className="text-2xl font-semibold text-[#141B2D] tracking-tight">
                  {t('diaspora_title')}
                </h3>
                <p className="text-xs sm:text-sm text-[#525E75] leading-relaxed">
                  {t('diaspora_sub')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E4E9F5] space-y-1">
                    <span className="text-xs font-bold text-[#5D6DF7] block">ውክልና</span>
                    <strong className="text-[11px] font-semibold text-[#141B2D] block">
                      Embassy PoA
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E4E9F5] space-y-1">
                    <span className="text-xs font-bold text-[#5D6DF7] block">ካርታ</span>
                    <strong className="text-[11px] font-semibold text-[#141B2D] block">
                      Property Audit
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E4E9F5] space-y-1">
                    <span className="text-xs font-bold text-[#5D6DF7] block">ውርስ</span>
                    <strong className="text-[11px] font-semibold text-[#141B2D] block">
                      Succession
                    </strong>
                  </div>
                </div>

                <Link
                  href="/diaspora"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141B2D] hover:bg-[#24304C] text-white text-xs font-semibold transition-all"
                >
                  <span>{t('diaspora_cta_btn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8EA2FF]" />
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 08. LegalTalk Audio Knowledge Hub */}
      <section className="py-20 md:py-28 bg-[#F5F7FC] border-t border-[#E6EBF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <RevealOnScroll className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
                {t('lt_pill')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#141B2D] tracking-tight">
                {t('lt_title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#647087]">{t('lt_sub')}</p>
            </div>
            <Link
              href="/legaltalk"
              className="px-5 py-2.5 border border-[#DCE3F2] hover:border-[#5D6DF7] rounded-full bg-white text-xs font-semibold text-[#141B2D] flex items-center gap-1.5 transition-all shrink-0"
            >
              <span>{t('lt_explore_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#5D6DF7]" />
            </Link>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGuides.map((guide, idx) => (
              <RevealOnScroll key={guide.href} delayMs={idx * 80}>
                <Link href={guide.href} className="block h-full group">
                  <SkyGlassCard className="rounded-3xl overflow-hidden h-full flex flex-col">
                    <div className="h-44 relative overflow-hidden bg-[#4B75BA] flex flex-col justify-end p-4">
                      <img
                        src={guide.image}
                        alt={guide.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141B2D]/80 via-[#141B2D]/20 to-transparent" />
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[#141B2D] text-[10px] font-bold uppercase tracking-wider">
                          {guide.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5D6DF7] text-white text-[10px] font-mono font-bold">
                          <Headphones className="w-3 h-3" />
                          <span>{guide.audio}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-[#141B2D] group-hover:text-[#5D6DF7] transition-colors leading-snug">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-[#647087] leading-relaxed font-normal line-clamp-3">
                          {guide.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-[11px] text-[#8C96AD] font-mono">{guide.meta}</div>
                    </div>
                  </SkyGlassCard>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 09. Auto-Rotating "What Our Clients Say" */}
      <ClientTestimonialsCarousel />

      {/* 10. Clean FAQ Accordion + Sky Partnerships CTA */}
      <section id="about" className="py-20 md:py-28 bg-[#F5F7FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="max-w-3xl mx-auto space-y-6">
            <RevealOnScroll className="text-center space-y-2">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#141B2D] tracking-tight">
                Frequently Asked Questions
              </h2>
            </RevealOnScroll>

            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all bg-white ${
                      isOpen
                        ? 'border-[#C5D0F9] shadow-sm'
                        : 'border-[#E4E9F5] hover:border-[#CFD8F6]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-[#141B2D]">
                        {item.q}
                      </span>
                      <Plus
                        className={`w-4 h-4 text-[#5D6DF7] shrink-0 transition-transform duration-300 ${
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
                        <p className="px-6 pb-5 text-xs text-[#647087] leading-relaxed border-t border-[#F1F4FA] pt-3">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <RevealOnScroll>
            <SkyPartnersCTA />
          </RevealOnScroll>
        </div>
      </section>

      {/* 11. Clean Crisp White Architectural Footer */}
      <footer className="bg-white border-t border-[#E6EBF6] text-[#647087] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-bold text-base text-[#141B2D]">
                  Legal<span className="text-[#5D6DF7]">Link</span>
                </span>
              </div>
              <p className="text-xs text-[#647087] max-w-sm leading-relaxed font-normal">
                {t('footer_tagline')}
              </p>

              <div className="space-y-1.5 text-[#525E75] text-xs pt-1">
                <a
                  href="mailto:info.legallinkethiopia@gmail.com"
                  className="flex items-center gap-2 hover:text-[#5D6DF7] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5D6DF7] shrink-0" />
                  <span>info.legallinkethiopia@gmail.com</span>
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#5D6DF7] shrink-0" />
                  <span>+251-964-600-737 / +251-905-941-865</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#5D6DF7] shrink-0" />
                  <span>{t('footer_address')}</span>
                </div>
              </div>

              <p className="text-[11px] italic text-[#4F61F0] pt-1">
                “{t('footer_motto')}”
              </p>
            </div>

            <div className="space-y-3">
              <strong className="text-[11px] font-bold text-[#141B2D] uppercase tracking-wider block">
                {t('footer_platform_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/find-a-lawyer" className="hover:text-[#5D6DF7] transition-colors">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-[#5D6DF7] transition-colors">{t('nav_for_lawyers')}</Link></li>
                <li><Link href="/lexdraft" className="hover:text-[#5D6DF7] transition-colors">{t('nav_lexdraft')}</Link></li>
                <li><Link href="/diaspora" className="hover:text-[#5D6DF7] transition-colors">Diaspora Legal Hub</Link></li>
                <li><Link href="/nextgen" className="hover:text-[#5D6DF7] transition-colors">NextGen Hub</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-[11px] font-bold text-[#141B2D] uppercase tracking-wider block">
                {t('footer_resources_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/legal-center" className="hover:text-[#5D6DF7] transition-colors">Legal Center &amp; Dictionary</Link></li>
                <li><Link href="/library" className="hover:text-[#5D6DF7] transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-[#5D6DF7] transition-colors">LegalTalk Audio Guides</Link></li>
                <li><Link href="/tools" className="hover:text-[#5D6DF7] transition-colors">Severance &amp; DARS Tools</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#5D6DF7] transition-colors">Client Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-[11px] font-bold text-[#141B2D] uppercase tracking-wider block">
                {t('footer_company_title')}
              </strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/about" className="hover:text-[#5D6DF7] transition-colors">About LegalLink</Link></li>
                <li><Link href="/about#partnerships" className="text-[#5D6DF7] font-semibold hover:underline">Partnerships &amp; Donors</Link></li>
                <li><Link href="/terms" className="hover:text-[#5D6DF7] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#5D6DF7] transition-colors">Privacy Policy</Link></li>
                <li><span className="text-[#8C96AD]">Proc. No. 1249/2021</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#EEF2FA] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A859E]">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}