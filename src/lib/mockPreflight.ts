import type { PreflightCheck, PreflightResult } from "./types";

export const mockPreflightResult: PreflightResult = {
  title: "Preflight — a pre-shipping checkpoint for AI builders",
  summary:
    "A checkpoint that helps AI builders surface their riskiest assumption before they build the wrong thing. The central risk is behavioral: builders who can ship in an afternoon may not pause to run a structured check first, even if they agree it's useful.",
  user: {
    label: "Solo AI builders mid-idea",
    description:
      "Founders, PMs, and indie hackers using Cursor, Lovable, Bolt, v0, or Claude who have an idea and are about to start building — the moment between 'I have an idea' and opening their editor.",
  },
  problem: {
    description:
      "AI tools compress build time to hours, so the cost of building the wrong thing has dropped — and so has the discipline to check assumptions first. Builders skip validation because existing frameworks feel slow or academic.",
    severity: "high",
  },
  currentWorkaround:
    "They open Cursor and start building, ask ChatGPT 'is this a good idea?' (and get flattered), or sketch a lean canvas they never revisit.",
  assumptions: [
    {
      id: "a1",
      text: "Solo AI builders will pause to run a 5-minute check instead of opening their editor and building immediately.",
      whyItMatters:
        "Confirmed if a builder mid-idea completes a check before writing code; weakened if they say 'useful' but skip it and build anyway. This is the behavior the whole product depends on.",
      riskLevel: "high",
      evidenceLevel: "weak",
    },
    {
      id: "a2",
      text: "Builders find the riskiest-assumption output sharp enough to change what they do next.",
      whyItMatters:
        "Confirmed if a builder can name a concrete action they changed after reading it; weakened if they call it 'generic' or 'what I already knew'. Generic output makes Preflight feel like a ChatGPT wrapper.",
      riskLevel: "high",
      evidenceLevel: "none",
    },
    {
      id: "a3",
      text: "Builders will run the 24–48h experiment Preflight hands them rather than just reading it.",
      whyItMatters:
        "Confirmed if a builder reports actually running the experiment within two days; weakened if the check is read once and closed. Value only lands if the experiment gets executed.",
      riskLevel: "medium",
      evidenceLevel: "none",
    },
    {
      id: "a4",
      text: "Builders will share a public check with a teammate or advisor to align on what to validate.",
      whyItMatters:
        "Confirmed if public share links get opened by a second person; weakened if checks stay private. Sharing is the main way Preflight spreads without paid growth.",
      riskLevel: "medium",
      evidenceLevel: "none",
    },
  ],
  risks: [
    {
      id: "r1",
      text: "Preflight reads like generic AI prose and feels like a ChatGPT wrapper.",
      mitigation:
        "Force every assumption to name a specific user group, behavior, and the evidence that would confirm or weaken it. Reject vague output like 'users may not want this.'",
    },
    {
      id: "r2",
      text: "Builders treat the score as a verdict on whether the idea is good, then dismiss the tool when they disagree.",
      mitigation:
        "Frame the score as clarity of framing, not likelihood of success, and label recommendations by validation readiness ('Validate first'), not idea quality.",
    },
    {
      id: "r3",
      text: "The check is read once and never acted on.",
      mitigation:
        "Lead with one riskiest assumption and one copy-pasteable 24–48h experiment, so the next action is obvious and small.",
    },
  ],
  riskiestAssumption: {
    text: "Solo AI builders will stop to run a structured check in the moment before building, instead of opening Cursor and building immediately.",
    reason:
      "Everything else in Preflight only matters if builders actually pause to use it. Shipping is faster and more fun than reflecting, so the default behavior works against the product — this is the belief most likely to be wrong and cheapest to test this week.",
  },
  validationExperiment: {
    title: "The mid-idea intercept test",
    description:
      "Catch 8 AI builders at the exact moment they have a new idea and measure how many run a Preflight Check before they write any code.",
    steps: [
      "Find 8 builders actively shipping with AI tools (Cursor/Lovable/Bolt communities, indie hacker Discords).",
      "When one mentions a new idea, send them the Preflight link and ask them to run it before building.",
      "Watch whether each one completes a check before writing code, or builds first.",
      "For everyone who completes it, ask: 'What, if anything, will you do differently now?'",
      "Log the count that ran it pre-build and the count that named a concrete changed action.",
    ],
    successSignal:
      "At least 5 of 8 builders run a check before writing code, and at least 4 of them name a specific action they changed because of it.",
    timeRequired: "24–48 hours",
  },
  interviewQuestions: [
    "Walk me through the last time you had an idea and started building — what happened between the idea and the first line of code?",
    "Did you check anything before building? What, and why that?",
    "When was the last time you built something and realized later it was the wrong thing?",
    "What would have to be true for you to spend 5 minutes before building instead of starting right away?",
    "Who would you send a check like this to before you started?",
  ],
  nextActions: [
    "Run the mid-idea intercept test with 8 builders this week.",
    "Tighten the prompt so the riskiest assumption is never generic — name the user, the behavior, and the evidence.",
    "Instrument the share flow to see whether public checks get opened by a second person.",
  ],
  buildReadiness: {
    total: 71,
    userClarity: 82,
    problemSharpness: 80,
    evidenceStrength: 30,
    validationReadiness: 88,
    buildFocus: 75,
    recommendation: "validate_first",
    explanation:
      "The user and problem are sharply framed and the riskiest assumption is cheap to test, but there's almost no evidence yet that builders will pause to use it. Run the intercept test before investing further in the build.",
  },
};

export const mockPreflightCheck: PreflightCheck = {
  id: "demo-check",
  title: "Preflight — a pre-shipping checkpoint for AI builders",
  raw_idea:
    "A pre-shipping checkpoint that helps AI builders identify risky assumptions before they build the wrong thing.",
  target_user_hint: "Solo builders shipping with Cursor, Lovable, Bolt, v0, or Claude",
  context: null,
  clarification_answers: {},
  result: mockPreflightResult,
  is_public: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};
