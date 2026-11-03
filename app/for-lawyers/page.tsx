'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, Clock, ShieldCheck, Globe, ArrowRight, Check, 
  UploadCloud, ChevronDown, CheckCircle2, AlertCircle, Sparkles, 
  Building2, User, FileText, Phone, Mail, MapPin, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function ForLawyersPage() {
  const { language, t } = useLanguage();

  // Dynamic Earnings Calculator State
  const [sessionsPerWeek, setSessionsPerWeek] = useState(5);
  const [ratePerHour, setRatePerHour] = useState(1500);

  const monthlyGross = sessionsPerWeek * ratePerHour * 4;
  const platformFee = monthlyGross * 0.15;
  const monthlyNet = monthlyGross - platformFee;

  // Application Form State
  const [fullName, setFullName] = useState('');
  const [barLicense, setBarLicense] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([
    'Corporate & Business'
  ]);
  const [experienceTier, setExperienceTier] = useState('4–7 years');
  const [hourlyRateInput, setHourlyRateInput] = useState('1500');
  const [bio, setBio] = useState('');

  // Uploaded Document States
  const [barFile, setBarFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);

  const barInputRef = useRef<HTMLInputElement | null>(null);
  const idInputRef = useRef<HTMLInputElement | null>(null);

  // Validation & Modal State
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  // FAQ Accordion State (stores index of open FAQ)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const practiceOptions = [
    'Corporate & Business',
    'Family Law',
    'Property & Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Criminal Defense',
    'Immigration',
    'NGO & Compliance',
    'Tax Law',
    'Constitutional Law',
    'Banking & Finance',
    'Environmental Law'
  ];

  const experienceOptions = [
    '1–3 years',
    '4–7 years',
    '8–12 years',
    '13–20 years',
    '20+ years'
  ];

  const faqItems = [
    {
      q: 'Is there a fee to join LegalLink?',
      a: 'No, joining LegalLink and setting up your verified profile is completely free. We do not charge subscription or listing fees. LegalLink deducts a standardized 15% platform facilitation and escrow custody fee per completed consultation only.'
    },
    {
      q: 'How does client verification work?',
      a: 'Clients must authenticate their account with a valid Ethiopian mobile phone number or passport verification. For paid consultations, client retainer fees are pre-authorized and held in Telebirr escrow before the meeting starts.'
    },
    {
      q: 'Can I set my own hourly rate?',
      a: 'Yes. You have complete autonomy over your consultation retainers. You can set and adjust your hourly consultation rate anytime based on your experience, judicial standing, and case complexity.'
    },
    {
      q: 'How quickly will my application be reviewed?',
      a: 'Our compliance team verifies all submitted Federal Ministry of Justice bar licenses and National IDs against official court registries within 24 to 48 business hours.'
    },
    {
      q: 'Can I accept consultations remotely?',
      a: 'Yes. You can conduct consultations via integrated end-to-end encrypted video, phone call, or schedule in-person meetings at your chamber office in Addis Ababa or regional capitals.'
    }
  ];

  const togglePractice = (practice: string) => {
    if (selectedPractices.includes(practice)) {
      if (selectedPractices.length === 1) return; // Keep at least one
      setSelectedPractices(selectedPractices.filter((p) => p !== practice));
    } else {
      setSelectedPractices([...selectedPractices, practice]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation Rules
    if (!fullName.trim() || !barLicense.trim() || !phoneNumber.trim() || !emailAddress.trim()) {
      setFormError('Please fill in all required personal information fields.');
      return;
    }

    if (selectedPractices.length === 0) {
      setFormError('Please select at least one practice area.');
      return;
    }

    if (bio.trim().length < 50) {
      setFormError('Professional bio must be at least 50 characters long.');
      return;
    }

    if (!barFile && !barLicense.startsWith('ETH-BAR')) {
      setFormError('Please upload a PDF or image copy of your Ethiopian Bar License.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTrackingId(`APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setIsSubmitted(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Global Unified Navigation */}
      <Navbar />

      {/* 02. Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>For Legal Professionals</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0A1128] tracking-tight leading-tight">
                Expand your practice.<br />
                <span className="text-amber-500">Serve more clients.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                Join Ethiopia's first freelance legal marketplace. List your services, set your rates, and connect with individuals and businesses who need your expertise — in Addis Ababa and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
                <a
                  href="#apply"
                  className="px-6 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group cursor-pointer"
                >
                  <span>Apply Now — It's Free</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  <span>See how it works</span>
                </a>
              </div>

              <span className="text-[11px] text-slate-400 block font-normal">
                No subscription fees. LegalLink charges a small platform fee per completed consultation only.
              </span>
            </div>

            {/* Right Column: 4 Value Cards Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="card-hover bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Grow your practice</strong>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Access a steady stream of pre-vetted clients actively seeking legal help — no cold outreach required.
                </p>
              </div>

              <div className="card-hover bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Set your own hours</strong>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  You control your availability calendar. Accept only the consultations that fit your schedule.
                </p>
              </div>

              <div className="card-hover bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Verified & trusted</strong>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Our verification process builds client confidence and elevates your professional standing.
                </p>
              </div>

              <div className="card-hover bg-[#F8FAFC] p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <strong className="text-sm font-bold text-[#0A1128] block">Serve the diaspora</strong>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Reach Ethiopian clients worldwide — diaspora clients often need local legal expertise remotely.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 03. Metrics Ribbon */}
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xs">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#0A1128] font-mono">500+</div>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Active lawyers</span>
            </div>
            <div className="border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-black text-[#0A1128] font-mono">12,000+</div>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Consultations completed</span>
            </div>
            <div className="border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-black text-[#0A1128] font-mono">ETB 1,500</div>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Average hourly rate</span>
            </div>
            <div className="border-l border-slate-200">
              <div className="text-2xl sm:text-3xl font-black text-[#0A1128] font-mono">&lt; 2 hrs</div>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Average response time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 04. How It Works: 4-Step Process */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#0A1128]">
              How it works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              From application to your first paid consultation in as little as 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="card-hover bg-white p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-slate-200 font-mono block">01</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Apply & get verified</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Submit your bar license and ID. Our team verifies credentials within 48 hours.
              </p>
            </div>

            <div className="card-hover bg-white p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-amber-300 font-mono block">02</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Build your profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Set your specialties, rates, availability, and bio. Clients search and find you.
              </p>
            </div>

            <div className="card-hover bg-white p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-blue-300 font-mono block">03</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Receive consultations</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Get matched requests, accept them from your dashboard, and consult via the platform.
              </p>
            </div>

            <div className="card-hover bg-white p-7 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
              <span className="text-3xl font-black text-emerald-300 font-mono block">04</span>
              <h3 className="text-sm font-bold text-[#0A1128]">Get paid reliably</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Payments are released securely after each completed consultation — no invoice chasing.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 05. Lawyers Already on LegalLink (Social Proof Strip) */}
      <section className="bg-[#0A1128] text-white py-16 md:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Lawyers already on LegalLink
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                "LegalLink doubled my client base within the first month. The platform handles all the admin so I can focus on practice."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Adv. Biruk Alemu</strong>
                  <span className="text-[10px] text-slate-400 block">Family Law, Addis Ababa</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                "I serve diaspora clients in the US and Europe through LegalLink. The bilingual support is seamless."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                  H
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Adv. Hana Tadesse</strong>
                  <span className="text-[10px] text-slate-400 block">IP & Corporate, Remote</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-7 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                "Transparent pricing, verified clients, and reliable payments — exactly what the profession needed in Ethiopia."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  Y
                </div>
                <div>
                  <strong className="text-xs font-bold text-white block">Adv. Yonas Bekele</strong>
                  <span className="text-[10px] text-slate-400 block">Criminal Defense, Hawassa</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 06. Dynamic Earnings Calculator */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block font-mono">
              TRANSPARENT REVENUE MODEL
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
              Estimate Your Consultation Earnings
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Simulate weekly case sessions and view your expected net take-home pay delivered via Telebirr Business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#F8FAFC] p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Sessions Per Week:</span>
                  <span className="text-amber-600 font-mono font-bold">{sessionsPerWeek} consultations</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                  className="w-full accent-[#0A1128] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Hourly Consultation Rate (ETB):</span>
                  <span className="text-amber-600 font-mono font-bold">ETB {ratePerHour.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="3500"
                  step="100"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(Number(e.target.value))}
                  className="w-full accent-[#0A1128] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 font-mono text-xs shadow-xs">
              <div className="flex justify-between text-slate-500">
                <span>Monthly Gross Consultations:</span>
                <span className="text-slate-800 font-bold">ETB {monthlyGross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Facilitation Fee (15%):</span>
                <span className="text-red-600">- ETB {platformFee.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-base text-[#0A1128]">
                <span>Estimated Net Monthly Income:</span>
                <span className="text-emerald-700">ETB {monthlyNet.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. Application Intake Form */}
      <section id="apply" className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              Apply to join LegalLink
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              Fill in your details below. All fields marked <span className="text-red-500 font-bold">*</span> are required. Applications are reviewed within 48 hours.
            </p>
          </div>

          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-8 text-xs">
            
            {/* GROUP 1: PERSONAL INFORMATION */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                PERSONAL INFORMATION
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Advocate Mulu Haile"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Bar license number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ETH-BAR-2015-00421"
                    value={barLicense}
                    onChange={(e) => setBarLicense(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 91 234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mulu.haile@lawfirm.et"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* GROUP 2: PROFESSIONAL DETAILS */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                PROFESSIONAL DETAILS
              </span>

              {/* Practice Areas */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  Practice areas <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 block -mt-1">
                  Select all that apply.
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {practiceOptions.map((practice) => {
                    const isSelected = selectedPractices.includes(practice);
                    return (
                      <button
                        key={practice}
                        type="button"
                        onClick={() => togglePractice(practice)}
                        className={`px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {practice}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years of Experience & Hourly Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800">
                    Years of experience <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {experienceOptions.map((tier) => {
                      const isSel = experienceTier === tier;
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setExperienceTier(tier)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            isSel
                              ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hourly rate (ETB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={100}
                    placeholder="ETB 1500"
                    value={hourlyRateInput}
                    onChange={(e) => setHourlyRateInput(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] font-mono transition-colors"
                  />
                </div>

              </div>

              {/* Professional Bio */}
              <div className="space-y-1.5 pt-2">
                <label className="block font-bold text-slate-800">
                  Professional bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={800}
                  required
                  placeholder="Describe your legal background, notable cases, areas of expertise, and what clients can expect when working with you..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0A1128] leading-relaxed transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Minimum 50 characters</span>
                  <span>{bio.length}/800</span>
                </div>
              </div>

            </div>

            {/* GROUP 3: VERIFICATION DOCUMENTS */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                VERIFICATION DOCUMENTS
              </span>
              <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                Accepted formats: PDF, JPG, PNG. Maximum file size: 5 MB per document. Documents are encrypted and stored securely.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* Bar License Upload Card */}
                <div>
                  <input
                    type="file"
                    ref={barInputRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBarFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div
                    onClick={() => barInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center space-y-2 cursor-pointer transition-all ${
                      barFile
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <UploadCloud className={`w-6 h-6 mx-auto ${barFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <strong className="font-bold text-xs block text-slate-800">
                        {barFile ? barFile.name : 'Click or drag to upload'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {barFile ? `${(barFile.size / 1024 / 1024).toFixed(2)} MB • Selected` : 'PDF or image of your Ethiopian bar license *'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* National ID Upload Card */}
                <div>
                  <input
                    type="file"
                    ref={idInputRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setIdFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div
                    onClick={() => idInputRef.current?.click()}
                    className={`p-6 rounded-2xl border-2 border-dashed text-center space-y-2 cursor-pointer transition-all ${
                      idFile
                        ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <UploadCloud className={`w-6 h-6 mx-auto ${idFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div>
                      <strong className="font-bold text-xs block text-slate-800">
                        {idFile ? idFile.name : 'Click or drag to upload'}
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {idFile ? `${(idFile.size / 1024 / 1024).toFixed(2)} MB • Selected` : 'Ethiopian national ID, Fayda, or passport *'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Terms Disclaimer & Submit Button */}
            <div className="pt-2 space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By submitting this application you agree to LegalLink's{' '}
                <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>{' '}
                and <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Application'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>

        </div>
      </section>

      {/* 08. Frequently Asked Questions (FAQ Accordion) */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left text-xs font-bold text-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#0A1128]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 09. Application Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5 animate-scaleUp text-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#0A1128]">
                Application Received!
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your Ethiopian Bar License credentials have been submitted for Ministry of Justice verification.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Application Tracking ID</span>
              <strong className="text-base font-black text-[#0A1128] block">{trackingId}</strong>
              <span className="text-[10px] text-emerald-700 font-bold block">Status: MOJ Registry Audit Pending (Within 48h)</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/advocate"
                className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-center hover:bg-[#102A43] transition-all"
              >
                Preview Advocate Portal
              </Link>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-center hover:bg-slate-200 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Col 1 & 2 */}
            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
                <span className="font-black text-base text-white">
                  Legal<span className="text-amber-500">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
                Ethiopia's first freelance legal services marketplace.
              </p>
              
              <div className="space-y-1.5 text-slate-300 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>hello@legallink.et</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>+251 911 000 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bole Road, Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>

            {/* Col 3: Platform */}
            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                PLATFORM
              </strong>
              <ul className="space-y-2">
                <li><Link href="/find-a-lawyer" className="hover:text-white">Find a Lawyer</Link></li>
                <li><Link href="/for-lawyers" className="hover:text-white text-amber-400 font-bold">For Lawyers</Link></li>
                <li><Link href="/legaltalk" className="hover:text-white">LegalTalk</Link></li>
                <li><Link href="/#lexdraft" className="hover:text-white">LexDraft</Link></li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                RESOURCES
              </strong>
              <ul className="space-y-2">
                <li><Link href="/legaltalk" className="hover:text-white">LegalTalk Blog</Link></li>
                <li><Link href="/tools" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/escrow" className="hover:text-white">Support</Link></li>
              </ul>
            </div>

            {/* Col 5: Company & Legal */}
            <div className="space-y-3">
              <strong className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                COMPANY
              </strong>
              <ul className="space-y-2">
                <li><Link href="/#about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Direct representation provided exclusively by licensed Ethiopian advocates.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}