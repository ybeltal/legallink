'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Globe,
} from 'lucide-react';
import {
  ETHIOPIAN_LEGAL_TEMPLATES,
  LegalTemplate,
  DocLanguageMode,
  findTemplateByIdOrQuery,
  getFormattedDocument,
} from '../page';

export default function LexDraftGeneratorClient({ templateId }: { templateId: string }) {
  const router = useRouter();

  const template: LegalTemplate =
    findTemplateByIdOrQuery(templateId) || ETHIOPIAN_LEGAL_TEMPLATES[0];

  const [docLang, setDocLang] = useState<DocLanguageMode>('bilingual');
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.fields.forEach((f) => {
      if (f.defaultValue) initial[f.id] = f.defaultValue;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);

  const handleFieldChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const generatedText = getFormattedDocument(template, formValues, docLang);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${template.title}</title></head>
      <body style="font-family: 'Nyala', 'Abyssinica SIL', 'Times New Roman', serif; font-size: 12pt; line-height: 1.65; white-space: pre-wrap;">${generatedText}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}-${docLang}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Unified White Header Matching Landing Page + Back Arrow */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/find-a-lawyer" className="hover:text-[#0A1128] transition-colors">Find a Lawyer</Link>
            <Link href="/for-lawyers" className="hover:text-[#0A1128] transition-colors">For Lawyers</Link>
            <Link href="/legaltalk" className="hover:text-[#0A1128] transition-colors">LegalTalk</Link>
            <Link href="/lexdraft" className="text-[#0A1128] font-bold">LexDraft</Link>
            <Link href="/library" className="hover:text-[#0A1128] transition-colors">Library</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/lexdraft" className="text-xs font-bold text-slate-600 hover:text-[#0A1128]">
              All Forms
            </Link>
            <Link
              href="/find-a-lawyer"
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5 transition-all"
            >
              <span>Find a Lawyer</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/lexdraft"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A1128]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Legal Templates</span>
          </Link>

          {/* Language Toggle */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-2" />
            <button
              type="button"
              onClick={() => setDocLang('am')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                docLang === 'am' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማርኛ ብቻ
            </button>
            <button
              type="button"
              onClick={() => setDocLang('bilingual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                docLang === 'bilingual'
                  ? 'bg-[#0A1128] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማርኛ + English
            </button>
            <button
              type="button"
              onClick={() => setDocLang('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                docLang === 'en' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English Only
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Questions (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {template.category}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#0A1128] pt-1">
                {template.title}
              </h1>
              <p className="text-xs font-bold text-emerald-700">{template.amharicTitle}</p>
              <p className="text-xs text-slate-500">{template.legalBasis}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Step 1: Fill in the Required Details / መረጃዎችን ይሙሉ
              </h2>

              {template.fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {field.amharicLabel ? (
                      <>
                        <span className="text-emerald-800">{field.amharicLabel}</span>
                        <span className="text-slate-500 font-semibold"> — {field.label}</span>
                      </>
                    ) : (
                      field.label
                    )}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Output (6 cols) */}
          <div className="lg:col-span-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 sticky top-24">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0A1128]" />
                <h2 className="text-sm font-black text-[#0A1128]">
                  Step 2: Completed Legal Draft ({docLang === 'am' ? 'አማርኛ' : docLang === 'en' ? 'English' : 'አማርኛ + English'})
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWord}
                  className="px-3.5 py-1.5 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Word (.doc)</span>
                </button>
              </div>
            </div>

            <pre className="w-full p-6 bg-white border border-slate-200 rounded-2xl text-xs font-serif text-slate-900 whitespace-pre-wrap leading-relaxed max-h-[580px] overflow-y-auto">
              {generatedText}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}