export type TestCaseResult = {
  description: string;
  passed: boolean;
  actual: Record<string, unknown>;
  expected?: Record<string, unknown>;
  /** Populated when execution threw an error. */
  error?: string;
};
