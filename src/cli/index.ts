#!/usr/bin/env node
import { Command } from 'commander';

import { validateCommand } from './validate-command.js';
import { testCommand } from './test-command.js';

const program = new Command();

program.name('runner').description('Knowledge authoring and test-runner tools for CommonKADS domains');

program
  .command('validate')
  .description('Validate domain.yml and all referenced knowledge files')
  .requiredOption('--knowledge-root <path>', 'Path to a directory containing domain.yml')
  .action((options: { knowledgeRoot: string }) => {
    try {
      validateCommand(options.knowledgeRoot);
    } catch (err) {
      program.error(err instanceof Error ? err.message : String(err));
    }
  });

program
  .command('test')
  .description('Run test cases in <knowledge-root>/tests/ against the domain')
  .requiredOption('--knowledge-root <path>', 'Path to a directory containing domain.yml')
  .requiredOption('--provider <name>', 'LLM provider type (e.g. ollama, bedrock, claude, gemini)')
  .requiredOption('--model <id>', 'Model ID for the selected provider')
  .option('--log-level <level>', 'Engine log level (debug|info|warn|error)')
  .action(
    async (options: {
      knowledgeRoot: string;
      provider: string;
      model: string;
      logLevel?: string;
    }) => {
      try {
        await testCommand(options);
      } catch (err) {
        program.error(err instanceof Error ? err.message : String(err));
      }
    },
  );

await program.parseAsync();
