'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, ShieldCheck, Star, MapPin, Lock, ArrowRight, 
  Video, Phone, Building2, Scale, X, Check, AlertCircle, 
  Smartphone, Clock, Home as HomeIcon, Globe, FileText,
  Languages, User, LogOut, Menu
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Advocate {
  id: string;
  name: string;
  amharicName: string;
  title: string;
  amharicTitle: string;
  barLicense: string;
  courtStanding: string;
  amharicCourtStanding: string;
  categories: string[];
  hourlyRate: number;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  location: string;
  languagesSpoken: string[];
  badges: string[];
  bio: string;
  amharicBio: string;
  availability: string;
}

const ADVOCATES_DIRECTORY: Advocate[] = [
  {
    id: 'ETH-BAR-2018-0492',
    name: 'Advocate Mulu Haile',
    amharicName: 'ጠበቃ ሙሉ ኃይሌ',
    title: 'Senior Corporate & Capital Markets Counsel',
    amharicTitle: 'ከፍተኛ የንግድና ካፒታል ገበያ አማካሪ',
    barLicense: 'ETH-BAR-2018-0492',
    courtStanding: 'Federal Supreme Court & Cassation Division Qualified',
    amharicCourtStanding: 'የፌዴራል ጠቅላይ ፍርድ ቤት እና ሰበር ሰሚ ችሎት ተሟጋች',
    categories: ['corporate', 'capital-markets'],
    hourlyRate: 1500,
    experienceYears: 12,
    rating: 4.95,
    reviewsCount: 442,
    location: 'Bole, Addis Ababa',
    languagesSpoken: ['Amharic', 'English'],
    badges: ['Top Match', 'ECMA Accredited'],
    bio: 'Specialist in Commercial Code Art. 495 share company conversions, ECMA Directive 1030/2024 compliance, and Addis Ababa Chamber arbitration.',
    amharicBio: 'በአዲሱ የንግድ ህግ አዋጅ 1240/2021 የኩባንያ መልሶ ማዋቀር፣ የውጭ ኢንቨስትመንት ፍቃድ እና የካፒታል ገበያ ባለስልጣን ተገዢነት ላይ የካበተ ልምድ ያላቸው ባለሙያ።',
    availability: 'Available Today'
  },
  {
    id: 'ETH-BAR-2020-1104',
    name: 'Advocate Tigist Bekele',
    amharicName: 'ጠበቃ ትዕግሥት በቀለ',
    title: 'Labor Relations & Family Law Counsel',
    amharicTitle: 'የሠራተኛና አሠሪ ህግ ባለሙያ',
    barLicense: 'ETH-BAR-2020-1104',
    courtStanding: 'Federal High Court Qualified',
    amharicCourtStanding: 'የፌዴራል ከፍተኛ ፍርድ ቤት ጠበቃ',
    categories: ['employment', 'family'],
    hourlyRate: 1200,
    experienceYears: 8,
    rating: 4.88,
    reviewsCount: 312,
    location: 'Kirkos, Addis Ababa',
    languagesSpoken: ['Amharic', 'English', 'Afaan Oromoo'],
    badges: ['Fast Responder', 'Mediation Expert'],
    bio: 'Experienced litigator specializing in Labor Proclamation No. 1156/2019 claims, collective bargaining, and amicable civil divorce settlements.',
    amharicBio: 'በአዋጅ ቁጥር 1156/2019 መሰረት በስራ ቅጥር ውሎች፣ በህብረት ስምምነቶች እና በስንብት ክፍያ ክርክሮች ላይ ልዩ ድጋፍ የሚሰጡ አማካሪ።',
    availability: 'Available Tomorrow'
  },
  {
    id: 'ETH-BAR-2015-0081',
    name: 'Advocate Dawit Tesfaye',
    amharicName: 'ጠበቃ ዳዊት ተስፋዬ',
    title: 'Real Estate & Land Administration Counsel',
    amharicTitle: 'የመሬት ይዞታና ሪል እስቴት ህግ ባለሙያ',
    barLicense: 'ETH-BAR-2015-0081',
    courtStanding: 'Cassation Division Senior Litigator',
    amharicCourtStanding: 'የፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት ከፍተኛ ጠበቃ',
    categories: ['property', 'corporate'],
    hourlyRate: 1800,
    experienceYears: 15,
    rating: 4.92,
    reviewsCount: 521,
    location: 'Yeka, Addis Ababa',
    languagesSpoken: ['Amharic', 'English'],
    badges: ['Senior Specialist', 'Land Due Diligence'],
    bio: 'Extensive litigation experience across municipal land tenure transfers, commercial title deed verification, and Cassation precedent appeals.',
    amharicBio: 'በማዘጋጃ ቤት የመሬት ይዞታዎች፣ የካርታ ትክክለኛነት ማረጋገጫ፣ የሊዝ መብት ዝውውር እና የሪል እስቴት ክርክሮች ላይ የ15 ዓመታት የሙግት ልምድ።',
    availability: 'Next Opening: Thursday'
  }
];

