'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, CheckCircle2, Clock, AlertTriangle, 
  ArrowLeft, ArrowRight, DollarSign, FileText, Scale, 
  HelpCircle, MessageSquare, Send, Check, RefreshCw 
} from 'lucide-react';

interface EscrowTransaction {
  id: string;
  clientName: string;
  advocateName: string;
  matter: string;
  amount: number;
  status: 'locked' | 'delivered' | 'disputed' | 'released';
  autoReleaseHoursRemaining: number;
  telebirrRef: string;
  disputeReason?: string;
}

const INITIAL_ESCROW_DOCKETS: EscrowTransaction[] = [
  {
    id: 'ESC-2026-9041',
    clientName: 'Dawit Alemu',
    advocateName: 'Advocate Mulu Haile',
    matter: 'Share Company Restructuring (ECMA Directive 1030/2024)',
    amount: 1500,
    status: 'delivered',
    autoReleaseHoursRemaining: 48,
    telebirrRef: 'TB-USSD-984210'
  },
  {
    id: 'ESC-2026-9042',
    clientName: 'Bethlehem Tadesse',
    advocateName: 'Advocate Dawit Tesfaye',
    matter: 'Bole Commercial Lease Dispute Mediation',
    amount: 1800,
    status: 'locked',
    autoReleaseHoursRemaining: 72,
    telebirrRef: 'TB-USSD-334192'
  }
];

