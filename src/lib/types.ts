export type Recommendation = "build_now" | "validate_first" | "reshape_idea";

export type PreflightResult = {
  title: string;
  summary: string;
  user: {
    label: string;
    description: string;
  };
  problem: {
    description: string;
    severity: "low" | "medium" | "high";
  };
  currentWorkaround: string;
  assumptions: {
    id: string;
    text: string;
    whyItMatters: string;
    riskLevel: "low" | "medium" | "high";
    evidenceLevel: "none" | "weak" | "moderate" | "strong";
  }[];
  risks: {
    id: string;
    text: string;
    mitigation: string;
  }[];
  riskiestAssumption: {
    text: string;
    reason: string;
  };
  validationExperiment: {
    title: string;
    description: string;
    steps: string[];
    successSignal: string;
    timeRequired: string;
  };
  interviewQuestions: string[];
  nextActions: string[];
  buildReadiness: {
    total: number;
    userClarity: number;
    problemSharpness: number;
    evidenceStrength: number;
    validationReadiness: number;
    buildFocus: number;
    recommendation: Recommendation;
    explanation: string;
  };
};

export type PreflightCheck = {
  id: string;
  title: string | null;
  raw_idea: string;
  target_user_hint: string | null;
  context: string | null;
  clarification_answers: Record<string, string>;
  result: PreflightResult | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};
