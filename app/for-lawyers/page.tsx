'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, ArrowRight, CheckCircle2, Star, Clock, DollarSign, 
  Users, Globe, ChevronDown, ChevronUp, Loader2, Sparkles, Check, 
  Briefcase, Scale, Upload, FileText, X, Calculator, Search, Smartphone,
  Gavel, Volume2, Award, Building, Landmark, Lock, HelpCircle, BookOpen,
  MapPin, ShieldAlert, Award as AwardIcon
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
    'Corporate & Business', 'Capital Markets & Securities', 'Family Law', 
    'Property & Real Estate', 'Intellectual Property', 'Employment Law', 
    'Criminal Defense', 'Immigration & Diaspora', 'NGO & Compliance', 
    'Tax Law', 'Constitutional Law', 'Banking & Finance'
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

      // Upload Bar License
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

      // Upload National ID
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
      q: 'Why is my dashboard locked after registration?',
      a: 'To safeguard advocate client privilege and prevent unlicensed legal practice under Ethiopian law, every applicant remains in a protected "Audit in Progress" state until our compliance desk audits their Federal/Regional Ministry of Justice credentials.'
    },
    {
      q: 'How does the Legal Bookstore showcase work?',
      a: 'If you have authored legal textbooks, statutory commentaries, or Cassation Bench analyses, you can list them directly in your portal. Clients and law students can purchase physical copies for pickup or delivery at centers around Arat Kilo, Mexico, or Lideta Courts.'
    },
    {
      q: 'How are pro bono hours verified and badged?',
      a: 'Every free community consultation or pro bono case brief you resolve through the portal logs directly into your Bar Service Audit trail, displaying an official Pro Bono Advocate badge on your public marketplace profile.'
    },
    {
      q: 'How does client verification work?',
      a: 'Clients pre-authorize consultation retainers via Telebirr USSD escrow before any session begins. Funds remain locked in regulatory trust, guaranteeing full payout upon brief delivery.'
    },
    {
      q: 'Can I set my own hourly rate?',
      a: 'Yes. You retain full autonomy over your consultation fees and retainer rates, and can adjust them anytime through your advocate workspace settings.'
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
              Advocate Portal ➔
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
                <span>For Legal Professionals in Ethiopia</span>
              </span>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                Expand your practice.<br />
                <span className="text-amber-500">Serve more clients.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Join Ethiopia's premier legal marketplace. List your practice, monetize published legal commentaries, set your consultation retainers, and connect with individuals, corporate enterprises, and the diaspora.
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
                  <span>Calculate Earnings</span>
                </a>
              </div>

              <span className="text-[11px] text-slate-400 block pt-1">
                No monthly subscriptions. LegalLink charges a 15% platform facilitation fee per completed escrow consultation only.
              </span>
            </div>

            {/* 4 Feature Highlights */}
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
                  Control your availability calendar and accept only the consultations that fit your court docket schedule.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Verified & trusted</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ministry of Justice license validation builds client confidence and elevates your professional standing.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                <Globe className="w-6 h-6 text-purple-500 mb-2" />
                <h3 className="font-bold text-sm text-[#0A1128]">Serve the diaspora</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reach Ethiopian diaspora worldwide seeking trusted counsel for local land, inheritance, and corporate matters.
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

      {/* 3. NEW SECTION: INSTITUTIONAL STANDARDS & ADVOCATE PRACTICE LEVERS (PART 2) */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              BUILT FOR ETHIOPIAN LEGAL PRACTICE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Institutional Standards & Growth Levers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Designed around the realities of Ethiopian litigation, judicial centers, and professional ethics rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Lever 1: Confidentiality & Restricted Dashboard Rationale */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Gated Liability Protection</h3>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Confidentiality Shield
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Allowing unverified practitioners access to client briefs creates severe confidentiality risks and disciplinary liability under Ethiopian law. Keeping applicants locked in <strong>"Audit in Progress"</strong> until admin license verification safeguards your reputation and ensures you practice alongside vetted peers only.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict Ministry of Justice verification</span>
              </div>
            </div>

            {/* Lever 2: The Legal Bookstore Showcase (Arat Kilo / Lideta / Mexico) */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-400/20 text-blue-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Advocate Legal Bookstore</h3>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  Author Acquisition Lever
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In Addis Ababa—especially around <strong>Arat Kilo, Mexico, and Lideta Courts</strong>—senior advocates frequently author textbooks, statutory commentaries, and Cassation Bench precedent analyses (<span className="font-bold text-white">የሰበር ውሳኔዎች ትንታኔ</span>). Showcase your publications with dedicated profile links and physical pickup centers across the city.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Monetize publications across legal hubs</span>
              </div>
            </div>

            {/* Lever 3: Pro Bono Hours Tracking & Bar Recognition */}
            <div className="p-8 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Pro Bono Hours Audit</h3>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Institutional Legitimacy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Federal Ministry of Justice and regional legal associations place immense value on community pro bono service. Our built-in hours logger provides a tamper-proof audit trail for annual bar association accreditation and awards you an official <strong>"Pro Bono Champion"</strong> badge on your marketplace profile.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700/60 flex items-center gap-2 text-[11px] text-slate-400">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compliant with Ethiopian Bar standards</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. EARNINGS CALCULATOR */}
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
                  <strong>Guaranteed Escrow Payout:</strong> Every consultation retainer is locked in Telebirr escrow before the session starts. Payments disburse directly to your Telebirr Business or Commercial Bank of Ethiopia (CBE) account upon brief completion.
                </p>
              </div>
            </div>

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

      {/* 5. APPLICATION FORM SECTION WITH STATUS CHECKER */}
      <section id="apply-form" className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div>
            <h2 className="text-3xl font-black text-[#0A1128]">Apply to join LegalLink</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fill in your practice details below. All fields marked <span className="text-red-500">*</span> are required. Applications are verified against Ministry of Justice records within 48 hours.
            </p>
          </div>

          {/* Status Checker */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Search className="w-4 h-4 text-amber-500" />
              <span>Already submitted an application? Check audit status</span>
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
                    {statusResult.status === 'approved' ? '✓ Verified & Active' : '⏳ Compliance Audit in Progress'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>License: <strong className="font-mono text-slate-700">{statusResult.bar_license_number}</strong></div>
                  <div>Submitted on: {new Date(statusResult.created_at).toLocaleDateString()}</div>
                  {statusResult.status === 'approved' ? (
                    <div className="text-emerald-700 font-bold pt-1">
                      Your bar credentials have been approved! You can access your <Link href="/advocate" className="underline font-black">Advocate Portal</Link> now.
                    </div>
                  ) : (
                    <div className="text-amber-800 pt-1">
                      Our compliance desk is currently validating your license copy against court registers. Turnaround is within 24 to 48 hours.
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
              <h3 className="font-black text-lg text-emerald-900">Application Received!</h3>
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

              {/* Verification Documents Upload */}
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
                  {/* Bar License */}
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
                          if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5 MB');
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
                        <button type="button" onClick={() => setBarLicenseFile(null)} className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800">
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
                        <span className="text-[11px] text-slate-400 mt-0.5 block">PDF or image of your Ethiopian bar license</span>
                      </div>
                    )}
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">National ID / Fayda *</label>
                    <input
                      type="file"
                      ref={nationalIdInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) return alert('File size exceeds 5 MB');
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
                        <button type="button" onClick={() => setNationalIdFile(null)} className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800">
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
                        <span className="text-[11px] text-slate-400 mt-0.5 block">Ethiopian national ID, Fayda, or passport</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Disclaimer & Submit */}
              <div className="pt-2 space-y-4">
                <p className="text-[11px] text-slate-400">
                  By submitting this application you agree to LegalLink's{' '}
                  <span className="text-slate-700 underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-slate-700 underline cursor-pointer">Privacy Policy</span>.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
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
              </div>

            </form>
          )}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
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