'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  ChevronRight,
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
  title: string;
  amharicTitle: string;
  category: 'Agency & Power of Attorney' | 'Appeal' | 'Application' | 'Business Forms';
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
    title: 'Power of Attorney for Legal Representation (Advocate Agency)',
    amharicTitle: 'የጠበቃ ውክልና ማስረጃ (Power of Attorney)',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/agency( attorney).doc',
    legalBasis: 'Ethiopian Civil Code Art. 2199–2233 & Federal Advocacy Proclamation No. 1249/2021',
    description: 'Authorizes a licensed Federal or Regional Advocate to represent a client before all regular courts, cassation benches, and administrative tribunals.',
    fields: [
      { id: 'principalName', label: 'Principal (Client) Full Name', placeholder: 'e.g., Ato Abebe Kebede Tesfaye' },
      { id: 'principalAddress', label: 'Principal Address (City, Sub-City, Woreda, House No.)', placeholder: 'e.g., Addis Ababa, Bole Sub-City, Woreda 03, H.No. 412' },
      { id: 'advocateName', label: 'Appointed Advocate Full Name', placeholder: 'e.g., Advocate Solomon Tadesse' },
      { id: 'licenseNo', label: 'Ministry of Justice Advocate License No.', placeholder: 'e.g., MOJ/FED/1842/2021' },
      { id: 'advocateAddress', label: 'Advocate Chamber Address & Phone', placeholder: 'e.g., Lideta Sub-City, Woreda 08, Sengatera Bldg 4th Floor, Tel: +251911...' },
      { id: 'scopeOfMatter', label: 'Specific Case / Legal Matter Authorized', type: 'textarea', placeholder: 'e.g., To institute, defend, appeal, and execute judgment regarding commercial contract dispute against XYZ PLC...' },
      { id: 'date', label: 'Date of Execution', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
DOCUMENTS AUTHENTICATION AND REGISTRATION SERVICE (DARS)
POWER OF ATTORNEY FOR ADVOCATE REPRESENTATION
(Pursuant to Civil Code Art. 2199 & Proclamation No. 1249/2021)

Date: ${v.date || '__________________'}

1. PRINCIPAL (GRANTEE OF MANDATE):
Full Name: ${v.principalName || '____________________________________'}
Address: ${v.principalAddress || '____________________________________'}

2. APPOINTED ADVOCATE (AGENT / REPRESENTATIVE):
Full Name: ${v.advocateName || '____________________________________'}
MOJ Federal License No.: ${v.licenseNo || '________________________'}
Chamber Address: ${v.advocateAddress || '____________________________________'}

3. SCOPE OF AUTHORITY GRANTED:
I, the undersigned Principal, hereby appoint the above-named Licensed Advocate to act as my lawful legal representative and attorney-in-fact in the following matter:
${v.scopeOfMatter || 'To represent me before any Federal or Regional First Instance, High, or Supreme Court, including the Cassation Division, in all civil, commercial, and execution proceedings.'}

4. SPECIFIC POWERS OF THE ADVOCATE:
Pursuant to Articles 2204 and 2205 of the Civil Code of Ethiopia and the Civil Procedure Code:
a) To prepare, sign, verify, and file statements of claim, statements of defense, counter-claims, memorandums of appeal, cassation petitions, and interlocutory applications;
b) To appear before any court, administrative tribunal, or arbitration panel, present oral and documentary evidence, and examine or cross-examine witnesses;
c) To apply for attachment of property, temporary injunctions, stay of execution, or execution of decrees;
d) To receive court summons, orders, judgments, and decrees on my behalf.

IN WITNESS WHEREOF, I have signed this Power of Attorney before the authenticating officer on the date first written above.

Principal Signature: _______________________
Name: ${v.principalName || '_______________________'}

Advocate Acceptance Signature: _______________________
Name: ${v.advocateName || '_______________________'}

