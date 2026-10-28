'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Printer, ArrowLeft, ShieldCheck, Scale, CheckCircle2, 
  Share2, Lock, Check, Copy, Download, Award, Languages, FileText
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MemoRecord {
  memoId: string;
  docketId: string;
  date: string;
  amharicDate: string;
  advocateName: string;
  amharicAdvocateName: string;
  barLicense: string;
  courtStanding: string;
  amharicCourtStanding: string;
  mojAuditNo: string;
  clientName: string;
  amharicClientName: string;
  practiceArea: string;
  amharicPracticeArea: string;
  matterSubject: string;
  amharicMatterSubject: string;
  executiveSummary: string;
  amharicExecutiveSummary: string;
  statutoryCitations: {
    statute: string;
    analysis: string;
    amharicAnalysis: string;
  }[];
  cassationPrecedent?: string;
  amharicCassationPrecedent?: string;
  actionableSteps: string[];
  amharicActionableSteps: string[];
  escrowFee: number;
  escrowStatus: 'locked' | 'released';
}

const MEMO_ARCHIVE: Record<string, MemoRecord> = {
  'MEMO-2026-9041': {
    memoId: 'MEMO-2026-9041',
    docketId: 'ESC-2026-9041',
    date: 'October 28, 2026',
    amharicDate: 'ጥቅምት 18 ቀን 2019 ዓ.ም',
    advocateName: 'Advocate Mulu Haile',
    amharicAdvocateName: 'ጠበቃ ሙሉ ኃይሌ',
    barLicense: 'ETH-BAR-2018-0492',
    courtStanding: 'Federal Supreme Court & Cassation Division Qualified',
    amharicCourtStanding: 'የፌዴራል ጠቅላይ ፍርድ ቤትና ሰበር ሰሚ ችሎት ተሟጋች',
    mojAuditNo: 'MOJ/FED/2018/8892',
    clientName: 'Dawit Alemu (Managing Partner)',
    amharicClientName: 'አቶ ዳዊት አለሙ (ስራ አስኪያጅ)',
    practiceArea: 'Capital Markets & Corporate Restructuring',
    amharicPracticeArea: 'የካፒታል ገበያና የኩባንያ መልሶ ማዋቀር ሕግ',
    matterSubject: 'Statutory Feasibility of Direct Public Share Issuance under ECMA Directive 1030/2024',
    amharicMatterSubject: 'በካፒታል ገበያ ባለስልጣን መመሪያ 1030/2024 መሰረት ኃ/የተ/የግ/ማህበር አክሲዮን ለህዝብ ማውጣት ስለመቻሉ የተሰጠ ህጋዊ አስተያየት',
    executiveSummary: 'The client requested legal counsel regarding whether a tech-logistics Private Limited Company (PLC) can directly issue public shares or raise capital through crowd-equity on the Ethiopian Securities Exchange (ESX) without full corporate conversion.',
    amharicExecutiveSummary: 'ደንበኛው የቴክኖሎጂና ሎጂስቲክስ ኃላፊነቱ የተወሰነ የግል ማህበር (ኃ/የተ/የግ/ማ) ወደ አክሲዮን ማህበር ሳይቀየር በቀጥታ በኢትዮጵያ ሰነደ-ሙዓለ-ንዋይ ገበያ (ESX) አክሲዮን ለህዝብ መሸጥ ስለመቻሉ ህጋዊ አስተያየት እንዲሰጥ ጠይቀዋል።',
    statutoryCitations: [
      {
        statute: 'Commercial Code Proclamation No. 1240/2021, Art. 495 & 534',
        analysis: 'A Private Limited Company is strictly prohibited from issuing public commercial papers or transferable shares to the general public. Equity offerings require statutory conversion to a Share Company (S.C.).',
        amharicAnalysis: 'በንግድ ህግ አንቀጽ 495 እና 534 መሰረት ኃላፊነቱ የተወሰነ የግል ማህበር ለህዝብ የሚሸጡ ሰነደ-ሙዓለ-ንዋዮችን ወይም አክሲዮኖችን በቀጥታ ማውጣት አይችልም። አክሲዮን ለህዝብ ለማቅረብ ማህበሩ ወደ አክሲዮን ማህበር (አ.ማ) መለወጥ ግዴታ ነው።'
      },
      {
        statute: 'ECMA Capital Market Directive No. 1030/2024, Part IV',
        analysis: 'Public prospectus issuance mandates an independent legal audit, minimum capital capitalization proofs, and audited financial statements certified by an AABE-licensed chartered accountant.',
        amharicAnalysis: 'በካፒታል ገበያ መመሪያ 1030/2024 ክፍል 4 መሰረት የፕሮስፔክተስ ሰነድ ለህዝብ ለማቅረብ ነፃ የህግ ኦዲት፣ የተከፈለ የተጣራ ካፒታል ማረጋገጫ እና በሂሳብ አያያዝ ቦርድ (AABE) የተረጋገጠ የፋይናንስ ሪፖርት ማቅረብ ይጠይቃል።'
      }
    ],
    cassationPrecedent: 'Federal Supreme Court Cassation Division Docket No. 89120 (Vol. 22)',
    amharicCassationPrecedent: 'የፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት መዝገብ ቁጥር 89120 (ቅጽ 22)',
    actionableSteps: [
      'Convene an Extraordinary General Meeting (EGM) to adopt a formal resolution for conversion from PLC to Share Company (S.C.).',
      'Retain an accredited accounting firm to complete the required asset valuation audit.',
      'Submit the amended Articles and Memorandum of Association to the Ministry of Trade & Regional Integration (MoTRI) portal.',
      'File the draft Equity Prospectus with the Ethiopian Capital Market Authority (ECMA) for regulatory clearance.'
    ],
    amharicActionableSteps: [
      'ማህበሩን ከኃ/የተ/የግ/ማ ወደ አክሲዮን ማህበር (አ.ማ) ለመለወጥ የባለድርሻዎችን ጠቅላላ ጉባኤ በመጥራት ይፋዊ ውሳኔ ማሳለፍ፤',
      'በህጋዊ የሂሳብ አዋቂዎች የተረጋገጠ የሀብትና ዕዳ ግመታ ኦዲት ሪፖርት ማዘጋጀት፤',
      'የተሻሻለውን የመመስረቻ ጽሑፍና መተዳደሪያ ደንብ ለንግድና ቀጣናዊ ትስስር ሚኒስቴር ማቅረብ፤',
      'የአክሲዮን ሽያጭ ፕሮስፔክተስ ሰነድ አዘጋጅቶ ለኢትዮጵያ ካፒታል ገበያ ባለስልጣን (ECMA) ለፈቃድ ማቅረብ።'
    ],
    escrowFee: 1500,
    escrowStatus: 'locked'
  }
};

