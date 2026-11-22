export interface Article {
  slug: string;
  category:
    | 'Employee Rights'
    | 'Business Law'
    | 'Property Law'
    | 'Family Law'
    | 'Compliance'
    | 'Tax & Finance'
    | 'Diaspora'
    | 'LegalTech';
  amharicCategory: string;
  title: string;
  amharicTitle: string;
  excerpt: string;
  amharicExcerpt: string;
  author: string;
  amharicAuthor: string;
  authorRole: string;
  date: string;
  readTime: string;
  theme: 'navy' | 'gold' | 'slate';
  categoryParam: string;
  audioDuration?: string;
  imageUrl: string;
  content: {
    lead: string;
    sections: {
      heading: string;
      paragraphs?: string[];
      bullets?: string[];
      callout?: string;
    }[];
  };
}

export interface QAItem {
  id: string;
  category: string;
  question: string;
  amharicQuestion: string;
  asker: string;
  advocateName: string;
  advocateLicense: string;
  answer: string;
  amharicAnswer: string;
  statutoryBasis: string;
  date: string;
}

export const LEGAL_ARTICLES: Article[] = [
  // 1. EMPLOYEE RIGHTS
  {
    slug: 'wrongful-termination-ethiopia',
    category: 'Employee Rights',
    amharicCategory: 'የሠራተኛ መብት',
    title: 'Wrongful Termination in Ethiopia: Know Your Rights Under the Labour Proclamation',
    amharicTitle: 'ያለአግባብ ከስራ መሰናበት በኢትዮጵያ፡ በአዋጅ ቁጥር 1156/2019 የተሰጡዎት ህጋዊ መብቶች',
    excerpt:
      "Ethiopia's Labour Proclamation No. 1156/2019 provides strong protections against arbitrary dismissal. Here is what every employee needs to know about lawful versus unlawful termination.",
    amharicExcerpt:
      'አዋጅ ቁጥር 1156/2019 ማንኛውም ሰራተኛ ያለበቂ ህጋዊ ምክንያት ከስራ እንዳይሰናበት ጥበቃ ያደርጋል። ህጋዊና ህገ-ወጥ ስንብትን በተመለከተ ማወቅ ያለብዎት ዝርዝር ጉዳዮች።',
    author: 'Adv. Mulu Haile',
    amharicAuthor: 'ጠበቃ ሙሉ ኃይሌ',
    authorRole: 'Labour Law Specialist',
    date: 'June 15, 2026',
    readTime: '6 min',
    theme: 'navy',
    categoryParam: 'employment',
    audioDuration: '2:45',
    imageUrl: '/images/legaltalk/wrongful-termination.jpg',
    content: {
      lead: "Ethiopia's Labour Proclamation No. 1156/2019 sets out clear rules on when an employer may lawfully end an employment contract. Understanding these rules is the first step to protecting yourself if you believe your dismissal was unjust.",
      sections: [
        {
          heading: 'What constitutes lawful termination?',
          paragraphs: [
            'An employer may terminate a contract of employment for a good cause — defined as a serious breach of duty, persistent poor performance after written warnings, redundancy driven by genuine operational needs, or the completion of a fixed-term contract.',
          ],
          bullets: [
            'Serious misconduct (e.g. theft, assault, disclosure of trade secrets)',
            'Repeated absence without permission after written warning',
            'Genuine redundancy with statutory severance payment',
            'Expiry of a fixed-term or task-based contract',
            'Force majeure making performance impossible',
          ],
        },
        {
          heading: 'What is wrongful termination?',
          paragraphs: [
            'A termination is wrongful — and legally challengeable — when it lacks a valid reason, violates the required statutory procedure, or is motivated by discrimination. The Proclamation specifically prohibits dismissal on grounds of union membership, pregnancy, gender, religion, or nationality.',
          ],
          callout:
            'Key protection: Even where a valid reason exists, the employer must follow a fair disciplinary procedure — including issuing a formal written notice and giving the employee an opportunity to respond before any dismissal takes effect.',
        },
        {
          heading: 'Remedies available to wrongfully dismissed employees',
          paragraphs: [
            'If a Labour Relations Board or court finds a termination unlawful, typical statutory remedies include reinstatement to the same position, payment of lost wages for the period of unlawful absence from work, and compensation of up to six months salary in lieu of reinstatement.',
          ],
        },
        {
          heading: 'Time limits matter',
          paragraphs: [
            'Claims must generally be filed within three months of the dismissal date. Missing this statutory limitation window can permanently bar your claim. If you suspect wrongful termination, consult a qualified labour advocate immediately.',
          ],
        },
        {
          heading: 'Practical steps to take immediately',
          bullets: [
            'Request a formal written statement of reasons for your dismissal from HR',
            'Preserve all relevant documents: contract, payslips, correspondence, and disciplinary notices',
            'Note the exact date, witnesses, and manner of termination',
            'Contact an accredited labour advocate to review severance calculations',
            'File a complaint with the Labour Relations Board if conciliation fails',
          ],
        },
      ],
    },
  },

  // 2. BUSINESS LAW
  {
    slug: 'starting-a-business-ethiopia-2026',
    category: 'Business Law',
    amharicCategory: 'የንግድ ሕግ',
    title: 'Starting a Business in Ethiopia: A Step-by-Step Legal Guide for 2026',
    amharicTitle: 'በኢትዮጵያ ንግድ መጀመር፡ የ2026 የኩባንያ ምስረታ ህጋዊ ደረጃዎች',
    excerpt:
      'From choosing the right business structure to obtaining your trade license, this guide walks founders through every legal requirement for registering a company in Ethiopia.',
    amharicExcerpt:
      'ትክክለኛውን የኩባንያ ቅርጽ ከመምረጥ እስከ ንግድ ፍቃድ ማውጣት ድረስ ያለውን ህጋዊ አሰራር ደረጃ በደረጃ የሚያስረዳ መመሪያ።',
    author: 'Adv. Dawit Tesfaye',
    amharicAuthor: 'ጠበቃ ዳዊት ተስፋዬ',
    authorRole: 'Corporate Counsel',
    date: 'May 28, 2026',
    readTime: '8 min',
    theme: 'gold',
    categoryParam: 'corporate',
    audioDuration: '3:10',
    imageUrl: '/images/legaltalk/starting-business.jpg',
    content: {
      lead: 'The revised Ethiopian Commercial Code (Proclamation No. 1243/2021) streamlined the establishment of enterprises, introducing single-member private limited companies and modernized corporate governance standards.',
      sections: [
        {
          heading: '1. Selecting your business vehicle',
          paragraphs: [
            'Founders can choose between Sole Proprietorships, Private Limited Companies (PLCs), Share Companies (S.C.), or the newly authorized One-Person Private Limited Company.',
          ],
          bullets: [
            'One-Person PLC: Ideal for solo entrepreneurs seeking limited liability',
            'Standard PLC: Requires 2 to 50 shareholders with flexible governance',
            'Share Company: Required for banks, insurance firms, and public capital raising',
          ],
        },
        {
          heading: '2. Commercial registration and DARS notarization',
          paragraphs: [
            'Your Memorandum of Association must be drafted in strict accordance with mandatory Commercial Code provisions and authenticated before the Documents Authentication and Registration Service (DARS), followed by TIN registration and Ministry of Trade licensing.',
          ],
          callout:
            'Compliance note: Foreign investors must clear Ethiopian Investment Commission (EIC) minimum capital thresholds before obtaining an investment permit and commercial registration.',
        },
      ],
    },
  },

  // 3. COMPLIANCE (AML)
  {
    slug: 'aml-compliance-ethiopia-2026',
    category: 'Compliance',
    amharicCategory: 'ህግ ተገዢነት',
    title: 'AML Compliance in Ethiopia: What Businesses Need to Know in 2026',
    amharicTitle: 'የፀረ-ገንዘብ ማጭበርበር ተገዢነት በኢትዮጵያ፡ የ2026 የንግድ ተቋማት ግዴታዎች',
    excerpt:
      "Ethiopia's anti-money laundering framework has strengthened considerably. Here is what your business must do to stay compliant with Financial Intelligence Service directives.",
    amharicExcerpt:
      'የፋይናንስ ደህንነት አገልግሎት መመሪያዎችን መሰረት በማድረግ ድርጅትዎ ማሟላት ስላለበት የህግ ተገዢነት መስፈርቶች የቀረበ ማብራሪያ።',
    author: 'Adv. Tigist Bekele',
    amharicAuthor: 'ጠበቃ ትዕግሥት በቀለ',
    authorRole: 'Regulatory Counsel',
    date: 'April 10, 2026',
    readTime: '7 min',
    theme: 'slate',
    categoryParam: 'corporate',
    audioDuration: '2:50',
    imageUrl: '/images/legaltalk/aml-compliance.jpg',
    content: {
      lead: 'The Financial Intelligence Service (FIS) and the National Bank of Ethiopia enforce strict Know Your Customer (KYC), beneficial ownership, and suspicious transaction reporting obligations across financial institutions and designated non-financial businesses.',
      sections: [
        {
          heading: 'Who counts as a reporting entity?',
          paragraphs: [
            'Beyond commercial banks, microfinance institutions, and payment operators, AML obligations extend to real estate brokers, precious metal dealers, auditors, and corporate service providers handling high-value transactions.',
          ],
          bullets: [
            'Verify customer National ID (Fayda), passport, or corporate registration before onboarding',
            'Identify ultimate beneficial owners holding controlling stakes in client companies',
            'Report cash transactions exceeding statutory thresholds and any suspicious activity promptly',
          ],
        },
        {
          heading: 'Mandatory record retention',
          paragraphs: [
            'Businesses classified as reporting entities must maintain detailed transaction dossiers and customer due diligence files for a minimum statutory retention period, ensuring rapid retrieval during regulatory audits.',
          ],
          callout:
            'Governance tip: Appointing an internal Compliance Officer and documenting staff AML training significantly lowers institutional risk during FIS inspections.',
        },
      ],
    },
  },

  // 4. DIASPORA
  {
    slug: 'ethiopian-diaspora-property-ownership',
    category: 'Diaspora',
    amharicCategory: 'የዲያስፖራ መብት',
    title: 'Can the Ethiopian Diaspora Own Property in Ethiopia? A Legal Explainer',
    amharicTitle: 'የኢትዮጵያ ዲያስፖራ በአገሩ ንብረት ባለቤት መሆን ይችላል? ህጋዊ ማብራሪያ',
    excerpt:
      'Millions of Ethiopians abroad want to invest in property back home, but the rules are nuanced. This guide explains Yellow Card holder rights and land lease regulations.',
    amharicExcerpt:
      'የቢጫ ካርድ (Foreign National of Ethiopian Origin) ባለመብቶች በመኖሪያና በንግድ ቤቶች ላይ ያላቸው ህጋዊ የይዞታና የባለቤትነት መብት ዝርዝር።',
    author: 'Adv. Selamawit Girma',
    amharicAuthor: 'ጠበቃ ሰላማዊት ግርማ',
    authorRole: 'Diaspora Specialist',
    date: 'March 22, 2026',
    readTime: '5 min',
    theme: 'slate',
    categoryParam: 'property',
    audioDuration: '2:15',
    imageUrl: '/images/legaltalk/diaspora-property.jpg',
    content: {
      lead: 'Under Proclamation No. 270/2002, foreign nationals of Ethiopian origin holding a valid Ethiopian Origin ID (Yellow Card) enjoy broad economic rights comparable to domestic citizens when acquiring urban immovable property.',
      sections: [
        {
          heading: 'Permissible property acquisitions',
          bullets: [
            'Purchase of residential apartments, villas, and real estate developments',
            'Holding commercial leases on municipal urban land',
            'Inheriting immovable property from Ethiopian parents without forced liquidation',
          ],
          callout:
            'Constitutional safeguard: All land remains public property under Article 40 of the FDRE Constitution; private ownership applies to buildings, improvements, and municipal leasehold rights.',
        },
        {
          heading: 'Using an Embassy Power of Attorney safely',
          paragraphs: [
            'Diaspora buyers completing transactions remotely should issue a specific Power of Attorney naming the exact parcel and title deed (Karta) number, authenticated at an Ethiopian Embassy and attested by MoFA and DARS in Addis Ababa.',
          ],
        },
      ],
    },
  },

  // 5. LEGALTECH
  {
    slug: 'ai-transforming-ethiopian-legal-sector',
    category: 'LegalTech',
    amharicCategory: 'ህግና ቴክኖሎጂ',
    title: 'How AI Is Transforming the Ethiopian Legal Sector — And What Lawyers Need to Know',
    amharicTitle: 'አርቴፊሻል ኢንተለጀንስ የኢትዮጵያን የህግ ዘርፍ እንዴት እየቀየረው ነው?',
    excerpt:
      'From contract review to statutory research, digital tools are reshaping legal practice. Explore how Ethiopian advocates can leverage modern LegalTech ethically and accurately.',
    amharicExcerpt:
      'ከውል ዝግጅት እስከ ህግ ጥናት ድረስ ዲጂታል ቴክኖሎጂ የኢትዮጵያን የጥብቅና ሙያ በምን መልኩ እያሳደገው እንዳለ የተዘጋጀ ዳሰሳ።',
    author: 'Adv. Mulu Haile',
    amharicAuthor: 'ጠበቃ ሙሉ ኃይሌ',
    authorRole: 'LegalTech Advisor',
    date: 'February 14, 2026',
    readTime: '6 min',
    theme: 'navy',
    categoryParam: 'corporate',
    audioDuration: '2:30',
    imageUrl: '/images/legaltalk/ai-legaltech.jpg',
    content: {
      lead: 'Bilingual digital legal tools built around Ethiopian proclamations and Federal Supreme Court Cassation decisions are expanding access to legal information for citizens, SMEs, and busy law chambers.',
      sections: [
        {
          heading: 'Automated contract structuring',
          paragraphs: [
            'Platforms like LexDraft help clients and advocates assemble first drafts of employment contracts, commercial leases, and court petitions grounded in Ethiopian statutory structure in minutes rather than hours.',
          ],
        },
        {
          heading: 'Ethical duties remain human',
          paragraphs: [
            'Under Federal Advocacy Proclamation No. 1249/2021, licensed advocates remain personally accountable for verifying every citation, protecting client confidentiality, and tailoring legal strategy to the specific facts of each case.',
          ],
          callout:
            'Best practice: Never paste unredacted client names, national IDs, or privileged evidence into unverified public AI tools.',
        },
      ],
    },
  },

  // 6. PROPERTY LAW
  {
    slug: 'commercial-lease-tenant-rights-ethiopia',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ኪራይ ሕግ',
    title: 'Commercial Lease & Tenant Rights in Ethiopia: Protecting Your Business Premises',
    amharicTitle: 'የንግድ ቤት ኪራይ እና የተከራዮች ህጋዊ መብቶች በኢትዮጵያ',
    excerpt:
      'Unexpected rent hikes and abrupt eviction notices can disrupt any growing business. Learn how the Ethiopian Civil Code and Cassation precedents protect commercial lease agreements.',
    amharicExcerpt:
      'ያልተጠበቀ የኪራይ ጭማሪ እና የስንብት ማስጠንቀቂያ ንግድዎን እንዳያስተጓጉል የፍትሐብሔር ሕጉ እና የሰበር ውሳኔዎች የሚሰጡትን ጥበቃ ይወቁ።',
    author: 'Adv. Dawit Tesfaye',
    amharicAuthor: 'ጠበቃ ዳዊት ተስፋዬ',
    authorRole: 'Property & Real Estate Counsel',
    date: 'July 04, 2026',
    readTime: '6 min',
    theme: 'gold',
    categoryParam: 'property',
    audioDuration: '2:40',
    imageUrl: '/images/legaltalk/commercial-lease.jpg',
    content: {
      lead: 'A well-drafted written lease is the single strongest shield for both commercial landlords and tenants in Ethiopia. Articles 2896 through 2974 of the Civil Code govern lease duration, rent stability, repairs, and lawful termination.',
      sections: [
        {
          heading: 'Can a landlord raise rent mid-contract?',
          paragraphs: [
            'Once a fixed-term commercial lease is signed at an agreed rental rate, neither party may unilaterally alter the rent before the contract term expires unless the lease itself contains a written escalation clause.',
          ],
          callout:
            'Cassation rule: Written contracts have the force of law between the contracting parties under Civil Code Article 1731 — verbal demands for mid-term rent increases are not legally enforceable.',
        },
        {
          heading: 'Essential clauses every business tenant should check',
          bullets: [
            'Exact premises description, floor area, and Title Deed (Karta) reference',
            'Clear allocation of structural vs. interior maintenance responsibilities',
            'Advance rent schedule, security deposit refund timeline, and withholding tax handling',
            'Written notice periods (typically 60 to 90 days) for renewal or termination',
            'Whether subletting or business restructuring requires prior written consent',
          ],
        },
      ],
    },
  },

  // 7. FAMILY LAW
  {
    slug: 'divorce-custody-family-law-ethiopia',
    category: 'Family Law',
    amharicCategory: 'የቤተሰብ ሕግ',
    title: 'Divorce, Child Custody, and Marital Property Under Ethiopia’s Revised Family Code',
    amharicTitle: 'ፍቺ፣ የልጆች አስተዳደግ እና የጋራ ንብረት ክፍፍል በተሻሻለው የቤተሰብ ሕግ',
    excerpt:
      'A plain-language walkthrough of mutual consent vs. contested divorce, the best-interest standard for children, and how common marital property is divided in Ethiopian courts.',
    amharicExcerpt:
      'በስምምነት እና በክርክር የሚፈጸም ፍቺ፣ የልጆች ጥቅም መመዘኛ እና የባልና ሚስት የጋራ ንብረት ክፍፍል በኢትዮጵያ ፍርድ ቤቶች እንዴት እንደሚወሰን።',
    author: 'Adv. Tigist Bekele',
    amharicAuthor: 'ጠበቃ ትዕግሥት በቀለ',
    authorRole: 'Family Law Specialist',
    date: 'August 02, 2026',
    readTime: '7 min',
    theme: 'slate',
    categoryParam: 'family',
    audioDuration: '3:05',
    imageUrl: '/images/legaltalk/family-law.jpg',
    content: {
      lead: 'Ethiopia’s Revised Family Code (Proclamation No. 213/2000) treats spouses as equal partners in marriage and prioritizes the welfare of children and equitable division of common property when a marriage ends.',
      sections: [
        {
          heading: 'Divorce by mutual consent vs. petition by one spouse',
          paragraphs: [
            'Spouses may petition the court jointly for divorce by mutual consent without disclosing private reasons, or either spouse may file individually. Courts often encourage a brief cooling-off or mediation period before pronouncing divorce.',
          ],
        },
        {
          heading: 'How marital property is classified and divided',
          bullets: [
            'Personal property owned before marriage or received individually by inheritance/donation generally remains personal',
            'Income earned by either spouse during marriage and assets acquired during marriage are presumed common property',
            'Common property is divided equally (50/50) upon liquidation unless a valid marriage contract specifies otherwise',
          ],
        },
        {
          heading: 'Child custody and maintenance',
          paragraphs: [
            'Courts decide custody strictly based on the best interests of the child — weighing age, schooling stability, caregiving history, and emotional well-being. Both parents remain legally obligated to contribute proportionally to child maintenance.',
          ],
          callout:
            'Practical note: Documenting joint bank accounts, real estate title deeds, and vehicle ownership records early prevents hidden-asset disputes during property liquidation.',
        },
      ],
    },
  },

  // 8. COMPLIANCE (DATA PROTECTION)
  {
    slug: 'personal-data-protection-ethiopia-1321',
    category: 'Compliance',
    amharicCategory: 'የግል መረጃ ጥበቃ',
    title: 'Ethiopia’s Personal Data Protection Proclamation No. 1321/2024 Explained',
    amharicTitle: 'የኢትዮጵያ የግል መረጃ ጥበቃ አዋጅ ቁጥር 1321/2016 ዋና ዋና ድንጋጌዎች',
    excerpt:
      'Every Ethiopian startup, clinic, school, and bank collecting customer details now faces clear data privacy duties. Understand consent, breach reporting, and user rights.',
    amharicExcerpt:
      'የደንበኞችን መረጃ የሚሰበስቡ ድርጅቶች በአዋጅ ቁጥር 1321/2016 መሠረት ማሟላት ያለባቸው የፈቃድ፣ የመረጃ ደህንነት እና የተጠቃሚ መብት ግዴታዎች።',
    author: 'Adv. Mulu Haile',
    amharicAuthor: 'ጠበቃ ሙሉ ኃይሌ',
    authorRole: 'Technology & Compliance Counsel',
    date: 'September 11, 2026',
    readTime: '6 min',
    theme: 'navy',
    categoryParam: 'corporate',
    audioDuration: '2:35',
    imageUrl: '/images/legaltalk/data-protection.jpg',
    content: {
      lead: 'Proclamation No. 1321/2024 establishes Ethiopia’s first comprehensive legal regime for personal data protection — giving citizens enforceable privacy rights and setting clear obligations for organizations that collect, store, or process personal records.',
      sections: [
        {
          heading: 'Core principles every organization must follow',
          bullets: [
            'Lawfulness and transparency: Inform individuals clearly why their data is collected',
            'Purpose limitation: Use collected phone numbers, IDs, or health records only for the stated purpose',
            'Data minimization: Collect only the fields genuinely required for the service',
            'Security safeguards: Protect stored records with encryption and role-based access controls',
          ],
        },
        {
          heading: 'Rights granted to Ethiopian data subjects',
          paragraphs: [
            'Individuals have the statutory right to request access to personal data held about them, demand correction of inaccurate records, withdraw consent where applicable, and request erasure when data is no longer lawfully required.',
          ],
          callout:
            'Startup action item: Publish a plain-language Privacy Policy stating what you collect, which cloud processors you rely on, and an active email address for deletion requests.',
        },
      ],
    },
  },

  // 9. BUSINESS LAW (TRADEMARK & IP)
  {
    slug: 'trademark-ip-protection-ethiopia',
    category: 'Business Law',
    amharicCategory: 'የአእምሯዊ ንብረት ሕግ',
    title: 'How to Register and Protect Your Brand Trademark in Ethiopia',
    amharicTitle: 'በኢትዮጵያ የንግድ ምልክትዎን (Trademark) እንዴት ማስመዝገብና መጠበቅ ይችላሉ?',
    excerpt:
      'Registering a company name at the Ministry of Trade does not automatically protect your brand logo. Here is how to secure exclusive trademark rights before the EIPA.',
    amharicExcerpt:
      'በንግድ ሚኒስቴር የድርጅት ስም ማስመዝገብ ብቻ የንግድ ምልክትዎን ሙሉ ጥበቃ አይሰጥም። በኢትዮጵያ አእምሯዊ ንብረት ባለስልጣን የምዝገባ ሂደቱን ይወቁ።',
    author: 'Adv. Selamawit Girma',
    amharicAuthor: 'ጠበቃ ሰላማዊት ግርማ',
    authorRole: 'IP & Commercial Counsel',
    date: 'October 03, 2026',
    readTime: '5 min',
    theme: 'gold',
    categoryParam: 'ip',
    audioDuration: '2:20',
    imageUrl: '/images/legaltalk/trademark-ip.jpg',
    content: {
      lead: 'Under Trademark Registration and Protection Proclamation No. 501/2006, exclusive ownership of a brand name, logo, or slogan in Ethiopia is secured through registration with the Ethiopian Intellectual Property Authority (EIPA).',
      sections: [
        {
          heading: 'Step-by-step trademark filing process',
          bullets: [
            'Conduct a preliminary availability search at EIPA to verify no identical or confusingly similar mark exists',
            'Identify the exact Nice Classification classes covering your goods or services',
            'Submit your formal application, logo specimen, and commercial registration documents',
            'Complete formality and substantive examination followed by public notice publication',
            'Receive your Trademark Registration Certificate valid for seven years and renewable thereafter',
          ],
        },
        {
          heading: 'Why early registration saves costly disputes',
          paragraphs: [
            'Because Ethiopia follows a first-to-file framework for registered marks, delaying registration leaves successful cafés, software products, and consumer brands vulnerable to copycats registering the name first.',
          ],
          callout:
            'Brand safeguard: Register both the English and Amharic spellings of your flagship brand name to prevent phonetic imitation in the local market.',
        },
      ],
    },
  },

  // 10. TAX & FINANCE
  {
    slug: 'tax-compliance-small-business-ethiopia',
    category: 'Tax & Finance',
    amharicCategory: 'የግብር እና ፋይናንስ ሕግ',
    title: 'SME Tax Compliance in Ethiopia: VAT, Withholding Tax, and Payroll Basics',
    amharicTitle: 'ለአነስተኛና መካከለኛ ንግዶች የግብር ተገዢነት መመሪያ (VAT፣ ዊዝሆልዲንግ እና የደመወዝ ግብር)',
    excerpt:
      'Avoid avoidable Ministry of Revenues penalties by mastering Ethiopia’s core business tax calendars, withholding tax thresholds, and monthly payroll pension filings.',
    amharicExcerpt:
      'ከገቢዎች ሚኒስቴር ቅጣት ለመዳን የቫት (VAT)፣ የዊዝሆልዲንግ ታክስ እና የወርሃዊ የሠራተኛ ግብርና ጡረታ ማሳወቂያ ሕጎችን በቀላሉ ይረዱ።',
    author: 'Adv. Dawit Tesfaye',
    amharicAuthor: 'ጠበቃ ዳዊት ተስፋዬ',
    authorRole: 'Corporate & Tax Counsel',
    date: 'November 08, 2026',
    readTime: '6 min',
    theme: 'slate',
    categoryParam: 'corporate',
    audioDuration: '2:55',
    imageUrl: '/images/legaltalk/tax-compliance.jpg',
    content: {
      lead: 'Under the Federal Income Tax Proclamation No. 979/2016 and related tax administration laws, consistent monthly recordkeeping and on-time declarations are the easiest way for Ethiopian SMEs to stay penalty-free.',
      sections: [
        {
          heading: 'Four recurring tax obligations every Ethiopian business tracks',
          bullets: [
            'Employment Income Tax & Pension: Deduct monthly PAYE tax plus 7% employee and 11% employer private pension contributions (Proc. No. 1268/2022)',
            'Value Added Tax (VAT) or Turnover Tax (TOT): File monthly VAT returns if registered, keeping compliant fiscal cash-register invoices',
            'Withholding Tax (2%): Withhold and remit 2% on qualifying commercial service and supply payments above statutory thresholds, issuing official withholding receipts',
            'Annual Business Profit Tax: File audited or standardized financial statements according to your Category A, B, or C taxpayer classification',
          ],
        },
        {
          heading: 'What to do if you receive a disputed tax assessment',
          paragraphs: [
            'Taxpayers have a formal right to file an administrative objection with the Tax Review Committee within statutory deadlines, and to appeal further to the Tax Appeal Commission if an assessment contains legal or calculation errors.',
          ],
          callout:
            'Compliance tip: Even in a month with zero revenue, always submit a nil declaration on time — late-filing penalties accumulate automatically even when tax owed is zero.',
        },
      ],
    },
  },
];

