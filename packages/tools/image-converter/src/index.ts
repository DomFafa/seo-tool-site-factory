export type FileValidationOptions = {
  maxFileSizeMb: number;
  acceptedInputTypes: string[];
};

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: string; message: string };

export function validateImageFile(file: File, options: FileValidationOptions): FileValidationResult {
  if (!options.acceptedInputTypes.includes(file.type)) {
    return { ok: false, reason: 'unsupported_type', message: `Unsupported file type: ${file.type || 'unknown'}.` };
  }
  const maxBytes = options.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { ok: false, reason: 'file_too_large', message: `File is too large. Maximum size is ${options.maxFileSizeMb} MB.` };
  }
  return { ok: true };
}

export async function convertImageToPng(file: File): Promise<{ blob: Blob; url: string; filename: string }> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not available in this browser.');
  context.drawImage(bitmap, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not create PNG output.')), 'image/png');
  });
  const url = URL.createObjectURL(blob);
  const filename = file.name.replace(/\.[^.]+$/, '') + '.png';
  return { blob, url, filename };
}
