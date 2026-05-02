export type GradeCategoryInput = {
  id?: string;
  name?: string;
  weight: number | string | null | undefined;
  score: number | string | null | undefined;
  included?: boolean;
};

export type GradeCategoryResult = {
  id: string;
  name: string;
  weight: number | null;
  score: number | null;
  included: boolean;
  valid: boolean;
  contribution: number;
  weightedPoints: number;
  issues: string[];
};

export type WeightedGradeResult = {
  categories: GradeCategoryResult[];
  includedCount: number;
  totalWeight: number;
  earnedWeightedPoints: number;
  currentGrade: number | null;
  normalizedGrade: number | null;
  status: 'empty' | 'valid' | 'underweight' | 'overweight' | 'invalid';
  messages: string[];
};

export type TargetGradeInput = {
  currentGrade: number | null;
  completedWeight: number;
  targetGrade: number | string | null | undefined;
  remainingWeight: number | string | null | undefined;
};

export type TargetGradeResult = {
  targetGrade: number | null;
  remainingWeight: number | null;
  neededScore: number | null;
  status: 'empty' | 'ready' | 'already-met' | 'impossible' | 'invalid';
  message: string;
};

export function calculateWeightedGrade(input: GradeCategoryInput[]): WeightedGradeResult {
  const categories = input.map(normalizeCategory);
  const includedValid = categories.filter((category) => category.included && category.valid && category.weight !== null && category.score !== null);
  const includedCount = includedValid.length;
  const totalWeight = round2(includedValid.reduce((sum, category) => sum + (category.weight ?? 0), 0));
  const earnedWeightedPoints = round2(includedValid.reduce((sum, category) => sum + category.weightedPoints, 0));
  let currentGrade = totalWeight > 0 ? round2(earnedWeightedPoints / totalWeight) : null;
  let normalizedGrade = currentGrade;
  const messages: string[] = [];
  const hasInvalidIncluded = categories.some((category) => category.included && !category.valid);
  const includedRows = categories.filter((category) => category.included);

  let status: WeightedGradeResult['status'] = 'valid';
  if (includedRows.length === 0) {
    status = 'empty';
    messages.push('Select at least one category to calculate your grade.');
  } else if (hasInvalidIncluded) {
    status = 'invalid';
    currentGrade = null;
    normalizedGrade = null;
    messages.push('Fix the highlighted category errors before using the result.');
  } else if (includedCount === 0 || totalWeight <= 0) {
    status = 'invalid';
    currentGrade = null;
    normalizedGrade = null;
    messages.push('Enter at least one included category with weight above 0%.');
  } else if (totalWeight > 100) {
    status = 'overweight';
    currentGrade = null;
    normalizedGrade = null;
    messages.push(`Included weights add to ${formatPercent(totalWeight)}, which is over 100%.`);
  } else if (totalWeight < 100) {
    status = 'underweight';
    messages.push(`Included weights add to ${formatPercent(totalWeight)}. This is a current-grade estimate for the entered categories.`);
  } else {
    messages.push('Included weights add to 100%. This is a full weighted course grade.');
  }

  return {
    categories,
    includedCount,
    totalWeight,
    earnedWeightedPoints,
    currentGrade,
    normalizedGrade,
    status,
    messages
  };
}

