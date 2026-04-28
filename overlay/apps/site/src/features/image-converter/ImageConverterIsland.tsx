import React, { useRef, useState } from 'react';
import { convertImageToPng, validateImageFile } from '@factory/image-converter';

type Props = {
  locale: string;
  config: any;
};

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function ImageConverterIsland({ locale, config }: Props) {
  const maxFileSizeMb = config?.options?.maxFileSizeMb ?? 10;
  const acceptedInputTypes = config?.options?.acceptedInputTypes ?? ['image/jpeg', 'image/png', 'image/webp'];
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Choose an image file to convert it to PNG.');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>('converted.png');
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setDownloadUrl(null);
    const validation = validateImageFile(file, { maxFileSizeMb, acceptedInputTypes });
    if (!validation.ok) {
      setError(validation.message);
      track('tool_error', { toolId: 'convert-image-to-png', locale, reason: validation.reason });
      return;
    }
    track('file_selected', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    track('tool_start', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size) });
    setStatus('Converting in your browser...');
    try {
      const result = await convertImageToPng(file);
      setDownloadUrl(result.url);
      setDownloadName(result.filename);
      setStatus('Your PNG is ready.');
      track('tool_complete', { toolId: 'convert-image-to-png', locale, inputMimeType: file.type, fileSizeBucket: sizeBucket(file.size), success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Conversion failed.';
      setError(message);
      setStatus('Conversion failed.');
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
        <p><strong>Drop an image here</strong></p>
        <p className="small">Supported: {acceptedInputTypes.join(', ')}. Max size: {maxFileSizeMb} MB.</p>
        <button type="button" onClick={() => inputRef.current?.click()}>Choose image</button>
      </div>
      {error && <div className="error">{error}</div>}
      <div className={downloadUrl ? 'success' : 'result-panel'}>{status}</div>
      {downloadUrl && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="button" href={downloadUrl} download={downloadName} onClick={() => track('download_action', { toolId: 'convert-image-to-png', locale })}>Download PNG</a>
          <button type="button" className="secondary" onClick={() => { setDownloadUrl(null); setStatus('Choose another image to convert it to PNG.'); }}>Convert another</button>
        </div>
      )}
      <p className="small">Privacy: v1 conversion runs in your browser. The selected image is not uploaded by this tool.</p>
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
