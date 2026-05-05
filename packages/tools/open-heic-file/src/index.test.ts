import assert from 'node:assert/strict';
import { detectHeicType, formatBytes, outputFilename, sizeBucket, validateHeicFile } from './index';

function file(name: string, type: string, size: number): File {
  return { name, type, size } as File;
}

const options = {
  maxFileSizeMb: 25,
  acceptedInputTypes: ['image/heic', 'image/heif'],
  acceptedExtensions: ['.heic', '.heif']
};

assert.equal(validateHeicFile(file('photo.heic', '', 1024), options).ok, true);
assert.equal(validateHeicFile(file('photo.HEIF', '', 1024), options).ok, true);
assert.equal(validateHeicFile(file('download', 'image/heic', 1024), options).ok, true);

const unsupported = validateHeicFile(file('photo.jpg', 'image/jpeg', 1024), options);
assert.equal(unsupported.ok, false);
assert.equal(unsupported.ok ? '' : unsupported.reason, 'unsupported_type');

const large = validateHeicFile(file('photo.heic', 'image/heic', 26 * 1024 * 1024), options);
assert.equal(large.ok, false);
assert.equal(large.ok ? '' : large.reason, 'file_too_large');

assert.equal(detectHeicType(file('sample.heic', '', 1), options), 'image/heic');
assert.equal(detectHeicType(file('sample.heif', '', 1), options), 'image/heif');
assert.equal(detectHeicType(file('sample.bin', 'image/heif', 1), options), 'image/heif');
assert.equal(detectHeicType(file('sample.png', 'image/png', 1), options), '');

assert.equal(sizeBucket(512), '<1MB');
assert.equal(sizeBucket(2 * 1024 * 1024), '1-5MB');
assert.equal(sizeBucket(8 * 1024 * 1024), '5-10MB');
assert.equal(sizeBucket(12 * 1024 * 1024), '10-25MB');
assert.equal(sizeBucket(30 * 1024 * 1024), '25MB+');

assert.equal(formatBytes(512), '512 B');
assert.equal(formatBytes(1536), '1.5 KB');
assert.equal(formatBytes(2 * 1024 * 1024), '2 MB');

assert.equal(outputFilename('IMG_0101.HEIC', 'png'), 'IMG_0101.png');
assert.equal(outputFilename('vacation.photo.heif', 'jpg'), 'vacation.photo.jpg');
assert.equal(outputFilename('', 'png'), 'opened-heic-file.png');
