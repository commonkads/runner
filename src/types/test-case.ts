export type TestCase = {
  description: string;
  input: Record<string, unknown>;
  /** Partial match — only specified keys are compared against actual output. */
  expectedOutput?: Record<string, unknown>;
};
