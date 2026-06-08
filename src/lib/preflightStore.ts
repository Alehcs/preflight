import { supabase } from "./supabase/client";
import { mockPreflightResult } from "./mockPreflight";
import type { PreflightCheck, PreflightResult } from "./types";

function assertSupabase(): NonNullable<typeof supabase> {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

export async function createDraftCheck(input: {
  rawIdea: string;
  targetUserHint?: string;
  context?: string;
}): Promise<PreflightCheck> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .insert({
      raw_idea: input.rawIdea,
      target_user_hint: input.targetUserHint ?? null,
      context: input.context ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PreflightCheck;
}

export async function getCheck(id: string): Promise<PreflightCheck | null> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as PreflightCheck;
}

export async function saveClarificationAnswers(
  id: string,
  answers: Record<string, string>
): Promise<PreflightCheck> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .update({ clarification_answers: answers })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PreflightCheck;
}

export async function saveMockResult(id: string): Promise<PreflightCheck> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .update({
      result: mockPreflightResult,
      title: mockPreflightResult.title,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PreflightCheck;
}

export async function updateCheckResult(
  id: string,
  result: PreflightResult
): Promise<PreflightCheck> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .update({ result })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PreflightCheck;
}

export async function publishCheck(id: string): Promise<PreflightCheck> {
  const db = assertSupabase();
  const { data, error } = await db
    .from("preflight_checks")
    .update({ is_public: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PreflightCheck;
}
