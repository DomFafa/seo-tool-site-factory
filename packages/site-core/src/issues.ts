export type IssueLevel = 'error' | 'warning';

export type ValidationIssue = {
  level: IssueLevel;
  code: string;
  message: string;
  siteId?: string;
  file?: string;
};

export type ValidationResult = {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

export function emptyResult(): ValidationResult {
  return { errors: [], warnings: [] };
}

export function mergeResults(...results: ValidationResult[]): ValidationResult {
  return {
    errors: results.flatMap((result) => result.errors),
    warnings: results.flatMap((result) => result.warnings)
  };
}
