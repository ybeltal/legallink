'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, ShieldCheck, CheckCircle2, Clock, Lock, Unlock, 
  Smartphone, MessageSquare, Video, Send, Loader2, RefreshCw, DollarSign, 
  User, MapPin, ExternalLink, ArrowRight, Award, LogOut, Check, AlertCircle, 
  ChevronRight, Calendar, FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdvocateWorkspace() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile');
  const [advocateTitle, setAdvocateTitle] = useState('Senior Federal Advocate • Corporate & Business Law');
  const [licenseNo, setLicenseNo] = useState('MOJ/FED/2019/8412');

  // Tab & Data State
  const [activeTab, setActiveTab] = useState<'cases' | 'payouts' | 'profile'>('cases');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'escrow_locked' | 'approved' | 'completed'>('all');

  // Live Consultation Room Modal State
  const [activeRoomCase, setActiveRoomCase] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load User & Advocate Data
  const fetchAdvocateData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile?.full_name) {
          setUserProfile(profile);
          setAdvocateName(profile.full_name);
        }
      }

      // Fetch all marketplace consultations
      const { data: casesData } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (casesData) setConsultations(casesData);

      // Fetch outbound Telebirr B2C payouts
      const { data: txData } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('status', 'payout_released')
        .order('created_at', { ascending: false });

      if (txData) setPayouts(txData);
    } catch (err) {
      console.error('Advocate data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocateData();

    const supabase = createClient();
    const caseChannel = supabase
      .channel('advocate_cases_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'consultations' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setConsultations((prev) =>
              prev.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c))
            );
            setActiveRoomCase((prev: any) =>
              prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev
            );
          } else if (payload.eventType === 'INSERT') {
            setConsultations((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    const payoutChannel = supabase
      .channel('advocate_payouts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'escrow_transactions' },
        (payload) => {
          if (payload.new.status === 'payout_released') {
            setPayouts((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(caseChannel);
      supabase.removeChannel(payoutChannel);
    };
  }, []);

  // Real-time Chat in Consultation Room
  useEffect(() => {
    if (activeRoomCase) {
      const caseId = activeRoomCase.id;
      setLoadingMessages(true);

      const supabase = createClient();
      const fetchChatHistory = async () => {
        const { data } = await supabase
          .from('consultation_messages')
          .select('*')
          .eq('consultation_id', caseId)
          .order('created_at', { ascending: true });

        if (data) setMessages(data);
        setLoadingMessages(false);
      };

      fetchChatHistory();

      const chatSub = supabase
        .channel(`advocate_chat_${caseId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'consultation_messages',
            filter: `consultation_id=eq.${caseId}`,
          },
          (payload) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(chatSub);
      };
    }
  }, [activeRoomCase]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeRoomCase]);

  const handleSendAdvocateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeRoomCase) return;

    setIsSendingMessage(true);
    try {
      const supabase = createClient();
      await supabase.from('consultation_messages').insert([
        {
          consultation_id: activeRoomCase.id,
          sender_name: advocateName,
          sender_role: 'advocate',
          message_text: newMessageText.trim(),
        },
      ]);
      setNewMessageText('');
    } catch (err) {
      alert('Could not deliver message to client.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Metrics Calculations (Advocate receives 85% of ETB 1,500 = ETB 1,275 per completed case)
  const totalEarnedETB = consultations
    .filter((c) => c.payment_status === 'released')
    .reduce((sum, c) => sum + (Number(c.escrow_amount || 1500) * 0.85), 0);

  const pendingInEscrowETB = consultations
    .filter((c) => c.payment_status === 'escrow_locked')
    .reduce((sum, c) => sum + (Number(c.escrow_amount || 1500) * 0.85), 0);

  const activeConsultationsCount = consultations.filter(
    (c) => c.status === 'approved' || c.payment_status === 'escrow_locked'
  ).length;

  const filteredCases = consultations.filter((c) => {
    if (statusFilter === 'escrow_locked') return c.payment_status === 'escrow_locked';
    if (statusFilter === 'approved') return c.status === 'approved';
    if (statusFilter === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* 1. ADVOCATE WORKSPACE HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain hover:scale-105 transition-transform" />
              <div>
                <span className="font-black text-lg text-white">Legal<span className="text-amber-400">Link</span></span>
                <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">Advocate Portal</span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 ml-4">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>MOJ Licensed Counsel</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdvocateData}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            {/* Advocate Identity Card */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                {advocateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight">{advocateName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{licenseNo}</span>
              </div>
            </div>

            <Link
              href="/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Marketplace ↗
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        
        {/* Banner with Advocate Status */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0A1128] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{advocateName}</h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              {advocateTitle}. Licensed under Ministry of Justice credential <strong className="text-slate-300 font-mono">{licenseNo}</strong>. Client retainers are held in regulatory escrow and disbursed upon consultation completion.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-center sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Settlement Channel</span>
              <span className="text-xs font-bold text-[#0072CE] flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                <Smartphone className="w-3.5 h-3.5" />
                Telebirr B2C Direct
              </span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Total Disbursed Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ETB {totalEarnedETB.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-500 block">85% net payout received via Telebirr</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Pending Escrow Retainers</span>
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              ETB {pendingInEscrowETB.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-500 block">Secured in trust, awaiting completion</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Active Consultations</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {activeConsultationsCount} Active
            </div>
            <span className="text-[11px] text-slate-500 block">Approved briefs & locked escrow cases</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Standard Retainer Split</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              85% / 15%
            </div>
            <span className="text-[11px] text-slate-500 block">ETB 1,275 net / ETB 225 LegalLink fee</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'cases' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Assigned Legal Cases ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'payouts' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Telebirr Payout Ledger ({payouts.length})
          </button>
        </div>

        {/* TAB 1: ASSIGNED CASES */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {[
                  { id: 'all', label: 'All Cases' },
                  { id: 'escrow_locked', label: 'Escrow Locked' },
                  { id: 'approved', label: 'Approved' },
                  { id: 'completed', label: 'Completed' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      statusFilter === f.id ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Showing {filteredCases.length} case{filteredCases.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.length === 0 ? (
                <div className="p-16 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-500 text-xs">
                  No cases match the selected filter.
                </div>
              ) : (
                filteredCases.map((c) => {
                  const isPaid = c.payment_status === 'escrow_locked' || c.payment_status === 'released';
                  const isSettled = c.payment_status === 'released';

                  return (
                    <div
                      key={c.id}
                      className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-base text-white">{c.practice_area}</span>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'approved'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : c.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {c.status || 'pending'}
                          </span>

                          {isSettled ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-400" />
                              <span>ETB 1,275 Payout Disbursed</span>
                            </span>
                          ) : isPaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-400" />
                              <span>Escrow Retainer Locked (ETB 1,500)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
                              Client Retainer Unpaid
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                          {c.situation_description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                          <span className="text-slate-300 font-sans font-semibold">Client: {c.client_name || 'Anonymous'}</span>
                          <span>📍 {c.location}</span>
                          <span>💰 Advocate Fee: ETB 1,275.00</span>
                          {c.transaction_ref && <span className="text-amber-400 font-bold">{c.transaction_ref}</span>}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                        <button
                          onClick={() => setActiveRoomCase(c)}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Enter Consultation Room</span>
                        </button>

                        <a
                          href={`https://meet.jit.si/legallink-case-${c.id.slice(0, 8)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Video</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 2: TELEBIRR PAYOUT LEDGER */}
        {activeTab === 'payouts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Direct Telebirr B2C Disbursements</h3>
                <p className="text-xs text-slate-400">
                  Transfers executed by LegalLink Trust directly to your Telebirr mobile wallet upon case completion.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300">
                {payouts.length} Disbursements
              </span>
            </div>

            {payouts.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No payouts disbursed yet. When the admin completes a case and releases escrow, your ETB 1,275 net transfers will log here.
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">{tx.transaction_ref}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Disbursed to Wallet
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px] block mt-1">
                        Advocate: {tx.client_name} • Account: Telebirr ({tx.phone_number})
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Net Received</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          ETB {Number(tx.amount_etb || 1275).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. ADVOCATE LIVE CONSULTATION ROOM MODAL */}
      {activeRoomCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {activeRoomCase.practice_area}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {activeRoomCase.payment_status === 'escrow_locked' ? 'Escrow Secured' : activeRoomCase.status}
                  </span>
                </div>
                <h3 className="font-black text-lg text-white mt-0.5">
                  Client: {activeRoomCase.client_name || 'Client'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://meet.jit.si/legallink-case-${activeRoomCase.id.slice(0, 8)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Video</span>
                </a>
                <button
                  onClick={() => setActiveRoomCase(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Case Brief Summary */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-300">
              <strong className="text-white block mb-0.5">Client Situation:</strong>
              <p className="line-clamp-2 text-slate-400">{activeRoomCase.situation_description}</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/60 min-h-[300px] max-h-[420px]">
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-500 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Connecting to client secure channel...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6">
                  <MessageSquare className="w-8 h-8 mb-2 opacity-30 text-amber-400" />
                  <span>No consultation messages in this thread yet. Send a greeting to the client below.</span>
                </div>
              ) : (
                messages.map((m) => {
                  const isAdvocate = m.sender_role === 'advocate';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdvocate ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px]">
                        <span className="font-bold text-slate-400">{m.sender_name}</span>
                        <span className="text-slate-500">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          isAdvocate
                            ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                        }`}
                      >
                        {m.message_text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAdvocateMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={`Advise client as ${advocateName}...`}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isSendingMessage || !newMessageText.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}