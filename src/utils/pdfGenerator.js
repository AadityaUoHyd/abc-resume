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

  let clone = null;
  try {
    // Clone the element so we don't mutate the live UI
    clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = '-10000px';
    clone.style.top = '0';
    clone.style.background = '#ffffff';
    // Force A4 dimensions instead of using element dimensions
    clone.style.width = `${A4_WIDTH_PX}px`;
    clone.style.height = `${A4_HEIGHT_PX}px`;
    clone.style.overflow = 'hidden';

    document.body.appendChild(clone);

    // Tailwind v4 uses oklch colors that html2canvas can't parse; normalize to rgb
    fixTailwindColors(clone);

    // Render to canvas using A4 dimensions
    const canvas = await html2canvas(clone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      scrollX: 0,
      scrollY: 0,
    });

    // Convert to JPEG (much smaller than PNG)
    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    // A4 dimensions in mm for jsPDF
    const a4WidthMm = 210;
    const a4HeightMm = 297;

    // Create PDF with exact A4 dimensions - no scaling needed since canvas is already A4 sized
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add image to fit exactly on A4 page (no scaling, perfect fit)
    pdf.addImage(dataUrl, 'JPEG', 0, 0, a4WidthMm, a4HeightMm);

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
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
