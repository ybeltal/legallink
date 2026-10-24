import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-20 flex items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
          <span className="font-black text-xl text-[#0A1128]">Legal<span className="text-amber-500">Link</span></span>
        </Link>
        <Link href="/" className="text-xs font-bold text-slate-600 hover:text-[#0A1128] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full space-y-8 text-xs leading-relaxed text-slate-700">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">DATA GOVERNANCE & CONFIDENTIALITY</span>
          <h1 className="text-3xl font-black text-[#0A1128]">Privacy & Case Data Policy</h1>
          <span className="text-slate-400 block font-mono">Last Updated: October 2026 • Federal Democratic Republic of Ethiopia</span>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">1. Case Brief & Audio Recording Confidentiality</h2>
          <p>
            When you submit legal briefs or record voice notes (Amharic or English) via our intake engines, files are transmitted over TLS 1.3 encryption and stored in access-controlled buckets. Only you and the assigned, verified advocate have authorization to access case voice briefs and documents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">2. Identification & Bar Credentials</h2>
          <p>
            Advocate bar licenses and national identity documents uploaded during onboarding are used solely by our internal compliance desk for Ministry of Justice validation. Unredacted identity documents are never shared publicly or monetized.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">3. Financial Information</h2>
          <p>
            LegalLink does not store Telebirr PINs or banking credentials. Payments are processed through authorized payment gateway interfaces and settled via encrypted mobile transaction webhooks.
          </p>
        </section>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        LegalLink Ethiopia • Data Protection & Client Confidentiality • Addis Ababa
      </footer>
    </div>
  );
}