'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  Users,
  Home as HomeIcon,
  Sparkles,
  Briefcase,
  Scale,
  Globe,
  ShieldCheck,
  Check,
  ArrowRight,
  Clock,
  MapPin,
  Languages,
  AlertCircle,
  ChevronRight,
  Star,
  Loader2,
  RefreshCw,
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
  location: string;
  languages: string[];
  bio: string;
  amharicBio: string;
  courtStanding: string;
  barLicense: string;
  isVerified: boolean;
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
    reviews: '24',
    experienceYears: 12,
    location: 'Bole, Addis Ababa',
    languages: ['English', 'Amharic'],
    bio: 'Specializes in company formation, M&A transactions, and Commercial Code corporate governance.',
    amharicBio: 'በኩባንያ ምስረታ፣ የንግድ ውህደት እና የንግድ ህግ 1243/2021 ተገዢነት ላይ የካበተ ልምድ።',
    courtStanding: 'Federal Supreme Court & Cassation',
    barLicense: 'ETH-BAR-2018-0492',
    isVerified: true,
  },
  {
    id: 'ETH-BAR-2015-0081',
    initials: 'DT',
    name: 'Adv. Dawit Tesfaye',
    amharicName: 'ጠበቃ ዳዊት ተስፋዬ',
    category: 'Corporate Law & Property',
    amharicCategory: 'የንግድና የመሬት ይዞታ ሕግ',
    rating: '4.9',
    reviews: '19',
    experienceYears: 15,
    location: 'Kazanchis, Addis Ababa',
    languages: ['Amharic', 'English'],
    bio: 'Broad experience across corporate transactions, municipal land transfers, and title deed due diligence.',
    amharicBio: 'በንግድ ስምምነቶች፣ በማዘጋጃ ቤት የመሬት ዝውውርና የካርታ ማጣራት ላይ የ15 ዓመት ልምድ።',
    courtStanding: 'Federal High Court & Supreme Court',
    barLicense: 'ETH-BAR-2015-0081',
    isVerified: true,
  },
  {
    id: 'ETH-BAR-2019-0921',
    initials: 'SG',
    name: 'Adv. Selamawit Girma',
    amharicName: 'ጠበቃ ሰላማዊት ግርማ',
    category: 'Business & Immigration',
    amharicCategory: 'የንግድና ኢሚግሬሽን ሕግ',
    rating: '4.9',
    reviews: '15',
    experienceYears: 8,
    location: 'Gotera, Addis Ababa',
    languages: ['English', 'Amharic', 'French'],
    bio: 'Expert in Ethiopian business law, diaspora powers of attorney, and cross-border commercial ventures.',
    amharicBio: 'በኢትዮጵያ የንግድ ኢንቨስትመንት፣ የዲያስፖራ ውክልናዎችና ድንበር ተሻጋሪ ውሎች ላይ ልዩ ባለሙያ።',
    courtStanding: 'Federal Supreme Court Qualified',
    barLicense: 'ETH-BAR-2019-0921',
    isVerified: true,
  },
];