export function calculateTargetScore(input: TargetGradeInput): TargetGradeResult {
  const targetGrade = parsePercent(input.targetGrade);
  const remainingWeight = parsePercent(input.remainingWeight);
  const currentGrade = input.currentGrade;
  const completedWeight = Number.isFinite(input.completedWeight) ? round2(input.completedWeight) : 0;

  if (targetGrade === null && remainingWeight === null) {
    return { targetGrade: null, remainingWeight: null, neededScore: null, status: 'empty', message: 'Enter a target grade and remaining weight to plan the next score.' };
  }

  if (targetGrade === null || remainingWeight === null || currentGrade === null || completedWeight <= 0 || remainingWeight <= 0) {
    return { targetGrade, remainingWeight, neededScore: null, status: 'invalid', message: 'Use a valid current grade, target grade, and remaining weight.' };
  }

  if (targetGrade < 0 || targetGrade > 100) {
    return { targetGrade, remainingWeight, neededScore: null, status: 'invalid', message: 'Target grade must be between 0% and 100%.' };
  }

  if (remainingWeight > 100) {
    return { targetGrade, remainingWeight, neededScore: null, status: 'invalid', message: 'Remaining weight cannot be over 100%.' };
  }

  const plannedTotalWeight = round2(completedWeight + remainingWeight);
  if (Math.abs(plannedTotalWeight - 100) > 0.01) {
    return { targetGrade, remainingWeight, neededScore: null, status: 'invalid', message: `Completed weight plus remaining weight must equal 100%. It is currently ${formatPercent(plannedTotalWeight)}.` };
  }

  const completedContribution = currentGrade * completedWeight;
  const neededScore = round2(((targetGrade * 100) - completedContribution) / remainingWeight);

  if (neededScore <= 0) {
    return { targetGrade, remainingWeight, neededScore, status: 'already-met', message: `The target is already within reach; a ${formatPercent(Math.max(0, neededScore))} on the remaining work is enough mathematically.` };
  }

  if (neededScore > 100) {
    return { targetGrade, remainingWeight, neededScore, status: 'impossible', message: `You would need ${formatPercent(neededScore)} on the remaining work, which is above 100%.` };
  }

  return { targetGrade, remainingWeight, neededScore, status: 'ready', message: `You need ${formatPercent(neededScore)} on the remaining work to reach ${formatPercent(targetGrade)} overall.` };
}

export function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'not available';
  const rounded = round2(value);
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, '')}%`;
}

export function resultSummary(result: WeightedGradeResult, target?: TargetGradeResult): string {
  const grade = result.currentGrade === null ? 'not available' : formatPercent(result.currentGrade);
  const lines = [
    `Weighted grade: ${grade}`,
    `Included categories: ${result.includedCount}`,
    `Included weight: ${formatPercent(result.totalWeight)}`,
    ...result.messages
  ];
  if (target && target.status !== 'empty') lines.push(target.message);
  return lines.join('\n');
}

function normalizeCategory(category: GradeCategoryInput, index: number): GradeCategoryResult {
  const weightValue = parsePercentInput(category.weight);
  const scoreValue = parsePercentInput(category.score);
  const weight = weightValue.value;
  const score = scoreValue.value;
  const included = category.included !== false;
  const name = String(category.name ?? '').trim() || `Category ${index + 1}`;
  const issues: string[] = [];

  if (weightValue.reason === 'blank') issues.push('Enter a weight.');
  if (weightValue.reason === 'invalid') issues.push('Weight must be a number from 0 to 100.');
  if (scoreValue.reason === 'blank') issues.push('Enter a score.');
  if (scoreValue.reason === 'invalid') issues.push('Score must be a number from 0 to 100.');
  if (weight !== null && weight < 0) issues.push('Weight cannot be negative.');
  if (weight !== null && weight > 100) issues.push('Weight cannot be over 100%.');
  if (score !== null && score < 0) issues.push('Score cannot be negative.');
  if (score !== null && score > 100) issues.push('Score cannot be over 100%.');

  const valid = issues.length === 0;
  const contribution = valid && included && weight !== null && score !== null ? round2(weight * score) : 0;

  return {
    id: category.id ?? `category-${index + 1}`,
    name,
    weight,
    score,
    included,
    valid,
    contribution,
    weightedPoints: contribution,
    issues
  };
}

function parsePercent(value: number | string | null | undefined): number | null {
  return parsePercentInput(value).value;
}

function parsePercentInput(value: number | string | null | undefined): { value: number | null; reason: 'ok' | 'blank' | 'invalid' } {
  if (value === null || value === undefined) return { value: null, reason: 'blank' };
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return { value: null, reason: 'blank' };
    const normalized = trimmed.endsWith('%') ? trimmed.slice(0, -1).trim() : trimmed;
    if (normalized === '') return { value: null, reason: 'invalid' };
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? { value: numeric, reason: 'ok' } : { value: null, reason: 'invalid' };
  }
  if (!Number.isFinite(value)) return { value: null, reason: 'invalid' };
  return { value, reason: 'ok' };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
