import React, { useEffect, useMemo, useState } from 'react';

type Props = { locale: string; config: any };
type AnagramIndex = Record<string, string[]>;
type LoadState = 'loading' | 'ready' | 'error';

const ANAGRAM_INDEX_URL = '/data/anagram/en-index.json';

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') (window as any).__factoryTrack?.(eventName, params);
}

export default function AnagramSolverIsland({ locale, config }: Props) {
  const [wordIndex, setWordIndex] = useState<AnagramIndex>({});
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [letters, setLetters] = useState(config?.options?.sampleLetters ?? 'listen');
  const [minLength, setMinLength] = useState(config?.options?.defaultMinLength ?? 3);
  const [startsWith, setStartsWith] = useState('');
  const [contains, setContains] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const words = useMemo(() => Object.values(wordIndex).flat(), [wordIndex]);
  const results = useMemo(() => solve(words, { letters, minLength, startsWith, contains, endsWith }), [words, letters, minLength, startsWith, contains, endsWith]);
  const visibleResults = results.slice(0, 120);

  useEffect(() => {
    let cancelled = false;
    fetch(ANAGRAM_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<AnagramIndex>;
      })
      .then((data) => {
        if (cancelled) return;
        setWordIndex(data);
        setLoadState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function updateLetters(value: string) {
    setLetters(value);
    track('tool_start', { toolId: 'anagram-solver', locale, lengthBucket: value.length <= 5 ? 'short' : value.length <= 8 ? 'medium' : 'long' });
  }

  return (
    <div className="tool-grid">
      <div>
        <label htmlFor="anagram-input"><strong>Enter letters</strong></label>
        <input id="anagram-input" value={letters} onChange={(e) => updateLetters(e.target.value)} placeholder="e.g. listen" />
      </div>
      <div className="tool-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div>
          <label htmlFor="min-length"><strong>Minimum length: {minLength}</strong></label>
          <input id="min-length" type="range" min="2" max="10" value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="starts-with"><strong>Starts with</strong></label>
          <input id="starts-with" value={startsWith} onChange={(e) => setStartsWith(e.target.value)} placeholder="optional" />
        </div>
        <div>
          <label htmlFor="contains"><strong>Contains</strong></label>
          <input id="contains" value={contains} onChange={(e) => setContains(e.target.value)} placeholder="optional" />
        </div>
        <div>
          <label htmlFor="ends-with"><strong>Ends with</strong></label>
          <input id="ends-with" value={endsWith} onChange={(e) => setEndsWith(e.target.value)} placeholder="optional" />
        </div>
      </div>
      <div className="result-panel">
        {loadState === 'loading' && <p className="small">Loading word index...</p>}
        {loadState === 'error' && <p className="small">Word index could not be loaded. Try refreshing the page.</p>}
        <p><strong>{results.length}</strong> possible word{results.length === 1 ? '' : 's'}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {visibleResults.map((word) => <span className="metric" key={word}><strong>{word}</strong></span>)}
          {loadState === 'ready' && results.length === 0 && <span>No words found. Try fewer letters, a lower minimum length, or remove filters.</span>}
        </div>
        {results.length > visibleResults.length && <p className="small">Showing the first {visibleResults.length} results. Add a filter to narrow the list.</p>}
      </div>
      <p className="small">Privacy: the search runs in your browser. The letters you enter are not sent to a server by this tool.</p>
    </div>
  );
}

function solve(words: string[], options: { letters: string; minLength: number; startsWith: string; contains: string; endsWith: string }) {
  const letters = options.letters.toLowerCase().replace(/[^a-z]/g, '');
  const startsWith = options.startsWith.toLowerCase().replace(/[^a-z]/g, '');
  const contains = options.contains.toLowerCase().replace(/[^a-z]/g, '');
  const endsWith = options.endsWith.toLowerCase().replace(/[^a-z]/g, '');
  const inventory = countLetters(letters);
  const uniqueWords = Array.from(new Set(words.map((word) => word.toLowerCase()).filter(Boolean)));
  return uniqueWords
    .filter((word) => word.length >= options.minLength)
    .filter((word) => !startsWith || word.startsWith(startsWith))
    .filter((word) => !contains || word.includes(contains))
    .filter((word) => !endsWith || word.endsWith(endsWith))
    .filter((word) => canMake(word, inventory))
    .sort((a, b) => b.length - a.length || a.localeCompare(b));
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
