'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Scale,
  FileText,
  BookOpen,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Plus,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';

interface ClientBooking {
  id: string;
  lawyer_name: string;
  practice_area: string;
  consultation_date: string;
  consultation_time: string;
  brief_description: string;
  booking_status: string;
  created_at: string;
}

export default function ClientDashboardPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Member');
  const [bookings, setBookings] = useState<ClientBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadClientData = async () => {
    setRefreshing(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user || !user.email) {
        setUserEmail(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const email = user.email.trim().toLowerCase();
      const meta = user.user_metadata || {};
      setUserEmail(email);
      setUserName(meta.full_name || meta.first_name || email.split('@')[0] || 'Member');

      const { data } = await supabase
        .from('consultation_bookings')
        .select('*')
        .ilike('client_email', email)
        .order('created_at', { ascending: false });

      if (data) {
        setBookings(data as ClientBooking[]);
      }
    } catch (err) {
      console.error('Error loading client dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClientData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter((b) => !b.booking_status || b.booking_status === 'pending').length,
      confirmed: bookings.filter((b) => b.booking_status === 'confirmed').length,
      completed: bookings.filter((b) => b.booking_status === 'completed').length,
    };
  }, [bookings]);

  const getStepIndex = (status: string) => {
    if (status === 'completed') return 3;
    if (status === 'confirmed') return 2;
    return 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs font-mono text-slate-500">
          Loading Your LegalLink Workspace...
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-black text-[#0A1128]">Sign In to Track Your Inquiries</h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log in with the email address you used when submitting a consultation request to view live advocate updates and manage your legal support in one place.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/login?redirect=/dashboard"
                className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl"
              >
                Sign In to My Dashboard
              </Link>
              <Link
                href="/find-a-lawyer"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Start a New Consultation Request
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <Navbar />

      {/* Top Header */}
      <section className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Continuity Workspace</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] pt-1">
                Welcome back, {userName}
              </h1>
              <p className="text-xs text-slate-500 font-mono">{userEmail}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadClientData}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
              <Link
                href="/find-a-lawyer"
                className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>New Inquiry</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Inquiries</span>
              <strong className="text-xl font-black text-[#0A1128]">{stats.total}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Pending Review</span>
              <strong className="text-xl font-black text-amber-700">{stats.pending}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Advocate Accepted</span>
              <strong className="text-xl font-black text-emerald-700">{stats.confirmed}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Completed</span>
              <strong className="text-xl font-black text-blue-700">{stats.completed}</strong>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Live Inquiry Tracker */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#0A1128]">My Consultation Inquiries</h2>
              <span className="text-xs text-slate-500">Live updates synced with your advocate</span>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0A1128]">No Consultation Requests Yet</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    When you request a free consultation on Find a Lawyer using <strong>{userEmail}</strong>, it will appear right here with live status updates.
                  </p>
                </div>
                <Link
                  href="/find-a-lawyer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl"
                >
                  <span>Find a Verified Advocate</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => {
                  const status = b.booking_status || 'pending';
                  const stepIdx = getStepIndex(status);
                  const isDeclined = status === 'declined';

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px]">
                              LL-{String(b.id).slice(0, 6).toUpperCase()}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(b.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-[#0A1128]">{b.practice_area}</h3>
                          <p className="text-slate-600">
                            Assigned Advocate: <strong className="text-[#0A1128]">{b.lawyer_name}</strong> •{' '}
                            <span>{b.consultation_time}</span>
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                            status === 'completed'
                              ? 'bg-blue-100 text-blue-900'
                              : status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : isDeclined
                              ? 'bg-red-100 text-red-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {status === 'confirmed'
                            ? 'Advocate Accepted'
                            : status === 'completed'
                            ? 'Completed'
                            : isDeclined
                            ? 'Declined'
                            : 'Pending Review'}
                        </span>
                      </div>

                      <p className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                        {b.brief_description}
                      </p>

                      {!isDeclined ? (
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] font-bold">
                          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                            1. Submitted
                          </div>
                          <div
                            className={`p-2 rounded-xl border ${
                              stepIdx >= 2
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            2. Advocate Accepted
                          </div>
                          <div
                            className={`p-2 rounded-xl border ${
                              stepIdx >= 3
                                ? 'bg-blue-50 text-blue-900 border-blue-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            3. Completed
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center justify-between gap-2">
                          <span>This advocate could not take this inquiry right now.</span>
                          <Link href="/find-a-lawyer" className="font-bold underline shrink-0">
                            Choose Another Advocate →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Continuity Quick Tools */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs">
              <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block">
                Your Legal Toolkit
              </strong>

              <Link
                href="/lexdraft"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  Draft Bilingual Forms (LexDraft)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/legal-center"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Legal Center &amp; Dictionary
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/library"
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  122 Ethiopian Proclamations
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            <div className="bg-[#0A1128] text-white rounded-3xl p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Clock className="w-4 h-4" />
                <span>Need Support?</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Reach the LegalLink Ethiopia desk at{' '}
                <strong className="text-white">info.legallinkethiopia@gmail.com</strong> or call{' '}
                <strong className="text-white">+251-964-600-737</strong>.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com</p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private, RLS-Protected Client Workspace</span>
          </p>
        </div>
      </footer>
    </div>
  );
}