import type { PreflightResult, Recommendation } from "@/lib/types";

type Severity = "low" | "medium" | "high";
type EvidenceLevel = "none" | "weak" | "moderate" | "strong";

const SEVERITIES: Severity[] = ["low", "medium", "high"];
const EVIDENCE_LEVELS: EvidenceLevel[] = ["none", "weak", "moderate", "strong"];
const RECOMMENDATIONS: Recommendation[] = [
  "build_now",
  "validate_first",
  "reshape_idea",
];

function clampScore(val: unknown): number {
  const n = typeof val === "number" ? val : Number(val);
  if (!isFinite(n)) return 50;
  return Math.round(Math.max(0, Math.min(100, n)));
}

function normalizeSeverity(val: unknown): Severity {
  return SEVERITIES.includes(val as Severity) ? (val as Severity) : "medium";
}

function normalizeEvidence(val: unknown): EvidenceLevel {
  return EVIDENCE_LEVELS.includes(val as EvidenceLevel)
    ? (val as EvidenceLevel)
    : "weak";
}

function normalizeRecommendation(val: unknown): Recommendation {
  return RECOMMENDATIONS.includes(val as Recommendation)
    ? (val as Recommendation)
    : "validate_first";
}

function ensureString(val: unknown, fallback = ""): string {
  return typeof val === "string" && val.trim() ? val.trim() : fallback;
}

function ensureStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return val.filter((v): v is string => typeof v === "string");
}

export function normalizePreflightResult(raw: unknown): PreflightResult {
  const r = raw as Record<string, unknown>;

  const user = (r.user ?? {}) as Record<string, unknown>;
  const problem = (r.problem ?? {}) as Record<string, unknown>;
  const riskiestAssumption = (r.riskiestAssumption ??
    {}) as Record<string, unknown>;
  const validationExperiment = (r.validationExperiment ??
    {}) as Record<string, unknown>;
  const buildReadiness = (r.buildReadiness ?? {}) as Record<string, unknown>;

  const rawAssumptions = Array.isArray(r.assumptions) ? r.assumptions : [];
  const assumptions = rawAssumptions
    .slice(0, 6)
    .map((a: unknown, i: number) => {
      const assumption = (a ?? {}) as Record<string, unknown>;
      return {
        id: ensureString(assumption.id, `a${i + 1}`),
        text: ensureString(assumption.text, "Assumption text missing."),
        whyItMatters: ensureString(
          assumption.whyItMatters,
          "Why it matters is missing."
        ),
        riskLevel: normalizeSeverity(assumption.riskLevel),
        evidenceLevel: normalizeEvidence(assumption.evidenceLevel),
      };
    });

  while (assumptions.length < 4) {
    assumptions.push({
      id: `a${assumptions.length + 1}`,
      text: "Additional assumption needed.",
      whyItMatters: "More context required.",
      riskLevel: "medium",
      evidenceLevel: "weak",
    });
  }

  const rawRisks = Array.isArray(r.risks) ? r.risks : [];
  const risks = rawRisks.slice(0, 5).map((rk: unknown, i: number) => {
    const risk = (rk ?? {}) as Record<string, unknown>;
    return {
      id: ensureString(risk.id, `r${i + 1}`),
      text: ensureString(risk.text, "Risk text missing."),
      mitigation: ensureString(risk.mitigation, "Mitigation missing."),
    };
  });

  while (risks.length < 3) {
    risks.push({
      id: `r${risks.length + 1}`,
      text: "Additional risk needed.",
      mitigation: "Further analysis required.",
    });
  }

  let interviewQuestions = ensureStringArray(r.interviewQuestions);
  while (interviewQuestions.length < 5) {
    interviewQuestions.push("What problem does this solve for you?");
  }
  interviewQuestions = interviewQuestions.slice(0, 5);

  let nextActions = ensureStringArray(r.nextActions);
  while (nextActions.length < 3) {
    nextActions.push("Define the next validation step.");
  }
  nextActions = nextActions.slice(0, 3);

  return {
    title: ensureString(r.title, "Preflight Check"),
    summary: ensureString(r.summary, "Summary not generated."),
    user: {
      label: ensureString(user.label, "Target user"),
      description: ensureString(user.description, "User description missing."),
    },
    problem: {
      description: ensureString(
        problem.description,
        "Problem description missing."
      ),
      severity: normalizeSeverity(problem.severity),
    },
    currentWorkaround: ensureString(
      r.currentWorkaround,
      "Current workaround not specified."
    ),
    assumptions,
    risks,
    riskiestAssumption: {
      text: ensureString(
        riskiestAssumption.text,
        "Riskiest assumption not identified."
      ),
      reason: ensureString(
        riskiestAssumption.reason,
        "Reason not specified."
      ),
    },
    validationExperiment: {
      title: ensureString(
        validationExperiment.title,
        "Validation Experiment"
      ),
      description: ensureString(
        validationExperiment.description,
        "Description missing."
      ),
      steps: ensureStringArray(validationExperiment.steps),
      successSignal: ensureString(
        validationExperiment.successSignal,
        "Success signal not defined."
      ),
      timeRequired: ensureString(
        validationExperiment.timeRequired,
        "24–48 hours"
      ),
    },
    interviewQuestions,
    nextActions,
    buildReadiness: {
      total: clampScore(buildReadiness.total),
      userClarity: clampScore(buildReadiness.userClarity),
      problemSharpness: clampScore(buildReadiness.problemSharpness),
      evidenceStrength: clampScore(buildReadiness.evidenceStrength),
      validationReadiness: clampScore(buildReadiness.validationReadiness),
      buildFocus: clampScore(buildReadiness.buildFocus),
      recommendation: normalizeRecommendation(buildReadiness.recommendation),
      explanation: ensureString(
        buildReadiness.explanation,
        "Further validation recommended before building."
      ),
    },
  };
}

export function parseAndValidatePreflightResult(raw: string): PreflightResult {
  // Strip accidental code fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("AI response was not a JSON object.");
  }

  return normalizePreflightResult(parsed);
}
