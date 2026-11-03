export interface LegalDocumentItem {
  id: string;
  title: string;
  amharicTitle: string;
  category: 'Proclamations' | 'Regulations' | 'Directives' | 'Court Forms' | 'DARA Templates';
  amharicCategory: string;
  proclamationNumber?: string;
  year: number;
  fileSize: string;
  downloadCount: number;
  summary: string;
  amharicSummary: string;
  practiceArea: string;
  fileUrl?: string; // Optional direct Supabase storage link
  pages: number;
  badge?: 'Most Downloaded' | 'Essential' | 'Updated 2026';
}

export const SEED_LEGAL_DOCUMENTS: LegalDocumentItem[] = [
  {
    id: 'commercial-code-1240-2021',
    title: 'Commercial Code of the Federal Democratic Republic of Ethiopia',
    amharicTitle: 'የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ የንግድ ሕግ አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 1240/2021',
    year: 2021,
    fileSize: '4.8 MB',
    downloadCount: 3840,
    pages: 312,
    badge: 'Essential',
    summary: 'The modernized Commercial Code governing business organizations, Single-Member PLCs, share companies, commercial bankruptcy, and general mercantile contracts.',
    amharicSummary: 'የንግድ ማህበራት ምስረታን፣ ባለአንድ አባል ኃ/የተ/የግ/ማህበርን፣ አክሲዮን ማህበራትንና የንግድ ውሎችን የሚገዛው ዋናው የንግድ ህግ ሰነድ።',
    practiceArea: 'corporate'
  },
  {
    id: 'labour-proclamation-1156-2019',
    title: 'Labour Proclamation of Ethiopia',
    amharicTitle: 'የአሰሪና ሠራተኛ ጉዳይ አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 1156/2019',
    year: 2019,
    fileSize: '2.4 MB',
    downloadCount: 5210,
    pages: 84,
    badge: 'Most Downloaded',
    summary: 'Comprehensive statutory framework for employment contracts, probation rules (60-day maximum), severance pay calculation, annual leave, and lawful dismissal procedures.',
    amharicSummary: 'የስራ ቅጥር ውልን፣ የሙከራ ጊዜን (እስከ 60 ቀናት)፣ የስንብት ክፍያንና የስራ ሰዓትን የሚደነግገው የሰራተኛና አሰሪ ህግ አዋጅ።',
    practiceArea: 'employment'
  },
  {
    id: 'investment-proclamation-1180-2020',
    title: 'Investment Proclamation of Ethiopia',
    amharicTitle: 'የኢንቨስትመንት አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 1180/2020',
    year: 2020,
    fileSize: '1.9 MB',
    downloadCount: 2980,
    pages: 42,
    badge: 'Updated 2026',
    summary: 'Governs foreign direct investment (FDI), reserved sectors, joint ventures, capital registration minimums, and dispute resolution mechanisms under the EIC.',
    amharicSummary: 'የውጭ ኢንቨስትመንት መስፈርቶችን፣ ዝቅተኛ የካፒታል ምዝገባንና ለሀገር ውስጥ ባለሀብቶች ብቻ የተከለሉ ዘርፎችን የሚያብራራ አዋጅ።',
    practiceArea: 'corporate'
  },
  {
    id: 'urban-land-lease-721-2011',
    title: 'Urban Land Leaseholding Proclamation',
    amharicTitle: 'የከተማ ቦታን በሊዝ ስለመያዝ የወጣ አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 721/2011',
    year: 2011,
    fileSize: '2.1 MB',
    downloadCount: 4120,
    pages: 38,
    badge: 'Essential',
    summary: 'Foundational land law detailing municipal lease tenders, landholding certificate (ካርታ) assignments, lease period durations, and expropriation compensation criteria.',
    amharicSummary: 'የከተማ መሬት በሊዝ ጨረታ ስለሚሰጥበት አሰራር፣ የይዞታ ማረጋገጫ (ካርታ) ዝውውርና የካሳ አከፋፈልን የሚደነግግ ህግ።',
    practiceArea: 'property'
  },
  {
    id: 'tax-administration-983-2016',
    title: 'Federal Tax Administration Proclamation',
    amharicTitle: 'የፌዴራል የታክስ አስተዳደር አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 983/2016',
    year: 2016,
    fileSize: '2.6 MB',
    downloadCount: 2140,
    pages: 68,
    summary: 'Rules on taxpayer identification numbers (TIN), assessment procedures, tax audits, penalties, administrative appeals, and Ministry of Revenues enforcement powers.',
    amharicSummary: 'የግብር ከፋይ መለያ ቁጥር (TIN) አሰጣጥ፣ የታክስ ኦዲት፣ ቅጣትና ይግባኝ አቀራረብ ስርዓትን የሚደነግግ አዋጅ።',
    practiceArea: 'tax'
  },
  {
    id: 'civil-code-1960',
    title: 'Civil Code of the Empire of Ethiopia (Core Proclamation)',
    amharicTitle: 'የኢትዮጵያ ፍትሐብሔር ሕግ (1952 ዓ.ም)',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 165/1960',
    year: 1960,
    fileSize: '9.2 MB',
    downloadCount: 6890,
    pages: 580,
    badge: 'Essential',
    summary: 'The primary substantive law of contracts, immovable property leases (Art. 2896), obligations, sales of goods, tort liabilities, and general power of attorney mandates.',
    amharicSummary: 'የውል ህግ፣ የቤትና የመሬት ኪራይ (አንቀጽ 2896)፣ የሽያጭ ውሎችና የውክልና ህግጋትን የያዘው ታሪካዊና ዋነኛው የፍትሐብሔር ህግ።',
    practiceArea: 'general'
  },
  {
    id: 'ecma-directive-1030-2024',
    title: 'Capital Market Service Providers Licensing Directive',
    amharicTitle: 'የካፒታል ገበያ አገልግሎት ሰጪዎች የፈቃድ አሰጣጥ መመሪያ',
    category: 'Directives',
    amharicCategory: 'መመሪያዎች',
    proclamationNumber: 'Directive No. 1030/2024',
    year: 2024,
    fileSize: '1.4 MB',
    downloadCount: 1780,
    pages: 46,
    badge: 'Updated 2026',
    summary: 'Ethiopian Capital Market Authority (ECMA) regulations for licensing investment banks, brokers, digital trading platforms, and securities custodians on the ESX.',
    amharicSummary: 'የኢትዮጵያ ካፒታል ገበያ ባለስልጣን የኢንቨስትመንት ባንኮችና የአክሲዮን ደላሎች ፈቃድ አሰጣጥን በተመለከተ ያወጣው መመሪያ።',
    practiceArea: 'corporate'
  },
  {
    id: 'nbe-fxd-foreign-exchange-2024',
    title: 'NBE Comprehensive Foreign Exchange Directive',
    amharicTitle: 'የብሔራዊ ባንክ አጠቃላይ የውጭ ምንዛሪ አስተዳደር መመሪያ',
    category: 'Directives',
    amharicCategory: 'መመሪያዎች',
    proclamationNumber: 'Directive FXD/01/2024',
    year: 2024,
    fileSize: '1.2 MB',
    downloadCount: 3120,
    pages: 34,
    badge: 'Updated 2026',
    summary: 'Establishes market-determined foreign exchange rates, foreign currency retention rules for exporters, diaspora bank account limits, and offshore payment clearances.',
    amharicSummary: 'የውጭ ምንዛሪ ገበያ መመሪያ፤ የላኪዎችና የዲያስፖራ የውጭ ምንዛሪ ሂሳብ አጠቃቀምን እና ዓለም አቀፍ ክፍያዎችን የሚገዛ።',
    practiceArea: 'corporate'
  },
  {
    id: 'dara-standard-poa-form',
    title: 'DARA Official Power of Attorney Standard Submission Template',
    amharicTitle: 'የሰነዶች ምዝገባና ማረጋገጫ ኤጀንሲ (DARA) የውክልና ቅጽ',
    category: 'DARA Templates',
    amharicCategory: 'የሰነዶች ምዝገባ ቅጾች',
    proclamationNumber: 'DARA Form 04-A',
    year: 2025,
    fileSize: '0.8 MB',
    downloadCount: 4650,
    pages: 3,
    badge: 'Most Downloaded',
    summary: 'The standardized Ministry of Justice / DARA form required for executing and notarizing general or special powers of attorney for banking, land, and vehicle transfers.',
    amharicSummary: 'በሰነዶች ምዝገባና ማረጋገጫ ኤጀንሲ ፊት የውክልና ስልጣን ለመስጠትና ለማረጋገጥ የሚያስፈልግ ይፋዊ ማመልከቻ ቅጽ።',
    practiceArea: 'general'
  },
  {
    id: 'court-statement-of-claim-form',
    title: 'Federal First Instance Court Statement of Claim Model',
    amharicTitle: 'የፌዴራል መጀመሪያ ደረጃ ፍርድ ቤት የክስ ማመልከቻ ሞዴል ቅጽ',
    category: 'Court Forms',
    amharicCategory: 'የፍርድ ቤት ማመልከቻዎች',
    proclamationNumber: 'FFIC-Form-Civil-01',
    year: 2025,
    fileSize: '0.6 MB',
    downloadCount: 2890,
    pages: 4,
    summary: 'Model civil statement of claim formatted according to the Civil Procedure Code. Includes plaintiff and defendant particulars, cause of action, and remedy claims.',
    amharicSummary: 'በፍትሐብሔር ስነ-ስርዓት ህጉ መሰረት የከሳሽና ተከሳሽ ዝርዝር፣ የክሱ ምክንያትና የዳኝነት ጥያቄ የሚቀርብበት መደበኛ የክስ ማመልከቻ ቅጽ።',
    practiceArea: 'general'
  },
  {
    id: 'customs-tariff-regulation-468-2020',
    title: 'Customs Tariff Council of Ministers Regulation',
    amharicTitle: 'የጉምሩክ ታሪፍ የሚኒስትሮች ምክር ቤት ደንብ',
    category: 'Regulations',
    amharicCategory: 'ደንቦች',
    proclamationNumber: 'Reg. No. 468/2020',
    year: 2020,
    fileSize: '3.5 MB',
    downloadCount: 1640,
    pages: 140,
    summary: 'Customs duties schedules, HS codes classification, tariff rates, import surtaxes, and exemption categories for capital goods and manufacturing equipment.',
    amharicSummary: 'የጉምሩክ ቀረጥ ተመን፣ የሸቀጦች ታሪፍ ምደባ (HS Code) እና ከቀረጥ ነፃ የሚገቡ የካፒታል እቃዎችን የሚዘረዝር ደንብ።',
    practiceArea: 'corporate'
  },
  {
    id: 'electronic-transactions-1205-2020',
    title: 'Electronic Signature & Electronic Transactions Proclamation',
    amharicTitle: 'የኤሌክትሮኒክ ግብይት አዋጅ',
    category: 'Proclamations',
    amharicCategory: 'አዋጆች',
    proclamationNumber: 'Proc. No. 1205/2020',
    year: 2020,
    fileSize: '1.7 MB',
    downloadCount: 2310,
    pages: 28,
    badge: 'Updated 2026',
    summary: 'Legal foundation recognizing digital signatures, electronic contracts, digital receipts, consumer e-commerce rights, and authentication authority regulations in Ethiopia.',
    amharicSummary: 'የዲጂታል ፊርማ ህጋዊ ተቀባይነትን፣ የኤሌክትሮኒክ ውሎችንና የመስመር ላይ ግብይት ደህንነትን የሚያረጋግጥ አዋጅ።',
    practiceArea: 'corporate'
  }
];