WITNESSES:
1. ___________________________   Signature: _____________
2. ___________________________   Signature: _____________`,
  },
  {
    id: 'agency-administration',
    title: 'General Agency for Property & Business Administration',
    amharicTitle: 'የንብረት እና የሥራ አስተዳደር ውክልና',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/Agency( for administration).docx',
    legalBasis: 'Ethiopian Civil Code Art. 2203–2204 (Acts of Management & Administration)',
    description: 'Grants authority to an agent to manage immovable property, collect lease rentals, pay taxes, deal with utilities, and administer routine business affairs.',
    fields: [
      { id: 'principalName', label: 'Principal (Property Owner) Full Name', placeholder: 'e.g., W/ro Almaz Bekele' },
      { id: 'principalAddress', label: 'Principal Address', placeholder: 'e.g., Addis Ababa, Kirkos Sub-City, Woreda 02' },
      { id: 'agentName', label: 'Agent (Representative) Full Name', placeholder: 'e.g., Ato Dawit Kebede' },
      { id: 'agentAddress', label: 'Agent Address & ID Number', placeholder: 'e.g., Addis Ababa, Yeka Sub-City, Woreda 05, ID: AA-05-9921' },
      { id: 'propertyDetails', label: 'Property / Business Under Administration (Title Deed / Plot No.)', type: 'textarea', placeholder: 'e.g., Residential/Commercial Building located in Bole Sub-City, Woreda 04, Title Deed No. BL/10294/2018...' },
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
The Principal hereby confers full authority of administration upon the Agent to perform the following acts on the Principal's behalf:
a) To lease or rent the property described above, sign lease agreements not exceeding three (3) years pursuant to Art. 2204 of the Civil Code, and collect rental payments;
b) To represent the Principal before the Ministry of Revenues, Sub-City Land Administration, Water & Sewerage Authority, Ethio Telecom, and Ethiopian Electric Utility;
c) To pay land lease fees, municipal taxes, utility bills, and receive official tax clearance certificates;
d) To preserve, maintain, and repair the property and prosecute or defend any legal action necessary for its protection.
(Note: Acts of sale, mortgage, or donation require express special authorization under Art. 2205 of the Civil Code.)

Principal Signature: _______________________
Agent Signature: ___________________________

WITNESSES:
1. ___________________________   Signature: _____________
2. ___________________________   Signature: _____________`,
  },

  // 2. APPEAL FORMS
  {
    id: 'petition-leave-to-appeal',
    title: 'Petition for Leave to Appeal',
    amharicTitle: 'ይግባኝ ለማቅረብ ፈቃድ መጠየቂያ አቤቱታ',
    category: 'Appeal',
    sourceFile: 'Appeal/0987b-petition-for-leave-to-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 325–326',
    description: 'Formal petition requesting leave to file an appeal out of time or where special leave of the appellate court is procedurally required.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', placeholder: 'e.g., To the Federal High Court, Civil Appellate Bench — Addis Ababa' },
      { id: 'applicantName', label: 'Applicant (Intended Appellant) Name & Address', placeholder: 'e.g., Ato Girma Tadesse, Bole Sub-City, Woreda 06' },
      { id: 'respondentName', label: 'Respondent Name & Address', placeholder: 'e.g., Horizon Trading PLC, Kirkos Sub-City, Woreda 01' },
      { id: 'lowerCourtFile', label: 'Lower Court Name, File No. & Judgment Date', placeholder: 'e.g., Federal First Instance Court File No. 142890, Judgment dated Oct 02, 2026' },
      { id: 'groundsForLeave', label: 'Grounds / Good Cause for Requesting Leave to Appeal', type: 'textarea', placeholder: 'e.g., The certified copy of the judgment was delayed by the registry until..., preventing filing within the 60-day statutory period...' },
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
The Applicant respectfully submits the following grounds demonstrating sufficient and lawful cause under Article 325 of the Civil Procedure Code:
${v.groundsForLeave || '________________________________________________________________________'}

3. SUBSTANTIAL QUESTION OF LAW AND FACT:
The attached Memorandum of Appeal demonstrates prima facie errors in the evaluation of evidence and application of substantive law by the lower court.

4. RELIEF SOUGHT (PRAYER):
WHEREFORE, the Applicant respectfully prays that this Honorable Court:
a) Grant leave to lodge the attached Memorandum of Appeal;
b) Direct the Registrar to register the appeal and issue summons to the Respondent.

Respectfully submitted,

____________________________________
Applicant / Licensed Advocate for Applicant`,
  },
  {
    id: 'application-for-cassation',
    title: 'Application for Cassation to the Federal Supreme Court',
    amharicTitle: 'ለፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት የቀረበ አቤቱታ',
    category: 'Appeal',
    sourceFile: 'Appeal/b953b-application-for-cassation.docx',
    legalBasis: 'FDRE Constitution Art. 80(3)(a) & Federal Courts Proclamation No. 1234/2021',
    description: 'Petition to the Federal Supreme Court Cassation Division alleging a basic and fundamental error of law (መሠረታዊ የሕግ ስህተት) in a final decision.',
    fields: [
      { id: 'applicantName', label: 'Applicant (Petitioner) Name & Address', placeholder: 'e.g., Nile Construction PLC, Addis Ababa, Lemi Kura Sub-City' },
      { id: 'respondentName', label: 'Respondent Name & Address', placeholder: 'e.g., Ato Teshome Hailu, Addis Ababa, Arada Sub-City' },
      { id: 'contestedDecisions', label: 'Lower Courts & File Numbers Being Challenged', placeholder: 'e.g., Federal High Court File No. 98210 & Federal Supreme Court Appellate File No. 20194' },
      { id: 'fundamentalError', label: 'Statement of Fundamental Error of Law (መሠረታዊ የሕግ ስህተት)', type: 'textarea', placeholder: 'Specify the exact proclamation/code articles violated or misapplied and any binding Cassation Bench precedent disregarded...' },
      { id: 'reliefSought', label: 'Specific Cassation Relief Sought', type: 'textarea', placeholder: 'e.g., To reverse the decision of the Appellate Bench and dismiss the claim with costs...' },
      { id: 'date', label: 'Date of Application', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `TO THE FEDERAL SUPREME COURT OF ETHIOPIA
CASSATION DIVISION
ADDIS ABABA

Cassation File No.: ____________________
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR CASSATION REVIEW
(Submitted Pursuant to FDRE Constitution Art. 80(3)(a) & Proclamation No. 1234/2021)

1. FINAL DECISIONS CONTESTED:
The Applicant petitions for cassation review of the final judgment rendered in:
${v.contestedDecisions || '________________________________________________________________________'}
(Certified copies of the contested decisions and lower court judgments are annexed hereto.)

2. FUNDAMENTAL ERROR OF LAW COMMITTED (መሠረታዊ የሕግ ስህተት):
The contested final decision contains a basic and fundamental error of law for the following reasons:
${v.fundamentalError || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Applicant prays that this Honorable Cassation Division:
a) Declare that the contested decision contains a prima facie fundamental error of law and refer the file to the full Cassation Bench;
b) ${v.reliefSought || 'Reverse/modify the lower court judgment in accordance with the law and award costs to the Applicant.'}

