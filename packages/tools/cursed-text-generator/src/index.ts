export type CursedPreset = 'light' | 'medium' | 'heavy';

export type CursedTextSettings = {
  topMarks: number;
  middleMarks: number;
  bottomMarks: number;
  skipSpaces: boolean;
  seed: number;
  maxOutputLength: number;
};

export type CursedTextResult = {
  output: string;
  inputLength: number;
  outputLength: number;
  combiningMarkCount: number;
  truncated: boolean;
  warning: string | null;
};

export const PRESET_SETTINGS: Record<CursedPreset, Pick<CursedTextSettings, 'topMarks' | 'middleMarks' | 'bottomMarks'>> = {
  light: { topMarks: 1, middleMarks: 0, bottomMarks: 1 },
  medium: { topMarks: 2, middleMarks: 1, bottomMarks: 2 },
  heavy: { topMarks: 4, middleMarks: 2, bottomMarks: 4 }
};

export const DEFAULT_CURSED_TEXT_SETTINGS: CursedTextSettings = {
  ...PRESET_SETTINGS.medium,
  skipSpaces: true,
  seed: 17,
  maxOutputLength: 6000
};

const TOP_MARKS = [
  '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
  '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u0310', '\u0311', '\u0312',
  '\u0313', '\u0314', '\u0315'
];

const MIDDLE_MARKS = ['\u0315', '\u031B', '\u0334', '\u0335', '\u0336', '\u0337', '\u0338'];

const BOTTOM_MARKS = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031A', '\u0320', '\u0321', '\u0322',
  '\u0323', '\u0324', '\u0325', '\u0326', '\u0327', '\u0328', '\u0329', '\u032A',
  '\u032B', '\u032C', '\u032D', '\u032E', '\u032F', '\u0330', '\u0331', '\u0332'
];

const COMBINING_MARKS_PATTERN = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/gu;

export function settingsForPreset(preset: CursedPreset, current: Partial<CursedTextSettings> = {}): CursedTextSettings {
  return {
    ...DEFAULT_CURSED_TEXT_SETTINGS,
    ...current,
    ...PRESET_SETTINGS[preset]
  };
}

export function createCursedText(input: string, settings: Partial<CursedTextSettings> = {}): CursedTextResult {
  const resolved = normalizeSettings(settings);
  const inputChars = Array.from(input);
  let output = '';
  let combiningMarkCount = 0;
  let truncated = false;

  for (let index = 0; index < inputChars.length; index++) {
    const char = inputChars[index] ?? '';
    const marks = marksForChar(char, index, resolved);
    const next = char + marks;

    if (output.length + next.length > resolved.maxOutputLength) {
      truncated = true;
      break;
    }

    output += next;
    combiningMarkCount += marks.length;
  }

  return {
    output,
    inputLength: inputChars.length,
    outputLength: Array.from(output).length,
    combiningMarkCount,
    truncated,
    warning: warningFor(inputChars.length, output.length, truncated)
  };
}

export function cleanCursedText(input: string): string {
  return input.normalize('NFD').replace(COMBINING_MARKS_PATTERN, '').normalize('NFC');
}

export function countCombiningMarks(input: string): number {
  return Array.from(input.matchAll(COMBINING_MARKS_PATTERN)).length;
}

export function isStackableChar(char: string): boolean {
  COMBINING_MARKS_PATTERN.lastIndex = 0;
  if (!char || COMBINING_MARKS_PATTERN.test(char)) {
    COMBINING_MARKS_PATTERN.lastIndex = 0;
    return false;
  }
  if (/\s/u.test(char)) return false;
  return /[\p{L}\p{N}]/u.test(char);
}

function normalizeSettings(settings: Partial<CursedTextSettings>): CursedTextSettings {
  return {
    ...DEFAULT_CURSED_TEXT_SETTINGS,
    ...settings,
    topMarks: clampInt(settings.topMarks ?? DEFAULT_CURSED_TEXT_SETTINGS.topMarks, 0, 8),
    middleMarks: clampInt(settings.middleMarks ?? DEFAULT_CURSED_TEXT_SETTINGS.middleMarks, 0, 4),
    bottomMarks: clampInt(settings.bottomMarks ?? DEFAULT_CURSED_TEXT_SETTINGS.bottomMarks, 0, 8),
    maxOutputLength: clampInt(settings.maxOutputLength ?? DEFAULT_CURSED_TEXT_SETTINGS.maxOutputLength, 500, 20000),
    seed: clampInt(settings.seed ?? DEFAULT_CURSED_TEXT_SETTINGS.seed, 0, 999999)
  };
}

function marksForChar(char: string, index: number, settings: CursedTextSettings): string {
  if ((settings.skipSpaces && /\s/u.test(char)) || !isStackableChar(char)) return '';
  return [
    marksFromPool(TOP_MARKS, settings.topMarks, char, index, settings.seed),
    marksFromPool(MIDDLE_MARKS, settings.middleMarks, char, index, settings.seed + 97),
    marksFromPool(BOTTOM_MARKS, settings.bottomMarks, char, index, settings.seed + 193)
  ].join('');
}

function marksFromPool(pool: string[], count: number, char: string, index: number, seed: number): string {
  let result = '';
  for (let markIndex = 0; markIndex < count; markIndex++) {
    result += pool[pickIndex(pool.length, char, index, markIndex, seed)] ?? '';
  }
  return result;
}

function pickIndex(length: number, char: string, index: number, markIndex: number, seed: number): number {
  const codePoint = char.codePointAt(0) ?? 0;
  const value = codePoint * 31 + index * 131 + markIndex * 17 + seed * 53;
  return Math.abs(value) % length;
}

function warningFor(inputLength: number, outputLength: number, truncated: boolean): string | null {
  if (truncated) return 'Output was capped to keep the tool responsive. Reduce text length or intensity for the full effect.';
  if (inputLength > 700 || outputLength > 3500) return 'This is a lot of cursed text. Some apps may trim it or display it differently.';
  return null;
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}
