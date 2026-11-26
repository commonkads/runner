# Requirements — initialize-version

## In scope

- A `runner` binary that accepts `--knowledge-root`, `--payload`, `--provider`, `--model`, and
  supporting flags (`--log-level`, `--explain`, `--audit`, `--timings`, `--guardrail`,
  `--region`, `--api-key`, `--auth-token`, `--ollama-base-url`, `--base-url`, `--no-thinking`)
- Support for all five provider families: Anthropic (claude), AWS (bedrock), Google (gemini),
  Ollama, OpenAI; plus Groq as an OpenAI-compatible alias
- Prints the engine result as formatted JSON to stdout
- Optional explain, audit log, and timings output after the result
- `@commonkads/dev-workflow` wired as a devDependency so workflow docs and skills are
  populated on `npm install`
- CI workflow (lint + compile on pull requests to `main`)
- SSH remote (`git@github-commonkads`) for pushes

## Out of scope

- Published package / release workflow (private binary, not a library)
- Test cases — integration tests are deferred to a later feature once a real knowledge base
  is available to run against
- Validate or test subcommands
- Any write-capable store or authoring utilities
