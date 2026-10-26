'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Search, Star, Phone, CheckCircle2, Lock, 
  ArrowRight, ArrowLeft, Mic, Square, Play, Pause, RotateCcw, 
  Scale, FileText, Calculator, Building2, Briefcase, Home as HomeIcon,
  Users, Check, AlertCircle, Sparkles, Smartphone, Landmark, Clock
} from 'lucide-react';

interface Advocate {
  id: string;
  name: string;
  amharic_name: string;
  tier: 'Top Match' | 'Fast Responder' | 'Senior Specialist';
  role: string;
  barLicense: string;
  experience: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  practiceAreas: string[];
  bio: string;
  badgeColor: string;
}

const ADVOCATES_DIRECTORY: Advocate[] = [
  {
    id: 'adv-001',
    name: 'Advocate Mulu Haile',
    amharic_name: 'ጠበቃ ሙሉ ኃይሌ',
    tier: 'Top Match',
    role: 'Corporate Restructuring & Capital Markets',
    barLicense: 'ETH-BAR-2018-0492',
    experience: '12 Years (Federal Supreme Court)',
    hourlyRate: 1500,
    rating: 4.95,
    reviewsCount: 442,
    practiceAreas: ['Corporate & Commercial', 'Capital Markets & ESX', 'Tax Law'],
    bio: 'Specialist in Commercial Code Art. 495 share company conversions, ECMA Directive 1030/2024 compliance, and Addis Ababa Chamber arbitration.',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    id: 'adv-002',
    name: 'Advocate Tigist Bekele',
    amharic_name: 'ጠበቃ ትዕግሥት በቀለ',
    tier: 'Fast Responder',
    role: 'Labor Relations & Family Law Counsel',
    barLicense: 'ETH-BAR-2020-1104',
    experience: '8 Years (Federal High Court)',
    hourlyRate: 1200,
    rating: 4.88,
    reviewsCount: 312,
    practiceAreas: ['Employment & Labor', 'Family & Civil Law'],
    bio: 'Experienced litigator specializing in Labor Proclamation No. 1156/2019 claims, collective bargaining, and amicable civil divorce settlements.',
    badgeColor: 'bg-blue-50 text-blue-900 border-blue-200'
  },
  {
    id: 'adv-003',
    name: 'Advocate Dawit Tesfaye',
    amharic_name: 'ጠበቃ ዳዊት ተስፋዬ',
    tier: 'Senior Specialist',
    role: 'Real Estate & Land Administration Counsel',
    barLicense: 'ETH-BAR-2015-0081',
    experience: '15 Years (Cassation Division)',
    hourlyRate: 1800,
    rating: 4.92,
    reviewsCount: 521,
    practiceAreas: ['Real Estate & Land', 'Commercial Tenancy'],
    bio: 'Extensive litigation experience across municipal land tenure transfers, commercial title deed verification, and Cassation precedent appeals.',
    badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200'
  }
];

