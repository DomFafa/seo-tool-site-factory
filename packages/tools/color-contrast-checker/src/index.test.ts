import assert from 'node:assert/strict';
import {
  checkContrast,
  contrastRatio,
  formatRatio,
  parseColor,
  relativeLuminance,
  suggestForeground
} from './index';

const black = parseColor('#000000');
const white = parseColor('#ffffff');
assert.equal(black.ok, true);
assert.equal(white.ok, true);
if (black.ok && white.ok) {
  assert.equal(contrastRatio(black.rgb, white.rgb), 21);
  assert.equal(relativeLuminance(black.rgb), 0);
  assert.equal(relativeLuminance(white.rgb), 1);
}

const same = checkContrast('#fff', '#ffffff');
assert.equal(same.valid, true);
assert.equal(same.ratio, 1);
assert.equal(same.verdicts.every((verdict) => !verdict.passed), true);

const shorthand = parseColor('#36f');
assert.equal(shorthand.ok, true);
assert.equal(shorthand.ok ? shorthand.hex : '', '#3366ff');

const rgb = parseColor('rgb(255, 255, 255)');
assert.equal(rgb.ok, true);
assert.equal(rgb.ok ? rgb.hex : '', '#ffffff');

const invalidRgb = parseColor('rgb(300, 0, 0)');
assert.equal(invalidRgb.ok, false);

const alpha = parseColor('#ffffffff');
assert.equal(alpha.ok, false);
assert.match(alpha.ok ? '' : alpha.error, /Alpha/);

const strong = checkContrast('#000', '#fff');
assert.equal(strong.status, 'strong');
assert.equal(strong.verdicts.find((verdict) => verdict.id === 'aaa-normal')?.passed, true);

const largeOnly = checkContrast('#777777', '#ffffff');
assert.equal(largeOnly.verdicts.find((verdict) => verdict.id === 'aa-large')?.passed, true);
assert.equal(largeOnly.verdicts.find((verdict) => verdict.id === 'aa-normal')?.passed, false);

const poor = checkContrast('#999999', '#ffffff');
assert.equal(poor.verdicts.find((verdict) => verdict.id === 'aa-normal')?.passed, false);
assert.ok(poor.suggestedForeground?.startsWith('#'));

const suggestion = suggestForeground({ r: 153, g: 153, b: 153 }, { r: 255, g: 255, b: 255 }, 4.5);
assert.ok(suggestion);
assert.equal(checkContrast(suggestion ?? '#000000', '#ffffff').verdicts.find((verdict) => verdict.id === 'aa-normal')?.passed, true);

assert.equal(formatRatio(4.5), '4.5:1');
assert.equal(formatRatio(21), '21:1');

