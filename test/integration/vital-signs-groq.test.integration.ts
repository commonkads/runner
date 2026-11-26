import { describe, it } from "node:test";

import {
  HEALTHY_ADULT_PAYLOAD,
  VITAL_SIGNS_ROOT,
  assertVerdictPass,
  runCli,
} from "./support/runner.js";

// Groq uses the openai provider type with a fixed base URL — no config file.
const describeIntegration = process.env.GROQ_API_KEY ? describe : describe.skip;

describeIntegration("Vital signs assessment — Groq integration", () => {
  it("passes a healthy adult reading", { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli([
      "--knowledge-root",
      VITAL_SIGNS_ROOT,
      "--payload",
      HEALTHY_ADULT_PAYLOAD,
      "--provider",
      "groq",
      "--model",
      "llama-3.1-8b-instant",
    ]);

    assertVerdictPass(stdout, stderr, code);
  });
});
