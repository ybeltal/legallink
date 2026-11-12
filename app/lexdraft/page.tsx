'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export interface TemplateField {
  id: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'date' | 'select';
  options?: string[];
  defaultValue?: string;
}

export interface LegalTemplate {
  id: string;
  aliases?: string[];
  title: string;
  amharicTitle: string;
  category:
    | 'Agency & Power of Attorney'
    | 'Appeal'
    | 'Application'
    | 'Business Forms';
  sourceFile: string;
  legalBasis: string;
  description: string;
  fields: TemplateField[];
  generateDocument: (values: Record<string, string>) => string;
}

export const ETHIOPIAN_LEGAL_TEMPLATES: LegalTemplate[] = [
  // 1. AGENCY & POWER OF ATTORNEY
  {
    id: 'agency-attorney',
    aliases: ['power-of-attorney', 'poa', 'advocate-agency', 'agency'],
    title: 'Power of Attorney for Legal Representation (Advocate Agency)',
    amharicTitle: 'የጠበቃ ውክልና ማስረጃ (Power of Attorney)',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/agency( attorney).doc',
    legalBasis: 'Ethiopian Civil Code Art. 2199–2233 & Proclamation No. 1249/2021',
    description:
      'Authorizes a licensed Federal or Regional Advocate to represent a client before regular courts, cassation benches, and administrative tribunals.',
    fields: [
      { id: 'principalName', label: 'Principal (Client) Full Name', placeholder: 'e.g., Ato Abebe Kebede Tesfaye' },
      { id: 'principalAddress', label: 'Principal Address (City, Sub-City, Woreda, House No.)', placeholder: 'e.g., Addis Ababa, Bole Sub-City, Woreda 03, H.No. 412' },
      { id: 'advocateName', label: 'Appointed Advocate Full Name', placeholder: 'e.g., Advocate Solomon Tadesse' },
      { id: 'licenseNo', label: 'Ministry of Justice Advocate License No.', placeholder: 'e.g., MOJ/FED/1842/2021' },
      { id: 'advocateAddress', label: 'Advocate Chamber Address & Phone', placeholder: 'e.g., Lideta Sub-City, Woreda 08, Tel: +251911...' },
      { id: 'scopeOfMatter', label: 'Specific Case / Legal Matter Authorized', type: 'textarea', placeholder: 'e.g., To institute, defend, appeal, and execute judgment regarding commercial contract dispute against XYZ PLC...' },
      { id: 'date', label: 'Date of Execution', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
DOCUMENTS AUTHENTICATION AND REGISTRATION SERVICE (DARS)
POWER OF ATTORNEY FOR ADVOCATE REPRESENTATION
(Pursuant to Civil Code Art. 2199 & Proclamation No. 1249/2021)

Date: ${v.date || '__________________'}

1. PRINCIPAL (CLIENT):
Full Name: ${v.principalName || '____________________________________'}
Address: ${v.principalAddress || '____________________________________'}

2. APPOINTED ADVOCATE (REPRESENTATIVE):
Full Name: ${v.advocateName || '____________________________________'}
MOJ Federal License No.: ${v.licenseNo || '________________________'}
Chamber Address: ${v.advocateAddress || '____________________________________'}

3. SCOPE OF MANDATE:
I, the undersigned Principal, hereby appoint the above-named Licensed Advocate to act as my lawful legal representative in the following matter:
${v.scopeOfMatter || 'To represent me before any Federal or Regional First Instance, High, or Supreme Court, including the Cassation Division, in all civil, commercial, and execution proceedings.'}

4. SPECIFIC POWERS GRANTED:
Pursuant to Articles 2204 and 2205 of the Civil Code of Ethiopia:
a) To prepare, sign, verify, and file statements of claim, defense, counter-claims, appeals, cassation petitions, and court applications;
b) To appear before any court or tribunal, present oral and documentary evidence, and examine witnesses;
c) To apply for attachment of property, temporary injunctions, stay of execution, or execution of decrees;
d) To receive court summons, orders, judgments, and decrees on my behalf.

Principal Signature: _______________________
Advocate Acceptance Signature: _______________________

WITNESSES:
1. ___________________________   Signature: _____________
2. ___________________________   Signature: _____________`,
  },
  {
    id: 'agency-administration',
    aliases: ['property-agency', 'administration-agency', 'general-agency'],
    title: 'General Agency for Property & Business Administration',
    amharicTitle: 'የንብረት እና የሥራ አስተዳደር ውክልና',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/Agency( for administration).docx',
    legalBasis: 'Ethiopian Civil Code Art. 2203–2204 (Acts of Management)',
    description:
      'Grants authority to an agent to manage immovable property, sign leases, collect rent, pay taxes, and handle municipal and utility matters.',
    fields: [
      { id: 'principalName', label: 'Principal (Property Owner) Full Name', placeholder: 'e.g., W/ro Almaz Bekele' },
      { id: 'principalAddress', label: 'Principal Address', placeholder: 'e.g., Addis Ababa, Kirkos Sub-City, Woreda 02' },
      { id: 'agentName', label: 'Agent (Representative) Full Name', placeholder: 'e.g., Ato Dawit Kebede' },
      { id: 'agentAddress', label: 'Agent Address & ID Number', placeholder: 'e.g., Addis Ababa, Yeka Sub-City, Woreda 05, ID: AA-05-9921' },
      { id: 'propertyDetails', label: 'Property / Business Under Administration (Title Deed / Plot No.)', type: 'textarea', placeholder: 'e.g., Building located in Bole Sub-City, Woreda 04, Title Deed No. BL/10294/2018...' },
      { id: 'date', label: 'Date of Execution', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `INSTRUMENT OF AGENCY FOR PROPERTY & BUSINESS ADMINISTRATION
(Executed Pursuant to Articles 2199 & 2204 of the Ethiopian Civil Code)

Date: ${v.date || '__________________'}

1. THE PRINCIPAL:
Full Name: ${v.principalName || '____________________________________'}
Address: ${v.principalAddress || '____________________________________'}

