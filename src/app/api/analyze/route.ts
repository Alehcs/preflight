import { generatePreflightResult } from "@/lib/ai/client";
import { mockPreflightResult } from "@/lib/mockPreflight";
import { createServerClient, hasSupabaseServer } from "@/lib/supabase/server";
import type { PreflightResult } from "@/lib/types";

interface AnalyzeInput {
  id: string;
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

async function saveResultToDb(
  id: string,
  answers: AnalyzeInput["clarificationAnswers"],
  result: PreflightResult
): Promise<void> {
  if (!hasSupabaseServer) return;
  const db = createServerClient();
  const { error } = await db
    .from("preflight_checks")
    .update({
      clarification_answers: answers,
      result,
      title: result.title,
    })
    .eq("id", id);

  if (error) {
    console.error("[analyze] Supabase save error:", error.message);
    throw error;
  }
}

export async function POST(request: Request) {
  let body: AnalyzeInput;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { id, rawIdea, targetUserHint, context, clarificationAnswers } = body;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "id is required." }, { status: 400 });
  }
  if (!rawIdea || typeof rawIdea !== "string") {
    return Response.json({ error: "rawIdea is required." }, { status: 400 });
  }
  if (!clarificationAnswers || typeof clarificationAnswers !== "object") {
    return Response.json(
      { error: "clarificationAnswers is required." },
      { status: 400 }
    );
  }

  let result: PreflightResult;
  let usedFallback = false;

  try {
    result = await generatePreflightResult({
      rawIdea,
      targetUserHint,
      context,
      clarificationAnswers,
    });
  } catch (err) {
    console.error("[analyze] AI generation failed:", err);
    result = mockPreflightResult;
    usedFallback = true;
  }

  try {
    await saveResultToDb(id, clarificationAnswers, result);
  } catch {
    // If save fails after a real AI result, still return the result
    // (client will redirect to /check/[id] which may show stale data)
    console.error("[analyze] Failed to persist result to Supabase.");
  }

  return Response.json({ result, usedFallback });
}
