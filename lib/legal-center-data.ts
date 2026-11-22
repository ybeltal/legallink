export interface DictionaryTerm {
  id: string;
  term: string;
  amharicTerm: string;
  category: 'Litigation' | 'Contracts & Business' | 'Property & Land' | 'Labour & Family';
  plainDefinition: string;
  amharicDefinition: string;
  statute: string;
  relatedCategorySlug: string;
  relatedLexDraftId?: string;
}

export interface LegalTipGuide {
  id: string;
  tag: string;
  title: string;
  amharicTitle: string;
  summary: string;
  checklist: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const ETHIOPIAN_LEGAL_DICTIONARY: DictionaryTerm[] = [
  {
    id: 'cassation',
    term: 'Cassation (Säbär)',
    amharicTerm: 'ሰበር ሰሚ ችሎት',
    category: 'Litigation',
    plainDefinition:
      'A final review by the Federal Supreme Court Cassation Division available only when a lower court’s final decision contains a basic and fundamental error of law—not simply disagreement over facts.',
    amharicDefinition:
      'የመጨረሻ ውሳኔ በተሰጠበት ጉዳይ ላይ መሠረታዊ የሕግ ስህተት ሲፈጸም ብቻ ለፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት የሚቀርብ አቤቱታ።',
    statute: 'FDRE Constitution Art. 80(3)(a) & Proc. No. 1234/2021',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'application-for-cassation',
  },
  {
    id: 'power-of-attorney',
    term: 'Power of Attorney (Agency)',
    amharicTerm: 'ውክልና',
    category: 'Contracts & Business',
    plainDefinition:
      'A written legal document authorizing another person (agent) or licensed advocate to act, sign contracts, manage property, or appear in court on your behalf. Usually authenticated before DARS (or an Ethiopian Embassy for diaspora).',
    amharicDefinition:
      'አንድ ሰው ሌላ ሰው ወይም ጠበቃ በእርሱ ስም ውል እንዲፈርም፣ ንብረት እንዲያስተዳድር ወይም በፍርድ ቤት እንዲከራከር የሚሰጥ ሕጋዊ ሥልጣን።',
    statute: 'Ethiopian Civil Code Art. 2199–2233',
    relatedCategorySlug: 'immigration',
    relatedLexDraftId: 'agency-attorney',
  },
  {
    id: 'temporary-injunction',
    term: 'Temporary Injunction',
    amharicTerm: 'ጊዜያዊ የዕግድ ትዕዛዝ',
    category: 'Litigation',
    plainDefinition:
      'An urgent court order stopping a party from selling, transferring, demolishing, or damaging disputed property until the court delivers a final judgment.',
    amharicDefinition:
      'ክርክር የተነሳበት ንብረት ውሳኔ እስኪሰጥ ድረስ እንዳይሸጥ፣ እንዳይለወጥ ወይም እንዳይባክን ፍርድ ቤት የሚሰጠው አስቸኳይ የዕግድ ትዕዛዝ።',
    statute: 'Civil Procedure Code Art. 154–155',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'injunction-order',
  },
  {
    id: 'ex-parte',
    term: 'Ex-Parte Judgment',
    amharicTerm: 'በሌለበት የተሰጠ ውሳኔ',
    category: 'Litigation',
    plainDefinition:
      'A court order or verdict issued in the absence of the defendant after valid summons was served. A defendant with good cause (or improper summons) can petition to cancel it within 30 days.',
    amharicDefinition:
      'ተከሳሽ በችሎት ባልተገኘበት የሚሰጥ የፍርድ ቤት ውሳኔ። በቂ ምክንያት ያለው ተከሳሽ በ30 ቀን ውስጥ እንዲነሳለት ማመልከት ይችላል።',
    statute: 'Civil Procedure Code Art. 78',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'cancellation-ex-parte-order',
  },
  {
    id: 'severance-pay',
    term: 'Severance Pay',
    amharicTerm: 'የሥራ ስንብት ክፍያ',
    category: 'Labour & Family',
    plainDefinition:
      'Statutory compensation owed to an employee who completed probation and is terminated without fault (such as redundancy or unlawful dismissal): 30 days wages for Year 1 plus one-third of monthly wages for each additional year.',
    amharicDefinition:
      'የሙከራ ጊዜውን የጨረሰ ሠራተኛ ያለጥፋቱ ከሥራ ሲሰናበት ለመጀመሪያው ዓመት የ30 ቀን ደመወዝ እና ለቀጣይ እያንዳንዱ ዓመት የአንድ ሦስተኛ ወር ደመወዝ የሚከፈል ካሳ።',
    statute: 'Labour Proclamation No. 1156/2019 Art. 39–40',
    relatedCategorySlug: 'employment',
    relatedLexDraftId: 'employment-agreement',
  },
  {
    id: 'urban-leasehold',
    term: 'Urban Land Leasehold (Karta)',
    amharicTerm: 'የከተማ ቦታ ሊዝ / ካርታ',
    category: 'Property & Land',
    plainDefinition:
      'In Ethiopia, land is public property; individuals and companies own buildings and hold long-term municipal leasehold rights evidenced by a Title Deed (ካርታ). Always verify encumbrances at the sub-city land office before buying.',
    amharicDefinition:
      'በኢትዮጵያ መሬት የመንግሥትና የሕዝብ ሲሆን፣ ግለሰቦችና ድርጅቶች ሕንፃን በባለቤትነት፣ ቦታውን ደግሞ በሊዝ ይዞታ (ካርታ) ይይዛሉ።',
    statute: 'Urban Lands Lease Holding Proc. No. 721/2011',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'commercial-lease',
  },
  {
    id: 'single-member-plc',
    term: 'Single-Member PLC',
    amharicTerm: 'ባለ አንድ አባል ኃ/የተ/የግ/ማኅበር',
    category: 'Contracts & Business',
    plainDefinition:
      'A Private Limited Company formed by a single founder under Ethiopia’s revised 2021 Commercial Code, offering limited liability protection without requiring a second shareholder.',
    amharicDefinition:
      'በአዲሱ የ2013 የንግድ ሕግ መሠረት በአንድ መሥራች ብቻ የሚቋቋምና የግል ንብረትን ከኩባንያው ዕዳ የሚለይ ኃላፊነቱ የተወሰነ የግል ማኅበር።',
    statute: 'Commercial Code Proclamation No. 1243/2021 Art. 534+',
    relatedCategorySlug: 'corporate',
    relatedLexDraftId: 'plc-articles-of-association',
  },
  {
    id: 'force-majeure',
    term: 'Force Majeure',
    amharicTerm: 'ከአቅም በላይ የሆነ ምክንያት',
    category: 'Contracts & Business',
    plainDefinition:
      'An unforeseeable external event that makes performing a contract absolutely impossible (not merely more expensive), excusing the non-performing party from paying damages.',
    amharicDefinition:
      'አስቀድሞ ሊገመት የማይችልና የውል ግዴታን መፈጸም ፈጽሞ የማይቻል የሚያደርግ ከአቅም በላይ የሆነ ክስተት።',
    statute: 'Ethiopian Civil Code Art. 1792–1793',
    relatedCategorySlug: 'corporate',
  },
  {
    id: 'certificate-of-heirship',
    term: 'Certificate of Heirship',
    amharicTerm: 'የውርስ አጣሪነት / የወራሽነት ማረጋገጫ',
    category: 'Labour & Family',
    plainDefinition:
      'A court-issued certificate officially recognizing the lawful heirs of a deceased person—required before banks unfreeze accounts or land offices transfer inherited houses.',
    amharicDefinition:
      'የሟች ሕጋዊ ወራሾች እነማን መሆናቸውን ፍርድ ቤት የሚያረጋግጥበትና ባንኮች ወይም የመሬት ጽ/ቤቶች ንብረት ለማስተላለፍ የሚጠይቁት ማስረጃ።',
    statute: 'Ethiopian Civil Code Art. 996–1002',
    relatedCategorySlug: 'family',
  },
  {
    id: 'dars',
    term: 'DARS Authentication',
    amharicTerm: 'የሰነዶች ማረጋገጫና ምዝገባ አገልግሎት',
    category: 'Property & Land',
    plainDefinition:
      'The Federal Documents Authentication and Registration Service (formerly DARA), which notarizes powers of attorney, vehicle sales, property transfers, and company formation articles so they carry legal validity.',
    amharicDefinition:
      'የውክልና፣ የንብረት ሽያጭ፣ የኩባንያ መመሥረቻ ጽሑፍ እና ሌሎች ሕጋዊ ውሎች ተቀባይነት እንዲኖራቸው የሚያረጋግጥና የሚመዘግብ ተቋም።',
    statute: 'Authentication & Registration of Documents Proc. No. 922/2015',
    relatedCategorySlug: 'property',
    relatedLexDraftId: 'general-special-agency',
  },
];

export const CLIENT_LEGAL_TIPS: LegalTipGuide[] = [
  {
    id: 'verify-advocate',
    tag: 'Hiring Guide',
    title: 'How to Verify an Ethiopian Advocate Before Hiring',
    amharicTitle: 'ጠበቃ ከመቅጠርዎ በፊት ፈቃዱን እንዴት ማረጋገጥ ይችላሉ?',
    summary:
      'Under Federal Advocacy Proclamation No. 1249/2021, practicing advocates hold tiered licenses tied to specific court levels.',
    checklist: [
      'Confirm whether your case is in Federal First Instance, High Court, Supreme Court, or a Regional Court—and match the advocate’s license tier.',
      'Ask to see the current-year renewed Ministry of Justice (or Regional Justice Bureau) practicing license number.',
      'Request a simple written engagement agreement outlining scope of work, deliverables, and payment milestones.',
    ],
    ctaLabel: 'Browse Verified Advocates',
    ctaHref: '/find-a-lawyer',
  },
  {
    id: 'first-consultation-prep',
    tag: 'Preparation',
    title: '5 Things to Prepare Before Your First Legal Consultation',
    amharicTitle: 'ለመጀመሪያው የህግ ምክክር ማዘጋጀት ያለብዎት 5 ነገሮች',
    summary:
      'Arriving organized saves hours of legal time and helps your advocate give clear, accurate advice on the very first call.',
    checklist: [
      'Write a 1-page timeline of key dates (contract signing, dismissal date, court summons date, or notice received).',
      'Gather copies—not originals—of contracts, payslips, title deeds (ካርታ), receipts, or court letters.',
      'Check statutory deadlines immediately (for example, labour dismissal claims generally have a 3-month filing window).',
      'List your 3 most urgent questions and your ideal outcome (settlement vs. court litigation).',
    ],
    ctaLabel: 'Draft a Form First (LexDraft)',
    ctaHref: '/lexdraft',
  },
  {
    id: 'understand-fees',
    tag: 'Transparency',
    title: 'Understanding Advocate Fee Agreements in Ethiopia',
    amharicTitle: 'በኢትዮጵያ የጥብቅና አገልግሎት ክፍያ አሰራርን መረዳት',
    summary:
      'LegalLink connects you to advocates for free. Any formal representation fee is agreed directly between you and your advocate.',
    checklist: [
      'Fixed-fee services work best for predictable tasks like PLC incorporation, contract review, or DARS power of attorney.',
      'Stage-based retainers are common for court litigation (pleadings, hearings, judgment execution).',
      'Always clarify upfront who covers court filing stamps, translation costs, and DARS authentication fees.',
    ],
    ctaLabel: 'Submit a Free Case Inquiry',
    ctaHref: '/find-a-lawyer',
  },
  {
    id: 'diaspora-remote-guide',
    tag: 'Diaspora',
    title: 'Managing Property or Inheritance in Ethiopia From Abroad',
    amharicTitle: 'ከውጭ ሀገር ሆነው በኢትዮጵያ ያለ ንብረትን ወይም ውርስን ማስተዳደር',
    summary:
      'You do not need to fly to Addis Ababa for routine property audits, lease management, or court filings if your Power of Attorney is properly authenticated.',
    checklist: [
      'Draft a specific (not vague) Power of Attorney naming exact parcel/karta numbers or bank branches.',
      'Sign and stamp the Power of Attorney at the nearest Ethiopian Embassy or Consulate, then authenticate via MoFA and DARS in Addis Ababa.',
      'Keep your Ethiopian Origin ID (Yellow Card) active to exercise full urban property ownership rights under Proc. No. 270/2002.',
    ],
    ctaLabel: 'Connect with a Diaspora Advocate',
    ctaHref: '/find-a-lawyer?category=immigration',
  },
];