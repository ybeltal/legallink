'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Scale,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

interface DiasporaService {
  id: string;
  title: string;
  amharicTitle: string;
  description: string;
  timeline: string;
  checklist: string[];
}

const DIASPORA_SERVICES: DiasporaService[] = [
  {
    id: 'poa',
    title: 'Embassy Power of Attorney (ውክልና) Guidance',
    amharicTitle: 'የኤምባሲ የውክልና ስልጣን ዝግጅትና ማረጋገጫ',
    description:
      'Statutory drafting, review, and DARS authentication guidance for general or special powers of attorney executed at Ethiopian embassies worldwide.',
    timeline: '3–5 Business Days (post-attestation)',
    checklist: [
      'Bilingual draft aligned with Ethiopian Civil Code Art. 2199',
      'Ethiopian Embassy / Consulate authentication guidance',
      'Ministry of Foreign Affairs (MoFA) Addis Ababa attestation steps',
      'DARS official ledger registration readiness',
    ],
  },
  {
    id: 'property',
    title: 'Land Title & Property Audit (ካርታ)',
    amharicTitle: 'የመሬት ካርታና ይዞታ ህጋዊ ማረጋገጫ',
    description:
      'Title deed (ካርታ) verification, municipal leasehold checks, boundary disputes, and tenancy recovery across Addis Ababa and regional cities.',
    timeline: '5–7 Business Days',
    checklist: [
      'Sub-city Land Administration archive verification',
      'Encumbrance and bank mortgage lien checks',
      'Urban Land Leasehold Proclamation No. 721/2011 review',
      'Direct advocate briefing and remote status updates',
    ],
  },
  {
    id: 'inheritance',
    title: 'Estate Succession & Inheritance Administration',
    amharicTitle: 'የውርስ ሀብት ማጣራትና ክፍፍል',
    description:
      'Representation in Federal and Regional courts to petition for legal heir certificates, liquidate estate accounts, and transfer inherited property.',
    timeline: 'Varies by court docket',
    checklist: [
      'Court petition for Certificate of Heirship (የውርስ አጣሪ)',
      'Property partition agreement drafting',
      'Bank estate documentation guidance',
      'Remote representation via authenticated Power of Attorney',
    ],
  },
  {
    id: 'eic',
    title: 'Yellow Card Rights & Business Investment Setup',
    amharicTitle: 'የቢጫ ካርድ መብቶች እና የኢንቨስትመንት ምዝገባ',
    description:
      'Company incorporation under Commercial Code Proclamation No. 1243/2021, Ethiopian Origin ID (Yellow Card) advisory, and EIC licensing support.',
    timeline: '7–10 Business Days',
    checklist: [
      'Origin ID (Yellow Card) economic rights review (Proc. No. 270/2002)',
      'PLC or Single-Member PLC Articles of Association',
      'Commercial TIN and business license compliance steps',
      'Ethiopian Investment Commission (EIC) permit guidance',
    ],
  },
];

