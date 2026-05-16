import { PDFDocument } from 'pdf-lib';

export type PdfPageSize = 'auto' | 'a4' | 'letter';
export type PdfOrientation = 'auto' | 'portrait' | 'landscape';
export type PdfMargin = 'none' | 'small' | 'medium';

export type PdfImageInput = {
  blob: Blob;
  filename: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type PdfExportOptions = {
  pageSize: PdfPageSize;
  orientation: PdfOrientation;
  margin: PdfMargin;
};

export type ExportedPdf = {
  blob: Blob;
  url: string;
  filename: string;
  pageCount: number;
  mimeType: 'application/pdf';
};

type Dimensions = { width: number; height: number };

const A4_POINTS: Dimensions = { width: 595.28, height: 841.89 };
const LETTER_POINTS: Dimensions = { width: 612, height: 792 };
const AUTO_MAX_LONG_SIDE_POINTS = 1200;

export function pdfOutputFilename(inputNames: string[]): string {
  if (inputNames.length !== 1) return 'heic-images.pdf';
  const clean = inputNames[0]?.trim() || 'heic-image';
  const base = clean.includes('.') ? clean.replace(/\.[^.]+$/, '') : clean;
  return `${base || 'heic-image'}.pdf`;
}

export function getPdfPageSizePoints(
  imageDimensions: Dimensions,
  options: Pick<PdfExportOptions, 'pageSize' | 'orientation'>
): Dimensions {
  const source = sanitizeDimensions(imageDimensions);
  let pageDimensions =
    options.pageSize === 'a4' ? { ...A4_POINTS }
      : options.pageSize === 'letter' ? { ...LETTER_POINTS }
        : getAutoPageSize(source);

  const shouldLandscape = options.orientation === 'landscape'
    || (options.orientation === 'auto' && source.width > source.height);
  const shouldPortrait = options.orientation === 'portrait'
    || (options.orientation === 'auto' && source.height >= source.width);

  if (shouldLandscape && pageDimensions.height > pageDimensions.width) {
    pageDimensions = swapDimensions(pageDimensions);
  }
  if (shouldPortrait && pageDimensions.width > pageDimensions.height) {
    pageDimensions = swapDimensions(pageDimensions);
  }

  return pageDimensions;
}

export function getPdfMarginPoints(margin: PdfMargin): number {
  if (margin === 'small') return 24;
  if (margin === 'medium') return 48;
  return 0;
}

export function fitImageIntoPage(
  imageDimensions: Dimensions,
  pageDimensions: Dimensions,
  marginPoints: number
): { x: number; y: number; width: number; height: number } {
  const source = sanitizeDimensions(imageDimensions);
  const safeMargin = Math.max(0, marginPoints);
  const availableWidth = Math.max(1, pageDimensions.width - safeMargin * 2);
  const availableHeight = Math.max(1, pageDimensions.height - safeMargin * 2);
  const scale = Math.min(availableWidth / source.width, availableHeight / source.height);
  const width = source.width * scale;
  const height = source.height * scale;

  return {
    x: (pageDimensions.width - width) / 2,
    y: (pageDimensions.height - height) / 2,
    width,
    height
  };
}

export async function exportImagesToPdf(images: PdfImageInput[], options: PdfExportOptions): Promise<ExportedPdf> {
  if (images.length === 0) throw new Error('At least one image is required.');

  const pdf = await PDFDocument.create();
  const marginPoints = getPdfMarginPoints(options.margin);

  for (const image of images) {
    const pageDimensions = getPdfPageSizePoints(image.dimensions, options);
    const page = pdf.addPage([pageDimensions.width, pageDimensions.height]);
    const jpegBytes = await blobToJpegBytes(image.blob);
    const embedded = await pdf.embedJpg(jpegBytes);
    const fitted = fitImageIntoPage(image.dimensions, pageDimensions, marginPoints);
    page.drawImage(embedded, fitted);
  }

  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: pdfOutputFilename(images.map((image) => image.filename)),
    pageCount: images.length,
    mimeType: 'application/pdf'
  };
}

function getAutoPageSize(imageDimensions: Dimensions): Dimensions {
  const source = sanitizeDimensions(imageDimensions);
  const scale = AUTO_MAX_LONG_SIDE_POINTS / Math.max(source.width, source.height);
  return {
    width: source.width * scale,
    height: source.height * scale
  };
}

function sanitizeDimensions(dimensions: Dimensions): Dimensions {
  return {
    width: Math.max(1, dimensions.width || 1),
    height: Math.max(1, dimensions.height || 1)
  };
}

function swapDimensions(dimensions: Dimensions): Dimensions {
  return { width: dimensions.height, height: dimensions.width };
}

async function blobToJpegBytes(blob: Blob): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(blob);
  try {
    const jpeg = await bitmapToJpegBlob(bitmap);
    return new Uint8Array(await jpeg.arrayBuffer());
  } finally {
    bitmap.close();
  }
}

async function bitmapToJpegBlob(bitmap: ImageBitmap): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available in this browser.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create PDF image.')), 'image/jpeg', 0.92);
  });
}
