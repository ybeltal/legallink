'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { RevealOnScroll, SkyGlassCard } from '@/components/MotionPrimitives';

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
    <section className="py-20 md:py-28 bg-white border-y border-[#E6EBF6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <RevealOnScroll className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#ECEFFE] text-[#5D6DF7] text-[10px] font-bold uppercase tracking-widest">
            {language === 'am' ? 'የደንበኞች አስተያየት' : 'TESTIMONIALS'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#141B2D] tracking-tight">
            {language === 'am' ? 'ደንበኞቻችን ምን ይላሉ?' : 'What Our Clients Say'}
          </h2>
          <p className="text-xs sm:text-sm text-[#647087]">
            {language === 'am'
              ? 'በመላው ኢትዮጵያና በዲያስፖራ የሚገኙ ተገልጋዮች ስለ ሊጋልሊንክ የሚሰጡት ተሞክሮ።'
              : 'Real experiences from individuals, founders, and diaspora users navigating Ethiopian law with LegalLink.'}
          </p>
        </RevealOnScroll>

        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <SkyGlassCard className="rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col justify-between min-h-[210px] space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#ECEFFE] text-[#5D6DF7] flex items-center justify-center shrink-0">
                  <Quote className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1" aria-label={`${current.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (current.rating || 5)
                          ? 'fill-[#5D6DF7] text-[#5D6DF7]'
                          : 'text-[#E4E9F5]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <blockquote
                key={current.id}
                className="ll-sky-reveal text-base sm:text-xl font-medium text-[#141B2D] leading-relaxed"
              >
                “{language === 'am' && current.amharic_quote ? current.amharic_quote : current.quote}”
              </blockquote>

              <div className="pt-4 border-t border-[#EEF2FA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5D6DF7] to-[#8EA2FF] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <strong className="text-sm font-bold text-[#141B2D] block">
                      {current.client_name}
                    </strong>
                    <span className="text-xs text-[#647087] block">{current.client_role}</span>
                  </div>
                </div>

                {current.practice_area && (
                  <span className="px-3 py-1 rounded-full bg-[#F5F7FC] text-[#4F61F0] border border-[#E4E9F5] text-[11px] font-semibold w-fit">
                    {current.practice_area}
                  </span>
                )}
              </div>
            </div>

            {total > 1 && (
              <div className="mt-8 pt-5 border-t border-[#EEF2FA] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Show testimonial ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? 'w-8 bg-[#5D6DF7]'
                          : 'w-2 bg-[#D5DDF2] hover:bg-[#AAB8E6]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 rounded-full bg-[#F5F7FC] hover:bg-[#5D6DF7] text-[#141B2D] hover:text-white border border-[#E4E9F5] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next testimonial"
                    className="w-9 h-9 rounded-full bg-[#F5F7FC] hover:bg-[#5D6DF7] text-[#141B2D] hover:text-white border border-[#E4E9F5] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </SkyGlassCard>
        </div>
      </div>
    </section>
  );
}