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
  ThumbsUp, Search, HelpCircle, ChevronDown, ChevronUp, Info, CheckCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
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

    return () => subscription.unsubscribe();
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
  // CLIENT MATCHING FLOW (4 STAGES)
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // -------------------------------------------------------------
  // USER DASHBOARD & EVIDENCE STATE
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'room' | 'documents'>('overview');
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

    return () => supabase.removeChannel(reviewsChannel);
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
  // TELEBIRR USSD PUSH CHECKOUT WITH AUTOMATED SMS DISPATCH
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

          if (!error && data) setMessages(data);
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

        return () => supabase.removeChannel(chatChannel);
      }
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
      showToast('Escrow retainer locked via Telebirr USSD!');
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

  // -------------------------------------------------------------
  // LEXDRAFT BILINGUAL CONTRACT BUILDER ENGINE
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
          <div class="bilingual-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
            <div>
              <div class="section-title">ARTICLE 1: POSITION & DUTIES</div>
              <p>The Employee is employed as <strong>${roleOrPurpose}</strong> and agrees to execute all lawful directives faithfully under Ethiopian Labor Proclamation No. 1156/2019.</p>
              <div class="section-title">ARTICLE 2: REMUNERATION</div>
              <p>The monthly remuneration shall be <strong>${salaryOrRent}</strong>, subject to statutory income tax and 7% employee pension deductions.</p>
            </div>
            <div>
              <div class="section-title">አንቀጽ 1፦ የሥራ መደብና ኃላፊነት</div>
              <p>ሠራተኛው በ<strong>${roleOrPurpose}</strong> የሥራ መደብ ላይ ተቀጥሮ በአዋጅ ቁጥር 1156/2011 መሠረት የተሰጡትን ኃላፊነቶች በታማኝነት ያከናውናል።</p>
              <div class="section-title">አንቀጽ 2፦ የደመወዝ ክፍያ</div>
              <p>አሰሪው ለሠራተኛው በየወሩ የብር <strong>${salaryOrRent}</strong> ደመወዝ የሚከፍል ሲሆን፣ ሕጋዊ የገቢ ግብርና 7% የጡረታ መዋጮ ተቀናሽ ይደረጋል።</p>
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
          <p>The Employee is employed as <strong>${roleOrPurpose}</strong> in accordance with Labor Proclamation No. 1156/2019.</p>
          <div class="section-title">ARTICLE 2: REMUNERATION</div>
          <p>The monthly remuneration is <strong>${salaryOrRent}</strong>, subject to statutory tax and pension deductions.</p>
        `;
      }
    } else {
      headerTitle = 'STATUTORY AGREEMENT / ሕጋዊ ስምምነት';
      contractBody = `<p>Executed on ${startDate} between ${partyA} and ${partyB} in ${locationName}.</p>`;
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
            .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
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
            <div style="font-size: 10px; color: #6b7280; margin-top: 4px;">DARA COMPLIANT DRAFT • DATE / ቀን፦ ${startDate}</div>
          </div>
          ${contractBody}
          <div class="signature-grid">
            <div>
              <div class="seal-box">[ PARTY A STAMP / ፊርማ ]</div>
              <div class="sig-line"><strong>FIRST PARTY:</strong> ${partyA}</div>
            </div>
            <div>
              <div class="seal-box">[ PARTY B STAMP / ፊርማ ]</div>
              <div class="sig-line"><strong>SECOND PARTY:</strong> ${partyB}</div>
            </div>
          </div>
          <div class="witness-section">
            <strong>WITNESSES / የምስክሮች ስምና ፊርማ:</strong>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 10px;">
              <div>1. Name / ስም: _____________________</div>
              <div>2. Name / ስም: _____________________</div>
            </div>
          </div>
          <div class="footer-note">
            <span>DARA Standard Form - LegalLink Ethiopia</span>
            <span>Ref: ${contract.id.toUpperCase()}-STAMPED</span>
          </div>
          <script>
            window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } }
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
    showToast('Contract generated and exported via LexDraft.');
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

      if (error) throw error;
      setBookingConfirmed(true);
      showToast('Consultation registered! Proceeding to retainer.');
    } catch (err: any) {
      alert('Unexpected error occurred saving your consultation: ' + err.message);
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
    },
    {
      id: 'q3',
      title: 'Can a foreigner or Ethiopian diaspora with Yellow Card own an export PLC and retain foreign currency?',
      category: 'Corporate & Business Law',
      author: 'Michael T. (Diaspora Investor)',
      date: '1 week ago',
      upvotes: 72,
      hasUpvoted: false,
      answersCount: 1,
      verifiedAnswer: {
        advocate: 'Advocate Mulu Haile',
        title: 'Senior Federal Advocate • Corporate Specialist',
        date: '5 days ago',
        body: 'Yes. Holders of the Ethiopian Origin Identity Card ("Yellow Card") are treated as domestic investors under the Ethiopian Investment Proclamation and NBE FX directives. You are entitled to form a PLC, register with EIC, and maintain eligible Retention FX Accounts with commercial banks.',
        advocateId: 'l1'
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

  // Client FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const clientFaqs = [
    {
      q: 'How does Telebirr Escrow protect my money?',
      a: 'When you book a consultation, your ETB 1,500 retainer is NOT paid immediately to the advocate. It is held securely in LegalLink’s segregated trust account. Only after your consultation is completed and authorized does the payout get released. If an advocate does not attend, you receive an automated 100% refund.'
    },
    {
      q: 'Are all lawyers on LegalLink licensed by the Ministry of Justice?',
      a: 'Yes. Every advocate must submit their active Federal or Regional Ministry of Justice practicing license and bar credentials during onboarding. Our administrative compliance officers verify every advocate before their profile goes live.'
    },
    {
      q: 'Can I draft contracts in Amharic (አማርኛ) for DARA registration?',
      a: 'Yes! LexDraft supports full Amharic script and dual-column bilingual output (English and Amharic) formatted according to Federal Documents Authentication and Registration Agency (DARA) requirements, complete with witness signature blocks.'
    },
    {
      q: 'What if I am in the Ethiopian diaspora or outside Addis Ababa?',
      a: 'LegalLink is designed for remote accessibility. You can book consultations from anywhere worldwide, authorize payments via international cards or Telebirr, and conduct consultations through our encrypted video rooms.'
    }
  ];

  // Common Practice Areas
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

  // Client Triage Helper Handler
  const handleTriageSelect = (category: string, scenarioText: string) => {
    setSelectedCategory(category);
    setSituationText(scenarioText);
    setActiveTab('match');
    setMatchStep(2);
    showToast(`Category set: ${category}`);
  };

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
            <button
              onClick={() => { setActiveTab('legaltalk'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              LegalTalk Forum
            </button>
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
              href="/advocate"
              className="block w-full text-left px-3 py-2 text-sm font-bold text-[#0A1128] hover:bg-slate-100 rounded-lg"
            >
              Advocate Portal ↗
            </Link>
            <Link
              href="/admin"
              className="block w-full text-left px-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-lg"
            >
              Admin Console ↗
            </Link>
          </div>
        )}
      </header>

      {/* 2. TAB ROUTING VIEW */}
      
      {/* VIEW A: LANDING PAGE */}
      {activeTab === 'home' && (
        <main className="flex-1">
          
          {/* SECTION 1: HERO */}
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 space-y-6 reveal">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>ETHIOPIA'S PREMIER LEGAL PROTECTION ECOSYSTEM</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                    Direct Counsel.<br/><span className="text-amber-500">Guaranteed Escrow.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                    Connect with licensed Ethiopian advocates for consultations, contract drafting, and dispute representation. All retainers are locked safely in Telebirr escrow until work is delivered.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>Find Verified Counsel</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab('legaltalk')}
                      className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1128] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:border-slate-300"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <span>Ask Free Legal Question</span>
                    </button>
                  </div>

                  <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">500+</span>
                      <span className="text-xs text-slate-500 font-medium">Licensed Advocates</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">100%</span>
                      <span className="text-xs text-slate-500 font-medium">Escrow Protected</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">{dynamicRating} ★</span>
                      <span className="text-xs text-slate-500 font-medium">Verified Client Rating</span>
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
                          <p className="text-xs text-slate-500">Federal Supreme Court Advocate</p>
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

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                      <div className="flex justify-between">
                        <span>Standard Legal Retainer:</span>
                        <strong className="text-[#0A1128]">ETB 1,500.00</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Escrow Trust Protection:</span>
                        <span className="text-emerald-700 font-bold">100% Refundable if no show</span>
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
                      <span>Book Consultation With Escrow</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* NEW SECTION: INSTANT LEGAL PROBLEM TRIAGE ASSISTANT */}
          <section className="py-14 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">
                      CLIENT GUIDANCE ASSISTANT
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                      What legal challenge are you facing today?
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your situation below for instant categorization, applicable proclamations, and matching advocates.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                    ⚡ 1-Click Intake
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div
                    onClick={() => handleTriageSelect('Employment Law', 'My employer terminated my contract without notice or fair severance, violating Labor Proclamation 1156/2019.')}
                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                    <strong className="text-sm text-[#0A1128] block group-hover:text-amber-600">Unlawful Job Termination</strong>
                    <p className="text-xs text-slate-500">Unfair dismissals, severance calculation, probation rights under Proc. 1156/2019.</p>
                  </div>

                  <div
                    onClick={() => handleTriageSelect('Property & Real Estate', 'Dispute over commercial/residential rent increases and leasehold deed verification in Addis Ababa.')}
                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Home className="w-4 h-4" />
                    </div>
                    <strong className="text-sm text-[#0A1128] block group-hover:text-amber-600">Rent & Property Disputes</strong>
                    <p className="text-xs text-slate-500">Commercial lease hikes, Land Title (ካርታ) verification, municipal compliance.</p>
                  </div>

                  <div
                    onClick={() => handleTriageSelect('Corporate & Business Law', 'Need statutory guidance on registering a PLC, shareholder resolutions, or foreign currency retention.')}
                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <strong className="text-sm text-[#0A1128] block group-hover:text-amber-600">Business & Contracts</strong>
                    <p className="text-xs text-slate-500">Company registration, director liability, Commercial Code compliance, NBE FX.</p>
                  </div>

                  <div
                    onClick={() => handleTriageSelect('Family Law', 'Seeking advocate representation for estate inheritance, division of marital assets, or child custody.')}
                    className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#0A1128] transition-all cursor-pointer card-hover-effect space-y-2 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Heart className="w-4 h-4" />
                    </div>
                    <strong className="text-sm text-[#0A1128] block group-hover:text-amber-600">Family & Estate Matters</strong>
                    <p className="text-xs text-slate-500">Inheritance distribution, divorce asset settlement, legal wills under Civil Code.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: HOW TELEBIRR ESCROW PROTECTS CLIENTS */}
          <section className="py-20 bg-slate-50/70 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2 reveal">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  100% FINANCIAL ASSURANCE
                </span>
                <h2 className="text-3xl font-black text-[#0A1128]">How Telebirr Escrow Protects You</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  No hidden fees, no lost money. Your legal consultation retainer is completely safe.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-lg border border-amber-200">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">1. Locked in Trust</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You authorize your ETB 1,500 retainer using secure Telebirr USSD. Funds are locked into LegalLink's segregated regulatory trust pool—not paid directly to the lawyer.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-lg border border-blue-200">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">2. Dedicated Consultation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Meet your assigned Ministry of Justice advocate in our encrypted case room. Upload contract scans, receive legal counsel memos, and ask follow-ups.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 card-hover-effect reveal reveal-delay-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-lg border border-emerald-200">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">3. Satisfaction & Settlement</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Only after the consultation is completed does the system disburse 85% net fees to the advocate via Telebirr B2C. If the lawyer fails to attend, 100% is refunded.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: PRACTICE AREAS */}
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

          {/* SECTION 5: FEATURED ADVOCATES */}
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
                        <span className="text-slate-400">Consultation Retainer:</span>
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

          {/* SECTION 6: CLIENT FAQ ACCORDION (ANSWERS COMMON CLIENT HESITATIONS) */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="text-center space-y-2 reveal">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-3xl font-black text-[#0A1128]">Answers for Clients & Businesses</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Everything you need to know about lawyer matching, escrow security, and consultation guarantees.
                </p>
              </div>

              <div className="space-y-3">
                {clientFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left font-black text-sm text-[#0A1128] flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 7: WHAT CLIENTS SAY */}
          <section className="py-20 bg-slate-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">TRANSPARENT CLIENT TRUST</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Verified Client Reviews</h2>
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
                  <div key={rev.id} className={`p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 card-hover-effect reveal reveal-delay-${(idx % 3) + 1}`}>
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

      {/* VIEW B: LEGALTALK FORUM */}
      {activeTab === 'legaltalk' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                COMMUNITY LEGAL KNOWLEDGE & ADVOCATE ANSWERS
              </span>
              <h1 className="text-3xl sm:text-4xl font-black">LegalTalk Ethiopia</h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Have a legal question? Ask our network of verified Ethiopian advocates. Browse answers, understand proclamations, and book direct consultations.
              </p>
            </div>

            <button
              onClick={() => setAskModalOpen(true)}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4" />
              <span>+ Ask a Free Question</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search legal questions, statutes, or keywords..."
                value={legalTalkSearch}
                onChange={(e) => setLegalTalkSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'Property & Real Estate', label: 'Land & Leases' },
                { id: 'Employment Law', label: 'Labor (አዋጅ 1156)' },
                { id: 'Corporate & Business Law', label: 'Business & Tax' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setLegalTalkFilter(f.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    legalTalkFilter === f.id
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl text-slate-400 text-xs">
                No matching legal questions found. Click <strong>"+ Ask a Free Question"</strong> to start a discussion.
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q.id} className="p-6 sm:p-8 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4 hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase">
                          {q.category}
                        </span>
                        <span className="text-[11px] text-slate-400">Asked by {q.author} • {q.date}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-[#0A1128] leading-snug">
                        {q.title}
                      </h3>
                      {q.details && (
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">{q.details}</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleUpvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        q.hasUpvoted
                          ? 'border-amber-500 bg-amber-50 text-amber-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  {q.verifiedAnswer ? (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-xs">
                            {q.verifiedAnswer.advocate.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#0A1128]">{q.verifiedAnswer.advocate}</span>
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full border border-emerald-200">
                                ✓ Verified Counsel
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block">{q.verifiedAnswer.title}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const foundAdv = mockMatchedLawyers.find((m) => m.id === q.verifiedAnswer.advocateId) || mockMatchedLawyers[0];
                            setSelectedLawyer(foundAdv);
                            setActiveTab('match');
                            setMatchStep(4);
                          }}
                          className="px-3.5 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <span>Consult Advocate</span>
                          <ArrowRight className="w-3 h-3 text-amber-400" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {q.verifiedAnswer.body}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>This question has been forwarded to licensed advocates in the LegalLink network. Answers will post shortly.</span>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </main>
      )}

      {/* VIEW C: FIND A LAWYER MATCHING STEPPER */}
      {activeTab === 'match' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">ADVOCATE MATCH ENGINE</span>
            <h1 className="text-3xl font-black text-[#0A1128]">Connect with Counsel</h1>
            <p className="text-xs text-slate-500">Step {matchStep} of 4: Escrow-protected consultation booking</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
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

            {matchStep === 3 && (
              <div className="space-y-5 text-xs">
                <h3 className="font-black text-base text-[#0A1128]">Step 3: Describe Your Legal Matter</h3>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Abebe Kebede"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs mb-3"
                  />
                  <label className="block font-bold text-slate-700 uppercase mb-1">Situation Overview</label>
                  <textarea
                    rows={4}
                    value={situationText}
                    onChange={(e) => setSituationText(e.target.value)}
                    placeholder="Describe facts, dates, agreements, or disputes clearly..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={() => setMatchStep(2)} className="px-4 py-2 text-slate-500 font-bold">Back</button>
                  <button
                    onClick={() => {
                      if (!situationText.trim()) return alert('Please enter situation details.');
                      setSelectedLawyer(mockMatchedLawyers[0]);
                      setMatchStep(4);
                    }}
                    className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl shadow"
                  >
                    Select Advocate & Time
                  </button>
                </div>
              </div>
            )}

            {matchStep === 4 && selectedLawyer && (
              <div className="space-y-6 text-xs">
                <h3 className="font-black text-base text-[#0A1128]">Step 4: Confirm Counsel & Authorize Escrow</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between">
                    <span>Assigned Advocate:</span>
                    <strong className="text-[#0A1128]">{selectedLawyer.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Practice Area:</span>
                    <span className="font-bold text-slate-700">{selectedCategory}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-[#0A1128]">
                    <span>Consultation Escrow Retainer:</span>
                    <span className="text-[#0072CE]">ETB 1,500.00</span>
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
                        <span>Saving Booking...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm & Open Case</span>
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

      {/* VIEW D: LEXDRAFT BUILDER TAB */}
      {activeTab === 'lexdraft' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              DARA COMPLIANT ETHIOPIAN LEGAL DOCUMENT AUTOMATION
            </span>
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

      {/* VIEW E: CLIENT PORTAL */}
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

              {myConsultations.length === 0 ? (
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
                myConsultations.map((c) => (
                  <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#0A1128]">{c.practice_area}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-emerald-50 text-emerald-800">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">{c.situation_description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedConsultationDetails(c); setModalTab('room'); }}
                        className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs"
                      >
                        Enter Room
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {clientSubTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedContracts.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">LexDraft Document</span>
                    <h4 className="font-bold text-sm text-[#0A1128]">{doc.title}</h4>
                    <span className="text-[11px] text-slate-400 block">{doc.date}</span>
                  </div>
                  <button 
                    onClick={() => handleExportContractPDF(doc)}
                    className="p-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* 3. MODALS (ASK QUESTION, LEXDRAFT, TELEBIRR PUSH, ETC.) */}
      
      {/* ASK QUESTION MODAL */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  COMMUNITY FORUM INQUIRY
                </span>
                <h3 className="font-black text-xl">Ask a Free Legal Question</h3>
                <span className="text-xs text-slate-300">Answered by verified Ethiopian advocates</span>
              </div>
              <button onClick={() => setAskModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostNewQuestion} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Legal Domain</label>
                <select
                  value={newQuestionCategory}
                  onChange={(e) => setNewQuestionCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="Property & Real Estate">Property & Real Estate (መሬትና ንብረት)</option>
                  <option value="Employment Law">Employment Law (የሥራና ሠራተኛ አዋጅ 1156)</option>
                  <option value="Corporate & Business Law">Corporate & Business (የንግድና ኩባንያ ሕግ)</option>
                  <option value="Family Law">Family Law (የቤተሰብና ውርስ ሕግ)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can an employer terminate a worker without notice under Proclamation 1156?"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Detailed Facts / Context (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Provide background facts, city/region, contracts signed, etc..."
                  value={newQuestionDetails}
                  onChange={(e) => setNewQuestionDetails(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                LegalTalk questions are publicly visible to all advocates. Do not include confidential bank passwords or private personal identification numbers.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAskModalOpen(false)}
                  className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl cursor-pointer shadow"
                >
                  Post Question to Advocates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEXDRAFT BUILDER MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  LEXDRAFT BILINGUAL CONTRACT ENGINE
                </span>
                <h3 className="font-black text-xl">{selectedTemplate.title}</h3>
                <span className="text-xs text-slate-300 font-mono mt-0.5 block">{selectedTemplate.statute}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocumentSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                  Select Output Document Language (DARA Certified)
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
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

      {/* FOOTER */}
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
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('legaltalk')}>LegalTalk Forum</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('lexdraft')}>LexDraft Builder</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('my-consultations')}>Client Portal</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><Link href="/admin" className="hover:text-amber-400">Admin Console ↗</Link></li>
                <li><Link href="/advocate" className="hover:text-amber-400">Advocate Workspace ↗</Link></li>
                <li><Link href="/advocate/join" className="hover:text-amber-400">Join Advocate Network (MOJ) ↗</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}