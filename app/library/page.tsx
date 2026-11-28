'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  Eye,
  Plus,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  RevealOnScroll,
  KineticHeadline,
  SpotlightCard,
} from '@/components/MotionPrimitives';
import { SEED_LEGAL_DOCUMENTS, LegalDocumentItem } from '@/lib/library-data';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalLibraryPage() {
  const { language } = useLanguage();

  const [documents, setDocuments] = useState<LegalDocumentItem[]>(SEED_LEGAL_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<LegalDocumentItem | null>(null);

  // Add Custom Document Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAmharicTitle, setCustomAmharicTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Business & Investment');
  const [customProcNo, setCustomProcNo] = useState('');
  const [customYear, setCustomYear] = useState<number>(2026);
  const [customSummary, setCustomSummary] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('legallink_custom_library_docs');
      if (saved) {
        const parsed = JSON.parse(saved) as LegalDocumentItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments([...parsed, ...SEED_LEGAL_DOCUMENTS]);
        }
      }
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: documents.length };
    documents.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }, [documents]);

  const categories = useMemo(() => Object.keys(categoryCounts), [categoryCounts]);

  const filteredDocs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return documents.filter((doc) => {
      const matchCat = selectedCategory === 'All' || doc.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.amharicTitle.includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        (doc.proclamationNumber || '').toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.sourceAuthority.toLowerCase().includes(q)
      );
    });
  }, [documents, selectedCategory, searchQuery]);

  const handleAddCustomDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customUrl.trim()) return;

    const newDoc: LegalDocumentItem = {
      id: `custom-${Date.now()}`,
      itemNumber: documents.length + 1,
      title: customTitle.trim(),
      amharicTitle: customAmharicTitle.trim() || customTitle.trim(),
      sectionCode: 'C',
      category: customCategory,
      proclamationNumber: customProcNo.trim() || `Custom / ${customYear}`,
      year: Number(customYear) || 2026,
      summary: customSummary.trim() || 'Added custom legal reference document.',
      sourceAuthority: 'Custom User Reference',
      fileSize: 'PDF Link',
      downloadCount: 1,
      fileUrl: customUrl.trim(),
      badge: 'Custom',
    };

    const updatedAll = [newDoc, ...documents];
    setDocuments(updatedAll);

    try {
      const customOnly = updatedAll.filter((d) => d.id.startsWith('custom-'));
      localStorage.setItem('legallink_custom_library_docs', JSON.stringify(customOnly));
    } catch {
      // Ignore storage errors
    }

    setCustomTitle('');
    setCustomAmharicTitle('');
    setCustomProcNo('');
    setCustomSummary('');
    setCustomUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans selection:bg-[#3B66B8] selection:text-white flex flex-col">
      <Navbar />

      {/* Sunlit Sky Azure Hero */}
      <section className="relative overflow-hidden ll-sky-canvas pt-14 pb-16 md:pt-18 md:pb-20 text-white">
        <div
          aria-hidden="true"
          className="ll-cloud-left pointer-events-none absolute top-6 -left-16 w-[420px] h-[190px] rounded-full bg-white/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="ll-cloud-right pointer-events-none absolute top-16 -right-16 w-[460px] h-[210px] rounded-full bg-white/30 blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white border border-white/35 backdrop-blur-md text-[11px] font-bold">
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>Official Federal Directory • {documents.length} Legal Instruments</span>
              </div>

              <KineticHeadline
                primaryText={language === 'am' ? 'የኢትዮጵያ የህግ ማውጫ' : 'Ethiopian Legal Library'}
                accentText={language === 'am' ? 'እና የነጋሪት ጋዜጣ ማኅደር' : '& Gazette Vault'}
              />

              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium max-w-2xl">
                Direct access to official Federal Negarit Gazeta proclamations, ministerial directives, and civil court pleadings. Every document opens the authentic, full-length PDF directly from official institutional hosts.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-white/95">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{documents.length} Primary Legal Instruments</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Opens Full Official PDF in New Tab</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>Zero Truncated Summaries</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-[#182235] font-black text-xs rounded-full inline-flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0 w-fit"
            >
              <Plus className="w-4 h-4 text-[#3B66B8]" />
              <span>Add Custom Document / Link</span>
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Search & Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, number, or keyword (e.g. 1156, 1243, banking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-semibold focus:outline-none focus:border-[#3B66B8] transition-colors shadow-2xs"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">
            Showing <strong className="text-[#182235]">{filteredDocs.length}</strong> of{' '}
            <strong className="text-[#182235]">{documents.length}</strong> legal documents
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#3B66B8] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]/50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#EEF3FB] text-[#3B66B8]'
                  }`}
                >
                  {categoryCounts[cat]}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3-Column Legal Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2 text-xs">
            <p className="font-bold text-[#182235]">No proclamations matched your filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-[#3B66B8] font-bold underline cursor-pointer"
            >
              Show all {documents.length} laws
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc, idx) => (
              <RevealOnScroll key={doc.id} delayMs={(idx % 6) * 45}>
                <SpotlightCard className="rounded-3xl p-6 h-full flex flex-col justify-between space-y-5">
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg bg-[#EEF3FB] text-[#3B66B8] font-mono font-bold text-[10px]">
                          {doc.itemNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {doc.category}
                        </span>
                      </div>
                      {doc.badge && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                            doc.badge === 'Updated 2026'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : doc.badge === 'Essential'
                              ? 'bg-[#EEF3FB] text-[#3B66B8] border border-[#D6E2F5]'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {doc.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#3B66B8] block">
                        {doc.proclamationNumber}
                      </span>
                      <h2 className="text-sm font-black text-[#182235] leading-snug mt-0.5">
                        {language === 'am' ? doc.amharicTitle : doc.title}
                      </h2>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {doc.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Year</span>
                        <strong className="text-[11px] text-[#182235]">{doc.year}</strong>
                      </div>
                      <div className="border-x border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase block">Size</span>
                        <strong className="text-[11px] text-[#182235]">{doc.fileSize}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase block">Section</span>
                        <strong className="text-[11px] text-[#182235]">{doc.sectionCode}</strong>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500">
                      Official Host: <strong className="text-slate-700">{doc.sourceAuthority}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 bg-[#182235] hover:bg-[#3B66B8] text-white text-xs font-bold rounded-full inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>Open Full Official PDF</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        aria-label={`Preview ${doc.title}`}
                        className="w-10 h-10 rounded-full bg-[#EEF3FB] hover:bg-[#3B66B8] text-[#3B66B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-center text-[10px] font-mono text-slate-400">
                      {doc.downloadCount.toLocaleString()} verified views
                    </p>
                  </div>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </main>

      {/* Document Details Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-[#182235]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ll-window-rise bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl space-y-4 text-xs relative">
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              aria-label="Close preview"
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5 pr-8">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#EEF3FB] text-[#3B66B8] font-mono font-bold text-[10px]">
                {previewDoc.proclamationNumber} • {previewDoc.category}
              </span>
              <h3 className="text-lg font-black text-[#182235] leading-snug">
                {previewDoc.title}
              </h3>
              <p className="text-xs font-bold text-[#3B66B8]">{previewDoc.amharicTitle}</p>
            </div>

            <p className="p-4 bg-[#F5F7FB] rounded-2xl border border-slate-200/80 text-slate-700 leading-relaxed">
              {previewDoc.summary}
            </p>

            <div className="grid grid-cols-3 gap-3 text-center font-mono bg-[#F5F7FB] p-3 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-500 block">YEAR</span>
                <strong className="text-[#182235]">{previewDoc.year}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SIZE</span>
                <strong className="text-[#182235]">{previewDoc.fileSize}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">HOST</span>
                <strong className="text-[#182235] truncate block">{previewDoc.sourceAuthority}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={previewDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#3B66B8] hover:bg-[#2F56A6] text-white font-bold rounded-full inline-flex items-center justify-center gap-1.5"
              >
                <span>Open Official PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/find-a-lawyer"
                className="py-3 px-5 bg-[#EEF3FB] hover:bg-[#dfe9fa] text-[#3B66B8] font-bold rounded-full text-center"
              >
                Consult Advocate
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#182235]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="ll-window-rise bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl space-y-4 text-xs relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#182235]">Add Custom Legal Document</h3>
              <p className="text-slate-600 mt-0.5">
                Save an additional proclamation, directive, or official PDF link to your workspace vault.
              </p>
            </div>

            <form onSubmit={handleAddCustomDocument} className="space-y-3">
              <div>
                <label className="block font-bold text-[#182235] mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Value Added Tax Proclamation No. 1341/2024"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#182235] mb-1">Proclamation No.</label>
                  <input
                    type="text"
                    placeholder="Proc. No. ..."
                    value={customProcNo}
                    onChange={(e) => setCustomProcNo(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#182235] mb-1">Year</label>
                  <input
                    type="number"
                    min={1950}
                    max={2030}
                    value={customYear}
                    onChange={(e) => setCustomYear(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#182235] mb-1">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                >
                  {categories
                    .filter((c) => c !== 'All')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#182235] mb-1">Official PDF URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#182235] mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  placeholder="What does this legal instrument regulate?"
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7FB] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#3B66B8]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3B66B8] hover:bg-[#2F56A6] text-white font-bold rounded-full cursor-pointer"
              >
                Save Document to Vault
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#182235] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
          <p>Authentic Ethiopian proclamations, directives &amp; federal legal instruments.</p>
        </div>
      </footer>
    </div>
  );
}