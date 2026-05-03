export type LetterMode = 'alphabet' | 'vowels' | 'consonants' | 'custom';
export type LetterCase = 'upper' | 'lower';
export type LetterFormat = 'lines' | 'commas' | 'spaces' | 'groups';

export type RandomLetterInput = {
  mode: LetterMode;
  customAlphabet?: string;
  count: number | string;
  unique?: boolean;
  letterCase?: LetterCase;
  format?: LetterFormat;
  groupSize?: number | string;
  seed?: number;
};

export type RandomLetterResult = {
  status: 'ready' | 'invalid';
  letters: string[];
  alphabet: string[];
  output: string;
  message: string;
  issues: string[];
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const VOWELS = 'AEIOU'.split('');
const CONSONANTS = ALPHABET.filter((letter) => !VOWELS.includes(letter));

export function generateRandomLetters(input: RandomLetterInput): RandomLetterResult {
  const issues: string[] = [];
  const count = parseInteger(input.count, 1, 500);
  const groupSize = parseInteger(input.groupSize ?? 5, 1, 50);
  const letterCase = input.letterCase ?? 'upper';
  const format = input.format ?? 'lines';
  const unique = input.unique !== false;
  const alphabet = getAlphabet(input.mode, input.customAlphabet);

  if (count === null) issues.push('Count must be a whole number from 1 to 500.');
  if (groupSize === null) issues.push('Group size must be a whole number from 1 to 50.');
  if (alphabet.length === 0) issues.push('Enter at least one letter for the custom alphabet.');

  if (count !== null && unique && alphabet.length > 0 && count > alphabet.length) {
    issues.push(`No-repeat mode can only create ${alphabet.length} unique letter${alphabet.length === 1 ? '' : 's'} from this alphabet.`);
  }

  if (issues.length > 0 || count === null || groupSize === null) {
    return {
      status: 'invalid',
      letters: [],
      alphabet,
      output: '',
      message: issues[0] ?? 'Fix the letter options.',
      issues
    };
  }

  const random = createRandom(input.seed);
  const selected = unique ? takeUnique(alphabet, count, random) : takeWithRepeats(alphabet, count, random);
  const letters = selected.map((letter) => letterCase === 'lower' ? letter.toLowerCase() : letter);
  const output = formatLetters(letters, format, groupSize);

  return {
    status: 'ready',
    letters,
    alphabet,
    output,
    message: `Generated ${letters.length} random letter${letters.length === 1 ? '' : 's'} from ${alphabet.length} available letter${alphabet.length === 1 ? '' : 's'}.`,
    issues: []
  };
}

export function getAlphabet(mode: LetterMode, customAlphabet = ''): string[] {
  if (mode === 'alphabet') return ALPHABET;
  if (mode === 'vowels') return VOWELS;
  if (mode === 'consonants') return CONSONANTS;
  return normalizeCustomAlphabet(customAlphabet);
}

export function normalizeCustomAlphabet(value: string): string[] {
  const matches = value.toUpperCase().match(/[A-Z]/g) ?? [];
  return [...new Set(matches)];
}

export function formatLetters(letters: string[], format: LetterFormat, groupSize = 5): string {
  if (format === 'commas') return letters.join(', ');
  if (format === 'spaces') return letters.join(' ');
  if (format === 'groups') {
    const groups: string[] = [];
    for (let index = 0; index < letters.length; index += groupSize) {
      groups.push(letters.slice(index, index + groupSize).join(' '));
    }
    return groups.join('\n');
  }
  return letters.join('\n');
}

function parseInteger(value: number | string, min: number, max: number): number | null {
  const numeric = typeof value === 'string' ? Number(value.trim()) : value;
  if (!Number.isInteger(numeric) || numeric < min || numeric > max) return null;
  return numeric;
}

function takeUnique(alphabet: string[], count: number, random: () => number): string[] {
  const copy = [...alphabet];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, count);
}

function takeWithRepeats(alphabet: string[], count: number, random: () => number): string[] {
  return Array.from({ length: count }, () => alphabet[Math.floor(random() * alphabet.length)]);
}

function createRandom(seed: number | undefined): () => number {
  if (seed === undefined) return Math.random;
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
