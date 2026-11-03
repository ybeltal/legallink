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
  // Standard A4 Dimensions: 210mm x 297mm
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

  // Generate Unique Verification Reference Code
  const documentRef = `ETH-DOC-${Date.now().toString().slice(-6)}`;
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // ==========================================
  // 1. INSTITUTIONAL HEADER (No Overlap)
  // ==========================================
  // Left: Institutional Platform Seal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 17, 40); // Deep Navy #0A1128
  doc.text('LEGALLINK ETHIOPIA', margin, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('LexDraft Document Automation System', margin, cursorY + 4);

  // Right: Document Reference & Issue Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 17, 40);
  doc.text(documentRef, pageWidth - margin, cursorY, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(dateFormatted, pageWidth - margin, cursorY + 4, { align: 'right' });

  // Dividing Rule Below Header
  cursorY += 8;
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.4);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 12;

  // ==========================================
  // 2. PRIMARY DOCUMENT TITLE & STATUTORY SUBTITLE
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(10, 17, 40);
  
  const titleText = title.toUpperCase();
  const titleLines = doc.splitTextToSize(titleText, contentWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 5 + 2;

  // Statutory Citation Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text(`CONCLUDED PURSUANT TO: ${statute.toUpperCase()}`, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 8;

  // Accent Line Under Title
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.setLineWidth(0.6);
  doc.line((pageWidth - 40) / 2, cursorY, (pageWidth + 40) / 2, cursorY);
  cursorY += 10;

  // ==========================================
  // 3. DOCUMENT CLAUSES & SUBSTANCE
  // ==========================================
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59); // Slate 800

  // Filter out redundant duplicated titles from template paragraphs
  const cleanParagraphs = paragraphs.filter((p) => {
    const normalized = p.trim().toUpperCase();
    return normalized !== titleText && !normalized.startsWith(titleText);
  });

  cleanParagraphs.forEach((para) => {
    const isClauseHeading = /^\d+\.\s+[A-Z\s]+:/.test(para.trim());
    const isPreamble = para.startsWith('This') || para.startsWith('Between') || para.startsWith('Executed');

    if (isClauseHeading) {
      cursorY += 2;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(10, 17, 40);
    } else if (isPreamble) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    }

    const lines = doc.splitTextToSize(para, contentWidth);

    // Multi-page automatic page break check
    if (cursorY + lines.length * 4.8 > pageHeight - 55) {
      doc.addPage();
      cursorY = 24;
    }

    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 4.8 + 3.5;
  });

  // ==========================================
  // 4. SIGNATURE EXECUTION BLOCK
  // ==========================================
  // Ensure execution block never gets sliced across page boundary
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

  // Box 1: First Party Signature Block
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255); // Clean white background
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

  // Box 2: Second Party Signature Block
  const col2X = margin + colWidth + 8;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255); // Matching clean white background
  doc.roundedRect(col2X, cursorY, colWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(secondPartyName || '[Second Party]', col2X + 4, cursorY + 7);

  if (signatureText) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9); // Amber 700 digital signature
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

  // ==========================================
  // 5. ATTESTED BY WITNESSES (Civil Code Art. 1727 & 1728)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('ATTESTED BY TWO LEGAL WITNESSES (በምስክሮች ፊት የተፈረመ):', margin, cursorY);
  cursorY += 5;

  // Witness 1
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, cursorY, colWidth, 16, 1, 1, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Witness Full Name: _____________________', margin + 3, cursorY + 5);
  doc.text('   ID No / Signature: _______________________', margin + 3, cursorY + 11);

  // Witness 2
  doc.roundedRect(col2X, cursorY, colWidth, 16, 1, 1, 'FD');
  doc.text('2. Witness Full Name: _____________________', col2X + 3, cursorY + 5);
  doc.text('   ID No / Signature: _______________________', col2X + 3, cursorY + 11);

  // ==========================================
  // 6. COMPLIANCE WATERMARK & PAGE FOOTERS
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom Border Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Left Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Ref: ${documentRef} • Compliant with Federal Laws of Ethiopia`, margin, pageHeight - 7);

    // Right Footer
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Trigger Instant Native PDF Download
  const cleanFileName = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_executed.pdf`;
  doc.save(cleanFileName);
}