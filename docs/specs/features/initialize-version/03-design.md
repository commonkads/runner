# Design — initialize-version

## New files

| File | Purpose |
|------|---------|
| `src/domain-runner.ts` | `runDomain(options)` — builds provider options, loads payload, wires engine, prints result |
| `src/cli/index.ts` | Entry point; registers providers, defines CLI flags, delegates to `runDomain` |
| `package.json` | Package manifest — `private: true`, `bin.runner`, all provider dependencies |
| `tsconfig.json` | TypeScript build config (NodeNext, strict, ES2022) |
| `tsconfig.test.json` | Type-check only config covering test files |
| `eslint.config.mjs` | ESLint config with `no-console` enforced |
| `.npmrc` | Routes `@commonkads` scope to GitHub Package Registry |
| `.github/workflows/ci.yml` | Lint + compile on pull requests to `main` |
| `CLAUDE.md` | Guidance for Claude Code |
| `README.md` | Usage reference |

## Key interfaces

### `DomainRunnerOptions` (`src/domain-runner.ts`)

Flat options bag passed from the CLI layer to `runDomain`. Maps directly to Commander flags.
No domain knowledge lives here — it is purely a data carrier.

### Provider dispatch (`toProviderOptions`)

A local switch on `options.provider` that maps the CLI provider name to the typed options
object expected by `buildInference` from `@commonkads/engine`. Groq is treated as an
OpenAI-compatible provider with a fixed `baseURL`.

## Data flow

```
CLI flags
  → Commander parses → DomainRunnerOptions
  → toProviderOptions → CliProviderOptions
  → buildInference    → IInferenceProvider
  → RuntimeEngine.execute(task, payload, context)
  → JSON.stringify(result) → stdout
  [+ optional explain / audit / timings sections]
```

## Decisions

- **`private: true`** — no `publishConfig`, no release workflow; this is a developer tool, not a
  library
- **All providers registered at startup** — avoids conditional import logic; startup cost is
  negligible for a CLI
- **`yaml` dependency** — used only for audit log and timings output formatting; kept because it
  is already a transitive dependency of `@commonkads/engine`
