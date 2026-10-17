'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, RefreshCw, CheckCircle2, Clock, XCircle, Trash2, 
  Search, ArrowLeft, Filter, Building2, User, Phone, MapPin, Calendar, ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch consultations from Supabase
  const loadConsultations = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        alert('Supabase error: ' + error.message);
      } else if (data) {
        setConsultations(data);
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to connect to Supabase: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  // Update status in Supabase (e.g. pending -> approved -> completed)
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
      alert('Error updating status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete consultation from Supabase
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this consultation record?')) return;

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

  // Filtered consultations
  const filtered = consultations.filter((c) => {
    const matchesFilter = filterStatus === 'all' || (c.status || 'pending') === filterStatus;
    const matchesSearch = 
      (c.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.practice_area || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate metrics
  const totalCount = consultations.length;
  const pendingCount = consultations.filter((c) => (c.status || 'pending') === 'pending').length;
  const approvedCount = consultations.filter((c) => c.status === 'approved').length;
  const completedCount = consultations.filter((c) => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Admin Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-white tracking-tight text-base">
                LegalLink <span className="text-amber-400">Admin</span>
              </span>
              <span className="ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Oversight Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Marketplace</span>
            </Link>
            <button
              disabled={loading}
              onClick={loadConsultations}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Database'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Requests</span>
            <div className="text-3xl font-black text-white mt-1">{totalCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Saved in Supabase PostgreSQL</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-amber-400 font-semibold uppercase">Pending Review</span>
            <div className="text-3xl font-black text-amber-400 mt-1">{pendingCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting advocate assignment</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-blue-400 font-semibold uppercase">Approved / Active</span>
            <div className="text-3xl font-black text-blue-400 mt-1">{approvedCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">In consultation with advocate</span>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-emerald-400 font-semibold uppercase">Completed Cases</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">{completedCount}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Successfully resolved</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by client, topic, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-400 mr-1">Status:</span>
            {['all', 'pending', 'approved', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterStatus === st 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Consultations */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span>Loading consultation pipeline from Supabase...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-400">
              No matching consultations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Practice Area</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Budget / Urgency</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-center">Manage Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                      {/* Client */}
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                            {(c.client_name || 'A')[0].toUpperCase()}
                          </div>
                          <span>{c.client_name || 'Anonymous Client'}</span>
                        </div>
                      </td>

                      {/* Practice Area */}
                      <td className="p-4 text-slate-300 whitespace-nowrap">{c.practice_area}</td>

                      {/* Location */}
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {c.location || 'Addis Ababa'}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="p-4 max-w-xs truncate text-slate-400" title={c.situation_description}>
                        {c.situation_description}
                      </td>

                      {/* Budget / Urgency */}
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        <span className="text-[11px] block">{c.budget_range || 'ETB 1,000–2,000'}</span>
                        <span className="text-[10px] text-amber-400/80">{c.urgency || '24h'}</span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
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

                      {/* Quick Status Buttons */}
                      <td className="p-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                          <button
                            title="Approve"
                            disabled={actionLoadingId === c.id}
                            onClick={() => handleUpdateStatus(c.id, 'approved')}
                            className="px-2 py-1 hover:bg-blue-600/20 text-blue-400 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            title="Mark Completed"
                            disabled={actionLoadingId === c.id}
                            onClick={() => handleUpdateStatus(c.id, 'completed')}
                            className="px-2 py-1 hover:bg-emerald-600/20 text-emerald-400 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Complete
                          </button>
                          <button
                            title="Cancel"
                            disabled={actionLoadingId === c.id}
                            onClick={() => handleUpdateStatus(c.id, 'cancelled')}
                            className="px-2 py-1 hover:bg-red-600/20 text-red-400 rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>

                      {/* Delete */}
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
      </main>
    </div>
  );
}