# @commonkads/runner

CLI runner for the [CommonKADS engine](https://github.com/commonkads/engine). Exposes a `runner` binary that runs a PSM-driven knowledge task against a live LLM.

## Usage

```sh
runner --knowledge-root <path> --payload <jsonOrPath> [options]
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--knowledge-root <path>` | Path to a directory containing `domain.yml` | *(required)* |
| `--payload <jsonOrPath>` | JSON string or path to a JSON file with the case data | *(required)* |
| `--provider <name>` | `bedrock` \| `claude` \| `gemini` \| `ollama` \| `openai` \| `groq` | `gemini` |
| `--model <modelId>` | Model ID for the selected provider | `gemini-2.0-flash-lite` |
| `--log-level <level>` | Engine log level: `debug` \| `info` \| `warn` \| `error` | *(off)* |
| `--explain` | Print LLM explanations after the result | |
| `--audit` | Print the audit log after the result, as YAML | |
| `--timings` | Print step timings after the result, as YAML | |
| `--guardrail <name>` | Named guardrail (Bedrock only) | |
| `--region <region>` | AWS region (Bedrock only) | |
| `--api-key <key>` | API key for the provider | *(env var)* |
| `--ollama-base-url <url>` | Ollama server URL | `http://localhost:11434` |

## Depends on

- [`@commonkads/engine`](https://github.com/commonkads/engine)
- [`@commonkads/provider-anthropic`](https://github.com/commonkads/provider-anthropic)
- [`@commonkads/provider-aws`](https://github.com/commonkads/provider-aws)
- [`@commonkads/provider-google`](https://github.com/commonkads/provider-google)
- [`@commonkads/provider-ollama`](https://github.com/commonkads/provider-ollama)
- [`@commonkads/provider-openai`](https://github.com/commonkads/provider-openai)
