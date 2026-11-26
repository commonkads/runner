import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, describe, test } from 'node:test';

import { validate } from './validator.js';

const FIXTURE_ROOT = fileURLToPath(new URL('./__fixtures__', import.meta.url));

describe('validate', () => {
  let emptyDir: string;

  before(async () => {
    emptyDir = await mkdtemp(join(tmpdir(), 'strata-validator-empty-'));
  });

  after(async () => {
    await rm(emptyDir, { recursive: true });
  });

  test('returns valid with no findings for a complete domain', () => {
    const result = validate(join(FIXTURE_ROOT, 'valid-domain'));

    assert.equal(result.valid, true);
    assert.equal(result.findings.length, 0);
  });

  test('returns a single error when domain.yml is missing', () => {
    const result = validate(emptyDir);

    assert.equal(result.valid, false);
    assert.equal(result.findings.length, 1);
    assert.match(result.findings[0]?.message ?? '', /domain\.yml not found/);
  });

  test('returns an error for each missing required field', () => {
    const result = validate(join(FIXTURE_ROOT, 'missing-fields'));
    const messages = result.findings.map((f) => f.message);

    assert.equal(result.valid, false);
    assert.ok(messages.some((m) => m.includes('name')));
    assert.ok(messages.some((m) => m.includes('psm')));
    assert.ok(messages.some((m) => m.includes('input')));
  });

  test('returns an error for each knowledge file that is absent', () => {
    const result = validate(join(FIXTURE_ROOT, 'missing-knowledge-file'));

    assert.equal(result.valid, false);
    assert.ok(result.findings.some((f) => f.message.includes('Knowledge file not found')));
  });
});
