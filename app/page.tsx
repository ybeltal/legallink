'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Search, ArrowRight, CheckCircle2, Lock, Scale, 
  Star, Menu, X, Building2, Briefcase, Home as HomeIcon, 
  Users, ChevronRight, Sparkles, MessageSquare, LogOut, 
  User, Globe, Languages 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('corporate');
  const [userSession, setUserSession] = useState<{ email?: string } | null>(null);

  // Monitor Supabase Auth Session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserSession({ email: session.user.email });
      } else {
        setUserSession(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession({ email: session.user.email });
      } else {
        setUserSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserSession(null);
    window.location.reload();
  };

  const practiceAreas = [
    {
      title: language === 'am' ? 'የንግድና ኩባንያ ሕግ' : 'Corporate & Commercial',
      amharic: 'የንግድና ኩባንያ ሕግ',
      desc: language === 'am' 
        ? 'የኩባንያ ምስረታ፣ የንግድ ህግ ተገዢነት፣ የባለአክሲዮኖች ስምምነት እና ውህደት።'
        : 'Company formation, Commercial Code compliance, shareholder agreements, and M&A.',
      icon: Building2,
      slug: 'corporate',
    },
    {
      title: language === 'am' ? 'የመሬትና ይዞታ ሕግ' : 'Real Estate & Land',
      amharic: 'የመሬትና ይዞታ ሕግ',
      desc: language === 'am'
        ? 'የይዞታ ማረጋገጫ፣ የካርታ ትክክለኛነት ኦዲት፣ የሊዝ ውል ዝውውር እና ክርክሮች።'
        : 'Landholding certification, title deed due diligence, property lease transfers, and disputes.',
      icon: HomeIcon,
      slug: 'property',
    },
    {
      title: language === 'am' ? 'የሠራተኛና አሠሪ ሕግ' : 'Employment & Labor',
      amharic: 'የሠራተኛና አሠሪ ሕግ',
      desc: language === 'am'
        ? 'የስራ ቅጥር ውሎች፣ በአዋጅ ቁጥር 1156/2019 መሰረት የስንብት ክፍያ ስሌት እና የሙግት መፍትሄዎች።'
        : 'Employment contracts, statutory severance audits under Proc. 1156/2019, and labor disputes.',
      icon: Briefcase,
      slug: 'employment',
    },
    {
      title: language === 'am' ? 'የካፒታል ገበያና ሰነደ-ሙዓለ-ንዋይ' : 'Capital Markets & ESX',
      amharic: 'የካፒታል ገበያና ሰነደ-ሙዓለ-ንዋይ',
      desc: language === 'am'
        ? 'የኢትዮጵያ ካፒታል ገበያ ባለስልጣን መመሪያ 1030/2024 ተገዢነት እና የአክሲዮን ሽያጭ።'
        : 'Prospectus compliance, ECMA Directive 1030/2024 guidance, and public share offerings.',
      icon: Scale,
      slug: 'capital-markets',
    },
    {
      title: language === 'am' ? 'የቤተሰብና ፍትሐብሔር ሕግ' : 'Family & Civil Law',
      amharic: 'የቤተሰብና ፍትሐብሔር ሕግ',
      desc: language === 'am'
        ? 'የውርስ ሀብት ክፍፍል፣ የእርቅ ድርድር፣ የጋብቻ ውል እና የንብረት አስተዳደር።'
        : 'Succession & inheritance, civil settlement mediation, marital contracts, and estate management.',
      icon: Users,
      slug: 'family',
    },
    {
      title: language === 'am' ? 'የአእምሯዊ ንብረት ሕግ' : 'Intellectual Property',
      amharic: 'የአእምሯዊ ንብረት ሕግ',
      desc: language === 'am'
        ? 'የንግድ ምልክት ምዝገባ፣ የቅጂ መብት ጥበቃ፣ የፈጠራ ውጤት ምዝገባ እና የፈቃድ ስምምነቶች።'
        : 'Trademark registration, copyright protection, patent filing with EIPO, and licensing.',
      icon: Sparkles,
      slug: 'ip',
    },
  ];

  const featuredAdvocates = [
    {
      name: language === 'am' ? 'ጠበቃ ሙሉ ኃይሌ' : 'Advocate Mulu Haile',
      role: language === 'am' ? 'የንግድና ካፒታል ገበያ አማካሪ' : 'Corporate & Capital Markets Counsel',
      license: language === 'am' ? 'የፍትህ ሚኒስቴር የተረጋገጠ • ፌዴራል ጠቅላይ ፍርድ ቤት' : 'MOJ Verified • Federal Supreme Court',
      experience: language === 'am' ? '12 ዓመት የስራ ልምድ' : '12 Years Experience',
      rating: '4.95',
      reviews: '442',
      rate: '1,500',
      badge: language === 'am' ? 'ከፍተኛ ተመራጭ' : 'Top Match',
      licenseNo: 'ETH-BAR-2018-0492'
    },
    {
      name: language === 'am' ? 'ጠበቃ ትዕግሥት በቀለ' : 'Advocate Tigist Bekele',
      role: language === 'am' ? 'የቤተሰብና ሰራተኛ ህግ ባለሙያ' : 'Family & Employment Specialist',
      license: language === 'am' ? 'የፍትህ ሚኒስቴር የተረጋገጠ • ፌዴራል ከፍተኛ ፍርድ ቤት' : 'MOJ Verified • Federal High Court',
      experience: language === 'am' ? '8 ዓመት የስራ ልምድ' : '8 Years Experience',
      rating: '4.88',
      reviews: '312',
      rate: '1,200',
      badge: language === 'am' ? 'ፈጣን ምላሽ ሰጪ' : 'Fast Responder',
      licenseNo: 'ETH-BAR-2020-1104'
    },
    {
      name: language === 'am' ? 'ጠበቃ ዳዊት ተስፋዬ' : 'Advocate Dawit Tesfaye',
      role: language === 'am' ? 'የሪል እስቴትና መሬት ካርታ አማካሪ' : 'Real Estate & Land Title Counsel',
      license: language === 'am' ? 'የፍትህ ሚኒስቴር የተረጋገጠ • ሰበር ሰሚ ችሎት' : 'MOJ Verified • Cassation Division',
      experience: language === 'am' ? '15 ዓመት የስራ ልምድ' : '15 Years Experience',
      rating: '4.92',
      reviews: '521',
      rate: '1,800',
      badge: language === 'am' ? 'ከፍተኛ ባለሙያ' : 'Senior Specialist',
      licenseNo: 'ETH-BAR-2015-0081'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <motion.img 
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              src="/logo.png" 
              alt="LegalLink" 
              className="w-9 h-9 object-contain" 
            />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
                {language === 'am' ? 'ኢትዮጵያ' : 'Ethiopia'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/" className="text-[#0A1128] font-black border-b-2 border-amber-500 pb-0.5">
              {t('nav_home')}
            </Link>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link href="/find-a-lawyer" className="hover:text-[#0A1128] transition-colors">
                {t('nav_find_lawyer')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link href="/practice-areas" className="hover:text-[#0A1128] transition-colors">
                {t('nav_practice_areas')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link href="/diaspora" className="hover:text-[#0A1128] transition-colors flex items-center gap-1.5 text-blue-600 font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>{t('nav_diaspora')}</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link href="/legaltalk" className="hover:text-[#0A1128] transition-colors flex items-center gap-1.5 text-amber-600">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('nav_legaltalk')}</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link href="/tools" className="hover:text-[#0A1128] transition-colors flex items-center gap-1">
                <span>{t('nav_tools')}</span>
                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                  FREE
                </span>
              </Link>
            </motion.div>
          </nav>

          {/* Right Header CTAs & Tactile Bilingual Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              onClick={toggleLanguage}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-slate-50 shadow-xs cursor-pointer"
              title="Switch Language / ቋንቋ ይቀይሩ"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </motion.button>

            <Link 
              href="/for-lawyers" 
              className="text-xs font-bold text-slate-500 hover:text-[#0A1128] px-2 py-2 rounded-xl transition-colors hidden md:block"
            >
              {t('nav_for_advocates')}
            </Link>

            {userSession ? (
              <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-[#0A1128] text-white flex items-center justify-center text-[10px] font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 max-w-[100px] truncate">
                  {userSession.email?.split('@')[0]}
                </span>
                <motion.button
                  whileHover={{ scale: 1.15, color: '#dc2626' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1 text-slate-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/login" 
                  className="text-xs font-bold text-slate-600 hover:text-[#0A1128] px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors block"
                >
                  {t('nav_sign_in')}
                </Link>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
            >
              <Link 
                href="/find-a-lawyer" 
                className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-1.5 group whitespace-nowrap"
              >
                <span>{t('nav_book_consultation')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-700 cursor-pointer"
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Spring Slide */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 overflow-hidden"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-[#0A1128] py-1">
                {t('nav_home')}
              </Link>
              <Link href="/find-a-lawyer" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">
                {t('nav_find_lawyer')}
              </Link>
              <Link href="/practice-areas" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">
                {t('nav_practice_areas')}
              </Link>
              <Link href="/diaspora" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-blue-600 py-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>{t('nav_diaspora')}</span>
              </Link>
              <Link href="/legaltalk" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-amber-600 py-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{t('nav_legaltalk')}</span>
              </Link>
              <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-800 py-1">
                {t('nav_tools')}
              </Link>
              <Link href="/escrow" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-emerald-700 py-1">
                {t('nav_escrow')}
              </Link>

              {userSession ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full py-2.5 bg-red-50 text-red-600 text-center font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_sign_out')}</span>
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 bg-slate-100 text-slate-700 text-center font-bold text-xs rounded-xl block">
                  {t('nav_sign_in')}
                </Link>
              )}

              <Link href="/find-a-lawyer" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-[#0A1128] text-white text-center font-bold text-xs rounded-xl block shadow-sm">
                {t('nav_book_consultation')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#0A1128] text-xs font-bold cursor-default"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('hero_badge')}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-tight"
            >
              {t('hero_title_1')}<span className="text-amber-500">{t('hero_title_2')}</span>
            </motion.h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              {t('hero_sub')}
            </p>

            {/* Interactive Search Card */}
            <motion.div 
              whileHover={{ y: -3, boxShadow: "0 20px 30px -10px rgba(10, 17, 40, 0.08)" }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="mt-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedPracticeArea}
                  onChange={(e) => setSelectedPracticeArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/20 cursor-pointer"
                >
                  {practiceAreas.map((area, idx) => (
                    <option key={idx} value={area.slug}>
                      {area.title}
                    </option>
                  ))}
                </select>
              </div>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href={`/find-a-lawyer?category=${selectedPracticeArea}`}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-sm group"
                >
                  <span>{t('hero_cta')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl mx-auto text-center">
              <div>
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">100%</strong>
                <span className="text-[11px] text-slate-500 font-medium">{t('hero_stat_licensed')}</span>
              </div>
              <div className="border-x border-slate-200">
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">Telebirr</strong>
                <span className="text-[11px] text-slate-500 font-medium">{t('hero_stat_escrow')}</span>
              </div>
              <div>
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">&lt; 2 {language === 'am' ? 'ሰዓት' : 'Hours'}</strong>
                <span className="text-[11px] text-slate-500 font-medium">{t('hero_stat_response')}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Diaspora Spotlight Callout */}
      <section className="bg-gradient-to-r from-blue-900 to-[#0A1128] text-white py-10 border-y border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('diaspora_pill')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {t('diaspora_title')}
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-normal">
              {t('diaspora_desc')}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
          >
            <Link
              href="/diaspora"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap shrink-0 group"
            >
              <span>{t('diaspora_btn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
              {t('hiw_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              {t('hiw_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('hiw_sub')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: t('hiw_step1_title'), desc: t('hiw_step1_desc'), color: 'text-[#0A1128]' },
              { num: '02', title: t('hiw_step2_title'), desc: t('hiw_step2_desc'), color: 'text-amber-600' },
              { num: '03', title: t('hiw_step3_title'), desc: t('hiw_step3_desc'), color: 'text-emerald-600' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 space-y-4 cursor-default shadow-xs hover:shadow-md transition-shadow"
              >
                <span className={`w-10 h-10 rounded-2xl bg-white border border-slate-200 ${step.color} font-black text-sm flex items-center justify-center shadow-xs`}>
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-[#0A1128]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Practice Areas with Spring Hover & Tap */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                {t('pa_tag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {t('pa_title')}
              </h2>
            </div>
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.96 }}>
              <Link 
                href="/practice-areas" 
                className="text-xs font-bold text-slate-600 hover:text-[#0A1128] inline-flex items-center gap-1 group"
              >
                <span>{t('pa_view_all')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, idx) => {
              const IconComponent = area.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02, boxShadow: "0 15px 30px -10px rgba(10, 17, 40, 0.08)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300"
                >
                  <Link
                    href={`/find-a-lawyer?category=${area.slug}`}
                    className="p-6 flex flex-col justify-between space-y-4 h-full block group"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0A1128] group-hover:bg-[#0A1128] group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0A1128]">{area.title}</h3>
                        <span className="text-[11px] font-medium text-slate-400 block">{area.amharic}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {area.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                      <span>{t('pa_find_btn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Featured Advocates Cards with Spring Pop */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                {t('fa_tag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {t('fa_title')}
              </h2>
            </div>
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.96 }}>
              <Link 
                href="/find-a-lawyer" 
                className="text-xs font-bold text-slate-600 hover:text-[#0A1128] inline-flex items-center gap-1 group"
              >
                <span>{t('fa_view_all')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAdvocates.map((adv, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 30px -10px rgba(10, 17, 40, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                        {adv.badge}
                      </span>
                      <h3 className="text-base font-black text-[#0A1128] mt-2">{adv.name}</h3>
                      <span className="text-xs text-slate-600 block">{adv.role}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200/60 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{adv.license}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] font-medium">
                      {adv.experience}
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{adv.rating}</span>
                      <span className="text-slate-400 font-normal">({adv.reviews} {language === 'am' ? 'ግምገማዎች' : 'verified reviews'})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{t('fa_retainer_label')}</span>
                    <strong className="text-sm font-black text-[#0A1128]">ETB {adv.rate}</strong>
                  </div>
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
                    <Link
                      href="/find-a-lawyer"
                      className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl block"
                    >
                      {t('fa_book_session')}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Institutional Escrow Notice */}
      <section className="py-16 bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
                {t('escrow_tag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {t('escrow_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t('escrow_desc')}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'am' ? 'ግልጽ የሆነ ቋሚ ዋጋ' : 'Transparent Fixed Pricing'}</span>
                </div>
                <motion.div whileHover={{ x: 2 }}>
                  <Link href="/escrow" className="flex items-center gap-2 text-emerald-400 hover:underline">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('escrow_desk_btn')}</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-sm text-white">{t('escrow_ussd_title')}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {t('escrow_ussd_desc')}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }} className="flex-1">
                  <Link
                    href="/find-a-lawyer"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-black text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>{t('escrow_start_btn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
                  <Link
                    href="/escrow"
                    className="py-3 px-5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center block"
                  >
                    {t('escrow_rules_btn')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            
            <div className="space-y-3 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-black text-base text-[#0A1128]">
                  Legal<span className="text-amber-500">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {t('footer_tagline')}
              </p>
              <span className="text-[11px] text-slate-400 block font-mono">Bole Sub-City, Addis Ababa</span>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                {language === 'am' ? 'ለደንበኞችና ለዲያስፖራ' : 'For Clients & Diaspora'}
              </strong>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#0A1128]">{t('nav_home')}</Link></li>
                <li><Link href="/find-a-lawyer" className="hover:text-[#0A1128]">{t('nav_find_lawyer')}</Link></li>
                <li><Link href="/diaspora" className="text-blue-600 font-bold hover:underline">{t('nav_diaspora')}</Link></li>
                <li><Link href="/practice-areas" className="hover:text-[#0A1128]">{t('nav_practice_areas')}</Link></li>
                <li><Link href="/legaltalk" className="hover:text-[#0A1128]">{t('nav_legaltalk')}</Link></li>
                <li><Link href="/tools" className="hover:text-[#0A1128]">{t('nav_tools')}</Link></li>
                <li><Link href="/escrow" className="text-emerald-700 font-bold hover:underline">{t('nav_escrow')}</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                {language === 'am' ? 'ለህግ ባለሙያዎች' : 'For Advocates'}
              </strong>
              <ul className="space-y-2">
                <li><Link href="/for-lawyers" className="hover:text-[#0A1128]">{t('nav_for_advocates')}</Link></li>
                <li><Link href="/advocate" className="hover:text-[#0A1128]">{language === 'am' ? 'የጠበቆች የስራ ገጽ' : 'Advocate Workspace'}</Link></li>
                <li><Link href="/admin/verification" className="hover:text-[#0A1128]">{language === 'am' ? 'የፍትህ ሚኒስቴር ማረጋገጫ' : 'MOJ Verification Audit'}</Link></li>
                <li><Link href="/verify/ETH-BAR-2018-0492" className="hover:text-[#0A1128]">{language === 'am' ? 'የፍቃድ ማረጋገጫ ናሙና' : 'Sample Credential Verification'}</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                {language === 'am' ? 'ህጋዊ ድንጋጌዎች' : 'Legal & Intermediary'}
              </strong>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-[#0A1128]">{language === 'am' ? 'የአገልግሎት ውል' : 'Terms of Service'}</Link></li>
                <li><Link href="/privacy" className="hover:text-[#0A1128]">{language === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}</Link></li>
                <li><span className="text-slate-400">Commercial Code 1240/2021</span></li>
                <li><span className="text-slate-400">ECMA Directive 1030/2024</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>{t('footer_rights')}</p>
            <p>{t('footer_disclaimer')}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}