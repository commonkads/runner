import { consoleWriter } from '@commonkads/engine';

import { validate } from '../validation/validator.js';
import type { ValidationFinding } from '../types/validation-finding.js';

export function validateCommand(knowledgeRoot: string): void {
  const result = validate(knowledgeRoot);

  if (result.valid && result.findings.length === 0) {
    consoleWriter.log('Validation passed. No issues found.');
    return;
  }

  for (const finding of result.findings) {
    consoleWriter.log(formatFinding(finding));
  }

  const status = result.valid ? 'passed' : 'failed';
  const count = result.findings.length;
  consoleWriter.log(`Validation ${status}. ${count} finding${count === 1 ? '' : 's'}.`);

  if (!result.valid) {
    throw new Error('Validation failed');
  }
}

function formatFinding(finding: ValidationFinding): string {
  const level = finding.level.toUpperCase();
  return finding.path
    ? `[${level}] ${finding.message} (${finding.path})`
    : `[${level}] ${finding.message}`;
}
