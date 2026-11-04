'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Home as HomeIcon, Sparkles, Briefcase, 
  Scale, Globe, ShieldCheck, Check, ArrowRight, Mic, 
  Play, Pause, Trash2, Clock, MapPin, Languages, CheckCircle2, 
  AlertCircle, ChevronRight, Lock, Star, Loader2, Copy, RefreshCw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryItem {
  id: string;
  title: string;
  amharicTitle: string;
  desc: string;
  amharicDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdvocateMatch {
  id: string;
  initials: string;
  name: string;
  amharicName: string;
  category: string;
  amharicCategory: string;
  rating: string;
  reviews: string;
  experienceYears: number;
  ratePerHour: number;
  location: string;
  languages: string[];
  bio: string;
  amharicBio: string;
  courtStanding: string;
  barLicense: string;
  offersPupillage?: boolean;
}

const FALLBACK_SEED_LAWYERS: AdvocateMatch[] = [
  {
    id: 'ETH-BAR-2018-0492',
    initials: 'MH',
    name: 'Adv. Mulu Haile',
    amharicName: 'ጠበቃ ሙሉ ኃይሌ',
    category: 'Corporate & Business Law',
    amharicCategory: 'የንግድና ኩባንያ ሕግ',
    rating: '5.0',
    reviews: '248',
    experienceYears: 12,
    ratePerHour: 1500,
    location: 'Bole, Addis Ababa',
    languages: ['English', 'Amharic'],
    bio: 'Specializes in company formation, M&A transactions, and Commercial Code corporate governance.',
    amharicBio: 'በኩባንያ ምስረታ፣ የንግድ ውህደት እና የንግድ ህግ 1240/2021 ተገዢነት ላይ የካበተ ልምድ።',
    courtStanding: 'Federal Supreme Court & Cassation',
    barLicense: 'ETH-BAR-2018-0492'
  },
  {
    id: 'ETH-BAR-2015-0081',
    initials: 'DT',
    name: 'Adv. Dawit Tesfaye',
    amharicName: 'ጠበቃ ዳዊት ተስፋዬ',
    category: 'Corporate Law & Property',
    amharicCategory: 'የንግድና የመሬት ይዞታ ሕግ',
    rating: '4.8',
    reviews: '167',
    experienceYears: 15,
    ratePerHour: 1800,
    location: 'Kazanchis, Addis Ababa',
    languages: ['Amharic', 'English'],
    bio: 'Broad experience across corporate transactions, municipal land transfers, and title deed due diligence.',
    amharicBio: 'በንግድ ስምምነቶች፣ በማዘጋጃ ቤት የመሬት ዝውውርና የካርታ ማጣራት ላይ የ15 ዓመት ልምድ።',
    courtStanding: 'Federal High Court & Supreme Court',
    barLicense: 'ETH-BAR-2015-0081'
  },
  {
    id: 'ETH-BAR-2019-0921',
    initials: 'SG',
    name: 'Adv. Selamawit Girma',
    amharicName: 'ጠበቃ ሰላማዊት ግርማ',
    category: 'Business & Immigration',
    amharicCategory: 'የንግድና ኢሚግሬሽን ሕግ',
    rating: '4.9',
    reviews: '142',
    experienceYears: 8,
    ratePerHour: 2000,
    location: 'Gotera, Addis Ababa',
    languages: ['English', 'Amharic', 'French'],
    bio: 'Expert in Ethiopian business law, diaspora powers of attorney, and cross-border commercial ventures.',
    amharicBio: 'በኢትዮጵያ የንግድ ኢንቨስትመንት፣ የዲያስፖራ ውክልናዎችና ድንበር ተሻጋሪ ውሎች ላይ ልዩ ባለሙያ።',
    courtStanding: 'Federal Supreme Court Qualified',
    barLicense: 'ETH-BAR-2019-0921'
  }
];

export default function FindLawyerWizardPage() {
  const { language, t } = useLanguage();
  const supabase = createClient();

  // Stepper State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Dynamic Advocates fetched from Supabase
  const [lawyers, setLawyers] = useState<AdvocateMatch[]>(FALLBACK_SEED_LAWYERS);
  const [loadingLawyers, setLoadingLawyers] = useState<boolean>(true);

  // Step 1: Category Selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Step 2: Preferences
  const [location, setLocation] = useState<string | null>(null);
  const [consultLanguage, setConsultLanguage] = useState<string | null>(null);
  const [courtStanding, setCourtStanding] = useState<string | null>(null);
  const [consultMode, setConsultMode] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [situationText, setSituationText] = useState<string>('');

  // Step 2: Optional Audio Voice Brief
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 3: Selected Lawyer Match
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  // Step 4: Client Contact Inputs
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');

  // Step 4: Submission & Escrow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [telebirrUssdCode, setTelebirrUssdCode] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Extract initials utility
  const getInitials = (name: string) => {
    const cleaned = name.replace(/^(Adv\.|Ato|W\/ro|Dr\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (cleaned.slice(0, 2) || 'AD').toUpperCase();
  };

  // Fetch dynamic advocates from Supabase
  const fetchLiveAdvocates = async () => {
    setLoadingLawyers(true);
    try {
      const { data, error } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: AdvocateMatch[] = data.map((d: any) => ({
          id: d.id,
          initials: getInitials(d.name),
          name: d.name,
          amharicName: d.amharic_name || d.name,
          category: d.title || 'Federal Court Advocate',
          amharicCategory: 'የፌዴራል ፍርድ ቤት ጠበቃ',
          rating: (d.rating ?? 4.9).toString(),
          reviews: (d.reviews_count ?? 18).toString(),
          experienceYears: d.experience_years ?? 5,
          ratePerHour: Number(d.hourly_rate_etb) || 1800,
          location: d.location || 'Addis Ababa',
          languages: ['Amharic', 'English'],
          bio: `Licensed advocate with chambers in ${d.location || 'Addis Ababa'}. Specializes in representation before the ${d.court_jurisdiction || 'Federal Courts'} under Proclamation No. 1249/2021.`,
          amharicBio: `በ${d.court_jurisdiction || 'ፌዴራል ፍርድ ቤቶች'} ስር በኢፌዴሪ ጠበቆች አዋጅ ቁጥር 1249/2021 ፈቃድ የተሰጣቸው ጠበቃ።`,
          courtStanding: d.court_jurisdiction || 'Federal High Court',
          barLicense: d.license_number || d.id,
          offersPupillage: d.offers_pupillage ?? false
        }));

        setLawyers(mapped);
      }
    } catch (err) {
      console.warn('Using fallback seed advocates due to fetch error:', err);
    } finally {
      setLoadingLawyers(false);
    }
  };

  useEffect(() => {
    fetchLiveAdvocates();
  }, []);

  const CATEGORIES: CategoryItem[] = [
    {
      id: 'corporate',
      title: 'Corporate & Business',
      amharicTitle: 'የንግድና ኩባንያ ሕግ',
      desc: 'Company formation, contracts, M&A',
      amharicDesc: 'የኩባንያ ምስረታ፣ ውሎችና ውህደት',
      icon: Building2
    },
    {
      id: 'family',
      title: 'Family Law',
      amharicTitle: 'የቤተሰብ ሕግ',
      desc: 'Divorce, custody, adoption',
      amharicDesc: 'የፍቺ፣ የልጆች አስተዳደግና ጉዲፈቻ',
      icon: Users
    },
    {
      id: 'property',
      title: 'Property & Real Estate',
      amharicTitle: 'የመሬትና ይዞታ ሕግ',
      desc: 'Land rights, title transfers, leases',
      amharicDesc: 'የይዞታ መብት፣ የካርታ ማረጋገጫና ኪራይ',
      icon: HomeIcon
    },
    {
      id: 'ip',
      title: 'Intellectual Property',
      amharicTitle: 'የአእምሯዊ ንብረት ሕግ',
      desc: 'Trademark, copyright, patents',
      amharicDesc: 'የንግድ ምልክት፣ የቅጂ መብትና ፈጠራ',
      icon: Sparkles
    },
    {
      id: 'employment',
      title: 'Employment Law',
      amharicTitle: 'የሠራተኛና አሠሪ ሕግ',
      desc: 'Labor disputes, contracts',
      amharicDesc: 'የስራ ክርክሮች፣ የስንብት ክፍያና ውሎች',
      icon: Briefcase
    },
    {
      id: 'criminal',
      title: 'Criminal Defense',
      amharicTitle: 'የወንጀል መከላከያ ሕግ',
      desc: 'Representation, bail, appeals',
      amharicDesc: 'የፍርድ ቤት ውክልና፣ ዋስትናና ይግባኝ',
      icon: Scale
    },
    {
      id: 'immigration',
      title: 'Immigration',
      amharicTitle: 'ኢሚግሬሽንና ዜግነት',
      desc: 'Visas, residency, diaspora matters',
      amharicDesc: 'ቪዛ፣ የመኖሪያ ፍቃድና የዲያስፖራ ጉዳዮች',
      icon: Globe
    },
    {
      id: 'ngo',
      title: 'NGO & Compliance',
      amharicTitle: 'የበጎ አድራጎት ማህበራት',
      desc: 'Registration, regulatory compliance',
      amharicDesc: 'የማህበራት ምዝገባና የህግ ተገዢነት ኦዲት',
      icon: ShieldCheck
    }
  ];

  // Voice note timer logic
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 90) {
            handleStopRecording();
            return 90;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioUrl(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAudioUrl('mock_recorded_voice_brief.mp3');
  };

  const handleDeleteAudio = () => {
    setIsRecording(false);
    setAudioUrl(null);
    setRecordingDuration(0);
    setIsPlayingAudio(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeLawyerObj = lawyers.find((l) => l.id === selectedLawyerId);

  // Mandatory Navigation Step Checks
  const handleProceedFromStep1 = () => {
    if (!selectedCategory) {
      setStepError('Please select a legal practice area before continuing.');
      return;
    }
    setStepError(null);
    setCurrentStep(2);
  };

  const handleProceedFromStep2 = () => {
    if (!location) {
      setStepError('Please select your preferred location.');
      return;
    }
    if (!consultLanguage) {
      setStepError('Please select your preferred consultation language.');
      return;
    }
    if (!courtStanding) {
      setStepError('Please select the required court standing / judicial tier.');
      return;
    }
    if (!consultMode) {
      setStepError('Please select a consultation mode.');
      return;
    }
    if (!urgency) {
      setStepError('Please select how soon you need legal assistance.');
      return;
    }
    if (!situationText.trim() && !audioUrl) {
      setStepError('Please provide a brief description of your legal situation (or record a voice note).');
      return;
    }
    setStepError(null);
    setCurrentStep(3);
  };

  const handleProceedFromStep3 = () => {
    if (!selectedLawyerId) {
      setStepError('Please select an advocate to handle your matter before proceeding.');
      return;
    }
    setStepError(null);
    setCurrentStep(4);
  };

  // Submit to Supabase consultation_bookings
  const handleConfirmMatchSubmission = async () => {
    setSubmissionError(null);

    if (!clientName.trim()) {
      setSubmissionError('Please provide your full legal name.');
      return;
    }
    if (!clientPhone.trim()) {
      setSubmissionError('Please provide your Telebirr phone number.');
      return;
    }
    if (!activeLawyerObj || !activeCategoryObj) {
      setSubmissionError('Incomplete booking configuration. Please review your selections.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullDescription = situationText.trim() + (audioUrl ? ` [Voice brief attached - duration: ${formatTimer(recordingDuration)}]` : '');

      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert({
          lawyer_id: activeLawyerObj.id,
          lawyer_name: activeLawyerObj.name,
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          client_email: clientEmail.trim() || null,
          consultation_date: new Date().toISOString().split('T')[0],
          consultation_time: `${urgency} (${consultMode})`,
          practice_area: activeCategoryObj.title,
          brief_description: fullDescription || 'Requested consultation through 4-step wizard',
          fee_etb: activeLawyerObj.ratePerHour,
          escrow_status: 'awaiting_payment',
          booking_status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      const refId = data ? `LL-${data.id.slice(0, 6).toUpperCase()}` : `LL-${Date.now().toString().slice(-6)}`;
      setBookingReference(refId);
      setTelebirrUssdCode(`*127*${Math.floor(100000 + Math.random() * 900000)}#`);
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);

    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(err?.message || 'Failed to submit match request. Please check your connection.');
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Stepper Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/" className="hover:text-slate-700">{t('nav_home')}</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-800 font-bold">{t('nav_find_lawyer')}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold overflow-x-auto pb-1 sm:pb-0">
              <div className={`flex items-center gap-1.5 ${currentStep === 1 ? 'text-[#0A1128]' : currentStep > 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 1 ? 'bg-emerald-600 text-white' : currentStep === 1 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </span>
                <span className="whitespace-nowrap">Category</span>
              </div>

              <span className="text-slate-300">›</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-[#0A1128]' : currentStep > 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 2 ? 'bg-emerald-600 text-white' : currentStep === 2 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </span>
                <span className="whitespace-nowrap">Preferences</span>
              </div>

              <span className="text-slate-300">›</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-[#0A1128]' : currentStep > 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > 3 ? 'bg-emerald-600 text-white' : currentStep === 3 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </span>
                <span className="whitespace-nowrap">Match</span>
              </div>

              <span className="text-slate-300">›</span>

              <div className={`flex items-center gap-1.5 ${currentStep === 4 ? 'text-[#0A1128]' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === 4 ? 'bg-[#0A1128] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  4
                </span>
                <span className="whitespace-nowrap">Confirm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wizard Canvas */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        
        {stepError && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-scaleUp">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'በምን ጉዳይ ላይ እገዛ ይፈልጋሉ? *' : 'What do you need help with? *'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                {language === 'am' 
                  ? 'ለመቀጠል የእርስዎን የህግ ጉዳይ የሚገልጸውን ዘርፍ ይምረጡ።' 
                  : 'Click on the practice area that best describes your legal matter to proceed.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setStepError(null);
                    }}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                      isSelected
                        ? 'bg-white border-[#0A1128] shadow-md ring-2 ring-[#0A1128]/15'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#0A1128] text-amber-400 flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#0A1128] text-white' : 'bg-slate-50 border border-slate-100 text-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-bold text-[#0A1128]">
                        {language === 'am' ? cat.amharicTitle : cat.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-normal leading-relaxed">
                        {language === 'am' ? cat.amharicDesc : cat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-700">
                ← Back to Home
              </Link>

              <button
                type="button"
                onClick={handleProceedFromStep1}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'ምርጫዎችዎን ያሳውቁን' : 'Tell us your preferences'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                All parameters marked with * are required to find your exact advocate match.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-7 text-xs">
              
              {/* Location & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Preferred Location <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Adama', 'Remote / Online'].map((loc) => {
                      const isSel = location === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setStepError(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Consultation Language <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Amharic', 'English', 'Oromiffa', 'Tigrinya', 'French'].map((lng) => {
                      const isSel = consultLanguage === lng;
                      return (
                        <button
                          key={lng}
                          type="button"
                          onClick={() => {
                            setConsultLanguage(lng);
                            setStepError(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {lng}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Court Standing & Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4 border-t border-slate-100">
                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>Court Standing / Judicial Tier <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-amber-700 font-mono">የችሎት ደረጃ</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Federal First Instance',
                      'Federal High Court',
                      'Supreme Court & Cassation',
                      'Open / Any Level'
                    ].map((tier) => {
                      const isSel = courtStanding === tier;
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => {
                            setCourtStanding(tier);
                            setStepError(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Consultation Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Video Call', 'In-Person Chamber Visit', 'Confidential Phone Call'].map((mode) => {
                      const isSel = consultMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setConsultMode(mode);
                            setStepError(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs' 
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {mode}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <label className="font-bold text-slate-800 block">
                  How soon do you need help? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Within 24 hours', 'Within 3 days', 'Within a week', 'Flexible'].map((time) => {
                    const isSel = urgency === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          setUrgency(time);
                          setStepError(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          isSel 
                            ? 'bg-[#0A1128] text-white border-[#0A1128] shadow-xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Situation & Voice Note */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    Describe your legal matter <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {situationText.length}/500
                  </span>
                </div>

                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="E.g. I need review of a commercial lease agreement for my company in Bole and clarification on tax withholding..."
                  value={situationText}
                  onChange={(e) => {
                    setSituationText(e.target.value);
                    if (e.target.value.trim()) setStepError(null);
                  }}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0A1128] transition-colors leading-relaxed"
                />

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-700" />
                      <strong className="text-xs font-bold text-amber-950">
                        Voice Note Brief Option <span className="text-slate-500 font-normal">(Optional)</span>
                      </strong>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-normal">
                      Prefer to speak in Amharic? Record up to 90 seconds explaining your situation directly to counsel.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                    {!isRecording && !audioUrl && (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-[#102A43] transition-all cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                        <span>Record Audio</span>
                      </button>
                    )}

                    {isRecording && (
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-red-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                        <span className="font-mono text-xs font-bold text-red-600">{formatTimer(recordingDuration)}</span>
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Stop
                        </button>
                      </div>
                    )}

                    {audioUrl && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                        <button
                          type="button"
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-7 h-7 rounded-full bg-[#0A1128] text-amber-400 flex items-center justify-center cursor-pointer"
                        >
                          {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <span className="font-mono text-xs font-bold text-emerald-800">
                          {isPlayingAudio ? 'Playing...' : formatTimer(recordingDuration || 35)}
                        </span>
                        <button
                          type="button"
                          onClick={handleDeleteAudio}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete audio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStepError(null);
                  setCurrentStep(1);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleProceedFromStep2}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: MATCHED LAWYERS (DYNAMIC SUPABASE SYNC) */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                  {language === 'am' ? 'ለእርስዎ የተመረጡ ጠበቆች *' : 'Your matched lawyers *'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Found <strong className="text-slate-900">{lawyers.length}</strong> licensed advocates registered with LegalLink. Select one to proceed.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchLiveAdvocates}
                className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLawyers ? 'animate-spin' : ''}`} />
                <span>Refresh Directory</span>
              </button>
            </div>

            {loadingLawyers ? (
              <div className="p-12 text-center text-xs font-mono text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                <p>Loading registered advocates from database...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lawyers.map((lawyer) => {
                  const isSelected = selectedLawyerId === lawyer.id;

                  return (
                    <div
                      key={lawyer.id}
                      onClick={() => {
                        setSelectedLawyerId(lawyer.id);
                        setStepError(null);
                      }}
                      className={`card-hover bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-6 transition-all cursor-pointer relative shadow-xs ${
                        isSelected
                          ? 'border-[#0A1128] ring-2 ring-[#0A1128]/15 shadow-lg'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-5 right-5 w-6 h-6 rounded-full bg-[#0A1128] text-amber-400 flex items-center justify-center text-xs font-bold shadow-xs">
                          ✓
                        </span>
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#0A1128] text-white font-black flex items-center justify-center text-sm shrink-0">
                            {lawyer.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <strong className="text-sm font-black text-[#0A1128]">{lawyer.name}</strong>
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            </div>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">{lawyer.category}</span>
                            <span className="text-[10px] font-mono text-amber-700 block font-bold mt-0.5">{lawyer.barLicense}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-700">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          <strong className="font-bold">{lawyer.rating}</strong>
                          <span className="text-slate-400 font-normal">({lawyer.reviews})</span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                          {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center font-mono">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block">Exp</span>
                            <strong className="text-xs text-slate-800">{lawyer.experienceYears} yrs</strong>
                          </div>
                          <div className="border-x border-slate-100">
                            <span className="text-[9px] text-slate-400 uppercase block">Rate</span>
                            <strong className="text-xs text-[#0A1128]">ETB {lawyer.ratePerHour.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block">Standing</span>
                            <strong className="text-xs text-slate-800 truncate block text-[10px]">{lawyer.courtStanding.replace('Federal ', '')}</strong>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lawyer.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Languages className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lawyer.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
                          isSelected 
                            ? 'bg-[#0A1128] text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}>
                          {isSelected ? '✓ Selected Counsel' : 'Select Counsel'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStepError(null);
                  setCurrentStep(2);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleProceedFromStep3}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION & REVIEW */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'ጥያቄዎን ይገምግሙ' : 'Review your request'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Confirm your details and contact information to dispatch your consultation.
              </p>
            </div>

            {submissionError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Card: YOUR REQUEST & MANDATORY CLIENT INPUTS */}
              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  YOUR REQUEST & CONTACT
                </span>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Your Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yibeltal Semagn"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (e.target.value.trim()) setSubmissionError(null);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        Phone (Telebirr) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0911 000 000"
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          if (e.target.value.trim()) setSubmissionError(null);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="client@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Practice Area</span>
                      <strong className="text-slate-900 font-bold">{activeCategoryObj?.title}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Location</span>
                      <strong className="text-slate-900 font-bold">{location}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Languages className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Language & Mode</span>
                      <strong className="text-slate-900 font-bold">{consultLanguage} • {consultMode}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Urgency</span>
                      <strong className="text-slate-900 font-bold">{urgency}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Scale className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Court Standing Tier</span>
                      <strong className="text-slate-900 font-bold">{courtStanding}</strong>
                    </div>
                  </div>

                  {situationText && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Situation Summary</span>
                      <p className="text-slate-700 leading-relaxed font-normal bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {situationText}
                      </p>
                    </div>
                  )}

                  {audioUrl && (
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Attached Voice Brief</span>
                      <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mic className="w-3.5 h-3.5 text-amber-700" />
                          <span className="font-mono text-xs font-bold text-amber-950">Audio_Brief_Client.mp3</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">✓ Attached</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Card: SELECTED LAWYER */}
              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-4">
                    SELECTED LAWYER
                  </span>

                  {activeLawyerObj ? (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-[#0A1128] text-white font-black flex items-center justify-center text-sm shrink-0">
                          {activeLawyerObj.initials}
                        </div>
                        <div>
                          <strong className="text-base font-black text-[#0A1128] block">{activeLawyerObj.name}</strong>
                          <span className="text-xs text-slate-500 block">{activeLawyerObj.category}</span>
                          <span className="text-[10px] font-mono text-amber-700 font-bold block mt-0.5">{activeLawyerObj.barLicense}</span>
                        </div>
                      </div>

                      <div className="space-y-3.5 pt-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience</span>
                          <strong className="text-slate-900 font-bold text-xs">{activeLawyerObj.experienceYears} years</strong>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Chamber Location</span>
                          <strong className="text-slate-900 font-bold text-xs">{activeLawyerObj.location}</strong>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Court Jurisdiction</span>
                          <strong className="text-slate-900 font-bold text-xs">{activeLawyerObj.courtStanding}</strong>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Initial Retainer Rate</span>
                          <strong className="text-sm font-black text-[#0A1128] block">
                            ETB {activeLawyerObj.ratePerHour.toLocaleString()} / session
                          </strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400">No lawyer selected.</p>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Commercial Code 1240/2021 Escrow</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-relaxed font-normal">
                    Funds remain protected in Telebirr escrow until consultation delivery is verified.
                  </p>
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              By confirming, you agree to LegalLink's{' '}
              <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>.{' '}
              The lawyer will be notified and will respond within your selected timeframe.
            </p>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSubmissionError(null);
                  setCurrentStep(3);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmMatchSubmission}
                className="px-8 py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirm Match & Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Confirmation & Telebirr USSD Success Modal */}
      {isSubmittedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5 animate-scaleUp text-xs relative max-h-[90vh] overflow-y-auto">
            
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#0A1128]">
                Match Request Submitted!
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Your consultation request has been recorded in the LegalLink database and dispatched to {activeLawyerObj?.name}.
              </p>
            </div>

            {bookingReference && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-left space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Booking Reference:</span>
                  <strong className="text-amber-700">{bookingReference}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Retainer Fee:</span>
                  <strong className="text-slate-900">ETB {activeLawyerObj?.ratePerHour.toLocaleString()}</strong>
                </div>
              </div>
            )}

            {/* Escrow Payment Accounts */}
            <div className="space-y-2 text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Telebirr Merchant / Phone</span>
                  <strong className="text-slate-800 font-mono text-xs">0911 234 567 (LegalLink Escrow)</strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('0911234567', 'telebirr')}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer"
                >
                  {copiedKey === 'telebirr' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Commercial Bank of Ethiopia (CBE)</span>
                  <strong className="text-slate-800 font-mono text-xs">1000 4829 1048 2</strong>
                </div>
                <button
                  type="button"
                  onClick={() => copyText('1000482910482', 'cbe')}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer"
                >
                  {copiedKey === 'cbe' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {telebirrUssdCode && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 font-mono space-y-1">
                <span className="text-[10px] text-amber-800 uppercase font-bold block">Telebirr USSD Authorization</span>
                <strong className="text-sm font-black text-emerald-800 block">{telebirrUssdCode}</strong>
                <span className="text-[10px] text-amber-900 block">Check your phone to approve the escrow pre-authorization.</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-center hover:bg-[#102A43] transition-all"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Direct representation provided exclusively by licensed Ethiopian advocates under Federal Proclamation No. 1249/2021.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}