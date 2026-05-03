import assert from 'node:assert/strict';
import { formatLetters, generateRandomLetters, normalizeCustomAlphabet } from './index';

const basic = generateRandomLetters({
  mode: 'alphabet',
  count: 12,
  unique: true,
  seed: 7
});

assert.equal(basic.status, 'ready');
assert.equal(basic.letters.length, 12);
assert.equal(new Set(basic.letters).size, 12);
assert.ok(basic.letters.every((letter) => /^[A-Z]$/.test(letter)));

const vowels = generateRandomLetters({
  mode: 'vowels',
  count: 5,
  unique: true,
  seed: 1
});

assert.equal(vowels.status, 'ready');
assert.ok(vowels.letters.every((letter) => ['A', 'E', 'I', 'O', 'U'].includes(letter)));

const consonants = generateRandomLetters({
  mode: 'consonants',
  count: 10,
  unique: true,
  seed: 2
});

assert.equal(consonants.status, 'ready');
assert.ok(consonants.letters.every((letter) => !['A', 'E', 'I', 'O', 'U'].includes(letter)));

assert.deepEqual(normalizeCustomAlphabet('a, b b c! Zz'), ['A', 'B', 'C', 'Z']);

const impossible = generateRandomLetters({
  mode: 'custom',
  customAlphabet: 'ABC',
  count: 4,
  unique: true
});

assert.equal(impossible.status, 'invalid');
assert.match(impossible.message, /No-repeat mode/);

const repeats = generateRandomLetters({
  mode: 'custom',
  customAlphabet: 'A',
  count: 3,
  unique: false,
  seed: 3
});

assert.equal(repeats.status, 'ready');
assert.deepEqual(repeats.letters, ['A', 'A', 'A']);

const lowerGrouped = generateRandomLetters({
  mode: 'custom',
  customAlphabet: 'ABCDEF',
  count: 6,
  unique: true,
  letterCase: 'lower',
  format: 'groups',
  groupSize: 3,
  seed: 4
});

assert.equal(lowerGrouped.status, 'ready');
assert.match(lowerGrouped.output, /^[a-z] [a-z] [a-z]\n[a-z] [a-z] [a-z]$/);

assert.equal(formatLetters(['A', 'B', 'C'], 'commas'), 'A, B, C');
assert.equal(formatLetters(['A', 'B', 'C'], 'spaces'), 'A B C');