export default function DiasporaHubPage() {
  const supabase = createClient();

  const [selectedService, setSelectedService] = useState<DiasporaService>(DIASPORA_SERVICES[0]);
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [caseNotes, setCaseNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        if (meta.full_name) setClientName((prev) => prev || meta.full_name);
        if (data.user.email) setClientEmail((prev) => prev || data.user.email || '');
      }
    });
  }, []);

  const handleSubmitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!clientName.trim() || !clientContact.trim()) {
      setErrorMsg('Please enter your full name and WhatsApp / phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const refId = `LL-DIA-${Date.now().toString(36).toUpperCase().slice(-5)}`;
      const fullSummary = `[Diaspora — ${selectedCountry}] Service: ${selectedService.title}. ${caseNotes.trim() || 'Requested remote diaspora legal consultation.'}`;

      const { error } = await supabase.from('consultation_bookings').insert({
        lawyer_id: 'ETH-BAR-2019-0921',
        lawyer_name: 'Adv. Selamawit Girma (Diaspora Desk)',
        client_name: clientName.trim(),
        client_phone: clientContact.trim(),
        client_email: clientEmail.trim().toLowerCase() || null,
        consultation_date: new Date().toISOString().split('T')[0],
        consultation_time: `Remote Video / WhatsApp (${selectedCountry})`,
        practice_area: 'Immigration & Diaspora',
        brief_description: fullSummary,
        fee_etb: 0,
        escrow_status: 'free_launch',
        booking_status: 'pending',
      });

      if (error) throw error;

      // Fire Telegram & Email confirmation asynchronously
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'consultation_booked',
          data: {
            reference: refId,
            client_name: clientName.trim(),
            lawyer_name: 'Adv. Selamawit Girma (Diaspora Desk)',
            practice_area: selectedService.title,
            urgency: selectedCountry,
            mode: 'Diaspora Remote',
          },
        }),
      }).catch(() => {});

      fetch('/api/consultation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: refId,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim().toLowerCase() || null,
          clientPhone: clientContact.trim(),
          lawyerName: 'Adv. Selamawit Girma (Diaspora Desk)',
          practiceArea: selectedService.title,
          urgency: 'Remote Review',
          mode: `Diaspora (${selectedCountry})`,
        }),
      }).catch(() => {});

      setReferenceId(refId);
      setSubmitted(true);
      setCaseNotes('');
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Could not submit diaspora request. Please check your connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>CROSS-BORDER ETHIOPIAN LEGAL DESK • FREE LAUNCH</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Ethiopian Diaspora Legal Services Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-normal">
              Coordinate embassy powers of attorney, land title verification, estate succession, and business registration in Ethiopia remotely with MOJ-verified local advocates — with zero platform matching fees.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">
                Platform Matching
              </span>
              <span className="font-black text-white">100% Free Direct Access</span>
            </div>
          </div>
        </div>

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          {/* Left: Services */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase text-[11px] block">
                Priority Diaspora Legal Services
              </span>
              <span className="text-slate-500 text-[11px]">Select a service to pre-fill your inquiry</span>
            </div>

            <div className="space-y-3">
              {DIASPORA_SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-4 ${
                    selectedService.id === srv.id
                      ? 'bg-white border-[#0A1128] shadow-md ring-2 ring-[#0A1128]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h2 className="font-black text-base text-[#0A1128]">{srv.title}</h2>
                      <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                        {srv.amharicTitle}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] shrink-0">
                      Free Inquiry
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {srv.description}
                  </p>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Typical Timeline:</span>
                      <strong className="text-slate-800">{srv.timeline}</strong>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {srv.checklist.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Supabase Intake Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6 lg:sticky lg:top-24">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block font-mono">
                  REMOTE LEGAL CONSULTATION
                </span>
                <h2 className="text-lg font-black text-[#0A1128]">Open a Matter From Abroad</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your request is saved securely to LegalLink and routed to verified Ethiopian advocates who handle cross-border matters.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-black text-emerald-950 text-base">Diaspora Request Submitted!</h3>
                  {referenceId && (
                    <span className="inline-block px-3 py-1 rounded-full bg-white border border-emerald-200 font-mono font-bold text-amber-800 text-[11px]">
                      Ref: {referenceId}
                    </span>
                  )}
                  <p className="text-emerald-900 text-xs leading-relaxed">
                    Thank you, <strong>{clientName}</strong>. Our diaspora legal desk will review your brief and follow up via WhatsApp or email.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      className="w-full py-2.5 bg-[#0A1128] text-white font-bold rounded-xl"
                    >
                      Track Status in My Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-bold text-emerald-900 underline cursor-pointer"
                    >
                      Submit another diaspora inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitIntake} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Selected Service</label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#0A1128]">
                      {selectedService.title}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Country of Current Residence *
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom & Europe">United Kingdom &amp; Europe</option>
                      <option value="Canada">Canada</option>
                      <option value="United Arab Emirates & Middle East">
                        United Arab Emirates &amp; Middle East
                      </option>
                      <option value="Australia & New Zealand">Australia &amp; New Zealand</option>
                      <option value="Other International Location">Other International Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel Kebede"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (202) 000-0000"
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Email (for receipt)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Matter Summary / City in Ethiopia
                    </label>
                    <textarea
                      rows={3}
                      placeholder="E.g. Inherited house in Bole Sub-City, preparing an Embassy Power of Attorney, or setting up a PLC..."
                      value={caseNotes}
                      onChange={(e) => setCaseNotes(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Scale className="w-3.5 h-3.5 text-emerald-700" />
                      <span>No Platform Fees</span>
                    </div>
                    <p className="leading-relaxed">
                      Submitting your diaspora inquiry is completely free. Formal legal representation scope and fees are agreed directly with your licensed Ethiopian advocate.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Free Diaspora Inquiry</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white">About &amp; Partnerships</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}