"use strict";

export class PdfGenerator {
  constructor(textArea, resultsContainer) {
    this.textArea = textArea;
    this.resultsContainer = resultsContainer;
  }

  async generatePdf(fileName) {
    const pdf = new jsPDF();
    const text = this.textArea.value.trim();
    const timestamp = new Date().toLocaleString();

    // Generate cover page
    this.generateCoverPage(pdf, fileName, timestamp);

    // Add original text
    pdf.addPage();
    this.addTextContent(pdf, text);

    // Add results
    pdf.addPage();
    await this.addResultsContent(pdf);

    return pdf;
  }

  generateCoverPage(pdf, fileName, timestamp) {
    pdf.setFillColor(230, 230, 230);
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.width,
      pdf.internal.pageSize.height,
      "F"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text(fileName, 105, 80, null, null, "center");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${timestamp}`, 105, 100, null, null, "center");

    pdf.setLineWidth(0.5);
    pdf.line(20, 110, 190, 110);
  }

  addTextContent(pdf, text) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    const lines = pdf.splitTextToSize(text, 180);
    let y = 20;
    lines.forEach((line) => {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(15, y, line);
      y += 7;
    });
  }

  async addResultsContent(pdf) {
    const canvas = await html2canvas(this.resultsContainer);
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  }
}
