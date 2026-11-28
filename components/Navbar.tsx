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
  const [scrolled, setScrolled] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userRole, setUserRole] = useState<'client' | 'advocate'>('client');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const supabase = createClient();

  const isHomeSkyOverlay = pathname === '/' && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={`z-50 transition-all duration-300 ${
        pathname === '/' ? 'fixed top-0 inset-x-0' : 'sticky top-0'
      } ${
        isHomeSkyOverlay
          ? 'bg-transparent border-b border-white/15 text-white'
          : 'bg-white/92 backdrop-blur-xl border-b border-[#E5EAF5] text-[#141B2D] shadow-[0_4px_24px_-12px_rgba(20,27,45,0.08)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
            <img src="/logo.png" alt="LegalLink Logo" className="w-7 h-7 object-contain" />
            <span
              className={`font-bold text-lg tracking-tight transition-colors ${
                isHomeSkyOverlay ? 'text-white' : 'text-[#141B2D]'
              }`}
            >
              Legal
              <span className={isHomeSkyOverlay ? 'text-white/85' : 'text-[#5D6DF7]'}>
                Link
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium ${
              isHomeSkyOverlay ? 'text-white/90' : 'text-[#525E75]'
            }`}
          >
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? isHomeSkyOverlay
                        ? 'text-white font-semibold'
                        : 'text-[#141B2D] font-semibold border-b-2 border-[#5D6DF7]'
                      : isHomeSkyOverlay
                      ? 'hover:text-white'
                      : 'hover:text-[#141B2D]'
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
                  isMoreActive || moreDropdownOpen
                    ? isHomeSkyOverlay
                      ? 'text-white font-semibold'
                      : 'text-[#141B2D] font-semibold'
                    : isHomeSkyOverlay
                    ? 'hover:text-white'
                    : 'hover:text-[#141B2D]'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>{language === 'am' ? 'ተጨማሪ' : 'More'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl border border-[#E4E9F5] shadow-xl p-2 space-y-1 z-50 text-[#141B2D]">
                  {moreDropdownLinks.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`p-2.5 rounded-xl flex items-start gap-3 transition-colors group cursor-pointer ${
                          isActive ? 'bg-[#ECEFFE] text-[#141B2D]' : 'hover:bg-[#F5F7FC] text-[#525E75]'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isActive
                              ? 'bg-[#5D6DF7] text-white'
                              : 'bg-[#F5F7FC] text-[#5D6DF7] group-hover:bg-[#5D6DF7] group-hover:text-white transition-colors'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs text-[#141B2D]">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#ECEFFE] text-[#5D6DF7]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#647087] leading-snug line-clamp-1 font-normal mt-0.5">
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
            <div
              className={`flex items-center rounded-full p-0.5 border text-[11px] font-semibold ${
                isHomeSkyOverlay
                  ? 'bg-white/15 border-white/25'
                  : 'bg-[#F5F7FC] border-[#E4E9F5]'
              }`}
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-[#141B2D] shadow-2xs'
                    : isHomeSkyOverlay
                    ? 'text-white/85 hover:text-white'
                    : 'text-[#647087] hover:text-[#141B2D]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'am'
                    ? 'bg-white text-[#141B2D] shadow-2xs'
                    : isHomeSkyOverlay
                    ? 'text-white/85 hover:text-white'
                    : 'text-[#647087] hover:text-[#141B2D]'
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
                  className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    isHomeSkyOverlay
                      ? 'bg-white/20 hover:bg-white/30 border-white/35 text-white'
                      : 'bg-[#F5F7FC] hover:bg-[#ECEFFE] border-[#E4E9F5] text-[#141B2D]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-75" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#E4E9F5] shadow-xl p-2 space-y-1 z-50 text-xs text-[#141B2D]">
                    <div className="px-3 py-2 border-b border-[#F1F4FA]">
                      <p className="font-bold text-[#141B2D] truncate">{displayName}</p>
                      <p className="text-[10px] font-mono uppercase text-[#7A859E]">
                        {userRole === 'advocate' ? 'Advocate Account' : 'Client Account'}
                      </p>
                    </div>
                    {userRole === 'advocate' ? (
                      <Link
                        href="/advocate/portal"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-[#525E75] hover:bg-[#F5F7FC] hover:text-[#141B2D]"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-[#5D6DF7]" />
                        <span>Advocate Portal</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-[#525E75] hover:bg-[#F5F7FC] hover:text-[#141B2D]"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#5D6DF7]" />
                          <span>My Inquiries</span>
                        </Link>
                        <Link
                          href="/find-a-lawyer"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-[#525E75] hover:bg-[#F5F7FC] hover:text-[#141B2D]"
                        >
                          <User className="w-3.5 h-3.5 text-[#5D6DF7]" />
                          <span>Find an Advocate</span>
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
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
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    isHomeSkyOverlay
                      ? 'text-white/90 hover:text-white'
                      : 'text-[#525E75] hover:text-[#141B2D]'
                  }`}
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/signup"
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                    isHomeSkyOverlay
                      ? 'bg-white/90 hover:bg-white text-[#141B2D] shadow-xs'
                      : 'bg-[#ECEFFE] hover:bg-[#5D6DF7] text-[#141B2D] hover:text-white'
                  }`}
                >
                  <span>{t('nav_get_started')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                isHomeSkyOverlay
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-[#F5F7FC] text-[#141B2D] border border-[#E4E9F5]'
              }`}
            >
              {language === 'en' ? 'አማ' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4E9F5] bg-white text-[#141B2D] px-4 py-6 space-y-5 shadow-xl">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#525E75]">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#141B2D]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#F1F4FA] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A859E] block px-1">
              {language === 'am' ? 'ተጨማሪ አገልግሎቶች' : 'More Resources'}
            </span>
            <div className="grid grid-cols-1 gap-1">
              {moreDropdownLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl flex items-center justify-between text-xs font-semibold text-[#525E75] hover:bg-[#F5F7FC] hover:text-[#141B2D]"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-[#5D6DF7]" />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#ECEFFE] text-[#5D6DF7]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F1F4FA] space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 text-xs">
                  <span className="font-bold text-[#141B2D]">{displayName}</span>
                  <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded-full bg-[#ECEFFE] text-[#5D6DF7]">
                    {userRole}
                  </span>
                </div>
                <Link
                  href={userRole === 'advocate' ? '/advocate/portal' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#5D6DF7] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>
                    {userRole === 'advocate' ? 'Open Advocate Portal' : 'My Inquiries Dashboard'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 border border-red-200 text-red-600 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="block text-center py-2 text-xs font-semibold text-[#525E75] hover:text-[#141B2D]"
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#5D6DF7] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5"
                >
                  <span>{t('nav_get_started')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}