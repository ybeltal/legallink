'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, 
  Smartphone, Mail, MapPin, Award, Check, User, Briefcase, FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdvocateOnboardingPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [courtJurisdiction, setCourtJurisdiction] = useState('Federal High Court');
  const [experienceYears, setExperienceYears] = useState('6');
  const [officeAddress, setOfficeAddress] = useState('Addis Ababa');
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState<string[]>([
    'Corporate & Business Law',
    'Property & Real Estate'
  ]);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const availableAreas = [
    'Corporate & Business Law',
    'Family Law',
    'Property & Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Criminal Defense',
    'Immigration & Diaspora',
    'NGO & Compliance'
  ];

  const togglePracticeArea = (area: string) => {
    setSelectedPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !licenseNumber.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('advocate_applications').insert([
        {
          full_name: fullName.trim(),
          email: email.trim(),
          phone_number: phone.trim(),
          moj_license_number: licenseNumber.trim().toUpperCase(),
          court_jurisdiction: courtJurisdiction,
          experience_years: parseInt(experienceYears) || 5,
          practice_areas: selectedPracticeAreas.join(', '),
          office_address: officeAddress.trim(),
          bio: bio.trim(),
          status: 'pending',
        },
      ]);

      if (error) throw error;

      // Dispatch automated confirmation SMS
      fetch('/api/sms/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone.trim(),
          recipient_role: 'advocate',
          event_type: 'case_approved',
          message_body: `LegalLink: Application received for ${fullName.trim()}. MOJ License ${licenseNumber.trim().toUpperCase()} submitted for supervisory review.`,
        }),
      }).catch((err) => console.log('SMS notify error:', err));

      setSubmittedSuccess(true);
    } catch (err: any) {
      alert('Submission failed: ' + (err.message || 'Database error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <div>
              <span className="font-black text-lg text-white">Legal<span className="text-amber-400">Link</span></span>
              <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">Advocate Network</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/advocate" className="text-slate-400 hover:text-white transition-colors">
              Advocate Portal
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
            >
              Marketplace ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              MINISTRY OF JUSTICE ETHIOPIA • ADVOCATE ONBOARDING
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Join the LegalLink Counsel Network</h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Registered Ethiopian advocates receive guaranteed retainer escrows via Telebirr USSD, direct case matching, and video consultation rooms. All applicants undergo Ministry of Justice license credential verification.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-8 sm:p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-white">Application Successfully Submitted!</h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              Your Ministry of Justice credentials (<strong className="font-mono text-amber-400">{licenseNumber}</strong>) have been routed to the LegalLink regulatory review ledger. You will receive an Ethio Telecom SMS update upon license activation.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-w-md mx-auto text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Applicant:</span>
                <span className="text-white font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile Wallet:</span>
                <span className="text-emerald-400">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Review Status:</span>
                <span className="text-amber-400 font-bold uppercase">Pending MOJ Audit</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <Link
                href="/advocate"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer shadow"
              >
                Go to Advocate Workspace
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleApplicationSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-black text-base text-white">Practicing Advocate Credentials</h3>
              <p className="text-slate-400 text-xs">Provide your verified identity and license information.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Advocate Bethlehem Desta"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Telebirr Account Mobile Number *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09... or 07..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Official Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="counsel@lawfirm.et"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Ministry of Justice License Number *
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="MOJ/FED/2021/8492"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-xs font-black uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Court Practicing Level
                </label>
                <select
                  value={courtJurisdiction}
                  onChange={(e) => setCourtJurisdiction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="Federal Supreme Court">Federal Supreme Court</option>
                  <option value="Federal High Court">Federal High Court</option>
                  <option value="Federal First Instance Court">Federal First Instance Court</option>
                  <option value="Regional Supreme Court">Regional Supreme Court</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Years of Bar Practice
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Primary Office City
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="e.g. Bole, Addis Ababa"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Practice Areas Multiselect */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-2">
                Specialized Practice Areas (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableAreas.map((area) => {
                  const isChecked = selectedPracticeAreas.includes(area);
                  return (
                    <button
                      type="button"
                      key={area}
                      onClick={() => togglePracticeArea(area)}
                      className={`p-2.5 rounded-xl border text-left font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'border-amber-500/80 bg-amber-500/10 text-amber-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{area}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                Professional Bio & Legal Background
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your legal education, notable case representation, or statutory advisory experience in Ethiopia..."
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-[11px] leading-relaxed">
              ⚖️ <strong>Regulatory Notice:</strong> LegalLink verifies license authenticity against the Federal Democratic Republic of Ethiopia Ministry of Justice registry before granting case representation privileges.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Submitting Credentials to Review Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Submit Application for MOJ Verification</span>
                </>
              )}
            </button>
          </form>
        )}

      </main>

    </div>
  );
}