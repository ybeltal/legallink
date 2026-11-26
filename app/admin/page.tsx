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
  Users,
  Handshake,
  HelpCircle,
  Check,
  X,
  Send,
  Trash2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminConsolePage() {
  const supabase = createClient();

  const [authStatus, setAuthStatus] = useState<
    'checking' | 'authorized' | 'unauthenticated' | 'forbidden'
  >('checking');
  const [adminEmail, setAdminEmail] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    | 'users'
    | 'inquiries'
    | 'advocates'
    | 'partnerships'
    | 'qa'
    | 'applications'
    | 'opportunities'
  >('inquiries');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [platformUsers, setPlatformUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  // Draft answers for Legal Center Q&A tab
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchLiveRecords = async () => {
    setLoading(true);
    try {
      const [
        usersRes,
        bookingsRes,
        advRes,
        partnersRes,
        qaRes,
        appsRes,
        oppsRes,
      ] = await Promise.all([
        supabase
          .from('platform_users')
          .select('*')
          .order('last_login_at', { ascending: false }),
        supabase
          .from('consultation_bookings')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('lawyer_profiles')
          .select('*')
          .order('name', { ascending: true }),
        supabase
          .from('partner_inquiries')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('legal_questions')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('student_applications')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('job_opportunities')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (usersRes.data) setPlatformUsers(usersRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (advRes.data) setAdvocates(advRes.data);
      if (partnersRes.data) setPartnerships(partnersRes.data);
      if (qaRes.data) setQuestions(qaRes.data);
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
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, booking_status: status } : b))
      );
      triggerFeedback(`Inquiry status updated to ${status}.`);
    } else {
      triggerFeedback('Failed to update status.');
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
          a.id === id
            ? {
                ...a,
                is_verified: approve,
                vetting_status: approve ? 'approved' : 'pending',
              }
            : a
        )
      );
      triggerFeedback(
        approve
          ? 'Advocate MOJ badge verified live!'
          : 'Advocate set back to pending.'
      );
    } else {
      triggerFeedback('Could not update advocate verification status.');
    }
  };

  const handleUpdatePartnerStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('partner_inquiries')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setPartnerships((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      triggerFeedback(`Partnership status updated to ${status}.`);
    }
  };

  const handlePublishAnswer = async (id: string) => {
    const text = (answerDrafts[id] || '').trim();
    if (text.length < 15) {
      triggerFeedback('Please enter at least 15 characters before publishing.');
      return;
    }

    const { error } = await supabase
      .from('legal_questions')
      .update({
        answer: text,
        answered_by: 'LegalLink Legal Advisory Desk',
        status: 'answered',
      })
      .eq('id', id);

    if (!error) {
      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                answer: text,
                answered_by: 'LegalLink Legal Advisory Desk',
                status: 'answered',
              }
            : item
        )
      );
      setAnswerDrafts((prev) => ({ ...prev, [id]: '' }));
      triggerFeedback('Answer published live to the Legal Center Q&A!');
    } else {
      triggerFeedback('Could not publish answer. Check RLS policies.');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('legal_questions')
      .delete()
      .eq('id', id);

    if (!error) {
      setQuestions((prev) => prev.filter((item) => item.id !== id));
      triggerFeedback('Question removed from Legal Center.');
    }
  };

  const handleUpdateAppStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('student_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
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
        prev.map((o) =>
          o.id === id ? { ...o, is_active: !currentStatus } : o
        )
      );
      triggerFeedback(
        `Opportunity ${!currentStatus ? 'published live' : 'hidden'}.`
      );
    }
  };

  const metrics = useMemo(() => {
    return {
      totalUsers: platformUsers.length,
      totalInquiries: bookings.length,
      pendingInquiries: bookings.filter(
        (b) => !b.booking_status || b.booking_status === 'pending'
      ).length,
      verifiedAdvocates: advocates.filter((a) => a.is_verified).length,
      pendingAdvocates: advocates.filter((a) => !a.is_verified).length,
      newPartnerships: partnerships.filter((p) => p.status === 'new').length,
      unansweredQuestions: questions.filter((item) => !item.answer).length,
      pendingApps: applications.filter((a) => a.status === 'pending').length,
    };
  }, [platformUsers, bookings, advocates, partnerships, questions, applications]);

  const q = searchQuery.trim().toLowerCase();

  const filteredUsers = platformUsers.filter(
    (u) =>
      !q ||
      String(u.full_name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q) ||
      String(u.role || '').toLowerCase().includes(q) ||
      String(u.location || '').toLowerCase().includes(q)
  );

  const filteredBookings = bookings.filter(
    (b) =>
      !q ||
      String(b.client_name || '').toLowerCase().includes(q) ||
      String(b.client_email || '').toLowerCase().includes(q) ||
      String(b.lawyer_name || '').toLowerCase().includes(q) ||
      String(b.practice_area || '').toLowerCase().includes(q) ||
      String(b.brief_description || '').toLowerCase().includes(q)
  );

  const filteredAdvocates = advocates.filter(
    (a) =>
      !q ||
      String(a.name || '').toLowerCase().includes(q) ||
      String(a.license_number || '').toLowerCase().includes(q) ||
      String(a.email || '').toLowerCase().includes(q)
  );

  const filteredPartnerships = partnerships.filter(
    (p) =>
      !q ||
      String(p.organization_name || '').toLowerCase().includes(q) ||
      String(p.contact_name || '').toLowerCase().includes(q) ||
      String(p.email || '').toLowerCase().includes(q)
  );

  const filteredQuestions = questions.filter(
    (item) =>
      !q ||
      String(item.question || '').toLowerCase().includes(q) ||
      String(item.category || '').toLowerCase().includes(q) ||
      String(item.city || '').toLowerCase().includes(q)
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
            <span className="hidden md:inline text-slate-500 font-mono text-[11px]">
              {adminEmail}
            </span>
            <button
              type="button"
              onClick={fetchLiveRecords}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync All</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Users</span>
                <Users className="w-3.5 h-3.5 text-[#0A1128]" />
              </div>
              <strong className="text-xl font-black text-[#0A1128]">{metrics.totalUsers}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">Registered</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Inquiries</span>
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <strong className="text-xl font-black text-[#0A1128]">{metrics.totalInquiries}</strong>
              <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                {metrics.pendingInquiries} pending
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Advocates</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <strong className="text-xl font-black text-emerald-700">
                {metrics.verifiedAdvocates}/{advocates.length}
              </strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.pendingAdvocates} awaiting MOJ
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Partners</span>
                <Handshake className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <strong className="text-xl font-black text-purple-700">{partnerships.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.newPartnerships} new leads
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Legal Q&amp;A</span>
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <strong className="text-xl font-black text-amber-800">{questions.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.unansweredQuestions} unanswered
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">NextGen</span>
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <strong className="text-xl font-black text-blue-700">{applications.length}</strong>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.pendingApps} pending
              </span>
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
        <div className="space-y-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Client Inquiries ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Registered Users ({platformUsers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('advocates')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'advocates'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Advocates &amp; MOJ ({advocates.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('partnerships')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'partnerships'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Partnerships ({partnerships.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Legal Q&amp;A ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'applications'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                NextGen ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('opportunities')}
                className={`px-3.5 py-2 rounded-xl cursor-pointer ${
                  activeTab === 'opportunities'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Jobs ({opportunities.length})
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search active tab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: CLIENT INQUIRIES (FIND A LAWYER + DIASPORA) */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                Client &amp; Diaspora Consultation Inquiries
              </h2>
              <p className="text-xs text-slate-600">
                Every inquiry submitted through Find a Lawyer and the Diaspora Legal Hub.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Date / Source</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Advocate</th>
                    <th className="py-3 px-3">Practice Area &amp; Full Brief</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const isDiaspora =
                      String(b.brief_description || '').startsWith('[Diaspora') ||
                      String(b.lawyer_name || '').includes('Diaspora');
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/70 align-top">
                        <td className="py-3 px-3 font-mono whitespace-nowrap">
                          <strong className="text-amber-800 block">
                            LL-{String(b.id).slice(0, 6).toUpperCase()}
                          </strong>
                          <span className="text-slate-500 text-[10px] block">
                            {new Date(b.created_at).toLocaleDateString()}
                          </span>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              isDiaspora
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isDiaspora ? 'Diaspora Hub' : 'Find a Lawyer'}
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
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {b.lawyer_name}
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            {b.consultation_time}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-md">
                          <strong className="text-[#0A1128] block">{b.practice_area}</strong>
                          <p className="text-slate-600 text-[11px] leading-relaxed whitespace-pre-wrap mt-0.5">
                            {b.brief_description}
                          </p>
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
                    );
                  })}
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

        {/* TAB 2: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                Registered Users &amp; Live Sign-In Activity
              </h2>
              <p className="text-xs text-slate-600">
                Every user who signs up or signs in via Google or Email is logged here automatically.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">User Name &amp; Email</th>
                    <th className="py-3 px-3">Role &amp; Method</th>
                    <th className="py-3 px-3">Phone &amp; Location</th>
                    <th className="py-3 px-3">Legal Need / Area</th>
                    <th className="py-3 px-3">Logins</th>
                    <th className="py-3 px-3 text-right">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{u.full_name || 'Member'}</strong>
                        <span className="text-slate-600 font-mono text-[11px]">{u.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mr-1.5 ${
                            u.role === 'advocate'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {u.role}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          via {u.auth_provider || 'email'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="block text-slate-800 font-mono text-[11px]">
                          {u.phone || '—'}
                        </span>
                        <span className="text-slate-500 text-[10px]">{u.location || '—'}</span>
                      </td>
                      <td className="py-3 px-3 max-w-xs text-slate-700 text-[11px]">
                        {u.legal_need || '—'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#0A1128]">
                        {u.login_count || 1}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-500">
                        {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No sign-ins logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ADVOCATES & MOJ VETTING */}
        {activeTab === 'advocates' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                Advocate Registry &amp; MOJ Credential Verification
              </h2>
              <p className="text-xs text-slate-600">
                Verify advocate bar licenses to grant the MOJ Verified badge on the public directory.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Advocate</th>
                    <th className="py-3 px-3">Bar License</th>
                    <th className="py-3 px-3">Court Standing &amp; Location</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdvocates.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{adv.name}</strong>
                        <span className="text-slate-500 text-[11px]">{adv.amharic_name}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-800">
                        {adv.license_number}
                      </td>
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
                        No advocate profiles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: INSTITUTIONAL & DONOR PARTNERSHIPS */}
        {activeTab === 'partnerships' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                Donor, University &amp; Institutional Partnership Inquiries
              </h2>
              <p className="text-xs text-slate-600">
                Submissions received from `/about#partnerships`.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500">
                    <th className="py-3 px-3">Organization</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Focus Area &amp; Message</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPartnerships.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 align-top">
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{p.organization_name}</strong>
                        <span className="text-slate-500 text-[10px]">{p.organization_type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{p.contact_name}</strong>
                        <span className="text-slate-600 font-mono text-[11px] block">{p.email}</span>
                        {p.phone && <span className="text-slate-500 text-[10px]">{p.phone}</span>}
                      </td>
                      <td className="py-3 px-3 max-w-md">
                        <strong className="text-amber-800 block text-[11px]">
                          {p.partnership_area}
                        </strong>
                        <p className="text-slate-600 text-[11px] whitespace-pre-wrap mt-0.5">
                          {p.message}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-900">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={p.status || 'new'}
                          onChange={(e) => handleUpdatePartnerStatus(p.id, e.target.value)}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="active">Active Partner</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredPartnerships.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">
                        No partnership inquiries submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FREE LEGAL CENTER Q&A QUESTIONS */}
        {activeTab === 'qa' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                Legal Center Anonymous Questions
              </h2>
              <p className="text-xs text-slate-600">
                Public legal questions posted from `/legal-center`. Publish answers directly below to display them live on the site.
              </p>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No anonymous legal questions posted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.city} • {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-sm font-black text-[#0A1128] leading-snug">
                      {item.question}
                    </p>

                    {item.answer ? (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
                        <strong className="text-[11px] block">
                          Published Answer ({item.answered_by || 'LegalLink Advisory Desk'}):
                        </strong>
                        <p className="leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={2}
                          value={answerDrafts[item.id] || ''}
                          onChange={(e) =>
                            setAnswerDrafts((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a clear plain-language answer citing the relevant Ethiopian proclamation..."
                          className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                        />
                        <button
                          type="button"
                          onClick={() => handlePublishAnswer(item.id)}
                          className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-400" />
                          <span>Publish Answer to Legal Center</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: NEXTGEN APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                NextGen Student &amp; Pupillage Applications
              </h2>
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
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {app.opportunity_title}
                      </td>
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

        {/* TAB 7: JOB MODERATION */}
        {activeTab === 'opportunities' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">
                NextGen Opportunity Moderation
              </h2>
              <p className="text-xs text-slate-600">
                Publish or hide internship and pupillage listings.
              </p>
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
                            opp.is_active
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-slate-200 text-slate-600'
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
          <p>© 2026 LegalLink Ethiopia • Unified Oversight Console</p>
          <p className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Proclamation No. 1249/2021 Compliance</span>
          </p>
        </div>
      </footer>
    </div>
  );
}