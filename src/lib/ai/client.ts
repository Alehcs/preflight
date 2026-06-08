import type { PreflightResult } from "@/lib/types";
import { PREFLIGHT_SYSTEM_PROMPT, buildUserMessage } from "./preflightPrompt";
import { parseAndValidatePreflightResult } from "./validatePreflightResult";

interface GenerateInput {
  rawIdea: string;
  targetUserHint?: string | null;
  context?: string | null;
  clarificationAnswers: {
    firstUser: string;
    currentWorkaround: string;
    painfulMoment: string;
    worthTrying: string;
  };
}

interface ProviderConfig {
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

function resolveProvider(): ProviderConfig {
  const provider = process.env.AI_PROVIDER ?? "openai";

  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured.");
    return {
      label: "DeepSeek",
      baseUrl: process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com",
      apiKey,
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-v4-flash",
    };
  }

  // Default: openai
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  return {
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  };
}

export async function generatePreflightResult(
  input: GenerateInput
): Promise<PreflightResult> {
  const { label, baseUrl, apiKey, model } = resolveProvider();

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: PREFLIGHT_SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(input) },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`[AI] ${label} request failed:`, response.status, body);
    throw new Error(`${label} request failed with status ${response.status}`);
  }

  const data = await response.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "";

  if (!raw) {
    throw new Error(`${label} returned an empty response.`);
  }

  return parseAndValidatePreflightResult(raw);
}
