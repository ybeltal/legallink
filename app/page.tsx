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
  Mic, Square, Play, Trash2, Volume2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'calculator' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
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

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setAuthError(err.message || 'Failed to initiate Google sign-in.');
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

  const handleOpenReviewModal = (c: any) => {
    setReviewModalCase(c);
    setRatingScore(5);
    setReviewComment('');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalCase) return;

    setIsSubmittingReview(true);
    try {
      const supabase = createClient();
      const reviewerName = userProfile?.full_name || reviewModalCase.client_name || 'Verified Client';

      const { error } = await supabase.from('advocate_reviews').insert([
        {
          consultation_id: reviewModalCase.id,
          client_name: reviewerName,
          advocate_name: 'Advocate Mulu Haile',
          rating: ratingScore,
          review_comment: reviewComment.trim(),
        },
      ]);

      if (error) throw error;

      await fetchReviews();
      setReviewModalCase(null);
      showToast('Thank you! Your verified client review is live.');
    } catch (err: any) {
      alert('Could not submit review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // -------------------------------------------------------------
  // CONSULTATIONS & ESCROW REAL-TIME SYNC
  // -------------------------------------------------------------
  const [payingConsultation, setPayingConsultation] = useState<any | null>(null);
  const [telebirrPhone, setTelebirrPhone] = useState('0905941865');
  const [pushStatus, setPushStatus] = useState<'idle' | 'push_dispatched' | 'pin_processing' | 'confirmed'>('idle');
  const [activeTxnRef, setActiveTxnRef] = useState<string>('');
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('escrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setLiveTransactions(data);
    } catch (err) {
      console.error('Transactions fetch error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-consultations') {
      fetchMyConsultations();
      fetchTransactions();

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

      // 1. Upload voice note blob if recorded
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

      // 2. Insert consultation record
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
          payment_status: 'unpaid',
          escrow_amount: 1500,
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
      slots: ['10:00 AM', '2:00 PM', '4:30 PM'],
      bio: 'Senior Federal Advocate specializing in Ethiopian corporate law, M&A, and commercial contract drafting.',
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
      slots: ['9:30 AM', '1:00 PM', '3:30 PM'],
      bio: 'Trusted advocate for family mediation, divorce division of assets, child custody, and inheritance decrees.',
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
      slots: ['11:00 AM', '3:00 PM', '5:00 PM'],
      bio: 'Former land administration legal advisor. Expert in land lease titles, construction disputes, and property acquisition.',
      avatarInitials: 'DT',
    },
    {
      id: 'l4',
      name: 'Advocate Selamawit Girma',
      title: 'Immigration & Diaspora Counsel',
      experience: '8 yrs exp',
      rating: 4.85,
      reviews: 274,
      hourlyRate: 2000,
      location: 'Addis Ababa / Remote',
      slots: ['10:30 AM', '2:30 PM', '6:00 PM'],
      bio: 'Dedicated to helping the Ethiopian diaspora resolve legal claims, investment licensing, and dual citizenship matters remotely.',
      avatarInitials: 'SG',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      
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
                onClick={() => setActiveTab('legaltalk')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'legaltalk' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                LegalTalk
              </button>

              <button
                onClick={() => setActiveTab('lexdraft')}
                className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'lexdraft' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                LexDraft
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

              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 text-xs font-bold border border-amber-300 transition-all flex items-center gap-1 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 2. TAB ROUTING VIEW */}
      
      {/* VIEW A: LANDING PAGE */}
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
                    Connect with verified Ethiopian lawyers for consultations, document drafting, and compliance support—safeguarded by Telebirr USSD escrow holding.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>Find a Lawyer</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Calculator className="w-4 h-4" />
                      <span>Severance Pay Calculator</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center reveal reveal-delay-2">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-soft-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow">MH</div>
                      <div>
                        <h3 className="font-bold text-[#0A1128] text-base">Advocate Mulu Haile</h3>
                        <p className="text-xs text-slate-500">Corporate & Business Law</p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedLawyer(mockMatchedLawyers[0]); setActiveTab('match'); setMatchStep(4); }} className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                      Book Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW B: LABOR & SEVERANCE CALCULATOR */}
      {activeTab === 'calculator' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">STATUTORY TOOL</span>
              <h1 className="text-3xl sm:text-4xl font-black mt-1">Labor & Severance Pay Calculator</h1>
            </div>
            <button onClick={handlePrintLaborCalculation} className="px-6 py-3.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>Export Sheet</span>
            </button>
          </div>
        </main>
      )}

      {/* VIEW C: FIND A LAWYER MATCHING STEPPER WITH VOICE NOTE INTAKE */}
      {activeTab === 'match' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">ADVOCATE MATCH ENGINE</span>
            <h1 className="text-3xl font-black text-[#0A1128]">Connect with Counsel</h1>
            <p className="text-xs text-slate-500">Step {matchStep} of 4: Direct, friction-free case intake</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            {/* Step 1: Select Category */}
            {matchStep === 1 && (
              <div className="space-y-6">
                <h3 className="font-black text-base text-[#0A1128]">Step 1: What type of legal matter is this?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {practiceAreas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedCategory(p.id)}
                      className={`p-4 rounded-2xl border text-left font-bold text-xs flex justify-between items-center transition-all cursor-pointer ${
                        selectedCategory === p.id 
                          ? 'border-[#0A1128] bg-slate-100 text-[#0A1128]' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <span>{p.title}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{p.amTitle}</span>
                      </div>
                      {selectedCategory === p.id && <Check className="w-4 h-4 text-[#0A1128]" />}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setMatchStep(2)}
                    className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow"
                  >
                    <span>Continue to Details</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Language */}
            {matchStep === 2 && (
              <div className="space-y-5 text-xs">
                <h3 className="font-black text-base text-[#0A1128]">Step 2: Location & Language Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Your Jurisdiction / City</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Addis Ababa, Hawassa, Dire Dawa..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Preferred Consultation Language</label>
                    <select
                      value={consultLanguage}
                      onChange={(e) => setConsultLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                    >
                      <option value="Amharic">Amharic (አማርኛ)</option>
                      <option value="English">English</option>
                      <option value="Afaan Oromoo">Afaan Oromoo</option>
                      <option value="Tigrinya">Tigrinya</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setMatchStep(1)} className="px-4 py-2 text-slate-500 font-bold">Back</button>
                  <button onClick={() => setMatchStep(3)} className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl shadow">
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: 1-Tap Voice Recording or Type Brief */}
            {matchStep === 3 && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-base text-[#0A1128]">Step 3: Explain Your Legal Situation</h3>
                  
                  {/* Intake Mode Switcher */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setIntakeMode('voice')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        intakeMode === 'voice' ? 'bg-[#0A1128] text-amber-400 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Voice Note (ድምፅ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntakeMode('text')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        intakeMode === 'text' ? 'bg-[#0A1128] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Type Text</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Your Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs mb-4"
                  />
                </div>

                {/* MODE A: 1-TAP VOICE RECORDER */}
                {intakeMode === 'voice' && (
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-4">
                    <div className="max-w-md mx-auto space-y-2">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                        FASTEST & SIMPLEST FOR CLIENTS
                      </span>
                      <h4 className="font-black text-sm text-[#0A1128]">
                        Record a 60-Second Audio Brief in Amharic or English
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Explain who is involved, the dispute, and what help you need—just like sending a voice message.
                      </p>
                    </div>

                    {/* Live Recording State */}
                    {isRecording ? (
                      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl max-w-sm mx-auto space-y-3">
                        <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
                          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping"></span>
                          <span>Recording Voice Brief... {recordingSeconds}s / 60s</span>
                        </div>
                        <button
                          type="button"
                          onClick={stopVoiceRecording}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow"
                        >
                          <Square className="w-3.5 h-3.5 fill-white" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    ) : audioPreviewUrl ? (
                      /* Audio Preview & Playback Player */
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto space-y-3">
                        <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Voice Brief Ready ({recordingSeconds}s)</span>
                          </span>
                          <button
                            type="button"
                            onClick={clearVoiceRecording}
                            className="text-red-600 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Re-record</span>
                          </button>
                        </div>
                        <audio controls src={audioPreviewUrl} className="w-full h-9 rounded-lg" />
                      </div>
                    ) : (
                      /* Initial Start Record Button */
                      <div>
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="px-8 py-4 bg-[#0A1128] hover:bg-[#102A43] text-white font-black rounded-2xl text-xs inline-flex items-center gap-2.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
                        >
                          <Mic className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>Tap to Record Voice Brief (ድምፅ ይቅረጹ)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE B: STANDARD TEXT WRITING */}
                {intakeMode === 'text' && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Situation Overview</label>
                    <textarea
                      rows={5}
                      value={situationText}
                      onChange={(e) => setSituationText(e.target.value)}
                      placeholder="Describe the facts, contract dates, money owed, or dispute clearly..."
                      className="w-full p-4 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1128] leading-relaxed"
                    />
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={() => setMatchStep(2)} className="px-4 py-2 text-slate-500 font-bold">Back</button>
                  <button
                    onClick={() => {
                      if (!situationText.trim() && !audioBlob) {
                        return alert('Please record a voice note or type your legal brief.');
                      }
                      setSelectedLawyer(mockMatchedLawyers[0]);
                      setMatchStep(4);
                    }}
                    className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl shadow cursor-pointer"
                  >
                    Select Advocate & Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm Booking & Schedule */}
            {matchStep === 4 && selectedLawyer && (
              <div className="space-y-6 text-xs">
                <h3 className="font-black text-base text-[#0A1128]">Step 4: Confirm Counsel & Schedule</h3>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between">
                    <span>Assigned Advocate:</span>
                    <strong className="text-[#0A1128]">{selectedLawyer.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice Area:</span>
                    <span className="font-bold text-slate-700">{selectedCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intake Format:</span>
                    <span className="font-bold text-[#0A1128] flex items-center gap-1">
                      {audioBlob ? '🎙️ Voice Note Brief' : '📄 Written Legal Brief'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-[#0A1128]">
                    <span>Consultation Retainer:</span>
                    <span className="text-emerald-700 font-bold">Free (Platform Promotion)</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setMatchStep(3)} className="px-4 py-2 text-slate-500 font-bold">Back</button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-lg cursor-pointer transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Audio & Registering Case...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Consultation</span>
                      </>
                    )}
                  </button>
                </div>

                {bookingConfirmed && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                    <strong className="block">Consultation Successfully Saved!</strong>
                    <button
                      onClick={() => { setActiveTab('my-consultations'); setBookingConfirmed(false); }}
                      className="px-5 py-2 bg-[#0A1128] text-white rounded-xl font-bold text-xs"
                    >
                      View in Client Portal ➔
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* VIEW D: CLIENT PORTAL WITH VOICE AUDIO PLAYBACK */}
      {activeTab === 'my-consultations' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CLIENT ACCOUNT HUB</span>
              <h1 className="text-3xl font-black mt-1">Your Legal Workspace</h1>
              <p className="text-xs text-slate-300">Track court hearings (ቀጠሮ), case litigation stages, and voice briefs in real time.</p>
            </div>
            <button onClick={() => { setActiveTab('match'); setMatchStep(1); }} className="px-5 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
              + New Case
            </button>
          </div>

          <div className="space-y-4">
            {myConsultations.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                No active legal consultations found.
              </div>
            ) : (
              myConsultations.map((c) => {
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
                        {c.voice_note_url && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                            <Mic className="w-3 h-3 text-purple-600" />
                            <span>Voice Brief Attached</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 max-w-2xl line-clamp-2">{c.situation_description}</p>
                      
                      {/* Embedded Audio Player if voice note exists */}
                      {c.voice_note_url && (
                        <div className="pt-2">
                          <audio controls src={c.voice_note_url} className="h-8 max-w-sm rounded" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedConsultationDetails(c); setModalTab('milestones'); }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Track Hearing & Progress</span>
                      </button>
                      <button
                        onClick={() => { setSelectedConsultationDetails(c); setModalTab('room'); }}
                        className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs"
                      >
                        Chat Room
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-[#060B1A] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="LegalLink" style={{ width: '32px', height: '32px' }} className="w-8 h-8 object-contain" />
                <span className="text-lg font-black text-white">Legal<span className="text-amber-400">Link</span></span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm">Ethiopia's premier legal marketplace connecting clients with verified advocates for trusted advice, dispute resolution, and document automation.</p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase mb-3">Platform</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li onClick={() => { setActiveTab('match'); setMatchStep(1); }} className="cursor-pointer hover:text-white">Find a Lawyer</li>
                <li onClick={() => setActiveTab('calculator')} className="cursor-pointer hover:text-white">Severance Calculator</li>
                <li onClick={() => setActiveTab('legaltalk')} className="cursor-pointer hover:text-white">LegalTalk Forum</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/admin" className="hover:text-amber-400">Admin Console ↗</Link></li>
                <li><Link href="/advocate" className="hover:text-amber-400">Advocate Workspace ↗</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}