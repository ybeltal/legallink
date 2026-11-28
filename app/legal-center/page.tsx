'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Scale,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  Headphones,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  RevealOnScroll,
  KineticHeadline,
  SpotlightCard,
} from '@/components/MotionPrimitives';
import { LEGAL_ARTICLES } from '@/lib/legaltalk-data';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

interface DictionaryTerm {
  id: string;
  term: string;
  amharicTerm: string;
  category: 'Litigation' | 'Contracts & Business' | 'Property & Land' | 'Labour & Family';
  plainDefinition: string;
  amharicDefinition: string;
  statute: string;
  relatedCategorySlug: string;
  relatedLexDraftId?: string;
}

interface LegalTipGuide {
  id: string;
  tag: string;
  title: string;
  amharicTitle: string;
  summary: string;
  checklist: string[];
  ctaLabel: string;
  ctaHref: string;
}

interface LiveQuestion {
  id: string;
  category: string;
  city: string;
  question: string;
  answer?: string | null;
  answered_by?: string | null;
  status: string;
  created_at: string;
}

const ETHIOPIAN_LEGAL_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'cassation',
    term: 'Cassation (Säbär)',
    amharicTerm: 'ሰበር ሰሚ ችሎት',
    category: 'Litigation',
    plainDefinition:
      'A final review by the Federal Supreme Court Cassation Division available only when a lower court’s final decision contains a basic and fundamental error of law—not simply disagreement over facts.',
    amharicDefinition:
      'የመጨረሻ ውሳኔ በተሰጠበት ጉዳይ ላይ መሠረታዊ የሕግ ስህተት ሲፈጸም ብቻ ለፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት የሚቀርብ አቤቱታ።',
    statute: 'FDRE Constitution Art. 80(3)(a) & Proc. No. 1234/2021',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'application-for-cassation',
  },
  {
    id: 'power-of-attorney',
    term: 'Power of Attorney (Agency)',
    amharicTerm: 'ውክልና',
    category: 'Contracts & Business',
    plainDefinition:
      'A written legal document authorizing another person (agent) or licensed advocate to act, sign contracts, manage property, or appear in court on your behalf. Usually authenticated before DARS (or an Ethiopian Embassy for diaspora).',
    amharicDefinition:
      'አንድ ሰው ሌላ ሰው ወይም ጠበቃ በእርሱ ስም ውል እንዲፈርም፣ ንብረት እንዲያስተዳድር ወይም በፍርድ ቤት እንዲከራከር የሚሰጥ ሕጋዊ ሥልጣን።',
    statute: 'Ethiopian Civil Code Art. 2199–2233',
    relatedCategorySlug: 'immigration',
    relatedLexDraftId: 'agency-attorney',
  },
  {
    id: 'temporary-injunction',
    term: 'Temporary Injunction',
    amharicTerm: 'ጊዜያዊ የዕግድ ትዕዛዝ',
    category: 'Litigation',
    plainDefinition:
      'An urgent court order stopping a party from selling, transferring, demolishing, or damaging disputed property until the court delivers a final judgment.',
    amharicDefinition:
      'ክርክር የተነሳበት ንብረት ውሳኔ እስኪሰጥ ድረስ እንዳይሸጥ፣ እንዳይለወጥ ወይም እንዳይባክን ፍርድ ቤት የሚሰጠው አስቸኳይ የዕግድ ትዕዛዝ።',
    statute: 'Civil Procedure Code Art. 154–155',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'injunction-order',
  },
  {
    id: 'ex-parte',
    term: 'Ex-Parte Judgment',
    amharicTerm: 'በሌለበት የተሰጠ ውሳኔ',
    category: 'Litigation',
    plainDefinition:
      'A court order or verdict issued in the absence of the defendant after valid summons was served. A defendant with good cause (or improper summons) can petition to cancel it within 30 days.',
    amharicDefinition:
      'ተከሳሽ በችሎት ባልተገኘበት የሚሰጥ የፍርድ ቤት ውሳኔ። በቂ ምክንያት ያለው ተከሳሽ በ30 ቀን ውስጥ እንዲነሳለት ማመልከት ይችላል።',
    statute: 'Civil Procedure Code Art. 78',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'cancellation-ex-parte-order',
  },
  {
    id: 'severance-pay',
    term: 'Severance Pay',
    amharicTerm: 'የሥራ ስንብት ክፍያ',
    category: 'Labour & Family',
    plainDefinition:
      'Statutory compensation owed to an employee who completed probation and is terminated without fault (such as redundancy or unlawful dismissal): 30 days wages for Year 1 plus one-third of monthly wages for each additional year.',
    amharicDefinition:
      'የሙከራ ጊዜውን የጨረሰ ሠራተኛ ያለጥፋቱ ከሥራ ሲሰናበት ለመጀመሪያው ዓመት የ30 ቀን ደመወዝ እና ለቀጣይ እያንዳንዱ ዓመት የአንድ ሦስተኛ ወር ደመወዝ የሚከፈል ካሳ።',
    statute: 'Labour Proclamation No. 1156/2019 Art. 39–40',
    relatedCategorySlug: 'employment',
    relatedLexDraftId: 'employment-agreement',
  },
  {
    id: 'urban-leasehold',
    term: 'Urban Land Leasehold (Karta)',
    amharicTerm: 'የከተማ ቦታ ሊዝ / ካርታ',
    category: 'Property & Land',
    plainDefinition:
      'In Ethiopia, land is public property; individuals and companies own buildings and hold long-term municipal leasehold rights evidenced by a Title Deed (ካርታ). Always verify encumbrances at the sub-city land office before buying.',
    amharicDefinition:
      'በኢትዮጵያ መሬት የመንግሥትና የሕዝብ ሲሆን፣ ግለሰቦችና ድርጅቶች ሕንፃን በባለቤትነት፣ ቦታውን ደግሞ በሊዝ ይዞታ (ካርታ) ይይዛሉ።',
    statute: 'Urban Lands Lease Holding Proc. No. 721/2011',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'commercial-lease',
  },
  {
    id: 'single-member-plc',
    term: 'Single-Member PLC',
    amharicTerm: 'ባለ አንድ አባል ኃ/የተ/የግ/ማኅበር',
    category: 'Contracts & Business',
    plainDefinition:
      'A Private Limited Company formed by a single founder under Ethiopia’s revised 2021 Commercial Code, offering limited liability protection without requiring a second shareholder.',
    amharicDefinition:
      'በአዲሱ የ2013 የንግድ ሕግ መሠረት በአንድ መሥራች ብቻ የሚቋቋምና የግል ንብረትን ከኩባንያው ዕዳ የሚለይ ኃላፊነቱ የተወሰነ የግል ማኅበር።',
    statute: 'Commercial Code Proclamation No. 1243/2021 Art. 534+',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'plc-articles-of-association',
  },
  {
    id: 'force-majeure',
    term: 'Force Majeure',
    amharicTerm: 'ከአቅም በላይ የሆነ ምክንያት',
    category: 'Contracts & Business',
    plainDefinition:
      'An unforeseeable external event that makes performing a contract absolutely impossible (not merely more expensive), excusing the non-performing party from paying damages.',
    amharicDefinition:
      'አስቀድሞ ሊገመት የማይችልና የውል ግዴታን መፈጸም ፈጽሞ የማይቻል የሚያደርግ ከአቅም በላይ የሆነ ክስተት።',
    statute: 'Ethiopian Civil Code Art. 1792–1793',
    relatedCategorySlug: 'corporate',
  },
  {
    id: 'certificate-of-heirship',
    term: 'Certificate of Heirship',
    amharicTerm: 'የውርስ አጣሪነት / የወራሽነት ማረጋገጫ',
    category: 'Labour & Family',
    plainDefinition:
      'A court-issued certificate officially recognizing the lawful heirs of a deceased person—required before banks unfreeze accounts or land offices transfer inherited houses.',
    amharicDefinition:
      'የሟች ሕጋዊ ወራሾች እነማን መሆናቸውን ፍርድ ቤት የሚያረጋግጥበትና ባንኮች ወይም የመሬት ጽ/ቤቶች ንብረት ለማስተላለፍ የሚጠይቁት ማስረጃ።',
    statute: 'Ethiopian Civil Code Art. 996–1002',
    relatedCategorySlug: 'family',
  },
  {
    id: 'dars',
    term: 'DARS Authentication',
    amharicTerm: 'የሰነዶች ማረጋገጫና ምዝገባ አገልግሎት',
    category: 'Property & Land',
    plainDefinition:
      'The Federal Documents Authentication and Registration Service (formerly DARA), which notarizes powers of attorney, vehicle sales, property transfers, and company formation articles so they carry legal validity.',
    amharicDefinition:
      'የውክልና፣ የንብረት ሽያጭ፣ የኩባንያ መመሥረቻ ጽሑፍ እና ሌሎች ሕጋዊ ውሎች ተቀባይነት እንዲኖራቸው የሚያረጋግጥና የሚመዘግብ ተቋም።',
    statute: 'Authentication & Registration of Documents Proc. No. 922/2015',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'general-special-agency',
  },
];

