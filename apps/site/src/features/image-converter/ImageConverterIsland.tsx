import React, { useEffect, useRef, useState } from 'react';
import { convertImageToPng, validateImageFile } from '@factory/image-converter';

type Props = {
  locale: string;
  config: any;
};

type Labels = {
  intro: string;
  dropTitle: string;
  supportedPrefix: string;
  maxSizePrefix: string;
  chooseImage: string;
  converting: string;
  ready: string;
  failed: string;
  download: string;
  convertAnother: string;
  privacy: string;
  unsupportedType: (type: string) => string;
  fileTooLarge: (maxMb: number) => string;
};

const LABELS: Record<string, Labels> = {
  es: {
    intro: 'Elige una imagen para convertirla a PNG.',
    dropTitle: 'Suelta una imagen aquí',
    supportedPrefix: 'Formatos compatibles',
    maxSizePrefix: 'Tamaño máximo',
    chooseImage: 'Elegir imagen',
    converting: 'Convirtiendo en tu navegador...',
    ready: 'Tu PNG está listo.',
    failed: 'No se pudo convertir la imagen.',
    download: 'Descargar PNG',
    convertAnother: 'Convertir otra imagen',
    privacy: 'Privacidad: la conversión se ejecuta en tu navegador. Esta herramienta no sube la imagen seleccionada a un servidor.',
    unsupportedType: (type) => `Formato no compatible: ${type || 'desconocido'}.`,
    fileTooLarge: (maxMb) => `El archivo es demasiado grande. El tamaño máximo es ${maxMb} MB.`
  },
  en: {
    intro: 'Choose an image file to convert it to PNG.',
    dropTitle: 'Drop an image here',
    supportedPrefix: 'Supported formats',
    maxSizePrefix: 'Maximum size',
    chooseImage: 'Choose image',
    converting: 'Converting in your browser...',
    ready: 'Your PNG is ready.',
    failed: 'The image could not be converted.',
    download: 'Download PNG',
    convertAnother: 'Convert another image',
    privacy: 'Privacy: conversion runs in your browser. This tool does not upload the selected image to a server.',
    unsupportedType: (type) => `Unsupported file type: ${type || 'unknown'}.`,
    fileTooLarge: (maxMb) => `File is too large. Maximum size is ${maxMb} MB.`
  }
};

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

function labelsFor(locale: string): Labels {
  return LABELS[locale] ?? LABELS.en;
}

function humanMime(type: string) {
  if (type === 'image/jpeg') return 'JPG/JPEG';
  if (type === 'image/png') return 'PNG';
  if (type === 'image/webp') return 'WebP';
  return type;
}

export default function ImageConverterIsland({ locale, config }: Props) {
  const labels = labelsFor(locale);
  const maxFileSizeMb = config?.options?.maxFileSizeMb ?? 10;
  const acceptedInputTypes = config?.options?.acceptedInputTypes ?? ['image/jpeg', 'image/png', 'image/webp'];
  const supportedText = acceptedInputTypes.map(humanMime).join(', ');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(labels.intro);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('converted.png');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  function clearDownload() {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
  }

  function validationMessage(file: File, validation: { reason: string; message: string }) {
    if (validation.reason === 'unsupported_type') return labels.unsupportedType(file.type);
    if (validation.reason === 'file_too_large') return labels.fileTooLarge(maxFileSizeMb);
    return validation.message;
  }

  async function handleFile(file: File) {
    setError(null);
    clearDownload();
    const validation = validateImageFile(file, { maxFileSizeMb, acceptedInputTypes });
    if (!validation.ok) {
      setError(validationMessage(file, validation));
      setStatus(labels.intro);
      track('tool_error', { toolId: 'convert-image-to-png', locale, reason: validation.reason });
      return;
    }
    track('file_selected', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    track('tool_start', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    setStatus(labels.converting);
    try {
      const result = await convertImageToPng(file);
      setDownloadUrl(result.url);
      setDownloadName(result.filename);
      setStatus(labels.ready);
      track('tool_complete', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size), success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : labels.failed;
      setError(locale === 'es' ? labels.failed : message);
      setStatus(labels.failed);
      track('tool_error', { toolId: 'convert-image-to-png', locale, reason: 'conversion_failed' });
    }
  }

  function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="tool-grid">
      <input
        ref={inputRef}
        type="file"
        accept={acceptedInputTypes.join(',')}
        style={{ display: 'none' }}
        onChange={(e) => onFiles(e.target.files)}
      />
      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}
      >
        <p><strong>{labels.dropTitle}</strong></p>
        <p className="small">{labels.supportedPrefix}: {supportedText}. {labels.maxSizePrefix}: {maxFileSizeMb} MB.</p>
        <button type="button" onClick={() => inputRef.current?.click()}>{labels.chooseImage}</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className={downloadUrl ? 'success' : 'result-panel'}>{status}</div>
      {downloadUrl && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="button" href={downloadUrl} download={downloadName} onClick={() => track('download_action', { toolId: 'convert-image-to-png', locale })}>{labels.download}</a>
          <button type="button" className="secondary" onClick={() => { clearDownload(); setStatus(labels.intro); }}>{labels.convertAnother}</button>
        </div>
      )}
      <p className="small">{labels.privacy}</p>
    </div>
  );
}

function sizeBucket(size: number) {
  const mb = size / 1024 / 1024;
  if (mb < 1) return '<1MB';
  if (mb < 5) return '1-5MB';
  if (mb < 10) return '5-10MB';
  return '10MB+';
}
