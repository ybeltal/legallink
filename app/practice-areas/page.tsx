'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Home as HomeIcon,
  Briefcase,
  Scale,
  Users,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface PracticeAreaDetail {
  slug: string;
  title: string;
  amharic: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  statutoryBase: string;
  commonMatters: string[];
}

const PRACTICE_AREAS_CATALOG: PracticeAreaDetail[] = [
  {
    slug: 'corporate',
    title: 'Corporate & Commercial Law',
    amharic: 'የንግድና ኩባንያ ሕግ',
    icon: Building2,
    summary:
      'Legal structuring for Ethiopian startups, SMEs, PLCs, share companies, joint ventures, and commercial contracts.',
    statutoryBase: 'Commercial Code Proclamation No. 1243/2021',
    commonMatters: [
      'PLC & Single-Member PLC incorporation',
      'Shareholder agreements & governance',
      'Commercial contracts & DARS authentication',
      'Mergers, acquisitions & business compliance',
    ],
  },
  {
    slug: 'property',
    title: 'Property & Real Estate Law',
    amharic: 'የመሬትና ይዞታ ሕግ',
    icon: HomeIcon,
    summary:
      'Advisory and litigation for title deed verification (ካርታ), commercial leases, land transfers, and construction disputes.',
    statutoryBase: 'Urban Lands Lease Holding Proc. No. 721/2011',
    commonMatters: [
      'Title deed (ካርታ) due diligence & audits',
      'Commercial & residential lease agreements',
      'Land lease transfers & boundary disputes',
      'Construction contract claims',
    ],
  },
  {
    slug: 'employment',
    title: 'Employment & Labour Law',
    amharic: 'የሠራተኛና አሠሪ ሕግ',
    icon: Briefcase,
    summary:
      'Workplace compliance, employment contracts, severance reviews, and representation before Labour Relations Boards.',
    statutoryBase: 'Labour Proclamation No. 1156/2019',
    commonMatters: [
      'Wrongful termination & reinstatement claims',
      'Statutory severance pay verification',
      'Compliant employment contracts & HR policies',
      'Workplace disciplinary & collective disputes',
    ],
  },
  {
    slug: 'family',
    title: 'Family & Inheritance Law',
    amharic: 'የቤተሰብና ውርስ ሕግ',
    icon: Users,
    summary:
      'Dignified support for divorce proceedings, child custody, maintenance, marital property division, and estate succession.',
    statutoryBase: 'Revised Family Code Proc. No. 213/2000',
    commonMatters: [
      'Mutual consent & contested divorce filings',
      'Child custody & maintenance arrangements',
      'Certificate of Heirship & estate liquidation',
      'Marital property classification & division',
    ],
  },
  {
    slug: 'ip',
    title: 'Intellectual Property & Tech Law',
    amharic: 'የአእምሯዊ ንብረት እና ቴክኖሎጂ ሕግ',
    icon: Sparkles,
    summary:
      'Trademark registration before EIPA, copyright protection, software licensing, and personal data protection compliance.',
    statutoryBase: 'Trademark Proc. 501/2006 & Data Protection Proc. 1321/2024',
    commonMatters: [
      'Trademark search, registration & renewals',
      'Copyright & software IP ownership contracts',
      'Personal Data Protection compliance audits',
      'Non-disclosure & trade secret protection',
    ],
  },
  {
    slug: 'immigration',
    title: 'Immigration & Diaspora Law',
    amharic: 'ኢሚግሬሽንና የዲያስፖራ ጉዳዮች',
    icon: Globe,
    summary:
      'Cross-border legal representation for Ethiopians abroad, Yellow Card rights, embassy powers of attorney, and residency.',
    statutoryBase: 'Origin ID Proc. 270/2002 & Immigration Proc. 1339/2024',
    commonMatters: [
      'Embassy Power of Attorney (ውክልና) preparation',
      'Diaspora property & inheritance coordination',
      'Ethiopian Origin ID (Yellow Card) advisory',
      'Work permits, visas & investor residency',
    ],
  },
  {
    slug: 'criminal',
    title: 'Criminal Defense & Appeals',
    amharic: 'የወንጀል መከላከያና ይግባኝ',
    icon: Scale,
    summary:
      'Constitutional defense, bail applications, trial advocacy, appellate representation, and Cassation review.',
    statutoryBase: 'Criminal Code Proc. No. 414/2004',
    commonMatters: [
      'Bail petitions & pre-trial rights defense',
      'Federal & Regional court representation',
      'Commercial & white-collar defense',
      'Appellate & Supreme Court Cassation filings',
    ],
  },
  {
    slug: 'ngo',
    title: 'NGO, CSO & Regulatory Compliance',
    amharic: 'የሲቪል ማህበራት እና ተገዢነት',
    icon: ShieldCheck,
    summary:
      'Registration, governance, grant compliance, and tax/regulatory filings for civil society organizations and charities.',
    statutoryBase: 'Organizations of Civil Societies Proc. No. 1113/2019',
    commonMatters: [
      'Local & foreign CSO registration',
      'Board governance & statutory bylaws',
      'Donor grant agreements & compliance audits',
      'Employment & tax compliance for non-profits',
    ],
  },
];

export default function PracticeAreasPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = PRACTICE_AREAS_CATALOG.filter((area) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      area.title.toLowerCase().includes(q) ||
      area.amharic.includes(q) ||
      area.summary.toLowerCase().includes(q) ||
      area.statutoryBase.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              ETHIOPIAN LEGAL DOMAINS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">Practice Areas Directory</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
              Explore specialized areas of Ethiopian law and connect directly with MOJ-verified advocates for free during our public launch.
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.slug}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#0A1128] text-amber-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Free Inquiry
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-black text-[#0A1128]">{area.title}</h2>
                    <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                      {area.amharic}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{area.summary}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      Key Statute
                    </span>
                    <strong className="text-slate-800 font-mono text-[10px] block">
                      {area.statutoryBase}
                    </strong>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {area.commonMatters.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/find-a-lawyer?category=${area.slug}`}
                  className="w-full py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Find Advocates</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-8 text-center text-xs mt-auto">
        <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
      </footer>
    </div>
  );
}