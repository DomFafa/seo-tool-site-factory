import React, { useMemo, useState } from 'react';
import {
  addDaysIso,
  generateRandomDates,
  getTodayIso,
  type DateFormat,
  type SortMode
} from '@factory/random-date-generator';

type Props = {
  locale: string;
  config: any;
};

type Preset = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  count: string;
  weekdays: number[];
  unique: boolean;
  format: DateFormat;
  sort: SortMode;
};

const WEEKDAYS = [
  { value: 0, short: 'Sun' },
  { value: 1, short: 'Mon' },
  { value: 2, short: 'Tue' },
  { value: 3, short: 'Wed' },
  { value: 4, short: 'Thu' },
  { value: 5, short: 'Fri' },
  { value: 6, short: 'Sat' }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function RandomDateGeneratorIsland({ locale, config }: Props) {
  const today = getTodayIso();
  const presets = useMemo(() => createPresets(today), [today]);
  const defaultPreset = presets[0];
  const [startDate, setStartDate] = useState(defaultPreset.startDate);
  const [endDate, setEndDate] = useState(defaultPreset.endDate);
  const [count, setCount] = useState(String(config?.options?.defaultCount ?? defaultPreset.count));
  const [weekdays, setWeekdays] = useState<number[]>(defaultPreset.weekdays);
  const [unique, setUnique] = useState(defaultPreset.unique);
  const [format, setFormat] = useState<DateFormat>(config?.options?.defaultFormat ?? defaultPreset.format);
  const [sort, setSort] = useState<SortMode>(defaultPreset.sort);
  const [activePreset, setActivePreset] = useState(defaultPreset.id);
  const [seed, setSeed] = useState(101);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => generateRandomDates({
    startDate,
    endDate,
    count,
    weekdays,
    unique,
    format,
    sort,
    seed
  }), [startDate, endDate, count, weekdays, unique, format, sort, seed]);

  const output = result.dates.join('\n');
  const canCopy = result.status === 'ready' && result.dates.length > 0;

  function generate() {
    setSeed((current) => current + 1);
    setCopied(false);
    track('generate_action', { toolId: 'random-date-generator', locale, status: result.status, format });
  }

  function applyPreset(preset: Preset) {
    setActivePreset(preset.id);
    setStartDate(preset.startDate);
    setEndDate(preset.endDate);
    setCount(preset.count);
    setWeekdays(preset.weekdays);
    setUnique(preset.unique);
    setFormat(preset.format);
    setSort(preset.sort);
    setSeed((current) => current + 7);
    setCopied(false);
    track('preset_change', { toolId: 'random-date-generator', locale, action: preset.id });
  }

  function toggleWeekday(day: number) {
    setWeekdays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort((a, b) => a - b));
    setCopied(false);
  }

  function selectWeekdayGroup(group: 'all' | 'weekdays' | 'weekends') {
    if (group === 'weekdays') setWeekdays([1, 2, 3, 4, 5]);
    else if (group === 'weekends') setWeekdays([0, 6]);
    else setWeekdays([0, 1, 2, 3, 4, 5, 6]);
    setCopied(false);
  }

  function reset() {
    applyPreset(defaultPreset);
  }

  async function copyDates() {
    if (!canCopy) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      track('copy_action', { toolId: 'random-date-generator', locale, status: result.status, format });
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rdg" aria-labelledby="rdg-title">
      <style>{styles}</style>
      <div className="rdg-shell">
        <div className="rdg-search" aria-hidden="true">
          <span>Quick presets</span>
          <strong>range, weekdays, format, copy</strong>
        </div>

        <div className="rdg-card">
          <div className="rdg-head">
            <div>
              <p className="rdg-kicker">Calendar date picker</p>
              <h2 id="rdg-title">Generate random dates</h2>
            </div>
            <p className="rdg-safe">Local only</p>
          </div>

          <div className="rdg-presets" aria-label="Random date presets">
            {presets.map((preset) => (
              <button type="button" key={preset.id} className={preset.id === activePreset ? 'is-active' : ''} onClick={() => applyPreset(preset)}>
                {preset.label}
              </button>
            ))}
          </div>

          <div className="rdg-grid">
            <label>
              <span>Start date</span>
              <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <label>
              <span>End date</span>
              <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </label>
            <label>
              <span>How many dates?</span>
              <input inputMode="numeric" value={count} onChange={(event) => setCount(event.target.value)} />
            </label>
            <label>
              <span>Output format</span>
              <select value={format} onChange={(event) => setFormat(event.target.value as DateFormat)}>
                <option value="iso">ISO: 2026-05-03</option>
                <option value="us">US: 05/03/2026</option>
                <option value="long">Long: May 3, 2026</option>
                <option value="compact">Compact: May 3</option>
              </select>
            </label>
          </div>

          <div className="rdg-toolbar">
            <div className="rdg-filter" aria-label="Weekday filter">
              <button type="button" onClick={() => selectWeekdayGroup('all')}>All</button>
              <button type="button" onClick={() => selectWeekdayGroup('weekdays')}>Weekdays</button>
              <button type="button" onClick={() => selectWeekdayGroup('weekends')}>Weekends</button>
            </div>
            <label className="rdg-toggle">
              <input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} />
              <span>Unique dates</span>
            </label>
          </div>

          <div className="rdg-days" aria-label="Custom weekdays">
            {WEEKDAYS.map((day) => (
              <button type="button" key={day.value} className={weekdays.includes(day.value) ? 'is-on' : ''} onClick={() => toggleWeekday(day.value)}>
                {day.short}
              </button>
            ))}
          </div>

          <div className="rdg-actions">
            <button type="button" className="rdg-primary" onClick={generate}>Generate dates</button>
            <button type="button" className="rdg-secondary" onClick={copyDates} disabled={!canCopy}>{copied ? 'Copied' : 'Copy dates'}</button>
            <button type="button" className="rdg-icon" onClick={reset} aria-label="Reset random date generator">Reset</button>
          </div>

          <div className={`rdg-result rdg-result--${result.status}`} aria-live="polite">
            <div className="rdg-result-head">
              <p>{result.message}</p>
              <label>
                <span>Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
                  <option value="random">Random order</option>
                  <option value="ascending">Oldest first</option>
                  <option value="descending">Newest first</option>
                </select>
              </label>
            </div>

            {result.status === 'ready' ? (
              <div className="rdg-dates" aria-label="Generated random dates">
                {result.dates.slice(0, 80).map((date, index) => <span key={`${date}-${index}`}>{date}</span>)}
                {result.dates.length > 80 && <em>Showing first 80 of {result.dates.length} dates. Copy includes all dates.</em>}
              </div>
            ) : (
              <p className="rdg-error">{result.issues.join(' ')}</p>
            )}

            <textarea readOnly value={output} aria-label="Copy-ready generated dates" />
          </div>
        </div>
      </div>
    </section>
  );
}

