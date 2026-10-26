'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, ShieldCheck, Clock, Lock, CheckCircle2, DollarSign, 
  Calendar, Users, MessageSquare, Gavel, FileText, Volume2, Printer, 
  ExternalLink, AlertCircle, Check, X, ChevronRight, TrendingUp, Sparkles, 
  UploadCloud, LogOut, Settings, HelpCircle, BookOpen, Send, Mic, Play, Pause,
  Trash2, Search, Plus, Award, RefreshCw, Smartphone, Eye, ArrowLeft, Loader2,
  ShieldAlert, Info
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CaseBrief {
  id: string;
  client_name: string;
  practice_area: string;
  location: string;
  situation_description: string;
  escrow_amount: number;
  settlement_status: 'escrow_locked' | 'delivered' | 'released';
  case_stage: number;
  next_court_date: string | null;
  court_name: string | null;
  voice_note_url: string | null;
  voice_duration?: string;
  status: 'active' | 'pending_acceptance' | 'declined' | 'completed';
  is_synthetic: boolean;
}

const INITIAL_DEMO_CASES: CaseBrief[] = [
  {
    id: 'case-demo-101',
    client_name: 'Dawit Alemu (Synthetic Demo Client)',
    practice_area: 'Capital Markets & Securities',
    location: 'Addis Ababa',
    situation_description: '[DEMO RECORD] Restructuring tech logistics PLC into a Share Company (S.C.) pursuant to ECMA Directive 1030/2024 and Commercial Code Art. 495.',
    escrow_amount: 1500,
    settlement_status: 'escrow_locked',
    case_stage: 2,
    next_court_date: '2026-11-05',
    court_name: 'Federal High Court, Lideta Commercial Bench',
    voice_note_url: 'https://cdn.freesound.org/previews/synthetic_brief_sample.mp3',
    voice_duration: '01:24',
    status: 'active',
    is_synthetic: true
  },
  {
    id: 'case-demo-102',
    client_name: 'Bethlehem Tadesse (Synthetic Demo Client)',
    practice_area: 'Property & Real Estate',
    location: 'Bole, Addis Ababa',
    situation_description: '[DEMO RECORD] Commercial tenancy dispute in Bole. Landlord demanding unilateral 45% rent increment mid-lease.',
    escrow_amount: 1500,
    settlement_status: 'escrow_locked',
    case_stage: 1,
    next_court_date: null,
    court_name: null,
    voice_note_url: 'https://cdn.freesound.org/previews/synthetic_brief_sample_2.mp3',
    voice_duration: '00:52',
    status: 'pending_acceptance',
    is_synthetic: true
  }
];

