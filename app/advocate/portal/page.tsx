'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Edit3,
  Save,
  RefreshCw,
  GraduationCap,
  ExternalLink,
  Scale,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function AdvocatePortalPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'cases' | 'nextgen' | 'profile'>('cases');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [advocateProfile, setAdvocateProfile] = useState<any>(null);
  const [signedInEmail, setSignedInEmail] = useState<string>('');

  // Editable Profile Form State
  const [editName, setEditName] = useState('');
  const [editAmharicName, setEditAmharicName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editJurisdiction, setEditJurisdiction] = useState('Federal High Court');
  const [editLocation, setEditLocation] = useState('Addis Ababa');
  const [editOffersPupillage, setEditOffersPupillage] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const loadAdvocateSession = async () => {
    setLoading(true);

    try {
      const { data: userRes } = await supabase.auth.getUser();
      const emailFromAuth = userRes?.user?.email || getCookie('legallink_user_email') || '';
      setSignedInEmail(emailFromAuth);

      let profile: any = null;

      // 1. Try matching by signed-in email first
      if (emailFromAuth) {
        const { data } = await supabase
          .from('lawyer_profiles')
          .select('*')
          .ilike('email', emailFromAuth.trim())
          .limit(1)
          .maybeSingle();
        profile = data;
      }

      // 2. Fallback to sessionStorage ID (right after fresh registration)
      if (!profile) {
        const savedId = sessionStorage.getItem('ll_active_advocate_id');
        if (savedId) {
          const { data } = await supabase
            .from('lawyer_profiles')
            .select('*')
            .eq('id', savedId)
            .maybeSingle();
          profile = data;
        }
      }

      if (!profile) {
        setAdvocateProfile(null);
        setLoading(false);
        return;
      }

      setAdvocateProfile(profile);
      setEditName(profile.name || '');
      setEditAmharicName(profile.amharic_name || '');
      setEditTitle(profile.title || '');
      setEditJurisdiction(profile.court_jurisdiction || 'Federal High Court');
      setEditLocation(profile.location || 'Addis Ababa');
      setEditOffersPupillage(profile.offers_pupillage ?? true);

      // Fetch assigned consultations
      const cleanName = (profile.name || '').replace(/^Adv\.\s*/i, '').trim();
      const { data: bookData } = await supabase
        .from('consultation_bookings')
        .select('*')
        .or(`lawyer_id.eq.${profile.id},lawyer_name.ilike.%${cleanName}%`)
        .order('created_at', { ascending: false });

      if (bookData) setBookings(bookData);

      // Fetch NextGen student applications
      const { data: appData } = await supabase
        .from('student_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (appData) setApplications(appData);
    } catch (err) {
      console.error('Error loading advocate portal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvocateSession();
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => !b.booking_status || b.booking_status === 'pending').length,
      confirmed: bookings.filter((b) => b.booking_status === 'confirmed').length,
      completed: bookings.filter((b) => b.booking_status === 'completed').length,
    };
  }, [bookings]);

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: 'confirmed' | 'completed' | 'declined'
  ) => {
    const { error } = await supabase
      .from('consultation_bookings')
      .update({ booking_status: newStatus })
      .eq('id', bookingId);

    if (!error) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, booking_status: newStatus } : b))
      );
      triggerFeedback(`Consultation marked as ${newStatus}.`);
    } else {
      triggerFeedback('Could not update consultation status. Please try again.');
    }
  };

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
          court_jurisdiction: editJurisdiction.trim(),
          location: editLocation.trim(),
          offers_pupillage: editOffersPupillage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', advocateProfile.id);

      if (error) throw error;

      setAdvocateProfile((prev: any) => ({
        ...prev,
        name: editName.trim(),
        amharic_name: editAmharicName.trim(),
        title: editTitle.trim(),
        court_jurisdiction: editJurisdiction.trim(),
        location: editLocation.trim(),
        offers_pupillage: editOffersPupillage,
      }));

      triggerFeedback('Chamber profile updated in live directory.');
    } catch (err: any) {
      triggerFeedback(err?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCandidateAction = async (appId: string, action: 'shortlisted' | 'reviewed') => {
    const { error } = await supabase
      .from('student_applications')
      .update({ status: action })
      .eq('id', appId);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: action } : a))
      );
      triggerFeedback(`Candidate updated to ${action}.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs font-mono text-slate-500">
          Loading Advocate Workspace...
        </div>
      </div>
    );
  }

  // Signed-in advocate who hasn't completed chamber registration yet
  if (!advocateProfile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center space-y-5 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Scale className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-black text-[#0A1128]">
                Complete Your Chamber Profile
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                No advocate directory profile is linked to{' '}
                <strong>{signedInEmail || 'your account'}</strong> yet. Register your MOJ bar details once to unlock your Advocate Portal and receive client inquiries.
              </p>
            </div>
            <Link
              href="/advocate/register"
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2"
            >
              <span>Complete Advocate Registration</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Top Summary Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold w-fit bg-slate-50 text-slate-800 border-slate-200">
              {advocateProfile.is_verified ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-800">MOJ Verified Advocate</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-800">MOJ Verification Pending</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadAdvocateSession}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
              <Link
                href="/find-a-lawyer"
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <span>Public Directory</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
              {advocateProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-0.5">
              {advocateProfile.title} • License:{' '}
              <strong className="font-mono text-amber-800">{advocateProfile.license_number}</strong> •{' '}
              {advocateProfile.email}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Inquiries</span>
              <strong className="text-xl font-black text-[#0A1128]">{stats.total}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Awaiting Response</span>
              <strong className="text-xl font-black text-amber-700">{stats.pending}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Accepted / Active</span>
              <strong className="text-xl font-black text-emerald-700">{stats.confirmed}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">NextGen Applicants</span>
              <strong className="text-xl font-black text-blue-700">{applications.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cases' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Client Inquiries ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('nextgen')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'nextgen' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>NextGen Applicants ({applications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Chamber Profile</span>
          </button>
        </div>

        {/* TAB 1: CLIENT INQUIRIES */}
        {activeTab === 'cases' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Incoming Client Consultation Requests</h2>
              <p className="text-slate-600 font-normal">
                Review briefs submitted directly to your chamber and update their status as you connect with clients.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Ref / Date</th>
                    <th className="py-3 px-3">Client Contact</th>
                    <th className="py-3 px-3">Practice Area & Mode</th>
                    <th className="py-3 px-3">Matter Summary</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono">
                        <strong className="text-amber-800 block">
                          LL-{String(b.id).slice(0, 6).toUpperCase()}
                        </strong>
                        <span className="text-slate-500 text-[10px]">
                          {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.client_name}</strong>
                        <span className="text-slate-700 font-mono text-[11px] block">
                          {b.client_phone}
                        </span>
                        {b.client_email && (
                          <span className="text-slate-500 text-[10px]">{b.client_email}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.practice_area}</strong>
                        <span className="text-slate-500 text-[10px]">{b.consultation_time}</span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {b.brief_description || 'General consultation request'}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block font-mono ${
                            b.booking_status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : b.booking_status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : b.booking_status === 'declined'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {b.booking_status || 'pending'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                        {(!b.booking_status || b.booking_status === 'pending') && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateBookingStatus(b.id, 'declined')}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {b.booking_status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                            className="px-2.5 py-1 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        No client consultation requests yet. They will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NEXTGEN APPLICANTS */}
        {activeTab === 'nextgen' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">NextGen Pupillage & Intern Applicants</h2>
              <p className="text-slate-600 font-normal">
                Law students and fresh graduates applying under Proclamation No. 1249/2021.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">University & Standing</th>
                    <th className="py-3 px-3">Opportunity</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{app.applicant_name}</strong>
                        <span className="text-slate-500 text-[10px] font-mono">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{app.university}</strong>
                        <span className="text-slate-600 text-[11px]">{app.current_year}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{app.opportunity_title}</td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="text-slate-900 block">{app.applicant_phone}</span>
                        <span className="text-slate-500 text-[10px]">{app.applicant_email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'shortlisted'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
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
                      <td colSpan={6} className="text-center py-10 text-slate-500">
                        No active NextGen applications.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs max-w-3xl">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Edit Public Advocate Profile</h2>
              <p className="text-slate-600 font-normal">
                Changes saved here appear immediately in the Find a Lawyer directory.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Full Name (Amharic)</label>
                  <input
                    type="text"
                    value={editAmharicName}
                    onChange={(e) => setEditAmharicName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Practice Title / Specialization *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Court Standing *</label>
                  <select
                    value={editJurisdiction}
                    onChange={(e) => setEditJurisdiction(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Federal Supreme Court & Cassation">
                      Federal Supreme Court & Cassation
                    </option>
                    <option value="Federal High Court & Supreme Court">
                      Federal High Court & Supreme Court
                    </option>
                    <option value="Federal High Court">Federal High Court</option>
                    <option value="Federal First Instance">Federal First Instance</option>
                    <option value="Regional High / Supreme Court">Regional High / Supreme Court</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Chambers Location *</label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-4">
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
                  className="w-4 h-4 accent-[#0A1128] cursor-pointer shrink-0"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}