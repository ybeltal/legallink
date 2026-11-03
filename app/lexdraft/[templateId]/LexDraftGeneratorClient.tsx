'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Check, ShieldCheck, FileText, 
  Download, Printer, PenTool, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { LEXDRAFT_TEMPLATES, LegalTemplate } from '@/lib/lexdraft-templates';
import { generateContractPDF } from '@/lib/pdf-generator';
import { useLanguage } from '@/context/LanguageContext';

export default function LexDraftGeneratorClient({ templateId }: { templateId: string }) {
  const { language } = useLanguage();
  const router = useRouter();

  // Find template or fallback to first
  const template: LegalTemplate = 
    LEXDRAFT_TEMPLATES.find((t) => t.id === templateId) || LEXDRAFT_TEMPLATES[0];

  // 6 Stepper Wizard: 1 (Party A) -> 2 (Party B) -> 3 (Terms) -> 4 (Preview) -> 5 (Signature) -> 6 (Submit)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form input values map
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [signatureText, setSignatureText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const currentStepFields = template.fields.filter((f) => f.step === currentStep);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const contractParagraphs = template.generateContractText(formData, language as any);

  const getFirstPartyName = () => {
    return (
      formData.employerName ||
      formData.landlordName ||
      formData.discloserName ||
      formData.ownerName ||
      formData.firstParty ||
      formData.sellerName ||
      formData.lenderName ||
      formData.companyName ||
      formData.clientName ||
      formData.principalName ||
      'First Party'
    );
  };

  const getSecondPartyName = () => {
    return (
      formData.employeeName ||
      formData.tenantName ||
      formData.recipientName ||
      formData.agentName ||
      formData.secondParty ||
      formData.buyerName ||
      formData.borrowerName ||
      formData.consultantName ||
      'Second Party'
    );
  };

  const handleDownloadPDF = () => {
    generateContractPDF({
      title: template.title,
      statute: template.statute,
      paragraphs: contractParagraphs,
      firstPartyName: getFirstPartyName(),
      secondPartyName: getSecondPartyName(),
      signatureText: signatureText.trim() || undefined,
      fileName: `${template.id}_${Date.now()}.pdf`
    });
  };

  const handleSaveToMyDocuments = () => {
    setIsExporting(true);
    setTimeout(() => {
      const firstParty = getFirstPartyName();
      const newDoc = {
        id: `DOC-${Date.now()}`,
        templateId: template.id,
        title: firstParty !== 'First Party' ? `${template.title} - ${firstParty}` : template.title,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        data: formData
      };

      try {
        const existing = JSON.parse(localStorage.getItem('legallink_my_documents') || '[]');
        localStorage.setItem('legallink_my_documents', JSON.stringify([newDoc, ...existing]));
      } catch {
        // Ignore local storage errors
      }

      setIsExporting(false);
      setIsSavedSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* 01. Global Unified Navigation */}
      <Navbar />

      {/* 02. Header Section */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            {language === 'am' ? `${template.amharicTitle} ማዘጋጃ` : `${template.title} Generator`}
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Complete each step — the document preview updates live as you type.
          </p>
        </div>
      </div>

      {/* 03. Stepper Progress Bar (6 Steps) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-6 gap-1 text-center text-[11px] font-bold">
            {template.steps.map((st) => {
              const isCurrent = currentStep === st.number;
              const isDone = currentStep > st.number;

              return (
                <div 
                  key={st.number}
                  onClick={() => {
                    if (isDone) setCurrentStep(st.number as any);
                  }}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer ${
                    isCurrent ? 'text-[#0A1128]' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#0A1128] text-white shadow-xs ring-2 ring-[#0A1128]/20'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isDone ? '✓' : st.number}
                  </span>
                  <span className="truncate max-w-[70px] sm:max-w-none text-[10px] sm:text-xs">
                    {language === 'am' ? st.amharicTitle : st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 04. Main Wizard Canvas */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* STEPS 1 to 3: Bespoke Form Inputs */}
        {currentStep <= 3 && (
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono">
                STEP {currentStep} OF 6: {template.steps[currentStep - 1].title.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {template.statute}
              </span>
            </div>

            <form onSubmit={handleNextStep} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentStepFields.map((field) => (
                  <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'am' ? field.amharicLabel : field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] font-medium text-slate-800 cursor-pointer"
                      >
                        <option value="">Select option...</option>
                        {field.options?.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] font-medium text-slate-800 leading-relaxed"
                      />
                    ) : (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1128] font-medium text-slate-800"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Action Bar */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                {currentStep === 1 ? (
                  <Link href="/lexdraft" className="text-xs font-bold text-slate-400 hover:text-slate-700">
                    Cancel
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Back
                  </button>
                )}

                <button
                  type="submit"
                  className="px-7 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: LIVE A4 LEGAL PREVIEW */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-xs text-slate-800 font-sans leading-relaxed">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  Statutory Draft • {template.statute}
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {contractParagraphs.map((para, pIdx) => (
                  <p key={pIdx} className={pIdx === 0 ? 'font-black text-center text-sm tracking-wide text-[#0A1128] uppercase' : 'font-normal leading-relaxed'}>
                    {para}
                  </p>
                ))}
              </div>

              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center font-mono text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase">First Party Execution</span>
                  <strong className="text-slate-800 block mt-1">{getFirstPartyName()}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[9px] uppercase">Second Party Execution</span>
                  <strong className="text-slate-800 block mt-1">{getSecondPartyName()}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back to Terms
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-7 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Proceed to Sign</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: DIGITAL SIGNATURE */}
        {currentStep === 5 && (
          <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#0A1128]">
                Sign Your Legal Document
              </h2>
              <p className="text-slate-500 font-normal">
                Type your legal representative name below to apply your electronic signature seal.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block font-bold text-slate-800">
                Authorized Signatory Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kebede Alemu, Esq."
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-serif italic text-slate-800 focus:bg-white focus:outline-none focus:border-[#0A1128]"
              />

              {signatureText && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center font-serif italic text-lg text-slate-900 shadow-xs">
                  {signatureText}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ← Back to Preview
              </button>

              <button
                type="button"
                disabled={!signatureText.trim()}
                onClick={() => setCurrentStep(6)}
                className="px-7 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <span>Finalize Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SUBMIT & EXPORT */}
        {currentStep === 6 && (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-center text-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#0A1128]">
                Document Ready & Executed!
              </h2>
              <p className="text-slate-500 font-normal max-w-md mx-auto">
                Your contract follows certified Ethiopian statutory templates and is ready for export.
              </p>
            </div>

            {/* Action Buttons with True PDF Download */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-6 py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download A4 PDF</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleSaveToMyDocuments}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isExporting ? 'Saving Draft...' : 'Save to My Documents'}</span>
              </button>
            </div>

            {isSavedSuccess && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold inline-block">
                ✓ Saved to "My Documents". You can view it anytime in the LexDraft hub.
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <Link href="/lexdraft" className="text-xs font-bold text-slate-400 hover:text-slate-700">
                ← Return to LexDraft Library
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* 05. Enterprise Footer */}
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