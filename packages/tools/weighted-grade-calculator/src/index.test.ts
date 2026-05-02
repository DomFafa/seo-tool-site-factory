import assert from 'node:assert/strict';
import { calculateTargetScore, calculateWeightedGrade, formatPercent, resultSummary } from './index';

const full = calculateWeightedGrade([
  { name: 'Homework', weight: 20, score: 90 },
  { name: 'Quizzes', weight: 20, score: 80 },
  { name: 'Exams', weight: 40, score: 85 },
  { name: 'Final', weight: 20, score: 95 }
]);

assert.equal(full.status, 'valid');
assert.equal(full.totalWeight, 100);
assert.equal(full.currentGrade, 87);

const underweight = calculateWeightedGrade([
  { name: 'Homework', weight: 20, score: 90 },
  { name: 'Exams', weight: 40, score: 80 }
]);
assert.equal(underweight.status, 'underweight');
assert.equal(underweight.totalWeight, 60);
assert.equal(underweight.currentGrade, 83.33);

const overweight = calculateWeightedGrade([
  { name: 'Homework', weight: 60, score: 90 },
  { name: 'Exams', weight: 60, score: 80 }
]);
assert.equal(overweight.status, 'overweight');
assert.equal(overweight.totalWeight, 120);

const invalid = calculateWeightedGrade([{ name: 'Tests', weight: 'abc', score: 90 }]);
assert.equal(invalid.status, 'invalid');
assert.equal(invalid.currentGrade, null);
assert.equal(invalid.categories[0]?.valid, false);
assert.equal(invalid.categories[0]?.issues[0], 'Weight must be a number from 0 to 100.');

const invalidMixed = calculateWeightedGrade([
  { name: 'Tests', weight: 'abc', score: 90 },
  { name: 'Homework', weight: 50, score: 100 }
]);
assert.equal(invalidMixed.status, 'invalid');
assert.equal(invalidMixed.currentGrade, null);

const excluded = calculateWeightedGrade([
  { name: 'Final', weight: 40, score: 0, included: false },
  { name: 'Coursework', weight: 60, score: 90 }
]);
assert.equal(excluded.totalWeight, 60);
assert.equal(excluded.currentGrade, 90);

const zeroWeight = calculateWeightedGrade([{ name: 'Homework', weight: 0, score: 90 }]);
assert.equal(zeroWeight.status, 'invalid');
assert.equal(zeroWeight.currentGrade, null);

const percentStrings = calculateWeightedGrade([{ name: 'Homework', weight: '20%', score: '90%' }]);
assert.equal(percentStrings.status, 'underweight');
assert.equal(percentStrings.currentGrade, 90);

const target = calculateTargetScore({ currentGrade: 85, completedWeight: 80, targetGrade: 90, remainingWeight: 20 });
assert.equal(target.status, 'impossible');
assert.equal(target.neededScore, 110);

const reachable = calculateTargetScore({ currentGrade: 88, completedWeight: 75, targetGrade: 90, remainingWeight: 25 });
assert.equal(reachable.status, 'ready');
assert.equal(reachable.neededScore, 96);

const invalidTarget = calculateTargetScore({ currentGrade: 88, completedWeight: 75, targetGrade: -1, remainingWeight: 25 });
assert.equal(invalidTarget.status, 'invalid');

const mismatchedWeight = calculateTargetScore({ currentGrade: 88, completedWeight: 75, targetGrade: 90, remainingWeight: 30 });
assert.equal(mismatchedWeight.status, 'invalid');

assert.equal(formatPercent(87), '87%');
assert.ok(resultSummary(full, reachable).includes('Weighted grade: 87%'));
