import assert from 'node:assert/strict';
import { addDaysIso, formatDate, generateRandomDates } from './index';

const basic = generateRandomDates({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  count: 5,
  unique: true,
  format: 'iso',
  seed: 42
});

assert.equal(basic.status, 'ready');
assert.equal(basic.dates.length, 5);
assert.equal(new Set(basic.dates).size, 5);
assert.ok(basic.dates.every((date) => date >= '2026-01-01' && date <= '2026-01-31'));

const weekdays = generateRandomDates({
  startDate: '2026-05-03',
  endDate: '2026-05-09',
  count: 5,
  weekdays: [1, 2, 3, 4, 5],
  unique: true,
  sort: 'ascending',
  seed: 1
});
assert.equal(weekdays.status, 'ready');
assert.deepEqual(weekdays.isoDates, ['2026-05-04', '2026-05-05', '2026-05-06', '2026-05-07', '2026-05-08']);

const weekendOnly = generateRandomDates({
  startDate: '2026-05-03',
  endDate: '2026-05-09',
  count: 2,
  weekdays: [0, 6],
  unique: true,
  sort: 'ascending',
  seed: 2
});
assert.deepEqual(weekendOnly.isoDates, ['2026-05-03', '2026-05-09']);

const repeats = generateRandomDates({
  startDate: '2026-01-01',
  endDate: '2026-01-01',
  count: 3,
  unique: false,
  seed: 1
});
assert.equal(repeats.status, 'ready');
assert.deepEqual(repeats.isoDates, ['2026-01-01', '2026-01-01', '2026-01-01']);

const impossible = generateRandomDates({
  startDate: '2026-01-01',
  endDate: '2026-01-01',
  count: 2,
  unique: true
});
assert.equal(impossible.status, 'invalid');
assert.equal(impossible.eligibleDays, 1);

const invalidRange = generateRandomDates({
  startDate: '2026-02-01',
  endDate: '2026-01-01',
  count: 1
});
assert.equal(invalidRange.status, 'invalid');

const leap = generateRandomDates({
  startDate: '2024-02-29',
  endDate: '2024-02-29',
  count: 1,
  unique: true,
  format: 'long',
  seed: 1
});
assert.equal(leap.dates[0], 'February 29, 2024');

assert.equal(formatDate(new Date(Date.UTC(2026, 4, 3)), 'us'), '05/03/2026');
assert.equal(addDaysIso('2026-05-03', 90), '2026-08-01');
