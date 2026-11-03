export interface Article {
  slug: string;
  category: 'Employee Rights' | 'Business Law' | 'Compliance' | 'Diaspora' | 'LegalTech';
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
  {
    slug: 'wrongful-termination-ethiopia',
    category: 'Employee Rights',
    amharicCategory: 'የሠራተኛ መብት',
    title: 'Wrongful Termination in Ethiopia: Know Your Rights Under the Labour Proclamation',
    amharicTitle: 'ያለአግባብ ከስራ መሰናበት በኢትዮጵያ፡ በአዋጅ ቁጥር 1156/2019 የተሰጡዎት ህጋዊ መብቶች',
    excerpt: "Ethiopia's Labour Proclamation No. 1156/2019 provides strong protections against arbitrary dismissal. Here's what every employee needs to know about lawful versus unlawful termination.",
    amharicExcerpt: 'የአዋጅ ቁጥር 1156/2019 ማንኛውም ሰራተኛ ያለበቂ ህጋዊ ምክንያት ከስራ እንዳይሰናበት ጥበቃ ያደርጋል። ህጋዊና ህገ-ወጥ ስንብትን በተመለከተ ማወቅ ያለብዎት ዝርዝር ጉዳዮች።',
    author: 'Adv. Mulu Haile',
    amharicAuthor: 'ጠበቃ ሙሉ ኃይሌ',
    authorRole: 'Labour Law Specialist',
    date: 'June 15, 2026',
    readTime: '6 min',
    theme: 'navy',
    categoryParam: 'employment',
    audioDuration: '2:45',
    content: {
      lead: "Ethiopia's Labour Proclamation No. 1156/2019 sets out clear rules on when an employer may lawfully end an employment contract. Understanding these rules is the first step to protecting yourself if you believe your dismissal was unjust.",
      sections: [
        {
          heading: 'What constitutes lawful termination?',
          paragraphs: [
            'An employer may terminate a contract of employment for a good cause — defined as a serious breach of duty, persistent poor performance after written warnings, redundancy driven by genuine operational needs, or the completion of a fixed-term contract.'
          ],
          bullets: [
            'Serious misconduct (e.g. theft, assault, disclosure of trade secrets)',
            'Repeated absence without permission after written warning',
            'Genuine redundancy with statutory severance payment',
            'Expiry of a fixed-term or task-based contract',
            'Force majeure making performance impossible'
          ]
        },
        {
          heading: 'What is wrongful termination?',
          paragraphs: [
            'A termination is wrongful — and legally challengeable — when it lacks a valid reason, violates the required statutory procedure, or is motivated by discrimination. The Proclamation specifically prohibits dismissal on grounds of union membership, pregnancy, gender, religion, or nationality.'
          ],
          callout: 'Key protection: Even where a valid reason exists, the employer must follow a fair disciplinary procedure — including issuing a formal written notice and giving the employee an opportunity to respond before any dismissal takes effect.'
        },
        {
          heading: 'Remedies available to wrongfully dismissed employees',
          paragraphs: [
            'If a Labour Relations Board or court finds a termination unlawful, the typical statutory remedies include reinstatement to the same position, payment of lost wages for the period of unlawful absence from work, and compensation of up to six months salary in lieu of reinstatement.'
          ]
        },
        {
          heading: 'Time limits matter',
          paragraphs: [
            'Claims must generally be filed within three months of the dismissal date. Missing this statutory limitation window can permanently bar your claim. If you suspect wrongful termination, consult a qualified labour lawyer immediately.'
          ]
        },
        {
          heading: 'Practical steps to take immediately',
          bullets: [
            'Request a formal written statement of reasons for your dismissal from HR',
            'Preserve all relevant documents: contract, payslips, correspondence, and disciplinary notices',
            'Note the exact date, witnesses, and manner of termination',
            'Contact an accredited labor advocate to review severance calculations',
            'File a complaint with the Labour Relations Board if conciliation fails'
          ]
        }
      ]
    }
  },
  {
    slug: 'starting-a-business-ethiopia-2026',
    category: 'Business Law',
    amharicCategory: 'የንግድ ሕግ',
    title: 'Starting a Business in Ethiopia: A Step-by-Step Legal Guide for 2026',
    amharicTitle: 'በኢትዮጵያ ንግድ መጀመር፡ የ2026 የኩባንያ ምስረታ ህጋዊ ደረጃዎች',
    excerpt: 'From choosing the right business structure to obtaining your trade license, this guide walks founders through every legal requirement for registering a company in Ethiopia.',
    amharicExcerpt: 'ትክክለኛውን የኩባንያ ቅርጽ ከመምረጥ እስከ ንግድ ፍቃድ ማውጣት ድረስ ያለውን ህጋዊ አሰራር ደረጃ በደረጃ የሚያስረዳ መመሪያ።',
    author: 'Adv. Dawit Tesfaye',
    amharicAuthor: 'ጠበቃ ዳዊት ተስፋዬ',
    authorRole: 'Corporate Counsel',
    date: 'May 28, 2026',
    readTime: '8 min',
    theme: 'gold',
    categoryParam: 'corporate',
    audioDuration: '3:10',
    content: {
      lead: 'The Ethiopian Commercial Code (Proclamation No. 1240/2021) streamlined the establishment of enterprises, introducing one-person private limited companies and modernized governance standards.',
      sections: [
        {
          heading: '1. Selecting your business vehicle',
          paragraphs: [
            'Founders can choose between Sole Proprietorships, Private Limited Companies (PLCs), Share Companies (S.C.), or the newly authorized Single-Member PLC.'
          ],
          bullets: [
            'Single-Member PLC: Ideal for solo entrepreneurs seeking limited liability',
            'Standard PLC: Requires 2 to 50 shareholders with minimum capital flexibility',
            'Share Company: Required for banks, insurance firms, and public capital raising'
          ]
        },
        {
          heading: '2. Commercial registration & DARA notarization',
          paragraphs: [
            'Articles and Memorandums of Association must be drafted in strict accordance with mandatory Commercial Code provisions and submitted to the Documents Authentication and Registration Agency (DARA).'
          ],
          callout: 'Compliance note: Foreign investors must clear the Ethiopian Investment Commission (EIC) capital verification thresholds before tax identification issuance.'
        }
      ]
    }
  },
  {
    slug: 'aml-compliance-ethiopia-2026',
    category: 'Compliance',
    amharicCategory: 'ህግ ተገዢነት',
    title: 'AML Compliance in Ethiopia: What Businesses Need to Know in 2026',
    amharicTitle: 'የፀረ-ገንዘብ ማጭበርበር ተገዢነት በኢትዮጵያ፡ የ2026 የንግድ ተቋማት ግዴታዎች',
    excerpt: "Ethiopia's anti-money laundering framework has strengthened considerably. Here's what your business must do to stay fully compliant with Financial Intelligence Service directives.",
    amharicExcerpt: 'የፋይናንስ ደህንነት አገልግሎት መመሪያዎችን መሰረት በማድረግ ድርጅትዎ ማሟላት ስላለበት የህግ ተገዢነት መስፈርቶች የቀረበ ማብራሪያ።',
    author: 'Adv. Tigist Bekele',
    amharicAuthor: 'ጠበቃ ትዕግሥት በቀለ',
    authorRole: 'Regulatory Counsel',
    date: 'April 10, 2026',
    readTime: '7 min',
    theme: 'slate',
    categoryParam: 'corporate',
    audioDuration: '2:50',
    content: {
      lead: 'The Financial Intelligence Service (FIS) and the National Bank of Ethiopia enforce stringent Know Your Customer (KYC) and transaction threshold reporting obligations across financial institutions and designated non-financial businesses.',
      sections: [
        {
          heading: 'Mandatory record retention',
          paragraphs: [
            'Businesses classified as reporting entities must maintain detailed transaction dossiers and beneficial ownership audits for a minimum statutory period of ten years.'
          ]
        }
      ]
    }
  },
  {
    slug: 'ethiopian-diaspora-property-ownership',
    category: 'Diaspora',
    amharicCategory: 'የዲያስፖራ መብት',
    title: 'Can the Ethiopian Diaspora Own Property in Ethiopia? A Legal Explainer',
    amharicTitle: 'የኢትዮጵያ ዲያስፖራ በአገሩ ንብረት ባለቤት መሆን ይችላል? ህጋዊ ማብራሪያ',
    excerpt: 'Millions of Ethiopians abroad want to invest in property back home, but the rules are nuanced. This guide explains yellow card holder rights and land lease regulations.',
    amharicExcerpt: 'የቢጫ ካርድ (Foreign National of Ethiopian Origin) ባለመብቶች በመኖሪያና በንግድ ቤቶች ላይ ያላቸው ህጋዊ የይዞታና የባለቤትነት መብት ዝርዝር።',
    author: 'Adv. Selamawit Girma',
    amharicAuthor: 'ጠበቃ ሰላማዊት ግርማ',
    authorRole: 'Diaspora Specialist',
    date: 'March 22, 2026',
    readTime: '5 min',
    theme: 'slate',
    categoryParam: 'property',
    audioDuration: '2:15',
    content: {
      lead: 'Under Proclamation No. 270/2002, foreign nationals of Ethiopian origin holding a valid Origin ID (Yellow Card) enjoy the same economic rights as domestic citizens regarding urban immovable property acquisition.',
      sections: [
        {
          heading: 'Permissible property acquisitions',
          bullets: [
            'Purchase of residential apartments, villas, and real estate units',
            'Holding commercial leases on municipal urban land',
            'Inheriting immovable property from Ethiopian parents without forced liquidation'
          ],
          callout: 'Constitutional safeguard: All land remains public property under Article 40 of the FDRE Constitution; ownership applies exclusively to buildings, improvements, and leasehold rights.'
        }
      ]
    }
  },
  {
    slug: 'ai-transforming-ethiopian-legal-sector',
    category: 'LegalTech',
    amharicCategory: 'ህግና ቴክኖሎጂ',
    title: 'How AI Is Transforming the Ethiopian Legal Sector — And What Lawyers Need to Know',
    amharicTitle: 'አርቴፊሻል ኢንተለጀንስ የኢትዮጵያን የህግ ዘርፍ እንዴት እየቀየረው ነው?',
    excerpt: 'From contract review to legal research, AI tools are reshaping legal practice globally. This article explores how Ethiopian lawyers can leverage modern LegalTech ethically.',
    amharicExcerpt: 'ከውል ዝግጅት እስከ ህግ ጥናት ድረስ AI የኢትዮጵያን የጥብቅና ሙያ በምን መልኩ እያሳደገው እንዳለ የተዘጋጀ ዳሰሳ።',
    author: 'Adv. Mulu Haile',
    amharicAuthor: 'ጠበቃ ሙሉ ኃይሌ',
    authorRole: 'LegalTech Advisor',
    date: 'February 14, 2026',
    readTime: '6 min',
    theme: 'navy',
    categoryParam: 'corporate',
    audioDuration: '2:30',
    content: {
      lead: 'Bilingual legal artificial intelligence trained on Federal Supreme Court Cassation decisions and statutory proclamations is expanding access to justice across Ethiopia.',
      sections: [
        {
          heading: 'Automated contract structuring',
          paragraphs: [
            'Platforms like LexDraft verify that mandatory Labor Proclamation clauses and Commercial Code articles are injected correctly into draft agreements within seconds.'
          ]
        }
      ]
    }
  }
];

