'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Clock, DollarSign, 
  Users, Globe, ChevronDown, ChevronUp, Loader2, Sparkles, Check, 
  Briefcase, Scale, Upload, FileText, X, Calculator, Search, Smartphone,
  Gavel, Volume2, Award, Building, Landmark, Lock, HelpCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForLawyersPage() {
  // -------------------------------------------------------------
  // FEATURE 1: INTERACTIVE ADVOCATE EARNINGS CALCULATOR STATE
  // -------------------------------------------------------------
  const [weeklyHours, setWeeklyHours] = useState<number>(8);
  const [ratePerHour, setRatePerHour] = useState<number>(1500);

  const monthlyGross = weeklyHours * ratePerHour * 4;
  const platformFee = monthlyGross * 0.15;
  const monthlyNet = monthlyGross - platformFee;

  // -------------------------------------------------------------
  // FEATURE 5: INSTANT APPLICATION STATUS CHECKER STATE
  // -------------------------------------------------------------
  const [statusQuery, setStatusQuery] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<any | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusQuery.trim()) return;

    setIsCheckingStatus(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const supabase = createClient();
      const cleanQuery = statusQuery.trim();

      const { data, error } = await supabase
        .from('advocate_applications')
        .select('*')
        .or(`bar_license_number.ilike.%${cleanQuery}%,phone_number.ilike.%${cleanQuery}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setStatusError('No application found matching that phone number or bar license number.');
      } else {
        setStatusResult(data);
      }
    } catch (err: any) {
      setStatusError(err.message || 'Error checking verification status.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // -------------------------------------------------------------
  // APPLICATION FORM STATE
  // -------------------------------------------------------------
  const [fullName, setFullName] = useState('');
  const [barLicense, setBarLicense] = useState('');
  const [licenseJurisdiction, setLicenseJurisdiction] = useState('Federal First Instance Court');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('4–7 years');
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [bio, setBio] = useState('');

  // Verification Documents State
  const [barLicenseFile, setBarLicenseFile] = useState<File | null>(null);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);
  const barLicenseInputRef = useRef<HTMLInputElement>(null);
  const nationalIdInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const practiceAreaOptions = [
    'Corporate & Business', 'Family Law', 'Property & Real Estate', 
    'Intellectual Property', 'Employment Law', 'Criminal Defense', 
    'Immigration & Diaspora', 'NGO & Compliance', 'Tax Law', 
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

    if (!barLicenseFile) {
      setErrorMessage('Please upload a copy of your Ethiopian Bar License.');
      return;
    }

    if (!nationalIdFile) {
      setErrorMessage('Please upload a copy of your Ethiopian National ID or Passport.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // Upload Bar License Document
      const cleanBarName = barLicenseFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const barPath = `advocate-verification/${Date.now()}_bar_${cleanBarName}`;
      let barLicenseUrl = '';

      const { error: barUploadError } = await supabase.storage
        .from('case-documents')
        .upload(barPath, barLicenseFile, { cacheControl: '3600', upsert: true });

      if (!barUploadError) {
        const { data: barUrlData } = supabase.storage
          .from('case-documents')
          .getPublicUrl(barPath);
        barLicenseUrl = barUrlData.publicUrl;
      }

      // Upload National ID Document
      const cleanIdName = nationalIdFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const idPath = `advocate-verification/${Date.now()}_id_${cleanIdName}`;
      let nationalIdUrl = '';

      const { error: idUploadError } = await supabase.storage
        .from('case-documents')
        .upload(idPath, nationalIdFile, { cacheControl: '3600', upsert: true });

      if (!idUploadError) {
        const { data: idUrlData } = supabase.storage
          .from('case-documents')
          .getPublicUrl(idPath);
        nationalIdUrl = idUrlData.publicUrl;
      }

      // Insert Application Record
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
          bar_license_url: barLicenseUrl,
          national_id_url: nationalIdUrl,
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
                  href="#earnings-calc"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 transition-all text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Calculate Your Earnings</span>
                </a>
              </div>

              <span className="text-[11px] text-slate-400 block pt-1">
                No subscription fees. LegalLink charges a small platform fee per completed consultation only[cite: 10].
              </span>
            </div>

            {/* 4 Value Proposition Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Briefcase className="w-6 h-6 text-amber-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Grow your practice</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Access a steady stream of pre-vetted clients actively seeking legal help — no cold outreach required[cite: 10].
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Set your own hours</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You control your availability calendar. Accept only the consultations that fit your schedule[cite: 10].
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Verified & trusted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our verification process builds client confidence and elevates your professional standing[cite: 10].
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Globe className="w-6 h-6 text-purple-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Serve the diaspora</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reach Ethiopian clients worldwide — diaspora clients often need local legal expertise remotely[cite: 10].
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

      {/* 3. NEW FEATURE 1: INTERACTIVE ADVOCATE EARNINGS CALCULATOR (የገቢ ማስያ) */}
      <section id="earnings-calc" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              FINANCIAL TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
              Estimate Your Monthly Legal Earnings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              See what you could take home by offering scheduled consultations on LegalLink.
            </p>
          </div>

          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6 text-xs">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Consultation Hours Per Week
                  </label>
                  <span className="px-3 py-1 bg-[#0A1128] text-amber-400 font-mono font-bold rounded-lg text-xs">
                    {weeklyHours} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0A1128]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>2 hrs (Part-time)</span>
                  <span>15 hrs (Moderate)</span>
                  <span>30 hrs (Full-time)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Your Hourly Retainer Rate (ETB)
                  </label>
                  <span className="px-3 py-1 bg-white border border-slate-200 text-[#0A1128] font-mono font-bold rounded-lg text-xs">
                    ETB {ratePerHour.toLocaleString()} / hr
                  </span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={4000}
                  step={100}
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>ETB 800 (Standard)</span>
                  <span>ETB 2,000 (Senior)</span>
                  <span>ETB 4,000 (Executive)</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-emerald-900 leading-relaxed text-[11px]">
                  <strong>Guaranteed Payout Guarantee:</strong> Every consultation fee is pre-authorized and locked in Telebirr escrow before you start. Payments are released directly to your Telebirr Business or Commercial Bank of Ethiopia (CBE) account upon brief completion.
                </p>
              </div>
            </div>

            {/* Earnings Output Card */}
            <div className="lg:col-span-5 bg-[#0A1128] text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                  Projected Monthly Net Take-Home
                </span>
                
                <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400">
                  ETB {Math.round(monthlyNet).toLocaleString()}
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly Gross Invoiced:</span>
                    <strong className="font-mono text-white">ETB {monthlyGross.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Platform Admin Fee (15%):</span>
                    <span className="font-mono">- ETB {platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Estimated Annual Potential:</span>
                    <strong className="font-mono text-amber-400">ETB {Math.round(monthlyNet * 12).toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <a
                href="#apply-form"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs text-center transition-all shadow"
              >
                Apply to Start Earning ➔
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 4. NEW FEATURE 2: ADVOCATE WORKSPACE TOOLKIT PREVIEW */}
      <section className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              TECHNOLOGY INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
              Inside Your Advocate Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to practice modern digital law in Ethiopia — all included in your verified portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-[#0A1128]">Telebirr Escrow Guard</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Retainers are locked before consultations begin. No clients vanishing after receiving legal counsel; your fees are guaranteed.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-[#0A1128]">Hearing & Milestone Docket</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage court hearing dates (<span className="font-bold">ቀጣይ ቀጠሮ</span>) and update the 6 litigation stages. Clients receive automatic SMS reminders.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-[#0A1128]">Client Voice Brief Player</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Listen to clients' 60-second recorded audio briefs in Amharic or English directly in your dashboard before accepting consultations.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-[#0A1128]">LegalTalk Lead Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Publish verified answers to community legal inquiries. Each answer features a direct "Book Consultation" link to your profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW FEATURE 3: MOJ LICENSE TIER BADGING GUIDE */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              CREDENTIAL INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
              Accepted License Tiers & Court Badges
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              We respect your seniority. Your practicing license level is verified and badged prominently on your public profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                L1
              </div>
              <h3 className="font-bold text-sm text-[#0A1128]">Federal First Instance</h3>
              <span className="text-[10px] text-slate-400 block font-mono">የፌዴራል መጀመሪያ ደረጃ ፍርድ ቤት</span>
              <p className="text-slate-500 leading-relaxed">
                Qualified for commercial debt, preliminary labor arbitration, and civil tenancy filings.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-blue-200 bg-blue-50/30 space-y-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                L2
              </div>
              <h3 className="font-bold text-sm text-[#0A1128]">Federal High Court</h3>
              <span className="text-[10px] text-blue-600 block font-mono">የፌዴራል ከፍተኛ ፍርድ ቤት</span>
              <p className="text-slate-500 leading-relaxed">
                Full advocacy rights for large-scale corporate disputes, intellectual property, and appeals.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-amber-300 bg-amber-50/40 space-y-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                L3
              </div>
              <h3 className="font-bold text-sm text-[#0A1128]">Federal Supreme Court</h3>
              <span className="text-[10px] text-amber-700 block font-mono">የፌዴራል ጠቅላይ ፍርድ ቤት</span>
              <p className="text-slate-500 leading-relaxed">
                Cassation bench representation (<span className="font-bold">ሰበር ችሎት</span>), constitutional law, and high-stakes commercial litigation.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                REG
              </div>
              <h3 className="font-bold text-sm text-[#0A1128]">Regional Bar Licenses</h3>
              <span className="text-[10px] text-emerald-700 block font-mono">የክልል ጠቅላይ/ከፍተኛ ፍርድ ቤቶች</span>
              <p className="text-slate-500 leading-relaxed">
                Oromia, Amhara, Tigray, Sidama, and Dire Dawa regional court representation in local working languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128]">How it works</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              From application to your first paid consultation in as little as 48 hours[cite: 11].
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <span className="text-2xl font-black text-slate-300 font-mono block">01</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Apply & get verified</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Submit your bar license and ID. Our compliance team verifies your credentials within 48 hours[cite: 11].
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <span className="text-2xl font-black text-slate-300 font-mono block">02</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Build your profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Set your specialties, rates, availability, and bio. Clients search, review credentials, and find you[cite: 11].
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <span className="text-2xl font-black text-slate-300 font-mono block">03</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Receive consultations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Get matched requests, accept them directly from your dashboard, and consult via the platform[cite: 11].
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 space-y-3 shadow-xs">
              <span className="text-2xl font-black text-slate-300 font-mono block">04</span>
              <h3 className="font-bold text-sm text-[#0A1128]">Get paid reliably</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Payments are released securely after each completed consultation — no invoice chasing[cite: 11].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEW FEATURE 4: DIASPORA RETAINER GUARANTEE SPOTLIGHT */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-[#102A43] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                GLOBAL CLIENT PIPELINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black">
                Handle High-Value Diaspora Legal Matters
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Thousands of Ethiopians living in North America, Europe, and the Middle East need on-the-ground counsel in Addis Ababa and regional cities for land title verification (ካርታ), inheritance disputes, commercial property leases, and embassy-certified power of attorney (ውክልና).
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold pt-2">
                <span className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20">Title Verification (ካርታ)</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20">Inheritance Administration</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20">Foreign Investment Registration</span>
                <span className="px-3 py-1.5 bg-white/10 rounded-full border border-white/20">Power of Attorney Enforcement</span>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white/10 border border-white/20 p-6 rounded-3xl text-center space-y-2">
              <Globe className="w-10 h-10 text-amber-400 mx-auto mb-1" />
              <div className="text-3xl font-black font-mono text-emerald-400">USD & ETB</div>
              <span className="text-xs font-bold text-slate-200 block">Seamless Remote Retainers</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect via encrypted video and audio without managing cross-border wire delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LAWYERS ALREADY ON LEGALLINK (TESTIMONIALS) */}
      <section className="py-20 bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-black">Lawyers already on LegalLink</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "LegalLink doubled my client base within the first month. The platform handles all the admin so I can focus on practice."[cite: 11]
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  B
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Biruk Alemu</strong>
                  <span className="text-[10px] text-slate-400">Family Law, Addis Ababa[cite: 11]</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "I serve diaspora clients in the US and Europe through LegalLink. The bilingual support and escrow payment is seamless."[cite: 11]
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  H
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Hana Tadesse</strong>
                  <span className="text-[10px] text-slate-400">IP & Corporate, Remote[cite: 11]</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Transparent pricing, verified clients, and reliable payments — exactly what the profession needed in Ethiopia."[cite: 11]
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  Y
                </div>
                <div>
                  <strong className="text-xs text-white block">Adv. Yonas Bekele</strong>
                  <span className="text-[10px] text-slate-400">Criminal Defense, Hawassa[cite: 11]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. APPLICATION SECTION WITH NEW FEATURE 5: INSTANT APPLICATION STATUS CHECKER */}
      <section id="apply-form" className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#0A1128]">Apply to join LegalLink</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details below. All fields marked <span className="text-red-500">*</span> are required. Applications are reviewed within 48 hours.
              </p>
            </div>
          </div>

          {/* Instant Status Checker Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Search className="w-4 h-4 text-amber-500" />
              <span>Already submitted an application? Check review status</span>
            </div>

            <form onSubmit={handleCheckStatus} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your phone number or bar license number..."
                value={statusQuery}
                onChange={(e) => setStatusQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0A1128]"
              />
              <button
                type="submit"
                disabled={isCheckingStatus}
                className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isCheckingStatus ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : 'Check Status'}
              </button>
            </form>

            {statusError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {statusError}
              </div>
            )}

            {statusResult && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <strong className="text-[#0A1128]">{statusResult.full_name}</strong>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    statusResult.status === 'approved' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : statusResult.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {statusResult.status === 'approved' ? '✓ Verified & Approved' : '⏳ Review In Progress'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>License: <strong className="font-mono text-slate-700">{statusResult.bar_license_number}</strong></div>
                  <div>Submitted on: {new Date(statusResult.created_at).toLocaleDateString()}</div>
                  {statusResult.status === 'approved' ? (
                    <div className="text-emerald-700 font-bold pt-1">
                      Your bar credentials have been verified! You can log in to your <Link href="/advocate" className="underline font-black">Advocate Portal</Link> right now.
                    </div>
                  ) : (
                    <div className="text-amber-800 pt-1">
                      Our Ministry of Justice compliance desk is currently auditing your license copy. Turnaround is within 24 to 48 hours.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {applicationSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-emerald-900">Application Submitted!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you, Counsel. Our compliance desk is reviewing your bar license credentials and verification documents. You will receive an SMS and email notification once approved.
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

              {/* VERIFICATION DOCUMENTS (AS SHOWN IN PROTOTYPE) */}
              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
                    Verification Documents
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Accepted formats: PDF, JPG, PNG. Maximum file size: 5 MB per document. Documents are encrypted and stored securely.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Bar License Upload Box */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Bar license document *</label>
                    <input
                      type="file"
                      ref={barLicenseInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size exceeds 5 MB');
                            return;
                          }
                          setBarLicenseFile(file);
                        }
                      }}
                    />

                    {barLicenseFile ? (
                      <div className="p-5 border-2 border-emerald-300 bg-emerald-50/50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                          <div className="truncate">
                            <strong className="block text-xs text-emerald-900 truncate max-w-[180px]">{barLicenseFile.name}</strong>
                            <span className="text-[10px] text-emerald-600">{(barLicenseFile.size / 1024).toFixed(0)} KB • Ready to upload</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBarLicenseFile(null)}
                          className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => barLicenseInputRef.current?.click()}
                        className="p-6 border-2 border-dashed border-slate-200 hover:border-[#0A1128] rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-white"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-4 h-4" />
                        </div>
                        <strong className="block text-xs text-[#0A1128]">Click or drag to upload</strong>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          PDF or image of your Ethiopian bar license[cite: 14]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* National ID Upload Box */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">National ID *</label>
                    <input
                      type="file"
                      ref={nationalIdInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size exceeds 5 MB');
                            return;
                          }
                          setNationalIdFile(file);
                        }
                      }}
                    />

                    {nationalIdFile ? (
                      <div className="p-5 border-2 border-emerald-300 bg-emerald-50/50 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                          <div className="truncate">
                            <strong className="block text-xs text-emerald-900 truncate max-w-[180px]">{nationalIdFile.name}</strong>
                            <span className="text-[10px] text-emerald-600">{(nationalIdFile.size / 1024).toFixed(0)} KB • Ready to upload</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNationalIdFile(null)}
                          className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => nationalIdInputRef.current?.click()}
                        className="p-6 border-2 border-dashed border-slate-200 hover:border-[#0A1128] rounded-2xl text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-white"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-4 h-4" />
                        </div>
                        <strong className="block text-xs text-[#0A1128]">Click or drag to upload</strong>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Ethiopian national ID or passport[cite: 14]
                        </span>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Legal Disclaimer & Submit Button */}
              <div className="pt-2 space-y-4">
                <p className="text-[11px] text-slate-400">
                  By submitting this application you agree to LegalLink's{' '}
                  <span className="text-slate-700 underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-slate-700 underline cursor-pointer">Privacy Policy</span>[cite: 14].
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Uploading Documents & Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
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

      {/* 11. FOOTER */}
      <footer className="bg-[#0A1128] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-black text-white">Legal<span className="text-amber-400">Link</span></span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Ethiopia's first freelance legal services marketplace. Connecting clients with verified Ethiopian counsel for consultations, dispute resolution, and document automation[cite: 13].
            </p>
            <span className="text-slate-400 block pt-1">hello@legallink.et • +251 911 000 000[cite: 13]</span>
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