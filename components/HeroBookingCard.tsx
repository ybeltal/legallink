'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Star, Clock, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroBookingCard() {
  const { language, t } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  const slots = ['10:00 AM', '2:00 PM', '4:30 PM'];

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
      {/* Background Subtle Tilt Card for Depth */}
      <div className="absolute inset-0 bg-slate-100 rounded-3xl transform rotate-2 translate-y-3 -z-10 border border-slate-200/80 hidden sm:block" />

      {/* Main Glass Booking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 border border-slate-200 space-y-5 relative">
        
        {/* Floating Live Indicator Pill (Generic Expression) */}
        <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{language === 'am' ? 'የተረጋገጡ ጠበቆች በመስመር ላይ' : 'Active Verified Counsel'}</span>
        </div>

        {/* Lawyer Profile Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0A1128] text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              MH
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <strong className="text-sm font-black text-[#0A1128]">
                  {language === 'am' ? 'ጠበቃ ሙሉ ኃይሌ' : 'Advocate Mulu Haile'}
                </strong>
              </div>
              <span className="text-[11px] text-slate-500 block font-medium">
                {language === 'am' ? 'የንግድና ኩባንያ ሕግ' : 'Corporate & Business Law'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('widget_verified')}</span>
          </div>
        </div>

        {/* Star Rating & Consultations Count */}
        <div className="flex items-center gap-1.5 text-xs text-slate-700 pt-0.5">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <strong className="font-bold">5.0</strong>
          <span className="text-slate-400 font-normal">
            • {language === 'am' ? 'ከፍተኛ የተገልጋይ ግምገማ' : 'Top Verified Rating'}
          </span>
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
            {t('widget_avail_label')}
          </span>

          {/* Time Slots Selector */}
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking CTA Button */}
        <div className="pt-2">
          <Link
            href="/find-a-lawyer"
            className="w-full py-3.5 bg-[#0A1128] hover:bg-[#102A43] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <span>{t('widget_book_btn')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Floating Seal */}
        <div className="flex justify-end pt-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('widget_trusted_seal')}</span>
          </div>
        </div>

      </div>
    </div>
  );
}