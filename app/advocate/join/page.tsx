'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, ShieldCheck, CheckCircle2, Clock, Lock, Unlock, 
  Smartphone, MessageSquare, Video, Send, Loader2, RefreshCw, DollarSign, 
  User, MapPin, ExternalLink, ArrowRight, Award, LogOut, Check, AlertCircle, 
  ChevronRight, Calendar, FileText, Paperclip, UploadCloud, Download, X,
  Gavel, ArrowUpRight, Mic, Play, Volume2, HelpCircle, SendHorizonal
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdvocateWorkspace() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [advocateName, setAdvocateName] = useState('Advocate Mulu Haile');
  const [advocateTitle, setAdvocateTitle] = useState('Senior Federal Advocate • Corporate & Civil Law');
  const [licenseNo, setLicenseNo] = useState('MOJ/FED/2019/8412');

  // Tab State: Cases, Forum (LegalTalk), Payouts
  const [activeTab, setActiveTab] = useState<'cases' | 'forum' | 'payouts'>('cases');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [forumQuestions, setForumQuestions] = useState<any[]>([
    {
      id: 'q1',
      title: 'Can a commercial landlord in Addis Ababa demand 1-year advance rent and raise prices mid-lease?',
      category: 'Property & Real Estate',
      author: 'Kidus M. (Bole)',
      date: '2 days ago',
      verified_answer: null,
    },
    {
      id: 'q2',
      title: 'What are the employee severance rules during the 60-day probation period under Proclamation 1156/2019?',
      category: 'Employment Law',
      author: 'Selamawit B. (Kazanchis)',
      date: '4 days ago',
      verified_answer: null,
    }
  ]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Active Forum Reply State
  const [selectedQuestionToAnswer, setSelectedQuestionToAnswer] = useState<any | null>(null);
  const [answerBodyText, setAnswerBodyText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Live Consultation Room Modal State
  const [activeRoomCase, setActiveRoomCase] = useState<any | null>(null);
  const [roomModalTab, setRoomModalTab] = useState<'milestones' | 'chat' | 'documents'>('milestones');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Milestone Updater State
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [courtDateInput, setCourtDateInput] = useState<string>('');
  const [courtNameInput, setCourtNameInput] = useState<string>('Federal First Instance Court (Lideta Bench)');
  const [courtRoomInput, setCourtRoomInput] = useState<string>('Courtroom 04');
  const [hearingObjectiveInput, setHearingObjectiveInput] = useState<string>('Initial Pleadings & Defense Submission');
  const [isUpdatingMilestone, setIsUpdatingMilestone] = useState<boolean>(false);

  // Evidence & Case Documents State
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
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

  const handlePublishAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionToAnswer || !answerBodyText.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      const supabase = createClient();
      const payload = {
        verified_answer: answerBodyText.trim(),
        advocate_name: advocateName,
        advocate_title: advocateTitle,
        answered_at: new Date().toISOString(),
      };

      // Update in Supabase if table exists, otherwise update local state
      await supabase
        .from('community_questions')
        .update(payload)
        .eq('id', selectedQuestionToAnswer.id);

      setForumQuestions((prev) =>
        prev.map((q) => (q.id === selectedQuestionToAnswer.id ? { ...q, ...payload } : q))
      );

      setSelectedQuestionToAnswer(null);
      setAnswerBodyText('');
      alert('✓ Verified legal answer published live to LegalTalk!');
    } catch (err: any) {
      alert('Failed to publish answer: ' + err.message);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const fetchCaseDocuments = async (consultationId: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('case_documents')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: false });

      if (data) setCaseDocuments(data);
    } catch (err) {
      console.error('Error fetching advocate documents:', err);
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

      const { data: newDocRecord } = await supabase
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

  const handleSaveMilestoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoomCase) return;

    setIsUpdatingMilestone(true);
    try {
      const supabase = createClient();
      const updatePayload: any = {
        case_stage: selectedStage,
        court_name: courtNameInput.trim(),
        court_room: courtRoomInput.trim(),
        hearing_objective: hearingObjectiveInput.trim(),
      };

      if (courtDateInput) {
        updatePayload.next_court_date = new Date(courtDateInput).toISOString();
      }

      const { error } = await supabase
        .from('consultations')
        .update(updatePayload)
        .eq('id', activeRoomCase.id);

      if (error) throw error;

      setActiveRoomCase((prev: any) => ({ ...prev, ...updatePayload }));
      setConsultations((prev) =>
        prev.map((c) => (c.id === activeRoomCase.id ? { ...c, ...updatePayload } : c))
      );

      alert('✓ Case stage and court hearing date successfully updated! Client will see it in their portal.');
    } catch (err: any) {
      alert('Failed to save milestone: ' + err.message);
    } finally {
      setIsUpdatingMilestone(false);
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

    return () => {
      void supabase.removeChannel(caseChannel);
    };
  }, []);

  useEffect(() => {
    if (activeRoomCase) {
      const caseId = activeRoomCase.id;
      setSelectedStage(activeRoomCase.case_stage || 1);
      setCourtNameInput(activeRoomCase.court_name || 'Federal First Instance Court (Lideta Bench)');
      setCourtRoomInput(activeRoomCase.court_room || 'Courtroom 04');
      setHearingObjectiveInput(activeRoomCase.hearing_objective || 'Initial Pleadings & Defense Submission');
      if (activeRoomCase.next_court_date) {
        setCourtDateInput(new Date(activeRoomCase.next_court_date).toISOString().slice(0, 16));
      } else {
        setCourtDateInput('');
      }

      fetchCaseDocuments(caseId);

      const supabase = createClient();
      const fetchChatHistory = async () => {
        const { data } = await supabase
          .from('consultation_messages')
          .select('*')
          .eq('consultation_id', caseId)
          .order('created_at', { ascending: true });

        if (data) setMessages(data);
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
        void supabase.removeChannel(chatSub);
      };
    }
  }, [activeRoomCase]);

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

  const legalStages = [
    { step: 1, title: 'Case Intake & Evidence Audit', am: 'የማስረጃ ማሰባሰብ' },
    { step: 2, title: 'Pleadings & Statement of Claim Drafted', am: 'መክፈቻ አቤቱታ ዝግጅት' },
    { step: 3, title: 'Court Registry & Summons Served', am: 'የክስ መዝገብና መጥሪያ' },
    { step: 4, title: 'Preliminary Objections & Defense', am: 'የመጀመሪያ ደረጃ መቃወሚያ' },
    { step: 5, title: 'Witness Examination & Hearing', am: 'የምስክር መስማት' },
    { step: 6, title: 'Final Judgment & Execution Decree', am: 'የመጨረሻ ፍርድና አፈፃፀም' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col font-sans">
      
      {/* 1. TOP HEADER */}
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
        
        {/* Banner */}
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
              {advocateTitle}. Licensed under Ministry of Justice credential <strong className="text-amber-400 font-mono">{licenseNo}</strong>.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('cases')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              activeTab === 'cases' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Assigned Legal Cases ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              activeTab === 'forum' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            LegalTalk Q&A Expert Desk ({forumQuestions.filter(q => !q.verified_answer).length} pending)
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 border-b-2 cursor-pointer transition-all ${
              activeTab === 'payouts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Telebirr Payout Ledger ({payouts.length})
          </button>
        </div>

        {/* TAB 1: ASSIGNED CASES */}
        {activeTab === 'cases' && (
          <div className="space-y-4">
            <h2 className="font-black text-lg text-[#0A1128]">Assigned Client Briefs</h2>

            <div className="grid grid-cols-1 gap-4">
              {consultations.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                  No cases assigned yet.
                </div>
              ) : (
                consultations.map((c) => {
                  const stageObj = legalStages.find((s) => s.step === (c.case_stage || 1)) || legalStages[0];
                  return (
                    <div
                      key={c.id}
                      className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-slate-300 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-base text-[#0A1128]">{c.practice_area}</span>
                          
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A1128] text-amber-400 flex items-center gap-1">
                            <Gavel className="w-3 h-3" />
                            <span>Stage {c.case_stage || 1}: {stageObj.am}</span>
                          </span>

                          {c.voice_note_url && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                              <Mic className="w-3 h-3 text-purple-600" />
                              <span>Client Voice Note Available</span>
                            </span>
                          )}

                          {c.next_court_date && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-amber-600" />
                              <span>ቀጣይ ቀጠሮ: {new Date(c.next_court_date).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                          {c.situation_description}
                        </p>

                        {c.voice_note_url && (
                          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl max-w-md space-y-1">
                            <span className="text-[10px] font-bold text-purple-900 uppercase flex items-center gap-1">
                              <Volume2 className="w-3 h-3" />
                              Client Recorded Voice Brief (ድምፅ):
                            </span>
                            <audio controls src={c.voice_note_url} className="w-full h-8 rounded" />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1 font-mono">
                          <span className="text-slate-700 font-semibold font-sans">Client: {c.client_name || 'Anonymous'}</span>
                          <span>📍 {c.location}</span>
                          <span>Court: {c.court_name || 'Lideta Bench'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                        <button
                          onClick={() => {
                            setActiveRoomCase(c);
                            setRoomModalTab('milestones');
                          }}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow"
                        >
                          <Gavel className="w-3.5 h-3.5" />
                          <span>Update Stage & Court Date</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveRoomCase(c);
                            setRoomModalTab('chat');
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Room</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LEGALTALK Q&A EXPERT DESK */}
        {activeTab === 'forum' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-[#102A43] p-6 rounded-3xl text-white space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">ADVANCED PRO BONO DESK</span>
              <h2 className="font-black text-xl">Answer Community Legal Inquiries</h2>
              <p className="text-xs text-slate-300">
                Provide verified expert answers to public questions on LegalTalk. Your responses appear instantly with direct consultation CTAs.
              </p>
            </div>

            <div className="space-y-4">
              {forumQuestions.map((q) => (
                <div key={q.id} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                      {q.category}
                    </span>
                    <span className="text-xs text-slate-400">Asked by {q.author} • {q.date}</span>
                  </div>
                  <h3 className="font-black text-base text-[#0A1128]">{q.title}</h3>

                  {q.verified_answer ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
                      <strong className="text-emerald-900 block">✓ Published Expert Answer by {advocateName}:</strong>
                      <p className="text-emerald-800 leading-relaxed">{q.verified_answer}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedQuestionToAnswer(q)}
                        className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Write Verified Legal Answer</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-base text-[#0A1128]">Direct Telebirr B2C Disbursements</h3>
            <div className="space-y-3">
              {payouts.map((tx, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#0A1128]">{tx.transaction_ref}</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Transferred to: {tx.phone_number}</span>
                  </div>
                  <strong className="font-mono font-black text-emerald-600 text-sm">ETB {Number(tx.amount_etb || 1275).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 3. VERIFIED ANSWER PUBLISH MODAL */}
      {selectedQuestionToAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  EXPERT LEGAL COUNSEL REPLY
                </span>
                <h3 className="font-black text-lg">Publish Verified Answer</h3>
              </div>
              <button onClick={() => setSelectedQuestionToAnswer(null)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishAnswer} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border rounded-xl font-bold text-slate-800">
                "{selectedQuestionToAnswer.title}"
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Your Legal Opinion / Statutory Guidance *</label>
                <textarea
                  rows={5}
                  required
                  value={answerBodyText}
                  onChange={(e) => setAnswerBodyText(e.target.value)}
                  placeholder="Cite relevant Civil Code articles, Proclamations, or legal procedures clearly..."
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestionToAnswer(null)}
                  className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAnswer}
                  className="w-2/3 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  {isSubmittingAnswer ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Publish Live to LegalTalk</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. CASE STAGE & COURT HEARING MANAGER MODAL */}
      {activeRoomCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  CASE PROGRESSION & HEARING DESK
                </span>
                <h3 className="font-black text-lg text-white mt-0.5">
                  Client: {activeRoomCase.client_name || 'Client'} • {activeRoomCase.practice_area}
                </h3>
              </div>
              <button onClick={() => setActiveRoomCase(null)} className="p-1.5 text-white/70 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button
                onClick={() => setRoomModalTab('milestones')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  roomModalTab === 'milestones' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 text-amber-600" />
                <span>Court Hearing & Stages</span>
              </button>
              <button
                onClick={() => setRoomModalTab('chat')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  roomModalTab === 'chat' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat ({messages.length})</span>
              </button>
              <button
                onClick={() => setRoomModalTab('documents')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  roomModalTab === 'documents' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Evidence Vault ({caseDocuments.length})</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-xs">
              
              {roomModalTab === 'milestones' && (
                <form onSubmit={handleSaveMilestoneUpdate} className="space-y-6">
                  {activeRoomCase.voice_note_url && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                      <strong className="text-purple-900 font-bold flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-purple-600" />
                        Client Audio Brief (የተቀዳ የደንበኛ ድምፅ)
                      </strong>
                      <audio controls src={activeRoomCase.voice_note_url} className="w-full h-8 rounded" />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-2">
                      Select Current Litigation Stage (የክስ ሂደት ደረጃ)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {legalStages.map((stage) => {
                        const isSelected = selectedStage === stage.step;
                        return (
                          <button
                            type="button"
                            key={stage.step}
                            onClick={() => setSelectedStage(stage.step)}
                            className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#0A1128] bg-slate-100 text-[#0A1128] shadow-xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                              isSelected ? 'bg-[#0A1128] text-amber-400' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {stage.step}
                            </span>
                            <div>
                              <strong className="block text-xs">{stage.title}</strong>
                              <span className="text-[10px] text-slate-400 block">{stage.am}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                      NEXT COURT APPEARANCE & HEARING BENCH (የቀጣይ ቀጠሮ መረጃ)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Hearing Date & Time</label>
                        <input
                          type="datetime-local"
                          value={courtDateInput}
                          onChange={(e) => setCourtDateInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Court & Bench</label>
                        <input
                          type="text"
                          value={courtNameInput}
                          onChange={(e) => setCourtNameInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Courtroom Number</label>
                        <input
                          type="text"
                          value={courtRoomInput}
                          onChange={(e) => setCourtRoomInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Hearing Objective</label>
                        <input
                          type="text"
                          value={hearingObjectiveInput}
                          onChange={(e) => setHearingObjectiveInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingMilestone}
                    className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    {isUpdatingMilestone ? 'Updating...' : 'Save Milestone & Update Client Portal'}
                  </button>
                </form>
              )}

              {roomModalTab === 'chat' && (
                <div className="space-y-4">
                  <div className="h-72 bg-slate-50 rounded-2xl border border-slate-200 p-4 overflow-y-auto space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.sender_role === 'advocate' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400 px-1 mb-0.5">{m.sender_name}</span>
                        <div className={`p-3 rounded-2xl text-xs max-w-md ${m.sender_role === 'advocate' ? 'bg-[#0A1128] text-white' : 'bg-white border'}`}>
                          {m.message_text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                  <form onSubmit={handleSendAdvocateMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type counsel message..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs cursor-pointer">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {roomModalTab === 'documents' && (
                <div className="space-y-4">
                  <input type="file" ref={fileUploadInputRef} onChange={handleAdvocateFileUpload} className="hidden" />
                  <button onClick={() => fileUploadInputRef.current?.click()} className="px-4 py-2 bg-[#0A1128] text-white rounded-xl font-bold cursor-pointer">
                    Upload Legal Document
                  </button>
                  <div className="space-y-2">
                    {caseDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                        <div>
                          <strong>{doc.file_name}</strong>
                          <span className="text-[10px] text-slate-400 block">{doc.file_size} • {doc.uploader_name}</span>
                        </div>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="px-3 py-1 bg-white border rounded text-xs font-bold">
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}