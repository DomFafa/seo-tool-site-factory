import React, { useEffect, useRef, useState } from 'react';
import {
  exportImagesToPdf,
  formatBytes,
  openHeicImage,
  sizeBucket,
  validateHeicFile,
  type ExportedPdf,
  type OpenedHeicImage,
  type PdfMargin,
  type PdfOrientation,
  type PdfPageSize
} from '@factory/open-heic-file';

type PdfItemStatus = 'decoding' | 'ready' | 'error';
type ToolStatus = 'idle' | 'decoding' | 'ready' | 'generating' | 'generated' | 'error';

type PdfItem = {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeLabel: string;
  fileSizeBucket: string;
  status: PdfItemStatus;
  message: string;
  preview: OpenedHeicImage | null;
  pixels: string;
};

const acceptedInputTypes = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
const acceptedExtensions = ['.heic', '.heif'];
const maxFileSizeMb = 25;
const maxFilesPerPdf = 10;

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

function revokePreview(item: PdfItem) {
  if (item.preview?.url) URL.revokeObjectURL(item.preview.url);
}

function revokePdf(pdf: ExportedPdf | null) {
  if (pdf?.url) URL.revokeObjectURL(pdf.url);
}

function itemId(index: number): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${index}`;
}

export default function HeicToPdfIsland() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<PdfItem[]>([]);
  const generatedPdfRef = useRef<ExportedPdf | null>(null);
  const runIdRef = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<PdfItem[]>([]);
  const [pageSize, setPageSize] = useState<PdfPageSize>('auto');
  const [orientation, setOrientation] = useState<PdfOrientation>('auto');
  const [margin, setMargin] = useState<PdfMargin>('small');
  const [generatedPdf, setGeneratedPdf] = useState<ExportedPdf | null>(null);
  const [status, setStatus] = useState<ToolStatus>('idle');
  const [message, setMessage] = useState('Choose up to 10 HEIC or HEIF photos to create a local PDF.');

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    generatedPdfRef.current = generatedPdf;
  }, [generatedPdf]);

  useEffect(() => () => {
    runIdRef.current += 1;
    itemsRef.current.forEach(revokePreview);
    revokePdf(generatedPdfRef.current);
  }, []);

  const readyItems = items.filter((item) => item.status === 'ready' && item.preview);
  const hasOutput = Boolean(generatedPdf);
  const isBusy = status === 'decoding' || status === 'generating';
  const canCreatePdf = readyItems.length > 0 && !isBusy;

  function openPicker() {
    inputRef.current?.click();
  }

  function replaceItems(nextItems: PdfItem[]) {
    itemsRef.current = nextItems;
    setItems(nextItems);
  }

  function updateItems(updater: (currentItems: PdfItem[]) => PdfItem[]) {
    replaceItems(updater(itemsRef.current));
  }

  function clearGeneratedPdf() {
    revokePdf(generatedPdfRef.current);
    generatedPdfRef.current = null;
    setGeneratedPdf(null);
  }

  function resetOptions() {
    setPageSize('auto');
    setOrientation('auto');
    setMargin('small');
  }

  function reset() {
    runIdRef.current += 1;
    itemsRef.current.forEach(revokePreview);
    clearGeneratedPdf();
    replaceItems([]);
    resetOptions();
    setStatus('idle');
    setMessage('Choose up to 10 HEIC or HEIF photos to create a local PDF.');
    if (inputRef.current) inputRef.current.value = '';
  }

  function setOption<T extends PdfPageSize | PdfOrientation | PdfMargin>(setter: (value: T) => void, value: T) {
    setter(value);
    clearGeneratedPdf();
    if (itemsRef.current.some((item) => item.status === 'ready')) {
      setStatus('ready');
      setMessage('PDF settings changed. Create a new PDF when ready.');
    }
  }

  async function onFiles(files: FileList | null) {
    const selected = Array.from(files ?? []);
    if (selected.length === 0) return;

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    itemsRef.current.forEach(revokePreview);
    clearGeneratedPdf();
    if (inputRef.current) inputRef.current.value = '';

    const truncated = selected.length > maxFilesPerPdf;
    const filesToProcess = selected.slice(0, maxFilesPerPdf);
    const placeholders = filesToProcess.map<PdfItem>((file, index) => {
      const validation = validateHeicFile(file, { maxFileSizeMb, acceptedInputTypes, acceptedExtensions });
      return {
        id: itemId(index),
        fileName: file.name,
        fileSize: file.size,
        fileSizeLabel: formatBytes(file.size),
        fileSizeBucket: sizeBucket(file.size),
        status: validation.ok ? 'decoding' : 'error',
        message: validation.ok ? 'Decoding locally in this browser...' : validation.message,
        preview: null,
        pixels: '-'
      };
    });

    replaceItems(placeholders);
    setStatus('decoding');
    setMessage(truncated ? 'Only the first 10 files will be added to this PDF.' : 'Preparing HEIC previews locally...');
    track('tool_start', { toolId: 'heic-to-pdf', fileCount: filesToProcess.length, truncated });

    const decodeTargets = filesToProcess
      .map((file, index) => ({ file, item: placeholders[index] }))
      .filter((entry) => entry.item.status === 'decoding');

    if (decodeTargets.length === 0) {
      setStatus('error');
      setMessage('Choose a .heic or .heif image.');
      track('tool_error', { toolId: 'heic-to-pdf', reason: 'validation_failed' });
      return;
    }

    let readyCount = 0;
    let errorCount = placeholders.filter((item) => item.status === 'error').length;

    for (const { file, item } of decodeTargets) {
      try {
        const preview = await openHeicImage(file);
        if (runIdRef.current !== runId || !itemsRef.current.some((current) => current.id === item.id)) {
          if (preview.url) URL.revokeObjectURL(preview.url);
          continue;
        }

        readyCount += 1;
        updateItems((current) => current.map((currentItem) => currentItem.id === item.id
          ? {
              ...currentItem,
              status: 'ready',
              message: 'Preview ready',
              preview,
              pixels: `${preview.dimensions.width} x ${preview.dimensions.height}`
            }
          : currentItem
        ));
      } catch {
        if (runIdRef.current !== runId) continue;
        errorCount += 1;
        updateItems((current) => current.map((currentItem) => currentItem.id === item.id
          ? {
              ...currentItem,
              status: 'error',
              message: 'This browser could not preview this HEIC variant. Try another HEIC file or a different browser.'
            }
          : currentItem
        ));
        track('tool_error', { toolId: 'heic-to-pdf', reason: 'decode_failed' });
      }
    }

    if (runIdRef.current !== runId) return;
    if (readyCount > 0) {
      setStatus('ready');
      setMessage(errorCount > 0
        ? `${readyCount} image${readyCount === 1 ? '' : 's'} ready. ${errorCount} file${errorCount === 1 ? '' : 's'} could not be added.`
        : `${readyCount} image${readyCount === 1 ? '' : 's'} ready. Choose PDF options, then create your PDF.`
      );
    } else {
      setStatus('error');
      setMessage('No HEIC files could be previewed in this browser.');
    }
  }

  async function createPdf() {
    const inputs = itemsRef.current
      .filter((item) => item.status === 'ready' && item.preview)
      .map((item) => ({
        blob: item.preview!.blob,
        filename: item.fileName,
        dimensions: item.preview!.dimensions
      }));

    if (inputs.length === 0) return;

    setStatus('generating');
    setMessage('Creating the PDF locally in your browser...');
    clearGeneratedPdf();

    try {
      const pdf = await exportImagesToPdf(inputs, { pageSize, orientation, margin });
      generatedPdfRef.current = pdf;
      setGeneratedPdf(pdf);
      setStatus('generated');
      setMessage(`${pdf.pageCount} page PDF ready. Download it when you are ready.`);
      track('tool_complete', {
        toolId: 'heic-to-pdf',
        success: true,
        fileCount: inputs.length,
        pageCount: pdf.pageCount,
        pageSize,
        orientation,
        margin
      });
    } catch {
      setStatus('error');
      setMessage('Could not create the PDF in this browser. Try fewer images or smaller files.');
      track('tool_error', { toolId: 'heic-to-pdf', reason: 'pdf_generation_failed' });
    }
  }

  function removeItem(id: string) {
    const item = itemsRef.current.find((current) => current.id === id);
    if (item) revokePreview(item);
    clearGeneratedPdf();
    const nextItems = itemsRef.current.filter((current) => current.id !== id);
    replaceItems(nextItems);

    const nextReadyCount = nextItems.filter((current) => current.status === 'ready').length;
    if (nextItems.length === 0) {
      setStatus('idle');
      setMessage('Choose up to 10 HEIC or HEIF photos to create a local PDF.');
    } else if (nextReadyCount > 0) {
      setStatus('ready');
      setMessage('Image removed. Create a new PDF when ready.');
    } else {
      setStatus('error');
      setMessage('No ready images remain.');
    }
  }

  return (
    <div className={`heic-pdf-converter heic-pdf-converter--${status}`}>
      <div className="heic-pdf-tool__shell">
        <div
          className={`heic-pdf-dropzone ${dragging ? 'is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Drop HEIC files to convert to PDF"
          onClick={openPicker}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void onFiles(event.dataTransfer.files);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openPicker();
            }
          }}
        >
          <input
            ref={inputRef}
            className="heic-pdf-file-input"
            type="file"
            multiple
            accept=".heic,.heif,image/heic,image/heif"
            onChange={(event) => void onFiles(event.currentTarget.files)}
          />
          <div className="heic-file-icon" aria-hidden="true">HEIC</div>
          <h2>Drop HEIC files to convert to PDF</h2>
          <p>or choose up to 10 HEIC/HEIF photos from your device</p>
          <span className="heic-native-button heic-native-button--primary">Choose HEIC Files</span>
          <div className="heic-dropzone__chips" aria-label="Supported file limits">
            <span>.heic</span>
            <span>.heif</span>
            <span>Up to 25 MB each</span>
            <span>10 files max</span>
          </div>
        </div>

        <aside className="heic-pdf-settings">
          <p className="heic-tool-eyebrow">PDF options</p>
          <h2>PDF options</h2>
          <div className="heic-pdf-controls">
            <label>
              <span>Page size</span>
              <select value={pageSize} onChange={(event) => setOption<PdfPageSize>(setPageSize, event.currentTarget.value as PdfPageSize)}>
                <option value="auto">Auto</option>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
            </label>
            <label>
              <span>Orientation</span>
              <select value={orientation} onChange={(event) => setOption<PdfOrientation>(setOrientation, event.currentTarget.value as PdfOrientation)}>
                <option value="auto">Auto</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>
            <label>
              <span>Margin</span>
              <select value={margin} onChange={(event) => setOption<PdfMargin>(setMargin, event.currentTarget.value as PdfMargin)}>
                <option value="none">None</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
              </select>
            </label>
          </div>

          <div className="heic-pdf-output">
            <button
              className={`heic-native-button ${canCreatePdf ? 'heic-native-button--primary' : 'heic-native-button--disabled'}`}
              type="button"
              disabled={!canCreatePdf}
              onClick={() => void createPdf()}
            >
              {status === 'generating' ? 'Creating PDF...' : 'Create PDF'}
            </button>
            {generatedPdf ? (
              <a
                className="heic-native-button heic-native-button--primary"
                href={generatedPdf.url}
                download={generatedPdf.filename}
                onClick={() => track('download_action', { toolId: 'heic-to-pdf', format: 'pdf' })}
              >
                Download PDF
              </a>
            ) : (
              <button className="heic-native-button heic-native-button--disabled" type="button" disabled>Download PDF</button>
            )}
            <button className="heic-pdf-reset" type="button" onClick={reset} disabled={items.length === 0 && !hasOutput}>
              Reset
            </button>
          </div>

          <p className="heic-pdf-status" aria-live="polite">{message}</p>
          <p className="heic-tool-privacy">Your HEIC files are decoded in this browser session. The PDF is generated locally and your images are not uploaded to a server.</p>
        </aside>
      </div>

      {items.length > 0 && (
        <div className="heic-pdf-preview-list" aria-label="Selected HEIC previews">
          {items.map((item) => (
            <article className={`heic-pdf-preview-card heic-pdf-preview-card--${item.status}`} key={item.id}>
              <div className="heic-pdf-preview-frame">
                {item.preview?.url ? (
                  <img src={item.preview.url} alt={`Preview of ${item.fileName}`} />
                ) : (
                  <div className="heic-preview-empty" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </div>
              <div className="heic-pdf-preview-meta">
                <h3>{item.fileName}</h3>
                <p>{item.message}</p>
                <dl>
                  <div><dt>Size</dt><dd>{item.fileSizeLabel}</dd></div>
                  <div><dt>Pixels</dt><dd>{item.pixels}</dd></div>
                  <div><dt>Bucket</dt><dd>{item.fileSizeBucket}</dd></div>
                </dl>
              </div>
              <button className="heic-pdf-remove" type="button" onClick={() => removeItem(item.id)}>Remove</button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
