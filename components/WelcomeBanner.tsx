'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, FileText, Scale, Briefcase } from 'lucide-react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function WelcomeBanner() {
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [displayName, setDisplayName] = useState('Member');
  const [role, setRole] = useState<'client' | 'advocate'>('client');

  useEffect(() => {
    const authCookie = getCookie('legallink_auth');
    const welcomeCookie = getCookie('legallink_welcome');
    if (authCookie !== 'authenticated' || welcomeCookie !== 'true') return;

    const roleCookie: 'client' | 'advocate' =
      getCookie('legallink_role') === 'advocate' ? 'advocate' : 'client';
    const nameCookie = getCookie('legallink_user_name');

    setRole(roleCookie);
    setDisplayName(nameCookie || (roleCookie === 'advocate' ? 'Advocate' : 'Member'));
    setShowWelcomeToast(true);

    // Clear one-time flag immediately so refresh does not repeat toast
    document.cookie = 'legallink_welcome=; path=/; max-age=0';

    const timer = setTimeout(() => setShowWelcomeToast(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!showWelcomeToast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl">
      <div className="bg-[#0A1128] text-white rounded-2xl border border-amber-400/40 shadow-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold">
              {role === 'advocate'
                ? 'Advocate Chamber • Proclamation No. 1249/2021'
                : 'Verified LegalLink Account'}
            </p>
            <h2 className="text-sm sm:text-base font-black text-white">
              Welcome to LegalLink, {displayName}!
            </h2>
            <p className="text-xs text-amber-300 font-semibold">
              እንኳን ወደ LegalLink በደህና መጡ!
            </p>
            <div className="pt-1.5 flex flex-wrap items-center gap-2">
              {role === 'advocate' ? (
                <Link
                  href="/advocate/portal"
                  onClick={() => setShowWelcomeToast(false)}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A1128] text-[11px] font-bold inline-flex items-center gap-1"
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Open Advocate Portal</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/lexdraft"
                    onClick={() => setShowWelcomeToast(false)}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0A1128] text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Draft Legal Forms</span>
                  </Link>
                  <Link
                    href="/find-a-lawyer"
                    onClick={() => setShowWelcomeToast(false)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <Scale className="w-3 h-3 text-emerald-400" />
                    <span>Explore Advocates</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowWelcomeToast(false)}
          aria-label="Close welcome banner"
          className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}