function createPresets(today: string): Preset[] {
  const startOfMonth = today.slice(0, 8) + '01';
  return [
    { id: 'next-30', label: 'Next 30 days', startDate: today, endDate: addDaysIso(today, 30), count: '8', weekdays: [0, 1, 2, 3, 4, 5, 6], unique: true, format: 'iso', sort: 'random' },
    { id: 'birthdays', label: 'Birthdays', startDate: '1980-01-01', endDate: '2005-12-31', count: '12', weekdays: [0, 1, 2, 3, 4, 5, 6], unique: true, format: 'long', sort: 'ascending' },
    { id: 'workdays', label: 'Workdays', startDate: startOfMonth, endDate: addDaysIso(startOfMonth, 31), count: '10', weekdays: [1, 2, 3, 4, 5], unique: true, format: 'us', sort: 'ascending' },
    { id: 'test-data', label: 'Test data', startDate: addDaysIso(today, -1825), endDate: today, count: '25', weekdays: [0, 1, 2, 3, 4, 5, 6], unique: true, format: 'iso', sort: 'random' }
  ];
}

const styles = `
.rdg {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 clamp(12px, 3vw, 28px) 10px;
  color: #1d2340;
}
.rdg-shell {
  display: grid;
  gap: 16px;
}
.rdg-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(560px, 100%);
  min-height: 48px;
  margin: 0 auto;
  padding: 8px 16px;
  border: 1px solid rgba(122, 167, 255, .22);
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(29, 35, 64, .08);
}
.rdg-search span {
  color: #6a789e;
  font-size: 13px;
  font-weight: 800;
}
.rdg-search strong {
  color: #1d2340;
  font-size: 15px;
}
.rdg-card {
  display: grid;
  gap: 18px;
  width: min(940px, 100%);
  margin: 0 auto;
  padding: clamp(18px, 3vw, 30px);
  border: 1px solid rgba(122, 167, 255, .22);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(29, 35, 64, .1);
}
.rdg-head,
.rdg-toolbar,
.rdg-result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.rdg-actions {
  display: grid;
  grid-template-columns: minmax(170px, 210px) 1fr minmax(132px, max-content) minmax(86px, max-content);
  align-items: center;
  gap: 12px;
}
.rdg-actions .rdg-secondary {
  grid-column: 3;
}
.rdg-actions .rdg-icon {
  grid-column: 4;
}
.rdg-kicker,
.rdg-card label span,
.rdg-result-head p {
  margin: 0;
  color: #687697;
  font-size: 13px;
  font-weight: 900;
}
.rdg-head h2 {
  margin: 3px 0 0;
  color: #1d2340;
  font-size: clamp(1.45rem, 3vw, 2.2rem);
  line-height: 1.05;
  letter-spacing: 0;
}
.rdg-safe {
  margin: 0;
  border-radius: 999px;
  padding: 8px 12px;
  background: #eef5ff;
  color: #2d477f;
  font-size: 13px;
  font-weight: 900;
}
.rdg-presets,
.rdg-filter,
.rdg-days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.rdg-presets button,
.rdg-filter button,
.rdg-days button,
.rdg-primary,
.rdg-secondary,
.rdg-icon {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  font: inherit;
  font-weight: 900;
  transition: background .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.rdg-presets button,
.rdg-filter button,
.rdg-days button {
  background: #fce8f1;
  color: #445274;
}
.rdg-presets button.is-active,
.rdg-days button.is-on {
  background: #456ee7;
  color: #fff;
}
.rdg-presets button:hover,
.rdg-filter button:hover,
.rdg-days button:hover {
  background: #b8dcff;
  color: #1d2340;
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(122, 167, 255, .2);
}
.rdg-presets button.is-active:hover,
.rdg-days button.is-on:hover {
  background: #355cd2;
  color: #ffffff;
}
.rdg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.rdg-card label {
  display: grid;
  gap: 7px;
}
.rdg-card input,
.rdg-card select,
.rdg-result textarea {
  width: 100%;
  min-height: 46px;
  border: 1px solid rgba(64, 42, 110, .18);
  border-radius: 8px;
  background: #fbfdff;
  color: #1d2340;
  padding: 10px 12px;
  font: inherit;
}
.rdg-card input:focus-visible,
.rdg-card select:focus-visible,
.rdg-result textarea:focus-visible,
.rdg-presets button:focus-visible,
.rdg-filter button:focus-visible,
.rdg-days button:focus-visible,
.rdg-primary:focus-visible,
.rdg-secondary:focus-visible,
.rdg-icon:focus-visible {
  outline: 3px solid rgba(255, 155, 194, .35);
  outline-offset: 3px;
}
.rdg-toggle {
  display: inline-flex !important;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px !important;
  min-height: 42px;
  border-radius: 999px;
  padding: 8px 12px;
  background: #fce8f1;
}
.rdg-toggle input {
  width: 18px;
  min-height: 18px;
}
.rdg-primary {
  min-width: 190px;
  background: #ff9bc2;
  color: #1d2340;
}
.rdg-secondary {
  background: #456ee7;
  color: #fff;
}
.rdg-primary:hover {
  background: #ff82b2;
  color: #1d2340;
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(255, 155, 194, .28);
}
.rdg-secondary:hover:not(:disabled) {
  background: #b8dcff;
  color: #1d2340;
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(122, 167, 255, .24);
}
.rdg-secondary:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.rdg-icon {
  background: #fce8f1;
  color: #445274;
}
.rdg-icon:hover {
  background: #b8dcff;
  color: #1d2340;
  transform: translateY(-1px);
}
.rdg-result {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(122, 167, 255, .22);
  border-radius: 14px;
  padding: 16px;
  background: linear-gradient(180deg, #f7fbff, #ffffff);
}
.rdg-result-head p {
  color: #445274;
}
.rdg-result-head label {
  min-width: 180px;
}
.rdg-dates {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 220px;
  overflow: auto;
}
.rdg-dates span {
  border: 1px solid rgba(255, 155, 194, .28);
  border-radius: 999px;
  padding: 8px 11px;
  background: #fff;
  color: #1d2340;
  font-size: 14px;
  font-weight: 800;
}
.rdg-dates em,
.rdg-error {
  color: #b42318;
  font-size: 14px;
}
.rdg-result textarea {
  min-height: 118px;
  resize: vertical;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.5;
}
@media (max-width: 840px) {
  .rdg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .rdg {
    max-width: 100vw;
    overflow-x: clip;
    padding-inline: 10px;
  }
  .rdg-search {
    display: none;
  }
  .rdg-card {
    padding: 16px;
    border-radius: 14px;
  }
  .rdg-grid,
  .rdg-result-head,
  .rdg-actions {
    grid-template-columns: 1fr;
    display: grid;
  }
  .rdg-actions .rdg-secondary,
  .rdg-actions .rdg-icon {
    grid-column: auto;
  }
  .rdg-actions > button,
  .rdg-result-head label {
    width: 100%;
  }
  .rdg-days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .rdg-days button {
    min-width: 0;
    padding-inline: 4px;
    font-size: 12px;
  }
}
`;
