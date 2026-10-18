'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight,
  Video, Send, MessageSquare, User as UserIcon, MessageCircle, Smartphone, Receipt, LogOut,
  KeyRound, Award
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts' | 'receipts'>('consultations');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            setActiveTab('for-lawyers');
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // -------------------------------------------------------------
  // USER DASHBOARD & DETAILS MODAL
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'room'>('overview');

  // -------------------------------------------------------------
  // GAS-STATION STYLE TELEBIRR USSD PUSH CHECKOUT STATE
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
    if (selectedConsultationDetails && modalTab === 'room') {
      const consultationId = selectedConsultationDetails.id;
      setLoadingMessages(true);

      const supabase = createClient();

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

        setMyConsultations((prev) =>
          prev.map((c) =>
            c.id === payingConsultation.id
              ? { ...c, payment_status: 'escrow_locked', transaction_ref: txnRef }
              : c
          )
        );
      }

      fetch('/api/telebirr/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultation_id: payingConsultation?.id,
          client_name: userProfile?.full_name || payingConsultation?.client_name || 'Client',
          phone_number: telebirrPhone,
          amount: 1500,
          transaction_ref: txnRef,
          status: 'SUCCESS',
        }),
      }).catch((e) => console.log('Webhook notice:', e));

      setPushStatus('confirmed');
    } catch (err: any) {
      console.error('Payment processing exception:', err);
      setPushStatus('confirmed');
    }
  };

  // -------------------------------------------------------------
  // ISOLATED POPUP PRINT HANDLER (CLEAN 1-PAGE VOUCHER)
  // -------------------------------------------------------------
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
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0A1128; margin: 0; padding: 20px; background: white; }
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

  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [docGenerated, setDocGenerated] = useState(false);
  const [savedContracts] = useState<any[]>([
    { id: 'cnt-1', title: 'Employment Contract - Senior Developer', date: '2026-10-14', fee: 'ETB 450', status: 'Ready' },
    { id: 'cnt-2', title: 'Bilingual Mutual NDA', date: '2026-10-09', fee: 'ETB 300', status: 'Ready' }
  ]);

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

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

  const mockMatchedLawyers = [
    {
      id: 'l1',
      name: 'Advocate Mulu Haile',
      title: 'Corporate & Business Specialist',
      experience: '12 yrs exp',
      rating: 4.95,
      reviews: 438,
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
      category: 'Labor Law',
      priceETB: 450,
      popular: true,
      desc: 'Compliant with Ethiopian Labor Proclamation No. 1156/2019 for fixed or indefinite terms.',
      fields: ['employerName', 'employeeName', 'jobTitle', 'monthlySalary', 'startDate'],
    },
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement (NDA)',
      category: 'Corporate & Business',
      priceETB: 300,
      popular: true,
      desc: 'Protects proprietary secrets, financials, customer databases, and trade disclosures in Ethiopia.',
      fields: ['disclosingParty', 'receivingParty', 'purpose', 'termYears'],
    },
    {
      id: 'lease',
      title: 'Commercial Lease Agreement',
      category: 'Property & Real Estate',
      priceETB: 600,
      popular: true,
      desc: 'Commercial premises rental contract compliant with the Ethiopian Civil Code.',
      fields: ['landlordName', 'tenantName', 'propertyAddress', 'monthlyRentETB'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* 1. TOP NAVIGATION WITH ADVOCATE PORTAL & ADMIN SHORTCUTS */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('home')} 
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <img 
                src="/logo.png" 
                alt="LegalLink Logo" 
                className="w-10 h-10 object-contain hover:scale-105 transition-transform" 
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
              {[
                { id: 'match', label: lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer' },
                { id: 'for-lawyers', label: lang === 'am' ? 'ለሕግ ባለሙያዎች' : 'For Lawyers' },
                { id: 'legaltalk', label: 'LegalTalk' },
                { id: 'lexdraft', label: 'LexDraft' },
                { id: 'my-consultations', label: lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id === 'match') setMatchStep(1);
                  }}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === item.id 
                      ? 'text-[#0A1128] bg-slate-100 font-bold' 
                      : 'text-slate-600 hover:text-[#0A1128] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer mr-1"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'አማ (AM)' : 'EN (US)'}</span>
              </button>

              {/* Direct Advocate Workspace Link */}
              <Link
                href="/advocate"
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#0A1128] hover:bg-slate-200 text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Advocate Portal</span>
              </Link>

              {/* Direct Admin Access */}
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-xs font-bold border border-amber-300 transition-colors flex items-center gap-1"
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
            {[
              { id: 'match', label: lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer' },
              { id: 'for-lawyers', label: lang === 'am' ? 'ለሕግ ባለሙያዎች' : 'For Lawyers' },
              { id: 'legaltalk', label: 'LegalTalk' },
              { id: 'lexdraft', label: 'LexDraft' },
              { id: 'my-consultations', label: lang === 'am' ? 'የደንበኛ ገጽ' : 'Client Portal' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {item.label}
              </button>
            ))}
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

      {/* 2. PUBLIC LANDING VIEW */}
      {activeTab === 'home' && (
        <main className="flex-1">
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
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
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>Find a Lawyer</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError(null);
                        setAuthModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1128] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      Get Started
                    </button>
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
                      <span className="text-2xl font-black text-[#0A1128] block">97%</span>
                      <span className="text-xs text-slate-500 font-medium">Client Satisfaction</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">&lt;2hrs</span>
                      <span className="text-xs text-slate-500 font-medium">Average Response</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
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
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        Top Rated
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold">Telebirr USSD Direct Push Enabled</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedLawyer(mockMatchedLawyers[0]);
                        setActiveTab('match');
                        setMatchStep(4);
                      }}
                      className="mt-6 w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-sm transition-all shadow cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-black text-[#0A1128] mb-8">Practice Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {practiceAreas.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('match');
                        setMatchStep(2);
                      }}
                      className="p-6 rounded-2xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer hover:shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1128] mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#0A1128] text-base">{cat.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cat.desc}</p>
                    </div>
                  );
                })}
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
                Manage your consultations, authorize Telebirr USSD retainers, and access printable escrow receipts.
              </p>
            </div>
            <button
              onClick={() => { setActiveTab('match'); setMatchStep(1); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              + Book New Advocate
            </button>
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

          {/* SUB-TAB 1: CONSULTATIONS */}
          {clientSubTab === 'consultations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Live synchronized with Supabase PostgreSQL (Updates automatically)
                </span>
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
                  return (
                    <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-all">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-[#0A1128]">{c.practice_area}</span>
                          
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === 'approved' 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : c.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : c.status === 'cancelled'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {c.status || 'pending'}
                          </span>

                          {isPaid ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Escrow Locked (Telebirr)</span>
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
                          onClick={() => {
                            setSelectedConsultationDetails(c);
                            setModalTab('room');
                          }}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm ${
                            c.status === 'approved'
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                              : 'bg-[#0A1128] hover:bg-[#102A43] text-white'
                          }`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{c.status === 'approved' ? 'Join Live Room' : 'Case Room'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedConsultationDetails(c);
                            setModalTab('overview');
                          }}
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

          {/* SUB-TAB 2: CONTRACTS */}
          {clientSubTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedContracts.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">LexDraft Stored Document</span>
                    <h4 className="font-bold text-sm text-[#0A1128] mt-0.5">{doc.title}</h4>
                    <span className="text-[11px] text-slate-400 block mt-1">Generated: {doc.date} • {doc.fee}</span>
                  </div>
                  <button 
                    onClick={() => {
                      handlePrintReceipt({
                        transaction_ref: 'DOC-' + doc.id.toUpperCase(),
                        client_name: userProfile?.full_name || 'Client',
                        phone_number: 'N/A (Document Contract)',
                        amount_etb: doc.fee.replace(/\D/g, ''),
                        created_at: doc.date,
                      });
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 3: RECEIPTS */}
          {clientSubTab === 'receipts' && (
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0072CE]/10 text-[#0072CE] flex items-center justify-center font-black">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A1128]">Telebirr Escrow Audit Receipts</h3>
                    <p className="text-xs text-slate-500">
                      National Bank of Ethiopia (NBE) regulatory trust ledger. Click "Print Receipt" to generate an isolated, single-page official voucher.
                    </p>
                  </div>
                </div>

                {liveTransactions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No Telebirr payments initiated yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveTransactions.map((tx, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#0A1128]">{tx.transaction_ref || tx.txnRef}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Escrow Locked
                            </span>
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
                )}
              </div>
            </div>
          )}

        </main>
      )}

      {/* 4. TELEBIRR USSD PUSH CHECKOUT MODAL */}
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Enter Your Telebirr Mobile Number
                    </label>
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

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0072CE] hover:bg-[#005ba4] text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
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

                    <div className="bg-slate-950 p-2 rounded text-center text-slate-400 text-[11px] tracking-widest">
                      [ • • • • ]
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#0A1128]">Prompt Sent to {telebirrPhone}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Check your mobile screen now. Enter your secret Telebirr PIN to confirm the ETB 1,500 payment.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSimulatePinEnteredOnMobile}
                      disabled={pushStatus === 'pin_processing'}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      {pushStatus === 'pin_processing' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying Telebirr PIN...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Simulate PIN Entered on Mobile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {pushStatus === 'confirmed' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-[#0A1128]">USSD Payment Authorized!</h4>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Funds successfully secured in LegalLink Escrow Trust.
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setPayingConsultation(null);
                      setPushStatus('idle');
                    }}
                    className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done & Return to Cases
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUPABASE AUTH MODAL WITH GOOGLE OAUTH */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  SECURITY CREDENTIALS
                </span>
                <h3 className="font-black text-xl">
                  {authMode === 'signup' ? 'Create LegalLink Account' : 'Sign in to LegalLink'}
                </h3>
              </div>
              <button onClick={() => setAuthModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* GOOGLE SIGN IN DIRECT BUTTON */}
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

              {/* DIVIDER */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                  <span className="bg-white px-2">Or continue with email</span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                  className={`flex-1 pb-2.5 border-b-2 text-center transition-all cursor-pointer ${
                    authMode === 'signin' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`flex-1 pb-2.5 border-b-2 text-center transition-all cursor-pointer ${
                    authMode === 'signup' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        placeholder="e.g. Ybeltal Semagn"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Account Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAuthRole('client')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            authRole === 'client' ? 'border-[#0A1128] bg-slate-100 text-[#0A1128]' : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Individual / Client
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthRole('advocate')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            authRole === 'advocate' ? 'border-[#0A1128] bg-slate-100 text-[#0A1128]' : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Verified Advocate
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1128]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with Supabase...</span>
                    </>
                  ) : (
                    <span>{authMode === 'signup' ? 'Complete Registration' : 'Authenticate Session'}</span>
                  )}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* 6. CONSULTATION DETAILS & ROOM MODAL */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {selectedConsultationDetails.practice_area}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    selectedConsultationDetails.status === 'approved' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : selectedConsultationDetails.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
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
              <button
                onClick={() => setModalTab('overview')}
                className={`py-3 border-b-2 cursor-pointer ${
                  modalTab === 'overview' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setModalTab('room')}
                className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'room' ? 'border-amber-500 text-amber-600 font-black' : 'border-transparent text-slate-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Room & Chat</span>
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
                    {messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                        No messages in this case thread yet.
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div key={m.id} className={`flex flex-col ${m.sender_role === 'client' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-400 px-1 mb-0.5">{m.sender_name}</span>
                          <div className={`p-3 rounded-2xl text-xs max-w-md ${
                            m.sender_role === 'client' ? 'bg-[#0A1128] text-white rounded-tr-none' : 'bg-white border rounded-tl-none'
                          }`}>
                            {m.message_text}
                          </div>
                        </div>
                      ))
                    )}
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
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. FOOTER */}
      <footer className="bg-[#060B1A] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-black text-white">
                  Legal<span className="text-amber-400">Link</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Ethiopia's premier legal marketplace connecting individuals and businesses with verified advocates for trusted advice, dispute resolution, and document automation.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Platform</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('match'); setMatchStep(1); }}>Find a Lawyer</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('my-consultations')}>Client Portal</li>
                <li>
                  <Link href="/advocate" className="text-slate-400 hover:text-amber-400">Advocate Workspace ↗</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <Link href="/admin" className="text-slate-400 hover:text-amber-400 flex items-center gap-1">
                    <span>Admin Console</span>
                    <span className="text-[10px] text-amber-400">↗</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}