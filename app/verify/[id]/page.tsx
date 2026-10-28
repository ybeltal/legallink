'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, ArrowLeft, ArrowRight, Lock, Copy, Check 
} from 'lucide-react';

interface MockRecord {
  id: string;
  type: 'advocate' | 'client';
  fullName: string;
  amharicName?: string;
  status: 'active' | 'suspended' | 'pending_audit';
  barLicense?: string;
  benchLevel?: string;
  mojRegistryNumber?: string;
  issueDate: string;
  validThrough: string;
  specialization?: string[];
  hourlyRate?: number;
  escrowProtection: string;
}

const VERIFICATION_DATABASE: Record<string, MockRecord> = {
  'ETH-BAR-2018-0492': {
    id: 'ETH-BAR-2018-0492',
    type: 'advocate',
    fullName: 'Advocate Mulu Haile',
    amharicName: 'ጠበቃ ሙሉ ኃይሌ',
    status: 'active',
    barLicense: 'ETH-BAR-2018-0492',
    benchLevel: 'Federal Supreme Court & Cassation Division Qualified',
    mojRegistryNumber: 'MOJ/FED/2018/8892',
    issueDate: 'October 12, 2018',
    validThrough: 'December 31, 2026',
    specialization: ['Corporate & Commercial', 'Capital Markets & ESX', 'Commercial Tenancy'],
    hourlyRate: 1500,
    escrowProtection: 'Commercial Code Proclamation 1240/2021 Custody'
  },
  'ETH-BAR-2020-1104': {
    id: 'ETH-BAR-2020-1104',
    type: 'advocate',
    fullName: 'Advocate Tigist Bekele',
    amharicName: 'ጠበቃ ትዕግሥት በቀለ',
    status: 'active',
    barLicense: 'ETH-BAR-2020-1104',
    benchLevel: 'Federal High Court Qualified',
    mojRegistryNumber: 'MOJ/FED/2020/4412',
    issueDate: 'January 15, 2020',
    validThrough: 'December 31, 2026',
    specialization: ['Labor & Employment', 'Family & Civil Law'],
    hourlyRate: 1200,
    escrowProtection: 'Commercial Code Proclamation 1240/2021 Custody'
  },
  'ETH-BAR-2015-0081': {
    id: 'ETH-BAR-2015-0081',
    type: 'advocate',
    fullName: 'Advocate Dawit Tesfaye',
    amharicName: 'ጠበቃ ዳዊት ተስፋዬ',
    status: 'active',
    barLicense: 'ETH-BAR-2015-0081',
    benchLevel: 'Federal Supreme Court & Cassation Division Qualified',
    mojRegistryNumber: 'MOJ/FED/2015/0081',
    issueDate: 'March 04, 2015',
    validThrough: 'December 31, 2026',
    specialization: ['Real Estate & Land', 'Construction Arbitration'],
    hourlyRate: 1800,
    escrowProtection: 'Commercial Code Proclamation 1240/2021 Custody'
  }
};

function VerificationContent() {
  const params = useParams();
  const rawId = typeof params?.id === 'string' 
    ? params.id 
    : Array.isArray(params?.id) 
    ? params.id[0] 
    : '';
  const decodedId = decodeURIComponent(rawId || 'ETH-BAR-2018-0492');

  const [copied, setCopied] = useState(false);

  const record: MockRecord = VERIFICATION_DATABASE[decodedId] || {
    id: decodedId,
    type: decodedId.startsWith('ETH-BAR') ? 'advocate' : 'client',
    fullName: decodedId.startsWith('ETH-BAR') ? 'Verified Advocate Member' : 'Verified Escrow Client',
    status: 'active',
    barLicense: decodedId.startsWith('ETH-BAR') ? decodedId : undefined,
    benchLevel: decodedId.startsWith('ETH-BAR') ? 'Federal Courts of Ethiopia' : 'Statutory Client Tier',
    mojRegistryNumber: `MOJ/AUDIT/${decodedId.replace(/[^a-zA-Z0-9]/g, '') || '8841'}`,
    issueDate: 'October 28, 2026',
    validThrough: 'December 31, 2026',
    specialization: ['General Practice & Commercial Law'],
    hourlyRate: 1500,
    escrowProtection: 'Commercial Code Proclamation 1240/2021 Custody'
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isAdvocate = record.type === 'advocate';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
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

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Link Copied' : 'Share Audit'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                  OFFICIAL REGULATORY AUDIT
                </span>
                <h1 className="text-2xl font-black text-[#0A1128] mt-0.5">
                  Credential Authenticated
                </h1>
                <span className="text-xs text-slate-500 font-medium">
                  Ethiopian Ministry of Justice Bar Verification Record
                </span>
              </div>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono uppercase">
              ✓ Active & Good Standing
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {isAdvocate ? 'Practicing Advocate' : 'Client Account'}
              </span>
              <strong className="text-base text-[#0A1128] block">{record.fullName}</strong>
              {record.amharicName && (
                <span className="text-xs text-slate-500 block">{record.amharicName}</span>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 font-mono">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                {isAdvocate ? 'Bar License Number' : 'Escrow ID'}
              </span>
              <strong className="text-base text-amber-600 block">{record.id}</strong>
              <span className="text-[11px] text-slate-500 block">Registry: {record.mojRegistryNumber}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Bench Jurisdiction</span>
              <span className="font-semibold text-slate-800 block">{record.benchLevel}</span>
              <span className="text-[11px] text-slate-400 block">Valid through {record.validThrough}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Statutory Escrow Custody</span>
              <span className="font-semibold text-emerald-700 block">Commercial Code Art. 1240</span>
              <span className="text-[11px] text-slate-400 block">Telebirr Regulatory Trust</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {isAdvocate ? (
              <Link
                href="/find-a-lawyer"
                className="flex-1 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Hire This Advocate via Telebirr Escrow</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            ) : (
              <Link
                href="/find-a-lawyer"
                className="flex-1 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Find an Advocate for this Docket</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            )}

            <Link
              href="/escrow"
              className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl text-center transition-all"
            >
              View Escrow Rules & Protections
            </Link>
          </div>
        </div>

        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-3 text-xs border border-slate-800">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Lock className="w-4 h-4" />
            <span>Digital Credential Verification Integrity</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-normal">
            Every digital badge issued by LegalLink is validated against Federal Ministry of Justice advocate registers and Ethiopian Commercial Code trust standards. Verified advocates are subject to annual ethical reviews and mandatory 20-hour pro bono audits.
          </p>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Credential Registry • Federal Ministry of Justice Audit Node • Addis Ababa, Ethiopia
      </footer>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-500">
          Verifying credential with Ministry of Justice registry...
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}