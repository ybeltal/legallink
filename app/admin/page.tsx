'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Calendar,
  Scale,
  Briefcase,
  Check,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminConsolePage() {
  const supabase = createClient();

  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthenticated' | 'forbidden'>('checking');
  const [adminEmail, setAdminEmail] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'inquiries' | 'advocates' | 'applications' | 'opportunities'>('inquiries');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchLiveRecords = async () => {
    setLoading(true);
    try {
      const [bookingsRes, advRes, appsRes, oppsRes] = await Promise.all([
        supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('lawyer_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('student_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('job_opportunities').select('*').order('created_at', { ascending: false }),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (advRes.data) setAdvocates(advRes.data);
      if (appsRes.data) setApplications(appsRes.data);
      if (oppsRes.data) setOpportunities(oppsRes.data);
    } catch (err) {
      console.error('Error loading admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' });
        const payload = await res.json();

        if (res.ok && payload.isAdmin) {
          setAdminEmail(payload.email || '');
          setAuthStatus('authorized');
          fetchLiveRecords();
        } else if (res.status === 403) {
          setAdminEmail(payload.email || '');
          setAuthStatus('forbidden');
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch {
        setAuthStatus('unauthenticated');
      }
    };

    verifyAdmin();
  }, []);

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('consultation_bookings')
      .update({ booking_status: status })
      .eq('id', id);

    if (!error) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, booking_status: status } : b)));
      triggerFeedback(`Inquiry status updated to ${status}.`);
    } else {
      triggerFeedback('Failed to update status. Check Supabase RLS permissions.');
    }
  };

  const handleVerifyAdvocate = async (id: string, approve: boolean) => {
    const { error } = await supabase
      .from('lawyer_profiles')
      .update({
        is_verified: approve,
        vetting_status: approve ? 'approved' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (!error) {
      setAdvocates((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, is_verified: approve, vetting_status: approve ? 'approved' : 'pending' } : a
        )
      );
      triggerFeedback(approve ? 'Advocate MOJ badge verified live!' : 'Advocate verification set back to pending.');
    } else {
      triggerFeedback('Could not update advocate verification status.');
    }
  };

  const handleUpdateAppStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('student_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      triggerFeedback(`Application updated to ${newStatus}.`);
    }
  };

  const handleToggleJob = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('job_opportunities')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, is_active: !currentStatus } : o))
      );
      triggerFeedback(`Opportunity ${!currentStatus ? 'published live' : 'hidden'}.`);
    }
  };

  const metrics = useMemo(() => {
    return {
      totalInquiries: bookings.length,
      pendingInquiries: bookings.filter((b) => !b.booking_status || b.booking_status === 'pending').length,
      verifiedAdvocates: advocates.filter((a) => a.is_verified).length,
      pendingAdvocates: advocates.filter((a) => !a.is_verified).length,
      pendingApps: applications.filter((a) => a.status === 'pending').length,
      activeJobs: opportunities.filter((o) => o.is_active).length,
    };
  }, [bookings, advocates, applications, opportunities]);

  const q = searchQuery.trim().toLowerCase();

  const filteredBookings = bookings.filter(
    (b) =>
      !q ||
      String(b.client_name || '').toLowerCase().includes(q) ||
      String(b.lawyer_name || '').toLowerCase().includes(q) ||
      String(b.practice_area || '').toLowerCase().includes(q)
  );

  const filteredAdvocates = advocates.filter(
    (a) =>
      !q ||
      String(a.name || '').toLowerCase().includes(q) ||
      String(a.license_number || '').toLowerCase().includes(q) ||
      String(a.email || '').toLowerCase().includes(q)
  );

  const filteredApps = applications.filter(
    (a) =>
      !q ||
      String(a.applicant_name || '').toLowerCase().includes(q) ||
      String(a.university || '').toLowerCase().includes(q) ||
      String(a.opportunity_title || '').toLowerCase().includes(q)
  );

  const filteredOpps = opportunities.filter(
    (o) =>
      !q ||
      String(o.title || '').toLowerCase().includes(q) ||
      String(o.organization || '').toLowerCase().includes(q)
  );

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-mono text-slate-500">
        Verifying LegalLink Admin Session...
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-[#0A1128]">Admin Sign-In Required</h1>
            <p className="text-xs text-slate-600">
              Sign in with your authorized LegalLink administrator account to open the Oversight Console.
            </p>
          </div>
          <Link
            href="/login?redirect=/admin"
            className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl block"
          >
            Sign In as Administrator
          </Link>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 block">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (authStatus === 'forbidden') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-red-900">Access Restricted</h1>
            <p className="text-xs text-slate-600">
              <strong>{adminEmail}</strong> does not have administrator privileges on LegalLink.
            </p>
          </div>
          <Link
            href="/"
            className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-600">Link</span>
              </span>
            </Link>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold uppercase">
              ADMIN OVERSIGHT
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline text-slate-500 font-mono text-[11px]">{adminEmail}</span>
            <button
              type="button"
              onClick={fetchLiveRecords}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              <span>Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* KPI Summary */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Client Inquiries</span>
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <strong className="text-xl font-black text-[#0A1128]">{metrics.totalInquiries}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.pendingInquiries} awaiting advocate response
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified Advocates</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <strong className="text-xl font-black text-emerald-700">{metrics.verifiedAdvocates}</strong>
              <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                {metrics.pendingAdvocates} pending MOJ check
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">NextGen Applicants</span>
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <strong className="text-xl font-black text-blue-700">{applications.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.pendingApps} pending review
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Opportunities</span>
                <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              </div>
              <strong className="text-xl font-black text-[#0A1128]">{metrics.activeJobs}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Published on NextGen Hub</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Tabs + Search */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                activeTab === 'inquiries' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Client Inquiries ({bookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advocates')}
              className={`px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                activeTab === 'advocates' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Advocates & MOJ Vetting ({advocates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                activeTab === 'applications' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              NextGen Applications ({applications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('opportunities')}
              className={`px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap ${
                activeTab === 'opportunities' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Job Moderation ({opportunities.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter current tab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
            />
          </div>
        </div>

        {/* TAB 1: CLIENT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Client Consultation Inquiries</h2>
              <p className="text-xs text-slate-600">
                All free consultation requests submitted via Find a Lawyer.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Date / Ref</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Advocate</th>
                    <th className="py-3 px-3">Practice Area & Brief</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-mono">
                        <strong className="text-amber-800 block">LL-{String(b.id).slice(0, 6).toUpperCase()}</strong>
                        <span className="text-slate-500 text-[10px]">{new Date(b.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.client_name}</strong>
                        <span className="text-slate-600 font-mono text-[11px] block">{b.client_phone}</span>
                        {b.client_email && <span className="text-slate-500 text-[10px]">{b.client_email}</span>}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{b.lawyer_name}</td>
                      <td className="py-3 px-3 max-w-xs">
                        <strong className="text-[#0A1128] block">{b.practice_area}</strong>
                        <p className="text-slate-600 text-[11px] line-clamp-2">{b.brief_description}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                          {b.booking_status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={b.booking_status || 'pending'}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No consultation inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADVOCATES & LIVE MOJ VETTING */}
        {activeTab === 'advocates' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Advocate Registry & MOJ Credential Verification</h2>
              <p className="text-xs text-slate-600">
                Verify advocate bar license numbers against Ministry of Justice / Regional Bureau records to grant the MOJ Verified badge.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Advocate</th>
                    <th className="py-3 px-3">Bar License</th>
                    <th className="py-3 px-3">Court Standing & Location</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdvocates.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{adv.name}</strong>
                        <span className="text-slate-500 text-[11px]">{adv.amharic_name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-800">{adv.license_number}</td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-800 block">{adv.court_jurisdiction}</strong>
                        <span className="text-slate-500 text-[11px]">{adv.location}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="block text-slate-900">{adv.phone}</span>
                        <span className="text-slate-500 text-[10px]">{adv.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            adv.is_verified
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {adv.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {adv.is_verified ? (
                          <button
                            type="button"
                            onClick={() => handleVerifyAdvocate(adv.id, false)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            <span>Set Pending</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleVerifyAdvocate(adv.id, true)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve MOJ Badge</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredAdvocates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No advocate profiles registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NEXTGEN APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">NextGen Student & Pupillage Applications</h2>
              <p className="text-xs text-slate-600">Live submissions from `/nextgen`.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Applicant</th>
                    <th className="py-3 px-3">Opportunity</th>
                    <th className="py-3 px-3">University</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{app.applicant_name}</strong>
                        <span className="text-slate-500 text-[10px] font-mono">
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{app.opportunity_title}</td>
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{app.university}</strong>
                        <span className="text-slate-500 text-[11px]">{app.current_year}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="block text-slate-900">{app.applicant_phone}</span>
                        <span className="text-slate-500 text-[10px]">{app.applicant_email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No student applications recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: JOB MODERATION */}
        {activeTab === 'opportunities' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">NextGen Opportunity Moderation</h2>
              <p className="text-xs text-slate-600">Publish or hide internship and pupillage listings.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Title</th>
                    <th className="py-3 px-3">Organization</th>
                    <th className="py-3 px-3">Track</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOpps.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{opp.title}</td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">{opp.organization}</td>
                      <td className="py-3 px-3">{opp.track}</td>
                      <td className="py-3 px-3 text-slate-600">{opp.location}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            opp.is_active ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {opp.is_active ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleJob(opp.id, opp.is_active)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            opp.is_active
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {opp.is_active ? 'Hide' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOpps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No posted opportunities found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 text-slate-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© 2026 LegalLink Technologies PLC — Oversight Console</p>
          <p className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Proclamation No. 1249/2021 Compliance</span>
          </p>
        </div>
      </footer>
    </div>
  );
}