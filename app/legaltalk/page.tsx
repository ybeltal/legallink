'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Scale,
  Headphones,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  RevealOnScroll,
  KineticHeadline,
  SpotlightCard,
} from '@/components/MotionPrimitives';
import { LEGAL_ARTICLES, VERIFIED_QA_DATA } from '@/lib/legaltalk-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalTalkDirectoryPage() {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'guides' | 'qa'>('guides');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Employee Rights',
    'Business Law',
    'Property Law',
    'Family Law',
    'Compliance',
    'Tax & Finance',
    'Diaspora',
    'LegalTech',
  ];

  const filteredArticles = LEGAL_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(query) ||
      art.amharicTitle.includes(query) ||
      art.excerpt.toLowerCase().includes(query) ||
      art.amharicExcerpt.includes(query) ||
      art.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredQA = VERIFIED_QA_DATA.filter((qa) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      qa.question.toLowerCase().includes(query) ||
      qa.amharicQuestion.includes(query) ||
      qa.category.toLowerCase().includes(query) ||
      qa.statutoryBasis.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      <Navbar />

      {/* Sunlit Sky Azure Hero */}
      <section className="relative overflow-hidden ll-sky-canvas pt-14 pb-16 md:pt-20 md:pb-20 text-white">
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-8 -left-20 w-[420px] h-[190px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-20 -right-20 w-[460px] h-[210px] rounded-full bg-white/30 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/35 backdrop-blur-md text-[11px] font-bold">
            <Headphones className="w-3.5 h-3.5 text-amber-300" />
            <span>LegalTalk • {LEGAL_ARTICLES.length} Audio-Enabled Guides</span>
          </div>

          <div className="max-w-3xl mx-auto">
            <KineticHeadline
              primaryText={language === 'am' ? 'የህግ እውቀት' : 'Legal insights for'}
              accentText={language === 'am' ? 'ለእያንዳንዱ ኢትዮጵያዊ' : 'everyday Ethiopians'}
            />
          </div>

          <p className="text-xs sm:text-sm text-white/95 font-medium max-w-2xl mx-auto leading-relaxed">
            {language === 'am'
              ? 'በቀላል ቋንቋ የቀረቡ የኢትዮጵያ ህግ ጽሑፎች — በስራ ቦታ ያለዎትን መብት፣ ንግድ መጀመር፣ የቤት ኪራይ፣ የቤተሰብ ሕግ እና የታክስ ተገዢነትን የሚዳስሱ።'
              : 'Plain-language articles on Ethiopian law — covering employment rights, starting a company, leases, family law, data protection, trademarks, and tax compliance.'}
          </p>

          <div className="pt-3 flex justify-center">
            <div className="p-1.5 bg-white/20 border border-white/35 backdrop-blur-md rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('guides')}
                className={`px-5 py-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 'guides'
                    ? 'bg-white text-[#182235] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Editorial Guides ({LEGAL_ARTICLES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`px-5 py-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 'qa'
                    ? 'bg-white text-[#182235] shadow-xs'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Verified Counsel Q&amp;A ({VERIFIED_QA_DATA.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Filter & Search Bar */}
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
                        ? 'bg-[#3B66B8] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]/50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          <div className="relative w-full md:w-72 ml-auto shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={activeTab === 'guides' ? 'Search articles...' : 'Search legal questions...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-semibold focus:outline-none focus:border-[#3B66B8] transition-colors shadow-2xs"
            />
          </div>
        </div>

        {/* Editorial Guides Grid */}
        {activeTab === 'guides' && (
          <>
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2 text-xs">
                <p className="font-bold text-[#182235]">No articles matched your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-[#3B66B8] font-bold underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art, idx) => (
                  <RevealOnScroll key={art.slug} delayMs={(idx % 6) * 55}>
                    <Link href={`/legaltalk/${art.slug}`} className="block h-full group">
                      <SpotlightCard className="rounded-3xl overflow-hidden h-full flex flex-col justify-between">
                        <div>
                          <div className="h-48 relative overflow-hidden bg-[#182235] flex flex-col justify-end p-5">
                            <img
                              src={art.imageUrl}
                              alt={language === 'am' ? art.amharicTitle : art.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                              className="absolute inset-0 w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#182235]/90 via-[#182235]/25 to-transparent" />

                            <div className="relative z-10 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/25 bg-[#182235]/75 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                                {language === 'am' ? art.amharicCategory : art.category}
                              </span>
                              {art.audioDuration && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#182235] text-[10px] font-mono font-black shadow-xs">
                                  <Headphones className="w-3 h-3 text-[#3B66B8]" />
                                  <span>{art.audioDuration}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-6 space-y-3 relative z-10">
                            <h2 className="text-base font-black text-[#182235] group-hover:text-[#3B66B8] transition-colors leading-snug">
                              {language === 'am' ? art.amharicTitle : art.title}
                            </h2>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                              {language === 'am' ? art.amharicExcerpt : art.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono relative z-10">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#3B66B8]" />
                              <span>{art.date}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#3B66B8]" />
                              <span>{art.readTime}</span>
                            </span>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3B66B8] group-hover:translate-x-1 transition-all" />
                        </div>
                      </SpotlightCard>
                    </Link>
                  </RevealOnScroll>
                ))}
              </div>
            )}
          </>
        )}

        {/* Verified Counsel Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {filteredQA.map((qa, idx) => (
              <RevealOnScroll key={qa.id} delayMs={idx * 70}>
                <SpotlightCard className="rounded-3xl p-7 sm:p-8 space-y-5">
                  <div className="space-y-1.5 relative z-10">
                    <span className="text-[10px] font-bold text-[#3B66B8] bg-[#EEF3FB] px-3 py-0.5 rounded-full border border-[#D6E2F5] uppercase font-mono">
                      {qa.category}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-[#182235] pt-1">
                      {language === 'am' ? qa.amharicQuestion : qa.question}
                    </h2>
                    <span className="text-[11px] text-slate-500 block">
                      {qa.asker} • {qa.date}
                    </span>
                  </div>

                  <div className="p-5 bg-[#F5F7FB] rounded-2xl border border-slate-200/70 space-y-3 text-xs leading-relaxed text-slate-700 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#3B66B8] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-[#182235]">{qa.advocateName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono ml-2">
                          License: {qa.advocateLicense}
                        </span>
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

                  <div className="flex justify-end pt-1 relative z-10">
                    <Link
                      href="/find-a-lawyer"
                      className="px-5 py-2.5 bg-[#182235] hover:bg-[#24324d] text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-all group"
                    >
                      <span>Request Free Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#182235] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
            <p>Ethiopia’s free legal knowledge repository and verified advocate directory.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}