function FindLawyerWizard() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  const [lawyers, setLawyers] = useState<AdvocateMatch[]>(FALLBACK_SEED_LAWYERS);
  const [loadingLawyers, setLoadingLawyers] = useState<boolean>(true);

  // Step 1
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Step 2
  const [location, setLocation] = useState<string | null>('Addis Ababa');
  const [consultLanguage, setConsultLanguage] = useState<string | null>('Amharic');
  const [courtStanding, setCourtStanding] = useState<string | null>('Open / Any Level');
  const [consultMode, setConsultMode] = useState<string | null>('Phone Call');
  const [urgency, setUrgency] = useState<string | null>('Within 3 days');
  const [situationText, setSituationText] = useState<string>('');

  // Step 3
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  // Step 4
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const CATEGORIES: CategoryItem[] = [
    {
      id: 'corporate',
      title: 'Corporate & Business',
      amharicTitle: 'የንግድና ኩባንያ ሕግ',
      desc: 'Company formation, contracts, M&A',
      amharicDesc: 'የኩባንያ ምስረታ፣ ውሎችና ውህደት',
      icon: Building2,
    },
    {
      id: 'family',
      title: 'Family Law',
      amharicTitle: 'የቤተሰብ ሕግ',
      desc: 'Divorce, custody, adoption, inheritance',
      amharicDesc: 'የፍቺ፣ የልጆች አስተዳደግና ውርስ',
      icon: Users,
    },
    {
      id: 'property',
      title: 'Property & Real Estate',
      amharicTitle: 'የመሬትና ይዞታ ሕግ',
      desc: 'Land rights, title transfers, leases',
      amharicDesc: 'የይዞታ መብት፣ የካርታ ማረጋገጫና ኪራይ',
      icon: HomeIcon,
    },
    {
      id: 'ip',
      title: 'Intellectual Property',
      amharicTitle: 'የአእምሯዊ ንብረት ሕግ',
      desc: 'Trademark, copyright, patents',
      amharicDesc: 'የንግድ ምልክት፣ የቅጂ መብትና ፈጠራ',
      icon: Sparkles,
    },
    {
      id: 'employment',
      title: 'Employment Law',
      amharicTitle: 'የሠራተኛና አሠሪ ሕግ',
      desc: 'Labor disputes, contracts, severance',
      amharicDesc: 'የስራ ክርክሮች፣ የስንብት ክፍያና ውሎች',
      icon: Briefcase,
    },
    {
      id: 'criminal',
      title: 'Criminal Defense',
      amharicTitle: 'የወንጀል መከላከያ ሕግ',
      desc: 'Representation, bail, appeals',
      amharicDesc: 'የፍርድ ቤት ውክልና፣ ዋስትናና ይግባኝ',
      icon: Scale,
    },
    {
      id: 'immigration',
      title: 'Immigration & Diaspora',
      amharicTitle: 'ኢሚግሬሽንና ዲያስፖራ',
      desc: 'Visas, residency, diaspora PoA',
      amharicDesc: 'ቪዛ፣ የመኖሪያ ፍቃድና የዲያስፖራ ውክልና',
      icon: Globe,
    },
    {
      id: 'ngo',
      title: 'NGO & Compliance',
      amharicTitle: 'የበጎ አድራጎት ማህበራት',
      desc: 'CSO registration, regulatory audits',
      amharicDesc: 'የማህበራት ምዝገባና የህግ ተገዢነት',
      icon: ShieldCheck,
    },
  ];

  // Auto-select category from URL query
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery && CATEGORIES.some((c) => c.id === categoryQuery)) {
      setSelectedCategory(categoryQuery);
    }
  }, [searchParams]);

  // Pre-fill signed-in client info so returning users don't retype everything
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const name = meta.full_name || meta.first_name || '';
        if (name) setClientName((prev) => prev || name);
        if (data.user.email) setClientEmail((prev) => prev || data.user.email || '');
        if (meta.phone) setClientPhone((prev) => prev || meta.phone);
      }
    });
  }, []);

  const getInitials = (name: string) => {
    const cleaned = name.replace(/^(Adv\.|Ato|W\/ro|Dr\.)\s+/i, '').trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (cleaned.slice(0, 2) || 'AD').toUpperCase();
  };

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
          rating: (d.rating ?? 5.0).toString(),
          reviews: (d.reviews_count ?? 0).toString(),
          experienceYears: d.experience_years ?? 5,
          location: d.location || 'Addis Ababa',
          languages: ['Amharic', 'English'],
          bio: `Licensed advocate based in ${d.location || 'Addis Ababa'}. Practices before the ${d.court_jurisdiction || 'Federal Courts'} under Proclamation No. 1249/2021.`,
          amharicBio: `በ${d.court_jurisdiction || 'ፌዴራል ፍርድ ቤቶች'} ስር በአዋጅ ቁጥር 1249/2021 ፈቃድ የተሰጣቸው ጠበቃ።`,
          courtStanding: d.court_jurisdiction || 'Federal High Court',
          barLicense: d.license_number || d.id,
          isVerified: Boolean(d.is_verified),
        }));
        setLawyers(mapped);
      }
    } catch {
      // Fall back cleanly to seed profiles
    } finally {
      setLoadingLawyers(false);
    }
  };

  useEffect(() => {
    fetchLiveAdvocates();
  }, []);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeLawyerObj = lawyers.find((l) => l.id === selectedLawyerId);

  const handleProceedFromStep1 = () => {
    if (!selectedCategory) {
      setStepError('Please select a legal practice area before continuing.');
      return;
    }
    setStepError(null);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromStep2 = () => {
    if (!location || !consultLanguage || !courtStanding || !consultMode || !urgency) {
      setStepError('Please select all consultation preferences marked with *.');
      return;
    }
    if (!situationText.trim() || situationText.trim().length < 15) {
      setStepError('Please describe your legal matter (at least 15 characters) so the advocate can prepare.');
      return;
    }
    setStepError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromStep3 = () => {
    if (!selectedLawyerId) {
      setStepError('Please select an advocate to receive your inquiry.');
      return;
    }
    setStepError(null);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmMatchSubmission = async () => {
    setSubmissionError(null);

    if (!clientName.trim()) {
      setSubmissionError('Please provide your full name.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 9) {
      setSubmissionError('Please provide a valid phone or WhatsApp number.');
      return;
    }
    if (!activeLawyerObj || !activeCategoryObj) {
      setSubmissionError('Incomplete request details. Please review your selections.');
      return;
    }

    setIsSubmitting(true);

    try {
      const refId = `LL-${Date.now().toString(36).toUpperCase().slice(-6)}`;

      const { error } = await supabase
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
          brief_description: situationText.trim(),
          fee_etb: 0,
          escrow_status: 'free_launch',
          booking_status: 'pending',
        });

      if (error) throw error;

      // Dispatch Telegram notification asynchronously (non-blocking)
      fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'consultation_booked',
          data: {
            reference: refId,
            client_name: clientName.trim(),
            lawyer_name: activeLawyerObj.name,
            practice_area: activeCategoryObj.title,
            urgency,
            mode: consultMode,
          },
        }),
      }).catch(() => {});

      setBookingReference(refId);
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(
        err?.message || 'Failed to submit consultation request. Please check your connection.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-slate-900">
                {t('nav_home')}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-bold">{t('nav_find_lawyer')}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold overflow-x-auto pb-1 sm:pb-0">
              {[
                { num: 1, label: 'Category' },
                { num: 2, label: 'Details' },
                { num: 3, label: 'Advocate' },
                { num: 4, label: 'Confirm' },
              ].map((s, idx) => (
                <React.Fragment key={s.num}>
                  {idx > 0 && <span className="text-slate-300">›</span>}
                  <div
                    className={`flex items-center gap-1.5 ${
                      currentStep === s.num
                        ? 'text-[#0A1128]'
                        : currentStep > s.num
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        currentStep > s.num
                          ? 'bg-emerald-600 text-white'
                          : currentStep === s.num
                          ? 'bg-[#0A1128] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep > s.num ? '✓' : s.num}
                    </span>
                    <span className="whitespace-nowrap">{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {stepError && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Free Direct Advocate Matching • No Platform Fee</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'በምን ጉዳይ ላይ እገዛ ይፈልጋሉ? *' : 'What legal area do you need help with? *'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                {language === 'am'
                  ? 'የእርስዎን የህግ ጉዳይ የሚገልጸውን ዘርፍ ይምረጡ።'
                  : 'Select the practice area that best describes your legal question.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setStepError(null);
                    }}
                    className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
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
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#0A1128] text-white'
                            : 'bg-slate-50 border border-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-sm font-bold text-[#0A1128]">
                        {language === 'am' ? cat.amharicTitle : cat.title}
                      </h3>

                      <p className="text-xs text-slate-600 font-normal leading-relaxed">
                        {language === 'am' ? cat.amharicDesc : cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-slate-900">
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

        {/* STEP 2: DETAILS & PREFERENCES */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'የምክክር ምርጫዎችዎን ይግለጹ' : 'Tell us your preferences'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Share how you prefer to meet and a concise summary of your matter.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-7 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Preferred Location <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Adama', 'Remote / Online'].map(
                      (loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setStepError(null);
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                            location === loc
                              ? 'bg-[#0A1128] text-white border-[#0A1128]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {loc}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Consultation Language <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Amharic', 'English', 'Afaan Oromo', 'Tigrigna', 'French'].map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => {
                          setConsultLanguage(lng);
                          setStepError(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          consultLanguage === lng
                            ? 'bg-[#0A1128] text-white border-[#0A1128]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-4 border-t border-slate-100">
                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 flex items-center justify-between">
                    <span>
                      Court Jurisdiction Tier <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[10px] text-amber-800 font-mono">የችሎት ደረጃ</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Open / Any Level',
                      'Federal First Instance',
                      'Federal High Court',
                      'Supreme Court & Cassation',
                    ].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => {
                          setCourtStanding(tier);
                          setStepError(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          courtStanding === tier
                            ? 'bg-[#0A1128] text-white border-[#0A1128]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="font-bold text-slate-800 block">
                    Consultation Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Phone Call', 'Video Call', 'In-Person Chamber Visit'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setConsultMode(mode);
                          setStepError(null);
                        }}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                          consultMode === mode
                            ? 'bg-[#0A1128] text-white border-[#0A1128]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <label className="font-bold text-slate-800 block">
                  How soon do you need help? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Within 24 hours', 'Within 3 days', 'Within a week', 'Flexible'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setUrgency(time);
                        setStepError(null);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        urgency === time
                          ? 'bg-[#0A1128] text-white border-[#0A1128]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 block">
                    Briefly describe your legal matter (Amharic or English) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {situationText.length}/600
                  </span>
                </div>

                <textarea
                  rows={4}
                  maxLength={600}
                  placeholder="E.g. I need legal advice on reviewing a commercial lease agreement in Bole, or guidance on registering a PLC..."
                  value={situationText}
                  onChange={(e) => {
                    setSituationText(e.target.value);
                    if (e.target.value.trim()) setStepError(null);
                  }}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#0A1128] transition-colors leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Tip: Share general facts only — save sensitive personal IDs or confidential files for your direct meeting with the advocate.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStepError(null);
                  setCurrentStep(1);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleProceedFromStep2}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>View Matching Advocates</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ADVOCATE SELECTION */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                  {language === 'am' ? 'ተስማሚ ጠበቃ ይምረጡ *' : 'Choose an advocate *'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-normal">
                  Showing <strong className="text-slate-900">{lawyers.length}</strong> registered Ethiopian advocates. Select one to send your free consultation request.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchLiveAdvocates}
                className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLawyers ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingLawyers ? (
              <div className="p-12 text-center text-xs font-mono text-slate-500 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-600" />
                <p>Loading advocate directory...</p>
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
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-sm font-black text-[#0A1128] truncate">
                                {lawyer.name}
                              </strong>
                              {lawyer.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-600 block truncate">
                              {lawyer.category}
                            </span>
                            <span className="text-[10px] font-mono text-amber-800 block font-bold mt-0.5">
                              {lawyer.barLicense}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <strong className="font-bold">{lawyer.rating}</strong>
                            <span className="text-slate-500 font-normal">({lawyer.reviews})</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                            Free Inquiry
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                          {language === 'am' ? lawyer.amharicBio : lawyer.bio}
                        </p>

                        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 text-center font-mono">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Experience</span>
                            <strong className="text-xs text-slate-900">{lawyer.experienceYears} yrs</strong>
                          </div>
                          <div className="border-l border-slate-100">
                            <span className="text-[10px] text-slate-500 uppercase block">Standing</span>
                            <strong className="text-[11px] text-slate-900 truncate block px-1">
                              {lawyer.courtStanding.replace('Federal ', '')}
                            </strong>
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600">
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
                        <div
                          className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
                            isSelected
                              ? 'bg-[#0A1128] text-white'
                              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? '✓ Selected Advocate' : 'Select Advocate'}
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
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleProceedFromStep3}
                className="px-8 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Continue to Confirm</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                {language === 'am' ? 'ጥያቄዎን ያረጋግጡ' : 'Review & send your request'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                No payment is required on LegalLink. Enter your contact details so the advocate can reach you directly.
              </p>
            </div>

            {submissionError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono">
                  YOUR CONTACT DETAILS
                </span>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Kebede"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (e.target.value.trim()) setSubmissionError(null);
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-800 mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+251 911 000 000"
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          if (e.target.value.trim()) setSubmissionError(null);
                        }}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
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
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Practice Area</span>
                      <strong className="text-slate-900 font-bold">{activeCategoryObj?.title}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Location & Mode</span>
                      <strong className="text-slate-900 font-bold">
                        {location} • {consultLanguage} • {consultMode}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Preferred Timeline</span>
                      <strong className="text-slate-900 font-bold">{urgency}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Matter Summary</span>
                    <p className="text-slate-700 leading-relaxed font-normal bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {situationText}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-mono mb-4">
                    SELECTED ADVOCATE
                  </span>

                  {activeLawyerObj && (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-[#0A1128] text-white font-black flex items-center justify-center text-sm shrink-0">
                          {activeLawyerObj.initials}
                        </div>
                        <div>
                          <strong className="text-base font-black text-[#0A1128] block">
                            {activeLawyerObj.name}
                          </strong>
                          <span className="text-xs text-slate-600 block">{activeLawyerObj.category}</span>
                          <span className="text-[10px] font-mono text-amber-800 font-bold block mt-0.5">
                            {activeLawyerObj.barLicense}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Experience</span>
                          <strong className="text-slate-900 font-bold">{activeLawyerObj.experienceYears} years</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Chamber Location</span>
                          <strong className="text-slate-900 font-bold">{activeLawyerObj.location}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Court Standing</span>
                          <strong className="text-slate-900 font-bold">{activeLawyerObj.courtStanding}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Platform Matching Fee</span>
                          <strong className="text-sm font-black text-emerald-700 block">
                            Free (ETB 0)
                          </strong>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Advocate Connection</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed font-normal">
                    LegalLink connects you directly with your chosen advocate at no platform cost. Any formal legal representation fees are agreed directly between you and your advocate.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              By submitting, you agree to LegalLink’s{' '}
              <Link href="/terms" className="underline font-semibold hover:text-slate-900">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline font-semibold hover:text-slate-900">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSubmissionError(null);
                  setCurrentStep(3);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
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
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Send Free Consultation Request</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Clean Free-Launch Confirmation Modal */}
      {isSubmittedSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5 text-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#0A1128]">
                Consultation Request Sent!
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Your inquiry has been dispatched to <strong>{activeLawyerObj?.name}</strong>. They will review your summary and contact you directly via <strong>{clientPhone}</strong>.
              </p>
            </div>

            {bookingReference && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-left space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Reference ID:</span>
                  <strong className="text-amber-800">{bookingReference}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Status:</span>
                  <strong className="text-emerald-700">Pending Advocate Review</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Platform Fee:</span>
                  <strong className="text-slate-900">Free (ETB 0)</strong>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-[#0A1128] text-white font-bold rounded-xl text-center hover:bg-[#102A43] transition-all"
              >
                Return to Home
              </Link>
              <Link
                href="/lexdraft"
                className="px-6 py-3 bg-slate-100 text-slate-800 font-bold rounded-xl text-center hover:bg-slate-200 transition-all"
              >
                Draft a Legal Form
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>
              Legal representation is provided independently by licensed Ethiopian advocates under Proclamation No. 1249/2021.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FindLawyerWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-mono text-slate-500">
          Loading LegalLink Advocate Directory...
        </div>
      }
    >
      <FindLawyerWizard />
    </Suspense>
  );
}