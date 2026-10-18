'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, ShieldCheck, CheckCircle2, Clock, Lock, Unlock, 
  Smartphone, MessageSquare, Video, Send, Loader2, RefreshCw, DollarSign, 
  User, MapPin, ExternalLink, ArrowRight, Award, LogOut, Check, AlertCircle, 
  ChevronRight, Calendar, FileText, Paperclip, UploadCloud, Download
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdvocateWorkspace() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile');
  const [advocateTitle, setAdvocateTitle] = useState('Senior Federal Advocate • Corporate & Business Law');
  const [licenseNo, setLicenseNo] = useState('MOJ/FED/2019/8412');

  // Tab & Data State
  const [activeTab, setActiveTab] = useState<'cases' | 'payouts'>('cases');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'escrow_locked' | 'approved' | 'completed'>('all');

  // Live Consultation Room Modal State
  const [activeRoomCase, setActiveRoomCase] = useState<any | null>(null);
  const [roomModalTab, setRoomModalTab] = useState<'chat' | 'documents'>('chat');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Evidence & Case Documents State
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const fetchAdvocateData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
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

      const { data: casesData } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (casesData) setConsultations(casesData);

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

  const fetchCaseDocuments = async (consultationId: string) => {
    setLoadingDocs(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('case_documents')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCaseDocuments(data);
      }
    } catch (err) {
      console.error('Error fetching advocate documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleAdvocateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoomCase) return;

    setIsUploadingFile(true);
    try {
      const supabase = createClient();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${activeRoomCase.id}/${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('case-documents')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('case-documents')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const { data: newDocRecord, error: insertError } = await supabase
        .from('case_documents')
        .insert([
          {
            consultation_id: activeRoomCase.id,
            file_name: file.name,
            file_url: publicUrl,
            file_size: formattedSize,
            uploader_name: advocateName,
            uploader_role: 'advocate',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (newDocRecord) {
        setCaseDocuments((prev) => [newDocRecord, ...prev]);
      }
      alert('Document uploaded and shared with client.');
    } catch (err: any) {
      alert('Failed to upload document: ' + (err.message || 'Storage error'));
    } finally {
      setIsUploadingFile(false);
      if (fileUploadInputRef.current) {
        fileUploadInputRef.current.value = '';
      }
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

  useEffect(() => {
    if (activeRoomCase) {
      const caseId = activeRoomCase.id;
      fetchCaseDocuments(caseId);

      const supabase = createClient();
      setLoadingMessages(true);
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

      const docsSub = supabase
        .channel(`advocate_docs_${caseId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'case_documents',
            filter: `consultation_id=eq.${caseId}`,
          },
          (payload) => {
            setCaseDocuments((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(chatSub);
        supabase.removeChannel(docsSub);
      };
    }
  }, [activeRoomCase]);

  useEffect(() => {
    if (roomModalTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, roomModalTab]);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 1. TOP HEADER - ALIGNED WITH LANDING PAGE */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain hover:scale-105 transition-transform" />
              <div>
                <span className="font-black text-xl tracking-tight text-[#0A1128]">
                  Legal<span className="text-amber-500">Link</span>
                </span>
                <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">Advocate Portal</span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 ml-4">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>MOJ Licensed Counsel</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdvocateData}
              disabled={loading}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Sync Pipeline</span>
            </button>

            {/* Advocate Identity Card */}
            <div className="flex items-center gap-2.5 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-xs">
                {advocateName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-[#0A1128] block leading-tight">{advocateName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{licenseNo}</span>
              </div>
            </div>

            <Link
              href="/"
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#0A1128] border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Marketplace ↗
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        
        {/* Banner with Executive Navy Styling */}
        <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{advocateName}</h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {advocateTitle}. Verified under Ministry of Justice credential <strong className="text-amber-400 font-mono">{licenseNo}</strong>. Client retainers are held in regulatory escrow and disbursed upon consultation delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-center sm:text-right">
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
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Total Disbursed Earnings</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              ETB {totalEarnedETB.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-400 block">85% net payout received via Telebirr</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Pending Escrow Retainers</span>
              <Lock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              ETB {pendingInEscrowETB.toLocaleString()}.00
            </div>
            <span className="text-[11px] text-slate-400 block">Secured in trust, awaiting completion</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Active Consultations</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-[#0A1128]">
              {activeConsultationsCount} Active
            </div>
            <span className="text-[11px] text-slate-400 block">Approved briefs & locked escrow cases</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Standard Retainer Split</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-[#0A1128] font-mono">
              85% / 15%
            </div>
            <span className="text-[11px] text-slate-400 block">ETB 1,275 net / ETB 225 LegalLink fee</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'cases' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Assigned Legal Cases ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'payouts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Telebirr Payout Ledger ({payouts.length})
          </button>
        </div>

        {/* TAB 1: ASSIGNED CASES */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
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
                      statusFilter === f.id ? 'bg-[#0A1128] text-white font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500">
                Showing {filteredCases.length} case{filteredCases.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Cases List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredCases.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  No cases match the selected filter.
                </div>
              ) : (
                filteredCases.map((c) => {
                  const isPaid = c.payment_status === 'escrow_locked' || c.payment_status === 'released';
                  const isSettled = c.payment_status === 'released';

                  return (
                    <div
                      key={c.id}
                      className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-slate-300 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-base text-[#0A1128]">{c.practice_area}</span>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'approved'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : c.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {c.status || 'pending'}
                          </span>

                          {isSettled ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-600" />
                              <span>ETB 1,275 Payout Disbursed</span>
                            </span>
                          ) : isPaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Escrow Retainer Locked (ETB 1,500)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                              Client Retainer Unpaid
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                          {c.situation_description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                          <span className="text-slate-700 font-semibold font-sans">Client: {c.client_name || 'Anonymous'}</span>
                          <span>📍 {c.location}</span>
                          <span>💰 Advocate Fee: ETB 1,275.00</span>
                          {c.transaction_ref && <span className="text-amber-600 font-bold">{c.transaction_ref}</span>}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        <button
                          onClick={() => {
                            setActiveRoomCase(c);
                            setRoomModalTab('chat');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Enter Consultation Room</span>
                        </button>

                        <a
                          href={`https://meet.jit.si/legallink-case-${c.id.slice(0, 8)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
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
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0A1128]">Direct Telebirr B2C Disbursements</h3>
                <p className="text-xs text-slate-500">
                  Transfers executed by LegalLink Trust directly to your Telebirr mobile wallet upon case completion.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700">
                {payouts.length} Disbursements
              </span>
            </div>

            {payouts.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No payouts disbursed yet. When the admin completes a case and releases escrow, your ETB 1,275 net transfers will log here.
              </div>
            ) : (
              <div className="space-y-3">
                {payouts.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0A1128]">{tx.transaction_ref}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Disbursed to Wallet
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] block mt-1">
                        Advocate: {tx.client_name} • Account: Telebirr ({tx.phone_number})
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">Net Received</span>
                        <span className="font-mono font-black text-emerald-600 text-sm">
                          ETB {Number(tx.amount_etb || 1275).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
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

      {/* 3. ADVOCATE LIVE CONSULTATION ROOM & EVIDENCE VAULT MODAL */}
      {activeRoomCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {activeRoomCase.practice_area}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/20 text-white">
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
                  className="p-1.5 text-white/70 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Sub-Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button
                onClick={() => setRoomModalTab('chat')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  roomModalTab === 'chat' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Room & Chat</span>
              </button>
              <button
                onClick={() => setRoomModalTab('documents')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  roomModalTab === 'documents' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Evidence Vault ({caseDocuments.length})</span>
              </button>
            </div>

            {/* SUB-TAB 1: LIVE ROOM & CHAT */}
            {roomModalTab === 'chat' && (
              <>
                <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-700">
                  <strong className="text-[#0A1128] block mb-0.5">Client Brief:</strong>
                  <p className="line-clamp-2 text-slate-600">{activeRoomCase.situation_description}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 min-h-[300px] max-h-[420px]">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#0A1128]" />
                      <span>Connecting to client secure channel...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-30 text-amber-500" />
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
                            <span className="font-bold text-slate-500">{m.sender_name}</span>
                            <span className="text-slate-400">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div
                            className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                              isAdvocate
                                ? 'bg-[#0A1128] text-white font-medium rounded-tr-none'
                                : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
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

                <form onSubmit={handleSendAdvocateMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    placeholder={`Advise client as ${advocateName}...`}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !newMessageText.trim()}
                    className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3 text-amber-400" />
                  </button>
                </form>
              </>
            )}

            {/* SUB-TAB 2: EVIDENCE VAULT & ADVOCATE UPLOADS */}
            {roomModalTab === 'documents' && (
              <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                
                <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A1128] text-sm">Upload Legal Brief or Document Review</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Upload formal legal counsel memos, contract amendments, or court motions for the client.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileUploadInputRef}
                    onChange={handleAdvocateFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                  />

                  <button
                    type="button"
                    disabled={isUploadingFile}
                    onClick={() => fileUploadInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow transition-all"
                  >
                    {isUploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Uploading Document...</span>
                      </>
                    ) : (
                      <>
                        <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload Advocate Memo (PDF, DOCX)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-slate-700 uppercase text-[11px]">
                    Case Document Ledger ({caseDocuments.length})
                  </h5>

                  {loadingDocs ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2 text-[#0A1128]" />
                      Loading case files...
                    </div>
                  ) : caseDocuments.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                      No documents uploaded for this case yet. Client documents will sync here automatically.
                    </div>
                  ) : (
                    caseDocuments.map((doc) => {
                      const isClient = doc.uploader_role === 'client';
                      return (
                        <div
                          key={doc.id}
                          className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isClient ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <strong className="text-slate-900 block text-xs">{doc.file_name}</strong>
                              <span className="text-[10px] text-slate-400">
                                Size: {doc.file_size || 'File'} • Uploaded by: <span className={isClient ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                                  {doc.uploader_name} ({isClient ? 'Client' : 'Advocate'})
                                </span>
                              </span>
                            </div>
                          </div>

                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] font-bold rounded-lg text-xs cursor-pointer transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>Download</span>
                          </a>
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}