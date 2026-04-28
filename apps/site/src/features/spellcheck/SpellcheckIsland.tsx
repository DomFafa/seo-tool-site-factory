import React, { useMemo, useState } from 'react';

type Props = { locale: string; config: any };

type Rule = { pattern: RegExp; label: string; suggestion: string };

const RULES: Rule[] = [
  { pattern: /\ba\b/g, label: 'a / à', suggestion: 'Vérifiez si vous voulez écrire « à » avec accent pour une préposition.' },
  { pattern: /\bou\b/g, label: 'ou / où', suggestion: 'Vérifiez si « où » est nécessaire pour indiquer un lieu ou une question.' },
  { pattern: /\bca\b/gi, label: 'ça', suggestion: 'En français courant, « ça » prend une cédille.' },
  { pattern: /\bse\s+son\b/gi, label: 'se / ce', suggestion: 'Vérifiez la confusion possible entre « se » et « ce ».' },
  { pattern: /\bpeut etre\b/gi, label: 'peut-être', suggestion: '« peut-être » s’écrit généralement avec un trait d’union.' }
];

function track(eventName: string, params: Record<string, unknown>) {
  if (typeof window !== 'undefined') (window as any).__factoryTrack?.(eventName, params);
}

export default function SpellcheckIsland({ locale, config }: Props) {
  const [text, setText] = useState('Ca peut etre un exemple ou une phrase a corriger.');
  const matches = useMemo(() => check(text), [text]);

  function onChange(value: string) {
    setText(value);
    track('tool_start', { toolId: 'spellcheck', locale, lengthBucket: value.length < 80 ? 'short' : value.length < 300 ? 'medium' : 'long' });
  }

  return (
    <div className="tool-grid">
      <div>
        <label htmlFor="spellcheck-input"><strong>Texte à vérifier</strong></label>
        <textarea id="spellcheck-input" value={text} onChange={(e) => onChange(e.target.value)} placeholder="Collez votre texte ici..." />
      </div>
      <div className="result-panel">
        <p><strong>Suggestions détectées</strong></p>
        {matches.length === 0 ? <p>Aucune suggestion dans cette version de démonstration.</p> : (
          <ul>
            {matches.map((match, index) => <li key={`${match.label}-${index}`}><strong>{match.label}:</strong> {match.suggestion}</li>)}
          </ul>
        )}
      </div>
      <p className="small">V1 est une version statique légère. Elle ne remplace pas un correcteur orthographique ou grammatical complet.</p>
    </div>
  );
}

function check(text: string): Rule[] {
  return RULES.filter((rule) => {
    rule.pattern.lastIndex = 0;
    return rule.pattern.test(text);
  });
}
