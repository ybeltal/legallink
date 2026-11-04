'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scale, Menu, X, ChevronDown, BookOpen, 
  GraduationCap, FileText, ShieldCheck, UserCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <img src="/logo.png" alt="LegalLink" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight text-[#0A1128]">
              Legal<span className="text-amber-500">Link</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <Link 
              href="/find-a-lawyer" 
              className={`hover:text-[#0A1128] transition-colors py-1 ${
                isActive('/find-a-lawyer') ? 'text-[#0A1128] border-b-2 border-amber-500' : ''
              }`}
            >
              Find a Lawyer
            </Link>

            <Link 
              href="/advocate/register" 
              className={`hover:text-[#0A1128] transition-colors py-1 ${
                isActive('/advocate/register') ? 'text-[#0A1128] border-b-2 border-amber-500' : ''
              }`}
            >
              For Lawyers
            </Link>

            <Link 
              href="/legaltalk" 
              className={`hover:text-[#0A1128] transition-colors py-1 ${
                isActive('/legaltalk') ? 'text-[#0A1128] border-b-2 border-amber-500' : ''
              }`}
            >
              LegalTalk
            </Link>

            <Link 
              href="/lexdraft" 
              className={`hover:text-[#0A1128] transition-colors py-1 ${
                isActive('/lexdraft') ? 'text-[#0A1128] border-b-2 border-amber-500' : ''
              }`}
            >
              LexDraft
            </Link>

            {/* More Ecosystem Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className="flex items-center gap-1 hover:text-[#0A1128] py-1 cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-scaleUp">
                  <Link
                    href="/nextgen"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    <div>
                      <strong className="block text-xs font-bold">NextGen Careers</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Internships & Pupillage</span>
                    </div>
                  </Link>

                  <Link
                    href="/library"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <div>
                      <strong className="block text-xs font-bold">Federal Library</strong>
                      <span className="text-[10px] text-slate-400 font-normal">122 Proclamations</span>
                    </div>
                  </Link>

                  <Link
                    href="/#escrow"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <strong className="block text-xs font-bold">Telebirr Escrow</strong>
                      <span className="text-[10px] text-slate-400 font-normal">Commercial Code Art. 1240</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tray */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'en' ? 'bg-white text-[#0A1128] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  language === 'am' ? 'bg-white text-[#0A1128] shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                አማ
              </button>
            </div>

            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-[#0A1128] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-xs font-bold">
            <Link
              href="/find-a-lawyer"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              Find a Lawyer
            </Link>
            <Link
              href="/advocate/register"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              For Lawyers & Chambers
            </Link>
            <Link
              href="/legaltalk"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              LegalTalk Articles
            </Link>
            <Link
              href="/lexdraft"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              LexDraft Contracts
            </Link>
            <Link
              href="/nextgen"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              NextGen Careers
            </Link>
            <Link
              href="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-800"
            >
              Federal Proclamations Library
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg ${language === 'en' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('am')}
                className={`px-3 py-1 rounded-lg ${language === 'am' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
              >
                አማ
              </button>
            </div>

            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-xl text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 bg-[#0A1128] text-white text-xs font-bold rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}