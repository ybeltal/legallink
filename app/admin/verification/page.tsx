'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, FileText, 
  ExternalLink, Search, Filter, ArrowLeft, AlertCircle, 
  Eye, Scale, Check, X, Phone, Mail, Award, Landmark
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdvocateApplication {
  id: string;
  full_name: string;
  bar_license_number: string;
  phone_number: string;
  email: string;
  practice_areas: string[];
  experience_years: string;
  hourly_rate: number;
  bio: string;
  bar_license_url?: string | null;
  national_id_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const STATIC_INITIAL_APPLICATIONS: AdvocateApplication[] = [
  {
    id: 'app-001',
    full_name: 'Advocate Mulu Haile',
    bar_license_number: 'ETH-BAR-2018-0492',
    phone_number: '+251 91 140 2938',
    email: 'mulu.haile@legallink.et',
    practice_areas: ['Corporate & Business', 'Capital Markets & Securities'],
    experience_years: '8–12 years',
    hourly_rate: 1500,
    bio: 'Senior Federal Advocate specializing in ECMA Directive 1030/2024 compliance, commercial transactions, and Addis Ababa Chamber of Commerce arbitration.',
    bar_license_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    national_id_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'approved',
    created_at: '2026-10-22T08:30:00.000Z'
  },
  {
    id: 'app-002',
    full_name: 'Advocate Tigist Bekele',
    bar_license_number: 'ETH-BAR-2020-1104',
    phone_number: '+251 92 334 8812',
    email: 'tigist.bekele@lawfirm.et',
    practice_areas: ['Family Law', 'Employment Law', 'Civil Litigation'],
    experience_years: '4–7 years',
    hourly_rate: 1200,
    bio: 'Licensed Advocate with active appearance rights before Federal First Instance and High Courts. Expert in Labor Proclamation No. 1156/2019 disputes.',
    bar_license_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    national_id_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    created_at: '2026-10-23T10:15:00.000Z'
  },
  {
    id: 'app-003',
    full_name: 'Advocate Dawit Tesfaye',
    bar_license_number: 'ETH-BAR-2015-0081',
    phone_number: '+251 91 002 9944',
    email: 'dawit.tesfaye@counsel.et',
    practice_areas: ['Property & Real Estate', 'Tax Law'],
    experience_years: '13–20 years',
    hourly_rate: 1800,
    bio: 'Specialist in land holding rights, municipal lease transfers, and Cassation Division precedent applications across Addis Ababa sub-cities.',
    bar_license_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    national_id_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    created_at: '2026-10-24T06:00:00.000Z'
  }
];

export default function AdminVerificationPage() {
  const [applications, setApplications] = useState<AdvocateApplication[]>(STATIC_INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<AdvocateApplication | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadApplications() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('advocate_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setApplications(data as AdvocateApplication[]);
        }
      } catch (err) {
        // Retain fallback static list if database table is empty or offline
      }
    }
    loadApplications();
  }, []);

  const handleUpdateStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    setIsProcessing(true);
    try {
      const supabase = createClient();
      await supabase
        .from('advocate_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );

      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating advocate status:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.bar_license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone_number.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
              <span className="font-black text-xl text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider border border-slate-200">
              Compliance Desk
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link 
              href="/advocate" 
              className="font-bold text-slate-600 hover:text-[#0A1128] hidden sm:block"
            >
              Advocate Portal
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl hover:bg-[#102A43] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              REGULATORY AUDIT QUEUE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Advocate Ministry of Justice Verification
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Verify bar practicing certificates, Fayda national identification, and professional profiles before granting full access to client briefs and Telebirr escrow disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Pending Audits</span>
              <span className="text-xl font-bold text-amber-400">
                {applications.filter((a) => a.status === 'pending').length}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-700 mx-2" />
            <div>
              <span className="text-slate-400 block text-[10px]">Verified Active</span>
              <span className="text-xl font-bold text-emerald-400">
                {applications.filter((a) => a.status === 'approved').length}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by advocate name, license, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Applications */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Advocate Details</th>
                  <th className="py-4 px-6">Bar License</th>
                  <th className="py-4 px-6">Experience & Rate</th>
                  <th className="py-4 px-6">Practice Areas</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No advocate applications match your query.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <strong className="text-slate-900 block text-xs">{app.full_name}</strong>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                          <span>{app.phone_number}</span>
                          <span>•</span>
                          <span>{app.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {app.bar_license_number}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-800">{app.experience_years}</div>
                        <div className="font-mono text-[11px] text-emerald-700 font-bold">
                          ETB {app.hourly_rate.toLocaleString()} / hr
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.practice_areas.slice(0, 2).map((pa, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {pa}
                            </span>
                          ))}
                          {app.practice_areas.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{app.practice_areas.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          app.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : app.status === 'rejected'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {app.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {app.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {app.status === 'rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                          <span>{app.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-lg text-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-xs">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                  ADVOCATE COMPLIANCE DOSSIER
                </span>
                <h3 className="text-xl font-black text-[#0A1128] mt-0.5">{selectedApp.full_name}</h3>
                <span className="text-slate-400 font-mono text-[11px]">{selectedApp.bar_license_number}</span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone Contact</span>
                  <span className="text-slate-800 font-bold">{selectedApp.phone_number}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                  <span className="text-slate-800 font-bold">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Experience</span>
                  <span className="text-slate-800 font-bold">{selectedApp.experience_years}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hourly Retainer</span>
                  <span className="text-emerald-700 font-bold font-mono">ETB {selectedApp.hourly_rate.toLocaleString()} / hr</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Practice Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.practice_areas.map((pa, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {pa}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Professional Bio</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedApp.bio}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Uploaded Verification Files</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-slate-700">Bar Practicing License</span>
                    </div>
                    {selectedApp.bar_license_url ? (
                      <a 
                        href={selectedApp.bar_license_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-amber-600 hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Attached</span>
                    )}
                  </div>

                  <div className="p-3 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-700">Fayda National ID</span>
                    </div>
                    {selectedApp.national_id_url ? (
                      <a 
                        href={selectedApp.national_id_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Attached</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateStatus(selectedApp.id, 'rejected')}
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify Advocate</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Ethiopia • Ministry of Justice Compliance Desk • Bole Sub-City, Addis Ababa
      </footer>

    </div>
  );
}