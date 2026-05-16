import React, { useRef, useState } from 'react';
import {
  exportOpenedImage,
  formatBytes,
  openHeicImage,
  sizeBucket,
  validateHeicFile,
  type ExportedImage,
  type OpenedHeicImage
} from '@factory/open-heic-file';

type Status = 'idle' | 'working' | 'ready' | 'error';

type ToolState = {
  status: Status;
  message: string;
  fileSize: string;
  pixels: string;
  preview: OpenedHeicImage | null;
  jpg: ExportedImage | null;
  png: ExportedImage | null;
};

const acceptedInputTypes = ['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'];
const acceptedExtensions = ['.heic', '.heif'];
const maxFileSizeMb = 25;

const initialState: ToolState = {
  status: 'idle',
  message: 'Your HEIC preview will appear here.',
  fileSize: '-',
  pixels: '-',
  preview: null,
  jpg: null,
  png: null
};

function revokeState(state: ToolState) {
  if (state.preview?.url) URL.revokeObjectURL(state.preview.url);
  if (state.jpg?.url) URL.revokeObjectURL(state.jpg.url);
  if (state.png?.url) URL.revokeObjectURL(state.png.url);
}

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function OpenHeicFileIsland() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<ToolState>(initialState);

  function openPicker() {
    inputRef.current?.click();
  }

  function reset() {
    setState((current) => {
      revokeState(current);
      return initialState;
    });
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleFile(file: File | null | undefined) {
    const validation = validateHeicFile(file, { maxFileSizeMb, acceptedInputTypes, acceptedExtensions });
    if (!validation.ok) {
      setState((current) => {
        revokeState(current);
        return {
          ...initialState,
          status: 'error',
          message: validation.message
        };
      });
      track('tool_error', { toolId: 'open-heic-file', reason: validation.reason });
      return;
    }

    const selectedFile = file as File;
    setState((current) => {
      revokeState(current);
      return {
        ...initialState,
        status: 'working',
        message: 'Decoding the image locally in your browser...',
        fileSize: formatBytes(selectedFile.size)
      };
    });

    try {
      const preview = await openHeicImage(selectedFile);
      const [jpg, png] = await Promise.all([
        exportOpenedImage(preview.blob, selectedFile.name, 'image/jpeg'),
        exportOpenedImage(preview.blob, selectedFile.name, 'image/png')
      ]);

      setState({
        status: 'ready',
        message: 'Preview ready. You can view the image here or download a JPG/PNG copy.',
        fileSize: formatBytes(selectedFile.size),
        pixels: `${preview.dimensions.width} x ${preview.dimensions.height}`,
        preview,
        jpg,
        png
      });
      track('tool_complete', {
        toolId: 'open-heic-file',
        success: true,
        fileSizeBucket: sizeBucket(selectedFile.size),
        decoder: preview.source
      });
    } catch {
      setState((current) => {
        revokeState(current);
        return {
          ...initialState,
          status: 'error',
          message: 'This browser could not preview this HEIC variant. Try another HEIC file or a different browser.',
          fileSize: formatBytes(selectedFile.size)
        };
      });
      track('tool_error', { toolId: 'open-heic-file', reason: 'decode_failed' });
    }
  }

  function onFiles(files: FileList | null) {
    void handleFile(files?.[0]);
  }

  const hasOutput = Boolean(state.jpg || state.png);
  const statusLabel =
    state.status === 'ready' ? 'HEIC preview ready'
      : state.status === 'working' ? 'Preparing HEIC preview'
        : state.status === 'error' ? 'Could not preview this HEIC file'
          : 'No HEIC file selected';

  return (
    <div className={`open-heic-tool open-heic-tool--${state.status}`}>
      <input
        ref={inputRef}
        className="open-heic-tool__file"
        type="file"
        accept=".heic,.heif,image/heic,image/heif"
        onChange={(event) => onFiles(event.currentTarget.files)}
      />

      <button className="heic-mobile-button heic-native-button heic-native-button--primary" type="button" onClick={openPicker}>
        Choose HEIC File
      </button>

      <div
        className={`heic-dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onFiles(event.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        aria-label="Drop a HEIC file to view it online"
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
      >
        <div className="heic-file-icon" aria-hidden="true">HEIC</div>
        <h2>Drop a HEIC file to view it online</h2>
        <p>or choose a HEIC/HEIF photo from your device</p>
        <span className="heic-native-button heic-native-button--primary">Choose HEIC File</span>
        <div className="heic-dropzone__chips" aria-label="Supported file limits">
          <span>.heic</span>
          <span>.heif</span>
          <span>Up to 25 MB</span>
        </div>
      </div>

      <aside className="heic-status-panel" aria-live="polite">
        <p className="heic-tool-eyebrow">Preview status</p>
        <h2>{statusLabel}</h2>
        <p>{state.message}</p>

        <div className="heic-preview-frame" role="group" aria-label="Preview">
          {state.preview?.url ? (
            <img src={state.preview.url} alt="Preview of the selected HEIC file" />
          ) : (
            <div className="heic-preview-empty" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className="heic-metrics" role="group" aria-label="Image details">
          <div><span>Format</span><strong>{state.status === 'idle' ? '-' : 'HEIC'}</strong></div>
          <div><span>File size</span><strong>{state.fileSize}</strong></div>
          <div><span>Pixels</span><strong>{state.pixels}</strong></div>
        </div>

        <div className="heic-download-row">
          {state.jpg ? (
            <a className="heic-native-button heic-native-button--primary" href={state.jpg.url} download={state.jpg.filename} onClick={() => track('download_action', { toolId: 'open-heic-file', format: 'jpg' })}>Download JPG</a>
          ) : (
            <button className="heic-native-button heic-native-button--disabled" type="button" disabled>Download JPG</button>
          )}
          {state.png ? (
            <a className="heic-native-button heic-native-button--primary" href={state.png.url} download={state.png.filename} onClick={() => track('download_action', { toolId: 'open-heic-file', format: 'png' })}>Download PNG</a>
          ) : (
            <button className="heic-native-button heic-native-button--disabled" type="button" disabled>Download PNG</button>
          )}
        </div>

        <button className="heic-clear-button" type="button" onClick={reset} disabled={!hasOutput && state.status === 'idle'}>
          Clear
        </button>
        <p className="heic-tool-privacy">The image stays in this browser session. This tool does not upload the selected file.</p>
      </aside>
    </div>
  );
}
