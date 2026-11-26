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

## Coding Standards

**Read [`docs/coding-standards.md`](docs/coding-standards.md) before writing or editing any code.** It contains non-negotiable rules covering imports, architecture boundaries, and quality gates that apply to every change.

## Developer Guidance

**Read [`docs/developer-guidance-backend.md`](docs/developer-guidance-backend.md) before running any commands.** It contains the full command reference, TypeScript conventions, when to run each command, and common pitfalls.

## CI Guidance

**Read [`docs/ci-guidance.md`](docs/ci-guidance.md) before writing or modifying any GitHub Actions workflow.** It defines the required Node.js version, action pinning policy, and workflow structure standards.

## Feature Workflow

**Read [`docs/feature-workflow.md`](docs/feature-workflow.md) before starting any non-trivial feature or change.** It defines the phase gate process that must be followed. Skipping or merging phases without explicit user sign-off is not permitted.

## Starting a Feature

When the user describes a new feature or asks you to start one, **immediately read `docs/feature-workflow.md` in full before writing any code, creating any files, or making any design decisions.** Then begin Phase 0 — Pre-flight exactly as the doc describes. Never advance to the next phase without explicit user sign-off. Never skip or merge phases.

If a `/feature` skill is available, the user may invoke it with `/feature <name>` to start the workflow interactively.
