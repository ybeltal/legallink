'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, ArrowRight, ChevronDown, 
  BookOpen, GraduationCap, Info, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Primary navigation links shown directly on desktop
  const primaryLinks = [
    { label: t('nav_find_lawyer'), href: '/find-a-lawyer' },
    { label: t('nav_for_lawyers'), href: '/for-lawyers' },
    { label: t('nav_legaltalk'), href: '/legaltalk' },
    { label: t('nav_lexdraft'), href: '/lexdraft' },
  ];

  // Secondary items placed inside the reinstated "More" dropdown
  const moreDropdownLinks = [
    {
      title: language === 'am' ? 'የህግ ማውጫ' : 'Legal Library',
      description: language === 'am' ? '122 የፌዴራል አዋጆችና መመሪያዎች' : '122 official gazette proclamations & directives',
      href: '/library',
      icon: BookOpen,
      badge: '122 Docs',
    },
    {
      title: language === 'am' ? 'የተማሪዎች ማዕከል' : 'NextGen / Student Hub',
      description: language === 'am' ? 'የስራ ልምምድ፣ የጥብቅና ረዳትነትና ዕድሎች' : 'Internships, pupillage & legal careers',
      href: '/nextgen',
      icon: GraduationCap,
      badge: 'New',
    },
    {
      title: language === 'am' ? 'የቴሌብር ዋስትና' : 'Telebirr Escrow',
      description: language === 'am' ? 'የንግድ ህግ አንቀጽ 1240 ጥበቃ' : 'Commercial Code Art. 1240 protection',
      href: '/#escrow',
      icon: ShieldCheck,
    },
    {
      title: t('nav_about'),
      description: language === 'am' ? 'ስለ ሊጋል ሊንክ ተልዕኮና አሰራር' : 'Platform mission, escrow & leadership',
      href: '/#about',
      icon: Info,
    },
  ];

  const isMoreActive = moreDropdownLinks.some((item) => pathname === item.href);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
            <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-bold text-slate-600">
            {primaryLinks.map((link) => {
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

            {/* Reinstated "More" Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`py-1 flex items-center gap-1 transition-colors cursor-pointer ${
                  isMoreActive || moreDropdownOpen
                    ? 'text-[#0A1128] font-black'
                    : 'hover:text-[#0A1128]'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>{language === 'am' ? 'ተጨማሪ' : 'More'}</span>
                <ChevronDown 
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-amber-500' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Popover */}
              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 animate-scaleUp z-50">
                  {moreDropdownLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`p-2.5 rounded-xl flex items-start gap-3 transition-colors group cursor-pointer ${
                          isActive 
                            ? 'bg-amber-50/70 text-[#0A1128]' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isActive 
                            ? 'bg-amber-500 text-slate-950 font-bold' 
                            : 'bg-slate-100 text-slate-600 group-hover:bg-[#0A1128] group-hover:text-white transition-colors'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[#0A1128] group-hover:text-amber-600 transition-colors">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full bg-amber-100 text-amber-900">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-snug line-clamp-1 font-normal mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
              href="/signup"
              className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('nav_get_started')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-5 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#0A1128]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block px-1">
              {language === 'am' ? 'ተጨማሪ አገልግሎቶች' : 'More Services & Resources'}
            </span>
            <div className="grid grid-cols-1 gap-1">
              {moreDropdownLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-amber-500" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full bg-amber-100 text-amber-900">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              {t('nav_sign_in')}
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-[#0A1128] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>{t('nav_get_started')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}