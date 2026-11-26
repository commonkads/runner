#!/usr/bin/env node
import { registerAwsProviders } from '@commonkads/provider-aws';
import { registerAnthropicProviders } from '@commonkads/provider-anthropic';
import { registerGoogleProviders } from '@commonkads/provider-google';
import { registerOllamaProviders } from '@commonkads/provider-ollama';
import { registerOpenAIProviders } from '@commonkads/provider-openai';
import { Command, InvalidArgumentError } from 'commander';

import { runDomain } from '../domain-runner.js';
import { DomainManifestError, type LogLevel } from '@commonkads/engine';

registerAwsProviders();
registerAnthropicProviders();
registerGoogleProviders();
registerOllamaProviders();
registerOpenAIProviders();

const LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error'];
const PROVIDERS = ['bedrock', 'claude', 'gemini', 'ollama', 'openai', 'groq'] as const;

function parseLogLevel(value: string): LogLevel {
  if (!LOG_LEVELS.includes(value as LogLevel)) {
    throw new InvalidArgumentError(`Must be one of: ${LOG_LEVELS.join(', ')}`);
  }
  return value as LogLevel;
}

function parseProvider(value: string): (typeof PROVIDERS)[number] {
  if (!PROVIDERS.includes(value as (typeof PROVIDERS)[number])) {
    throw new InvalidArgumentError(`Must be one of: ${PROVIDERS.join(', ')}`);
  }
  return value as (typeof PROVIDERS)[number];
}

const program = new Command();

program
  .name('runner')
  .description('Run a knowledge task against a PSM-driven knowledge base')
  .requiredOption('--knowledge-root <path>', 'Path to a directory containing domain.yml')
  .requiredOption('--payload <jsonOrPath>', 'JSON string or path to a JSON file with the case data')
  .option('--model <modelId>', 'Model ID for the selected provider', 'gemini-2.0-flash-lite')
  .option(
    '--provider <name>',
    'Which LLM provider to run inference against: bedrock|claude|gemini|ollama|openai|groq',
    parseProvider,
    'gemini',
  )
  .option('--guardrail <name>', 'Named guardrail to resolve (Bedrock only)')
  .option('--region <region>', 'AWS region for the Bedrock client (Bedrock only)')
  .option(
    '--api-key <key>',
    'API key for the selected provider (defaults to ANTHROPIC_API_KEY / GOOGLE_API_KEY / OPENAI_API_KEY)',
  )
  .option(
    '--auth-token <token>',
    'OAuth Bearer token for the Claude provider (alternative to --api-key; defaults to ANTHROPIC_AUTH_TOKEN)',
  )
  .option('--ollama-base-url <url>', 'Base URL for the Ollama server (default: http://localhost:11434)')
  .option(
    '--base-url <url>',
    'Base URL override for the OpenAI-compatible provider (openai only; groq sets this automatically)',
  )
  .option('--no-thinking', 'Disable adaptive thinking (Claude/Gemini only)')
  .option(
    '--log-level <level>',
    'Enable engine logging at this level (debug|info|warn|error)',
    parseLogLevel,
  )
  .option('--explain', 'Print LLM explanations after the result')
  .option('--audit', 'Print the audit log after the result, as YAML')
  .option('--timings', 'Print step timings after the result, as YAML')
  .action(async (options) => {
    try {
      await runDomain({ ...options, knowledgeRoot: options.knowledgeRoot });
    } catch (err) {
      if (err instanceof DomainManifestError) {
        program.error(err.message);
      }
      throw err;
    }
  });

await program.parseAsync();
