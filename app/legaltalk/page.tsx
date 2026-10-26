'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, ShieldCheck, Search, ArrowRight, ArrowLeft, 
  HelpCircle, BookOpen, User, CheckCircle2, ChevronRight, 
  Send, ThumbsUp, Eye, Sparkles, Scale
} from 'lucide-react';

interface LegalQuestion {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  question: string;
  answeredBy: {
    name: string;
    court: string;
    license: string;
  };
  answerText: string;
  statutoryReference: string;
  views: number;
}

const PUBLIC_QUESTIONS: LegalQuestion[] = [
  {
    id: 'q-1',
    title: 'Can a Private Limited Company (PLC) issue shares or raise equity under ECMA Directive 1030/2024?',
    category: 'Capital Markets & ESX',
    author: 'Yohannes T. (Kirkos, Addis Ababa)',
    date: '2026-10-22',
    question: 'Our technology logistics firm is incorporated as a PLC. Can we sell equity or issue public shares under the new Ethiopian Capital Market Authority regulations?',
    answeredBy: {
      name: 'Advocate Mulu Haile',
      court: 'Federal Supreme Court Advocate',
      license: 'ETH-BAR-2018-0492'
    },
    answerText: 'Under Ethiopian Commercial Code Art. 495 and ECMA Directive 1030/2024, a Private Limited Company is strictly prohibited from issuing shares to the public. To raise capital through the Ethiopian Securities Exchange (ESX) or crowd equity, you must first execute an Extraordinary General Meeting (EGM) resolution to convert the PLC into a Share Company (S.C.), audit minimum capital requirements, and register an approved prospectus with the Authority.',
    statutoryReference: 'Commercial Code 2021 Art. 495 & ECMA Directive 1030/2024 Art. 14',
    views: 1420
  },
  {
    id: 'q-2',
    title: 'What are the required legal grounds for commercial lease eviction under Civil Code Art. 2896?',
    category: 'Real Estate & Land',
    author: 'Meron K. (Bole, Addis Ababa)',
    date: '2026-10-21',
    question: 'Our commercial landlord in Bole served a 15-day eviction letter demanding a 50% rent increase midway through a 3-year signed lease. Can they terminate unilaterally?',
    answeredBy: {
      name: 'Advocate Dawit Tesfaye',
      court: 'Cassation Division Litigator',
      license: 'ETH-BAR-2015-0081'
    },
    answerText: 'Unilateral rent increments mid-lease and immediate eviction violate Civil Code Art. 2896 and standard Ethiopian lease contract precedents. A lessor cannot eject a commercial tenant without proving material contractual breach (such as proven rent default exceeding 30 days) or court-authorized municipal redevelopment decrees with statutory notice periods.',
    statutoryReference: 'Civil Code of Ethiopia Art. 2896 & Cassation Decision Vol. 18 File No. 89211',
    views: 2180
  },
  {
    id: 'q-3',
    title: 'How is statutory severance calculated during workplace redundancy under Proc. No. 1156/2019?',
    category: 'Employment & Labor',
    author: 'Abebe B. (Akaki Kality)',
    date: '2026-10-19',
    question: 'If a manufacturing company reduces its workforce due to operational downsizing, what is the mandatory severance pay for an employee of 4 years?',
    answeredBy: {
      name: 'Advocate Tigist Bekele',
      court: 'Federal High Court Advocate',
      license: 'ETH-BAR-2020-1104'
    },
    answerText: 'Pursuant to Ethiopian Labor Proclamation No. 1156/2019 Art. 39 and 40, an employee terminated due to redundancy is entitled to 30 days wages for the first completed year of service, plus 1/3 of the monthly wage for each additional year. For 4 years of service, the statutory formula equals: 1 full month salary + (3 * 1/3 month salary) = 2 full months salary.',
    statutoryReference: 'Labor Proclamation No. 1156/2019 Art. 39–40',
    views: 940
  }
];

export default function LegalTalkPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;
    setSubmittedNotice(true);
    setTimeout(() => {
      setSubmittedNotice(false);
      setShowAskModal(false);
      setNewQuestionTitle('');
      setNewQuestionText('');
    }, 2500);
  };

  const filteredQuestions = PUBLIC_QUESTIONS.filter((q) => {
    const matchesCat = selectedCategory === 'all' || q.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.answerText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <span className="font-black text-xl text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-xs font-bold">
            <Link href="/" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Home
            </Link>
            <Link href="/find-a-lawyer" className="text-slate-500 hover:text-[#0A1128] transition-colors">
              Find a Lawyer
            </Link>
            <Link href="/tools" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Legal Tools
            </Link>
            <Link 
              href="/find-a-lawyer" 
              className="px-4 py-2 bg-[#0A1128] text-white rounded-xl hover:bg-[#102A43] transition-all"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Banner with Ask a Question CTA */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ETHIOPIAN LEGAL KNOWLEDGE & Q&A HUB</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              LegalTalk: Verified Counsel Insights
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
              Read authoritative legal interpretations citing Ethiopian Commercial, Civil, and Labor proclamations, answered exclusively by licensed advocates.
            </p>
          </div>

          <button
            onClick={() => setShowAskModal(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm whitespace-nowrap self-start md:self-center"
          >
            + Ask a Legal Question
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search legal questions or statutory citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#0A1128]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'capital', label: 'Capital Markets' },
              { id: 'real estate', label: 'Real Estate' },
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

        {/* Questions and Verified Answers Feed */}
        <div className="space-y-6">
          {filteredQuestions.map((q) => (
            <div 
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-5 hover:border-slate-300 transition-all"
            >
              {/* Question Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase">
                    {q.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Asked by {q.author}</span>
                </div>
                <h2 className="text-base font-black text-[#0A1128] leading-snug">
                  {q.title}
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  {q.question}
                </p>
              </div>

              {/* Verified Lawyer Answer Box */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-slate-900">{q.answeredBy.name}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">• {q.answeredBy.court}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    {q.answeredBy.license}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {q.answerText}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Statutory Authority: <strong className="text-slate-800">{q.statutoryReference}</strong></span>
                  <Link
                    href="/find-a-lawyer"
                    className="font-bold text-[#0A1128] hover:text-amber-600 inline-flex items-center gap-1 font-sans"
                  >
                    <span>Book Consultation with Counsel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Ask a Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-xs">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                  COMMUNITY LEGAL INQUIRY
                </span>
                <h3 className="text-xl font-black text-[#0A1128] mt-0.5">Submit a Legal Question</h3>
              </div>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submittedNotice ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-sm">Question Submitted to Advocate Desk!</h4>
                <p className="text-emerald-800 text-[11px]">
                  Your question has been routed to verified advocates specializing in your topic. You will receive an SMS when an answer is published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskQuestion} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Can an employer terminate a fixed-term contract early in Addis Ababa?"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Details & Context</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Explain the background circumstances without sharing sensitive identifying information..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit Question</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink LegalTalk • Ethiopian Statutory Knowledge Hub • Ministry of Justice Accredited Advocates
      </footer>

    </div>
  );
}