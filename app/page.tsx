'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Home as HomeIcon, Sparkles, Briefcase, 
  Scale, Globe, ShieldCheck, ArrowRight, Lock, CheckCircle2, 
  FileText, GraduationCap, BookOpen, MessagesSquare, Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { language } = useLanguage();

  const PRACTICE_AREAS = [
    { id: 'corporate', title: 'Corporate & Business', am: 'የንግድና ኩባንያ ሕግ', icon: Building2 },
    { id: 'property', title: 'Land & Real Estate', am: 'የመሬትና ይዞታ ሕግ', icon: HomeIcon },
    { id: 'family', title: 'Family Law', am: 'የቤተሰብ ሕግ', icon: Users },
    { id: 'ip', title: 'Intellectual Property', am: 'የአእምሯዊ ንብረት', icon: Sparkles },
    { id: 'employment', title: 'Employment & Labor', am: 'የሠራተኛና አሠሪ ሕግ', icon: Briefcase },
    { id: 'criminal', title: 'Criminal Defense', am: 'የወንጀል መከላከያ', icon: Scale },
    { id: 'immigration', title: 'Immigration & Diaspora', am: 'ኢሚግሬሽንና ዲያስፖራ', icon: Globe },
    { id: 'ngo', title: 'NGO & Compliance', am: 'የበጎ አድራጎት ማህበራት', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold w-fit mx-auto sm:mx-0 shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Ethiopian Federal Advocacy Proclamation No. 1249/2021 Compliant</span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-6xl font-black text-[#0A1128] tracking-tight leading-tight">
              {language === 'am' ? (
                <>
                  የተረጋገጡ የኢትዮጵያ ጠበቆች፣ <br />
                  <span className="text-amber-600">በቴሌብር ኤስክሮው</span> የተጠበቀ አሰራር።
                </>
              ) : (
                <>
                  Verified Ethiopian Advocates. <br />
                  <span className="text-amber-600">Telebirr Escrow</span> Protected.
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
              {language === 'am'
                ? 'በፌዴራል ጠቅላይ ፍርድ ቤትና በሰበር ችሎት የተፈቀደላቸው ጠበቆችን ያግኙ። የውል ማርቀቂያ፣ የጥብቅና አገልግሎት ክፍያዎን በቴሌብር እማኝ (Escrow) ሂሳብ ዋስትና ይስጡ።'
                : 'Consult licensed advocates across all Federal judicial tiers. Draft bilingual contracts compliant with the 2021 Commercial Code, and secure all retainer fees in Telebirr escrow.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center sm:justify-start">
            <Link
              href="/find-a-lawyer"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Find a Lawyer</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <Link
              href="/lexdraft"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Draft Contracts (LexDraft)</span>
            </Link>
          </div>

          {/* Practice Area Pills */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold block text-center sm:text-left">
              Browse by Practice Area
            </span>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {PRACTICE_AREAS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={`/find-a-lawyer?category=${item.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-all cursor-pointer group hover:border-slate-300"
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span>{language === 'am' ? item.am : item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Live Trust Metrics Bar */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#0A1128] font-mono">100%</strong>
              <p className="text-xs text-slate-500">Ministry of Justice Licensed</p>
            </div>
            <div className="space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#0A1128] font-mono">Art. 1240</strong>
              <p className="text-xs text-slate-500">Commercial Code Escrow</p>
            </div>
            <div className="space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#0A1128] font-mono">122</strong>
              <p className="text-xs text-slate-500">Federal Proclamations Indexed</p>
            </div>
            <div className="space-y-1">
              <strong className="text-xl sm:text-2xl font-black text-[#0A1128] font-mono">85% / 15%</strong>
              <p className="text-xs text-slate-500">Transparent Advocate Payout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Pillars Grid */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            An Integrated Ethiopian Legal Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Every module complies with statutory standards, protecting clients and empowering licensed chambers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Advocate Matching */}
          <Link
            href="/find-a-lawyer"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-amber-600 transition-colors">
                Advocate Chamber Directory
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Match with advocates vetted across First Instance, High Court, and Federal Supreme Court & Cassation.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Find Counsel →
            </span>
          </Link>

          {/* Pillar 2: LexDraft Automation */}
          <Link
            href="/lexdraft"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-emerald-700 transition-colors">
                LexDraft Contract Studio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Generate bilingual (Amharic/English) agreements including Commercial Leases, Employment, and NDAs.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Draft Agreements →
            </span>
          </Link>

          {/* Pillar 3: Telebirr Escrow */}
          <Link
            href="#escrow"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-blue-700 transition-colors">
                Telebirr USSD Escrow
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Retainers are held in an authorized merchant escrow account until consultation completion is verified.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              How Escrow Works →
            </span>
          </Link>

          {/* Pillar 4: NextGen Hub */}
          <Link
            href="/nextgen"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-purple-700 transition-colors">
                NextGen Law Careers
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Access pupillage apprenticeships governed by Proclamation No. 1249/2021 and corporate legal internships.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Explore Opportunities →
            </span>
          </Link>

          {/* Pillar 5: Legal Library */}
          <Link
            href="/library"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-amber-800 transition-colors">
                Federal Legal Library
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Search all 122 enactments including the 2021 Commercial Code and Labor Proclamation No. 1156/2019.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Proclamations →
            </span>
          </Link>

          {/* Pillar 6: LegalTalk Commentary */}
          <Link
            href="/legaltalk"
            className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <MessagesSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1128] group-hover:text-teal-800 transition-colors">
                LegalTalk Public Insights
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Read practical legal analyses written by senior practitioners regarding investment, land, and corporate compliance.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Read Articles →
            </span>
          </Link>

        </div>
      </section>

      {/* Statutory Escrow Architecture Section */}
      <section id="escrow" className="bg-white border-y border-slate-200 py-16 sm:py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono text-emerald-700 uppercase tracking-widest font-bold block">
              TRANSPARENT FINANCIAL SAFEGUARDS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
              Commercial Code Art. 1240 Escrow Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Retainer deposits are held independently until counsel delivers your scheduled consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="w-7 h-7 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Select Counsel & Retainer</h4>
              <p className="text-slate-500 leading-relaxed">
                Choose an advocate based on verified bench experience and transparent hourly fees.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="w-7 h-7 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold">2</span>
              <h4 className="font-bold text-slate-900 text-sm">Telebirr USSD Authorization</h4>
              <p className="text-slate-500 leading-relaxed">
                Funds are pre-authorized and locked in the LegalLink Telebirr Escrow merchant account.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="w-7 h-7 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Consultation Delivered</h4>
              <p className="text-slate-500 leading-relaxed">
                Advocate provides consultation via video conference, phone, or in-person chamber visit.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">4</span>
              <h4 className="font-bold text-emerald-950 text-sm">Automated Settlement</h4>
              <p className="text-slate-500 leading-relaxed">
                85% net fee is immediately disbursed to advocate's Telebirr account; 15% platform fee retained.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Advocate Chamber Recruitment Banner */}
      <section className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              ADVOCATE DIRECTORY INVITATION
            </span>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight">
              Are you a licensed advocate in Ethiopia?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Register your chambers to accept verified client briefs, disburse Telebirr retainers, and mentor NextGen apprentices under Proclamation No. 1249/2021.
            </p>
          </div>

          <Link
            href="/advocate/register"
            className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>Register Your Chamber</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Comprehensive Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <strong className="text-white text-xs uppercase tracking-wider block font-mono">Platform</strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/find-a-lawyer" className="hover:text-white transition-colors">Find a Lawyer</Link></li>
                <li><Link href="/advocate/register" className="hover:text-white transition-colors">Advocate Chamber Registration</Link></li>
                <li><Link href="/lexdraft" className="hover:text-white transition-colors">LexDraft Contract Studio</Link></li>
                <li><Link href="/nextgen" className="hover:text-white transition-colors">NextGen Careers</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-white text-xs uppercase tracking-wider block font-mono">Resources</strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/library" className="hover:text-white transition-colors">Federal Legal Library</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white transition-colors">LegalTalk Commentary</Link></li>
                <li><Link href="#escrow" className="hover:text-white transition-colors">Telebirr Escrow Structure</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-white text-xs uppercase tracking-wider block font-mono">Portals</strong>
              <ul className="space-y-2 text-[11px]">
                <li><Link href="/login" className="hover:text-white transition-colors">Client & Advocate Sign In</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
                <li><Link href="/advocate/portal" className="hover:text-white transition-colors">Advocate Workspace</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <strong className="text-white text-xs uppercase tracking-wider block font-mono">Statutory Compliance</strong>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Operated pursuant to Federal Advocacy Service Licensing and Administration Proclamation No. 1249/2021 and Ethiopian Commercial Code Art. 1240.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white underline">Terms</Link>
              <Link href="/privacy" className="hover:text-white underline">Privacy Policy</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}