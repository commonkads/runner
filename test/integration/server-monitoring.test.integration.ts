import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  SERVER_MONITORING_ROOT,
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
    SERVER_MONITORING_ROOT,
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

describeIntegration('Server health monitoring — Gemini integration', () => {
  it('returns Normal when all metrics are within thresholds', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli(
      baseArgs({
        CpuUsagePercent: 30,
        MemoryUsagePercent: 45,
        DiskUsagePercent: 40,
        DiskIoWaitPercent: 2,
        HttpErrorRatePercent: 0.1,
        HttpP99LatencyMs: 180,
        CpuCores: 4,
        LoadAverage1m: 1.2,
      }),
    );
    assertVerdict(stdout, stderr, code, 'Normal');
  });

  it('returns Warning when CPU and memory exceed warning thresholds', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli(
      baseArgs({
        CpuUsagePercent: 78,
        MemoryUsagePercent: 83,
        DiskUsagePercent: 55,
        DiskIoWaitPercent: 4,
        HttpErrorRatePercent: 0.3,
        HttpP99LatencyMs: 420,
        CpuCores: 4,
        LoadAverage1m: 3.8,
      }),
    );
    assertVerdict(stdout, stderr, code, 'Warning');
  });

  it('returns Breach when CPU, error rate, and latency exceed breach thresholds', { timeout: 60000 }, async () => {
    const { stdout, stderr, code } = await runCli(
      baseArgs({
        CpuUsagePercent: 92,
        MemoryUsagePercent: 70,
        DiskUsagePercent: 60,
        DiskIoWaitPercent: 5,
        HttpErrorRatePercent: 6,
        HttpP99LatencyMs: 1200,
        CpuCores: 4,
        LoadAverage1m: 5.5,
      }),
    );
    assertVerdict(stdout, stderr, code, 'Breach');
  });
});
