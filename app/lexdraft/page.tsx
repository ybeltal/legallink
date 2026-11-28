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
  Globe,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export type DocLanguageMode = 'am' | 'en' | 'bilingual';

export interface TemplateField {
  id: string;
  label: string;
  amharicLabel?: string;
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
  generateAmharicDocument: (values: Record<string, string>) => string;
  generateDocument: (values: Record<string, string>) => string;
}

export function getFormattedDocument(
  template: LegalTemplate,
  values: Record<string, string>,
  mode: DocLanguageMode
): string {
  const amText = template.generateAmharicDocument(values);
  const enText = template.generateDocument(values);

  if (mode === 'am') return amText;
  if (mode === 'en') return enText;
  return `${amText}\n\n========================================================================\n\n${enText}`;
}

export const ETHIOPIAN_LEGAL_TEMPLATES: LegalTemplate[] = [
  // ===========================================================================
  // 1. AGENCY & POWER OF ATTORNEY (3 ARCHIVE FORMS)
  // ===========================================================================
  {
    id: 'agency-attorney',
    aliases: ['power-of-attorney', 'poa', 'advocate-agency'],
    title: 'Power of Attorney for Advocate Representation',
    amharicTitle: 'የጠበቃ ውክልና ማስረጃ (agency( attorney).doc)',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/agency( attorney).doc',
    legalBasis: 'የፍትሐ ብሔር ሕግ ቁጥር 2199–2233 እና አዋጅ ቁጥር 1249/2013',
    description:
      'Authorizes a licensed Federal or Regional Advocate to represent a client before all regular courts, cassation benches, and administrative tribunals.',
    fields: [
      { id: 'principalName', label: 'Principal (Client) Full Name', amharicLabel: 'የወካይ (ደንበኛ) ሙሉ ስም', placeholder: 'ምሳሌ፡ አቶ አበበ ከበደ ተስፋዬ / Ato Abebe Kebede' },
      { id: 'principalAddress', label: 'Principal Address (City, Sub-City, Woreda, House No.)', amharicLabel: 'የወካይ አድራሻ (ከተማ፣ ክ/ከተማ፣ ወረዳ፣ የቤት ቁጥር)', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ወረዳ 03፣ የቤት ቁ. 412' },
      { id: 'advocateName', label: 'Appointed Advocate Full Name', amharicLabel: 'የተወካይ ጠበቃ ሙሉ ስም', placeholder: 'ምሳሌ፡ ጠበቃ ሰለሞን ታደሰ / Advocate Solomon Tadesse' },
      { id: 'licenseNo', label: 'Ministry of Justice Advocate License No.', amharicLabel: 'የፍትሕ ሚኒስቴር የጥብቅና ፈቃድ ቁጥር', placeholder: 'ምሳሌ፡ MOJ/FED/1842/2021' },
      { id: 'advocateAddress', label: 'Advocate Chamber Address & Phone', amharicLabel: 'የጠበቃው አድራሻ እና ስልክ ቁጥር', placeholder: 'ምሳሌ፡ ልደታ ክ/ከተማ፣ ወረዳ 08፣ ስልክ፡ +251911...' },
      { id: 'scopeOfMatter', label: 'Specific Case / Legal Matter Authorized', amharicLabel: 'ውክልና የተሰጠበት የክርክር / የሕግ ጉዳይ ዝርዝር', type: 'textarea', placeholder: 'ምሳሌ፡ በፌዴራል ፍርድ ቤቶች የውል ክርክር ክስ ለመመሥረት፣ መልስ ለመስጠት፣ ይግባኝ እና ሰበር ለማቅረብ...' },
      { id: 'date', label: 'Date of Execution', amharicLabel: 'ውክልናው የተሰጠበት ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
የሰነዶች ማረጋገጫና ምዝገባ አገልግሎት
የጠበቃ ውክልና ማስረጃ
(በፍትሐ ብሔር ሕግ ቁጥር 2199 እና በአዋጅ ቁጥር 1249/2013 መሠረት የተዘጋጀ)

ቀን፡ ${v.date || '__________________'}

1. ወካይ (ውክልና ሰጪ)፡
ሙሉ ስም፡ ${v.principalName || '____________________________________'}
አድራሻ፡ ${v.principalName ? v.principalAddress || 'አዲስ አበባ' : '____________________________________'}

2. ተወካይ (ሕጋዊ ጠበቃ)፡
ሙሉ ስም፡ ${v.advocateName || '____________________________________'}
የጥብቅና ፈቃድ ቁጥር፡ ${v.licenseNo || '________________________'}
አድራሻና ስልክ፡ ${v.advocateAddress || '____________________________________'}

3. የተሰጠው የውክልና ሥልጣን ዝርዝር፡
እኔ ስሜ ከላይ የተጠቀሰው ወካይ፣ ተወካይ የሆኑት ጠበቃ በእኔ ስምና ምትክ ሆነው በሚከተለው ጉዳይ ላይ እንዲወክሉኝ ሙሉ የጥብቅና ውክልና ሰጥቻቸዋለሁ፦
${v.scopeOfMatter || 'በማናቸውም የፌዴራልም ሆነ የክልል የመጀመሪያ ደረጃ፣ ከፍተኛ እና ጠቅላይ ፍርድ ቤት (ሰበር ሰሚ ችሎትን ጨምሮ) እንዲሁም በአስተዳደር ጉባኤዎች ቀርበው እንዲከራከሩልኝ።'}

4. የጠበቃው ዝርዝር ሥልጣን፡
በፍትሐ ብሔር ሕግ ቁጥር 2204 እና 2205 መሠረት ተወካይ ጠበቃው፦
ሀ) የክስ ማመልከቻ፣ የመከላከያ መልስ፣ የተከሳሽ ክስ፣ የይግባኝ ቅሬታ እና የሰበር አቤቱታ አዘጋጅተው የመፈረምና የማቅረብ፤
ለ) በማናቸውም ፍርድ ቤት ቀርበው የቃልና የጽሑፍ ክርክር የማድረግ፣ ማስረጃ የማቅረብና ምስክሮችን የማሰማት፤
ሐ) የዕግድ ትዕዛዝ፣ የንብረት ማስከበሪያ እና የፍርድ አፈጻጸም ማመልከቻ የማቅረብና የማስፈጸም፤
መ) የፍርድ ቤት መጥሪያዎችን፣ ትዕዛዞችንና የውሳኔ ግልባጮችን የመቀበል ሙሉ ሥልጣን ተሰጥቷቸዋል።

የወካይ ፊርማ፡ _______________________
ስም፡ ${v.principalName || '_______________________'}

የተወካይ (ጠበቃ) ፊርማ፡ _______________________
ስም፡ ${v.advocateName || '_______________________'}

ምስክሮች፡
1. ___________________________   ፊርማ፡ _____________
2. ___________________________   ፊርማ፡ _____________`,
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
    aliases: ['property-agency', 'administration-agency'],
    title: 'General Agency for Property & Business Administration',
    amharicTitle: 'የንብረት እና የሥራ አስተዳደር ውክልና (Agency( for administration).docx)',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/Agency( for administration).docx',
    legalBasis: 'የፍትሐ ብሔር ሕግ ቁጥር 2203–2204 (የአስተዳደር ውክልና)',
    description:
      'Grants authority to an agent to manage immovable property, sign leases, collect rent, pay taxes, and handle municipal and utility matters.',
    fields: [
      { id: 'principalName', label: 'Principal (Property Owner) Full Name', amharicLabel: 'የወካይ (የንብረቱ ባለቤት) ሙሉ ስም', placeholder: 'ምሳሌ፡ ወ/ሮ አልማዝ በቀለ / W/ro Almaz Bekele' },
      { id: 'principalAddress', label: 'Principal Address', amharicLabel: 'የወካይ አድራሻ', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ ቂርቆስ ክ/ከተማ፣ ወረዳ 02' },
      { id: 'agentName', label: 'Agent (Representative) Full Name', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'ምሳሌ፡ አቶ ዳዊት ከበደ / Ato Dawit Kebede' },
      { id: 'agentAddress', label: 'Agent Address & ID Number', amharicLabel: 'የተወካይ አድራሻ እና መታወቂያ ቁጥር', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ የካ ክ/ከተማ፣ ወረዳ 05' },
      { id: 'propertyDetails', label: 'Property / Business Under Administration (Title Deed / Plot No.)', amharicLabel: 'የሚተዳደረው ንብረት / ድርጅት ዝርዝር (የካርታ ቁጥር)', type: 'textarea', placeholder: 'ምሳሌ፡ በቦሌ ክ/ከተማ ወረዳ 04 የሚገኝ የካርታ ቁጥር BL/10294/2018 የሆነ ሕንፃ...' },
      { id: 'date', label: 'Date of Execution', amharicLabel: 'ውክልናው የተሰጠበት ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
የሰነዶች ማረጋገጫና ምዝገባ አገልግሎት
የንብረት እና የሥራ አስተዳደር ውክልና
(በፍትሐ ብሔር ሕግ ቁጥር 2199 እና 2204 መሠረት)

ቀን፡ ${v.date || '__________________'}

1. ወካይ (ውክልና ሰጪ)፡
ሙሉ ስም፡ ${v.principalName || '____________________________________'}
አድራሻ፡ ${v.principalAddress || '____________________________________'}

2. ተወካይ (ውክልና ተቀባይ)፡
ሙሉ ስም፡ ${v.agentName || '____________________________________'}
አድራሻና መታወቂያ፡ ${v.agentAddress || '____________________________________'}

3. ውክልና የተሰጠበት ንብረት / ሥራ ዝርዝር፡
${v.propertyDetails || '________________________________________________________________________'}

4. የተሰጠው የአስተዳደር ሥልጣን፡
ሀ) ከላይ የተጠቀሰውን ንብረት በፍትሐ ብሔር ሕግ ቁጥር 2204 መሠረት እስከ ሦስት (3) ዓመት ለሚደርስ ጊዜ የማከራየት፣ የኪራይ ውል የመፈረምና የኪራይ ገቢ የመሰብሰብ፤
ለ) በገቢዎች ሚኒስቴር፣ በመሬት ልማትና ማኔጅመንት፣ በውሃና ፍሳሽ፣ በኢትዮ ቴሌኮም እና በኤሌክትሪክ አገልግሎት መሥሪያ ቤቶች ወካይን ወክሎ የመቅረብ፤
ሐ) የመሬት ግብር፣ የኪራይ ገቢ ግብርና የአገልግሎት ክፍያዎችን የመክፈልና ክሊራንስ የመቀበል፤
መ) ንብረቱን የመጠበቅ፣ የማሳደስ እና ንብረቱን በሚመለከት ክርክር ሲነሳ ሕጋዊ እርምጃ የመውሰድ ሥልጣን ተሰጥቷል።

የወካይ ፊርማ፡ _______________________
የተወካይ ፊርማ፡ _______________________

ምስክሮች፡
1. ___________________________   ፊርማ፡ _____________
2. ___________________________   ፊርማ፡ _____________`,
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
  {
    id: 'general-special-agency',
    aliases: ['agency', 'special-agency'],
    title: 'Special & General Power of Attorney (ውክልና)',
    amharicTitle: 'ልዩ እና አጠቃላይ የውክልና ማስረጃ (agency.doc)',
    category: 'Agency & Power of Attorney',
    sourceFile: 'Agency & Power of Attorney/agency.doc',
    legalBasis: 'የፍትሐ ብሔር ሕግ ቁጥር 2205 (ልዩ ውክልና)',
    description:
      'Comprehensive Power of Attorney authorizing specific acts of disposition, banking operations, contract signing, and representation before government organs.',
    fields: [
      { id: 'principalName', label: 'Principal Full Name & Nationality', amharicLabel: 'የወካይ ሙሉ ስም እና ዜግነት', placeholder: 'ምሳሌ፡ አቶ ይበልጣል ሰማኝ / Ato Ybeltal Semagn' },
      { id: 'principalAddress', label: 'Principal Address', amharicLabel: 'የወካይ አድራሻ', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ ቦሌ ክ/ከተማ' },
      { id: 'agentName', label: 'Appointed Agent Full Name', amharicLabel: 'የተወካይ ሙሉ ስም', placeholder: 'ምሳሌ፡ አቶ ዳንኤል ተሾመ' },
      { id: 'agentAddress', label: 'Agent Address & Phone', amharicLabel: 'የተወካይ አድራሻ እና ስልክ', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ ንፋስ ስልክ ላፍቶ ክ/ከተማ' },
      { id: 'specialMandate', label: 'Specific Acts Authorized (Sale, Purchase, Bank, Vehicle, etc.)', amharicLabel: 'ተወካዩ እንዲፈጽም የተሰጠው ዝርዝር ሥልጣን', type: 'textarea', placeholder: 'ምሳሌ፡ በወካይ ስም የሚገኝ ተሽከርካሪ/ቤት ለመሸጥ፣ ውል ለመዋዋል፣ ገንዘብ ከባንክ ለማውጣትና ለማስገባት...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
የሰነዶች ማረጋገጫና ምዝገባ አገልግሎት
ልዩ እና አጠቃላይ የውክልና ማስረጃ
(በፍትሐ ብሔር ሕግ ቁጥር 2199 እና 2205 መሠረት)

ቀን፡ ${v.date || '__________________'}

ወካይ፡ ${v.principalName || '____________________________________'}
አድራሻ፡ ${v.principalAddress || '____________________________________'}

ተወካይ፡ ${v.agentName || '____________________________________'}
አድራሻ፡ ${v.agentAddress || '____________________________________'}

የውክልናው ዝርዝር ጭብጥ፡
እኔ ወካይ በፍትሐ ብሔር ሕግ ቁጥር 2205 መሠረት ተወካዬ በእኔ ስምና ምትክ ሆነው የሚከተሉትን ተግባራት እንዲፈጽሙ ልዩና ሙሉ የውክልና ሥልጣን ሰጥቻለሁ፦
${v.specialMandate || '________________________________________________________________________'}

ከዚህ በላይ ለተገለጸው ጉዳይ አስፈላጊ የሆኑ ሰነዶችን እንዲፈርሙ፣ ክፍያ እንዲፈጽሙና እንዲቀበሉ፣ በሰነዶች ማረጋገጫና ምዝገባ አገልግሎት እና በሚመለከታቸው የመንግሥት መሥሪያ ቤቶች ቀርበው ጉዳዩን እንዲያስፈጽሙ ወክያቸዋለሁ።

የወካይ ፊርማ፡ _______________________
የተወካይ ፊርማ፡ _______________________

ምስክሮች፡
1. ___________________________   ፊርማ፡ _____________
2. ___________________________   ፊርማ፡ _____________`,
    generateDocument: (v) => `SPECIAL AND GENERAL POWER OF ATTORNEY
(Pursuant to Articles 2199 & 2205 of the Civil Code of Ethiopia)

Date: ${v.date || '__________________'}

Principal: ${v.principalName || '____________________________________'}
Address: ${v.principalAddress || '____________________________________'}

Agent (Attorney-in-Fact): ${v.agentName || '____________________________________'}
Address: ${v.agentAddress || '____________________________________'}

SPECIAL MANDATE GRANTED:
Pursuant to Article 2205 of the Ethiopian Civil Code, the Principal hereby grants express authority to the Agent to execute the following acts on the Principal's behalf:
${v.specialMandate || '________________________________________________________________________'}

The Agent is authorized to sign all required contracts, authenticate documents before DARS, make and receive payments, and appear before any government authority to give full effect to this mandate.

Principal Signature: _______________________   Agent Signature: _______________________`,
  },

  // ===========================================================================
  // 2. APPEAL FORMS (4 ARCHIVE FORMS)
  // ===========================================================================
  {
    id: 'petition-leave-to-appeal',
    aliases: ['leave-to-appeal'],
    title: 'Petition for Leave to Appeal',
    amharicTitle: 'ይግባኝ ለማቅረብ ፈቃድ መጠየቂያ አቤቱታ (0987b-petition-for-leave-to-appeal.docx)',
    category: 'Appeal',
    sourceFile: 'Appeal/0987b-petition-for-leave-to-appeal.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 325–326',
    description:
      'Formal petition requesting leave to file an appeal out of time or where special leave of the appellate court is procedurally required.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', amharicLabel: 'ይግባኙ የሚቀርብለት ፍርድ ቤት ስም', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት ይግባኝ ሰሚ ችሎት — አዲስ አበባ' },
      { id: 'applicantName', label: 'Applicant (Intended Appellant) Name & Address', amharicLabel: 'የአመልካች (ይግባኝ ባይ) ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ ግርማ ታደሰ፣ ቦሌ ክ/ከተማ፣ ወረዳ 06' },
      { id: 'respondentName', label: 'Respondent Name & Address', amharicLabel: 'የተጠሪ (መልስ ሰጪ) ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ ሆራይዘን ትሬዲንግ ኃ/የተ/የግ/ማኅበር' },
      { id: 'lowerCourtFile', label: 'Lower Court Name, File No. & Judgment Date', amharicLabel: 'ውሳኔ የሰጠው የሥር ፍርድ ቤት፣ የመዝገብ ቁጥር እና ቀን', placeholder: 'ምሳሌ፡ የፌዴራል የመጀመሪያ ደረጃ ፍ/ቤት መዝገብ ቁ. 142890፣ ጥቅምት 2 ቀን 2019 ዓ.ም.' },
      { id: 'groundsForLeave', label: 'Grounds / Good Cause for Requesting Leave to Appeal', amharicLabel: 'ይግባኝ በጊዜው ያልቀረበበት በቂ ምክንያት / የፈቃድ መጠየቂያ ዝርዝር', type: 'textarea', placeholder: 'ምሳሌ፡ የውሳኔ ግልባጭ ከፍርድ ቤቱ ሬጅስትራር በወቅቱ ባለመድረሱ ምክንያት...' },
      { id: 'date', label: 'Filing Date', amharicLabel: 'ማመልከቻው የቀረበበት ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.appellateCourt || 'ለፌዴራል ከፍተኛ ፍርድ ቤት ይግባኝ ሰሚ ችሎት'}
አዲስ አበባ

የመዝገብ ቁጥር፡ ____________________
ቀን፡ ${v.date || '__________________'}

አመልካች፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 325 እና 326 መሠረት
ይግባኝ ለማቅረብ ፈቃድ እንዲሰጥ የቀረበ አቤቱታ

1. ይግባኝ የሚባልበት የሥር ፍርድ ቤት ውሳኔ፡
ይህ አቤቱታ የቀረበው በ${v.lowerCourtFile || '________________________'} ላይ ይግባኝ ለማቅረብ እንዲፈቀድልኝ ነው።

2. ይግባኝ ለማቅረብ ፈቃድ የተጠየቀበት በቂና ሕጋዊ ምክንያት፡
${v.groundsForLeave || '________________________________________________________________________'}

3. አመልካች የሚጠይቀው ዳኝነት፡
ፍርድ ቤቱ ከላይ የቀረበውን በቂ ምክንያትና ከዚህ አቤቱታ ጋር የተያያዘውን ማስረጃ መርምሮ፣ አብሮ የቀረበውን የይግባኝ ቅሬታ ተቀብሎ መዝገብ እንዲከፈትና ለተጠሪ መጥሪያ እንዲላክ ትዕዛዝ እንዲሰጥልኝ በአክብሮት አመለክታለሁ።

አመልካች / የአመልካች ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'ለፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት የቀረበ አቤቱታ (b953b-application-for-cassation.docx)',
    category: 'Appeal',
    sourceFile: 'Appeal/b953b-application-for-cassation.docx',
    legalBasis: 'የኢ.ፌ.ዲ.ሪ ሕገ-መንግሥት አንቀጽ 80(3)(ሀ) እና አዋጅ ቁጥር 1234/2013',
    description:
      'Petition to the Federal Supreme Court Cassation Division alleging a basic and fundamental error of law (መሠረታዊ የሕግ ስህተት) in a final decision.',
    fields: [
      { id: 'applicantName', label: 'Applicant (Petitioner) Name & Address', amharicLabel: 'የአመልካች ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ ናይል ኮንስትራክሽን ኃ/የተ/የግ/ማኅበር፣ አዲስ አበባ' },
      { id: 'respondentName', label: 'Respondent Name & Address', amharicLabel: 'የተጠሪ ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ ተሾመ ኃይሉ፣ አዲስ አበባ' },
      { id: 'contestedDecisions', label: 'Lower Courts & File Numbers Being Challenged', amharicLabel: 'ቅሬታ የቀረበባቸው የሥር ፍርድ ቤቶችና የመዝገብ ቁጥሮች', placeholder: 'ምሳሌ፡ የፌዴራል ከፍተኛ ፍ/ቤት መዝገብ ቁ. 98210 እና ጠቅላይ ፍ/ቤት መዝገብ ቁ. 20194' },
      { id: 'fundamentalError', label: 'Statement of Fundamental Error of Law (መሠረታዊ የሕግ ስህተት)', amharicLabel: 'የተፈጸመው መሠረታዊ የሕግ ስህተት ዝርዝር', type: 'textarea', placeholder: 'የተጣሰውን የሕግ አንቀጽ ወይም አስገዳጅ የሰበር ውሳኔ በዝርዝር ይግለጹ...' },
      { id: 'reliefSought', label: 'Specific Cassation Relief Sought', amharicLabel: 'አመልካች የሚጠይቀው የሰበር ዳኝነት', type: 'textarea', placeholder: 'ምሳሌ፡ የሥር ፍርድ ቤት ውሳኔ ተሽሮ ክሱ ውድቅ እንዲደረግልኝ...' },
      { id: 'date', label: 'Date of Application', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `ለኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
ፌዴራል ጠቅላይ ፍርድ ቤት ሰበር ሰሚ ችሎት
አዲስ አበባ

የሰበር መዝገብ ቁጥር፡ ____________________
ቀን፡ ${v.date || '__________________'}

አመልካች፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በኢ.ፌ.ዲ.ሪ ሕገ-መንግሥት አንቀጽ 80(3)(ሀ) እና በፌዴራል ፍርድ ቤቶች አዋጅ ቁጥር 1234/2013 መሠረት
የቀረበ የሰበር አቤቱታ

1. የሰበር አቤቱታ የቀረበበት የመጨረሻ ውሳኔ፡
${v.contestedDecisions || '________________________________________________________________________'}
(የሥር ፍርድ ቤቶች ውሳኔ ግልባጭ ከዚህ አቤቱታ ጋር ተያይዟል።)

2. የተፈጸመው መሠረታዊ የሕግ ስህተት ዝርዝር (መሠረታዊ የሕግ ስህተት)፡
በሥር ፍርድ ቤት የተሰጠው የመጨረሻ ውሳኔ የሚከተሉትን መሠረታዊ የሕግ ስህተቶች የፈጸመ ነው፦
${v.fundamentalError || '________________________________________________________________________'}

3. አመልካች የሚጠይቀው ዳኝነት፡
ก) አቤቱታው መሠረታዊ የሕግ ስህተት የተፈጸመበት መሆኑ ታይቶ ለሰበር ሰሚ ችሎት እንዲቀርብና ተጠሪ መልስ እንዲሰጥበት እንዲታዘዝ፤
ለ) ${v.reliefSought || 'የሥር ፍርድ ቤት ውሳኔ ተሻሽሎ/ተሽሮ በሕጉ መሠረት ውሳኔ እንዲሰጥልኝና ወጪና ኪሳራ እንዲከፈለኝ በአክብሮት አመለክታለሁ።'}

አመልካች / የአመልካች ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'የይግባኝ ቅሬታ ማቅረቢያ (d01e9-memorandum-of-appeal.docx)',
    category: 'Appeal',
    sourceFile: 'Appeal/d01e9-memorandum-of-appeal.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 323 እና 327',
    description:
      'Appellate pleading setting forth the concise grounds of objection to a lower court judgment and the specific appellate relief sought.',
    fields: [
      { id: 'appellateCourt', label: 'Appellate Court Name', amharicLabel: 'ይግባኙ የሚቀርብለት ፍርድ ቤት', placeholder: 'ምሳሌ፡ ለፌዴራል ጠቅላይ ፍርድ ቤት ይግባኝ ሰሚ ችሎት' },
      { id: 'appellantName', label: 'Appellant Full Name & Address', amharicLabel: 'የይግባኝ ባይ ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቢሲኒያ ሎጂስቲክስ ኃ/የተ/የግ/ማኅበር' },
      { id: 'respondentName', label: 'Respondent Full Name & Address', amharicLabel: 'የመልስ ሰጪ ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ ሳሙኤል መኮንን' },
      { id: 'lowerCourtDetails', label: 'Lower Court Name, File No. & Date of Judgment', amharicLabel: 'ውሳኔ የሰጠው ፍርድ ቤት፣ የመዝገብ ቁጥር እና የውሳኔ ቀን', placeholder: 'ምሳሌ፡ የፌዴራል ከፍተኛ ፍ/ቤት መዝገብ ቁ. 88312' },
      { id: 'claimValue', label: 'Value of Subject Matter in Dispute (ETB)', amharicLabel: 'የክርክሩ የገንዘብ ግምት (በብር)', placeholder: 'ምሳሌ፡ ብር 2,450,000.00' },
      { id: 'groundsOfAppeal', label: 'Concise Grounds of Appeal (Art. 327)', amharicLabel: 'የይግባኝ ቅሬታ ነጥቦች ዝርዝር (አንቀጽ 327)', type: 'textarea', placeholder: '1. የሥር ፍርድ ቤት የቀረበውን የሰነድ ማስረጃ ሳይመረምር ማለፉ...\n2. የሕጉን ድንጋጌ በተሳሳተ መንገድ መተርጎሙ...' },
      { id: 'reliefSought', label: 'Appellate Relief Sought', amharicLabel: 'ይግባኝ ባይ የሚጠይቀው ዳኝነት', type: 'textarea', placeholder: 'ምሳሌ፡ የሥር ፍርድ ቤት ውሳኔ ተሽሮ በይግባኝ ባይ ላይ የተወሰነው ክፍያ እንዲቀር...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.appellateCourt || 'ለፌዴራል ጠቅላይ ፍርድ ቤት ይግባኝ ሰሚ ችሎት'}
አዲስ አበባ

የይግባኝ መዝገብ ቁጥር፡ ____________________
ቀን፡ ${v.date || '__________________'}

ይግባኝ ባይ፡ ${v.appellantName || '____________________________________'}
መልስ ሰጪ፡ ${v.respondentName || '____________________________________'}
የጉዳዩ ግምት፡ ${v.claimValue || '____________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 323 እና 327 መሠረት የቀረበ
የይግባኝ ቅሬታ ማመልከቻ

1. ይግባኝ የተባለበት ውሳኔ፡
ይህ ይግባኝ የቀረበው በ${v.lowerCourtDetails || '____________________________________'} በተሰጠው ውሳኔ ላይ ነው።

2. የይግባኝ ቅሬታ ነጥቦች ዝርዝር፡
${v.groundsOfAppeal || '________________________________________________________________________'}

3. ይግባኝ ባይ የሚጠይቀው ዳኝነት፡
${v.reliefSought || 'የሥር ፍርድ ቤት ውሳኔ ተሽሮ ወጪና ኪሳራ ለይግባኝ ባይ እንዲወሰን በአክብሮት አመለክታለሁ።'}

ማረጋገጫ፡ በዚህ የይግባኝ ማመልከቻ ላይ የተገለጹት ፍሬ ነገሮች እውነት መሆናቸውን አረጋግጣለሁ።

ይግባኝ ባይ / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'በአስተዳደር ውሳኔ ላይ የሚቀርብ ይግባኝ (ee1bf-appeal-against-administrative-decisions.docx)',
    category: 'Appeal',
    sourceFile: 'Appeal/ee1bf-appeal-against-administrative-decisions.docx',
    legalBasis: 'የፌዴራል አስተዳደር ሥነ-ሥርዓት አዋጅ ቁጥር 1183/2012',
    description:
      'Judicial review / statutory appeal challenging an unlawful or procedurally defective decision of a government ministry, tax authority, or regulatory agency.',
    fields: [
      { id: 'courtName', label: 'Reviewing Court / Bench', amharicLabel: 'ይግባኙ የሚቀርብለት ፍርድ ቤት / ችሎት', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት የአስተዳደርና ታክስ ይግባኝ ሰሚ ችሎት' },
      { id: 'appellantName', label: 'Appellant Name & Address', amharicLabel: 'የይግባኝ ባይ ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ ኢትዮ-አግሮ ኤክስፖርት ኃ/የተ/የግ/ማኅበር' },
      { id: 'agencyName', label: 'Respondent Administrative Agency / Authority', amharicLabel: 'መልስ ሰጪ የአስተዳደር ተቋም ስም', placeholder: 'ምሳሌ፡ የገቢዎች ሚኒስቴር / የጉምሩክ ኮሚሽን' },
      { id: 'decisionRef', label: 'Administrative Decision Ref No. & Date', amharicLabel: 'የአስተዳደር ውሳኔው ቁጥር እና ቀን', placeholder: 'ምሳሌ፡ ቁጥር MOR/441/2019፣ ጥቅምት 5 ቀን 2019 ዓ.ም.' },
      { id: 'groundsOfIllegality', label: 'Grounds of Administrative Illegality / Ultra Vires', amharicLabel: 'የአስተዳደር ውሳኔው ሕገ-ወጥ የሆነበት ምክንያት ዝርዝር', type: 'textarea', placeholder: 'የሥልጣን ገደብ ማለፍ፣ የመሰማት መብት መጣስ ወይም የሕግ ስህተት መፈጸሙን ይግለጹ...' },
      { id: 'date', label: 'Filing Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ከፍተኛ ፍርድ ቤት'}
አዲስ አበባ

ቀን፡ ${v.date || '__________________'}

ይግባኝ ባይ፡ ${v.appellantName || '____________________________________'}
መልስ ሰጪ የአስተዳደር አካል፡ ${v.agencyName || '____________________________________'}

በአስተዳደር ውሳኔ ላይ የቀረበ የይግባኝ ማመልከቻ
(በፌዴራል አስተዳደር ሥነ-ሥርዓት አዋጅ ቁጥር 1183/2012 መሠረት)

1. ይግባኝ የቀረበበት የአስተዳደር ውሳኔ፡
መልስ ሰጪው በቁጥር ${v.decisionRef || '________________________'} የሰጠው የአስተዳደር ውሳኔ። ይግባኝ ባይ በተቋሙ ውስጥ ያሉ የቅሬታ ማቅረቢያ ደረጃዎችን አሟልቶ ጨርሷል።

2. የአስተዳደር ውሳኔው ሊሻር የሚገባበት የሕግና የፍሬ ነገር ምክንያቶች፡
${v.groundsOfIllegality || '________________________________________________________________________'}

3. የሚጠየቅ ዳኝነት፡
ፍርድ ቤቱ መልስ ሰጪው በቁጥር ${v.decisionRef || '____________'} የሰጠውን የአስተዳደር ውሳኔ እንዲሽርልኝና የይግባኝ ባይን ሕጋዊ መብት እንዲያስከብርልኝ በአክብሮት አመለክታለሁ።

ይግባኝ ባይ / ጠበቃ ፊርማ፡ ___________________________`,
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

  // ===========================================================================
  // 3. COURT APPLICATIONS & PLEADINGS (7 ARCHIVE FORMS)
  // ===========================================================================
  {
    id: 'petition-for-intervention',
    aliases: ['intervention'],
    title: 'Petition for Intervention in a Pending Proceeding',
    amharicTitle: 'በክርክር ውስጥ ጣልቃ ለመግባት የቀረበ አቤቱታ (12dd5-petition-for-intervention-in-a-proceeding.docx)',
    category: 'Application',
    sourceFile: 'Application/12dd5-petition-for-intervention-in-a-proceeding.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 41',
    description:
      'Application by an interested third party to intervene in an ongoing civil suit before judgment to protect their legal rights or property interest.',
    fields: [
      { id: 'courtName', label: 'Court & Bench Handling the Suit', amharicLabel: 'ክርክሩ የተያዘበት ፍርድ ቤት እና ችሎት', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት 4ኛ ፍትሐ ብሔር ችሎት' },
      { id: 'fileNo', label: 'Existing Court File Number', amharicLabel: 'የመዝገብ ቁጥር', placeholder: 'ምሳሌ፡ የመዝገብ ቁጥር 219402' },
      { id: 'intervenorName', label: 'Third-Party Intervenor Name & Address', amharicLabel: 'ጣልቃ ገቢ አመልካች ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ ወ/ሮ ትዕግሥት ዓለሙ፣ ቦሌ ክ/ከተማ' },
      { id: 'plaintiffName', label: 'Plaintiff in Main Suit', amharicLabel: 'ከሳሽ (በዋናው መዝገብ)', placeholder: 'ምሳሌ፡ አቶ ከበደ ማሞ' },
      { id: 'defendantName', label: 'Defendant in Main Suit', amharicLabel: 'ተከሳሽ (በዋናው መዝገብ)', placeholder: 'ምሳሌ፡ አቶ ዮሐንስ ታዬ' },
      { id: 'interestStatement', label: 'Grounds Showing Direct Legal Interest (Art. 41(2))', amharicLabel: 'ጣልቃ ለመግባት የሚያበቃው የመብት/ጥቅም ዝርዝር (አንቀጽ 41(2))', type: 'textarea', placeholder: 'በከሳሽና ተከሳሽ መካከል የተያዘው ክርክር ውጤት በጣልቃ ገቢው መብት ወይም ንብረት ላይ የሚያሳድረውን ተጽዕኖ ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ከፍተኛ ፍርድ ቤት'}
የመዝገብ ቁጥር፡ ${v.fileNo || '____________________'}
ቀን፡ ${v.date || '__________________'}

ጣልቃ ገቢ አመልካች፡ ${v.intervenorName || '________________________'}
በከሳሽ፡ ${v.plaintiffName || '________________________'}
እና በተከሳሽ፡ ${v.defendantName || '________________________'} መካከል

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 41 መሠረት
በክርክሩ ውስጥ ጣልቃ ለመግባት የቀረበ አቤቱታ

1. ጣልቃ ለመግባት የሚያበቃው የመብትና ጥቅም መግለጫ፡
በመዝገብ ቁጥር ${v.fileNo || '____________'} በከሳሽና በተከሳሽ መካከል በመካሄድ ላይ ያለው ክርክር የጣልቃ ገቢ አመልካችን ሕጋዊ መብትና ጥቅም በቀጥታ የሚነካ ስለሆነ በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 41(1) እና (2) መሠረት የሚከተለውን አقدمአለሁ፦
${v.interestStatement || '________________________________________________________________________'}

2. የሚጠየቅ ዳኝነት፡
ፍርድ ቤቱ አመልካች በመዝገብ ቁጥር ${v.fileNo || '____________'} ውስጥ በጣልቃ ገቢነት እንድካተት ፈቅዶ፣ በክርክሩ ላይ ያለኝን መብት እንዲያስከብርልኝ በአክብሮት አመለክታለሁ።

ጣልቃ ገቢ አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'በሌለሁበት የተሰጠ ትዕዛዝ/ውሳኔ እንዲነሳ የቀረበ ማመልከቻ (14966-application-for-cancellation-of-ex-parte-order.docx)',
    category: 'Application',
    sourceFile: 'Application/14966-application-for-cancellation-of-ex-parte-order.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 78',
    description:
      'Application by a defendant to set aside an ex-parte order or decree within one month by proving non-service of summons or sufficient cause for non-appearance.',
    fields: [
      { id: 'courtName', label: 'Court Name & Bench', amharicLabel: 'ፍርድ ቤቱ እና ችሎቱ', placeholder: 'ምሳሌ፡ ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት ልደታ ምድብ ችሎት' },
      { id: 'fileNo', label: 'Court File Number & Ex-Parte Order Date', amharicLabel: 'የመዝገብ ቁጥር እና ትዕዛዙ የተሰጠበት ቀን', placeholder: 'ምሳሌ፡ መዝገብ ቁ. 110482፣ ጥቅምት 15 ቀን 2019 ዓ.ም.' },
      { id: 'applicantName', label: 'Applicant (Defendant) Full Name', amharicLabel: 'አመልካች (ተከሳሽ) ሙሉ ስም', placeholder: 'ምሳሌ፡ አቶ በረከት አሰፋ' },
      { id: 'respondentName', label: 'Respondent (Plaintiff) Full Name', amharicLabel: 'ተጠሪ (ከሳሽ) ሙሉ ስም', placeholder: 'ምሳሌ፡ ዳሽን ማይክሮ ፋይናንስ ተቋም' },
      { id: 'sufficientCause', label: 'Reasons for Non-Appearance / Improper Service of Summons (Art. 78)', amharicLabel: 'በችሎት ያልተገኘሁበት በቂ ምክንያት / መጥሪያ ያልደረሰ ስለመሆኑ (አንቀጽ 78)', type: 'textarea', placeholder: 'መጥሪያ በሕጉ መሠረት ያልደረሰ መሆኑን ወይም ከአቅም በላይ በሆነ ምክንያት በቀጠሮው ቀን አለመገኘትዎን ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት'}
የመዝገብ ቁጥር፡ ${v.fileNo || '____________________'}
ቀን፡ ${v.date || '__________________'}

አመልካች (ተከሳሽ)፡ ${v.applicantName || '____________________________________'}
ተጠሪ (ከሳሽ)፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 78 መሠረት
በሌለሁበት የተሰጠ ትዕዛዝ / ውሳኔ እንዲነሳልኝ የቀረበ ማመልከቻ

1. በችሎት ለመገኘት ያልቻልኩበት በቂና ሕጋዊ ምክንያት፡
${v.sufficientCause || '________________________________________________________________________'}

2. የሚጠየቅ ትዕዛዝ፡
ፍርድ ቤቱ የቀረበውን በቂ ምክንያትና ማስረጃ ተመልክቶ በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 78(2) መሠረት ክርክሩ በሌለሁበት እንዲታይ የተሰጠውን ትዕዛዝ/ውሳኔ አንስቶ፣ የመከላከያ መልሴን ተቀብሎ ክርክሩን እንዲሰማልኝ በአክብሮት አመለክታለሁ።

አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'ይግባኝ እስኪታይ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ (6aac2-application-for-stay-of-execution-on-appeal.docx)',
    category: 'Application',
    sourceFile: 'Application/6aac2-application-for-stay-of-execution-on-appeal.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 332–335',
    description:
      'Urgent motion requesting the Appellate Court to stay execution of a decree pending appeal to prevent substantial and irreparable loss.',
    fields: [
      { id: 'courtName', label: 'Appellate Court Name', amharicLabel: 'ይግባኝ ሰሚው ፍርድ ቤት', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት ይግባኝ ሰሚ ችሎት' },
      { id: 'appealFileNo', label: 'Appellate File No. & Execution File No.', amharicLabel: 'የይግባኝ መዝገብ ቁጥር እና የአፈጻጸም መዝገብ ቁጥር', placeholder: 'ምሳሌ፡ የይግባኝ መዝገብ ቁ. 55421 (የአፈጻጸም መዝገብ ቁ. 12904)' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor / Appellant)', amharicLabel: 'አመልካች (ይግባኝ ባይ)', placeholder: 'ምሳሌ፡ ዘመን ኢንጂነሪንግ ኃ/የተ/የግ/ማኅበር' },
      { id: 'respondentName', label: 'Respondent (Decree-Holder)', amharicLabel: 'ተጠሪ (የፍርድ ባለገንዘብ)', placeholder: 'ምሳሌ፡ አቶ ካሣሁን በቀለ' },
      { id: 'substantialLoss', label: 'Proof of Substantial & Irreparable Loss if Executed (Art. 334)', amharicLabel: 'አፈጻጸሙ ባይታገድ የሚደርሰው ከባድና የማይተካ ጉዳት (አንቀጽ 334)', type: 'textarea', placeholder: 'ይግባኙ ታይቶ ውሳኔ ከማግኘቱ በፊት አፈጻጸሙ ቢቀጥል የሚደርሰውን የማይተካ ጉዳት ይግለጹ...' },
      { id: 'securityOffered', label: 'Security / Guarantee Offered (Art. 334(1)(c))', amharicLabel: 'ለአፈጻጸም ማስተማመኛ የሚቀርብ ዋስትና (አንቀጽ 334(1)(ሐ))', placeholder: 'ምሳሌ፡ የባንክ ዋስትና ወይም የማይንቀሳቀስ ንብረት ካርታ ማስያዣ' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ይግባኝ ሰሚ ፍርድ ቤት'}
የመዝገብ ቁጥር፡ ${v.appealFileNo || '____________________'}
ቀን፡ ${v.date || '__________________'}

አመልካች (ይግባኝ ባይ)፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 332–335 መሠረት
የፍርድ አፈጻጸም እንዲታገድልኝ የቀረበ አስቸኳይ ማመልከቻ

1. አፈጻጸሙ ባይታገድ የሚደርስ ከባድና የማይተካ ጉዳት (አንቀጽ 334(1)(ሀ))፡
${v.substantialLoss || '________________________________________________________________________'}

2. ስለ ዋስትና ማስያዣ (አንቀጽ 334(1)(ሐ))፡
${v.securityOffered || 'ፍርድ ቤቱ የሚያዘውን ማናቸውንም የዋስትና ማስያዣ ለማቅረብ ዝግጁ ነኝ።'}

3. የሚጠየቅ የዕግድ ትዕዛዝ፡
የይግባኝ ክርክሩ ተሰምቶ የመጨረሻ ውሳኔ እስኪሰጥ ድረስ የሥር ፍርድ ቤት የአፈጻጸም ሂደት እንዲታገድ ትዕዛዝ እንዲሰጥልኝ በአክብሮት አመለክታለሁ።

አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'በድህነት (ያለ ዳኝነት ክፍያ) ክስ ለማቅረብ የሚቀርብ ማመልከቻ (7549a-paupers-petition.docx)',
    category: 'Application',
    sourceFile: 'Application/7549a-paupers-petition.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 467–476',
    description:
      'Application supported by affidavit requesting exemption from court filing fees due to lack of sufficient financial means.',
    fields: [
      { id: 'courtName', label: 'Court Name', amharicLabel: 'ፍርድ ቤቱ', placeholder: 'ምሳሌ፡ ለፌዴራል የመጀመሪያ ደረጃ ፍርድ ቤት' },
      { id: 'applicantName', label: 'Applicant Full Name & Address', amharicLabel: 'የአመልካች ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ ወ/ሮ ማርታ ታደሰ፣ ኮልፌ ቀራኒዮ ክ/ከተማ' },
      { id: 'respondentName', label: 'Intended Defendant Name', amharicLabel: 'የተጠሪ (ተከሳሽ) ስም', placeholder: 'ምሳሌ፡ ኤቢሲ ትራንስፖርት አ.ማ.' },
      { id: 'claimAmount', label: 'Amount of Claim & Required Court Fee', amharicLabel: 'የክሱ የገንዘብ መጠን እና የዳኝነት ክፍያ', placeholder: 'ምሳሌ፡ የክሱ መጠን ብር 850,000.00' },
      { id: 'financialStatus', label: 'Declaration of Income & Property (Affidavit of Means)', amharicLabel: 'የአመልካች የገቢና የንብረት ሁኔታ መግለጫ (ቃለ-መሐላ)', type: 'textarea', placeholder: 'የዳኝነት ክፍያውን ለመክፈል የሚያስችል ገቢና ንብረት የሌለዎት መሆኑን ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ፍርድ ቤት'}
ቀን፡ ${v.date || '__________________'}

አመልካች፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 467–470 መሠረት
በድህነት (ያለ ዳኝነት ክፍያ) ክስ ለማቅረብ እንዲፈቀድ የቀረበ ማመልከቻ

1. የክሱ ጭብጥና የገንዘብ መጠን፡
ከዚህ ማመልከቻ ጋር ተያይዞ የቀረበው ክስ መጠን ${v.claimAmount || '________________________'} ነው።

2. የአቅም ማጣት መግለጫና ቃለ-መሐላ፡
${v.financialStatus || '________________________________________________________________________'}

3. የሚጠየቅ ትዕዛዝ፡
ፍርድ ቤቱ የቀረበውን የማኅበራዊ ፍርድ ቤት/የወረዳ ማስረጃና ቃለ-መሐላ መርምሮ ክሱን ያለ ዳኝነት ክፍያ በድህነት እንድከታተል እንዲፈቅድልኝ አመለክታለሁ።

የአመልካች ፊርማ፡ ___________________________`,
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
    amharicTitle: 'ሦስተኛ ወገን ወደ ክርክሩ እንዲገባ የሚቀርብ ማመልከቻ (75ee1-petition-for-joinder-of-thrid-party.docx)',
    category: 'Application',
    sourceFile: 'Application/75ee1-petition-for-joinder-of-thrid-party.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 43',
    description:
      'Application by a defendant requesting the court to join a third party from whom the defendant claims contribution or indemnity.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', amharicLabel: 'ፍርድ ቤቱ እና የመዝገብ ቁጥር', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት፣ መዝገብ ቁ. 176320' },
      { id: 'defendantApplicant', label: 'Applicant (Defendant) Name', amharicLabel: 'አመልካች (ተከሳሽ) ስም', placeholder: 'ምሳሌ፡ አዋሽ ኢንሹራንስ አ.ማ.' },
      { id: 'plaintiffName', label: 'Plaintiff Name', amharicLabel: 'ከሳሽ ስም', placeholder: 'ምሳሌ፡ አቶ ኤፍሬም ዓለሙ' },
      { id: 'thirdPartyName', label: 'Third Party to be Joined (Name & Address)', amharicLabel: 'ወደ ክርክሩ እንዲገባ የተጠየቀው 3ኛ ወገን ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ ታረቀኝ በቀለ፣ አዲስ አበባ' },
      { id: 'indemnityGrounds', label: 'Grounds for Contribution or Indemnity (Art. 43(1))', amharicLabel: 'ሦስተኛው ወገን ካሳ የመክፈል ወይም የመተካት ግዴታ ያለበት ምክንያት (አንቀጽ 43)', type: 'textarea', placeholder: 'ሦስተኛው ወገን በውል ወይም በሕግ ለተከሳሽ ኃላፊነት የሚጋራበትን ምክንያት ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ፍርድ ቤት'}
ቀን፡ ${v.date || '__________________'}

አመልካች (ተከሳሽ)፡ ${v.defendantApplicant || '____________________________________'}
ከሳሽ፡ ${v.plaintiffName || '____________________________________'}
ወደ ክርክሩ እንዲገባ የተጠየቀ 3ኛ ወገን፡ ${v.thirdPartyName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 43 መሠረት
ሦስተኛ ወገን ወደ ክርክሩ እንዲገባ የቀረበ ማመልከቻ

1. ሦስተኛው ወገን ወደ ክርክሩ እንዲገባ የተጠየቀበት ምክንያት፡
${v.indemnityGrounds || '________________________________________________________________________'}

2. የሚጠየቅ ትዕዛዝ፡
በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 43(2) መሠረት ለሦስተኛው ወገን (${v.thirdPartyName || '____________________'}) የክሱና የመከላከያ መልሱ ግልባጭ ተያይዞ መጥሪያ እንዲላክለትና ወደ ክርክሩ እንዲገባ እንዲታዘዝልኝ አመለክታለሁ።

ተከሳሽ / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'ከፍርድ በፊት የተከሳሽ ንብረት እንዲከበር የሚቀርብ ማመልከቻ (7c4d5-application-for-attachment-property-of-defendant.docx)',
    category: 'Application',
    sourceFile: 'Application/7c4d5-application-for-attachment-property-of-defendant.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 151–153',
    description:
      'Urgent application to attach the defendant’s movable/immovable property or bank accounts before judgment to prevent asset disposal.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', amharicLabel: 'ፍርድ ቤቱ እና የመዝገብ ቁጥር', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት የንግድ ችሎት፣ መዝገብ ቁ. 204811' },
      { id: 'applicantName', label: 'Applicant (Plaintiff) Name', amharicLabel: 'አመልካች (ከሳሽ) ስም', placeholder: 'ምሳሌ፡ ኅብረት ባንክ አ.ማ.' },
      { id: 'respondentName', label: 'Respondent (Defendant) Name', amharicLabel: 'ተጠሪ (ተከሳሽ) ስም', placeholder: 'ምሳሌ፡ ሪፍት ቫሊ ቡና ላኪ ኃ/የተ/የግ/ማኅበር' },
      { id: 'propertyToAttach', label: 'Specific Property / Vehicle / Bank Account to be Attached & Value', amharicLabel: 'እንዲከበር የተጠየቀው ንብረት / ተሽከርካሪ / የባንክ ሂሳብ ዝርዝርና ግምት', type: 'textarea', placeholder: 'ምሳሌ፡ የሰሌዳ ቁጥሩ ኮድ 3-A88219 አ.አ የሆነ ተሽከርካሪ እና በንግድ ባንክ የሚገኝ ብር 3,500,000.00...' },
      { id: 'riskOfDisposal', label: 'Facts Showing Intent to Obstruct or Delay Execution (Art. 151(1))', amharicLabel: 'ተጠሪው ንብረቱን ለማሸሽ ወይም ለማባከን ስለመሞከሩ መግለጫ (አንቀጽ 151)', type: 'textarea', placeholder: 'ተጠሪው የፍርድ አፈጻጸምን ለማሰናከል ንብረቱን ለመሸጥ ወይም ለማሸሽ በዝግጅት ላይ መሆኑን ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ከፍተኛ ፍርድ ቤት'}
ቀን፡ ${v.date || '__________________'}

አመልካች (ከሳሽ)፡ ${v.applicantName || '____________________________________'}
ተጠሪ (ተከሳሽ)፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 151–153 መሠረት
ከፍርድ በፊት የተጠሪ ንብረት ተከብሮ እንዲቆይ የቀረበ ማመልከቻ

1. እንዲከበር የተጠየቀው የተጠሪ ንብረት ዝርዝርና ግምት (አንቀጽ 151(2))፡
${v.propertyToAttach || '________________________________________________________________________'}

2. ንብረቱ እንዲከበር የተጠየቀበት ምክንያት (በቃለ-መሐላ የተደገፈ)፡
${v.riskOfDisposal || '________________________________________________________________________'}

3. የሚጠየቅ ትዕዛዝ፡
በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 151(3) መሠረት ተጠሪው በቂ ዋስትና እስኪያቀርብ ወይም ክሱ የመጨረሻ ውሳኔ እስኪያገኝ ድረስ ከላይ የተገለጸው ንብረት/ገንዘብ ተከብሮ እንዲቆይ አስቸኳይ ትዕዛዝ እንዲሰጥልኝ አመለክታለሁ።

አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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
    amharicTitle: 'በሌለበት የተሰጠ ፍርድ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ (9c685-pleading-for-injuction-of-enforcememnt-of-exparte-judgement.docx)',
    category: 'Application',
    sourceFile: 'Application/9c685-pleading-for-injuction-of-enforcememnt-of-exparte-judgement.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 78 እና 154',
    description:
      'Emergency motion to restrain enforcement and auction of assets while an application to set aside an ex-parte judgment is pending.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', amharicLabel: 'ፍርድ ቤቱ እና የመዝገብ ቁጥር', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት፣ መዝገብ ቁ. 190332' },
      { id: 'applicantName', label: 'Applicant (Judgment-Debtor) Name', amharicLabel: 'አመልካች ስም', placeholder: 'ምሳሌ፡ አቶ ሄኖክ ደስታ' },
      { id: 'respondentName', label: 'Respondent (Judgment-Creditor) Name', amharicLabel: 'ተጠሪ ስም', placeholder: 'ምሳሌ፡ አቶ ሙሉጌታ ታዬ' },
      { id: 'enforcementThreat', label: 'Imminent Enforcement Action & Irreparable Harm', amharicLabel: 'የአፈጻጸም ሂደቱ ያለበት ደረጃ እና የሚደርሰው ጉዳት', type: 'textarea', placeholder: 'በሌለሁበት የተሰጠው ውሳኔ እንዲነሳ በአንቀጽ 78 ማመልከቻ መቅረቡንና አፈጻጸሙ ባይታገድ የሚደርሰውን ጉዳት ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ፍርድ ቤት'}
ቀን፡ ${v.date || '__________________'}

አመልካች፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በሌለሁበት የተሰጠው ፍርድ አፈጻጸም እንዲታገድ የቀረበ ማመልከቻ
(በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 78 እና 154 መሠረት)

1. የማመልከቻው ዝርዝር ምክንያት፡
${v.enforcementThreat || '________________________________________________________________________'}

2. የሚጠየቅ ትዕዛዝ፡
በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 78 መሠረት ያቀረብኩት ውሳኔው ይነሳልኝ አቤቱታ ተመርምሮ ውሳኔ እስኪሰጥ ድረስ የፍርድ አፈጻጸሙ እንዲታገድ ትዕዛዝ እንዲሰጥልኝ አመለክታለሁ።

አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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
    title: 'Application for Execution of Decree',
    amharicTitle: 'የፍርድ አፈጻጸም መጠየቂያ ማመልከቻ (aa66b-application-for-execution.docx)',
    category: 'Application',
    sourceFile: 'Application/aa66b-application-for-execution.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 378',
    description:
      'Statutory application to execute a final court judgment by attachment and sale of property or transfer of funds.',
    fields: [
      { id: 'courtName', label: 'Execution Court Name', amharicLabel: 'አፈጻጸሙ የሚቀርብለት ፍርድ ቤት', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት የአፈጻጸም ችሎት' },
      { id: 'suitNo', label: 'Original Suit File No. & Date of Decree', amharicLabel: 'ፍርድ የተሰጠበት የመዝገብ ቁጥር እና ቀን', placeholder: 'ምሳሌ፡ የመዝገብ ቁጥር 164920፣ መስከረም 8 ቀን 2019 ዓ.ም.' },
      { id: 'decreeHolder', label: 'Decree-Holder (Applicant) Name & Address', amharicLabel: 'የፍርድ ባለገንዘብ (አመልካች) ስምና አድራሻ', placeholder: 'ምሳሌ፡ ሉሲ ትሬዲንግ ኃ/የተ/የግ/ማኅበር' },
      { id: 'judgmentDebtor', label: 'Judgment-Debtor (Respondent) Name & Address', amharicLabel: 'የፍርድ ባለዕዳ (ተጠሪ) ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ አለማየሁ በቀለ' },
      { id: 'whetherAppeal', label: 'Whether Any Appeal Has Been Preferred From the Decree', amharicLabel: 'በውሳኔው ላይ ይግባኝ መቅረብ አለመቅረቡ', placeholder: 'ምሳሌ፡ ይግባኝ ወይም የዕግድ ትዕዛዝ አልቀረበም', defaultValue: 'ይግባኝ ወይም የዕግድ ትዕዛዝ አልቀረበም / No appeal or stay issued.' },
      { id: 'amountDue', label: 'Total Amount of Debt / Compensation & Costs Due (ETB)', amharicLabel: 'በፍርዱ መሠረት የሚጠየቀው ጠቅላላ የገንዘብ መጠን፣ ወለድና ወጪ (በብር)', placeholder: 'ምሳሌ፡ ዋና ገንዘብ ብር 1,200,000 + 9% ሕጋዊ ወለድ + ብር 45,000 ወጪ' },
      { id: 'modeOfAssistance', label: 'Mode in Which Court Assistance is Required (Art. 378(3)(j))', amharicLabel: 'ፍርዱ እንዲፈጸም የሚጠየቅበት መንገድ (አንቀጽ 378(3)(י))', type: 'textarea', placeholder: 'ምሳሌ፡ በፍ/ብ/ሥ/ሥ/ሕግ ቁጥር 386 መጥሪያ ተልኮ የፍርድ ባለዕዳው ንብረት/የባንክ ሂሳብ ተከብሮ እንዲከፈለኝ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል የአፈጻጸም ፍርድ ቤት'}
አዲስ አበባ

የአፈጻጸም መዝገብ ቁጥር፡ ____________________
ቀን፡ ${v.date || '__________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 378 መሠረት የቀረበ
የፍርድ አፈጻጸም ማመልከቻ

1. ፍርድ የተሰጠበት የመዝገብ ቁጥርና ቀን፡ ${v.suitNo || '____________________________________'}
2. የፍርድ ባለገንዘብ (አመልካች) ስምና አድራሻ፡ ${v.decreeHolder || '____________________________________'}
3. የፍርድ ባለዕዳ (ተጠሪ) ስምና አድራሻ፡ ${v.judgmentDebtor || '____________________________________'}
4. በውሳኔው ላይ ይግባኝ መቅረብ አለመቅረቡ፡ ${v.whetherAppeal || 'አልቀረበም'}
5. ከፍርዱ በኋላ የተከፈለ ወይም የተስተካከለ ነገር መኖር አለመኖሩ፡ የለም
6. በፍርዱ መሠረት የሚጠየቀው ጠቅላላ የገንዘብ መጠንና ወጪ፡ ${v.amountDue || '____________________________________'}
7. የፍርድ ቤቱ ድጋፍ የሚጠየቅበት የአፈጻጸም ዓይነት (አንቀጽ 378(3)(י))፡
   ${v.modeOfAssistance || '________________________________________________________________________'}

ከላይ የተገለጸው ሁሉ እውነት መሆኑን አረጋግጣለሁ።

የፍርድ ባለገንዘብ / ጠበቃ ፊርማ፡ ___________________________`,
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
    title: 'Application for Temporary Injunction Order',
    amharicTitle: 'ጊዜያዊ የዕግድ ትዕዛዝ እንዲሰጥ የቀረበ ማመልከቻ (b94e6-injunction-order.docx)',
    category: 'Application',
    sourceFile: 'Application/b94e6-injunction-order.docx',
    legalBasis: 'የፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 154–155',
    description:
      'Application for a temporary injunction to restrain a party from wasting, damaging, alienating, or wrongfully selling property in dispute.',
    fields: [
      { id: 'courtName', label: 'Court Name & File No.', amharicLabel: 'ፍርድ ቤቱ እና የመዝገብ ቁጥር', placeholder: 'ምሳሌ፡ ለፌዴራል ከፍተኛ ፍርድ ቤት፣ መዝገብ ቁ. 221094' },
      { id: 'applicantName', label: 'Applicant Name', amharicLabel: 'አመልካች ስም', placeholder: 'ምሳሌ፡ አቶ ያሬድ ፀጋዬ' },
      { id: 'respondentName', label: 'Respondent Name', amharicLabel: 'ተጠሪ ስም', placeholder: 'ምሳሌ፡ ወ/ሮ ሮማን ገብሬ' },
      { id: 'propertyInDispute', label: 'Description of Disputed Property / Subject Matter', amharicLabel: 'ክርክር የተነሳበት ንብረት አድራሻና መለያ', placeholder: 'ምሳሌ፡ በቦሌ ክ/ከተማ ወረዳ 09 የሚገኝ የካርታ ቁጥር 882/09 የሆነ መኖሪያ ቤት' },
      { id: 'groundsForInjunction', label: 'Grounds Showing Danger of Alienation, Waste, or Damage (Art. 154)', amharicLabel: 'ንብረቱ እንዳይሸጥ/እንዳይለወጥ ዕግድ የተጠየቀበት ምክንያት (አንቀጽ 154)', type: 'textarea', placeholder: 'ተጠሪው ክርክር የተነሳበትን ንብረት ለሦስተኛ ወገን ለማስተላለፍ ወይም ለማባከን በሂደት ላይ መሆኑን ይግለጹ...' },
      { id: 'date', label: 'Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `${v.courtName || 'ለፌዴራል ፍርድ ቤት'}
ቀን፡ ${v.date || '__________________'}

አመልካች፡ ${v.applicantName || '____________________________________'}
ተጠሪ፡ ${v.respondentName || '____________________________________'}

በፍትሐ ብሔር ሥነ-ሥርዓት ሕግ ቁጥር 154 እና 155 መሠረት
ጊዜያዊ የዕግድ ትዕዛዝ እንዲሰጥልኝ የቀረበ ማመልከቻ

1. ክርክር የተነሳበት ንብረት መግለጫ፡
${v.propertyInDispute || '________________________________________________________________________'}

2. የዕግድ ትዕዛዝ የተጠየቀበት ምክንያት (በቃለ-መሐላ የተደገፈ)፡
${v.groundsForInjunction || '________________________________________________________________________'}

3. የሚጠየቅ ትዕዛዝ፡
የተጀመረው ክርክር የመጨረሻ ውሳኔ እስኪያገኝ ድረስ ክርክር የተነሳበት ንብረት ለሦስተኛ ወገን እንዳይተላለፍ፣ በዋስትና እንዳይያዝና ባለበት ሁኔታ ተከብሮ እንዲቆይ ጊዜያዊ የዕግድ ትዕዛዝ እንዲሰጥልኝ አመለክታለሁ።

አመልካች / ጠበቃ ፊርማ፡ ___________________________`,
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

  // ===========================================================================
  // 4. BUSINESS FORMS (ARCHIVE PLC ARTICLES + COMMERCIAL CONTRACTS)
  // ===========================================================================
  {
    id: 'plc-articles-of-association',
    aliases: ['plc', 'articles-of-association', 'memorandum-of-association', 'company-formation', 'corporate'],
    title: 'Memorandum & Articles of Association for Private Limited Company (PLC)',
    amharicTitle: 'ኃላፊነቱ የተወሰነ የግል ማኅበር መመሥረቻ ጽሑፍ (article of association for plc.doc)',
    category: 'Business Forms',
    sourceFile: 'Business Forms/article of association for plc.doc',
    legalBasis: 'የኢትዮጵያ የንግድ ሕግ አዋጅ ቁጥር 1243/2013 (አንቀጽ 495–533)',
    description:
      'Complete corporate formation instrument for a Private Limited Company (PLC) ready for DARS authentication and Ministry of Trade registration.',
    fields: [
      { id: 'companyName', label: 'Company Name (PLC)', amharicLabel: 'የማኅበሩ ስም (ኃ/የተ/የግ/ማኅበር)', placeholder: 'ምሳሌ፡ ብሉ ናይል ቴክ ሶሉሽንስ ኃላፊነቱ የተወሰነ የግል ማኅበር' },
      { id: 'headOffice', label: 'Head Office Address', amharicLabel: 'የማኅበሩ ዋና መሥሪያ ቤት አድራሻ', placeholder: 'ምሳሌ፡ አዲስ አበባ፣ ቦሌ ክ/ከተማ፣ ወረዳ 03' },
      { id: 'businessObjectives', label: 'Business Objectives / Purposes of the Company', amharicLabel: 'የማኅበሩ የንግድ ዓላማዎች ዝርዝር', type: 'textarea', placeholder: 'ምሳሌ፡ 1. የሶፍትዌር ልማትና የቴክኖሎጂ ማማከር አገልግሎት፤\n2. የንግድ ዕቃዎች አስመጪና አከፋፋይ...' },
      { id: 'capitalAmount', label: 'Total Paid-Up Capital (ETB) & Par Value of Shares', amharicLabel: 'የማኅበሩ ዋና ገንዘብ (ካፒታል) እና የአክሲዮን ዋጋ', placeholder: 'ምሳሌ፡ ብር 500,000.00 (እያንዳንዳቸው ብር 1,000 ዋጋ ባላቸው 500 አክሲዮኖች የተከፈለ)' },
      { id: 'shareholdersList', label: 'Founding Shareholders & Share Allocation', amharicLabel: 'የመሥራች አባላት ስም፣ ዜግነት እና የአክሲዮን ድርሻ', type: 'textarea', placeholder: '1. አቶ አበበ ከበደ — 300 አክሲዮኖች (ብር 300,000)\n2. ወ/ሮ ሳራ ታደሰ — 200 አክሲዮኖች (ብር 200,000)' },
      { id: 'generalManager', label: 'Appointed General Manager Full Name', amharicLabel: 'የተሾመው ዋና ሥራ አስኪያጅ ሙሉ ስም', placeholder: 'ምሳሌ፡ አቶ አበበ ከበደ' },
      { id: 'date', label: 'Execution Date', amharicLabel: 'ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `የ${v.companyName || '____________________________________'}
ኃላፊነቱ የተወሰነ የግል ማኅበር መመሥረቻ ጽሑፍ
(በኢትዮጵያ የንግድ ሕግ አዋጅ ቁጥር 1243/2013 መሠረት የተዘጋጀ)

አንቀጽ 1 — የማኅበሩ ምሥረታና ስያሜ፡
ከዚህ በታች ስማችንና ፊርማችን የተመለከተው መሥራች አባላት በኢትዮጵያ የንግድ ሕግ አዋጅ ቁጥር 1243/2013 መሠረት "${v.companyName || '________________________ ኃላፊነቱ የተወሰነ የግል ማኅበር'}" ተብሎ የሚጠራ ማኅበር መሥርተናል።

አንቀጽ 2 — የማኅበሩ ዋና መሥሪያ ቤት፡
የማኅበሩ ዋና መሥሪያ ቤት በ${v.headOffice || 'አዲስ አበባ ከተማ'} ሆኖ፣ እንደ አስፈላጊነቱ በኢትዮጵያ ውስጥም ሆነ ከኢትዮጵያ ውጪ ቅርንጫፍ መሥሪያ ቤቶች ሊከፍት ይችላል።

አንቀጽ 3 — የማኅበሩ የንግድ ዓላማዎች፡
ማኅበሩ የተቋቋመባቸው የንግድ ዓላማዎች የሚከተሉት ናቸው፦
${v.businessObjectives || '________________________________________________________________________'}

አንቀጽ 4 — የማኅበሩ ካፒታል እና የአክሲዮን ክፍፍል፡
የማኅበሩ ጠቅላላ ካፒታል ${v.capitalAmount || 'ብር ________________'} ሲሆን፣ ይኸውም በሙሉ በጥሬ ገንዘብ ተከፍሏል። የአባላቱ የአክሲዮን ድርሻ እንደሚከተለው ተደልድሏል፦
${v.shareholdersList || '________________________________________________________________________'}

አንቀጽ 5 — የማኅበሩ አመራርና የዋና ሥራ አስኪያጅ ሥልጣን፡
የማኅበሩ የመጀመሪያ ዋና ሥራ አስኪያጅ ሆነው ${v.generalManager || '________________________'} ተሾመዋል። ዋና ሥራ አስኪያጁ ማኅበሩን በመወከል የባንክ ሂሳብ የመክፈትና የማንቀሳቀስ፣ ውሎችን የመፈረምና የማኅበሩን የዕለት ተዕለት ሥራ የመምራት ሥልጣን አላቸው።

ይህ የመመሥረቻ ጽሑፍ በዛሬው ዕለት ${v.date || '__________________'} በመሥራች አባላት ተፈርሟል።

የመሥራች አባላት ፊርማ፡
1. ___________________________   2. ___________________________`,
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
    amharicTitle: 'የቅጥር ውል ስምምነት (በአሠሪና ሠራተኛ አዋጅ ቁጥር 1156/2011 መሠረት)',
    category: 'Business Forms',
    sourceFile: 'Business Forms/Employment Agreement',
    legalBasis: 'የአሠሪና ሠራተኛ ጉዳይ አዋጅ ቁጥር 1156/2011 (አንቀጽ 4፣ 6 እና 7)',
    description:
      'Compliant employment contract specifying job title, place of work, probation period, basic salary, leave entitlements, and termination notice.',
    fields: [
      { id: 'employerName', label: 'Employer Company Name & Address', amharicLabel: 'የአሠሪው ድርጅት ስምና አድራሻ', placeholder: 'ምሳሌ፡ ኢትዮ-ፊንቴክ ኃ/የተ/የግ/ማኅበር፣ አዲስ አበባ' },
      { id: 'employeeName', label: 'Employee Full Name & Address', amharicLabel: 'የተቀጣሪ (ሠራተኛ) ሙሉ ስምና አድራሻ', placeholder: 'ምሳሌ፡ አቶ ዳንኤል በቀለ፣ አዲስ አበባ' },
      { id: 'jobTitle', label: 'Job Title / Position & Place of Work', amharicLabel: 'የሥራ መደብ እና የሥራ ቦታ', placeholder: 'ምሳሌ፡ ከፍተኛ የኦፕሬሽን ባለሙያ — አዲስ አበባ' },
      { id: 'monthlySalary', label: 'Gross Monthly Salary (ETB) & Allowances', amharicLabel: 'ወርሃዊ ደመወዝ (በብር) እና ጥቅማጥቅም', placeholder: 'ምሳሌ፡ ብር 35,000.00 + ብር 3,000 የትራንስፖርት አበል' },
      { id: 'startDate', label: 'Commencement Date (60 Working Days Probation)', amharicLabel: 'ሥራ የሚጀመርበት ቀን', type: 'date', placeholder: 'YYYY-MM-DD', defaultValue: '2026-11-13' },
    ],
    generateAmharicDocument: (v) => `የሥራ ቅጥር ውል ስምምነት
(በአሠሪና ሠራተኛ ጉዳይ አዋጅ ቁጥር 1156/2011 መሠረት የተዘጋጀ)

ቀን፡ ${v.startDate || '__________________'}

1. አሠሪ፡ ${v.employerName || '____________________________________'}
2. ሠራተኛ፡ ${v.employeeName || '____________________________________'}
3. የሥራ መደብና የሥራ ቦታ፡ ${v.jobTitle || '____________________________________'}
4. ደመወዝና ክፍያ፡ የሠራተኛው ወርሃዊ ناጠቃላይ ደመወዝ ${v.monthlySalary || 'ብር ________________'} ሲሆን፣ የሥራ ግብርና የጡረታ መዋጮ (7% ከሠራተኛው፣ 11% ከአሠሪው) በሕጉ መሠረት ተቀናሽ ይደረጋል።
5. የሙከራ ጊዜ፡ በአዋጅ ቁጥር 1156/2011 አንቀጽ 11(3) መሠረት ሥራ ከተጀመረበት ከ${v.startDate || '____________'} ጀምሮ ለስድሳ (60) የሥራ ቀናት የሙከራ ጊዜ ይሆናል።

የአሠሪው ፊርማ፡ _______________________   የሠራተኛው ፊርማ፡ _______________________`,
    generateDocument: (v) => `CONTRACT OF EMPLOYMENT
(Executed Pursuant to Labour Proclamation No. 1156/2019)

Date: ${v.startDate || '__________________'}

1. EMPLOYER: ${v.employerName || '____________________________________'}
2. EMPLOYEE: ${v.employeeName || '____________________________________'}
3. POSITION & WORKPLACE: ${v.jobTitle || '____________________________________'}
4. REMUNERATION: Gross monthly salary of ${v.monthlySalary || 'ETB ________________'}, subject to statutory income tax and pension contributions (7% employee / 11% employer).
5. PROBATION PERIOD: The first sixty (60) working days from ${v.startDate || '____________'} shall constitute a probation period pursuant to Article 11(3) of Proclamation No. 1156/2019.

Employer Signature: _______________________   Employee Signature: _______________________`,
  },
  {
    id: 'commercial-lease',
    aliases: ['lease', 'real-estate', 'rent', 'lease-agreement'],
    title: 'Commercial & Office Property Lease Agreement',
    amharicTitle: 'የንግድ ቤት / የቢሮ ኪራይ ውል ስምምነት',
    category: 'Business Forms',
    sourceFile: 'Business Forms/Commercial Lease Agreement',
    legalBasis: 'የኢትዮጵያ የፍትሐ ብሔር ሕግ ቁጥር 2896–2974',
    description:
      'Bilingual lease contract for office, retail, or residential premises covering lease term, advance rent payment, withholding tax, and maintenance.',
    fields: [
      { id: 'lessorName', label: 'Lessor (Landlord) Full Name & TIN', amharicLabel: 'የአከራይ ሙሉ ስም እና የግብር ከፋይ መለያ ቁጥር (TIN)', placeholder: 'ምሳሌ፡ አቶ ከበደ ታደሰ፣ TIN: 001928374' },
      { id: 'lesseeName', label: 'Lessee (Tenant) Full Name & TIN', amharicLabel: 'የተከራይ ሙሉ ስም እና የግብር ከፋይ መለያ ቁጥር (TIN)', placeholder: 'ምሳሌ፡ አዲስ ኮንሰልቲንግ ኃ/የተ/የግ/ማኅበር' },
      { id: 'premisesAddress', label: 'Leased Premises Location & Floor/Area', amharicLabel: 'የሚከራየው ቤት/ቢሮ አድራሻ እና ስፋት', placeholder: 'ምሳሌ፡ ቦሌ ክ/ከተማ፣ ወረዳ 03፣ 3ኛ ፎቅ (180 ካ.ሜ)' },
      { id: 'monthlyRent', label: 'Monthly Rent (ETB) & Advance Payment Schedule', amharicLabel: 'ወርሃዊ የኪራይ ዋጋ (በብር) እና የአከፋፈል ሁኔታ', placeholder: 'ምሳሌ፡ በወር ብር 65,000.00 (በየ6 ወሩ በቅድሚያ የሚከፈል)' },
      { id: 'leaseDuration', label: 'Lease Term (Start & End Date)', amharicLabel: 'የኪራይ ውሉ የሚቆይበት ጊዜ', placeholder: 'ምሳሌ፡ ለሁለት (2) ዓመት' },
    ],
    generateAmharicDocument: (v) => `የንግድ ቤት / የቢሮ ኪራይ ውል ስምምነት
(በፍትሐ ብሔር ሕግ ቁጥር 2896–2974 መሠረት)

1. አከራይ፡ ${v.lessorName || '____________________________________'}
2. ተከራይ፡ ${v.lesseeName || '____________________________________'}
3. የሚከራየው ቤት አድራሻና ሁኔታ፡ ${v.premisesAddress || '____________________________________'}
4. የኪራይ ዘመን፡ ${v.leaseDuration || '____________________________________'}
5. የኪራይ ዋጋና አከፋፈል፡ ${v.monthlyRent || '____________________________________'}
6. የተከራይ ግዴታ፡ ተከራይ ቤቱን ለተከራየበት ሕጋዊ የሥራ ዓላማ ብቻ የመጠቀምና ያለ አከራይ የጽሑፍ ፈቃድ ለሦስተኛ ወገን አሳልፎ ያለማከራየት ግዴታ አለበት።

የአከራይ ፊርማ፡ _______________________   የተከራይ ፊርማ፡ _______________________`,
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
  const [docLang, setDocLang] = useState<DocLanguageMode>('bilingual');
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

  const generatedText = activeTemplate
    ? getFormattedDocument(activeTemplate, formValues, docLang)
    : '';

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
      <body style="font-family: 'Nyala', 'Abyssinica SIL', 'Times New Roman', serif; font-size: 12pt; line-height: 1.65; white-space: pre-wrap;">${generatedText}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.id}-${docLang}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#182235] font-sans">
      {/* Unified Light Header Matching Landing Page + Back Button */}
      <Navbar />

      {/* VIEW 1: FOCUSED FORM QUESTIONNAIRE (WHEN A FORM IS CLICKED) */}
      {activeTemplate ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveTemplate(null)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#182235] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Legal Templates List</span>
            </button>

            {/* Document Output Language Switcher */}
            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-2" />
              <button
                type="button"
                onClick={() => setDocLang('am')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  docLang === 'am' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                አማርኛ ብቻ
              </button>
              <button
                type="button"
                onClick={() => setDocLang('bilingual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  docLang === 'bilingual'
                    ? 'bg-[#0A1128] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                አማርኛ + English
              </button>
              <button
                type="button"
                onClick={() => setDocLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  docLang === 'en' ? 'bg-[#0A1128] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step 1: Questionnaire */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {activeTemplate.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#182235] pt-1">
                  {activeTemplate.title}
                </h1>
                <p className="text-xs font-bold text-[#3B66B8]">
                  {activeTemplate.amharicTitle}
                </p>
                <p className="text-[11px] text-slate-500">{activeTemplate.legalBasis}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Step 1: Fill in the Required Details / መረጃዎችን ይሙሉ
                </h2>

                {activeTemplate.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-bold text-slate-800">
                      {field.amharicLabel ? (
                        <>
                          <span className="text-emerald-800">{field.amharicLabel}</span>
                          <span className="text-slate-500 font-semibold"> — {field.label}</span>
                        </>
                      ) : (
                        field.label
                      )}
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
                  <h2 className="text-sm font-black text-[#182235]">
                    Step 2: Completed Document Preview ({docLang === 'am' ? 'አማርኛ' : docLang === 'en' ? 'English' : 'አማርኛ + English'})
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
                    className="px-4 py-2 bg-[#182235] hover:bg-[#3B66B8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Word (.doc)</span>
                  </button>
                </div>
              </div>

              <pre className="w-full p-6 bg-white border border-slate-200 rounded-2xl text-xs font-serif text-slate-900 whitespace-pre-wrap leading-relaxed max-h-[580px] overflow-y-auto">
                {generatedText}
              </pre>

              <div className="p-4 bg-[#0A1128] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <strong className="text-xs font-black text-amber-400 block">
                    Want a Verified Advocate to Review This Draft?
                  </strong>
                  <span className="text-[11px] text-slate-300 block">
                    Connect with an MOJ-licensed Ethiopian advocate before signing or filing — free matching.
                  </span>
                </div>
                <Link
                  href="/find-a-lawyer"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#182235] font-black text-xs rounded-xl inline-flex items-center justify-center gap-1.5 shrink-0 transition-all"
                >
                  <span>Request Free Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* VIEW 2: CLEAN, UNCLUTTERED TEMPLATE SELECTION GRID */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF3FB] border border-[#D6E2F5] text-[#3B66B8] text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Ethiopian Legal Templates, Contracts & Court Forms (አማርኛ እና እንግሊዝኛ)</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#182235] tracking-tight">
              Select a Legal Form to Draft
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Click any court pleading, appeal, power of attorney, or contract below to answer the guided questions and download your ready-to-use document in Amharic (`አማርኛ`) or English.
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
                      ? 'bg-[#3B66B8] text-white shadow-xs rounded-full'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#3B66B8]/50 rounded-full'
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
                placeholder="Search forms (e.g. ውክልና, ሰበር, PLC)..."
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
                className="group bg-white rounded-3xl border border-slate-200 hover:border-[#3B66B8] hover:-translate-y-1 p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 shadow-2xs hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {template.category}
                    </span>
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>

                  <h2 className="text-base font-black text-[#182235] leading-snug">
                    {template.title}
                  </h2>
                  <p className="text-xs font-bold text-[#3B66B8]">
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
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#182235] group-hover:text-[#3B66B8]">
                    <span>አዘጋጅ / Draft</span>
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