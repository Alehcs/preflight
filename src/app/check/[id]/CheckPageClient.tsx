"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plane,
  Share2,
  AlertTriangle,
  MessageSquare,
  ArrowRight,
  Save,
  Loader2,
  CheckCircle2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import type { PreflightCheck, Recommendation } from "@/lib/types";
import { updateCheckResult, publishCheck } from "@/lib/preflightStore";
import { trackEvent } from "@/lib/analytics/novus";
import ReadinessBreakdown from "@/components/ReadinessBreakdown";
import AssumptionCard from "@/components/AssumptionCard";
import RiskCard from "@/components/RiskCard";
import ExperimentCard from "@/components/ExperimentCard";
import EditableSection from "@/components/EditableSection";
import CopyButton from "@/components/CopyButton";

const REC_CONFIG: Record<
  Recommendation,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  build_now: {
    label: "Build now",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  validate_first: {
    label: "Validate first",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  reshape_idea: {
    label: "Reshape idea",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
  },
};

const SEVERITY_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

type TabId = "assumptions" | "risks" | "questions" | "actions";

const TABS: { id: TabId; label: string }[] = [
  { id: "assumptions", label: "Assumptions" },
  { id: "risks", label: "Risks" },
  { id: "questions", label: "Questions" },
  { id: "actions", label: "Actions" },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-400";
}

function ZoneLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
      {children}
    </p>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

// p-4 by default — compact snapshot cards. Override className for larger cards.
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CheckPageClientProps {
  id: string;
  initialCheck: PreflightCheck;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type ShareStatus = "idle" | "publishing" | "error";

export default function CheckPageClient({ id, initialCheck }: CheckPageClientProps) {
  const router = useRouter();
  const result = initialCheck.result;
  const isDemo = id === "demo-check";

  const [summary, setSummary] = useState(result?.summary ?? "");
  const [workaround, setWorkaround] = useState(result?.currentWorkaround ?? "");
  const [riskiestText, setRiskiestText] = useState(result?.riskiestAssumption.text ?? "");
  const [experimentDescription, setExperimentDescription] = useState(
    result?.validationExperiment.description ?? ""
  );
  const [isPublic, setIsPublic] = useState(initialCheck.is_public);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [shareStatus, setShareStatus] = useState<ShareStatus>("idle");
  const [activeTab, setActiveTab] = useState<TabId>("assumptions");

  const trackedView = useRef(false);
  useEffect(() => {
    if (trackedView.current) return;
    trackedView.current = true;
    if (isDemo) trackEvent("sample_check_viewed");
  }, [isDemo]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-sm text-center px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-900 mb-8">
            <Plane className="w-4 h-4 text-indigo-600" strokeWidth={2} />
            <span className="font-semibold tracking-tight">Preflight</span>
          </Link>
          <p className="text-gray-900 font-semibold mb-2">
            This check has not been generated yet.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Complete the clarification questions to generate your Preflight Check.
          </p>
          <Link
            href={`/clarify/${id}`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            Answer clarification questions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const br = result.buildReadiness;
  const title = initialCheck.title ?? result.title;
  const rec = REC_CONFIG[br.recommendation];

  const experimentCopyText = [
    `Validation Experiment: ${result.validationExperiment.title}`,
    "",
    experimentDescription,
    "",
    "Steps:",
    ...result.validationExperiment.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Success signal: ${result.validationExperiment.successSignal}`,
    `Time required: ${result.validationExperiment.timeRequired}`,
  ].join("\n");

  async function handleSave() {
    if (isDemo) return;
    setSaveStatus("saving");
    try {
      const updatedResult = {
        ...result!,
        summary,
        currentWorkaround: workaround,
        riskiestAssumption: { ...result!.riskiestAssumption, text: riskiestText },
        validationExperiment: { ...result!.validationExperiment, description: experimentDescription },
      };
      await updateCheckResult(id, updatedResult);
      trackEvent("check_saved");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  async function handleShare() {
    if (isDemo) {
      router.push("/share/demo-check");
      return;
    }
    if (isPublic) {
      router.push(`/share/${id}`);
      return;
    }
    setShareStatus("publishing");
    try {
      await publishCheck(id);
      trackEvent("check_published");
      setIsPublic(true);
      setShareStatus("idle");
      router.push(`/share/${id}`);
    } catch {
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-900 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <Plane className="w-4 h-4 text-indigo-600" strokeWidth={2} />
              <span className="font-semibold tracking-tight text-sm">Preflight</span>
            </Link>
            <span className="text-gray-300 hidden sm:block">/</span>
            <p className="text-gray-500 text-sm truncate hidden sm:block">{title}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="hidden sm:block">
              <CopyButton
                text={experimentCopyText}
                label="Copy experiment"
                onCopy={() => trackEvent("experiment_copied")}
              />
            </span>
            <span className="sm:hidden">
              <CopyButton
                text={experimentCopyText}
                label="Copy"
                onCopy={() => trackEvent("experiment_copied")}
              />
            </span>
            {!isDemo && (
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors border ${
                  saveStatus === "saved"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : saveStatus === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {saveStatus === "saving" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saveStatus === "saved" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">
                  {saveStatus === "saving"
                    ? "Saving…"
                    : saveStatus === "saved"
                    ? "Saved"
                    : saveStatus === "error"
                    ? "Error"
                    : "Save"}
                </span>
              </button>
            )}
            <button
              onClick={handleShare}
              disabled={shareStatus === "publishing"}
              className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {shareStatus === "publishing" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {shareStatus === "publishing" ? "Publishing…" : "Share"}
              </span>
            </button>
          </div>
        </div>
        {shareStatus === "error" && (
          <div className="bg-red-50 border-t border-red-100 px-4 py-2 text-center text-xs text-red-700">
            Could not publish. Please try again.
          </div>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ── ZONE 1: DECISION SUMMARY ── */}
        {/*
          Desktop: verdict column (score + badge) left, context column (bar + explanation) right.
          Mobile: single row — score left, badge + bar + explanation right.
          Breakdown sits below as visually secondary detail.
        */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <CardLabel>Decision Summary</CardLabel>
          <div className="flex items-start gap-5">
            {/* Verdict column: score + badge stacked */}
            <div className="flex-shrink-0 text-center">
              <p className={`text-4xl font-bold tabular-nums leading-none ${scoreColor(br.total)}`}>
                {br.total}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">/100</p>
              <div
                className={`inline-flex items-center gap-1 ${rec.bg} ${rec.color} border ${rec.border} text-xs font-semibold px-2.5 py-1 rounded-lg mt-2 whitespace-nowrap`}
              >
                {rec.icon}
                {rec.label}
              </div>
            </div>
            {/* Context column: progress bar + next move */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div
                  className={`h-1.5 rounded-full ${barColor(br.total)} transition-all`}
                  style={{ width: `${br.total}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">Your next move: </span>
                {br.explanation}
              </p>
            </div>
          </div>
          {/* Breakdown — secondary, below the fold of the main verdict */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <ReadinessBreakdown
              userClarity={br.userClarity}
              problemSharpness={br.problemSharpness}
              evidenceStrength={br.evidenceStrength}
              validationReadiness={br.validationReadiness}
              buildFocus={br.buildFocus}
            />
          </div>
        </div>

        {/* ── ZONE 2: VALIDATION FOCUS ── */}
        {/*
          5-column grid: assumption gets 2 cols (40%), experiment gets 3 cols (60%).
          items-start on the grid row prevents equal-height stretching — each card
          sizes to its own content, so a short assumption card won't have empty amber space.
        */}
        <div>
          <ZoneLabel>Validation Focus</ZoneLabel>
          <div className="grid grid-cols-1 md:grid-cols-5 md:items-start gap-4">
            {/* Riskiest Assumption — focused warning, sizes to content */}
            <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                  Highest leverage uncertainty
                </span>
              </div>
              <CardLabel>Riskiest Assumption</CardLabel>
              <EditableSection value={riskiestText} onChange={setRiskiestText} bold />
              <p className="text-amber-700 text-sm leading-relaxed">
                <span className="font-semibold">Why it&apos;s the riskiest: </span>
                {result.riskiestAssumption.reason}
              </p>
            </div>

            {/* Validation Experiment — primary action, naturally taller due to steps */}
            <div className="md:col-span-3">
              <ExperimentCard
                title={result.validationExperiment.title}
                description={experimentDescription}
                steps={result.validationExperiment.steps}
                successSignal={result.validationExperiment.successSignal}
                timeRequired={result.validationExperiment.timeRequired}
                onChangeDescription={setExperimentDescription}
                onCopy={() => trackEvent("experiment_copied")}
              />
            </div>
          </div>
        </div>

        {/* ── ZONE 3: CONTEXT SNAPSHOT ── */}
        <div>
          <ZoneLabel>Context Snapshot</ZoneLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardLabel>Target User</CardLabel>
              <p className="text-sm font-semibold text-gray-900 mb-1">{result.user.label}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.user.description}</p>
            </Card>
            <Card>
              <CardLabel>Problem</CardLabel>
              <p className="text-sm text-gray-700 leading-relaxed mb-2.5">
                {result.problem.description}
              </p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-md border ${SEVERITY_STYLES[result.problem.severity]}`}
              >
                Severity: {result.problem.severity}
              </span>
            </Card>
            <Card>
              <CardLabel>Current Workaround</CardLabel>
              <EditableSection value={workaround} onChange={setWorkaround} />
            </Card>
            <Card>
              <CardLabel>Summary</CardLabel>
              <EditableSection value={summary} onChange={setSummary} />
            </Card>
          </div>
        </div>

        {/* ── ZONE 4: EVIDENCE MAP ── */}
        <div>
          <ZoneLabel>Evidence Map</ZoneLabel>
          {/* Segmented control — active tab gets font-semibold + white bg for stronger contrast */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-sm py-1.5 px-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 font-semibold shadow-sm"
                    : "text-gray-500 font-medium hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "assumptions" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.assumptions.map((a) => (
                <AssumptionCard key={a.id} {...a} />
              ))}
            </div>
          )}

          {activeTab === "risks" && (
            <div className="space-y-3">
              {result.risks.map((r) => (
                <RiskCard key={r.id} {...r} />
              ))}
            </div>
          )}

          {activeTab === "questions" && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-gray-700">Interview Questions</span>
              </div>
              <ol className="space-y-3">
                {result.interviewQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 text-indigo-400 font-semibold w-4 text-xs pt-0.5">
                      {i + 1}.
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {activeTab === "actions" && (
            <Card>
              <ol className="space-y-3">
                {result.nextActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-snug">{action}</p>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 pb-2">
          Preflight does not validate your idea. It shows what you need to validate before building.
        </p>
      </div>
    </div>
  );
}
