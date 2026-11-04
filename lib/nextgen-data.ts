export interface OpportunityItem {
  id: string;
  title: string;
  amharicTitle: string;
  organization: string;
  orgType: 'Law Firm' | 'Bank / Financial' | 'Corporate' | 'NGO / Public Interest' | 'Judicial / Research';
  location: string;
  track: 'Internship' | 'Pupillage' | 'Junior Counsel' | 'Research & Moot';
  amharicTrack: string;
  eligibility: string;
  stipendETB?: string;
  workType: 'Full-time' | 'Part-time' | 'Hybrid' | 'Remote';
  deadline: string;
  postedDate: string;
  summary: string;
  requirements: string[];
  badge?: 'Featured' | 'Urgent' | 'Mentorship Included';
}

export const SEED_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'Advocate Apprentice (Pupillage under Proc. 1249/2021)',
    amharicTitle: 'የጥብቅና ረዳትነት (በአዋጅ 1249/2013 መሠረት)',
    organization: 'Tadesse & Associates Law Office',
    orgType: 'Law Firm',
    location: 'Kazanchis, Addis Ababa',
    track: 'Pupillage',
    amharicTrack: 'የጥብቅና ረዳትነት',
    eligibility: 'Recent LL.B Graduate (2024–2026)',
    stipendETB: 'ETB 8,000 / month',
    workType: 'Full-time',
    deadline: 'December 15, 2026',
    postedDate: 'November 2, 2026',
    summary: 'Qualifying apprenticeship under licensed Federal High Court and Supreme Court advocates to fulfill practical licensing criteria under Proclamation No. 1249/2021.',
    requirements: [
      'Degree in Law (LL.B) from an accredited Ethiopian University with minimum CGPA 3.0',
      'Assisting in drafting court pleadings, cassation applications, and client case briefs',
      'Accompanying senior advocates to Federal First Instance and High Court hearings',
      'Strong research proficiency in Ethiopian Civil and Commercial Codes'
    ],
    badge: 'Mentorship Included'
  },
  {
    id: 'opp-2',
    title: 'Corporate Legal & Compliance Intern',
    amharicTitle: 'የኮርፖሬት ህግና ተገዢነት ልምምድ',
    organization: 'Dashen Bank Head Office',
    orgType: 'Bank / Financial',
    location: 'Sudan Street, Addis Ababa',
    track: 'Internship',
    amharicTrack: 'የህግ ልምምድ',
    eligibility: '4th or 5th-Year LL.B Students',
    stipendETB: 'ETB 6,500 / month',
    workType: 'Full-time',
    deadline: 'November 30, 2026',
    postedDate: 'November 1, 2026',
    summary: 'Practical immersion in banking compliance, loan securitization, NBE regulatory directives, and commercial contract vetting.',
    requirements: [
      'Currently enrolled in 4th or 5th year of LL.B studies',
      'Understanding of National Bank of Ethiopia banking proclamations and mortgage registration',
      'Proficiency in drafting legal memorandums and reviewing corporate credit documents',
      'Fluent in English and Amharic legal writing'
    ],
    badge: 'Featured'
  },
  {
    id: 'opp-3',
    title: 'Junior Legal Officer - Commercial Contracts',
    amharicTitle: 'ጀማሪ የህግ ባለሙያ - የንግድ ውሎች',
    organization: 'Ethio-Fintech Solutions PLC',
    orgType: 'Corporate',
    location: 'Bole Medhanialem, Addis Ababa',
    track: 'Junior Counsel',
    amharicTrack: 'ጀማሪ የህግ ባለሙያ',
    eligibility: 'Fresh Graduate with 0–1 Year Experience',
    stipendETB: 'ETB 14,000 / month',
    workType: 'Full-time',
    deadline: 'December 20, 2026',
    postedDate: 'October 28, 2026',
    summary: 'Entry-level position reviewing software vendor NDAs, merchant onboarding contracts, and electronic transaction compliance under Proclamation No. 1205/2020.',
    requirements: [
      'LL.B degree with coursework in Commercial Code and Intellectual Property Law',
      'Ability to audit contract clauses and ensure compliance with electronic payment regulations',
      'Detail-oriented drafting and legal proofreading skills'
    ],
    badge: 'Urgent'
  },
  {
    id: 'opp-4',
    title: 'Human Rights Legal Aid Clinical Intern',
    amharicTitle: 'የሰብዓዊ መብቶችና ነፃ የህግ ድጋፍ ልምምድ',
    organization: 'Ethiopian Human Rights Defenders Center',
    orgType: 'NGO / Public Interest',
    location: 'Yeka Sub-City, Addis Ababa',
    track: 'Internship',
    amharicTrack: 'የህግ ልምምድ',
    eligibility: '3rd, 4th, or 5th-Year LL.B Students',
    stipendETB: 'ETB 5,000 / month',
    workType: 'Part-time',
    deadline: 'December 10, 2026',
    postedDate: 'October 30, 2026',
    summary: 'Support free legal aid counseling for vulnerable citizens, prepare legal clinic intake files, and conduct constitutional rights awareness.',
    requirements: [
      'Enrolled law student committed to public interest law and human rights protection',
      'Experience in university legal aid clinics or community outreach',
      'Empathetic client interview abilities and thorough case documentation skills'
    ]
  },
  {
    id: 'opp-5',
    title: 'Moot Court Research Assistant & Judicial Clerk',
    amharicTitle: 'የሙት ኮርት ረዳትና የህግ ተመራማሪ',
    organization: 'Addis Legal Institute & Policy Hub',
    orgType: 'Judicial / Research',
    location: 'Arat Kilo, Addis Ababa',
    track: 'Research & Moot',
    amharicTrack: 'ምርምርና ሙት ኮርት',
    eligibility: 'Undergraduate Law Students with Moot Experience',
    stipendETB: 'ETB 6,000 / month',
    workType: 'Hybrid',
    deadline: 'January 10, 2027',
    postedDate: 'November 3, 2026',
    summary: 'Assist senior researchers in indexing federal cassation bench precedent decisions and preparing institutional moot court teams for international rounds.',
    requirements: [
      'Active participant in National or All-African Moot Court Competitions',
      'Exemplary legal research and citation skills in Ethiopian case law',
      'Strong analytical writing for statutory comparison reports'
    ],
    badge: 'Mentorship Included'
  },
  {
    id: 'opp-6',
    title: 'Tax & Investment Advisory Intern',
    amharicTitle: 'የታክስና ኢንቨስትመንት አማካሪ ልምምድ',
    organization: 'Prime Horizon Corporate Advisors',
    orgType: 'Corporate',
    location: 'Gotera, Addis Ababa',
    track: 'Internship',
    amharicTrack: 'የህግ ልምምድ',
    eligibility: 'Final Year Law Students or Fresh Graduates',
    stipendETB: 'ETB 7,500 / month',
    workType: 'Full-time',
    deadline: 'December 5, 2026',
    postedDate: 'November 2, 2026',
    summary: 'Direct exposure to foreign direct investment (FDI) advisory, Ministry of Revenues tax compliance, and investment permit filings with the EIC.',
    requirements: [
      'Demonstrated academic excellence in Tax Law and Investment Proclamation No. 1180/2020',
      'Proficiency in corporate document preparation and business registration roadmap',
      'Professional working fluency in English'
    ]
  }
];