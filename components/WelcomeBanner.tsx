'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, LogOut, FileText, Scale } from 'lucide-react';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function WelcomeBanner() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [displayName, setDisplayName] = useState('Member');
  const [role, setRole] = useState<'client' | 'advocate'>('client');

  useEffect(() => {
    setMounted(true);

    const authCookie = getCookie('legallink_auth');
    const roleCookie = (getCookie('legallink_role') as 'client' | 'advocate') || 'client';
    const nameCookie = getCookie('legallink_user_name');
    const welcomeCookie = getCookie('legallink_welcome');

    let resolvedName = nameCookie || '';
    let resolvedRole: 'client' | 'advocate' = roleCookie;

    if (!resolvedName) {
      try {
        const stored = localStorage.getItem('legallink_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          resolvedName =
            parsed.firstName ||
            (parsed.email ? parsed.email.split('@')[0] : '') ||
            'Member';
          if (parsed.role === 'advocate' || parsed.role === 'client') {
            resolvedRole = parsed.role;
          }
        }
      } catch {
        // Ignore storage errors
      }
    }

    if (authCookie === 'authenticated') {
      setIsAuthenticated(true);
      setDisplayName(resolvedName || (resolvedRole === 'advocate' ? 'Advocate' : 'Member'));
      setRole(resolvedRole);

      if (welcomeCookie === 'true') {
        setShowWelcomeToast(true);
        // Clear one-time welcome flag so it does not repeat on every page refresh
        document.cookie = 'legallink_welcome=; path=/; max-age=0';
      }
    }
  }, []);

  const handleSignOut = () => {
    document.cookie = 'legallink_auth=; path=/; max-age=0';
    document.cookie = 'legallink_role=; path=/; max-age=0';
    document.cookie = 'legallink_user_name=; path=/; max-age=0';
    document.cookie = 'legallink_user_email=; path=/; max-age=0';
    document.cookie = 'legallink_welcome=; path=/; max-age=0';
    try {
      localStorage.removeItem('legallink_user');
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <>
      {/* Celebratory "Welcome to LegalLink" Banner Right After Sign-In */}
      {showWelcomeToast && (
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
      )}

      {/* Compact Signed-In Session Pill (Bottom-Right) */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-3.5 py-1.5 flex items-center gap-2.5 text-[11px]">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="font-bold text-[#0A1128] max-w-[140px] truncate">
          {displayName}
        </span>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {role}
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          title="Sign out"
          className="text-slate-500 hover:text-red-600 inline-flex items-center gap-1 font-bold cursor-pointer pl-1 border-l border-slate-200"
        >
          <LogOut className="w-3 h-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
}