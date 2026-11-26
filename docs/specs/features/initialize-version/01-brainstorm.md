# Brainstorm — initialize-version

## Goal

Establish the initial working version of `@commonkads/runner`: a CLI binary that runs a
PSM-driven knowledge task against a live LLM provider.

## Angles considered

**Scope: binary only vs. library + binary**

A binary-only package is simpler, easier to maintain, and matches the actual use case — an
engineer running a knowledge task from the command line. A library + binary adds surface area
(public API, versioning, dependents) without a concrete consumer yet.

**Decision:** binary only, marked `private: true`. No exported API.

**Provider coverage**

Options ranged from a single provider (simpler) to all five available providers (Anthropic,
AWS Bedrock, Google Gemini, Ollama, OpenAI). Since the primary use is testing knowledge bases
against different backends, registering all providers costs little and maximises utility.

**Decision:** register all five providers plus a Groq alias (OpenAI-compatible endpoint).

**Dev tooling**

Whether to use `@commonkads/dev-workflow` from the start, or add it later.

**Decision:** add it on the first commit — the postinstall populates `docs/`, `.claude/skills/`,
and `.claude/agents/`, which are needed for the workflow from day one.
