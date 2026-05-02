import React, { useMemo, useState } from 'react';
import {
  calculateTargetScore,
  calculateWeightedGrade,
  formatPercent,
  resultSummary,
  type GradeCategoryInput
} from '@factory/weighted-grade-calculator';

type Props = {
  locale: string;
  config: any;
};

type Row = {
  id: string;
  name: string;
  weight: string;
  score: string;
  included: boolean;
};

type Preset = {
  id: string;
  label: string;
  rows: Row[];
  target: string;
  remainingWeight: string;
};

const PRESETS: Preset[] = [
  {
    id: 'standard',
    label: 'Class plan',
    rows: [
      row('Homework', '20', '92'),
      row('Quizzes', '15', '86'),
      row('Exams', '45', '84'),
      row('Final', '20', '', false)
    ],
    target: '90',
    remainingWeight: '20'
  },
  {
    id: 'final-heavy',
    label: 'Final-heavy',
    rows: [
      row('Assignments', '25', '91'),
      row('Midterm', '35', '83'),
      row('Final exam', '40', '', false)
    ],
    target: '88',
    remainingWeight: '40'
  },
  {
    id: 'lab',
    label: 'Lab course',
    rows: [
      row('Labs', '30', '95'),
      row('Participation', '10', '100'),
      row('Tests', '40', '82'),
      row('Final', '20', '', false)
    ],
    target: '90',
    remainingWeight: '20'
  }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function WeightedGradeCalculatorIsland({ locale, config }: Props) {
  const defaultPresetId = config?.options?.defaultPreset ?? 'standard';
  const defaultPreset = PRESETS.find((preset) => preset.id === defaultPresetId) ?? PRESETS[0];
  const [activePresetId, setActivePresetId] = useState(defaultPreset.id);
  const [presetDrafts, setPresetDrafts] = useState<Record<string, Preset>>({});
  const [rows, setRows] = useState<Row[]>(defaultPreset.rows);
  const [targetGrade, setTargetGrade] = useState(defaultPreset.target);
  const [remainingWeight, setRemainingWeight] = useState(defaultPreset.remainingWeight);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const gradeInput = useMemo<GradeCategoryInput[]>(() => rows.map((item) => ({
    id: item.id,
    name: item.name,
    weight: item.weight,
    score: item.score,
    included: item.included
  })), [rows]);

  const grade = useMemo(() => calculateWeightedGrade(gradeInput), [gradeInput]);
  const completedWeight = Math.min(100, grade.totalWeight);
  const target = useMemo(() => calculateTargetScore({
    currentGrade: grade.currentGrade,
    completedWeight,
    targetGrade,
    remainingWeight
  }), [grade.currentGrade, completedWeight, targetGrade, remainingWeight]);
  const canCopy = grade.currentGrade !== null && grade.status !== 'invalid' && grade.status !== 'overweight';
  const visibleGrade = canCopy || grade.status === 'valid' || grade.status === 'underweight' ? grade.currentGrade : null;

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((current) => {
      const next = current.map((item) => item.id === id ? { ...item, ...patch } : item);
      saveActiveDraft(next, targetGrade, remainingWeight);
      return next;
    });
    setCopied(false);
  }

  function addRow() {
    setRows((current) => {
      const next = [...current, { id: cryptoId(), name: `Category ${current.length + 1}`, weight: '', score: '', included: true }];
      saveActiveDraft(next, targetGrade, remainingWeight);
      return next;
    });
    track('tool_row_add', { toolId: 'weighted-grade-calculator', locale, rowCount: rows.length + 1 });
  }

  function removeRow(id: string) {
    setRows((current) => {
      const next = current.length > 1 ? current.filter((item) => item.id !== id) : current;
      saveActiveDraft(next, targetGrade, remainingWeight);
      return next;
    });
    setCopied(false);
  }

  function applyPreset(preset: Preset) {
    saveActiveDraft(rows, targetGrade, remainingWeight);
    const nextPreset = presetDrafts[preset.id] ?? preset;
    setActivePresetId(preset.id);
    setRows(nextPreset.rows.map((item) => ({ ...item, id: cryptoId() })));
    setTargetGrade(nextPreset.target);
    setRemainingWeight(nextPreset.remainingWeight);
    setCopied(false);
    setCopyError(false);
    track('preset_change', { toolId: 'weighted-grade-calculator', locale, preset: preset.id });
  }

  function clearAll() {
    const nextRows = [row('Homework', '', ''), row('Quizzes', '', ''), row('Exams', '', '')];
    setRows(nextRows);
    setTargetGrade('');
    setRemainingWeight('');
    saveActiveDraft(nextRows, '', '');
    setCopied(false);
    setCopyError(false);
  }

  function saveActiveDraft(nextRows: Row[], nextTargetGrade: string, nextRemainingWeight: string) {
    setPresetDrafts((current) => ({
      ...current,
      [activePresetId]: {
        id: activePresetId,
        label: PRESETS.find((preset) => preset.id === activePresetId)?.label ?? activePresetId,
        rows: nextRows.map((item) => ({ ...item })),
        target: nextTargetGrade,
        remainingWeight: nextRemainingWeight
      }
    }));
  }

  function updateTargetGrade(value: string) {
    setTargetGrade(value);
    saveActiveDraft(rows, value, remainingWeight);
  }

  function updateRemainingWeight(value: string) {
    setRemainingWeight(value);
    saveActiveDraft(rows, targetGrade, value);
  }

  async function copySummary() {
    if (!canCopy) return;
    setCopyError(false);
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(resultSummary(grade, target));
      setCopied(true);
      track('copy_action', { toolId: 'weighted-grade-calculator', locale, status: grade.status, targetStatus: target.status });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="wgc-cartoon">
      <style>{styles}</style>
      <div className="wgc-doodle wgc-doodle--left" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div className="wgc-doodle wgc-doodle--right" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>

      <section className="wgc-tool-card" aria-labelledby="wgc-result-title">
        <div className="wgc-result-strip">
          <h2 id="wgc-result-title" className="wgc-kicker">Current grade from included categories</h2>
          <output className="wgc-result-value" aria-live="polite">{visibleGrade === null ? '--' : formatPercent(visibleGrade)}</output>
          <p className="wgc-help" aria-live="polite">{grade.messages[0]}</p>
          <div className={`wgc-meter wgc-meter--${grade.status}`} aria-label={`Included weight ${formatPercent(grade.totalWeight)}`}>
            <span style={{ width: `${Math.min(100, grade.totalWeight)}%` }}></span>
          </div>
        </div>

        <div className="wgc-planner">
          <h3>Final plan</h3>
          <div className="wgc-fields">
            <label>
              <span>Target grade</span>
              <input inputMode="decimal" value={targetGrade} onChange={(event) => updateTargetGrade(event.target.value)} placeholder="90" />
            </label>
            <label>
              <span>Remaining weight</span>
              <input inputMode="decimal" value={remainingWeight} onChange={(event) => updateRemainingWeight(event.target.value)} placeholder="20" />
            </label>
          </div>
          <p className={`wgc-needed wgc-needed--${target.status}`} aria-live="polite">
            <strong>{target.neededScore === null ? 'Add a goal' : formatPercent(Math.max(0, target.neededScore))}</strong>
            <span>{target.message}</span>
          </p>
        </div>

        <div className="wgc-actions">
          <button type="button" className="wgc-primary" onClick={copySummary} disabled={!canCopy}>{copied ? 'Copied' : 'Copy summary'}</button>
          <button type="button" className="wgc-reset" onClick={clearAll} aria-label="Reset calculator">↻</button>
        </div>
        {copyError && <p className="wgc-status wgc-status--error">Copy failed. Select the summary and copy manually.</p>}
      </section>

      <div className="wgc-presets" aria-label="Example grade setups">
        {PRESETS.map((preset) => (
          <button type="button" key={preset.id} className={preset.id === activePresetId ? 'wgc-preset--active' : ''} onClick={() => applyPreset(preset)}>
            {preset.label}
          </button>
        ))}
      </div>

      <details className="wgc-editor" open>
        <summary>Edit grade categories</summary>
        <div className="wgc-editor-inner">
          <div className="wgc-editor-head">
            <p>{grade.includedCount} categories · {formatPercent(grade.totalWeight)} weight</p>
            <button type="button" className="wgc-add" onClick={addRow}>Add row</button>
          </div>

          <div className="wgc-rows">
            {rows.map((item, index) => {
              const result = grade.categories.find((category) => category.id === item.id);
              const hasIssue = result && result.included && !result.valid;
              return (
                <div className={`wgc-row ${hasIssue ? 'wgc-row--invalid' : ''}`} key={item.id}>
                  <label>
                    <span>Category</span>
                    <input value={item.name} onChange={(event) => updateRow(item.id, { name: event.target.value })} maxLength={40} placeholder={`Category ${index + 1}`} />
                  </label>
                  <label>
                    <span>Weight %</span>
                    <input inputMode="decimal" value={item.weight} onChange={(event) => updateRow(item.id, { weight: event.target.value })} placeholder="20" />
                  </label>
                  <label>
                    <span>Score %</span>
                    <input inputMode="decimal" value={item.score} onChange={(event) => updateRow(item.id, { score: event.target.value })} placeholder="87" />
                  </label>
                  <label className="wgc-check">
                    <input type="checkbox" checked={item.included} onChange={(event) => updateRow(item.id, { included: event.target.checked })} />
                    <span>Use</span>
                  </label>
                  <button type="button" className="wgc-remove" onClick={() => removeRow(item.id)} aria-label={`Remove ${item.name || `category ${index + 1}`}`} disabled={rows.length === 1}>×</button>
                  {hasIssue && <p className="wgc-row-issue">{result.issues.join(' ')}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </details>

      <p className="wgc-privacy">Runs locally. Your scores are not sent to analytics.</p>
    </div>
  );
}

function row(name: string, weight: string, score: string, included = true): Row {
  const slug = `${name}-${weight}-${score}-${included}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return { id: `preset-${slug}`, name, weight, score, included };
}

function cryptoId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `row-${Math.random().toString(36).slice(2)}`;
}

const styles = `
.wgc-cartoon {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(10px, 2vw, 20px) clamp(14px, 3vw, 24px) 8px;
  color: #101828;
}
.wgc-cartoon::before {
  content: "";
  position: absolute;
  right: -12%;
  top: -86px;
  width: min(520px, 48vw);
  aspect-ratio: 1;
  border-radius: 54% 0 0 54%;
  background: #ffe4ca;
  z-index: -1;
}
.wgc-doodle {
  position: absolute;
  display: grid;
  gap: 8px;
  width: 86px;
  padding: 12px;
  border: 4px solid #17679a;
  border-radius: 12px;
  background: #ffffff;
  transform: rotate(-12deg);
  box-shadow: 0 10px 0 rgba(23, 103, 154, .12);
}
.wgc-doodle span {
  height: 7px;
  border-radius: 999px;
  background: #17679a;
}
.wgc-doodle span:nth-child(2) {
  width: 62%;
  background: #ff7a1a;
}
.wgc-doodle span:nth-child(3) {
  width: 78%;
}
.wgc-doodle--left {
  left: 4px;
  top: 64px;
}
.wgc-doodle--right {
  right: 2px;
  bottom: 24px;
  transform: rotate(12deg);
}
.wgc-tool-card {
  position: relative;
  display: grid;
  gap: 18px;
  max-width: 700px;
  width: min(700px, 100%);
  margin: 0 auto;
  padding: clamp(18px, 3vw, 28px);
  border: 3px dashed #17679a;
  border-radius: 12px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 20px 42px rgba(16, 24, 40, .07);
}
.wgc-result-strip {
  display: grid;
  justify-items: center;
  gap: 7px;
  text-align: center;
}
.wgc-kicker,
.wgc-fields span,
.wgc-row span,
.wgc-editor-head p {
  margin: 0;
  color: #344054;
  font-size: 13px;
  font-weight: 800;
}
.wgc-result-value {
  display: block;
  margin: 0;
  color: #101828;
  font-size: clamp(38px, 6vw, 64px);
  line-height: 1;
  letter-spacing: 0;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.wgc-help {
  max-width: 500px;
  margin: 0;
  color: #667085;
  font-size: 15px;
  line-height: 1.45;
}
.wgc-meter {
  width: min(420px, 100%);
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: #e4e7ec;
}
.wgc-meter span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #ff7a1a;
}
.wgc-meter--valid span { background: #17679a; }
.wgc-meter--overweight span,
.wgc-meter--invalid span { background: #d92d20; }
.wgc-planner {
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
}
.wgc-planner h3 {
  margin: 0;
  color: #101828;
  font-size: 18px;
  line-height: 1.2;
}
.wgc-fields {
  width: min(520px, 100%);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.wgc-fields label,
.wgc-row label {
  display: grid;
  gap: 6px;
  text-align: left;
}
.wgc-fields input,
.wgc-row input {
  min-height: 46px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  background: #fff;
  color: #101828;
  padding: 10px 12px;
  font: inherit;
}
.wgc-fields input {
  text-align: center;
}
.wgc-needed {
  display: grid;
  gap: 4px;
  margin: 0;
  color: #667085;
}
.wgc-needed strong {
  color: #d92d20;
  font-size: 30px;
  line-height: 1;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
}
.wgc-needed--ready strong,
.wgc-needed--already-met strong {
  color: #17679a;
}
.wgc-actions,
.wgc-presets,
.wgc-editor-head {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.wgc-primary,
.wgc-reset,
.wgc-presets button,
.wgc-add,
.wgc-remove {
  min-height: 42px;
  border: 0;
  border-radius: 7px;
  padding: 10px 18px;
  font: inherit;
  font-weight: 900;
}
.wgc-primary {
  min-width: 210px;
  background: #ff7a1a;
  color: #fff;
}
.wgc-primary:disabled {
  opacity: .52;
  cursor: not-allowed;
}
.wgc-reset,
.wgc-add,
.wgc-remove {
  background: #0f4c7a;
  color: #fff;
}
.wgc-reset {
  width: 48px;
  padding: 0;
  font-size: 22px;
}
.wgc-primary:focus-visible,
.wgc-reset:focus-visible,
.wgc-presets button:focus-visible,
.wgc-add:focus-visible,
.wgc-remove:focus-visible,
.wgc-fields input:focus-visible,
.wgc-row input:focus-visible,
.wgc-editor summary:focus-visible {
  outline: 3px solid rgba(255,122,26,.34);
  outline-offset: 3px;
}
.wgc-presets {
  max-width: 720px;
  margin: 16px auto 0;
}
.wgc-presets button {
  background: #eaf4fb;
  color: #0f4c7a;
}
.wgc-presets button.wgc-preset--active {
  background: #0f4c7a;
  color: #ffffff;
}
.wgc-editor {
  max-width: 720px;
  margin: 22px auto 0;
  border: 1px solid #e4e7ec;
  border-radius: 14px;
  background: #fff;
}
.wgc-editor summary {
  cursor: pointer;
  list-style: none;
  padding: 18px 20px;
  color: #101828;
  font-size: 18px;
  font-weight: 900;
  text-align: center;
}
.wgc-editor summary::-webkit-details-marker {
  display: none;
}
.wgc-editor:not([open]) .wgc-editor-inner {
  display: none;
}
.wgc-editor-inner {
  padding: 0 18px 20px;
}
.wgc-editor-head {
  justify-content: space-between;
  margin-bottom: 12px;
}
.wgc-editor-head p {
  font-size: 14px;
}
.wgc-rows {
  display: grid;
  gap: 10px;
}
.wgc-row {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 96px 96px 66px 42px;
  gap: 10px;
  align-items: end;
  padding: 12px 0;
  border-top: 1px solid #f2f4f7;
}
.wgc-row label:first-child input {
  text-align: left;
}
.wgc-row--invalid input {
  border-color: #d92d20;
}
.wgc-check {
  justify-items: center;
}
.wgc-check input {
  width: 18px;
  min-height: auto;
}
.wgc-remove {
  width: 42px;
  padding: 0;
  font-size: 20px;
}
.wgc-remove:disabled {
  opacity: .42;
}
.wgc-row-issue {
  grid-column: 1 / -1;
  margin: 0;
  color: #d92d20;
  font-size: 13px;
}
.wgc-privacy,
.wgc-status {
  max-width: 720px;
  margin: 12px auto 0;
  color: #667085;
  font-size: 13px;
  text-align: center;
}
.wgc-status--error {
  color: #d92d20;
}
@media (max-width: 1080px) {
  .wgc-doodle {
    display: none;
  }
}
@media (max-width: 680px) {
  .wgc-cartoon {
    width: 100%;
    max-width: 100vw;
    overflow: clip;
    padding-inline: 8px;
  }
  .wgc-cartoon::before {
    right: -44%;
    width: 92vw;
  }
  .wgc-tool-card {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    padding: 18px;
    border-width: 2px;
  }
  .wgc-fields,
  .wgc-row {
    grid-template-columns: 1fr;
  }
  .wgc-help,
  .wgc-needed span,
  .wgc-privacy,
  .wgc-status {
    overflow-wrap: anywhere;
  }
  .wgc-row label:first-child,
  .wgc-row-issue {
    grid-column: 1 / -1;
  }
  .wgc-primary {
    min-width: 0;
    width: min(210px, calc(100vw - 118px));
  }
  .wgc-reset {
    flex: 0 0 48px;
  }
  .wgc-presets {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    max-width: 100%;
  }
  .wgc-presets button {
    min-width: 0;
    padding-inline: 8px;
    white-space: normal;
  }
  .wgc-check {
    justify-items: start;
  }
}
@media (max-width: 430px) {
  .wgc-tool-card {
    width: 100%;
    max-width: 100%;
    padding: 16px;
  }
  .wgc-fields {
    grid-template-columns: 1fr;
  }
  .wgc-result-value {
    font-size: 36px;
  }
  .wgc-needed strong {
    font-size: 28px;
  }
  .wgc-presets {
    width: 100%;
    max-width: 100%;
  }
}
`;
