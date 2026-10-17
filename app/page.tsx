'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts' | 'receipts'>('consultations');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // -------------------------------------------------------------
  // CLIENT MATCHING FLOW (4 STAGES)
  // -------------------------------------------------------------
  const [matchStep, setMatchStep] = useState<1 | 2 | 3 | 4>(1);
  const [clientName, setClientName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Corporate & Business Law');
  const [location, setLocation] = useState('Addis Ababa');
  const [consultLanguage, setConsultLanguage] = useState('Amharic');
  const [budgetRange, setBudgetRange] = useState('ETB 1,000–2,000');
  const [urgency, setUrgency] = useState('within_24h');
  const [situationText, setSituationText] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<'telebirr' | 'cbe' | 'chapa'>('telebirr');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // -------------------------------------------------------------
  // USER DASHBOARD (MY CONSULTATIONS) & DETAILS MODAL
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);

  const fetchMyConsultations = async () => {
    setLoadingMyConsultations(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMyConsultations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMyConsultations(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-consultations') {
      fetchMyConsultations();
    }
  }, [activeTab]);

  // Submit client matching consultation to Supabase
  const handleBookingSubmit = async () => {
    if (!situationText.trim()) {
      alert('Please describe your legal situation before confirming.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('consultations').insert([
        {
          client_name: clientName.trim() || 'Anonymous Client',
          practice_area: selectedCategory,
          location: location,
          situation_description: situationText.trim(),
          budget_range: budgetRange,
          urgency: urgency,
          status: 'pending',
        },
      ]);

      if (error) {
        alert('Could not save booking: ' + error.message);
      } else {
        setBookingConfirmed(true);
      }
    } catch (err: any) {
      alert('Unexpected error occurred saving your consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // LEXDRAFT STATE
  // -------------------------------------------------------------
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [docGenerated, setDocGenerated] = useState(false);
  const [savedContracts, setSavedContracts] = useState<any[]>([
    { id: 'cnt-1', title: 'Employment Contract - Senior Developer', date: '2026-10-14', fee: 'ETB 450', status: 'Ready' },
    { id: 'cnt-2', title: 'Bilingual Mutual NDA', date: '2026-10-09', fee: 'ETB 300', status: 'Ready' }
  ]);

  // -------------------------------------------------------------
  // LEGALTALK STATE
  // -------------------------------------------------------------
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // -------------------------------------------------------------
  // LAWYER ONBOARDING (4 STEPS)
  // -------------------------------------------------------------
  const [lawyerStep, setLawyerStep] = useState<1 | 2 | 3 | 4>(1);

  // 8 Practice Areas
  const practiceAreas = [
    { id: 'Corporate & Business Law', title: 'Corporate & Business', amTitle: 'የንግድና ኩባንያ ሕግ', icon: Briefcase, desc: 'Company formation, contracts, M&A, governance.' },
    { id: 'Family Law', title: 'Family Law', amTitle: 'የቤተሰብ ሕግ', icon: Heart, desc: 'Divorce, custody, adoption, inheritance disputes.' },
    { id: 'Property & Real Estate', title: 'Property & Real Estate', amTitle: 'የንብረትና ይዞታ ሕግ', icon: Home, desc: 'Land rights, title verification, lease agreements.' },
    { id: 'Intellectual Property', title: 'Intellectual Property', amTitle: 'የአእምሯዊ ንብረት ሕግ', icon: Lightbulb, desc: 'Trademarks, copyright, patents, IP protection.' },
    { id: 'Employment Law', title: 'Employment Law', amTitle: 'የሥራና ሠራተኛ ሕግ', icon: Users, desc: 'Labor disputes, contracts, workplace rights.' },
    { id: 'Criminal Defense', title: 'Criminal Defense', amTitle: 'የወንጀል መከላከያ ሕግ', icon: Shield, desc: 'Representation, bail, appeals, rights defense.' },
    { id: 'Immigration & Diaspora', title: 'Immigration & Diaspora', amTitle: 'የኢሚግሬሽንና ዳያስፖራ ሕግ', icon: Globe, desc: 'Visa, origin ID, diaspora property, residency.' },
    { id: 'NGO & Compliance', title: 'NGO & Compliance', amTitle: 'የድርጅቶችና ማህበራት ሕግ', icon: Building, desc: 'Registration, compliance, grant agreements.' },
  ];

  // Matched Lawyers Pool
  const mockMatchedLawyers = [
    {
      id: 'l1',
      name: 'Advocate Mulu Haile',
      title: 'Corporate & Business Specialist',
      experience: '12 yrs exp',
      rating: 4.95,
      reviews: 438,
      hourlyRate: 1500,
      location: 'Addis Ababa',
      slots: ['10:00 AM', '2:00 PM', '4:30 PM'],
      bio: 'Senior Federal Advocate specializing in Ethiopian corporate law, M&A, and commercial contract drafting.',
      avatarInitials: 'MH',
    },
    {
      id: 'l2',
      name: 'Advocate Tigist Bekele',
      title: 'Family & Civil Law Advocate',
      experience: '9 yrs exp',
      rating: 4.88,
      reviews: 312,
      hourlyRate: 1200,
      location: 'Addis Ababa',
      slots: ['9:30 AM', '1:00 PM', '3:30 PM'],
      bio: 'Trusted advocate for family mediation, divorce division of assets, child custody, and inheritance decrees.',
      avatarInitials: 'TB',
    },
    {
      id: 'l3',
      name: 'Advocate Dawit Tesfaye',
      title: 'Property & Real Estate Attorney',
      experience: '15 yrs exp',
      rating: 4.92,
      reviews: 521,
      hourlyRate: 1800,
      location: 'Hawassa / Addis Ababa',
      slots: ['11:00 AM', '3:00 PM', '5:00 PM'],
      bio: 'Former land administration legal advisor. Expert in land lease titles, construction disputes, and property acquisition.',
      avatarInitials: 'DT',
    },
    {
      id: 'l4',
      name: 'Advocate Selamawit Girma',
      title: 'Immigration & Diaspora Counsel',
      experience: '8 yrs exp',
      rating: 4.85,
      reviews: 274,
      hourlyRate: 2000,
      location: 'Addis Ababa / Remote',
      slots: ['10:30 AM', '2:30 PM', '6:00 PM'],
      bio: 'Dedicated to helping the Ethiopian diaspora resolve legal claims, investment licensing, and dual citizenship matters remotely.',
      avatarInitials: 'SG',
    },
  ];

  // LexDraft Templates
  const lexdraftTemplates = [
    {
      id: 'emp',
      title: 'Employment Contract',
      category: 'Labor Law',
      priceETB: 450,
      popular: true,
      desc: 'Compliant with Ethiopian Labor Proclamation No. 1156/2019 for fixed or indefinite terms.',
      fields: ['employerName', 'employeeName', 'jobTitle', 'monthlySalary', 'startDate'],
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      category: 'Corporate & Business',
      priceETB: 300,
      popular: true,
      desc: 'Protects proprietary secrets, financials, customer databases, and trade disclosures in Ethiopia.',
      fields: ['disclosingParty', 'receivingParty', 'purpose', 'termYears'],
    },
    {
      id: 'lease',
      title: 'Commercial Lease Agreement',
      category: 'Property & Real Estate',
      priceETB: 600,
      popular: true,
      desc: 'Commercial premises rental contract compliant with the Ethiopian Civil Code.',
      fields: ['landlordName', 'tenantName', 'propertyAddress', 'monthlyRentETB'],
    },
    {
      id: 'mou',
      title: 'Memorandum of Understanding (MOU)',
      category: 'Corporate & Business',
      priceETB: 350,
      popular: false,
      desc: 'Preliminary partnership and institutional cooperation agreement.',
      fields: ['partyOne', 'partyTwo', 'projectScope'],
    },
    {
      id: 'checklist',
      title: 'Business Registration Checklist',
      category: 'Corporate & Business',
      priceETB: 150,
      popular: false,
      desc: 'Statutory guide for registering a PLC or Sole Proprietorship with the Ministry of Trade.',
      fields: ['companyName', 'capitalETB', 'businessType'],
    },
  ];

  // LegalTalk Articles
  const legalTalkArticles = [
    {
      id: 'art-1',
      title: 'What Ethiopian Startups Need to Know About Company Registration',
      category: 'Business Law',
      readTime: '7 min read',
      author: 'Advocate Mulu Haile',
      cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      excerpt: 'A step-by-step guide to registering your startup under the Ethiopian Commercial Code, including capital minimums and digital filings.',
      content: `The revision of Ethiopia’s Commercial Code brought major modernization for tech startups and small-to-medium enterprises.
      
1. One-Person Companies: Entrepreneurs can now incorporate a limited liability company without requiring secondary nominal shareholders.
2. Digital Authentication: The Ministry of Trade & Regional Integration now permits digital submission of Articles of Association.
3. Capital Flexibility: Minimum initial capital requirements have been adapted to support lean digital enterprises.`,
    },
    {
      id: 'art-2',
      title: 'Your Rights in Ethiopian Divorce Law: A Plain-Language Guide',
      category: 'Family Law',
      readTime: '5 min read',
      author: 'Advocate Tigist Bekele',
      cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Understanding property division, joint assets, child custody, and maintenance under the Federal Revised Family Code.',
      content: `Under the Revised Family Code of Ethiopia (Proclamation No. 213/2000), marriages can be dissolved through mutual petition or judicial determination.

1. Common Property vs Personal Assets: Assets acquired during the subsistence of marriage are presumed common unless proven personal.
2. Child Custody & Maintenance: Courts prioritize the child's psychological, educational, and material stability above all parental claims.`,
    },
    {
      id: 'art-3',
      title: 'New Labor Proclamation Changes: What Employers Must Know',
      category: 'Employment Law',
      readTime: '8 min read',
      author: 'Advocate Dawit Tesfaye',
      cover: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Key changes in Ethiopian labor regulation, probation periods, overtime limits, severance, and termination protections.',
      content: `Labor Proclamation No. 1156/2019 governs private employment relationships across Ethiopia.

1. Probation: Maximum 60 working days under a written agreement.
2. Severance Calculation: Statutory multipliers apply based on completed service years.
3. Protected Termination: Employers must adhere strictly to statutory procedures before enacting terminations.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <img 
                src="/logo.png" 
                alt="LegalLink Logo" 
                className="w-10 h-10 object-contain hover:scale-105 transition-transform" 
              />
              <div>
                <span className="text-xl font-black tracking-tight text-[#0A1128]">
                  Legal<span className="text-amber-500">Link</span>
                </span>
                <span className="hidden sm:block text-[9px] tracking-widest text-slate-400 font-bold uppercase">
                  Ethiopia
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'match', label: lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer' },
                { id: 'for-lawyers', label: lang === 'am' ? 'ለሕግ ባለሙያዎች' : 'For Lawyers' },
                { id: 'legaltalk', label: 'LegalTalk' },
                { id: 'lexdraft', label: 'LexDraft' },
                { id: 'my-consultations', label: lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'match') setMatchStep(1);
                  }}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === item.id 
                      ? 'text-[#0A1128] bg-slate-100 font-bold' 
                      : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Language & Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'አማ (AM)' : 'EN (US)'}</span>
              </button>

              <button 
                onClick={() => setIsRoleModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0A1128] cursor-pointer"
              >
                {lang === 'am' ? 'ግባ' : 'Sign in'}
              </button>

              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#0A1128] hover:bg-[#102A43] rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {lang === 'am' ? 'ጀምር' : 'Get Started'}
              </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="px-2 py-1 text-xs font-bold border border-slate-200 rounded"
              >
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-700">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-2">
            {[
              { id: 'match', label: lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer' },
              { id: 'for-lawyers', label: lang === 'am' ? 'ለሕግ ባለሙያዎች' : 'For Lawyers' },
              { id: 'legaltalk', label: 'LegalTalk' },
              { id: 'lexdraft', label: 'LexDraft' },
              { id: 'my-consultations', label: lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 2. PUBLIC LANDING VIEW */}
      {activeTab === 'home' && (
        <main className="flex-1">
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Hero */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lang === 'am' ? "የኢትዮጵያ ቀዳሚ የሕግ ገበያ" : "ETHIOPIA'S #1 LEGAL MARKETPLACE"}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                    {lang === 'am' ? 'የሕግ አገልግሎት የወደፊት ገጽታ፣ ዛሬ።' : 'The Future of Law, Today.'}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                    {lang === 'am' 
                      ? 'ፈቃዳቸው ከተረጋገጠ የኢትዮጵያ ጠበቆች ጋር ለምክር፣ ለውል ዝግጅትና ለሕግ ድጋፍ በቀላሉ፣ በተመጣጣኝ ዋጋና በደህንነት ይገናኙ።'
                      : 'Connect with verified Ethiopian lawyers for consultations, document drafting, and compliance support—quickly, affordably, and securely.'}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>{lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => setIsRoleModalOpen(true)}
                      className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1128] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      {lang === 'am' ? 'ጀምር' : 'Get Started'}
                    </button>
                  </div>

                  {/* 4 Stats */}
                  <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">500+</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የተረጋገጡ ጠበቆች' : 'Verified Lawyers'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">12,000+</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የተጠናቀቁ ምክክሮች' : 'Consultations Done'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">97%</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የደንበኞች እርካታ' : 'Client Satisfaction'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">&lt;2hrs</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'አማካይ ምላሽ' : 'Average Response'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero Card: Advocate Mulu Haile */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow">
                          MH
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-[#0A1128] text-base">Advocate Mulu Haile</h3>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </div>
                          <p className="text-xs text-slate-500">Corporate & Business Law</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Top Rated
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold">500+ Lawyers Online</span>
                    </div>

                    <div className="mt-5">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
                        AVAILABLE TODAY
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {['10:00 AM', '2:00 PM', '4:30 PM'].map((slot) => (
                          <div
                            key={slot}
                            onClick={() => {
                              setSelectedLawyer(mockMatchedLawyers[0]);
                              setSelectedTimeSlot(slot);
                              setActiveTab('match');
                              setMatchStep(4);
                            }}
                            className="py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#0A1128] hover:text-white cursor-pointer transition-colors"
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLawyer(mockMatchedLawyers[0]);
                        setActiveTab('match');
                        setMatchStep(4);
                      }}
                      className="mt-6 w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-sm transition-all shadow cursor-pointer"
                    >
                      Book Consultation
                    </button>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Trusted & Verified in Ethiopia</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Practice Areas */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">EXPERTISE</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Practice Areas</h2>
                  <p className="text-sm text-slate-600 mt-2">Find specialized legal expertise across Ethiopian law.</p>
                </div>
                <button 
                  onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                  className="mt-4 sm:mt-0 text-xs font-bold text-[#0A1128] hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                >
                  Browse All 18 Areas →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {practiceAreas.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('match');
                        setMatchStep(2);
                      }}
                      className="p-6 rounded-2xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer hover:shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1128] mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#0A1128] text-base">{lang === 'am' ? cat.amTitle : cat.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* 3. DEDICATED USER DASHBOARD (CLIENT PORTAL) */}
      {activeTab === 'my-consultations' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
          
          {/* Client Portal Header */}
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CLIENT ACCOUNT HUB</span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome to Your Legal Workspace</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Manage your consultations with Ethiopian advocates, download drafted contracts, and verify escrow transactions.
              </p>
            </div>
            <button
              onClick={() => { setActiveTab('match'); setMatchStep(1); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              + Book New Advocate
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
            <button
              onClick={() => setClientSubTab('consultations')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'consultations' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Consultations & Cases ({myConsultations.length})
            </button>
            <button
              onClick={() => setClientSubTab('contracts')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'contracts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              My Saved Contracts ({savedContracts.length})
            </button>
            <button
              onClick={() => setClientSubTab('receipts')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'receipts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Escrow Receipts & Clearing
            </button>
          </div>

          {/* SUB-TAB 1: CONSULTATIONS */}
          {clientSubTab === 'consultations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Showing all cases synchronized with Supabase PostgreSQL</span>
                <button
                  onClick={fetchMyConsultations}
                  disabled={loadingMyConsultations}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] text-xs font-bold rounded-lg cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-amber-500 ${loadingMyConsultations ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingMyConsultations ? (
                <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0A1128]" />
                  Loading your consultation records...
                </div>
              ) : myConsultations.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <h3 className="font-bold text-sm text-[#0A1128]">No active requests found</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Request a consultation with a verified lawyer to get started.</p>
                  <button
                    onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                    className="px-5 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow cursor-pointer"
                  >
                    Request Consultation
                  </button>
                </div>
              ) : (
                myConsultations.map((c) => (
                  <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#0A1128]">{c.practice_area}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          c.status === 'approved' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : c.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.status === 'cancelled'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {c.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">{c.situation_description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>📍 {c.location}</span>
                        <span>💰 {c.budget_range || 'ETB 1,000–2,000'}</span>
                        <span>📅 {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <button
                        onClick={() => setSelectedConsultationDetails(c)}
                        className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SUB-TAB 2: CONTRACTS */}
          {clientSubTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedContracts.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">LexDraft Stored Document</span>
                    <h4 className="font-bold text-sm text-[#0A1128] mt-0.5">{doc.title}</h4>
                    <span className="text-[11px] text-slate-400 block mt-1">Generated: {doc.date} • {doc.fee}</span>
                  </div>
                  <button 
                    onClick={() => window.print()}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 3: RECEIPTS */}
          {clientSubTab === 'receipts' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-[#0A1128]">Escrow Protection & Payment Security</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                All client consultation retainers and LexDraft template fees in Ethiopia are safeguarded in an NBE-compliant escrow trust account. Advocate payouts are authorized solely following client case sign-off.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0A1128] block">Escrow Clearance Node</span>
                  <span className="text-slate-500">Telebirr & CBE Partner Gateway (Addis Ababa)</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                  SSL Encrypted & Insured
                </span>
              </div>
            </div>
          )}

        </main>
      )}

      {/* Interactive Consultation Details Modal */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {selectedConsultationDetails.practice_area}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedConsultationDetails.status === 'approved' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : selectedConsultationDetails.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedConsultationDetails.status === 'cancelled'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedConsultationDetails.status || 'pending'}
                  </span>
                </div>
                <h3 className="font-black text-xl text-[#0A1128] mt-1">Consultation Overview</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Case ID: #{selectedConsultationDetails.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedConsultationDetails(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Case Progression</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1. Submitted</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Database verified</span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    selectedConsultationDetails.status === 'approved' || selectedConsultationDetails.status === 'completed'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Clock className="w-4 h-4" />
                      <span>2. Review</span>
                    </div>
                    <span className="text-[10px] block mt-0.5">
                      {selectedConsultationDetails.status === 'approved' ? 'Assigned' : 'Under Review'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    selectedConsultationDetails.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>3. Resolved</span>
                    </div>
                    <span className="text-[10px] block mt-0.5">Final decree</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Client Name</span>
                  <span className="font-bold text-[#0A1128] text-sm">
                    {selectedConsultationDetails.client_name || 'Anonymous Client'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jurisdiction / Location</span>
                  <span className="font-bold text-[#0A1128] text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {selectedConsultationDetails.location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Budget Range</span>
                  <span className="font-bold text-[#0A1128] text-sm">
                    {selectedConsultationDetails.budget_range || 'ETB 1,000–2,000'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Submission Date</span>
                  <span className="font-bold text-[#0A1128] text-sm">
                    {selectedConsultationDetails.created_at ? new Date(selectedConsultationDetails.created_at).toLocaleString() : 'Recent'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Situation Description</span>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedConsultationDetails.situation_description}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Assigned Advocate Match:</strong> An advocate specializing in Ethiopian {selectedConsultationDetails.practice_area} in {selectedConsultationDetails.location} is reviewing your case brief. Escrow payment will only be released upon completed legal consultation.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedConsultationDetails(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLIENT MATCHING WIZARD */}
      {activeTab === 'match' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
          <div className="flex items-center justify-between max-w-md mx-auto mb-8">
            {[
              { num: 1, label: 'Category' },
              { num: 2, label: 'Preferences' },
              { num: 3, label: 'Match' },
              { num: 4, label: 'Confirm' },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  matchStep === s.num ? 'bg-[#0A1128] text-amber-400 ring-4 ring-amber-100' : matchStep > s.num ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {matchStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[11px] font-semibold text-slate-600 mt-1">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {matchStep === 1 && (
              <div>
                <div className="text-center max-w-md mx-auto mb-6">
                  <span className="text-xs font-bold text-amber-600 uppercase">Stage 1 of 4</span>
                  <h2 className="text-2xl font-black text-[#0A1128] mt-1">What do you need help with?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {practiceAreas.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedCategory(p.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedCategory === p.id ? 'border-[#0A1128] bg-slate-50 ring-2 ring-[#0A1128]' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-[#0A1128] mb-2" />
                        <h4 className="font-bold text-xs text-[#0A1128]">{p.title}</h4>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={() => setMatchStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">
                    <span>Next: Set Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {matchStep === 2 && (
              <div className="space-y-5">
                <div className="text-center max-w-md mx-auto mb-4">
                  <span className="text-xs font-bold text-amber-600 uppercase">Stage 2 of 4</span>
                  <h2 className="text-2xl font-black text-[#0A1128] mt-1">Your Preferences</h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Ybeltal Semagn"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Dire Dawa">Dire Dawa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Bahir Dar">Bahir Dar</option>
                      <option value="Mekelle">Mekelle</option>
                      <option value="Adama">Adama</option>
                      <option value="Remote / Online">Remote / Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Language</label>
                    <select value={consultLanguage} onChange={(e) => setConsultLanguage(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm">
                      <option value="Amharic">Amharic (አማርኛ)</option>
                      <option value="English">English</option>
                      <option value="Oromo">Afaan Oromoo</option>
                      <option value="Tigrinya">Tigrinya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Describe Your Legal Situation</label>
                    <span className="text-xs text-slate-400">{situationText.length} / 500</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={situationText}
                    onChange={(e) => setSituationText(e.target.value)}
                    placeholder="Explain your case in plain language..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setMatchStep(1)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button onClick={() => setMatchStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">
                    <span>Next: Match Lawyers</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {matchStep === 3 && (
              <div>
                <div className="text-center max-w-md mx-auto mb-6">
                  <span className="text-xs font-bold text-amber-600 uppercase">Stage 3 of 4</span>
                  <h2 className="text-2xl font-black text-[#0A1128] mt-1">Matched Verified Lawyers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockMatchedLawyers.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLawyer(l)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        selectedLawyer?.id === l.id ? 'border-[#0A1128] bg-amber-50/20 ring-2 ring-[#0A1128]' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-xs">
                            {l.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#0A1128]">{l.name}</h4>
                            <p className="text-xs text-slate-500">{l.title}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#0A1128]">ETB {l.hourlyRate}/hr</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{l.bio}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-6 border-t border-slate-100 mt-6">
                  <button onClick={() => setMatchStep(2)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button 
                    disabled={!selectedLawyer}
                    onClick={() => setMatchStep(4)} 
                    className="px-6 py-2.5 bg-[#0A1128] text-white rounded-xl font-bold text-sm disabled:opacity-40 cursor-pointer"
                  >
                    Confirm Consultation →
                  </button>
                </div>
              </div>
            )}

            {matchStep === 4 && (
              <div>
                {bookingConfirmed ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-xl font-black text-[#0A1128]">Consultation Successfully Saved!</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Your consultation details have been recorded directly in the Supabase database.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setBookingConfirmed(false);
                          setActiveTab('my-consultations');
                        }}
                        className="px-6 py-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        View in Client Portal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-[#0A1128] mb-4">Confirm Consultation Details</h3>
                    <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs border border-slate-200 mb-6">
                      <p><strong>Selected Advocate:</strong> {selectedLawyer?.name || 'Advocate Mulu Haile'}</p>
                      <p><strong>Practice Area:</strong> {selectedCategory}</p>
                      <p><strong>Location:</strong> {location}</p>
                      <p><strong>Time Slot:</strong> {selectedTimeSlot}</p>
                      <p><strong>Hourly Escrow Fee:</strong> ETB {selectedLawyer?.hourlyRate || 1500}</p>
                    </div>
                    <div className="flex justify-between">
                      <button onClick={() => setMatchStep(3)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                      <button
                        disabled={isSubmitting}
                        onClick={handleBookingSubmit}
                        className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#0A1128] font-bold rounded-xl text-sm shadow cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Save in Supabase'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* 5. LEXDRAFT MODULE */}
      {activeTab === 'lexdraft' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">LEXDRAFT AUTOMATION</span>
            <h2 className="text-3xl font-black text-[#0A1128] mt-1">Legal documents, ready in minutes.</h2>
            <p className="text-sm text-slate-600 mt-2">
              Automate the creation of employment contracts, NDAs, lease agreements, and checklists tailored to Ethiopian law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lexdraftTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{tpl.category}</span>
                    {tpl.popular && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Popular</span>}
                  </div>
                  <h3 className="font-bold text-base text-[#0A1128]">{tpl.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{tpl.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-[#0A1128]">ETB {tpl.priceETB}</span>
                  <button
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setDocFormData({});
                      setDocGenerated(false);
                    }}
                    className="px-4 py-2 bg-[#0A1128] text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
                  >
                    Draft Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* LexDraft Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-[#0A1128]">{selectedTemplate.title}</h3>
                <span className="text-xs text-slate-500">Statutory Fee: ETB {selectedTemplate.priceETB}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0A1128] uppercase">Fill Document Variables</h4>
                {selectedTemplate.fields.map((f: string) => (
                  <div key={f}>
                    <label className="block text-xs font-semibold text-slate-700 capitalize mb-1">
                      {f.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${f}...`}
                      value={docFormData[f] || ''}
                      onChange={(e) => setDocFormData({ ...docFormData, [f]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setDocGenerated(true)}
                  className="w-full py-2.5 bg-amber-500 font-bold text-xs text-[#0A1128] rounded-xl mt-2 cursor-pointer hover:bg-amber-600"
                >
                  Generate Preview
                </button>
              </div>

              {/* Document Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-sans font-bold text-center underline mb-3">{selectedTemplate.title.toUpperCase()}</h5>
                  <p className="text-slate-600 mb-2 leading-relaxed">
                    This legally binding document is drafted under the laws and proclamations of the Federal Democratic Republic of Ethiopia.
                  </p>
                  {Object.entries(docFormData).map(([k, v]) => (
                    <p key={k} className="text-slate-800">
                      <strong>{k.replace(/([A-Z])/g, ' $1')}:</strong> {v || '___________'}
                    </p>
                  ))}
                </div>

                {docGenerated && (
                  <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
                    <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1128] text-white rounded-lg text-xs font-bold cursor-pointer">
                      <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. LEGALTALK ARTICLES */}
      {activeTab === 'legaltalk' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">LEGAL EDUCATION</span>
            <h2 className="text-3xl font-black text-[#0A1128] mt-1">Legal insights for everyday Ethiopians.</h2>
            <p className="text-sm text-slate-600 mt-2">Plain-language guides on business setup, family rights, and labor proclamations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalTalkArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <img src={art.cover} alt={art.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <span className="text-xs font-bold text-amber-600 block mb-1">{art.category}</span>
                    <h3 className="font-bold text-base text-[#0A1128] leading-snug">{art.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{art.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                  <span>{art.author}</span>
                  <span className="text-[#0A1128] font-bold">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">{selectedArticle.category}</span>
                <h3 className="font-extrabold text-xl text-[#0A1128] mt-1">{selectedArticle.title}</h3>
                <span className="text-xs text-slate-400">By {selectedArticle.author}</span>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}

      {/* 7. FOR LAWYERS ONBOARDING */}
      {activeTab === 'for-lawyers' && (
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs">
            {[
              { num: 1, label: '01 Apply & Verify' },
              { num: 2, label: '02 Build Profile' },
              { num: 3, label: '03 Availability' },
              { num: 4, label: '04 Payout Setup' },
            ].map((s) => (
              <div key={s.num} className={`p-2.5 rounded-xl border font-bold ${lawyerStep === s.num ? 'bg-[#0A1128] text-white' : 'bg-slate-50 text-slate-400'}`}>
                {s.label}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {lawyerStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 01: Advocate Credentials</h3>
                <input type="text" placeholder="Full Legal Advocate Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <input type="text" placeholder="Advocacy License Number (e.g. MOJ/FED/2020/1234)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <button onClick={() => setLawyerStep(2)} className="w-full py-2.5 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">
                  Continue to Profile →
                </button>
              </div>
            )}
            {lawyerStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 02: Profile & Hourly Rates</h3>
                <input type="number" defaultValue={1500} placeholder="Hourly Rate (ETB)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold" />
                <textarea rows={3} placeholder="Write a short advocate bio..." className="w-full p-3 rounded-xl border border-slate-200 text-sm" />
                <div className="flex justify-between">
                  <button onClick={() => setLawyerStep(1)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button onClick={() => setLawyerStep(3)} className="px-6 py-2 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">Next →</button>
                </div>
              </div>
            )}
            {lawyerStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 03: Weekly Availability</h3>
                <p className="text-xs text-slate-500">Clients book consultations based on your active slots.</p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p>✔ Monday - Friday: 09:00 AM - 05:00 PM</p>
                  <p>✔ Saturday: 09:00 AM - 01:00 PM</p>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setLawyerStep(2)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button onClick={() => setLawyerStep(4)} className="px-6 py-2 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">Next →</button>
                </div>
              </div>
            )}
            {lawyerStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 04: Payout Setup (CBE / Telebirr)</h3>
                <input type="text" placeholder="Commercial Bank of Ethiopia (CBE) Account Number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono" />
                <button
                  onClick={() => {
                    alert('Advocate onboarding submitted! Verification takes under 48 hours.');
                    setActiveTab('home');
                  }}
                  className="w-full py-3 bg-amber-500 font-bold text-sm text-[#0A1128] rounded-xl shadow cursor-pointer hover:bg-amber-600"
                >
                  Complete Advocate Application
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 8. ROLE SELECT MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-[#0A1128]">Choose your portal</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div 
                onClick={() => { setIsRoleModalOpen(false); setActiveTab('my-consultations'); }}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0A1128] cursor-pointer hover:bg-slate-50 transition-all"
              >
                <h4 className="font-bold text-[#0A1128] text-sm">Client Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">Track your consultations, requests, and drafted contracts</p>
              </div>

              <div 
                onClick={() => { setIsRoleModalOpen(false); setActiveTab('for-lawyers'); }}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0A1128] cursor-pointer hover:bg-slate-50 transition-all"
              >
                <h4 className="font-bold text-[#0A1128] text-sm">Advocate Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">Manage schedule, verify advocacy license, receive payouts</p>
              </div>

              <Link 
                href="/admin"
                onClick={() => setIsRoleModalOpen(false)}
                className="block p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0A1128] text-sm">Admin Oversight Portal →</h4>
                  <span className="text-[10px] font-bold bg-[#0A1128] text-white px-2 py-0.5 rounded">Admin</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Platform management, approve/complete consultations, metrics</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 9. FOOTER */}
      <footer className="bg-[#060B1A] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-black text-white">
                  Legal<span className="text-amber-400">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Ethiopia's premier legal marketplace connecting individuals and businesses with verified advocates for trusted advice, dispute resolution, and document automation.
              </p>
              <div className="text-xs text-slate-400 space-y-1 pt-2">
                <p>📍 Bole Road, Addis Ababa, Ethiopia</p>
                <p>📞 +251 911 000 000</p>
                <p>✉️ hello@legallink.et</p>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Platform</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('match'); setMatchStep(1); }}>Find a Lawyer</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('lexdraft')}>LexDraft</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('legaltalk')}>LegalTalk</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('my-consultations')}>Client Portal</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <Link href="/admin" className="text-slate-400 hover:text-amber-400 flex items-center gap-1">
                    <span>Admin Portal</span>
                    <span className="text-[10px] text-amber-400">↗</span>
                  </Link>
                </li>
                <li className="hover:text-white">Privacy Policy</li>
                <li className="hover:text-white">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>© 2026 LegalLink Ethiopia. All rights reserved.</span>
            <span>Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}