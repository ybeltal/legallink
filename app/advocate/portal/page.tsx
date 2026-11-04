'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Scale, DollarSign, Calendar, Clock, 
  User, Phone, Mail, FileText, CheckCircle2, AlertCircle, 
  Edit3, Save, RefreshCw, GraduationCap, ArrowRight, 
  ExternalLink, LogOut, Check, Building2, MapPin
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

export default function AdvocatePortalPage() {
  const supabase = createClient();

  // Active Tab: cases | nextgen | profile
  const [activeTab, setActiveTab] = useState<'cases' | 'nextgen' | 'profile'>('cases');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Selected Advocate Identity (default to Adv. Dawit Tesfaye, supports live switcher)
  const [currentAdvocateId, setCurrentAdvocateId] = useState<string>('ETH-BAR-2015-0081');
  const [advocateProfile, setAdvocateProfile] = useState<any>(null);

  // Editable Profile Form State
  const [editName, setEditName] = useState('');
  const [editAmharicName, setEditAmharicName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editRate, setEditRate] = useState<number>(1800);
  const [editJurisdiction, setEditJurisdiction] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editOffersPupillage, setEditOffersPupillage] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Data Stores
  const [allAdvocates, setAllAdvocates] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Load Advocate Session & Data
  const loadPortalData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all advocates for the session switcher
      const { data: advData } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .order('name');
      
      if (advData && advData.length > 0) {
        setAllAdvocates(advData);
        
        // Check session storage or fallback to first
        const savedId = sessionStorage.getItem('ll_active_advocate_id') || currentAdvocateId;
        const matched = advData.find((a: any) => a.id === savedId) || advData[0];
        
        setCurrentAdvocateId(matched.id);
        setAdvocateProfile(matched);
        setEditName(matched.name);
        setEditAmharicName(matched.amharic_name || '');
        setEditTitle(matched.title || '');
        setEditRate(matched.hourly_rate_etb || 1800);
        setEditJurisdiction(matched.court_jurisdiction || '');
        setEditLocation(matched.location || 'Addis Ababa');
        setEditOffersPupillage(matched.offers_pupillage ?? true);
      }

      // 2. Fetch consultation bookings assigned to this advocate
      const { data: bookData } = await supabase
        .from('consultation_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookData) {
        setBookings(bookData);
      }

      // 3. Fetch NextGen Student Applications
      const { data: appData } = await supabase
        .from('student_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (appData) {
        setApplications(appData);
      }
    } catch (err) {
      console.error('Error loading advocate portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Switch Active Advocate Identity
  const handleSwitchAdvocate = (newId: string) => {
    sessionStorage.setItem('ll_active_advocate_id', newId);
    setCurrentAdvocateId(newId);
    const matched = allAdvocates.find((a: any) => a.id === newId);
    if (matched) {
      setAdvocateProfile(matched);
      setEditName(matched.name);
      setEditAmharicName(matched.amharic_name || '');
      setEditTitle(matched.title || '');
      setEditRate(matched.hourly_rate_etb || 1800);
      setEditJurisdiction(matched.court_jurisdiction || '');
      setEditLocation(matched.location || 'Addis Ababa');
      setEditOffersPupillage(matched.offers_pupillage ?? true);
      triggerFeedback(`Switched workspace identity to ${matched.name}`);
    }
  };

  // Filter Bookings for Current Advocate
  const myBookings = useMemo(() => {
    if (!advocateProfile) return [];
    return bookings.filter(b => 
      b.lawyer_id === advocateProfile.id || 
      b.lawyer_name?.toLowerCase().includes(advocateProfile.name.toLowerCase().replace('adv. ', ''))
    );
  }, [bookings, advocateProfile]);

  // Financial Balance Calculations (85% net to advocate after 15% platform commission)
  const earnings = useMemo(() => {
    const totalConsultationValue = myBookings.reduce((sum, b) => sum + (Number(b.fee_etb) || 0), 0);
    const inEscrow = myBookings
      .filter(b => b.escrow_status === 'in_escrow' || b.escrow_status === 'awaiting_payment')
      .reduce((sum, b) => sum + (Number(b.fee_etb) || 0) * 0.85, 0);
    const disbursed = myBookings
      .filter(b => b.escrow_status === 'released_to_advocate')
      .reduce((sum, b) => sum + (Number(b.fee_etb) || 0) * 0.85, 0);

    return {
      totalGross: totalConsultationValue,
      netDisbursed: disbursed,
      heldInEscrow: inEscrow,
      activeCases: myBookings.length
    };
  }, [myBookings]);

  // Save Profile Card Changes to Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advocateProfile) return;

    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('lawyer_profiles')
        .update({
          name: editName.trim(),
          amharic_name: editAmharicName.trim(),
          title: editTitle.trim(),
          hourly_rate_etb: editRate,
          court_jurisdiction: editJurisdiction.trim(),
          location: editLocation.trim(),
          offers_pupillage: editOffersPupillage,
          updated_at: new Date().toISOString()
        })
        .eq('id', advocateProfile.id);

      if (error) throw error;

      setAdvocateProfile((prev: any) => ({
        ...prev,
        name: editName.trim(),
        amharic_name: editAmharicName.trim(),
        title: editTitle.trim(),
        hourly_rate_etb: editRate,
        court_jurisdiction: editJurisdiction.trim(),
        location: editLocation.trim(),
        offers_pupillage: editOffersPupillage
      }));

      triggerFeedback('Profile card & hourly rate updated successfully in live directory!');
    } catch (err: any) {
      triggerFeedback(err?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Advocate NextGen candidate action
  const handleCandidateAction = async (appId: string, action: 'shortlisted' | 'reviewed') => {
    const { error } = await supabase
      .from('student_applications')
      .update({ status: action })
      .eq('id', appId);

    if (!error) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
      triggerFeedback(`Candidate updated to ${action}. Chamber interview invitation pending.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Top Identity & Breadcrumb Bar */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Advocate Workspace • Proclamation No. 1249/2021 Compliant</span>
            </div>

            {/* Quick Session Identity Switcher */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Logged in as:</span>
              <select
                value={currentAdvocateId}
                onChange={(e) => handleSwitchAdvocate(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:outline-none"
              >
                {allAdvocates.map((adv) => (
                  <option key={adv.id} value={adv.id}>
                    {adv.name} ({adv.license_number})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={loadPortalData}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                title="Refresh Portal Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
                {advocateProfile?.name || 'Advocate Workspace'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                {advocateProfile?.title || 'Federal Court Advocate'} • License: <strong className="font-mono text-amber-700">{advocateProfile?.license_number}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/find-a-lawyer"
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>View Public Card</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Real-time Earnings & Escrow Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Consultations</span>
              <strong className="text-xl font-black text-[#0A1128]">{earnings.activeCases}</strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Assigned client briefs</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Payouts Disbursed</span>
              <strong className="text-xl font-black text-emerald-700 font-mono">
                ETB {earnings.netDisbursed.toLocaleString()}
              </strong>
              <span className="text-[10px] text-emerald-800 block mt-0.5">Transferred to your Telebirr/CBE</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Protected in Escrow</span>
              <strong className="text-xl font-black text-amber-700 font-mono">
                ETB {earnings.heldInEscrow.toLocaleString()}
              </strong>
              <span className="text-[10px] text-amber-800 block mt-0.5">Pending session completion</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">NextGen Apprentices</span>
              <strong className="text-xl font-black text-blue-700">
                {applications.length} Applicants
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Proclamation 1249/2021 pupillage</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Workspace Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Toast Alert */}
        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-scaleUp">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cases'
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>My Client Consultations ({myBookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nextgen')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nextgen'
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>Pupillage & Intern Applicants ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Profile & Rates</span>
          </button>
        </div>

        {/* TAB 1: CLIENT CONSULTATIONS & ESCROW */}
        {activeTab === 'cases' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-black text-[#0A1128]">Assigned Client Cases & Telebirr Escrow Ledger</h2>
                <p className="text-slate-500 font-normal">
                  Client consultations booked directly with you. Payouts (85% net) are transferred upon session confirmation.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Date / Booking Ref</th>
                    <th className="py-3 px-3">Client Contact</th>
                    <th className="py-3 px-3">Practice Area</th>
                    <th className="py-3 px-3">Brief / Situation</th>
                    <th className="py-3 px-3">Gross Retainer</th>
                    <th className="py-3 px-3">Escrow Status</th>
                    <th className="py-3 px-3 text-right">Advocate Net (85%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 font-mono">
                        <strong className="text-amber-800 block">{b.id.slice(0, 8).toUpperCase()}</strong>
                        <span className="text-slate-400 text-[10px]">{new Date(b.created_at).toLocaleDateString()}</span>
                      </td>

                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.client_name}</strong>
                        <span className="text-slate-600 font-mono text-[11px] block">{b.client_phone}</span>
                        {b.client_email && <span className="text-slate-400 text-[10px]">{b.client_email}</span>}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {b.practice_area}
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                          {b.brief_description || 'General Legal Consultation'}
                        </p>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        ETB {Number(b.fee_etb || 1500).toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block font-mono ${
                          b.escrow_status === 'released_to_advocate'
                            ? 'bg-blue-100 text-blue-900'
                            : b.escrow_status === 'in_escrow'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {b.escrow_status === 'released_to_advocate' ? 'Paid to You' : b.escrow_status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        ETB {(Number(b.fee_etb || 1500) * 0.85).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {myBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No client bookings assigned to your profile yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NEXTGEN PUPILLAGE & INTERN PIPELINE */}
        {activeTab === 'nextgen' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">NextGen Pupillage & Intern Applicants</h2>
              <p className="text-slate-500 font-normal">
                Law graduates seeking advocate mentorship and pupillage under Federal Advocacy Proclamation No. 1249/2021.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">University & Standing</th>
                    <th className="py-3 px-3">Target Opportunity</th>
                    <th className="py-3 px-3">Contact (Phone / TG)</th>
                    <th className="py-3 px-3">Academic Note</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Chamber Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{app.applicant_name}</strong>
                        <span className="text-slate-400 text-[10px] font-mono">{new Date(app.created_at).toLocaleDateString()}</span>
                      </td>

                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{app.university}</strong>
                        <span className="text-slate-500 text-[11px]">{app.current_year}</span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {app.opportunity_title}
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="text-slate-900 block">{app.applicant_phone}</span>
                        <span className="text-slate-400 text-[10px]">{app.applicant_email}</span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                          {app.cover_note || 'Seeking legal clinic internship and courtroom mentorship.'}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'shortlisted' 
                            ? 'bg-emerald-100 text-emerald-900' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleCandidateAction(app.id, 'shortlisted')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Shortlist
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No active NextGen applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE CARD & RATES */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs max-w-3xl">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Edit Public Advocate Profile Card</h2>
              <p className="text-slate-500 font-normal">
                Changes saved here reflect immediately on the Find-a-Lawyer directory and booking calculator.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Advocate Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Advocate Name (Amharic)
                  </label>
                  <input
                    type="text"
                    value={editAmharicName}
                    onChange={(e) => setEditAmharicName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Professional Title / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Hourly Consultation Rate (ETB) *
                  </label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={editRate}
                    onChange={(e) => setEditRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-800 focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Court Jurisdiction Standing *
                  </label>
                  <select
                    value={editJurisdiction}
                    onChange={(e) => setEditJurisdiction(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Federal Supreme Court & Cassation">Federal Supreme Court & Cassation</option>
                    <option value="Federal High Court & Supreme Court">Federal High Court & Supreme Court</option>
                    <option value="Federal High Court">Federal High Court</option>
                    <option value="Federal First Instance">Federal First Instance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Chambers Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              {/* NextGen Mentorship Toggle */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <strong className="text-[#0A1128] block">NextGen Pupillage Mentorship</strong>
                  <span className="text-amber-900 text-[11px]">
                    Accept law graduate apprentices under Proclamation No. 1249/2021.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editOffersPupillage}
                  onChange={(e) => setEditOffersPupillage(e.target.checked)}
                  className="w-4 h-4 accent-[#0A1128] cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Card'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Technologies PLC. Advocate Operations Suite.</p>
          <p>Licensing verified under Ethiopian Federal Advocacy Proclamation No. 1249/2021.</p>
        </div>
      </footer>

    </div>
  );
}