Respectfully submitted,

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'memorandum-of-appeal',
    title: 'Memorandum of Appeal (Statement of Appeal)',
    amharicTitle: 'የይግባኝ ቅሬታ ማቅረቢያ (Memorandum of Appeal)',
    category: 'Appeal',
    sourceFile: 'Appeal/d01e9-memorandum-of-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 323 & Art. 327',
    description: 'Comprehensive appellate pleading setting forth the grounds of objection to a lower court decree without argument or narrative.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', placeholder: 'e.g., Federal Supreme Court Appellate Bench / Federal High Court' },
      { id: 'appellantName', label: 'Appellant Full Name & Address', placeholder: 'e.g., Abyssinia Logistics PLC, Addis Ababa' },
      { id: 'respondentName', label: 'Respondent Full Name & Address', placeholder: 'e.g., Ato Samuel Mekonnen, Addis Ababa' },
      { id: 'lowerCourtDetails', label: 'Lower Court Name, File No. & Date of Judgment', placeholder: 'e.g., Federal High Court Commercial Bench, File No. 88312, Judgment dated Oct 20, 2026' },
      { id: 'claimValue', label: 'Value of Subject Matter in Dispute (ETB)', placeholder: 'e.g., ETB 2,450,000.00' },
      { id: 'groundsOfAppeal', label: 'Concise Grounds of Appeal (Art. 327)', type: 'textarea', placeholder: '1. The trial court erred in holding that...\n2. The trial court improperly rejected documentary evidence...' },
      { id: 'reliefSought', label: 'Appellate Relief Sought', type: 'textarea', placeholder: 'e.g., Set aside the lower court decree in its entirety and enter judgment in favor of the Appellant with costs.' },
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
The Appellant objects to the judgment of the lower court on the following distinct grounds:
${v.groundsOfAppeal || '________________________________________________________________________'}

3. NATURE OF RELIEF SOUGHT:
WHEREFORE, the Appellant respectfully prays that this Honorable Appellate Court:
${v.reliefSought || 'Reverse the judgment of the lower court and award full court costs and advocate fees to the Appellant.'}

Verification: I verify that the facts stated in this Memorandum of Appeal are true and accurate to the best of my knowledge.

____________________________________
Appellant / Advocate for Appellant`,
  },
  {
    id: 'appeal-administrative-decisions',
    title: 'Appeal Against Administrative Decisions',
    amharicTitle: 'በአስተዳደር ውሳኔ ላይ የሚቀርብ ይግባኝ',
    category: 'Appeal',
    sourceFile: 'Appeal/ee1bf-appeal-against-administrative-decisions.docx',
    legalBasis: 'Federal Administrative Procedure Proclamation No. 1183/2020 & Civil Procedure Code',
    description: 'Judicial review / statutory appeal challenging an unlawful, ultra vires, or procedurally defective decision of a government ministry, tax authority, or agency.',
    fields: [
      { id: 'courtName', label: 'Reviewing Court / Bench', placeholder: 'e.g., Federal High Court — Administrative & Tax Appellate Bench' },
      { id: 'appellantName', label: 'Appellant Name & Address', placeholder: 'e.g., Ethio-Agro Exports PLC, Addis Ababa' },
      { id: 'agencyName', label: 'Respondent Administrative Agency / Authority', placeholder: 'e.g., Ministry of Revenues / Ethiopian Customs Commission' },
      { id: 'decisionRef', label: 'Administrative Decision Ref No. & Date', placeholder: 'e.g., Ref. No. MOR/appl/441/2026 dated Oct 15, 2026' },
      { id: 'groundsOfIllegality', label: 'Grounds of Administrative Illegality / Ultra Vires', type: 'textarea', placeholder: 'Detail lack of jurisdiction, violation of due process/hearing rights, or error of law under Proclamation No. 1183/2020...' },
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
This appeal challenges the administrative decision issued by the Respondent under Reference ${v.decisionRef || '________________________'}.
The Appellant has exhausted all internal administrative grievance remedies required by law.

2. GROUNDS OF APPEAL & ILLEGALITY:
The contested administrative decision is unlawful and subject to judicial reversal on the following grounds:
${v.groundsOfIllegality || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Appellant respectfully prays that this Honorable Court:
a) Quash and set aside the contested administrative decision Reference ${v.decisionRef || '____________'};
b) Order the Respondent Authority to restore the Appellant's lawful rights and entitlements;
c) Award all legal costs incurred in this proceeding.

____________________________________
Appellant / Advocate for Appellant`,
  },

  // 3. COURT APPLICATIONS & PLEADINGS
  {
    id: 'petition-for-intervention',
    title: 'Petition for Intervention in a Pending Proceeding',
    amharicTitle: 'በክርክር ውስጥ ጣልቃ ለመግባት የቀረበ አቤቱታ',
    category: 'Application',
    sourceFile: 'Application/12dd5-petition-for-intervention-in-a-proceeding.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 41',
    description: 'Application by an interested third party to intervene in an ongoing civil suit before judgment to protect their legal rights or property interest.',
    fields: [
      { id: 'courtName', label: 'Court & Bench Handling the Suit', placeholder: 'e.g., Federal High Court, 4th Civil Bench' },
      { id: 'fileNo', label: 'Existing Court File Number', placeholder: 'e.g., File No. 219402' },
      { id: 'intervenorName', label: 'Third-Party Intervenor Name & Address', placeholder: 'e.g., W/ro Tigist Alemu, Bole Sub-City' },
      { id: 'plaintiffName', label: 'Plaintiff in Main Suit', placeholder: 'e.g., Ato Kebede Mamo' },
      { id: 'defendantName', label: 'Defendant in Main Suit', placeholder: 'e.g., Ato Yohannes Taye' },
      { id: 'interestStatement', label: 'Grounds Showing Direct Legal Interest (Art. 41(2))', type: 'textarea', placeholder: 'Explain how the outcome of the pending suit between the Plaintiff and Defendant directly affects the Intervenor’s ownership or rights...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
File No.: ${v.fileNo || '____________________'}
Date: ${v.date || '__________________'}

Petitioner (Third-Party Intervenor): ${v.intervenorName || '________________________'}
Between:
Plaintiff: ${v.plaintiffName || '________________________'}
Defendant: ${v.defendantName || '________________________'}

PETITION FOR INTERVENTION IN A PENDING PROCEEDING
(Pursuant to Article 41 of the Civil Procedure Code of Ethiopia)

1. STATEMENT OF INTEREST IN THE SUBJECT MATTER:
Pursuant to Article 41(1) & (2) of the Civil Procedure Code, the Petitioner submits this separate statement setting forth the grounds that entitle the Petitioner to intervene in Civil File No. ${v.fileNo || '____________'}:
${v.interestStatement || '________________________________________________________________________'}

2. RELIEF CLAIMED BY INTERVENOR:
The Petitioner prays that this Honorable Court:
a) Admit the Petitioner as a Third-Party Intervenor in File No. ${v.fileNo || '____________'};
b) Order service of this petition on the original Plaintiff and Defendant;
c) Recognize and protect the Petitioner's lawful right over the disputed property/subject matter.

