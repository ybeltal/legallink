'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Clock, DollarSign, 
  Users, Globe, ChevronDown, ChevronUp, Loader2, Sparkles, Check, Briefcase, Scale
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForLawyersPage() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [barLicense, setBarLicense] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('4–7 years');
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [bio, setBio] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const practiceAreaOptions = [
    'Corporate & Business', 'Family Law', 'Property & Real Estate', 
    'Intellectual Property', 'Employment Law', 'Criminal Defense', 
    'Immigration', 'NGO & Compliance', 'Tax Law', 
    'Constitutional Law', 'Banking & Finance', 'Environmental Law'
  ];

  const experienceOptions = [
    '1–3 years', '4–7 years', '8–12 years', '13–20 years', '20+ years'
  ];

  const togglePracticeArea = (area: string) => {
    setSelectedAreas((prev) => 
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedAreas.length === 0) {
      setErrorMessage('Please select at least one practice area.');
      return;
    }

    if (bio.trim().length < 50) {
      setErrorMessage('Professional bio must be at least 50 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('advocate_applications').insert([
        {
          full_name: fullName.trim(),
          bar_license_number: barLicense.trim(),
          phone_number: phoneNumber.trim(),
          email: emailAddress.trim(),
          practice_areas: selectedAreas,
          experience_years: experienceYears,
          hourly_rate: Number(hourlyRate),
          bio: bio.trim(),
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setApplicationSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit application. Please verify details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Is there a fee to join LegalLink?',
      a: 'No. Joining LegalLink and listing your legal practice is 100% free. LegalLink only deducts a standard platform processing fee per completed, escrow-released consultation.'
    },
    {
      q: 'How does client verification work?',
      a: 'Clients authorize consultation retainers via Telebirr USSD escrow before any session begins. Funds remain locked in trust, guaranteeing full payment upon brief delivery.'
    },
    {
      q: 'Can I set my own hourly rate?',
      a: 'Yes. You retain full control over your consultation fees and retainer rates, and can update them anytime through your advocate dashboard.'
    },
    {
      q: 'How quickly will my application be reviewed?',
      a: 'Our compliance team verifies your Ministry of Justice bar license and credentials within 24 to 48 hours.'
    },
    {
      q: 'Can I accept consultations remotely?',
      a: 'Yes. You can consult Ethiopian clients and diaspora members worldwide via our secure video room, encrypted live chat, and voice notes.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans flex flex-col">
      
      {/* 1. HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-black text-xl tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">Ethiopia</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-[#0A1128]">Find a Lawyer</Link>
            <Link href="/for-lawyers" className="text-[#0A1128] font-bold">For Lawyers</Link>
            <Link href="/#legaltalk" className="hover:text-[#0A1128]">LegalTalk</Link>
            <Link href="/#lexdraft" className="hover:text-[#0A1128]">LexDraft</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/advocate"
              className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43] transition-colors shadow-sm"
            >
              Advocate Login ➔
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>For Legal Professionals</span>
              </span>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                Expand your practice.<br />
                <span className="text-amber-500">Serve more clients.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Join Ethiopia's first freelance legal marketplace. List your services, set your rates, and connect with individuals and businesses who need your expertise — in Addis Ababa and beyond.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href="#apply-form"
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>Apply Now — It's Free</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </a>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all text-xs text-center"
                >
                  See how it works
                </a>
              </div>

              <span className="text-[11px] text-slate-400 block pt-1">
                No subscription fees. LegalLink charges a small platform fee per completed consultation only.
              </span>
            </div>

            {/* 4 Value Proposition Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Briefcase className="w-6 h-6 text-amber-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Grow your practice</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access a steady stream of pre-vetted clients actively seeking legal help — no cold outreach required.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Set your own hours</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You control your availability calendar. Accept only the consultations that fit your schedule.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Verified & trusted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our verification process builds client confidence and elevates your professional standing.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Globe className="w-6 h-6 text-purple-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Serve the diaspora</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reach Ethiopian clients worldwide — diaspora clients often need local legal expertise remotely.
                </p>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="mt-16 p-8 bg-slate-50/70 border border-slate-200/80 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="text-3xl font-black text-[#0A1128] block">500+</span>
              <span className="text-xs text-slate-500 font-medium">Active lawyers</span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#0A1128] block">12,000+</span>
              <span className="text-xs text-slate-500 font-medium">Consultations completed</span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#0A1128] block font-mono">ETB 1,500</span>
              <span className="text-xs text-slate-500 font-medium">Average hourly rate</span>
            </div>
            <div>
              <span className="text-3xl font-black text-[#0A1128] block">&lt; 2 hrs</span>
              <span className="text-xs text-slate-500 font-medium">Average response time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">How it works</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              From application to your first paid consultation in as little as 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <span className="text-2xl font-black text-slate-300 font-mono block">01</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Apply & get verified</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit your bar license and ID. Our compliance team verifies your credentials within 48 hours.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <span className="text-2xl font-black text-slate-300 font-mono block">02</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Build your profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Set your specialties, rates, availability, and bio. Clients search, review credentials, and find you.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <span className="text-2xl font-black text-slate-300 font-mono block">03</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Receive consultations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get matched requests, accept them directly from your dashboard, and consult via the platform.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-3">
              <span className="text-2xl font-black text-slate-300 font-mono block">04</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Get paid reliably</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Payments are released securely after each completed consultation — no invoice chasing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LAWYERS ALREADY ON LEGALLINK (TESTIMONIALS) */}
      <section className="py-20 bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-black">Lawyers already on LegalLink</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "LegalLink doubled my client base within the first month. The platform handles all the admin so I can focus on practice."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Biruk Alemu</strong>
                  <span className="text-[10px] text-slate-400">Family Law, Addis Ababa</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I serve diaspora clients in the US and Europe through LegalLink. The bilingual support and escrow payment is seamless."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  H
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Hana Tadesse</strong>
                  <span className="text-[10px] text-slate-400">IP & Corporate, Remote</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Transparent pricing, verified clients, and reliable payments — exactly what the profession needed in Ethiopia."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  Y
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Yonas Bekele</strong>
                  <span className="text-[10px] text-slate-400">Criminal Defense, Hawassa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. APPLICATION FORM SECTION */}
      <section id="apply-form" className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-[#0A1128]">Apply to join LegalLink</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in your details below. All fields marked <span className="text-red-500">*</span> are required. Applications are reviewed within 48 hours.
            </p>
          </div>

          {applicationSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-emerald-900">Application Submitted!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you, Counsel. Our compliance desk is reviewing your bar license credentials. You will receive an SMS and email notification once approved.
              </p>
              <Link
                href="/advocate"
                className="inline-block px-6 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs mt-2"
              >
                Go to Advocate Portal
              </Link>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-8 shadow-sm text-xs">
              
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  Personal Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Advocate Mulu Haile"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bar license number *</label>
                    <input
                      type="text"
                      required
                      value={barLicense}
                      onChange={(e) => setBarLicense(e.target.value)}
                      placeholder="e.g. ETH-BAR-2019-00421"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone number *</label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+251 91 234 5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email address *</label>
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="counsel@lawfirm.et"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                  Professional Details
                </span>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Practice areas *</label>
                  <span className="text-slate-400 text-[11px] block mb-2">Select all that apply.</span>
                  <div className="flex flex-wrap gap-2">
                    {practiceAreaOptions.map((area) => {
                      const isSelected = selectedAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => togglePracticeArea(area)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A1128] text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Years of experience *</label>
                    <div className="flex flex-wrap gap-2">
                      {experienceOptions.map((exp) => (
                        <button
                          type="button"
                          key={exp}
                          onClick={() => setExperienceYears(exp)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                            experienceYears === exp
                              ? 'bg-[#0A1128] text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hourly rate (ETB) *</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Professional bio *</label>
                    <span className="text-[10px] text-slate-400 font-mono">{bio.length}/800</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={800}
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your legal background, notable cases, areas of expertise, and what clients can expect when working with you..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1128] leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Minimum 50 characters</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>

            </form>
          )}
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="text-3xl font-black text-[#0A1128] text-center">Frequently asked questions</h2>

          <div className="border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-200">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-xs font-bold text-[#0A1128] cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#0A1128] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-black text-white">Legal<span className="text-amber-400">Link</span></span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Ethiopia's first freelance legal services marketplace. Connecting clients with verified Ethiopian counsel for consultations, dispute resolution, and document automation.
            </p>
            <span className="text-slate-400 block pt-1">hello@legallink.et • +251 911 000 000</span>
          </div>

          <div>
            <strong className="text-white block uppercase tracking-wider text-[11px] mb-3">Platform</strong>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white">Find a Lawyer</Link></li>
              <li><Link href="/for-lawyers" className="hover:text-white">For Lawyers</Link></li>
              <li><Link href="/#legaltalk" className="hover:text-white">LegalTalk Blog</Link></li>
              <li><Link href="/#lexdraft" className="hover:text-white">LexDraft</Link></li>
            </ul>
          </div>

          <div>
            <strong className="text-white block uppercase tracking-wider text-[11px] mb-3">Company</strong>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/for-lawyers#faqs" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/advocate" className="hover:text-white">Advocate Portal</Link></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}