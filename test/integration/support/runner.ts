import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = fileURLToPath(new URL('../../..', import.meta.url));

const KNOWLEDGE_EXAMPLES = join(
  PACKAGE_ROOT,
  'node_modules/@commonkads/knowledge-examples/knowledge',
);

export const VITAL_SIGNS_ROOT = join(KNOWLEDGE_EXAMPLES, 'vital-signs');
export const CAR_DIAGNOSIS_ROOT = join(KNOWLEDGE_EXAMPLES, 'car-diagnosis');
export const SERVER_MONITORING_ROOT = join(KNOWLEDGE_EXAMPLES, 'server-monitoring');

export const HEALTHY_ADULT_PAYLOAD = JSON.stringify({
  PatientType: 'Adult',
  HeartRate: 75,
  BloodPressureSystolic: 120,
  RespiratoryRate: 16,
  OxygenSaturation: 98,
});

export function runCli(
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

export function assertVerdict(
  stdout: string,
  stderr: string,
  code: number,
  expectedVerdict: string,
): void {
  assert.strictEqual(code, 0, `CLI exited with code ${code}\nstderr: ${stderr}`);
  const jsonMatch = stdout.match(/\{[\s\S]*\}/);
  assert.ok(jsonMatch, `Expected JSON in output:\n${stdout}`);
  const result = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  assert.strictEqual(result['verdict'], expectedVerdict);
}

export function assertVerdictPass(
  stdout: string,
  stderr: string,
  code: number,
): void {
  assertVerdict(stdout, stderr, code, 'Pass');
}
