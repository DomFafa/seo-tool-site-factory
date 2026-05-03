import React, { useMemo, useState } from 'react';
import {
  generateRandomLetters,
  type LetterCase,
  type LetterFormat,
  type LetterMode
} from '@factory/random-letter-generator';

type Props = {
  locale: string;
  config: any;
};

const MODES: Array<{ id: LetterMode; label: string; hint: string }> = [
  { id: 'alphabet', label: 'A-Z', hint: 'All English letters' },
  { id: 'vowels', label: 'Vowels', hint: 'A E I O U' },
  { id: 'consonants', label: 'Consonants', hint: 'No vowels' },
  { id: 'custom', label: 'Custom', hint: 'Your own set' }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function RandomLetterGeneratorIsland({ locale, config }: Props) {
  const [mode, setMode] = useState<LetterMode>('alphabet');
  const [customAlphabet, setCustomAlphabet] = useState('A B C D E F');
  const [count, setCount] = useState(String(config?.options?.defaultCount ?? 12));
  const [unique, setUnique] = useState(true);
  const [letterCase, setLetterCase] = useState<LetterCase>('upper');
  const [format, setFormat] = useState<LetterFormat>('groups');
  const [groupSize, setGroupSize] = useState('6');
  const [seed, setSeed] = useState(41);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => generateRandomLetters({
    mode,
    customAlphabet,
    count,
    unique,
    letterCase,
    format,
    groupSize,
    seed
  }), [mode, customAlphabet, count, unique, letterCase, format, groupSize, seed]);

  const canCopy = result.status === 'ready' && result.output.length > 0;

  function generate() {
    setSeed((current) => current + 1);
    setCopied(false);
    track('generate_action', { toolId: 'random-letter-generator', locale, status: result.status, mode });
  }

  async function copyOutput() {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      track('copy_action', { toolId: 'random-letter-generator', locale, status: result.status, mode });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function applyMode(nextMode: LetterMode) {
    setMode(nextMode);
    setCopied(false);
    track('preset_change', { toolId: 'random-letter-generator', locale, action: nextMode });
  }

  return (
    <section className="rlg" aria-labelledby="rlg-title">
      <style>{styles}</style>
      <div className="rlg-card">
        <div className="rlg-header">
          <div>
            <p className="rlg-kicker">Alphabet picker</p>
            <h2 id="rlg-title">Generate random letters</h2>
          </div>
          <span className="rlg-pill">Local only</span>
        </div>

        <div className="rlg-modes" aria-label="Letter source">
          {MODES.map((item) => (
            <button
              type="button"
              key={item.id}
              className={mode === item.id ? 'is-active' : ''}
              onClick={() => applyMode(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.hint}</span>
            </button>
          ))}
        </div>

        {mode === 'custom' && (
          <label className="rlg-field rlg-field--wide">
            <span>Custom letters</span>
            <input
              value={customAlphabet}
              onChange={(event) => setCustomAlphabet(event.target.value)}
              placeholder="A B C D E F"
              spellCheck={false}
            />
          </label>
        )}

        <div className="rlg-grid">
          <label className="rlg-field">
            <span>How many?</span>
            <input inputMode="numeric" value={count} onChange={(event) => setCount(event.target.value)} />
          </label>
          <label className="rlg-field">
            <span>Copy format</span>
            <select value={format} onChange={(event) => setFormat(event.target.value as LetterFormat)}>
              <option value="groups">Grouped rows</option>
              <option value="lines">One per line</option>
              <option value="commas">Comma separated</option>
              <option value="spaces">Space separated</option>
            </select>
          </label>
          <label className="rlg-field">
            <span>Group size</span>
            <input inputMode="numeric" value={groupSize} onChange={(event) => setGroupSize(event.target.value)} disabled={format !== 'groups'} />
          </label>
          <label className="rlg-field">
            <span>Case</span>
            <select value={letterCase} onChange={(event) => setLetterCase(event.target.value as LetterCase)}>
              <option value="upper">Uppercase</option>
              <option value="lower">Lowercase</option>
            </select>
          </label>
        </div>

        <div className="rlg-options">
          <label className="rlg-check">
            <input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} />
            <span>No repeats</span>
          </label>
          <p>{result.alphabet.length} available letters</p>
        </div>

        <div className="rlg-actions">
          <button type="button" className="rlg-primary" onClick={generate}>Generate letters</button>
          <button type="button" className="rlg-secondary" onClick={copyOutput} disabled={!canCopy}>{copied ? 'Copied' : 'Copy result'}</button>
        </div>

        <div className={`rlg-result rlg-result--${result.status}`} aria-live="polite">
          <div className="rlg-result-bar">
            <p>{result.message}</p>
            <span>{mode === 'custom' ? 'Custom alphabet' : MODES.find((item) => item.id === mode)?.label}</span>
          </div>

          {result.status === 'ready' ? (
            <div className="rlg-letters" aria-label="Generated letters">
              {result.letters.slice(0, 80).map((letter, index) => (
                <span key={`${letter}-${index}`}>{letter}</span>
              ))}
              {result.letters.length > 80 && <em>Showing first 80. Copy includes all letters.</em>}
            </div>
          ) : (
            <p className="rlg-error">{result.issues.join(' ')}</p>
          )}

          <textarea readOnly value={result.output} aria-label="Copy-ready random letters" />
        </div>
      </div>
    </section>
  );
}

const styles = `
.rlg {
  position: relative;
  max-width: 980px;
  margin: 0 auto;
  color: #3a312b;
}
.rlg-card {
  display: grid;
  gap: 18px;
  padding: clamp(18px, 3vw, 30px);
  border: 1px solid rgba(138, 106, 79, .14);
  border-radius: 8px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 20px 54px rgba(58, 49, 43, .1);
}
.rlg-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}
.rlg-kicker {
  margin: 0 0 5px;
  color: #14986b;
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.rlg h2 {
  margin: 0;
  color: #302a26;
  font-size: clamp(1.45rem, 3vw, 2.05rem);
  line-height: 1.1;
}
.rlg-pill {
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e7f8f1;
  color: #14986b;
  font-size: .82rem;
  font-weight: 800;
}
.rlg-modes {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
.rlg-modes button {
  min-height: 74px;
  display: grid;
  justify-items: start;
  align-content: center;
  gap: 3px;
  padding: 12px;
  border: 1px solid rgba(138, 106, 79, .15);
  border-radius: 8px;
  background: #fffaf3;
  color: #3a312b;
  box-shadow: none;
}
.rlg-modes button.is-active {
  border-color: #25c28a;
  background: #25c28a;
  color: #ffffff;
}
.rlg-modes button:hover {
  border-color: rgba(37, 194, 138, .45);
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(58, 49, 43, .08);
}
.rlg-modes button.is-active:hover {
  box-shadow: 0 12px 24px rgba(37, 194, 138, .22);
}
.rlg-modes span {
  font-size: .78rem;
  opacity: .78;
}
.rlg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.rlg-field {
  display: grid;
  gap: 6px;
  color: #5f5148;
  font-size: .86rem;
  font-weight: 800;
}
.rlg-field--wide {
  grid-column: 1 / -1;
}
.rlg input,
.rlg select,
.rlg textarea {
  min-height: 44px;
  border: 1px solid rgba(138, 106, 79, .2);
  border-radius: 8px;
  background: #fffdf9;
  color: #302a26;
  font: inherit;
}
.rlg input:focus,
.rlg select:focus,
.rlg textarea:focus,
.rlg button:focus-visible {
  outline: 3px solid rgba(37, 194, 138, .24);
  outline-offset: 2px;
}
.rlg-options,
.rlg-actions,
.rlg-result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.rlg-options p,
.rlg-result-bar p {
  margin: 0;
  color: #7b6a5e;
}
.rlg-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3a312b;
  font-weight: 800;
}
.rlg-check input {
  width: 18px;
  min-height: 18px;
  accent-color: #25c28a;
}
.rlg-actions button {
  min-height: 46px;
  border-radius: 7px;
  padding: 11px 16px;
  transition: transform .16s ease, background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
}
.rlg-primary {
  background: #25c28a;
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(37, 194, 138, .24);
}
.rlg-primary:hover {
  background: #14986b;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(37, 194, 138, .28);
}
.rlg-secondary {
  border: 1px solid rgba(138, 106, 79, .18);
  background: #fffaf3;
  color: #3a312b;
}
.rlg-secondary:hover:not(:disabled) {
  border-color: rgba(37, 194, 138, .36);
  background: #f0fbf6;
  transform: translateY(-1px);
}
.rlg-secondary:disabled {
  opacity: .55;
}
.rlg-result {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgba(138, 106, 79, .14);
  border-radius: 8px;
  background: #fbf7f1;
}
.rlg-result-bar span {
  color: #14986b;
  font-size: .84rem;
  font-weight: 900;
  text-transform: uppercase;
}
.rlg-letters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 8px;
}
.rlg-letters span {
  display: grid;
  place-items: center;
  min-height: 48px;
  border: 1px solid rgba(138, 106, 79, .16);
  border-radius: 7px;
  background: #ffffff;
  color: #3a312b;
  font-size: 1.45rem;
  font-weight: 900;
  box-shadow: 0 8px 18px rgba(58, 49, 43, .06);
}
.rlg-letters em {
  grid-column: 1 / -1;
  color: #7b6a5e;
  font-size: .9rem;
}
.rlg-error {
  margin: 0;
  border: 1px solid #f4b8a8;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff1ed;
  color: #8b2f19;
}
.rlg textarea {
  min-height: 112px;
  resize: vertical;
  line-height: 1.55;
}
@media (max-width: 760px) {
  .rlg-header,
  .rlg-options,
  .rlg-actions,
  .rlg-result-bar {
    align-items: stretch;
    flex-direction: column;
  }
  .rlg-modes,
  .rlg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .rlg-actions button {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .rlg-modes,
  .rlg-grid {
    grid-template-columns: 1fr;
  }
}
`;
