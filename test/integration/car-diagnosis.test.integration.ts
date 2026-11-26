import { describe, it } from "node:test";

import {
  CAR_DIAGNOSIS_ROOT,
  assertVerdict,
  hasProviderCredentials,
  runCli,
} from "./support/runner.js";

const describeIntegration = hasProviderCredentials("google", "GEMINI_API_KEY")
  ? describe
  : describe.skip;

function baseArgs(payload: unknown): string[] {
  return [
    "--knowledge-root",
    CAR_DIAGNOSIS_ROOT,
    "--payload",
    JSON.stringify(payload),
    "--provider",
    "gemini",
    "--model",
    "gemini-3.1-flash-lite",
  ];
}

describeIntegration("Car fault diagnosis — Gemini integration", () => {
  it(
    "returns Healthy when no symptoms are reported",
    { timeout: 60000 },
    async () => {
      const { stdout, stderr, code } = await runCli(baseArgs({ symptoms: [] }));
      assertVerdict(stdout, stderr, code, "Healthy");
    },
  );

  it(
    "returns Fault for no-crank with dim lights",
    { timeout: 60000 },
    async () => {
      const { stdout, stderr, code } = await runCli(
        baseArgs({
          symptoms: ["NoStart_NoCrank"],
          lights: "dim",
          sound: "silence",
        }),
      );
      assertVerdict(stdout, stderr, code, "Fault");
    },
  );
});
