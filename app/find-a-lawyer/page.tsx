'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Building2, Heart, Home, Lightbulb, Briefcase, Scale, Plane, Globe,
  ArrowRight, ArrowLeft, Check, CheckCircle2, Star, ShieldCheck, 
  Calendar, Clock, DollarSign, ChevronRight, Mic, Square, Play, Trash2, Loader2, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function FindALawyerPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Category
  const [selectedCategory, setSelectedCategory] = useState<string>('Corporate & Business');

  // Step 2: Preferences
  const [location, setLocation] = useState<string>('Addis Ababa');
  const [language, setLanguage] = useState<string>('Amharic');
  const [budgetRange, setBudgetRange] = useState<string>('ETB 1,000–2,000/hr');
  const [urgency, setUrgency] = useState<string>('Within 24 hours');
  const [situationText, setSituationText] = useState<string>('');

  // Voice Note Intake
  const [intakeMode, setIntakeMode] = useState<'text' | 'voice'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Step 3: Match Selection
  const [selectedAdvocate, setSelectedAdvocate] = useState<any | null>(null);

  // Step 4: Confirm & Client Details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+251 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Practice Areas Data
  const categories = [
    {
      id: 'Corporate & Business',
      title: 'Corporate & Business',
      desc: 'Company formation, contracts, M&A',
      icon: '🏢',
    },
    {
      id: 'Family Law',
      title: 'Family Law',
      desc: 'Divorce, custody, adoption',
      icon: '👨‍👩‍👧',
    },
    {
      id: 'Property & Real Estate',
      title: 'Property & Real Estate',
      desc: 'Land rights, title transfers, leases',
      icon: '🏠',
    },
    {
      id: 'Intellectual Property',
      title: 'Intellectual Property',
      desc: 'Trademark, copyright, patents',
      icon: '💡',
    },
    {
      id: 'Employment Law',
      title: 'Employment Law',
      desc: 'Labor disputes, contracts',
      icon: '👔',
    },
    {
      id: 'Criminal Defense',
      title: 'Criminal Defense',
      desc: 'Representation, bail, appeals',
      icon: '⚖️',
    },
    {
      id: 'Immigration',
      title: 'Immigration',
      desc: 'Visas, residency, diaspora matters',
      icon: '✈️',
    },
    {
      id: 'NGO & Compliance',
      title: 'NGO & Compliance',
      desc: 'Registration, regulatory compliance',
      icon: '🌐',
    },
  ];

  // Preference Options
  const locations = [
    'Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Adama', 'Remote / Online'
  ];

  const languages = ['Amharic', 'English', 'Oromiffa', 'Tigrinya', 'French'];

  const budgetRanges = [
    'Under ETB 500/hr', 'ETB 500–1,000/hr', 'ETB 1,000–2,000/hr', 'ETB 2,000+/hr', 'Open / Negotiable'
  ];

  const urgencyOptions = ['Within 24 hours', 'Within 3 days', 'Within a week', 'Flexible'];

  // Mock Available Advocates
  const availableAdvocates = [
    {
      id: 'adv-1',
      name: 'Advocate Mulu Haile',
      title: 'Senior Federal Advocate • Corporate & Commercial',
      experience: '12 yrs exp',
      rating: 4.95,
      reviews: 442,
      hourlyRate: 1500,
      location: 'Addis Ababa',
      languages: ['Amharic', 'English'],
      bio: 'Former senior legal advisor with 12+ years expertise in commercial contracts, debt recovery litigation, and corporate structuring.',
      avatarInitials: 'MH',
    },
    {
      id: 'adv-2',
      name: 'Advocate Tigist Bekele',
      title: 'Civil, Labor & Tenancy Specialist',
      experience: '9 yrs exp',
      rating: 4.88,
      reviews: 312,
      hourlyRate: 1200,
      location: 'Addis Ababa / Remote',
      languages: ['Amharic', 'English', 'Oromiffa'],
      bio: 'Specialist in employment law under Proclamation 1156/2019, workplace grievance mediation, and tenancy disputes.',
      avatarInitials: 'TB',
    },
    {
      id: 'adv-3',
      name: 'Advocate Dawit Tesfaye',
      title: 'Property & Real Estate Counsel',
      experience: '15 yrs exp',
      rating: 4.92,
      reviews: 521,
      hourlyRate: 1800,
      location: 'Addis Ababa / Hawassa',
      languages: ['Amharic', 'English'],
      bio: 'Over 15 years practicing land rights verification (ካርታ), title transfers at sub-city land bureaus, and commercial lease contracts.',
      avatarInitials: 'DT',
    }
  ];

  // Voice Recording Engine
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
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
    } catch (err) {
      alert('Microphone access denied. You can type your brief in the text box below.');
      setIntakeMode('text');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const clearVoiceRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setRecordingSeconds(0);
  };

  // Final Consultation Submission
  const handleFinalConfirm = async () => {
    if (!clientName.trim() || clientPhone.trim().length < 9) {
      alert('Please provide your name and a valid Ethiopian phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      let uploadedVoiceUrl: string | null = null;

      if (audioBlob) {
        const audioPath = `voice-notes/${Date.now()}_brief.webm`;
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

      const description = situationText.trim() || (audioBlob ? '🎙️ [Client Audio Brief Attached]' : 'Consultation requested via LegalLink Match');

      const { error } = await supabase.from('consultations').insert([
        {
          client_name: clientName.trim(),
          practice_area: selectedCategory,
          location: location,
          situation_description: `${description} • Budget: ${budgetRange} • Urgency: ${urgency} • Language: ${language}`,
          budget_range: budgetRange,
          urgency: urgency,
          status: 'pending',
          payment_status: 'free_promotional',
          escrow_amount: selectedAdvocate?.hourlyRate || 1500,
          case_stage: 1,
          voice_note_url: uploadedVoiceUrl
        }
      ]);

      if (error) throw error;
      setBookingConfirmed(true);
    } catch (err: any) {
      alert('Failed to register consultation: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans flex flex-col">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink Logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-black text-xl tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[10px] block font-bold text-slate-400 tracking-widest uppercase">
                Ethiopia's Legal Marketplace
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/find-a-lawyer" className="text-[#0A1128] font-bold">Find a Lawyer</Link>
            <Link href="/for-lawyers" className="hover:text-[#0A1128]">For Lawyers</Link>
            <Link href="/#legaltalk" className="hover:text-[#0A1128]">LegalTalk</Link>
            <Link href="/#lexdraft" className="hover:text-[#0A1128]">LexDraft</Link>
            <Link href="/#about" className="hover:text-[#0A1128]">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/advocate"
              className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* 2. PROGRESS STEPPER & BREADCRUMBS */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-medium">Find a Lawyer</span>
          </div>

          {/* Stepper Bar */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold overflow-x-auto pb-2 sm:pb-0">
            {/* Step 1 */}
            <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-[#0A1128]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > 1 ? 'bg-[#0A1128] text-white' : currentStep === 1 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </span>
              <span>Category</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Step 2 */}
            <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#0A1128]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > 2 ? 'bg-[#0A1128] text-white' : currentStep === 2 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </span>
              <span>Preferences</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Step 3 */}
            <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-[#0A1128]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep > 3 ? 'bg-[#0A1128] text-white' : currentStep === 3 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 3 ? '✓' : '3'}
              </span>
              <span>Match</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Step 4 */}
            <div className={`flex items-center gap-2 ${currentStep === 4 ? 'text-[#0A1128]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                bookingConfirmed ? 'bg-emerald-600 text-white' : currentStep === 4 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {bookingConfirmed ? '✓' : '4'}
              </span>
              <span>Confirm</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. WIZARD CONTENT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* ==================================================== */}
        {/* STEP 1: CATEGORY SELECTION */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
                What do you need help with?
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select the practice area that best describes your legal matter.
              </p>
            </div>

            {/* 8 Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0A1128] ring-2 ring-[#0A1128]/10 bg-slate-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="text-3xl block mb-3">{cat.icon}</span>
                      <h3 className="font-bold text-sm text-[#0A1128]">{cat.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-[#0A1128] text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Step 1 of 4</span>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 2: PREFERENCES SELECTION */}
        {/* ==================================================== */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
                Tell us your preferences
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Help us find the right match for your situation.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              
              {/* Preferred Location */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Preferred location</label>
                <div className="flex flex-wrap gap-2">
                  {locations.map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                        location === loc
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Language */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Consultation language</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lng) => (
                    <button
                      type="button"
                      key={lng}
                      onClick={() => setLanguage(lng)}
                      className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                        language === lng
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lng}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Budget range</label>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudgetRange(b)}
                      className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                        budgetRange === b
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* How soon do you need help? */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">How soon do you need help?</label>
                <div className="flex flex-wrap gap-2">
                  {urgencyOptions.map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUrgency(u)}
                      className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                        urgency === u
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Situation Description + Voice Brief Intake */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-700">
                    Briefly describe your situation <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  
                  {/* Text / Voice Intake Toggle */}
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setIntakeMode('text')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        intakeMode === 'text' ? 'bg-[#0A1128] text-white shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Type Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntakeMode('voice')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                        intakeMode === 'voice' ? 'bg-[#0A1128] text-amber-400 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <Mic className="w-3 h-3" />
                      <span>Voice Note</span>
                    </button>
                  </div>
                </div>

                {intakeMode === 'voice' ? (
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3">
                    {isRecording ? (
                      <div className="space-y-2">
                        <span className="text-red-600 font-bold animate-pulse block">
                          Recording in progress... {recordingSeconds}s / 60s
                        </span>
                        <button
                          type="button"
                          onClick={stopVoiceRecording}
                          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 mx-auto cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5 fill-white" />
                          <span>Stop Recording</span>
                        </button>
                      </div>
                    ) : audioPreviewUrl ? (
                      <div className="space-y-2 max-w-sm mx-auto">
                        <span className="text-emerald-700 font-bold block text-xs">
                          ✓ Voice brief recorded ({recordingSeconds}s)
                        </span>
                        <audio controls src={audioPreviewUrl} className="w-full h-8" />
                        <button
                          type="button"
                          onClick={clearVoiceRecording}
                          className="text-xs text-red-600 hover:underline cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete & record again</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-sm"
                        >
                          <Mic className="w-4 h-4 text-amber-400" />
                          <span>Tap to Record Voice Brief (ድምፅ ይቅረጹ)</span>
                        </button>
                        <p className="text-[11px] text-slate-400">
                          Speak in Amharic or English (up to 60 seconds).
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={situationText}
                      onChange={(e) => setSituationText(e.target.value)}
                      placeholder="E.g. I need help reviewing a commercial lease agreement for my new office in Bole..."
                      className="w-full p-4 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1128] leading-relaxed"
                    />
                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      {situationText.length}/500
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-slate-600 hover:text-[#0A1128] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAdvocate(availableAdvocates[0]);
                  setCurrentStep(3);
                }}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Find Matches</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 3: ADVOCATE MATCH SELECTION */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
                Available Advocates in {location}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Found 3 verified counsel specializing in {selectedCategory}.
              </p>
            </div>

            <div className="space-y-4">
              {availableAdvocates.map((adv) => {
                const isSelected = selectedAdvocate?.id === adv.id;
                return (
                  <div
                    key={adv.id}
                    onClick={() => setSelectedAdvocate(adv)}
                    className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs ${
                      isSelected
                        ? 'border-[#0A1128] ring-2 ring-[#0A1128]/10 bg-slate-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-base flex-shrink-0 shadow-sm">
                        {adv.avatarInitials}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-[#0A1128]">{adv.name}</h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            MOJ Verified
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">{adv.title}</p>

                        <div className="flex items-center gap-3 text-xs pt-1">
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {adv.rating}
                            <span className="text-slate-400 font-normal">({adv.reviews})</span>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{adv.experience}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-medium">{adv.location}</span>
                        </div>

                        <p className="text-xs text-slate-600 max-w-xl pt-2 leading-relaxed">
                          {adv.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Retainer</span>
                        <strong className="text-base font-black text-[#0A1128]">ETB {adv.hourlyRate}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAdvocate(adv);
                          setCurrentStep(4);
                        }}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                            : 'bg-[#0A1128] text-white hover:bg-[#102A43]'
                        }`}
                      >
                        {isSelected ? 'Proceed with Counsel' : 'Select Counsel'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 text-slate-600 hover:text-[#0A1128] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 4: CONFIRM & SUBMIT */}
        {/* ==================================================== */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
                Confirm consultation
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review your consultation details and confirm your advocate brief.
              </p>
            </div>

            {bookingConfirmed ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-emerald-900">Consultation Scheduled!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  Your legal brief has been dispatched to <strong>{selectedAdvocate?.name}</strong>. You will receive an SMS confirmation with your secure room link shortly.
                </p>
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-xs hover:bg-[#102A43]"
                  >
                    Return to Marketplace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-xs">
                
                {/* Summary Card */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200/60">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Selected Practice Area</span>
                      <h4 className="font-black text-base text-[#0A1128]">{selectedCategory}</h4>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[10px]">
                      {urgency}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Advocate</span>
                      <strong className="text-slate-900">{selectedAdvocate?.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Jurisdiction & Location</span>
                      <strong className="text-slate-900">{location}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Consultation Language</span>
                      <strong className="text-slate-900">{language}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Retainer</span>
                      <strong className="text-emerald-700 font-mono font-bold">ETB {selectedAdvocate?.hourlyRate || 1500}</strong>
                    </div>
                  </div>

                  {audioPreviewUrl && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-purple-900 uppercase block mb-1">
                        Attached Voice Brief (ድምፅ):
                      </span>
                      <audio controls src={audioPreviewUrl} className="w-full h-8" />
                    </div>
                  )}
                </div>

                {/* Client Contact Details Input */}
                <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-200">
                  <h4 className="font-bold text-sm text-[#0A1128]">Your Contact Details</h4>
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Bethlehem Desta"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Number (Telebirr) *</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+251 91 234 5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#0A1128]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Used for SMS hearing reminders and Telebirr escrow push authentication.
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 text-slate-600 hover:text-[#0A1128] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalConfirm}
                    className="px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Confirming Brief...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Schedule Consultation</span>
                        <ArrowRight className="w-4 h-4 text-amber-400" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. FOOTER (Matching Prototype) */}
      <footer className="bg-[#0A1128] text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-black text-white">Legal<span className="text-amber-400">Link</span></span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Ethiopia's first freelance legal services marketplace. Connecting clients with verified Ethiopian counsel for consultations, dispute resolution, and document automation.
            </p>
            <span className="text-slate-400 block pt-1">hello@legallink.et • +251 911 000 000</span>
            <span className="text-slate-400 block">Bole Road, Addis Ababa, Ethiopia</span>
          </div>

          <div>
            <strong className="text-white block uppercase tracking-wider text-[11px] mb-3">Platform</strong>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/find-a-lawyer" className="hover:text-white">Find a Lawyer</Link></li>
              <li><Link href="/for-lawyers" className="hover:text-white">For Lawyers</Link></li>
              <li><Link href="/#legaltalk" className="hover:text-white">LegalTalk</Link></li>
              <li><Link href="/#lexdraft" className="hover:text-white">LexDraft</Link></li>
            </ul>
          </div>

          <div>
            <strong className="text-white block uppercase tracking-wider text-[11px] mb-3">Company</strong>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/#about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/for-lawyers#faqs" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/advocate" className="hover:text-white">Advocate Portal</Link></li>
            </ul>
          </div>
        </div>
      </footer>

    </div>
  );
}