const CLIENT_LEGAL_TIPS: LegalTipGuide[] = [
  {
    id: 'verify-advocate',
    tag: 'Hiring Guide',
    title: 'How to Verify an Ethiopian Advocate Before Hiring',
    amharicTitle: 'ጠበቃ ከመቅጠርዎ በፊት ፈቃዱን እንዴት ማረጋገጥ ይችላሉ?',
    summary:
      'Under Federal Advocacy Proclamation No. 1249/2021, practicing advocates hold tiered licenses tied to specific court levels.',
    checklist: [
      'Confirm whether your case is in Federal First Instance, High Court, Supreme Court, or a Regional Court—and match the advocate’s license tier.',
      'Ask to see the current-year renewed Ministry of Justice (or Regional Justice Bureau) practicing license number.',
      'Request a simple written engagement agreement outlining scope of work, deliverables, and payment milestones.',
    ],
    ctaLabel: 'Browse Verified Advocates',
    ctaHref: '/find-a-lawyer',
  },
  {
    id: 'first-consultation-prep',
    tag: 'Preparation',
    title: '5 Things to Prepare Before Your First Legal Consultation',
    amharicTitle: 'ለመጀመሪያው የህግ ምክክር ማዘጋጀት ያለብዎት 5 ነገሮች',
    summary:
      'Arriving organized saves hours of legal time and helps your advocate give clear, accurate advice on the very first call.',
    checklist: [
      'Write a 1-page timeline of key dates (contract signing, dismissal date, court summons date, or notice received).',
      'Gather copies—not originals—of contracts, payslips, title deeds (ካርታ), receipts, or court letters.',
      'Check statutory deadlines immediately (for example, labour dismissal claims generally have a 3-month filing window).',
      'List your 3 most urgent questions and your ideal outcome (settlement vs. court litigation).',
    ],
    ctaLabel: 'Draft a Form First (LexDraft)',
    ctaHref: '/lexdraft',
  },
  {
    id: 'understand-fees',
    tag: 'Transparency',
    title: 'Understanding Advocate Fee Agreements in Ethiopia',
    amharicTitle: 'በኢትዮጵያ የጥብቅና አገልግሎት ክፍያ አሰራርን መረዳት',
    summary:
      'LegalLink connects you to advocates for free. Any formal representation fee is agreed directly between you and your advocate.',
    checklist: [
      'Fixed-fee services work best for predictable tasks like PLC incorporation, contract review, or DARS power of attorney.',
      'Stage-based retainers are common for court litigation (pleadings, hearings, judgment execution).',
      'Always clarify upfront who covers court filing stamps, translation costs, and DARS authentication fees.',
    ],
    ctaLabel: 'Submit a Free Case Inquiry',
    ctaHref: '/find-a-lawyer',
  },
  {
    id: 'diaspora-remote-guide',
    tag: 'Diaspora',
    title: 'Managing Property or Inheritance in Ethiopia From Abroad',
    amharicTitle: 'ከውጭ ሀገር ሆነው በኢትዮጵያ ያለ ንብረትን ወይም ውርስን ማስተዳደር',
    summary:
      'You do not need to fly to Addis Ababa for routine property audits, lease management, or court filings if your Power of Attorney is properly authenticated.',
    checklist: [
      'Draft a specific (not vague) Power of Attorney naming exact parcel/karta numbers or bank branches.',
      'Sign and stamp the Power of Attorney at the nearest Ethiopian Embassy or Consulate, then authenticate via MoFA and DARS in Addis Ababa.',
      'Keep your Ethiopian Origin ID (Yellow Card) active to exercise full urban property ownership rights under Proc. No. 270/2002.',
    ],
    ctaLabel: 'Connect with a Diaspora Advocate',
    ctaHref: '/find-a-lawyer?category=immigration',
  },
];

