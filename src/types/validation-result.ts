import type { ValidationFinding } from './validation-finding.js';

export type ValidationResult = {
  /** `true` iff there are no error-level findings. */
  valid: boolean;
  findings: ValidationFinding[];
};
