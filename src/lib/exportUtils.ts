import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  } as any);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`${filename}.pdf`);
}

export async function exportToImage(element: HTMLElement, filename: string, format: 'png' | 'jpeg' = 'png') {
  const canvas = await html2canvas(element, {
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  } as any);
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = canvas.toDataURL(`image/${format}`, 0.95);
  link.click();
}

export function printInvoice(element: HTMLElement) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  // Copy the app's stylesheets (Tailwind + fonts) into the print window so the
  // invoice templates render with their real styling instead of plain HTML.
  const styles = Array.from(
    document.querySelectorAll('style, link[rel="stylesheet"]')
  )
    .map(node => node.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Invoice</title>
      ${styles}
      <style>
        body { margin: 0; padding: 0; background: #fff; }
        @page { margin: 10mm; size: A4; }
      </style>
    </head>
    <body>
      ${element.outerHTML}
      <script>
        // Give the stylesheets a moment to apply before printing.
        window.onload = function() {
          setTimeout(function() { window.print(); window.close(); }, 350);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
