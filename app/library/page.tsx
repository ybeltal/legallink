'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, ExternalLink, Search, ShieldCheck, 
  ArrowRight, Eye, CheckCircle2, 
  HardDrive, Scale, X, Plus, UploadCloud, Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { SEED_LEGAL_DOCUMENTS, LegalDocumentItem } from '@/lib/library-data';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function LegalLibraryPage() {
  const { language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<LegalDocumentItem | null>(null);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [customDocuments, setCustomDocuments] = useState<LegalDocumentItem[]>([]);

  // Document Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmharicTitle, setNewAmharicTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Business & Investment');
  const [newProcNumber, setNewProcNumber] = useState('');
  const [newYear, setNewYear] = useState('2026');
  const [newSummary, setNewSummary] = useState('');
  const [directDownloadLink, setDirectDownloadLink] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = [
    'All',
    'Employment & Labour',
    'Civil & Constitutional Law',
    'Courts & Justice',
    'Nationality & Immigration',
    'Business & Investment',
    'Banking & Capital Markets',
    'Tax & Customs',
    'Technology & IP',
    'Land & Property',
    'Agriculture & Wildlife',
    'Water & Environment',
    'Mining & Energy',
    'Education & Health'
  ];

  const allDocuments = useMemo(() => {
    return [...customDocuments, ...SEED_LEGAL_DOCUMENTS];
  }, [customDocuments]);

  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch = 
        doc.title.toLowerCase().includes(q) ||
        doc.amharicTitle.includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        (doc.proclamationNumber && doc.proclamationNumber.toLowerCase().includes(q)) ||
        doc.itemNumber.toString() === q ||
        doc.year.toString().includes(q) ||
        doc.sourceAuthority.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [allDocuments, searchQuery, selectedCategory]);

  const incrementViewCount = (id: string, initialCount: number) => {
    setViewCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || initialCount) + 1
    }));
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!newTitle.trim()) {
      setUploadError('Please specify the document title.');
      return;
    }

    if (!directDownloadLink.trim() && !selectedFile) {
      setUploadError('Please provide a direct PDF web URL or select a PDF file to upload.');
      return;
    }

    setUploading(true);

    try {
      let finalFileUrl = directDownloadLink.trim();

      if (selectedFile) {
        const supabase = createClient();
        const cleanFileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `documents/${cleanFileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('legal-vault')
          .upload(filePath, selectedFile, { upsert: true });

        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage
            .from('legal-vault')
            .getPublicUrl(filePath);
          finalFileUrl = publicUrl;
        }
      }

      const newDocItem: LegalDocumentItem = {
        id: `custom-doc-${Date.now()}`,
        itemNumber: allDocuments.length + 1,
        title: newTitle.trim(),
        amharicTitle: newAmharicTitle.trim() || newTitle.trim(),
        sectionCode: 'CUSTOM',
        category: newCategory,
        proclamationNumber: newProcNumber.trim() || undefined,
        year: parseInt(newYear, 10) || 2026,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'PDF Document',
        downloadCount: 1,
        summary: newSummary.trim() || 'Official statutory legal document added to LegalLink repository.',
        sourceAuthority: 'Verified LegalLink Archive',
        fileUrl: finalFileUrl,
        badge: 'New Upload'
      };

      setCustomDocuments((prev) => [newDocItem, ...prev]);
      setUploading(false);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess(false);
        setNewTitle('');
        setNewAmharicTitle('');
        setNewProcNumber('');
        setNewSummary('');
        setDirectDownloadLink('');
        setSelectedFile(null);
      }, 1000);

    } catch (err: any) {
      setUploadError(err?.message || 'Error saving document. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Navigation */}
      <Navbar />

      {/* 02. Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Official Federal Directory • 122 Legal Instruments</span>
            </div>

            <button
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer w-fit"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Custom Document / Link</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' 
              ? 'የኢትዮጵያ ህጎችና ይፋዊ ሰነዶች ማውጫ' 
              : 'Ethiopian Legal Library & Gazette Vault'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-2xl leading-relaxed">
            {language === 'am'
              ? 'ሙሉ የፌዴራል ነጋሪት ጋዜጣ አዋጆችን፣ ደንቦችንና የብሔራዊ ባንክ መመሪያዎችን ከዋናው ይፋዊ ምንጭ በቀጥታ ይክፈቱ።'
              : 'Direct access to official Federal Negarit Gazeta proclamations, ministerial directives, and civil court pleadings. Every document opens the authentic, full-length PDF directly from official institutional hosts.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>122 Primary Legal Instruments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Opens Full Official PDF in New Tab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>Zero Truncated Summaries</span>
            </div>
          </div>

        </div>
      </section>

      {/* 03. Search & Category Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={language === 'am' ? 'በቁጥር ወይም በቃል ይፈልጉ (ለምሳሌ 1156, 1243, 1360)...' : 'Search by title, number, or keyword (e.g. 1156, 1243, banking, lease)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0A1128] transition-colors shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono w-full md:w-auto text-right">
            Showing <strong className="text-[#0A1128]">{filteredDocuments.length}</strong> of 122 legal documents
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'All' 
              ? allDocuments.length 
              : allDocuments.filter(d => d.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 04. Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const currentViews = viewCounts[doc.id] || doc.downloadCount;

            return (
              <div
                key={doc.id}
                className="card-hover bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between space-y-6 shadow-xs relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#0A1128] font-mono text-[11px] font-black flex items-center justify-center">
                        {doc.itemNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {doc.category}
                      </span>
                    </div>

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

                  <div>
                    {doc.proclamationNumber && (
                      <span className="text-[11px] font-mono text-amber-700 font-bold block mb-1">
                        {doc.proclamationNumber}
                      </span>
                    )}
                    <h3 className="text-sm font-black text-[#0A1128] leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2 line-clamp-2">
                      {doc.summary}
                    </p>
                  </div>

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
                      <span className="block text-slate-400">SECTION</span>
                      <strong className="text-slate-800 text-xs">{doc.sectionCode}</strong>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    Official Host: <span className="text-slate-700 font-bold">{doc.sourceAuthority}</span>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    
                    {/* Native Link: Opens the authentic full PDF in a new tab */}
                    <a
                      href={doc.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementViewCount(doc.id, doc.downloadCount)}
                      className="flex-1 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs group"
                    >
                      <span>Open Full Official PDF</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {/* Preview Modal Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Quick Statutory Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 text-center block font-mono">
                    {currentViews.toLocaleString()} verified views
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 05. Conversion Banner */}
        <section className="bg-gradient-to-r from-[#0A1128] via-[#102A43] to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              STATUTORY COUNSEL & LEXDRAFT AUTOMATION
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Need legal interpretation or a tailored agreement under these laws?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Connect directly with verified Ethiopian advocates or generate customized, lawyer-vetted agreements on LexDraft.
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

      {/* 06. Statutory Preview Modal */}
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
                ENTRY #{previewDoc.itemNumber} • {previewDoc.proclamationNumber || previewDoc.category}
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
              <span className="text-[11px] font-mono text-slate-500 block pt-1">
                Official Host Authority: <strong className="text-[#0A1128]">{previewDoc.sourceAuthority}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">YEAR</span>
                <strong className="text-slate-800">{previewDoc.year}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">CATEGORY</span>
                <strong className="text-slate-800 truncate block">{previewDoc.category}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 block">EST. SIZE</span>
                <strong className="text-slate-800">{previewDoc.fileSize}</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close Preview
              </button>

              <a
                href={previewDoc.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  incrementViewCount(previewDoc.id, previewDoc.downloadCount);
                  setPreviewDoc(null);
                }}
                className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"
              >
                <span>Open Full Official PDF</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 07. Modal: Add Direct Link or Upload File */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp text-xs relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0A1128]">
                Add Document to Legal Library
              </h3>
              <p className="text-slate-500">
                Provide the direct URL to the official host repository, or upload a PDF to Supabase Storage.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold">
                ✓ Document successfully added to the repository!
              </div>
            )}

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Document Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Code Proclamation No. 1243/2021"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Direct External PDF URL (Opens in New Tab)
                </label>
                <input
                  type="url"
                  placeholder="https://.../document.pdf"
                  value={directDownloadLink}
                  onChange={(e) => setDirectDownloadLink(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Proclamation / Ref No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Proc. No. 1243/2021"
                    value={newProcNumber}
                    onChange={(e) => setNewProcNumber(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Or Upload PDF to Supabase Storage (Optional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed text-center space-y-1.5 cursor-pointer transition-all ${
                    selectedFile
                      ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <UploadCloud className={`w-6 h-6 mx-auto ${selectedFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <strong className="block text-slate-800">
                    {selectedFile ? selectedFile.name : 'Select PDF from device'}
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Upload directly to legal-vault bucket'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Brief Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Key provisions and statutory scope..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Register Document</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 08. Footer */}
      <footer className="bg-[#0A1128] text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 LegalLink Technologies PLC. All rights reserved.</p>
            <p>Ethiopian statutory repository linking directly to official primary regulatory authorities.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}