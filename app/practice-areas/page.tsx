'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Home as HomeIcon, Briefcase, Scale, 
  Users, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, 
  Search, CheckCircle2, ChevronRight 
} from 'lucide-react';

interface PracticeAreaDetail {
  slug: string;
  title: string;
  amharic: string;
  icon: any;
  summary: string;
  statutoryBase: string;
  commonMatters: string[];
  advocatesAvailable: number;
  averageRate: string;
}

const PRACTICE_AREAS_CATALOG: PracticeAreaDetail[] = [
  {
    slug: 'corporate',
    title: 'Corporate & Commercial Law',
    amharic: 'የንግድና ኩባንያ ሕግ',
    icon: Building2,
    summary: 'Comprehensive legal structuring for Ethiopian enterprises, joint ventures, and international commercial entities.',
    statutoryBase: 'Commercial Code Proclamation No. 1240/2021',
    commonMatters: [
      'Company incorporation & Articles of Association',
      'Shareholder agreements & minority rights protection',
      'Mergers, acquisitions, and cross-border joint ventures',
      'Commercial contract drafting & DARA registration'
    ],
    advocatesAvailable: 28,
    averageRate: 'ETB 1,500 / hr'
  },
  {
    slug: 'property',
    title: 'Real Estate & Land Tenure',
    amharic: 'የመሬትና ይዞታ ሕግ',
    icon: HomeIcon,
    summary: 'Litigation and advisory services for property title verification, municipal leasehold transfers, and construction disputes.',
    statutoryBase: 'Urban Land Leaseholding Proclamation No. 721/2011',
    commonMatters: [
      'Title deed (ካርታ) authentication & municipal audits',
      'Commercial tenancy disputes & lease renewals',
      'Land lease transfer contracts & inheritance title splits',
      'Construction contract default & contractor arbitration'
    ],
    advocatesAvailable: 22,
    averageRate: 'ETB 1,800 / hr'
  },
  {
    slug: 'employment',
    title: 'Employment & Labor Relations',
    amharic: 'የሠራተኛና አሠሪ ሕግ',
    icon: Briefcase,
    summary: 'Workplace compliance, labor contract drafting, and representation before Labor Relations Boards.',
    statutoryBase: 'Labor Proclamation No. 1156/2019',
    commonMatters: [
      'Statutory severance & termination entitlement audits',
      'Employment contract structuring for management & staff',
      'Workplace disciplinary actions & defense',
      'Collective bargaining negotiations & union disputes'
    ],
    advocatesAvailable: 19,
    averageRate: 'ETB 1,200 / hr'
  },
  {
    slug: 'capital-markets',
    title: 'Capital Markets & Securities',
    amharic: 'የካፒታል ገበያና ሰነደ-ሙዓለ-ንዋይ',
    icon: Scale,
    summary: 'Regulatory counsel for public equity issuances, ESX listings, and capital investment directives.',
    statutoryBase: 'ECMA Directive No. 1030/2024 & Capital Market Proc. 1248/2021',
    commonMatters: [
      'Converting PLC to Share Company (S.C.) for ESX listing',
      'Public prospectus preparation & ECMA submission',
      'Investment banking compliance & private equity syndication',
      'Brokerage & market intermediary licensing'
    ],
    advocatesAvailable: 14,
    averageRate: 'ETB 2,000 / hr'
  },
  {
    slug: 'family',
    title: 'Family & Civil Law',
    amharic: 'የቤተሰብና ፍትሐብሔር ሕግ',
    icon: Users,
    summary: 'Amicable civil dispute mediation, marital property division, inheritance administration, and estate succession.',
    statutoryBase: 'Revised Family Code & Civil Code of Ethiopia',
    commonMatters: [
      'Succession certificate petition & estate liquidation',
      'Amicable divorce mediation & child maintenance',
      'Pre-nuptial agreements & marital property contracts',
      'Civil damages claims & tort restitution'
    ],
    advocatesAvailable: 25,
    averageRate: 'ETB 1,200 / hr'
  },
  {
    slug: 'ip',
    title: 'Intellectual Property & Technology',
    amharic: 'የአእምሯዊ ንብረት ሕግ',
    icon: Sparkles,
    summary: 'Brand registration, copyright defense, software licensing, and enforcement before the Ethiopian Intellectual Property Authority.',
    statutoryBase: 'Trademark Proclamation No. 501/2006 & Patent Proclamation',
    commonMatters: [
      'Trademark filing, monitoring, and opposition petitions',
      'Software SaaS licensing & IP assignments',
      'Counterfeit enforcement & commercial market raids',
      'Trade secret non-disclosure covenants'
    ],
    advocatesAvailable: 12,
    averageRate: 'ETB 1,600 / hr'
  }
];

export default function PracticeAreasPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = PRACTICE_AREAS_CATALOG.filter((area) =>
    area.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.amharic.includes(searchQuery) ||
    area.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold">
            <Link href="/" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Home
            </Link>
            <Link href="/find-a-lawyer" className="text-slate-500 hover:text-[#0A1128] transition-colors">
              Find a Lawyer
            </Link>
            <Link href="/legaltalk" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              LegalTalk Q&A
            </Link>
            <Link 
              href="/find-a-lawyer" 
              className="px-4 py-2 bg-[#0A1128] text-white rounded-xl hover:bg-[#102A43] transition-all"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Breadcrumb Return Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>

        {/* Page Banner */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              SPECIALIZED ETHIOPIAN LEGAL PRACTICE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Legal Domains & Practice Areas
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
              Explore specialized areas of Ethiopian jurisprudence. Select a practice domain to review verified advocate profiles, statutory standards, and fixed consultation retainers.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search legal domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Practice Areas Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.slug}
                className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-amber-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {area.advocatesAvailable} Advocates Available
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#0A1128]">{area.title}</h3>
                    <span className="text-xs font-semibold text-slate-400 block mt-0.5">{area.amharic}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {area.summary}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Statutory Framework</span>
                    <strong className="text-slate-800 font-mono text-[10px] block">{area.statutoryBase}</strong>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Common Matters Handled:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {area.commonMatters.map((m, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Retainer</span>
                    <strong className="text-xs font-mono font-bold text-[#0A1128]">{area.averageRate}</strong>
                  </div>

                  <Link
                    href={`/find-a-lawyer?category=${area.slug}`}
                    className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Find Lawyers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Ethiopia • Practice Areas & Jurisprudence Directory • Bole Sub-City, Addis Ababa
      </footer>

    </div>
  );
}