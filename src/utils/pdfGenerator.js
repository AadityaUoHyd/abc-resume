import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fixTailwindColors } from './helper';

// Size helpers
const MB = 1024 * 1024;
const SIZE_LIMIT_MB = 18; // keep some headroom below 20MB SMTP limit

// Sensible defaults
const DEFAULTS = {
  quality: 0.85, // JPEG quality (0..1)
  scale: 2,      // html2canvas scale
};

export const generatePDFFromElement = async (element, filename = 'resume.pdf', options = {}) => {
  const quality = typeof options.quality === 'number' ? options.quality : DEFAULTS.quality;
  const scale = typeof options.scale === 'number' ? options.scale : DEFAULTS.scale;

  // A4 dimensions in pixels at 96 DPI (standard screen resolution)
  const A4_WIDTH_PX = 794;   // 210mm
  const A4_HEIGHT_PX = 1123; // 297mm
  const A4_WIDTH_MM = 210;   // mm
  const A4_HEIGHT_MM = 297;  // mm

  let clone = null;
  try {
    // Clone the element so we don't mutate the live UI
    clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = '-10000px';
    clone.style.top = '0';
    clone.style.background = '#ffffff';
    // Remove fixed height to allow natural content height
    clone.style.width = `${A4_WIDTH_PX}px`;
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';

    document.body.appendChild(clone);

    // Tailwind v4 uses oklch colors that html2canvas can't parse; normalize to rgb
    fixTailwindColors(clone);

    // Get the natural height of the content
    const contentHeight = clone.scrollHeight;
    const totalPages = Math.ceil(contentHeight / A4_HEIGHT_PX);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Generate each page
    for (let pageNum = 0; pageNum < totalPages; pageNum++) {
      const yOffset = pageNum * A4_HEIGHT_PX;
      
      // Create a temporary element for this page
      const pageElement = document.createElement('div');
      pageElement.style.position = 'fixed';
      pageElement.style.left = '-10000px';
      pageElement.style.top = '0';
      pageElement.style.width = `${A4_WIDTH_PX}px`;
      pageElement.style.height = `${A4_HEIGHT_PX}px`;
      pageElement.style.backgroundColor = '#ffffff';
      pageElement.style.overflow = 'hidden';
      
      // Clone the content and position it for this page
      const contentClone = clone.cloneNode(true);
      contentClone.style.position = 'absolute';
      contentClone.style.top = `-${yOffset}px`;
      contentClone.style.left = '0';
      contentClone.style.width = `${A4_WIDTH_PX}px`;
      contentClone.style.height = `${contentHeight}px`;
      
      pageElement.appendChild(contentClone);
      document.body.appendChild(pageElement);

      // Render this page to canvas
      const canvas = await html2canvas(pageElement, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX,
        scrollX: 0,
        scrollY: 0,
      });

      // Convert to JPEG
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Add page to PDF (add new page after first page)
      if (pageNum > 0) {
        pdf.addPage();
      }
      
      // Add image to fit exactly on A4 page
      pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

      // Clean up temporary page element
      document.body.removeChild(pageElement);
    }

    return pdf;
  } catch (error) {
    throw new Error('Failed to generate PDF');
  } finally {
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
};

export const generatePDFBlob = async (element, options = {}) => {
  // Try with provided or default settings
  let pdf = await generatePDFFromElement(element, 'resume.pdf', options);
  let blob = pdf.output('blob');

  // If still too large, try progressively lowering quality/scale
  if (blob.size > SIZE_LIMIT_MB * MB) {
    // Lower quality first
    pdf = await generatePDFFromElement(element, 'resume.pdf', { ...options, quality: 0.7 });
    blob = pdf.output('blob');
  }
  if (blob.size > SIZE_LIMIT_MB * MB) {
    // Lower quality and scale as last resort
    pdf = await generatePDFFromElement(element, 'resume.pdf', { ...options, quality: 0.6, scale: 1.4 });
    blob = pdf.output('blob');
  }

  return blob;
};

export const downloadPDF = async (element, filename = 'resume.pdf', options = {}) => {
  const pdf = await generatePDFFromElement(element, filename, options);
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};