export const VERIFIED_QA_DATA: QAItem[] = [
  {
    id: 'QA-2026-081',
    category: 'Corporate & M&A',
    question:
      'Can a Private Limited Company (PLC) issue public shares or raise equity on the Ethiopian Securities Exchange?',
    amharicQuestion: 'ኃ/የተ/የግ/ማህበር (PLC) በአዲሱ የኢትዮጵያ ካፒታል ገበያ አክሲዮን ለህዝብ መሸጥ ይችላል?',
    asker: 'Asked by TechVentures PLC • Addis Ababa',
    advocateName: 'Advocate Mulu Haile',
    advocateLicense: 'ETH-BAR-2018-0492',
    answer:
      'Under Commercial Code Art. 495 and ECMA Directive 1030/2024, a PLC is legally prohibited from issuing public shares. To list or trade on the ESX, the PLC must first convene an Extraordinary General Meeting (EGM) to convert into a Share Company (S.C.) and register a prospectus with the Capital Market Authority.',
    amharicAnswer:
      'በንግድ ህግ አንቀጽ 495 እና በካፒታል ገበያ ባለስልጣን መመሪያ 1030/2024 መሰረት ኃ/የተ/የግ/ማህበር አክሲዮኑን ለህዝብ መሸጥ አይችልም። በመጀመሪያ በጠቅላላ ጉባኤ ውሳኔ ወደ አክሲዮን ማህበር (S.C.) መለወጥ እና ፕሮስፔክተስ ማስመዝገብ ግዴታ ነው።',
    statutoryBasis: 'Commercial Code 2021 Art. 495 & ECMA Directive 1030/2024 Art. 14',
    date: '3 days ago',
  },
  {
    id: 'QA-2026-044',
    category: 'Real Estate & Land',
    question:
      'What are the required legal grounds for commercial lease eviction under Ethiopian Civil Code Art. 2896?',
    amharicQuestion:
      'በፍትሐብሔር ህግ ቁጥር 2896 መሰረት አከራይ ተከራይን ከንግድ ቤት ለማስወጣት የሚያስፈልጉት ህጋዊ ምክንያቶች ምንድን ናቸው?',
    asker: 'Asked by Commercial Tenant • Bole Sub-City',
    advocateName: 'Advocate Dawit Tesfaye',
    advocateLicense: 'ETH-BAR-2015-0081',
    answer:
      'Unilateral rent increments without written agreement do not constitute grounds for eviction. According to Cassation Decision Vol. 18 File No. 89211, landlords must prove material contractual default or authorized redevelopment permits with statutory notice.',
    amharicAnswer:
      'ያለ ስምምነት የቤት ኪራይ ዋጋ በዘፈቀደ መጨመር ተከራይን ለማስወጣት ህጋዊ ምክንያት አይሆንም። በሰበር መዝገብ ቅጽ 18 ቁጥር 89211 መሰረት የውል ጥሰት ወይም ህጋዊ የማደስ ፍቃድ ማረጋገጫ ሊኖር ይገባል።',
    statutoryBasis: 'Civil Code Art. 2896 & Cassation Precedent Vol. 18 File 89211',
    date: '1 week ago',
  },
];