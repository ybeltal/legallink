import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
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
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">STATUTORY PLATFORM RULES</span>
          <h1 className="text-3xl font-black text-[#0A1128]">Terms of Service & Retainer Agreement</h1>
          <span className="text-slate-400 block font-mono">Effective Date: October 2026 • Addis Ababa, Ethiopia</span>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">1. Legal Intermediary Disclosure</h2>
          <p>
            LegalLink Ethiopia operates strictly as a technology marketplace platform connecting prospective clients with licensed Ethiopian advocates holding valid practicing licenses issued by the Federal Ministry of Justice or regional justice bureaus. LegalLink is not a law firm, does not offer direct legal representation, and does not participate in advocate-client privileged advisory matters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">2. Telebirr Escrow Trust Framework</h2>
          <p>
            Consultation retainers pre-authorized by clients are held in a secure corporate escrow pool. Retainers are not transferred directly to the advocate until the consultation brief is delivered, protecting both client deposits and advocate remuneration from default under Ethiopian Civil Code Art. 1772 principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">3. Advocate Credential Verification</h2>
          <p>
            All legal professionals listing services must submit authentic Ministry of Justice bar licensing certificates and valid national identification. Falsification of legal credentials carries criminal penalties under the Federal Criminal Code of Ethiopia.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">4. Dispute Resolution & Jurisdiction</h2>
          <p>
            These terms are governed by the Commercial Code of Ethiopia (Proclamation No. 1240/2021). Any irreconcilable dispute arising out of platform transactions shall be submitted to the competent courts of Addis Ababa, Ethiopia.
          </p>
        </section>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-6 border-t border-slate-800 text-center text-xs">
        LegalLink Ethiopia • Regulatory & Commercial Compliance • Bole Road, Addis Ababa
      </footer>
    </div>
  );
}