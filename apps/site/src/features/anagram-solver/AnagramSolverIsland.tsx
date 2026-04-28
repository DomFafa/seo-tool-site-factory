import React, { useMemo, useState } from 'react';

type Props = { locale: string; config: any };

const DEFAULT_WORDS = `
about above abuse actor acute admit adopt adult after again agent agree ahead alarm album alert alien alike alive allow alone alter among angel anger angle apple apply arena argue arise armed arrow asset audit avoid baker basic beach began begin begun below bench birth black blame blank block blood board bored brain bread break brick bride brief bring broad brown build cable carry cause chain chair charm cheap check chest chief child china chose civil clean clear clerk clock close cloud coach coast color could count court cover crash cream crime cross crowd crown dance dealt death delay depth dream dress drink drive eager earth eight elbow enemy enjoy enter entry equal error event every exact exist extra faith false fault field final fired first flame flash floor fluid force frame fresh fried friend front fruit giant given glass glean glory grade grand grant graph great green group guard guest guide habit heart heavy honor house human ideal image index inner input issue joint judge known label large later laugh layer learn least legal light limit local logic lucky magic major maker march match maybe metal might minor model money month moral motor mount music named never night noise notes ocean offer often onset order other paint panel paper peace phase phone pilot pitch plain plant plate point power pride proof quick quiet reach ready relay rescue reset rival river robed rough round route royal scale score secure shape share sharp sheet shift shine short skill slate sleep slice smart smile solid solve sound spare speed spell spent split sport stack stage stale stand start state steal stone story study style table taken teach teals thing think third those tinsel tones trace train trial truth under union usage value video visit voice waste watch water wheel where white whole woman world write wrong young
alert alter artel ratel later listen silent enlist inlets stone tones notes onset evil vile veil live angel glean angle brag grab rescue secure recuse finder friend fired fried below elbow dusty study night thing inch chin acres cares races scare rates tears stare taste state seats eats east teas team meat mate tame tone note open peon nope post pots spot stop tops opts parse spear pears reaps spare stone one two three four five six seven eight nine ten
`.trim().split(/\s+/);

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') (window as any).__factoryTrack?.(eventName, params);
}

export default function AnagramSolverIsland({ locale, config }: Props) {
  const words: string[] = config?.options?.wordList?.length ? config.options.wordList : DEFAULT_WORDS;
  const [letters, setLetters] = useState(config?.options?.sampleLetters ?? 'listen');
  const [minLength, setMinLength] = useState(config?.options?.defaultMinLength ?? 3);
  const [startsWith, setStartsWith] = useState('');
  const [contains, setContains] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const results = useMemo(() => solve(words, { letters, minLength, startsWith, contains, endsWith }), [words, letters, minLength, startsWith, contains, endsWith]);
  const visibleResults = results.slice(0, 120);

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
        <p><strong>{results.length}</strong> possible word{results.length === 1 ? '' : 's'}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {visibleResults.map((word) => <span className="metric" key={word}><strong>{word}</strong></span>)}
          {results.length === 0 && <span>No words found. Try fewer letters, a lower minimum length, or remove filters.</span>}
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
