'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Scale, Briefcase, Heart, Home, Lightbulb, Users, Shield, Globe, Building, 
  ArrowRight, ArrowLeft, Star, ShieldCheck, CheckCircle2, Clock, Lock, Sparkles, 
  X, Menu, Phone, Mail, MapPin, Loader2, Printer, FileText, RefreshCw, UserCheck,
  Calendar, Check, AlertCircle, CreditCard, Download, ExternalLink, ChevronRight,
  Video, Send, MessageSquare, User, MessageCircle, Smartphone, Receipt, LogOut,
  KeyRound, Award, FileCode, Edit3, Paperclip, UploadCloud, Languages, UserPlus,
  ThumbsUp, Search, HelpCircle, CheckCircle, ChevronDown, ChevronUp, Calculator, Gavel,
  Mic, Square, Play, Trash2, Volume2, AlertTriangle, ClipboardCheck, Car, Key, Handshake
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LegalLinkHome() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'dara' | 'lexdraft' | 'legaltalk' | 'my-consultations'>('home');
  const [clientSubTab, setClientSubTab] = useState<'consultations' | 'contracts'>('consultations');

  // In-app Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Scroll Animations Observer
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

  // Auth & Session
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

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

  // Client Dashboard & Realtime State
  const [myConsultations, setMyConsultations] = useState<any[]>([]);
  const [selectedConsultationDetails, setSelectedConsultationDetails] = useState<any | null>(null);
  const [modalTab, setModalTab] = useState<'milestones' | 'room' | 'documents'>('milestones');
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const fetchMyConsultations = async () => {
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
    }
  };

  const fetchCaseDocuments = async (consultationId: string) => {
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
    }
  };

  // Realtime Sync for Consultations
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

  // Realtime Consultation Chat
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedConsultationDetails) return;

    const consultationId = selectedConsultationDetails.id;
    fetchCaseDocuments(consultationId);

    const supabase = createClient();
    let chatChannel: any = null;

    if (modalTab === 'room') {
      const fetchHistory = async () => {
        const { data, error } = await supabase
          .from('consultation_messages')
          .select('*')
          .eq('consultation_id', consultationId)
          .order('created_at', { ascending: true });

        if (!error && data) setMessages(data);
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

    return () => {
      if (chatChannel) void supabase.removeChannel(chatChannel);
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

    try {
      const supabase = createClient();
      const senderName = userProfile?.full_name || selectedConsultationDetails.client_name || 'Client';

      const { error } = await supabase
        .from('consultation_messages')
        .insert([
          {
            consultation_id: selectedConsultationDetails.id,
            sender_name: senderName,
            sender_role: 'client',
            message_text: newMessageText.trim(),
          },
        ]);

      if (error) {
        alert('Could not deliver message: ' + error.message);
      } else {
        setNewMessageText('');
      }
    } catch (err) {
      alert('Error transmitting message');
    }
  };

  // Statutory Labor & Severance Calculator (Proc. 1156/2019)
  const [calcSalary, setCalcSalary] = useState<number>(20000);
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcMonths, setCalcMonths] = useState<number>(4);
  const [calcReason, setCalcReason] = useState<'redundancy' | 'unlawful' | 'bankruptcy'>('redundancy');

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
  } else if (calcYears >= 1 && calcYears <= 9) {
    noticePeriodMonths = 2;
  } else if (calcYears > 9) {
    noticePeriodMonths = 3;
  }

  const noticeIndemnity = noticePeriodMonths * calcSalary;
  const leaveIndemnity = 12 * dailyWage;
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
            body { font-family: -apple-system, sans-serif; color: #0A1128; padding: 25px; }
            .header { border-bottom: 2px solid #0A1128; padding-bottom: 10px; margin-bottom: 20px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
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

  // DARA Counter-Ready Checklist
  const [daraDocType, setDaraDocType] = useState<'vehicle' | 'lease' | 'poa' | 'loan'>('vehicle');
  const [daraCheckedItems, setDaraCheckedItems] = useState<Record<string, boolean>>({});

  const daraCategories = {
    vehicle: {
      title: 'Vehicle Sale & Title Transfer',
      amTitle: 'የተሽከርካሪ ሽያጭና ስም ማዘዋወር',
      checklist: [
        { id: 'v1', text: 'Original Libre (የተሽከርካሪ ኦሪጅናል ሊብሮ) without bank mortgage stamp.' },
        { id: 'v2', text: 'Valid Annual Vehicle Inspection Sticker (የዘመኑ የቴክኒክ ምርመራ ቦሎ).' },
        { id: 'v3', text: 'Active Resident Kebele ID or Fayda Digital ID for Buyer and Seller.' },
        { id: 'v4', text: 'Spousal Consent (የባል/ሚስት ፈቃድ) in person or certified Single/Divorce certificate.' },
        { id: 'v5', text: '2 Ethiopian Citizen Witnesses present with valid Kebele IDs.' },
      ]
    },
    lease: {
      title: 'Real Estate & Commercial Lease',
      amTitle: 'የንግድና መኖሪያ ቤት ኪራይ ውል',
      checklist: [
        { id: 'l1', text: 'Original Land Holding Certificate / Title Deed (ኦሪጅናል የይዞታ ካርታ).' },
        { id: 'l2', text: 'Current Municipal Tax Clearance Receipt (የዘመኑ የግብር ደረሰኝ).' },
        { id: 'l3', text: 'Valid Resident IDs of both Landlord and Tenant.' },
        { id: 'l4', text: '2 Witnesses with active Kebele IDs who are not direct family beneficiaries.' },
      ]
    },
    poa: {
      title: 'Power of Attorney (POA)',
      amTitle: 'ጠቅላላና ልዩ የውክልና ስልጣን',
      checklist: [
        { id: 'p1', text: 'Physical presence of the Principal (ወካይ) with valid Kebele ID or Passport.' },
        { id: 'p2', text: 'Certified copy of Agent (ተወካይ) Kebele ID.' },
        { id: 'p3', text: 'Exact Bank Account Numbers or Land Plate Numbers specified in writing.' },
        { id: 'p4', text: '2 Witnesses with valid resident IDs present at the DARA desk.' },
      ]
    },
    loan: {
      title: 'Loan & Debt Acknowledgement',
      amTitle: 'የብድርና የዕዳ መቀበያ ውል',
      checklist: [
        { id: 'd1', text: 'Drafted Loan Contract with exact repayment date and interest terms.' },
        { id: 'd2', text: 'Bank Transfer Slip / Cheque Copy verifying fund disbursement.' },
        { id: 'd3', text: 'Borrower and Creditor valid Kebele/Fayda IDs.' },
        { id: 'd4', text: '2 Witnesses with non-expired government-issued IDs.' }
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
            body { font-family: -apple-system, sans-serif; color: #0A1128; padding: 25px; }
            .header { border-bottom: 2px solid #0A1128; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 20px; font-weight: 900; }
            .badge { background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 11px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            .table th { background: #0A1128; color: white; padding: 10px; text-align: left; }
            .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">DARA Pre-Flight Pass: ${daraCategories[daraDocType].title}</div>
              <div>${daraCategories[daraDocType].amTitle}</div>
            </div>
            <div class="badge">VERIFIED (${readinessPercent}%)</div>
          </div>
          <table class="table">
            <thead><tr><th>Status</th><th>Requirement</th></tr></thead>
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
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // LexDraft & Statutory Demand Letters
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [docFormData, setDocFormData] = useState<Record<string, string>>({});
  const [savedContracts, setSavedContracts] = useState<any[]>([
    { 
      id: 'cnt-1', 
      title: 'Demand Letter - Commercial Loan Default', 
      date: '2026-10-18', 
      fee: 'FREE', 
      partyA: 'Ethio Capital Partners',
      partyB: 'Alazar Solomon',
      roleOrPurpose: 'Default on Loan Agreement dated 12/03/2026',
      salaryOrRent: 'ETB 150,000.00',
      jurisdiction: '7 Calendar Days (Addis Ababa)',
      type: 'demand',
    }
  ]);

  const lexdraftTemplates = [
    {
      id: 'demand',
      title: 'Formal Legal Demand Letter',
      amTitle: 'የመጨረሻ የጽሑፍ ማስጠንቀቂያ ደብዳቤ',
      category: 'Dispute & Debt Recovery',
      priceETB: 0,
      desc: 'Mandatory statutory default notice under Ethiopian Civil Code Art. 1772 for unpaid debts, tenant eviction, or breach of contract.',
      statute: 'Civil Code of Ethiopia Art. 1772–1775',
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
      desc: 'Compliant with Ethiopian Labor Proclamation No. 1156/2019 for fixed or indefinite terms.',
      statute: 'Labor Proclamation No. 1156/2019',
      fields: [
        { key: 'partyA', label: 'Employer Entity Name / የአሰሪው ድርጅት ስም', placeholder: 'e.g. Safaricom Telecommunications PLC' },
        { key: 'partyB', label: 'Employee Legal Name / የሠራተኛው ሙሉ ስም', placeholder: 'e.g. Abebe Bikila' },
        { key: 'roleOrPurpose', label: 'Job Title & Responsibilities / የሥራ መደብ', placeholder: 'e.g. Senior Software Engineer' },
        { key: 'salaryOrRent', label: 'Gross Monthly Salary / ወርሃዊ ደመወዝ (ETB)', placeholder: 'e.g. ETB 35,000.00' },
        { key: 'jurisdiction', label: 'Workplace City / የሥራ ቦታ ከተማ', placeholder: 'e.g. Addis Ababa / አዲስ አበባ' },
      ],
    }
  ];

  const handleExportContractPDF = (contract: any) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950');
    if (!printWindow) return alert('Please allow popups to download/print your legal contract.');

    const partyA = contract.partyA || 'Claimant / Creditor';
    const partyB = contract.partyB || 'Debtor / Defaulting Party';
    const roleOrPurpose = contract.roleOrPurpose || 'Outstanding Commercial Default';
    const salaryOrRent = contract.salaryOrRent || 'ETB 50,000.00';
    const locationName = contract.jurisdiction || 'Addis Ababa / 7 Calendar Days';
    const startDate = contract.date || new Date().toISOString().split('T')[0];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${contract.title} - Official LegalLink LexDraft</title>
          <style>
            @page { size: portrait; margin: 18mm; }
            body { font-family: -apple-system, sans-serif; color: #111827; padding: 20px; line-height: 1.6; font-size: 13px; }
            .header { text-align: center; border-bottom: 2px solid #0A1128; padding-bottom: 12px; margin-bottom: 20px; }
            .parties-box { background: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; margin-bottom: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>STATUTORY DEFAULT NOTICE / የጽሑፍ ማስጠንቀቂያ ደብዳቤ</h3>
            <span>Civil Code Art. 1772 Enforceable Notice • Date: ${startDate}</span>
          </div>
          <div class="parties-box">
            <strong>FROM (CREDITOR):</strong> ${partyA}<br/>
            <strong>TO (DEBTOR):</strong> ${partyB}<br/>
            <strong>CLAIM:</strong> ${salaryOrRent}<br/>
            <strong>GROUND:</strong> ${roleOrPurpose}
          </div>
          <p>Pursuant to Article 1772 of the Civil Code of Ethiopia, you are formally placed in default. You are granted ${locationName} to tender full payment or action before immediate civil proceedings are initiated.</p>
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
      partyA,
      partyB,
      roleOrPurpose,
      salaryOrRent,
      jurisdiction,
      type: selectedTemplate.id,
    };

    setSavedContracts((prev) => [newContractRecord, ...prev]);
    setSelectedTemplate(null);
    setDocFormData({});

    handleExportContractPDF(newContractRecord);

    setActiveTab('my-consultations');
    setClientSubTab('contracts');
    showToast('Document generated and exported via LexDraft.');
  };

  // LegalTalk Forum State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('Property & Real Estate');
  const [communityQuestions, setCommunityQuestions] = useState<any[]>([
    {
      id: 'q1',
      title: 'Can a commercial landlord in Addis Ababa demand 1-year advance rent and raise prices mid-lease?',
      category: 'Property & Real Estate',
      author: 'Kidus M. (Bole)',
      date: '2 days ago',
      verifiedAnswer: {
        advocate: 'Advocate Dawit Tesfaye',
        body: 'Under Book IV of the Ethiopian Civil Code (Art. 2896 et seq.) and current Addis Ababa municipal directives, unilateral rent increments within an active, registered lease term are legally prohibited unless an explicit indexation clause is stated.',
      }
    },
    {
      id: 'q2',
      title: 'What are the employee severance rules during the 60-day probation period under Proclamation 1156/2019?',
      category: 'Employment Law',
      author: 'Selamawit B. (Kazanchis)',
      date: '4 days ago',
      verifiedAnswer: {
        advocate: 'Advocate Tigist Bekele',
        body: 'Pursuant to Article 11(3) of Ethiopian Labor Proclamation No. 1156/2019, if an employee is found unsuited during the probationary period, the employment agreement may be terminated without notice and without obligation to pay severance.',
      }
    }
  ]);

  const handlePostNewQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newQ = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle.trim(),
      category: newQuestionCategory,
      author: userProfile?.full_name || 'Anonymous Client',
      date: 'Just now',
      verifiedAnswer: null,
    };

    setCommunityQuestions([newQ, ...communityQuestions]);
    setAskModalOpen(false);
    setNewQuestionTitle('');
    showToast('Question posted! Advocates notified.');
  };

  // Static Data
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
      reviews: 442,
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

  const legalStages = [
    { step: 1, title: 'Case Intake & Evidence Audit', am: 'የማስረጃ ማሰባሰብ', desc: 'Advocate reviews briefs, contract clauses, and evidence records.' },
    { step: 2, title: 'Pleadings & Statement of Claim Drafted', am: 'መክፈቻ አቤቱታ ዝግጅት', desc: 'Formal petition drafted pursuant to Civil Procedure Code.' },
    { step: 3, title: 'Court Registry & Summons Served', am: 'የክስ መዝገብና መጥሪያ', desc: 'Case docket registered at First Instance/High Court and summons dispatched.' },
    { step: 4, title: 'Preliminary Objections & Defense', am: 'የመጀመሪያ ደረጃ መቃወሚያ', desc: 'Bench reviews jurisdiction, limitations, and statement of defense.' },
    { step: 5, title: 'Witness Examination & Hearing', am: 'የምስክር መስማት', desc: 'Examination and cross-examination of documentary evidence & witnesses.' },
    { step: 6, title: 'Final Judgment & Execution Decree', am: 'የመጨረሻ ፍርድና አፈፃፀም', desc: 'Final decree rendered and formal execution writ enforced.' },
  ];

  const legalTalkArticles = [
    {
      id: 1,
      tag: 'CORPORATE GOVERNANCE',
      title: "Understanding the Ethiopian Commercial Code: Key Takeaways for PLCs & Share Companies",
      author: 'Advocate Mulu Haile',
      readTime: '6 min read',
      excerpt: 'Crucial corporate compliance rules governing director liability, minimum capital allocations, shareholder resolutions, and regulatory auditing in Ethiopia.'
    },
    {
      id: 2,
      tag: 'REAL ESTATE & LAND',
      title: 'Land Rights & Commercial Property Leasing in Addis Ababa: Buyer Due Diligence Guide',
      author: 'Advocate Dawit Tesfaye',
      readTime: '8 min read',
      excerpt: 'Essential verification steps for land holding certificates, encumbrances, and municipal leasehold conversions under current city administration decrees.'
    },
    {
      id: 3,
      tag: 'LABOR & EMPLOYMENT',
      title: 'Employment Protections under Labor Proclamation No. 1156/2019: Probation & Severance Rules',
      author: 'Advocate Tigist Bekele',
      readTime: '5 min read',
      excerpt: 'A practical legal breakdown of probationary ceilings, statutory severance calculations, and mandatory dispute resolution procedures before the Labor Relations Board.'
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
              <Link
                href="/find-a-lawyer"
                className="px-3 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-[#0A1128] hover:bg-slate-50 transition-all"
              >
                {lang === 'am' ? 'ጠበቃ ፈልግ' : 'Find a Lawyer'}
              </Link>

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

              <Link
                href="/for-lawyers"
                className="px-3 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:text-[#0A1128] hover:bg-slate-50 transition-all"
              >
                For Lawyers
              </Link>

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
          
          {/* SECTION 1: HERO */}
          <section className="bg-gradient-to-b from-slate-50 via-white to-white pt-12 pb-20 border-b border-slate-100 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                    <Link
                      href="/find-a-lawyer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <span>Find a Lawyer</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </Link>
                    <button
                      onClick={() => setActiveTab('dara')}
                      className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>DARA Pre-Flight Checklist</span>
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
                      <span className="text-2xl font-black text-[#0A1128] block">4.95 ★</span>
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
                            <span>4.95</span>
                            <span className="text-slate-400 font-normal">(442 reviews)</span>
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

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Standard Legal Retainer:</span>
                        <strong className="text-[#0A1128]">ETB 1,500.00</strong>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Escrow Trust Protection:</span>
                        <span className="text-emerald-700 font-semibold">100% Protected</span>
                      </div>
                    </div>

                    <Link
                      href="/find-a-lawyer"
                      className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 2: HOW IT WORKS (3 SIMPLE STEPS) */}
          <section className="py-20 bg-slate-50/70 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2 reveal">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  HOW IT WORKS
                </span>
                <h2 className="text-3xl font-black text-[#0A1128]">Get Legal Help in 3 Simple Steps</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Transparent, verified legal consultations backed by Ethiopian statutory compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 reveal reveal-delay-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-lg border border-amber-200">
                    1
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Describe Your Need</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tell us your situation in plain English or Amharic, or record a voice brief. Our engine categorizes your case and assigns jurisdiction.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 reveal reveal-delay-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-lg border border-blue-200">
                    2
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Match with an Advocate</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect with licensed Ethiopian advocates holding active Ministry of Justice credentials and proven expertise in your case domain.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4 reveal reveal-delay-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-lg border border-emerald-200">
                    3
                  </div>
                  <h3 className="font-black text-lg text-[#0A1128]">Escrow & Consult</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Authorize the retainer via Telebirr USSD. Funds remain securely locked in escrow until your consultation is completed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PRACTICE AREAS (8 DOMAINS) */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">PRACTICE AREAS</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">Specialized Legal Domains</h2>
                </div>
                <Link
                  href="/find-a-lawyer"
                  className="mt-3 sm:mt-0 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All 8 Practice Areas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {practiceAreas.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      href="/find-a-lawyer"
                      className={`p-6 rounded-3xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer bg-white group reveal reveal-delay-${(idx % 4) + 1}`}
                    >
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-[#0A1128] group-hover:text-amber-400 flex items-center justify-center text-[#0A1128] mb-4 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#0A1128] text-base">{cat.title}</h3>
                      <span className="text-[11px] font-bold text-slate-400 block mt-0.5">{cat.amTitle}</span>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{cat.desc}</p>
                    </Link>
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
                  href="/for-lawyers"
                  className="mt-3 sm:mt-0 text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Are you an advocate? Join our network</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockMatchedLawyers.map((lawyer, idx) => (
                  <div key={lawyer.id} className={`p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between space-y-4 reveal reveal-delay-${idx + 1}`}>
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

                    <Link
                      href="/find-a-lawyer"
                      className="w-full py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm text-center"
                    >
                      Book Session
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5: WHY LEGALLINK */}
          <section className="py-20 bg-[#0A1128] text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 reveal">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  SECURITY & INTEGRITY
                </span>
                <h2 className="text-3xl sm:text-4xl font-black">Why LegalLink</h2>
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
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 reveal reveal-delay-1">
                  <ShieldCheck className="w-8 h-8 text-amber-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Ministry of Justice Vetting</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No anonymous profiles. Every advocate is verified against active Federal or Regional MOJ bar registration numbers.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 reveal reveal-delay-2">
                  <Lock className="w-8 h-8 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Guaranteed Escrow Protection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Retainers are locked in LegalLink's regulatory trust pool. Advocates receive disbursements only after consultation delivery.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 reveal reveal-delay-3">
                  <Languages className="w-8 h-8 text-blue-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Bilingual Contract Drafting</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate agreements in Amharic script or dual-column English/Amharic matching Document Authentication agency requirements.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2 reveal reveal-delay-4">
                  <Smartphone className="w-8 h-8 text-purple-400 mb-2" />
                  <h4 className="font-bold text-sm text-white">Instant SMS Notifications</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time updates delivered straight to mobile phones for escrow locking, lawyer greetings, and payout disbursements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: LEGALTALK PREVIEW */}
          <section className="py-20 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 reveal">
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">KNOWLEDGE HUB</span>
                  <h2 className="text-3xl font-black text-[#0A1128] mt-1">LegalTalk</h2>
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
                    onClick={() => setActiveTab('legaltalk')}
                    className={`p-6 rounded-3xl border border-slate-200 hover:border-[#0A1128] transition-all cursor-pointer flex flex-col justify-between space-y-4 group reveal reveal-delay-${idx + 1}`}
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

          {/* SECTION 7: GENERATE LEGAL DOCUMENTS IN MINUTES (LEXDRAFT SPOTLIGHT) */}
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

                <div className="w-full max-w-sm bg-white text-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 text-[11px] space-y-3 font-serif">
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
                  <span className="text-sm font-black text-[#0A1128]">4.95 / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Verified Retainer
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "Advocate Mulu helped restructure our PLC share agreement efficiently. Clear communication throughout."
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#0A1128] block">Dawit Alemu</strong>
                      <span className="text-[10px] text-slate-400">Advocate: Advocate Mulu Haile</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Recent</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Verified Retainer
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "Handled our commercial lease compliance dispute in Bole with speed and thoroughness."
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#0A1128] block">Bethlehem Tadesse</strong>
                      <span className="text-[10px] text-slate-400">Advocate: Advocate Mulu Haile</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Recent</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ Verified Retainer
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "Fast response and very helpful guidance on the labor severance calculation under Proc. 1156."
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#0A1128] block">Abebe K.</strong>
                      <span className="text-[10px] text-slate-400">Advocate: Advocate Tigist Bekele</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Recent</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* VIEW B: DARA COUNTER-READY CHECKLIST */}
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

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-lg text-[#0A1128]">
                  {daraCategories[daraDocType].title} ({daraCategories[daraDocType].amTitle})
                </h3>
                <span className="text-xs text-slate-500">Tap each box as you place the original document in your folder</span>
              </div>

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
          </div>
        </main>
      )}

      {/* VIEW C: SEVERANCE CALCULATOR */}
      {activeTab === 'calculator' && (
        <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-[#0A1128] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">STATUTORY TOOL</span>
              <h1 className="text-3xl sm:text-4xl font-black mt-1">Labor & Severance Pay Calculator</h1>
              <p className="text-xs sm:text-sm text-slate-300">Compute statutory entitlements under Labor Proclamation No. 1156/2019.</p>
            </div>
            <button onClick={handlePrintLaborCalculation} className="px-6 py-3.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span>Export Sheet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-xs shadow-sm">
              <label className="block font-bold uppercase">Monthly Gross Salary (ETB)</label>
              <input type="number" value={calcSalary} onChange={(e) => setCalcSalary(Number(e.target.value) || 0)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase">Years of Service</label>
                  <input type="number" value={calcYears} onChange={(e) => setCalcYears(Number(e.target.value) || 0)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold uppercase">Additional Months</label>
                  <input type="number" value={calcMonths} onChange={(e) => setCalcMonths(Number(e.target.value) || 0)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
              </div>

              <label className="block font-bold uppercase">Termination Reason</label>
              <select value={calcReason} onChange={(e: any) => setCalcReason(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                <option value="redundancy">Workforce Reduction / Redundancy (የሠራተኞች ቅነሳ - Art. 29)</option>
                <option value="unlawful">Unlawful Termination Without Cause (ያለ አግባብ የተደረገ ስንብት)</option>
                <option value="bankruptcy">Company Liquidation (የድርጅት መክሰር - Art. 24)</option>
              </select>
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="p-4 bg-[#0A1128] text-white rounded-2xl">
                <span className="text-[10px] text-amber-400 uppercase font-bold">Total Statutory Package</span>
                <div className="text-2xl font-black font-mono text-emerald-400">ETB {totalCalculatedPackage.toFixed(2)}</div>
              </div>
              <button onClick={handlePrintLaborCalculation} className="w-full py-3 bg-slate-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>Print Official PDF</span>
              </button>
            </div>
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
              <p className="text-xs text-slate-300 mt-1">Generate demand notices under Civil Code Art. 1772 or contracts with instant bilingual export.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lexdraftTemplates.map((tpl) => (
              <div key={tpl.id} className="p-6 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{tpl.category}</span>
                    <span className="font-mono font-bold text-xs text-emerald-600">{tpl.priceETB === 0 ? 'FREE' : `ETB ${tpl.priceETB}`}</span>
                  </div>
                  <h3 className="font-black text-base text-[#0A1128] mt-2">{tpl.title}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block">{tpl.amTitle}</span>
                  <p className="text-xs text-slate-500 mt-2">{tpl.desc}</p>
                </div>
                <button 
                  onClick={() => { setSelectedTemplate(tpl); setDocFormData({}); }}
                  className="w-full py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43] transition-all"
                >
                  {tpl.id === 'demand' ? 'Generate Demand Letter' : 'Customize & Export'}
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW E: LEGALTALK FORUM */}
      {activeTab === 'legaltalk' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full space-y-8">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] rounded-3xl p-8 text-white flex justify-between items-center shadow-xl">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">COMMUNITY FORUM</span>
              <h1 className="text-3xl font-black mt-1">LegalTalk Ethiopia</h1>
              <p className="text-xs text-slate-300 mt-1">Browse answers by licensed Ethiopian advocates or post a free inquiry.</p>
            </div>
            <button onClick={() => setAskModalOpen(true)} className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow">
              + Ask a Free Question
            </button>
          </div>

          <div className="space-y-4">
            {communityQuestions.map((q) => (
              <div key={q.id} className="p-6 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">{q.category}</span>
                <h3 className="text-base font-black text-[#0A1128]">{q.title}</h3>
                {q.verifiedAnswer && (
                  <div className="p-4 bg-slate-50 border rounded-2xl text-xs space-y-2">
                    <strong className="text-[#0A1128] block">{q.verifiedAnswer.advocate} (✓ Verified Counsel)</strong>
                    <p className="text-slate-600 leading-relaxed">{q.verifiedAnswer.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIEW F: CLIENT PORTAL */}
      {activeTab === 'my-consultations' && (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full space-y-6">
          <div className="bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white p-8 rounded-3xl shadow-lg flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">CLIENT ACCOUNT HUB</span>
              <h1 className="text-3xl font-black mt-1">Your Legal Workspace</h1>
              <p className="text-xs text-slate-300">Track court hearings (ቀጠሮ), case litigation stages, and voice briefs in real time.</p>
            </div>
            <Link href="/find-a-lawyer" className="px-5 py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow">
              + New Case
            </Link>
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
              Saved Contracts & Notices ({savedContracts.length})
            </button>
          </div>

          {clientSubTab === 'consultations' && (
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
                        {c.voice_note_url && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                            <Mic className="w-3 h-3 text-purple-600" />
                            <span>Voice Brief Attached</span>
                          </span>
                        )}
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
          )}

          {clientSubTab === 'contracts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedContracts.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-center shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 uppercase">
                      {doc.type === 'demand' ? '⚠️ Statutory Default Notice' : 'LexDraft Document'}
                    </span>
                    <h4 className="font-bold text-sm text-[#0A1128]">{doc.title}</h4>
                    <span className="text-[11px] text-slate-400 block">{doc.date}</span>
                  </div>
                  <button 
                    onClick={() => handleExportContractPDF(doc)}
                    className="p-2.5 bg-[#0A1128] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print PDF</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* 3. CASE DETAIL & LITIGATION MODAL */}
      {selectedConsultationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">CASE AUDIT & LITIGATION TRACKER</span>
                <h3 className="font-black text-lg mt-0.5">{selectedConsultationDetails.practice_area}</h3>
              </div>
              <button onClick={() => setSelectedConsultationDetails(null)} className="p-1.5 text-white/70 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-bold">
              <button onClick={() => setModalTab('milestones')} className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${modalTab === 'milestones' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}>
                <Gavel className="w-3.5 h-3.5" />
                <span>Court Hearings & Timeline</span>
              </button>
              <button onClick={() => setModalTab('room')} className={`py-3 border-b-2 cursor-pointer flex items-center gap-1.5 ${modalTab === 'room' ? 'border-[#0A1128] text-[#0A1128]' : 'border-transparent text-slate-400'}`}>
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-xs space-y-4">
              {modalTab === 'milestones' && (
                <div className="space-y-4">
                  {selectedConsultationDetails.next_court_date && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                      <strong className="block text-amber-900 font-bold">Next Court Hearing (ቀጣይ ቀጠሮ):</strong>
                      <span className="text-slate-700">{new Date(selectedConsultationDetails.next_court_date).toLocaleDateString()} at {selectedConsultationDetails.court_name || 'Lideta Bench'}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {legalStages.map((st) => (
                      <div key={st.step} className={`p-3 rounded-xl border flex items-center gap-3 ${st.step <= (selectedConsultationDetails.case_stage || 1) ? 'border-emerald-300 bg-emerald-50/40 text-emerald-900' : 'border-slate-200'}`}>
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">{st.step}</div>
                        <div>
                          <strong>{st.title} ({st.am})</strong>
                          <span className="text-[10px] text-slate-500 block">{st.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'room' && (
                <div className="space-y-4">
                  <div className="h-64 bg-slate-50 border rounded-2xl p-4 overflow-y-auto space-y-2">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex flex-col ${m.sender_role === 'client' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-400">{m.sender_name}</span>
                        <div className={`p-2.5 rounded-xl text-xs max-w-sm ${m.sender_role === 'client' ? 'bg-[#0A1128] text-white' : 'bg-white border'}`}>
                          {m.message_text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatBottomRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input type="text" placeholder="Type message..." value={newMessageText} onChange={(e) => setNewMessageText(e.target.value)} className="flex-1 px-3 py-2 border rounded-xl text-xs" />
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Send</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. LEXDRAFT BUILDER MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">LEXDRAFT BILINGUAL ENGINE</span>
                <h3 className="font-black text-xl">{selectedTemplate.title}</h3>
                <span className="text-xs text-slate-300 font-mono mt-0.5 block">{selectedTemplate.statute}</span>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDocumentSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
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
                <button type="button" onClick={() => setSelectedTemplate(null)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">Cancel</button>
                <button type="submit" className="w-2/3 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow">
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Generate & Export PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ASK QUESTION MODAL */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 bg-gradient-to-r from-[#0A1128] to-[#102A43] text-white flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">COMMUNITY FORUM INQUIRY</span>
                <h3 className="font-black text-xl">Ask a Free Legal Question</h3>
              </div>
              <button onClick={() => setAskModalOpen(false)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostNewQuestion} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Legal Domain</label>
                <select value={newQuestionCategory} onChange={(e) => setNewQuestionCategory(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold">
                  <option value="Property & Real Estate">Property & Real Estate (መሬትና ንብረት)</option>
                  <option value="Employment Law">Employment Law (የሥራና ሠራተኛ አዋጅ 1156)</option>
                  <option value="Corporate & Business Law">Corporate & Business (የንግድና ኩባንያ ሕግ)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question Summary *</label>
                <input type="text" required placeholder="Type legal question..." value={newQuestionTitle} onChange={(e) => setNewQuestionTitle(e.target.value)} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setAskModalOpen(false)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="w-2/3 py-3 bg-[#0A1128] text-white font-bold rounded-xl shadow">Post Question</button>
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