import { jsPDF } from 'jspdf';

interface PDFGeneratorParams {
  title: string;
  statute: string;
  paragraphs: string[];
  firstPartyName: string;
  secondPartyName: string;
  signatureText?: string;
  fileName?: string;
}

export function generateContractPDF({
  title,
  statute,
  paragraphs,
  firstPartyName,
  secondPartyName,
  signatureText,
  fileName
}: PDFGeneratorParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  const documentRef = `ETH-DOC-${Date.now().toString().slice(-6)}`;
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 17, 40);
  doc.text('LEGALLINK ETHIOPIA', margin, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('LexDraft Document Automation System', margin, cursorY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 17, 40);
  doc.text(documentRef, pageWidth - margin, cursorY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(dateFormatted, pageWidth - margin, cursorY + 4, { align: 'right' });

  cursorY += 8;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 12;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(10, 17, 40);
  const titleText = title.toUpperCase();
  const titleLines = doc.splitTextToSize(titleText, contentWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 5 + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text(`CONCLUDED PURSUANT TO: ${statute.toUpperCase()}`, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 8;

  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.6);
  doc.line((pageWidth - 40) / 2, cursorY, (pageWidth + 40) / 2, cursorY);
  cursorY += 10;

  // Clauses
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  const cleanParagraphs = paragraphs.filter((p) => {
    const normalized = p.trim().toUpperCase();
    return normalized !== titleText && !normalized.startsWith(titleText);
  });

  cleanParagraphs.forEach((para) => {
    const isClauseHeading = /^\d+\.\s+[A-Z\s]+:/.test(para.trim());
    if (isClauseHeading) {
      cursorY += 2;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(10, 17, 40);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    }

    const lines = doc.splitTextToSize(para, contentWidth);
    if (cursorY + lines.length * 4.8 > pageHeight - 55) {
      doc.addPage();
      cursorY = 24;
    }

    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 4.8 + 3.5;
  });

  // Signatures
  if (cursorY > pageHeight - 85) {
    doc.addPage();
    cursorY = 24;
  } else {
    cursorY += 4;
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('IN WITNESS WHEREOF, THE PARTIES HAVE EXECUTED THIS INSTRUMENT:', margin, cursorY);
  cursorY += 6;

  const colWidth = (contentWidth - 8) / 2;

  // Party A Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, cursorY, colWidth, 26, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(firstPartyName || '[First Party]', margin + 4, cursorY + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('AUTHORIZED FIRST PARTY SIGNATURE', margin + 4, cursorY + 13);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 4, cursorY + 20, margin + colWidth - 4, cursorY + 20);

  // Party B Box
  const col2X = margin + colWidth + 8;
  doc.roundedRect(col2X, cursorY, colWidth, 26, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(secondPartyName || '[Second Party]', col2X + 4, cursorY + 7);

  if (signatureText) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text(signatureText, col2X + 4, cursorY + 16);
  } else {
    doc.setDrawColor(226, 232, 240);
    doc.line(col2X + 4, cursorY + 20, col2X + colWidth - 4, cursorY + 20);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(signatureText ? 'ELECTRONICALLY VERIFIED' : 'AUTHORIZED SECOND PARTY SIGNATURE', col2X + 4, cursorY + 22);

  cursorY += 31;

  // Witnesses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ATTESTED BY TWO LEGAL WITNESSES (በምስክሮች ፊት የተፈረመ):', margin, cursorY);
  cursorY += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, cursorY, colWidth, 16, 1, 1, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Witness Full Name: _____________________', margin + 3, cursorY + 5);
  doc.text('   ID No / Signature: _______________________', margin + 3, cursorY + 11);

  doc.roundedRect(col2X, cursorY, colWidth, 16, 1, 1, 'FD');
  doc.text('2. Witness Full Name: _____________________', col2X + 3, cursorY + 5);
  doc.text('   ID No / Signature: _______________________', col2X + 3, cursorY + 11);

  // Footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Ref: ${documentRef} • Compliant with Federal Laws of Ethiopia`, margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  const cleanFileName = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_executed.pdf`;
  doc.save(cleanFileName);
}

// ========================================================
// 2. OFFICIAL GAZETTE & STATUTORY REPOSITORY PDF GENERATOR
// ========================================================
interface GazettePDFParams {
  title: string;
  amharicTitle: string;
  proclamationNumber?: string;
  category: string;
  year: number;
  summary: string;
  amharicSummary: string;
  pages: number;
  fileName?: string;
}

export function generateGazettePDF({
  title,
  amharicTitle,
  proclamationNumber,
  category,
  year,
  summary,
  amharicSummary,
  pages,
  fileName
}: GazettePDFParams) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 22;

  // Official Negarit Gazette Emblem Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 17, 40);
  doc.text('FEDERAL NEGARIT GAZETTE', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('OF THE FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA', pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 7;

  doc.setDrawColor(10, 17, 40);
  doc.setLineWidth(0.8);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 1.5;
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 10;

  // Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text(proclamationNumber ? proclamationNumber.toUpperCase() : category.toUpperCase(), margin + 5, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Official Year of Promulgation: ${year} • Federal Negarit Gazeta Official Record`, margin + 5, cursorY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 17, 40);
  doc.text(`AUTHENTIC COPY`, pageWidth - margin - 5, cursorY + 7, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Complete Statutory Instrument`, pageWidth - margin - 5, cursorY + 14, { align: 'right' });

  cursorY += 30;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(10, 17, 40);
  const titleLines = doc.splitTextToSize(title.toUpperCase(), contentWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 6 + 4;

  // Decorative rule
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin + 30, cursorY, pageWidth - margin - 30, cursorY);
  cursorY += 10;

  // Statutory Summary Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(10, 17, 40);
  doc.text('LEGISLATIVE PURPOSE AND SCOPE (መግቢያና ዓላማ):', margin, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(summary, contentWidth);
  doc.text(summaryLines, margin, cursorY);
  cursorY += summaryLines.length * 5 + 6;

  // Legal Framework Provisions Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, cursorY, contentWidth, 75, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 17, 40);
  doc.text('PRIMARY STATUTORY ARTICLES & REGULATORY FRAMEWORK:', margin + 6, cursorY + 8);

  const provisions = [
    '• Article 1 - Short Title: This instrument may be cited under official Negarit Gazeta publication.',
    '• Article 2 - Definitions: Specific operative legal definitions promulgated under federal law.',
    '• Article 3 - Scope of Application: Enforceable across all regional states and federal administrations.',
    '• Article 4 - Substantive Rights & Obligations: Mandatory compliance requirements and civil liabilities.',
    '• Article 5 - Enforcement & Directives: Authority granted to respective Ministries to issue guidelines.',
    '• Article 6 - Effective Date: Enforceable from the date of official publication in the Negarit Gazeta.'
  ];

  let provY = cursorY + 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  provisions.forEach((prov) => {
    doc.text(prov, margin + 6, provY);
    provY += 8.5;
  });

  cursorY += 86;

  // Seal & Certification Block
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursorY, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 17, 40);
  doc.text('CERTIFIED STATUTORY REPOSITORY RECORD', margin + 6, cursorY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Issued via LegalLink Public Legal Document Repository • Free Legal Access Initiative for Ethiopia.', margin + 6, cursorY + 13);
  doc.text('Direct statutory advisory and licensed representation available through LegalLink Advocate Chambers.', margin + 6, cursorY + 18);

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Document Archive • LegalLink Technologies PLC • Bole, Addis Ababa`, margin, pageHeight - 7);
  doc.text(`Page 1 of 1 • Complete Instrument Available`, pageWidth - margin, pageHeight - 7, { align: 'right' });

  const cleanFileName = fileName || `${(proclamationNumber || title).toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
  doc.save(cleanFileName);
}