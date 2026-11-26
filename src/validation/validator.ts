import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { parse as parseYaml, YAMLParseError } from 'yaml';

import type { ValidationFinding } from '../types/validation-finding.js';
import type { ValidationResult } from '../types/validation-result.js';

const DOMAIN_FILE = 'domain.yml';
const REQUIRED_FIELDS = ['name', 'task', 'psm', 'input', 'knowledge'] as const;

export function validate(knowledgeRoot: string): ValidationResult {
  const findings: ValidationFinding[] = [];
  const domainPath = join(knowledgeRoot, DOMAIN_FILE);

  if (!existsSync(domainPath)) {
    findings.push({ level: 'error', message: 'domain.yml not found', path: DOMAIN_FILE });
    return toResult(findings);
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(readFileSync(domainPath, 'utf-8'));
  } catch (error) {
    if (error instanceof YAMLParseError) {
      findings.push({
        level: 'error',
        message: `domain.yml parse error: ${error.message}`,
        path: DOMAIN_FILE,
      });
      return toResult(findings);
    }
    throw error;
  }

  if (!isPlainObject(parsed)) {
    findings.push({
      level: 'error',
      message: 'domain.yml must be a YAML mapping',
      path: DOMAIN_FILE,
    });
    return toResult(findings);
  }

  for (const field of REQUIRED_FIELDS) {
    if (parsed[field] === undefined || parsed[field] === null) {
      findings.push({
        level: 'error',
        message: `Missing required field: ${field}`,
        path: `${DOMAIN_FILE}#${field}`,
      });
    }
  }

  const knowledge = parsed['knowledge'];
  if (isPlainObject(knowledge)) {
    for (const [key, value] of Object.entries(knowledge)) {
      if (typeof value !== 'string') continue;
      if (!existsSync(join(knowledgeRoot, value))) {
        findings.push({
          level: 'error',
          message: `Knowledge file not found: ${value}`,
          path: `${DOMAIN_FILE}#knowledge.${key}`,
        });
      }
    }
  }

  return toResult(findings);
}

function toResult(findings: ValidationFinding[]): ValidationResult {
  return { valid: !findings.some((f) => f.level === 'error'), findings };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
