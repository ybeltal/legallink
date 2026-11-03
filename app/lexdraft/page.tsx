'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, ArrowRight, ShieldCheck, 
  Search, Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LEXDRAFT_TEMPLATES } from '@/lib/lexdraft-templates';
import { useLanguage } from '@/context/LanguageContext';

export default function LexDraftHubPage() {
  const { language } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [myDocuments, setMyDocuments] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('legallink_my_documents');
      if (saved) {
        setMyDocuments(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const categories = ['All', 'Labour Law', 'Property Law', 'Commercial', 'Compliance', 'Diaspora', 'Financial'];

  const filteredTemplates = LEXDRAFT_TEMPLATES.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      tpl.title.toLowerCase().includes(query) ||
      tpl.amharicTitle.includes(query) ||
      tpl.description.toLowerCase().includes(query) ||
      tpl.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleDeleteDoc = (id: string) => {
    const updated = myDocuments.filter((d) => d.id !== id);
    setMyDocuments(updated);
    localStorage.setItem('legallink_my_documents', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <section className="bg-white border-b border-slate-200 pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>LexDraft</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' ? 'ህጋዊ ሰነዶች፣ በደቂቃዎች ውስጥ ዝግጁ።' : 'Legal documents, ready in minutes.'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
            {language === 'am'
              ? 'በኢትዮጵያ ህግ መሰረት የተዘጋጁ የውል ሰነዶችን በቀላሉ ያዘጋጁ። እያንዳንዱ ሰነድ ወቅታዊውን ህግ የተከተለና ከመፈረሙ በፊት በጠበቃ የተረጋገጠ ነው።'
              : 'Generate compliant Ethiopian legal contracts from guided templates. Every document follows current law and is reviewed by a licensed lawyer before you sign.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'am' ? 'የኢትዮጵያ ህግ ተገዢ' : 'Ethiopian law compliant'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{language === 'am' ? 'በጠበቃ የተመረመረ' : 'Lawyer-reviewed'}</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
              {language === 'am' ? 'የሰነዶች ማውጫ' : 'Template Library'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'am' ? 'ሰነድዎን ማዘጋጀት ለመጀመር አንድ የውል አይነት ይምረጡ።' : 'Select a template to start generating your document.'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={language === 'am' ? 'የውል አይነት ይፈልጉ...' : 'Search templates...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="card-hover bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {language === 'am' ? tpl.amharicCategory : tpl.category}
                    </span>

                    {tpl.badge && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tpl.badge === 'Most Popular'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {tpl.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#0A1128]">
                      {language === 'am' ? tpl.amharicTitle : tpl.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal mt-1 line-clamp-3">
                      {language === 'am' ? tpl.amharicDescription : tpl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-black text-[#0A1128] block">
                      ETB {tpl.priceETB}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {tpl.pageCount}
                    </span>
                  </div>

                  <Link
                    href={`/lexdraft/${tpl.id}`}
                    className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs group cursor-pointer"
                  >
                    <span>Generate</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#0A1128]">
              {language === 'am' ? 'የእኔ ሰነዶች' : 'My Documents'}
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {myDocuments.length} {myDocuments.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          {myDocuments.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-xs max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-normal">
                {language === 'am'
                  ? 'እስካሁን ምንም ሰነድ አልተዘጋጀም። የመጀመሪያዎን ውል ከላይ ይምረጡ።'
                  : 'No documents yet. Generate your first contract above.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-[#0A1128] block">{doc.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono block">{doc.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Every contract drafted via LexDraft follows certified Ethiopian statutory templates.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}