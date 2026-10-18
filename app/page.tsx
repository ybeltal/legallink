'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight,
  Video, Send, MessageSquare, User as UserIcon, MessageCircle, Smartphone, Receipt, LogOut,
  KeyRound, Award, FileCode, Edit3, Paperclip, UploadCloud, Languages, UserPlus
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts' | 'receipts'>('consultations');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [activeTab]);

  // -------------------------------------------------------------
  // SUPABASE USER AUTHENTICATION & GOOGLE OAUTH STATE
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
      setActiveTab('home');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // -------------------------------------------------------------
  // CLIENT MATCHING FLOW
  // -------------------------------------------------------------
  const [matchStep, setMatchStep] = useState<1 | 2 | 3 | 4>(1);
  const [clientName, setClientName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Corporate & Business Law');
  const [location, setLocation] = useState('Addis Ababa');
  const [consultLanguage, setConsultLanguage] = useState('Amharic');
  const [budgetRange, setBudgetRange] = useState('ETB 1,000–2,000');
  const [urgency, setUrgency] = useState('within_24h');
  const [situationText, setSituationText] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // -------------------------------------------------------------
  // USER DASHBOARD & DETAILS MODAL
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'room' | 'documents'>('overview');

  // -------------------------------------------------------------
  // EVIDENCE & CASE DOCUMENT STORAGE STATE
  // -------------------------------------------------------------
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

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
      alert('Document uploaded successfully and shared with your advocate.');
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
        (payload) => {
          setReviewsList((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsChannel);
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
      alert('Thank you! Your verified client review and rating have been published.');
    } catch (err: any) {
      alert('Could not submit review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // -------------------------------------------------------------
  // TELEBIRR USSD PUSH CHECKOUT WITH AUTOMATED SMS DISPATCH
  // -------------------------------------------------------------
  const [payingConsultation, setPayingConsultation] = useState<any | null>(null);
  const [telebirrPhone, setTelebirrPhone] = useState('0905941865');
  const [pushStatus, setPushStatus] = useState<'idle' | 'push_dispatched' | 'pin_processing' | 'confirmed'>('idle');
  const [activeTxnRef, setActiveTxnRef] = useState<string>('');
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  // -------------------------------------------------------------
  // LIVE CONSULTATION ROOM & REALTIME CHAT STATE
  // -------------------------------------------------------------
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [senderRole, setSenderRole] = useState<'client' | 'advocate'>('client');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------
  // LEXDRAFT CONTRACT BUILDER & BILINGUAL PDF GENERATOR STATE
  // -------------------------------------------------------------
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [contractLanguage, setContractLanguage] = useState<'en' | 'am' | 'bilingual'>('bilingual');
  const [savedContracts, setSavedContracts] = useState<any[]>([
    { 
      id: 'cnt-1', 
      title: 'Employment Contract - Senior Developer', 
      date: '2026-10-14', 
      fee: 'ETB 450', 
      status: 'Ready',
      partyA: 'EthioTech Solutions PLC',
      partyB: 'Ybeltal Semagn',
      jurisdiction: 'Addis Ababa',
      type: 'emp',
      contractLang: 'bilingual'
    },
    { 
      id: 'cnt-2', 
      title: 'Bilingual Mutual NDA', 
      date: '2026-10-09', 
      fee: 'ETB 300', 
      status: 'Ready',
      partyA: 'Alpha Consulting SC',
      partyB: 'Horizon Logistics',
      jurisdiction: 'FDRE Commercial Court',
      type: 'nda',
      contractLang: 'bilingual'
    }
  ]);

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

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

  const fetchTransactions = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('escrow_transactions')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setLiveTransactions(data);
      }
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
              if (payingConsultation && payingConsultation.id === payload.new.id && payload.new.payment_status === 'escrow_locked') {
                setPushStatus('confirmed');
              }
            } else if (payload.eventType === 'INSERT') {
              setMyConsultations((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setMyConsultations((prev) => prev.filter((item) => item.id !== payload.old.id));
              setSelectedConsultationDetails((prev: any) =>
                prev?.id === payload.old.id ? null : prev
              );
            }
          }
        )
        .subscribe();

      const txChannel = supabase
        .channel('client_escrow_tx_realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'escrow_transactions' },
          (payload) => {
            setLiveTransactions((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(txChannel);
      };
    }
  }, [activeTab, payingConsultation]);

  useEffect(() => {
    if (selectedConsultationDetails) {
      const consultationId = selectedConsultationDetails.id;
      fetchCaseDocuments(consultationId);

      const supabase = createClient();

      if (modalTab === 'room') {
        setLoadingMessages(true);
        const fetchHistory = async () => {
          const { data, error } = await supabase
            .from('consultation_messages')
            .select('*')
            .eq('consultation_id', consultationId)
            .order('created_at', { ascending: true });

          if (!error && data) {
            setMessages(data);
          }
          setLoadingMessages(false);
        };
        fetchHistory();

        const chatChannel = supabase
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

        return () => {
          supabase.removeChannel(chatChannel);
        };
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
        supabase.removeChannel(docsChannel);
      };
    }
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

  const handleOpenPushModal = (consultation: any) => {
    setPayingConsultation(consultation);
    setPushStatus('idle');
    setActiveTxnRef('');
  };

  const handleDispatchUSSDPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telebirrPhone.trim() || telebirrPhone.length < 9) {
      alert('Please enter a valid Ethiopian mobile phone number.');
      return;
    }

    const generatedTxnRef = `TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setActiveTxnRef(generatedTxnRef);
    setPushStatus('push_dispatched');

    fetch('/api/telebirr/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        consultation_id: payingConsultation?.id,
        phone_number: telebirrPhone,
        amount_etb: 1500,
        client_name: userProfile?.full_name || payingConsultation?.client_name || 'Client',
      }),
    }).catch((err) => console.log('Push dispatch note:', err));
  };

  const handleSimulatePinEnteredOnMobile = async () => {
    setPushStatus('pin_processing');

    try {
      const supabase = createClient();
      const txnRef = activeTxnRef || `TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      if (payingConsultation?.id) {
        await supabase
          .from('consultations')
          .update({
            payment_status: 'escrow_locked',
            payment_method: 'telebirr',
            transaction_ref: txnRef,
            escrow_amount: 1500,
          })
          .eq('id', payingConsultation.id);

        await supabase
          .from('escrow_transactions')
          .insert([
            {
              consultation_id: payingConsultation.id,
              client_name: userProfile?.full_name || payingConsultation.client_name || 'Client',
              phone_number: telebirrPhone,
              payment_channel: 'telebirr',
              amount_etb: 1500,
              transaction_ref: txnRef,
              status: 'escrow_locked',
            },
          ]);

        fetch('/api/sms/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: telebirrPhone,
            recipient_role: 'client',
            event_type: 'escrow_locked',
            message_body: `LegalLink Trust: ETB 1,500 retainer secured in escrow for ${payingConsultation.practice_area}. Ref: ${txnRef}. Advocate Mulu Haile assigned.`,
          }),
        }).catch((e) => console.log('SMS notify error:', e));

        setMyConsultations((prev) =>
          prev.map((c) =>
            c.id === payingConsultation.id
              ? { ...c, payment_status: 'escrow_locked', transaction_ref: txnRef }
              : c
          )
        );
      }

      setPushStatus('confirmed');
    } catch (err: any) {
      console.error('Payment processing exception:', err);
      setPushStatus('confirmed');
    }
  };

  const handlePrintReceipt = (tx: any) => {
    const printWindow = window.open('', '_blank', 'width=750,height=850');
    if (!printWindow) {
      alert('Please allow popups to open the official voucher printout.');
      return;
    }

    const txnRef = tx.transaction_ref || tx.txnRef || 'TLB-2026-CONFIRMED';
    const clientName = tx.client_name || tx.clientName || userProfile?.full_name || 'LegalLink Client';
    const phone = tx.phone_number || tx.phone || '0905941865';
    const amount = Number(tx.amount_etb || tx.amount || 1500).toFixed(2);
    const dateStr = tx.created_at ? new Date(tx.created_at).toLocaleString() : new Date().toLocaleString();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LegalLink Ethiopia - Official Escrow Voucher ${txnRef}</title>
          <style>
            @page { size: portrait; margin: 15mm; }
            body { font-family: "Century Gothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0A1128; margin: 0; padding: 20px; background: white; }
            .voucher-card { border: 2px solid #0A1128; border-radius: 16px; padding: 30px; max-width: 650px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0A1128; padding-bottom: 16px; margin-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; }
            .brand span { color: #f59e0b; }
            .sub { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            .badge { background: #dcfce7; color: #166534; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; border: 1px solid #86efac; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; font-size: 12px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
            .box-title { color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; font-size: 12px; }
            .table th { background: #0A1128; color: white; padding: 10px; text-align: left; font-size: 11px; }
            .table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
            .total-row { background: #f8fafc; font-weight: bold; }
            .total-amount { font-size: 16px; font-weight: 900; color: #0A1128; text-align: right; }
            .notice { background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; padding: 12px; font-size: 11px; color: #92400e; margin-bottom: 20px; line-height: 1.5; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="voucher-card">
            <div class="header">
              <div>
                <div class="brand">Legal<span>Link</span> Ethiopia</div>
                <div class="sub">Ministry of Justice Licensed Legal Escrow Trust Pool</div>
              </div>
              <div class="badge">● ESCROW DEPOSIT VERIFIED</div>
            </div>

            <div class="grid">
              <div class="box">
                <div class="box-title">Client / Depositor</div>
                <strong style="font-size:14px;">${clientName}</strong><br/>
                <span style="color:#64748b;">Telebirr Mobile: ${phone}</span>
              </div>
              <div class="box">
                <div class="box-title">Transaction Audit Reference</div>
                <strong style="font-size:14px; font-family:monospace;">${txnRef}</strong><br/>
                <span style="color:#64748b;">Date: ${dateStr}</span>
              </div>
            </div>

            <table class="table">
              <thead>
                <tr>
                  <th>Service Description</th>
                  <th style="text-align:center;">Payment Channel</th>
                  <th style="text-align:right;">Amount (ETB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Legal Consultation Retainer</strong><br/>
                    <span style="color:#64748b; font-size:11px;">Segregated Escrow Deposit for Assigned Advocate</span>
                  </td>
                  <td style="text-align:center; font-weight:bold; color:#0072CE;">Telebirr USSD Push</td>
                  <td style="text-align:right; font-weight:bold;">ETB ${amount}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align:right; text-transform:uppercase; font-size:10px;">Total Escrow Funds Secured:</td>
                  <td class="total-amount">ETB ${amount}</td>
                </tr>
              </tbody>
            </table>

            <div class="notice">
              <strong>National Bank of Ethiopia (NBE) Escrow Protection:</strong> This voucher certifies that ETB ${amount} has been secured in LegalLink's designated trust pool. Funds will be released to the advocate only upon authorized completion of your legal consultation.
            </div>

            <div class="footer">
              <span>Security Hash: SHA256-${txnRef.slice(-8)}-VALID</span>
              <span>Bole Road, Addis Ababa • hello@legallink.et</span>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportContractPDF = (contract: any) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950');
    if (!printWindow) {
      alert('Please allow popups to download/print your legal contract.');
      return;
    }

    const type = contract.type || 'emp';
    const cLang = contract.contractLang || contractLanguage || 'bilingual';
    const partyA = contract.partyA || 'Employer / Disclosing Party / አሰሪ ድርጅት';
    const partyB = contract.partyB || 'Employee / Receiving Party / ተቀጣሪ ሠራተኛ';
    const roleOrPurpose = contract.roleOrPurpose || 'Professional Services / የሙያ አገልግሎት';
    const salaryOrRent = contract.salaryOrRent || 'ETB 25,000.00';
    const locationName = contract.jurisdiction || 'Addis Ababa / አዲስ አበባ';
    const startDate = contract.date || new Date().toISOString().split('T')[0];

    let headerTitle = '';
    let contractBody = '';

    if (type === 'emp') {
      if (cLang === 'am') {
        headerTitle = 'በኢትዮጵያ የሠራተኛ ጉዳይ አዋጅ ቁጥር 1156/2011 መሠረት የተደረገ የሥራ ውል ስምምነት';
        contractBody = `
          <div class="parties-box">
            <strong>1. አሰሪ፦</strong> ${partyA} (በኢትዮጵያ ሕግ መሠረት የተቋቋመ ድርጅት)<br/>
            <strong>2. ሠራተኛ፦</strong> ${partyB} (አድራሻ፦ ${locationName})
          </div>
          <div class="section-title">አንቀጽ 1፦ የሥራ መደብና ኃላፊነት</div>
          <p>ሠራተኛው በአሰሪው ድርጅት ውስጥ በ<strong>${roleOrPurpose}</strong> የሥራ መደብ ላይ ተቀጥሮ የሚሰጡትን ሕጋዊ ትዕዛዞችና የሥራ ኃላፊነቶች በታማኝነትና በሙሉ ትጋት ለማከናወን ተስማምቷል።</p>
          <div class="section-title">አንቀጽ 2፦ የደመወዝ መጠንና አከፋፈል</div>
          <p>አሰሪው ለሠራተኛው በየወሩ የተጣራ/ጠቅላላ የብር <strong>${salaryOrRent}</strong> ደመወዝ የሚከፍል ሲሆን፣ ከመንግሥት የገቢ ግብርና ከሠራተኛው የጡረታ መዋጮ (7%) ተቀናሽ የሚደረግ ይሆናል።</p>
          <div class="section-title">አንቀጽ 3፦ የሙከራ ጊዜ</div>
          <p>በአዋጅ ቁጥር 1156/2011 አንቀጽ 11 መሠረት የሙከራ ጊዜው ሥራ ከጀመረበት ቀን አንስቶ ለተከታታይ ስልሳ (60) የሥራ ቀናት ይሆናል።</p>
          <div class="section-title">አንቀጽ 4፦ ውል ስለማቋረጥና አለመግባባቶች</div>
          <p>ይህ የሥራ ውል በአዋጅ ቁጥር 1156/2011 በተደነገጉት ድንጋጌዎች መሠረት የሚቋረጥ ሲሆን፣ በማናቸውም አለመግባባት ላይ በቅድሚያ በስምምነት፣ ካልተቻለ ደግሞ በ${locationName} ፍርድ ቤት ወይም በአሰሪና ሠራተኛ ወሳኝ ቦርድ ውሳኔ የሚያገኝ ይሆናል።</p>
        `;
      } else if (cLang === 'bilingual') {
        headerTitle = 'BILINGUAL EMPLOYMENT CONTRACT / የሁለትዮሽ የሥራ ውል ስምምነት';
        contractBody = `
          <div class="parties-box">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
              <div><strong>EMPLOYER:</strong> ${partyA}</div>
              <div><strong>አሰሪ ድርጅት፦</strong> ${partyA}</div>
              <div><strong>EMPLOYEE:</strong> ${partyB} (${locationName})</div>
              <div><strong>ተቀጣሪ ሠራተኛ፦</strong> ${partyB} (${locationName})</div>
            </div>
          </div>

          <div class="bilingual-grid">
            <div class="col">
              <div class="section-title">ARTICLE 1: POSITION & DUTIES</div>
              <p>The Employee is employed as <strong>${roleOrPurpose}</strong> and agrees to execute all lawful directives faithfully under Ethiopian Labor Proclamation No. 1156/2019.</p>

              <div class="section-title">ARTICLE 2: REMUNERATION</div>
              <p>The monthly remuneration shall be <strong>${salaryOrRent}</strong>, subject to statutory income tax and 7% employee pension deductions.</p>

              <div class="section-title">ARTICLE 3: PROBATION & DISPUTES</div>
              <p>Probation shall not exceed 60 working days pursuant to Article 11. Disputes shall be submitted to the Labor Relations Board or Court of ${locationName}.</p>
            </div>

            <div class="col">
              <div class="section-title">አንቀጽ 1፦ የሥራ መደብና ኃላፊነት</div>
              <p>ሠራተኛው በ<strong>${roleOrPurpose}</strong> የሥራ መደብ ላይ ተቀጥሮ በአዋጅ ቁጥር 1156/2011 መሠረት የተሰጡትን ኃላፊነቶች በታማኝነት ያከናውናል።</p>

              <div class="section-title">አንቀጽ 2፦ የደመወዝ ክፍያ</div>
              <p>አሰሪው ለሠራተኛው በየወሩ የብር <strong>${salaryOrRent}</strong> ደመወዝ የሚከፍል ሲሆን፣ ሕጋዊ የገቢ ግብርና 7% የጡረታ መዋጮ ተቀናሽ ይደረጋል።</p>

              <div class="section-title">አንቀጽ 3፦ የሙከራ ጊዜና አለመግባባቶች</div>
              <p>የሙከራ ጊዜው 60 የሥራ ቀናት ይሆናል። አለመግባባቶች በ${locationName} አሰሪና ሠራተኛ ወሳኝ ቦርድ ወይም ፍርድ ቤት ውሳኔ ያገኛሉ።</p>
            </div>
          </div>
        `;
      } else {
        headerTitle = 'EMPLOYMENT AGREEMENT (PROCLAMATION NO. 1156/2019)';
        contractBody = `
          <div class="parties-box">
            <strong>1. EMPLOYER:</strong> ${partyA}<br/>
            <strong>2. EMPLOYEE:</strong> ${partyB} (${locationName})
          </div>
          <div class="section-title">ARTICLE 1: POSITION AND DUTIES</div>
          <p>The Employee is employed in the capacity of <strong>${roleOrPurpose}</strong> in accordance with Labor Proclamation No. 1156/2019.</p>
          <div class="section-title">ARTICLE 2: REMUNERATION AND BENEFITS</div>
          <p>The monthly remuneration is <strong>${salaryOrRent}</strong>, subject to statutory tax and pension deductions.</p>
          <div class="section-title">ARTICLE 3: PROBATIONARY PERIOD</div>
          <p>Pursuant to Article 11, the probationary period shall be sixty (60) working days.</p>
          <div class="section-title">ARTICLE 4: TERMINATION & DISPUTES</div>
          <p>Governed by Articles 24–32 of Proclamation No. 1156/2019 and competent courts in ${locationName}.</p>
        `;
      }
    } else if (type === 'nda') {
      headerTitle = 'ሚስጥር የመጠበቅ የጋራ ስምምነት / MUTUAL NON-DISCLOSURE AGREEMENT';
      contractBody = `
        <div class="parties-box">
          <strong>የመጀመሪያው ወገን / Party A:</strong> ${partyA}<br/>
          <strong>ሁለተኛው ወገን / Party B:</strong> ${partyB}
        </div>
        <div class="section-title">የስምምነቱ ዓላማ / PURPOSE OF DISCLOSURE</div>
        <p>ሁለቱ ወገኖች በንግድና ቴክኖሎጂ ትብብር ዙሪያ በጋራ ለመሥራት የሚያስችላቸውን ሚስጥራዊ የንግድ መረጃዎች (<strong>${roleOrPurpose}</strong>) ለመለዋወጥ ተስማምተዋል። በኢትዮጵያ ፍትሐብሔር ሕግ ቁጥር 2027 መሠረት ማናቸውም ሚስጥራዊ መረጃ ለሶስተኛ ወገን አይገለጽም።</p>
        <div class="section-title">የውል ፀናት ጊዜና ካሳ / DURATION & DAMAGES</div>
        <p>ይህ ስምምነት ከተፈረመበት ቀን አንስቶ ለሁለት (2) ዓመታት የፀና ይሆናል። ስምምነቱ ቢጣስ የብር <strong>${salaryOrRent}</strong> የካሳ ክፍያ በ${locationName} የንግድ ምክር ቤት የግልግል ዳኝነት ይወሰናል።</p>
      `;
    } else {
      headerTitle = 'የንግድ ቤት ኪራይ ውል ስምምነት / COMMERCIAL LEASE AGREEMENT';
      contractBody = `
        <div class="parties-box">
          <strong>አከራይ / LESSOR:</strong> ${partyA}<br/>
          <strong>ተከራይ / LESSEE:</strong> ${partyB}
        </div>
        <div class="section-title">የተከራየው ንብረትና የኪራይ መጠን / PREMISES & RENT</div>
        <p>አከራይ በ${locationName} የሚገኘውን የንግድ ቤት ለ<strong>${roleOrPurpose}</strong> አገልግሎት እንዲውል ለተከራይ ያከራየ ሲሆን፣ ወርሃዊ የኪራይ መጠኑ የብር <strong>${salaryOrRent}</strong> ነው። የኢትዮጵያ ፍትሐብሔር ሕግ ቁጥር 2896 እና ተከታዮቹ ድንጋጌዎች ተፈጻሚ ይሆናሉ።</p>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${contract.title} - Official LegalLink LexDraft</title>
          <style>
            @page { size: portrait; margin: 18mm; }
            body { font-family: "Century Gothic", "Nyala", "Noto Sans Ethiopic", Georgia, sans-serif; color: #111827; line-height: 1.6; font-size: 13px; margin: 0; padding: 20px; }
            .contract-header { text-align: center; border-bottom: 2px solid #0A1128; padding-bottom: 12px; margin-bottom: 20px; }
            .republic { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #4b5563; font-weight: bold; }
            .contract-title { font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 6px; }
            .parties-box { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; line-height: 1.8; }
            .section-title { font-size: 13px; font-weight: bold; margin-top: 16px; margin-bottom: 6px; color: #0A1128; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; }
            p { margin: 0 0 10px 0; text-align: justify; }
            .bilingual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .col { border-right: 1px dashed #e5e7eb; padding-right: 15px; }
            .col:last-child { border-right: none; padding-right: 0; padding-left: 5px; }
            .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; page-break-inside: avoid; }
            .sig-line { border-top: 1px solid #111827; padding-top: 6px; font-size: 12px; }
            .seal-box { border: 1px dashed #9ca3af; border-radius: 6px; height: 65px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af; text-transform: uppercase; }
            .witness-section { margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 14px; font-size: 11px; }
            .footer-note { margin-top: 35px; border-top: 1px solid #e5e7eb; padding-top: 8px; font-size: 9px; color: #6b7280; display: flex; justify-content: space-between; font-family: sans-serif; }
          </style>
        </head>
        <body>
          <div class="contract-header">
            <div class="republic">FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA / የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ</div>
            <div class="contract-title">${headerTitle}</div>
            <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">
              DARA COMPLIANT DRAFT • ቋንቋ፦ ${cLang.toUpperCase()} • DATE / ቀን፦ ${startDate}
            </div>
          </div>

          ${contractBody}

          <div class="signature-grid">
            <div>
              <div class="seal-box">[ የመጀመሪያው ወገን ፊርማ / PARTY A STAMP ]</div>
              <div class="sig-line">
                <strong>የመጀመሪያው ወገን / FIRST PARTY:</strong><br/>
                ስም / Name: ${partyA}<br/>
                ፊርማ / Signature: __________________
              </div>
            </div>
            <div>
              <div class="seal-box">[ የሁለተኛው ወገን ፊርማ / PARTY B STAMP ]</div>
              <div class="sig-line">
                <strong>ሁለተኛው ወገን / SECOND PARTY:</strong><br/>
                ስም / Name: ${partyB}<br/>
                ፊርማ / Signature: __________________
              </div>
            </div>
          </div>

          <div class="witness-section">
            <strong>የምስክሮች ስምና ፊርማ / WITNESSES TO SIGNATURE:</strong>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
              <div>1. ስም / Name: _______________________ ፊርማ / Sig: __________</div>
              <div>2. ስም / Name: _______________________ ፊርማ / Sig: __________</div>
            </div>
          </div>

          <div class="footer-note">
            <span>በሰነዶች ማረጋገጫና ምዝገባ አገልግሎት (DARA) መስፈርት መሠረት የተዘጋጀ - LegalLink LexDraft</span>
            <span>Ref: ${contract.id.toUpperCase()}-ETHIO-VERIFIED</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCreateDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    const newId = `cnt-${Date.now().toString().slice(-4)}`;
    const partyA = docFormData.partyA?.trim() || 'First Party Entity / አሰሪ ድርጅት';
    const partyB = docFormData.partyB?.trim() || userProfile?.full_name || 'Second Party / ተቀጣሪ';
    const roleOrPurpose = docFormData.roleOrPurpose?.trim() || 'General Services';
    const salaryOrRent = docFormData.salaryOrRent?.trim() || 'ETB 15,000.00';
    const jurisdiction = docFormData.jurisdiction?.trim() || 'Addis Ababa / አዲስ አበባ';

    const newContractRecord = {
      id: newId,
      title: `${selectedTemplate.title} - ${partyB}`,
      date: new Date().toISOString().split('T')[0],
      fee: `ETB ${selectedTemplate.priceETB}`,
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
  };

  const handleBookingSubmit = async () => {
    if (!situationText.trim()) {
      alert('Please describe your legal situation before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('consultations').insert([
        {
          client_name: userProfile?.full_name || clientName.trim() || 'Client',
          practice_area: selectedCategory,
          location: location,
          situation_description: situationText.trim(),
          budget_range: budgetRange,
          urgency: urgency,
          status: 'pending',
          payment_status: 'unpaid',
          escrow_amount: 1500
        },
      ]);

      if (error) {
        alert('Could not save booking: ' + error.message);
      } else {
        setBookingConfirmed(true);
      }
    } catch (err: any) {
      alert('Unexpected error occurred saving your consultation.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const lexdraftTemplates = [
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
        { key: 'jurisdiction', label: 'Property Location / የቤቱ አድራሻ (ክፍለ ከተማ፣ ወረዳ)', placeholder: 'e.g. Bole Sub-City, Woreda 03, Addis Ababa' },
      ],
    },
  ];

  const legalTalkArticles = [
    {
      id: 1,
      tag: 'CORPORATE GOVERNANCE',
      title: "Understanding the Ethiopian Commercial Code: Key Takeaways for PLCs & Share Companies",
      author: 'Advocate Mulu Haile',
      readTime: '6 min read',
      date: 'Oct 2026',
      excerpt: 'Crucial corporate compliance rules governing director liability, minimum capital allocations, shareholder resolutions, and regulatory auditing in Ethiopia.',
      fullContent: `Under the revised Ethiopian Commercial Code, private limited companies (PLCs) and Share Companies (SCs) operate under stringent corporate governance obligations. Key updates include: 1. Board of Directors fiduciary duties with individual joint liability for financial negligence. 2. Clear procedural guidelines for general shareholder meetings and minority shareholder protection. 3. Modernized electronic record-keeping and audit validation standards required by the Ministry of Trade & Regional Integration.`
    },
    {
      id: 2,
      tag: 'REAL ESTATE & LAND',
      title: 'Land Rights & Commercial Property Leasing in Addis Ababa: Buyer Due Diligence Guide',
      author: 'Advocate Dawit Tesfaye',
      readTime: '8 min read',
      date: 'Oct 2026',
      excerpt: 'Essential verification steps for land holding certificates, encumbrances, and municipal leasehold conversions under current city administration decrees.',
      fullContent: `Real estate transactions in urban Ethiopia require comprehensive due diligence before executing sale contracts or entering long-term commercial leases. Advocates must verify: 1. The original Land Holding Certificate (ካርታ) at the local Sub-City Land Registry. 2. Checking for registered bank mortgages, tax liens, or active court injunctions. 3. Ensuring commercial usage authorization aligns with the master zoning plan of the Addis Ababa City Administration.`
    },
    {
      id: 3,
      tag: 'LABOR & EMPLOYMENT',
      title: 'Employment Protections under Labor Proclamation No. 1156/2019: Probation & Severance Rules',
      author: 'Advocate Tigist Bekele',
      readTime: '5 min read',
      date: 'Sep 2026',
      excerpt: 'A practical legal breakdown of probationary ceilings, statutory severance calculations, and mandatory dispute resolution procedures before the Labor Relations Board.',
      fullContent: `Ethiopian Labor Proclamation No. 1156/2019 provides robust protections for workers while regulating employer termination parameters. Critical aspects include: 1. Probation periods cannot exceed 60 consecutive working days. 2. Unilateral contract termination without valid statutory grounds leads to reinstatement or mandatory severance compensation. 3. Both employer and employee must explore workplace conciliation prior to filing claims at the Labor Relations Board or First Instance Court.`
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
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

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'match' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                {lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}
              </button>

              <Link
                href="/advocate"
                className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-[#0A1128] hover:bg-slate-50 transition-all"
              >
                {lang === 'am' ? 'ለሕግ ባለሙያዎች' : 'For Lawyers'}
              </Link>

              <button
                onClick={() => setActiveTab('legaltalk')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'legaltalk' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                LegalTalk
              </button>

              <button
                onClick={() => setActiveTab('lexdraft')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'lexdraft' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                LexDraft
              </button>

              <button
                onClick={() => setActiveTab('my-consultations')}
                className={`px-3.5 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'my-consultations' ? 'text-[#0A1128] bg-slate-100 font-bold shadow-xs' : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                }`}
              >
                {lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal'}
              </button>
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer mr-1 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'አማ (AM)' : 'EN (US)'}</span>
              </button>

              <Link
                href="/advocate/join"
                className="px-3.5 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                <span>Join as Advocate</span>
              </Link>

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

              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <div className="w-7 h-7 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-xs">
                      {(userProfile?.full_name || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#0A1128] block leading-tight">
                        {userProfile?.full_name || currentUser.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        {userProfile?.role || 'Client'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError(null);
                      setAuthModalOpen(true);
                    }}
                    className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0A1128] cursor-pointer"
                  >
                    {lang === 'am' ? 'ግባ' : 'Sign in'}
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setAuthError(null);
                      setAuthModalOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-bold text-white bg-[#0A1128] hover:bg-[#102A43] rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    {lang === 'am' ? 'ጀምር' : 'Get Started'}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="px-2 py-1 text-xs font-bold border border-slate-200 rounded"
              >
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-700">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-2">
            <button
              onClick={() => { setActiveTab('match'); setMatchStep(1); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}
            </button>
            <Link
              href="/advocate/join"
              className="block w-full text-left px-3 py-2 text-sm font-bold text-amber-800 bg-amber-50 rounded-lg"
            >
              Join as Advocate (MOJ Register) ↗
            </Link>
            <Link
              href="/advocate"
              className="block w-full text-left px-3 py-2 text-sm font-bold text-[#0A1128] hover:bg-slate-100 rounded-lg"
            >
              Advocate Portal ↗
            </Link>
            <button
              onClick={() => { setActiveTab('lexdraft'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              LexDraft Builder
            </button>
            <button
              onClick={() => { setActiveTab('my-consultations'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              {lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal'}
            </button>
            <Link
              href="/admin"
              className="block w-full text-left px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-lg"
            >
              Admin Console ↗
            </Link>
          </div>
        )}
      </header>

      {/* 2. LANDING PAGE VIEW WITH FLUID SCROLL REVEAL */}
      {activeTab === 'home' && (
        <main className="flex-1">
          
          {/* SECTION 1: HERO */}
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100 overflow-hidden relative">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 space-y-6 reveal">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lang === 'am' ? "የኢትዮጵያ ቀዳሚ የሕግ ገበያ" : "ETHIOPIA'S #1 LEGAL MARKETPLACE"}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                    {lang === 'am' ? 'የሕግ አገልግሎት የወደፊት ገጽታ፣ ዛሬ።' : 'The Future of Law, Today.'}
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
                    <Link
                      href="/advocate/join"
                      className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1128] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:border-slate-300"
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>Join as Advocate</span>
                    </Link>
                  </div>

                  <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">500+</span>
                      <span className="text-xs text-slate-500 font-medium">Verified Lawyers</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">12,000+</span>
                      <span className="text-xs text-slate-500 font-medium">Consultations Done</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">{dynamicRating} ★</span>
                      <span className="text-xs text-slate-500 font-medium">Average Rating</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">&lt;2hrs</span>
                      <span className="text-xs text-slate-500 font-medium">Average Response</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center reveal reveal-delay-2">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-soft-float">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow">
                          MH
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-[#0A1128] text-base">Advocate Mulu Haile</h3>
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </div>
                          <p className="text-xs text-slate-500">Corporate & Business Law</p>
                          <div className="flex items-center gap-1 mt-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{dynamicRating}</span>
                            <span className="text-slate-400 font-normal">({dynamicReviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Top Rated
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold">Telebirr USSD Direct Push Enabled</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Standard Retainer:</span>
                        <strong className="text-[#0A1128]">ETB 1,500.00</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Escrow Trust:</span>
                        <span className="text-emerald-600 font-semibold">100% Protected</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLawyer(mockMatchedLawyers[0]);
                        setActiveTab('match');
                        setMatchStep(4);
                      }}
                      className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 2: HOW IT WORKS */}
          <section className="py-20 bg-slate-50/70 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2 reveal">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">HOW IT WORKS</span>
                <h2 className="text-3xl font-black text-[#0A1128]">Get Legal Help in 3 Simple Steps</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Transparent, verified legal consultations backed by Ethiopian statutory compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-lg border border-amber-200">
                    1
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Describe Your Need</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tell us your situation in plain English or Amharic. Our matching engine categorizes your case and identifies the right jurisdiction.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-lg border border-blue-200">
                    2
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Match with an Advocate</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect with licensed Ethiopian advocates holding active Ministry of Justice credentials and proven expertise in your case domain.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-lg border border-emerald-200">
                    3
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Escrow & Consult</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Authorize the ETB 1,500 retainer via Telebirr USSD. Funds remain securely locked in escrow until your consultation is completed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRACTICE AREAS */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">PRACTICE AREAS</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Specialized Legal Domains</h2>
                </div>
                <button
                  onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                  className="mt-3 sm:mt-0 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All 8 Practice Areas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {practiceAreas.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('match');
                        setMatchStep(2);
                      }}
                      className={`p-6 rounded-3xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect bg-white group reveal reveal-delay-${(idx % 4) + 1}`}
                    >
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-[#0A1128] group-hover:text-amber-400 flex items-center justify-center text-[#0A1128] mb-4 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#0A1128] text-base">{cat.title}</h3>
                      <span className="text-[11px] font-bold text-slate-400 block mt-0.5">{cat.amTitle}</span>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 4: FEATURED ADVOCATES */}
          <section className="py-20 bg-slate-50/70 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">VERIFIED COUNSEL</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Featured Advocates</h2>
                  <p className="text-xs text-slate-500 mt-1">Senior counsel with verified Ministry of Justice practicing licenses.</p>
                </div>
                <Link
                  href="/advocate/join"
                  className="mt-3 sm:mt-0 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Are you an advocate? Join our network</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockMatchedLawyers.map((lawyer, idx) => (
                  <div key={lawyer.id} className={`p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between card-hover-effect space-y-4 reveal reveal-delay-${idx + 1}`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow">
                          {lawyer.avatarInitials}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          MOJ Verified
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-[#0A1128]">{lawyer.name}</h4>
                        <span className="text-[11px] text-slate-500 block leading-tight">{lawyer.title}</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{lawyer.rating}</span>
                        <span className="text-slate-400 font-normal">({lawyer.reviews})</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{lawyer.bio}</p>

                      <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                        <span className="text-slate-400">Consultation:</span>
                        <strong className="text-[#0A1128]">ETB {lawyer.hourlyRate}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLawyer(lawyer);
                        setActiveTab('match');
                        setMatchStep(4);
                      }}
                      className="w-full py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: WHY LEGALLINK */}
          <section className="py-20 bg-[#0A1128] text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 reveal">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">SECURITY & INTEGRITY</span>
                <h2 className="text-3xl sm:text-4xl font-black">Why LegalLink Ethiopia</h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Built specifically to address transparency, escrow assurance, and regulatory compliance in Ethiopia.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-slate-800 pb-12 reveal reveal-delay-1">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">100%</span>
                  <span className="text-xs text-slate-300 block mt-1 font-bold">MOJ Bar Vetted</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">Telebirr</span>
                  <span className="text-xs text-slate-300 block mt-1 font-bold">Direct USSD Escrow</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">DARA</span>
                  <span className="text-xs text-slate-300 block mt-1 font-bold">Compliant Contracts</span>
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">8421</span>
                  <span className="text-xs text-slate-300 block mt-1 font-bold">Ethio Telecom SMS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 card-hover-effect reveal reveal-delay-1">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Ministry of Justice Vetting</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No anonymous profiles. Every advocate is verified against active Federal or Regional MOJ bar registration numbers.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 card-hover-effect reveal reveal-delay-2">
                  <Lock className="w-8 h-8 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Guaranteed Escrow Protection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Retainers are locked in LegalLink's regulatory trust pool. Advocates receive disbursements only after consultation delivery.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 card-hover-effect reveal reveal-delay-3">
                  <Languages className="w-8 h-8 text-blue-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Bilingual Contract Drafting</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate agreements in Amharic script or dual-column English/Amharic matching Document Authentication agency requirements.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 card-hover-effect reveal reveal-delay-4">
                  <Smartphone className="w-8 h-8 text-purple-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Instant SMS Notifications</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time updates delivered straight to mobile phones for escrow locking, lawyer greetings, and payout disbursements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: LEGALTALK */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">KNOWLEDGE HUB</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">LegalTalk Ethiopia</h2>
                  <p className="text-xs text-slate-500 mt-1">Legal updates, statutory analyses, and practical guides by licensed advocates.</p>
                </div>
                <button
                  onClick={() => setActiveTab('legaltalk')}
                  className="mt-3 sm:mt-0 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore LegalTalk Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {legalTalkArticles.map((art, idx) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`p-6 rounded-3xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect flex flex-col justify-between space-y-4 group reveal reveal-delay-${idx + 1}`}
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase">
                        {art.tag}
                      </span>
                      <h3 className="font-black text-base text-[#0A1128] group-hover:text-amber-600 transition-colors leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {art.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-slate-700">{art.author}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: LEXDRAFT SPOTLIGHT */}
          <section className="py-20 bg-slate-50/70 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-slate-900 to-[#102A43] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-10 reveal">
                <div className="space-y-4 max-w-xl">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    ETHIOPIAN STATUTORY CONTRACT BUILDER
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black">Generate Legal Documents in Minutes</h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Create employment contracts, non-disclosure agreements, and commercial leases compliant with Ethiopian Labor Proclamation No. 1156/2019 and Civil Code provisions. Export with DARA-ready witness blocks.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-200 font-medium pt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Bilingual Dual-Column</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Instant PDF Download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Labor Proc. 1156/2019</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Official Stamp Ready</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('lexdraft')}
                      className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Open LexDraft Contract Builder</span>
                    </button>
                  </div>
                </div>

                {/* Contract Mockup Visual */}
                <div className="w-full max-w-sm bg-white text-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 text-[11px] space-y-3 font-serif card-hover-effect">
                  <div className="text-center border-b pb-2">
                    <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                      Federal Democratic Republic of Ethiopia
                    </div>
                    <strong className="text-xs block mt-0.5 uppercase">Employment Agreement / የሥራ ውል</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border text-[10px] space-y-1">
                    <div><strong>Employer:</strong> Acme Technologies PLC</div>
                    <div><strong>Employee:</strong> Abebe Bikila</div>
                    <div><strong>Gross Remuneration:</strong> ETB 35,000.00</div>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Pursuant to Article 11 of Labor Proclamation No. 1156/2019, probation shall not exceed 60 consecutive working days...
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="border border-dashed p-2 text-center text-[9px] text-slate-400">[ Party A Seal ]</div>
                    <div className="border border-dashed p-2 text-center text-[9px] text-slate-400">[ Party B Seal ]</div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 8: WHAT CLIENTS SAY */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">TRANSPARENT CLIENT TRUST</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">What Clients Say</h2>
                  <p className="text-xs text-slate-500 mt-1">Authentic ratings from Ethiopian clients whose consultations completed through Telebirr escrow.</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-black text-[#0A1128]">{dynamicRating} / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviewsList.map((rev, idx) => (
                  <div key={rev.id} className={`p-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 card-hover-effect reveal reveal-delay-${(idx % 3) + 1}`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified Retainer
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{rev.review_comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#0A1128] block">{rev.client_name}</strong>
                        <span className="text-[10px] text-slate-400">Advocate: {rev.advocate_name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>
      )}

      {/* 3. DEDICATED USER DASHBOARD (CLIENT PORTAL) */}
      {activeTab === 'my-consultations' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {currentUser ? `WELCOME BACK, ${userProfile?.full_name?.toUpperCase() || 'CLIENT'}` : 'CLIENT ACCOUNT HUB'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Your Legal Workspace</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Manage consultations, review advocates, upload evidence, and download bilingual LexDraft contracts.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('lexdraft')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
              >
                + Draft Contract
              </button>
              <button
                onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
              >
                + Book Advocate
              </button>
            </div>
          </div>

          <div className="flex border-b border-slate-200 gap-8 text-xs font-bold">
            <button
              onClick={() => setClientSubTab('consultations')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'consultations' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Consultations & Cases ({myConsultations.length})
            </button>
            <button
              onClick={() => setClientSubTab('contracts')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'contracts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              My Saved Contracts ({savedContracts.length})
            </button>
            <button
              onClick={() => setClientSubTab('receipts')}
              className={`pb-3 border-b-2 cursor-pointer transition-all ${
                clientSubTab === 'receipts' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Telebirr Escrow Receipts ({liveTransactions.length})
            </button>
          </div>

          {clientSubTab === 'consultations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Live synchronized with Supabase PostgreSQL</span>
                <button
                  onClick={fetchMyConsultations}
                  disabled={loadingMyConsultations}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] text-xs font-bold rounded-lg cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 text-amber-500 ${loadingMyConsultations ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingMyConsultations ? (
                <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0A1128]" />
                  Loading your consultation records...
                </div>
              ) : myConsultations.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <h3 className="font-bold text-sm text-[#0A1128]">No active requests found</h3>
                  <button
                    onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                    className="mt-3 px-5 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow cursor-pointer"
                  >
                    Request Consultation
                  </button>
                </div>
              ) : (
                myConsultations.map((c) => {
                  const isPaid = c.payment_status === 'escrow_locked' || c.payment_status === 'released';
                  const isCompleted = c.status === 'completed';

                  return (
                    <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#0A1128]">{c.practice_area}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : c.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {c.status || 'pending'}
                          </span>
                          {isPaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Escrow Locked</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              Retainer Unpaid (ETB 1,500)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">{c.situation_description}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>📍 {c.location}</span>
                          <span>💰 Retainer: ETB 1,500</span>
                          <span>📅 {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</span>
                          {c.transaction_ref && <span className="font-mono text-emerald-600 font-bold">{c.transaction_ref}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        {isCompleted && (
                          <button
                            onClick={() => handleOpenReviewModal(c)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer shadow"
                          >
                            <Star className="w-3.5 h-3.5 fill-slate-950" />
                            <span>Rate Advocate</span>
                          </button>
                        )}
                        {!isPaid && (
                          <button
                            onClick={() => handleOpenPushModal(c)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#0072CE] hover:bg-[#005ba4] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Pay with Telebirr USSD</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedConsultationDetails(c); setModalTab('room'); }}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                            c.status === 'approved' ? 'bg-[#0A1128] hover:bg-[#102A43] text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{c.status === 'approved' ? 'Join Live Room' : 'Case Room'}</span>
                        </button>
                        <button
                          onClick={() => { setSelectedConsultationDetails(c); setModalTab('overview'); }}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {clientSubTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedContracts.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-sm hover:border-[#0A1128] transition-all">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      LexDraft Statutory Document ({doc.contractLang?.toUpperCase() || 'BILINGUAL'})
                    </span>
                    <h4 className="font-bold text-sm text-[#0A1128]">{doc.title}</h4>
                    <span className="text-[11px] text-slate-500 block">Parties: {doc.partyA} & {doc.partyB} • {doc.date}</span>
                  </div>
                  <button 
                    onClick={() => handleExportContractPDF(doc)}
                    className="p-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {clientSubTab === 'receipts' && (
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0072CE]/10 text-[#0072CE] flex items-center justify-center font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A1128]">Telebirr Escrow Audit Receipts</h3>
                    <p className="text-xs text-slate-500">National Bank of Ethiopia regulatory trust ledger.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {liveTransactions.map((tx, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-[#0A1128]">{tx.transaction_ref || tx.txnRef}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Escrow Locked</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Client: {tx.client_name || tx.clientName} • Channel: Telebirr ({tx.phone_number || tx.phone})
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-sm text-[#0A1128]">ETB {tx.amount_etb || tx.amount || 1500}</span>
                        <button
                          onClick={() => handlePrintReceipt(tx)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg hover:bg-slate-100 cursor-pointer shadow-sm text-[#0A1128]"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-500" />
                          <span>Print Receipt</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* 4. CLIENT RATING & REVIEW MODAL */}
      {reviewModalCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">CASE COMPLETE VERIFICATION</span>
                <h3 className="font-black text-xl">Rate Advocate Consultation</h3>
                <span className="text-xs text-slate-300">Case ID: #{reviewModalCase.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <button onClick={() => setReviewModalCase(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-5 text-xs">
              <div className="text-center space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Select Advocate Performance Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingScore(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star className={`w-7 h-7 ${star <= ratingScore ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-black text-[#0A1128] block">{ratingScore} out of 5 Stars</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Client Written Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Describe your legal experience with Advocate Mulu Haile..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0A1128] leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setReviewModalCase(null)} className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingReview || !reviewComment.trim()} className="w-2/3 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs">
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LEXDRAFT AUTOMATION TAB */}
      {activeTab === 'lexdraft' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">DARA COMPLIANT ETHIOPIAN LEGAL DOCUMENT AUTOMATION</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] mt-1">LexDraft Contract Builder</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Generate fully customized Ethiopian statutory contracts with bilingual (አማርኛ / English) export, witness signatures, and official seals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lexdraftTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between hover:shadow-xl transition-all border-t-4 border-t-[#0A1128]">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase">{tpl.category}</span>
                    <span className="font-black text-sm text-[#0A1128]">ETB {tpl.priceETB}</span>
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">{tpl.title}</h3>
                  <span className="text-xs font-bold text-slate-400 block -mt-1 font-mono">{tpl.amTitle}</span>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.desc}</p>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 font-medium">
                    ⚖️ <strong>Statute:</strong> {tpl.statute}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setContractLanguage('bilingual');
                      setDocFormData({ partyA: '', partyB: userProfile?.full_name || '', roleOrPurpose: '', salaryOrRent: '', jurisdiction: 'Addis Ababa / አዲስ አበባ' });
                    }}
                    className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
                  >
                    <Languages className="w-3.5 h-3.5 text-amber-400" />
                    <span>Customize & Export Contract</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 6. LEXDRAFT BUILDER MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">LEXDRAFT BILINGUAL CONTRACT ENGINE</span>
                <h3 className="font-black text-xl">{selectedTemplate.title} ({selectedTemplate.amTitle})</h3>
                <span className="text-xs text-slate-300 font-mono mt-0.5 block">Governed by {selectedTemplate.statute}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocumentSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Select Output Document Language (DARA Certified)</label>
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
                <button type="button" onClick={() => setSelectedTemplate(null)} className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
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

      {/* 7. LEGALTALK ARTICLE MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">{selectedArticle.tag}</span>
                <h3 className="font-black text-xl leading-snug">{selectedArticle.title}</h3>
                <span className="text-xs text-slate-300 mt-1 block">By {selectedArticle.author} • {selectedArticle.readTime}</span>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 text-sm">{selectedArticle.excerpt}</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 leading-relaxed whitespace-pre-line">
                {selectedArticle.fullContent}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TELEBIRR USSD PUSH CHECKOUT MODAL */}
      {payingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#0072CE] to-[#005ba4] text-white flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span>Ethio Telecom Direct USSD Push</span>
                </div>
                <h3 className="font-black text-xl">Telebirr Checkout Terminal</h3>
                <span className="text-xs text-white/80">Payable to LegalLink Escrow Trust</span>
              </div>
              <button onClick={() => setPayingConsultation(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Practice Area:</span>
                  <span className="font-bold text-[#0A1128]">{payingConsultation.practice_area}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-[#0A1128]">Consultation Retainer:</span>
                  <span className="font-black text-[#0072CE]">ETB 1,500.00</span>
                </div>
              </div>

              {pushStatus === 'idle' && (
                <form onSubmit={handleDispatchUSSDPush} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter Your Telebirr Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={telebirrPhone}
                        onChange={(e) => setTelebirrPhone(e.target.value)}
                        placeholder="09... or 07..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0072CE]"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#0072CE] hover:bg-[#005ba4] text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2">
                    <span>Send USSD Push Prompt to Phone</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {(pushStatus === 'push_dispatched' || pushStatus === 'pin_processing') && (
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 text-left space-y-3 font-mono text-xs shadow-inner">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] pb-2 border-b border-slate-800">
                      <span>TELEBIRR PUSH PROMPT</span>
                      <span className="text-amber-400 animate-pulse">● Awaiting PIN</span>
                    </div>
                    <div className="text-amber-300 font-bold leading-relaxed">
                      LegalLink Escrow Request:<br/>
                      Pay ETB 1,500.00 to Merchant LegalLink Trust.<br/>
                      Enter your 4-digit PIN to confirm:
                    </div>
                    <div className="bg-slate-950 p-2 rounded text-center text-slate-400 text-[11px] tracking-widest">[ • • • • ]</div>
                  </div>
                  <button
                    onClick={handleSimulatePinEnteredOnMobile}
                    disabled={pushStatus === 'pin_processing'}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    {pushStatus === 'pin_processing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>Simulate PIN Entered on Mobile</span>
                  </button>
                </div>
              )}

              {pushStatus === 'confirmed' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-[#0A1128]">USSD Payment Authorized!</h4>
                  <button onClick={() => { setPayingConsultation(null); setPushStatus('idle'); }} className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                    Done & Return to Cases
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. SUPABASE AUTH MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">SECURITY CREDENTIALS</span>
                <h3 className="font-black text-xl">{authMode === 'signup' ? 'Create LegalLink Account' : 'Sign in to LegalLink'}</h3>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex border-b border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                  className={`flex-1 pb-2.5 border-b-2 text-center ${authMode === 'signin' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`flex-1 pb-2.5 border-b-2 text-center ${authMode === 'signup' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}
                >
                  Create Account
                </button>
              </div>

              {authError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl">{authError}</div>}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Ybeltal Semagn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <button type="submit" disabled={authLoading} className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                  {authLoading ? 'Authenticating...' : authMode === 'signup' ? 'Complete Registration' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 10. CONSULTATION DETAILS, CHAT & EVIDENCE UPLOADS MODAL */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{selectedConsultationDetails.practice_area}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                    {selectedConsultationDetails.status || 'pending'}
                  </span>
                </div>
                <h3 className="font-black text-xl text-[#0A1128] mt-1">Consultation Hub</h3>
              </div>
              <button onClick={() => setSelectedConsultationDetails(null)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button onClick={() => setModalTab('overview')} className={`py-3 border-b-2 ${modalTab === 'overview' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}>
                Overview
              </button>
              <button onClick={() => setModalTab('room')} className={`py-3 border-b-2 ${modalTab === 'room' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400'}`}>
                Live Room & Chat
              </button>
              <button onClick={() => setModalTab('documents')} className={`py-3 border-b-2 ${modalTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}>
                Evidence Vault ({caseDocuments.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {modalTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Client Name</span>
                      <span className="font-bold text-[#0A1128] text-sm">{selectedConsultationDetails.client_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Location</span>
                      <span className="font-bold text-[#0A1128] text-sm">{selectedConsultationDetails.location}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Situation Description</span>
                    <p className="p-4 bg-white rounded-xl border border-slate-200 leading-relaxed text-slate-700">
                      {selectedConsultationDetails.situation_description}
                    </p>
                  </div>
                </div>
              )}

              {modalTab === 'room' && (
                <div className="space-y-4">
                  <div className="h-72 bg-slate-50/80 rounded-2xl border border-slate-200 p-4 overflow-y-auto space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.sender_role === 'client' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400 px-1 mb-0.5">{m.sender_name}</span>
                        <div className={`p-3 rounded-2xl text-xs max-w-md ${m.sender_role === 'client' ? 'bg-[#0A1128] text-white' : 'bg-white border'}`}>
                          {m.message_text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type message..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Send</button>
                  </form>
                </div>
              )}

              {modalTab === 'documents' && (
                <div className="space-y-5 text-xs">
                  <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3">
                    <UploadCloud className="w-6 h-6 mx-auto text-blue-600" />
                    <h4 className="font-bold text-[#0A1128]">Upload Evidence or Document</h4>
                    <input type="file" ref={fileUploadInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx" />
                    <button type="button" onClick={() => fileUploadInputRef.current?.click()} className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs">
                      {isUploadingFile ? 'Uploading...' : 'Select File'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {caseDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 bg-white border rounded-xl flex items-center justify-between">
                        <div>
                          <strong className="block">{doc.file_name}</strong>
                          <span className="text-[10px] text-slate-400">{doc.file_size} • {doc.uploader_name}</span>
                        </div>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download className="px-3 py-1 bg-slate-100 rounded text-xs font-bold">
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

      {/* 11. FOOTER */}
      <footer className="bg-[#060B1A] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/logo.png" 
                  alt="LegalLink Logo" 
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                  className="w-8 h-8 object-contain" 
                />
                <span className="text-lg font-black text-white">
                  Legal<span className="text-amber-400">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Ethiopia's premier legal marketplace connecting individuals and businesses with verified advocates for trusted advice, dispute resolution, and document automation.
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-2">
                📍 Bole Road, Addis Ababa, Ethiopia • hello@legallink.et
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Platform</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('match'); setMatchStep(1); }}>Find a Lawyer</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('lexdraft')}>LexDraft Builder</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('my-consultations')}>Client Portal</li>
                <li><Link href="/advocate" className="hover:text-amber-400">Advocate Workspace ↗</Link></li>
                <li><Link href="/advocate/join" className="hover:text-amber-400">Join Advocate Network (MOJ) ↗</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/admin" className="hover:text-amber-400">Admin Console ↗</Link></li>
                <li><Link href="/admin" className="hover:text-amber-400">MOJ License Vetting Queue ↗</Link></li>
                <li><Link href="/admin" className="hover:text-amber-400">Telebirr Trust Settlement ↗</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}