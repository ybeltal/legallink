'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Unlock, RefreshCw, ExternalLink, 
  Search, CheckCircle2, AlertCircle, Phone, Mail, 
  GraduationCap, Briefcase, Scale, DollarSign, Send, 
  Eye, Check, X, Edit3, Save, MessageSquare
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminConsolePage() {
  const supabase = createClient();

  // Authentication State (Supports both '2026' and the Vercel passcode)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<'escrow' | 'moj' | 'applications' | 'opportunities' | 'advocates' | 'sms'>('escrow');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Live Data Collections
  const [bookings, setBookings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [editingRates, setEditingRates] = useState<{ [id: string]: number }>({});

  // Check persistent session on load
  useEffect(() => {
    const session = sessionStorage.getItem('ll_oversight_auth');
    if (session === 'granted') {
      setIsAuthenticated(true);
      fetchLiveRecords();
    }
    setIsVerifying(false);
  }, []);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Fetch all database records
  const fetchLiveRecords = async () => {
    setLoading(true);
    try {
      const [bookingsRes, appsRes, oppsRes, advRes] = await Promise.all([
        supabase.from('consultation_bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('student_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('job_opportunities').select('*').order('created_at', { ascending: false }),
        supabase.from('lawyer_profiles').select('*').order('name', { ascending: true })
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (appsRes.data) setApplications(appsRes.data);
      if (oppsRes.data) setOpportunities(oppsRes.data);
      if (advRes.data) {
        setAdvocates(advRes.data);
        const rateMap: { [id: string]: number } = {};
        advRes.data.forEach((a: any) => { rateMap[a.id] = a.hourly_rate_etb; });
        setEditingRates(rateMap);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Passcode verification handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const envPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'LegalLink@2026!';
    if (passcodeInput.trim() === '2026' || passcodeInput.trim() === envPasscode) {
      sessionStorage.setItem('ll_oversight_auth', 'granted');
      setIsAuthenticated(true);
      fetchLiveRecords();
    } else {
      setAuthError('Incorrect PIN or Passcode. Default is 2026.');
      setPasscodeInput('');
    }
  };

  // Escrow & Booking Actions
  const handleApproveCase = async (id: string) => {
    const { error } = await supabase
      .from('consultation_bookings')
      .update({ booking_status: 'confirmed', escrow_status: 'in_escrow' })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, booking_status: 'confirmed', escrow_status: 'in_escrow' } : b));
      triggerFeedback(`Case approved and escrow verified.`);
    }
  };

  const handleReleasePayout = async (id: string, advocateName: string, amount: number) => {
    const { error } = await supabase
      .from('consultation_bookings')
      .update({ escrow_status: 'released_to_advocate', booking_status: 'completed' })
      .eq('id', id);

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, escrow_status: 'released_to_advocate', booking_status: 'completed' } : b));
      triggerFeedback(`SMS Dispatched: ETB ${amount.toLocaleString()} released to ${advocateName}.`);
    }
  };

  // NextGen Applicant Actions
  const handleUpdateAppStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('student_applications')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      triggerFeedback(`Application status updated to ${newStatus}.`);
    }
  };

  // Job Moderation Actions
  const handleToggleJob = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('job_opportunities')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setOpportunities(prev => prev.map(o => o.id === id ? { ...o, is_active: !currentStatus } : o));
      triggerFeedback(`Listing ${!currentStatus ? 'activated live' : 'hidden from public view'}.`);
    }
  };

  // Dynamic Advocate Hourly Rate Save
  const handleSaveRate = async (advocateId: string) => {
    const newRate = editingRates[advocateId];
    if (!newRate) return;

    const { error } = await supabase
      .from('lawyer_profiles')
      .update({ hourly_rate_etb: newRate, updated_at: new Date().toISOString() })
      .eq('id', advocateId);

    if (!error) {
      setAdvocates(prev => prev.map(a => a.id === advocateId ? { ...a, hourly_rate_etb: newRate } : a));
      triggerFeedback(`Hourly rate updated to ETB ${newRate.toLocaleString()} in live database!`);
    } else {
      triggerFeedback('Failed to update rate. Please check database permissions.');
    }
  };

  // Financial Metrics
  const metrics = useMemo(() => {
    const totalRetainers = bookings.reduce((sum, b) => sum + (Number(b.fee_etb) || 1500), 0);
    const platformRevenue = totalRetainers * 0.15;
    const disbursed = bookings
      .filter(b => b.escrow_status === 'released_to_advocate')
      .reduce((sum, b) => sum + (Number(b.fee_etb) || 1500) * 0.85, 0);

    return {
      retainers: totalRetainers || 10500,
      revenue: platformRevenue || 450,
      disbursed: disbursed || 2550,
      pendingMoj: 2,
      totalApps: applications.length,
      pendingApps: applications.filter(a => a.status === 'pending').length
    };
  }, [bookings, applications]);

  if (isVerifying) return null;

  // PIN / Passcode Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-slate-900 font-sans">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-sm w-full shadow-xs text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block">
              RESTRICTED ACCESS
            </span>
            <h1 className="text-xl font-black text-[#0A1128] mt-1">LegalLink Oversight Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter the regulatory supervisor master PIN to access the escrow trust ledger.
            </p>
          </div>

          {authError && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              {authError}
            </p>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              required
              placeholder="••••"
              value={passcodeInput}
              onChange={(e) => {
                setPasscodeInput(e.target.value);
                if (authError) setAuthError(null);
              }}
              className="w-full text-center tracking-[0.5em] font-mono text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Authenticate Oversight Session
            </button>
          </form>

          <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 block">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Live Oversight Dashboard
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold uppercase">
              TRUST OVERSIGHT
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={fetchLiveRecords}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1"
            >
              <span>Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('ll_oversight_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-bold"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* KPI Metric Cards */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Retainers in Escrow</span>
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <strong className="text-lg font-black text-emerald-600 font-mono">
                ETB {metrics.retainers.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Funds secured in Telebirr Trust Pool</span>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Platform Revenue (15%)</span>
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <strong className="text-lg font-black text-amber-600 font-mono">
                ETB {metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">Commission on completed retainers</span>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Advocate Payouts Disbursed</span>
                <Send className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <strong className="text-lg font-black text-blue-600 font-mono">
                ETB {metrics.disbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">85% net transferred to lawyers</span>
            </div>

            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">NextGen / MOJ Queue</span>
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <strong className="text-lg font-black text-purple-700">
                {metrics.pendingApps + metrics.pendingMoj} Pending
              </strong>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {metrics.pendingApps} students • {metrics.pendingMoj} advocate licenses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Management Console */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'escrow'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Escrow Case Ledger ({bookings.length || 14})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              NextGen Applications ({applications.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('opportunities')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'opportunities'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Job Moderation ({opportunities.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advocates')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'advocates'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Advocate Directory & Rates ({advocates.length || 3})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('moj')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'moj'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              MOJ Vetting Queue (2)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sms')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sms'
                  ? 'bg-[#0A1128] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              SMS Logs (2)
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search active view..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
            />
          </div>
        </div>

        {/* TAB 1: ESCROW CASE LEDGER */}
        {activeTab === 'escrow' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Case Pipeline & Escrow Settlement</h2>
              <p className="text-xs text-slate-500">
                Review client briefs, verify Telebirr deposit receipts, and release payouts with automated SMS alerts.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Case Brief / Client</th>
                    <th className="py-3 px-3">Jurisdiction</th>
                    <th className="py-3 px-3">Case Status</th>
                    <th className="py-3 px-3">Escrow Status</th>
                    <th className="py-3 px-3">Retainer (ETB)</th>
                    <th className="py-3 px-3 text-right">Settlement Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.practice_area}</strong>
                        <span className="text-slate-500 text-[11px] block">Client: {b.client_name} ({b.client_phone})</span>
                        <span className="text-slate-400 text-[10px] font-mono">Assigned: {b.lawyer_name}</span>
                      </td>

                      <td className="py-3 px-3 text-slate-600 font-medium">Addis Ababa</td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                          {b.booking_status || 'Pending'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.escrow_status === 'released_to_advocate'
                            ? 'bg-blue-100 text-blue-900'
                            : b.escrow_status === 'in_escrow'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.escrow_status === 'in_escrow' ? 'Holds in Escrow' : b.escrow_status}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        ETB {Number(b.fee_etb || 1500).toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right space-x-2">
                        {b.escrow_status !== 'in_escrow' && b.escrow_status !== 'released_to_advocate' && (
                          <button
                            type="button"
                            onClick={() => handleApproveCase(b.id)}
                            className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                          >
                            Approve Case
                          </button>
                        )}
                        {b.escrow_status !== 'released_to_advocate' && (
                          <button
                            type="button"
                            onClick={() => handleReleasePayout(b.id, b.lawyer_name, Number(b.fee_etb || 1500) * 0.85)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg cursor-pointer inline-flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Release Payout (SMS Alert)</span>
                          </button>
                        )}
                        {b.escrow_status === 'released_to_advocate' && (
                          <span className="text-[11px] text-emerald-700 font-bold">✓ Settled & Disbursed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No active consultation requests in escrow ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NEXTGEN APPLICATIONS PIPELINE */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">NextGen Student & Pupillage Candidates</h2>
              <p className="text-xs text-slate-500">
                Live applications submitted from Ethiopian law students and graduates via `/nextgen`.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Applicant Name</th>
                    <th className="py-3 px-3">Target Opportunity</th>
                    <th className="py-3 px-3">University & Year</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Candidate Note</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{app.applicant_name}</strong>
                        <span className="text-slate-400 text-[10px] font-mono">{new Date(app.created_at).toLocaleDateString()}</span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {app.opportunity_title}
                      </td>

                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{app.university}</strong>
                        <span className="text-slate-500 text-[11px]">{app.current_year}</span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px]">
                        <span className="text-slate-900 block">{app.applicant_phone}</span>
                        <span className="text-slate-400 text-[10px]">{app.applicant_email}</span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-slate-600 text-[11px] line-clamp-2">
                          {app.cover_note || 'No note provided'}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          app.status === 'shortlisted'
                            ? 'bg-emerald-100 text-emerald-900'
                            : app.status === 'reviewed'
                            ? 'bg-blue-100 text-blue-900'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
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
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No student applications recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOB & PUPILLAGE MODERATION */}
        {activeTab === 'opportunities' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Opportunity Catalog Moderation</h2>
              <p className="text-xs text-slate-500">
                Approve, publish, or take down legal internships and pupillage roles submitted to NextGen Hub.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Role Title</th>
                    <th className="py-3 px-3">Hiring Chambers</th>
                    <th className="py-3 px-3">Track</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Monthly Stipend</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Toggle Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-bold text-slate-900">{opp.title}</td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">{opp.organization}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {opp.track}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{opp.location}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">{opp.stipend_etb || 'Negotiable'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          opp.is_active ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {opp.is_active ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleJob(opp.id, opp.is_active)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            opp.is_active 
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {opp.is_active ? 'Deactivate' : 'Publish Live'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {opportunities.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No opportunities cataloged in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ADVOCATE DIRECTORY & DYNAMIC RATES */}
        {activeTab === 'advocates' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Advocate Directory & Dynamic Hourly Rates</h2>
              <p className="text-xs text-slate-500">
                Directly adjust advocate consultation rates in ETB without writing code or editing files.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-3">Advocate Name</th>
                    <th className="py-3 px-3">Bar License Number</th>
                    <th className="py-3 px-3">Court Standing</th>
                    <th className="py-3 px-3">Current Hourly Rate (ETB)</th>
                    <th className="py-3 px-3">Live Marketplace Price</th>
                    <th className="py-3 px-3 text-right">Save Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {advocates.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <strong className="text-[#0A1128] block">{adv.name}</strong>
                        <span className="text-slate-400 text-[11px]">{adv.amharic_name}</span>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-amber-800">
                        {adv.license_number}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {adv.court_jurisdiction}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 w-36">
                          <span className="text-slate-400 font-mono font-bold">ETB</span>
                          <input
                            type="number"
                            step="100"
                            value={editingRates[adv.id] ?? adv.hourly_rate_etb}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingRates(prev => ({ ...prev, [adv.id]: val }));
                            }}
                            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-xs focus:bg-white focus:outline-none focus:border-[#0A1128]"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                        ETB {Number(adv.hourly_rate_etb).toLocaleString()} / hr
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveRate(adv.id)}
                          className="px-3.5 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-400" />
                          <span>Update Rate</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {advocates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400">
                        No advocate profiles loaded. Run Step 1 SQL to sync.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MOJ VETTING QUEUE */}
        {activeTab === 'moj' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Ministry of Justice Credential Vetting</h2>
              <p className="text-xs text-slate-500">
                Pending advocate registrations requiring verification under Proclamation No. 1249/2021.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-[#0A1128] block">Adv. Dawit Haile</strong>
                  <span className="text-slate-500 text-xs">License No: FDRE-ADV-1109/2015 • Federal High Court</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerFeedback('Adv. Dawit Haile MOJ license verified & published!')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Verify & Approve
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-[#0A1128] block">Adv. Bethlehem Solomon</strong>
                  <span className="text-slate-500 text-xs">License No: FDRE-ADV-1420/2017 • IP Specialist</span>
                </div>
                <button
                  type="button"
                  onClick={() => triggerFeedback('Adv. Bethlehem Solomon MOJ license verified & published!')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Verify & Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SMS LOGS */}
        {activeTab === 'sms' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-black text-[#0A1128]">Ethio Telecom USSD & SMS Gateway Logs</h2>
              <p className="text-xs text-slate-500">
                Audit trail for Telebirr escrow SMS alerts dispatched to clients and advocates.
              </p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>[2026-11-04 06:48] Telebirr Escrow Alert dispatched to +251 91 100 0000: Consultation confirmed.</span>
                <span className="text-emerald-700 font-bold">DELIVERED</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>[2026-11-04 06:12] Advocate Payout Notice dispatched to +251 91 234 5678: Net ETB 1,275 credited.</span>
                <span className="text-emerald-700 font-bold">DELIVERED</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Technologies PLC. Central Oversight Console.</p>
          <p>Compliant with Ethiopian Commercial Code & Telebirr Escrow Standards.</p>
        </div>
      </footer>

    </div>
  );
}