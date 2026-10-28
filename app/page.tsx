'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Scale, 
  FileText, 
  Calculator, 
  Star, 
  Menu, 
  X, 
  Building2, 
  Briefcase, 
  Home as HomeIcon, 
  Users, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  User,
  Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPracticeArea, setSelectedPracticeArea] = useState('Corporate & Commercial');
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
      title: 'Corporate & Commercial',
      amharic: 'የንግድና ኩባንያ ሕግ',
      desc: 'Company formation, Commercial Code compliance, shareholder agreements, and M&A.',
      icon: Building2,
      slug: 'corporate',
    },
    {
      title: 'Real Estate & Land',
      amharic: 'የመሬትና ይዞታ ሕግ',
      desc: 'Landholding certification, title deed due diligence, property lease transfers, and disputes.',
      icon: HomeIcon,
      slug: 'property',
    },
    {
      title: 'Employment & Labor',
      amharic: 'የሠራተኛና አሠሪ ሕግ',
      desc: 'Employment contracts, statutory severance audits under Proc. 1156/2019, and labor disputes.',
      icon: Briefcase,
      slug: 'employment',
    },
    {
      title: 'Capital Markets & ESX',
      amharic: 'የካፒታል ገበያና ሰነደ-ሙዓለ-ንዋይ',
      desc: 'Prospectus compliance, ECMA Directive 1030/2024 guidance, and public share offerings.',
      icon: Scale,
      slug: 'capital-markets',
    },
    {
      title: 'Family & Civil Law',
      amharic: 'የቤተሰብና ፍትሐብሔር ሕግ',
      desc: 'Succession & inheritance, civil settlement mediation, marital contracts, and estate management.',
      icon: Users,
      slug: 'family',
    },
    {
      title: 'Intellectual Property',
      amharic: 'የአእምሯዊ ንብረት ሕግ',
      desc: 'Trademark registration, copyright protection, patent filing with EIPO, and licensing.',
      icon: Sparkles,
      slug: 'ip',
    },
  ];

  const featuredAdvocates = [
    {
      name: 'Advocate Mulu Haile',
      role: 'Corporate & Capital Markets Counsel',
      license: 'MOJ Verified • Federal Supreme Court',
      experience: '12 Years Experience',
      rating: '4.95',
      reviews: '442',
      rate: '1,500',
      badge: 'Top Match',
    },
    {
      name: 'Advocate Tigist Bekele',
      role: 'Family & Employment Specialist',
      license: 'MOJ Verified • Federal High Court',
      experience: '8 Years Experience',
      rating: '4.88',
      reviews: '312',
      rate: '1,200',
      badge: 'Fast Responder',
    },
    {
      name: 'Advocate Dawit Tesfaye',
      role: 'Real Estate & Land Title Counsel',
      license: 'MOJ Verified • Cassation Division',
      experience: '15 Years Experience',
      rating: '4.92',
      reviews: '521',
      rate: '1,800',
      badge: 'Senior Specialist',
    },
  ];

  const legalTalkTeasers = [
    {
      id: 'qa-1',
      title: 'Can a PLC issue shares or raise equity under ECMA Directive 1030/2024?',
      category: 'Capital Markets & ESX',
      lawyer: 'Advocate Mulu Haile',
      excerpt: 'Under Commercial Code Art. 495, private limited companies cannot issue public shares directly without first converting to a Share Company (S.C.) and satisfying capital verification rules...',
      views: '1.4k reads'
    },
    {
      id: 'qa-2',
      title: 'What are the statutory grounds for commercial lease eviction under Civil Code Art. 2896?',
      category: 'Real Estate & Land',
      lawyer: 'Advocate Dawit Tesfaye',
      excerpt: 'A lessor cannot unilaterally terminate a commercial tenancy mid-term without documented lease violations or non-payment substantiated through municipal notices...',
      views: '2.1k reads'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
                Ethiopia
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <Link href="/" className="text-[#0A1128] font-black border-b-2 border-amber-500 pb-0.5">
              Home
            </Link>
            <Link href="/find-a-lawyer" className="hover:text-[#0A1128] transition-colors">
              Find a Lawyer
            </Link>
            <Link href="/practice-areas" className="hover:text-[#0A1128] transition-colors">
              Practice Areas
            </Link>
            <Link href="/diaspora" className="hover:text-[#0A1128] transition-colors flex items-center gap-1.5 text-blue-600 font-bold">
              <Globe className="w-3.5 h-3.5" />
              <span>Diaspora Desk</span>
            </Link>
            <Link href="/legaltalk" className="hover:text-[#0A1128] transition-colors flex items-center gap-1.5 text-amber-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>LegalTalk</span>
            </Link>
            <Link href="/tools" className="hover:text-[#0A1128] transition-colors flex items-center gap-1">
              <span>Tools</span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-black">
                FREE
              </span>
            </Link>
          </nav>

          {/* Right Header CTAs & Dynamic Auth State */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/for-lawyers" 
              className="text-xs font-bold text-slate-500 hover:text-[#0A1128] px-3 py-2 rounded-xl transition-colors"
            >
              For Advocates
            </Link>

            {userSession ? (
              <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-[#0A1128] text-white flex items-center justify-center text-[10px] font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 max-w-[110px] truncate">
                  {userSession.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-xs font-bold text-slate-600 hover:text-[#0A1128] px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link 
              href="/find-a-lawyer" 
              className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 group"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-[#0A1128] py-1"
            >
              Home
            </Link>
            <Link 
              href="/find-a-lawyer" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Find a Lawyer
            </Link>
            <Link 
              href="/practice-areas" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Practice Areas
            </Link>
            <Link 
              href="/diaspora" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-blue-600 py-1 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Diaspora Legal Desk</span>
            </Link>
            <Link 
              href="/legaltalk" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-amber-600 py-1 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>LegalTalk Q&A</span>
            </Link>
            <Link 
              href="/tools" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Self-Service Legal Tools
            </Link>
            <Link 
              href="/escrow" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-emerald-700 py-1"
            >
              Escrow Desk & Disputes
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
                <span>Sign Out ({userSession.email?.split('@')[0]})</span>
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-slate-100 text-slate-700 text-center font-bold text-xs rounded-xl block"
              >
                Sign In
              </Link>
            )}

            <Link 
              href="/find-a-lawyer" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-[#0A1128] text-white text-center font-bold text-xs rounded-xl block shadow-sm"
            >
              Book a Consultation
            </Link>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#0A1128] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Federal Ministry of Justice Verified Advocates</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-tight">
              Connect with Verified Ethiopian Lawyers, <span className="text-amber-500">Safely.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Book certified legal consultations, resolve business and property matters, and draft contracts. Every fee is held securely in <strong>Telebirr escrow</strong> until your consultation is delivered.
            </p>

            <div className="mt-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedPracticeArea}
                  onChange={(e) => setSelectedPracticeArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/20 cursor-pointer"
                >
                  {practiceAreas.map((area, idx) => (
                    <option key={idx} value={area.title}>
                      {area.title} ({area.amharic})
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href="/find-a-lawyer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-sm hover:shadow"
              >
                <span>Find an Advocate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-xl mx-auto text-center">
              <div>
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">100%</strong>
                <span className="text-[11px] text-slate-500 font-medium">Licensed & Vetted</span>
              </div>
              <div className="border-x border-slate-200">
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">Telebirr</strong>
                <span className="text-[11px] text-slate-500 font-medium">Escrow Protected</span>
              </div>
              <div>
                <strong className="block text-base sm:text-lg font-black text-[#0A1128]">&lt; 2 Hours</strong>
                <span className="text-[11px] text-slate-500 font-medium">Avg Response</span>
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
              <span>Living in the US, Europe, or the Gulf?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Ethiopian Diaspora Legal Services Hub
            </h3>
            <p className="text-xs text-slate-300 max-w-xl font-normal">
              Execute embassy powers of attorney (ውክልና), audit land deeds (ካርታ), and liquidate estates in Ethiopia remotely with USD / EUR escrow protection.
            </p>
          </div>

          <Link
            href="/diaspora"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Explore Diaspora Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
              SIMPLE & PREDICTABLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              How LegalLink Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Transparent legal consultations backed by statutory standards and escrow protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-[#0A1128] font-black text-sm flex items-center justify-center shadow-xs">
                01
              </span>
              <h3 className="text-base font-bold text-[#0A1128]">1. Describe Your Need</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Choose your legal domain and submit a brief description in Amharic or English. You can also record a secure voice brief right from your device.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-amber-600 font-black text-sm flex items-center justify-center shadow-xs">
                02
              </span>
              <h3 className="text-base font-bold text-[#0A1128]">2. Choose Verified Counsel</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Review verified profiles with authentic Ministry of Justice bar licenses, transparent hourly rates, client ratings, and litigation experience.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/80 space-y-4">
              <span className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-emerald-600 font-black text-sm flex items-center justify-center shadow-xs">
                03
              </span>
              <h3 className="text-base font-bold text-[#0A1128]">3. Consult via Telebirr Escrow</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Authorize your retainer securely via Telebirr USSD. Funds remain protected in escrow until your legal consultation is fulfilled.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Practice Areas */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                SPECIALIZED EXPERTISE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                Select Your Legal Domain
              </h2>
            </div>
            <Link 
              href="/practice-areas" 
              className="text-xs font-bold text-slate-600 hover:text-[#0A1128] inline-flex items-center gap-1 group"
            >
              <span>View full practice area directory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area, idx) => {
              const IconComponent = area.icon;
              return (
                <Link
                  key={idx}
                  href={`/find-a-lawyer?category=${area.slug}`}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
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

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Find Lawyers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Featured Advocates */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                CREDENTIAL AUDITED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                Featured Senior Advocates
              </h2>
            </div>
            <Link 
              href="/find-a-lawyer" 
              className="text-xs font-bold text-slate-600 hover:text-[#0A1128] inline-flex items-center gap-1 group"
            >
              <span>View full advocate directory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAdvocates.map((adv, idx) => (
              <div 
                key={idx}
                className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-colors"
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
                      <span className="text-slate-400 font-normal">({adv.reviews} verified reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Initial Retainer</span>
                    <strong className="text-sm font-black text-[#0A1128]">ETB {adv.rate}</strong>
                  </div>
                  <Link
                    href="/find-a-lawyer"
                    className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. LegalTalk Community Showcase */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>EXPERT LEGAL ANSWERS & INSIGHTS</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                LegalTalk Knowledge Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Direct statutory answers and commentary provided exclusively by verified Ethiopian advocates.
              </p>
            </div>
            <Link 
              href="/legaltalk" 
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-[#0A1128] text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Explore All Legal Answers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalTalkTeasers.map((t) => (
              <div 
                key={t.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase">
                      {t.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{t.views}</span>
                  </div>
                  <h3 className="font-black text-base text-[#0A1128] hover:text-amber-600 transition-colors">
                    <Link href="/legaltalk">{t.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {t.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800 text-[11px]">{t.lawyer}</span>
                  </div>
                  <Link 
                    href="/find-a-lawyer" 
                    className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 text-[11px]"
                  >
                    <span>Consult Counsel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. Institutional Trust & Telebirr Escrow Notice */}
      <section className="py-16 bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
                GUARANTEED CLIENT INTEGRITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Protected by Telebirr Escrow
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                No upfront risk. When you book a consultation on LegalLink, your funds are securely held in corporate escrow under Ethiopian Commercial Code regulations. Payout is released to the advocate only when the consultation is completed.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Transparent Fixed Pricing</span>
                </div>
                <Link href="/escrow" className="flex items-center gap-2 text-emerald-400 hover:underline">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Two-Party Escrow Resolution Desk ➔</span>
                </Link>
              </div>
            </div>

            <div className="bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-4">
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Ethio Telecom USSD Direct Push</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Approve retainers seamlessly on your phone. You will receive an instant Telebirr USSD prompt and an official Ethio Telecom SMS confirmation once your case is booked.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/find-a-lawyer"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <span>Start a Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/escrow"
                  className="py-3 px-5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all"
                >
                  Escrow Rules
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. Footer */}
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
                Ethiopia&apos;s verified legal services marketplace and digital compliance intermediary.
              </p>
              <span className="text-[11px] text-slate-400 block font-mono">Bole Sub-City, Addis Ababa</span>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                For Clients & Diaspora
              </strong>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#0A1128]">Home</Link></li>
                <li><Link href="/find-a-lawyer" className="hover:text-[#0A1128]">Find an Advocate</Link></li>
                <li><Link href="/diaspora" className="text-blue-600 font-bold hover:underline">Diaspora Legal Desk</Link></li>
                <li><Link href="/practice-areas" className="hover:text-[#0A1128]">Practice Areas</Link></li>
                <li><Link href="/legaltalk" className="hover:text-[#0A1128]">LegalTalk Answers</Link></li>
                <li><Link href="/tools" className="hover:text-[#0A1128]">LexDraft & Tools</Link></li>
                <li><Link href="/escrow" className="text-emerald-700 font-bold hover:underline">Two-Party Escrow Desk</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                For Advocates
              </strong>
              <ul className="space-y-2">
                <li><Link href="/for-lawyers" className="hover:text-[#0A1128]">Join the Network</Link></li>
                <li><Link href="/advocate" className="hover:text-[#0A1128]">Advocate Workspace</Link></li>
                <li><Link href="/admin/verification" className="hover:text-[#0A1128]">MOJ Verification Audit</Link></li>
                <li><Link href="/verify/ETH-BAR-2018-0492" className="hover:text-[#0A1128]">Sample Credential Verification</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold text-[#0A1128] uppercase tracking-wider block">
                Legal & Intermediary
              </strong>
              <ul className="space-y-2">
                <li><Link href="/terms" className="hover:text-[#0A1128]">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[#0A1128]">Privacy Policy</Link></li>
                <li><span className="text-slate-400">Commercial Code 1240/2021</span></li>
                <li><span className="text-slate-400">ECMA Directive 1030/2024</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 LegalLink Ethiopia. All rights reserved.</p>
            <p>Non-law firm intermediary platform. Direct representation provided exclusively by licensed Ethiopian advocates.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}