2. THE AGENT (ADMINISTRATOR):
Full Name: ${v.agentName || '____________________________________'}
Address & ID: ${v.agentAddress || '____________________________________'}

3. PROPERTY / ASSET SUBJECT TO ADMINISTRATION:
${v.propertyDetails || '________________________________________________________________________'}

4. POWERS OF ADMINISTRATION CONFERRED:
a) To lease or rent the property described above, sign lease agreements not exceeding three (3) years pursuant to Art. 2204 of the Civil Code, and collect rental payments;
b) To represent the Principal before the Ministry of Revenues, Land Administration, Water & Sewerage Authority, Ethio Telecom, and Ethiopian Electric Utility;
c) To pay taxes and utility fees and obtain official tax clearance certificates;
d) To preserve, maintain, and repair the property and take legal action necessary for its protection.

Principal Signature: _______________________
Agent Signature: ___________________________

WITNESSES:
1. ___________________________   Signature: _____________
2. ___________________________   Signature: _____________`,
  },

  // 2. APPEAL FORMS
  {
    id: 'petition-leave-to-appeal',
    aliases: ['leave-to-appeal'],
    title: 'Petition for Leave to Appeal',
    amharicTitle: 'ይግባኝ ለማቅረብ ፈቃድ መጠየቂያ አቤቱታ',
    category: 'Appeal',
    sourceFile: 'Appeal/0987b-petition-for-leave-to-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 325–326',
    description:
      'Formal petition requesting leave to file an appeal out of time or where special leave of the appellate court is procedurally required.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', placeholder: 'e.g., Federal High Court, Civil Appellate Bench — Addis Ababa' },
      { id: 'applicantName', label: 'Applicant (Intended Appellant) Name & Address', placeholder: 'e.g., Ato Girma Tadesse, Bole Sub-City, Woreda 06' },
      { id: 'respondentName', label: 'Respondent Name & Address', placeholder: 'e.g., Horizon Trading PLC, Kirkos Sub-City, Woreda 01' },
      { id: 'lowerCourtFile', label: 'Lower Court Name, File No. & Judgment Date', placeholder: 'e.g., Federal First Instance Court File No. 142890, Judgment dated Oct 02, 2026' },
      { id: 'groundsForLeave', label: 'Grounds / Good Cause for Requesting Leave to Appeal', type: 'textarea', placeholder: 'e.g., Certified copy of judgment was delayed by the court registry until..., preventing filing within the 60-day statutory period...' },
      { id: 'date', label: 'Filing Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.appellateCourt?.toUpperCase() || 'FEDERAL HIGH COURT OF ETHIOPIA'}
ADDIS ABABA

File No.: ____________________
Date: ${v.date || '__________________'}

Applicant (Petitioner): ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

PETITION FOR LEAVE TO APPEAL
(Pursuant to Articles 325 & 326 of the Civil Procedure Code of Ethiopia)

1. DECISION SOUGHT TO BE APPEALED:
This petition arises from the judgment rendered by ${v.lowerCourtFile || '________________________'}.

2. STATEMENT OF GOOD CAUSE & GROUNDS FOR LEAVE:
${v.groundsForLeave || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Applicant respectfully prays that this Honorable Court grant leave to lodge the attached Memorandum of Appeal and issue summons to the Respondent.

____________________________________
Applicant / Licensed Advocate for Applicant`,
  },
  {
    id: 'application-for-cassation',
    aliases: ['cassation', 'cassation-petition'],
    title: 'Application for Cassation to the Federal Supreme Court',
    amharicTitle: 'ለፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት የቀረበ አቤቱታ',
    category: 'Appeal',
    sourceFile: 'Appeal/b953b-application-for-cassation.docx',
    legalBasis: 'FDRE Constitution Art. 80(3)(a) & Proclamation No. 1234/2021',
    description:
      'Petition to the Federal Supreme Court Cassation Division alleging a basic and fundamental error of law (መሠረታዊ የሕግ ስህተት) in a final decision.',
    fields: [
      { id: 'applicantName', label: 'Applicant (Petitioner) Name & Address', placeholder: 'e.g., Nile Construction PLC, Addis Ababa' },
      { id: 'respondentName', label: 'Respondent Name & Address', placeholder: 'e.g., Ato Teshome Hailu, Addis Ababa' },
      { id: 'contestedDecisions', label: 'Lower Courts & File Numbers Being Challenged', placeholder: 'e.g., Federal High Court File No. 98210 & Federal Supreme Court File No. 20194' },
      { id: 'fundamentalError', label: 'Statement of Fundamental Error of Law (መሠረታዊ የሕግ ስህተት)', type: 'textarea', placeholder: 'Specify the exact proclamation/code articles violated and any binding Cassation Bench precedent disregarded...' },
      { id: 'reliefSought', label: 'Specific Cassation Relief Sought', type: 'textarea', placeholder: 'e.g., Reverse the decision of the Appellate Bench and dismiss the claim with costs...' },
      { id: 'date', label: 'Date of Application', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `TO THE FEDERAL SUPREME COURT OF ETHIOPIA
CASSATION DIVISION — ADDIS ABABA

Cassation File No.: ____________________
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR CASSATION REVIEW
(Pursuant to FDRE Constitution Art. 80(3)(a) & Proclamation No. 1234/2021)

1. FINAL DECISIONS CONTESTED:
${v.contestedDecisions || '________________________________________________________________________'}

2. FUNDAMENTAL ERROR OF LAW COMMITTED (መሠረታዊ የሕግ ስህተት):
${v.fundamentalError || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Applicant prays that this Honorable Cassation Division:
a) Refer the file to the full Cassation Bench;
b) ${v.reliefSought || 'Reverse/modify the lower court judgment in accordance with the law and award costs.'}

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'memorandum-of-appeal',
    aliases: ['appeal', 'civil-appeal'],
    title: 'Memorandum of Appeal (Statement of Appeal)',
    amharicTitle: 'የይግባኝ ቅሬታ ማቅረቢያ (Memorandum of Appeal)',
    category: 'Appeal',
    sourceFile: 'Appeal/d01e9-memorandum-of-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 323 & Art. 327',
    description:
      'Appellate pleading setting forth the concise grounds of objection to a lower court judgment and the specific appellate relief sought.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', placeholder: 'e.g., Federal Supreme Court Appellate Bench / Federal High Court' },
      { id: 'appellantName', label: 'Appellant Full Name & Address', placeholder: 'e.g., Abyssinia Logistics PLC, Addis Ababa' },
      { id: 'respondentName', label: 'Respondent Full Name & Address', placeholder: 'e.g., Ato Samuel Mekonnen, Addis Ababa' },
      { id: 'lowerCourtDetails', label: 'Lower Court Name, File No. & Date of Judgment', placeholder: 'e.g., Federal High Court Commercial Bench, File No. 88312, Judgment dated Oct 20, 2026' },
      { id: 'claimValue', label: 'Value of Subject Matter in Dispute (ETB)', placeholder: 'e.g., ETB 2,450,000.00' },
      { id: 'groundsOfAppeal', label: 'Concise Grounds of Appeal (Art. 327)', type: 'textarea', placeholder: '1. The trial court erred in holding that...\n2. The trial court improperly rejected documentary evidence...' },
      { id: 'reliefSought', label: 'Appellate Relief Sought', type: 'textarea', placeholder: 'e.g., Set aside the lower court decree in its entirety and enter judgment in favor of the Appellant.' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.appellateCourt?.toUpperCase() || 'FEDERAL APPELLATE COURT OF ETHIOPIA'}
ADDIS ABABA

Appellate File No.: ____________________
Date: ${v.date || '__________________'}

Appellant: ${v.appellantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}
Value of Subject Matter: ${v.claimValue || '____________________'}

MEMORANDUM OF APPEAL
(Pursuant to Articles 323 & 327 of the Civil Procedure Code of Ethiopia)

1. JUDGMENT APPEALED FROM:
This appeal is lodged against the judgment and decree of ${v.lowerCourtDetails || '____________________________________'}.

2. GROUNDS OF OBJECTION TO THE DECREE:
${v.groundsOfAppeal || '________________________________________________________________________'}

3. NATURE OF RELIEF SOUGHT:
${v.reliefSought || 'Reverse the judgment of the lower court and award full court costs and advocate fees to the Appellant.'}

____________________________________
Appellant / Advocate for Appellant`,
  },
  {
    id: 'appeal-administrative-decisions',
    aliases: ['administrative-appeal', 'tax-appeal'],
    title: 'Appeal Against Administrative Decisions',
    amharicTitle: 'በአስተዳደር ውሳኔ ላይ የሚቀርብ ይግባኝ',
    category: 'Appeal',
    sourceFile: 'Appeal/ee1bf-appeal-against-administrative-decisions.docx',
    legalBasis: 'Federal Administrative Procedure Proclamation No. 1183/2020',
    description:
      'Judicial review / statutory appeal challenging an unlawful or procedurally defective decision of a government ministry, tax authority, or regulatory agency.',
    fields: [
      { id: 'courtName', label: 'Reviewing Court / Bench', placeholder: 'e.g., Federal High Court — Administrative & Tax Appellate Bench' },
      { id: 'appellantName', label: 'Appellant Name & Address', placeholder: 'e.g., Ethio-Agro Exports PLC, Addis Ababa' },
      { id: 'agencyName', label: 'Respondent Administrative Agency / Authority', placeholder: 'e.g., Ministry of Revenues / Ethiopian Customs Commission' },
      { id: 'decisionRef', label: 'Administrative Decision Ref No. & Date', placeholder: 'e.g., Ref. No. MOR/441/2026 dated Oct 15, 2026' },
      { id: 'groundsOfIllegality', label: 'Grounds of Administrative Illegality / Ultra Vires', type: 'textarea', placeholder: 'Detail lack of jurisdiction, violation of hearing rights, or error of law under Proclamation No. 1183/2020...' },
      { id: 'date', label: 'Filing Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL HIGH COURT OF ETHIOPIA'}
ADDIS ABABA

Date: ${v.date || '__________________'}

Appellant: ${v.appellantName || '____________________________________'}
Respondent Administrative Organ: ${v.agencyName || '____________________________________'}

MEMORANDUM OF APPEAL AGAINST ADMINISTRATIVE DECISION
(Pursuant to Federal Administrative Procedure Proclamation No. 1183/2020)

1. ADMINISTRATIVE DECISION CHALLENGED:
Reference ${v.decisionRef || '________________________'}. All internal administrative grievance remedies have been exhausted.

2. GROUNDS OF APPEAL & ILLEGALITY:
${v.groundsOfIllegality || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Appellant prays that this Honorable Court quash and set aside the contested administrative decision and restore the Appellant's lawful rights.

____________________________________
Appellant / Advocate for Appellant`,
  },

  // 3. COURT APPLICATIONS & PLEADINGS
  {
    id: 'petition-for-intervention',
    aliases: ['intervention'],
    title: 'Petition for Intervention in a Pending Proceeding',
    amharicTitle: 'በክርክር ውስጥ ጣልቃ ለመግባት የቀረበ አቤቱታ',
    category: 'Application',
    sourceFile: 'Application/12dd5-petition-for-intervention-in-a-proceeding.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 41',
    description:
      'Application by an interested third party to intervene in an ongoing civil suit before judgment to protect their legal rights or property interest.',
    fields: [
      { id: 'courtName', label: 'Court & Bench Handling the Suit', placeholder: 'e.g., Federal High Court, 4th Civil Bench' },
      { id: 'fileNo', label: 'Existing Court File Number', placeholder: 'e.g., File No. 219402' },
      { id: 'intervenorName', label: 'Third-Party Intervenor Name & Address', placeholder: 'e.g., W/ro Tigist Alemu, Bole Sub-City' },
      { id: 'plaintiffName', label: 'Plaintiff in Main Suit', placeholder: 'e.g., Ato Kebede Mamo' },
      { id: 'defendantName', label: 'Defendant in Main Suit', placeholder: 'e.g., Ato Yohannes Taye' },
      { id: 'interestStatement', label: 'Grounds Showing Direct Legal Interest (Art. 41(2))', type: 'textarea', placeholder: 'Explain how the outcome of the pending suit directly affects the Intervenor’s ownership or rights...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
File No.: ${v.fileNo || '____________________'}
Date: ${v.date || '__________________'}

Petitioner (Third-Party Intervenor): ${v.intervenorName || '________________________'}
Between Plaintiff: ${v.plaintiffName || '________________________'} and Defendant: ${v.defendantName || '________________________'}

PETITION FOR INTERVENTION IN A PENDING PROCEEDING
(Pursuant to Article 41 of the Civil Procedure Code of Ethiopia)

1. STATEMENT OF INTEREST IN THE SUBJECT MATTER:
${v.interestStatement || '________________________________________________________________________'}

2. RELIEF CLAIMED BY INTERVENOR:
The Petitioner prays to be admitted as a Third-Party Intervenor in File No. ${v.fileNo || '____________'} to protect their lawful rights over the disputed subject matter.

____________________________________
Third-Party Intervenor / Advocate`,
  },
  {
    id: 'cancellation-ex-parte-order',
    aliases: ['ex-parte-cancellation', 'set-aside-ex-parte'],
    title: 'Application for Cancellation of Ex-Parte Order / Decree',
    amharicTitle: 'በሌለሁበት የተሰጠ ትዕዛዝ/ውሳኔ እንዲነሳ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/14966-application-for-cancellation-of-ex-parte-order.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 78',
    description:
      'Application by a defendant to set aside an ex-parte order or decree within one month by proving non-service of summons or sufficient cause for non-appearance.',
    fields: [
      { id: 'courtName', label: 'Court Name & Bench', placeholder: 'e.g., Federal First Instance Court, Lideta Bench' },
      { id: 'fileNo', label: 'Court File Number & Ex-Parte Order Date', placeholder: 'e.g., File No. 110482, Order dated Oct 25, 2026' },
      { id: 'applicantName', label: 'Applicant (Defendant) Full Name', placeholder: 'e.g., Ato Bereket Assefa' },
      { id: 'respondentName', label: 'Respondent (Plaintiff) Full Name', placeholder: 'e.g., Dashen Microfinance Institution' },
      { id: 'sufficientCause', label: 'Reasons for Non-Appearance / Improper Service of Summons (Art. 78)', type: 'textarea', placeholder: 'State why summons was not duly served or the unavoidable cause that prevented appearance...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
File No.: ${v.fileNo || '____________________'}
Date: ${v.date || '__________________'}

Applicant (Defendant): ${v.applicantName || '____________________________________'}
Respondent (Plaintiff): ${v.respondentName || '____________________________________'}

APPLICATION TO SET ASIDE EX-PARTE ORDER / DECREE
(Pursuant to Article 78 of the Civil Procedure Code of Ethiopia)

1. SUFFICIENT CAUSE FOR NON-APPEARANCE:
${v.sufficientCause || '________________________________________________________________________'}

2. PRAYER FOR RELIEF:
WHEREFORE, the Applicant prays that this Honorable Court cancel and set aside the ex-parte order/decree pursuant to Article 78(2) and admit the Applicant's Statement of Defense.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'stay-of-execution-on-appeal',
    aliases: ['stay-of-execution'],
    title: 'Application for Stay of Execution Pending Appeal',
    amharicTitle: 'ይግባኝ እስኪታይ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/6aac2-application-for-stay-of-execution-on-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 332–335',
    description:
      'Urgent motion requesting the Appellate Court to stay execution of a decree pending appeal to prevent substantial and irreparable loss.',
    fields: [
      { id: 'courtName', label: 'Appellate Court Name', placeholder: 'e.g., Federal High Court Appellate Bench' },
      { id: 'appealFileNo', label: 'Appellate File No. & Execution File No.', placeholder: 'e.g., Appeal File No. 55421 (Execution File No. 12904)' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor / Appellant)', placeholder: 'e.g., Zemen Engineering PLC' },
      { id: 'respondentName', label: 'Respondent (Decree-Holder)', placeholder: 'e.g., Ato Kassahun Bekele' },
      { id: 'substantialLoss', label: 'Proof of Substantial & Irreparable Loss if Executed (Art. 334)', type: 'textarea', placeholder: 'Explain how immediate execution will cause substantial loss and render the pending appeal nugatory...' },
      { id: 'securityOffered', label: 'Security / Guarantee Offered (Art. 334(1)(c))', placeholder: 'e.g., Bank Guarantee / Title Deed security covering the decree amount' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL APPELLATE COURT OF ETHIOPIA'}
File No.: ${v.appealFileNo || '____________________'}
Date: ${v.date || '__________________'}

Applicant (Appellant): ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

URGENT APPLICATION FOR STAY OF EXECUTION PENDING APPEAL
(Pursuant to Articles 332–335 of the Civil Procedure Code of Ethiopia)

1. SUBSTANTIAL LOSS & IRREPARABLE HARM (ART. 334(1)(a)):
${v.substantialLoss || '________________________________________________________________________'}

2. UNDERTAKING OF SECURITY (ART. 334(1)(c)):
${v.securityOffered || 'Full security as ordered by the Honorable Court for due performance of the decree.'}

3. PRAYER FOR ORDER:
WHEREFORE, the Applicant prays for an immediate interim and final order staying execution proceedings until the appeal is finally decided.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'paupers-petition',
    aliases: ['pauper', 'in-forma-pauperis'],
    title: "Pauper's Petition (Application to Sue In Forma Pauperis)",
    amharicTitle: 'በድህነት (ያለ ዳኝነት ክፍያ) ክስ ለማቅረብ የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/7549a-paupers-petition.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 467–476',
    description:
      'Application supported by affidavit requesting exemption from court filing fees due to lack of sufficient financial means.',
    fields: [
      { id: 'courtName', label: 'Court Name', placeholder: 'e.g., Federal First Instance Court' },
      { id: 'applicantName', label: 'Applicant Full Name & Address', placeholder: 'e.g., W/ro Marta Tadesse, Kolfe Keranio Sub-City' },
      { id: 'respondentName', label: 'Intended Defendant Name', placeholder: 'e.g., ABC Transport Share Company' },
      { id: 'claimAmount', label: 'Amount of Claim & Required Court Fee', placeholder: 'e.g., Claim of ETB 850,000.00' },
      { id: 'financialStatus', label: 'Declaration of Income & Property (Affidavit of Means)', type: 'textarea', placeholder: 'State current monthly income and confirm inability to pay the prescribed court fee...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR PERMISSION TO SUE AS A PAUPER
(Pursuant to Articles 467–470 of the Civil Procedure Code of Ethiopia)

1. SUBJECT MATTER OF THE SUIT:
Statement of Claim annexed hereto for ${v.claimAmount || '________________________'}.

2. STATEMENT OF INSUFFICIENT MEANS (AFFIDAVIT):
${v.financialStatus || '________________________________________________________________________'}

3. PRAYER:
WHEREFORE, the Applicant prays for permission to institute the suit without payment of court fees.

Sworn and signed by Applicant: ___________________________`,
  },
  {
    id: 'joinder-of-third-party',
    aliases: ['third-party-joinder'],
    title: 'Petition for Joinder of Third Party',
    amharicTitle: 'ሦስተኛ ወገን ወደ ክርክሩ እንዲገባ የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/75ee1-petition-for-joinder-of-thrid-party.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 43',
    description:
      'Application by a defendant requesting the court to join a third party from whom the defendant claims contribution or indemnity.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 176320' },
      { id: 'defendantApplicant', label: 'Applicant (Defendant) Name', placeholder: 'e.g., Awash Insurance S.C.' },
      { id: 'plaintiffName', label: 'Plaintiff Name', placeholder: 'e.g., Ato Ephrem Alemu' },
      { id: 'thirdPartyName', label: 'Third Party to be Joined (Name & Address)', placeholder: 'e.g., Ato Tarekegn Bekele, Addis Ababa' },
      { id: 'indemnityGrounds', label: 'Grounds for Contribution or Indemnity (Art. 43(1))', type: 'textarea', placeholder: 'State the contractual or statutory basis showing why the Third Party is liable to indemnify the Defendant...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant (Defendant): ${v.defendantApplicant || '____________________________________'}
Plaintiff: ${v.plaintiffName || '____________________________________'}
Third Party Sought to be Joined: ${v.thirdPartyName || '____________________________________'}

PETITION FOR JOINDER OF THIRD PARTY
(Pursuant to Article 43 of the Civil Procedure Code of Ethiopia)

1. GROUNDS FOR CONTRIBUTION OR INDEMNITY:
${v.indemnityGrounds || '________________________________________________________________________'}

2. PRAYER FOR ORDER:
WHEREFORE, the Applicant prays that this Honorable Court issue a summons to the Third Party (${v.thirdPartyName || '____________________'}) pursuant to Article 43(2) of the Civil Procedure Code.

____________________________________
Defendant / Advocate for Defendant`,
  },
  {
    id: 'attachment-property-defendant',
    aliases: ['attachment-of-property', 'property-attachment'],
    title: 'Application for Attachment of Property of Defendant Before Judgment',
    amharicTitle: 'ከፍርድ በፊት የተከሳሽ ንብረት እንዲከበር የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/7c4d5-application-for-attachment-property-of-defendant.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 151–153',
    description:
      'Urgent application to attach the defendant’s movable/immovable property or bank accounts before judgment to prevent asset disposal.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court Commercial Bench, File No. 204811' },
      { id: 'applicantName', label: 'Applicant (Plaintiff) Name', placeholder: 'e.g., Hibret Bank S.C. / Commercial Claimant' },
      { id: 'respondentName', label: 'Respondent (Defendant) Name', placeholder: 'e.g., Rift Valley Coffee Exporters PLC' },
      { id: 'propertyToAttach', label: 'Specific Property / Vehicle / Bank Account to be Attached & Value', type: 'textarea', placeholder: 'e.g., Vehicle Plate No. Code 3-A88219 AA and funds up to ETB 3,500,000.00...' },
      { id: 'riskOfDisposal', label: 'Facts Showing Intent to Obstruct or Delay Execution (Art. 151(1))', type: 'textarea', placeholder: 'Detail evidence that the Defendant is about to dispose of or remove property from the jurisdiction...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant (Plaintiff): ${v.applicantName || '____________________________________'}
Respondent (Defendant): ${v.respondentName || '____________________________________'}

APPLICATION FOR ATTACHMENT BEFORE JUDGMENT
(Pursuant to Articles 151–153 of the Civil Procedure Code of Ethiopia)

1. PROPERTY SPECIFIED FOR ATTACHMENT (ART. 151(2)):
${v.propertyToAttach || '________________________________________________________________________'}

2. GROUNDS & AFFIDAVIT OF RISK OF DISPOSAL:
${v.riskOfDisposal || '________________________________________________________________________'}

3. PRAYER FOR CONDITIONAL ATTACHMENT:
WHEREFORE, the Applicant prays for an immediate order of conditional attachment under Article 151(3) of the Civil Procedure Code.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'pleading-injunction-exparte',
    aliases: ['injunction-exparte'],
    title: 'Pleading for Injunction of Enforcement of Ex-Parte Judgment',
    amharicTitle: 'በሌለበት የተሰጠ ፍርድ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/9c685-pleading-for-injuction-of-enforcememnt-of-exparte-judgement.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 78 & Art. 154',
    description:
      'Emergency motion to restrain enforcement and auction of assets while an application to set aside an ex-parte judgment is pending.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 190332' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor) Name', placeholder: 'e.g., Ato Henok Desta' },
      { id: 'respondentName', label: 'Respondent (Judgment-Creditor) Name', placeholder: 'e.g., Ato Mulugeta Taye' },
      { id: 'enforcementThreat', label: 'Imminent Enforcement Action & Irreparable Harm', type: 'textarea', placeholder: 'Describe the pending attachment/auction order and confirm that an Art. 78 petition has been filed...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

PLEADING FOR INJUNCTION OF ENFORCEMENT OF EX-PARTE JUDGMENT
(Pursuant to Articles 78 & 154 of the Civil Procedure Code of Ethiopia)

1. IMMINENT ENFORCEMENT & IRREPARABLE INJURY:
${v.enforcementThreat || '________________________________________________________________________'}

2. PRAYER FOR TEMPORARY INJUNCTION:
WHEREFORE, the Applicant prays for an immediate injunction restraining the enforcement of the ex-parte decree until the Article 78 petition is decided.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'application-for-execution',
    aliases: ['execution', 'decree-execution'],
    title: 'Application for Execution of Decree (የፍርድ አፈጻጸም ማመልከቻ)',
    amharicTitle: 'የፍርድ አፈጻጸም መጠየቂያ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/aa66b-application-for-execution.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 378',
    description:
      'Statutory application to execute a final court judgment by attachment and sale of property or transfer of funds.',
    fields: [
      { id: 'courtName', label: 'Execution Court Name', placeholder: 'e.g., Federal High Court Execution Bench' },
      { id: 'suitNo', label: 'Original Suit File No. & Date of Decree', placeholder: 'e.g., Civil File No. 164920, Decree dated Sept 18, 2026' },
      { id: 'decreeHolder', label: 'Decree-Holder (Applicant) Name & Address', placeholder: 'e.g., Lucy Trading PLC, Addis Ababa' },
      { id: 'judgmentDebtor', label: 'Judgment-Debtor (Respondent) Name & Address', placeholder: 'e.g., Ato Alemayehu Bekele, Addis Ababa' },
      { id: 'whetherAppeal', label: 'Whether Any Appeal Has Been Preferred From the Decree', placeholder: 'e.g., No appeal or stay order issued', defaultValue: 'No appeal or stay of execution order has been issued.' },
      { id: 'amountDue', label: 'Total Amount of Debt / Compensation & Costs Due (ETB)', placeholder: 'e.g., Principal ETB 1,200,000 + 9% Legal Interest' },
      { id: 'modeOfAssistance', label: 'Mode in Which Court Assistance is Required (Art. 378(3)(j))', type: 'textarea', placeholder: 'e.g., Issue execution summons under Art. 386 and attach/transfer funds...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL EXECUTION COURT OF ETHIOPIA'}
Execution File No.: ____________________
Date: ${v.date || '__________________'}

APPLICATION FOR EXECUTION OF DECREE (Art. 378 Civil Procedure Code)

1. Number of the Suit & Date of Decree: ${v.suitNo || '____________________________________'}
2. Decree-Holder (Applicant): ${v.decreeHolder || '____________________________________'}
3. Judgment-Debtor (Respondent): ${v.judgmentDebtor || '____________________________________'}
4. Whether any appeal has been preferred: ${v.whetherAppeal || 'None'}
5. Amount of debt/compensation and costs due: ${v.amountDue || '____________________________________'}
6. Mode in which the assistance of the Court is required (Art. 378(3)(j)):
   ${v.modeOfAssistance || '________________________________________________________________________'}

____________________________________
Decree-Holder / Advocate`,
  },
  {
    id: 'injunction-order',
    aliases: ['temporary-injunction', 'injunction'],
    title: 'Application for Temporary Injunction Order (የዕግድ ትዕዛዝ ማመልከቻ)',
    amharicTitle: 'ጊዜያዊ የዕግድ ትዕዛዝ እንዲሰጥ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/b94e6-injunction-order.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 154–155',
    description:
      'Application for a temporary injunction to restrain a party from wasting, damaging, alienating, or wrongfully selling property in dispute.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 221094' },
      { id: 'applicantName', label: 'Applicant Name', placeholder: 'e.g., Ato Yared Tsegaye' },
      { id: 'respondentName', label: 'Respondent Name', placeholder: 'e.g., W/ro Roman Gebre' },
      { id: 'propertyInDispute', label: 'Description of Disputed Property / Subject Matter', placeholder: 'e.g., Residential property in Bole Sub-City, Woreda 09, Plot No. 882/09' },
      { id: 'groundsForInjunction', label: 'Grounds Showing Danger of Alienation, Waste, or Damage (Art. 154)', type: 'textarea', placeholder: 'State the specific acts showing that the property in dispute is in danger of being wasted or alienated...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR TEMPORARY INJUNCTION ORDER (Art. 154 Civil Procedure Code)

1. PROPERTY IN DISPUTE:
${v.propertyInDispute || '________________________________________________________________________'}

2. GROUNDS FOR TEMPORARY INJUNCTION:
${v.groundsForInjunction || '________________________________________________________________________'}

3. PRAYER FOR ORDER:
WHEREFORE, the Applicant prays for an immediate Temporary Injunction Order restraining the transfer, mortgage, or alteration of the disputed property until final disposal of the suit.

____________________________________
Applicant / Advocate for Applicant`,
  },

  // 4. BUSINESS & COMMERCIAL FORMS
  {
    id: 'plc-articles-of-association',
    aliases: ['plc', 'articles-of-association', 'memorandum-of-association', 'company-formation', 'corporate'],
    title: 'Memorandum & Articles of Association for Private Limited Company (PLC)',
    amharicTitle: 'ኃላፊነቱ የተወሰነ የግል ማኅበር መመሥረቻ ጽሑፍ',
    category: 'Business Forms',
    sourceFile: 'Business Forms/article of association for plc.doc',
    legalBasis: 'Commercial Code Proclamation No. 1243/2021 (Art. 495–533)',
    description:
      'Complete corporate formation instrument for a Private Limited Company (PLC) ready for DARS authentication and Ministry of Trade registration.',
    fields: [
      { id: 'companyName', label: 'Company Name (PLC)', placeholder: 'e.g., Blue Nile Tech Solutions Private Limited Company' },
      { id: 'headOffice', label: 'Head Office Address', placeholder: 'e.g., Addis Ababa, Bole Sub-City, Woreda 03' },
      { id: 'businessObjectives', label: 'Business Objectives / Purposes of the Company', type: 'textarea', placeholder: 'e.g., 1. Software development and IT consultancy;\n2. Import and distribution of equipment...' },
      { id: 'capitalAmount', label: 'Total Paid-Up Capital (ETB) & Par Value of Shares', placeholder: 'e.g., ETB 500,000.00 divided into 500 shares of ETB 1,000.00 each' },
      { id: 'shareholdersList', label: 'Founding Shareholders & Share Allocation', type: 'textarea', placeholder: '1. Ato Abebe Kebede — 300 Shares (ETB 300,000)\n2. W/ro Sara Tadesse — 200 Shares (ETB 200,000)' },
      { id: 'generalManager', label: 'Appointed General Manager Full Name', placeholder: 'e.g., Ato Abebe Kebede' },
      { id: 'date', label: 'Execution Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `MEMORANDUM OF ASSOCIATION OF
${v.companyName?.toUpperCase() || '____________________________________ PLC'}
(Pursuant to Commercial Code Proclamation No. 1243/2021)

Article 1 — Establishment & Name: "${v.companyName || '________________________ Private Limited Company'}"
Article 2 — Head Office: ${v.headOffice || 'Addis Ababa, Ethiopia'}
Article 3 — Business Objectives:
${v.businessObjectives || '________________________________________________________________________'}

Article 4 — Capital & Shareholding Structure:
Total paid-up capital: ${v.capitalAmount || 'ETB ________________'}
Share Allocation:
${v.shareholdersList || '________________________________________________________________________'}

Article 5 — Management:
Appointed General Manager: ${v.generalManager || '________________________'}

Executed on ${v.date || '__________________'}.

FOUNDING SHAREHOLDERS SIGNATURES:
1. ___________________________   2. ___________________________`,
  },
  {
    id: 'employment-agreement',
    aliases: ['employment', 'employment-contract', 'labor', 'labour'],
    title: 'Bilingual Employment Contract (Proclamation No. 1156/2019)',
    amharicTitle: 'የቅጥር ውል ስምምነት (በአዋጅ ቁጥር 1156/2011 መሠረት)',
    category: 'Business Forms',
    sourceFile: 'Business Forms/Employment Agreement',
    legalBasis: 'Ethiopian Labour Proclamation No. 1156/2019 (Art. 4, 6 & 7)',
    description:
      'Compliant employment contract specifying job title, place of work, probation period, basic salary, leave entitlements, and termination notice.',
    fields: [
      { id: 'employerName', label: 'Employer Company Name & Address', placeholder: 'e.g., Ethio-FinTech Solutions PLC, Addis Ababa' },
      { id: 'employeeName', label: 'Employee Full Name & Address', placeholder: 'e.g., Ato Daniel Bekele, Addis Ababa' },
      { id: 'jobTitle', label: 'Job Title / Position & Place of Work', placeholder: 'e.g., Senior Operations Officer — Addis Ababa Head Office' },
      { id: 'monthlySalary', label: 'Gross Monthly Salary (ETB) & Allowances', placeholder: 'e.g., ETB 35,000.00 + ETB 3,000 Transport Allowance' },
      { id: 'startDate', label: 'Commencement Date (60 Working Days Probation per Art. 11)', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `CONTRACT OF EMPLOYMENT
(Executed Pursuant to Labour Proclamation No. 1156/2019)

Date: ${v.startDate || '__________________'}

1. EMPLOYER: ${v.employerName || '____________________________________'}
2. EMPLOYEE: ${v.employeeName || '____________________________________'}
3. POSITION & WORKPLACE: ${v.jobTitle || '____________________________________'}
4. REMUNERATION: Gross monthly salary of ${v.monthlySalary || 'ETB ________________'}, subject to statutory income tax and pension contributions (7% employee / 11% employer).
5. PROBATION PERIOD: The first sixty (60) working days from ${v.startDate || '____________'} shall constitute a probation period pursuant to Article 11(3) of Proclamation No. 1156/2019.
6. WORKING HOURS & LEAVE: Standard working hours (8 hours/day, 48 hours/week maximum) and annual leave (16 working days for the first year) shall be governed by Proclamation No. 1156/2019.

Employer Signature: _______________________   Employee Signature: _______________________`,
  },
  {
    id: 'commercial-lease',
    aliases: ['lease', 'real-estate', 'rent', 'lease-agreement'],
    title: 'Commercial & Office Property Lease Agreement',
    amharicTitle: 'የንግድ ቤት ኪራይ ውል ስምምነት',
    category: 'Business Forms',
    sourceFile: 'Business Forms/Commercial Lease Agreement',
    legalBasis: 'Ethiopian Civil Code Art. 2896–2974',
    description:
      'Bilingual-ready lease contract for office, retail, or residential premises covering lease term, advance rent payment, withholding tax, and maintenance.',
    fields: [
      { id: 'lessorName', label: 'Lessor (Landlord) Full Name & TIN', placeholder: 'e.g., Ato Kebede Tadesse, TIN: 001928374' },
      { id: 'lesseeName', label: 'Lessee (Tenant) Full Name & TIN', placeholder: 'e.g., Addis Consulting PLC, TIN: 004829102' },
      { id: 'premisesAddress', label: 'Leased Premises Location & Floor/Area', placeholder: 'e.g., Bole Sub-City, Woreda 03, 3rd Floor (180 sq.m)' },
      { id: 'monthlyRent', label: 'Monthly Rent (ETB) & Advance Payment Schedule', placeholder: 'e.g., ETB 65,000.00/month paid every 6 months in advance' },
      { id: 'leaseDuration', label: 'Lease Term (Start & End Date)', placeholder: 'e.g., Two (2) Years starting Nov 15, 2026' },
    ],
    generateDocument: (v) => `COMMERCIAL PROPERTY LEASE AGREEMENT
(Pursuant to Articles 2896–2974 of the Civil Code of Ethiopia)

1. LESSOR (LANDLORD): ${v.lessorName || '____________________________________'}
2. LESSEE (TENANT): ${v.lesseeName || '____________________________________'}
3. LEASED PREMISES: ${v.premisesAddress || '____________________________________'}
4. LEASE TERM: ${v.leaseDuration || '____________________________________'}
5. RENTAL RATE & PAYMENT: ${v.monthlyRent || '____________________________________'}
6. COVENANTS: The Lessee shall use the premises solely for lawful commercial/office operations and shall not sublease without the Lessor's written consent.

Lessor Signature: _______________________   Lessee Signature: _______________________`,
  },
];

export function findTemplateByIdOrQuery(identifier?: string | null): LegalTemplate | null {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  return (
    ETHIOPIAN_LEGAL_TEMPLATES.find(
      (t) =>
        t.id.toLowerCase() === clean ||
        t.aliases?.some((alias) => alias.toLowerCase() === clean) ||
        t.title.toLowerCase().includes(clean)
    ) || null
  );
}

function LexDraftContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams?.get('category') || 'All';
  const initialTemplateParam = searchParams?.get('template') || searchParams?.get('id');

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<LegalTemplate | null>(() =>
    findTemplateByIdOrQuery(initialTemplateParam)
  );
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const categories = [
    'All',
    'Agency & Power of Attorney',
    'Appeal',
    'Application',
    'Business Forms',
  ];

  const filteredTemplates = ETHIOPIAN_LEGAL_TEMPLATES.filter((t) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amharicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.legalBasis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openTemplateQuestionnaire = (template: LegalTemplate) => {
    const defaults: Record<string, string> = {};
    template.fields.forEach((f) => {
      if (f.defaultValue) defaults[f.id] = f.defaultValue;
    });
    setFormValues(defaults);
    setActiveTemplate(template);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const generatedText = activeTemplate ? activeTemplate.generateDocument(formValues) : '';

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    if (!activeTemplate) return;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${activeTemplate.title}</title></head>
      <body style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; white-space: pre-wrap;">${generatedText}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.id}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Unified Light Header Matching Landing Page + Back Button */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (activeTemplate) {
                  setActiveTemplate(null);
                } else {
                  router.push('/');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activeTemplate ? 'Back to All Forms' : 'Back to Home'}</span>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="LegalLink" className="w-7 h-7 object-contain" />
              <span className="font-black text-lg tracking-tight text-[#0A1128]">
                Legal<span className="text-amber-500">Link</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/find-a-lawyer" className="hover:text-[#0A1128] transition-colors">Find a Lawyer</Link>
            <Link href="/for-lawyers" className="hover:text-[#0A1128] transition-colors">For Lawyers</Link>
            <Link href="/legaltalk" className="hover:text-[#0A1128] transition-colors">LegalTalk</Link>
            <Link
              href="/lexdraft"
              onClick={() => setActiveTemplate(null)}
              className="text-[#0A1128] font-bold"
            >
              LexDraft
            </Link>
            <Link href="/library" className="hover:text-[#0A1128] transition-colors">Library</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold text-slate-700 hover:text-[#0A1128]">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-full inline-flex items-center gap-1.5 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* VIEW 1: FOCUSED FORM QUESTIONNAIRE (WHEN A FORM IS CLICKED) */}
      {activeTemplate ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveTemplate(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0A1128] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Legal Templates List</span>
            </button>

            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#0A1128]"
            >
              Return to Landing Page →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step 1: Questionnaire */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {activeTemplate.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0A1128] pt-1">
                  {activeTemplate.title}
                </h1>
                <p className="text-xs font-bold text-emerald-700">
                  {activeTemplate.amharicTitle}
                </p>
                <p className="text-[11px] text-slate-500">{activeTemplate.legalBasis}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Step 1: Fill in the Required Details
                </h2>

                {activeTemplate.fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={formValues[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0A1128] focus:bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Live Document Preview & Export */}
            <div className="lg:col-span-6 bg-[#F8FAFC] rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 sticky top-24">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-sm font-black text-[#0A1128]">
                    Step 2: Completed Document Preview
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Ready to download in Microsoft Word (.doc) or print
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadWord}
                    className="px-4 py-2 bg-[#0A1128] hover:bg-[#102A43] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Word (.doc)</span>
                  </button>
                </div>
              </div>

              <pre className="w-full p-6 bg-white border border-slate-200 rounded-2xl text-xs font-serif text-slate-900 whitespace-pre-wrap leading-relaxed max-h-[580px] overflow-y-auto">
                {generatedText}
              </pre>
            </div>
          </div>
        </main>
      ) : (
        /* VIEW 2: CLEAN, UNCLUTTERED TEMPLATE SELECTION GRID */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Ethiopian Legal Templates, Contracts & Court Forms</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
              Select a Legal Form to Draft
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Click any court form, appeal, power of attorney, or contract below to answer the guided questions and download your ready-to-use document.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0A1128] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms (e.g. Cassation, PLC, Agency)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0A1128] focus:bg-white"
              />
            </div>
          </div>

          {/* Clean 3-Column Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => openTemplateQuestionnaire(template)}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-[#0A1128] p-6 transition-all cursor-pointer flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {template.category}
                    </span>
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>

                  <h2 className="text-base font-black text-[#0A1128] leading-snug">
                    {template.title}
                  </h2>
                  <p className="text-xs font-bold text-emerald-700">
                    {template.amharicTitle}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[65%]">
                    {template.legalBasis}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1128] group-hover:text-amber-600">
                    <span>Start Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

export default function LexDraftPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs font-bold text-slate-500">
          Loading LexDraft Legal Templates...
        </div>
      }
    >
      <LexDraftContent />
    </Suspense>
  );
}