'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, Globe, FileText, Scale, Calculator, 
  Languages, User, LogOut, ArrowRight, Menu, X, ShieldCheck
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userSession, setUserSession] = useState<{ email?: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Monitor Supabase Auth
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserSession({ email: session.user.email });
      } else {
        setUserSession(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession({ email: session.user.email });
      } else {
        setUserSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserSession(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-2 group">
          <img 
            src="/logo.png" 
            alt="LegalLink" 
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1 hidden sm:block">
              {t('nav_tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Single-Row Navigation: STRICT 5 CORE LINKS + MORE DROPDOWN */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
          <Link 
            href="/find-a-lawyer" 
            className={`transition-colors whitespace-nowrap ${pathname === '/find-a-lawyer' ? 'text-[#0A1128] font-black' : 'hover:text-[#0A1128]'}`}
          >
            {t('nav_find_lawyer')}
          </Link>

          <Link 
            href="/for-lawyers" 
            className={`transition-colors whitespace-nowrap ${pathname === '/for-lawyers' ? 'text-[#0A1128] font-black' : 'hover:text-[#0A1128]'}`}
          >
            {t('nav_for_lawyers')}
          </Link>

          <Link 
            href="/legaltalk" 
            className={`transition-colors whitespace-nowrap ${pathname === '/legaltalk' ? 'text-[#0A1128] font-black' : 'hover:text-[#0A1128]'}`}
          >
            {t('nav_legaltalk')}
          </Link>

          <Link 
            href="/#lexdraft" 
            className="hover:text-[#0A1128] transition-colors whitespace-nowrap"
          >
            {t('nav_lexdraft')}
          </Link>

          <Link 
            href="/#about" 
            className="hover:text-[#0A1128] transition-colors whitespace-nowrap"
          >
            {t('nav_about')}
          </Link>

          {/* Collapsible "More ▾" Dropdown for Secondary Tools */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#0A1128] transition-colors cursor-pointer py-1"
            >
              <span>{t('nav_more')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdownOpen ? 'rotate-180 text-[#0A1128]' : 'text-slate-400'}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <Link
                  href="/memo/MEMO-2026-9041"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="block">{t('nav_legal_memo')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Verifiable MOJ Bar Seal</span>
                  </div>
                </Link>

                <Link
                  href="/escrow"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="block">{t('nav_escrow_desk')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Telebirr Two-Party Custody</span>
                  </div>
                </Link>

                <Link
                  href="/tools"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-bold"
                >
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="block">{t('nav_legal_tools')}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Severance & Stamp Duty</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Header Actions: Bilingual Toggle, Sign In, and High-Contrast Get Started */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-slate-50 shadow-xs cursor-pointer"
            title="Switch Language / ቋንቋ ይቀይሩ"
          >
            <Languages className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {userSession ? (
            <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-xl border border-slate-200">
              <div className="w-6 h-6 rounded-lg bg-[#0A1128] text-white flex items-center justify-center text-[10px] font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 max-w-[90px] truncate">
                {userSession.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1 hover:text-red-600 text-slate-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="text-xs font-bold text-slate-700 hover:text-[#0A1128] px-3 py-2 transition-colors whitespace-nowrap"
            >
              {t('nav_sign_in')}
            </Link>
          )}

          {/* High-Contrast "Get Started" Primary Action Button */}
          <Link 
            href="/find-a-lawyer" 
            className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 group whitespace-nowrap"
          >
            <span>{t('nav_get_started')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-700 cursor-pointer sm:hidden"
          >
            {language === 'en' ? 'አማ' : 'EN'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 text-xs font-bold">
          <Link href="/find-a-lawyer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800">
            {t('nav_find_lawyer')}
          </Link>
          <Link href="/for-lawyers" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800">
            {t('nav_for_lawyers')}
          </Link>
          <Link href="/legaltalk" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800">
            {t('nav_legaltalk')}
          </Link>
          <Link href="/#lexdraft" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800">
            {t('nav_lexdraft')}
          </Link>
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-800">
            {t('nav_about')}
          </Link>
          <Link href="/diaspora" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-blue-600">
            {t('diaspora_title')}
          </Link>
          <Link href="/memo/MEMO-2026-9041" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-amber-700">
            {t('nav_legal_memo')}
          </Link>
          <Link href="/escrow" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-emerald-700">
            {t('nav_escrow_desk')}
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <Link 
              href="/find-a-lawyer" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-[#0A1128] text-white text-center rounded-xl block"
            >
              {t('nav_get_started')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}