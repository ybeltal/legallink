'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, DollarSign, 
  Clock, Globe, Award, Sparkles, Building2, User,
  Home as HomeIcon, FileText, Languages, Menu, X
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ForLawyersPage() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [sessionsPerWeek, setSessionsPerWeek] = useState(5);
  const [ratePerHour, setRatePerHour] = useState(1500);

  const monthlyGross = sessionsPerWeek * ratePerHour * 4;
  const platformFee = monthlyGross * 0.15;
  const monthlyNet = monthlyGross - platformFee;

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

            <Link href="/find-a-lawyer" className="hover:text-[#0A1128] transition-colors whitespace-nowrap">
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
              href="/advocate" 
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{language === 'am' ? 'የጠበቃ የስራ ገጽ ➔' : 'Advocate Portal ➔'}</span>
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>For Legal Professionals in Ethiopia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight leading-tight">
              Expand your practice.<br />
              <span className="text-amber-500">Serve more clients.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Join Ethiopia's premier legal marketplace. List your practice, monetize published legal commentaries, set your consultation retainers, and connect with individuals, corporate enterprises, and the diaspora.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/signup"
                className="px-6 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group"
              >
                <span>Apply Now — It's Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/advocate"
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center transition-all"
              >
                <span>Open Advocate Portal</span>
              </Link>
            </div>

            <span className="text-[11px] text-slate-400 block font-normal">
              No monthly subscriptions. LegalLink charges a 15% platform facilitation fee per completed escrow consultation only.
            </span>

          </div>

          {/* Right Value Proposition Pillars */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="card-hover bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <strong className="text-sm font-bold text-[#0A1128] block">Grow your practice</strong>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Access a steady stream of pre-vetted clients actively seeking legal help — no cold outreach required.
              </p>
            </div>

            <div className="card-hover bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <strong className="text-sm font-bold text-[#0A1128] block">Set your own hours</strong>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Control your availability calendar and accept only the consultations that fit your court docket schedule.
              </p>
            </div>

            <div className="card-hover bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <strong className="text-sm font-bold text-[#0A1128] block">Verified & trusted</strong>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Ministry of Justice license validation builds client confidence and elevates your professional standing.
              </p>
            </div>

            <div className="card-hover bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <strong className="text-sm font-bold text-[#0A1128] block">Serve the diaspora</strong>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Reach Ethiopian diaspora worldwide seeking trusted counsel for local land, inheritance, and corporate matters.
              </p>
            </div>

          </div>
        </div>

        {/* Dynamic Advocate Earnings Calculator */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
              TRANSPARENT REVENUE MODEL
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
              Estimate Your Consultation Earnings
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Simulate weekly case sessions and view your expected net take-home pay delivered via Telebirr Business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Sessions Per Week:</span>
                  <span className="text-amber-600 font-mono">{sessionsPerWeek} consultations</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                  className="w-full accent-[#0A1128] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Hourly Consultation Rate (ETB):</span>
                  <span className="text-amber-600 font-mono">ETB {ratePerHour.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3000"
                  step="100"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(Number(e.target.value))}
                  className="w-full accent-[#0A1128] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Monthly Gross Consultations:</span>
                <span className="text-slate-800 font-bold">ETB {monthlyGross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Facilitation & Escrow Fee (15%):</span>
                <span className="text-red-600">- ETB {platformFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-base text-[#0A1128]">
                <span>Estimated Net Monthly Income:</span>
                <span className="text-emerald-700">ETB {monthlyNet.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto">
        LegalLink Advocate Network • Ministry of Justice Regulatory Compliance • Addis Ababa, Ethiopia
      </footer>

    </div>
  );
}