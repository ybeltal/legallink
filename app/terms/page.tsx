'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function TermsOfServicePage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
            PLATFORM RULES &amp; DISCLOSURES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            {language === 'am' ? 'የአገልግሎት ውል እና ደንቦች' : 'Terms of Service'}
          </h1>
          <span className="text-slate-500 block font-mono text-xs">
            Effective Date: November 2026 • Addis Ababa, Ethiopia
          </span>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            1. Technology Directory Disclosure
          </h2>
          <p>
            LegalLink Ethiopia operates strictly as an independent digital directory and legal-information platform connecting prospective clients with licensed Ethiopian advocates holding valid practicing licenses issued by the Federal Ministry of Justice or Regional Justice Bureaus under Federal Advocacy Service Licensing and Administration Proclamation No. 1249/2021. LegalLink is not a law firm, does not provide legal representation, and does not create an advocate-client relationship.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            2. Free Public Access &amp; Independent Engagement Terms
          </h2>
          <p>
            Browsing the advocate directory, submitting consultation inquiries, generating LexDraft templates, and accessing the Federal Legal Library are currently free on LegalLink. LegalLink does not process, hold, or guarantee legal service payments. Any formal legal engagement, scope of representation, or professional fee is agreed directly and independently between the client and the advocate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            3. Advocate Credential Accuracy
          </h2>
          <p>
            Advocates registering on LegalLink warrant that their Ministry of Justice or Regional Bar license number, court jurisdiction standing, and identity details are authentic and currently active. Misrepresentation of legal credentials results in immediate removal and may carry statutory penalties under Ethiopian law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            4. Self-Help Templates &amp; Educational Content
          </h2>
          <p>
            Forms generated through LexDraft and articles published on LegalTalk are provided for general educational and drafting assistance only and do not substitute for advice from a licensed advocate tailored to your specific facts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            5. Governing Law &amp; Contact
          </h2>
          <p>
            These terms are governed by the laws of the Federal Democratic Republic of Ethiopia, including the Commercial Code (Proclamation No. 1243/2021). Any dispute shall be submitted to the competent courts in Addis Ababa, Ethiopia. Questions may be directed to{' '}
            <a href="mailto:hello@legallink.et" className="font-bold text-[#0A1128] underline">
              hello@legallink.et
            </a>
            .
          </p>
        </section>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <Link href="/" className="font-bold text-slate-600 hover:text-[#0A1128]">
            ← Back to Home
          </Link>
          <Link href="/privacy" className="font-bold text-amber-800 hover:underline">
            Read Privacy Policy →
          </Link>
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        LegalLink Ethiopia • Regulatory &amp; Platform Governance • Addis Ababa
      </footer>
    </div>
  );
}