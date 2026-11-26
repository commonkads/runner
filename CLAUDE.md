# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Knowledge authoring and test-runner tools for CommonKADS domains — validation, test case
execution against live LLM providers, and a `runner` binary. Full purpose: `README.md`.

## Architecture

- `src/interfaces/` — `IWritableStore` (extends `IFileStore` with write/delete)
- `src/types/` — `ValidationFinding`, `ValidationResult`, `TestCase`, `TestCaseResult`
- `src/store/` — `LocalWritableStore` (extends `LocalFileStore`)
- `src/validation/` — `validate(knowledgeRoot)` — checks `domain.yml` fields and knowledge file paths
- `src/testing/` — `runTests({ knowledgeRoot, engine })` — loads `tests/*.yml`, runs each via `RuntimeEngine.execute`, compares against `expectedOutput`
- `src/cli/` — `runner` binary; `validate` and `test` subcommands

## CLI binary

```sh
runner validate --knowledge-root <path>
runner test --knowledge-root <path> --provider ollama --model llama3
```

## Conventions

- `consoleWriter` from `@commonkads/engine` for all CLI output (`no-console` is enforced)
- Test cases are YAML files in `<knowledge-root>/tests/*.yml`; `expectedOutput` is a partial match (only specified keys are compared)
