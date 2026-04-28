import React from 'react';

type Props = { locale: string; config: any };

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWER = 'abcdefghijklmnopqrstuvwxyz'.split('');
const SCRIPT_UPPER = ['𝒜','ℬ','𝒞','𝒟','ℰ','ℱ','𝒢','ℋ','ℐ','𝒥','𝒦','ℒ','ℳ','𝒩','𝒪','𝒫','𝒬','ℛ','𝒮','𝒯','𝒰','𝒱','𝒲','𝒳','𝒴','𝒵'];
const SCRIPT_LOWER = ['𝒶','𝒷','𝒸','𝒹','ℯ','𝒻','ℊ','𝒽','𝒾','𝒿','𝓀','𝓁','𝓂','𝓃','ℴ','𝓅','𝓆','𝓇','𝓈','𝓉','𝓊','𝓋','𝓌','𝓍','𝓎','𝓏'];

export default function CursiveAlphabetIsland({ locale, config }: Props) {
  return (
    <div className="tool-grid">
      <div className="result-panel">
        <p><strong>Cursive alphabet chart</strong></p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(86px, 1fr))', gap: 10 }}>
          {LETTERS.map((letter, index) => (
            <div className="metric" key={letter} style={{ minHeight: 86 }}>
              <span className="small">{letter} / {LOWER[index]}</span>
              <strong style={{ fontSize: '1.8rem' }}>{SCRIPT_UPPER[index]} {SCRIPT_LOWER[index]}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="result-panel">
        <p><strong>Practice tip</strong></p>
        <p>Use this draft chart as a reference for uppercase and lowercase cursive letters. Add printable worksheets before making this site indexable.</p>
      </div>
    </div>
  );
}
