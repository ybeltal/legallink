'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight,
  Video, Send, MessageSquare, User, MessageCircle, Smartphone, Receipt, QrCode
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'match' | 'for-lawyers' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts' | 'receipts'>('consultations');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  // USER DASHBOARD (MY CONSULTATIONS) & DETAILS MODAL
  // -------------------------------------------------------------
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [loadingMyConsultations, setLoadingMyConsultations] = useState(false);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'overview' | 'room'>('overview');

  // -------------------------------------------------------------
  // TELEBIRR ESCROW PAYMENT CHECKOUT STATE
  // -------------------------------------------------------------
  const [payingConsultation, setPayingConsultation] = useState<any | null>(null);
  const [telebirrPhone, setTelebirrPhone] = useState('0911234567');
  const [paymentStep, setPaymentStep] = useState<'phone' | 'ussd_confirm' | 'success'>('phone');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState<any | null>(null);
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

  // Live Realtime listener for cross-tab database synchronization
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
            } else if (payload.eventType === 'DELETE') {
              setMyConsultations((prev) => prev.filter((item) => item.id !== payload.old.id));
              setSelectedConsultationDetails((prev: any) =>
                prev?.id === payload.old.id ? null : prev
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeTab]);

  // Load and subscribe to real-time chat messages when Room is opened
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

  // Send a message into the secure consultation thread
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConsultationDetails) return;

    setIsSendingMessage(true);
    try {
      const supabase = createClient();
      const senderName = senderRole === 'client' 
        ? (selectedConsultationDetails.client_name || 'Client') 
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
  // TELEBIRR ESCROW PAYMENT EXECUTION
  // -------------------------------------------------------------
  const handleTriggerTelebirrCheckout = (consultation: any) => {
    setPayingConsultation(consultation);
    setPaymentStep('phone');
    setIsProcessingPayment(false);
  };

  const handleSimulateTelebirrUSSD = () => {
    if (!telebirrPhone.trim() || telebirrPhone.length < 9) {
      alert('Please enter a valid Ethiopian phone number (e.g. 0911234567).');
      return;
    }
    setPaymentStep('ussd_confirm');
  };

  const handleAuthorizeTelebirrPayment = async () => {
    if (!payingConsultation) return;
    setIsProcessingPayment(true);

    const generatedTxnRef = `TLB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const feeAmount = 1500;

    try {
      const supabase = createClient();

      // 1. Update the consultation status to 'escrow_locked' in Supabase
      const { error: updateError } = await supabase
        .from('consultations')
        .update({
          payment_status: 'escrow_locked',
          payment_method: 'telebirr',
          transaction_ref: generatedTxnRef,
          escrow_amount: feeAmount
        })
        .eq('id', payingConsultation.id);

      if (updateError) {
        console.error(updateError);
      }

      // 2. Insert into escrow_transactions audit table
      await supabase
        .from('escrow_transactions')
        .insert([
          {
            consultation_id: payingConsultation.id,
            client_name: payingConsultation.client_name || 'Client',
            phone_number: telebirrPhone,
            payment_channel: 'telebirr',
            amount_etb: feeAmount,
            transaction_ref: generatedTxnRef,
            status: 'escrow_locked'
          }
        ]);

      // 3. Update local state
      const receiptData = {
        txnRef: generatedTxnRef,
        amount: feeAmount,
        phone: telebirrPhone,
        date: new Date().toLocaleString(),
        caseId: payingConsultation.id,
        practiceArea: payingConsultation.practice_area,
        clientName: payingConsultation.client_name || 'Client'
      };

      setLastPaymentReceipt(receiptData);
      setLiveTransactions((prev) => [receiptData, ...prev]);

      setMyConsultations((prev) =>
        prev.map((c) =>
          c.id === payingConsultation.id
            ? { ...c, payment_status: 'escrow_locked', transaction_ref: generatedTxnRef }
            : c
        )
      );

      setPaymentStep('success');
    } catch (err: any) {
      alert('Payment processing failed: ' + err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Submit client matching consultation to Supabase
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
          client_name: clientName.trim() || 'Anonymous Client',
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

  // -------------------------------------------------------------
  // LEXDRAFT STATE
  // -------------------------------------------------------------
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [docGenerated, setDocGenerated] = useState(false);
  const [savedContracts] = useState<any[]>([
    { id: 'cnt-1', title: 'Employment Contract - Senior Developer', date: '2026-10-14', fee: 'ETB 450', status: 'Ready' },
    { id: 'cnt-2', title: 'Bilingual Mutual NDA', date: '2026-10-09', fee: 'ETB 300', status: 'Ready' }
  ]);

  // -------------------------------------------------------------
  // LEGALTALK STATE
  // -------------------------------------------------------------
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // -------------------------------------------------------------
  // LAWYER ONBOARDING (4 STEPS)
  // -------------------------------------------------------------
  const [lawyerStep, setLawyerStep] = useState<1 | 2 | 3 | 4>(1);

  // 8 Practice Areas
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

  // Matched Lawyers Pool
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

  // LexDraft Templates
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
    {
      id: 'mou',
      title: 'Memorandum of Understanding (MOU)',
      category: 'Corporate & Business',
      priceETB: 350,
      popular: false,
      desc: 'Preliminary partnership and institutional cooperation agreement.',
      fields: ['partyOne', 'partyTwo', 'projectScope'],
    },
    {
      id: 'checklist',
      title: 'Business Registration Checklist',
      category: 'Corporate & Business',
      priceETB: 150,
      popular: false,
      desc: 'Statutory guide for registering a PLC or Sole Proprietorship with the Ministry of Trade.',
      fields: ['companyName', 'capitalETB', 'businessType'],
    },
  ];

  // LegalTalk Articles
  const legalTalkArticles = [
    {
      id: 'art-1',
      title: 'What Ethiopian Startups Need to Know About Company Registration',
      category: 'Business Law',
      readTime: '7 min read',
      author: 'Advocate Mulu Haile',
      cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      excerpt: 'A step-by-step guide to registering your startup under the Ethiopian Commercial Code, including capital minimums and digital filings.',
      content: `The revision of Ethiopia’s Commercial Code brought major modernization for tech startups and small-to-medium enterprises.
      
1. One-Person Companies: Entrepreneurs can now incorporate a limited liability company without requiring secondary nominal shareholders.
2. Digital Authentication: The Ministry of Trade & Regional Integration now permits digital submission of Articles of Association.
3. Capital Flexibility: Minimum initial capital requirements have been adapted to support lean digital enterprises.`,
    },
    {
      id: 'art-2',
      title: 'Your Rights in Ethiopian Divorce Law: A Plain-Language Guide',
      category: 'Family Law',
      readTime: '5 min read',
      author: 'Advocate Tigist Bekele',
      cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Understanding property division, joint assets, child custody, and maintenance under the Federal Revised Family Code.',
      content: `Under the Revised Family Code of Ethiopia (Proclamation No. 213/2000), marriages can be dissolved through mutual petition or judicial determination.

1. Common Property vs Personal Assets: Assets acquired during the subsistence of marriage are presumed common unless proven personal.
2. Child Custody & Maintenance: Courts prioritize the child's psychological, educational, and material stability above all parental claims.`,
    },
    {
      id: 'art-3',
      title: 'New Labor Proclamation Changes: What Employers Must Know',
      category: 'Employment Law',
      readTime: '8 min read',
      author: 'Advocate Dawit Tesfaye',
      cover: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      excerpt: 'Key changes in Ethiopian labor regulation, probation periods, overtime limits, severance, and termination protections.',
      content: `Labor Proclamation No. 1156/2019 governs private employment relationships across Ethiopia.

1. Probation: Maximum 60 working days under a written agreement.
2. Severance Calculation: Statutory multipliers apply based on completed service years.
3. Protected Termination: Employers must adhere strictly to statutory procedures before enacting terminations.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* 1. TOP NAVIGATION */}
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

            {/* Language & Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'en' ? 'አማ (AM)' : 'EN (US)'}</span>
              </button>

              <button 
                onClick={() => setIsRoleModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0A1128] cursor-pointer"
              >
                {lang === 'am' ? 'ግባ' : 'Sign in'}
              </button>

              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-[#0A1128] hover:bg-[#102A43] rounded-xl shadow-sm transition-all cursor-pointer"
              >
                {lang === 'am' ? 'ጀምር' : 'Get Started'}
              </button>
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

        {/* Mobile Menu Dropdown */}
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
          </div>
        )}
      </header>

      {/* 2. PUBLIC LANDING VIEW */}
      {activeTab === 'home' && (
        <main className="flex-1">
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Hero */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{lang === 'am' ? "የኢትዮጵያ ቀዳሚ የሕግ ገበያ" : "ETHIOPIA'S #1 LEGAL MARKETPLACE"}</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0A1128] leading-[1.1]">
                    {lang === 'am' ? 'የሕግ አገልግሎት የወደፊት ገጽታ፣ ዛሬ።' : 'The Future of Law, Today.'}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                    {lang === 'am' 
                      ? 'ፈቃዳቸው ከተረጋገጠ የኢትዮጵያ ጠበቆች ጋር ለምክር፣ ለውል ዝግጅትና ለሕግ ድጋፍ በቀላሉ፣ በተመጣጣኝ ዋጋና በደህንነት ይገናኙ።'
                      : 'Connect with verified Ethiopian lawyers for consultations, document drafting, and compliance support—quickly, affordably, and securely.'}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                    >
                      <span>{lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() => setIsRoleModalOpen(true)}
                      className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#0A1128] font-bold rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      {lang === 'am' ? 'ጀምር' : 'Get Started'}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">500+</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የተረጋገጡ ጠበቆች' : 'Verified Lawyers'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">12,000+</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የተጠናቀቁ ምክክሮች' : 'Consultations Done'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">97%</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'የደንበኞች እርካታ' : 'Client Satisfaction'}</span>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-[#0A1128] block">&lt;2hrs</span>
                      <span className="text-xs text-slate-500 font-medium">{lang === 'am' ? 'አማካይ ምላሽ' : 'Average Response'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero Card */}
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
                      <span className="font-semibold">500+ Lawyers Online</span>
                    </div>

                    <div className="mt-5">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-2">
                        AVAILABLE TODAY
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {['10:00 AM', '2:00 PM', '4:30 PM'].map((slot) => (
                          <div
                            key={slot}
                            onClick={() => {
                              setSelectedLawyer(mockMatchedLawyers[0]);
                              setSelectedTimeSlot(slot);
                              setActiveTab('match');
                              setMatchStep(4);
                            }}
                            className="py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#0A1128] hover:text-white cursor-pointer transition-colors"
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
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

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Trusted & Verified in Ethiopia</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Practice Areas */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">EXPERTISE</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Practice Areas</h2>
                  <p className="text-sm text-slate-600 mt-2">Find specialized legal expertise across Ethiopian law.</p>
                </div>
                <button 
                  onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                  className="mt-4 sm:mt-0 text-xs font-bold text-[#0A1128] hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                >
                  Browse All 18 Areas →
                </button>
              </div>

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
                      <h3 className="font-bold text-[#0A1128] text-base">{lang === 'am' ? cat.amTitle : cat.title}</h3>
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
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CLIENT ACCOUNT HUB</span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome to Your Legal Workspace</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Manage your consultations, secure retainers in Telebirr escrow, and launch live consultation rooms.
              </p>
            </div>
            <button
              onClick={() => { setActiveTab('match'); setMatchStep(1); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer"
            >
              + Book New Advocate
            </button>
          </div>

          {/* Sub Navigation */}
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
                  <p className="text-xs text-slate-500 mt-1 mb-4">Request a consultation with a verified lawyer to get started.</p>
                  <button
                    onClick={() => { setActiveTab('match'); setMatchStep(1); }}
                    className="px-5 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl text-xs shadow cursor-pointer"
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
                          
                          {/* Case Status Badge */}
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

                          {/* Telebirr Escrow Badge */}
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
                        {/* If unpaid, show Telebirr Pay button */}
                        {!isPaid && (
                          <button
                            onClick={() => handleTriggerTelebirrCheckout(c)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#0072CE] hover:bg-[#005ba4] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Pay ETB 1,500 (Telebirr)</span>
                          </button>
                        )}

                        {/* Active Live Room Launcher */}
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
                    onClick={() => window.print()}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-[#0A1128] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 3: RECEIPTS & SETTLEMENT */}
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
                      National Bank of Ethiopia (NBE) regulatory trust ledger. Retainers are disbursed solely upon client sign-off.
                    </p>
                  </div>
                </div>

                {liveTransactions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    No Telebirr payments initiated yet. Complete a consultation payment to generate audit receipts.
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
                            onClick={() => window.print()}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer"
                          >
                            Print Receipt
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

      {/* 4. TELEBIRR ESCROW CHECKOUT MODAL */}
      {payingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0072CE] to-[#005ba4] text-white flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                  <span>Ethio Telecom Partner</span>
                </div>
                <h3 className="font-black text-xl">Telebirr Escrow Gateway</h3>
                <span className="text-xs text-white/80">Securing Legal Retainer in Trust Account</span>
              </div>
              <button 
                onClick={() => setPayingConsultation(null)}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {/* Payment Summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Practice Area:</span>
                  <span className="font-bold text-[#0A1128]">{payingConsultation.practice_area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Advocate:</span>
                  <span className="font-bold text-[#0A1128]">Advocate Mulu Haile</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-[#0A1128]">Total Retainer Fee:</span>
                  <span className="font-black text-[#0072CE]">ETB 1,500.00</span>
                </div>
              </div>

              {/* Step 1: Phone input */}
              {paymentStep === 'phone' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Enter Registered Telebirr Mobile Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={telebirrPhone}
                        onChange={(e) => setTelebirrPhone(e.target.value)}
                        placeholder="e.g. 0911234567"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0072CE]"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      A USSD payment prompt (*127#) will be pushed to your mobile device.
                    </span>
                  </div>

                  <button
                    onClick={handleSimulateTelebirrUSSD}
                    className="w-full py-3 bg-[#0072CE] hover:bg-[#005ba4] text-white font-bold rounded-xl text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to USSD Authentication</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: USSD prompt simulation */}
              {paymentStep === 'ussd_confirm' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 animate-pulse">
                    <Smartphone className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-[#0A1128]">USSD Push Sent to {telebirrPhone}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Please enter your 4-digit Telebirr PIN on your mobile screen to authorize the ETB 1,500 transfer into LegalLink Escrow.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-600 border border-slate-200">
                    USSD: *127# ➔ Merchant Pay ➔ LegalLink Trust
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentStep('phone')}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      disabled={isProcessingPayment}
                      onClick={handleAuthorizeTelebirrPayment}
                      className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Confirming with Telebirr...</span>
                        </>
                      ) : (
                        <span>Simulate PIN Entered & Lock Escrow</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Success Receipt */}
              {paymentStep === 'success' && lastPaymentReceipt && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-[#0A1128]">Payment Secured in Escrow!</h4>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Transaction Reference: <strong className="text-slate-800">{lastPaymentReceipt.txnRef}</strong>
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                    <p><strong>Channel:</strong> Telebirr Mobile Money</p>
                    <p><strong>Payer Phone:</strong> {lastPaymentReceipt.phone}</p>
                    <p><strong>Amount:</strong> ETB {lastPaymentReceipt.amount}.00</p>
                    <p><strong>Status:</strong> Held in Trust (NBE Escrow)</p>
                    <p><strong>Timestamp:</strong> {lastPaymentReceipt.date}</p>
                  </div>

                  <button
                    onClick={() => {
                      setPayingConsultation(null);
                      setPaymentStep('phone');
                    }}
                    className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Done & Return to Cases
                  </button>
                </div>
              )}

              {/* Compliance footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compliant with National Bank of Ethiopia Escrow Directives</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE CASE MODAL WITH LIVE CONSULTATION ROOM & REALTIME CHAT */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
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
                      : selectedConsultationDetails.status === 'cancelled'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedConsultationDetails.status || 'pending'}
                  </span>
                  {selectedConsultationDetails.payment_status === 'escrow_locked' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Escrow Paid (Telebirr)
                    </span>
                  )}
                </div>
                <h3 className="font-black text-xl text-[#0A1128] mt-1">Consultation Hub</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Case ID: #{selectedConsultationDetails.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <button 
                onClick={() => setSelectedConsultationDetails(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button
                onClick={() => setModalTab('overview')}
                className={`py-3 border-b-2 cursor-pointer transition-colors ${
                  modalTab === 'overview' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Case Overview & Progression
              </button>
              <button
                onClick={() => setModalTab('room')}
                className={`py-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                  modalTab === 'room' ? 'border-amber-500 text-amber-600 font-black' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Room & Secure Chat</span>
                {messages.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">
                    {messages.length}
                  </span>
                )}
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              
              {/* TAB A: OVERVIEW */}
              {modalTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Case Progression</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>1. Submitted</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">Database verified</span>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        selectedConsultationDetails.status === 'approved' || selectedConsultationDetails.status === 'completed'
                          ? 'bg-blue-50 border-blue-200 text-blue-800'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Clock className="w-4 h-4" />
                          <span>2. Review</span>
                        </div>
                        <span className="text-[10px] block mt-0.5">
                          {selectedConsultationDetails.status === 'approved' ? 'Approved & Assigned' : 'Under Review'}
                        </span>
                      </div>

                      <div className={`p-3 rounded-xl border ${
                        selectedConsultationDetails.status === 'completed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <ShieldCheck className="w-4 h-4" />
                          <span>3. Resolved</span>
                        </div>
                        <span className="text-[10px] block mt-0.5">Final decree</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Client Name</span>
                      <span className="font-bold text-[#0A1128] text-sm">
                        {selectedConsultationDetails.client_name || 'Anonymous Client'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Jurisdiction / Location</span>
                      <span className="font-bold text-[#0A1128] text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {selectedConsultationDetails.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Budget Range</span>
                      <span className="font-bold text-[#0A1128] text-sm">
                        {selectedConsultationDetails.budget_range || 'ETB 1,000–2,000'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Submission Date</span>
                      <span className="font-bold text-[#0A1128] text-sm">
                        {selectedConsultationDetails.created_at ? new Date(selectedConsultationDetails.created_at).toLocaleString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 uppercase block mb-2">Situation Description</span>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedConsultationDetails.situation_description}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-5 h-5 text-amber-600" />
                      <div>
                        <span className="text-xs font-bold text-amber-900 block">Consultation Room Active</span>
                        <span className="text-[11px] text-amber-700">Communicate directly with your advocate via chat and secure video.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setModalTab('room')}
                      className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Enter Room →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB B: LIVE ROOM & MESSAGING */}
              {modalTab === 'room' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                        MH
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm">Advocate Mulu Haile</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-[11px] text-slate-300 block">Federal Advocate • Online</span>
                      </div>
                    </div>

                    <a
                      href={`https://meet.jit.si/legallink-case-${selectedConsultationDetails.id.slice(0, 8)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch Video Call (P2P Encrypted)</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                    </a>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">Testing Persona Switcher:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSenderRole('client')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          senderRole === 'client' 
                            ? 'bg-[#0A1128] text-white shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Client (You)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSenderRole('advocate')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          senderRole === 'advocate' 
                            ? 'bg-amber-500 text-slate-950 shadow-sm' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Advocate (Mulu)
                      </button>
                    </div>
                  </div>

                  <div className="h-72 bg-slate-50/80 rounded-2xl border border-slate-200 p-4 overflow-y-auto space-y-3">
                    {loadingMessages ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-400 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#0A1128]" />
                        <span>Connecting to secure case channel...</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
                        <MessageCircle className="w-8 h-8 mb-2 opacity-30 text-[#0A1128]" />
                        <span className="font-semibold text-slate-600">No messages in this case thread yet.</span>
                        <span className="text-[11px] mt-0.5">Start by sending an inquiry or case document to Advocate Mulu Haile below.</span>
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isClient = m.sender_role === 'client';
                        return (
                          <div 
                            key={m.id} 
                            className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1">
                              <span className="text-[10px] font-bold text-slate-500">{m.sender_name}</span>
                              <span className="text-[9px] text-slate-400">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div 
                              className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                isClient 
                                  ? 'bg-[#0A1128] text-white rounded-tr-none' 
                                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
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

                  <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Type message as ${senderRole === 'client' ? 'Client' : 'Advocate'}...`}
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !newMessageText.trim()}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all"
                    >
                      {isSendingMessage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <span>Send</span>
                          <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setSelectedConsultationDetails(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-[#0A1128] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Hub
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. LEXDRAFT MODULE */}
      {activeTab === 'lexdraft' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">LEXDRAFT AUTOMATION</span>
            <h2 className="text-3xl font-black text-[#0A1128] mt-1">Legal documents, ready in minutes.</h2>
            <p className="text-sm text-slate-600 mt-2">
              Automate the creation of employment contracts, NDAs, lease agreements, and checklists tailored to Ethiopian law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lexdraftTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{tpl.category}</span>
                    {tpl.popular && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Popular</span>}
                  </div>
                  <h3 className="font-bold text-base text-[#0A1128]">{tpl.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{tpl.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-[#0A1128]">ETB {tpl.priceETB}</span>
                  <button
                    onClick={() => {
                      setSelectedTemplate(tpl);
                      setDocFormData({});
                      setDocGenerated(false);
                    }}
                    className="px-4 py-2 bg-[#0A1128] text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
                  >
                    Draft Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* LexDraft Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-[#0A1128]">{selectedTemplate.title}</h3>
                <span className="text-xs text-slate-500">Statutory Fee: ETB {selectedTemplate.priceETB}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0A1128] uppercase">Fill Document Variables</h4>
                {selectedTemplate.fields.map((f: string) => (
                  <div key={f}>
                    <label className="block text-xs font-semibold text-slate-700 capitalize mb-1">
                      {f.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter ${f}...`}
                      value={docFormData[f] || ''}
                      onChange={(e) => setDocFormData({ ...docFormData, [f]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setDocGenerated(true)}
                  className="w-full py-2.5 bg-amber-500 font-bold text-xs text-[#0A1128] rounded-xl mt-2 cursor-pointer hover:bg-amber-600"
                >
                  Generate Preview
                </button>
              </div>

              {/* Document Preview */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs flex flex-col justify-between">
                <div>
                  <h5 className="font-sans font-bold text-center underline mb-3">{selectedTemplate.title.toUpperCase()}</h5>
                  <p className="text-slate-600 mb-2 leading-relaxed">
                    This legally binding document is drafted under the laws and proclamations of the Federal Democratic Republic of Ethiopia.
                  </p>
                  {Object.entries(docFormData).map(([k, v]) => (
                    <p key={k} className="text-slate-800">
                      <strong>{k.replace(/([A-Z])/g, ' $1')}:</strong> {v || '___________'}
                    </p>
                  ))}
                </div>

                {docGenerated && (
                  <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
                    <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A1128] text-white rounded-lg text-xs font-bold cursor-pointer">
                      <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. LEGALTALK ARTICLES */}
      {activeTab === 'legaltalk' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">LEGAL EDUCATION</span>
            <h2 className="text-3xl font-black text-[#0A1128] mt-1">Legal insights for everyday Ethiopians.</h2>
            <p className="text-sm text-slate-600 mt-2">Plain-language guides on business setup, family rights, and labor proclamations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalTalkArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <img src={art.cover} alt={art.title} className="w-full h-44 object-cover" />
                  <div className="p-5">
                    <span className="text-xs font-bold text-amber-600 block mb-1">{art.category}</span>
                    <h3 className="font-bold text-base text-[#0A1128] leading-snug">{art.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{art.excerpt}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-slate-100 flex justify-between text-xs text-slate-400">
                  <span>{art.author}</span>
                  <span className="text-[#0A1128] font-bold">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase">{selectedArticle.category}</span>
                <h3 className="font-extrabold text-xl text-[#0A1128] mt-1">{selectedArticle.title}</h3>
                <span className="text-xs text-slate-400">By {selectedArticle.author}</span>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}

      {/* 8. FOR LAWYERS ONBOARDING */}
      {activeTab === 'for-lawyers' && (
        <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
          <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs">
            {[
              { num: 1, label: '01 Apply & Verify' },
              { num: 2, label: '02 Build Profile' },
              { num: 3, label: '03 Availability' },
              { num: 4, label: '04 Payout Setup' },
            ].map((s) => (
              <div key={s.num} className={`p-2.5 rounded-xl border font-bold ${lawyerStep === s.num ? 'bg-[#0A1128] text-white' : 'bg-slate-50 text-slate-400'}`}>
                {s.label}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {lawyerStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 01: Advocate Credentials</h3>
                <input type="text" placeholder="Full Legal Advocate Name" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <input type="text" placeholder="Advocacy License Number (e.g. MOJ/FED/2020/1234)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm" />
                <button onClick={() => setLawyerStep(2)} className="w-full py-2.5 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">
                  Continue to Profile →
                </button>
              </div>
            )}
            {lawyerStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 02: Profile & Hourly Rates</h3>
                <input type="number" defaultValue={1500} placeholder="Hourly Rate (ETB)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold" />
                <textarea rows={3} placeholder="Write a short advocate bio..." className="w-full p-3 rounded-xl border border-slate-200 text-sm" />
                <div className="flex justify-between">
                  <button onClick={() => setLawyerStep(1)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button onClick={() => setLawyerStep(3)} className="px-6 py-2 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">Next →</button>
                </div>
              </div>
            )}
            {lawyerStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 03: Weekly Availability</h3>
                <p className="text-xs text-slate-500">Clients book consultations based on your active slots.</p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p>✔ Monday - Friday: 09:00 AM - 05:00 PM</p>
                  <p>✔ Saturday: 09:00 AM - 01:00 PM</p>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setLawyerStep(2)} className="text-sm font-bold text-slate-600 cursor-pointer">Back</button>
                  <button onClick={() => setLawyerStep(4)} className="px-6 py-2 bg-[#0A1128] text-white rounded-xl font-bold text-sm cursor-pointer hover:bg-slate-800">Next →</button>
                </div>
              </div>
            )}
            {lawyerStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-[#0A1128]">Step 04: Payout Setup (CBE / Telebirr)</h3>
                <input type="text" placeholder="Commercial Bank of Ethiopia (CBE) Account Number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono" />
                <button
                  onClick={() => {
                    alert('Advocate onboarding submitted! Verification takes under 48 hours.');
                    setActiveTab('home');
                  }}
                  className="w-full py-3 bg-amber-500 font-bold text-sm text-[#0A1128] rounded-xl shadow cursor-pointer hover:bg-amber-600"
                >
                  Complete Advocate Application
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* 9. ROLE SELECT MODAL */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-[#0A1128]">Choose your portal</h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-4 space-y-3">
              <div 
                onClick={() => { setIsRoleModalOpen(false); setActiveTab('my-consultations'); }}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0A1128] cursor-pointer hover:bg-slate-50 transition-all"
              >
                <h4 className="font-bold text-[#0A1128] text-sm">Client Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">Track your consultations, requests, and drafted contracts</p>
              </div>

              <div 
                onClick={() => { setIsRoleModalOpen(false); setActiveTab('for-lawyers'); }}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#0A1128] cursor-pointer hover:bg-slate-50 transition-all"
              >
                <h4 className="font-bold text-[#0A1128] text-sm">Advocate Portal</h4>
                <p className="text-xs text-slate-500 mt-0.5">Manage schedule, verify advocacy license, receive payouts</p>
              </div>

              <Link 
                href="/admin"
                onClick={() => setIsRoleModalOpen(false)}
                className="block p-4 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0A1128] text-sm">Admin Oversight Portal →</h4>
                  <span className="text-[10px] font-bold bg-[#0A1128] text-white px-2 py-0.5 rounded">Admin</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Platform management, approve/complete consultations, metrics</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 10. FOOTER */}
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
              <div className="text-xs text-slate-400 space-y-1 pt-2">
                <p>📍 Bole Road, Addis Ababa, Ethiopia</p>
                <p>📞 +251 911 000 000</p>
                <p>✉️ hello@legallink.et</p>
              </div>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Platform</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li className="cursor-pointer hover:text-white" onClick={() => { setActiveTab('match'); setMatchStep(1); }}>Find a Lawyer</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('lexdraft')}>LexDraft</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('legaltalk')}>LegalTalk</li>
                <li className="cursor-pointer hover:text-white" onClick={() => setActiveTab('my-consultations')}>Client Portal</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">Administration</h5>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <Link href="/admin" className="text-slate-400 hover:text-amber-400 flex items-center gap-1">
                    <span>Admin Portal</span>
                    <span className="text-[10px] text-amber-400">↗</span>
                  </Link>
                </li>
                <li className="hover:text-white">Privacy Policy</li>
                <li className="hover:text-white">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>© 2026 LegalLink Ethiopia. All rights reserved.</span>
            <span>Addis Ababa, Ethiopia</span>
          </div>
        </div>
      </footer>

    </div>
  );
}