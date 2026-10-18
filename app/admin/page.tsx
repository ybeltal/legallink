'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Unlock, CheckCircle2, Clock, AlertCircle, ArrowRight, 
  Search, RefreshCw, LogOut, X, Smartphone, Receipt, Loader2, DollarSign,
  Briefcase, User, Check, ArrowUpRight, Scale
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPortal() {
  // Access Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Data State
  const [consultations, setConsultations] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
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

      if (consultData) setConsultations(consultData);
      if (txData) setTransactions(txData);
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

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(txChannel);
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
    const platformCommission = totalHeld * 0.15; // 15% (ETB 225)
    const netPayout = totalHeld * 0.85; // 85% (ETB 1,275)
    const payoutTxnRef = `PAYOUT-TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const supabase = createClient();

      // 1. Update Consultation record to 'completed' and 'released'
      await supabase
        .from('consultations')
        .update({
          status: 'completed',
          payment_status: 'released',
        })
        .eq('id', selectedCaseForPayout.id);

      // 2. Audit record in escrow_transactions for the disbursement
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

      // 3. Update local state
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

  // Metrics calculations
  const totalLockedEscrow = consultations
    .filter((c) => c.payment_status === 'escrow_locked')
    .reduce((acc, c) => acc + Number(c.escrow_amount || 1500), 0);

  const totalPlatformRevenue = consultations
    .filter((c) => c.payment_status === 'released')
    .reduce((acc, c) => acc + (Number(c.escrow_amount || 1500) * 0.15), 0);

  const totalDisbursedAdvocates = consultations
    .filter((c) => c.payment_status === 'released')
    .reduce((acc, c) => acc + (Number(c.escrow_amount || 1500) * 0.85), 0);

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

  // 1. PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060B1A] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">RESTRICTED ACCESS</span>
            <h1 className="text-xl font-black text-white mt-1">LegalLink Oversight Portal</h1>
            <p className="text-xs text-slate-400 mt-2">Enter the regulatory supervisor master PIN to access the escrow trust ledger.</p>
          </div>

          <form onSubmit={handlePinAuth} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full text-center tracking-[1em] font-mono text-2xl py-3 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 focus:outline-none focus:border-amber-500"
            />

            {authError && (
              <p className="text-xs text-red-400 font-bold">Incorrect PIN code. Default is 2026.</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow transition-all cursor-pointer"
            >
              Authenticate Oversight Session
            </button>
          </form>

          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 block pt-2">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // 2. Active Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white">Legal<span className="text-amber-400">Link</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  TRUST OVERVIEW
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">National Bank of Ethiopia Escrow Gate</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
            >
              Marketplace ↗
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
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
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Total Retainers in Escrow</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              ETB {totalLockedEscrow.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-500 block">Funds secured in Telebirr Trust Pool</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Platform Revenue (15%)</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              ETB {totalPlatformRevenue.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-500 block">Commission on completed legal retainers</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Advocate Payouts Disbursed</span>
              <ArrowUpRight className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400">
              ETB {totalDisbursedAdvocates.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-500 block">85% net transferred to lawyers</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs">
              <span>Active Platform Cases</span>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {consultations.length} Cases
            </div>
            <span className="text-[11px] text-slate-500 block">Across 18 Ethiopian practice jurisdictions</span>
          </div>
        </div>

        {/* Case Ledger & Payout Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-white">Case Pipeline & Escrow Settlement</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review client consultation briefs, approve advocate matches, and release escrow retainers.
              </p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search client, case, or TLB ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterTab === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({consultations.length})
                </button>
                <button
                  onClick={() => setFilterTab('escrow_locked')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterTab === 'escrow_locked' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Escrow Locked
                </button>
                <button
                  onClick={() => setFilterTab('released')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    filterTab === 'released' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Settled
                </button>
              </div>
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Case Brief / Client</th>
                  <th className="p-4">Jurisdiction</th>
                  <th className="p-4">Case Status</th>
                  <th className="p-4">Escrow Status</th>
                  <th className="p-4">Retainer (ETB)</th>
                  <th className="p-4 text-right">Settlement Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredConsultations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No matching cases found in the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredConsultations.map((c) => {
                    const isEscrowLocked = c.payment_status === 'escrow_locked';
                    const isReleased = c.payment_status === 'released';

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <strong className="text-white block text-sm">{c.practice_area}</strong>
                          <span className="text-slate-400 block mt-0.5">
                            Client: {c.client_name || 'Anonymous Client'}
                          </span>
                          {c.transaction_ref && (
                            <span className="font-mono text-[10px] text-amber-400 mt-0.5 block">
                              Ref: {c.transaction_ref}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-300 font-medium">
                          📍 {c.location || 'Addis Ababa'}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'approved' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                              : c.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {c.status || 'pending'}
                          </span>
                        </td>

                        <td className="p-4">
                          {isEscrowLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <Lock className="w-3 h-3" />
                              <span>Held in Escrow</span>
                            </span>
                          ) : isReleased ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Advocate Settled</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              Unpaid Retainer
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-mono font-bold text-white text-sm">
                          ETB {Number(c.escrow_amount || 1500).toFixed(2)}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {c.status === 'pending' && (
                              <button
                                onClick={() => handleApproveCase(c.id)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
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
                                <span>Release Advocate Payout</span>
                              </button>
                            )}

                            {isReleased && (
                              <span className="text-[11px] text-slate-500 font-bold">
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

        {/* Audit Log Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Telebirr Regulatory Audit Ledger</h3>
              <p className="text-xs text-slate-400">Complete record of inbound client deposits and outbound advocate disbursements.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
              {transactions.length} Total Logs
            </span>
          </div>

          <div className="space-y-2">
            {transactions.slice(0, 8).map((tx, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <div>
                  <span className="font-mono font-bold text-amber-400 mr-2">{tx.transaction_ref}</span>
                  <span className="text-slate-300 font-medium">Beneficiary / Client: {tx.client_name}</span>
                  <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">({tx.phone_number})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    tx.status === 'payout_released' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {tx.status === 'payout_released' ? 'Outbound Payout' : 'Inbound Escrow'}
                  </span>
                  <span className="font-mono font-bold text-white">ETB {tx.amount_etb || 1500}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Payout Settlement Modal */}
      {selectedCaseForPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                  TELEBIRR B2C SETTLEMENT GATEWAY
                </span>
                <h3 className="text-lg font-black text-white mt-1">Release Advocate Payout</h3>
                <span className="text-xs text-slate-400 font-mono">
                  Ref: {selectedCaseForPayout.transaction_ref || 'TLB-ESCROW'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedCaseForPayout(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!payoutSuccessData ? (
              <div className="space-y-4 text-xs">
                {/* Financial Split Breakdown Table */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Client Escrow Retainer:</span>
                    <span className="font-bold text-white">ETB 1,500.00</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>LegalLink Commission (15%):</span>
                    <span>- ETB 225.00</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-emerald-400 font-bold text-sm">
                    <span>Net Advocate Disbursement (85%):</span>
                    <span>ETB 1,275.00</span>
                  </div>
                </div>

                {/* Target Advocate Details */}
                <div className="space-y-3 font-sans">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Beneficiary Advocate
                    </label>
                    <input
                      type="text"
                      value={advocateName}
                      onChange={(e) => setAdvocateName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Advocate Telebirr Account Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={advocatePhone}
                        onChange={(e) => setAdvocatePhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[11px] leading-relaxed">
                  Authorizing this disbursement triggers a real-time Telebirr B2C transfer of ETB 1,275.00 directly to the advocate's wallet and releases the escrow obligation.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedCaseForPayout(null)}
                    className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
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
                        <span>Disbursing via Telebirr...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Authorize ETB 1,275 Payout</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Screen */
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="font-black text-white text-base">Escrow Payout Disbursed!</h4>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Telebirr B2C Reference: <strong className="font-mono text-amber-400">{payoutSuccessData.txnRef}</strong>
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gross Retainer:</span>
                    <span>ETB {payoutSuccessData.gross}.00</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>LegalLink Commission:</span>
                    <span>ETB {payoutSuccessData.commission}.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                    <span>Transferred to Lawyer:</span>
                    <span>ETB {payoutSuccessData.netDisbursed}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1">
                    <span>Recipient:</span>
                    <span>{payoutSuccessData.advocate} ({payoutSuccessData.phone})</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCaseForPayout(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
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