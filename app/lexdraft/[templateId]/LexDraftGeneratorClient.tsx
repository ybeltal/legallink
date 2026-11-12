'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { ETHIOPIAN_LEGAL_TEMPLATES, LegalTemplate } from '../page';

export default function LexDraftGeneratorClient({ templateId }: { templateId: string }) {
  const template: LegalTemplate =
    ETHIOPIAN_LEGAL_TEMPLATES.find((t) => t.id === templateId) || ETHIOPIAN_LEGAL_TEMPLATES[0];

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

  const generatedText = template.generateDocument(formValues);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${template.title}</title></head>
      <body style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; white-space: pre-wrap;">${generatedText}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="bg-[#0A1128] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/lexdraft" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Legal Templates</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">LexDraft Form Questionnaire</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Questions (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                {template.category}
              </span>
              <h1 className="text-xl font-black text-[#0A1128] pt-1">{template.title}</h1>
              <p className="text-xs font-bold text-emerald-700">{template.amharicTitle}</p>
              <p className="text-xs text-slate-500">{template.legalBasis}</p>
            </div>

            <div className="space-y-4">
              {template.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={formValues[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Document Output (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0A1128]" />
                <h2 className="text-sm font-black text-[#0A1128]">Completed Legal Draft</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWord}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Word (.doc)</span>
                </button>
              </div>
            </div>

            <pre className="flex-1 w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-serif text-slate-900 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {generatedText}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}