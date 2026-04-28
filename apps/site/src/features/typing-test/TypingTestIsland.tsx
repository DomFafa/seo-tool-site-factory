import React, { useMemo, useRef, useState } from 'react';
import { calculateTypingResult } from '@factory/typing-engine';

type Props = {
  locale: string;
  config: any;
};

const DEFAULT_PROMPTS = [
  'The quick brown fox jumps over the lazy dog. Practice steady typing before trying to type faster.',
  'Clear tools help people finish simple tasks quickly. Accuracy matters more than speed at the beginning.',
  'A good typing test measures words per minute, accuracy, and errors without distracting the user.'
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    (window as any).__factoryTrack?.(eventName, params);
  }
}

export default function TypingTestIsland({ locale, config }: Props) {
  const durations = config?.options?.durations ?? [15, 30, 60, 180, 300];
  const defaultDuration = config?.options?.defaultDuration ?? 60;
  const prompt = useMemo(() => DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)], []);
  const [duration, setDuration] = useState(defaultDuration);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const timerRef = useRef<number | null>(null);

  const elapsedSeconds = startedAt ? Math.min(duration, Math.floor(((finishedAt ?? now) - startedAt) / 1000)) : 0;
  const remainingSeconds = Math.max(0, duration - elapsedSeconds);
  const finished = Boolean(finishedAt) || remainingSeconds === 0;
  const result = calculateTypingResult({ prompt, typed, elapsedSeconds: Math.max(1, elapsedSeconds || (finished ? duration : 1)) });

  function startTimerIfNeeded() {
    if (startedAt) return;
    const start = Date.now();
    setStartedAt(start);
    setNow(start);
    track('tool_start', { toolId: 'typing-speed-test', locale, duration });
    timerRef.current = window.setInterval(() => {
      setNow(Date.now());
    }, 250);
  }

  function finish() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    const end = Date.now();
    setFinishedAt(end);
    const finalElapsed = startedAt ? Math.min(duration, Math.floor((end - startedAt) / 1000)) : duration;
    const finalResult = calculateTypingResult({ prompt, typed, elapsedSeconds: Math.max(1, finalElapsed) });
    track('tool_complete', { toolId: 'typing-speed-test', locale, duration, wpmBucket: bucket(finalResult.wpm), accuracyBucket: bucket(finalResult.accuracy) });
    track('typing_test_completed', { locale, duration, wpmBucket: bucket(finalResult.wpm), accuracyBucket: bucket(finalResult.accuracy) });
  }

  function reset() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
    setNow(Date.now());
  }

  function onChange(value: string) {
    if (finished) return;
    startTimerIfNeeded();
    setTyped(value);
    if (value.length >= prompt.length) {
      window.setTimeout(finish, 0);
    }
  }

  React.useEffect(() => {
    if (startedAt && !finishedAt && remainingSeconds <= 0) finish();
    return () => undefined;
  }, [remainingSeconds, startedAt, finishedAt]);

  return (
    <div className="tool-grid">
      <div>
        <label htmlFor="duration"><strong>Test duration</strong></label>
        <select id="duration" value={duration} disabled={Boolean(startedAt)} onChange={(e) => setDuration(Number(e.target.value))}>
          {durations.map((d: number) => <option value={d} key={d}>{d < 60 ? `${d} seconds` : `${d / 60} minute${d === 60 ? '' : 's'}`}</option>)}
        </select>
      </div>
      <div className="result-panel" aria-label="Text prompt">
        <p>{prompt}</p>
      </div>
      <div>
        <label htmlFor="typing-input"><strong>Type the text above</strong></label>
        <textarea id="typing-input" value={typed} disabled={finished} onChange={(e) => onChange(e.target.value)} placeholder="Start typing here..." />
      </div>
      <div className="metric-row" aria-live="polite">
        <div className="metric"><span className="small">Time left</span><strong>{remainingSeconds}s</strong></div>
        <div className="metric"><span className="small">WPM</span><strong>{result.wpm}</strong></div>
        <div className="metric"><span className="small">Accuracy</span><strong>{result.accuracy}%</strong></div>
        <div className="metric"><span className="small">Errors</span><strong>{result.errors}</strong></div>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="secondary" onClick={reset}>Reset</button>
        {startedAt && !finished && <button type="button" onClick={finish}>Finish now</button>}
      </div>
      <p className="small">Privacy: this typing test runs in your browser. Typed text is not sent to the server by this tool.</p>
    </div>
  );
}

function bucket(value: number) {
  if (value < 20) return '0-19';
  if (value < 40) return '20-39';
  if (value < 60) return '40-59';
  if (value < 80) return '60-79';
  return '80+';
}
