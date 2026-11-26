import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  CAR_DIAGNOSIS_ROOT,
  assertVerdict,
  runCli,
} from './support/runner.js';

function resolveApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    return readFileSync(join(homedir(), '.gemini'), 'utf-8').trim();
  } catch {
    return undefined;
  }
}

const apiKey = resolveApiKey();
const describeIntegration = apiKey ? describe : describe.skip;

function baseArgs(payload: unknown): string[] {
  return [
    '--knowledge-root',
    CAR_DIAGNOSIS_ROOT,
    '--payload',
    JSON.stringify(payload),
    '--provider',
    'gemini',
    '--model',
    'gemini-3.1-flash-lite',
    '--api-key',
    apiKey!,
  ];
}

describeIntegration('Car fault diagnosis — Gemini integration', () => {
  it('returns Healthy when no symptoms are reported', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli(baseArgs({ symptoms: [] }));
    assertVerdict(stdout, stderr, code, 'Healthy');
  });

  it('returns Fault for no-crank with dim lights', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli(
      baseArgs({ symptoms: ['NoStart_NoCrank'], lights: 'dim', sound: 'silence' }),
    );
    assertVerdict(stdout, stderr, code, 'Fault');
  });
});
