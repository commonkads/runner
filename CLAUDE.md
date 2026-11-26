# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CLI runner for the CommonKADS engine — a `runner` binary that runs a PSM-driven knowledge task
against a live LLM provider. Full purpose: `README.md`.

## Architecture

- `src/domain-runner.ts` — `runDomain(options)` — wires up provider, file store, engine, and
  runs `RuntimeEngine.execute`; prints result as JSON plus optional explain/audit/timings output
- `src/cli/index.ts` — `runner` binary; registers all providers, defines the CLI flags, calls
  `runDomain`

## CLI binary

```sh
runner --knowledge-root <path> --payload <jsonOrPath> --provider ollama --model llama3
```

## Conventions

- `consoleWriter` from `@commonkads/engine` for all CLI output (`no-console` is enforced)
- Integration tests live in `src/**/*.test.integration.ts`; run with `npm run test:integration`

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
