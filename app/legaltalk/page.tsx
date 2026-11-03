'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, ArrowRight, ShieldCheck, BookOpen, MessageSquare, 
  Clock, Calendar, Sparkles, Filter, ChevronRight, User, Scale 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LEGAL_ARTICLES, VERIFIED_QA_DATA, Article } from '@/lib/legaltalk-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalTalkDirectoryPage() {
  const { language, t } = useLanguage();

  // Mode: Editorial Guides vs Verified Q&A Hub
  const [activeTab, setActiveTab] = useState<'guides' | 'qa'>('guides');

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Employee Rights', 'Business Law', 'Compliance', 'Diaspora', 'LegalTech'];

  const filteredArticles = LEGAL_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      art.title.toLowerCase().includes(query) ||
      art.amharicTitle.includes(query) ||
      art.excerpt.toLowerCase().includes(query) ||
      art.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredQA = VERIFIED_QA_DATA.filter((qa) => {
    const query = searchQuery.toLowerCase();
    return (
      qa.question.toLowerCase().includes(query) ||
      qa.amharicQuestion.includes(query) ||
      qa.category.toLowerCase().includes(query) ||
      qa.statutoryBasis.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>LegalTalk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' ? 'የህግ እውቀት ለእያንዳንዱ ኢትዮጵያዊ' : 'Legal insights for everyday Ethiopians'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-2xl mx-auto leading-relaxed">
            {language === 'am'
              ? 'በቀላል ቋንቋ የቀረቡ የኢትዮጵያ ህግ ጽሑፎች — በስራ ቦታ ያለዎትን መብት፣ ንግድ መጀመር፣ ህግ ተገዢነት እና የዲያስፖራ ጉዳዮችን የሚዳስሱ።'
              : 'Plain-language articles on Ethiopian law — covering your rights at work, starting a business, staying compliant, and more.'}
          </p>

          {/* Dual Tab Switcher: Editorial Guides vs Counsel Q&A */}
          <div className="pt-4 flex justify-center">
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('guides')}
                className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Editorial Guides ({LEGAL_ARTICLES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified Counsel Q&A ({VERIFIED_QA_DATA.length})
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Category Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {activeTab === 'guides' && (
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A1128] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          <div className="relative w-full md:w-72 ml-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={activeTab === 'guides' ? "Search articles..." : "Search legal questions..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128] transition-colors"
            />
          </div>
        </div>

        {/* ========================================================
            TAB 1: EDITORIAL ARTICLES GRID (matches image_035ee2.png)
            ======================================================== */}
        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => {
              // Header styling per card theme
              const headerClasses = 
                art.theme === 'navy'
                  ? 'bg-[#0A1128] text-white'
                  : art.theme === 'gold'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-100 text-slate-800 border-b border-slate-200';

              const pillClasses =
                art.theme === 'navy'
                  ? 'bg-white/10 text-white border-white/20'
                  : art.theme === 'gold'
                  ? 'bg-black/10 text-slate-950 border-black/15'
                  : 'bg-white text-slate-700 border-slate-200';

              return (
                <Link
                  key={art.slug}
                  href={`/legaltalk/${art.slug}`}
                  className="card-hover bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs group"
                >
                  <div>
                    {/* Top Header Block with Tag */}
                    <div className={`h-36 p-6 flex flex-col justify-end ${headerClasses}`}>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider w-fit">
                        <span>{language === 'am' ? art.amharicCategory : art.category}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-3">
                      <h2 className="text-base font-black text-[#0A1128] group-hover:text-amber-600 transition-colors leading-snug">
                        {language === 'am' ? art.amharicTitle : art.title}
                      </h2>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                        {language === 'am' ? art.amharicExcerpt : art.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Date, Read Time, Forward Arrow */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{art.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{art.readTime}</span>
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1128] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ========================================================
            TAB 2: VERIFIED COUNSEL Q&A
            ======================================================== */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {filteredQA.map((qa) => (
              <div 
                key={qa.id}
                className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 space-y-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 uppercase font-mono">
                      {qa.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-[#0A1128] pt-1">
                      {language === 'am' ? qa.amharicQuestion : qa.question}
                    </h2>
                    <span className="text-[11px] text-slate-400 block">{qa.asker} • {qa.date}</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F8FAFC] rounded-2xl border border-slate-100 space-y-3 text-xs leading-relaxed text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0A1128] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0A1128]">{qa.advocateName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">License: {qa.advocateLicense}</span>
                    </div>
                  </div>

                  <p className="font-normal pl-8">
                    {language === 'am' ? qa.amharicAnswer : qa.answer}
                  </p>

                  <div className="pt-2 pl-8 flex items-center gap-2 text-[10px] font-mono text-emerald-800">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Statutory Authority: {qa.statutoryBasis}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href={`/find-a-lawyer`}
                    className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all group"
                  >
                    <span>Book Consultation with Counsel</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* 4. Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Ethiopia's verified legal knowledge repository and advisory hub.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}