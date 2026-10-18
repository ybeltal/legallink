'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Unlock, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  Search, RefreshCw, LogOut, X, Smartphone, Receipt, Loader2, DollarSign,
  Briefcase, User, Check, ArrowUpRight, Scale, MessageSquare, Award, UserCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tab & Data State
  const [adminViewTab, setAdminViewTab] = useState<'cases' | 'advocates' | 'sms'>('cases');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [advocateApplications, setAdvocateApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'escrow_locked' | 'released' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Settlement Modal State
  const [selectedCaseForPayout, setSelectedCaseForPayout] = useState<any | null>(null);
  const [advocatePhone, setAdvocatePhone] = useState('0911234567');
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile');
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccessData, setPayoutSuccessData] = useState<any | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      const { data: consultData } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: txData } = await supabase
        .from('escrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: smsData } = await supabase
        .from('sms_logs')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: advocateData } = await supabase
        .from('advocate_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (consultData) setConsultations(consultData);
      if (txData) setTransactions(txData);
      if (smsData) setSmsLogs(smsData);
      if (advocateData) setAdvocateApplications(advocateData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();

      const supabase = createClient();
      const channel = supabase
        .channel('admin_realtime_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'consultations' },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setConsultations((prev) =>
                prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
              );
            } else if (payload.eventType === 'INSERT') {
              setConsultations((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setConsultations((prev) => prev.filter((item) => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      const txChannel = supabase
        .channel('admin_tx_realtime_sync')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'escrow_transactions' },
          (payload) => {
            setTransactions((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      const smsChannel = supabase
        .channel('admin_sms_realtime_sync')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'sms_logs' },
          (payload) => {
            setSmsLogs((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      const advocateChannel = supabase
        .channel('admin_advocates_realtime_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'advocate_applications' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setAdvocateApplications((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setAdvocateApplications((prev) =>
                prev.map((a) => (a.id === payload.new.id ? { ...a, ...payload.new } : a))
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(txChannel);
        supabase.removeChannel(smsChannel);
        supabase.removeChannel(advocateChannel);
      };
    }
  }, [isAuthenticated]);

  const handlePinAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleApproveCase = async (caseId: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from('consultations')
        .update({ status: 'approved' })
        .eq('id', caseId);

      setConsultations((prev) =>
        prev.map((c) => (c.id === caseId ? { ...c, status: 'approved' } : c))
      );
    } catch (err) {
      alert('Could not approve case.');
    }
  };

  const handleUpdateAdvocateStatus = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      const supabase = createClient();
      await supabase
        .from('advocate_applications')
        .update({ status })
        .eq('id', appId);

      const targetApp = advocateApplications.find((a) => a.id === appId);

      if (status === 'approved' && targetApp) {
        fetch('/api/sms/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: targetApp.phone_number,
            recipient_role: 'advocate',
            event_type: 'case_approved',
            message_body: `LegalLink Trust: Congratulations ${targetApp.full_name}! Your Ministry of Justice License (${targetApp.moj_license_number}) has been approved. Your advocate profile is active.`,
          }),
        }).catch((e) => console.log('SMS notify error:', e));
      }

      setAdvocateApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
    } catch (err: any) {
      alert('Could not update status: ' + err.message);
    }
  };

  const handleOpenPayoutModal = (c: any) => {
    setSelectedCaseForPayout(c);
    setPayoutSuccessData(null);
    setAdvocatePhone('0911234567');
    setAdvocateName('Advocate Mulu Haile');
  };

  const handleExecutePayout = async () => {
    if (!selectedCaseForPayout) return;
    setIsProcessingPayout(true);

    const totalHeld = Number(selectedCaseForPayout.escrow_amount || 1500);
    const platformCommission = totalHeld * 0.15;
    const netPayout = totalHeld * 0.85;
    const payoutTxnRef = `PAYOUT-TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const supabase = createClient();

      await supabase
        .from('consultations')
        .update({
          status: 'completed',
          payment_status: 'released',
        })
        .eq('id', selectedCaseForPayout.id);

      await supabase
        .from('escrow_transactions')
        .insert([
          {
            consultation_id: selectedCaseForPayout.id,
            client_name: advocateName,
            phone_number: advocatePhone,
            payment_channel: 'telebirr_b2c',
            amount_etb: netPayout,
            transaction_ref: payoutTxnRef,
            status: 'payout_released',
          },
        ]);

      fetch('/api/sms/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: advocatePhone,
          recipient_role: 'advocate',
          event_type: 'payout_released',
          message_body: `LegalLink Trust: ETB ${netPayout.toFixed(2)} net consultation fees have been disbursed to your Telebirr wallet. Ref: ${payoutTxnRef}. Case completed.`,
        }),
      }).catch((e) => console.log('SMS notify error:', e));

      setConsultations((prev) =>
        prev.map((c) =>
          c.id === selectedCaseForPayout.id
            ? { ...c, status: 'completed', payment_status: 'released' }
            : c
        )
      );

      setPayoutSuccessData({
        txnRef: payoutTxnRef,
        gross: totalHeld,
        commission: platformCommission,
        netDisbursed: netPayout,
        advocate: advocateName,
        phone: advocatePhone,
        date: new Date().toLocaleString(),
      });
    } catch (err: any) {
      alert('Payout disbursement failed: ' + err.message);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const totalLockedEscrow = consultations
    .filter((c) => c.payment_status === 'escrow_locked')
    .reduce((acc, c) => acc + Number(c.escrow_amount || 1500), 0);

  const totalPlatformRevenue = consultations
    .filter((c) => c.payment_status === 'released')
    .reduce((acc, c) => acc + (Number(c.escrow_amount || 1500) * 0.15), 0);

  const totalDisbursedAdvocates = consultations
    .filter((c) => c.payment_status === 'released')
    .reduce((acc, c) => acc + (Number(c.escrow_amount || 1500) * 0.85), 0);

  const pendingAdvocatesCount = advocateApplications.filter((a) => a.status === 'pending').length;

  const filteredConsultations = consultations.filter((c) => {
    if (filterTab === 'escrow_locked') return c.payment_status === 'escrow_locked';
    if (filterTab === 'released') return c.payment_status === 'released';
    if (filterTab === 'pending') return c.status === 'pending';
    return true;
  }).filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.client_name?.toLowerCase().includes(query) ||
      c.practice_area?.toLowerCase().includes(query) ||
      c.transaction_ref?.toLowerCase().includes(query)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-600 uppercase">RESTRICTED ACCESS</span>
            <h1 className="text-xl font-black text-[#0A1128] mt-1">LegalLink Oversight Portal</h1>
            <p className="text-xs text-slate-500 mt-2">Enter the regulatory supervisor master PIN to access the escrow trust ledger.</p>
          </div>

          <form onSubmit={handlePinAuth} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full text-center tracking-[1em] font-mono text-2xl py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[#0A1128] focus:outline-none focus:border-[#0A1128]"
            />

            {authError && (
              <p className="text-xs text-red-600 font-bold">Incorrect PIN code. Default is 2026.</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer"
            >
              Authenticate Oversight Session
            </button>
          </form>

          <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 block pt-2">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl text-[#0A1128]">Legal<span className="text-amber-500">Link</span></span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    TRUST OVERSIGHT
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">National Bank of Ethiopia & MOJ Regulator</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#0A1128] border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Marketplace ↗
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              title="Lock Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Total Retainers in Escrow</span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              ETB {totalLockedEscrow.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-400 block">Funds secured in Telebirr Trust Pool</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Platform Revenue (15%)</span>
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              ETB {totalPlatformRevenue.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-400 block">Commission on completed retainers</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Advocate Payouts Disbursed</span>
              <ArrowUpRight className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-600 font-mono">
              ETB {totalDisbursedAdvocates.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-400 block">85% net transferred to lawyers</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>MOJ License Vetting Queue</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-[#0A1128] font-mono">
              {pendingAdvocatesCount} Pending
            </div>
            <span className="text-[11px] text-slate-400 block">
              {advocateApplications.length} total applicant lawyers
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setAdminViewTab('cases')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              adminViewTab === 'cases' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Escrow Case Ledger ({consultations.length})
          </button>
          <button
            onClick={() => setAdminViewTab('advocates')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              adminViewTab === 'advocates' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>MOJ License Vetting Queue ({pendingAdvocatesCount})</span>
          </button>
          <button
            onClick={() => setAdminViewTab('sms')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              adminViewTab === 'sms' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ethio Telecom SMS Logs ({smsLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: CASES & PAYOUT CONTROLS */}
        {adminViewTab === 'cases' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-[#0A1128]">Case Pipeline & Escrow Settlement</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review client briefs, approve advocate matches, and release escrow retainers with automated SMS alerts.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search client, case, or TLB ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterTab === 'all' ? 'bg-[#0A1128] text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All ({consultations.length})
                  </button>
                  <button
                    onClick={() => setFilterTab('escrow_locked')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterTab === 'escrow_locked' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Escrow Locked
                  </button>
                  <button
                    onClick={() => setFilterTab('released')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      filterTab === 'released' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Settled
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-4">Case Brief / Client</th>
                    <th className="p-4">Jurisdiction</th>
                    <th className="p-4">Case Status</th>
                    <th className="p-4">Escrow Status</th>
                    <th className="p-4">Retainer (ETB)</th>
                    <th className="p-4 text-right">Settlement Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredConsultations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No matching cases found in the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredConsultations.map((c) => {
                      const isEscrowLocked = c.payment_status === 'escrow_locked';
                      const isReleased = c.payment_status === 'released';

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4">
                            <strong className="text-[#0A1128] block text-sm">{c.practice_area}</strong>
                            <span className="text-slate-500 block mt-0.5">
                              Client: {c.client_name || 'Anonymous Client'}
                            </span>
                            {c.transaction_ref && (
                              <span className="font-mono text-[10px] text-amber-600 mt-0.5 block font-bold">
                                Ref: {c.transaction_ref}
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-slate-600 font-medium">
                            📍 {c.location || 'Addis Ababa'}
                          </td>

                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              c.status === 'approved' 
                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                : c.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {c.status || 'pending'}
                            </span>
                          </td>

                          <td className="p-4">
                            {isEscrowLocked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Lock className="w-3 h-3 text-emerald-600" />
                                <span>Held in Escrow</span>
                              </span>
                            ) : isReleased ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                <span>Advocate Settled</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                                Unpaid Retainer
                              </span>
                            )}
                          </td>

                          <td className="p-4 font-mono font-bold text-[#0A1128] text-sm">
                            ETB {Number(c.escrow_amount || 1500).toFixed(2)}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {c.status === 'pending' && (
                                <button
                                  onClick={() => handleApproveCase(c.id)}
                                  className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                                >
                                  Approve Case
                                </button>
                              )}

                              {isEscrowLocked && (
                                <button
                                  onClick={() => handleOpenPayoutModal(c)}
                                  className="flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-xs shadow transition-all cursor-pointer"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Release Payout (SMS Alert)</span>
                                </button>
                              )}

                              {isReleased && (
                                <span className="text-[11px] text-slate-400 font-bold">
                                  Completed & Disbursed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADVOCATE ONBOARDING & MOJ VETTING QUEUE */}
        {adminViewTab === 'advocates' && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-[#0A1128]">Ministry of Justice License Verification Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify advocate bar credentials before authorizing case allocation on the public marketplace.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200">
                {pendingAdvocatesCount} Awaiting MOJ Audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-4">Advocate Name & Phone</th>
                    <th className="p-4">MOJ License Credential</th>
                    <th className="p-4">Jurisdiction & Exp</th>
                    <th className="p-4">Practice Specializations</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {advocateApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No advocate applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    advocateApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4">
                          <strong className="text-[#0A1128] block text-sm">{app.full_name}</strong>
                          <span className="text-slate-500 block font-mono text-[11px]">{app.phone_number}</span>
                          <span className="text-slate-400 block text-[10px]">{app.email}</span>
                        </td>

                        <td className="p-4">
                          <span className="font-mono font-bold text-amber-700 block text-xs bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">
                            {app.moj_license_number}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-1">📍 {app.office_address}</span>
                        </td>

                        <td className="p-4 text-slate-700">
                          <strong className="text-[#0A1128] block">{app.court_jurisdiction}</strong>
                          <span className="text-[11px] text-slate-500">{app.experience_years} Years Experience</span>
                        </td>

                        <td className="p-4 text-slate-600 max-w-xs">
                          <span className="line-clamp-2 text-[11px]">{app.practice_areas}</span>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            app.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {app.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          {app.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateAdvocateStatus(app.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
                              >
                                Approve License
                              </button>
                              <button
                                onClick={() => handleUpdateAdvocateStatus(app.id, 'rejected')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-bold">
                              Audited & Recorded
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ETHIO TELECOM SMS LOGS */}
        {adminViewTab === 'sms' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0A1128]">Automated Ethiopian SMS Notification Ledger</h3>
                  <p className="text-xs text-slate-500">Real-time dispatches via Ethio Telecom Shortcode 8421 to Ethiopian mobile numbers.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700">
                {smsLogs.length} Dispatched
              </span>
            </div>

            <div className="space-y-2">
              {smsLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  No SMS alerts sent yet.
                </div>
              ) : (
                smsLogs.map((log, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-700">{log.recipient_phone}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 uppercase border border-slate-200">
                          {log.recipient_role}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {log.delivery_status}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs italic font-sans pt-0.5">"{log.message_body}"</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                      {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* Payout Settlement Modal */}
      {selectedCaseForPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                  TELEBIRR B2C SETTLEMENT GATEWAY
                </span>
                <h3 className="text-lg font-black text-[#0A1128] mt-1">Release Advocate Payout</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {selectedCaseForPayout.transaction_ref || 'TLB-ESCROW'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCaseForPayout(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!payoutSuccessData ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Client Escrow Retainer:</span>
                    <span className="font-bold text-[#0A1128]">ETB 1,500.00</span>
                  </div>
                  <div className="flex justify-between text-amber-700">
                    <span>LegalLink Commission (15%):</span>
                    <span>- ETB 225.00</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-emerald-600 font-bold text-sm">
                    <span>Net Advocate Disbursement (85%):</span>
                    <span>ETB 1,275.00</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Beneficiary Advocate
                    </label>
                    <input
                      type="text"
                      value={advocateName}
                      onChange={(e) => setAdvocateName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Advocate Telebirr & SMS Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={advocatePhone}
                        onChange={(e) => setAdvocatePhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] leading-relaxed">
                  Authorizing this payout executes the Telebirr B2C transfer and automatically delivers an Ethio Telecom SMS confirmation to the advocate's mobile device.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedCaseForPayout(null)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessingPayout}
                    onClick={handleExecutePayout}
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    {isProcessingPayout ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Disbursing & Sending SMS...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Authorize ETB 1,275 & Send SMS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-black text-[#0A1128] text-base">Escrow Payout Disbursed!</h4>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Telebirr B2C Reference: <strong className="font-mono text-amber-600">{payoutSuccessData.txnRef}</strong>
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left text-xs text-emerald-800 font-mono">
                  ✓ Automated Ethio Telecom SMS dispatched to {payoutSuccessData.phone}
                </div>

                <button
                  onClick={() => setSelectedCaseForPayout(null)}
                  className="w-full py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Close & Return to Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}