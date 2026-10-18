'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, 
  Smartphone, Mail, MapPin, Award, Check, User, Briefcase, FileText, X
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain hover:scale-105 transition-transform" />
            <div>
              <span className="font-black text-xl text-[#0A1128]">Legal<span className="text-amber-500">Link</span></span>
              <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">Advocate Network</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/advocate" className="text-slate-600 hover:text-[#0A1128] transition-colors">
              Advocate Portal
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#0A1128] border border-slate-200 rounded-xl transition-colors shadow-sm"
            >
              Marketplace ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              MINISTRY OF JUSTICE ETHIOPIA • ADVOCATE ONBOARDING
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Join the LegalLink Counsel Network</h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Registered Ethiopian advocates receive guaranteed retainer escrows via Telebirr USSD, direct case matching, and video consultation rooms. All applicants undergo Ministry of Justice license credential verification.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="p-8 sm:p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-[#0A1128]">Application Successfully Submitted!</h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your Ministry of Justice credentials (<strong className="font-mono text-amber-600">{licenseNumber}</strong>) have been routed to the LegalLink regulatory review ledger. You will receive an Ethio Telecom SMS update upon license activation.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="text-[#0A1128] font-bold">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Wallet:</span>
                <span className="text-emerald-600">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Review Status:</span>
                <span className="text-amber-700 font-bold uppercase">Pending MOJ Audit</span>
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
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleApplicationSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-xs">
            
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-black text-base text-[#0A1128]">Practicing Advocate Credentials</h3>
              <p className="text-slate-500 text-xs">Provide your verified identity and license information.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-amber-700 font-mono text-xs font-black uppercase focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Court Practicing Level
                </label>
                <select
                  value={courtJurisdiction}
                  onChange={(e) => setCourtJurisdiction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-[#0A1128]"
                >
                  <option value="Federal Supreme Court">Federal Supreme Court</option>
                  <option value="Federal High Court">Federal High Court</option>
                  <option value="Federal First Instance Court">Federal First Instance Court</option>
                  <option value="Regional Supreme Court">Regional Supreme Court</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Years of Bar Practice
                </label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Primary Office City
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="e.g. Bole, Addis Ababa"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
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
                          ? 'border-[#0A1128] bg-slate-100 text-[#0A1128]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate">{area}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#0A1128] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Professional Bio & Legal Background
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your legal education, notable case representation, or statutory advisory experience in Ethiopia..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-[#0A1128] leading-relaxed"
              />
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-[11px] leading-relaxed">
              ⚖️ <strong>Regulatory Notice:</strong> LegalLink verifies license authenticity against the Federal Democratic Republic of Ethiopia Ministry of Justice registry before granting case representation privileges.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Submitting Credentials to Review Ledger...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
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