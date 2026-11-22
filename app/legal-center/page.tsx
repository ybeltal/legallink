'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Scale,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MessageSquarePlus,
  FileText,
  Clock,
  ChevronDown,
  X,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';
import { LEGAL_ARTICLES, VERIFIED_QA_DATA } from '@/lib/legaltalk-data';
import {
  ETHIOPIAN_LEGAL_DICTIONARY,
  CLIENT_LEGAL_TIPS,
} from '@/lib/legal-center-data';

interface CommunityQuestionRow {
  id: string;
  category: string;
  question: string;
  city: string;
  answer: string | null;
  answered_by: string | null;
  created_at: string;
}

export default function LegalCenterPage() {
  const { language } = useLanguage();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'dictionary' | 'tips' | 'popular' | 'qa'>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [dictCategory, setDictCategory] = useState<string>('All');
  const [openTipId, setOpenTipId] = useState<string | null>(CLIENT_LEGAL_TIPS[0].id);

  // Avvo-Style Free Anonymous Q&A Modal State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [qCategory, setQCategory] = useState('Corporate & Business');
  const [qCity, setQCity] = useState('Addis Ababa');
  const [qText, setQText] = useState('');
  const [qSubmitting, setQSubmitting] = useState(false);
  const [qSuccess, setQSuccess] = useState(false);
  const [qError, setQError] = useState<string | null>(null);
  const [liveQuestions, setLiveQuestions] = useState<CommunityQuestionRow[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data } = await supabase
          .from('legal_questions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (data && data.length > 0) {
          setLiveQuestions(data as CommunityQuestionRow[]);
        }
      } catch {
        // Silently fall back to verified Q&A seed items if table not yet created
      }
    };
    loadQuestions();
  }, []);

  const dictCategories = [
    'All',
    'Litigation',
    'Contracts & Business',
    'Property & Land',
    'Labour & Family',
  ];

  const filteredDictionary = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ETHIOPIAN_LEGAL_DICTIONARY.filter((item) => {
      const matchesCat = dictCategory === 'All' || item.category === dictCategory;
      if (!q) return matchesCat;
      return (
        matchesCat &&
        (item.term.toLowerCase().includes(q) ||
          item.amharicTerm.includes(q) ||
          item.plainDefinition.toLowerCase().includes(q) ||
          item.amharicDefinition.includes(q) ||
          item.statute.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, dictCategory]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return LEGAL_ARTICLES;
    return LEGAL_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.amharicTitle.includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleAskQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQError(null);

    if (qText.trim().length < 20) {
      setQError('Please provide at least 20 characters so an advocate can understand your question.');
      return;
    }

    setQSubmitting(true);
    try {
      const { error } = await supabase.from('legal_questions').insert({
        category: qCategory,
        city: qCity,
        question: qText.trim(),
        status: 'pending',
      });

      if (error) throw error;

      // Also show optimistically in the user's current view
      setLiveQuestions((prev) => [
        {
          id: `local-${Date.now()}`,
          category: qCategory,
          city: qCity,
          question: qText.trim(),
          answer: null,
          answered_by: null,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      setQSuccess(true);
      setQText('');
      setActiveTab('qa');
      setTimeout(() => {
        setQSuccess(false);
        setAskModalOpen(false);
      }, 1500);
    } catch (err: any) {
      setQError(
        err?.message ||
          'Could not post question yet. Make sure the legal_questions SQL table is created in Supabase.'
      );
    } finally {
      setQSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-950 border border-amber-200 text-[11px] font-bold w-fit">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {language === 'am'
                  ? 'የኢትዮጵያ የህግ መረጃ ማዕከል'
                  : 'Ethiopia’s Free Consumer Legal Resource Center'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setQError(null);
                setQSuccess(false);
                setAskModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer w-fit"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>{language === 'am' ? 'ነፃ የህግ ጥያቄ ይጠይቁ' : 'Ask a Free Legal Question'}</span>
            </button>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
              {language === 'am' ? 'ሊጋልሊንክ የህግ ማዕከል' : 'LegalLink Legal Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'am'
                ? 'የህግ ቃላትን በቀላል ቋንቋ ይረዱ፣ ጠበቃ ከማግኘትዎ በፊት ማወቅ ያለብዎትን ምክሮች ያንብቡ፣ ወይም ነፃ የህግ ጥያቄ ይጠይቁ።'
                : 'Understand Ethiopian legal terms in plain Amharic & English, prepare before meeting an advocate, browse top guides, or post an anonymous legal question for free.'}
            </p>
          </div>

          {/* Unified Global Search Bar */}
          <div className="relative max-w-xl pt-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-0.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'am'
                  ? 'ቃላትን ወይም ርዕሶችን ይፈልጉ (ለምሳሌ፡ ሰበር፣ ውክልና፣ ካርታ፣ ስንብት)...'
                  : 'Search legal terms, statutes, or guides (e.g. Cassation, Karta, Severance, PLC)...'
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
            />
          </div>
        </div>
      </section>

      {/* Main Layout: 8 Cols Content + 4 Cols Sticky "Present Your Case Free" Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Interactive Tabs & Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('dictionary')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'dictionary'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'am' ? 'የህግ መዝገበ ቃላት' : 'Legal Dictionary'} (
                  {ETHIOPIAN_LEGAL_DICTIONARY.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tips')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'tips'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'am' ? 'የጠበቃ መምረጫ ምክሮች' : 'Hiring & Prep Tips'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('popular')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'popular'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'am' ? 'ተወዳጅ ጽሑፎች' : 'Most Popular Guides'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`px-4 py-2 rounded-xl whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  activeTab === 'qa'
                    ? 'bg-[#0A1128] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {language === 'am' ? 'ነፃ ጥያቄና መልስ' : 'Free Legal Q&A'} (
                  {VERIFIED_QA_DATA.length + liveQuestions.length})
                </span>
              </button>
            </div>

            {/* TAB 1: BILINGUAL ETHIOPIAN LEGAL DICTIONARY */}
            {activeTab === 'dictionary' && (
              <div className="space-y-5">
                <div className="flex flex-wrap gap-2 text-xs">
                  {dictCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDictCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition-all ${
                        dictCategory === cat
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {filteredDictionary.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h2 className="text-base font-black text-[#0A1128]">{item.term}</h2>
                          <span className="text-xs font-bold text-emerald-700 block">
                            {item.amharicTerm}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {language === 'am' ? item.amharicDefinition : item.plainDefinition}
                      </p>

                      {language === 'en' && (
                        <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-amber-400 pl-3">
                          {item.amharicDefinition}
                        </p>
                      )}

                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="font-mono text-[11px] text-slate-500">{item.statute}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          {item.relatedLexDraftId && (
                            <Link
                              href={`/lexdraft?template=${item.relatedLexDraftId}`}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200"
                            >
                              Draft Form →
                            </Link>
                          )}
                          <Link
                            href={`/find-a-lawyer?category=${item.relatedCategorySlug}`}
                            className="px-3 py-1.5 rounded-lg bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-[11px]"
                          >
                            Find Advocate →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredDictionary.length === 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 text-xs">
                      <p className="text-slate-600 font-semibold">
                        No dictionary term matched &ldquo;{searchQuery}&rdquo;.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setQText(`What does "${searchQuery}" mean under Ethiopian law?`);
                          setAskModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#0A1128] text-white font-bold rounded-xl cursor-pointer"
                      >
                        Ask an Advocate for Free →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CLIENT LEGAL TIPS & HIRING PLAYBOOKS */}
            {activeTab === 'tips' && (
              <div className="space-y-4">
                {CLIENT_LEGAL_TIPS.map((tip) => {
                  const isOpen = openTipId === tip.id;
                  return (
                    <div
                      key={tip.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenTipId(isOpen ? null : tip.id)}
                        className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/70"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                            {tip.tag}
                          </span>
                          <h2 className="text-base font-black text-[#0A1128] pt-1">
                            {language === 'am' ? tip.amharicTitle : tip.title}
                          </h2>
                          <p className="text-xs text-slate-600">{tip.summary}</p>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 mt-1 transition-transform ${
                            isOpen ? 'rotate-180 text-[#0A1128]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs">
                          <ul className="space-y-2.5">
                            {tip.checklist.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-2">
                            <Link
                              href={tip.ctaHref}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl text-xs"
                            >
                              <span>{tip.ctaLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: MOST POPULAR GUIDES (LINKS TO EXISTING LEGALTALK ARTICLES) */}
            {activeTab === 'popular' && (
              <div className="space-y-4">
                {filteredArticles.map((art, idx) => (
                  <Link
                    key={art.slug}
                    href={`/legaltalk/${art.slug}`}
                    className="block bg-white rounded-3xl border border-slate-200 hover:border-[#0A1128] p-6 shadow-xs transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-black text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase">
                          <span className="font-bold text-amber-700">
                            {language === 'am' ? art.amharicCategory : art.category}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {art.readTime}
                          </span>
                        </div>
                        <h2 className="text-base font-black text-[#0A1128] group-hover:text-amber-700 transition-colors">
                          {language === 'am' ? art.amharicTitle : art.title}
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {language === 'am' ? art.amharicExcerpt : art.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1128] shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* TAB 4: FREE ANONYMOUS Q&A (AVVO-STYLE) */}
            {activeTab === 'qa' && (
              <div className="space-y-5">
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <strong className="text-sm font-black text-[#0A1128] block">
                      Have a quick Ethiopian legal question?
                    </strong>
                    <p className="text-amber-950">
                      Post anonymously for free. Verified advocates answer general legal questions publicly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAskModalOpen(true)}
                    className="px-5 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl shrink-0 cursor-pointer"
                  >
                    Ask Anonymously (Free)
                  </button>
                </div>

                {/* Live Community Questions */}
                {liveQuestions.map((lq) => (
                  <div
                    key={lq.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {lq.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Anonymous • {lq.city}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[#0A1128]">{lq.question}</h3>
                    {lq.answer ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                        <strong className="block text-xs">{lq.answered_by || 'Verified Advocate'}</strong>
                        <p className="leading-relaxed">{lq.answer}</p>
                      </div>
                    ) : (
                      <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        Awaiting advocate response
                      </span>
                    )}
                  </div>
                ))}

                {/* Verified Seed Q&As */}
                {VERIFIED_QA_DATA.map((qa) => (
                  <div
                    key={qa.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase font-mono">
                        {qa.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#0A1128] pt-1">
                        {language === 'am' ? qa.amharicQuestion : qa.question}
                      </h3>
                      <span className="text-[11px] text-slate-500 block">
                        {qa.asker} • {qa.date}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <strong className="text-[#0A1128]">{qa.advocateName}</strong>
                        <span className="text-[10px] font-mono text-slate-500">{qa.advocateLicense}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {language === 'am' ? qa.amharicAnswer : qa.answer}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-800 block">
                        Statutory Basis: {qa.statutoryBasis}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: LegalMatch-Style "Present Your Case Free" Box + Quick Links */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-[#0A1128] text-white rounded-3xl p-7 shadow-lg space-y-5">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold uppercase">
                  Free Advocate Matching
                </span>
                <h2 className="text-xl font-black leading-snug">
                  Need a Licensed Ethiopian Advocate?
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Present your legal issue in minutes and connect directly with verified Federal or Regional advocates.
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No fee to present your case</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Private &amp; role-restricted inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero obligation to hire</span>
                </li>
              </ul>

              <Link
                href="/find-a-lawyer"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Present Your Case Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Resource Links */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs">
              <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block">
                More Free LegalLink Tools
              </strong>
              <Link
                href="/lexdraft"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span>LexDraft Bilingual Forms</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </Link>
              <Link
                href="/library"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span>122 Federal Proclamations</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </Link>
              <Link
                href="/nextgen"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-[#0A1128]"
              >
                <span>NextGen Law Student Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Ask a Free Anonymous Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs relative">
            <button
              type="button"
              onClick={() => setAskModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-900 bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-700">
                100% Anonymous &amp; Free
              </span>
              <h3 className="text-lg font-black text-[#0A1128]">Ask an Ethiopian Legal Question</h3>
              <p className="text-slate-600">
                Do not include full names, ID numbers, or phone numbers—this is for general legal guidance.
              </p>
            </div>

            {qError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{qError}</span>
              </div>
            )}

            {qSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Question submitted! Advocates can now review and respond.</span>
              </div>
            )}

            <form onSubmit={handleAskQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Legal Category *</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Corporate & Business">Corporate &amp; Business</option>
                    <option value="Property & Real Estate">Property &amp; Real Estate</option>
                    <option value="Employment & Labour">Employment &amp; Labour</option>
                    <option value="Family & Inheritance">Family &amp; Inheritance</option>
                    <option value="Diaspora & Immigration">Diaspora &amp; Immigration</option>
                    <option value="Criminal & Litigation">Criminal &amp; Litigation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">City / Region *</label>
                  <select
                    value={qCity}
                    onChange={(e) => setQCity(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  >
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Adama / Oromia">Adama / Oromia</option>
                    <option value="Bahir Dar / Amhara">Bahir Dar / Amhara</option>
                    <option value="Hawassa / Sidama">Hawassa / Sidama</option>
                    <option value="Mekelle / Tigray">Mekelle / Tigray</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Diaspora (Abroad)">Diaspora (Abroad)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Your Question (English or Amharic) *</label>
                <textarea
                  rows={4}
                  maxLength={500}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="E.g. My employer ended my contract after 2 years without written notice. What severance am I entitled to under Proclamation 1156/2019?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAskModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={qSubmitting}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {qSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Post Question Free</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Technologies PLC. General legal information only — not formal legal advice.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}