export default function FindALawyerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  // Booking Flow Steps: 1: Lawyer Selection | 2: Case Intake | 3: Telebirr Escrow Payment | 4: Booking Confirmed
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Intake Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [intakeMode, setIntakeMode] = useState<'text' | 'voice'>('text');

  // Audio Recording (MediaRecorder API)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Telebirr Payment Simulation State
  const [telebirrStatus, setTelebirrStatus] = useState<'idle' | 'pushing' | 'pin_pending' | 'success'>('idle');
  const [telebirrPin, setTelebirrPin] = useState('');

  // Severance Calculator State
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcSalary, setCalcSalary] = useState<number>(25000);
  const [severanceResult, setSeveranceResult] = useState<number>(0);

  // DARA Checklist State
  const [daraChecked, setDaraChecked] = useState<Record<string, boolean>>({
    cbe_stamp: false,
    fayda_id: true,
    tin_reg: true,
    bylaws_signed: false
  });

  // Calculate Severance according to Proc. 1156/2019
  useEffect(() => {
    // 30 days wages for 1st year + 1/3 of month salary for every additional year
    const firstYear = calcSalary;
    const additionalYears = Math.max(0, calcYears - 1) * (calcSalary / 3);
    setSeveranceResult(Math.round(firstYear + additionalYears));
  }, [calcYears, calcSalary]);

  // Audio Recording Handlers
  const startRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is required to record a voice brief.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const toggleAudioPreview = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlayingPreview) {
      audioPlayerRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Telebirr Checkout Handler
  const handleTriggerTelebirrEscrow = () => {
    setTelebirrStatus('pushing');
    setTimeout(() => {
      setTelebirrStatus('pin_pending');
    }, 1500);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (telebirrPin.length < 4) return;
    setTelebirrStatus('success');
    setTimeout(() => {
      setBookingStep(4);
    }, 1200);
  };

  const filteredAdvocates = ADVOCATES_DIRECTORY.filter((adv) => {
    const matchesCat = selectedCategory === 'all' || adv.practiceAreas.some(pa => pa.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesQuery = adv.name.toLowerCase().includes(searchQuery.toLowerCase()) || adv.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <span className="font-black text-xl text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Home
            </Link>
            <a href="#tools" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              LexDraft & Tools
            </a>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            >
              Client Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Matching & Consultation Experience */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        
        {/* Banner with Escrow Safeguard */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              CONFIDENTIAL CLIENT INTAKE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Find Verified Legal Counsel
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Select an accredited advocate, describe your legal matter, and lock your consultation retainer in <strong>Telebirr Escrow</strong>. Retainers are released only after your consultation is complete.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Client Protection</span>
              <span className="font-black text-white">Commercial Code 1240/2021 Escrow</span>
            </div>
          </div>
        </div>

        {/* STEP 1: LAWYER SELECTION DIRECTORY */}
        {bookingStep === 1 && (
          <div className="space-y-6">
            
            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by legal subject or advocate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
                {[
                  { id: 'all', label: 'All Practice Areas' },
                  { id: 'corporate', label: 'Corporate & M&A' },
                  { id: 'property', label: 'Real Estate & Land' },
                  { id: 'employment', label: 'Labor Law' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-[#0A1128] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simplified 3-Tier Advocate Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAdvocates.map((adv) => (
                <div
                  key={adv.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:border-slate-400 transition-all hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${adv.badgeColor}`}>
                        {adv.tier}
                      </span>
                      <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{adv.rating}</span>
                        <span className="text-slate-400 font-normal">({adv.reviewsCount})</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-[#0A1128]">{adv.name}</h3>
                      <span className="text-[11px] font-medium text-slate-400 block">{adv.amharic_name}</span>
                      <span className="text-xs text-slate-600 block mt-1 font-semibold">{adv.role}</span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {adv.bio}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{adv.barLicense}</span>
                      </div>
                      <div className="text-slate-500">{adv.experience}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Fixed Retainer</span>
                      <strong className="text-sm font-black text-[#0A1128]">ETB {adv.hourlyRate.toLocaleString()}</strong>
                      <span className="text-[9px] text-emerald-600 block font-semibold">Telebirr Escrow Protected</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAdvocate(adv);
                        setBookingStep(2);
                      }}
                      className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>Consult</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* STEP 2: INTAKE WITH VOICE BRIEF RECORDING */}
        {bookingStep === 2 && selectedAdvocate && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                onClick={() => setBookingStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Advocate</span>
              </button>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Consultation With</span>
                <span className="text-xs font-black text-[#0A1128]">{selectedAdvocate.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#0A1128]">Describe Your Legal Situation</h2>
              <p className="text-xs text-slate-500">Provide details in English or Amharic so counsel can prepare statutory authorities before your session.</p>
            </div>

            {/* Intake Input Toggle (Text vs Voice Brief) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setIntakeMode('text')}
                className={`py-2 rounded-xl transition-all cursor-pointer ${
                  intakeMode === 'text' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                }`}
              >
                Written Brief
              </button>
              <button
                type="button"
                onClick={() => setIntakeMode('voice')}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  intakeMode === 'voice' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-amber-500" />
                <span>Record Voice Brief (የድምፅ መግለጫ)</span>
              </button>
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dawit Alemu"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Telebirr Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="0911 000 000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            </div>

            {/* Written Brief Area */}
            {intakeMode === 'text' && (
              <div className="text-xs space-y-1">
                <label className="block font-bold text-slate-700">Case Summary / Specific Dispute *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize your situation (e.g. Lease dispute in Bole, commercial contract drafting, or employment severance calculation)..."
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>
            )}

            {/* Voice Brief Recorder (MediaRecorder Integration) */}
            {intakeMode === 'voice' && (
              <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-4 text-center">
                <span className="font-bold text-amber-950 block">Voice Brief Engine</span>
                <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                  Speak comfortably in Amharic or English. Explain what happened and what resolution you seek. Your advocate will listen directly in their workspace.
                </p>

                {/* Recorder Controls */}
                <div className="flex flex-col items-center justify-center gap-3">
                  {!audioUrl ? (
                    isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl flex items-center gap-2 shadow-md cursor-pointer animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>Stop Recording ({recordingSeconds}s)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-2xl flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-amber-400" />
                        <span>Start Recording Brief</span>
                      </button>
                    )
                  ) : (
                    <div className="w-full bg-white p-4 rounded-2xl border border-amber-200 space-y-3">
                      <audio ref={audioPlayerRef} src={audioUrl} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Voice brief recorded successfully</span>
                        </div>
                        <span className="font-mono text-slate-500">{recordingSeconds}s</span>
                      </div>

                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={toggleAudioPreview}
                          className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlayingPreview ? 'Pause' : 'Listen Preview'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={resetRecording}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Re-record</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!clientName || !clientPhone}
              onClick={() => setBookingStep(3)}
              className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Continue to Telebirr Escrow Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* STEP 3: TELEBIRR ESCROW PAYMENT CHECKOUT */}
        {bookingStep === 3 && selectedAdvocate && (
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                onClick={() => setBookingStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Brief</span>
              </button>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                Escrow Hold
              </span>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-[#0A1128]">Authorize Retainer via Telebirr</h2>
              <p className="text-xs text-slate-500">
                Authorized via Ethio Telecom USSD Push. Your funds stay in statutory escrow until the consultation is delivered.
              </p>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Advocate Initial Retainer:</span>
                <span className="font-mono font-bold text-slate-800">ETB {selectedAdvocate.hourlyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>LegalLink Escrow Custody Fee:</span>
                <span className="font-mono font-bold text-emerald-700">ETB 0.00 (Free)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-[#0A1128]">
                <span>Total Escrow Amount:</span>
                <span className="font-mono text-sm">ETB {selectedAdvocate.hourlyRate.toLocaleString()}</span>
              </div>
            </div>

            {/* Telebirr USSD Simulation States */}
            {telebirrStatus === 'idle' && (
              <button
                type="button"
                onClick={handleTriggerTelebirrEscrow}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>Send USSD Push to {clientPhone || 'Your Phone'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {telebirrStatus === 'pushing' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2">
                <Clock className="w-5 h-5 text-amber-600 animate-spin mx-auto" />
                <span className="text-xs font-bold text-amber-950 block">Connecting with Ethio Telecom Gateway...</span>
                <p className="text-[10px] text-amber-800">Dispatching USSD Prompt *127# to your mobile.</p>
              </div>
            )}

            {telebirrStatus === 'pin_pending' && (
              <form onSubmit={handleConfirmPin} className="space-y-4">
                <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                    TELEBIRR USSD PUSH RECEIVED
                  </span>
                  <p className="text-xs">Enter your 4-digit Telebirr PIN to lock ETB {selectedAdvocate.hourlyRate} in escrow.</p>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={telebirrPin}
                    onChange={(e) => setTelebirrPin(e.target.value)}
                    className="w-32 mx-auto text-center py-2 bg-slate-800 border border-slate-700 rounded-xl font-mono text-lg tracking-widest text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Lock Escrow
                </button>
              </form>
            )}

            {telebirrStatus === 'success' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <span className="text-xs font-bold text-emerald-950 block">Telebirr Payment Authorized!</span>
                <p className="text-[10px] text-emerald-800">Generating escrow custody certificate...</p>
              </div>
            )}

          </div>
        )}

        {/* STEP 4: CONSULTATION CONFIRMED */}
        {bookingStep === 4 && selectedAdvocate && (
          <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-widest">
                ESCROW LOCKED & BRIEF DISPATCHED
              </span>
              <h2 className="text-2xl font-black text-[#0A1128]">Consultation Confirmed!</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your consultation request and case brief have been placed directly into <strong>{selectedAdvocate.name}&apos;s docket</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Advocate:</span>
                <span className="text-slate-900 font-bold">{selectedAdvocate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escrow Hold Reference:</span>
                <span className="font-mono font-bold text-slate-800">ETH-ESCROW-2026-9041</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Telebirr Amount:</span>
                <span className="font-mono font-bold text-emerald-700">ETB {selectedAdvocate.hourlyRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audio Brief Attached:</span>
                <span className="font-bold text-amber-700">{audioUrl ? 'Yes (Amharic Recording)' : 'Written Brief Only'}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/advocate"
                className="flex-1 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all"
              >
                View in Advocate Docket
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                Return Home
              </Link>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* COMPLIANCE & LEGAL TOOLS (ANCHORED FOR HOMEPAGE NAVIGATION) */}
        {/* ------------------------------------------------------------- */}
        <section id="tools" className="pt-12 border-t border-slate-200 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
              STATUTORY SELF-SERVICE UTILITIES
            </span>
            <h2 className="text-2xl font-black text-[#0A1128]">
              Ethiopian Legal Compliance Engines
            </h2>
            <p className="text-xs text-slate-500">
              Instant contract drafting, severance calculations, and DARA authentication audits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* 1. LexDraft Engine (#lexdraft) */}
            <div id="lexdraft" className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-sm text-[#0A1128]">LexDraft Contract Studio</h3>
                </div>
                <p className="text-slate-500 leading-relaxed font-normal">
                  Standardized bilingual template compliant with Commercial Code Art. 1240.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-700 space-y-1">
                  <div>1. Employment Agreement (የቅጥር ውል)</div>
                  <div>2. Commercial Tenancy (የንግድ ቤት ኪራይ)</div>
                  <div>3. Non-Disclosure Agreement (ምስጢር መጠበቂያ)</div>
                </div>
              </div>
              <button 
                onClick={() => alert('LexDraft bilingual draft exported to PDF with DARA authentication stamps.')}
                className="w-full py-2.5 bg-[#0A1128] text-white font-bold rounded-xl hover:bg-[#102A43] cursor-pointer"
              >
                Generate Standardized PDF
              </button>
            </div>

            {/* 2. Severance Calculator (#severance) */}
            <div id="severance" className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h3 className="font-black text-sm text-[#0A1128]">Severance Calculator</h3>
                </div>
                <p className="text-slate-500 leading-relaxed font-normal">
                  Statutory severance under Labor Proclamation No. 1156/2019.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tenure (Years)</label>
                    <input
                      type="number"
                      min={1}
                      value={calcYears}
                      onChange={(e) => setCalcYears(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Monthly Pay (ETB)</label>
                    <input
                      type="number"
                      step={1000}
                      value={calcSalary}
                      onChange={(e) => setCalcSalary(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center font-bold">
                  <span className="text-blue-900">Statutory Payout:</span>
                  <span className="text-blue-950 font-mono text-sm">ETB {severanceResult.toLocaleString()}</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 text-center block">Calculated via Proc. 1156/2019 Art. 39–40</span>
            </div>

            {/* 3. DARA Pre-Flight Checklist (#dara) */}
            <div id="dara" className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-black text-sm text-[#0A1128]">DARA Document Pre-Flight</h3>
                </div>
                <p className="text-slate-500 leading-relaxed font-normal">
                  Pre-screen your legal dossier before visiting Document Authentication Agency.
                </p>

                <div className="space-y-2 pt-1">
                  {[
                    { key: 'cbe_stamp', label: 'CBE Authentication Fee Receipt' },
                    { key: 'fayda_id', label: 'Valid Fayda National ID / Passport' },
                    { key: 'tin_reg', label: 'Commercial TIN Registration Certificate' },
                    { key: 'bylaws_signed', label: 'Articles of Association Signed by Founders' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={daraChecked[item.key]}
                        onChange={(e) => setDaraChecked({ ...daraChecked, [item.key]: e.target.checked })}
                        className="rounded border-slate-300 text-[#0A1128] focus:ring-0"
                      />
                      <span className="text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center font-bold text-emerald-900 text-[11px]">
                {Object.values(daraChecked).filter(Boolean).length} of 4 Documents Verified Ready
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Ethiopia • Verified Legal Services Marketplace • Bole Sub-City, Addis Ababa
      </footer>

    </div>
  );
}