'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Globe,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Handshake,
  Target,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  RevealOnScroll,
  KineticHeadline,
  SpotlightCard,
} from '@/components/MotionPrimitives';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPartnershipsPage() {
  const { language } = useLanguage();
  const supabase = createClient();

  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationType, setOrganizationType] = useState('Donor / Development Partner');
  const [partnershipArea, setPartnershipArea] = useState('Access to Justice & Digital Ecosystem Grant');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const values = [
    {
      title: 'Accessibility',
      desc: 'Removing geographic, procedural, and informational barriers to legal support across Ethiopia.',
    },
    {
      title: 'Integrity',
      desc: 'Upholding transparent advocate verification, ethical boundaries, and client confidentiality.',
    },
    {
      title: 'Innovation',
      desc: 'Modernizing discovery, bilingual drafting, and legal education with practical digital tools.',
    },
    {
      title: 'Impact',
      desc: 'Strengthening real access to justice for citizens, SMEs, students, and the diaspora.',
    },
    {
      title: 'Growth',
      desc: 'Expanding visibility and digital capacity for Ethiopia’s legal professionals and institutions.',
    },
  ];

  const barriers = [
    {
      num: '01',
      title: 'Discovery',
      problem: 'People often depend on informal personal referrals to find an appropriate lawyer.',
      solution: 'Structured digital discovery by practice area, court standing, city, and language.',
    },
    {
      num: '02',
      title: 'Confidence',
      problem: 'Clients struggle to assess expertise, court license tier, or credibility upfront.',
      solution: 'MOJ & Regional Bar credential review with clear, verifiable advocate profiles.',
    },
    {
      num: '03',
      title: 'Clarity',
      problem: 'Required documents, legal terminology, and next steps are hard to understand in advance.',
      solution: 'Bilingual Legal Center dictionary, preparation checklists, and LexDraft forms.',
    },
    {
      num: '04',
      title: 'Continuity',
      problem: 'Consultations, documents, and follow-up sit scattered across separate channels.',
      solution: 'One integrated workspace connecting inquiries, dashboards, guides, and forms.',
    },
  ];

  const comparisonRows = [
    { traditional: 'Reliance on personal referrals', legallink: 'Digital professional discovery' },
    { traditional: 'Fragmented service access', legallink: 'Connected legal-service platform' },
    { traditional: 'Limited professional visibility', legallink: 'Digital profiles & broader market reach' },
    { traditional: 'Legal information from separate sources', legallink: 'LegalTalk, Legal Center & 122-law library' },
    { traditional: 'Separate channels per service', legallink: 'Multiple legal services in one ecosystem' },
    { traditional: 'Primarily physical engagement', legallink: 'Digital, remote & diaspora engagement options' },
  ];

  const segments = [
    { title: 'Individuals & the Public', desc: 'Plain-language legal info, guidance, and direct consultations', icon: Users },
    { title: 'Startups & SMEs', desc: 'Contracts, company formation, compliance, and ongoing support', icon: Building2 },
    { title: 'Law Students & Emerging Pros', desc: 'Learning resources, internships, and pupillage via NextGen Hub', icon: GraduationCap },
    { title: 'Lawyers & Advocates', desc: 'Digital visibility, structured client briefs, and chamber portal', icon: Scale },
    { title: 'Law Firms & Employers', desc: 'Client reach, verified profiles, and legal talent discovery', icon: Briefcase },
    { title: 'Ethiopians in the Diaspora', desc: 'Remote access to verified local advocates for PoA and property', icon: Globe },
    { title: 'Institutions, NGOs & Donors', desc: 'Access-to-justice programs, compliance, governance, and training', icon: Handshake },
  ];

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!organizationName.trim() || !contactName.trim() || !email.trim() || message.trim().length < 15) {
      setErrorMsg('Please fill in all required partnership inquiry fields (message at least 15 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from('partner_inquiries').insert({
        organization_name: organizationName.trim(),
        contact_name: contactName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        organization_type: organizationType,
        partnership_area: partnershipArea,
        message: message.trim(),
        status: 'new',
      });

      if (dbError) throw dbError;

      fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: organizationName.trim(),
          contactName: contactName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          organizationType,
          partnershipArea,
          message: message.trim(),
        }),
      }).catch(() => {});

      setSubmitted(true);
      setOrganizationName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(
        err?.message || 'Could not submit inquiry right now. Please email info.legallinkethiopia@gmail.com directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      <Navbar />

      {/* Sunlit Sky Azure Hero Banner */}
      <section className="relative overflow-hidden ll-sky-canvas text-white py-16 md:py-24">
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-10 -left-20 w-[440px] h-[200px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-24 -right-20 w-[500px] h-[220px] rounded-full bg-white/30 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/35 backdrop-blur-md text-white text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>About LegalLink Ethiopia • Institutional Overview</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <KineticHeadline
              primaryText={
                language === 'am'
                  ? 'የኢትዮጵያ የተቀናጀ ዲጂታል የህግ መድረክ'
                  : 'A Digital Environment for Finding, Accessing,'
              }
              accentText={
                language === 'am'
                  ? 'ለሁሉም ተደራሽ ፍትሕ።'
                  : 'and Managing Legal Support in Ethiopia.'
              }
            />
            <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl font-medium">
              LegalLink brings together verified legal service discovery, direct consultations, plain-language legal education, federal proclamations, and bilingual document drafting inside one organized ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#partnerships"
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-[#182235] font-black text-xs rounded-full inline-flex items-center gap-2 shadow-md transition-all"
            >
              <span>Partner With LegalLink</span>
              <ArrowRight className="w-4 h-4 text-[#3B66B8]" />
            </a>
            <Link
              href="/find-a-lawyer"
              className="px-7 py-3.5 bg-white/20 hover:bg-white/30 text-white border border-white/35 backdrop-blur-md font-bold text-xs rounded-full inline-flex items-center gap-2 transition-all"
            >
              <span>Explore Live Platform</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision, Mission & 5 Core Values */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevealOnScroll>
              <SpotlightCard className="p-8 rounded-3xl h-full space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[#3B66B8] text-white flex items-center justify-center relative z-10">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8] block relative z-10">
                  OUR VISION
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#182235] leading-snug relative z-10">
                  “To become Ethiopia’s go-to platform and partner for accessible, affordable, and professional future-ready legal support.”
                </h2>
              </SpotlightCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <SpotlightCard className="p-8 rounded-3xl h-full space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center relative z-10">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-700 block relative z-10">
                  OUR MISSION
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#182235] leading-snug relative z-10">
                  Democratizing legal services through innovation, compliance, and trusted advisory.
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                  Connect professionals and clients • Inform through accessible legal knowledge • Enable practical digital legal services.
                </p>
              </SpotlightCard>
            </RevealOnScroll>
          </div>

          <div className="space-y-6">
            <RevealOnScroll className="text-center">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8]">
                OUR FIVE CORE VALUES
              </span>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {values.map((v, idx) => (
                <RevealOnScroll key={v.title} delayMs={idx * 55}>
                  <SpotlightCard className="p-5 rounded-2xl h-full space-y-1.5">
                    <strong className="text-sm font-black text-[#182235] block relative z-10">
                      {v.title}
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                      {v.desc}
                    </p>
                  </SpotlightCard>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Barriers We Solve */}
      <section className="py-16 md:py-20 bg-[#F5F7FB] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <RevealOnScroll className="max-w-2xl space-y-2.5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8]">
              BRIDGING THE ACCESS GAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
              Four Barriers Standing Between Legal Expertise and Access — Solved in One Place
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {barriers.map((b, idx) => (
              <RevealOnScroll key={b.num} delayMs={idx * 70}>
                <SpotlightCard className="p-6 rounded-3xl h-full space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 relative z-10">
                    <span className="text-2xl font-black font-mono text-[#3B66B8] block">
                      {b.num}
                    </span>
                    <h3 className="text-base font-black text-[#182235]">{b.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{b.problem}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-emerald-900 font-semibold relative z-10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b.solution}</span>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional vs LegalLink Comparison + Ecosystem Segments */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <RevealOnScroll className="space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8]">
                WHAT MAKES US DIFFERENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
                Traditional Approach vs. LegalLink’s Approach
              </h2>
            </div>

            <div className="overflow-x-auto bg-[#F5F7FB] rounded-3xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#EEF3FB] text-[11px] font-mono uppercase">
                    <th className="py-4 px-6 text-slate-600">Traditional Approach</th>
                    <th className="py-4 px-6 text-[#3B66B8] font-black">LegalLink’s Approach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="py-3.5 px-6 text-slate-600">{row.traditional}</td>
                      <td className="py-3.5 px-6 font-bold text-[#182235] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0" />
                        <span>{row.legallink}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            <RevealOnScroll className="space-y-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8]">
                WHO WE SERVE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
                Serving the Entire Ethiopian Legal Ecosystem
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {segments.map((seg, idx) => {
                const Icon = seg.icon;
                return (
                  <RevealOnScroll key={seg.title} delayMs={idx * 45}>
                    <SpotlightCard className="p-5 rounded-2xl h-full space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#EEF3FB] text-[#3B66B8] flex items-center justify-center relative z-10">
                        <Icon className="w-4 h-4" />
                      </div>
                      <strong className="text-sm font-black text-[#182235] block relative z-10">
                        {seg.title}
                      </strong>
                      <p className="text-xs text-slate-600 leading-relaxed relative z-10">
                        {seg.desc}
                      </p>
                    </SpotlightCard>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="py-16 md:py-20 bg-[#F5F7FB] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[11px] font-mono uppercase tracking-widest font-bold text-[#3B66B8]">
              OUR LEADERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
              The People Behind LegalLink
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Small team, high execution velocity: building a trusted digital gateway to legal services in Ethiopia.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <RevealOnScroll>
              <SpotlightCard className="p-7 rounded-3xl h-full flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3B66B8] text-white font-black text-lg flex items-center justify-center shrink-0 relative z-10">
                  YS
                </div>
                <div className="space-y-1 relative z-10">
                  <h3 className="text-base font-black text-[#182235]">Yeabsira Semu</h3>
                  <span className="text-[11px] font-mono uppercase font-bold text-[#3B66B8] block">
                    Founder
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Leads legal ecosystem vision, advocate network engagement, institutional partnerships, and market strategy across Ethiopia.
                  </p>
                </div>
              </SpotlightCard>
            </RevealOnScroll>

            <RevealOnScroll delayMs={100}>
              <SpotlightCard className="p-7 rounded-3xl h-full flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#182235] text-amber-400 font-black text-lg flex items-center justify-center shrink-0 relative z-10">
                  YS
                </div>
                <div className="space-y-1 relative z-10">
                  <h3 className="text-base font-black text-[#182235]">Ybeltal Semagn</h3>
                  <span className="text-[11px] font-mono uppercase font-bold text-emerald-700 block">
                    Co-Founder &amp; Developer
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Architects the LegalLink digital platform, bilingual drafting engine (LexDraft), security governance, and scalable full-stack delivery.
                  </p>
                </div>
              </SpotlightCard>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Institutional & Donor Partnerships Inquiry Section */}
      <section id="partnerships" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <RevealOnScroll className="lg:col-span-5 space-y-6">
              <div className="space-y-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5] text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strategic &amp; Institutional Partnerships</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#182235]">
                  Let’s Shape the Future of Law Together
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We partner with development donors, law schools, legal aid NGOs, startup accelerators, and corporate institutions to expand equitable digital access to justice in Ethiopia.
                </p>
              </div>

              <div className="p-7 bg-gradient-to-br from-[#2E55A5] via-[#3B66B8] to-[#5784D6] text-white rounded-3xl space-y-4 text-xs shadow-md">
                <strong className="text-sm font-black block text-white">
                  Official LegalLink Ethiopia Contacts
                </strong>
                <div className="space-y-2.5 text-white/95">
                  <a
                    href="mailto:info.legallinkethiopia@gmail.com"
                    className="flex items-center gap-2.5 hover:text-amber-300 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>info.legallinkethiopia@gmail.com</span>
                  </a>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>+251-964-600-737 / +251-905-941-865</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Addis Ababa, Ethiopia</span>
                  </div>
                </div>
                <p className="pt-3 border-t border-white/20 text-[11px] italic text-white/90">
                  “Justice delayed is justice denied — LegalLink ensures it is neither.”
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delayMs={120} className="lg:col-span-7 bg-[#F5F7FB] rounded-3xl border border-slate-200 p-7 sm:p-9 shadow-xs">
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-[#182235]">
                    Partnership Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for connecting with LegalLink Ethiopia. A confirmation email has been sent, and our founding team will follow up within 1–2 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-[#182235] text-white text-xs font-bold rounded-full cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1 pb-2">
                    <h3 className="text-lg font-black text-[#182235]">
                      Institutional, University &amp; Donor Inquiry
                    </h3>
                    <p className="text-slate-600">
                      Share your organization’s focus and how we can collaborate.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Organization / Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Addis Ababa University Law School"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Contact Person Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Hanna Tesfaye"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@organization.org"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+251 911 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Organization Type *
                      </label>
                      <select
                        value={organizationType}
                        onChange={(e) => setOrganizationType(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Donor / Development Partner">Donor / Development Partner</option>
                        <option value="University / Law School">University / Law School</option>
                        <option value="NGO / Legal Aid Organization">NGO / Legal Aid Organization</option>
                        <option value="Corporate / Startup Hub">Corporate / Startup Hub</option>
                        <option value="Law Firm / Bar Association">Law Firm / Bar Association</option>
                        <option value="Government / Regulatory Body">Government / Regulatory Body</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Partnership Area *
                      </label>
                      <select
                        value={partnershipArea}
                        onChange={(e) => setPartnershipArea(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-xl font-semibold focus:outline-none focus:border-[#3B66B8]"
                      >
                        <option value="Access to Justice & Digital Ecosystem Grant">
                          Access to Justice &amp; Digital Ecosystem Grant
                        </option>
                        <option value="University & NextGen Pupillage Program">
                          University &amp; NextGen Pupillage Program
                        </option>
                        <option value="Institutional Compliance & Training">
                          Institutional Compliance &amp; Training
                        </option>
                        <option value="Pro Bono & Legal Aid Collaboration">
                          Pro Bono &amp; Legal Aid Collaboration
                        </option>
                        <option value="Corporate & SME Legal Support">
                          Corporate &amp; SME Legal Support
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[#182235] mb-1">
                      How would you like to collaborate? *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your program, institutional goals, or request a live platform walkthrough..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#3B66B8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#3B66B8] hover:bg-[#2F56A6] text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Submit Partnership Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <footer className="bg-[#182235] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal-center" className="hover:text-white">Legal Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}