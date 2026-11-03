'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Globe, Menu, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: t('nav_find_lawyer'), href: '/find-a-lawyer' },
    { label: t('nav_for_lawyers'), href: '/for-lawyers' },
    { label: t('nav_legaltalk'), href: '/legaltalk' },
    { label: t('nav_lexdraft'), href: '/lexdraft' }, // Fixed to /lexdraft
    { label: t('nav_about'), href: '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive 
                      ? 'text-[#0A1128] font-black border-b-2 border-amber-500' 
                      : 'hover:text-[#0A1128]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Utilities: Language Toggle, Sign In, CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'am'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                አማ
              </button>
            </div>

            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              {t('nav_sign_in')}
            </Link>

            <Link
              href="/find-a-lawyer"
              className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{t('nav_get_started')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#0A1128]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-500"
            >
              {t('nav_sign_in')}
            </Link>
          </nav>

          <Link
            href="/find-a-lawyer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-3 bg-[#0A1128] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
          >
            <span>{t('nav_get_started')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </header>
  );
}