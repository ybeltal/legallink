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
  // ========================================================
  // 01. COMMERCIAL LEASE AGREEMENT (Full Institutional Edition)
  // ========================================================
  {
    id: 'commercial-lease',
    title: 'Commercial Lease Agreement',
    amharicTitle: 'የንግድ ቤት ኪራይ ውል',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    badge: 'New',
    description: 'Comprehensive lease agreement for retail shops, offices, and warehouses. Includes municipal tax duties, utility allocations, sublet restrictions, escalation limits, and eviction notices.',
    amharicDescription: 'ለሱቆችና ለቢሮዎች የተዘጋጀ የተሟላ የኪራይ ውል፤ ዓመታዊ የኪራይ ጭማሪ ገደብ፣ የግብር ክፍያ፣ ጥገናና የስንብት ማስጠንቀቂያን ያካትታል።',
    priceETB: 600,
    pageCount: '~3 pages',
    statute: 'Civil Code of Ethiopia (Proc. 165/1960) Art. 2896 et seq.',
    steps: [
      { number: 1, title: 'Landlord', amharicTitle: 'አከራይ' },
      { number: 2, title: 'Tenant', amharicTitle: 'ተከራይ' },
      { number: 3, title: 'Premises', amharicTitle: 'የንብረት ዝርዝር' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'landlordName', label: 'Landlord Full Legal Name', amharicLabel: 'የአከራይ ሙሉ ስም', placeholder: 'e.g. W/ro Almaz Tadesse', type: 'text', step: 1, required: true },
      { id: 'landlordId', label: 'National ID / Passport / TIN', amharicLabel: 'የመታወቂያ ወይም የግብር ከፋይ ቁጥር', placeholder: 'e.g. ET-ID-8921029', type: 'text', step: 1, required: true },
      { id: 'landlordPhone', label: 'Landlord Phone Number', amharicLabel: 'የአከራይ ስልክ ቁጥር', placeholder: '+251 91 234 5678', type: 'text', step: 1, required: true },

      { id: 'tenantName', label: 'Tenant Entity / Full Name', amharicLabel: 'የተከራይ ድርጅት ወይም ግለሰብ ስም', placeholder: 'e.g. BlueNile Logistics PLC', type: 'text', step: 2, required: true },
      { id: 'tenantReg', label: 'Commercial Registration / TIN No.', amharicLabel: 'የንግድ ምዝገባ ወይም TIN ቁጥር', placeholder: 'e.g. ETH-PLC-44912', type: 'text', step: 2, required: true },
      { id: 'tenantBusiness', label: 'Intended Commercial Purpose', amharicLabel: 'የንግድ ስራው አይነት', placeholder: 'e.g. Corporate IT Consultancy & Management Office', type: 'text', step: 2, required: true },

      { id: 'premisesAddress', label: 'Premises Location (Sub-City, Building, Floor)', amharicLabel: 'የቤቱ አድራሻ (ክፍለ ከተማ፣ ህንፃ፣ ወለል)', placeholder: 'e.g. Bole Sub-City, Woreda 03, Medhanialem Tower 4th Floor', type: 'text', step: 3, required: true },
      { id: 'parcelNumber', label: 'Title Deed / Holding Certificate No. (ካርታ ቁጥር)', amharicLabel: 'የይዞታ ማረጋገጫ የካርታ ቁጥር', placeholder: 'e.g. BOL-8841-2019', type: 'text', step: 3, required: true },
      { id: 'monthlyRent', label: 'Monthly Rent in ETB', amharicLabel: 'ወርሃዊ የኪራይ መጠን (ብር)', placeholder: 'e.g. 50000', type: 'number', step: 3, required: true },
      { id: 'securityDeposit', label: 'Security Deposit (Months)', amharicLabel: 'የዋስትና ክፍያ (የወራት ብዛት)', placeholder: '', type: 'select', options: ['1 Month', '2 Months', '3 Months'], step: 3, required: true },
      { id: 'leaseDuration', label: 'Lease Duration', amharicLabel: 'የውሉ ቆይታ', placeholder: '', type: 'select', options: ['1 Year', '2 Years', '3 Years', '5 Years'], step: 3, required: true },
      { id: 'startDate', label: 'Lease Commencement Date', amharicLabel: 'ኪራዩ የሚጀምርበት ቀን', placeholder: '', type: 'date', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Commercial Lease Agreement is executed on this day between ${data.landlordName || '[Lessor Full Name]'} (ID/TIN: ${data.landlordId || '[ID/TIN]'}, Tel: ${data.landlordPhone || '[Tel]'}) (hereinafter designated as "Lessor"), and ${data.tenantName || '[Lessee Entity/Name]'} (Registration/TIN: ${data.tenantReg || '[Reg/TIN]'}) represented herein by its authorized signatory (hereinafter designated as "Lessee").`,
      
      `1. PREMISES IDENTIFICATION & PERMITTED USE: The Lessor agrees to lease to the Lessee the commercial premises situated at ${data.premisesAddress || '[Premises Address]'}, designated under Title Deed/Holding Certificate No. ${data.parcelNumber || '[Title Deed No]'}. The Lessee warrants that the premises shall be used strictly for the conduct of ${data.tenantBusiness || '[Commercial Purpose]'} and for no other unlawful or unauthorized enterprise.`,
      
      `2. TERM AND COMMENCEMENT: This Lease shall commence on ${data.startDate || '[Commencement Date]'} and shall remain in full legal effect for an agreed term of ${data.leaseDuration || '2 Years'}, subject to termination and renewal covenants provided herein.`,
      
      `3. RENTAL REMUNERATION & ESCROW DEPOSIT: The agreed monthly rental fee is ETB ${Number(data.monthlyRent || 0).toLocaleString()} (Ethiopian Birr). Rent shall be payable in advance on the first working day of each calendar month. The Lessee shall deposit with the Lessor a refundable security deposit equivalent to ${data.securityDeposit || '2 Months'} of rent to guarantee compliance with all covenants herein.`,
      
      `4. TAXES, UTILITIES AND WITHHOLDING OBLIGATIONS: The Lessee agrees to settle all consumption utility bills (including electricity/EEPCO, municipal water, internet, and internal premises cleaning). Value Added Tax (VAT) and rental income withholding taxes shall be administered and remitted in strict compliance with applicable Ethiopian Ministry of Revenues directives.`,
      
      `5. MAINTENANCE, ALTERATIONS AND STRUCTURAL INTEGRITY: The Lessor shall remain liable for all external and structural repairs. The Lessee shall maintain the interior premises in sound condition and shall not undertake structural modifications or partitioning without the prior written consent of the Lessor.`,
      
      `6. PROHIBITION OF SUBLETTING AND ASSIGNMENT: The Lessee is expressly prohibited from subletting, assigning, encumbering, or transferring occupancy of the leased premises, in whole or in part, to any third-party entity without the express written authorization of the Lessor.`,
      
      `7. DEFAULT, TERMINATION AND STATUTORY NOTICE: Failure to pay rent for more than thirty (30) days past the due date, or unauthorized modification of the premises, shall constitute a material breach entitling the Lessor to issue a formal written notice of sixty (60) days to cure or vacate pursuant to Article 2896 of the Ethiopian Civil Code.`,
      
      `8. GOVERNING LAW AND JUDICIAL DISPUTE RESOLUTION: This Agreement shall be interpreted and governed by the laws of the Federal Democratic Republic of Ethiopia. Any legal action or dispute arising out of this contract shall be submitted exclusively to the competent Federal First Instance or High Court of Addis Ababa.`
    ]
  },

  // ========================================================
  // 02. EMPLOYMENT CONTRACT (Full Institutional Edition)
  // ========================================================
  {
    id: 'employment-contract',
    title: 'Employment Contract',
    amharicTitle: 'የስራ ቅጥር ውል',
    category: 'Labour Law',
    amharicCategory: 'የሠራተኛ ሕግ',
    badge: 'Most Popular',
    description: 'Full-form contract compliant with Ethiopian Labour Proclamation No. 1156/2019. Covers probation, duties, compensation, working hours, and severance protections.',
    amharicDescription: 'በአዋጅ ቁጥር 1156/2019 መሰረት የተዘጋጀ ህጋዊ የስራ ቅጥር ውል፤ የሙከራ ጊዜ፣ ደመወዝ፣ የስራ ሰዓትና ፈቃድን ያካትታል።',
    priceETB: 450,
    pageCount: '~3 pages',
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
      { id: 'employerName', label: 'Company / Employer Legal Name', amharicLabel: 'የድርጅቱ ህጋዊ ስም', placeholder: 'e.g. Abyssinia Trading PLC', type: 'text', step: 1, required: true },
      { id: 'registrationNumber', label: 'Commercial Registration No.', amharicLabel: 'የንግድ ምዝገባ ቁጥር', placeholder: 'e.g. ETH-PLC-00123', type: 'text', step: 1, required: true },
      { id: 'city', label: 'City / Sub-City', amharicLabel: 'ከተማ / ክፍለ ከተማ', placeholder: 'e.g. Addis Ababa, Bole', type: 'text', step: 1, required: true },
      { id: 'representativeName', label: 'Authorized Representative', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'e.g. Ato Kebede Alemu', type: 'text', step: 1, required: true },
      { id: 'representativeTitle', label: 'Representative Title', amharicLabel: 'የተወካዩ የሥራ ድርሻ', placeholder: 'e.g. Chief Executive Officer', type: 'text', step: 1, required: true },

      { id: 'employeeName', label: 'Employee Full Legal Name', amharicLabel: 'የሠራተኛው ሙሉ ስም', placeholder: 'e.g. Sara Haile Mariam', type: 'text', step: 2, required: true },
      { id: 'employeeId', label: 'National ID / Passport Number', amharicLabel: 'ብሔራዊ መታወቂያ / ፓስፖርት ቁጥር', placeholder: 'e.g. ET-ID-9821334', type: 'text', step: 2, required: true },
      { id: 'employeeAddress', label: 'Residential Address', amharicLabel: 'የመኖሪያ አድራሻ', placeholder: 'e.g. Yeka Sub-City, Woreda 04', type: 'text', step: 2, required: true },

      { id: 'jobTitle', label: 'Position / Job Title', amharicLabel: 'የሥራ መደብ', placeholder: 'e.g. Senior Software Engineer', type: 'text', step: 3, required: true },
      { id: 'grossSalary', label: 'Monthly Gross Salary (ETB)', amharicLabel: 'ወርሃዊ ጥቅል ደመወዝ (ብር)', placeholder: 'e.g. 45000', type: 'number', step: 3, required: true },
      { id: 'probationPeriod', label: 'Probation Period', amharicLabel: 'የሙከራ ጊዜ', placeholder: '', type: 'select', options: ['No Probation', '30 Days', '60 Days (Statutory Maximum)'], step: 3, required: true },
      { id: 'startDate', label: 'Employment Start Date', amharicLabel: 'ሥራ የሚጀምርበት ቀን', placeholder: '', type: 'date', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Employment Contract is made and entered into between ${data.employerName || '[Employer Name]'} (Commercial Reg. No: ${data.registrationNumber || '[Reg No]'}, Head Office: ${data.city || '[City]'}), represented herein by ${data.representativeName || '[Representative Name]'}, ${data.representativeTitle || '[Title]'} (hereinafter designated as "Employer"), and ${data.employeeName || '[Employee Name]'} (National ID No: ${data.employeeId || '[ID No]'}, Resident of: ${data.employeeAddress || '[Address]'}) (hereinafter designated as "Employee").`,

      `1. POSITION AND APPOINTMENT: The Employer agrees to employ the Employee in the professional capacity of ${data.jobTitle || '[Job Title]'}. The Employee agrees to perform all lawful and reasonable directives consistent with this role with utmost professional diligence.`,

      `2. PROBATIONARY PERIOD: In accordance with Article 11 of Labour Proclamation No. 1156/2019, the Employee shall be subject to a probationary duration of ${data.probationPeriod || '60 Days'}. During this period, either party may terminate this agreement without notice and without severance payment.`,

      `3. REMUNERATION AND TAXATION: The Employer shall pay the Employee a monthly gross salary of ETB ${Number(data.grossSalary || 0).toLocaleString()} (Ethiopian Birr). The Employer shall deduct and remit statutory Employment Personal Income Tax and 7% Pension contributions pursuant to federal proclamation requirements.`,

      `4. WORKING HOURS AND REST PERIODS: Normal working hours shall not exceed eight (8) hours per day or forty-eight (48) hours per week as mandated by Article 61 of the Labour Proclamation. The Employee is entitled to weekly rest of twenty-four consecutive hours.`,

      `5. STATUTORY ANNUAL AND SICK LEAVE: The Employee shall be entitled to an uninterrupted paid annual leave of sixteen (16) working days for the first complete year of continuous service, with one additional day for every two years of additional service. Paid sick leave shall be granted upon production of a valid medical certificate.`,

      `6. TERMINATION OF CONTRACT AND SEVERANCE: Any termination of this contract by the Employer shall strictly conform to the lawful grounds enumerated in Articles 27 through 30 of Labour Proclamation 1156/2019. Unlawful dismissal shall entitle the Employee to statutory reinstatement or severance compensation.`,

      `7. GOVERNING LAW AND LABOUR TRIBUNAL JURISDICTION: This contract is construed in according with Ethiopian Labour Law. Unresolved disputes shall be submitted to the competent Labour Relations Board or the Federal First Instance Court Labour Division.`
    ]
  },

  // ========================================================
  // 03. NON-DISCLOSURE AGREEMENT (NDA)
  // ========================================================
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    amharicTitle: 'የሚስጥር ጥበቃ ስምምነት (NDA)',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Mutual or one-way NDA for protecting trade secrets, client databases, proprietary software code, and financial disclosures under Ethiopian Commercial Law.',
    amharicDescription: 'የንግድ ሚስጥሮችን፣ የደንበኞች መረጃዎችንና የቴክኖሎጂ ውጤቶችን ከአላስፈላጊ ይፋ መሆን የሚከላከል ህጋዊ ስምምነት።',
    priceETB: 300,
    pageCount: '~2 pages',
    statute: 'Commercial Code of Ethiopia (Proc. 1240/2021)',
    steps: [
      { number: 1, title: 'Discloser', amharicTitle: 'መረጃ አጋሪ' },
      { number: 2, title: 'Recipient', amharicTitle: 'መረጃ ተቀባይ' },
      { number: 3, title: 'Terms', amharicTitle: 'የውል ቃላት' },
      { number: 4, title: 'Preview', amharicTitle: 'ቅድመ እይታ' },
      { number: 5, title: 'Signature', amharicTitle: 'ፊርማ' },
      { number: 6, title: 'Submit', amharicTitle: 'ማጠናቀቅ' }
    ],
    fields: [
      { id: 'discloserName', label: 'Disclosing Party Legal Name', amharicLabel: 'ሚስጥራዊ መረጃውን የሚሰጠው ወገን', placeholder: 'e.g. EthioFintech Solutions S.C.', type: 'text', step: 1, required: true },
      { id: 'recipientName', label: 'Receiving Party Legal Name', amharicLabel: 'መረጃውን የሚቀበለው ወገን', placeholder: 'e.g. Meron Desta', type: 'text', step: 2, required: true },
      { id: 'ndaType', label: 'Agreement Type', amharicLabel: 'የስምምነቱ አይነት', placeholder: '', type: 'select', options: ['Unilateral (One-Way)', 'Mutual (Bilateral)'], step: 3, required: true },
      { id: 'confidentialityTerm', label: 'Confidentiality Period', amharicLabel: 'የሚስጥር ጥበቃ ቆይታ', placeholder: '', type: 'select', options: ['2 Years', '3 Years', '5 Years', 'Perpetual (Trade Secrets)'], step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Confidentiality and Non-Disclosure Agreement is executed between ${data.discloserName || '[Disclosing Party]'} and ${data.recipientName || '[Receiving Party]'}.`,
      `1. CONFIDENTIAL INFORMATION DEFINED: Encompasses all technical designs, source code, algorithmic formulations, customer identities, pricing schedules, and proprietary business materials disclosed in connection with potential collaboration.`,
      `2. DUTY OF STRICT CONFIDENTIALITY: The Receiving Party agrees to preserve all Confidential Information with the same degree of care it exercises with its own high-value trade secrets, and not to disclose such materials to any third party for a period of ${data.confidentialityTerm || '3 Years'}.`,
      `3. INJUNCTIVE RELIEF AND DAMAGES: The Parties acknowledge that unauthorized disclosure causes irreparable commercial harm entitling the aggrieved party to immediate injunctive relief and provable commercial damages under Ethiopian Commercial Code Proclamation 1240/2021.`
    ]
  },

  // ========================================================
  // 04. GENERAL POWER OF ATTORNEY
  // ========================================================
  {
    id: 'general-poa',
    title: 'General Power of Attorney',
    amharicTitle: 'ጠቅላላ የውክልና ስልጣን',
    category: 'Diaspora',
    amharicCategory: 'የዲያስፖራና ውክልና',
    description: 'Empowers an appointed agent to manage banking, tax filings, legal representation, and property management in Ethiopia before DARA and public authorities.',
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
      { id: 'principalName', label: 'Principal Full Legal Name (ወካይ)', amharicLabel: 'የወካይ ሙሉ ስም', placeholder: 'e.g. Solomon Berhanu', type: 'text', step: 1, required: true },
      { id: 'principalPassport', label: 'Passport / Origin ID (Yellow Card) No.', amharicLabel: 'ፓስፖርት / ቢጫ ካርድ ቁጥር', placeholder: 'e.g. EP-098231', type: 'text', step: 1, required: true },
      { id: 'agentName', label: 'Appointed Agent Full Legal Name (ተወካይ)', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'e.g. Yonas Solomon', type: 'text', step: 2, required: true },
      { id: 'agentId', label: 'Agent Ethiopian National ID No.', amharicLabel: 'የተወካይ የኢትዮጵያ መታወቂያ ቁጥር', placeholder: 'e.g. ET-ID-44912', type: 'text', step: 2, required: true },
      { id: 'powerScope', label: 'Scope of Powers Granted', amharicLabel: 'የስልጣን ወሰን', placeholder: '', type: 'select', options: ['Full Banking, Municipal & Litigation Powers', 'Administrative & Court Representation Only', 'Tax Clearance & Document Authentication Only'], step: 3, required: true }
    ],
    generateContractText: (data) => [
      `I, the undersigned Principal ${data.principalName || '[Principal Full Name]'} (Passport/Origin ID No: ${data.principalPassport || '[Passport No]'}), do hereby make, constitute, and appoint ${data.agentName || '[Agent Full Name]'} (Ethiopian National ID No: ${data.agentId || '[Agent ID]'}) to be my lawful Attorney-in-Fact in the Federal Democratic Republic of Ethiopia.`,
      `1. SCOPE OF ADMINISTRATIVE & JUDICIAL AUTHORITY: My Attorney-in-Fact is granted ${data.powerScope || 'Full Powers'} to appear on my behalf before all Federal and Regional Courts, Document Authentication and Registration Agency (DARA), Ministry of Revenues, Ethiopian Immigrations, and public utility bodies.`,
      `2. RATIFICATION AND INDEMNITY: I hereby ratify and confirm all lawful acts, deeds, and instruments that my Attorney-in-Fact shall lawfully perform by virtue of this Power of Attorney pursuant to Article 2199 of the Civil Code of Ethiopia.`
    ]
  },

  // ========================================================
  // 05. MOTOR VEHICLE SALE AGREEMENT
  // ========================================================
  {
    id: 'vehicle-sale',
    title: 'Motor Vehicle Sale Contract',
    amharicTitle: 'የተሽከርካሪ ሽያጭና ግዢ ውል',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Contract for the legal sale and transfer of vehicles. Incorporates chassis numbers, engine codes, plate specifications, libre verification, and escrow transfer milestones.',
    amharicDescription: 'የመኪና ሽያጭ ህጋዊ ውል፤ የሻሲ ቁጥር፣ ሰሌዳ እና የሊብሬ መረጃዎችን ያካተተ።',
    priceETB: 400,
    pageCount: '~2 pages',
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
      { id: 'sellerName', label: 'Seller Full Legal Name', amharicLabel: 'የሻጭ ሙሉ ስም', placeholder: 'e.g. Henok Worku', type: 'text', step: 1, required: true },
      { id: 'buyerName', label: 'Buyer Full Legal Name', amharicLabel: 'የገዢ ሙሉ ስም', placeholder: 'e.g. Mahlet Fikre', type: 'text', step: 2, required: true },
      { id: 'vehiclePlate', label: 'Plate Number & Code', amharicLabel: 'የሰሌዳ ቁጥርና ኮድ', placeholder: 'e.g. Code 2 - B89211 AA', type: 'text', step: 3, required: true },
      { id: 'chassisNumber', label: 'Chassis / VIN Number', amharicLabel: 'የሻሲ ቁጥር', placeholder: 'e.g. JT124A0091244', type: 'text', step: 3, required: true },
      { id: 'salePrice', label: 'Total Purchase Price (ETB)', amharicLabel: 'የተስማሙበት የመሸጫ ዋጋ (ብር)', placeholder: 'e.g. 2400000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Motor Vehicle Contract of Sale is executed between Seller: ${data.sellerName || '[Seller]'} and Buyer: ${data.buyerName || '[Buyer]'}.`,
      `1. SUBJECT VEHICLE: Plate No: ${data.vehiclePlate || '[Plate]'}, Chassis No: ${data.chassisNumber || '[Chassis No]'}. The Seller warrants clean title free from prior bank liens, court attachments, or customs encumbrances.`,
      `2. CONSIDERATION & SETTLEMENT: The agreed purchase price is ETB ${Number(data.salePrice || 0).toLocaleString()} (Ethiopian Birr). Handover of vehicle, keys, and ownership certificate (ሊብሬ) shall occur simultaneously before the Federal Transport Authority.`
    ]
  },

  // ========================================================
  // 06. RESIDENTIAL TENANCY AGREEMENT
  // ========================================================
  {
    id: 'residential-lease',
    title: 'Residential Tenancy Agreement',
    amharicTitle: 'የመኖሪያ ቤት ኪራይ ውል',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    description: 'Standard lease contract for condominiums and villas. Formats monthly rentals, security deposit custody, utility bill divides, and statutory vacancy notices.',
    amharicDescription: 'ለመኖሪያ ቪላዎችና ኮንዶሚኒየሞች የተዘጋጀ ህጋዊ የቤት ኪራይ ውል ሰነድ።',
    priceETB: 350,
    pageCount: '~2 pages',
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
      { id: 'landlordName', label: 'Landlord Full Legal Name', amharicLabel: 'የአከራይ ሙሉ ስም', placeholder: 'e.g. Gete Mengistu', type: 'text', step: 1, required: true },
      { id: 'tenantName', label: 'Tenant Full Legal Name', amharicLabel: 'የተከራይ ሙሉ ስም', placeholder: 'e.g. Fitsum Assefa', type: 'text', step: 2, required: true },
      { id: 'houseNumber', label: 'Residential Address / Block / Apt', amharicLabel: 'የቤቱ ቁጥርና አድራሻ', placeholder: 'e.g. Yeka Sub-City, Ayat Condominium Block 12, Unit 04', type: 'text', step: 3, required: true },
      { id: 'monthlyRent', label: 'Monthly Rent (ETB)', amharicLabel: 'ወርሃዊ ኪራይ (ብር)', placeholder: 'e.g. 25000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Residential Tenancy Agreement is entered into by Landlord: ${data.landlordName || '[Landlord]'} and Tenant: ${data.tenantName || '[Tenant]'}.`,
      `1. PREMISES: Residential apartment located at ${data.houseNumber || '[Address]'}. The premises shall be used exclusively for residential occupancy.`,
      `2. RENT: Monthly rental remuneration is ETB ${Number(data.monthlyRent || 0).toLocaleString()} payable in advance every thirty (30) days.`
    ]
  },

  // ========================================================
  // 07. PROMISSORY NOTE & LOAN AGREEMENT
  // ========================================================
  {
    id: 'loan-agreement',
    title: 'Loan & Promissory Agreement',
    amharicTitle: 'የብድርና የእዳ እውቅና ውል',
    category: 'Financial',
    amharicCategory: 'የፋይናንስ ሕግ',
    description: 'Enforceable debt acknowledgment between individuals or commercial businesses. Specifies repayment schedules, default penalties, and legal guarantors.',
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
      { id: 'lenderName', label: 'Lender Full Legal Name', amharicLabel: 'የአበዳሪ ሙሉ ስም', placeholder: 'e.g. Belayneh Kinfe', type: 'text', step: 1, required: true },
      { id: 'borrowerName', label: 'Borrower Full Legal Name', amharicLabel: 'የተበዳሪ ሙሉ ስም', placeholder: 'e.g. Rahel Girma', type: 'text', step: 2, required: true },
      { id: 'principalAmount', label: 'Principal Loan Amount (ETB)', amharicLabel: 'የብድሩ መጠን (ብር)', placeholder: 'e.g. 500000', type: 'number', step: 3, required: true },
      { id: 'repaymentDate', label: 'Final Maturity Date', amharicLabel: 'የመጨረሻ መክፈያ ቀን', placeholder: '', type: 'date', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Debt Acknowledgment and Promissory Agreement is executed between Lender: ${data.lenderName || '[Lender]'} and Borrower: ${data.borrowerName || '[Borrower]'}.`,
      `1. PRINCIPAL INDEBTEDNESS: The Borrower unconditionally acknowledges receipt of ETB ${Number(data.principalAmount || 0).toLocaleString()} (Ethiopian Birr).`,
      `2. REPAYMENT COVENANT: The Borrower unconditionally commits to repay the principal indebtedness in full on or before ${data.repaymentDate || '[Maturity Date]'}.`
    ]
  },

  // ========================================================
  // 08. ARTICLES OF ASSOCIATION FOR PLC
  // ========================================================
  {
    id: 'plc-articles',
    title: 'Articles of Association for PLC',
    amharicTitle: 'የኃ/የተ/የግ/ማህበር መተዳደሪያ ደንብ',
    category: 'Commercial',
    amharicCategory: 'የንግድ ኩባንያ',
    badge: 'Most Popular',
    description: 'Corporate charter for incorporating a Private Limited Company (PLC) or Single-Member PLC under Commercial Code Art. 495+.',
    amharicDescription: 'በአዲሱ የንግድ ህግ መሰረት ኃ/የተ/የግ/ማህበር ለመመስረት የሚያስፈልግ የተሟላ የመተዳደሪያ ደንብ።',
    priceETB: 850,
    pageCount: '~3 pages',
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
      { id: 'companyName', label: 'Proposed Company Name', amharicLabel: 'የኩባንያው ህጋዊ ስም', placeholder: 'e.g. Abyssinia Solar Technologies PLC', type: 'text', step: 1, required: true },
      { id: 'headOffice', label: 'Head Office Location', amharicLabel: 'ዋናው መስሪያ ቤት', placeholder: 'e.g. Bole Sub-City, Addis Ababa', type: 'text', step: 1, required: true },
      { id: 'initialCapital', label: 'Registered Share Capital (ETB)', amharicLabel: 'የተመዘገበ ካፒታል (ብር)', placeholder: 'e.g. 500000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `ARTICLES OF ASSOCIATION OF ${data.companyName || '[COMPANY NAME]'} PRIVATE LIMITED COMPANY.`,
      `1. HEAD OFFICE: Established in ${data.headOffice || '[Head Office]'} under Commercial Code Proclamation No. 1240/2021.`,
      `2. SHARE CAPITAL: Subscribed capital is ETB ${Number(data.initialCapital || 0).toLocaleString()} divided into fully paid registered shares.`
    ]
  },

  // ========================================================
  // 09. INDEPENDENT CONSULTANCY AGREEMENT
  // ========================================================
  {
    id: 'consultancy-agreement',
    title: 'Consultancy Service Agreement',
    amharicTitle: 'የአማካሪነት አገልግሎት ውል',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Professional retainer for advisors, technical consultants, and independent specialists. Specifies deliverable milestones and IP ownership.',
    amharicDescription: 'ለሙያ አማካሪዎችና ባለሙያዎች የተዘጋጀ የውል ስምምነት፤ የክፍያ ሁኔታዎችንና የአእምሯዊ ንብረት መብትን ያካትታል።',
    priceETB: 450,
    pageCount: '~2 pages',
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
      { id: 'clientName', label: 'Client Entity Legal Name', amharicLabel: 'የአሰሪው ድርጅት ስም', placeholder: 'e.g. Horn of Africa Logistics S.C.', type: 'text', step: 1, required: true },
      { id: 'consultantName', label: 'Consultant Full Legal Name', amharicLabel: 'የአማካሪው ስም', placeholder: 'e.g. Dawit Strategic Advisory', type: 'text', step: 2, required: true },
      { id: 'feeAmount', label: 'Contract Fee (ETB)', amharicLabel: 'ጠቅላላ የአገልግሎት ክፍያ (ብር)', placeholder: 'e.g. 180000', type: 'number', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `This Professional Services Agreement is concluded between Client: ${data.clientName || '[Client]'} and Consultant: ${data.consultantName || '[Consultant]'}.`,
      `1. REMUNERATION: Total professional fee is ETB ${Number(data.feeAmount || 0).toLocaleString()} payable against validated deliverables.`,
      `2. INTELLECTUAL PROPERTY: All reports, models, and code delivered shall become the exclusive property of the Client.`
    ]
  },

  // ========================================================
  // 10. MEMORANDUM OF UNDERSTANDING (MOU)
  // ========================================================
  {
    id: 'mou',
    title: 'Memorandum of Understanding',
    amharicTitle: 'የመግባቢያ ስምምነት (MoU)',
    category: 'Commercial',
    amharicCategory: 'የንግድ ስምምነት',
    description: 'Framework agreement for institutional alliances, pre-incorporation partnerships, and joint cross-sector pilot programs.',
    amharicDescription: 'በሁለት የንግድ ወይም የልማት ተቋማት መካከል የሚደረግ የጋራ ትብብር የመግባቢያ ሰነድ።',
    priceETB: 350,
    pageCount: '~2 pages',
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
      { id: 'firstParty', label: 'First Institution Name', amharicLabel: 'የመጀመሪያው ተቋም ስም', placeholder: 'e.g. Entoto AgriTech PLC', type: 'text', step: 1, required: true },
      { id: 'secondParty', label: 'Second Institution Name', amharicLabel: 'ሁለተኛው ተቋም ስም', placeholder: 'e.g. Awash Agro Processing S.C.', type: 'text', step: 2, required: true },
      { id: 'projectScope', label: 'Joint Initiative Scope', amharicLabel: 'የትብብሩ ዋና ዓላማ', placeholder: 'e.g. Cold-chain supply network integration', type: 'textarea', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `Memorandum of Understanding concluded between ${data.firstParty || '[Party A]'} and ${data.secondParty || '[Party B]'}.`,
      `1. COLLABORATIVE PURPOSE: To establish joint operations for ${data.projectScope || '[Project Scope]'}.`,
      `2. GOOD FAITH COOPERATION: The parties agree to share technical resources in mutual good faith.`
    ]
  },

  // ========================================================
  // 11. SPECIAL REAL ESTATE POWER OF ATTORNEY
  // ========================================================
  {
    id: 'special-property-poa',
    title: 'Special Land & Property PoA',
    amharicTitle: 'የመሬትና ይዞታ ልዩ ውክልና',
    category: 'Property Law',
    amharicCategory: 'የመሬትና ይዞታ ሕግ',
    badge: 'New',
    description: 'Specific mandate enabling an agent to execute land lease renewals, title deed (ካርታ) replacements, and property conveyances before DARA.',
    amharicDescription: 'የመሬት ካርታ ለማደስ፣ ለማስተላለፍ ወይም ለማረጋገጥ የሚሰጥ ልዩ ህጋዊ የውክልና ስልጣን።',
    priceETB: 650,
    pageCount: '~2 pages',
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
      { id: 'parcelNumber', label: 'Municipal Title Deed (ካርታ) No.', amharicLabel: 'የካርታ ቁጥር', placeholder: 'e.g. BOL-7819-2016', type: 'text', step: 3, required: true }
    ],
    generateContractText: (data) => [
      `Special Power of Attorney granted by Owner: ${data.ownerName || '[Owner]'} to Agent: ${data.agentName || '[Agent]'}.`,
      `1. PARCEL: Immovable property designated under Title Deed No. ${data.parcelNumber || '[Parcel]'}.`,
      `2. AUTHORIZATION: The Agent is specifically authorized to sign transfer documents before DARA.`
    ]
  },

  // ========================================================
  // 12. BUSINESS REGISTRATION CHECKLIST
  // ========================================================
  {
    id: 'business-checklist',
    title: 'Business Registration Checklist',
    amharicTitle: 'የንግድ ምዝገባና ተገዢነት ሰነድ',
    category: 'Compliance',
    amharicCategory: 'ህግ ተገዢነት',
    description: 'Statutory compliance document for registering a business, clearing trade names, securing TIN registrations, and acquiring municipal sector licenses.',
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
      `STATUTORY BUSINESS REGISTRATION ROADMAP FOR: ${data.proposedTradeName || '[Trade Name]'}.`,
      `1. SECTOR CLASSIFICATION: Registered under ${data.sectorType || '[Sector]'}.`,
      `2. STATUTORY CLEARANCES: Commercial name reservation, Ministry of Trade Articles notarization, TIN issuance, and municipal business licensing.`
    ]
  }
];