import assert from 'node:assert/strict';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, describe, test } from 'node:test';

import type { RuntimeEngine } from '@commonkads/engine';

import { runTests } from './test-runner.js';

const SIMPLE_DOMAIN_ROOT = fileURLToPath(new URL('./__fixtures__/simple-domain', import.meta.url));

function makeEngine(output: Record<string, unknown>): RuntimeEngine {
  return { execute: async () => output } as unknown as RuntimeEngine;
}

function makeThrowingEngine(message: string): RuntimeEngine {
  return {
    execute: async () => {
      throw new Error(message);
    },
  } as unknown as RuntimeEngine;
}

describe('runTests', () => {
  let domainWithoutTestsRoot: string;

  before(async () => {
    domainWithoutTestsRoot = await mkdtemp(join(tmpdir(), 'runner-test-runner-'));
    await cp(SIMPLE_DOMAIN_ROOT, domainWithoutTestsRoot, { recursive: true });
    await rm(join(domainWithoutTestsRoot, 'tests'), { recursive: true });
  });

  after(async () => {
    await rm(domainWithoutTestsRoot, { recursive: true });
  });

  test('returns an empty array when the tests directory does not exist', async () => {
    const results = await runTests({
      knowledgeRoot: domainWithoutTestsRoot,
      engine: makeEngine({ verdict: 'Pass' }),
    });

    assert.equal(results.length, 0);
  });

  test('returns a result for each test case file', async () => {
    const results = await runTests({
      knowledgeRoot: SIMPLE_DOMAIN_ROOT,
      engine: makeEngine({ verdict: 'Pass' }),
    });

    assert.equal(results.length, 2);
  });

  test('marks a case passed when actual output matches expectedOutput', async () => {
    const results = await runTests({
      knowledgeRoot: SIMPLE_DOMAIN_ROOT,
      engine: makeEngine({ verdict: 'Pass' }),
    });

    assert.equal(results[0]?.passed, true);
  });

  test('marks a case passed when no expectedOutput is declared', async () => {
    const results = await runTests({
      knowledgeRoot: SIMPLE_DOMAIN_ROOT,
      engine: makeEngine({ verdict: 'Pass' }),
    });

    assert.equal(results[1]?.passed, true);
  });

  test('marks a case failed when actual output does not match expectedOutput', async () => {
    const results = await runTests({
      knowledgeRoot: SIMPLE_DOMAIN_ROOT,
      engine: makeEngine({ verdict: 'Fail' }),
    });

    assert.equal(results[0]?.passed, false);
  });

  test('captures the error message when the engine throws', async () => {
    const results = await runTests({
      knowledgeRoot: SIMPLE_DOMAIN_ROOT,
      engine: makeThrowingEngine('oops'),
    });

    assert.equal(results[0]?.error, 'oops');
  });
});
