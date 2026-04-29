import React, { useEffect, useRef, useState } from 'react';
import { convertImageToPng, validateImageFile } from '@factory/image-converter';

type Props = {
  locale: string;
  config: any;
};

type Labels = {
  intro: string;
  idle: string;
  dropTitle: string;
  dropHint: string;
  supportedPrefix: string;
  maxSizePrefix: string;
  chooseImage: string;
  converting: string;
  ready: string;
  failed: string;
  download: string;
  convertAnother: string;
  privacy: string;
  selectedPrefix: string;
  unsupportedType: (type: string) => string;
  fileTooLarge: (maxMb: number) => string;
};

const LABELS: Record<string, Labels> = {
  es: {
    intro: 'Elige una imagen para convertirla a PNG.',
    idle: 'Lista para convertir',
    dropTitle: 'Suelta una imagen aquí',
    dropHint: 'O elige un archivo desde tu dispositivo.',
    supportedPrefix: 'Formatos compatibles',
    maxSizePrefix: 'Tamaño máximo',
    chooseImage: 'Elegir imagen',
    converting: 'Convirtiendo en tu navegador...',
    ready: 'Tu PNG está listo.',
    failed: 'No se pudo convertir la imagen.',
    download: 'Descargar PNG',
    convertAnother: 'Convertir otra imagen',
    privacy: 'La conversión se ejecuta en tu navegador. La imagen seleccionada no se sube a un servidor.',
    selectedPrefix: 'Archivo',
    unsupportedType: (type) => `Formato no compatible: ${type || 'desconocido'}.`,
    fileTooLarge: (maxMb) => `El archivo es demasiado grande. El tamaño máximo es ${maxMb} MB.`
  },
  en: {
    intro: 'Choose an image file to convert it to PNG.',
    idle: 'Ready to convert',
    dropTitle: 'Drop an image here',
    dropHint: 'Or choose a file from your device.',
    supportedPrefix: 'Supported formats',
    maxSizePrefix: 'Maximum size',
    chooseImage: 'Choose image',
    converting: 'Converting in your browser...',
    ready: 'Your PNG is ready.',
    failed: 'The image could not be converted.',
    download: 'Download PNG',
    convertAnother: 'Convert another image',
    privacy: 'Privacy: conversion runs in your browser. This tool does not upload the selected image to a server.',
    selectedPrefix: 'File',
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
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(labels.intro);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
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
      setSelectedFileName(null);
      setError(validationMessage(file, validation));
      setStatus(labels.intro);
      track('tool_error', { toolId: 'convert-image-to-png', locale, reason: validation.reason });
      return;
    }
    track('file_selected', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    track('tool_start', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    setSelectedFileName(file.name);
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
    <div className="tool-grid image-converter">
      <input
        ref={inputRef}
        type="file"
        accept={acceptedInputTypes.join(',')}
        className="visually-hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <div
        className={`dropzone image-dropzone${dragging ? ' dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}
      >
        <div className="dropzone-icon" aria-hidden="true">PNG</div>
        <div className="dropzone-copy">
          <p className="dropzone-title">{labels.dropTitle}</p>
          <p className="dropzone-hint">{labels.dropHint}</p>
          <div className="format-row" aria-label={labels.supportedPrefix}>
            {acceptedInputTypes.map((type: string) => <span className="format-chip" key={type}>{humanMime(type)}</span>)}
            <span className="format-chip">{maxFileSizeMb} MB</span>
          </div>
        </div>
        <button className="choose-button" type="button" onClick={() => inputRef.current?.click()}>{labels.chooseImage}</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className={downloadUrl ? 'success converter-status converter-status--ready' : 'result-panel converter-status'}>
        <strong>{downloadUrl ? labels.ready : labels.idle}</strong>
        {(!downloadUrl || status !== labels.ready) && <span>{status}</span>}
        {selectedFileName && <span className="selected-file">{labels.selectedPrefix}: {selectedFileName}</span>}
      </div>
      {downloadUrl && (
        <div className="converter-actions">
          <a className="button" href={downloadUrl} download={downloadName} onClick={() => track('download_action', { toolId: 'convert-image-to-png', locale })}>{labels.download}</a>
          <button type="button" className="secondary" onClick={() => { clearDownload(); setSelectedFileName(null); setStatus(labels.intro); }}>{labels.convertAnother}</button>
        </div>
      )}
      <p className="small privacy-line">{labels.privacy}</p>
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
