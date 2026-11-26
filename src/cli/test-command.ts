import {
  LocalFileStore,
  FileStoreKnowledgeAdapter,
  RuntimeEngine,
  buildInference,
  consoleWriter,
} from '@commonkads/engine';

import { runTests } from '../testing/test-runner.js';
import type { TestCaseResult } from '../types/test-case-result.js';

export interface TestCommandOptions {
  knowledgeRoot: string;
  provider: string;
  model: string;
  logLevel?: string;
}

export async function testCommand(options: TestCommandOptions): Promise<void> {
  const inferenceConfig = { type: options.provider, model: options.model };
  const inference = buildInference(inferenceConfig);
  const fileStore = new LocalFileStore(options.knowledgeRoot);
  const engine = new RuntimeEngine(new FileStoreKnowledgeAdapter(fileStore), inference);

  const results = await runTests({ knowledgeRoot: options.knowledgeRoot, engine });

  if (results.length === 0) {
    consoleWriter.log(`No test cases found in ${options.knowledgeRoot}/tests/.`);
    return;
  }

  for (const result of results) {
    consoleWriter.log(formatResult(result));
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  consoleWriter.log(`Tests: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    throw new Error('Tests failed');
  }
}

function formatResult(result: TestCaseResult): string {
  if (result.passed) return `[PASS] ${result.description}`;
  if (result.error !== undefined) return `[FAIL] ${result.description}  error: ${result.error}`;
  return `[FAIL] ${result.description}`;
}
