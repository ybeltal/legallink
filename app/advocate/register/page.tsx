'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Scale,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Upload,
  FileText,
  UserCheck,
  Loader2,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

const PRACTICE_AREA_OPTIONS = [
  'Corporate & Commercial Law',
  'Property & Real Estate Law',
  'Family & Inheritance Law',
  'Employment & Labour Law',
  'Criminal Defense & Litigation',
  'Immigration & Diaspora Law',
  'Intellectual Property & Tech',
  'Tax, Customs & Investment',
  'NGO, CSO & Compliance',
  'Banking, Finance & Insurance',
];

const LANGUAGE_OPTIONS = [
  'Amharic',
  'English',
  'Afaan Oromo',
  'Tigrigna',
  'Somali',
  'French',
  'Arabic',
];

export default function AdvocateRegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  // Section 1: Identity & Bar Licensing
  const [fullName, setFullName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licensingAuthority, setLicensingAuthority] = useState(
    'Federal Ministry of Justice (MOJ)'
  );
  const [courtStanding, setCourtStanding] = useState('Federal High Court');
  const [yearAdmitted, setYearAdmitted] = useState<number>(2019);
  const [location, setLocation] = useState('Addis Ababa');
  const [chamberAddress, setChamberAddress] = useState('');

  // Section 2: Education & Credentials
  const [lawSchool, setLawSchool] = useState('');
  const [degrees, setDegrees] = useState('LL.B.');
  const [graduationYear, setGraduationYear] = useState<number>(2017);
  const [linkedinUrl, setLinkedinUrl] = useState('');

  // Section 3: Full Professional CV Profile
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([
    'Corporate & Commercial Law',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'Amharic',
    'English',
  ]);
  const [bio, setBio] = useState('');
  const [careerHistory, setCareerHistory] = useState('');
  const [notableMatters, setNotableMatters] = useState('');
  const [offersPupillage, setOffersPupillage] = useState(true);

  // Section 4: Optional CV Document Upload (PDF / DOC / DOCX)
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        if (meta.full_name) setFullName((prev) => prev || meta.full_name);
        if (data.user.email) setEmail((prev) => prev || data.user.email || '');
        if (meta.phone) setPhone((prev) => prev || meta.phone);
        if (meta.bar_license_no) setLicenseNumber((prev) => prev || meta.bar_license_no);
      }
    });
  }, []);

  const togglePracticeArea = (area: string) => {
    setSelectedPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((item) => item !== lang) : [...prev, lang]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      setErrorMsg('CV file must be 5 MB or smaller (PDF, DOC, or DOCX).');
      return;
    }

    setErrorMsg(null);
    setCvFile(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (selectedPracticeAreas.length === 0) {
      setErrorMsg('Please select at least one practice area.');
      return;
    }
    if (selectedLanguages.length === 0) {
      setErrorMsg('Please select at least one language you consult in.');
      return;
    }
    if (bio.trim().length < 40) {
      setErrorMsg(
        'Please write a detailed Professional Summary / Bio (at least 40 characters) so clients and our verification team can evaluate your practice.'
      );
      return;
    }
    if (careerHistory.trim().length < 20) {
      setErrorMsg(
        'Please include your Work & Chamber Experience History (law firms, legal departments, judicial or advocacy roles).'
      );
      return;
    }

    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedLicense = licenseNumber.trim().toUpperCase();
      const advId = normalizedLicense.startsWith('ETH-BAR')
        ? normalizedLicense
        : `ETH-BAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Optional CV document upload to Supabase Storage bucket `advocate-cvs`
      let uploadedPath: string | null = null;
      let uploadedFileName: string | null = null;

      if (cvFile) {
        const ext = cvFile.name.split('.').pop()?.toLowerCase() || 'pdf';
        const safeId = advId.replace(/[^A-Za-z0-9-_]/g, '_');
        const storagePath = `cvs/${safeId}-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from('advocate-cvs')
          .upload(storagePath, cvFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadErr) {
          throw new Error(
            `CV file upload failed: ${uploadErr.message}. You can retry or submit without attaching a file.`
          );
        }

        uploadedPath = storagePath;
        uploadedFileName = cvFile.name;
      }

      const primarySpecialization = selectedPracticeAreas[0];

      const { error } = await supabase.from('lawyer_profiles').insert({
        id: advId,
        name: fullName.trim(),
        amharic_name: amharicName.trim() || fullName.trim(),
        title: `${primarySpecialization} • ${courtStanding}`,
        email: normalizedEmail,
        phone: phone.trim(),
        license_number: normalizedLicense,
        licensing_authority: licensingAuthority,
        court_jurisdiction: courtStanding,
        year_admitted: Number(yearAdmitted) || null,
        hourly_rate_etb: 0,
        location: location.trim(),
        chamber_address: chamberAddress.trim() || null,
        law_school: lawSchool.trim(),
        degrees: degrees.trim(),
        graduation_year: Number(graduationYear) || null,
        experience_years: Number(experienceYears) || 1,
        practice_areas: selectedPracticeAreas,
        languages_spoken: selectedLanguages,
        bio: bio.trim(),
        career_history: careerHistory.trim(),
        notable_matters: notableMatters.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        cv_file_url: uploadedPath,
        cv_file_name: uploadedFileName,
        is_verified: false,
        vetting_status: 'pending',
        offers_pupillage: offersPupillage,
        rating: 5.0,
        reviews_count: 0,
      });

      if (error) {
        if (
          error.message.includes('unique constraint') ||
          error.message.includes('duplicate key')
        ) {
          throw new Error(
            'An advocate profile with this Email or Bar License number already exists. Sign in to access your portal.'
          );
        }
        throw error;
      }

      // Send welcome email, Telegram alert, and track user record (non-blocking)
      fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          fullName: fullName.trim(),
          role: 'advocate',
        }),
      }).catch(() => {});

      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'advocate_registered',
          data: {
            name: fullName.trim(),
            license_number: normalizedLicense,
            court_jurisdiction: courtStanding,
            location: location.trim(),
          },
        }),
      }).catch(() => {});

      fetch('/api/track-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          fullName: fullName.trim(),
          role: 'advocate',
          phone: phone.trim(),
          location: location.trim(),
          legalNeed: `${primarySpecialization} (${normalizedLicense})`,
          provider: 'advocate_cv',
          eventType: 'signup',
        }),
      }).catch(() => {});

      try {
        sessionStorage.setItem('ll_active_advocate_id', advId);
      } catch {
        // Ignore storage errors
      }
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit advocate CV profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-10 shadow-xs space-y-8">
          <div className="text-center space-y-2 border-b border-slate-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
              Proclamation No. 1249/2021 • Full Advocate CV Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
              Advocate Chamber &amp; CV Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Complete your full professional credentials, education, and advocacy background. Your profile is reviewed in our Oversight Console for MOJ verification and powers your public directory listing.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h2 className="text-lg font-black text-emerald-950">
                  Advocate CV &amp; Chamber Profile Submitted!
                </h2>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Your full CV and license details have been securely saved to LegalLink’s verification queue. Our oversight team will review your credentials and activate your <strong>MOJ Verified</strong> badge.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/advocate/portal')}
                  className="px-7 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Open My Advocate Portal →
                </button>
                <Link
                  href="/"
                  className="px-7 py-3 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-8 text-xs">
              {/* SECTION 1: IDENTITY & BAR LICENSING */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
                    1. Identity &amp; Bar Licensing
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Full Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Adv. Abebe Bikila"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Full Name (Amharic)
                    </label>
                    <input
                      type="text"
                      placeholder="ጠበቃ አበበ ቢቂላ"
                      value={amharicName}
                      onChange={(e) => setAmharicName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Official Chamber Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="advocate@chambers.et"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Direct Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 911 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Bar License Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="FDRE-ADV-1840/2018"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Licensing Authority *
                    </label>
                    <select
                      value={licensingAuthority}
                      onChange={(e) => setLicensingAuthority(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    >
                      <option value="Federal Ministry of Justice (MOJ)">
                        Federal Ministry of Justice (MOJ)
                      </option>
                      <option value="Addis Ababa Justice Bureau">Addis Ababa Justice Bureau</option>
                      <option value="Oromia Justice Bureau">Oromia Justice Bureau</option>
                      <option value="Amhara Justice Bureau">Amhara Justice Bureau</option>
                      <option value="Sidama / Regional Justice Bureau">
                        Sidama / Regional Justice Bureau
                      </option>
                      <option value="Tigray Justice Bureau">Tigray Justice Bureau</option>
                      <option value="Dire Dawa Justice Bureau">Dire Dawa Justice Bureau</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Year Admitted to Bar *
                    </label>
                    <input
                      type="number"
                      min={1970}
                      max={2026}
                      required
                      value={yearAdmitted}
                      onChange={(e) => setYearAdmitted(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Court Admission Level *
                    </label>
                    <select
                      value={courtStanding}
                      onChange={(e) => setCourtStanding(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    >
                      <option value="Federal Supreme Court & Cassation">
                        Federal Supreme Court &amp; Cassation
                      </option>
                      <option value="Federal High Court">Federal High Court</option>
                      <option value="Federal First Instance">Federal First Instance</option>
                      <option value="Regional Supreme / High Court">
                        Regional Supreme / High Court
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">City / Region *</label>
                    <input
                      type="text"
                      required
                      placeholder="Addis Ababa, Hawassa, Bahir Dar..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Physical Chamber Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bole Medhanialem, Building / Floor"
                      value={chamberAddress}
                      onChange={(e) => setChamberAddress(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: EDUCATION & ACADEMIC CREDENTIALS */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
                    2. Education &amp; Legal Credentials
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      Law School / University *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Addis Ababa University School of Law"
                      value={lawSchool}
                      onChange={(e) => setLawSchool(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      min={1970}
                      max={2026}
                      required
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Degrees &amp; Certifications *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LL.B., LL.M. in Business & Commercial Law"
                      value={degrees}
                      onChange={(e) => setDegrees(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      LinkedIn Profile or Firm Website (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 3: EXPERIENCE, PRACTICE AREAS & DETAILED CV PROFILE */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
                    3. Professional Experience &amp; Practice Profile
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Years of Legal Experience *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      required
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1.5">
                      Languages Spoken in Consultations * (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map((lang) => {
                        const active = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? 'bg-[#0A1128] text-white border-[#0A1128]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {active ? '✓ ' : ''}
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Practice Areas * (Select all areas you handle — first selected is primary)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRACTICE_AREA_OPTIONS.map((area) => {
                      const active = selectedPracticeAreas.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => togglePracticeArea(area)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            active
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {active ? '✓ ' : ''}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">
                      Professional Summary / Detailed Bio *
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {bio.length}/1200 (min 40 chars)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={1200}
                    required
                    placeholder="Describe your legal background, core strengths, advisory style, and the types of clients (individuals, SMEs, NGOs, diaspora) you regularly represent..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0A1128] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Work &amp; Chamber Experience History *
                  </label>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    required
                    placeholder="List your roles chronologically, e.g.:&#10;• Managing Advocate, Bekele & Associates Law Office (2020–Present)&#10;• Senior Legal Counsel, Commercial Bank of Ethiopia (2017–2020)&#10;• Public Prosecutor / Legal Researcher (2015–2017)"
                    value={careerHistory}
                    onChange={(e) => setCareerHistory(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0A1128] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Notable Case Highlights, Publications, or Bar Committees (Optional)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={1500}
                    placeholder="Share anonymized representative cases, Cassation appeals, corporate transactions, or legal publications..."
                    value={notableMatters}
                    onChange={(e) => setNotableMatters(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0A1128] leading-relaxed"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4">
                  <div>
                    <strong className="text-[#0A1128] block">NextGen Pupillage Mentorship</strong>
                    <span className="text-amber-900 text-[11px]">
                      Opt in to review law graduate intern applications under Proclamation No. 1249/2021.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={offersPupillage}
                    onChange={(e) => setOffersPupillage(e.target.checked)}
                    className="w-4 h-4 accent-[#0A1128] cursor-pointer shrink-0"
                  />
                </div>
              </section>

              {/* SECTION 4: FULL CV FILE UPLOAD */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <h2 className="text-sm font-black text-[#0A1128] uppercase tracking-wider">
                    4. Attach Full CV Document (Optional — PDF, DOC, DOCX)
                  </h2>
                </div>

                <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                  {cvFile ? (
                    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2.5 text-left min-w-0">
                        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <strong className="text-[#0A1128] block truncate">{cvFile.name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(cvFile.size / 1024).toFixed(0)} KB ready to upload
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCvFile(null)}
                        className="p-1.5 text-slate-500 hover:text-red-600 cursor-pointer"
                        aria-label="Remove CV file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-600">
                        Upload your complete CV or Bar Credential Dossier (max 5 MB, private to LegalLink verification staff).
                      </p>
                      <label className="inline-block px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-[#0A1128] cursor-pointer">
                        <span>Choose PDF / Word File</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
              </section>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#0A1128] hover:bg-[#102A43] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 text-xs sm:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Submitting Advocate CV &amp; Chamber Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Complete Advocate CV &amp; Register (Free)</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    href="/login?role=advocate"
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Already registered? Sign In to Advocate Portal →
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}