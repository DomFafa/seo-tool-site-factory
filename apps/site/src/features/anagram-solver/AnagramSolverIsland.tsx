import React, { useMemo, useState } from 'react';

type Props = { locale: string; config: any };

const WORDS = [
  'alert', 'alter', 'later', 'ratel', 'artel', 'stale', 'steal', 'least', 'slate', 'teals', 'listen', 'silent', 'enlist', 'tinsel', 'inlets',
  'stone', 'tones', 'notes', 'onset', 'rescue', 'secure', 'recuse', 'finder', 'friend', 'fired', 'fried', 'evil', 'vile', 'veil', 'live',
  'angel', 'glean', 'angle', 'brag', 'grab', 'bored', 'robed', 'below', 'elbow', 'dusty', 'study', 'night', 'thing', 'inch', 'chin'
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') (window as any).__factoryTrack?.(eventName, params);
}

export default function AnagramSolverIsland({ locale, config }: Props) {
  const [letters, setLetters] = useState(config?.options?.sampleLetters ?? 'listen');
  const [minLength, setMinLength] = useState(3);
  const results = useMemo(() => solve(letters, minLength), [letters, minLength]);

  function search(value: string) {
    setLetters(value);
    track('tool_start', { toolId: 'anagram-solver', locale, lengthBucket: value.length <= 5 ? 'short' : value.length <= 8 ? 'medium' : 'long' });
  }

  return (
    <div className="tool-grid">
      <div>
        <label htmlFor="anagram-input"><strong>Enter letters</strong></label>
        <input id="anagram-input" value={letters} onChange={(e) => search(e.target.value)} placeholder="e.g. listen" />
      </div>
      <div>
        <label htmlFor="min-length"><strong>Minimum length: {minLength}</strong></label>
        <input id="min-length" type="range" min="2" max="8" value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} />
      </div>
      <div className="result-panel">
        <p><strong>{results.length}</strong> result(s)</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {results.map((word) => <span className="metric" key={word}><strong>{word}</strong></span>)}
          {results.length === 0 && <span>No words found in the starter word list.</span>}
        </div>
      </div>
      <p className="small">V1 uses a small static demo word list. Expand the dictionary before turning this site indexable.</p>
    </div>
  );
}

function solve(raw: string, minLength: number) {
  const letters = raw.toLowerCase().replace(/[^a-z]/g, '');
  const inventory = countLetters(letters);
  return WORDS.filter((word) => word.length >= minLength && canMake(word, inventory)).sort((a, b) => b.length - a.length || a.localeCompare(b));
}

function countLetters(value: string) {
  const counts = new Map<string, number>();
  for (const char of value) counts.set(char, (counts.get(char) ?? 0) + 1);
  return counts;
}

function canMake(word: string, inventory: Map<string, number>) {
  const used = new Map<string, number>();
  for (const char of word) {
    const next = (used.get(char) ?? 0) + 1;
    if (next > (inventory.get(char) ?? 0)) return false;
    used.set(char, next);
  }
  return true;
}
