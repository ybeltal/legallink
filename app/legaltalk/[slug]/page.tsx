'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, Calendar, Clock, User, 
  ShieldCheck, Share2, Bookmark, Play, Pause, 
  Scale, CheckCircle2, ChevronRight, AlertCircle, Headphones
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LEGAL_ARTICLES } from '@/lib/legaltalk-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalTalkArticleReader() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Look up current article or fallback to first
  const article = LEGAL_ARTICLES.find((a) => a.slug === slug) || LEGAL_ARTICLES[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Dark Hero Header (matches image_035aa1.png) */}
      <header className="bg-[#0A1128] text-white pt-10 pb-16 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Back to LegalTalk Breadcrumb */}
          <Link
            href="/legaltalk"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>LegalTalk</span>
          </Link>

          {/* Category Tag */}
          <div className="pt-1">
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-400 border border-white/15 text-[10px] font-black uppercase tracking-wider font-mono">
              {language === 'am' ? article.amharicCategory : article.category}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {language === 'am' ? article.amharicTitle : article.title}
          </h1>

          {/* Author Byline & Meta */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                  {article.author.split(' ')[1]?.[0] || 'A'}
                </div>
                <div>
                  <span className="text-white font-bold block">
                    {language === 'am' ? article.amharicAuthor : article.author}
                  </span>
                  <span className="text-[10px] text-slate-400">{article.authorRole}</span>
                </div>
              </div>

              <span className="hidden sm:inline text-slate-600">•</span>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.date}</span>
              </div>

              <span className="hidden sm:inline text-slate-600">•</span>

              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime} read</span>
              </div>
            </div>

            {/* Audio Summary Quick-Play */}
            {article.audioDuration && (
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                <span>{isPlayingAudio ? 'Pause Audio Summary' : `Listen (${article.audioDuration})`}</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 3. Main Article Body Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        
        {/* Article Content Typography */}
        <article className="bg-white p-8 sm:p-14 rounded-3xl border border-slate-200 shadow-xs space-y-8 text-slate-800 text-sm leading-relaxed">
          
          {/* Lead Summary Paragraph */}
          <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
            {article.content.lead}
          </p>

          {/* Dynamic Article Sections */}
          {article.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-4 pt-4">
              <h2 className="text-lg sm:text-xl font-black text-[#0A1128] tracking-tight">
                {sec.heading}
              </h2>

              {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-600 font-normal leading-relaxed">
                  {p}
                </p>
              ))}

              {sec.bullets && (
                <ul className="space-y-2 pt-1 text-slate-700">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span className="font-normal">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {sec.callout && (
                <div className="p-5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl my-4 text-xs font-medium text-amber-950 leading-relaxed">
                  {sec.callout}
                </div>
              )}
            </div>
          ))}

        </article>

        {/* 4. Contextual Counsel Matching Card (matches image_035aa1.png bottom CTA) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <strong className="text-base font-black text-[#0A1128] block">
              Need help with this?
            </strong>
            <p className="text-xs text-slate-500 font-normal max-w-xl">
              Connect with a verified Ethiopian lawyer who specialises in{' '}
              <strong className="text-slate-800 font-semibold">{article.category}</strong>. Get expert advice tailored to your exact situation.
            </p>
          </div>

          <Link
            href={`/find-a-lawyer?category=${article.categoryParam}`}
            className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-all shadow-sm group shrink-0"
          >
            <span>Submit a request</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

      </main>

      {/* 5. Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Direct representation provided exclusively by licensed Ethiopian advocates.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}