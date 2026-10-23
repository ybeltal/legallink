'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Check, X, FileText, ExternalLink, RefreshCw, 
  Search, AlertCircle, Clock, CheckCircle2, User, Phone, Mail, 
  Briefcase, Scale, ArrowLeft, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminVerificationQueue() {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('advocate_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setApplications(data);
        if (!selectedApp && data.length > 0) {
          const firstPending = data.find((a) => a.status === 'pending') || data[0];
          setSelectedApp(firstPending);
        }
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedApp) return;

    setActionLoading(true);
    try {
      const supabase = createClient();
      const payload: any = {
        status,
        account_status: status === 'approved' ? 'active' : 'suspended',
        review_notes: reviewNote.trim() || (status === 'approved' ? 'Credentials verified with MOJ Registry' : 'Application declined'),
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'Compliance Admin Desk',
      };

      const { error } = await supabase
        .from('advocate_applications')
        .update(payload)
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Also update the linked profile if an account exists
      await supabase
        .from('profiles')
        .update({ 
          verification_status: status,
          is_verified: status === 'approved'
        })
        .eq('email', selectedApp.email);

      // Update local state
      const updated = { ...selectedApp, ...payload };
      setSelectedApp(updated);
      setApplications((prev) =>
        prev.map((app) => (app.id === selectedApp.id ? updated : app))
      );
      setReviewNote('');
      alert(`Advocate application successfully marked as ${status.toUpperCase()}!`);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filter === 'pending') return app.status === 'pending' || !app.status;
    return app.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#0A1128] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">Marketplace</span>
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span className="font-black text-sm tracking-wide">
                LegalLink <span className="text-amber-400">Admin Desk</span>
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              MOJ Verification Queue
            </span>
          </div>

          <button
            onClick={fetchApplications}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Queue</span>
          </button>
        </div>
      </header>

      {/* Main Split View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Applications List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Status Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 text-xs font-bold shadow-xs">
            {(['pending', 'approved', 'rejected'] as const).map((tab) => {
              const count = applications.filter((a) => (tab === 'pending' ? a.status === 'pending' || !a.status : a.status === tab)).length;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 py-2 rounded-xl capitalize transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    filter === tab
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filter === tab ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List Cards */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                Loading verification queue...
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
                No applications found in <span className="font-bold capitalize">{filter}</span> status.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-[#0A1128] bg-white ring-2 ring-[#0A1128]/10 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-[#0A1128]">{app.full_name}</h4>
                        <span className="text-[11px] font-mono text-slate-400 block">{app.bar_license_number}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : app.status === 'rejected'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {app.status || 'pending'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {(app.practice_areas || []).slice(0, 3).map((area: string) => (
                        <span key={area} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                          {area}
                        </span>
                      ))}
                      {(app.practice_areas || []).length > 3 && (
                        <span className="text-[10px] text-slate-400">+{app.practice_areas.length - 3}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Rate: <strong className="text-slate-700">ETB {app.hourly_rate}/hr</strong></span>
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Document Inspection Desk (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
              
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                    APPLICANT AUDIT DOSSIER
                  </span>
                  <h2 className="text-2xl font-black text-[#0A1128] mt-0.5">{selectedApp.full_name}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                    <span>{selectedApp.phone_number}</span>
                    <span>•</span>
                    <span>{selectedApp.email}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                  selectedApp.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : selectedApp.status === 'rejected'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {selectedApp.status || 'Pending Review'}
                </span>
              </div>

              {/* Core Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Bar License No.</span>
                  <strong className="font-mono text-slate-800 text-xs mt-0.5 block">{selectedApp.bar_license_number}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                  <strong className="text-slate-800 text-xs mt-0.5 block">{selectedApp.experience_years}</strong>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Requested Rate</span>
                  <strong className="font-mono text-slate-800 text-xs mt-0.5 block">ETB {selectedApp.hourly_rate} / hr</strong>
                </div>
              </div>

              {/* Practice Areas */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase text-[11px]">Declared Practice Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedApp.practice_areas || []).map((area: string) => (
                    <span key={area} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700 text-[11px]">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 uppercase text-[11px]">Professional Bio</span>
                <p className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 leading-relaxed italic">
                  "{selectedApp.bio}"
                </p>
              </div>

              {/* Uploaded Verification Documents */}
              <div className="space-y-3 pt-2">
                <span className="font-bold text-slate-700 uppercase text-[11px] block">
                  Uploaded Identity & Bar Credentials
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Bar License File */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>Bar License Copy</span>
                    </div>
                    {selectedApp.bar_license_url ? (
                      <a
                        href={selectedApp.bar_license_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1128] text-white rounded-xl text-[11px] font-bold hover:bg-[#102A43] transition-colors"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No document link stored</span>
                    )}
                  </div>

                  {/* National ID File */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>National ID / Fayda</span>
                    </div>
                    {selectedApp.national_id_url ? (
                      <a
                        href={selectedApp.national_id_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1128] text-white rounded-xl text-[11px] font-bold hover:bg-[#102A43] transition-colors"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No document link stored</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Audit Action Area */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Compliance Audit Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. MOJ Bar License verified against 2026 registry."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={actionLoading || selectedApp.status === 'rejected'}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading || selectedApp.status === 'approved'}
                    onClick={() => handleUpdateStatus('approved')}
                    className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Approve & Unlock Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              Select an application from the queue to inspect credentials.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}