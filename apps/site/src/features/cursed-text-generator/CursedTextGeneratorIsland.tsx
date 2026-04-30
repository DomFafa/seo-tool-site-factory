import React, { useMemo, useState } from 'react';
import {
  cleanCursedText,
  createCursedText,
  settingsForPreset,
  type CursedPreset,
  type CursedTextSettings
} from '@factory/cursed-text-generator';

type Props = {
  locale: string;
  config: any;
};

type Mode = 'curse' | 'clean';
type PresetChoice = CursedPreset | 'custom';

const EXAMPLES = ['haunted username', 'do not open', 'glitch in the signal', 'happy halloween', 'the server is awake'];
const PRESETS: Array<{ id: CursedPreset; label: string; hint: string }> = [
  { id: 'light', label: 'Light', hint: 'Readable' },
  { id: 'medium', label: 'Medium', hint: 'Creepy' },
  { id: 'heavy', label: 'Heavy', hint: 'Chaotic' }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function CursedTextGeneratorIsland({ locale, config }: Props) {
  const sampleText = config?.options?.sampleText ?? EXAMPLES[1];
  const defaultPreset = parsePreset(config?.options?.defaultPreset);
  const defaultSettings = settingsForPreset(defaultPreset, { maxOutputLength: config?.options?.maxOutputLength });
  const [input, setInput] = useState(sampleText);
  const [mode, setMode] = useState<Mode>('curse');
  const [preset, setPreset] = useState<PresetChoice>(defaultPreset);
  const [settings, setSettings] = useState<CursedTextSettings>(defaultSettings);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const result = useMemo(() => createCursedText(input, settings), [input, settings]);
  const output = mode === 'clean' ? cleanCursedText(input) : result.output;
  const outputLength = Array.from(output).length;
  const canCopy = outputLength > 0;
  const warning = mode === 'curse' ? result.warning : null;

  function applyPreset(nextPreset: CursedPreset) {
    setPreset(nextPreset);
    setSettings(settingsForPreset(nextPreset, settings));
    setCopied(false);
    track('preset_change', { toolId: 'cursed-text-generator', locale, preset: nextPreset });
  }

  function updateSetting(key: 'topMarks' | 'middleMarks' | 'bottomMarks', value: number) {
    setPreset('custom');
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function updateInput(value: string) {
    setInput(value);
    setCopied(false);
    track('tool_start', { toolId: 'cursed-text-generator', locale, lengthBucket: lengthBucket(value) });
  }

  function useExample(example: string) {
    updateInput(example);
    setMode('curse');
  }

  function clearInput() {
    setInput('');
    setCopied(false);
    setCopyError(false);
  }

  function resetSettings() {
    setPreset(defaultPreset);
    setSettings(defaultSettings);
    setCopied(false);
  }

  function regenerate() {
    setSettings((current) => ({ ...current, seed: current.seed + 1 }));
    setCopied(false);
  }

  async function copyOutput() {
    if (!canCopy) return;
    setCopyError(false);
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API is unavailable.');
      }
      await navigator.clipboard.writeText(output);
      setCopied(true);
      track('copy_action', { toolId: 'cursed-text-generator', locale, mode, preset });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="cursed-workbench" data-mode={mode}>
      <div className="cursed-workbench__topbar">
        <div>
          <p className="cursed-workbench__eyebrow">Live Unicode workbench</p>
          <strong>Cursed text, controlled</strong>
        </div>
        <div className="cursed-mode" role="group" aria-label="Mode">
          <button type="button" className={mode === 'curse' ? 'active' : ''} aria-pressed={mode === 'curse'} onClick={() => setMode('curse')}>Curse</button>
          <button type="button" className={mode === 'clean' ? 'active' : ''} aria-pressed={mode === 'clean'} onClick={() => setMode('clean')}>Clean</button>
        </div>
      </div>

      <div className="cursed-workbench__main">
        <section className="cursed-panel cursed-panel--input" aria-labelledby="cursed-input-label">
          <div className="cursed-label-row">
            <label id="cursed-input-label" htmlFor="cursed-input">Input</label>
            <span>{Array.from(input).length} chars</span>
          </div>
          <textarea
            id="cursed-input"
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            placeholder={mode === 'clean' ? 'Paste cursed or Zalgo text to clean it...' : 'Type something to curse...'}
          />
          <div className="cursed-examples" aria-label="Examples">
            {EXAMPLES.map((example) => (
              <button type="button" className="cursed-chip" key={example} onClick={() => useExample(example)}>
                {example}
              </button>
            ))}
          </div>
        </section>

        <section className="cursed-panel cursed-panel--output" aria-labelledby="cursed-output-label">
          <div className="cursed-label-row">
            <label id="cursed-output-label">Output</label>
            <span>{outputLength} generated chars</span>
          </div>
          <div className="cursed-output">{output || 'Your cursed text will appear here.'}</div>
          <div className="cursed-actions">
            <button type="button" onClick={copyOutput} disabled={!canCopy}>{copied ? 'Copied' : 'Copy'}</button>
            <button type="button" className="secondary" onClick={clearInput}>Clear</button>
            <button type="button" className="secondary" onClick={resetSettings}>Reset</button>
            <button type="button" className="secondary" onClick={regenerate} disabled={mode === 'clean' || !input}>Regenerate</button>
          </div>
          <div className="cursed-status" aria-live="polite">
            <span className="visually-hidden">{output ? `${mode === 'clean' ? 'Cleaned' : 'Generated'} output updated. ${outputLength} characters.` : 'Output is empty.'}</span>
            {copied && <span className="success">Copied cursed text.</span>}
            {copyError && <span className="error">Copy failed. Select the text and copy manually.</span>}
            {warning && <span className="cursed-warning">{warning}</span>}
          </div>
        </section>
      </div>

      <div className="cursed-controls" aria-label="Cursed text controls">
        <div className="cursed-presets" role="group" aria-label="Intensity presets">
          {PRESETS.map((item) => (
            <button type="button" key={item.id} className={preset === item.id ? 'active' : ''} aria-pressed={preset === item.id} onClick={() => applyPreset(item.id)}>
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>

        <details className="cursed-fine-tune">
          <summary>Fine tune</summary>
          <div className="cursed-sliders">
            <Slider id="cursed-top" label="Top marks" min={0} max={8} value={settings.topMarks} onChange={(value) => updateSetting('topMarks', value)} />
            <Slider id="cursed-middle" label="Middle marks" min={0} max={4} value={settings.middleMarks} onChange={(value) => updateSetting('middleMarks', value)} />
            <Slider id="cursed-bottom" label="Bottom marks" min={0} max={8} value={settings.bottomMarks} onChange={(value) => updateSetting('bottomMarks', value)} />
          </div>
        </details>

        <div className="cursed-metrics" aria-label="Text metrics">
          <div><span>Marks</span><strong>{mode === 'clean' ? 0 : result.combiningMarkCount}</strong></div>
          <div><span>Preset</span><strong>{preset}</strong></div>
          <div><span>Privacy</span><strong>Local</strong></div>
        </div>
      </div>

      <p className="small cursed-privacy">Privacy: generation and cleanup run in your browser. Raw input and generated cursed text are not sent to analytics.</p>
    </div>
  );
}

function Slider(props: { id: string; label: string; min: number; max: number; value: number; onChange: (value: number) => void }) {
  return (
    <div className="cursed-slider">
      <label htmlFor={props.id}><strong>{props.label}</strong><span>{props.value}</span></label>
      <input id={props.id} type="range" min={props.min} max={props.max} value={props.value} onChange={(event) => props.onChange(Number(event.target.value))} />
    </div>
  );
}

function lengthBucket(value: string) {
  const length = Array.from(value).length;
  if (length === 0) return 'empty';
  if (length <= 40) return 'short';
  if (length <= 180) return 'medium';
  return 'long';
}

function parsePreset(value: unknown): CursedPreset {
  return value === 'light' || value === 'medium' || value === 'heavy' ? value : 'medium';
}
