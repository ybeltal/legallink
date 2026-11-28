'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowRight,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Info,
  LogOut,
  Briefcase,
  User,
  Scale,
  LayoutDashboard,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userRole, setUserRole] = useState<'client' | 'advocate'>('client');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  const primaryLinks = [
    { label: t('nav_find_lawyer'), href: '/find-a-lawyer' },
    { label: t('nav_for_lawyers'), href: '/for-lawyers' },
    { label: t('nav_legaltalk'), href: '/legaltalk' },
    { label: t('nav_lexdraft'), href: '/lexdraft' },
  ];

  const moreDropdownLinks = [
    {
      title: language === 'am' ? 'የህግ መረጃ ማዕከል' : 'Legal Center & Dictionary',
      description:
        language === 'am'
          ? 'የህግ መዝገበ ቃላት፣ የጠበቃ መምረጫ ምክሮችና ነፃ ጥያቄ'
          : 'Bilingual legal dictionary, hiring tips & free Q&A',
      href: '/legal-center',
      icon: Scale,
      badge: 'New',
    },
    {
      title: language === 'am' ? 'የህግ ማውጫ' : 'Legal Library',
      description:
        language === 'am'
          ? 'የፌዴራል አዋጆችና መመሪያዎች'
          : 'Official gazette proclamations & directives',
      href: '/library',
      icon: BookOpen,
      badge: 'Gazette',
    },
    {
      title: language === 'am' ? 'የተማሪዎች ማዕከል' : 'NextGen / Student Hub',
      description:
        language === 'am'
          ? 'የስራ ልምምድ፣ የጥብቅና ረዳትነትና ዕድሎች'
          : 'Internships, pupillage & legal careers',
      href: '/nextgen',
      icon: GraduationCap,
      badge: 'Hub',
    },
    {
      title: language === 'am' ? 'ስለ እኛ እና አጋርነት' : 'About & Partnerships',
      description:
        language === 'am'
          ? 'ተልዕኮ፣ መሥራቾች እና የተቋማት አጋርነት'
          : 'Mission, leadership & institutional partnerships',
      href: '/about',
      icon: Info,
    },
  ];

  const isMoreActive = moreDropdownLinks.some((item) => pathname === item.href);

  useEffect(() => {
    let active = true;

    const loadAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

      if (data?.user) {
        const meta = data.user.user_metadata || {};
        const name =
          meta.full_name ||
          meta.first_name ||
          getCookie('legallink_user_name') ||
          data.user.email?.split('@')[0] ||
          'Member';
        const role: 'client' | 'advocate' =
          meta.role === 'advocate' || getCookie('legallink_role') === 'advocate'
            ? 'advocate'
            : 'client';

        setIsAuthenticated(true);
        setDisplayName(name);
        setUserRole(role);
        return;
      }

      if (getCookie('legallink_auth') === 'authenticated') {
        setIsAuthenticated(true);
        setDisplayName(getCookie('legallink_user_name') || 'Member');
        setUserRole(getCookie('legallink_role') === 'advocate' ? 'advocate' : 'client');
      } else {
        setIsAuthenticated(false);
        setDisplayName('');
      }
    };

    loadAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadAuth();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMoreDropdownOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut().catch(() => {});
    document.cookie = 'legallink_auth=; path=/; max-age=0';
    document.cookie = 'legallink_role=; path=/; max-age=0';
    document.cookie = 'legallink_user_name=; path=/; max-age=0';
    document.cookie = 'legallink_user_email=; path=/; max-age=0';
    document.cookie = 'legallink_welcome=; path=/; max-age=0';
    try {
      localStorage.removeItem('legallink_user');
      sessionStorage.removeItem('ll_active_advocate_id');
    } catch {
      // Ignore storage errors
    }
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 text-[#18181B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
            <img src="/logo.png" alt="LegalLink Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight text-[#18181B]">
              Legal<span className="text-amber-600">Link</span>
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
                      ? 'text-[#18181B] font-black border-b-2 border-[#18181B]'
                      : 'hover:text-[#18181B]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`py-1 flex items-center gap-1 transition-colors cursor-pointer ${
                  isMoreActive || moreDropdownOpen ? 'text-[#18181B] font-black' : 'hover:text-[#18181B]'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>{language === 'am' ? 'ተጨማሪ' : 'More'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-[#18181B]' : ''
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 z-50">
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
                            ? 'bg-slate-100 text-[#18181B]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-[#18181B] text-amber-400 font-bold'
                              : 'bg-slate-100 text-[#18181B] group-hover:bg-[#18181B] group-hover:text-amber-400 transition-colors'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-[#18181B]">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-100 text-amber-900">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 font-normal mt-0.5">
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

          {/* Right Header Utilities */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-slate-600 hover:text-[#18181B]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'am'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-slate-600 hover:text-[#18181B]'
                }`}
              >
                አማ
              </button>
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-[#18181B] flex items-center gap-2 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-[#18181B] truncate">{displayName}</p>
                      <p className="text-[10px] font-mono uppercase text-slate-500">
                        {userRole === 'advocate' ? 'Advocate Account' : 'Client Account'}
                      </p>
                    </div>
                    {userRole === 'advocate' ? (
                      <Link
                        href="/advocate/portal"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-[#18181B]"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        <span>Advocate Portal</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-[#18181B]"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>My Inquiries</span>
                        </Link>
                        <Link
                          href="/find-a-lawyer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:text-[#18181B]"
                        >
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span>Find an Advocate</span>
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#18181B] transition-colors"
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('nav_get_started')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-[#18181B] cursor-pointer"
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#18181B] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-5">
          <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-700">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#18181B]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500 block px-1">
              {language === 'am' ? 'ተጨማሪ አገልግሎቶች' : 'More Resources'}
            </span>
            <div className="grid grid-cols-1 gap-1">
              {moreDropdownLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#18181B]"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-amber-600" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-100 text-amber-900">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <span className="font-bold text-[#18181B]">{displayName}</span>
                  <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {userRole}
                  </span>
                </div>
                {userRole === 'advocate' ? (
                  <Link
                    href="/advocate/portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#18181B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Advocate Portal</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-[#18181B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>My Inquiries Dashboard</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 border border-red-200 text-red-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-xs font-bold text-slate-700 hover:text-[#18181B]"
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#18181B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>{t('nav_get_started')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}