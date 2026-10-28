'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'am';

interface Translations {
  [key: string]: {
    en: string;
    am: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  nav_home: { en: 'Home', am: 'ዋና ገጽ' },
  nav_find_lawyer: { en: 'Find a Lawyer', am: 'ጠበቃ ፈልግ' },
  nav_practice_areas: { en: 'Practice Areas', am: 'የህግ ዘርፎች' },
  nav_diaspora: { en: 'Diaspora Desk', am: 'የዲያስፖራ አገልግሎት' },
  nav_legaltalk: { en: 'LegalTalk Q&A', am: 'የህግ ውይይት' },
  nav_tools: { en: 'Legal Tools', am: 'የህግ መሳሪያዎች' },
  nav_for_advocates: { en: 'For Advocates', am: 'ለጠበቆች' },
  nav_sign_in: { en: 'Sign In', am: 'ግባ' },
  nav_sign_out: { en: 'Sign Out', am: 'ውጣ' },
  nav_book_consultation: { en: 'Book Consultation', am: 'ቀጠሮ ይያዙ' },
  nav_escrow: { en: 'Escrow Desk & Disputes', am: 'የዋስትና ሂሳብና ክርክር መፍቻ' },

  // Hero Section
  hero_badge: { 
    en: 'Federal Ministry of Justice Verified Advocates', 
    am: 'በፌዴራል ፍትህ ሚኒስቴር የተረጋገጡ ጠበቆች' 
  },
  hero_title_1: { en: 'Connect with Verified Ethiopian Lawyers, ', am: 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር ' },
  hero_title_2: { en: 'Safely.', am: 'በአስተማማኝ ሁኔታ ይገናኙ።' },
  hero_sub: {
    en: 'Book certified legal consultations, resolve business and property matters, and draft contracts. Every fee is held securely in Telebirr escrow until your consultation is delivered.',
    am: 'የተረጋገጠ የህግ ማማከር ቀጠሮ ይያዙ፤ የንግድና ይዞታ ጉዳዮችን ይፍቱ፤ ውሎችን ያዘጋጁ። እያንዳንዱ ክፍያ አገልግሎቱ እስከሚሰጥ ድረስ በቴሌብር የዋስትና ሂሳብ (Escrow) ውስጥ በጥንቃቄ ይቀመጣል።'
  },
  hero_cta: { en: 'Find an Advocate', am: 'ጠበቃ ይፈልጉ' },
  hero_stat_licensed: { en: 'Licensed & Vetted', am: 'የተረጋገጡና ፍቃድ ያላቸው' },
  hero_stat_escrow: { en: 'Escrow Protected', am: 'በቴሌብር ዋስትና የተጠበቀ' },
  hero_stat_response: { en: 'Avg Response', am: 'አማካይ የምላሽ ጊዜ' },

  // Diaspora Callout Banner
  diaspora_pill: { en: 'Living in the US, Europe, or the Gulf?', am: 'በአሜሪካ፣ አውሮፓ ወይም በመካከለኛው ምስራቅ የሚኖሩ?' },
  diaspora_title: { en: 'Ethiopian Diaspora Legal Services Hub', am: 'የኢትዮጵያ ዲያስፖራ የህግ አገልግሎት ማዕከል' },
  diaspora_desc: { 
    en: 'Execute embassy powers of attorney (ውክልና), audit land deeds (ካርታ), and liquidate estates in Ethiopia remotely with USD / EUR escrow protection.', 
    am: 'የኤምባሲ ውክልና ስልጣን ያጽድቁ፤ የመሬት ካርታ ህጋዊነትን ያረጋግጡ፤ የውርስ ሀብት ክፍፍልን በዶላር ወይም ዩሮ ዋስትና ከውጭ ሀገር ሆነው ያስፈጽሙ።' 
  },
  diaspora_btn: { en: 'Explore Diaspora Desk', am: 'የዲያስፖራ አገልግሎቶችን ይመልከቱ' },

  // How it works
  hiw_tag: { en: 'SIMPLE & PREDICTABLE', am: 'ቀላል እና ግልጽ' },
  hiw_title: { en: 'How LegalLink Works', am: 'ሊጋልሊንክ እንዴት ይሰራል?' },
  hiw_sub: { 
    en: 'Transparent legal consultations backed by statutory standards and escrow protection.', 
    am: 'በህጋዊ ደረጃዎች እና በዋስትና ሂሳብ የተደገፈ ግልጽ የህግ ማማከር አገልግሎት።' 
  },
  hiw_step1_title: { en: '1. Describe Your Need', am: '1. ጉዳይዎን ያብራሩ' },
  hiw_step1_desc: { 
    en: 'Choose your legal domain and submit a brief description in Amharic or English. You can also record a secure voice brief right from your device.', 
    am: 'የህግ ዘርፉን ይምረጡ እና በአማርኛ ወይም በእንግሊዝኛ አጭር ማብራሪያ ያስገቡ። እንዲሁም በቀጥታ የድምፅ መግለጫ መቅዳት ይችላሉ።' 
  },
  hiw_step2_title: { en: '2. Choose Verified Counsel', am: '2. የተረጋገጠ ጠበቃ ይምረጡ' },
  hiw_step2_desc: { 
    en: 'Review verified profiles with authentic Ministry of Justice bar licenses, transparent hourly rates, client ratings, and litigation experience.', 
    am: 'ትክክለኛ የፍትህ ሚኒስቴር የጥብቅና ፍቃድ፣ ግልጽ የታሪፍ ተመን፣ የተገልጋይ ግምገማዎች እና የፍርድ ቤት ልምድ ያላቸውን ጠበቆች ይምረጡ።' 
  },
  hiw_step3_title: { en: '3. Consult via Telebirr Escrow', am: '3. በቴሌብር የዋስትና ሂሳብ ያማክሩ' },
  hiw_step3_desc: { 
    en: 'Authorize your retainer securely via Telebirr USSD. Funds remain protected in escrow until your legal consultation is fulfilled.', 
    am: 'ክፍያዎን በቴሌብር USSD ደህንነቱ በተጠበቀ መልኩ ይፈጽሙ። የህግ ምክሩ እስኪጠናቀቅ ድረስ ገንዘቡ በዋስትና ሂሳብ ውስጥ ተጠብቆ ይቆያል።' 
  },

  // Practice Areas Section
  pa_tag: { en: 'SPECIALIZED EXPERTISE', am: 'ልዩ የሙያ ዘርፎች' },
  pa_title: { en: 'Select Your Legal Domain', am: 'የሚፈልጉትን የህግ ዘርፍ ይምረጡ' },
  pa_view_all: { en: 'View full practice area directory', am: 'ሁሉንም የህግ ዘርፎች ይመልከቱ' },
  pa_find_btn: { en: 'Find Lawyers', am: 'ጠበቃ ፈልግ' },

  // Featured Advocates
  fa_tag: { en: 'CREDENTIAL AUDITED', am: 'ማረጋገጫቸው የተመረመረ' },
  fa_title: { en: 'Featured Senior Advocates', am: 'ተለይተው የቀረቡ ከፍተኛ ጠበቆች' },
  fa_view_all: { en: 'View full advocate directory', am: 'ሁሉንም ጠበቆች ይመልከቱ' },
  fa_book_session: { en: 'Book Session', am: 'ቀጠሮ ይያዙ' },
  fa_retainer_label: { en: 'Initial Retainer', am: 'የማማከር ዋጋ' },

  // LegalTalk Knowledge Hub
  lt_tag: { en: 'EXPERT LEGAL ANSWERS & INSIGHTS', am: 'የባለሙያ ህጋዊ ምላሾችና ትንታኔዎች' },
  lt_title: { en: 'LegalTalk Knowledge Hub', am: 'የሊጋልቶክ የህግ እውቀት ማዕከል' },
  lt_sub: { 
    en: 'Direct statutory answers and commentary provided exclusively by verified Ethiopian advocates.', 
    am: 'በተረጋገጡ የኢትዮጵያ ጠበቆች ብቻ የተዘጋጁ ህጋዊ ምላሾችና ማብራሪያዎች።' 
  },
  lt_explore: { en: 'Explore All Legal Answers', am: 'ሁሉንም የህግ ምላሾች ይመልከቱ' },
  lt_consult: { en: 'Consult Counsel', am: 'ጠበቃውን ያማክሩ' },

  // Escrow Notice
  escrow_tag: { en: 'GUARANTEED CLIENT INTEGRITY', am: 'የተሟላ የደንበኛ ደህንነት' },
  escrow_title: { en: 'Protected by Telebirr Escrow', am: 'በቴሌብር የዋስትና ሂሳብ (Escrow) የተጠበቀ' },
  escrow_desc: {
    en: 'No upfront risk. When you book a consultation on LegalLink, your funds are securely held in corporate escrow under Ethiopian Commercial Code regulations. Payout is released to the advocate only when the consultation is completed.',
    am: 'ምንም አይነት የገንዘብ ስጋት የለም። በሊጋልሊንክ የማማከር ቀጠሮ ሲይዙ ገንዘብዎ በኢትዮጵያ የንግድ ህግ ድንጋጌዎች መሰረት በዋስትና ሂሳብ ይቀመጣል። ክፍያው ለጠበቃው የሚለቀቀው አገልግሎቱ በተሟላ ሁኔታ ሲሰጥ ብቻ ነው።'
  },
  escrow_desk_btn: { en: 'Two-Party Escrow Resolution Desk ➔', am: 'የሁለትዮሽ የዋስትና ሂሳብና አወዛጋቢ ጉዳዮች መፍቻ ➔' },
  escrow_ussd_title: { en: 'Ethio Telecom USSD Direct Push', am: 'የኢትዮ ቴሌኮም ቀጥታ የUSSD ጥያቄ' },
  escrow_ussd_desc: {
    en: 'Approve retainers seamlessly on your phone. You will receive an instant Telebirr USSD prompt and an official Ethio Telecom SMS confirmation once your case is booked.',
    am: 'ክፍያዎችን በቀጥታ በስልክዎ ያጽድቁ። ቀጠሮዎ እንደተያዘ ወዲያውኑ የቴሌብር የUSSD ጥያቄ እና ይፋዊ የኢትዮ ቴሌኮም የSMS ማረጋገጫ ይደርስዎታል።'
  },
  escrow_start_btn: { en: 'Start a Consultation', am: 'የማማከር ቀጠሮ ይጀምሩ' },
  escrow_rules_btn: { en: 'Escrow Rules', am: 'የዋስትና ሂሳብ ህጎች' },

  // Footer
  footer_tagline: { 
    en: "Ethiopia's verified legal services marketplace and digital compliance intermediary.", 
    am: 'የኢትዮጵያ የተረጋገጠ የህግ አገልግሎት የገበያ መድረክ እና የዲጂታል ህግ ተገዢነት አገናኝ።' 
  },
  footer_rights: { en: '© 2026 LegalLink Ethiopia. All rights reserved.', am: '© 2026 ሊጋልሊንክ ኢትዮጵያ። መብቱ በህግ የተጠበቀ ነው።' },
  footer_disclaimer: { 
    en: 'Non-law firm intermediary platform. Direct representation provided exclusively by licensed Ethiopian advocates.', 
    am: 'የህግ አገናኝ መድረክ። ቀጥተኛ ውክልና እና የህግ አገልግሎት የሚሰጠው ፈቃድ ባላቸው የኢትዮጵያ ጠበቆች ብቻ ነው።' 
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('legallink_lang') as Language;
      if (saved === 'en' || saved === 'am') {
        setLanguageState(saved);
      }
    } catch {
      // Ignore local storage errors in private/restricted browsing
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('legallink_lang', lang);
    } catch {
      // Ignore local storage errors
    }
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'am' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (!DICTIONARY[key]) return key;
    return DICTIONARY[key][language] || DICTIONARY[key]['en'];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  // Safe fallback to prevent Next.js prerender / _not-found worker crash
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string) => DICTIONARY[key]?.['en'] || key,
    };
  }
  return context;
}