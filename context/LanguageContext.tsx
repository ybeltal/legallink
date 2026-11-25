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
  // Navigation Bar
  nav_find_lawyer: { en: 'Find a Lawyer', am: 'ጠበቃ ፈልግ' },
  nav_for_lawyers: { en: 'For Lawyers', am: 'ለጠበቆች' },
  nav_legaltalk: { en: 'LegalTalk', am: 'ሊጋልቶክ' },
  nav_lexdraft: { en: 'LexDraft', am: 'ሌክስ ድራፍት' },
  nav_about: { en: 'About', am: 'ስለ እኛ' },
  nav_more: { en: 'More', am: 'ተጨማሪ' },
  nav_home: { en: 'Home', am: 'ዋና ገጽ' },
  nav_legal_memo: { en: 'A4 Legal Opinion Memo', am: 'የህግ አስተያየት ሰነድ (A4)' },
  nav_escrow_desk: { en: 'Direct Matching', am: 'ቀጥተኛ የጠበቃ ግንኙነት' },
  nav_legal_tools: { en: 'Legal Calculators & Tools', am: 'የህግ ማስያ መሳሪያዎች' },
  nav_sign_in: { en: 'Sign In', am: 'ግባ' },
  nav_get_started: { en: 'Get Started', am: 'ጀምር' },
  nav_sign_out: { en: 'Sign Out', am: 'ውጣ' },
  nav_tagline: { en: "Ethiopia's Legal Ecosystem", am: 'የኢትዮጵያ ዲጂታል የህግ መድረክ' },

  // Hero Section
  hero_badge: {
    en: 'Ethiopia’s Integrated Digital Legal Platform',
    am: 'የኢትዮጵያ የተቀናጀ ዲጂታል የህግ መድረክ',
  },
  hero_title_1: { en: 'The Future of Law, ', am: 'የህግ አገልግሎት ቀጣይ ዘመን፣ ' },
  hero_title_2: { en: 'Today.', am: 'ዛሬ።' },
  hero_sub: {
    en: 'A digital environment for finding, accessing, and managing legal support in Ethiopia — bringing verified advocates, consultations, LegalTalk guides, and LexDraft forms into one place.',
    am: 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር ለመገናኘት፣ ውሎችን ለማዘጋጀት እና የህግ እውቀት ለማግኘት የተገነባ የተቀናጀ ዲጂታል የህግ መድረክ።',
  },
  hero_cta_find: { en: 'Find a Lawyer', am: 'ጠበቃ ፈልግ' },
  hero_cta_start: { en: 'Get Started', am: 'አሁን ጀምር' },
  hero_stat_lawyers: { en: 'Verified Lawyers', am: 'የተረጋገጡ ጠበቆች' },
  hero_stat_consultations: { en: 'Consultations', am: 'የተሰጡ ምክክሮች' },
  hero_stat_satisfaction: { en: 'Client Satisfaction', am: 'የተገልጋይ እርካታ' },
  hero_stat_response: { en: 'Avg. Response', am: 'አማካይ የምላሽ ጊዜ' },

  // Hero Booking Card Widget
  widget_verified: { en: 'Verified', am: 'የተረጋገጠ' },
  widget_online_pill: { en: 'MOJ Verified Advocates', am: 'የተረጋገጡ ጠበቆች' },
  widget_avail_label: { en: 'AVAILABLE TODAY', am: 'ለዛሬ ክፍት ሰዓታት' },
  widget_book_btn: { en: 'Request Free Consultation', am: 'ነፃ ምክክር ይጠይቁ' },
  widget_trusted_seal: { en: 'Built for Ethiopia', am: 'ለኢትዮጵያ የተገነባ' },

  // Process: How It Works
  hiw_tag: { en: 'PROCESS', am: 'ሂደት' },
  hiw_title: { en: 'How It Works', am: 'አሰራሩ እንዴት ነው?' },
  hiw_sub: {
    en: 'Get the legal help you need in three clear, organized steps.',
    am: 'በሶስት ቀላልና ግልጽ እርምጃዎች የሚፈልጉትን የህግ እገዛ ያግኙ።',
  },
  hiw_step1_title: { en: 'Describe Your Need', am: 'ጉዳይዎን ያብራሩ' },
  hiw_step1_desc: {
    en: 'Tell us about your legal situation in plain Amharic or English — no legal jargon required.',
    am: 'ያለዎትን የህግ ጉዳይ በቀላል አማርኛ ወይም እንግሊዝኛ ይግለጹልን። የተወሳሰበ የህግ ቃላት አያስፈልግም።',
  },
  hiw_step2_title: { en: 'Match with an Advocate', am: 'ከተስማሚ ጠበቃ ጋር ይገናኙ' },
  hiw_step2_desc: {
    en: 'Browse verified profiles filtered by practice area, location, language, and court standing.',
    am: 'በህግ ዘርፍ፣ በከተማ፣ በቋንቋ እና በፍርድ ቤት ደረጃ የተጣሩ የጠበቆችን ማህደር ይመልከቱ።',
  },
  hiw_step3_title: { en: 'Consult & Resolve', am: 'ያማክሩ እና ይፍቱ' },
  hiw_step3_desc: {
    en: 'Connect directly by phone, video, or chamber visit and track your inquiry cleanly in one place.',
    am: 'በስልክ፣ በቪዲዮ ወይም በቢሮ በቀጥታ ይገናኙ እና ጉዳይዎን በአንድ ቦታ በግልጽ ይከታተሉ።',
  },

  // Practice Areas Section
  pa_tag: { en: 'EXPERTISE', am: 'የሙያ ዘርፎች' },
  pa_title: { en: 'Practice Areas', am: 'የህግ ዘርፎች' },
  pa_sub: {
    en: 'Find specialized legal expertise across every area of Ethiopian law.',
    am: 'በሁሉም የኢትዮጵያ ህግ መስኮች ልዩ የጥብቅና ልምድ ያላቸውን ባለሙያዎች ያግኙ።',
  },
  pa_browse_all: { en: 'Browse All Areas', am: 'ሁሉንም ዘርፎች ይመልከቱ' },
  pa_corp_title: { en: 'Corporate & Business', am: 'የንግድና ኩባንያ ሕግ' },
  pa_corp_desc: {
    en: 'Company formation, contracts, M&A, corporate governance.',
    am: 'የኩባንያ ምስረታ፣ የንግድ ውሎች፣ ውህደት እና የዳይሬክተሮች ቦርድ ተገዢነት።',
  },
  pa_family_title: { en: 'Family Law', am: 'የቤተሰብ ሕግ' },
  pa_family_desc: {
    en: 'Divorce, child custody, adoption, inheritance disputes.',
    am: 'የፍቺ ስምምነት፣ የልጆች አስተዳደግ፣ የጉዲፈቻ እና የውርስ ሀብት ክፍፍል።',
  },
  pa_prop_title: { en: 'Property & Real Estate', am: 'የመሬትና ይዞታ ሕግ' },
  pa_prop_desc: {
    en: 'Land rights, title transfers, lease agreements, disputes.',
    am: 'የይዞታ መብት፣ የካርታ ትክክለኛነት ማረጋገጫ፣ የቤት ኪራይ ውል እና ክርክሮች።',
  },
  pa_ip_title: { en: 'Intellectual Property', am: 'የአእምሯዊ ንብረት ሕግ' },
  pa_ip_desc: {
    en: 'Trademark, copyright, patents, and IP protection.',
    am: 'የንግድ ምልክት ምዝገባ፣ የቅጂ መብት ጥበቃ እና የፈጠራ ውጤት ምዝገባ።',
  },
  pa_labor_title: { en: 'Employment Law', am: 'የሠራተኛና አሠሪ ሕግ' },
  pa_labor_desc: {
    en: 'Labor disputes, contracts, workplace rights, severance.',
    am: 'የስራ ቅጥር ውሎች፣ የስንብት ክፍያ ስሌት እና የስራ ክርክር ፍርድ ቤት ውክልና።',
  },
  pa_crim_title: { en: 'Criminal Defense', am: 'የወንጀል መከላከያ ሕግ' },
  pa_crim_desc: {
    en: 'Representation, bail, appeals, and rights protection.',
    am: 'የዋስትና ጥያቄ፣ ይግባኝ እና በፍርድ ቤት ቀጥተኛ የወንጀል መከላከያ ውክልና።',
  },
  pa_imm_title: { en: 'Immigration & Diaspora', am: 'ኢሚግሬሽንና ዲያስፖራ' },
  pa_imm_desc: {
    en: 'Visas, residency, diaspora legal matters, citizenship.',
    am: 'የመኖሪያ ፈቃድ፣ ቪዛ፣ የዲያስፖራ ጉዳዮች እና የዜግነት ህጋዊ ድጋፍ።',
  },
  pa_ngo_title: { en: 'NGO & Compliance', am: 'የበጎ አድራጎት ማህበራትና ተገዢነት' },
  pa_ngo_desc: {
    en: 'Registration, regulatory compliance, grant agreements.',
    am: 'የሲቪል ማህበረሰብ ድርጅቶች ምዝገባ፣ የግብርና የህግ ተገዢነት ኦዲት።',
  },

  // Featured Lawyers
  fl_tag: { en: 'PROFESSIONALS', am: 'የህግ ባለሙያዎች' },
  fl_title: { en: 'Featured Advocates', am: 'ተለይተው የቀረቡ ጠበቆች' },
  fl_sub: {
    en: 'Verified legal professionals ready to review your inquiry.',
    am: 'ጉዳይዎን ለመቀበል ዝግጁ የሆኑ የተረጋገጡ ጠበቆች።',
  },
  fl_view_all: { en: 'View All Advocates', am: 'ሁሉንም ጠበቆች ይመልከቱ' },
  fl_consultations: { en: 'consultations', am: 'ምክክሮች' },
  fl_yrs_exp: { en: 'yrs exp.', am: 'ዓመት ልምድ' },
  fl_view_profile: { en: 'Request Consultation', am: 'ምክክር ይጠይቁ' },

  // Diaspora Section
  diaspora_tag: {
    en: 'CROSS-BORDER ETHIOPIAN LEGAL DESK',
    am: 'የድንበር ተሻጋሪ የኢትዮጵያ የህግ ማዕከል',
  },
  diaspora_title: {
    en: 'Ethiopian Diaspora Legal Services Hub',
    am: 'የኢትዮጵያ ዲያስፖራ የህግ አገልግሎት ማዕከል',
  },
  diaspora_sub: {
    en: 'Manage your land titles, embassy powers of attorney, inheritance successions, and commercial investments in Ethiopia remotely with verified local advocates.',
    am: 'በኢትዮጵያ የሚገኙ የመሬት ካርታዎችን፣ የኤምባሲ ውክልናዎችን፣ የውርስ ሀብቶችን እና የንግድ ኢንቨስትመንቶችን ከውጭ ሀገር ሆነው ከተረጋገጡ ጠበቆች ጋር ያስፈጽሙ።',
  },
  diaspora_poa_title: {
    en: 'Embassy Power of Attorney (ውክልና) Verification',
    am: 'የኤምባሲ ውክልና ማረጋገጫ',
  },
  diaspora_poa_desc: {
    en: 'Statutory drafting, review, and DARS authentication for general or special power of attorney from worldwide embassies.',
    am: 'በውጭ ሀገር በሚገኙ የኢትዮጵያ ኤምባሲዎች የሚሰጡ ጠቅላላና ልዩ የውክልና ሰነዶችን ማዘጋጀትና ማረጋገጥ።',
  },
  diaspora_land_title: {
    en: 'Land Title & Property Audit (ካርታ)',
    am: 'የመሬት ካርታና ይዞታ ህጋዊነት ማረጋገጫ',
  },
  diaspora_land_desc: {
    en: 'Title deed authentication, municipal leasehold audits, boundary dispute defense, and recovery across Ethiopian cities.',
    am: 'የመሬት ይዞታዎችን ትክክለኛነት ማጣራት፣ የሊዝ ውል ማደስና ክርክሮችን መፍታት።',
  },
  diaspora_est_title: {
    en: 'Estate Succession & Inheritance Administration',
    am: 'የውርስ ሀብት ክፍፍልና አስተዳደር',
  },
  diaspora_est_desc: {
    en: 'Representation in Federal First Instance Courts to petition for legal heir certificates and manage estate transfers.',
    am: 'በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤቶች የውርስ አጣሪነት ውሳኔ ማግኘትና ንብረቶችን ማስተላለፍ።',
  },
  diaspora_cta_btn: { en: 'Open a Diaspora Matter', am: 'የዲያስፖራ ጉዳይ ይክፈቱ' },

  // Why LegalLink
  why_tag: { en: 'WHY LEGALLINK', am: 'ለምን ሊጋልሊንክ?' },
  why_title: { en: 'Why LegalLink', am: 'ለምን ሊጋልሊንክ?' },
  why_sub: {
    en: 'Built to bridge the gap between legal expertise and access across Ethiopia.',
    am: 'በኢትዮጵያ የህግ ባለሙያዎችንና ተገልጋዮችን በአንድ የተደራጀ መድረክ ለማገናኘት የተገነባ።',
  },
  why_lawyers_stat: { en: 'Verified Lawyers', am: 'የተረጋገጡ ጠበቆች' },
  why_consult_stat: { en: 'Consultations Completed', am: 'የተጠናቀቁ ምክክሮች' },
  why_satisfaction_stat: { en: 'Client Satisfaction', am: 'የተገልጋይ እርካታ' },
  why_areas_stat: { en: 'Practice Areas', am: 'የህግ ዘርፎች' },
  why_c1_title: { en: 'Verified Advocates', am: 'የተረጋገጡ ጠበቆች' },
  why_c1_desc: {
    en: 'Every advocate submits Federal Ministry of Justice or Regional Bar credentials for review before receiving a verified badge.',
    am: 'እያንዳንዱ ጠበቃ የፍትህ ሚኒስቴር ወይም የክልል የጥብቅና ፍቃዱን አቅርቦ ይረጋገጣል።',
  },
  why_c2_title: { en: 'Private & Role-Protected', am: 'ሚስጥራዊ እና የተጠበቀ' },
  why_c2_desc: {
    en: 'Consultation briefs are secured with database Row-Level Security so only you and your selected advocate see your inquiry.',
    am: 'የደንበኞች ጥያቄዎች ለተመረጠው ጠበቃ ብቻ እንዲታዩ በደህንነት ደንቦች የተጠበቁ ናቸው።',
  },
  why_c3_title: { en: 'Free Public Launch', am: 'ነፃ የመድረክ አገልግሎት' },
  why_c3_desc: {
    en: 'Zero platform fees to discover advocates, draft LexDraft templates, or access 122 Ethiopian proclamations.',
    am: 'ጠበቃ ለመፈለግ፣ ውሎችን ለማዘጋጀት እና ህጎችን ለማንበብ ምንም ክፍያ አይጠየቅም።',
  },
  why_c4_title: { en: 'Bilingual Access (አማ / EN)', am: 'ባለሁለት ቋንቋ ድጋፍ' },
  why_c4_desc: {
    en: 'Navigate, draft forms, and consult advocates in Amharic or English across desktop and mobile.',
    am: 'በአማርኛ ወይም በእንግሊዝኛ ሰነዶችን ያዘጋጁ እና ጠበቆችን ያማክሩ።',
  },

  // LexDraft Section
  lex_pill: { en: 'Document Automation', am: 'ዲጂታል የውል ዝግጅት' },
  lex_title: {
    en: 'Generate Legal Documents in Minutes',
    am: 'ህጋዊ ሰነዶችን በደቂቃዎች ውስጥ ያዘጋጁ',
  },
  lex_sub: {
    en: 'LexDraft automates the creation of contracts, agreements, powers of attorney, and court applications tailored to Ethiopian law.',
    am: 'ሌክስ ድራፍት በኢትዮጵያ ህግ መሰረት የስራ ውሎችን፣ የኪራይ ስምምነቶችንና የውክልና ሰነዶችን በራስ-ሰር ያዘጋጃል።',
  },
  lex_item1: { en: 'Employment Contracts', am: 'የስራ ቅጥር ውሎች' },
  lex_item2: { en: 'Lease Agreements', am: 'የቤትና ንብረት ኪራይ ውሎች' },
  lex_item3: { en: 'Power of Attorney', am: 'የውክልና ስልጣን ሰነዶች' },
  lex_item4: { en: 'Court Appeals & Applications', am: 'የይግባኝ እና የፍርድ ቤት ማመልከቻዎች' },
  lex_item5: { en: 'PLC Articles of Association', am: 'የኃ/የተ/የግ/ማህበር መመሥረቻ ጽሑፍ' },
  lex_item6: { en: 'Amharic + English Word Export', am: 'በአማርኛና በእንግሊዝኛ Word ማውረጃ' },
  lex_cta_btn: { en: 'Try LexDraft Free', am: 'ሌክስ ድራፍትን በነፃ ይሞክሩ' },

  // LegalTalk Knowledge Hub
  lt_pill: { en: 'Education Hub', am: 'የትምህርትና ግንዛቤ ማዕከል' },
  lt_title: { en: 'LegalTalk', am: 'ሊጋልቶክ የህግ እውቀት' },
  lt_sub: {
    en: 'Legal education for every Ethiopian — read or listen with built-in audio narration.',
    am: 'ህጋዊ ትምህርት ለእያንዳንዱ ኢትዮጵያዊ — ያንብቡ ወይም በድምፅ ያዳምጡ።',
  },
  lt_explore_btn: { en: 'Explore LegalTalk', am: 'ሁሉንም ጽሑፎች ይመልከቱ' },
  lt_art1_tag: { en: 'Business Law', am: 'የንግድ ሕግ' },
  lt_art1_title: {
    en: 'Starting a Business in Ethiopia: A Step-by-Step Legal Guide for 2026',
    am: 'በኢትዮጵያ ንግድ መጀመር፡ የ2026 የኩባንያ ምስረታ ህጋዊ ደረጃዎች',
  },
  lt_art1_desc: {
    en: 'A step-by-step guide to registering your startup under the revised Ethiopian Commercial Code.',
    am: 'በአዲሱ የንግድ ህግ መሰረት ኃ/የተ/የግ/ማህበር ስለመመስረት ደረጃ በደረጃ የቀረበ መመሪያ።',
  },
  lt_art2_tag: { en: 'Family Law', am: 'የቤተሰብ ሕግ' },
  lt_art2_title: {
    en: 'Divorce, Child Custody, and Marital Property Under Ethiopia’s Revised Family Code',
    am: 'ፍቺ፣ የልጆች አስተዳደግ እና የጋራ ንብረት ክፍፍል በተሻሻለው የቤተሰብ ሕግ',
  },
  lt_art2_desc: {
    en: 'Understanding property division, child custody, and maintenance under the Revised Family Code.',
    am: 'በተሻሻለው የቤተሰብ ህግ መሰረት የንብረት ክፍፍል እና የልጆች አስተዳደግ።',
  },
  lt_art3_tag: { en: 'Employee Rights', am: 'የሠራተኛ መብት' },
  lt_art3_title: {
    en: 'Wrongful Termination in Ethiopia: Know Your Rights Under the Labour Proclamation',
    am: 'ያለአግባብ ከስራ መሰናበት በኢትዮጵያ፡ በአዋጅ ቁጥር 1156/2019 የተሰጡዎት ህጋዊ መብቶች',
  },
  lt_art3_desc: {
    en: 'Key protections in Labour Proclamation No. 1156/2019 covering lawful dismissal, severance, and filing deadlines.',
    am: 'በአዋጅ ቁጥር 1156/2019 መሰረት የአሠሪ ግዴታዎችና የሠራተኛ መብቶች።',
  },

  // Official Footer Details (Synced with Pitch Deck)
  footer_tagline: {
    en: 'A digital environment for finding, accessing, and managing legal support in Ethiopia.',
    am: 'በኢትዮጵያ የህግ ድጋፍን ለማግኘት፣ ለመጠቀም እና ለማስተዳደር የተገነባ ዲጂታል መድረክ።',
  },
  footer_email: {
    en: 'info.legallinkethiopia@gmail.com',
    am: 'info.legallinkethiopia@gmail.com',
  },
  footer_phone: {
    en: '+251-964-600-737 / +251-905-941-865',
    am: '+251-964-600-737 / +251-905-941-865',
  },
  footer_address: {
    en: 'Addis Ababa, Ethiopia',
    am: 'አዲስ አበባ፣ ኢትዮጵያ',
  },
  footer_motto: {
    en: 'Justice delayed is justice denied — LegalLink ensures it is neither.',
    am: 'የዘገየ ፍትሕ የተከለከለ ፍትሕ ነው — ሊጋልሊንክ ሁለቱንም ይከላከላል።',
  },
  footer_platform_title: { en: 'PLATFORM', am: 'መድረክ' },
  footer_resources_title: { en: 'RESOURCES', am: 'መርጃዎች' },
  footer_company_title: { en: 'COMPANY', am: 'ድርጅት' },
  footer_legal_title: { en: 'LEGAL', am: 'ህጋዊ' },
  footer_disclaimer: {
    en: 'LegalLink connects clients with independent licensed advocates. We are not a law firm and do not provide legal advice directly.',
    am: 'ሊጋልሊንክ ደንበኞችን ከነፃ ጠበቆች ጋር የሚያገናኝ መድረክ ነው። የጥብቅና ማህበር ባለመሆኑ ቀጥተኛ የህግ ምክር አይሰጥም።',
  },
  footer_rights: {
    en: '© 2026 LegalLink Ethiopia. All rights reserved.',
    am: '© 2026 ሊጋልሊንክ ኢትዮጵያ። መብቱ በህግ የተጠበቀ ነው።',
  },
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
      // Ignore storage error
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('legallink_lang', lang);
    } catch {
      // Ignore storage error
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
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