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
  // Standard A4: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 25;

  // 1. Institutional Header Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(10, 17, 40); // Deep Navy #0A1128
  doc.text('LEGALLINK ETHIOPIA • LEXDRAFT AUTOMATION', margin, cursorY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(`STATUTORY DRAFT • ${statute.toUpperCase()}`, pageWidth - margin, cursorY, { align: 'right' });

  cursorY += 4;
  doc.setDrawColor(226, 232, 240); // Slate 200 border
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);

  cursorY += 12;

  // 2. Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(10, 17, 40);
  
  const titleLines = doc.splitTextToSize(title.toUpperCase(), contentWidth);
  doc.text(titleLines, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += titleLines.length * 6 + 6;

  // 3. Document Body Clauses
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // Slate 700

  paragraphs.forEach((para, index) => {
    // If it's a section heading or opening proclamation line
    if (index === 0 || /^\d+\./.test(para.trim())) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
    }

    const lines = doc.splitTextToSize(para, contentWidth);

    // Check for page overflow
    if (cursorY + lines.length * 5 > pageHeight - 45) {
      doc.addPage();
      cursorY = 25;
    }

    doc.text(lines, margin, cursorY);
    cursorY += lines.length * 5 + 4;
  });

  // 4. Execution & Signature Block
  if (cursorY > pageHeight - 55) {
    doc.addPage();
    cursorY = 30;
  } else {
    cursorY += 8;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('EXECUTED BY THE UNDERSIGNED PARTIES:', margin, cursorY);
  cursorY += 8;

  const colWidth = (contentWidth - 10) / 2;

  // First Party Signature Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, cursorY, colWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(firstPartyName || '[First Party]', margin + 4, cursorY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('AUTHORIZED FIRST PARTY SIGNATURE', margin + 4, cursorY + 16);

  // Second Party Signature Box
  const col2X = margin + colWidth + 10;
  doc.roundedRect(col2X, cursorY, colWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(secondPartyName || '[Second Party]', col2X + 4, cursorY + 8);

  if (signatureText) {
    doc.setFont('times', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9); // Amber 700 digital ink
    doc.text(signatureText, col2X + 4, cursorY + 15);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('ELECTRONICALLY VERIFIED SIGNATURE', col2X + 4, cursorY + 21);

  // 5. Page Numbering & Bottom Compliance Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated via LegalLink LexDraft • Compliant with Federal Laws of Ethiopia • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Trigger browser download
  const cleanFileName = fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_draft.pdf`;
  doc.save(cleanFileName);
}