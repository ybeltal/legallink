'use client';

import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, Download, Mail, CheckCircle2, 
  Sparkles, ExternalLink, QrCode, Lock, Scale, 
  Landmark, Award, Copy, Check 
} from 'lucide-react';

export interface BadgeData {
  type: 'advocate' | 'client';
  fullName: string;
  email: string;
  phone: string;
  identifier: string; // Bar License # for advocate, Client ID for client
  benchOrTier?: string; // e.g. "Federal Supreme Court" or "Statutory Escrow Protected"
  issueDate: string;
}

interface DigitalBadgeProps {
  data: BadgeData;
}

export default function DigitalBadge({ data }: DigitalBadgeProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const badgeCardRef = useRef<HTMLDivElement>(null);

  // Download high-resolution PNG using HTML5 Canvas (Zero external library dependencies)
  const handleDownloadBadge = () => {
    const canvas = document.createElement('canvas');
    const width = 1000;
    const height = 620;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isAdvocate = data.type === 'advocate';

    // 1. Background Fill
    ctx.fillStyle = '#0A1128';
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 40);
    ctx.fill();

    // 2. Decorative Outer Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = isAdvocate ? '#F59E0B' : '#10B981';
    ctx.beginPath();
    ctx.roundRect(16, 16, width - 32, height - 32, 32);
    ctx.stroke();

    // 3. Security Watermark Pattern (Guilloche lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    for (let i = -width; i < width * 2; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // 4. Header: Logo & Platform
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('LegalLink', 60, 85);
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('ETHIOPIA', 235, 85);

    // Header Right: Category Badge
    ctx.fillStyle = isAdvocate ? '#F59E0B' : '#10B981';
    ctx.font = 'bold 22px monospace';
    const tag = isAdvocate ? 'ACCREDITED ADVOCATE PASS' : 'VERIFIED ESCROW CLIENT';
    ctx.fillText(tag, width - 380, 85);

    // 5. Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 115);
    ctx.lineTo(width - 60, 115);
    ctx.stroke();

    // 6. Name
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(isAdvocate ? 'LICENSED PRACTITIONER' : 'REGISTERED CLIENT', 60, 170);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(data.fullName, 60, 225);

    // 7. Credential / ID Section
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(isAdvocate ? 'BAR LICENSE NUMBER' : 'LEGAL ACCESS ID', 60, 290);

    ctx.fillStyle = isAdvocate ? '#FBBF24' : '#34D399';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(data.identifier, 60, 330);

    // 8. Jurisdiction & Standing
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('BENCH & STANDING', 60, 395);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '22px sans-serif';
    ctx.fillText(data.benchOrTier || 'Federal First Instance & High Court Qualified', 60, 430);

    // 9. Footer Details
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`ISSUED: ${data.issueDate}`, 60, 520);
    ctx.fillText(`TELEBIRR ESCROW: VERIFIED & COMPLIANT`, 60, 555);

    // 10. Simulated Microchip / Gold Seal on Right
    ctx.fillStyle = isAdvocate ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = isAdvocate ? '#F59E0B' : '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(width - 240, 200, 180, 180, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isAdvocate ? '#F59E0B' : '#10B981';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL SEAL', width - 150, 275);
    ctx.fillText('MOJ AUDITED', width - 150, 310);
    ctx.textAlign = 'left';

    // Export Canvas to PNG
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `LegalLink-${isAdvocate ? 'Advocate' : 'Client'}-Badge-${data.fullName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSimulateEmailSend = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const handleCopyVerificationLink = () => {
    navigator.clipboard.writeText(`https://legallink-two.vercel.app/verify/${data.identifier}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const isAdvocate = data.type === 'advocate';

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      
      {/* 1. Visual Card Screen View (Digital Wallet Pass Ratio) */}
      <div 
        ref={badgeCardRef}
        className={`relative overflow-hidden rounded-3xl p-7 sm:p-9 text-white shadow-2xl border transition-all duration-300 ${
          isAdvocate 
            ? 'bg-[#0A1128] border-amber-500/60 shadow-amber-950/20' 
            : 'bg-[#060D1E] border-emerald-500/60 shadow-emerald-950/20'
        }`}
      >
        {/* Security Hologram Waveform Texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glow corner accent */}
        <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isAdvocate ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />

        {/* Card Header */}
        <div className="flex items-start justify-between relative z-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LegalLink" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <span className="font-black text-xl tracking-tight text-white block">
                Legal<span className="text-amber-500">Link</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                Federal Democratic Republic of Ethiopia
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
              isAdvocate 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {isAdvocate ? 'ACCREDITED ADVOCATE' : 'VERIFIED CLIENT PASS'}
            </span>
            <span className="block text-[9px] font-mono text-slate-400 mt-1">
              STATUS: <strong className="text-emerald-400">ACTIVE</strong>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-6 relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          
          <div className="sm:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                {isAdvocate ? 'PRACTITIONER NAME' : 'CLIENT / ENTERPRISE NAME'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                {data.fullName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  {isAdvocate ? 'BAR LICENSE #' : 'ESCROW HOLD ID'}
                </span>
                <span className={`font-mono font-bold text-sm ${isAdvocate ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {data.identifier}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  ISSUED DATE
                </span>
                <span className="font-mono text-slate-200 text-xs font-bold">
                  {data.issueDate}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                STANDING & JURISDICTION
              </span>
              <span className="text-xs font-medium text-slate-300 block">
                {data.benchOrTier || (isAdvocate ? 'Federal High Court Qualified' : 'Commercial Code 1240/2021 Protected')}
              </span>
            </div>
          </div>

          {/* Holographic Security Chip & QR Seal */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${
              isAdvocate 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              {isAdvocate ? <Scale className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
            </div>
            <span className="font-mono font-bold text-[10px] text-white tracking-widest block uppercase">
              MOJ REGISTRY
            </span>
            <span className="font-mono text-[9px] text-slate-400 block">
              SECURE SHA-256
            </span>
          </div>

        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-400 font-mono relative z-10">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Digital Signature Verified • Ethiopian Ministry of Justice Audit</span>
          </div>
          <span>Ref: LL-ETH-2026</span>
        </div>

      </div>

      {/* 2. Interactive Badge Actions (Download, Email, Copy Link) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        {/* Button 1: Download PNG */}
        <button
          onClick={handleDownloadBadge}
          className="w-full py-3 px-4 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer border border-slate-700"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Badge (PNG)</span>
        </button>

        {/* Button 2: Send Copy to Email */}
        <button
          onClick={handleSimulateEmailSend}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4 text-blue-600" />
          <span>{emailSent ? 'Sent to Inbox ✓' : 'Email My Pass'}</span>
        </button>

        {/* Button 3: Copy Verification Link */}
        <button
          onClick={handleCopyVerificationLink}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copiedLink ? 'Link Copied ✓' : 'Verification Link'}</span>
        </button>

      </div>

      {/* Confirmation Toast Notice */}
      {emailSent && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            A high-resolution certificate copy and Telebirr escrow guarantee have been dispatched to <strong>{data.email}</strong>.
          </span>
        </div>
      )}

    </div>
  );
}