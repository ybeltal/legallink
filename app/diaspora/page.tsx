'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, 
  FileText, Home as HomeIcon, Scale, Building2, Lock, 
  DollarSign, Clock, HelpCircle, Check, Sparkles, Send
} from 'lucide-react';

interface DiasporaService {
  id: string;
  title: string;
  amharicTitle: string;
  description: string;
  usdRate: number;
  etbEquivalent: number;
  timeline: string;
  checklist: string[];
}

const DIASPORA_SERVICES: DiasporaService[] = [
  {
    id: 'poa',
    title: 'Embassy Power of Attorney (ውክልና) Registration',
    amharicTitle: 'የኤምባሲ የውክልና ስልጣን ምዝገባ',
    description: 'Statutory drafting, review, and DARA authentication for general or special power of attorney issued at Ethiopian embassies worldwide.',
    usdRate: 75,
    etbEquivalent: 9200,
    timeline: '3–5 Business Days',
    checklist: [
      'Bilingual draft tailored to Ethiopian Civil Code Art. 2199',
      'Embassy consular stamp validation',
      'Ministry of Foreign Affairs (MoFA) Addis Ababa attestation',
      'DARA official ledger registration'
    ]
  },
  {
    id: 'property',
    title: 'Land Title & Property Restitution Audit',
    amharicTitle: 'የመሬት ካርታና ይዞታ ህጋዊ ማረጋገጫ',
    description: 'Title deed (ካርታ) authentication, municipal leasehold audits, boundary disputes, and illegal tenancy recovery across Addis Ababa sub-cities.',
    usdRate: 120,
    etbEquivalent: 14700,
    timeline: '5–7 Business Days',
    checklist: [
      'Sub-city Land Administration archive search',
      'Encumbrance & bank mortgage lien verification',
      'Municipal Master Plan zoning compliance review',
      'Written Advocate Legal Opinion with verified title copy'
    ]
  },
  {
    id: 'inheritance',
    title: 'Estate Succession & Inheritance Liquidation',
    amharicTitle: 'የውርስ ሀብት ማጣራትና ክፍፍል',
    description: 'Representation in Federal First Instance Courts to petition for legal heir certificates, liquidate bank accounts, and transfer real estate titles.',
    usdRate: 150,
    etbEquivalent: 18400,
    timeline: '2–3 Weeks',
    checklist: [
      'Court petition for Certificate of Heirship (የውርስ አጣሪ)',
      'Sub-city property partition agreement drafting',
      'Commercial bank account estate distribution',
      'Federal High Court endorsement'
    ]
  },
  {
    id: 'eic',
    title: 'Ethiopian Origin ID (Yellow Card) & EIC Investment',
    amharicTitle: 'የትውልደ ኢትዮጵያዊ መታወቂያና የኢንቨስትመንት ፍቃድ',
    description: 'Company incorporation under Commercial Code 1240/2021, foreign currency account setup, and Ethiopian Investment Commission (EIC) licensing.',
    usdRate: 200,
    etbEquivalent: 24500,
    timeline: '7–10 Business Days',
    checklist: [
      'Yellow Card investor benefit eligibility audit',
      'PLC / Share Company Articles of Association',
      'National Bank of Ethiopia FX account authorization',
      'Commercial TIN & Business License issuance'
    ]
  }
];

