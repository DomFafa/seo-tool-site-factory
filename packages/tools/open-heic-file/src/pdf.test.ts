import assert from 'node:assert/strict';
import {
  fitImageIntoPage,
  getPdfMarginPoints,
  getPdfPageSizePoints,
  pdfOutputFilename
} from './pdf';

assert.equal(pdfOutputFilename(['IMG_0101.HEIC']), 'IMG_0101.pdf');
assert.equal(pdfOutputFilename(['vacation.photo.heif']), 'vacation.photo.pdf');
assert.equal(pdfOutputFilename(['a.heic', 'b.heic']), 'heic-images.pdf');

assert.equal(getPdfMarginPoints('none'), 0);
assert.equal(getPdfMarginPoints('small'), 24);
assert.equal(getPdfMarginPoints('medium'), 48);

assert.deepEqual(
  getPdfPageSizePoints({ width: 1200, height: 1600 }, { pageSize: 'a4', orientation: 'portrait' }),
  { width: 595.28, height: 841.89 }
);

assert.deepEqual(
  getPdfPageSizePoints({ width: 1600, height: 1200 }, { pageSize: 'letter', orientation: 'landscape' }),
  { width: 792, height: 612 }
);

const fitted = fitImageIntoPage(
  { width: 4000, height: 2000 },
  { width: 600, height: 400 },
  50
);

assert.equal(fitted.width, 500);
assert.equal(fitted.height, 250);
assert.equal(fitted.x, 50);
assert.equal(fitted.y, 75);
assert.ok(fitted.x >= 50);
assert.ok(fitted.y >= 50);
assert.ok(fitted.x + fitted.width <= 550);
assert.ok(fitted.y + fitted.height <= 350);
