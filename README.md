# @commonkads/runner

Knowledge authoring and test-runner tools for CommonKADS domains.

## Purpose

Provides capabilities for knowledge engineers to author, validate, and test the knowledge bases
that drive CommonKADS PSM templates. Key capabilities:

- **Knowledge file authoring** — create and edit domain manifests (`domain.yml`) and knowledge
  documents loaded at runtime by the engine
- **Validation** — check that `domain.yml` is well-formed and all referenced knowledge files exist
- **Test case execution** — define test cases in YAML, run them against a live LLM provider, and
  verify that the engine produces expected outputs

## Depends on

- [`@commonkads/engine`](https://github.com/commonkads/engine) — the PSM runtime that executes
  knowledge tasks

## CLI binary

```sh
runner validate --knowledge-root <path>
runner test --knowledge-root <path> --provider ollama --model llama3
```

## Status

Placeholder — not yet implemented.