____________________________________
Third-Party Intervenor / Advocate`,
  },
  {
    id: 'cancellation-ex-parte-order',
    title: 'Application for Cancellation of Ex-Parte Order / Decree',
    amharicTitle: 'በሌለሁበት የተሰጠ ትዕዛዝ/ውሳኔ እንዲነሳ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/14966-application-for-cancellation-of-ex-parte-order.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 78',
    description: 'Application by a defendant to set aside an ex-parte order or decree within one month by proving non-service of summons or sufficient cause for non-appearance.',
    fields: [
      { id: 'courtName', label: 'Court Name & Bench', placeholder: 'e.g., Federal First Instance Court, Lideta Bench' },
      { id: 'fileNo', label: 'Court File Number & Ex-Parte Order Date', placeholder: 'e.g., File No. 110482, Ex-Parte Order dated Oct 25, 2026' },
      { id: 'applicantName', label: 'Applicant (Defendant) Full Name', placeholder: 'e.g., Ato Bereket Assefa' },
      { id: 'respondentName', label: 'Respondent (Plaintiff) Full Name', placeholder: 'e.g., Dashen Microfinance Institution' },
      { id: 'sufficientCause', label: 'Reasons for Non-Appearance / Improper Service of Summons (Art. 78)', type: 'textarea', placeholder: 'State why summons was not duly served or the unavoidable cause (illness, travel, force majeure) that prevented appearance on the hearing date...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
File No.: ${v.fileNo || '____________________'}
Date: ${v.date || '__________________'}

Applicant (Defendant): ${v.applicantName || '____________________________________'}
Respondent (Plaintiff): ${v.respondentName || '____________________________________'}

APPLICATION TO SET ASIDE EX-PARTE ORDER / DECREE
(Pursuant to Article 78 of the Civil Procedure Code of Ethiopia)

1. BACKGROUND:
On ${v.fileNo || '____________'}, this Honorable Court passed an order/judgment to proceed ex-parte against the Applicant. This application is filed within the statutory period prescribed under Article 78(1) of the Civil Procedure Code.

2. SUFFICIENT CAUSE FOR NON-APPEARANCE:
The Applicant was prevented from appearing when the suit was called on for hearing for the following lawful and sufficient reasons:
${v.sufficientCause || '________________________________________________________________________'}

3. PRAYER FOR RELIEF:
WHEREFORE, the Applicant respectfully prays that this Honorable Court:
a) Cancel and set aside the ex-parte order/decree pursuant to Article 78(2) of the Civil Procedure Code;
b) Admit the Applicant's Statement of Defense and appoint a day for hearing the suit on the merits.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'stay-of-execution-on-appeal',
    title: 'Application for Stay of Execution Pending Appeal',
    amharicTitle: 'ይግባኝ እስኪታይ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/6aac2-application-for-stay-of-execution-on-appeal.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 332–335',
    description: 'Urgent motion requesting the Appellate Court or Execution Court to stay execution of a decree pending the determination of an appeal to prevent irreparable loss.',
    fields: [
      { id: 'courtName', label: 'Appellate Court Name', placeholder: 'e.g., Federal High Court Appellate Bench' },
      { id: 'appealFileNo', label: 'Appellate File No. & Execution File No.', placeholder: 'e.g., Appeal File No. 55421 (Execution File No. 12904)' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor / Appellant)', placeholder: 'e.g., Zemen Engineering PLC' },
      { id: 'respondentName', label: 'Respondent (Decree-Holder)', placeholder: 'e.g., Ato Kassahun Bekele' },
      { id: 'substantialLoss', label: 'Proof of Substantial & Irreparable Loss if Executed (Art. 334)', type: 'textarea', placeholder: 'Explain how immediate execution (sale of attached business assets/bank accounts) will cause substantial loss and render the appeal nugatory...' },
      { id: 'securityOffered', label: 'Security / Guarantee Offered for Due Performance (Art. 334(1)(c))', placeholder: 'e.g., Bank Guarantee / Title Deed security covering the full decree amount' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL APPELLATE COURT OF ETHIOPIA'}
File No.: ${v.appealFileNo || '____________________'}
Date: ${v.date || '__________________'}

Applicant (Appellant): ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

URGENT APPLICATION FOR STAY OF EXECUTION PENDING APPEAL
(Pursuant to Articles 332–335 of the Civil Procedure Code of Ethiopia)

1. PENDING APPEAL & EXECUTION PROCEEDINGS:
The Applicant has lodged a Memorandum of Appeal in File No. ${v.appealFileNo || '____________'}, which has been admitted for hearing. Meanwhile, the Respondent has initiated execution proceedings.

2. SUBSTANTIAL LOSS & IRREPARABLE HARM (ART. 334(1)(a)):
Unless execution is stayed pending the determination of the appeal, the Applicant will suffer substantial and irreparable loss for the following reasons:
${v.substantialLoss || '________________________________________________________________________'}

3. UNDERTAKING OF SECURITY (ART. 334(1)(c)):
The Applicant has made this application without unreasonable delay and is ready and willing to furnish security as follows:
${v.securityOffered || 'Full security as ordered by the Honorable Court for the due performance of such decree as may ultimately be binding.'}

4. PRAYER FOR ORDER:
WHEREFORE, the Applicant prays for an immediate interim and final order staying execution proceedings until the appeal is finally decided.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'paupers-petition',
    title: "Pauper's Petition (Application to Sue In Forma Pauperis)",
    amharicTitle: 'በድህነት (ያለ ዳኝነት ክፍያ) ክስ ለማቅረብ የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/7549a-paupers-petition.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 467–476',
    description: 'Application supported by affidavit requesting exemption from court filing fees on the ground that the applicant lacks sufficient means to pay the prescribed court fee.',
    fields: [
      { id: 'courtName', label: 'Court Name', placeholder: 'e.g., Federal First Instance Court' },
      { id: 'applicantName', label: 'Applicant Full Name & Address', placeholder: 'e.g., W/ro Marta Tadesse, Kolfe Keranio Sub-City, Woreda 07' },
      { id: 'respondentName', label: 'Intended Defendant Name', placeholder: 'e.g., ABC Transport Share Company' },
      { id: 'claimAmount', label: 'Amount of Claim & Required Court Fee', placeholder: 'e.g., Claim of ETB 850,000.00 (Court Fee: ETB 18,200.00)' },
      { id: 'financialStatus', label: 'Declaration of Income & Property (Affidavit of Means)', type: 'textarea', placeholder: 'State current monthly income (if any), dependents, and confirm that the Applicant possesses no disposable property other than basic personal apparel...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR PERMISSION TO SUE AS A PAUPER (IN FORMA PAUPERIS)
(Pursuant to Articles 467–470 of the Civil Procedure Code of Ethiopia)

1. SUBJECT MATTER OF THE SUIT:
The Applicant has annexed hereto a Statement of Claim against the Respondent for ${v.claimAmount || '________________________'}.

2. STATEMENT OF INSUFFICIENT MEANS (AFFIDAVIT):
Pursuant to Article 467 of the Civil Procedure Code, the Applicant solemnly declares that they are not possessed of sufficient means to enable them to pay the prescribed court fee:
${v.financialStatus || '________________________________________________________________________'}
The Applicant has not entered into any agreement with reference to the subject matter of the proposed suit under which any other person has obtained an interest, nor transferred any property within the preceding two months to qualify as a pauper.

3. PRAYER:
WHEREFORE, the Applicant prays that this Honorable Court examine the evidence/Kebele social court verification annexed hereto and grant permission to institute the suit without payment of court fees.

Sworn and signed by Applicant: ___________________________`,
  },
  {
    id: 'joinder-of-third-party',
    title: 'Petition for Joinder of Third Party',
    amharicTitle: 'ሦስተኛ ወገን ወደ ክርክሩ እንዲገባ የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/75ee1-petition-for-joinder-of-thrid-party.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 43',
    description: 'Application by a defendant requesting the court to join a third party from whom the defendant claims contribution or indemnity.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 176320' },
      { id: 'defendantApplicant', label: 'Applicant (Defendant) Name', placeholder: 'e.g., Awash Insurance S.C.' },
      { id: 'plaintiffName', label: 'Plaintiff Name', placeholder: 'e.g., Ato Ephrem Alemu' },
      { id: 'thirdPartyName', label: 'Third Party to be Joined (Name & Address)', placeholder: 'e.g., Ato Tarekegn Bekele, Addis Ababa, Nifas Silk Lafto' },
      { id: 'indemnityGrounds', label: 'Grounds for Contribution or Indemnity (Art. 43(1))', type: 'textarea', placeholder: 'State the legal or contractual basis showing why the Third Party is liable to indemnify or contribute to the Defendant...' },
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
In the statement of defense filed herein, the Defendant/Applicant shows that they are entitled to contribution and/or indemnity from the above-named Third Party on the following grounds:
${v.indemnityGrounds || '________________________________________________________________________'}

