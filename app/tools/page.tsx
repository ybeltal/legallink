'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Calculator, CheckCircle2, ArrowRight, 
  ArrowLeft, Download, ShieldCheck, Check, Sparkles, Scale 
} from 'lucide-react';

export default function LegalToolsPage() {
  // Severance Calculator State
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcSalary, setCalcSalary] = useState<number>(25000);
  const [severanceResult, setSeveranceResult] = useState<number>(0);

  // DARA Checklist State
  const [daraChecked, setDaraChecked] = useState<Record<string, boolean>>({
    cbe_stamp: false,
    fayda_id: true,
    tin_reg: true,
    bylaws_signed: false
  });

  // LexDraft Template Selector
  const [selectedTemplate, setSelectedTemplate] = useState<'employment' | 'tenancy' | 'nda'>('employment');
  const [employerName, setEmployerName] = useState('Abyssinia Ventures PLC');
  const [employeeName, setEmployeeName] = useState('Abebe Balcha');
  const [monthlyWage, setMonthlyWage] = useState('25,000 ETB');

  // Compute Severance under Ethiopian Labor Proclamation No. 1156/2019 Art. 39-40
  useEffect(() => {
    const firstYear = calcSalary;
    const additionalYears = Math.max(0, calcYears - 1) * (calcSalary / 3);
    setSeveranceResult(Math.round(firstYear + additionalYears));
  }, [calcYears, calcSalary]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-9 h-9 object-contain" />
            <span className="font-black text-xl text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-xs font-bold">
            <Link href="/" className="text-slate-500 hover:text-[#0A1128] transition-colors hidden sm:block">
              Home
            </Link>
            <Link href="/find-a-lawyer" className="text-slate-500 hover:text-[#0A1128] transition-colors">
              Find a Lawyer
            </Link>
            <Link 
              href="/find-a-lawyer" 
              className="px-4 py-2 bg-[#0A1128] text-white rounded-xl hover:bg-[#102A43] transition-all"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              SELF-SERVICE COMPLIANCE DESK
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Ethiopian Legal Compliance Engines
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
              Statutory contract drafting under Commercial Code Art. 1240, severance calculations under Labor Proclamation No. 1156/2019, and DARA pre-flight checklists.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Standards</span>
              <span className="font-black text-white">Ethiopian Statutory Compliant</span>
            </div>
          </div>
        </div>

        {/* 3 Dedicated Legal Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
          
          {/* Tool 1: LexDraft Contract Studio */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0A1128]">LexDraft Contract Studio</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Commercial Code Art. 1240</span>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed font-normal">
                Generate dual-column Amharic/English legal contracts ready for DARA authentication stamps.
              </p>

              {/* Template Select */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Select Contract Template</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl font-bold text-[10px]">
                  <button
                    onClick={() => setSelectedTemplate('employment')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedTemplate === 'employment' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Labor
                  </button>
                  <button
                    onClick={() => setSelectedTemplate('tenancy')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedTemplate === 'tenancy' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Tenancy
                  </button>
                  <button
                    onClick={() => setSelectedTemplate('nda')}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedTemplate === 'nda' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    NDA
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-2 pt-1">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Party A (Employer / Landlord)</label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Party B (Employee / Tenant)</label>
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Monthly Consideration (ETB)</label>
                  <input
                    type="text"
                    value={monthlyWage}
                    onChange={(e) => setMonthlyWage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert(`Standardized ${selectedTemplate.toUpperCase()} contract generated for ${employeeName} and ${employerName}. Exporting bilingual PDF...`)}
              className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Export Standardized Bilingual PDF</span>
            </button>
          </div>

          {/* Tool 2: Severance Calculator */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0A1128]">Severance Calculator</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Proc. No. 1156/2019 Art. 39–40</span>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed font-normal">
                Compute statutory severance payouts and termination entitlements under Ethiopian labor law.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    min={1}
                    value={calcYears}
                    onChange={(e) => setCalcYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Monthly Pay (ETB)</label>
                  <input
                    type="number"
                    step={1000}
                    value={calcSalary}
                    onChange={(e) => setCalcSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex justify-between text-blue-900 text-xs">
                  <span>First Year Wage:</span>
                  <span className="font-mono font-bold">ETB {calcSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-900 text-xs">
                  <span>Subsequent {Math.max(0, calcYears - 1)} Years (1/3 per yr):</span>
                  <span className="font-mono font-bold">ETB {Math.round(Math.max(0, calcYears - 1) * (calcSalary / 3)).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-between font-black text-blue-950 text-sm">
                  <span>Total Severance:</span>
                  <span className="font-mono">ETB {severanceResult.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 text-center block">
                Statutory formula: 30 days wages (Yr 1) + 1/3 of monthly salary per additional year.
              </span>
              <Link
                href="/find-a-lawyer?category=employment"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-center shadow-xs"
              >
                <span>Consult an Employment Advocate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tool 3: DARA Pre-Flight Checklist */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#0A1128]">DARA Document Pre-Flight</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Document Authentication Agency</span>
                </div>
              </div>

              <p className="text-slate-500 leading-relaxed font-normal">
                Pre-audit your corporate, land, or power-of-attorney files before appearing at the registry office.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  { key: 'cbe_stamp', label: 'CBE Authentication Fee Receipt' },
                  { key: 'fayda_id', label: 'Valid Fayda National ID / Passport' },
                  { key: 'tin_reg', label: 'Commercial TIN Registration Certificate' },
                  { key: 'bylaws_signed', label: 'Articles of Association Signed by Founders' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={daraChecked[item.key]}
                      onChange={(e) => setDaraChecked({ ...daraChecked, [item.key]: e.target.checked })}
                      className="rounded border-slate-300 text-[#0A1128] focus:ring-0"
                    />
                    <span className="text-slate-800 font-medium text-xs">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center font-bold text-emerald-900 text-xs">
                {Object.values(daraChecked).filter(Boolean).length} of 4 Documents Verified Ready
              </div>
            </div>

            <Link
              href="/find-a-lawyer?category=corporate"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-center shadow-xs"
            >
              <span>Have an Advocate Audit Your Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Ethiopia • Self-Service Legal Compliance Engines • Bole Sub-City, Addis Ababa
      </footer>

    </div>
  );
}