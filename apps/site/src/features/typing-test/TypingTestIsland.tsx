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
  const mode = config?.options?.mode ?? 'speed-test';
  const prompts: string[] = config?.options?.prompts?.length ? config.options.prompts : DEFAULT_PROMPTS;
  const labels = getLabels(mode);
  const prompt = useMemo(() => prompts[Math.floor(Math.random() * prompts.length)], [prompts]);
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
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / duration) * 100));
  const promptProgress = Math.min(100, Math.round((typed.length / prompt.length) * 100));

  function startTimerIfNeeded() {
    if (startedAt) return;
    const start = Date.now();
    setStartedAt(start);
    setNow(start);
    track('tool_start', { toolId: config?.toolId ?? 'typing-tool', locale, duration, mode });
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
    track('tool_complete', { toolId: config?.toolId ?? 'typing-tool', locale, duration, mode, wpmBucket: bucket(finalResult.wpm), accuracyBucket: bucket(finalResult.accuracy) });
    track('typing_test_completed', { locale, duration, mode, wpmBucket: bucket(finalResult.wpm), accuracyBucket: bucket(finalResult.accuracy) });
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
    <div className="tool-grid typing-test">
      <div className="typing-test__topbar">
        <div>
          <p className="typing-test__eyebrow">SpeedType console</p>
          <strong>{startedAt ? (finished ? 'Result locked' : 'Test running') : 'Ready when you type'}</strong>
        </div>
        <div className="duration-toggle" aria-label={labels.durationLabel}>
          {durations.map((d: number) => (
            <button
              type="button"
              className={d === duration ? 'duration-option active' : 'duration-option'}
              disabled={Boolean(startedAt)}
              onClick={() => setDuration(d)}
              key={d}
            >
              {formatDurationShort(d)}
            </button>
          ))}
        </div>
      </div>

      <div className="typing-test__stage">
        <div className="prompt-card" aria-label="Text prompt">
          <span className="small">Prompt</span>
          <p>{prompt}</p>
        </div>
        <div className="typing-progress" aria-label="Test progress">
          <span style={{ width: `${progressPercent}%` }}></span>
        </div>
      </div>

      <div className="typing-input-panel">
        <label htmlFor="typing-input"><strong>{labels.inputLabel}</strong><span>{promptProgress}% of prompt typed</span></label>
        <textarea id="typing-input" value={typed} disabled={finished} onChange={(e) => onChange(e.target.value)} placeholder={labels.placeholder} />
      </div>

      <div className="metric-row typing-metrics" aria-live="polite">
        <div className="metric"><span className="small">Time left</span><strong>{remainingSeconds}s</strong></div>
        <div className="metric"><span className="small">WPM</span><strong>{result.wpm}</strong></div>
        <div className="metric"><span className="small">CPM</span><strong>{result.cpm}</strong></div>
        <div className="metric"><span className="small">Accuracy</span><strong>{result.accuracy}%</strong></div>
        <div className="metric"><span className="small">Errors</span><strong>{result.errors}</strong></div>
      </div>
      <div className="typing-actions">
        <button type="button" className="secondary" onClick={reset}>Reset</button>
        {startedAt && !finished && <button type="button" onClick={finish}>Finish now</button>}
      </div>
      <p className="small typing-privacy">Privacy: this typing tool runs in your browser. Typed text is not sent to the server by this tool.</p>
    </div>
  );
}

function getLabels(mode: string) {
  if (mode === 'practice') return { durationLabel: 'Practice duration', inputLabel: 'Practice typing the text above', placeholder: 'Start practicing here...' };
  if (mode === 'paragraph') return { durationLabel: 'Paragraph practice duration', inputLabel: 'Type the paragraph above', placeholder: 'Type the paragraph here...' };
  if (mode === 'online-test') return { durationLabel: 'Online test duration', inputLabel: 'Complete the online typing test', placeholder: 'Start the online test here...' };
  return { durationLabel: 'Test duration', inputLabel: 'Type the text above', placeholder: 'Start typing here...' };
}

function formatDurationShort(seconds: number) {
  return seconds < 60 ? `${seconds}s` : `${seconds / 60}m`;
}

function bucket(value: number) {
  if (value < 20) return '0-19';
  if (value < 40) return '20-39';
  if (value < 60) return '40-59';
  if (value < 80) return '60-79';
  return '80+';
}