2. PRAYER FOR ORDER:
WHEREFORE, the Applicant prays that this Honorable Court issue a summons to the Third Party (${v.thirdPartyName || '____________________'}) together with a copy of the Statement of Claim and Statement of Defense pursuant to Article 43(2) of the Civil Procedure Code.

____________________________________
Defendant / Advocate for Defendant`,
  },
  {
    id: 'attachment-property-defendant',
    title: 'Application for Attachment of Property of Defendant Before Judgment',
    amharicTitle: 'ከፍርድ በፊት የተከሳሽ ንብረት እንዲከበር የሚቀርብ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/7c4d5-application-for-attachment-property-of-defendant.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 151–153',
    description: 'Urgent application supported by affidavit to attach the defendant’s movable/immovable property or bank accounts to prevent disposal of assets with intent to obstruct execution.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court Commercial Bench, File No. 204811' },
      { id: 'applicantName', label: 'Applicant (Plaintiff) Name', placeholder: 'e.g., Hibret Bank S.C. / Commercial Claimant' },
      { id: 'respondentName', label: 'Respondent (Defendant) Name', placeholder: 'e.g., Rift Valley Coffee Exporters PLC' },
      { id: 'propertyToAttach', label: 'Specific Property / Vehicle / Bank Account to be Attached & Value', type: 'textarea', placeholder: 'e.g., Toyota Land Cruiser Plate No. Code 3-A88219 AA and funds up to ETB 3,500,000.00 held in Commercial Bank of Ethiopia...' },
      { id: 'riskOfDisposal', label: 'Facts Showing Intent to Obstruct or Delay Execution (Art. 151(1))', type: 'textarea', placeholder: 'Detail evidence that the Defendant is about to dispose of the whole or part of their property or remove it from the court’s jurisdiction...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant (Plaintiff): ${v.applicantName || '____________________________________'}
Respondent (Defendant): ${v.respondentName || '____________________________________'}

APPLICATION FOR ATTACHMENT BEFORE JUDGMENT
(Pursuant to Articles 151–153 of the Civil Procedure Code of Ethiopia)

1. PROPERTY SPECIFIED FOR ATTACHMENT (ART. 151(2)):
The Applicant requests the conditional attachment of the following property belonging to the Respondent:
${v.propertyToAttach || '________________________________________________________________________'}

2. GROUNDS & AFFIDAVIT OF RISK OF DISPOSAL:
As verified by the attached affidavit, the Respondent, with intent to obstruct or delay the execution of any decree that may be passed against them, is about to dispose of or remove their property from the local limits of the Court's jurisdiction:
${v.riskOfDisposal || '________________________________________________________________________'}

3. PRAYER FOR CONDITIONAL ATTACHMENT:
WHEREFORE, the Applicant prays that this Honorable Court issue an immediate order of conditional attachment under Article 151(3) of the Civil Procedure Code directing the relevant registry/bank to freeze/attach the specified property until security is furnished or the suit is determined.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'pleading-injunction-exparte',
    title: 'Pleading for Injunction of Enforcement of Ex-Parte Judgment',
    amharicTitle: 'በሌለበት የተሰጠ ፍርድ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/9c685-pleading-for-injuction-of-enforcememnt-of-exparte-judgement.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 78 & Art. 154',
    description: 'Emergency motion to restrain enforcement and auction of assets while an application to set aside an ex-parte judgment is pending.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 190332' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor) Name', placeholder: 'e.g., Ato Henok Desta' },
      { id: 'respondentName', label: 'Respondent (Judgment-Creditor) Name', placeholder: 'e.g., Ato Mulugeta Taye' },
      { id: 'enforcementThreat', label: 'Imminent Enforcement Action & Irreparable Harm', type: 'textarea', placeholder: 'Describe the pending attachment/auction order and confirm that an Art. 78 application to set aside the ex-parte judgment has been duly filed...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

PLEADING FOR INJUNCTION OF ENFORCEMENT OF EX-PARTE JUDGMENT
(Pursuant to Articles 78 & 154 of the Civil Procedure Code of Ethiopia)

1. PENDING APPLICATION TO SET ASIDE EX-PARTE JUDGMENT:
The Applicant has filed a formal application under Article 78 of the Civil Procedure Code to set aside the ex-parte judgment rendered in this file.

2. IMMINENT ENFORCEMENT & IRREPARABLE INJURY:
${v.enforcementThreat || '________________________________________________________________________'}

3. PRAYER FOR TEMPORARY INJUNCTION:
WHEREFORE, the Applicant prays that this Honorable Court issue an immediate injunction restraining the enforcement of the ex-parte decree until the Applicant's Article 78 petition is heard and decided.

____________________________________
Applicant / Advocate for Applicant`,
  },
  {
    id: 'application-for-execution',
    title: 'Application for Execution of Decree (የፍርድ አፈጻጸም ማመልከቻ)',
    amharicTitle: 'የፍርድ አፈጻጸም መጠየቂያ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/aa66b-application-for-execution.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 378',
    description: 'Statutory tabular application to execute a final court judgment by attachment and sale of the judgment-debtor’s property or transfer of funds.',
    fields: [
      { id: 'courtName', label: 'Execution Court Name', placeholder: 'e.g., Federal High Court Execution Bench' },
      { id: 'suitNo', label: 'Original Suit File No. & Date of Decree', placeholder: 'e.g., Civil File No. 164920, Decree dated Sept 18, 2026' },
      { id: 'decreeHolder', label: 'Decree-Holder (Applicant) Name & Address', placeholder: 'e.g., Lucy Trading PLC, Addis Ababa' },
      { id: 'judgmentDebtor', label: 'Judgment-Debtor (Respondent) Name & Address', placeholder: 'e.g., Ato Alemayehu Bekele, Addis Ababa' },
      { id: 'whetherAppeal', label: 'Whether Any Appeal Has Been Preferred From the Decree', placeholder: 'e.g., No appeal or stay of execution order has been issued', defaultValue: 'No appeal or stay of execution order has been issued.' },
      { id: 'amountDue', label: 'Total Amount of Debt / Compensation & Costs Due (ETB)', placeholder: 'e.g., Principal ETB 1,200,000 + 9% Legal Interest + ETB 45,000 Costs' },
      { id: 'modeOfAssistance', label: 'Mode in Which Court Assistance is Required (Art. 378(3)(j))', type: 'textarea', placeholder: 'e.g., Issue execution summons under Art. 386 and attach/transfer funds from Judgment-Debtor’s bank accounts or auction attached property...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL EXECUTION COURT OF ETHIOPIA'}
ADDIS ABABA

Execution File No.: ____________________
Date: ${v.date || '__________________'}

APPLICATION FOR EXECUTION OF DECREE
(Submitted Pursuant to Article 378 of the Civil Procedure Code of Ethiopia)

1. Number of the Suit & Date of Decree: ${v.suitNo || '____________________________________'}
2. Names of the Parties:
   - Decree-Holder (Applicant): ${v.decreeHolder || '____________________________________'}
   - Judgment-Debtor (Respondent): ${v.judgmentDebtor || '____________________________________'}
3. Whether any appeal has been preferred from the decree: ${v.whetherAppeal || 'None'}
4. Whether any payment or adjustment has been made subsequent to the decree: None
5. Previous applications for execution (if any): First Application
6. Amount of debt/compensation and costs due under the decree:
   ${v.amountDue || '________________________________________________________________________'}
7. Name of person against whom execution is sought: ${v.judgmentDebtor || '________________________'}
8. Mode in which the assistance of the Court is required (Art. 378(3)(j)):
   ${v.modeOfAssistance || '________________________________________________________________________'}

I, the undersigned Decree-Holder/Advocate, declare that what is stated herein is true to the best of my knowledge and belief.

____________________________________
Decree-Holder / Advocate`,
  },
  {
    id: 'injunction-order',
    title: 'Application for Temporary Injunction Order (የዕግድ ትዕዛዝ ማመልከቻ)',
    amharicTitle: 'ጊዜያዊ የዕግድ ትዕዛዝ እንዲሰጥ የቀረበ ማመልከቻ',
    category: 'Application',
    sourceFile: 'Application/b94e6-injunction-order.docx',
    legalBasis: 'Ethiopian Civil Procedure Code Art. 154–155',
    description: 'Application for a temporary injunction to restrain a party from wasting, damaging, alienating, or wrongfully selling property in dispute.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', placeholder: 'e.g., Federal High Court, File No. 221094' },
      { id: 'applicantName', label: 'Applicant Name', placeholder: 'e.g., Ato Yared Tsegaye' },
      { id: 'respondentName', label: 'Respondent Name', placeholder: 'e.g., W/ro Roman Gebre' },
      { id: 'propertyInDispute', label: 'Description of Disputed Property / Subject Matter', placeholder: 'e.g., Immovable residential property in Bole Sub-City, Woreda 09, Plot No. 882/09' },
      { id: 'groundsForInjunction', label: 'Grounds Showing Danger of Alienation, Waste, or Damage (Art. 154)', type: 'textarea', placeholder: 'State the specific acts showing that the property in dispute is in danger of being wasted, damaged, or alienated by the Respondent...' },
      { id: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `IN THE ${v.courtName?.toUpperCase() || 'FEDERAL COURT OF ETHIOPIA'}
Date: ${v.date || '__________________'}

Applicant: ${v.applicantName || '____________________________________'}
Respondent: ${v.respondentName || '____________________________________'}

APPLICATION FOR TEMPORARY INJUNCTION ORDER
(Pursuant to Articles 154 & 155 of the Civil Procedure Code of Ethiopia)

1. PROPERTY IN DISPUTE:
${v.propertyInDispute || '________________________________________________________________________'}

2. GROUNDS FOR TEMPORARY INJUNCTION (AFFIDAVIT ATTACHED):
Pursuant to Article 154(a) of the Civil Procedure Code, the property in dispute in the suit is in imminent danger of being wasted, damaged, or alienated by the Respondent:
${v.groundsForInjunction || '________________________________________________________________________'}

3. PRAYER FOR ORDER:
WHEREFORE, the Applicant respectfully prays that this Honorable Court grant an immediate Temporary Injunction Order restraining the Respondent and any third-party registry from transferring, mortgaging, or altering the status of the disputed property until final disposal of the suit.

____________________________________
Applicant / Advocate for Applicant`,
  },

  // 4. BUSINESS FORMS
  {
    id: 'plc-articles-of-association',
    title: 'Memorandum & Articles of Association for Private Limited Company (PLC)',
    amharicTitle: 'ኃላፊነቱ የተወሰነ የግል ማኅበር መመሥረቻ ጽሑፍ',
    category: 'Business Forms',
    sourceFile: 'Business Forms/article of association for plc.doc',
    legalBasis: 'Commercial Code of Ethiopia Proclamation No. 1243/2021 (Art. 495–533)',
    description: 'Complete corporate formation instrument for a Private Limited Company (PLC) ready for authentication at DARS and Ministry of Trade & Regional Integration registration.',
    fields: [
      { id: 'companyName', label: 'Company Name (PLC)', placeholder: 'e.g., Blue Nile Tech Solutions Private Limited Company' },
      { id: 'headOffice', label: 'Head Office Address', placeholder: 'e.g., Addis Ababa, Bole Sub-City, Woreda 03, House No. New' },
      { id: 'businessObjectives', label: 'Business Objectives / Purposes of the Company', type: 'textarea', placeholder: 'e.g., 1. Software development and IT consultancy services;\n2. Import and distribution of technology equipment...' },
      { id: 'capitalAmount', label: 'Total Paid-Up Capital (ETB) & Par Value of Shares', placeholder: 'e.g., ETB 500,000.00 divided into 500 shares of ETB 1,000.00 par value each' },
      { id: 'shareholdersList', label: 'Founding Shareholders, Nationality & Share Allocation', type: 'textarea', placeholder: '1. Ato Abebe Kebede (Ethiopian) — 300 Shares (ETB 300,000)\n2. W/ro Sara Tadesse (Ethiopian) — 200 Shares (ETB 200,000)' },
      { id: 'generalManager', label: 'Appointed General Manager Full Name', placeholder: 'e.g., Ato Abebe Kebede' },
      { id: 'date', label: 'Execution Date', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateDocument: (v) => `MEMORANDUM OF ASSOCIATION OF
${v.companyName?.toUpperCase() || '____________________________________ PLC'}
(Established Pursuant to Commercial Code Proclamation No. 1243/2021)

Article 1 — Establishment & Company Name
The undersigned members hereby establish a Private Limited Company under the Commercial Code of Ethiopia (Proclamation No. 1243/2021) under the name:
"${v.companyName || '____________________________________ Private Limited Company'}"

Article 2 — Head Office
The Head Office of the Company is situated in ${v.headOffice || 'Addis Ababa, Ethiopia'}, with authority to open branch offices anywhere in Ethiopia or abroad.

Article 3 — Business Purposes & Objectives
The Company is established to engage in the following commercial activities:
${v.businessObjectives || '________________________________________________________________________'}

Article 4 — Capital & Shareholding Structure
The total capital of the Company is ${v.capitalAmount || 'ETB ________________'}, fully paid up in cash and deposited in a blocked bank account. The shares are allocated among the members as follows:
${v.shareholdersList || '________________________________________________________________________'}
The members are liable only to the extent of their respective contributions.

Article 5 — Management of the Company
1. The Company shall be managed by a General Manager appointed by the members.
2. The first General Manager of the Company is ${v.generalManager || '________________________'}, who shall serve until replaced by resolution of the shareholders.
3. Powers of the General Manager include opening and operating bank accounts, signing contracts, hiring employees, and representing the Company before courts and government authorities.

Article 6 — Fiscal Year, Reserve Fund & Audit
The fiscal year of the Company shall run from Hamle 1 to Sene 30 of the Ethiopian Calendar. At least 5% of net profits shall be transferred annually to the Legal Reserve Fund until it reaches 10% of the capital pursuant to the Commercial Code.

IN WITNESS WHEREOF, the Founding Shareholders have signed this Memorandum of Association on ${v.date || '__________________'}.

FOUNDING SHAREHOLDERS SIGNATURES:
1. ___________________________
2. ___________________________`,
  },
];

export default function LexDraftPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<LegalTemplate>(ETHIOPIAN_LEGAL_TEMPLATES[0]);
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
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amharicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.legalBasis.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFieldChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const selectTemplate = (template: LegalTemplate) => {
    setActiveTemplate(template);
    const defaults: Record<string, string> = {};
    template.fields.forEach((f) => {
      if (f.defaultValue) defaults[f.id] = f.defaultValue;
    });
    setFormValues(defaults);
  };

  const generatedText = activeTemplate.generateDocument(formValues);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="bg-[#0A1128] text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LegalLink" className="w-8 h-8 object-contain" />
            <span className="font-black text-xl tracking-tight">
              Legal<span className="text-amber-400">Link</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full ml-1">
              LexDraft Studio
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/find-a-lawyer" className="hover:text-white transition-colors">Find an Advocate</Link>
            <Link href="/library" className="hover:text-white transition-colors">Proclamations Library</Link>
            <Link href="/nextgen" className="hover:text-white transition-colors">NextGen Internships</Link>
          </nav>

          <Link
            href="/find-a-lawyer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold text-xs rounded-xl transition-all"
          >
            Book Advocate Review
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#0A1128] text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Ethiopian Court Pleadings, Appeals, Agency & Corporate Forms</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              LexDraft Automated Ethiopian Legal Forms
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Select a court pleading, appeal petition, power of attorney, or PLC formation template below. Answer the guided legal questionnaire to generate and download a ready-to-file Word document (`.doc`).
            </p>
          </div>

          {/* Search & Category Pills */}
          <div className="mt-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-[#0A1128] shadow-sm'
                      : 'bg-white/10 text-slate-300 hover:bg-white/15'
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
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Template Selector List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Available Legal Forms ({filteredTemplates.length})
              </h2>
            </div>

            <div className="space-y-2.5 max-h-[760px] overflow-y-auto pr-1">
              {filteredTemplates.map((template) => {
                const isSelected = activeTemplate.id === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#0A1128] ring-2 ring-[#0A1128]/10 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {template.category}
                      </span>
                      <Link
                        href={`/lexdraft/${template.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
                      >
                        <span>Full Page</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <h3 className="text-sm font-black text-[#0A1128] leading-snug">
                      {template.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {template.amharicTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{template.legalBasis.split('&')[0]}</span>
                      <span className="font-bold text-[#0A1128]">Select →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Questionnaire + Live Document Preview (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Questionnaire Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {activeTemplate.category} • {activeTemplate.legalBasis}
                  </span>
                  <h2 className="text-xl font-black text-[#0A1128] mt-2">
                    {activeTemplate.title}
                  </h2>
                  <p className="text-xs text-emerald-700 font-bold">
                    {activeTemplate.amharicTitle}
                  </p>
                </div>

                <Link
                  href={`/lexdraft/${activeTemplate.id}`}
                  className="px-4 py-2.5 bg-[#0A1128] hover:bg-[#102A43] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shrink-0 self-start"
                >
                  <span>Open Dedicated Wizard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>

              {/* Dynamic Form Questions */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Step 1: Answer Required Form Questions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTemplate.fields.map((field) => (
                    <div
                      key={field.id}
                      className={field.type === 'textarea' ? 'sm:col-span-2 space-y-1.5' : 'space-y-1.5'}
                    >
                      <label className="block text-xs font-bold text-slate-700">
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
            </div>

            {/* Live Generated Document Preview & Export */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#0A1128]">
                    Step 2: Live Court / Legal Document Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Automatically formatted from your answers above
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadWord}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Word (.doc)</span>
                  </button>
                </div>
              </div>

              <pre className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-serif text-slate-900 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {generatedText}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}