export default function EscrowResolutionPage() {
  const [dockets, setDockets] = useState<EscrowTransaction[]>(INITIAL_ESCROW_DOCKETS);
  const [selectedDocket, setSelectedDocket] = useState<EscrowTransaction | null>(INITIAL_ESCROW_DOCKETS[0]);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReasonInput, setDisputeReasonInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClientApproveRelease = (id: string) => {
    setDockets((prev) => prev.map((d) => d.id === id ? { ...d, status: 'released' } : d));
    if (selectedDocket?.id === id) {
      setSelectedDocket({ ...selectedDocket, status: 'released' });
    }
    showToast('Payment voucher authorized! Funds disbursed to Advocate Telebirr account.');
  };

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocket || !disputeReasonInput.trim()) return;

    setDockets((prev) => prev.map((d) => 
      d.id === selectedDocket.id ? { ...d, status: 'disputed', disputeReason: disputeReasonInput.trim() } : d
    ));
    setSelectedDocket({
      ...selectedDocket,
      status: 'disputed',
      disputeReason: disputeReasonInput.trim()
    });

    setDisputeModalOpen(false);
    setDisputeReasonInput('');
    showToast('Dispute logged! Retainer frozen in escrow pending platform mediation.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0A1128] text-white rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="LegalLink" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold">
            <Link href="/find-a-lawyer" className="text-slate-500 hover:text-[#0A1128]">
              Find a Lawyer
            </Link>
            <Link href="/advocate" className="text-slate-500 hover:text-[#0A1128]">
              Advocate Docket
            </Link>
            <Link 
              href="/find-a-lawyer" 
              className="px-4 py-2 bg-[#0A1128] text-white rounded-xl hover:bg-[#102A43] transition-all"
            >
              New Consultation
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-10">
        
        {/* Banner */}
        <div className="bg-[#0A1128] text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>COMMERCIAL CODE PROCLAMATION NO. 1240/2021 CUSTODY</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Two-Party Escrow & Dispute Desk
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-normal">
              Retainer fees are held in statutory custody. Funds transfer only when counsel is delivered and verified, or automatically released after 72 hours of delivery if no formal objection is raised.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-4 rounded-2xl border border-slate-700 text-xs">
            <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Escrow Custody</span>
              <span className="font-black text-white">Telebirr Regulatory Trust</span>
            </div>
          </div>
        </div>

        {/* Escrow Dockets & Detailed Resolution Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Left Column: Escrow Accounts List */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-bold text-slate-700 uppercase text-[11px] block">
              Active Escrow Dockets ({dockets.length})
            </span>

            <div className="space-y-3">
              {dockets.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDocket(d)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    selectedDocket?.id === d.id
                      ? 'bg-white border-[#0A1128] shadow-md ring-2 ring-[#0A1128]/5'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{d.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      d.status === 'released' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      d.status === 'delivered' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                      d.status === 'disputed' ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {d.status === 'released' ? '✓ Released' :
                       d.status === 'delivered' ? 'Counsel Delivered' :
                       d.status === 'disputed' ? 'In Dispute' : 'Escrow Locked'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-[#0A1128]">{d.matter}</h3>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Client: <strong>{d.clientName}</strong> • Counsel: <strong>{d.advocateName}</strong>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono">
                    <span className="text-slate-400 text-[10px]">Held: ETB {d.amount.toLocaleString()}</span>
                    <span className="text-emerald-700 font-bold">{d.telebirrRef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Two-Party Release & Resolution Controller */}
          <div className="lg:col-span-7">
            {selectedDocket ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                      ESCROW CUSTODY ID: {selectedDocket.id}
                    </span>
                    <h2 className="text-xl font-black text-[#0A1128] mt-0.5">
                      {selectedDocket.matter}
                    </h2>
                  </div>
                  <span className="text-lg font-black font-mono text-emerald-700">
                    ETB {selectedDocket.amount.toLocaleString()}
                  </span>
                </div>

                {/* 3-Stage Progress Timeline */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl text-center text-[11px] font-bold">
                  <div className={`p-2 rounded-xl ${selectedDocket.status !== 'disputed' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                    1. Telebirr Locked
                  </div>
                  <div className={`p-2 rounded-xl ${
                    selectedDocket.status === 'delivered' || selectedDocket.status === 'released' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    2. Brief Delivered
                  </div>
                  <div className={`p-2 rounded-xl ${selectedDocket.status === 'released' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    3. Funds Released
                  </div>
                </div>

                {/* Status Explanation Card */}
                {selectedDocket.status === 'delivered' && (
                  <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 font-bold text-blue-950">
                      <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                      <span>Counsel Delivered — Awaiting Client Confirmation</span>
                    </div>
                    <p className="text-blue-900 text-xs leading-relaxed font-normal">
                      <strong>{selectedDocket.advocateName}</strong> has marked the legal consultation as delivered. If you are satisfied, authorize the release below. If no action is taken, funds will auto-transfer to counsel in <strong>{selectedDocket.autoReleaseHoursRemaining} hours</strong> pursuant to platform rules.
                    </p>
                  </div>
                )}

                {selectedDocket.status === 'released' && (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Settlement Disbursed</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      ETB {selectedDocket.amount} has been successfully settled to {selectedDocket.advocateName}&apos;s Telebirr account under Reference #{selectedDocket.telebirrRef}.
                    </p>
                  </div>
                )}

                {selectedDocket.status === 'disputed' && (
                  <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Dispute Active — Escrow Frozen</span>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed font-normal">
                      <strong>Reason cited:</strong> {selectedDocket.disputeReason}
                    </p>
                    <span className="text-[11px] text-red-700 block font-mono">
                      A LegalLink compliance officer has been assigned to mediate under Commercial Code Art. 1240.
                    </span>
                  </div>
                )}

                {/* Action Buttons for Two-Party Authorization */}
                <div className="pt-2 space-y-3">
                  {selectedDocket.status === 'delivered' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleClientApproveRelease(selectedDocket.id)}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Release Payment Voucher</span>
                      </button>

                      <button
                        onClick={() => setDisputeModalOpen(true)}
                        className="py-3 px-5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl cursor-pointer"
                      >
                        Raise Dispute
                      </button>
                    </div>
                  )}

                  {selectedDocket.status === 'locked' && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-500">
                      Consultation intake in progress. Advocate has not yet marked the session as completed.
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400">
                Select an escrow docket from the list to view settlement details.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Dispute Modal */}
      {disputeModalOpen && selectedDocket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <strong className="text-sm font-black text-[#0A1128]">Open Dispute for #{selectedDocket.id}</strong>
              <button onClick={() => setDisputeModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <p className="text-slate-600 leading-relaxed font-normal">
              State why the consultation was deficient or unfulfilled. Funds will remain locked in escrow during the mediation audit.
            </p>

            <form onSubmit={handleOpenDispute} className="space-y-3">
              <textarea
                rows={4}
                required
                placeholder="e.g. Advocate did not attend scheduled consultation or failed to provide promised legal commentary..."
                value={disputeReasonInput}
                onChange={(e) => setDisputeReasonInput(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A1128]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Freeze Funds & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        LegalLink Escrow Safeguards • Ethiopian Commercial Code Art. 1240 Compliance Node
      </footer>

    </div>
  );
}