'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, ShieldCheck, Clock, Lock, CheckCircle2, DollarSign, 
  Calendar, Users, MessageSquare, Gavel, FileText, Volume2, Printer, 
  ExternalLink, AlertCircle, Check, X, ChevronRight, TrendingUp, Sparkles, 
  UploadCloud, LogOut, Settings, HelpCircle, BookOpen, Send, Mic, Play, 
  Trash2, Search, Plus, Award, RefreshCw, Smartphone, Eye, ArrowLeft
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdvocatePortalPage() {
  // -------------------------------------------------------------
  // VERIFICATION & COMPLIANCE GATE STATE
  // -------------------------------------------------------------
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected' | 'loading'>('loading');
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile');
  const [licenseNo, setLicenseNo] = useState('ETH-BAR-2019-00421');
  const [rejectionNotes, setRejectionNotes] = useState<string | null>(null);

  // Active Workspace Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'documents' | 'billing' | 'legaltalk' | 'bookstore' | 'settings'>('overview');
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(1500);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // -------------------------------------------------------------
  // FETCH ADVOCATE CREDENTIALS & AUDIT STATUS
  // -------------------------------------------------------------
  const checkAdvocateAuthAndStatus = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        const { data: appData } = await supabase
          .from('advocate_applications')
          .select('*')
          .eq('email', session.user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (appData) {
          setVerificationStatus(appData.status || 'pending');
          if (appData.full_name) setAdvocateName(appData.full_name);
          if (appData.bar_license_number) setLicenseNo(appData.bar_license_number);
          if (appData.hourly_rate) setHourlyRate(Number(appData.hourly_rate));
          if (appData.review_notes) setRejectionNotes(appData.review_notes);
          return;
        }
      }
      // Default to approved in local development if no matching session application
      setVerificationStatus('approved');
    } catch (err) {
      console.error('Advocate verification check note:', err);
      setVerificationStatus('approved');
    }
  };

  useEffect(() => {
    checkAdvocateAuthAndStatus();
  }, []);

  // -------------------------------------------------------------
  // CASES & INTAKE STATE
  // -------------------------------------------------------------
  const [cases, setCases] = useState<any[]>([
    {
      id: 'c-101',
      client_name: 'Dawit Alemu',
      practice_area: 'Corporate & Business Law',
      location: 'Addis Ababa',
      situation_description: 'Need assistance restructuring PLC articles of association to allow new outside share subscription under the Commercial Code.',
      budget_range: 'ETB 1,000–2,000/hr',
      urgency: 'Within 24 hours',
      status: 'active',
      escrow_amount: 1500,
      case_stage: 2,
      next_court_date: '2026-11-05',
      court_name: 'Federal First Instance Court, Lideta Bench',
      voice_note_url: null,
      created_at: '2026-10-21T10:30:00Z',
    },
    {
      id: 'c-102',
      client_name: 'Bethlehem Tadesse',
      practice_area: 'Property & Real Estate',
      location: 'Bole, Addis Ababa',
      situation_description: 'Commercial premise lease dispute. Landlord is demanding a 40% mid-lease price increment contrary to registered lease terms.',
      budget_range: 'ETB 1,500/hr',
      urgency: 'Within 3 days',
      status: 'pending_acceptance',
      escrow_amount: 1500,
      case_stage: 1,
      next_court_date: null,
      court_name: null,
      voice_note_url: null,
      created_at: '2026-10-22T14:15:00Z',
    }
  ]);

  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [caseModalTab, setCaseModalTab] = useState<'details' | 'hearing' | 'chat' | 'evidence'>('details');

  // Hearing schedule input states
  const [hearingDateInput, setHearingDateInput] = useState('');
  const [hearingCourtInput, setHearingCourtInput] = useState('Lideta Bench, Federal First Instance Court');

  // Real-time Chat within Case
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 'm1', sender_name: 'Dawit Alemu', sender_role: 'client', message_text: 'Greetings Counsel. I have uploaded the draft minutes of our shareholder EGM.' },
    { id: 'm2', sender_name: 'Advocate Mulu Haile', sender_role: 'advocate', message_text: 'Thank you Dawit. I am reviewing the draft against Article 495 of the Commercial Code now.' }
  ]);
  const [newMsgText, setNewMsgText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caseModalTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, caseModalTab]);

  const handleSendAdvocateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim() || !selectedCase) return;

    const msg = {
      id: `m-${Date.now()}`,
      sender_name: advocateName,
      sender_role: 'advocate',
      message_text: newMsgText.trim(),
      created_at: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMsgText('');
  };

  const handleAcceptCase = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: 'active', case_stage: 1 } : c))
    );
    showToast('Case accepted! Client has been notified via SMS.');
  };

  const handleDeclineCase = (caseId: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: 'declined' } : c))
    );
    showToast('Brief declined.');
  };

  const handleUpdateCaseStage = (newStage: number) => {
    if (!selectedCase) return;
    const updated = { ...selectedCase, case_stage: newStage };
    setSelectedCase(updated);
    setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updated : c)));
    showToast(`Litigation docket advanced to Stage ${newStage}!`);
  };

  const handleSaveNextHearing = () => {
    if (!selectedCase || !hearingDateInput) return;
    const updated = { 
      ...selectedCase, 
      next_court_date: hearingDateInput,
      court_name: hearingCourtInput
    };
    setSelectedCase(updated);
    setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? updated : c)));
    showToast('Next court hearing schedule (ቀጣይ ቀጠሮ) saved and synced!');
  };

  // -------------------------------------------------------------
  // PRO BONO & THOUGHT LEADERSHIP (COMMUNITY & BOOKSTORE) STATE
  // -------------------------------------------------------------
  const [proBonoHours, setProBonoHours] = useState(26);
  const [proBonoLog, setProBonoLog] = useState<any[]>([
    { id: 'pb-1', client: 'Tenancy Rights Mediation (Addis Ketema)', hours: 8, date: '2026-09-14' },
    { id: 'pb-2', client: 'Unlawful Labor Termination Representation', hours: 18, date: '2026-10-02' }
  ]);

  // Bookstore items
  const [advocateBooks, setAdvocateBooks] = useState<any[]>([
    {
      id: 'bk-1',
      title: 'Commentary on Ethiopian Commercial Code (Book II)',
      amTitle: 'የኢትዮጵያ የንግድ ሕግ ማብራሪያና የሰበር ውሳኔዎች',
      priceETB: 850,
      copiesSold: 64,
      pickupLocation: 'Arat Kilo Law Books Center, Addis Ababa',
      year: '2025/2026'
    }
  ]);

  // LegalTalk Q&A Desk state
  const [openQuestions, setOpenQuestions] = useState<any[]>([
    {
      id: 'oq-1',
      title: 'Can a PLC issue outside equity under the new ECMA Directive 1030/2024?',
      category: 'Capital Markets & Securities',
      askedBy: 'Tech Founder (Kirkos)',
      answered: false
    },
    {
      id: 'oq-2',
      title: 'What notice period is legally required for commercial tenancy termination in Bole?',
      category: 'Property & Real Estate',
      askedBy: 'Retailer (Bole Medhanialem)',
      answered: true
    }
  ]);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  const handlePublishLegalAnswer = (qId: string) => {
    const text = answerDrafts[qId];
    if (!text || text.trim().length < 30) {
      alert('Answer must provide substantial legal analysis (at least 30 characters).');
      return;
    }
    setOpenQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, answered: true } : q))
    );
    showToast('Verified Answer published to public LegalTalk forum!');
  };

  // -------------------------------------------------------------
  // VIEW 1: LOADING STATE
  // -------------------------------------------------------------
  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <Scale className="w-10 h-10 text-amber-500 animate-pulse mx-auto" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
            Verifying Advocate Credentials...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: GATED LOCK SCREEN (PENDING MOJ COMPLIANCE AUDIT)
  // -------------------------------------------------------------
  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <header className="border-b border-slate-200 bg-white h-20 flex items-center px-6 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <div>
              <span className="font-black text-lg text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider">
                Advocate Verification
              </span>
            </div>
          </Link>
          <button 
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="text-xs font-bold text-slate-600 hover:text-red-600 cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </header>

        <main className="flex-1 max-w-xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
            <Clock className="w-9 h-9 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-200">
              Audit in Progress (24–48 Hours)
            </span>
            <h1 className="text-3xl font-black text-[#0A1128] mt-2">
              Your Application is Under Review
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Welcome, Counsel. Our Ministry of Justice compliance desk is currently validating your bar license credentials and uploaded identification.
            </p>
          </div>

          <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 text-left text-xs space-y-3 shadow-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-500">Counsel Name:</span>
              <strong className="text-slate-900">{advocateName}</strong>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-500">Bar License Number:</span>
              <strong className="font-mono text-slate-900">{licenseNo}</strong>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <span className="text-slate-500">Jurisdiction Tier:</span>
              <span className="text-slate-700 font-bold">Federal First Instance / High Court</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Verification Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ⏳ Pending Admin Approval
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed max-w-md">
            Once approved by our compliance team at <strong>/admin/verification</strong>, your full workspace (Active Cases, Hearing Docket, LegalTalk Publisher, and Escrow Payouts) will unlock immediately.
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Back to Homepage
            </Link>
            <Link
              href="/admin/verification"
              className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Open Admin Review Queue
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: REJECTED SCREEN
  // -------------------------------------------------------------
  if (verificationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
        <header className="border-b border-slate-200 bg-white h-20 flex items-center px-6 justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <span className="font-black text-lg text-[#0A1128]">Legal<span className="text-amber-500">Link</span></span>
          </Link>
        </header>
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <X className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-red-900">Application Declined</h1>
          <p className="text-xs text-slate-600">
            {rejectionNotes || 'Your bar credentials could not be verified against current Federal Ministry of Justice registers.'}
          </p>
          <Link href="/for-lawyers" className="inline-block px-6 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
            Submit New Application
          </Link>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 4: FULL UNLOCKED ADVOCATE WORKSPACE (APPROVED)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0A1128] text-white rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP ADVOCATE APP BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-black text-xl text-[#0A1128]">
                  Legal<span className="text-amber-500">Link</span>
                </span>
                <span className="text-[10px] block font-bold text-amber-600 uppercase tracking-widest">
                  Advocate Workspace
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              ✓ MOJ Licensed
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Availability Toggle */}
            <button
              onClick={() => {
                setIsAvailableOnline(!isAvailableOnline);
                showToast(isAvailableOnline ? 'Status: Offline' : 'Status: Online & Ready for Matches');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isAvailableOnline 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailableOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isAvailableOnline ? 'Online for Cases' : 'Offline'}</span>
            </button>

            <Link
              href="/admin/verification"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
            >
              Admin Queue
            </Link>

            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR (3 COLS) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow-sm">
                MH
              </div>
              <div className="truncate">
                <strong className="text-sm text-[#0A1128] block truncate">{advocateName}</strong>
                <span className="text-[10px] text-slate-400 font-mono block">{licenseNo}</span>
              </div>
            </div>

            <nav className="space-y-1 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview & Analytics', icon: TrendingUp },
                { id: 'cases', label: `My Cases (${cases.length})`, icon: Briefcase },
                { id: 'legaltalk', label: 'LegalTalk Q&A Desk', icon: HelpCircle },
                { id: 'bookstore', label: 'Legal Bookstore', icon: BookOpen },
                { id: 'billing', label: 'Billing & Telebirr Escrow', icon: DollarSign },
                { id: 'settings', label: 'Practice Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A1128] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Pro Bono Hours Card */}
          <div className="bg-gradient-to-br from-[#0A1128] to-[#102A43] text-white p-5 rounded-3xl shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Bar Service Audit
              </span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-emerald-400">{proBonoHours} hrs</div>
              <span className="text-[11px] text-slate-300">Verified Pro Bono Legal Work</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Compliant with Ethiopian Bar pro bono recommendations.
            </p>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA (9 COLS) */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Dockets</span>
                  <div className="text-2xl font-black text-[#0A1128] font-mono">
                    {cases.filter((c) => c.status === 'active').length}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block">In good standing</span>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Escrow Protected</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono">
                    ETB 3,000
                  </div>
                  <span className="text-[10px] text-slate-400 block">Pending release</span>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Client Rating</span>
                  <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">
                    4.95 <span className="text-xs">★</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">442 Verified Reviews</span>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hourly Retainer</span>
                  <div className="text-2xl font-black text-[#0A1128] font-mono">
                    ETB {hourlyRate}
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold block">Standard Rate</span>
                </div>
              </div>

              {/* Next Court Hearing Banner */}
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-amber-800" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Upcoming Court Hearing (ቀጣይ ቀጠሮ)
                    </span>
                  </div>
                  <h4 className="font-black text-base text-[#0A1128]">
                    Dawit Alemu vs. Shareholder Restructuring Bench
                  </h4>
                  <p className="text-xs text-slate-600">
                    November 5, 2026 at Federal First Instance Court, Lideta Bench
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCase(cases[0]);
                    setActiveTab('cases');
                    setCaseModalTab('hearing');
                  }}
                  className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43] whitespace-nowrap"
                >
                  View Docket
                </button>
              </div>

              {/* Recent Incoming Matching Requests */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-base text-[#0A1128]">Incoming Consultation Requests</h3>
                  <span className="text-xs text-slate-400">Pre-authorized via Telebirr USSD</span>
                </div>

                <div className="space-y-3">
                  {cases.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold">{c.client_name}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A1128] text-amber-400">
                            {c.practice_area}
                          </span>
                          <span className="text-slate-400 text-[11px]">• {c.location}</span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{c.situation_description}</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {c.status === 'pending_acceptance' ? (
                          <>
                            <button
                              onClick={() => handleAcceptCase(c.id)}
                              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500"
                            >
                              Accept Brief
                            </button>
                            <button
                              onClick={() => handleDeclineCase(c.id)}
                              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCase(c);
                              setActiveTab('cases');
                            }}
                            className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl"
                          >
                            Open Case
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY CASES */}
          {activeTab === 'cases' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-[#0A1128]">Active Client Dockets</h2>
                <span className="text-xs text-slate-500 font-medium">{cases.length} cases registered</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cases.map((c) => (
                  <div key={c.id} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {c.practice_area}
                        </span>
                        <span className="font-mono font-bold text-xs text-emerald-700">
                          ETB {c.escrow_amount}
                        </span>
                      </div>
                      <h3 className="font-black text-base text-[#0A1128]">{c.client_name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {c.situation_description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Stage {c.case_stage || 1} of 6</span>
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl hover:bg-[#102A43] cursor-pointer"
                      >
                        Manage Docket ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LEGALTALK Q&A DESK */}
          {activeTab === 'legaltalk' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                  PRO BONO & PUBLIC AUTHORITY
                </span>
                <h2 className="text-xl font-black text-[#0A1128] mt-1">LegalTalk Q&A Expert Desk</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Answer questions posted by Ethiopian citizens and founders. Verified answers appear on the public marketplace with your consultation booking button.
                </p>
              </div>

              <div className="space-y-6">
                {openQuestions.map((q) => (
                  <div key={q.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {q.category}
                      </span>
                      <span className="text-[11px] text-slate-400">Asked by {q.askedBy}</span>
                    </div>

                    <h4 className="font-bold text-sm text-[#0A1128]">{q.title}</h4>

                    {q.answered ? (
                      <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>You have published an official verified answer for this inquiry.</span>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">
                          Write Statutory Counsel (Directives & Codes)
                        </label>
                        <textarea
                          rows={3}
                          value={answerDrafts[q.id] || ''}
                          onChange={(e) => setAnswerDrafts({ ...answerDrafts, [q.id]: e.target.value })}
                          placeholder="Provide statutory reference e.g., Under Commercial Code Art. 495 or ECMA Directive 1030/2024..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                        />
                        <button
                          type="button"
                          onClick={() => handlePublishLegalAnswer(q.id)}
                          className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                        >
                          Publish Verified Answer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL BOOKSTORE */}
          {activeTab === 'bookstore' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                    MONETIZE YOUR EXPERTISE
                  </span>
                  <h2 className="text-xl font-black text-[#0A1128] mt-1">Advocate Legal Bookstore</h2>
                  <p className="text-xs text-slate-500">
                    List legal textbooks, case law monographs, and Cassation Bench commentaries.
                  </p>
                </div>
                <button
                  onClick={() => alert('New publication form opened.')}
                  className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>List New Book</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advocateBooks.map((bk) => (
                  <div key={bk.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-3 text-xs">
                    <div>
                      <h4 className="font-black text-sm text-[#0A1128]">{bk.title}</h4>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{bk.amTitle}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-700 font-mono pt-1">
                      <span>Price: <strong>ETB {bk.priceETB}</strong></span>
                      <span>Sold: <strong>{bk.copiesSold} copies</strong></span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500">
                      📍 Pickup/Dispatch: {bk.pickupLocation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BILLING & TELEBIRR ESCROW */}
          {activeTab === 'billing' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                  TRUST & TELEBIRR SETTLEMENT
                </span>
                <h2 className="text-xl font-black text-[#0A1128] mt-1">Escrow & Payout Ledger</h2>
                <p className="text-xs text-slate-500">
                  Every consultation retainer is pre-authorized in Telebirr escrow and disbursed directly to your account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Balance</span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">ETB 14,250.00</div>
                  <span className="text-[10px] text-emerald-700 block">Ready to withdraw</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">In Escrow Holding</span>
                  <div className="text-xl font-black text-amber-600 font-mono mt-1">ETB 3,000.00</div>
                  <span className="text-[10px] text-slate-400 block">2 active consultations</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform Fee Rate</span>
                  <div className="text-xl font-black text-slate-900 font-mono mt-1">15%</div>
                  <span className="text-[10px] text-slate-400 block">85% net take-home</span>
                </div>
              </div>

              <button
                onClick={() => alert('Withdrawal request of ETB 14,250 dispatched to your Telebirr Business account.')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Request Telebirr / CBE Payout ➔
              </button>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-xs">
              <h2 className="text-xl font-black text-[#0A1128]">Advocate Profile & Retainer Settings</h2>
              
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={advocateName}
                    onChange={(e) => setAdvocateName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bar License Number</label>
                  <input
                    type="text"
                    disabled
                    value={licenseNo}
                    className="w-full p-2.5 bg-slate-100 border rounded-xl text-slate-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Verified by Ministry of Justice Compliance Desk</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Hourly Retainer (ETB)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Profile settings saved successfully.')}
                  className="px-6 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. CASE DETAIL & LITIGATION MODAL (DOCKET MANAGER) */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  CASE DOCKET MANAGER
                </span>
                <h3 className="font-black text-xl">{selectedCase.client_name}</h3>
                <span className="text-xs text-slate-300 font-mono">{selectedCase.practice_area}</span>
              </div>
              <button 
                onClick={() => setSelectedCase(null)} 
                className="text-white/70 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button 
                onClick={() => setCaseModalTab('details')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'details' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Case Intake Brief
              </button>
              <button 
                onClick={() => setCaseModalTab('hearing')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'hearing' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Hearings & Litigation Stages
              </button>
              <button 
                onClick={() => setCaseModalTab('chat')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'chat' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Client Chat Room
              </button>
            </div>

            {/* Modal Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              
              {caseModalTab === 'details' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <strong className="block text-slate-900 font-bold uppercase text-[10px]">Client Situation Description</strong>
                    <p className="text-slate-700 leading-relaxed">{selectedCase.situation_description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Client Location</span>
                      <strong className="text-slate-900">{selectedCase.location}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Escrow Amount</span>
                      <strong className="text-emerald-700 font-mono">ETB {selectedCase.escrow_amount} (Protected)</strong>
                    </div>
                  </div>
                </div>
              )}

              {caseModalTab === 'hearing' && (
                <div className="space-y-6">
                  {/* Set Court Hearing */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>Schedule Next Court Hearing (ቀጣይ ቀጠሮ)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={hearingDateInput}
                        onChange={(e) => setHearingDateInput(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Court Bench Name e.g. Lideta 4th Bench"
                        value={hearingCourtInput}
                        onChange={(e) => setHearingCourtInput(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveNextHearing}
                      className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43]"
                    >
                      Save & Dispatch Client SMS
                    </button>
                  </div>

                  {/* 6 Litigation Stages Stepper */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 uppercase text-[11px] block">
                      Advance Litigation Progress
                    </span>
                    {[
                      { step: 1, title: 'Case Intake & Evidence Audit' },
                      { step: 2, title: 'Pleadings & Statement of Claim Drafted' },
                      { step: 3, title: 'Court Registry & Summons Served' },
                      { step: 4, title: 'Preliminary Objections & Statement of Defense' },
                      { step: 5, title: 'Witness Hearing & Cross-Examination' },
                      { step: 6, title: 'Final Judgment & Execution Decree' }
                    ].map((st) => (
                      <div
                        key={st.step}
                        onClick={() => handleUpdateCaseStage(st.step)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          st.step <= (selectedCase.case_stage || 1)
                            ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            st.step <= (selectedCase.case_stage || 1) ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {st.step}
                          </span>
                          <span>{st.title}</span>
                        </div>
                        {st.step === selectedCase.case_stage && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Active Stage
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {caseModalTab === 'chat' && (
                <div className="space-y-3">
                  <div className="h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto space-y-2.5">
                    {chatMessages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.sender_role === 'advocate' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400">{m.sender_name}</span>
                        <div className={`p-3 rounded-2xl text-xs max-w-sm ${
                          m.sender_role === 'advocate' ? 'bg-[#0A1128] text-white' : 'bg-white border border-slate-200 text-slate-800'
                        }`}>
                          {m.message_text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  <form onSubmit={handleSendAdvocateMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type legal instructions or questions..."
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#102A43] cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="bg-[#060B1A] text-slate-400 py-6 border-t border-slate-800 text-center text-xs mt-auto">
        LegalLink Advocate Portal • Ministry of Justice Regulatory Compliance • Addis Ababa, Ethiopia
      </footer>

    </div>
  );
}