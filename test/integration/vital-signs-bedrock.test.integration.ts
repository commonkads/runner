import { describe, it } from 'node:test';

import {
  HEALTHY_ADULT_PAYLOAD,
  VITAL_SIGNS_ROOT,
  assertVerdictPass,
  runCli,
} from './support/runner.js';

// Bedrock uses AWS SDK credential resolution (env vars, ~/.aws/credentials, IAM role).
// Set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (or AWS_PROFILE) to run this suite.
// Set BEDROCK_MODEL_ID to override the default model.
const hasAwsCreds =
  Boolean(process.env.AWS_ACCESS_KEY_ID) || Boolean(process.env.AWS_PROFILE);
const describeIntegration = hasAwsCreds ? describe : describe.skip;

const model = process.env.BEDROCK_MODEL_ID ?? 'amazon.nova-lite-v1:0';
const region = process.env.AWS_REGION;

describeIntegration('Vital signs assessment — Bedrock integration', () => {
  it('passes a healthy adult reading', { timeout: 60000 }, async () => {
    const args = [
      '--knowledge-root',
      VITAL_SIGNS_ROOT,
      '--payload',
      HEALTHY_ADULT_PAYLOAD,
      '--provider',
      'bedrock',
      '--model',
      model,
    ];

    if (region) {
      args.push('--region', region);
    }

    const { stdout, stderr, code } = await runCli(args);
    assertVerdictPass(stdout, stderr, code);
  });
});
