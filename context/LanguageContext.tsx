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
  // Navigation Bar (Strict 5 core links + More)
  nav_find_lawyer: { en: 'Find a Lawyer', am: 'ጠበቃ ፈልግ' },
  nav_for_lawyers: { en: 'For Lawyers', am: 'ለጠበቆች' },
  nav_legaltalk: { en: 'LegalTalk', am: 'ሊጋልቶክ' },
  nav_lexdraft: { en: 'LexDraft', am: 'ሌክስ ድራፍት' },
  nav_about: { en: 'About', am: 'ስለ እኛ' },
  nav_more: { en: 'More', am: 'ተጨማሪ' },
  nav_home: { en: 'Home', am: 'ዋና ገጽ' },
  nav_legal_memo: { en: 'A4 Legal Opinion Memo', am: 'የህግ አስተያየት ሰነድ (A4)' },
  nav_escrow_desk: { en: 'Escrow Resolution Desk', am: 'የዋስትና ሂሳብ መዝገብ' },
  nav_legal_tools: { en: 'Legal Calculators & Tools', am: 'የህግ ማስያ መሳሪያዎች' },
  nav_sign_in: { en: 'Sign In', am: 'ግባ' },
  nav_get_started: { en: 'Get Started', am: 'ጀምር' },
  nav_sign_out: { en: 'Sign Out', am: 'ውጣ' },
  nav_tagline: { en: "Ethiopia's Legal Marketplace", am: 'የኢትዮጵያ የህግ ገበያ መድረክ' },

  // Hero Section
  hero_badge: { en: "Ethiopia's First Legal Marketplace", am: 'የኢትዮጵያ የመጀመሪያው የህግ ገበያ መድረክ' },
  hero_title_1: { en: 'The Future of Law, ', am: 'የህግ አገልግሎት ቀጣይ ዘመን፣ ' },
  hero_title_2: { en: 'Today.', am: 'ዛሬ።' },
  hero_sub: {
    en: 'Connect with verified Ethiopian lawyers for consultations, document drafting, and compliance support — quickly, affordably, and securely.',
    am: 'ከተረጋገጡ የኢትዮጵያ ጠበቆች ጋር ለማማከር፣ ውሎችን ለማዘጋጀትና የህግ ተገዢነት ድጋፍ ለማግኘት — በፍጥነት፣ በተመጣጣኝ ዋጋ እና በአስተማማኝ ሁኔታ ይገናኙ።'
  },
  hero_cta_find: { en: 'Find a Lawyer', am: 'ጠበቃ ፈልግ' },
  hero_cta_start: { en: 'Get Started', am: 'አሁን ጀምር' },
  hero_stat_lawyers: { en: 'Verified Lawyers', am: 'የተረጋገጡ ጠበቆች' },
  hero_stat_consultations: { en: 'Consultations', am: 'የተሰጡ ምክክሮች' },
  hero_stat_satisfaction: { en: 'Client Satisfaction', am: 'የተገልጋይ እርካታ' },
  hero_stat_response: { en: 'Avg. Response', am: 'አማካይ የምላሽ ጊዜ' },

  // Hero Booking Card Widget
  widget_verified: { en: 'Verified', am: 'የተረጋገጠ' },
  widget_online_pill: { en: '500+ Lawyers Online', am: '500+ ጠበቆች በመስመር ላይ' },
  widget_avail_label: { en: 'AVAILABLE TODAY', am: 'ለዛሬ ክፍት ሰዓታት' },
  widget_book_btn: { en: 'Book Consultation', am: 'ቀጠሮ ይያዙ' },
  widget_trusted_seal: { en: 'Trusted in Ethiopia', am: 'በኢትዮጵያ የታመነ' },

  // Process: How It Works
  hiw_tag: { en: 'PROCESS', am: 'ሂደት' },
  hiw_title: { en: 'How It Works', am: 'አሰራሩ እንዴት ነው?' },
  hiw_sub: { en: 'Get the legal help you need in three simple steps.', am: 'በሶስት ቀላል እርምጃዎች የሚፈልጉትን የህግ እገዛ ያግኙ።' },
  hiw_step1_title: { en: 'Describe Your Need', am: 'ጉዳይዎን ያብራሩ' },
  hiw_step1_desc: { en: 'Tell us about your legal situation — in plain language. No legal jargon required.', am: 'ያለዎትን የህግ ጉዳይ በቀላል ቋንቋ ይግለጹልን። ምንም አይነት የተወሳሰበ የህግ ቃላት አያስፈልግም።' },
  hiw_step2_title: { en: 'Match with a Lawyer', am: 'ከተስማሚ ጠበቃ ጋር ይገናኙ' },
  hiw_step2_desc: { en: 'Browse verified profiles filtered by practice area, location, language, and fee range.', am: 'በህግ ዘርፍ፣ በከተማ፣ በቋንቋ እና በዋጋ ተመን የተጣሩ የጠበቆችን ማህደር ይመልከቱ።' },
  hiw_step3_title: { en: 'Consult & Resolve', am: 'ያማክሩ እና ይፍቱ' },
  hiw_step3_desc: { en: 'Meet online or in person. Receive documents, advice, or representation — securely and on your schedule.', am: 'በኢንተርኔት ወይም በአካል ይገናኙ። ሰነዶችንና ውክልናን በቴሌብር የዋስትና ጥበቃ ይቀበሉ።' },

  // Practice Areas Section (8-Card Grid)
  pa_tag: { en: 'EXPERTISE', am: 'የሙያ ዘርፎች' },
  pa_title: { en: 'Practice Areas', am: 'የህግ ዘርፎች' },
  pa_sub: { en: 'Find specialized legal expertise across every area of Ethiopian law.', am: 'በሁሉም የኢትዮጵያ ህግ መስኮች ልዩ የጥብቅና ልምድ ያላቸውን ባለሙያዎች ያግኙ።' },
  pa_browse_all: { en: 'Browse All Areas', am: 'ሁሉንም ዘርፎች ይመልከቱ' },
  pa_corp_title: { en: 'Corporate & Business', am: 'የንግድና ኩባንያ ሕግ' },
  pa_corp_desc: { en: 'Company formation, contracts, M&A, corporate governance.', am: 'የኩባንያ ምስረታ፣ የንግድ ውሎች፣ ውህደት እና የዳይሬክተሮች ቦርድ ተገዢነት።' },
  pa_family_title: { en: 'Family Law', am: 'የቤተሰብ ሕግ' },
  pa_family_desc: { en: 'Divorce, child custody, adoption, inheritance disputes.', am: 'የፍቺ ስምምነት፣ የልጆች አስተዳደግ፣ የጉዲፈቻ እና የውርስ ሀብት ክፍፍል።' },
  pa_prop_title: { en: 'Property & Real Estate', am: 'የመሬትና ይዞታ ሕግ' },
  pa_prop_desc: { en: 'Land rights, title transfers, lease agreements, disputes.', am: 'የይዞታ መብት፣ የካርታ ትክክለኛነት ማረጋገጫ፣ የቤት ኪራይ ውል እና ክርክሮች።' },
  pa_ip_title: { en: 'Intellectual Property', am: 'የአእምሯዊ ንብረት ሕግ' },
  pa_ip_desc: { en: 'Trademark, copyright, patents, and IP protection.', am: 'የንግድ ምልክት ምዝገባ፣ የቅጂ መብት ጥበቃ እና የፈጠራ ውጤት ምዝገባ።' },
  pa_labor_title: { en: 'Employment Law', am: 'የሠራተኛና አሠሪ ሕግ' },
  pa_labor_desc: { en: 'Labor disputes, contracts, workplace rights, severance.', am: 'የስራ ቅጥር ውሎች፣ የስንብት ክፍያ ስሌት እና የስራ ክርክር ፍርድ ቤት ውክልና።' },
  pa_crim_title: { en: 'Criminal Defense', am: 'የወንጀል መከላከያ ሕግ' },
  pa_crim_desc: { en: 'Representation, bail, appeals, and rights protection.', am: 'የዋስትና ጥያቄ፣ ይግባኝ እና በፍርድ ቤት ቀጥተኛ የወንጀል መከላከያ ውክልና።' },
  pa_imm_title: { en: 'Immigration', am: 'ኢሚግሬሽንና ዜግነት' },
  pa_imm_desc: { en: 'Visas, residency, diaspora legal matters, citizenship.', am: 'የመኖሪያ ፈቃድ፣ ቪዛ፣ የዲያስፖራ ጉዳዮች እና የዜግነት ህጋዊ ድጋፍ።' },
  pa_ngo_title: { en: 'NGO & Compliance', am: 'የበጎ አድራጎት ማህበራትና ተገዢነት' },
  pa_ngo_desc: { en: 'Registration, regulatory compliance, grant agreements.', am: 'የሲቪል ማህበረሰብ ድርጅቶች ምዝገባ፣ የግብርና የህግ ተገዢነት ኦዲት።' },

  // Featured Lawyers
  fl_tag: { en: 'PROFESSIONALS', am: 'የህግ ባለሙያዎች' },
  fl_title: { en: 'Featured Lawyers', am: 'ተለይተው የቀረቡ ጠበቆች' },
  fl_sub: { en: 'Verified professionals ready to take your case.', am: 'ጉዳይዎን ለመቀበል ዝግጁ የሆኑ የተረጋገጡ ጠበቆች።' },
  fl_view_all: { en: 'View All Lawyers', am: 'ሁሉንም ጠበቆች ይመልከቱ' },
  fl_consultations: { en: 'consultations', am: 'ምክክሮች' },
  fl_yrs_exp: { en: 'yrs exp.', am: 'ዓመት ልምድ' },
  fl_view_profile: { en: 'View Profile', am: 'መገለጫ ይመልከቱ' },

  // Mid-Page Diaspora Section
  diaspora_tag: { en: 'CROSS-BORDER ETHIOPIAN LEGAL DESK', am: 'የድንበር ተሻጋሪ የኢትዮጵያ የህግ ማዕከል' },
  diaspora_title: { en: 'Ethiopian Diaspora Legal Services Hub', am: 'የኢትዮጵያ ዲያስፖራ የህግ አገልግሎት ማዕከል' },
  diaspora_sub: {
    en: 'Manage your land titles, embassy powers of attorney, inheritance successions, and commercial investments in Ethiopia remotely — protected by secure USD/EUR escrow.',
    am: 'በኢትዮጵያ የሚገኙ የመሬት ካርታዎችን፣ የኤምባሲ ውክልናዎችን፣ የውርስ ሀብቶችን እና የንግድ ኢንቨስትመንቶችን ከውጭ ሀገር ሆነው በዶላርና ዩሮ የዋስትና ጥበቃ ያስፈጽሙ።'
  },
  diaspora_poa_title: { en: 'Embassy Power of Attorney (ውክልና) Verification', am: 'የኤምባሲ ውክልና ማረጋገጫ' },
  diaspora_poa_desc: { en: 'Statutory drafting, review, and DARA authentication for general or special power of attorney from worldwide embassies.', am: 'በውጭ ሀገር በሚገኙ የኢትዮጵያ ኤምባሲዎች የሚሰጡ ጠቅላላና ልዩ የውክልና ሰነዶችን ማዘጋጀትና በውጭ ጉዳይ ማረጋገጥ።' },
  diaspora_land_title: { en: 'Land Title & Property Restitution Audit (ካርታ)', am: 'የመሬት ካርታና ይዞታ ህጋዊነት ማረጋገጫ' },
  diaspora_land_desc: { en: 'Title deed authentication, municipal leasehold audits, boundary dispute defense, and recovery across Addis Ababa sub-cities.', am: 'በአዲስ አበባ ክፍለ ከተሞች የሚገኙ የመሬት ይዞታዎችን ትክክለኛነት ማጣራት፣ የሊዝ ውል ማደስና ክርክሮችን መፍታት።' },
  diaspora_est_title: { en: 'Estate Succession & Inheritance Liquidation', am: 'የውርስ ሀብት ክፍፍልና አስተዳደር' },
  diaspora_est_desc: { en: 'Representation in Federal First Instance Courts to petition for legal heir certificates, unfreeze bank assets, and execute real estate titles.', am: 'በፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤቶች የውርስ አጣሪነት ውሳኔ ማግኘት፣ የባንክ ሂሳቦችን ማንቀሳቀስና ንብረቶችን ማስተላለፍ።' },
  diaspora_cta_btn: { en: 'Open a Diaspora Matter', am: 'የዲያስፖራ ጉዳይ ይክፈቱ' },

  // Why LegalLink (Dark Hub)
  why_tag: { en: 'WHY US', am: 'ለምን እኛ?' },
  why_title: { en: 'Why LegalLink', am: 'ለምን ሊጋልሊንክ?' },
  why_sub: { en: 'Built for Ethiopia. Trusted by thousands.', am: 'ለኢትዮጵያ የተገነባ። በሺዎች የሚቆጠሩ ደንበኞች የታመነ።' },
  why_lawyers_stat: { en: 'Verified Lawyers', am: 'የተረጋገጡ ጠበቆች' },
  why_consult_stat: { en: 'Consultations Completed', am: 'የተጠናቀቁ ምክክሮች' },
  why_satisfaction_stat: { en: 'Client Satisfaction', am: 'የተገልጋይ እርካታ' },
  why_areas_stat: { en: 'Practice Areas', am: 'የህግ ዘርፎች' },
  why_c1_title: { en: 'Fully Verified Lawyers', am: 'በሙሉ የተረጋገጡ ጠበቆች' },
  why_c1_desc: { en: 'Every lawyer undergoes identity verification, bar association check, and credential review before joining.', am: 'እያንዳንዱ ጠበቃ ወደ መድረኩ ከመቀላቀሉ በፊት ማንነቱ፣ የፍትህ ሚኒስቴር ፍቃዱና የፍርድ ቤት ብቃቱ ይመረመራል።' },
  why_c2_title: { en: 'Secure & Confidential', am: 'አስተማማኝና ሚስጥራዊ' },
  why_c2_desc: { en: 'All communications and documents are end-to-end encrypted. Your privacy is our priority.', am: 'ሁሉም ውይይቶችና የተጋሩ ሰነዶች በምስጠራ የተጠበቁ ናቸው። የእርስዎ ሚስጥር ቀዳሚ ተግባራችን ነው።' },
  why_c3_title: { en: 'Transparent Pricing', am: 'ግልጽ የሆነ ዋጋ' },
  why_c3_desc: { en: 'Clear fee structures upfront. Compare rates and choose a lawyer that fits your budget.', am: 'ምንም አይነት ድብቅ ክፍያ የለም። ዋጋዎችን ያወዳድሩ እና ከአቅምዎ ጋር የሚስማማ ጠበቃ ይምረጡ።' },
  why_c4_title: { en: 'Bilingual Support', am: 'ባለሁለት ቋንቋ ድጋፍ' },
  why_c4_desc: { en: 'Consult in Amharic or English. Our platform and lawyers serve you in your preferred language.', am: 'በአማርኛ ወይም በእንግሊዝኛ ያማክሩ። መድረካችን እና ጠበቆቻችን እርስዎ በመረጡት ቋንቋ ያገለግሉዎታል።' },

  // LexDraft Section
  lex_pill: { en: 'Document Automation', am: 'ዲጂታል የውል ዝግጅት' },
  lex_title: { en: 'Generate Legal Documents in Minutes', am: 'ህጋዊ ሰነዶችን በደቂቃዎች ውስጥ ያዘጋጁ' },
  lex_sub: {
    en: 'LexDraft automates the creation of contracts, agreements, powers of attorney, and more — tailored to Ethiopian law. Answer a few questions, get a ready-to-sign document.',
    am: 'ሌክስ ድራፍት በኢትዮጵያ ህግ መሰረት የስራ ውሎችን፣ የኪራይ ስምምነቶችንና የውክልና ሰነዶችን በራስ-ሰር ያዘጋጃል። ጥቂት ጥያቄዎችን ይመልሱ፣ ለፊርማ ዝግጁ የሆነ ሰነድ ያግኙ።'
  },
  lex_item1: { en: 'Employment Contracts', am: 'የስራ ቅጥር ውሎች' },
  lex_item2: { en: 'Lease Agreements', am: 'የቤትና ንብረት ኪራይ ውሎች' },
  lex_item3: { en: 'Power of Attorney', am: 'የውክልና ስልጣን ሰነዶች' },
  lex_item4: { en: 'Non-Disclosure Agreements (NDA)', am: 'የሚስጥር ጥበቃ ስምምነቶች (NDA)' },
  lex_item5: { en: 'Sale Agreements', am: 'የሽያጭና ግዢ ውሎች' },
  lex_item6: { en: 'Loan Agreements', am: 'የብድርና ዕዳ ስምምነቶች' },
  lex_cta_btn: { en: 'Try LexDraft Free', am: 'ሌክስ ድራፍትን በነፃ ይሞክሩ' },

  // LegalTalk Knowledge Hub
  lt_pill: { en: 'Education Hub', am: 'የትምህርትና ግንዛቤ ማዕከል' },
  lt_title: { en: 'LegalTalk', am: 'ሊጋልቶክ የህግ እውቀት' },
  lt_sub: { en: 'Legal education for every Ethiopian. Read, watch, and learn.', am: 'ህጋዊ ትምህርት ለእያንዳንዱ ኢትዮጵያዊ። ያንብቡ፣ ይመልከቱ እና ይማሩ።' },
  lt_explore_btn: { en: 'Explore LegalTalk', am: 'ሁሉንም ጽሑፎች ይመልከቱ' },
  lt_art1_tag: { en: 'Business Law', am: 'የንግድ ሕግ' },
  lt_art1_title: { en: 'What Ethiopian Startups Need to Know About Company Registration', am: 'የኢትዮጵያ ጀማሪ የንግድ ድርጅቶች ስለ ኩባንያ ምዝገባ ማወቅ ያለባቸው ቁልፍ ጉዳዮች' },
  lt_art1_desc: { en: 'A step-by-step guide to registering your startup under Ethiopian Commercial Code, including recent updates.', am: 'በአዲሱ የንግድ ህግ መሰረት ኃ/የተ/የግ/ማህበር ስለመመስረት ደረጃ በደረጃ የቀረበ መመሪያ።' },
  lt_art2_tag: { en: 'Family Law', am: 'የቤተሰብ ሕግ' },
  lt_art2_title: { en: "Your Rights in Ethiopian Divorce Law: A Plain-Language Guide", am: 'በኢትዮጵያ የፍቺ ሕግ መብትዎ ምንድን ነው? ቀላል ማብራሪያ' },
  lt_art2_desc: { en: 'Understanding property division, child custody, and alimony provisions under the Revised Family Code.', am: 'በተሻሻለው የቤተሰብ ህግ መሰረት የንብረት ክፍፍል፣ የልጆች አስተዳደግና ቀለብ አወሳሰን።' },
  lt_art3_tag: { en: 'Employment', am: 'የሠራተኛ ሕግ' },
  lt_art3_title: { en: 'New Labor Proclamation Changes: What Employers Must Know', am: 'በአዲሱ የሠራተኛ አዋጅ የተደረጉ ለውጦች፡ አሠሪዎች ሊያውቋቸው የሚገቡ ነጥቦች' },
  lt_art3_desc: { en: 'Key changes in the revised Labour Proclamation No. 1156/2019 affecting employer obligations and worker rights.', am: 'በአዋጅ ቁጥር 1156/2019 መሰረት የአሠሪ ግዴታዎችና የሠራተኛ መብቶች ላይ የተደረጉ ማሻሻያዎች።' },

  // Testimonials
  test_tag: { en: 'TESTIMONIALS', am: 'የተገልጋዮች ምስክርነት' },
  test_title: { en: 'What Clients Say', am: 'ደንበኞቻችን ምን ይላሉ?' },
  test_sub: { en: 'Real experiences from verified LegalLink users.', am: 'ከተረጋገጡ የሊጋልሊንክ ተጠቃሚዎች የተገኙ እውነተኛ ተሞክሮዎች።' },
  test_quote: {
    en: '"I had a complex employment dispute. The lawyer I found through LegalLink was thorough, responsive, and helped us reach a fair resolution quickly. Worth every birr."',
    am: '"አወዛጋቢ የስራ ውል ክርክር ገጥሞኝ ነበር። በሊጋልሊንክ ያገኘሁት ጠበቃ ጉዳዬን በጥልቀት ተመልክቶ በአጭር ጊዜ ውስጥ ፍትሃዊ መፍትሄ እንድናገኝ ረድቶናል። ከጠበቅኩት በላይ አስተማማኝ ነው።"'
  },
  test_author: { en: 'Yeshi Alemu', am: 'ወ/ሮ የሺ አለሙ' },
  test_role: { en: 'SME Owner, Dire Dawa', am: 'የአነስተኛ ንግድ ባለቤት፣ ድሬዳዋ' },

  // Enterprise Footer
  footer_tagline: { en: "Ethiopia's first freelance legal services marketplace.", am: 'የኢትዮጵያ የመጀመሪያው የህግ አገልግሎት ገበያ መድረክ።' },
  footer_phone: { en: '+251 911 000 000', am: '+251 911 000 000' },
  footer_address: { en: 'Bole Road, Addis Ababa, Ethiopia', am: 'ቦሌ መንገድ፣ አዲስ አበባ፣ ኢትዮጵያ' },
  footer_platform_title: { en: 'PLATFORM', am: 'መድረክ' },
  footer_resources_title: { en: 'RESOURCES', am: 'መርጃዎች' },
  footer_company_title: { en: 'COMPANY', am: 'ድርጅት' },
  footer_legal_title: { en: 'LEGAL', am: 'ህጋዊ' },
  footer_disclaimer: {
    en: 'LegalLink connects clients with independent lawyers. We are not a law firm and do not provide legal advice directly.',
    am: 'ሊጋልሊንክ ደንበኞችን ከነፃ ጠበቆች ጋር የሚያገናኝ መድረክ ነው። የጥብቅና ማህበር ባለመሆኑ ቀጥተኛ የህግ ምክር አይሰጥም።'
  },
  footer_rights: { en: '© 2026 LegalLink Technologies PLC. All rights reserved.', am: '© 2026 ሊጋልሊንክ ቴክኖሎጂስ ኃ/የተ/የግ/ማህበር። መብቱ በህግ የተጠበቀ ነው።' }
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
      // Ignore local storage error
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('legallink_lang', lang);
    } catch {
      // Ignore
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