export default function LegalCenterPage() {
  const { language } = useLanguage();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'dictionary' | 'tips' | 'guides' | 'qa'>('dictionary');
  const [dictCategory, setDictCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live Free Q&A State
  const [questions, setQuestions] = useState<LiveQuestion[]>([]);
  const [qCategory, setQCategory] = useState('Employment & Labour');
  const [qCity, setQCity] = useState('Addis Ababa');
  const [qText, setQText] = useState('');
  const [submittingQ, setSubmittingQ] = useState(false);
  const [qFeedback, setQFeedback] = useState<string | null>(null);
  const [qError, setQError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('legal_questions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setQuestions(data as LiveQuestion[]);
      });
  }, []);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQError(null);
    setQFeedback(null);

    if (qText.trim().length < 20) {
      setQError('Please describe your legal question in at least 20 characters.');
      return;
    }

    setSubmittingQ(true);
    try {
      const { data, error } = await supabase
        .from('legal_questions')
        .insert({
          category: qCategory,
          city: qCity,
          question: qText.trim(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setQuestions((prev) => [data as LiveQuestion, ...prev]);
      }
      setQText('');
      setQFeedback('Your anonymous legal question has been submitted! Our legal advisory desk will publish an answer soon.');
    } catch (err: any) {
      setQError(err?.message || 'Could not submit your question right now.');
    } finally {
      setSubmittingQ(false);
    }
  };

  const q = searchQuery.toLowerCase().trim();

  const filteredDictionary = ETHIOPIAN_LEGAL_DICTIONARY.filter((item) => {
    const matchCat = dictCategory === 'All' || item.category === dictCategory;
    if (!matchCat) return false;
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.amharicTerm.includes(q) ||
      item.plainDefinition.toLowerCase().includes(q) ||
      item.statute.toLowerCase().includes(q)
    );
  });

  const filteredTips = CLIENT_LEGAL_TIPS.filter((tip) => {
    if (!q) return true;
    return (
      tip.title.toLowerCase().includes(q) ||
      tip.amharicTitle.includes(q) ||
      tip.summary.toLowerCase().includes(q)
    );
  });

  const filteredGuides = LEGAL_ARTICLES.filter((art) => {
    if (!q) return true;
    return (
      art.title.toLowerCase().includes(q) ||
      art.amharicTitle.includes(q) ||
      art.excerpt.toLowerCase().includes(q)
    );
  });

  const filteredQuestions = questions.filter((item) => {
    if (!q) return true;
    return (
      item.question.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.answer || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      <Navbar />

      {/* Sunlit Sky Azure Hero */}
      <section className="relative overflow-hidden ll-sky-canvas pt-14 pb-16 md:pt-18 md:pb-20 text-white">
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-6 -left-20 w-[420px] h-[190px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-16 -right-20 w-[460px] h-[210px] rounded-full bg-white/30 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/35 backdrop-blur-md text-[11px] font-bold">
                <Scale className="w-3.5 h-3.5 text-amber-300" />
                <span>Ethiopia’s Free Consumer Legal Resource Center</span>
              </div>

              <KineticHeadline
                primaryText={language === 'am' ? 'የሊጋልሊንክ' : 'LegalLink'}
                accentText={language === 'am' ? 'የህግ መረጃ ማዕከል' : 'Legal Center'}
              />

              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium max-w-2xl">
                Understand Ethiopian legal terms in plain Amharic &amp; English, prepare before meeting an advocate, browse top guides, or post an anonymous legal question for free.
              </p>

              {/* Frosted Search Pill */}
              <div className="relative max-w-xl pt-1">
                <Search className="w-4 h-4 text-[#3B66B8] absolute left-4 top-4" />
                <input
                  type="text"
                  placeholder="Search legal terms, statutes, or guides (e.g. Cassation, Karta, Severance, PLC)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/95 text-[#182235] placeholder:text-slate-400 border border-white rounded-full text-xs font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-white/70"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-[#182235] font-black text-xs rounded-full inline-flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0 w-fit"
            >
              <HelpCircle className="w-4 h-4 text-[#3B66B8]" />
              <span>Ask a Free Legal Question</span>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: TABS & CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Primary Tabs */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('dictionary')}
                className={`px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'dictionary'
                    ? 'bg-[#182235] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Legal Dictionary ({ETHIOPIAN_LEGAL_DICTIONARY.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                className={`px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'tips'
                    ? 'bg-[#182235] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hiring &amp; Prep Tips</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('guides')}
                className={`px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-[#182235] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Most Popular Guides</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-[#182235] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Free Legal Q&amp;A ({questions.length})</span>
              </button>
            </div>

            {/* TAB 1: LEGAL DICTIONARY */}
            {activeTab === 'dictionary' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {['All', 'Litigation', 'Contracts & Business', 'Property & Land', 'Labour & Family'].map(
                    (cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setDictCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                          dictCategory === cat
                            ? 'bg-[#3B66B8] text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-[#3B66B8]/50'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="space-y-4">
                  {filteredDictionary.map((item, idx) => (
                    <RevealOnScroll key={item.id} delayMs={(idx % 5) * 45}>
                      <SpotlightCard className="p-6 rounded-3xl space-y-3">
                        <div className="flex items-start justify-between gap-3 relative z-10">
                          <div>
                            <h2 className="text-base font-black text-[#182235]">{item.term}</h2>
                            <span className="text-xs font-bold text-[#3B66B8] block mt-0.5">
                              {item.amharicTerm}
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5] text-[10px] font-bold shrink-0">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10">
                          {item.plainDefinition}
                        </p>

                        <p className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-[#3B66B8]/50 relative z-10">
                          {item.amharicDefinition}
                        </p>

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 relative z-10">
                          <span className="text-[11px] font-mono text-slate-500">
                            {item.statute}
                          </span>
                          <div className="flex items-center gap-2">
                            {item.relatedLexDraftId && (
                              <Link
                                href={`/lexdraft?template=${item.relatedLexDraftId}`}
                                className="px-3.5 py-1.5 rounded-full bg-[#EEF3FB] hover:bg-[#dfe9fa] text-[#3B66B8] font-bold text-[11px]"
                              >
                                Draft Form →
                              </Link>
                            )}
                            <Link
                              href={`/find-a-lawyer?category=${item.relatedCategorySlug}`}
                              className="px-3.5 py-1.5 rounded-full bg-[#182235] hover:bg-[#3B66B8] text-white font-bold text-[11px] transition-colors"
                            >
                              Find Advocate →
                            </Link>
                          </div>
                        </div>
                      </SpotlightCard>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: HIRING & PREP TIPS */}
            {activeTab === 'tips' && (
              <div className="space-y-5">
                {filteredTips.map((tip, idx) => (
                  <RevealOnScroll key={tip.id} delayMs={idx * 65}>
                    <SpotlightCard className="p-6 sm:p-7 rounded-3xl space-y-4">
                      <div className="space-y-1 relative z-10">
                        <span className="px-3 py-0.5 rounded-full bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5] text-[10px] font-mono font-bold uppercase">
                          {tip.tag}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-[#182235] pt-1">
                          {language === 'am' ? tip.amharicTitle : tip.title}
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">{tip.summary}</p>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-700 relative z-10">
                        {tip.checklist.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#3B66B8] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-2 relative z-10">
                        <Link
                          href={tip.ctaHref}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#182235] hover:bg-[#3B66B8] text-white font-bold text-xs transition-colors"
                        >
                          <span>{tip.ctaLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                        </Link>
                      </div>
                    </SpotlightCard>
                  </RevealOnScroll>
                ))}
              </div>
            )}

            {/* TAB 3: MOST POPULAR GUIDES */}
            {activeTab === 'guides' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredGuides.slice(0, 6).map((art, idx) => (
                  <RevealOnScroll key={art.slug} delayMs={idx * 55}>
                    <Link href={`/legaltalk/${art.slug}`} className="block h-full group">
                      <SpotlightCard className="p-5 rounded-3xl h-full flex flex-col justify-between space-y-3">
                        <div className="space-y-2 relative z-10">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3FB] text-[#3B66B8] text-[10px] font-bold">
                              {art.category}
                            </span>
                            {art.audioDuration && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-500">
                                <Headphones className="w-3 h-3 text-[#3B66B8]" />
                                {art.audioDuration}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-black text-[#182235] group-hover:text-[#3B66B8] transition-colors">
                            {language === 'am' ? art.amharicTitle : art.title}
                          </h3>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {language === 'am' ? art.amharicExcerpt : art.excerpt}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#3B66B8] relative z-10">
                          Read or Listen →
                        </span>
                      </SpotlightCard>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            )}

            {/* TAB 4: FREE ANONYMOUS LEGAL Q&A */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#D6E2F5] p-6 sm:p-7 shadow-xs space-y-4 text-xs">
                  <div>
                    <h2 className="text-base font-black text-[#182235]">
                      Ask a Free Anonymous Legal Question
                    </h2>
                    <p className="text-slate-600 mt-0.5">
                      No account required. Share general facts only — our legal advisory desk publishes plain-language answers below.
                    </p>
                  </div>

                  {qError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{qError}</span>
                    </div>
                  )}

                  {qFeedback && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{qFeedback}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitQuestion} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#182235] mb-1">Legal Category</label>
                        <select
                          value={qCategory}
                          onChange={(e) => setQCategory(e.target.value)}
                          className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                        >
                          <option value="Employment & Labour">Employment &amp; Labour</option>
                          <option value="Property & Lease">Property &amp; Lease</option>
                          <option value="Family & Inheritance">Family &amp; Inheritance</option>
                          <option value="Business & PLC">Business &amp; PLC</option>
                          <option value="Diaspora & PoA">Diaspora &amp; PoA</option>
                          <option value="Criminal & Courts">Criminal &amp; Courts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-[#182235] mb-1">City / Region</label>
                        <input
                          type="text"
                          value={qCity}
                          onChange={(e) => setQCity(e.target.value)}
                          className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#182235] mb-1">
                        Your Question (Amharic or English) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="E.g. My employer terminated my contract after 2 years without written notice. What severance am I entitled to?"
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        className="w-full p-3 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingQ}
                      className="px-6 py-3 bg-[#3B66B8] hover:bg-[#2F56A6] text-white font-bold rounded-full inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submittingQ ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>Post Anonymous Question</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  {filteredQuestions.map((item) => (
                    <SpotlightCard key={item.id} className="p-6 rounded-3xl space-y-3 text-xs">
                      <div className="flex items-center justify-between gap-2 relative z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3FB] text-[#3B66B8] font-bold text-[10px]">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {item.city} • {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-black text-[#182235] relative z-10">
                        {item.question}
                      </p>
                      {item.answer ? (
                        <div className="p-4 bg-[#EEF3FB]/70 border border-[#D6E2F5] rounded-2xl text-slate-700 space-y-1 relative z-10">
                          <strong className="text-[11px] text-[#3B66B8] block">
                            {item.answered_by || 'LegalLink Legal Advisory Desk'}
                          </strong>
                          <p className="leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] italic text-slate-500 relative z-10">
                          Awaiting review from a verified Ethiopian advocate...
                        </p>
                      )}
                    </SpotlightCard>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                      Be the first to post an anonymous legal question above.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 4 COLUMNS: STICKY SKY CTA + QUICK TOOLS */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#2E55A5] via-[#3B66B8] to-[#5784D6] text-white shadow-md space-y-4 text-xs">
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold uppercase">
                Free Advocate Matching
              </span>
              <h3 className="text-xl font-black leading-snug">
                Need a Licensed Ethiopian Advocate?
              </h3>
              <p className="text-white/90 leading-relaxed">
                Present your legal issue in minutes and connect directly with verified Federal or Regional advocates.
              </p>
              <ul className="space-y-2 text-white/95">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>No fee to present your case</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Private &amp; role-restricted inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Zero obligation to hire</span>
                </li>
              </ul>
              <Link
                href="/find-a-lawyer"
                className="w-full py-3 bg-white hover:bg-slate-100 text-[#182235] font-black rounded-full inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Present Your Case Now</span>
                <ArrowRight className="w-4 h-4 text-[#3B66B8]" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs">
              <strong className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                More Free LegalLink Tools
              </strong>
              {[
                { label: 'LexDraft Bilingual Forms', href: '/lexdraft', icon: FileText },
                { label: '122 Federal Proclamations', href: '/library', icon: BookOpen },
                { label: 'NextGen Law Student Hub', href: '/nextgen', icon: Sparkles },
                { label: 'Severance & DARS Tools', href: '/tools', icon: Scale },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="p-3 rounded-2xl bg-[#F5F7FB] hover:bg-[#EEF3FB] text-[#182235] hover:text-[#3B66B8] font-bold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <tool.icon className="w-4 h-4 text-[#3B66B8]" />
                    <span>{tool.label}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#182235] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
          <p>Plain-language Ethiopian legal definitions &amp; preparation resources.</p>
        </div>
      </footer>
    </div>
  );
}