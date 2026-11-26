import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  HEALTHY_ADULT_PAYLOAD,
  VITAL_SIGNS_ROOT,
  assertVerdictPass,
  runCli,
} from './support/runner.js';

function resolveApiKey(): string | undefined {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    return readFileSync(join(homedir(), '.anthropic'), 'utf-8').trim();
  } catch {
    return undefined;
  }
}

const apiKey = resolveApiKey();
const describeIntegration = apiKey ? describe : describe.skip;

describeIntegration('Vital signs assessment — Anthropic integration', () => {
  it('passes a healthy adult reading', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli([
      '--knowledge-root',
      VITAL_SIGNS_ROOT,
      '--payload',
      HEALTHY_ADULT_PAYLOAD,
      '--provider',
      'claude',
      '--model',
      'claude-haiku-5-5',
      '--api-key',
      apiKey!,
    ]);

    assertVerdictPass(stdout, stderr, code);
  });
});
