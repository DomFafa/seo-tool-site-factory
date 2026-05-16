export type HeicFileValidationOptions = {
  maxFileSizeMb: number;
  acceptedInputTypes: string[];
  acceptedExtensions: string[];
};

export type HeicFileValidationResult =
  | { ok: true; detectedType: string }
  | { ok: false; reason: 'missing_file' | 'unsupported_type' | 'file_too_large'; message: string };

export type ImageDimensions = {
  width: number;
  height: number;
};

export type OpenedHeicImage = {
  blob: Blob;
  url: string;
  dimensions: ImageDimensions;
  source: 'native' | 'heic2any';
};

export type ExportedImage = {
  blob: Blob;
  url: string;
  filename: string;
  mimeType: 'image/png' | 'image/jpeg';
};

export function validateHeicFile(file: File | null | undefined, options: HeicFileValidationOptions): HeicFileValidationResult {
  if (!file) {
    return { ok: false, reason: 'missing_file', message: 'Choose a .heic or .heif image.' };
  }

  const maxBytes = options.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, reason: 'file_too_large', message: `File is too large. Maximum size is ${options.maxFileSizeMb} MB.` };
  }

  const detectedType = detectHeicType(file, options);
  if (!detectedType) {
    return { ok: false, reason: 'unsupported_type', message: 'Choose a .heic or .heif image.' };
  }

  return { ok: true, detectedType };
}

export function detectHeicType(file: File, options: Pick<HeicFileValidationOptions, 'acceptedInputTypes' | 'acceptedExtensions'>): string {
  const lowerName = file.name.toLowerCase();
  const extension = options.acceptedExtensions.find((item) => lowerName.endsWith(item.toLowerCase()));
  if (file.type && options.acceptedInputTypes.includes(file.type)) return file.type;
  if (extension === '.heif') return 'image/heif';
  if (extension === '.heic') return 'image/heic';
  return '';
}

export function sizeBucket(size: number): string {
  const mb = size / 1024 / 1024;
  if (mb < 1) return '<1MB';
  if (mb < 5) return '1-5MB';
  if (mb < 10) return '5-10MB';
  if (mb < 25) return '10-25MB';
  return '25MB+';
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${stripTrailingZero(kb)} KB`;
  return `${stripTrailingZero(kb / 1024)} MB`;
}

export function outputFilename(inputName: string, extension: 'png' | 'jpg'): string {
  const clean = inputName.trim() || 'opened-heic-file';
  const base = clean.includes('.') ? clean.replace(/\.[^.]+$/, '') : clean;
  return `${base}.${extension}`;
}

export async function openHeicImage(file: File): Promise<OpenedHeicImage> {
  try {
    const bitmap = await createImageBitmap(file);
    const png = await bitmapToBlob(bitmap, 'image/png');
    const url = URL.createObjectURL(png);
    return { blob: png, url, dimensions: { width: bitmap.width, height: bitmap.height }, source: 'native' };
  } catch {
    const heic2any = await loadHeic2Any();
    const converted = await heic2any({ blob: file, toType: 'image/png', quality: 0.92 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    if (!(blob instanceof Blob)) throw new Error('This HEIC file could not be decoded in this browser.');
    const bitmap = await createImageBitmap(blob);
    const url = URL.createObjectURL(blob);
    return { blob, url, dimensions: { width: bitmap.width, height: bitmap.height }, source: 'heic2any' };
  }
}

export async function exportOpenedImage(source: Blob, inputName: string, mimeType: 'image/png' | 'image/jpeg'): Promise<ExportedImage> {
  const bitmap = await createImageBitmap(source);
  const blob = await bitmapToBlob(bitmap, mimeType, mimeType === 'image/jpeg' ? 0.92 : undefined);
  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: outputFilename(inputName, extension),
    mimeType
  };
}

async function bitmapToBlob(bitmap: ImageBitmap, mimeType: 'image/png' | 'image/jpeg', quality?: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available in this browser.');
  if (mimeType === 'image/jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create image output.')), mimeType, quality);
  });
}

async function loadHeic2Any(): Promise<(options: { blob: Blob; toType: string; quality?: number }) => Promise<Blob | Blob[]>> {
  const mod = await import('heic2any');
  return mod.default as (options: { blob: Blob; toType: string; quality?: number }) => Promise<Blob | Blob[]>;
}

function stripTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, '');
}

export * from './pdf';