function MemoContent() {
  const params = useParams();
  const rawId = typeof params?.id === 'string' 
    ? params.id 
    : Array.isArray(params?.id) 
    ? params.id[0] 
    : '';
  const decodedId = decodeURIComponent(rawId || 'MEMO-2026-9041');

  const { language, toggleLanguage } = useLanguage();

  const [copied, setCopied] = useState(false);
  const [escrowReleased, setEscrowReleased] = useState(false);

  const memo = MEMO_ARCHIVE[decodedId] || MEMO_ARCHIVE['MEMO-2026-9041'];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAuthorizeRelease = () => {
    setEscrowReleased(true);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col print:bg-white print:p-0">
      
      {/* SCREEN-ONLY TOOLBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/advocate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'ወደ መዝገብ' : 'Advocate Portal'}</span>
            </Link>
            <span className="text-slate-300 font-light">|</span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span className="font-black text-xs text-[#0A1128] font-mono">{memo.memoId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1 bg-slate-50 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copied ? 'Link Copied' : 'Share Memo'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'am' ? 'አትም / PDF አውርድ' : 'Print / Export PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* DOCUMENT CANVAS */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6 print:max-w-none print:px-0 print:py-0">
        
        {/* EXECUTIVE LEGAL OPINION LETTERHEAD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8 relative overflow-hidden print:rounded-none print:border-none print:shadow-none print:p-8">
          
          {/* Top Golden Border Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0A1128] via-amber-500 to-[#0A1128] print:h-1" />

          {/* Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-[#0A1128]" />
                <h1 className="text-xl font-black tracking-tight text-[#0A1128] uppercase">
                  {language === 'am' ? memo.amharicAdvocateName : memo.advocateName}
                </h1>
              </div>
              <p className="text-xs font-bold text-amber-800">
                {language === 'am' ? memo.amharicCourtStanding : memo.courtStanding}
              </p>
              <div className="text-[11px] font-mono text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                <span>Bar Lic: <strong>{memo.barLicense}</strong></span>
                <span>Registry: <strong>{memo.mojAuditNo}</strong></span>
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>

            {/* Official Intermediary Seal */}
            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>MOJ Regulatory Verified</span>
              </div>
              <span className="block text-[10px] text-slate-400 font-mono mt-1">
                Docket: {memo.docketId}
              </span>
              <span className="block text-xs font-bold text-slate-700">
                {language === 'am' ? memo.amharicDate : memo.date}
              </span>
            </div>
          </div>

          {/* Docket Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === 'am' ? 'ደንበኛ' : 'Client / Recipient'}
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {language === 'am' ? memo.amharicClientName : memo.clientName}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === 'am' ? 'የህግ ዘርፍ' : 'Practice Jurisdiction'}
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {language === 'am' ? memo.amharicPracticeArea : memo.practiceArea}
              </strong>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === 'am' ? 'የጉዳዩ ርዕሰ-ነገር' : 'Matter Subject'}
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {language === 'am' ? memo.amharicMatterSubject : memo.matterSubject}
              </p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-md bg-[#0A1128] text-amber-400 flex items-center justify-center font-mono text-[10px] font-bold">1</span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0A1128]">
                {language === 'am' ? 'የጉዳዩ ማጠቃለያ' : 'Executive Case Background'}
              </h2>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {language === 'am' ? memo.amharicExecutiveSummary : memo.executiveSummary}
            </p>
          </section>

          {/* Section 2: Statutory Legal Analysis */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-md bg-[#0A1128] text-amber-400 flex items-center justify-center font-mono text-[10px] font-bold">2</span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0A1128]">
                {language === 'am' ? 'ህጋዊ ድንጋጌዎችና የህግ ማዕቀፍ' : 'Applicable Statutory Provisions'}
              </h2>
            </div>
            
            <div className="space-y-2.5">
              {memo.statutoryCitations.map((cit, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1">
                  <strong className="text-xs font-bold text-[#0A1128] block">
                    {cit.statute}
                  </strong>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {language === 'am' ? cit.amharicAnalysis : cit.analysis}
                  </p>
                </div>
              ))}
            </div>

            {memo.cassationPrecedent && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950">
                <span className="font-bold block uppercase text-[10px] text-amber-800">
                  {language === 'am' ? 'የሰበር ውሳኔ ማጣቀሻ' : 'Cassation Precedent Guidance'}
                </span>
                <span className="font-semibold">
                  {language === 'am' ? memo.amharicCassationPrecedent : memo.cassationPrecedent}
                </span>
              </div>
            )}
          </section>

          {/* Section 3: Recommended Actionable Next Steps */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
              <span className="w-5 h-5 rounded-md bg-[#0A1128] text-amber-400 flex items-center justify-center font-mono text-[10px] font-bold">3</span>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#0A1128]">
                {language === 'am' ? 'የሚወሰዱ ቀጣይ እርምጃዎች' : 'Recommended Next Steps & Action Plan'}
              </h2>
            </div>
            
            <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed font-normal">
              {(language === 'am' ? memo.amharicActionableSteps : memo.actionableSteps).map((step, idx) => (
                <li key={idx} className="pl-1">
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Section 4: Advocate Official Endorsement Seal */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-sm space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Commercial Code Procl. 1240/2021 Custody</span>
                </div>
                <p className="text-[10px] text-emerald-800 leading-relaxed font-normal">
                  This memorandum serves as verified proof of consultation delivery. Certified under Federal Ministry of Justice advocate compliance norms.
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-2 w-full sm:w-auto">
              <div className="inline-block border-b-2 border-dotted border-slate-400 pb-1 px-8 text-center">
                <span className="font-serif italic text-base text-slate-800 block">
                  {memo.advocateName}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Authorized Signature & Seal Stamp
              </span>
              <span className="text-[11px] font-bold text-slate-700 font-mono block">
                Lic: {memo.barLicense}
              </span>
            </div>
          </div>

        </div>

        {/* SCREEN-ONLY ESCROW RELEASE INTERFACE */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 print:hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                {language === 'am' ? 'የዋስትና ሂሳብ ክፍያ መልቀቂያ' : 'ESCROW VOUCHER AUTHORIZATION'}
              </span>
              <h3 className="text-base font-black text-[#0A1128]">
                {language === 'am' ? 'የማማከር ምክሩን ተቀብለዋል?' : 'Satisfied with the Legal Consultation Memo?'}
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xl">
                {language === 'am'
                  ? 'ይህ ሰነድ ምክክሩ በተሟላ ሁኔታ እንደተሰጠ የሚያረጋግጥ ነው። ክፍያ መልቀቂያ ቫውቸር ሲያረጋግጡ በቴሌብር የተያዘው ETB 1,500 ለጠበቃው ይለቀቃል።'
                  : 'Approving releases the held ETB 1,500 retainer to the advocate. You will receive an official Ethio Telecom Telebirr voucher receipt.'}
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              {escrowReleased ? (
                <div className="px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'am' ? 'ክፍያው ተለቋል (ETB 1,500)' : 'Voucher Released to Advocate'}</span>
                </div>
              ) : (
                <button
                  onClick={handleAuthorizeRelease}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>{language === 'am' ? 'የክፍያ ቫውቸር አረጋግጥና ልቀቅ' : 'Approve & Release Payment Voucher'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <Link href="/escrow" className="hover:text-[#0A1128] font-bold text-emerald-700 underline">
              {language === 'am' ? 'ወደ ዋስትና ሂሳብ መዝገብ ይመለሱ' : 'View on Two-Party Escrow Desk ➔'}
            </Link>
            <span className="font-mono text-[10px]">Reference: #TB-USSD-984210</span>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 print:hidden">
        LegalLink Statutory Opinion Registry • Federal Ministry of Justice Bar Verification Node • Addis Ababa, Ethiopia
      </footer>

    </div>
  );
}

export default function MemoPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-bold text-slate-500">
          Loading Official Consultation Summary & Legal Opinion Memo...
        </div>
      }
    >
      <MemoContent />
    </Suspense>
  );
}