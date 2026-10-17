'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, RefreshCw, CheckCircle2, Clock, XCircle, Trash2, 
  Search, ArrowLeft, Filter, Building2, User, Phone, MapPin, Calendar, 
  Download, Lock, KeyRound, DollarSign, Award, AlertCircle, FileSpreadsheet
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  // Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Portal State
  const [adminTab, setAdminTab] = useState<'pipeline' | 'vetting' | 'escrow'>('pipeline');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Mock Advocate Applications for Vetting Queue
  const [advocateQueue, setAdvocateQueue] = useState([
    { id: 'adv-1', name: 'Advocate Dawit Tesfaye', license: 'MOJ/FED/2011/0891', region: 'Addis Ababa & Hawassa', exp: '15 yrs', status: 'verified', fee: 'ETB 1,800/hr' },
    { id: 'adv-2', name: 'Advocate Tigist Bekele', license: 'MOJ/FED/2017/3120', region: 'Addis Ababa', exp: '9 yrs', status: 'verified', fee: 'ETB 1,200/hr' },
    { id: 'adv-3', name: 'Advocate Henok Alemayehu', license: 'MOJ/FED/2022/9941', region: 'Dire Dawa', exp: '4 yrs', status: 'pending_review', fee: 'ETB 900/hr' },
    { id: 'adv-4', name: 'Advocate Bethelhem Tadesse', license: 'MOJ/FED/2023/1042', region: 'Bahir Dar', exp: '3 yrs', status: 'pending_review', fee: 'ETB 850/hr' },
  ]);

  // Load consultations from Supabase
  const loadConsultations = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        alert('Supabase query error: ' + error.message);
      } else if (data) {
        setConsultations(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadConsultations();
    }
  }, [isAuthenticated]);

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '2026') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Mutate consultation status in Supabase
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('consultations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert('Could not update status: ' + error.message);
      } else {
        setConsultations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err: any) {
      alert('Error updating database row');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete consultation from Supabase
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this consultation record from PostgreSQL?')) return;

    setActionLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Delete failed: ' + error.message);
      } else {
        setConsultations((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err: any) {
      alert('Error deleting row');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Advocate verification toggle
  const toggleAdvocateStatus = (id: string) => {
    setAdvocateQueue((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'verified' ? 'pending_review' : 'verified' }
          : a
      )
    );
  };

  // Export CSV
  const exportToCSV = () => {
    if (consultations.length === 0) return alert('No data to export');
    const headers = ['ID', 'Client Name', 'Practice Area', 'Location', 'Budget', 'Status', 'Date'];
    const rows = consultations.map((c) => [
      c.id,
      `"${c.client_name || 'Anonymous'}"`,
      `"${c.practice_area || ''}"`,
      `"${c.location || ''}"`,
      `"${c.budget_range || ''}"`,
      c.status || 'pending',
      c.created_at || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LegalLink_Consultations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered dataset
  const filtered = consultations.filter((c) => {
    const matchesFilter = filterStatus === 'all' || (c.status || 'pending') === filterStatus;
    const matchesSearch = 
      (c.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.practice_area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Financial Metrics
  const totalGMV = consultations.length * 1500;
  const platformRevenue = Math.round(totalGMV * 0.15);
  const escrowHeld = consultations.filter((c) => (c.status || 'pending') !== 'completed').length * 1500;

  // 1. PIN SECURITY GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans text-white">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white">LegalLink Admin Gate</h2>
            <p className="text-xs text-slate-400 mt-1">Restricted compliance & operations oversight.</p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Access PIN (2026)"
                className="w-full text-center text-lg tracking-widest font-mono py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 focus:outline-none focus:border-amber-400"
              />
              {pinError && (
                <span className="text-[11px] text-red-400 font-semibold block mt-1.5 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Incorrect PIN. Enter 2026.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg"
            >
              Authenticate Oversight Session →
            </button>
          </form>

          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 block pt-2">
            ← Return to Public Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN CONSOLE
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white tracking-tight text-base">
                  LegalLink <span className="text-amber-400">Operations</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  Internal
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">Addis Ababa Central Node</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Portal</span>
            </Link>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              disabled={loading}
              onClick={loadConsultations}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Sync Supabase'}</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
              title="Lock Admin Console"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Command Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Consultations</span>
            <div className="text-3xl font-black text-white mt-1">{consultations.length}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Live PostgreSQL database entries</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">Active Pending</span>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {consultations.filter((c) => (c.status || 'pending') === 'pending').length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting advocate dispatch</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">Gross Platform GMV</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">ETB {totalGMV.toLocaleString()}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Platform take (15%): ETB {platformRevenue.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">Verified Advocates</span>
            <div className="text-3xl font-black text-blue-400 mt-1">
              {advocateQueue.filter((a) => a.status === 'verified').length} / {advocateQueue.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">MOJ licensed advocates active</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 gap-6 text-xs font-bold">
          <button
            onClick={() => setAdminTab('pipeline')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              adminTab === 'pipeline' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Consultation Pipeline ({consultations.length})
          </button>
          <button
            onClick={() => setAdminTab('vetting')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              adminTab === 'vetting' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Advocate Verification Queue ({advocateQueue.length})
          </button>
          <button
            onClick={() => setAdminTab('escrow')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              adminTab === 'escrow' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Escrow & Settlement Ledger
          </button>
        </div>

        {/* TAB 1: CONSULTATION PIPELINE */}
        {adminTab === 'pipeline' && (
          <div className="space-y-4">
            {/* Filter and Search */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search client, area, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-400 mr-1">Filter:</span>
                {['all', 'pending', 'approved', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      filterStatus === st 
                        ? 'bg-amber-500 text-slate-950 font-bold' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              {loading ? (
                <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Loading live pipeline from Supabase...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-xs text-slate-400">No consultations match this query.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="p-4">Client</th>
                        <th className="p-4">Practice Area</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Situation Brief</th>
                        <th className="p-4">Budget</th>
                        <th className="p-4">Current Status</th>
                        <th className="p-4 text-center">Triage Actions</th>
                        <th className="p-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-bold text-white whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs border border-slate-700">
                                {(c.client_name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <span>{c.client_name || 'Anonymous Client'}</span>
                                <span className="block text-[10px] text-slate-500 font-mono">
                                  #{c.id.slice(0, 6)}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-slate-200 whitespace-nowrap">{c.practice_area}</td>

                          <td className="p-4 text-slate-400 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {c.location || 'Addis Ababa'}
                            </span>
                          </td>

                          <td className="p-4 max-w-xs truncate text-slate-400" title={c.situation_description}>
                            {c.situation_description}
                          </td>

                          <td className="p-4 text-slate-400 whitespace-nowrap">
                            {c.budget_range || 'ETB 1,000–2,000'}
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                c.status === 'approved'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                  : c.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : c.status === 'cancelled'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {c.status || 'pending'}
                            </span>
                          </td>

                          {/* Quick Triage Buttons */}
                          <td className="p-4 whitespace-nowrap text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                              <button
                                disabled={actionLoadingId === c.id}
                                onClick={() => handleUpdateStatus(c.id, 'approved')}
                                className="px-2.5 py-1 hover:bg-blue-600/20 text-blue-400 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                disabled={actionLoadingId === c.id}
                                onClick={() => handleUpdateStatus(c.id, 'completed')}
                                className="px-2.5 py-1 hover:bg-emerald-600/20 text-emerald-400 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                              >
                                Complete
                              </button>
                              <button
                                disabled={actionLoadingId === c.id}
                                onClick={() => handleUpdateStatus(c.id, 'cancelled')}
                                className="px-2.5 py-1 hover:bg-red-600/20 text-red-400 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>

                          <td className="p-4 text-right whitespace-nowrap">
                            <button
                              disabled={actionLoadingId === c.id}
                              onClick={() => handleDelete(c.id)}
                              className="p-1.5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADVOCATE LICENSE VETTING */}
        {adminTab === 'vetting' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-white">Ministry of Justice Advocate License Roster</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify practicing licenses under the Federal Attorney General and FDRE Ministry of Justice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {advocateQueue.map((adv) => (
                <div key={adv.id} className="p-5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">{adv.name}</h4>
                      <span className="text-xs text-slate-400 block font-mono mt-0.5">{adv.license}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">📍 {adv.region} • {adv.exp} experience</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      adv.status === 'verified' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {adv.status === 'verified' ? 'MOJ Verified' : 'Pending Audit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
                    <span className="font-bold text-amber-400">{adv.fee}</span>
                    <button
                      onClick={() => toggleAdvocateStatus(adv.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        adv.status === 'verified'
                          ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      {adv.status === 'verified' ? 'Revoke License' : 'Verify & Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ESCROW & SETTLEMENT */}
        {adminTab === 'escrow' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div>
              <h3 className="font-bold text-base text-white">Telebirr & CBE Escrow Clearing Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Funds are held in platform trust accounts until client consultation or contract milestone completion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Locked in Escrow</span>
                <span className="text-2xl font-black text-amber-400 block mt-1">ETB {escrowHeld.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">Awaiting client release confirmation</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Released to Advocates</span>
                <span className="text-2xl font-black text-emerald-400 block mt-1">
                  ETB {(totalGMV - escrowHeld).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Disbursed via Telebirr Partner API</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Platform Take-Rate (15%)</span>
                <span className="text-2xl font-black text-blue-400 block mt-1">ETB {platformRevenue.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">LegalLink operational fee</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <strong>Regulatory Settlement Note:</strong> All transactions comply with the National Bank of Ethiopia (NBE) Payment Instrument Issuer directives. Escrow settlements clear within 24 banking hours post-consultation sign-off.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}