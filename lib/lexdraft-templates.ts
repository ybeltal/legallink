export interface TemplateField {
  id: string;
  label: string;
  amharicLabel: string;
  placeholder: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: string[];
  step: 1 | 2 | 3;
  required?: boolean;
}

export interface LegalTemplate {
  id: string;
  title: string;
  amharicTitle: string;
  category: 'Labour Law' | 'Property Law' | 'Commercial' | 'Compliance' | 'Diaspora' | 'Financial';
  amharicCategory: string;
  badge?: 'Most Popular' | 'New';
  description: string;
  amharicDescription: string;
  priceETB: number;
  pageCount: string;
  statute: string;
  steps: {
    number: number;
    title: string;
    amharicTitle: string;
  }[];
  fields: TemplateField[];
  generateContractText: (data: Record<string, any>, lang: 'en' | 'am') => string[];
}

export const LEXDRAFT_TEMPLATES: LegalTemplate[] = [
  // 01. Employment Contract
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    amharicTitle: 'የስራ ቅጥር ውል',
    category: 'Labour Law',
    amharicCategory: 'የሠራተኛ ሕግ',
    badge: 'Most Popular',
    description: 'Full-form contract compliant with Ethiopian Labour Proclamation No. 1156/2019. Covers probation, duties, compensation, leave, and severance protections.',
    amharicDescription: 'በአዋጅ ቁጥር 1156/2019 መሰረት የተዘጋጀ ህጋዊ የስራ ቅጥር ውል፤ የሙከራ ጊዜ፣ ደመወዝ፣ የስራ ሰዓትና ፈቃድን ያካትታል።',
    priceETB: 450,
    pageCount: '~4 pages',
    statute: 'Labour Proclamation No. 1156/2019',
    steps: [
      { number: 1, title: 'Employer', amharicTitle: 'አሠሪ' },
      { number: 2, title: 'Employee', amharicTitle: 'ሠራተኛ' },
      { number: 3, title: 'Terms', amharicTitle: 'የውል ውሎች' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'employerName', label: 'Company / Legal Name', amharicLabel: 'የድርጅቱ ህጋዊ ስም', placeholder: 'e.g. Abyssinia Trading PLC', type: 'text', step: 1, required: true },
      { id: 'registrationNumber', label: 'Commercial Registration No.', amharicLabel: 'የንግድ ምዝገባ ቁጥር', placeholder: 'e.g. ETH-PLC-00123', type: 'text', step: 1, required: true },
      { id: 'city', label: 'City / Sub-City', amharicLabel: 'ከተማ / ክፍለ ከተማ', placeholder: 'e.g. Addis Ababa, Bole', type: 'text', step: 1, required: true },
      { id: 'representativeName', label: 'Authorized Representative', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'e.g. Ato Kebede Alemu', type: 'text', step: 1, required: true },
      { id: 'representativeTitle', label: 'Representative Title', amharicLabel: 'የተወካዩ የሥራ ድርሻ', placeholder: 'e.g. Chief Executive Officer', type: 'text', step: 1, required: true },

      { id: 'employeeName', label: 'Employee Full Legal Name', amharicLabel: 'የሠራተኛው ሙሉ ስም', placeholder: 'e.g. Sara Haile Mariam', type: 'text', step: 2, required: true },
      { id: 'employeeId', label: 'National ID / Passport Number', amharicLabel: 'ብሔራዊ መታወቂያ / ፓስፖርት ቁጥር', placeholder: 'e.g. ET-ID-9821334', type: 'text', step: 2, required: true },
      { id: 'employeeAddress', label: 'Residential Address', amharicLabel: 'የመኖሪያ አድራሻ', placeholder: 'e.g. Yeka Sub-City, Woreda 04', type: 'text', step: 2, required: true },

      { id: 'jobTitle', label: 'Position / Job Title', amharicLabel: 'የሥራ መደብ', placeholder: 'e.g. Senior Software Engineer', type: 'text', step: 3, required: true },
      { id: 'grossSalary', label: 'Monthly Gross Salary (ETB)', amharicLabel: 'ወርሃዊ ጥቅል ደመወዝ (ብር)', placeholder: 'e.g. 45000', type: 'number', step: 3, required: true },
      { id: 'probationPeriod', label: 'Probation Period', amharicLabel: 'የሙከራ ጊዜ', placeholder: 'Select duration', type: 'select', options: ['No Probation', '30 Days', '60 Days (Statutory Maximum)'], step: 3, required: true },
      { id: 'startDate', label: 'Employment Start Date', amharicLabel: 'ሥራ የሚጀምርበት ቀን', placeholder: '', type: 'date', step: 3, required: true }
    ],
    generateContractText: (data, lang) => [
      `CONTRACT OF EMPLOYMENT PURSUANT TO LABOUR PROCLAMATION NO. 1156/2019`,
      `This Employment Agreement is entered into on this day between ${data.employerName || '[Employer Name]'} (Registration No. ${data.registrationNumber || '[Reg No]'}) represented by ${data.representativeName || '[Representative]'}, ${data.representativeTitle || '[Title]'} (hereinafter "Employer"), and ${data.employeeName || '[Employee Name]'}, ID No. ${data.employeeId || '[ID No]'} (hereinafter "Employee").`,
      `1. POSITION AND RESPONSIBILITIES: The Employer agrees to employ the Employee as ${data.jobTitle || '[Job Title]'}. The Employee shall execute all lawful duties diligently.`,
      `2. COMPENSATION: The Employer shall pay the Employee a monthly gross remuneration of ETB ${Number(data.grossSalary || 0).toLocaleString()} payable in arrears on the last working day of each calendar month.`,
      `3. PROBATION: In accordance with Article 11 of Proclamation 1156/2019, the Employee shall be subject to a probation period of ${data.probationPeriod || '60 Days'}.`,
      `4. WORKING HOURS AND LEAVE: Normal working hours shall not exceed 48 hours per week. The Employee is entitled to 16 working days of statutory annual leave for the first year of continuous service.`
    ]
  },

  // 02. Commercial Lease Agreement
  {
    id: 'commercial-lease',
    title: 'Commercial Lease Agreement',
    amharicTitle: 'የንግድ ቤት ኪራይ ውል',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    badge: 'New',
    description: 'Lease agreement for commercial offices and retail premises. Covers rent escalation, maintenance obligations, municipal tax liabilities, and security deposits.',
    amharicDescription: 'ለቢሮዎችና ለንግድ ሱቆች የተዘጋጀ የኪራይ ውል፤ ዓመታዊ የዋጋ ጭማሪ ገደብና የግብር ግዴታዎችን በዝርዝር ያካትታል።',
    priceETB: 600,
    pageCount: '~5 pages',
    statute: 'Civil Code of Ethiopia Art. 2896 et seq.',
    steps: [
      { number: 1, title: 'Landlord', amharicTitle: 'አከራይ' },
      { number: 2, title: 'Tenant', amharicTitle: 'ተከራይ' },
      { number: 3, title: 'Premises', amharicTitle: 'የንብረት ዝርዝር' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'landlordName', label: 'Landlord Full Name / Entity', amharicLabel: 'የአከራይ ሙሉ ስም', placeholder: 'e.g. W/ro Almaz Tadesse', type: 'text', step: 1, required: true },
      { id: 'landlordPhone', label: 'Landlord Phone Number', amharicLabel: 'የአከራይ ስልክ ቁጥር', placeholder: '+251 91...', type: 'text', step: 1, required: true },

      { id: 'tenantName', label: 'Tenant Entity / Full Name', amharicLabel: 'የተከራይ ህጋዊ ስም', placeholder: 'e.g. BlueNile Logistics PLC', type: 'text', step: 2, required: true },
      { id: 'tenantBusiness', label: 'Intended Commercial Purpose', amharicLabel: 'የንግድ ስራው አይነት', placeholder: 'e.g. Commercial Office & IT Consultancy', type: 'text', step: 2, required: true },

      { id: 'premisesAddress', label: 'Premises Location (Sub-City, Building)', amharicLabel: 'የቤቱ አድራሻ (ክፍለ ከተማ፣ ህንፃ)', placeholder: 'e.g. Bole Sub-City, Medhanialem Mall 3rd Floor', type: 'text', step: 3, required: true },
      { id: 'monthlyRent', label: 'Monthly Rent in ETB', amharicLabel: 'ወርሃዊ የኪራይ መጠን (ብር)', placeholder: 'e.g. 75000', type: 'number', step: 3, required: true },
      { id: 'securityDeposit', label: 'Security Deposit (Months)', amharicLabel: 'የዋስትና ክፍያ (የወራት ብዛት)', placeholder: '', type: 'select', options: ['1 Month', '2 Months', '3 Months'], step: 3, required: true },
      { id: 'leaseDuration', label: 'Lease Duration', amharicLabel: 'የውሉ ቆይታ', placeholder: '', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years'], step: 3, required: true }
    ],
    generateContractText: (data) => [
      `COMMERCIAL PREMISES LEASE AGREEMENT UNDER CIVIL CODE ART. 2896`,
      `This Commercial Lease Agreement is executed between ${data.landlordName || '[Landlord]'} (hereinafter "Lessor") and ${data.tenantName || '[Tenant]'} (hereinafter "Lessee").`,
      `1. LEASED PREMISES: The Lessor agrees to lease the commercial space situated at ${data.premisesAddress || '[Premises Location]'} solely for the conduct of ${data.tenantBusiness || '[Commercial Purpose]'}.`,
      `2. RENT AND ESCROW DEPOSIT: The agreed monthly rental fee is ETB ${Number(data.monthlyRent || 0).toLocaleString()} payable in advance. Lessee shall deposit a refundable security fee equivalent to ${data.securityDeposit || '2 Months'} rent.`,
      `3. TERM: The lease shall remain in full force for a duration of ${data.leaseDuration || '2 Years'} from the date of handover.`
    ]
  },

  // 03. Non-Disclosure Agreement (NDA)
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    amharicTitle: 'የሚስጥር ጥበቃ ስምምነት (NDA)',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Mutual or one-way NDA for protecting trade secrets, financial records, client databases, and proprietary inventions under Ethiopian Commercial law.',
    amharicDescription: 'የንግድ ሚስጥሮችን፣ የደንበኞች መረጃዎችንና የፈጠራ ውጤቶችን ከአላስፈላጊ ይፋ መሆን የሚከላከል ህጋዊ ስምምነት።',
    priceETB: 300,
    pageCount: '~2 pages',
    statute: 'Commercial Code Proclamation No. 1240/2021',
    steps: [
      { number: 1, title: 'Discloser', amharicTitle: 'መረጃ አጋሪ' },
      { number: 2, title: 'Recipient', amharicTitle: 'መረጃ ተቀባይ' },
      { number: 3, title: 'Terms', amharicTitle: 'የውል ቃላት' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'discloserName', label: 'Disclosing Party Name', amharicLabel: 'ሚስጥራዊ መረጃውን የሚሰጠው ወገን', placeholder: 'e.g. EthioFintech Solutions S.C.', type: 'text', step: 1, required: true },
      { id: 'recipientName', label: 'Receiving Party Name', amharicLabel: 'መረጃውን የሚቀበለው ወገን', placeholder: 'e.g. Meron Desta', type: 'text', step: 2, required: true },
      { id: 'ndaType', label: 'Type of Non-Disclosure', amharicLabel: 'የስምምነቱ አይነት', placeholder: '', type: 'select', options: ['Unilateral (One-Way)', 'Mutual (Bilateral)'], step: 3, required: true },
      { id: 'confidentialityTerm', label: 'Confidentiality Period', amharicLabel: 'የሚስጥር ጥበቃ ቆይታ', placeholder: '', type: 'select', options: ['2 Years', '3 Years', '5 Years', 'Perpetual (Trade Secrets)'], step: 3, required: true }
    ],
    generateContractText: (data) => [
      `MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT`,
      `Between ${data.discloserName || '[Disclosing Party]'} and ${data.recipientName || '[Receiving Party]'}.`,
      `1. CONFIDENTIAL INFORMATION: Includes all proprietary technical, financial, trade secret, software code, and customer data disclosed directly or indirectly.`,
      `2. OBLIGATIONS: The Receiving Party agrees to hold all confidential information in strict confidence for a period of ${data.confidentialityTerm || '3 Years'}.`,
      `3. REMEDIES: Any unauthorized disclosure shall entitle the aggrieved party to injunctive relief and provable commercial damages under Ethiopian Commercial Code.`
    ]
  },

  // 04. General Power of Attorney
  {
    id: 'general-poa',
    title: 'General Power of Attorney',
    amharicTitle: 'ጠቅላላ የውክልና ስልጣን',
    category: 'Diaspora',
    amharicCategory: 'የዲያስፖራና ውክልና',
    description: 'Empowers a trusted agent to manage financial accounts, legal representation, tax filings, and administrative affairs in Ethiopia before all courts and authorities.',
    amharicDescription: 'በኢትዮጵያ የሚገኙ የባንክ ሂሳቦችን፣ የግብር ጉዳዮችንና የፍርድ ቤት ክርክሮችን ለመወከል የሚያስችል ጠቅላላ ውክልና።',
    priceETB: 500,
    pageCount: '~2 pages',
    statute: 'Civil Code of Ethiopia Art. 2199 et seq.',
    steps: [
      { number: 1, title: 'Principal', amharicTitle: 'ወካይ' },
      { number: 2, title: 'Agent', amharicTitle: 'ተወካይ' },
      { number: 3, title: 'Powers', amharicTitle: 'የስልጣን ወሰን' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'principalName', label: 'Principal Full Name (ወካይ)', amharicLabel: 'የወካይ ሙሉ ስም', placeholder: 'e.g. Solomon Berhanu', type: 'text', step: 1, required: true },
      { id: 'principalPassport', label: 'Passport / Yellow Card No.', amharicLabel: 'ፓስፖርት / ቢጫ ካርድ ቁጥር', placeholder: 'e.g. EP-098231', type: 'text', step: 1, required: true },
      { id: 'agentName', label: 'Appointed Agent Full Name (ተወካይ)', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'e.g. Yonas Solomon', type: 'text', step: 2, required: true },
      { id: 'agentId', label: 'Agent Ethiopian National ID No.', amharicLabel: 'የተወካይ የኢትዮጵያ መታወቂያ ቁጥር', placeholder: 'e.g. ET-ID-44912', type: 'text', step: 2, required: true },
      { id: 'powerScope', label: 'Scope of Authorization', amharicLabel: 'የስልጣን ወሰን', placeholder: '', type: 'select', options: ['Full Administrative & Bank Powers', 'Administrative & Court Defense Only', 'Tax & Document Clearance Only'], step: 3, required: true }
    ],
    generateContractText: (data) => [
      `GENERAL POWER OF ATTORNEY (ጠቅላላ የውክልና ስልጣን ሰነድ)`,
      `I, the undersigned ${data.principalName || '[Principal]'} (Passport No: ${data.principalPassport || '[Passport]'}), hereby appoint and constitute ${data.agentName || '[Agent]'} (National ID: ${data.agentId || '[ID]'}) as my lawful Attorney-in-Fact in Ethiopia.`,
      `AUTHORITY: The Attorney-in-Fact is empowered with ${data.powerScope || 'Full Administrative Powers'} to act on my behalf before the Ministry of Justice, Federal Courts, DARA, Commercial Banks, and Revenue authorities with full binding effect.`
    ]
  },

  // 05. Special Real Estate Power of Attorney
  {
    id: 'special-property-poa',
    title: 'Special Land & Property PoA',
    amharicTitle: 'የመሬትና ይዞታ ልዩ ውክልና',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    badge: 'New',
    description: 'Specific mandate enabling an agent to execute land lease renewals, title deed (ካርታ) replacements, municipal audits, and property conveyances with DARA.',
    amharicDescription: 'የመሬት ካርታ ለማደስ፣ ለማስተላለፍ ወይም ለማረጋገጥ የሚሰጥ ልዩ ህጋዊ የውክልና ስልጣን።',
    priceETB: 650,
    pageCount: '~3 pages',
    statute: 'Urban Land Leaseholding Proclamation No. 721/2011',
    steps: [
      { number: 1, title: 'Owner', amharicTitle: 'ባለይዞታ' },
      { number: 2, title: 'Agent', amharicTitle: 'ተወካይ' },
      { number: 3, title: 'Land Details', amharicTitle: 'የይዞታ መረጃ' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'ownerName', label: 'Registered Property Owner', amharicLabel: 'የባለይዞታው ሙሉ ስም', placeholder: 'e.g. Dr. Tewodros Kassahun', type: 'text', step: 1, required: true },
      { id: 'agentName', label: 'Special Agent Full Name', amharicLabel: 'የተወካዩ ሙሉ ስም', placeholder: 'e.g. Senait Tewodros', type: 'text', step: 2, required: true },
      { id: 'parcelNumber', label: 'Municipal Title Deed (ካርታ) No.', amharicLabel: 'የካርታ ቁጥር', placeholder: 'e.g. BOL-7819-2016', type: 'text', step: 3, required: true },
      { id: 'propertyLocation', label: 'Sub-City & Woreda', amharicLabel: 'ክፍለ ከተማ እና ወረዳ', placeholder: 'e.g. Bole Sub-City, Woreda 03', type: 'text', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `SPECIAL POWER OF ATTORNEY FOR IMMOVABLE PROPERTY TRANSACTIONS`,
      `Granted by ${data.ownerName || '[Owner]'} to ${data.agentName || '[Agent]'}.`,
      `PROPERTY: Urban landholding designated under Title Deed No. ${data.parcelNumber || '[Title Deed No]'} situated in ${data.propertyLocation || '[Sub-City]'}.`,
      `POWERS: The Agent is specifically authorized to sign transfer documents, represent owner before Addis Ababa Land Administration Bureau, and execute registration before DARA.`
    ]
  },

  // 06. Memorandum of Understanding (MoU)
  {
    id: 'mou',
    title: 'Memorandum of Understanding',
    amharicTitle: 'የመግባቢያ ስምምነት (MoU)',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Framework agreement for joint commercial initiatives, pre-incorporation partnerships, or institutional alliances defining intent and cost contributions.',
    amharicDescription: 'በሁለት የንግድ ወይም የልማት ተቋማት መካከል የሚደረግ የጋራ ትብብር የመግባቢያ ሰነድ።',
    priceETB: 350,
    pageCount: '~3 pages',
    statute: 'Commercial Code Proclamation No. 1240/2021',
    steps: [
      { number: 1, title: 'Party A', amharicTitle: 'ወገን 1' },
      { number: 2, title: 'Party B', amharicTitle: 'ወገን 2' },
      { number: 3, title: 'Scope', amharicTitle: 'የትብብር መስክ' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'firstParty', label: 'First Institution / Entity Name', amharicLabel: 'የመጀመሪያው ተቋም ስም', placeholder: 'e.g. Entoto AgriTech Solutions PLC', type: 'text', step: 1, required: true },
      { id: 'secondParty', label: 'Second Institution / Entity Name', amharicLabel: 'ሁለተኛው ተቋም ስም', placeholder: 'e.g. Awash Agro Processing S.C.', type: 'text', step: 2, required: true },
      { id: 'projectScope', label: 'Joint Initiative Scope', amharicLabel: 'የትብብሩ ዋና ዓላማ', placeholder: 'e.g. Joint supply chain integration and cold-chain logistics deployment', type: 'textarea', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `MEMORANDUM OF UNDERSTANDING FOR STRATEGIC COOPERATION`,
      `Between ${data.firstParty || '[Party A]'} and ${data.secondParty || '[Party B]'}.`,
      `PURPOSE: The Parties enter into this MoU to establish the baseline parameters for ${data.projectScope || '[Project Scope]'}.`,
      `COMMITMENT: Each party agrees to allocate qualified personnel and share non-confidential technical assessments in mutual good faith.`
    ]
  },

  // 07. Motor Vehicle Sale Agreement
  {
    id: 'vehicle-sale',
    title: 'Motor Vehicle Sale Contract',
    amharicTitle: 'የተሽከርካሪ ሽያጭና ግዢ ውል',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Contract for the legal transfer of cars, trucks, or machinery. Includes chassis number, plate code, ownership booklet (ሊብሬ), and advance escrow payment terms.',
    amharicDescription: 'የመኪና ሽያጭ ህጋዊ ውል፤ የሻሲ ቁጥር፣ ሰሌዳ እና የሊብሬ መረጃዎችን ያካተተ።',
    priceETB: 400,
    pageCount: '~3 pages',
    statute: 'Civil Code of Ethiopia Art. 2266 et seq.',
    steps: [
      { number: 1, title: 'Seller', amharicTitle: 'ሻጭ' },
      { number: 2, title: 'Buyer', amharicTitle: 'ገዢ' },
      { number: 3, title: 'Vehicle', amharicTitle: 'የተሽከርካሪ ዝርዝር' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'sellerName', label: 'Seller Full Name', amharicLabel: 'የሻጭ ሙሉ ስም', placeholder: 'e.g. Henok Worku', type: 'text', step: 1, required: true },
      { id: 'buyerName', label: 'Buyer Full Name', amharicLabel: 'የገዢ ሙሉ ስም', placeholder: 'e.g. Mahlet Fikre', type: 'text', step: 2, required: true },
      { id: 'vehiclePlate', label: 'License Plate No. & Code', amharicLabel: 'የሰሌዳ ቁጥርና ኮድ', placeholder: 'e.g. Code 2 - B89211 AA', type: 'text', step: 3, required: true },
      { id: 'chassisNumber', label: 'Chassis / VIN Number', amharicLabel: 'የሻሲ ቁጥር', placeholder: 'e.g. JT124A0091244', type: 'text', step: 3, required: true },
      { id: 'salePrice', label: 'Agreed Sale Price (ETB)', amharicLabel: 'የተስማሙበት የመሸጫ ዋጋ (ብር)', placeholder: 'e.g. 2400000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `MOTOR VEHICLE CONTRACT OF SALE (የተሽከርካሪ ሽያጭና ግዢ ውል)`,
      `Executed between Seller: ${data.sellerName || '[Seller]'} and Buyer: ${data.buyerName || '[Buyer]'}.`,
      `VEHICLE PARTICULARS: Plate: ${data.vehiclePlate || '[Plate]'}, Chassis No: ${data.chassisNumber || '[Chassis]'}.`,
      `CONSIDERATION: Total purchase sum is ETB ${Number(data.salePrice || 0).toLocaleString()}. Ownership transfer shall be completed before the Federal Transport Authority upon receipt of cleared funds.`
    ]
  },

  // 08. Residential Tenancy Agreement
  {
    id: 'residential-lease',
    title: 'Residential Tenancy Agreement',
    amharicTitle: 'የመኖሪያ ቤት ኪራይ ውል',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    description: 'Standard lease contract for villas, apartments, and condominiums. Stipulates deposit custody, utility bill allocations, and statutory tenant notices.',
    amharicDescription: 'ለመኖሪያ ቪላዎችና ኮንዶሚኒየሞች የተዘጋጀ ህጋዊ የቤት ኪራይ ውል ሰነድ።',
    priceETB: 350,
    pageCount: '~3 pages',
    statute: 'Civil Code of Ethiopia Art. 2896 et seq.',
    steps: [
      { number: 1, title: 'Landlord', amharicTitle: 'አከራይ' },
      { number: 2, title: 'Tenant', amharicTitle: 'ተከራይ' },
      { number: 3, title: 'Tenancy', amharicTitle: 'የኪራይ ውሎች' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'landlordName', label: 'Landlord Full Name', amharicLabel: 'የአከራይ ሙሉ ስም', placeholder: 'e.g. Gete Mengistu', type: 'text', step: 1, required: true },
      { id: 'tenantName', label: 'Tenant Full Name', amharicLabel: 'የተከራይ ሙሉ ስም', placeholder: 'e.g. Fitsum Assefa', type: 'text', step: 2, required: true },
      { id: 'houseNumber', label: 'Residence Address / House No.', amharicLabel: 'የቤቱ ቁጥርና አድራሻ', placeholder: 'e.g. Yeka, Ayat Condominium Block 12, Apt 4', type: 'text', step: 3, required: true },
      { id: 'monthlyRent', label: 'Monthly Rent in ETB', amharicLabel: 'ወርሃዊ ኪራይ (ብር)', placeholder: 'e.g. 25000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `RESIDENTIAL TENANCY LEASE CONTRACT`,
      `Landlord: ${data.landlordName || '[Landlord]'} leases to Tenant: ${data.tenantName || '[Tenant]'}.`,
      `PREMISES: Residential apartment located at ${data.houseNumber || '[Address]'}.`,
      `RENT: ETB ${Number(data.monthlyRent || 0).toLocaleString()} payable in advance every 30 days.`
    ]
  },

  // 09. Loan & Promissory Note
  {
    id: 'loan-agreement',
    title: 'Loan & Promissory Agreement',
    amharicTitle: 'የብድርና የእዳ እውቅና ውል',
    category: 'Financial',
    amharicCategory: 'የፋይናንስ ሕግ',
    description: 'Enforceable debt acknowledgment between individuals or businesses. Outlines repayment schedules, default penalties, and legal guarantors.',
    amharicDescription: 'በግለሰቦች ወይም ድርጅቶች መካከል የሚደረግ የገንዘብ ብድር ማረጋገጫና የመክፈያ የጊዜ ሰሌዳ ውል።',
    priceETB: 350,
    pageCount: '~2 pages',
    statute: 'Civil Code of Ethiopia Art. 2471 et seq.',
    steps: [
      { number: 1, title: 'Lender', amharicTitle: 'አበዳሪ' },
      { number: 2, title: 'Borrower', amharicTitle: 'ተበዳሪ' },
      { number: 3, title: 'Debt Terms', amharicTitle: 'የብድር ውሎች' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'lenderName', label: 'Lender Full Name', amharicLabel: 'የአበዳሪ ሙሉ ስም', placeholder: 'e.g. Belayneh Kinfe', type: 'text', step: 1, required: true },
      { id: 'borrowerName', label: 'Borrower Full Name', amharicLabel: 'የተበዳሪ ሙሉ ስም', placeholder: 'e.g. Rahel Girma', type: 'text', step: 2, required: true },
      { id: 'principalAmount', label: 'Principal Loan Amount (ETB)', amharicLabel: 'የብድሩ መጠን (ብር)', placeholder: 'e.g. 500000', type: 'number', step: 3, required: true },
      { id: 'repaymentDate', label: 'Final Maturity / Repayment Date', amharicLabel: 'የመጨረሻ መክፈያ ቀን', placeholder: '', type: 'date', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `DEBT ACKNOWLEDGMENT AND PROMISSORY LOAN AGREEMENT`,
      `Borrower: ${data.borrowerName || '[Borrower]'} acknowledges unconditional indebtedness to Lender: ${data.lenderName || '[Lender]'}.`,
      `PRINCIPAL: ETB ${Number(data.principalAmount || 0).toLocaleString()} received in full value.`,
      `REPAYMENT: The Borrower commits to settle the principal sum in full on or before ${data.repaymentDate || '[Maturity Date]'}.`
    ]
  },

  // 10. Articles of Association for PLC
  {
    id: 'plc-articles',
    title: 'Articles of Association for PLC',
    amharicTitle: 'የኃ/የተ/የግ/ማህበር መተዳደሪያ ደንብ',
    category: 'Commercial',
    amharicCategory: 'የንግድ ኩባንያ',
    badge: 'Most Popular',
    description: 'Corporate charter for registering a Private Limited Company. Formatted for commercial registration under Commercial Code Article 495.',
    amharicDescription: 'በአዲሱ የንግድ ህግ መሰረት ኃ/የተ/የግ/ማህበር ለመመስረት የሚያስፈልግ የተሟላ የመተዳደሪያ ደንብ።',
    priceETB: 850,
    pageCount: '~6 pages',
    statute: 'Commercial Code Proclamation No. 1240/2021 Art. 495+',
    steps: [
      { number: 1, title: 'Company', amharicTitle: 'ኩባንያ' },
      { number: 2, title: 'Founders', amharicTitle: 'መሥራቾች' },
      { number: 3, title: 'Capital', amharicTitle: 'ካፒታል' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'companyName', label: 'Proposed PLC Name', amharicLabel: 'የኩባንያው ህጋዊ ስም', placeholder: 'e.g. Abyssinia Solar Technologies PLC', type: 'text', step: 1, required: true },
      { id: 'headOffice', label: 'Head Office Sub-City', amharicLabel: 'ዋናው መስሪያ ቤት', placeholder: 'e.g. Bole Sub-City, Addis Ababa', type: 'text', step: 1, required: true },
      { id: 'shareholdersCount', label: 'Number of Founding Shareholders', amharicLabel: 'የባለአክሲዮኖች ብዛት', placeholder: '', type: 'select', options: ['1 (Single-Member PLC)', '2 Shareholders', '3 Shareholders', '4+ Shareholders'], step: 2, required: true },
      { id: 'initialCapital', label: 'Registered Share Capital (ETB)', amharicLabel: 'የተመዘገበ ካፒታል (ብር)', placeholder: 'e.g. 500000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `ARTICLES OF ASSOCIATION OF ${data.companyName || '[COMPANY NAME]'} PRIVATE LIMITED COMPANY`,
      `Head Office: ${data.headOffice || '[Head Office]'}. Formed pursuant to Commercial Code Proclamation No. 1240/2021.`,
      `CAPITAL: The total subscribed capital is ETB ${Number(data.initialCapital || 0).toLocaleString()} divided into equal shares with liability strictly limited to capital contributions.`
    ]
  },

  // 11. Independent Consultancy Agreement
  {
    id: 'consultancy-agreement',
    title: 'Consultancy Service Agreement',
    amharicTitle: 'የአማካሪነት አገልግሎት ውል',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Bespoke retainer agreement for independent contractors, auditors, and technical experts. Clarifies deliverables, withholdings, and IP ownership.',
    amharicDescription: 'ለሙያ አማካሪዎችና ባለሙያዎች የተዘጋጀ የውል ስምምነት፤ የክፍያ ሁኔታዎችንና የአእምሯዊ ንብረት መብትን በግልጽ ያሳያል።',
    priceETB: 450,
    pageCount: '~4 pages',
    statute: 'Civil Code of Ethiopia Art. 2610 et seq.',
    steps: [
      { number: 1, title: 'Client', amharicTitle: 'አሰሪ ተቋም' },
      { number: 2, title: 'Consultant', amharicTitle: 'አማካሪ' },
      { number: 3, title: 'Deliverables', amharicTitle: 'የአገልግሎት ዝርዝር' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'clientName', label: 'Client Entity Full Name', amharicLabel: 'የአሰሪው ድርጅት ስም', placeholder: 'e.g. Horn of Africa Logistics S.C.', type: 'text', step: 1, required: true },
      { id: 'consultantName', label: 'Consultant / Firm Name', amharicLabel: 'የአማካሪው ስም', placeholder: 'e.g. Dawit Strategic Advisory', type: 'text', step: 2, required: true },
      { id: 'feeAmount', label: 'Total Retainer / Fee (ETB)', amharicLabel: 'ጠቅላላ የአገልግሎት ክፍያ (ብር)', placeholder: 'e.g. 180000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `PROFESSIONAL SERVICES CONSULTANCY AGREEMENT`,
      `Retaining Client: ${data.clientName || '[Client]'} engages Consultant: ${data.consultantName || '[Consultant]'}.`,
      `COMPENSATION: Total contract fee is ETB ${Number(data.feeAmount || 0).toLocaleString()} payable against validated milestone deliverables.`
    ]
  },

  // 12. Business Setup Compliance Checklist
  {
    id: 'business-checklist',
    title: 'Business Registration Checklist',
    amharicTitle: 'የንግድ ምዝገባና ተገዢነት ሰነድ',
    category: 'Compliance',
    amharicCategory: 'ህግ ተገዢነት',
    description: 'Step-by-step statutory filing checklist for registering a business in Ethiopia, covering trade name clearance, TIN issuance, and sector permits.',
    amharicDescription: 'በኢትዮጵያ ንግድ ለመመዝገብ የሚያስፈልጉ ህጋዊ መስፈርቶችና የቅደም ተከተል መመሪያ።',
    priceETB: 150,
    pageCount: '~1 page',
    statute: 'Ministry of Trade & Regional Integration Directives',
    steps: [
      { number: 1, title: 'Business', amharicTitle: 'ንግድ' },
      { number: 2, title: 'Structure', amharicTitle: 'ቅርጽ' },
      { number: 3, title: 'Clearance', amharicTitle: 'ማረጋገጫ' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'proposedTradeName', label: 'Proposed Trade Name', amharicLabel: 'የታሰበው የንግድ ስም', placeholder: 'e.g. Addis Cloud Services', type: 'text', step: 1, required: true },
      { id: 'sectorType', label: 'Sector of Activity', amharicLabel: 'የስራ መስክ', placeholder: '', type: 'select', options: ['Technology & Software', 'Import & Export', 'Manufacturing', 'Hospitality & Tourism'], step: 2, required: true }
    ],
    generateContractText: (data) => [
      `STATUTORY BUSINESS REGISTRATION & COMPLIANCE ROADMAP`,
      `Enterprise: ${data.proposedTradeName || '[Trade Name]'} in Sector: ${data.sectorType || '[Sector]'}.`,
      `MANDATORY FILINGS: Commercial name reservation, Ministry of Trade Articles notarization, Tax Identification (TIN) issuance, and environmental clearances.`
    ]
  }
];