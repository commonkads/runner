import { existsSync, readFileSync } from "node:fs";

import { stringify as stringifyYaml } from "yaml";

import {
  LocalFileStore,
  RuntimeContext,
  RuntimeEngine,
  consoleWriter,
  LevelFilterLogger,
  StreamLogger,
  buildInference,
  loadDomainManifest,
  loadTaskFromManifest,
  type ICatalog,
  type LogLevel,
} from "@commonkads/engine";
import type { BedrockProviderOptions } from "@commonkads/provider-aws";
import type { ClaudeProviderOptions } from "@commonkads/provider-anthropic";
import type { GeminiProviderOptions } from "@commonkads/provider-google";
import type { OllamaProviderOptions } from "@commonkads/provider-ollama";
import type { OpenAIProviderOptions } from "@commonkads/provider-openai";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

type CliProvider =
  "bedrock" | "claude" | "gemini" | "ollama" | "openai" | "groq";

type CliProviderOptions =
  | BedrockProviderOptions
  | ClaudeProviderOptions
  | GeminiProviderOptions
  | OllamaProviderOptions
  | OpenAIProviderOptions;

export interface DomainRunnerOptions {
  knowledgeRoot: string;
  payload: string;
  model?: string;
  provider?: CliProvider;
  guardrail?: string;
  region?: string;
  apiKey?: string;
  authToken?: string;
  thinking?: boolean;
  ollamaBaseUrl?: string;
  baseUrl?: string;
  logLevel?: LogLevel;
  explain?: boolean;
  audit?: boolean;
  timings?: boolean;
}

function toProviderOptions(options: DomainRunnerOptions): CliProviderOptions {
  const type = options.provider ?? "bedrock";
  switch (type) {
    case "claude":
      return {
        type: "claude",
        model: options.model,
        apiKey: options.apiKey,
        authToken: options.authToken,
        thinking: options.thinking,
      };
    case "gemini":
      return {
        type: "gemini",
        model: options.model,
        apiKey: options.apiKey,
        thinking: options.thinking,
      };
    case "ollama":
      return {
        type: "ollama",
        model: options.model,
        baseUrl: options.ollamaBaseUrl,
      };
    case "openai":
      return {
        type: "openai",
        model: options.model,
        apiKey: options.apiKey,
        baseURL: options.baseUrl,
      };
    case "groq":
      return {
        type: "openai",
        model: options.model,
        apiKey: options.apiKey,
        baseURL: GROQ_BASE_URL,
      };
    default:
      return {
        type: "bedrock",
        model: options.model,
        region: options.region,
        guardrail: options.guardrail,
      };
  }
}

function loadPayload(payloadOption: string): unknown {
  const source = existsSync(payloadOption)
    ? readFileSync(payloadOption, "utf-8")
    : payloadOption;
  return JSON.parse(source);
}

export async function runDomain(options: DomainRunnerOptions): Promise<void> {
  const manifest = loadDomainManifest(options.knowledgeRoot);

  if (manifest.name) {
    consoleWriter.log(`## ${manifest.name}\n`);
  }

  const payload = loadPayload(options.payload);
  const task = loadTaskFromManifest(manifest);
  const fileStore = new LocalFileStore(options.knowledgeRoot);
  const inference = buildInference(toProviderOptions(options));

  // Single-domain shim: wraps the file store as ICatalog until the runner
  // gains catalog.yml support (see engine #19).
  const catalog: ICatalog = {
    getTask: async (_id: string) => task,
    getModel: (id: string) => fileStore.readWithVersion(id),
  };

  const logger = options.logLevel
    ? new LevelFilterLogger(new StreamLogger(), options.logLevel)
    : undefined;

  const context = new RuntimeContext({
    catalog,
    logger,
    explain: Boolean(options.explain),
    enableAuditLog: Boolean(options.audit),
    enableTimings: Boolean(options.timings),
  });

  const engine = new RuntimeEngine(inference);
  const result = await engine.execute(task, payload, context);

  consoleWriter.log(JSON.stringify(result, null, 2));

  if (options.explain && Object.keys(context.explanations).length > 0) {
    consoleWriter.log("\n## Explanations\n");
    for (const [step, explanation] of Object.entries(context.explanations)) {
      consoleWriter.log(`**${step}**: ${explanation}`);
    }
  }

  if (options.audit && context.auditLog) {
    consoleWriter.log("\n## Audit Log\n");
    consoleWriter.log(stringifyYaml(context.auditLog));
  }

  if (options.timings && context.timings) {
    consoleWriter.log("\n## Timings\n");
    consoleWriter.log(stringifyYaml(context.timings));
  }
}
