import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const KNOWLEDGE_ROOT = join(
  PACKAGE_ROOT,
  'node_modules/@commonkads/knowledge-examples/knowledge/vital-signs',
);

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

function runCli(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      ['--no-warnings', '--import', 'tsx/esm', 'src/cli/index.ts', ...args],
      { cwd: PACKAGE_ROOT },
    );
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk;
    });
    proc.on('close', (code) => resolve({ stdout, stderr, code: code ?? 1 }));
    proc.on('error', reject);
  });
}

describeIntegration('Vital signs assessment — Gemini integration', () => {
  it('passes a healthy adult reading', { timeout: 60000 }, async () => {
    const { stdout, code } = await runCli([
      '--knowledge-root',
      KNOWLEDGE_ROOT,
      '--payload',
      JSON.stringify({
        PatientType: 'Adult',
        HeartRate: 75,
        BloodPressureSystolic: 120,
        RespiratoryRate: 16,
        OxygenSaturation: 98,
      }),
      '--provider',
      'gemini',
      '--model',
      'gemini-3.1-flash-lite',
      '--api-key',
      apiKey!,
    ]);

    assert.strictEqual(code, 0, `CLI exited with code ${code}`);
    const jsonMatch = stdout.match(/\{[\s\S]*\}/);
    assert.ok(jsonMatch, `Expected JSON in output:\n${stdout}`);
    const result = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    assert.strictEqual(result['verdict'], 'Pass');
  });
});