export default function DiasporaHubPage() {
  const [selectedService, setSelectedService] = useState<DiasporaService>(DIASPORA_SERVICES[0]);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [caseNotes, setCaseNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim()) return;
    setSubmitted(true);
  };

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
            <Link href="/find-a-lawyer" className="text-slate-500 hover:text-[#0A1128] transition-colors">
              Find a Lawyer
            </Link>
            <Link href="/escrow" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Escrow Protection
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

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>CROSS-BORDER ETHIOPIAN LEGAL DESK</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Diaspora Legal Representation & Escrow Hub
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
              Manage your land titles, embassy powers of attorney, inheritance successions, and commercial investments in Ethiopia without traveling to Addis Ababa. Protected by statutory escrow.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Cross-Border Guarantee</span>
              <span className="font-black text-white">Telebirr & Swift Remittance Escrow</span>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace: Services Directory & Direct Cross-Border Intake */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Left Column: Specialized Diaspora Services */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase text-[11px] block">
                Specialized Services for Ethiopians Overseas
              </span>
              <span className="text-slate-400 text-[10px]">Select a service to view workflow</span>
            </div>

            <div className="space-y-3">
              {DIASPORA_SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                    selectedService.id === srv.id
                      ? 'bg-white border-[#0A1128] shadow-md ring-2 ring-[#0A1128]/5'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-base text-[#0A1128]">{srv.title}</h3>
                      <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">{srv.amharicTitle}</span>
                    </div>
                    <div className="text-right">
                      <strong className="text-base font-black text-[#0A1128] block">${srv.usdRate} USD</strong>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold block">≈ {srv.etbEquivalent.toLocaleString()} ETB</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {srv.description}
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-200/60 font-medium">
                      <span className="text-slate-500">Standard Delivery Timeline:</span>
                      <strong className="text-slate-800">{srv.timeline}</strong>
                    </div>
                    
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Compliance Workflow Included:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {srv.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Confidential Cross-Border Intake Tunnel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6 sticky top-28">
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block">
                  REMOTE LEGAL REPRESENTATION
                </span>
                <h2 className="text-lg font-black text-[#0A1128]">
                  Open a Case from Abroad
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Your brief is routed to verified Federal Supreme Court & High Court advocates licensed for overseas client dockets.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-emerald-950 text-sm">Diaspora Docket Registered!</h3>
                  <p className="text-emerald-800 text-xs leading-relaxed">
                    Thank you, <strong>{clientName}</strong>. A diaspora relationship manager and assigned counsel will contact you via WhatsApp / Email within 4 hours to review your embassy documents.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-900 underline cursor-pointer"
                  >
                    Submit another legal matter
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitIntake} className="space-y-4">
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Selected Service</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#0A1128] flex justify-between items-center">
                      <span>{selectedService.title}</span>
                      <span className="text-amber-600">${selectedService.usdRate}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Country of Current Residence *</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    >
                      <option value="United States">United States (DC, MD, VA, CA, TX, etc.)</option>
                      <option value="United Kingdom">United Kingdom & Europe</option>
                      <option value="Canada">Canada (Ontario, Alberta, BC)</option>
                      <option value="United Arab Emirates">United Arab Emirates & Gulf States</option>
                      <option value="Australia">Australia & New Zealand</option>
                      <option value="Other">Other Diaspora Jurisdiction</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel Kebede"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (202) 000-0000"
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Matter Summary / Property Location</label>
                    <textarea
                      rows={3}
                      placeholder="Specify details (e.g. Inherited property in Bole Sub-city, drafting Embassy PoA for a family member, or EIC business setup)..."
                      value={caseNotes}
                      onChange={(e) => setCaseNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Statutory Escrow Safeguard</span>
                    </div>
                    <p className="leading-relaxed">
                      Consultation retainers are deposited into Telebirr / Swift Escrow and released only after your advocate provides verified documentary proofs.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Diaspora Matter for Legal Review</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* 3-Step Cross-Border Process Guide */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
              SEAMLESS REMOTE COLLABORATION
            </span>
            <h3 className="text-xl font-black text-[#0A1128]">
              How Remote Legal Representation Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-white text-[#0A1128] font-bold flex items-center justify-center shadow-xs">
                1
              </span>
              <strong className="text-xs text-[#0A1128] block font-black">Submit & Align Counsel</strong>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Submit your situation from overseas. An accredited Ethiopian advocate will schedule a video conference across your local time zone.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-white text-amber-600 font-bold flex items-center justify-center shadow-xs">
                2
              </span>
              <strong className="text-xs text-[#0A1128] block font-black">Embassy Power of Attorney</strong>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Counsel drafts the statutory power of attorney (ውክልና). You execute it at your nearest Ethiopian embassy or consulate and courier the original.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="w-8 h-8 rounded-xl bg-white text-emerald-600 font-bold flex items-center justify-center shadow-xs">
                3
              </span>
              <strong className="text-xs text-[#0A1128] block font-black">Representation & Escrow Release</strong>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                Your advocate files petitions at DARA, courts, or municipal offices. Retainer funds transfer from escrow only after formal completion.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Diaspora Legal Desk • Cross-Border Representation & Escrow • Addis Ababa, Ethiopia
      </footer>

    </div>
  );
}