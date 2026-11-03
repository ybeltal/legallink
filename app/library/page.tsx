'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, Download, Search, ShieldCheck, 
  ExternalLink, ArrowRight, Eye, CheckCircle2, 
  Calendar, HardDrive, BookOpen, Scale, Sparkles, X, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SEED_LEGAL_DOCUMENTS, LegalDocumentItem } from '@/lib/library-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalLibraryPage() {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPractice, setSelectedPractice] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<LegalDocumentItem | null>(null);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  const categories = [
    'All',
    'Proclamations',
    'Regulations',
    'Directives',
    'Court Forms',
    'DARA Templates'
  ];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return SEED_LEGAL_DOCUMENTS.filter((doc) => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesPractice = selectedPractice === 'All' || doc.practiceArea === selectedPractice;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory && matchesPractice;

      const matchesSearch = 
        doc.title.toLowerCase().includes(q) ||
        doc.amharicTitle.includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.amharicSummary.includes(q) ||
        (doc.proclamationNumber && doc.proclamationNumber.toLowerCase().includes(q)) ||
        doc.year.toString().includes(q);

      return matchesCategory && matchesPractice && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedPractice]);

  const handleDownload = (docItem: LegalDocumentItem) => {
    // Increment local download counter
    setDownloadCounts((prev) => ({
      ...prev,
      [docItem.id]: (prev[docItem.id] || docItem.downloadCount) + 1
    }));

    // Trigger direct download
    const link = document.createElement('a');
    link.href = docItem.fileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = `${docItem.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Global Unified Navigation */}
      <Navbar />

      {/* 02. Header Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Ethiopian Legal Document Repository</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' 
              ? 'የኢትዮጵያ ህጎችና ይፋዊ ሰነዶች ማውጫ' 
              : 'Ethiopian Legal Library & Gazette Vault'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
            {language === 'am'
              ? 'የፌዴራል ነጋሪት ጋዜጣ አዋጆችን፣ ደንቦችን፣ የብሔራዊ ባንክ መመሪያዎችንና የሰነዶች ምዝገባ (DARA) ቅጾችን በነፃ ያውርዱ።'
              : 'Direct access to official Federal Negarit Gazeta proclamations, ministerial directives, civil court pleadings, and certified DARA templates — completely free to download.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Negarit Gazeta Text</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bilingual Amharic & English</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>1-Click High-Speed Vector PDF Downloads</span>
            </div>
          </div>

        </div>
      </section>

      {/* 03. Search & Category Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Search Bar & Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በአዋጅ ቁጥር ወይም በቃል ይፈልጉ (ለምሳሌ 1156)...' : 'Search by title, number, or keyword (e.g. 1156, lease, tax)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128] transition-colors shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono w-full md:w-auto text-right">
            Showing <strong className="text-[#0A1128]">{filteredDocuments.length}</strong> legal documents
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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

        {/* 04. Document Grid (12+ Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const currentDownloads = downloadCounts[doc.id] || doc.downloadCount;

            return (
              <div
                key={doc.id}
                className="card-hover bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 shadow-xs relative"
              >
                <div className="space-y-3">
                  
                  {/* Category Pill & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {language === 'am' ? doc.amharicCategory : doc.category}
                    </span>

                    {doc.badge && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        doc.badge === 'Most Downloaded'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : doc.badge === 'Essential'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {doc.badge}
                      </span>
                    )}
                  </div>

                  {/* Document Title */}
                  <div>
                    {doc.proclamationNumber && (
                      <span className="text-[11px] font-mono text-amber-700 font-bold block mb-1">
                        {doc.proclamationNumber}
                      </span>
                    )}
                    <h3 className="text-sm font-black text-[#0A1128] leading-snug">
                      {language === 'am' ? doc.amharicTitle : doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2 line-clamp-3">
                      {language === 'am' ? doc.amharicSummary : doc.summary}
                    </p>
                  </div>

                  {/* Document Meta Stats */}
                  <div className="pt-2 grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center font-mono text-[10px] text-slate-500">
                    <div>
                      <span className="block text-slate-400">YEAR</span>
                      <strong className="text-slate-800 text-xs">{doc.year}</strong>
                    </div>
                    <div className="border-x border-slate-100">
                      <span className="block text-slate-400">SIZE</span>
                      <strong className="text-slate-800 text-xs">{doc.fileSize}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400">PAGES</span>
                      <strong className="text-slate-800 text-xs">{doc.pages}</strong>
                    </div>
                  </div>

                </div>

                {/* Card Actions & Download Engine */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    
                    {/* 1-Click Direct Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(doc)}
                      className="flex-1 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download PDF</span>
                    </button>

                    {/* Preview Modal Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Quick Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                  </div>

                  {/* Download count indicator */}
                  <span className="text-[10px] text-slate-400 text-center block font-mono">
                    {currentDownloads.toLocaleString()} verified downloads
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* 05. Conversion Banner: Consult Specialist or Draft with LexDraft */}
        <section className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              LEGAL IMPLEMENTATION SUPPORT
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Need counsel or a custom agreement based on these laws?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Book a 30-minute verified consultation with a licensed advocate or generate an automated contract tailored to current Ethiopian statutory proclamations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/find-a-lawyer"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md group"
            >
              <span>Consult an Advocate</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/lexdraft"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center transition-all"
            >
              <span>Draft on LexDraft</span>
            </Link>
          </div>
        </section>

      </main>

      {/* 06. In-Browser PDF Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp text-xs relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-bold text-amber-600 font-mono uppercase">
                {previewDoc.proclamationNumber || previewDoc.category}
              </span>
              <h3 className="text-lg font-black text-[#0A1128]">
                {previewDoc.title}
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                {previewDoc.amharicTitle}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 leading-relaxed text-slate-700">
              <strong className="text-xs font-bold text-[#0A1128] block">Statutory Overview:</strong>
              <p>{previewDoc.summary}</p>
              <p className="text-slate-600 font-serif">{previewDoc.amharicSummary}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">YEAR OF ISSUE</span>
                <strong className="text-slate-800">{previewDoc.year}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">ESTIMATED PAGES</span>
                <strong className="text-slate-800">{previewDoc.pages} Pages</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">FILE SIZE</span>
                <strong className="text-slate-800">{previewDoc.fileSize}</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Official PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 07. Enterprise Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Ethiopian proclamations and directives published under public domain statutory access.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}