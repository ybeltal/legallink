'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { RevealOnScroll, SpotlightCard } from '@/components/MotionPrimitives';

export interface TestimonialItem {
  id: string;
  client_name: string;
  client_role: string;
  practice_area?: string | null;
  quote: string;
  amharic_quote?: string | null;
  rating: number;
}

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'fallback-1',
    client_name: 'Hanna T.',
    client_role: 'SME Founder • Addis Ababa',
    practice_area: 'Corporate & Business Law',
    quote:
      'LegalLink helped me prepare our first employment contracts in both Amharic and English on LexDraft and connected me with a verified corporate advocate within hours.',
    amharic_quote:
      'ሊጋልሊንክ የሥራ ቅጥር ውሎቻችንን በአማርኛ እና በእንግሊዝኛ በሌክስ ድራፍት እንድናዘጋጅ እና ከተረጋገጠ የንግድ ጠበቃ ጋር በፍጥነት እንድንገናኝ ረድቶናል።',
    rating: 5,
  },
  {
    id: 'fallback-2',
    client_name: 'Bereket M.',
    client_role: 'Ethiopian Diaspora • Washington, D.C.',
    practice_area: 'Diaspora & Property Law',
    quote:
      'Handling a family property matter from abroad used to rely purely on guesswork. Through LegalLink, I understood the exact Embassy Power of Attorney steps and connected directly with local counsel.',
    amharic_quote:
      'ከውጭ ሀገር ሆኖ የቤተሰብ ንብረት ጉዳይ መከታተል ቀላል አልነበረም። በሊጋልሊንክ በኩል የኤምባሲ ውክልና ሂደቱን በግልጽ ተረድቼ ከተረጋገጠ ጠበቃ ጋር በቀጥታ ተገናኝቻለሁ።',
    rating: 5,
  },
  {
    id: 'fallback-3',
    client_name: 'Dawit G.',
    client_role: 'HR Manager • Hawassa',
    practice_area: 'Employment Law',
    quote:
      'The LegalTalk guides and severance calculator gave our team instant clarity on Labour Proclamation No. 1156/2019 before we even stepped into a formal legal consultation.',
    amharic_quote:
      'የሊጋልቶክ መመሪያዎች እና የስንብት ክፍያ ማስያው ወደ መደበኛ የህግ ምክክር ከመሄዳችን በፊት ስለ አዋጅ 1156/2019 ግልጽ እውቀት ሰጥተውናል።',
    rating: 5,
  },
];

export default function ClientTestimonialsCarousel() {
  const { language } = useLanguage();
  const supabase = createClient();

  const [items, setItems] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, client_name, client_role, practice_area, quote, amharic_quote, rating')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && mounted) {
          setItems(data as TestimonialItem[]);
          setActiveIndex(0);
        }
      } catch {
        // Keep fallback testimonials
      }
    };

    loadTestimonials();
    return () => {
      mounted = false;
    };
  }, []);

  const total = items.length;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (total > 0 ? (prev + 1) % total : 0));
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (total > 0 ? (prev - 1 + total) % total : 0));
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [isPaused, total, goNext]);

  const current = items[activeIndex] || items[0];
  if (!current) return null;

  const initials = current.client_name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#F0F9FF] to-white border-b border-sky-100 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
            {language === 'am' ? 'የደንበኞች አስተያየት' : 'CLIENT STORIES'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            {language === 'am' ? 'ደንበኞቻችን ምን ይላሉ?' : 'What Our Clients Say'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'am'
              ? 'በመላው ኢትዮጵያና በዲያስፖራ የሚገኙ ተገልጋዮች ስለ ሊጋልሊንክ የሚሰጡት ተሞክሮ።'
              : 'Real experiences from individuals, founders, and diaspora users navigating Ethiopian law with LegalLink.'}
          </p>
        </RevealOnScroll>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <SpotlightCard className="rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col justify-between min-h-[220px] space-y-6 relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                  <Quote className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1" aria-label={`${current.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (current.rating || 5)
                          ? 'fill-sky-500 text-sky-500'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <blockquote
                key={current.id}
                className="ll-word-reveal text-base sm:text-xl font-semibold text-[#0A1128] leading-relaxed"
              >
                “{language === 'am' && current.amharic_quote ? current.amharic_quote : current.quote}”
              </blockquote>

              <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <strong className="text-sm font-black text-[#0A1128] block">
                      {current.client_name}
                    </strong>
                    <span className="text-xs text-slate-500 block">{current.client_role}</span>
                  </div>
                </div>

                {current.practice_area && (
                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold w-fit">
                    {current.practice_area}
                  </span>
                )}
              </div>
            </div>

            {total > 1 && (
              <div className="mt-8 pt-5 border-t border-sky-100 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Show testimonial ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? 'w-8 bg-sky-500'
                          : 'w-2 bg-sky-200 hover:bg-sky-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next testimonial"
                    className="w-9 h-9 rounded-xl bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}