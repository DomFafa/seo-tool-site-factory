import assert from 'node:assert/strict';
import { cleanCursedText, countCombiningMarks, createCursedText, settingsForPreset } from './index';

const medium = createCursedText('hello', settingsForPreset('medium'));
assert.notEqual(medium.output, 'hello');
assert.ok(countCombiningMarks(medium.output) > 0);

const light = createCursedText('hello', settingsForPreset('light'));
const heavy = createCursedText('hello', settingsForPreset('heavy'));
assert.ok(countCombiningMarks(light.output) < countCombiningMarks(medium.output));
assert.ok(countCombiningMarks(heavy.output) > countCombiningMarks(medium.output));

const multiline = createCursedText('hello\nworld', settingsForPreset('medium'));
assert.ok(multiline.output.includes('\n'));

const emoji = createCursedText('hello ghost', settingsForPreset('medium')).output;
assert.ok(emoji.includes(' '));

const cleaned = cleanCursedText(medium.output);
assert.equal(cleaned, 'hello');

const capped = createCursedText('x'.repeat(1000), { ...settingsForPreset('heavy'), maxOutputLength: 500 });
assert.equal(capped.truncated, true);
assert.ok(capped.warning);
