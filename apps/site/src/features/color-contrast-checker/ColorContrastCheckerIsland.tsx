import React, { useMemo, useState } from 'react';
import { checkContrast, contrastReport, type ContrastResult } from '@factory/color-contrast-checker';

type Props = {
  locale: string;
  config: any;
};

type Example = {
  id: string;
  label: string;
  foreground: string;
  background: string;
};

const EXAMPLES: Example[] = [
  { id: 'notebook', label: 'Blue notes', foreground: '#2554d9', background: '#fbfbf5' },
  { id: 'teacher-red', label: 'Red markup', foreground: '#e23b3b', background: '#fff0ef' },
  { id: 'muted-gray', label: 'Small gray', foreground: '#9ca3af', background: '#ffffff' },
  { id: 'button', label: 'Button label', foreground: '#ffffff', background: '#2554d9' },
  { id: 'fail', label: 'Needs fixing', foreground: '#b6c4f2', background: '#fbfbf5' }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function ColorContrastCheckerIsland({ locale }: Props) {
  const [foreground, setForeground] = useState('#2554d9');
  const [background, setBackground] = useState('#fbfbf5');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const result = useMemo(() => checkContrast(foreground, background), [foreground, background]);
  const normalizedForeground = result.foreground.ok ? result.foreground.hex : '#2554d9';
  const normalizedBackground = result.background.ok ? result.background.hex : '#fbfbf5';
  const aaNormal = Boolean(result.verdicts.find((verdict) => verdict.id === 'aa-normal')?.passed);
  const aaaNormal = Boolean(result.verdicts.find((verdict) => verdict.id === 'aaa-normal')?.passed);

  function applyExample(example: Example) {
    setForeground(example.foreground);
    setBackground(example.background);
    setCopied(false);
    setCopyError(false);
    track('example_apply', { toolId: 'color-contrast-checker', locale, action: 'example_apply', status: example.id });
  }

  function swapColors() {
    setForeground(background);
    setBackground(foreground);
    setCopied(false);
    setCopyError(false);
    track('swap_colors', { toolId: 'color-contrast-checker', locale, action: 'swap', status: result.status, aaNormal, aaaNormal });
  }

  function resetColors() {
    setForeground('#2554d9');
    setBackground('#fbfbf5');
    setCopied(false);
    setCopyError(false);
  }

  function applySuggestion() {
    if (!result.suggestedForeground) return;
    setForeground(result.suggestedForeground);
    setCopied(false);
    setCopyError(false);
    track('suggestion_apply', { toolId: 'color-contrast-checker', locale, action: 'suggestion_apply', status: result.status, aaNormal, aaaNormal });
  }

  async function copyReport() {
    setCopyError(false);
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(contrastReport(result));
      setCopied(true);
      track('copy_action', { toolId: 'color-contrast-checker', locale, action: 'copy', status: result.status, aaNormal, aaaNormal });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="ccc-notebook">
      <style>{styles}</style>
      <section className={`ccc-sheet ccc-sheet--${result.status}`} aria-labelledby="ccc-title">
        <div className="ccc-grade-mark" aria-hidden="true">☑</div>

        <div className="ccc-heading">
          <p className="ccc-eyebrow">Contrast homework</p>
          <h2 id="ccc-title">Grade this color pair</h2>
          <p>Enter colors, check the ratio, then copy the marked result for your design notes.</p>
        </div>

        <div className="ccc-grid">
          <div className="ccc-controls" aria-label="Color inputs">
            <ColorField
              label="Foreground ink"
              value={foreground}
              parsedOk={result.foreground.ok}
              error={result.foreground.ok ? '' : result.foreground.error}
              onChange={setForeground}
            />
            <ColorField
              label="Background paper"
              value={background}
              parsedOk={result.background.ok}
              error={result.background.ok ? '' : result.background.error}
              onChange={setBackground}
            />

            <div className="ccc-live-preview" style={{ color: normalizedForeground, backgroundColor: normalizedBackground }}>
              <span>{result.valid && aaNormal ? 'Pass' : 'Needs work'}</span>
              <strong>Sample note</strong>
              <small>Live color preview</small>
            </div>

            <div className="ccc-actions">
              <button type="button" onClick={swapColors} className="ccc-button ccc-button--blue">Swap</button>
              <button type="button" onClick={copyReport} className="ccc-button ccc-button--red">{copied ? 'Copied' : 'Copy note'}</button>
              <button type="button" onClick={resetColors} className="ccc-button ccc-button--plain">Reset</button>
            </div>
            {copyError && <p className="ccc-error">Copy failed. Select the result note and copy manually.</p>}
          </div>

          <div className="ccc-result" aria-live="polite">
            <div className="ccc-ratio">
              <span>Ratio</span>
              <strong>{result.ratioText}</strong>
            </div>
            <p className="ccc-summary">{result.summary}</p>
            <VerdictList result={result} />
          </div>
        </div>

        <div className="ccc-preview" style={{ color: normalizedForeground, backgroundColor: normalizedBackground }}>
          <span className="ccc-preview-stamp">{result.valid && aaNormal ? 'Pass' : 'Needs work'}</span>
          <h3>Sample interface note</h3>
          <p>This is how body text, helper copy, and labels might read with the selected colors.</p>
          <button type="button" style={{ color: normalizedBackground, backgroundColor: normalizedForeground }}>Sample button</button>
        </div>

        {result.suggestedForeground && (
          <div className="ccc-teacher-note">
            <span>Red pen fix</span>
            <p>Try foreground <button type="button" onClick={applySuggestion}>{result.suggestedForeground}</button> for AA normal text.</p>
          </div>
        )}

        <div className="ccc-examples" aria-label="Example color pairs">
          {EXAMPLES.map((example) => (
            <button type="button" key={example.id} onClick={() => applyExample(example)}>
              <span style={{ backgroundColor: example.background }}>
                <i style={{ backgroundColor: example.foreground }}></i>
              </span>
              {example.label}
            </button>
          ))}
        </div>

        <p className="ccc-privacy">Local check. Raw color values are not sent to analytics.</p>
      </section>
    </div>
  );
}

function ColorField({
  label,
  value,
  parsedOk,
  error,
  onChange
}: {
  label: string;
  value: string;
  parsedOk: boolean;
  error: string;
  onChange: (value: string) => void;
}) {
  const colorValue = /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : '#2554d9';
  return (
    <label className={`ccc-field ${parsedOk ? '' : 'ccc-field--invalid'}`}>
      <span>{label}</span>
      <div>
        <input
          className="ccc-field-text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          placeholder="#2554d9"
        />
        <input
          className="ccc-field-picker"
          type="color"
          value={colorValue}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} color picker`}
        />
      </div>
      {!parsedOk && <em>{error}</em>}
    </label>
  );
}

function VerdictList({ result }: { result: ContrastResult }) {
  return (
    <div className="ccc-verdicts">
      {result.verdicts.map((verdict) => (
        <div className={`ccc-verdict ${verdict.passed ? 'ccc-verdict--pass' : 'ccc-verdict--fail'}`} key={verdict.id}>
          <strong>{verdict.passed ? '☑ Pass' : 'Needs work'}</strong>
          <span>{verdict.label}</span>
          <small>{verdict.threshold}:1</small>
        </div>
      ))}
    </div>
  );
}

const styles = `
.ccc-notebook {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 clamp(2px, 1vw, 10px) 8px;
  color: #173a9d;
}
.ccc-sheet {
  position: relative;
  display: grid;
  gap: 18px;
  padding: clamp(18px, 4vw, 34px);
  border: 2px solid #2554d9;
  border-radius: 8px;
  background:
    linear-gradient(90deg, transparent 0 34px, rgba(226, 59, 59, .58) 35px 36px, transparent 37px),
    repeating-linear-gradient(180deg, #fffefa 0 27px, #cfdaf7 28px 29px, #fffefa 30px 54px);
  box-shadow: 0 20px 0 rgba(37, 84, 217, .08);
  overflow: hidden;
}
.ccc-sheet::after {
  content: "";
  position: absolute;
  right: clamp(14px, 3vw, 34px);
  top: clamp(14px, 3vw, 28px);
  width: clamp(68px, 10vw, 112px);
  aspect-ratio: 1.16;
  border: 5px solid #2554d9;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 58% 46% 56% 42%;
  transform: rotate(-12deg);
  opacity: .9;
  pointer-events: none;
}
.ccc-grade-mark {
  position: absolute;
  right: clamp(22px, 4vw, 70px);
  top: clamp(70px, 8vw, 96px);
  color: #e23b3b;
  font-size: clamp(52px, 9vw, 98px);
  line-height: 1;
  transform: rotate(-10deg);
  opacity: .86;
  pointer-events: none;
}
.ccc-heading {
  max-width: 760px;
  padding-left: clamp(28px, 5vw, 58px);
}
.ccc-eyebrow {
  margin: 0 0 4px;
  color: #e23b3b;
  font-size: .82rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}
.ccc-heading h2 {
  margin: 0;
  color: #2554d9;
  font-family: "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive;
  font-size: clamp(2rem, 5vw, 4.5rem);
  font-weight: 500;
  line-height: .98;
  letter-spacing: 0;
}
.ccc-heading p,
.ccc-summary,
.ccc-privacy {
  margin: 8px 0 0;
  color: #173a9d;
  font-size: clamp(1rem, 1.5vw, 1.14rem);
  line-height: 1.58;
}
.ccc-grid {
  display: grid;
  grid-template-columns: minmax(0, .92fr) minmax(300px, 1.08fr);
  gap: clamp(14px, 3vw, 28px);
  align-items: stretch;
  padding-left: clamp(28px, 5vw, 58px);
}
.ccc-controls,
.ccc-result,
.ccc-preview,
.ccc-teacher-note {
  border: 2px solid rgba(37, 84, 217, .72);
  border-radius: 8px;
  background: rgba(255, 254, 250, .92);
}
.ccc-controls,
.ccc-result {
  display: grid;
  align-content: start;
  gap: 14px;
  padding: clamp(14px, 2.4vw, 22px);
}
.ccc-live-preview {
  display: none;
  gap: 4px;
  min-height: 98px;
  padding: 13px;
  border: 2px solid currentColor;
  border-radius: 6px;
}
.ccc-live-preview span {
  width: fit-content;
  border: 2px solid currentColor;
  border-radius: 999px;
  padding: 2px 9px;
  font-size: .78rem;
  font-weight: 900;
  text-transform: uppercase;
}
.ccc-live-preview strong {
  display: block;
  font-size: 1.18rem;
  line-height: 1.1;
}
.ccc-live-preview small {
  color: inherit;
  font-weight: 800;
}
.ccc-field {
  display: grid;
  gap: 7px;
}
.ccc-field > span,
.ccc-ratio span,
.ccc-teacher-note span {
  color: #e23b3b;
  font-family: "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive;
  font-size: 1rem;
  font-weight: 700;
}
.ccc-field > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px;
  gap: 9px;
  align-items: stretch;
}
.ccc-field-text,
.ccc-field-picker {
  min-height: 48px;
  border: 2px solid #2554d9;
  border-radius: 6px;
  background: #fffefa;
  color: #111827;
  font: inherit;
}
.ccc-field-text {
  padding: 10px 12px;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
}
.ccc-field-picker {
  padding: 4px;
}
.ccc-field em,
.ccc-error {
  color: #b42318;
  font-style: normal;
  font-weight: 800;
}
.ccc-field--invalid .ccc-field-text {
  border-color: #e23b3b;
  background: #fff0ef;
}
.ccc-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.ccc-button,
.ccc-teacher-note button,
.ccc-examples button {
  min-height: 44px;
  border: 2px solid #2554d9;
  border-radius: 6px;
  padding: 9px 14px;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}
.ccc-button--blue {
  background: #2554d9;
  color: #ffffff;
}
.ccc-button--red {
  border-color: #c32f2f;
  background: #e23b3b;
  color: #ffffff;
}
.ccc-button--plain {
  background: #fffefa;
  color: #2554d9;
}
.ccc-button:focus-visible,
.ccc-teacher-note button:focus-visible,
.ccc-examples button:focus-visible,
.ccc-field-text:focus-visible,
.ccc-field-picker:focus-visible,
.ccc-preview button:focus-visible {
  outline: 3px solid rgba(226, 59, 59, .35);
  outline-offset: 3px;
}
.ccc-ratio {
  display: grid;
  gap: 2px;
}
.ccc-ratio strong {
  color: #2554d9;
  font-family: "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive;
  font-size: clamp(3rem, 7vw, 5.8rem);
  font-weight: 500;
  line-height: .88;
  font-variant-numeric: tabular-nums;
}
.ccc-verdicts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(124px, 1fr));
  gap: 8px;
}
.ccc-verdict {
  min-width: 0;
  display: grid;
  gap: 2px;
  min-height: 94px;
  padding: 10px;
  border: 2px solid #2554d9;
  border-radius: 6px;
  background: #fffefa;
}
.ccc-verdict strong,
.ccc-verdict span,
.ccc-verdict small {
  overflow-wrap: normal;
  word-break: normal;
  hyphens: none;
}
.ccc-verdict strong {
  color: #2554d9;
  font-size: .94rem;
}
.ccc-verdict span {
  color: #1f3f9f;
  font-size: .86rem;
  line-height: 1.25;
}
.ccc-verdict small {
  color: #4b5563;
  font-weight: 800;
}
.ccc-verdict--fail {
  border-color: #e23b3b;
  background: #fff0ef;
}
.ccc-verdict--fail strong {
  color: #b42318;
}
.ccc-preview {
  display: grid;
  gap: 9px;
  min-height: 190px;
  padding: clamp(18px, 3vw, 30px);
  margin-left: clamp(28px, 5vw, 58px);
  position: relative;
}
.ccc-preview-stamp {
  width: fit-content;
  border: 3px solid currentColor;
  border-radius: 999px;
  padding: 3px 12px;
  font-weight: 900;
  text-transform: uppercase;
  transform: rotate(-3deg);
}
.ccc-preview h3 {
  margin: 0;
  color: inherit;
  font-size: clamp(1.55rem, 3vw, 2.5rem);
  line-height: 1.1;
}
.ccc-preview p {
  max-width: 620px;
  margin: 0;
  color: inherit;
  font-size: 1rem;
  line-height: 1.55;
}
.ccc-preview button {
  width: fit-content;
  min-height: 42px;
  border: 2px solid currentColor;
  border-radius: 6px;
  padding: 8px 14px;
  font: inherit;
  font-weight: 900;
}
.ccc-teacher-note {
  margin-left: clamp(28px, 5vw, 58px);
  padding: 13px 16px;
  border-color: #e23b3b;
  background: #fff0ef;
  transform: rotate(-.6deg);
}
.ccc-teacher-note p {
  margin: 3px 0 0;
  color: #7a1f1f;
  font-weight: 800;
}
.ccc-teacher-note button {
  min-height: 34px;
  margin-left: 4px;
  border-color: #e23b3b;
  background: #ffffff;
  color: #b42318;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
}
.ccc-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-left: clamp(28px, 5vw, 58px);
}
.ccc-examples button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fffefa;
  color: #2554d9;
}
.ccc-examples span {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 22px;
  border: 1px solid #2554d9;
  border-radius: 4px;
}
.ccc-examples i {
  display: block;
  width: 16px;
  height: 6px;
  border-radius: 999px;
}
.ccc-privacy {
  padding-left: clamp(28px, 5vw, 58px);
  font-size: .9rem;
}
@media (max-width: 900px) {
  .ccc-sheet::after,
  .ccc-grade-mark {
    opacity: .22;
  }
  .ccc-grid,
  .ccc-verdicts {
    grid-template-columns: 1fr;
  }
  .ccc-verdict {
    min-height: auto;
  }
}
@media (max-width: 620px) {
  .ccc-sheet {
    gap: 10px;
    width: 100%;
    min-width: 0;
    padding: 12px 10px 14px;
    background:
      linear-gradient(90deg, transparent 0 18px, rgba(226, 59, 59, .5) 19px 20px, transparent 21px),
      repeating-linear-gradient(180deg, #fffefa 0 27px, #cfdaf7 28px 29px, #fffefa 30px 54px);
  }
  .ccc-sheet::after,
  .ccc-grade-mark {
    display: none;
  }
  .ccc-heading,
  .ccc-grid,
  .ccc-preview,
  .ccc-teacher-note,
  .ccc-examples,
  .ccc-privacy {
    margin-left: 0;
    min-width: 0;
    padding-left: 8px;
    padding-right: 8px;
  }
  .ccc-heading {
    padding-right: 4px;
  }
  .ccc-eyebrow {
    font-size: .74rem;
  }
  .ccc-heading h2 {
    max-width: 100%;
    overflow-wrap: normal;
    font-size: clamp(1.45rem, 8.2vw, 2rem);
    line-height: 1;
  }
  .ccc-heading p {
    margin-top: 4px;
    font-size: .9rem;
    line-height: 1.35;
  }
  .ccc-grid {
    gap: 10px;
    grid-template-columns: minmax(0, 1fr);
  }
  .ccc-controls,
  .ccc-result {
    min-width: 0;
    gap: 10px;
    padding: 12px;
  }
  .ccc-live-preview {
    display: grid;
  }
  .ccc-field > div {
    grid-template-columns: minmax(0, 1fr) 44px;
    gap: 7px;
  }
  .ccc-field > span,
  .ccc-ratio span,
  .ccc-teacher-note span {
    font-size: .92rem;
  }
  .ccc-field-text,
  .ccc-field-picker {
    min-height: 42px;
  }
  .ccc-field-text {
    padding: 8px 10px;
  }
  .ccc-actions,
  .ccc-examples {
    align-items: stretch;
  }
  .ccc-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .ccc-actions .ccc-button,
  .ccc-examples button {
    width: 100%;
    min-width: 0;
    flex: 1 1 100%;
    min-height: 42px;
    padding: 8px 10px;
  }
  .ccc-actions .ccc-button--plain {
    grid-column: auto;
  }
  .ccc-ratio strong {
    font-size: clamp(2.35rem, 15vw, 3.5rem);
  }
  .ccc-summary {
    font-size: .92rem;
    line-height: 1.35;
  }
  .ccc-verdicts {
    grid-template-columns: 1fr;
  }
  .ccc-verdict {
    min-height: 76px;
    padding: 8px;
  }
  .ccc-verdict strong {
    font-size: .82rem;
  }
  .ccc-verdict span,
  .ccc-verdict small {
    font-size: .78rem;
  }
  .ccc-preview {
    display: none;
  }
  .ccc-teacher-note {
    padding: 10px 12px;
    transform: none;
  }
  .ccc-teacher-note p {
    font-size: .88rem;
    line-height: 1.35;
  }
  .ccc-examples {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .ccc-examples button {
    justify-content: flex-start;
    min-width: 0;
    font-size: .84rem;
  }
  .ccc-privacy {
    font-size: .8rem;
  }
}
`;