export default function FindLawyerPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Intake Modal State
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Matter Dossier
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [matterCategory, setMatterCategory] = useState('Corporate & Commercial');
  const [matterDetails, setMatterDetails] = useState('');
  
  // Step 2: Schedule & Format
  const [sessionType, setSessionType] = useState<'video' | 'in_person' | 'phone'>('video');
  const [sessionDate, setSessionDate] = useState('Tomorrow, 10:00 AM EAT');

  // Step 3: Authorization State
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [telebirrUssdCode, setTelebirrUssdCode] = useState<string | null>(null);

  const handlePhoneChange = (val: string) => {
    setClientPhone(val);
    const cleaned = val.replace(/\s+/g, '');
    if (!cleaned) {
      setPhoneError(null);
      return;
    }
    const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;
    if (!ethiopianPhoneRegex.test(cleaned)) {
      setPhoneError(
        language === 'am' 
          ? 'እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (ለምሳሌ 0911... ወይም 0712...)' 
          : 'Please enter a valid Ethiopian phone number (e.g. 0911... or 0712...)'
      );
    } else {
      setPhoneError(null);
    }
  };

  const handleOpenBooking = (advocate: Advocate) => {
    setSelectedAdvocate(advocate);
    setModalStep(1);
    setBookingSuccess(false);
    setTelebirrUssdCode(null);
  };

  const handleNextToSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = clientPhone.replace(/\s+/g, '');
    const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;
    if (!ethiopianPhoneRegex.test(cleaned)) {
      setPhoneError(
        language === 'am' 
          ? 'ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ማስገባት ግዴታ ነው' 
          : 'A valid Ethiopian phone number is required'
      );
      return;
    }
    setModalStep(2);
  };

  const handleConfirmEscrowHold = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      setBookingSuccess(true);
      setTelebirrUssdCode(`*127*${Math.floor(100000 + Math.random() * 900000)}#`);
    }, 1600);
  };

  const filteredAdvocates = ADVOCATES_DIRECTORY.filter((adv) => {
    const matchesCategory = selectedCategory === 'all' || adv.categories.includes(selectedCategory);
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      adv.name.toLowerCase().includes(query) ||
      adv.amharicName.includes(query) ||
      adv.title.toLowerCase().includes(query) ||
      adv.courtStanding.toLowerCase().includes(query) ||
      adv.barLicense.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 1. Global Navigation Bar - Unified Across Site */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-3 shrink-0 mr-2">
            <img 
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

          <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-[#0A1128] transition-colors whitespace-nowrap flex items-center gap-1">
              <HomeIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('nav_home')}</span>
            </Link>

            <Link href="/find-a-lawyer" className="text-[#0A1128] font-black border-b-2 border-amber-500 pb-1 whitespace-nowrap">
              {t('nav_find_lawyer')}
            </Link>

            <Link href="/practice-areas" className="hover:text-[#0A1128] transition-colors whitespace-nowrap">
              {t('nav_practice_areas')}
            </Link>

            <Link href="/diaspora" className="hover:text-[#0A1128] transition-colors flex items-center gap-1.5 text-blue-600 font-bold whitespace-nowrap">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('nav_diaspora')}</span>
            </Link>

            <Link href="/memo/MEMO-2026-9041" className="hover:text-[#0A1128] transition-colors flex items-center gap-1 text-amber-700 font-bold whitespace-nowrap">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'am' ? 'የህግ አስተያየት' : 'Legal Memo'}</span>
              <span className="bg-amber-100 text-amber-900 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                A4
              </span>
            </Link>

            <Link href="/#about" className="hover:text-[#0A1128] transition-colors whitespace-nowrap">
              {t('nav_about')}
            </Link>

            <Link href="/legaltalk" className="hover:text-[#0A1128] transition-colors whitespace-nowrap">
              {t('nav_legaltalk')}
            </Link>
          </nav>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-slate-50 shadow-xs cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <Link 
              href="/for-lawyers" 
              className="text-xs font-bold text-slate-600 hover:text-[#0A1128] px-2 py-2 transition-colors whitespace-nowrap hidden lg:block"
            >
              {t('nav_for_advocates')}
            </Link>

            <Link 
              href="/login" 
              className="text-xs font-bold text-slate-600 hover:text-[#0A1128] px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {t('nav_sign_in')}
            </Link>

            <Link 
              href="/find-a-lawyer" 
              className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 group whitespace-nowrap"
            >
              <span>{t('nav_book_consultation')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-700 cursor-pointer sm:hidden"
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Container - Single Level Without Redundant Back Button Row */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Prestige Hero Card */}
        <div className="bg-[#0A1128] text-white p-7 sm:p-9 rounded-3xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
              CONFIDENTIAL CLIENT INTAKE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              {language === 'am' ? 'የተረጋገጡ የኢትዮጵያ ጠበቆችን ያግኙ' : 'Find Verified Legal Counsel'}
            </h1>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              {language === 'am'
                ? 'በፍትህ ሚኒስቴር የተመረመሩ ጠበቆችን ይምረጡ፤ ጉዳይዎን ያስረዱ፤ ክፍያዎን በቴሌብር የዋስትና ሂሳብ ውስጥ ያስቀምጡ። አገልግሎቱ ሲጠናቀቅ ብቻ ክፍያው ይለቀቃል።'
                : 'Select an accredited advocate, describe your legal matter, and lock your consultation retainer in Telebirr Escrow. Retainers are released only after consultation is complete.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center gap-3 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">CLIENT PROTECTION</span>
              <strong className="text-white text-xs">Commercial Code 1240/2021 Escrow</strong>
            </div>
          </div>
        </div>

        {/* Search & Categories Filter */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በጠበቃ ስም፣ የፍቃድ ቁጥር፣ ወይም የህግ ዘርፍ ይፈልጉ...' : 'Search by legal subject or advocate...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: language === 'am' ? 'ሁሉም ዘርፎች' : 'All Practice Areas' },
              { id: 'corporate', label: language === 'am' ? 'የንግድና ኩባንያ' : 'Corporate & M&A' },
              { id: 'property', label: language === 'am' ? 'የመሬትና ይዞታ' : 'Real Estate & Land' },
              { id: 'employment', label: language === 'am' ? 'የሠራተኛና አሠሪ' : 'Labor Law' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advocates Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredAdvocates.map((adv) => (
            <div 
              key={adv.id}
              className="card-hover bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase">
                    {adv.badges[0]}
                  </span>
                  <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{adv.rating}</span>
                    <span className="text-slate-400 font-normal">({adv.reviewsCount})</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-black text-[#0A1128]">
                    {language === 'am' ? adv.amharicName : adv.name}
                  </h2>
                  <span className="text-xs text-slate-500 block">
                    {language === 'am' ? adv.amharicTitle : adv.title}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                  {language === 'am' ? adv.amharicBio : adv.bio}
                </p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{adv.barLicense}</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    {adv.experienceYears} Years ({adv.courtStanding.split('&')[0].trim()})
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">FIXED RETAINER</span>
                  <strong className="text-sm font-black text-[#0A1128]">ETB {adv.hourlyRate.toLocaleString()}</strong>
                  <span className="text-[9px] text-emerald-700 block font-semibold">Telebirr Escrow Protected</span>
                </div>

                <button
                  onClick={() => handleOpenBooking(adv)}
                  className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer group"
                >
                  <span>{language === 'am' ? 'ቀጠሮ ይያዙ' : 'Consult'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* 3-Step Intake Modal */}
      {selectedAdvocate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
                  LEGAL CONSULTATION INTAKE
                </span>
                <strong className="text-base font-black text-[#0A1128] mt-0.5 block">
                  {language === 'am' ? selectedAdvocate.amharicName : selectedAdvocate.name}
                </strong>
              </div>
              <button
                onClick={() => setSelectedAdvocate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!bookingSuccess && (
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl text-center text-[10px] font-bold">
                <div className={`py-1.5 rounded-xl ${modalStep === 1 ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'}`}>
                  1. Dossier
                </div>
                <div className={`py-1.5 rounded-xl ${modalStep === 2 ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'}`}>
                  2. Schedule
                </div>
                <div className={`py-1.5 rounded-xl ${modalStep === 3 ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'}`}>
                  3. Escrow Hold
                </div>
              </div>
            )}

            {modalStep === 1 && !bookingSuccess && (
              <form onSubmit={handleNextToSchedule} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawit Alemu"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ethiopian Mobile Number (Telebirr) *</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="0911 000 000 or 0712 000 000"
                      value={clientPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                  {phoneError && (
                    <div className="flex items-center gap-1.5 text-red-600 text-[11px] font-semibold mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{phoneError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brief Situation Summary *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide a concise overview for counsel..."
                    value={matterDetails}
                    onChange={(e) => setMatterDetails(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue to Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {modalStep === 2 && !bookingSuccess && (
              <div className="space-y-4">
                <span className="font-bold text-slate-700 block">Select Consultation Mode</span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSessionType('video')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all ${
                      sessionType === 'video' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="font-bold text-[11px]">Video Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionType('in_person')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all ${
                      sessionType === 'in_person' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="font-bold text-[11px]">Office Visit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSessionType('phone')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all ${
                      sessionType === 'phone' ? 'bg-[#0A1128] text-white border-[#0A1128]' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-bold text-[11px]">Phone Call</span>
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="block font-bold text-slate-700">Proposed Slot</label>
                  <select
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Tomorrow, 10:00 AM EAT">Tomorrow, 10:00 AM EAT</option>
                    <option value="Tomorrow, 02:30 PM EAT">Tomorrow, 02:30 PM EAT</option>
                    <option value="Thursday, 09:30 AM EAT">Thursday, 09:30 AM EAT</option>
                  </select>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(1)}
                    className="text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalStep(3)}
                    className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue to Escrow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {modalStep === 3 && !bookingSuccess && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Commercial Code Proclamation 1240/2021 Escrow</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed font-normal text-[11px]">
                    Retainer fees remain in regulatory escrow. Funds transfer to the advocate only after the consultation is fulfilled and authorized by your confirmation voucher.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Advocate Initial Retainer:</span>
                    <span>ETB {selectedAdvocate.hourlyRate.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#0A1128]">
                    <span>Total Escrow Hold:</span>
                    <span>ETB {selectedAdvocate.hourlyRate.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setModalStep(2)}
                    className="text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    disabled={isAuthorizing}
                    onClick={handleConfirmEscrowHold}
                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isAuthorizing ? 'Pushing USSD Prompt...' : 'Authorize Escrow Hold via Telebirr'}</span>
                  </button>
                </div>
              </div>
            )}

            {bookingSuccess && (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A1128]">
                    Consultation Escrow Hold Activated!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    A Telebirr USSD push prompt has been initiated to {clientPhone}.
                  </p>
                </div>

                {telebirrUssdCode && (
                  <div className="p-3 bg-slate-100 rounded-2xl max-w-xs mx-auto font-mono text-xs font-bold text-slate-800">
                    <span>Manual USSD Code: </span>
                    <span className="text-emerald-700">{telebirrUssdCode}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/escrow"
                    className="px-5 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-center"
                  >
                    Track on Escrow Desk
                  </Link>
                  <button
                    onClick={() => setSelectedAdvocate(null)}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto">
        LegalLink Ethiopian Bar Directory • Ministry of Justice Regulatory Audit Node • Addis Ababa
      </footer>

    </div>
  );
}