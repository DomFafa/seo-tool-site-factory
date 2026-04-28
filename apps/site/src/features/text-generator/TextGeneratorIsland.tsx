import React, { useMemo, useState } from 'react';

type Props = {
  locale: string;
  config: any;
  mode: 'cursive' | 'cursed';
};

const CURSIVE: Record<string, string> = {
  A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢', H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ',
  N: '𝒩', O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰', V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
  a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ', h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂',
  n: '𝓃', o: 'ℴ', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊', v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏'
};

const BOLD_SCRIPT: Record<string, string> = {
  A: '𝓐', B: '𝓑', C: '𝓒', D: '𝓓', E: '𝓔', F: '𝓕', G: '𝓖', H: '𝓗', I: '𝓘', J: '𝓙', K: '𝓚', L: '𝓛', M: '𝓜',
  N: '𝓝', O: '𝓞', P: '𝓟', Q: '𝓠', R: '𝓡', S: '𝓢', T: '𝓣', U: '𝓤', V: '𝓥', W: '𝓦', X: '𝓧', Y: '𝓨', Z: '𝓩',
  a: '𝓪', b: '𝓫', c: '𝓬', d: '𝓭', e: '𝓮', f: '𝓯', g: '𝓰', h: '𝓱', i: '𝓲', j: '𝓳', k: '𝓴', l: '𝓵', m: '𝓶',
  n: '𝓷', o: '𝓸', p: '𝓹', q: '𝓺', r: '𝓻', s: '𝓼', t: '𝓽', u: '𝓾', v: '𝓿', w: '𝔀', x: '𝔁', y: '𝔂', z: '𝔃'
};

const MARKS = ['\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317', '\u0318', '\u0319', '\u031A', '\u031B', '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0329'];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') (window as any).__factoryTrack?.(eventName, params);
}

export default function TextGeneratorIsland({ locale, config, mode }: Props) {
  const [text, setText] = useState(config?.options?.sampleText ?? (mode === 'cursive' ? 'Your beautiful text' : 'cursed text'));
  const [intensity, setIntensity] = useState(3);
  const outputs = useMemo(() => mode === 'cursive'
    ? [
        { label: 'Cursive script', value: mapText(text, CURSIVE) },
        { label: 'Bold cursive', value: mapText(text, BOLD_SCRIPT) }
      ]
    : [
        { label: 'Cursed text', value: zalgo(text, intensity) },
        { label: 'Cleaned text', value: cleanCombiningMarks(text) }
      ], [text, mode, intensity]);

  async function copy(value: string, label: string) {
    await navigator.clipboard?.writeText(value);
    track('copy_action', { toolId: config?.toolId ?? mode, locale, variant: label });
  }

  return (
    <div className="tool-grid">
      <div>
        <label htmlFor="text-generator-input"><strong>{mode === 'cursive' ? 'Enter text to convert to cursive' : 'Enter text to curse'}</strong></label>
        <textarea id="text-generator-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type text here..." />
      </div>
      {mode === 'cursed' && (
        <div>
          <label htmlFor="curse-intensity"><strong>Intensity: {intensity}</strong></label>
          <input id="curse-intensity" type="range" min="1" max="8" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} />
        </div>
      )}
      <div className="tool-grid">
        {outputs.map((output) => (
          <div className="result-panel" key={output.label}>
            <p className="small">{output.label}</p>
            <p style={{ fontSize: '1.5rem', overflowWrap: 'anywhere' }}>{output.value}</p>
            <button type="button" onClick={() => copy(output.value, output.label)}>Copy</button>
          </div>
        ))}
      </div>
      <p className="small">Privacy: text generation runs in your browser. The input text is not sent to a server by this tool.</p>
    </div>
  );
}

function mapText(text: string, map: Record<string, string>) {
  return [...text].map((char) => map[char] ?? char).join('');
}

function zalgo(text: string, intensity: number) {
  return [...text].map((char) => {
    if (/\s/.test(char)) return char;
    let extra = '';
    for (let i = 0; i < intensity; i++) extra += MARKS[Math.floor(Math.random() * MARKS.length)];
    return char + extra;
  }).join('');
}

function cleanCombiningMarks(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
}
