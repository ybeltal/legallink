'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight,
  Video, Send, MessageSquare, User as UserIcon, MessageCircle, Smartphone, Receipt, LogOut,
  KeyRound, Award, FileCode, Edit3, Paperclip, UploadCloud, Languages, UserPlus,
  ThumbsUp, Search, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Calculator, Gavel,
  Mic, Square, Play, Trash2, Volume2, AlertTriangle, ClipboardCheck, Car, Key, Handshake
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'calculator' | 'dara' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts' | 'receipts'>('consultations');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // In-app Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // -------------------------------------------------------------
  // DYNAMIC INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
  // -------------------------------------------------------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeTab]);

  // -------------------------------------------------------------
  // USER AUTHENTICATION & SESSION
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authRole, setAuthRole] = useState<'client' | 'advocate'>('client');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const checkSession = async () => {
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
        if (profile) {
          setUserProfile(profile);
        } else {
          setUserProfile({
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'LegalLink User',
            role: session.user.user_metadata?.role || 'client'
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Session check error:', err);
    }
  };

  useEffect(() => {
    checkSession();
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        checkSession();
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const supabase = createClient();

      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: {
            data: {
              full_name: authFullName.trim() || 'LegalLink Member',
              role: authRole,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setCurrentUser(data.user);
          setUserProfile({ full_name: authFullName, role: authRole });
          setAuthModalOpen(false);
          setClientName(authFullName);
          showToast(`Welcome to LegalLink, ${authFullName}!`);
          if (authRole === 'advocate') {
            window.location.href = '/advocate';
          } else {
            setActiveTab('my-consultations');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });

        if (error) throw error;

        if (data.user) {
          setCurrentUser(data.user);
          await checkSession();
          setAuthModalOpen(false);
          showToast('Authenticated session successfully.');
          setActiveTab('my-consultations');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      showToast('Signed out of LegalLink.');
      setActiveTab('home');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // -------------------------------------------------------------
  // CLIENT MATCHING & VOICE NOTE RECORDER STATE
  // -------------------------------------------------------------
  const [matchStep, setMatchStep] = useState<1 | 2 | 3 | 4>(1);
  const [clientName, setClientName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Corporate & Business Law');
  const [location, setLocation] = useState('Addis Ababa');
  const [consultLanguage, setConsultLanguage] = useState('Amharic');
  const [budgetRange, setBudgetRange] = useState('Free Consultation');
  const [urgency, setUrgency] = useState('within_24h');
  const [situationText, setSituationText] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Voice Recording Engine
  const [intakeMode, setIntakeMode] = useState<'text' | 'voice'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const previewUrl = URL.createObjectURL(audioBlob);
        setAudioPreviewUrl(previewUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopVoiceRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
      showToast('Recording started... Speak clearly into your mic.');
    } catch (err: any) {
      alert('Microphone access denied or not supported in this browser. You can type your brief below.');
      setIntakeMode('text');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast('Voice note recorded! You can listen below.');
    }
  };

  const clearVoiceRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setRecordingSeconds(0);
  };

  // -------------------------------------------------------------
  // USER DASHBOARD & EVIDENCE STATE
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'milestones' | 'room' | 'documents'>('milestones');
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const fetchMyConsultations = async () => {
    setLoadingMyConsultations(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setMyConsultations(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingMyConsultations(false);
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
      console.error('Error fetching documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConsultationDetails) return;

    setIsUploadingFile(true);
    try {
      const supabase = createClient();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${selectedConsultationDetails.id}/${Date.now()}_${cleanFileName}`;

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

      const uploader = userProfile?.full_name || selectedConsultationDetails.client_name || 'Client';
      const { data: newDocRecord, error: insertError } = await supabase
        .from('case_documents')
        .insert([
          {
            consultation_id: selectedConsultationDetails.id,
            file_name: file.name,
            file_url: publicUrl,
            file_size: formattedSize,
            uploader_name: uploader,
            uploader_role: 'client',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (newDocRecord) {
        setCaseDocuments((prev) => [newDocRecord, ...prev]);
      }
      showToast('Document uploaded and shared securely with advocate.');
    } catch (err: any) {
      alert('Failed to upload document: ' + (err.message || 'Storage error'));
    } finally {
      setIsUploadingFile(false);
      if (fileUploadInputRef.current) {
        fileUploadInputRef.current.value = '';
      }
    }
  };

  // -------------------------------------------------------------
  // REVIEWS & RATING ENGINE STATE
  // -------------------------------------------------------------
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [reviewModalCase, setReviewModalCase] = useState<any | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const fetchReviews = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('advocate_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setReviewsList(data);
    } catch (err) {
      console.error('Reviews fetch error:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    const supabase = createClient();
    const reviewsChannel = supabase
      .channel('public_reviews_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'advocate_reviews' },
        (payload) => setReviewsList((prev) => [payload.new, ...prev])
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(reviewsChannel);
    };
  }, []);

  // -------------------------------------------------------------
  // CONSULTATIONS REAL-TIME SYNC
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeTab === 'my-consultations') {
      fetchMyConsultations();

      const supabase = createClient();
      const channel = supabase
        .channel('client_consultations_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'consultations' },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setMyConsultations((prev) =>
                prev.map((item) => (item.id === payload.new.id ? { ...item, ...payload.new } : item))
              );
              setSelectedConsultationDetails((prev: any) =>
                prev?.id === payload.new.id ? { ...prev, ...payload.new } : prev
              );
            } else if (payload.eventType === 'INSERT') {
              setMyConsultations((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }
  }, [activeTab]);

  // Real-time Chat
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [senderRole, setSenderRole] = useState<'client' | 'advocate'>('client');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedConsultationDetails) return;

    const consultationId = selectedConsultationDetails.id;
    fetchCaseDocuments(consultationId);

    const supabase = createClient();
    let chatChannel: any = null;

    if (modalTab === 'room') {
      setLoadingMessages(true);
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('consultation_messages')
          .select('*')
          .eq('consultation_id', consultationId)
          .order('created_at', { ascending: true });

        if (!error && data) setMessages(data);
        setLoadingMessages(false);
      };
      fetchHistory();

      chatChannel = supabase
        .channel(`chat_${consultationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'consultation_messages',
            filter: `consultation_id=eq.${consultationId}`,
          },
          (payload) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        )
        .subscribe();
    }

    const docsChannel = supabase
      .channel(`docs_${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'case_documents',
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          setCaseDocuments((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      if (chatChannel) void supabase.removeChannel(chatChannel);
      void supabase.removeChannel(docsChannel);
    };
  }, [selectedConsultationDetails, modalTab]);

  useEffect(() => {
    if (modalTab === 'room') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, modalTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConsultationDetails) return;

    setIsSendingMessage(true);
    try {
      const supabase = createClient();
      const senderName = senderRole === 'client' 
        ? (userProfile?.full_name || selectedConsultationDetails.client_name || 'Client') 
        : 'Advocate Mulu Haile (Senior Counsel)';

      const { error } = await supabase
        .from('consultation_messages')
        .insert([
          {
            consultation_id: selectedConsultationDetails.id,
            sender_name: senderName,
            sender_role: senderRole,
            message_text: newMessageText.trim(),
          },
        ]);

      if (error) {
        alert('Could not deliver message: ' + error.message);
      } else {
        setNewMessageText('');
      }
    } catch (err: any) {
      alert('Error transmitting message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // -------------------------------------------------------------
  // CONSULTATION SUBMISSION WITH VOICE NOTE UPLOAD
  // -------------------------------------------------------------
  const handleBookingSubmit = async () => {
    if (!situationText.trim() && !audioBlob) {
      alert('Please describe your legal situation or record a voice note.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let uploadedVoiceUrl: string | null = null;

      if (audioBlob) {
        const audioPath = `voice-notes/${Date.now()}_voice_brief.webm`;
        const { error: audioUploadError } = await supabase.storage
          .from('case-documents')
          .upload(audioPath, audioBlob, { contentType: 'audio/webm', upsert: true });

        if (!audioUploadError) {
          const { data: urlData } = supabase.storage
            .from('case-documents')
            .getPublicUrl(audioPath);
          uploadedVoiceUrl = urlData.publicUrl;
        }
      }

      const briefDescription = situationText.trim() || (audioBlob ? '🎙️ [Client Voice Note Brief Attached]' : 'Legal Consultation Request');

      const { error } = await supabase.from('consultations').insert([
        {
          client_name: userProfile?.full_name || clientName.trim() || 'Client',
          practice_area: selectedCategory,
          location: location,
          situation_description: briefDescription,
          budget_range: budgetRange,
          urgency: urgency,
          status: 'pending',
          payment_status: 'free_promotional',
          escrow_amount: 0,
          case_stage: 1,
          voice_note_url: uploadedVoiceUrl
        },
      ]);

      if (error) throw error;
      setBookingConfirmed(true);
      clearVoiceRecording();
      showToast('Case successfully registered! Proceeding to advocate confirmation.');
    } catch (err: any) {
      alert('Unexpected error saving your consultation: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // LEGALTALK Q&A COMMUNITY FORUM ENGINE
  // -------------------------------------------------------------
  const [legalTalkFilter, setLegalTalkFilter] = useState<string>('all');
  const [legalTalkSearch, setLegalTalkSearch] = useState<string>('');
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Property & Real Estate');
  const [newQuestionDetails, setNewQuestionDetails] = useState('');

  const [communityQuestions, setCommunityQuestions] = useState<any[]>([
    {
      id: 'q1',
      title: 'Can a commercial landlord in Addis Ababa demand 1-year advance rent and raise prices mid-lease?',
      category: 'Property & Real Estate',
      author: 'Kidus M. (Bole)',
      date: '2 days ago',
      upvotes: 38,
      hasUpvoted: false,
      answersCount: 1,
      verifiedAnswer: {
        advocate: 'Advocate Dawit Tesfaye',
        title: 'Property & Real Estate Counsel (15 yrs exp)',
        date: 'Yesterday',
        body: 'Under Book IV of the Ethiopian Civil Code (Art. 2896 et seq.) and current Addis Ababa municipal commercial tenancy directives, unilateral rent increments within an active, registered lease term are legally prohibited unless an explicit indexation clause is stated. Furthermore, advance payment exceeding standard contractual benchmarks requires mutual assent registered with DARA.',
        advocateId: 'l3'
      }
    },
    {
      id: 'q2',
      title: 'What are the employee severance rules during the 60-day probation period under Proclamation 1156/2019?',
      category: 'Employment Law',
      author: 'Selamawit B. (Kazanchis)',
      date: '4 days ago',
      upvotes: 54,
      hasUpvoted: false,
      answersCount: 1,
      verifiedAnswer: {
        advocate: 'Advocate Tigist Bekele',
        title: 'Civil & Labor Advocate (9 yrs exp)',
        date: '3 days ago',
        body: 'Pursuant to Article 11(3) of Ethiopian Labor Proclamation No. 1156/2019, if an employee is found unsuited during the probationary period, the employment agreement may be terminated without notice and without obligation to pay severance or compensation. However, all accrued regular wages for days worked must be disbursed immediately.',
        advocateId: 'l2'
      }
    }
  ]);

  const handleUpvoteQuestion = (qId: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const newStatus = !q.hasUpvoted;
          showToast(newStatus ? 'Upvoted question!' : 'Removed upvote');
          return {
            ...q,
            upvotes: newStatus ? q.upvotes + 1 : q.upvotes - 1,
            hasUpvoted: newStatus,
          };
        }
        return q;
      })
    );
  };

  const handlePostNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newQ = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle.trim(),
      category: newQuestionCategory,
      author: userProfile?.full_name || 'Anonymous Client',
      date: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      answersCount: 0,
      verifiedAnswer: null,
      details: newQuestionDetails.trim(),
    };

    setCommunityQuestions([newQ, ...communityQuestions]);
    setAskModalOpen(false);
    setNewQuestionTitle('');
    setNewQuestionDetails('');
    showToast('Question posted! Advocates notified.');
  };

  const filteredQuestions = communityQuestions.filter((q) => {
    const matchesCategory = legalTalkFilter === 'all' || q.category === legalTalkFilter;
    const matchesSearch = !legalTalkSearch.trim() || 
      q.title.toLowerCase().includes(legalTalkSearch.toLowerCase()) ||
      q.category.toLowerCase().includes(legalTalkSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // -------------------------------------------------------------
  // STATUTORY LABOR & SEVERANCE CALCULATOR ENGINE (PROC. 1156/2019)
  // -------------------------------------------------------------
  const [calcSalary, setCalcSalary] = useState<number>(20000);
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcMonths, setCalcMonths] = useState<number>(4);
  const [calcReason, setCalcReason] = useState<'redundancy' | 'unlawful' | 'bankruptcy' | 'lawful_notice'>('redundancy');
  const [calcGaveNotice, setCalcGaveNotice] = useState<boolean>(false);
  const [calcUnusedLeaveDays, setCalcUnusedLeaveDays] = useState<number>(12);

  const dailyWage = calcSalary / 30;
  const totalServiceFraction = calcYears + (calcMonths / 12);
  let baseSeverance = 0;
  if (totalServiceFraction >= 0.16) {
    if (totalServiceFraction <= 1) {
      baseSeverance = totalServiceFraction * calcSalary;
    } else {
      const subsequentYears = totalServiceFraction - 1;
      baseSeverance = calcSalary + (subsequentYears * (calcSalary / 3));
    }
  }
  baseSeverance = Math.min(baseSeverance, calcSalary * 12);

  let additionalRedundancyPay = 0;
  if (calcReason === 'redundancy' || calcReason === 'bankruptcy') {
    additionalRedundancyPay = calcSalary * 2;
  }

  let noticePeriodMonths = 1;
  if (calcReason === 'redundancy') {
    noticePeriodMonths = 2;
  } else if (calcYears < 1) {
    noticePeriodMonths = 1;
  } else if (calcYears >= 1 && calcYears <= 9) {
    noticePeriodMonths = 2;
  } else if (calcYears > 9) {
    noticePeriodMonths = 3;
  }

  const noticeIndemnity = calcGaveNotice ? 0 : (noticePeriodMonths * calcSalary);
  const leaveIndemnity = calcUnusedLeaveDays * dailyWage;
  const totalCalculatedPackage = baseSeverance + additionalRedundancyPay + noticeIndemnity + leaveIndemnity;

  const handlePrintLaborCalculation = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) return alert('Allow popups to print calculation sheet.');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Statutory Severance Calculation - Proc. 1156/2019</title>
          <style>
            @page { size: portrait; margin: 15mm; }
            body { font-family: "Century Gothic", sans-serif; color: #0A1128; padding: 25px; }
            .header { border-bottom: 2px solid #0A1128; padding-bottom: 10px; margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .table th { background: #0A1128; color: white; padding: 10px; text-align: left; }
            .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .total { background: #f1f5f9; font-weight: bold; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Statutory Severance Calculation Report</h2>
            <span>Labor Proclamation No. 1156/2019 • ${new Date().toLocaleDateString()}</span>
          </div>
          <p>Monthly Gross: ETB ${calcSalary} • Service: ${calcYears} yrs, ${calcMonths} mos</p>
          <table class="table">
            <thead>
              <tr><th>Component</th><th>Statute</th><th style="text-align:right;">Amount (ETB)</th></tr>
            </thead>
            <tbody>
              <tr><td>Severance Pay</td><td>Art. 40(1)</td><td style="text-align:right;">${baseSeverance.toFixed(2)}</td></tr>
              <tr><td>Redundancy Pay</td><td>Art. 40(2)</td><td style="text-align:right;">${additionalRedundancyPay.toFixed(2)}</td></tr>
              <tr><td>Notice Pay</td><td>Art. 44</td><td style="text-align:right;">${noticeIndemnity.toFixed(2)}</td></tr>
              <tr><td>Unused Leave</td><td>Art. 79</td><td style="text-align:right;">${leaveIndemnity.toFixed(2)}</td></tr>
              <tr class="total"><td colspan="2">TOTAL ENTITLEMENT:</td><td style="text-align:right;">ETB ${totalCalculatedPackage.toFixed(2)}</td></tr>
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 6 Litigation Stages
  const legalStages = [
    { step: 1, title: 'Case Intake & Evidence Audit', am: 'የማስረጃ ማሰባሰብ', desc: 'Advocate reviews briefs, contract clauses, and evidence records.' },
    { step: 2, title: 'Pleadings & Statement of Claim Drafted', am: 'መክፈቻ አቤቱታ ዝግጅት', desc: 'Formal petition drafted pursuant to Civil Procedure Code.' },
    { step: 3, title: 'Court Registry & Summons Served', am: 'የክስ መዝገብና መጥሪያ', desc: 'Case docket registered at First Instance/High Court and summons dispatched.' },
    { step: 4, title: 'Preliminary Objections & Defense', am: 'የመጀመሪያ ደረጃ መቃወሚያ', desc: 'Bench reviews jurisdiction, limitations, and statement of defense.' },
    { step: 5, title: 'Witness Examination & Hearing', am: 'የምስክር መስማት', desc: 'Examination and cross-examination of documentary evidence & witnesses.' },
    { step: 6, title: 'Final Judgment & Execution Decree', am: 'የመጨረሻ ፍርድና አፈፃፀም', desc: 'Final decree rendered and formal execution writ enforced.' },
  ];

  // -------------------------------------------------------------
  // DARA COUNTER-READY CHECKLIST ENGINE (ሰነዶች ማረጋገጫ ቅድመ-ዝግጅት)
  // -------------------------------------------------------------
  const [daraDocType, setDaraDocType] = useState<'vehicle' | 'lease' | 'poa' | 'loan'>('vehicle');
  const [daraCheckedItems, setDaraCheckedItems] = useState<Record<string, boolean>>({});

  const daraCategories = {
    vehicle: {
      title: 'Vehicle Sale & Title Transfer',
      amTitle: 'የተሽከርካሪ ሽያጭና ስም ማዘዋወር',
      icon: Car,
      checklist: [
        { id: 'v1', text: 'Original Libre (የተሽከርካሪ ኦሪጅናል ሊብሮ) without any bank lien/mortgage stamp.' },
        { id: 'v2', text: 'Valid Annual Vehicle Inspection Sticker (የዘመኑ የቴክኒክ ምርመራ ቦሎ/ቴስቲሞኒዮ).' },
        { id: 'v3', text: 'Active Resident Kebele ID or Fayda Digital ID for both Buyer and Seller.' },
        { id: 'v4', text: 'Spousal Consent (የባል/ሚስት ፈቃድ) in person or certified Single/Divorce certificate.' },
        { id: 'v5', text: '2 Ethiopian Citizen Witnesses present with valid Kebele IDs and passport photos.' },
        { id: 'v6', text: 'Customs Duty Clearance Certificate (if previously purchased under duty-free privilege).' }
      ]
    },
    lease: {
      title: 'Real Estate & Commercial Lease',
      amTitle: 'የንግድና መኖሪያ ቤት ኪራይ ውል',
      icon: Home,
      checklist: [
        { id: 'l1', text: 'Original Land Holding Certificate / Title Deed (ኦሪጅናል የይዞታ ማረጋገጫ ካርታ).' },
        { id: 'l2', text: 'Current Municipal Tax Clearance Receipt (የዘመኑ የግብር ደረሰኝ ከክፍለ ከተማ).' },
        { id: 'l3', text: 'Valid Resident IDs of both Landlord and Tenant.' },
        { id: 'l4', text: '2 Witnesses with active Kebele IDs who are not direct family beneficiaries.' },
        { id: 'l5', text: 'TIN Number & Commercial Registration (for commercial premise leasing).' }
      ]
    },
    poa: {
      title: 'Power of Attorney (POA)',
      amTitle: 'ጠቅላላና ልዩ የውክልና ስልጣን',
      icon: Key,
      checklist: [
        { id: 'p1', text: 'Physical presence of the Principal (ወካይ) with valid Kebele ID or National Passport.' },
        { id: 'p2', text: 'Certified copy of Agent (ተወካይ) Kebele ID.' },
        { id: 'p3', text: 'Exact Bank Account Numbers or Motor/Land Plate Numbers written out explicitly for Special POA.' },
        { id: 'p4', text: '2 Witnesses with valid resident IDs present at the DARA desk.' },
        { id: 'p5', text: 'Embassy Seal & Ministry of Foreign Affairs (MFA) Stamp (for Diaspora POA).' }
      ]
    },
    loan: {
      title: 'Loan & Debt Acknowledgement',
      amTitle: 'የብድርና የዕዳ መቀበያ ውል',
      icon: Handshake,
      checklist: [
        { id: 'd1', text: 'Drafted Loan Contract with exact repayment date and interest terms compliant with NBE caps.' },
        { id: 'd2', text: 'Bank Transfer Slip / Cheque Copy verifying fund disbursement (Cash over ETB 10,000 discouraged).' },
        { id: 'd3', text: 'Borrower and Creditor valid Kebele/Fayda IDs.' },
        { id: 'd4', text: 'Collateral ownership document (if debt is secured by vehicle or property).' },
        { id: 'd5', text: '2 Witnesses with non-expired government-issued IDs.' }
      ]
    }
  };

  const toggleDaraItem = (id: string) => {
    setDaraCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentChecklist = daraCategories[daraDocType].checklist;
  const checkedCount = currentChecklist.filter((item) => daraCheckedItems[item.id]).length;
  const readinessPercent = Math.round((checkedCount / currentChecklist.length) * 100);

  const handlePrintDaraPass = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) return alert('Please allow popups to print your DARA Counter-Ready Pass.');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>DARA Counter-Ready Pre-Flight Certificate</title>
          <style>
            @page { size: portrait; margin: 15mm; }
            body { font-family: "Century Gothic", "Nyala", sans-serif; color: #0A1128; padding: 25px; }
            .header { border-bottom: 2px solid #0A1128; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 20px; font-weight: 900; }
            .badge { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            .table th { background: #0A1128; color: white; padding: 10px; text-align: left; }
            .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .notice { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 12px; font-size: 11px; color: #92400e; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div style="font-size:10px; color:#64748b; font-weight:bold; text-transform:uppercase;">Federal Documents Authentication and Registration Agency (DARA / ሰነዶች ማረጋገጫ)</div>
              <div class="title">Counter-Ready Pre-Flight Certificate</div>
              <div style="font-size:12px; font-weight:bold; margin-top:3px;">Transaction: ${daraCategories[daraDocType].title} (${daraCategories[daraDocType].amTitle})</div>
            </div>
            <div class="badge">VERIFIED PASS (${readinessPercent}%)</div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px;">Status</th>
                <th>Required Document & Witness Criteria</th>
              </tr>
            </thead>
            <tbody>
              ${currentChecklist.map((item) => `
                <tr>
                  <td style="font-weight:bold; color:${daraCheckedItems[item.id] ? '#16a34a' : '#dc2626'};">
                    ${daraCheckedItems[item.id] ? '✓ READY' : '✗ PENDING'}
                  </td>
                  <td>${item.text}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="notice">
            <strong>DARA Official Counter Notice:</strong> Having all items verified as READY ensures you will not be turned away at the document authentication registration window. Bring originals and photocopies of all participant IDs.
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // -------------------------------------------------------------
  // LEXDRAFT BILINGUAL CONTRACT & DEMAND LETTER ENGINE
  // -------------------------------------------------------------
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [contractLanguage, setContractLanguage] = useState<'en' | 'am' | 'bilingual'>('bilingual');
  const [savedContracts, setSavedContracts] = useState<any[]>([
    { 
      id: 'cnt-1', 
      title: 'Demand Letter - Commercial Loan Default', 
      date: '2026-10-18', 
      fee: 'FREE', 
      status: 'Ready',
      partyA: 'Ethio Capital Partners',
      partyB: 'Alazar Solomon',
      roleOrPurpose: 'Default on Loan Agreement dated 12/03/2026',
      salaryOrRent: 'ETB 150,000.00',
      jurisdiction: '7 Calendar Days (Addis Ababa)',
      type: 'demand',
      contractLang: 'bilingual'
    },
    { 
      id: 'cnt-2', 
      title: 'Bilingual Employment Contract', 
      date: '2026-10-14', 
      fee: 'ETB 450', 
      status: 'Ready',
      partyA: 'EthioTech Solutions PLC',
      partyB: 'Ybeltal Semagn',
      roleOrPurpose: 'Senior Software Engineer',
      salaryOrRent: 'ETB 35,000.00',
      jurisdiction: 'Addis Ababa',
      type: 'emp',
      contractLang: 'bilingual'
    }
  ]);

  const lexdraftTemplates = [
    {
      id: 'demand',
      title: 'Formal Legal Demand Letter',
      amTitle: 'የመጨረሻ የጽሑፍ ማስጠንቀቂያ ደብዳቤ',
      category: 'Dispute & Debt Recovery',
      priceETB: 0,
      popular: true,
      desc: 'Mandatory statutory default notice under Ethiopian Civil Code Art. 1772 for unpaid debts, tenant eviction, or breach of contract.',
      statute: 'Civil Code of Ethiopia Art. 1772–1775 (ፍትሐብሔር ሕግ ቁጥር 1772-1775)',
      fields: [
        { key: 'partyA', label: 'Claimant / Creditor Name (ገንዘብ ጠያቂ / አበዳሪ)', placeholder: 'e.g. Bethlehem Desta (Creditor)' },
        { key: 'partyB', label: 'Debtor / Defaulting Party (ተበዳሪ / ውል አፍራሽ)', placeholder: 'e.g. Yohannes Girma (Debtor)' },
        { key: 'roleOrPurpose', label: 'Ground of Debt / Contract Breached (የዕዳው ወይም የውል ጥሰቱ መነሻ)', placeholder: 'e.g. Unpaid business loan pursuant to agreement signed on 15/01/2026' },
        { key: 'salaryOrRent', label: 'Total Outstanding Claim Amount / የዕዳ መጠን (ETB)', placeholder: 'e.g. ETB 125,000.00' },
        { key: 'jurisdiction', label: 'Grace Period & Place / የመጨረሻ የጊዜ ገደብና ከተማ', placeholder: 'e.g. 7 Calendar Days (Addis Ababa)' },
      ],
    },
    {
      id: 'emp',
      title: 'Employment Contract',
      amTitle: 'የሥራ ውል ስምምነት',
      category: 'Labor Law',
      priceETB: 450,
      popular: true,
      desc: 'Compliant with Ethiopian Labor Proclamation No. 1156/2019 for fixed or indefinite terms.',
      statute: 'Labor Proclamation No. 1156/2019 (አዋጅ ቁጥር 1156/2011)',
      fields: [
        { key: 'partyA', label: 'Employer Entity Name / የአሰሪው ድርጅት ስም', placeholder: 'e.g. Safaricom Telecommunications PLC' },
        { key: 'partyB', label: 'Employee Legal Name / የሠራተኛው ሙሉ ስም', placeholder: 'e.g. Abebe Bikila' },
        { key: 'roleOrPurpose', label: 'Job Title & Responsibilities / የሥራ መደብ', placeholder: 'e.g. Senior Software Engineer' },
        { key: 'salaryOrRent', label: 'Gross Monthly Salary / ወርሃዊ ደመወዝ (ETB)', placeholder: 'e.g. ETB 35,000.00' },
        { key: 'jurisdiction', label: 'Workplace City / የሥራ ቦታ ከተማ', placeholder: 'e.g. Addis Ababa / አዲስ አበባ' },
      ],
    },
    {
      id: 'lease',
      title: 'Commercial Lease Agreement',
      amTitle: 'የንግድ ቤት ኪራይ ውል ስምምነት',
      category: 'Property & Real Estate',
      priceETB: 600,
      popular: true,
      desc: 'Commercial premises rental contract with deposit and municipal compliance terms under Ethiopian Civil Code.',
      statute: 'Civil Code of Ethiopia Art. 2896 (ፍትሐብሔር ሕግ ቁጥር 2896)',
      fields: [
        { key: 'partyA', label: 'Lessor (Landlord) Full Legal Name / የአከራይ ስም', placeholder: 'e.g. Haile Gebreselassie' },
        { key: 'partyB', label: 'Lessee (Tenant) Business Name / የተከራይ ስም', placeholder: 'e.g. Blue Nile Trading PLC' },
        { key: 'roleOrPurpose', label: 'Permitted Commercial Use / የንግድ ቤት አገልግሎት', placeholder: 'e.g. Retail Office and Software Center' },
        { key: 'salaryOrRent', label: 'Agreed Monthly Rent / ወርሃዊ ኪራይ (ETB)', placeholder: 'e.g. ETB 45,000.00' },
        { key: 'jurisdiction', label: 'Property Location / የቤቱ አድራሻ', placeholder: 'e.g. Bole Sub-City, Woreda 03, Addis Ababa' },
      ],
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      amTitle: 'ሚስጥር የመጠበቅ ስምምነት',
      category: 'Corporate & Business',
      priceETB: 300,
      popular: true,
      desc: 'Protects proprietary secrets, financials, customer databases, and commercial partnerships in Ethiopia.',
      statute: 'Civil Code of Ethiopia Art. 2027 (ፍትሐብሔር ሕግ ቁጥር 2027)',
      fields: [
        { key: 'partyA', label: 'Disclosing Party Name / መረጃ ሰጪ ወገን', placeholder: 'e.g. FinTech Innovators PLC' },
        { key: 'partyB', label: 'Receiving Party / መረጃ ተቀባይ ወገን', placeholder: 'e.g. Addis Tech Partners' },
        { key: 'roleOrPurpose', label: 'Confidential Business Purpose / ሚስጥራዊ የንግድ ዓላማ', placeholder: 'e.g. Payment Gateway Integration' },
        { key: 'salaryOrRent', label: 'Liquidated Damages / የካሳ መጠን (ETB)', placeholder: 'e.g. ETB 100,000.00' },
        { key: 'jurisdiction', label: 'Arbitration Jurisdiction / የግልግል ዳኝነት ቦታ', placeholder: 'e.g. Addis Ababa Chamber of Commerce' },
      ],
    },
  ];

  const handleExportContractPDF = (contract: any) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950');
    if (!printWindow) return alert('Please allow popups to download/print your legal contract.');

    const type = contract.type || 'demand';
    const cLang = contract.contractLang || contractLanguage || 'bilingual';
    const partyA = contract.partyA || 'Claimant / First Party / ገንዘብ ጠያቂ';
    const partyB = contract.partyB || 'Debtor / Second Party / ተበዳሪ';
    const roleOrPurpose = contract.roleOrPurpose || 'Outstanding Commercial Default';
    const salaryOrRent = contract.salaryOrRent || 'ETB 50,000.00';
    const locationName = contract.jurisdiction || 'Addis Ababa / 7 Calendar Days';
    const startDate = contract.date || new Date().toISOString().split('T')[0];

    let headerTitle = '';
    let contractBody = '';

    if (type === 'demand') {
      if (cLang === 'am') {
        headerTitle = 'በኢትዮጵያ ፍትሐብሔር ሕግ ቁጥር 1772 መሠረት የተሰጠ የመጨረሻ የጽሑፍ ማስጠንቀቂያ ደብዳቤ';
        contractBody = `
          <div class="parties-box">
            <strong>ለ (ተበዳሪ/ውል አፍራሽ)፦</strong> ${partyB}<br/>
            <strong>ከ (ገንዘብ ጠያቂ/አበዳሪ)፦</strong> ${partyA}<br/>
            <strong>ቀን፦</strong> ${startDate}<br/>
            <strong>ጉዳዩ፦</strong> በፍትሐብሔር ሕግ ቁጥር 1772 እና ተከታዮቹ ድንጋጌዎች መሠረት ዕዳን ስለማሳወቅና የመጨረሻ ማስጠንቀቂያ ስለመስጠት፤
          </div>
          <p>እርስዎ ከላይ ስምዎ የተጠቀሰው ተበዳሪ/ውል አፍራሽ ወገን ከ[${partyA}] ጋር በነበረዎት የ<strong>${roleOrPurpose}</strong> ስምምነት መሠረት መክፈል የሚገባዎትን ጠቅላላ የብር <strong>${salaryOrRent}</strong> እስካሁን ድረስ ባለመክፈልዎ በኢትዮጵያ ፍትሐብሔር ሕግ ቁጥር 1771 መሠረት ግዴታዎን አላከበሩም።</p>
          <div class="section-title">የመጨረሻ የጊዜ ገደብ (GRACE PERIOD)</div>
          <p>ስለሆነም ይህ ሕጋዊ የጽሑፍ ማስጠንቀቂያ በደረስዎት በ<strong>${locationName}</strong> ውስጥ የተጠቀሰውን የብር <strong>${salaryOrRent}</strong> ሙሉ በሙሉ ገቢ እንዲያደርጉ በጥብቅ እናሳስባለን።</p>
          <div class="section-title">ሕጋዊ እርምጃዎችን ስለመውሰድ</div>
          <p>በተጠቀሰው የጊዜ ገደብ ውስጥ ይህንን ግዴታዎን የማይፈጽሙ ከሆነ፣ በፍትሐብሔር ሕግ ቁጥር 1772 ድንጋጌ መሠረት ያለተጨማሪ ማሳሰቢያ ጉዳዩ በቀጥታ ወደ ስልጣን ወዳለው ፍርድ ቤት የሚቀርብ ሲሆን፤ ለሚከተሉት ማናቸውም የፍርድ ቤት ውሎ አበል፣ የሕግ ባለሙያ (ጠበቃ) አገልግሎት ክፍያ እና ለዘገየበት ጊዜ ሕጋዊ ወለድ (Delay Damages) እርስዎ ሙሉ በሙሉ ኃላፊነቱን የሚወስዱ መሆኑን በጥብቅ እናሳውቃለን።</p>
        `;
      } else {
        headerTitle = 'STATUTORY NOTICE OF DEFAULT & DEMAND LETTER / የመጨረሻ የጽሑፍ ማስጠንቀቂያ ደብዳቤ';
        contractBody = `
          <div class="parties-box">
            <div><strong>CREDITOR:</strong> ${partyA} • <strong>DEBTOR:</strong> ${partyB}</div>
            <div style="margin-top:6px;"><strong>CLAIM:</strong> ${salaryOrRent} • <strong>GROUND:</strong> ${roleOrPurpose}</div>
          </div>
          <p>Pursuant to Article 1772 of the Civil Code of Ethiopia, you are formally placed in default. Remit full payment within <strong>${locationName}</strong> to avoid civil litigation.</p>
        `;
      }
    } else {
      headerTitle = 'STATUTORY AGREEMENT / ሕጋዊ ስምምነት';
      contractBody = `<p>Executed between ${partyA} and ${partyB} regarding ${roleOrPurpose} in ${locationName}.</p>`;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${contract.title} - Official LegalLink LexDraft</title>
          <style>
            @page { size: portrait; margin: 18mm; }
            body { font-family: "Century Gothic", "Nyala", sans-serif; color: #111827; padding: 20px; line-height: 1.6; font-size: 13px; }
            .header { text-align: center; border-bottom: 2px solid #0A1128; padding-bottom: 12px; margin-bottom: 20px; }
            .parties-box { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; }
            .section-title { font-weight: bold; margin-top: 14px; margin-bottom: 4px; color: #0A1128; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>${headerTitle}</h3>
            <span>Civil Code Art. 1772 Enforceable Default Notice • Date: ${startDate}</span>
          </div>
          ${contractBody}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCreateDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    const newId = `cnt-${Date.now().toString().slice(-4)}`;
    const partyA = docFormData.partyA?.trim() || userProfile?.full_name || 'Creditor / Claimant';
    const partyB = docFormData.partyB?.trim() || 'Debtor / Recipient';
    const roleOrPurpose = docFormData.roleOrPurpose?.trim() || 'Default on Unpaid Debt';
    const salaryOrRent = docFormData.salaryOrRent?.trim() || 'ETB 10,000.00';
    const jurisdiction = docFormData.jurisdiction?.trim() || '7 Calendar Days (Addis Ababa)';

    const newContractRecord = {
      id: newId,
      title: `${selectedTemplate.title} - ${partyB}`,
      date: new Date().toISOString().split('T')[0],
      fee: selectedTemplate.priceETB === 0 ? 'FREE' : `ETB ${selectedTemplate.priceETB}`,
      status: 'Ready',
      partyA,
      partyB,
      roleOrPurpose,
      salaryOrRent,
      jurisdiction,
      type: selectedTemplate.id,
      contractLang: contractLanguage,
    };

    setSavedContracts((prev) => [newContractRecord, ...prev]);
    setSelectedTemplate(null);
    setDocFormData({});

    handleExportContractPDF(newContractRecord);

    setActiveTab('my-consultations');
    setClientSubTab('contracts');
    showToast('Document generated and exported via LexDraft.');
  };

  // Practice Areas
  const practiceAreas = [
    { id: 'Corporate & Business Law', title: 'Corporate & Business', amTitle: 'የንግድና ኩባንያ ሕግ', icon: Briefcase, desc: 'Company formation, contracts, M&A, governance.' },
    { id: 'Family Law', title: 'Family Law', amTitle: 'የቤተሰብ ሕግ', icon: Heart, desc: 'Divorce, custody, adoption, inheritance disputes.' },
    { id: 'Property & Real Estate', title: 'Property & Real Estate', amTitle: 'የንብረትና ይዞታ ሕግ', icon: Home, desc: 'Land rights, title verification, lease agreements.' },
    { id: 'Intellectual Property', title: 'Intellectual Property', amTitle: 'የአእምሯዊ ንብረት ሕግ', icon: Lightbulb, desc: 'Trademarks, copyright, patents, IP protection.' },
    { id: 'Employment Law', title: 'Employment Law', amTitle: 'የሥራና ሠራተኛ ሕግ', icon: Users, desc: 'Labor disputes, contracts, workplace rights.' },
    { id: 'Criminal Defense', title: 'Criminal Defense', amTitle: 'የወንጀል መከላከያ ሕግ', icon: Shield, desc: 'Representation, bail, appeals, rights defense.' },
    { id: 'Immigration & Diaspora', title: 'Immigration & Diaspora', amTitle: 'የኢሚግሬሽንና ዳያስፖራ ሕግ', icon: Globe, desc: 'Visa, origin ID, diaspora property, residency.' },
    { id: 'NGO & Compliance', title: 'NGO & Compliance', amTitle: 'የድርጅቶችና ማህበራት ሕግ', icon: Building, desc: 'Registration, compliance, grant agreements.' },
  ];

  const muluHaileReviews = reviewsList.filter((r) => r.advocate_name === 'Advocate Mulu Haile');
  const dynamicRating = muluHaileReviews.length > 0 
    ? (muluHaileReviews.reduce((sum, r) => sum + r.rating, 0) / muluHaileReviews.length).toFixed(2)
    : '4.95';
  const dynamicReviewCount = 438 + muluHaileReviews.length;

  const mockMatchedLawyers = [
    {
      id: 'l1',
      name: 'Advocate Mulu Haile',
      title: 'Corporate & Business Specialist',
      experience: '12 yrs exp',
      rating: Number(dynamicRating),
      reviews: dynamicReviewCount,
      hourlyRate: 1500,
      location: 'Addis Ababa',
      bio: 'Senior Federal Advocate specializing in commercial contract drafting, debt recovery, and dispute resolution.',
      avatarInitials: 'MH',
    },
    {
      id: 'l2',
      name: 'Advocate Tigist Bekele',
      title: 'Family & Civil Law Advocate',
      experience: '9 yrs exp',
      rating: 4.88,
      reviews: 312,
      hourlyRate: 1200,
      location: 'Addis Ababa',
      bio: 'Trusted advocate for civil mediation, employment rights, and contract disputes.',
      avatarInitials: 'TB',
    },
    {
      id: 'l3',
      name: 'Advocate Dawit Tesfaye',
      title: 'Property & Real Estate Attorney',
      experience: '15 yrs exp',
      rating: 4.92,
      reviews: 521,
      hourlyRate: 1800,
      location: 'Hawassa / Addis Ababa',
      bio: 'Former land administration legal advisor. Expert in commercial lease defaults, eviction notices, and title verification.',
      avatarInitials: 'DT',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0A1128] text-white rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-soft-float">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <img 
                src="/logo.png" 
                alt="LegalLink Logo" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
              />
              <div>
                <span className="text-xl font-black tracking-tight text-[#0A1128]">
                  Legal<span className="text-amber-500">Link</span>
                </span>
                <span className="hidden sm:block text-[9px] tracking-widest text-slate-400 font-bold uppercase">
                  Ethiopia
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'match' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                {lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'calculator' ? 'text-[#0A1128] bg-amber-50 text-amber-800 font-bold shadow-xs border border-amber-200' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'am' ? 'የስንብት አስሊ' : 'Severance Calc'}</span>
              </button>

              <button
                onClick={() => setActiveTab('dara')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dara' ? 'text-[#0A1128] bg-emerald-50 text-emerald-800 font-bold shadow-xs border border-emerald-200' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'am' ? 'የሰነዶች ቅድመ-ዝግጅት' : 'DARA Checklist'}</span>
              </button>

              <button
                onClick={() => setActiveTab('lexdraft')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'lexdraft' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>LexDraft & Notices</span>
              </button>

              <button
                onClick={() => setActiveTab('legaltalk')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'legaltalk' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                LegalTalk
              </button>

              <button
                onClick={() => setActiveTab('my-consultations')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'my-consultations' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                {lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal'}
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer mr-1 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'አማ (AM)' : 'EN (US)'}</span>
              </button>

              <Link
                href="/advocate"
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-[#0A1128] hover:bg-slate-200 text-xs font-bold border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Advocate Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TAB ROUTING VIEW */}
      
      {/* VIEW A: COMPLETE ORIGINAL 8-SECTION LANDING PAGE */}
      {activeTab === 'home' && (
        <main className="flex-1">
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6 reveal">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>ETHIOPIA'S #1 LEGAL MARKETPLACE</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                    The Future of Law, Today.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                    Connect with verified Ethiopian lawyers, draft statutory demand notices under Civil Code Art. 1772, and compute severance packages under Proclamation 1156/2019.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>Find a Lawyer</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab('dara')}
                      className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>DARA Pre-Flight Checklist</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center reveal reveal-delay-2">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-soft-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow">MH</div>
                      <div>
                        <h3 className="font-bold text-[#0A1128] text-base">Advocate Mulu Haile</h3>
                        <p className="text-xs text-slate-500">Corporate & Civil Law Specialist</p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedLawyer(mockMatchedLawyers[0]); setActiveTab('match'); setMatchStep(4); }} className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                      Book Free Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW B: DARA COUNTER-READY CHECKLIST (NEW SELF-SERVICE TOOL) */}
      {activeTab === 'dara' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                FEDERAL DOCUMENTS AUTHENTICATION AGENCY (DARA / ሰነዶች ማረጋገጫ)
              </span>
              <h1 className="text-3xl sm:text-4xl font-black">DARA Counter-Ready Checklist</h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Never get rejected at the registration counter again. Verify all required original documents, Kebele ID rules, and witness criteria before leaving home.
              </p>
            </div>

            <button
              onClick={handlePrintDaraPass}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Download Pre-Flight Pass (PDF)</span>
            </button>
          </div>

          {/* Transaction Category Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'vehicle', title: 'Vehicle Sale & Transfer', am: 'የመኪና ሽያጭ' },
              { id: 'lease', title: 'Real Estate Lease', am: 'የቤት ኪራይ' },
              { id: 'poa', title: 'Power of Attorney', am: 'ውክልና ስልጣን' },
              { id: 'loan', title: 'Loan & Debt Contract', am: 'የብድር ውል' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDaraDocType(cat.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  daraDocType === cat.id 
                    ? 'border-[#0A1128] bg-slate-900 text-white shadow-md' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <strong className="block text-xs">{cat.title}</strong>
                <span className="text-[10px] opacity-75">{cat.am}</span>
              </button>
            ))}
          </div>

          {/* Interactive Readiness Meter & Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-[#0A1128]">
                  {daraCategories[daraDocType].title} ({daraCategories[daraDocType].amTitle})
                </h3>
                <span className="text-xs text-slate-500">Tap each box as you place the original document in your folder</span>
              </div>

              {/* Live Readiness Progress Bar */}
              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Counter Readiness:</span>
                  <span className={readinessPercent === 100 ? 'text-emerald-600' : 'text-amber-600'}>
                    {readinessPercent}% ({checkedCount}/{currentChecklist.length})
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${readinessPercent === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${readinessPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              {currentChecklist.map((item, index) => {
                const isChecked = !!daraCheckedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleDaraItem(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isChecked 
                        ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900 shadow-xs' 
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isChecked ? '✓' : index + 1}
                      </div>
                      <span className="text-xs font-semibold">{item.text}</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isChecked ? 'Ready' : 'Tap to Confirm'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Direct LexDraft Fast-Forward */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div className="space-y-0.5">
                <strong className="text-amber-900 block">Need a DARA-compliant contract drafted first?</strong>
                <span className="text-amber-800">Generate your bilingual contract with proper witness blocks in LexDraft before printing.</span>
              </div>
              <button
                onClick={() => setActiveTab('lexdraft')}
                className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>Open LexDraft</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </main>
      )}

      {/* VIEW C: SEVERANCE CALCULATOR */}
      {activeTab === 'calculator' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] rounded-3xl p-8 text-white flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">STATUTORY TOOL</span>
              <h1 className="text-3xl font-black mt-1">Labor & Severance Pay Calculator</h1>
            </div>
            <button onClick={handlePrintLaborCalculation} className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">
              Print Calculation Sheet
            </button>
          </div>
        </main>
      )}

      {/* VIEW D: LEXDRAFT & DEMAND LETTER */}
      {activeTab === 'lexdraft' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">DOCUMENT AUTOMATION</span>
              <h1 className="text-3xl font-black mt-1">LexDraft Document Builder</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lexdraftTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-black text-base text-[#0A1128]">{tpl.title}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block">{tpl.amTitle}</span>
                  <p className="text-xs text-slate-500 mt-2">{tpl.desc}</p>
                </div>
                <button 
                  onClick={() => { setSelectedTemplate(tpl); setDocFormData({}); }}
                  className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs"
                >
                  {tpl.id === 'demand' ? 'Generate Demand Letter' : 'Customize & Export'}
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW E: FIND A LAWYER WITH VOICE INTAKE */}
      {activeTab === 'match' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="font-black text-lg text-[#0A1128] mb-4">Connect with Counsel (Step {matchStep} of 4)</h3>
            
            {matchStep === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {practiceAreas.map((p) => (
                  <button key={p.id} onClick={() => setSelectedCategory(p.id)} className={`p-4 rounded-2xl border text-left font-bold text-xs ${selectedCategory === p.id ? 'border-[#0A1128] bg-slate-100' : 'border-slate-200'}`}>
                    {p.title}
                  </button>
                ))}
                <button onClick={() => setMatchStep(2)} className="col-span-2 py-3 bg-[#0A1128] text-white rounded-xl font-bold mt-4">Continue</button>
              </div>
            )}

            {matchStep === 2 && (
              <div className="space-y-4 text-xs">
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / Jurisdiction" className="w-full p-3 border rounded-xl" />
                <button onClick={() => setMatchStep(3)} className="w-full py-3 bg-[#0A1128] text-white rounded-xl font-bold">Continue</button>
              </div>
            )}

            {matchStep === 3 && (
              <div className="space-y-5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-slate-700">Choose Intake Format:</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button type="button" onClick={() => setIntakeMode('voice')} className={`px-3 py-1 rounded-lg font-bold ${intakeMode === 'voice' ? 'bg-[#0A1128] text-amber-400' : 'text-slate-600'}`}>
                      🎙️ Voice Brief
                    </button>
                    <button type="button" onClick={() => setIntakeMode('text')} className={`px-3 py-1 rounded-lg font-bold ${intakeMode === 'text' ? 'bg-[#0A1128] text-white' : 'text-slate-600'}`}>
                      Type Text
                    </button>
                  </div>
                </div>

                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Your Full Legal Name" className="w-full p-3 border rounded-xl" />

                {intakeMode === 'voice' ? (
                  <div className="p-6 bg-slate-50 border-2 border-dashed rounded-2xl text-center space-y-3">
                    {isRecording ? (
                      <div className="space-y-2">
                        <span className="text-red-600 font-bold animate-pulse block">Recording... {recordingSeconds}s / 60s</span>
                        <button type="button" onClick={stopVoiceRecording} className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl text-xs">
                          Stop Recording
                        </button>
                      </div>
                    ) : audioPreviewUrl ? (
                      <div className="space-y-2">
                        <span className="text-emerald-700 font-bold block">✓ Voice Note Ready ({recordingSeconds}s)</span>
                        <audio controls src={audioPreviewUrl} className="w-full h-8" />
                        <button type="button" onClick={clearVoiceRecording} className="text-xs text-red-600 underline">Re-record</button>
                      </div>
                    ) : (
                      <button type="button" onClick={startVoiceRecording} className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto">
                        <Mic className="w-4 h-4 text-amber-400" />
                        <span>Tap to Record Voice Brief (ድምፅ ይቅረጹ)</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <textarea rows={4} value={situationText} onChange={(e) => setSituationText(e.target.value)} placeholder="Describe matter..." className="w-full p-3 border rounded-xl" />
                )}

                <button onClick={() => { setSelectedLawyer(mockMatchedLawyers[0]); setMatchStep(4); }} className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl">Continue to Review</button>
              </div>
            )}

            {matchStep === 4 && (
              <div className="space-y-4 text-xs">
                <p>Advocate: <strong>{selectedLawyer?.name}</strong></p>
                <button onClick={handleBookingSubmit} disabled={isSubmitting} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl">
                  {isSubmitting ? 'Registering...' : 'Confirm Free Consultation'}
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* VIEW F: LEGALTALK FORUM */}
      {activeTab === 'legaltalk' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] rounded-3xl p-8 text-white flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">COMMUNITY FORUM</span>
              <h1 className="text-3xl font-black mt-1">LegalTalk Ethiopia</h1>
            </div>
            <button onClick={() => setAskModalOpen(true)} className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs">
              + Ask a Free Question
            </button>
          </div>
        </main>
      )}

      {/* VIEW G: CLIENT PORTAL */}
      {activeTab === 'my-consultations' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CLIENT ACCOUNT HUB</span>
              <h1 className="text-3xl font-black mt-1">Your Legal Workspace</h1>
            </div>
            <button onClick={() => { setActiveTab('match'); setMatchStep(1); }} className="px-5 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
              + New Case
            </button>
          </div>

          <div className="space-y-4">
            {myConsultations.map((c) => {
              const stageObj = legalStages.find((s) => s.step === (c.case_stage || 1)) || legalStages[0];
              return (
                <div key={c.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-base text-[#0A1128]">{c.practice_area}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A1128] text-amber-400 flex items-center gap-1">
                        <Gavel className="w-3 h-3" />
                        <span>Stage {c.case_stage || 1}: {stageObj.am}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl line-clamp-2">{c.situation_description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedConsultationDetails(c); setModalTab('milestones'); }} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                      Track Hearing
                    </button>
                    <button onClick={() => { setSelectedConsultationDetails(c); setModalTab('room'); }} className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                      Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* 3. LEXDRAFT BUILDER MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  LEXDRAFT BILINGUAL ENGINE
                </span>
                <h3 className="font-black text-xl">{selectedTemplate.title}</h3>
                <span className="text-xs text-slate-300 font-mono mt-0.5 block">{selectedTemplate.statute}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocumentSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Select Output Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContractLanguage('bilingual')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      contractLanguage === 'bilingual' ? 'border-[#0A1128] bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>Bilingual (Dual-Col)</span>
                    <span className="text-[10px] opacity-80">ሁለት ቋንቋ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractLanguage('am')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      contractLanguage === 'am' ? 'border-[#0A1128] bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>አማርኛ ብቻ</span>
                    <span className="text-[10px] opacity-80">Amharic Script</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContractLanguage('en')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                      contractLanguage === 'en' ? 'border-[#0A1128] bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>English Only</span>
                    <span className="text-[10px] opacity-80">Commercial Text</span>
                  </button>
                </div>
              </div>

              {selectedTemplate.fields.map((f: any) => (
                <div key={f.key}>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">{f.label}</label>
                  <input
                    type="text"
                    required
                    value={docFormData[f.key] || ''}
                    onChange={(e) => setDocFormData({ ...docFormData, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedTemplate(null)} className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="w-2/3 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow">
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Generate & Export PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#060B1A] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          LegalLink Ethiopia • Statutory Document Automation & Dispute Resolution • Bole Road, Addis Ababa
        </div>
      </footer>

    </div>
  );
}