import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { parse as parseYaml } from 'yaml';
import {
  RuntimeContext,
  RuntimeEngine,
  loadDomainManifest,
  loadTaskFromManifest,
} from '@commonkads/engine';

import type { TestCase } from '../types/test-case.js';
import type { TestCaseResult } from '../types/test-case-result.js';

export interface RunTestsOptions {
  knowledgeRoot: string;
  engine: RuntimeEngine;
}

export async function runTests(options: RunTestsOptions): Promise<TestCaseResult[]> {
  const { knowledgeRoot, engine } = options;
  const testsDir = join(knowledgeRoot, 'tests');

  let testFiles: string[];
  try {
    const entries = await readdir(testsDir);
    testFiles = entries
      .filter((f) => f.endsWith('.yml'))
      .sort()
      .map((f) => join(testsDir, f));
  } catch {
    return [];
  }

  if (testFiles.length === 0) return [];

  const manifest = loadDomainManifest(knowledgeRoot);
  const task = loadTaskFromManifest(manifest);

  const results: TestCaseResult[] = [];
  for (const filePath of testFiles) {
    const raw = await readFile(filePath, 'utf-8');
    const testCase = parseYaml(raw) as TestCase;
    const context = new RuntimeContext();

    try {
      const actual = await engine.execute<Record<string, unknown>, Record<string, unknown>>(
        task,
        testCase.input,
        context,
      );

      let passed = true;
      if (testCase.expectedOutput !== undefined) {
        for (const [key, expected] of Object.entries(testCase.expectedOutput)) {
          if (JSON.stringify(actual[key]) !== JSON.stringify(expected)) {
            passed = false;
            break;
          }
        }
      }

      results.push({
        description: testCase.description,
        passed,
        actual,
        expected: testCase.expectedOutput,
      });
    } catch (error) {
      results.push({
        description: testCase.description,
        passed: false,
        actual: {},
        expected: testCase.expectedOutput,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
