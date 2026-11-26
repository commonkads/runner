import { describe, it } from 'node:test';

import {
  HEALTHY_ADULT_PAYLOAD,
  VITAL_SIGNS_ROOT,
  assertVerdictPass,
  runCli,
} from './support/runner.js';

// Set OLLAMA_MODEL to the name of an installed model (e.g. llama3.2) to run this suite.
// Set OLLAMA_BASE_URL to override the default http://localhost:11434.
const model = process.env.OLLAMA_MODEL;
const describeIntegration = model ? describe : describe.skip;

const baseUrl = process.env.OLLAMA_BASE_URL;

describeIntegration('Vital signs assessment — Ollama integration', () => {
  it('passes a healthy adult reading', { timeout: 120000 }, async () => {
    const args = [
      '--knowledge-root',
      VITAL_SIGNS_ROOT,
      '--payload',
      HEALTHY_ADULT_PAYLOAD,
      '--provider',
      'ollama',
      '--model',
      model!,
    ];

    if (baseUrl) {
      args.push('--ollama-base-url', baseUrl);
    }

    const { stdout, stderr, code } = await runCli(args);
    assertVerdictPass(stdout, stderr, code);
  });
});