export const VERIFIED_QA_DATA: QAItem[] = [
  {
    id: 'QA-2026-081',
    category: 'Corporate & M&A',
    question: 'Can a Private Limited Company (PLC) issue public shares or raise equity on the Ethiopian Securities Exchange?',
    amharicQuestion: 'ኃ/የተ/የግ/ማህበር (PLC) በአዲሱ የኢትዮጵያ ካፒታል ገበያ አክሲዮን ለህዝብ መሸጥ ይችላል?',
    asker: 'Asked by TechVentures PLC • Addis Ababa',
    advocateName: 'Advocate Mulu Haile',
    advocateLicense: 'ETH-BAR-2018-0492',
    answer: 'Under Commercial Code Art. 495 and ECMA Directive 1030/2024, a PLC is legally prohibited from issuing public shares. To list or trade on the ESX, the PLC must first convene an Extraordinary General Meeting (EGM) to convert into a Share Company (S.C.) and register a prospectus with the Capital Market Authority.',
    amharicAnswer: 'በንግድ ህግ አንቀጽ 495 እና በካፒታል ገበያ ባለስልጣን መመሪያ 1030/2024 መሰረት ኃ/የተ/የግ/ማህበር አክሲዮኑን ለህዝብ መሸጥ አይችልም። በመጀመሪያ በጠቅላላ ጉባኤ ውሳኔ ወደ አክሲዮን ማህበር (S.C.) መለወጥ እና ፕሮስፔክተስ ማስመዝገብ ግዴታ ነው።',
    statutoryBasis: 'Commercial Code 2021 Art. 495 & ECMA Directive 1030/2024 Art. 14',
    date: '3 days ago'
  },
  {
    id: 'QA-2026-044',
    category: 'Real Estate & Land',
    question: 'What are the required legal grounds for commercial lease eviction under Ethiopian Civil Code Art. 2896?',
    amharicQuestion: 'በፍትሐብሔር ህግ ቁጥር 2896 መሰረት አከራይ ተከራይን ከንግድ ቤት ለማስወጣት የሚያስፈልጉት ህጋዊ ምክንያቶች ምንድን ናቸው?',
    asker: 'Asked by Commercial Tenant • Bole Sub-City',
    advocateName: 'Advocate Dawit Tesfaye',
    advocateLicense: 'ETH-BAR-2015-0081',
    answer: 'Unilateral rent increments without written agreement do not constitute grounds for eviction. According to Cassation Decision Vol. 18 File No. 89211, landlords must prove material contractual default or authorized redevelopment permits with statutory notice.',
    amharicAnswer: 'ያለ ስምምነት የቤት ኪራይ ዋጋ በዘፈቀደ መጨመር ተከራይን ለማስወጣት ህጋዊ ምክንያት አይሆንም። በሰበር መዝገብ ቅጽ 18 ቁጥር 89211 መሰረት የውል ጥሰት ወይም ህጋዊ የማደስ ፍቃድ ማረጋገጫ ሊኖር ይገባል።',
    statutoryBasis: 'Civil Code Art. 2896 & Cassation Precedent Vol. 18 File 89211',
    date: '1 week ago'
  }
];