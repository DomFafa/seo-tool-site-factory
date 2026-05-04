export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type ParsedColor = {
  ok: true;
  input: string;
  hex: string;
  rgb: RgbColor;
  luminance: number;
} | {
  ok: false;
  input: string;
  error: string;
};

export type ContrastVerdict = {
  id: 'aa-normal' | 'aaa-normal' | 'aa-large' | 'aaa-large' | 'ui-component';
  label: string;
  threshold: number;
  passed: boolean;
};

export type ContrastResult = {
  foreground: ParsedColor;
  background: ParsedColor;
  valid: boolean;
  ratio: number | null;
  ratioText: string;
  verdicts: ContrastVerdict[];
  status: 'invalid' | 'poor' | 'partial' | 'strong';
  summary: string;
  suggestedForeground: string | null;
};

const VERDICTS: Omit<ContrastVerdict, 'passed'>[] = [
  { id: 'aa-normal', label: 'AA normal text', threshold: 4.5 },
  { id: 'aaa-normal', label: 'AAA normal text', threshold: 7 },
  { id: 'aa-large', label: 'AA large text', threshold: 3 },
  { id: 'aaa-large', label: 'AAA large text', threshold: 4.5 },
  { id: 'ui-component', label: 'UI components', threshold: 3 }
];

export function parseColor(input: string): ParsedColor {
  const value = input.trim();
  if (!value) return { ok: false, input, error: 'Enter a color.' };

  const hex = parseHex(value);
  if (hex) return parsedFromRgb(input, hexToRgb(hex));

  const rgb = parseRgb(value);
  if (rgb) return parsedFromRgb(input, rgb);

  if (/rgba|hsla|#[0-9a-f]{4,8}/i.test(value)) {
    return { ok: false, input, error: 'Alpha colors are not supported yet. Flatten the color against its background first.' };
  }

  return { ok: false, input, error: 'Use HEX like #2554d9 or RGB like rgb(37, 84, 217).' };
}

export function checkContrast(foregroundInput: string, backgroundInput: string): ContrastResult {
  const foreground = parseColor(foregroundInput);
  const background = parseColor(backgroundInput);

  if (!foreground.ok || !background.ok) {
    return {
      foreground,
      background,
      valid: false,
      ratio: null,
      ratioText: 'not available',
      verdicts: VERDICTS.map((verdict) => ({ ...verdict, passed: false })),
      status: 'invalid',
      summary: 'Fix the highlighted color input before using the contrast result.',
      suggestedForeground: null
    };
  }

  const ratio = contrastRatio(foreground.rgb, background.rgb);
  const ratioText = formatRatio(ratio);
  const verdicts = VERDICTS.map((verdict) => ({ ...verdict, passed: ratio >= verdict.threshold }));
  const aaNormal = verdicts.find((verdict) => verdict.id === 'aa-normal')?.passed ?? false;
  const aaaNormal = verdicts.find((verdict) => verdict.id === 'aaa-normal')?.passed ?? false;
  const aaLarge = verdicts.find((verdict) => verdict.id === 'aa-large')?.passed ?? false;
  const status: ContrastResult['status'] = aaaNormal ? 'strong' : aaNormal ? 'partial' : aaLarge ? 'partial' : 'poor';
  const suggestedForeground = aaNormal ? null : suggestForeground(foreground.rgb, background.rgb, 4.5);
  const summary = aaaNormal
    ? `${ratioText} passes AAA for normal text.`
    : aaNormal
      ? `${ratioText} passes AA for normal text.`
      : aaLarge
        ? `${ratioText} passes AA for large text, but fails AA for normal text.`
        : `${ratioText} fails AA for normal text and large text.`;

  return {
    foreground,
    background,
    valid: true,
    ratio,
    ratioText,
    verdicts,
    status,
    summary,
    suggestedForeground
  };
}

export function contrastRatio(first: RgbColor, second: RgbColor): number {
  const firstLum = relativeLuminance(first);
  const secondLum = relativeLuminance(second);
  const lighter = Math.max(firstLum, secondLum);
  const darker = Math.min(firstLum, secondLum);
  return round2((lighter + 0.05) / (darker + 0.05));
}

export function relativeLuminance(color: RgbColor): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return round4((0.2126 * r) + (0.7152 * g) + (0.0722 * b));
}

export function formatRatio(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'not available';
  const rounded = round2(value);
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, '')}:1`;
}

export function contrastReport(result: ContrastResult): string {
  if (!result.valid || !result.foreground.ok || !result.background.ok) return result.summary;
  const lines = [
    `Color contrast: ${result.ratioText}`,
    `Foreground: ${result.foreground.hex}`,
    `Background: ${result.background.hex}`,
    result.summary,
    ...result.verdicts.map((verdict) => `${verdict.passed ? 'Pass' : 'Fail'} - ${verdict.label} (${formatRatio(verdict.threshold)})`)
  ];
  if (result.suggestedForeground) lines.push(`Suggested foreground for AA normal text: ${result.suggestedForeground}`);
  return lines.join('\n');
}

export function suggestForeground(current: RgbColor, background: RgbColor, threshold = 4.5): string | null {
  if (contrastRatio(current, background) >= threshold) return rgbToHex(current);

  const bgLum = relativeLuminance(background);
  const darkTarget = { r: 0, g: 0, b: 0 };
  const lightTarget = { r: 255, g: 255, b: 255 };
  const target = bgLum > 0.45 ? darkTarget : lightTarget;

  let best: RgbColor | null = null;
  for (let step = 1; step <= 100; step += 1) {
    const amount = step / 100;
    const candidate = mixRgb(current, target, amount);
    if (contrastRatio(candidate, background) >= threshold) {
      best = candidate;
      break;
    }
  }

  return best ? rgbToHex(best) : null;
}

function parsedFromRgb(input: string, rgb: RgbColor): ParsedColor {
  return {
    ok: true,
    input,
    rgb,
    hex: rgbToHex(rgb),
    luminance: relativeLuminance(rgb)
  };
}

function parseHex(value: string): string | null {
  const match = value.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const raw = match[1].toLowerCase();
  if (raw.length === 3) {
    return `#${raw.split('').map((part) => `${part}${part}`).join('')}`;
  }
  return `#${raw}`;
}

function hexToRgb(hex: string): RgbColor {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function parseRgb(value: string): RgbColor | null {
  const match = value.match(/^rgb\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*\)$/i);
  if (!match) return null;
  const channels = match.slice(1).map(Number);
  if (channels.some((channel) => !Number.isInteger(channel) || channel < 0 || channel > 255)) return null;
  return { r: channels[0], g: channels[1], b: channels[2] };
}

function rgbToHex(color: RgbColor): string {
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function toHex(value: number): string {
  return clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
}

function mixRgb(from: RgbColor, to: RgbColor, amount: number): RgbColor {
  return {
    r: clamp(Math.round(from.r + ((to.r - from.r) * amount)), 0, 255),
    g: clamp(Math.round(from.g + ((to.g - from.g) * amount)), 0, 255),
    b: clamp(Math.round(from.b + ((to.b - from.b) * amount)), 0, 255)
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

