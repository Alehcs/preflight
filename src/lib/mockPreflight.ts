import type { PreflightCheck, PreflightResult } from "./types";

export const mockPreflightResult: PreflightResult = {
  title: "AI Study Roadmap App",
  summary:
    "A tool that helps overwhelmed students turn broad learning goals into a focused weekly study roadmap. The main risk is whether students feel enough pain around planning to use a separate tool consistently.",
  user: {
    label: "Overwhelmed students",
    description:
      "Students who want to learn a subject but feel unsure what to study next, how to prioritize topics, or how to stay consistent.",
  },
  problem: {
    description:
      "Students often have access to too many resources but lack a clear sequence, feedback loop, and realistic weekly plan.",
    severity: "medium",
  },
  currentWorkaround:
    "They search YouTube, ask ChatGPT for a plan, save random resources, or copy roadmaps they rarely follow.",
  assumptions: [
    {
      id: "a1",
      text: "Students feel planning is painful enough to try a dedicated roadmap tool.",
      whyItMatters:
        "If planning is only a minor annoyance, they may continue using ChatGPT or existing notes instead.",
      riskLevel: "high",
      evidenceLevel: "weak",
    },
    {
      id: "a2",
      text: "A weekly roadmap is more useful than a long generic learning path.",
      whyItMatters:
        "The product needs to provide immediate focus, not just another overwhelming plan.",
      riskLevel: "medium",
      evidenceLevel: "weak",
    },
    {
      id: "a3",
      text: "Students will return to update progress after the first generated plan.",
      whyItMatters:
        "Retention depends on the app becoming part of the study routine.",
      riskLevel: "high",
      evidenceLevel: "none",
    },
    {
      id: "a4",
      text: "Students trust AI-generated study sequencing.",
      whyItMatters:
        "If users do not trust the plan, they will treat it as generic advice and ignore it.",
      riskLevel: "medium",
      evidenceLevel: "weak",
    },
  ],
  risks: [
    {
      id: "r1",
      text: "The app becomes a generic roadmap generator.",
      mitigation:
        "Focus on weekly decisions, progress updates, and small next steps instead of massive roadmaps.",
    },
    {
      id: "r2",
      text: "Students generate a plan once and never return.",
      mitigation:
        "Test whether reminders, progress check-ins, or visible streaks create repeat usage.",
    },
    {
      id: "r3",
      text: "The target user is too broad.",
      mitigation:
        "Start with one niche, such as students learning programming or preparing for exams.",
    },
  ],
  riskiestAssumption: {
    text: "Students are willing to use a separate tool, not just ChatGPT, to plan and follow their study roadmap.",
    reason:
      "The product only works if users see enough recurring value to leave their current lightweight workaround.",
  },
  validationExperiment: {
    title: "24-hour roadmap usefulness test",
    description:
      "Create 3 sample weekly roadmaps for one specific student segment and test whether students would use one this week.",
    steps: [
      "Pick one segment, such as students learning Python for the first time.",
      "Interview 5 students and ask how they currently decide what to study next.",
      "Show each student a sample weekly roadmap.",
      "Ask them to rate how likely they are to use it this week from 1 to 5.",
      "Ask what would make the roadmap more trustworthy or useful.",
    ],
    successSignal:
      "At least 3 out of 5 students rate the roadmap 4 or 5 and can name a specific moment this week when they would use it.",
    timeRequired: "24–48 hours",
  },
  interviewQuestions: [
    "When was the last time you felt unsure what to study next?",
    "What did you do in that moment?",
    "What makes a study plan feel useful instead of overwhelming?",
    "Have you ever abandoned a roadmap? Why?",
    "Would you use a weekly AI-generated plan this week? Why or why not?",
  ],
  nextActions: [
    "Choose one student segment instead of targeting all students.",
    "Run the 24-hour roadmap usefulness test.",
    "Build only the smallest version that generates and updates a weekly plan.",
  ],
  buildReadiness: {
    total: 68,
    userClarity: 75,
    problemSharpness: 70,
    evidenceStrength: 35,
    validationReadiness: 85,
    buildFocus: 75,
    recommendation: "validate_first",
    explanation:
      "The idea has a clear direction and a testable user problem, but evidence is still weak. Validate whether students care enough to use a dedicated planning tool before building the full product.",
  },
};

export const mockPreflightCheck: PreflightCheck = {
  id: "demo-check",
  title: "AI Study Roadmap App",
  raw_idea:
    "An AI study roadmap app for students who feel overwhelmed and do not know what to study next.",
  target_user_hint: null,
  context: null,
  clarification_answers: {},
  result: mockPreflightResult,
  is_public: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};
