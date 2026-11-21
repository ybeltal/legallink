'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-mono">
            DATA GOVERNANCE &amp; PRIVACY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            {language === 'am' ? 'የግል መረጃ ጥበቃ ፖሊሲ' : 'Privacy & Data Protection Policy'}
          </h1>
          <span className="text-slate-500 block font-mono text-xs">
            Last Updated: November 2026 • Addis Ababa, Ethiopia
          </span>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            1. Information We Collect
          </h2>
          <p>
            When you create a LegalLink account or submit a consultation request, we collect only the information you provide: your name, email address, phone number, practice area preference, and a general summary of your legal inquiry. For advocates registering on our directory, we collect bar license numbers, court jurisdiction standing, chamber location, and contact details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            2. How Inquiry Data Is Protected &amp; Shared
          </h2>
          <p>
            Consultation inquiries are stored with database Row-Level Security (RLS) so that your inquiry is accessible only to your selected advocate and authorized LegalLink administrators for platform oversight. We recommend sharing only general facts in your initial inquiry and reserving sensitive personal documents for direct meetings with your advocate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            3. Service Providers &amp; Operational Alerts
          </h2>
          <p>
            LegalLink uses trusted infrastructure providers to operate the platform securely: Vercel (application hosting), Supabase (authentication and database storage), Google OAuth (optional sign-in), Resend (transactional welcome emails), and internal Telegram notifications containing non-confidential reference alerts only. We never sell or monetize user data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
            4. Your Rights &amp; Data Deletion Requests
          </h2>
          <p>
            In alignment with Ethiopia’s Personal Data Protection Proclamation No. 1321/2024, you may request access to, correction of, or permanent deletion of your account and inquiry data at any time by emailing{' '}
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
          <Link href="/terms" className="font-bold text-amber-800 hover:underline">
            Read Terms of Service →
          </Link>
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        LegalLink Ethiopia • Data Protection &amp; Client Confidentiality • Addis Ababa
      </footer>
    </div>
  );
}