export default function AdvocatePortalPage() {
  const [mounted, setMounted] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [advocateEmail, setAdvocateEmail] = useState('mulu.haile@lawfirm.et');
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile (Simulated Session)');
  const [licenseNo, setLicenseNo] = useState('ETH-BAR-2019-00421-DEMO');
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [isAvailableOnline, setIsAvailableOnline] = useState(true);

  // Active Tab: overview, cases, probono, bookstore, legaltalk, billing, settings
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'probono' | 'bookstore' | 'legaltalk' | 'billing' | 'settings'>('overview');

  // Audio Playback State for Docket Voice Briefs
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(28);

  // In-app Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const checkAuthAndApplication = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setAdvocateEmail(session.user.email);
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
          return;
        }
      }
      setVerificationStatus('approved');
    } catch {
      setVerificationStatus('approved');
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthAndApplication();
  }, []);

  const [cases, setCases] = useState<CaseBrief[]>(INITIAL_DEMO_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseBrief | null>(null);
  const [caseModalTab, setCaseModalTab] = useState<'brief' | 'hearings' | 'chat'>('brief');
  const [hearingDateInput, setHearingDateInput] = useState('2026-11-12');
  const [hearingCourtInput, setHearingCourtInput] = useState('Lideta Commercial Bench');

  const [caseChatMessages, setCaseChatMessages] = useState<any[]>([
    { id: 'm1', sender: 'Dawit Alemu (Demo Client)', role: 'client', text: 'Counsel, I also submitted an Amharic voice brief explaining the landlord dispute.' },
    { id: 'm2', sender: 'Advocate Mulu Haile', role: 'advocate', text: 'Received Dawit. I am listening to your audio recording now and cross-referencing Commercial Code Art. 495.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendCaseChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedCase) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: advocateName,
      role: 'advocate',
      text: chatInput.trim()
    };
    setCaseChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const handleAcceptCase = (caseId: string) => {
    setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status: 'active' } : c));
    showToast('Case brief accepted! Client notified.');
  };

  const handleDeclineCase = (caseId: string) => {
    setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status: 'declined' } : c));
    showToast('Consultation request declined.');
  };

  const handleAdvanceCaseStage = (newStage: number) => {
    if (!selectedCase) return;
    const updated = { ...selectedCase, case_stage: newStage };
    setSelectedCase(updated);
    setCases((prev) => prev.map((c) => c.id === selectedCase.id ? updated : c));
    showToast(`Docket advanced to Stage ${newStage}!`);
  };

  const handleSaveNextHearing = () => {
    if (!selectedCase || !hearingDateInput) return;
    const updated = {
      ...selectedCase,
      next_court_date: hearingDateInput,
      court_name: hearingCourtInput
    };
    setSelectedCase(updated);
    setCases((prev) => prev.map((c) => c.id === selectedCase.id ? updated : c));
    showToast('Court hearing schedule registered & dispatched to client SMS!');
  };

  const handleMarkConsultationDelivered = (caseId: string) => {
    setCases((prev) => prev.map((c) => {
      if (c.id === caseId) {
        return { ...c, settlement_status: 'delivered' };
      }
      return c;
    }));
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase({ ...selectedCase, settlement_status: 'delivered' });
    }
    showToast('Settlement voucher issued! Client requested to release Telebirr funds.');
  };

  const [proBonoHours, setProBonoHours] = useState<number>(26);
  const [proBonoLogs, setProBonoLogs] = useState<any[]>([
    { id: 'pb-1', matter: '[DEMO] Tenancy Rights Mediation (Addis Ketema)', hours: 8, date: '2026-09-14', category: 'Civil Mediation' },
    { id: 'pb-2', matter: '[DEMO] Unlawful Labor Termination Representation', hours: 18, date: '2026-10-02', category: 'Labor Law' }
  ]);
  const [newPbMatter, setNewPbMatter] = useState('');
  const [newPbHours, setNewPbHours] = useState(4);
  const [newPbCategory, setNewPbCategory] = useState('Labor Law');

  const handleAddProBonoLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPbMatter.trim()) return;
    const log = {
      id: `pb-${Date.now()}`,
      matter: `[DEMO] ${newPbMatter.trim()}`,
      hours: Number(newPbHours),
      category: newPbCategory,
      date: '2026-10-24'
    };
    setProBonoLogs([log, ...proBonoLogs]);
    setProBonoHours((prev) => prev + Number(newPbHours));
    setNewPbMatter('');
    showToast(`Logged ${newPbHours} pro bono hours! Bar audit badge updated.`);
  };

  const [books, setBooks] = useState<any[]>([
    {
      id: 'bk-1',
      title: 'Commentary on Ethiopian Commercial Code (Book II)',
      am_title: 'የኢትዮጵያ የንግድ ሕግ ማብራሪያና የሰበር ውሳኔዎች',
      price: 850,
      sold: 64,
      pickup: 'Arat Kilo Law Books Center, Addis Ababa'
    }
  ]);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAmTitle, setNewBookAmTitle] = useState('');
  const [newBookPrice, setNewBookPrice] = useState(650);
  const [newBookPickup, setNewBookPickup] = useState('Mexico Commercial Center, Addis Ababa');

  const handleListNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;
    const newBk = {
      id: `bk-${Date.now()}`,
      title: newBookTitle.trim(),
      am_title: newBookAmTitle.trim(),
      price: Number(newBookPrice),
      sold: 0,
      pickup: newBookPickup.trim()
    };
    setBooks([newBk, ...books]);
    setNewBookTitle('');
    setNewBookAmTitle('');
    showToast('Publication listed on LegalLink Bookstore!');
  };

  const [articles, setArticles] = useState<any[]>([
    {
      id: 'art-1',
      title: 'Prospectus Disclosure Standards under ECMA Directive 1030/2024',
      category: 'Capital Markets & Securities',
      readTime: '6 min read',
      publishedAt: '2026-10-20'
    }
  ]);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState('Capital Markets & Securities');
  const [newArtExcerpt, setNewArtExcerpt] = useState('');

  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtExcerpt.trim()) return;
    const art = {
      id: `art-${Date.now()}`,
      title: newArtTitle.trim(),
      category: newArtCategory,
      readTime: '5 min read',
      publishedAt: '2026-10-24'
    };
    setArticles([art, ...articles]);
    setNewArtTitle('');
    setNewArtExcerpt('');
    showToast('Article published to public LegalTalk Knowledge Hub!');
  };

  const [qaQuestions, setQaQuestions] = useState<any[]>([
    {
      id: 'qa-1',
      title: 'Can a PLC issue shares or raise equity under the new ECMA Directive 1030/2024?',
      category: 'Capital Markets & Securities',
      author: 'Yohannes T. (Synthetic Client)',
      answered: true
    },
    {
      id: 'qa-2',
      title: 'What are the required grounds for commercial lease eviction under Civil Code Art. 2896?',
      category: 'Property & Real Estate',
      author: 'Meron K. (Synthetic Client)',
      answered: false
    }
  ]);
  const [qaDrafts, setQaDrafts] = useState<Record<string, string>>({});

  const handlePublishQaAnswer = (qId: string) => {
    const text = qaDrafts[qId];
    if (!text || text.trim().length < 30) {
      alert('Answer must be at least 30 characters and cite statutory provisions.');
      return;
    }
    setQaQuestions((prev) => prev.map((q) => q.id === qId ? { ...q, answered: true } : q));
    showToast('Verified legal answer published to LegalTalk forum!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      
      {/* Privacy & Sandbox Banner */}
      <div className="bg-slate-900 text-amber-400 px-4 py-2.5 text-xs font-bold border-b border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>ADVOCATE DEMONSTRATION WORKSPACE:</span>
        </div>
        <span className="font-medium text-slate-300">
          You are viewing a demonstration docket featuring synthetic client inquiries, audio briefs, and simulated Telebirr escrow holdings.
        </span>
        <Link 
          href="/login" 
          className="underline font-bold text-white hover:text-amber-300 ml-1"
        >
          Sign In with Bar Account
        </Link>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0A1128] text-white rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
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
              ✓ MOJ Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAvailableOnline(!isAvailableOnline);
                showToast(isAvailableOnline ? 'Status: Offline' : 'Status: Online for Matches');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isAvailableOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailableOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>{isAvailableOnline ? 'Online for Cases' : 'Offline'}</span>
            </button>

            <Link href="/admin/verification" className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200">
              Admin Queue
            </Link>

            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
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
                { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
                { id: 'cases', label: `My Cases (${cases.length})`, icon: Briefcase },
                { id: 'billing', label: 'Billing & Settlement', icon: DollarSign },
                { id: 'probono', label: `Pro Bono Log (${proBonoHours}h)`, icon: Award },
                { id: 'bookstore', label: `Bookstore Desk (${books.length})`, icon: BookOpen },
                { id: 'legaltalk', label: 'LegalTalk Q&A Studio', icon: HelpCircle },
                { id: 'settings', label: 'Practice Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                      isSelected ? 'bg-[#0A1128] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-gradient-to-br from-[#0A1128] to-[#102A43] text-white p-5 rounded-3xl shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Bar Association Audit</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400">{proBonoHours} Hours</div>
            <span className="text-[11px] text-slate-300 block">Verified Pro Bono Legal Work</span>
          </div>
        </aside>

        {/* Modules */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Dockets</span>
                  <div className="text-2xl font-black text-[#0A1128] font-mono">{cases.filter((c) => c.status === 'active').length}</div>
                  <span className="text-[10px] text-emerald-700 font-bold block">In progress</span>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">In Escrow Holding</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono">ETB 3,000</div>
                  <span className="text-[10px] text-slate-400 block">Pre-authorized</span>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Client Rating</span>
                  <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1">4.95 ★</div>
                  <span className="text-[10px] text-slate-400 block">442 Verified Reviews</span>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Hourly Retainer</span>
                  <div className="text-2xl font-black text-[#0A1128] font-mono">ETB {hourlyRate}</div>
                  <span className="text-[10px] text-blue-600 font-bold block">Standard Rate</span>
                </div>
              </div>

              {/* Case Requests List */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-base text-[#0A1128]">Incoming Consultation Requests</h3>
                  <span className="text-xs text-slate-400">Pre-authorized via Telebirr Escrow</span>
                </div>

                <div className="space-y-3">
                  {cases.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold">{c.client_name}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A1128] text-amber-400">{c.practice_area}</span>
                          {c.voice_note_url && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                              <Mic className="w-3 h-3 text-amber-700" />
                              <span>Audio Brief ({c.voice_duration})</span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 line-clamp-2">{c.situation_description}</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {c.status === 'pending_acceptance' ? (
                          <>
                            <button onClick={() => handleAcceptCase(c.id)} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 cursor-pointer">
                              Accept Brief
                            </button>
                            <button onClick={() => handleDeclineCase(c.id)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 cursor-pointer">
                              Decline
                            </button>
                          </>
                        ) : (
                          <button onClick={() => { setSelectedCase(c); setActiveTab('cases'); }} className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl cursor-pointer">
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
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{c.situation_description}</p>
                      
                      {c.voice_note_url && (
                        <div className="pt-1 flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Includes Client Audio Brief ({c.voice_duration})</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Stage {c.case_stage || 1} of 6</span>
                      <button onClick={() => setSelectedCase(c)} className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl hover:bg-[#102A43] cursor-pointer">
                        Manage Docket ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRO BONO */}
          {activeTab === 'probono' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">BAR ACCREDITATION AUDIT</span>
                  <h2 className="text-xl font-black text-[#0A1128] mt-1">Pro Bono Hours Registry</h2>
                </div>
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold text-xs">
                  Total Logged: {proBonoHours} Hours
                </div>
              </div>

              <form onSubmit={handleAddProBonoLog} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs items-end">
                <div className="sm:col-span-6 space-y-1">
                  <label className="font-bold text-slate-700">Matter / Client Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenancy dispute mediation for low-income resident"
                    value={newPbMatter}
                    onChange={(e) => setNewPbMatter(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-3 space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newPbCategory}
                    onChange={(e) => setNewPbCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Labor Law">Labor Law</option>
                    <option value="Family Mediation">Family Mediation</option>
                    <option value="Civil Tenancy">Civil Tenancy</option>
                    <option value="Criminal Defense">Criminal Defense</option>
                  </select>
                </div>
                <div className="sm:col-span-1 space-y-1">
                  <label className="font-bold text-slate-700">Hours</label>
                  <input
                    type="number"
                    min={1}
                    value={newPbHours}
                    onChange={(e) => setNewPbHours(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="w-full py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-xs cursor-pointer">
                    + Log Hours
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {proBonoLogs.map((p) => (
                  <div key={p.id} className="p-4 border border-slate-200 rounded-2xl bg-white flex justify-between items-center text-xs">
                    <div>
                      <strong className="text-slate-900 block">{p.matter}</strong>
                      <span className="text-[11px] text-slate-400">{p.category} • Logged on {p.date}</span>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono font-bold rounded-full border border-emerald-200">
                      +{p.hours} Hours
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BOOKSTORE */}
          {activeTab === 'bookstore' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">AUTHOR MONETIZATION</span>
                <h2 className="text-xl font-black text-[#0A1128] mt-1">Advocate Legal Bookstore & Publications</h2>
              </div>

              <form onSubmit={handleListNewBook} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <strong className="block text-slate-800 font-bold">List a New Publication</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Book Title (English)"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Title in Amharic (የመጽሐፉ ርዕስ)"
                    value={newBookAmTitle}
                    onChange={(e) => setNewBookAmTitle(e.target.value)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Price in ETB"
                    value={newBookPrice}
                    onChange={(e) => setNewBookPrice(Number(e.target.value))}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Physical Pickup Location (Addis Ababa)"
                    value={newBookPickup}
                    onChange={(e) => setNewBookPickup(e.target.value)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <button type="submit" className="px-6 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs cursor-pointer">
                  Publish to Legal Bookstore
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((b) => (
                  <div key={b.id} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3 text-xs">
                    <div>
                      <h4 className="font-black text-sm text-[#0A1128]">{b.title}</h4>
                      {b.am_title && <span className="text-[11px] text-slate-500 block mt-0.5">{b.am_title}</span>}
                    </div>
                    <div className="flex justify-between items-center text-slate-700 font-mono">
                      <span>Price: <strong>ETB {b.price}</strong></span>
                      <span>Copies Circulated: <strong>{b.sold}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LEGALTALK */}
          {activeTab === 'legaltalk' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-8">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">EXPERT DESK & THOUGHT LEADERSHIP</span>
                <h2 className="text-xl font-black text-[#0A1128] mt-1">LegalTalk Studio & Q&A Console</h2>
              </div>

              <form onSubmit={handlePublishArticle} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <strong className="block text-slate-800 font-bold">Write New LegalTalk Article</strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Article Headline..."
                    value={newArtTitle}
                    onChange={(e) => setNewArtTitle(e.target.value)}
                    className="sm:col-span-2 p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                  <select
                    value={newArtCategory}
                    onChange={(e) => setNewArtCategory(e.target.value)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Capital Markets & Securities">Capital Markets & Securities</option>
                    <option value="Corporate & Business Law">Corporate & Business</option>
                    <option value="Property & Real Estate">Property & Real Estate</option>
                    <option value="Employment Law">Employment Law</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary citing statutory proclamation..."
                  value={newArtExcerpt}
                  onChange={(e) => setNewArtExcerpt(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                />
                <button type="submit" className="px-6 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs cursor-pointer">
                  Publish to Community Knowledge Hub
                </button>
              </form>

              <div className="space-y-4 pt-2">
                <span className="font-bold text-slate-700 uppercase text-[11px] block">Public Legal Questions</span>
                {qaQuestions.map((q) => (
                  <div key={q.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <h4 className="font-bold text-sm text-[#0A1128]">{q.title}</h4>
                    {q.answered ? (
                      <span className="text-emerald-700 font-bold block pt-1">✓ Verified answer published.</span>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={2}
                          value={qaDrafts[q.id] || ''}
                          onChange={(e) => setQaDrafts({ ...qaDrafts, [q.id]: e.target.value })}
                          placeholder="Provide statutory reference..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handlePublishQaAnswer(q.id)}
                          className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs cursor-pointer"
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

          {/* TAB 6: BILLING */}
          {activeTab === 'billing' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">TELEBIRR ESCROW SETTLEMENT</span>
                <h2 className="text-xl font-black text-[#0A1128] mt-1">Payout Ledger & Escrow Vault</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Balance</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1">ETB 14,250.00</div>
                  <span className="text-[10px] text-emerald-700 block">Ready to disburse</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">In Escrow Holding</span>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-1">ETB 3,000.00</div>
                  <span className="text-[10px] text-slate-400 block">2 active retainers</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Platform Fee</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-1">15%</div>
                  <span className="text-[10px] text-slate-400 block">85% net take-home</span>
                </div>
              </div>

              <button
                onClick={() => alert('Withdrawal request of ETB 14,250 dispatched to your Telebirr Business account.')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Request Telebirr / CBE Payout ➔
              </button>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-xs">
              <h2 className="text-xl font-black text-[#0A1128]">Advocate Profile & Retainer Settings</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
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
                    className="w-full p-2.5 bg-slate-100 border rounded-xl font-mono text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hourly Retainer Rate (ETB)</label>
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

      {/* CASE DOCKET & SETTLEMENT MODAL WITH VOICE BRIEF AUDIO PLAYER */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  CASE DOCKET MANAGER (DEMO)
                </span>
                <h3 className="font-black text-xl">{selectedCase.client_name}</h3>
                <span className="text-xs text-slate-300 font-mono">{selectedCase.practice_area}</span>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button 
                onClick={() => setCaseModalTab('brief')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'brief' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Case Intake Brief & Audio
              </button>
              <button 
                onClick={() => setCaseModalTab('hearings')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'hearings' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Litigation Stages & Hearings
              </button>
              <button 
                onClick={() => setCaseModalTab('chat')} 
                className={`py-3 border-b-2 cursor-pointer ${caseModalTab === 'chat' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
              >
                Client Chat Room
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
              
              {caseModalTab === 'brief' && (
                <div className="space-y-4">
                  
                  {/* TEXT DESCRIPTION */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <strong className="block text-slate-900 font-bold uppercase text-[10px]">Client Description</strong>
                    <p className="text-slate-700 leading-relaxed">{selectedCase.situation_description}</p>
                  </div>

                  {/* RESTORED: VOICE BRIEF AUDIO PLAYER */}
                  {selectedCase.voice_note_url && (
                    <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-amber-700" />
                          <strong className="text-amber-950 font-bold">Client Audio Brief (የድምፅ መግለጫ)</strong>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-amber-800">
                          {selectedCase.voice_duration || '01:24'}
                        </span>
                      </div>

                      {/* Interactive Audio Player Bar */}
                      <div className="bg-white p-3 rounded-xl border border-amber-200/80 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlayingAudio(!isPlayingAudio);
                            showToast(isPlayingAudio ? 'Audio playback paused' : 'Playing client voice recording');
                          }}
                          className="w-9 h-9 rounded-full bg-[#0A1128] text-amber-400 flex items-center justify-center hover:bg-[#102A43] transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>

                        <div className="flex-1 space-y-1">
                          {/* Simulated Audio Waveform Bar */}
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex items-center cursor-pointer">
                            <div 
                              className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                              style={{ width: isPlayingAudio ? '68%' : '28%' }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>{isPlayingAudio ? '00:45' : '00:18'}</span>
                            <span>{selectedCase.voice_duration || '01:24'}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] shrink-0">
                          Amharic Brief
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ESCROW STATUS */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <strong className="text-emerald-950 block">Telebirr Retainer Escrow</strong>
                      <span className="text-[11px] text-emerald-700">Status: {selectedCase.settlement_status === 'delivered' ? '✓ Voucher Issued' : 'Locked in Regulatory Trust'}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-900 text-sm">ETB {selectedCase.escrow_amount}</span>
                  </div>

                  {selectedCase.settlement_status === 'delivered' ? (
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-center">
                      ✓ Consultation Delivered — Client notified to confirm release.
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkConsultationDelivered(selectedCase.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Consultation Delivered (Release Payment Voucher)</span>
                    </button>
                  )}
                </div>
              )}

              {caseModalTab === 'hearings' && (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>Set Next Court Hearing (ቀጣይ ቀጠሮ)</span>
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
                        placeholder="Court Bench Name"
                        value={hearingCourtInput}
                        onChange={(e) => setHearingCourtInput(e.target.value)}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <button
                      onClick={handleSaveNextHearing}
                      className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43] cursor-pointer"
                    >
                      Save & Dispatch Client SMS
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 uppercase text-[11px] block">Advance Litigation Progress</span>
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
                        onClick={() => handleAdvanceCaseStage(st.step)}
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
                            Active
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
                    {caseChatMessages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.role === 'advocate' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400">{m.sender}</span>
                        <div className={`p-3 rounded-2xl text-xs max-w-sm ${
                          m.role === 'advocate' ? 'bg-[#0A1128] text-white' : 'bg-white border border-slate-200 text-slate-800'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>

                  <form onSubmit={handleSendCaseChat} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type instructions or document request..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128]"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#102A43] cursor-pointer">
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

      {/* Footer */}
      <footer className="bg-[#060B1A] text-slate-400 py-6 border-t border-slate-800 text-center text-xs mt-auto">
        LegalLink Advocate Portal • Ministry of Justice Regulatory Compliance • Addis Ababa, Ethiopia
      </footer>

    </div>
  );
}