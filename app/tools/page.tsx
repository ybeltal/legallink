'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Calculator,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LegalToolsPage() {
  const [calcYears, setCalcYears] = useState<number>(3);
  const [calcSalary, setCalcSalary] = useState<number>(25000);
  const [severanceResult, setSeveranceResult] = useState<number>(0);

  const [darsChecked, setDarsChecked] = useState<Record<string, boolean>>({
    stamp_receipt: false,
    fayda_id: true,
    tin_reg: true,
    bylaws_signed: false,
  });

  useEffect(() => {
    const safeYears = Math.max(1, Number(calcYears) || 1);
    const safeSalary = Math.max(0, Number(calcSalary) || 0);
    const firstYear = safeSalary;
    const additionalYears = Math.max(0, safeYears - 1) * (safeSalary / 3);
    setSeveranceResult(Math.round(firstYear + additionalYears));
  }, [calcYears, calcSalary]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 sm:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">
              SELF-SERVICE ETHIOPIAN LEGAL TOOLKIT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Practical Calculators &amp; Compliance Checklists
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-normal">
              Estimate statutory severance under Labour Proclamation No. 1156/2019, prepare documents for DARS authentication, and launch bilingual drafting on LexDraft — completely free.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Standards</span>
              <span className="font-black text-white">Ethiopian Statutory Formulas</span>
            </div>
          </div>
        </div>

        {/* 3 Clean Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
          {/* Tool 1: Severance Calculator */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base text-[#0A1128]">Severance Calculator</h2>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Labour Proc. No. 1156/2019 Art. 39–40
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Estimate statutory severance pay for employees terminated without fault after completing probation.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                    Tenure (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={calcYears}
                    onChange={(e) => setCalcYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">
                    Monthly Salary (ETB)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={calcSalary}
                    onChange={(e) => setCalcSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs focus:bg-white focus:outline-none focus:border-[#0A1128]"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex justify-between text-blue-900">
                  <span>First Year (30 days):</span>
                  <span className="font-mono font-bold">ETB {calcSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-900">
                  <span>Additional {Math.max(0, calcYears - 1)} yrs (1/3 mo/yr):</span>
                  <span className="font-mono font-bold">
                    ETB {Math.round(Math.max(0, calcYears - 1) * (calcSalary / 3)).toLocaleString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-between font-black text-blue-950 text-sm">
                  <span>Estimated Severance:</span>
                  <span className="font-mono">ETB {severanceResult.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              href="/find-a-lawyer?category=employment"
              className="w-full py-3 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Consult a Labour Advocate (Free)</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          {/* Tool 2: DARS Pre-Flight Checklist */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base text-[#0A1128]">DARS Document Pre-Flight</h2>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Authentication &amp; Registration Readiness
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Check off essential documents before visiting the Documents Authentication and Registration Service (DARS).
              </p>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: 'stamp_receipt', label: 'Stamp Duty / Service Fee Receipt Ready' },
                  { key: 'fayda_id', label: 'Valid Fayda National ID, Kebele ID, or Passport' },
                  { key: 'tin_reg', label: 'TIN Certificate (for Corporate / Property Filings)' },
                  { key: 'bylaws_signed', label: 'Draft Contract / PoA Reviewed by All Parties' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={darsChecked[item.key]}
                      onChange={(e) =>
                        setDarsChecked({ ...darsChecked, [item.key]: e.target.checked })
                      }
                      className="rounded border-slate-300 accent-[#0A1128]"
                    />
                    <span className="text-slate-800 font-semibold">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center font-bold text-emerald-900">
                {Object.values(darsChecked).filter(Boolean).length} of 4 Items Verified Ready
              </div>
            </div>

            <Link
              href="/find-a-lawyer?category=corporate"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Have an Advocate Review Your File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tool 3: Direct Bridge to LexDraft Bilingual Studio */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 space-y-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-base text-[#0A1128]">LexDraft Bilingual Studio</h2>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">
                    Amharic &amp; English Word Export
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Generate ready-to-edit Ethiopian legal contracts, powers of attorney, court appeals, and PLC formation documents in minutes.
              </p>

              <div className="space-y-2 pt-1">
                {[
                  { label: 'Power of Attorney (ውክልና)', href: '/lexdraft?template=agency-attorney' },
                  { label: 'Employment Contract (Proc. 1156/2019)', href: '/lexdraft?template=employment-agreement' },
                  { label: 'Commercial Lease Agreement', href: '/lexdraft?template=commercial-lease' },
                  { label: 'PLC Memorandum of Association', href: '/lexdraft?template=plc-articles-of-association' },
                ].map((tpl) => (
                  <Link
                    key={tpl.href}
                    href={tpl.href}
                    className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-200 rounded-xl flex items-center justify-between font-bold text-[#0A1128] transition-colors"
                  >
                    <span>{tpl.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/lexdraft"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-black rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Scale className="w-4 h-4" />
              <span>Open All LexDraft Templates</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#0A1128] text-slate-400 py-8 text-center text-xs mt-auto">
        <p>© 2026 LegalLink Ethiopia • info.legallinkethiopia@gmail.com • +251-964-600-737</p>
      </footer>
    </div>
  );
}