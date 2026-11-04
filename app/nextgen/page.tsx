'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Search, Building2, 
  MapPin, Clock, CheckCircle2, ArrowRight, 
  Plus, X, Send, Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SEED_OPPORTUNITIES, OpportunityItem } from '@/lib/nextgen-data';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function NextGenHubPage() {
  const { language } = useLanguage();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);

  // Application form fields
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantUniversity, setApplicantUniversity] = useState('');
  const [applicantYear, setApplicantYear] = useState('4th Year LL.B');
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Post opening form fields
  const [postTitle, setPostTitle] = useState('');
  const [postOrg, setPostOrg] = useState('');
  const [postTrack, setPostTrack] = useState<'Internship' | 'Pupillage' | 'Junior Counsel' | 'Research & Moot'>('Internship');
  const [postLocation, setPostLocation] = useState('Bole, Addis Ababa');
  const [postStipend, setPostStipend] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [opportunitiesList, setOpportunitiesList] = useState<OpportunityItem[]>(SEED_OPPORTUNITIES);

  // Load opportunities from Supabase and merge with seed catalog
  useEffect(() => {
    async function loadOpportunities() {
      try {
        const { data, error } = await supabase
          .from('job_opportunities')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formattedDbItems: OpportunityItem[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            amharicTitle: d.amharic_title || d.title,
            organization: d.organization,
            orgType: (d.org_type as any) || 'Law Firm',
            location: d.location || 'Addis Ababa',
            track: d.track,
            amharicTrack: d.track === 'Pupillage' ? 'የጥብቅና ረዳትነት' : 'የህግ ልምምድ',
            eligibility: d.eligibility || 'LL.B Students & Graduates',
            stipendETB: d.stipend_etb || 'Negotiable',
            workType: (d.work_type as any) || 'Full-time',
            deadline: d.deadline || 'Rolling Basis',
            postedDate: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            summary: d.summary,
            requirements: d.requirements || [],
            badge: (d.badge as any) || 'Featured'
          }));

          setOpportunitiesList([...formattedDbItems, ...SEED_OPPORTUNITIES]);
        }
      } catch {
        // Fallback to seed catalog if database offline
      }
    }
    loadOpportunities();
  }, [supabase]);

  const tracks = [
    'All',
    'Internship',
    'Pupillage',
    'Junior Counsel',
    'Research & Moot'
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunitiesList.filter((opp) => {
      const matchesTrack = selectedTrack === 'All' || opp.track === selectedTrack;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTrack;

      const matchesSearch = 
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q) ||
        opp.summary.toLowerCase().includes(q) ||
        opp.eligibility.toLowerCase().includes(q);

      return matchesTrack && matchesSearch;
    });
  }, [opportunitiesList, searchQuery, selectedTrack]);

  // LIVE Supabase Insert + Instant Telegram Alert: Student Application
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);
    setApplying(true);

    try {
      const oppTitle = selectedOpportunity?.title || 'General Legal Internship';
      const oppId = selectedOpportunity?.id || 'general';

      const { error } = await supabase
        .from('student_applications')
        .insert({
          opportunity_id: oppId,
          opportunity_title: oppTitle,
          applicant_name: applicantName.trim(),
          applicant_email: applicantEmail.trim(),
          applicant_phone: applicantPhone.trim(),
          university: applicantUniversity.trim(),
          current_year: applicantYear,
          cover_note: coverNote.trim() || null,
          status: 'pending'
        });

      if (error) throw error;

      // Dispatches Telegram alert asynchronously without blocking UI
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'student_application',
          data: {
            applicant_name: applicantName.trim(),
            applicant_email: applicantEmail.trim(),
            applicant_phone: applicantPhone.trim(),
            university: applicantUniversity.trim(),
            current_year: applicantYear,
            opportunity_title: oppTitle,
            cover_note: coverNote.trim()
          }
        })
      }).catch((tgErr) => console.warn('Telegram notification error:', tgErr));

      setApplying(false);
      setAppliedSuccess(true);
      setTimeout(() => {
        setAppliedSuccess(false);
        setApplyModalOpen(false);
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
        setApplicantUniversity('');
        setCoverNote('');
      }, 1500);

    } catch (err: any) {
      setApplying(false);
      setApplyError(err?.message || 'Failed to submit application. Please check connection.');
    }
  };

  // LIVE Supabase Insert + Instant Telegram Alert: New Opportunity
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);
    setPosting(true);

    try {
      const { data, error } = await supabase
        .from('job_opportunities')
        .insert({
          title: postTitle.trim(),
          amharic_title: postTitle.trim(),
          organization: postOrg.trim(),
          org_type: 'Law Firm',
          location: postLocation.trim(),
          track: postTrack,
          eligibility: 'LL.B Students & Fresh Graduates',
          stipend_etb: postStipend.trim() ? `ETB ${postStipend} / month` : 'Stipend Negotiable',
          work_type: 'Full-time',
          deadline: 'Rolling Basis',
          summary: postSummary.trim(),
          requirements: ['Academic standing in LL.B', 'Dedication to professional legal ethics'],
          badge: 'Featured',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Dispatches Telegram alert for newly posted chamber opportunity
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'opportunity_posted',
          data: {
            title: postTitle.trim(),
            organization: postOrg.trim(),
            track: postTrack,
            location: postLocation.trim(),
            stipend: postStipend.trim() ? `ETB ${postStipend} / month` : 'Stipend Negotiable'
          }
        })
      }).catch((tgErr) => console.warn('Telegram notification error:', tgErr));

      if (data) {
        const newlyAddedItem: OpportunityItem = {
          id: data.id,
          title: data.title,
          amharicTitle: data.amharic_title,
          organization: data.organization,
          orgType: 'Law Firm',
          location: data.location,
          track: data.track,
          amharicTrack: data.track === 'Pupillage' ? 'የጥብቅና ረዳትነት' : 'የህግ ልምምድ',
          eligibility: data.eligibility,
          stipendETB: data.stipend_etb,
          workType: 'Full-time',
          deadline: data.deadline,
          postedDate: 'Today',
          summary: data.summary,
          requirements: data.requirements,
          badge: 'Featured'
        };
        setOpportunitiesList((prev) => [newlyAddedItem, ...prev]);
      }

      setPosting(false);
      setPostSuccess(true);
      setTimeout(() => {
        setPostSuccess(false);
        setPostModalOpen(false);
        setPostTitle('');
        setPostOrg('');
        setPostSummary('');
        setPostStipend('');
      }, 1200);

    } catch (err: any) {
      setPosting(false);
      setPostError(err?.message || 'Failed to publish opportunity. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Global Unified Navigation */}
      <Navbar />

      {/* 02. Header Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold w-fit">
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>NextGen Advocate Accelerator & Legal Careers</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setPostError(null);
                setPostModalOpen(true);
              }}
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer w-fit"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Post an Opportunity (Free)</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' 
              ? 'የነገው የህግ ባለሙያዎች ማዕከል (NextGen Hub)' 
              : 'NextGen / Student Hub'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
            {language === 'am'
              ? 'ለኢትዮጵያ የህግ ተማሪዎችና ተመራቂዎች የተዘጋጀ የሥራ ልምምድ፣ የጥብቅና ረዳትነት (በአዋጅ 1249/2013) እና የጀማሪ ህግ ባለሙያ የሥራ ዕድሎች መድረክ።'
              : 'The launchpad for Ethiopia’s law students and fresh graduates. Connect with top law chambers, corporate legal departments, and banks for verified internships, statutory pupillage under Proclamation No. 1249/2021, and clerkships.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Statutory Pupillage (Proc. 1249/2021)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Paid Corporate Internships</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Mentorship from Senior Advocates</span>
            </div>
          </div>

        </div>
      </section>

      {/* 03. Search & Track Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by role, firm, city, or practice area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128] transition-colors shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono w-full md:w-auto text-right">
            Showing <strong className="text-[#0A1128]">{filteredOpportunities.length}</strong> verified opportunities
          </div>
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {tracks.map((trk) => {
            const isSelected = selectedTrack === trk;
            const count = trk === 'All'
              ? opportunitiesList.length
              : opportunitiesList.filter((o) => o.track === trk).length;

            return (
              <button
                key={trk}
                type="button"
                onClick={() => setSelectedTrack(trk)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{trk}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 04. Opportunities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="card-hover bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-5 shadow-xs relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {opp.track}
                  </span>

                  {opp.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      opp.badge === 'Mentorship Included'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : opp.badge === 'Urgent'
                        ? 'bg-red-100 text-red-900 border border-red-200'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}>
                      {opp.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0A1128] leading-snug">
                    {opp.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{opp.organization}</span>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{opp.workType}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                  {opp.summary}
                </p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Stipend:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{opp.stipendETB || 'Negotiable'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Eligibility:</span>
                    <strong className="text-slate-700 font-medium truncate max-w-[150px]">{opp.eligibility}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setApplyError(null);
                    setSelectedOpportunity(opp);
                    setApplyModalOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Quick Apply</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOpportunity(opp)}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* 05. Practical Skills Section */}
        <section className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              PRACTICE-READY SKILLS
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Sharpen your legal drafting and research before you enter court.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Law students can explore all 122 full Ethiopian proclamations in the Legal Library and experiment with real commercial contracts on LexDraft for practical clinic coursework.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/library"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md group"
            >
              <span>Explore Legal Library</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/find-a-lawyer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center transition-all"
            >
              <span>Find Senior Mentors</span>
            </Link>
          </div>
        </section>

      </main>

      {/* 06. LIVE Application Modal */}
      {applyModalOpen && selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-xs relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-600 font-mono uppercase">
                {selectedOpportunity.track} APPLICATION
              </span>
              <h3 className="text-lg font-black text-[#0A1128]">
                {selectedOpportunity.title}
              </h3>
              <p className="text-slate-500 font-medium">
                {selectedOpportunity.organization} • {selectedOpportunity.location}
              </p>
            </div>

            {applyError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            {appliedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Application submitted to LegalLink database! The hiring team has been notified.</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Balcha"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Phone / Telegram *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0911 000 000"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Law School / University *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Addis Ababa University (AAU)"
                    value={applicantUniversity}
                    onChange={(e) => setApplicantUniversity(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Current Standing *
                  </label>
                  <select
                    value={applicantYear}
                    onChange={(e) => setApplicantYear(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="3rd Year LL.B">3rd Year LL.B</option>
                    <option value="4th Year LL.B">4th Year LL.B</option>
                    <option value="5th Year LL.B">5th Year LL.B</option>
                    <option value="Fresh LL.B Graduate (2025/2026)">Fresh LL.B Graduate</option>
                    <option value="LL.M Candidate">LL.M Candidate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Why are you interested in this position?
                </label>
                <textarea
                  rows={3}
                  placeholder="Highlight your academic focus, moot court experience, or legal research background..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 07. LIVE Post Opportunity Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-xs relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPostModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0A1128]">
                Post a Student / Pupillage Opportunity
              </h3>
              <p className="text-slate-500">
                Connect directly with top Ethiopian law students and apprentice advocates.
              </p>
            </div>

            {postError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{postError}</span>
              </div>
            )}

            {postSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Opportunity saved permanently to Supabase and published live!</span>
              </div>
            )}

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pupillage Advocate Apprentice / Summer Legal Intern"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Law Office / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mesfin & Associates Law Office"
                    value={postOrg}
                    onChange={(e) => setPostOrg(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Track *
                  </label>
                  <select
                    value={postTrack}
                    onChange={(e) => setPostTrack(e.target.value as any)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Pupillage">Pupillage (Proc. 1249/2021)</option>
                    <option value="Junior Counsel">Junior Counsel</option>
                    <option value="Research & Moot">Research & Moot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bole, Addis Ababa"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Monthly Stipend (ETB)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7,500"
                    value={postStipend}
                    onChange={(e) => setPostStipend(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Summary & Responsibilities
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief description of duties, mentorship provided, and eligibility criteria..."
                  value={postSummary}
                  onChange={(e) => setPostSummary(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={posting}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {posting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Publish Opportunity</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 08. Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Advocate Apprenticeship Framework governed under Federal Proclamation No. 1249/2021.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}