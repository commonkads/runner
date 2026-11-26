import { describe, it } from "node:test";

import {
  HEALTHY_ADULT_PAYLOAD,
  VITAL_SIGNS_ROOT,
  assertVerdictPass,
  hasProviderCredentials,
  runCli,
} from "./support/runner.js";

const describeIntegration = hasProviderCredentials("openai", "OPENAI_API_KEY")
  ? describe
  : describe.skip;

describeIntegration("Vital signs assessment — OpenAI integration", () => {
  it("passes a healthy adult reading", { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli([
      "--knowledge-root",
      VITAL_SIGNS_ROOT,
      "--payload",
      HEALTHY_ADULT_PAYLOAD,
      "--provider",
      "openai",
      "--model",
      "gpt-4o-mini",
    ]);

    assertVerdictPass(stdout, stderr, code);
  });
});
