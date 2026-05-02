export type DateFormat = 'iso' | 'us' | 'long' | 'compact';
export type SortMode = 'random' | 'ascending' | 'descending';

export type RandomDateInput = {
  startDate: string;
  endDate: string;
  count: number | string;
  weekdays?: number[];
  unique?: boolean;
  format?: DateFormat;
  sort?: SortMode;
  seed?: number;
};

export type RandomDateResult = {
  status: 'ready' | 'invalid';
  dates: string[];
  isoDates: string[];
  eligibleDays: number;
  message: string;
  issues: string[];
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export function generateRandomDates(input: RandomDateInput): RandomDateResult {
  const issues: string[] = [];
  const start = parseDateOnly(input.startDate);
  const end = parseDateOnly(input.endDate);
  const count = parseCount(input.count);
  const weekdays = normalizeWeekdays(input.weekdays);
  const format = input.format ?? 'iso';
  const sort = input.sort ?? 'random';
  const unique = input.unique !== false;

  if (!start) issues.push('Choose a valid start date.');
  if (!end) issues.push('Choose a valid end date.');
  if (count === null) issues.push('Count must be a whole number from 1 to 500.');
  if (weekdays.length === 0) issues.push('Select at least one weekday.');
  if (start && end && start.time > end.time) issues.push('End date must be on or after the start date.');

  if (issues.length > 0 || !start || !end || count === null) {
    return { status: 'invalid', dates: [], isoDates: [], eligibleDays: 0, message: issues[0] ?? 'Fix the date options.', issues };
  }

  const pool = buildDatePool(start.time, end.time, weekdays);
  if (pool.length === 0) {
    return { status: 'invalid', dates: [], isoDates: [], eligibleDays: 0, message: 'No dates match the selected weekday filter.', issues: ['No dates match the selected weekday filter.'] };
  }

  if (unique && count > pool.length) {
    const issue = `The range has ${pool.length} eligible date${pool.length === 1 ? '' : 's'}, so unique output cannot create ${count}.`;
    return { status: 'invalid', dates: [], isoDates: [], eligibleDays: pool.length, message: issue, issues: [issue] };
  }

  const random = createRandom(input.seed);
  const selected = unique ? takeUnique(pool, count, random) : takeWithRepeats(pool, count, random);
  const sorted = sortDates(selected, sort);
  const isoDates = sorted.map(formatIso);
  const dates = sorted.map((date) => formatDate(date, format));

  return {
    status: 'ready',
    dates,
    isoDates,
    eligibleDays: pool.length,
    message: `Generated ${dates.length} random date${dates.length === 1 ? '' : 's'} from ${pool.length} eligible day${pool.length === 1 ? '' : 's'}.`,
    issues: []
  };
}

export function formatDate(date: Date, format: DateFormat): string {
  if (format === 'iso') return formatIso(date);
  if (format === 'us') return `${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${date.getUTCFullYear()}`;
  if (format === 'compact') return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
}

export function getTodayIso(now = new Date()): string {
  return formatIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function addDaysIso(isoDate: string, days: number): string {
  const parsed = parseDateOnly(isoDate);
  if (!parsed) return isoDate;
  return formatIso(new Date(parsed.time + days * DAY_MS));
}

function parseDateOnly(value: string): { time: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { time: date.getTime() };
}

function parseCount(value: number | string): number | null {
  const numeric = typeof value === 'string' ? Number(value.trim()) : value;
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 500) return null;
  return numeric;
}

function normalizeWeekdays(value: number[] | undefined): number[] {
  const source = value?.length ? value : DEFAULT_WEEKDAYS;
  return [...new Set(source.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))].sort((a, b) => a - b);
}

function buildDatePool(startTime: number, endTime: number, weekdays: number[]): Date[] {
  const allowed = new Set(weekdays);
  const dates: Date[] = [];
  for (let time = startTime; time <= endTime; time += DAY_MS) {
    const date = new Date(time);
    if (allowed.has(date.getUTCDay())) dates.push(date);
  }
  return dates;
}

function takeUnique(pool: Date[], count: number, random: () => number): Date[] {
  const copy = [...pool];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy.slice(0, count);
}

function takeWithRepeats(pool: Date[], count: number, random: () => number): Date[] {
  return Array.from({ length: count }, () => pool[Math.floor(random() * pool.length)]);
}

function sortDates(dates: Date[], sort: SortMode): Date[] {
  if (sort === 'ascending') return [...dates].sort((a, b) => a.getTime() - b.getTime());
  if (sort === 'descending') return [...dates].sort((a, b) => b.getTime() - a.getTime());
  return dates;
}

function formatIso(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function createRandom(seed: number | undefined): () => number {
  if (seed === undefined) return Math.random;
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
