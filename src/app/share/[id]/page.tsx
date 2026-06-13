import Link from "next/link";
import { ArrowRight, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { mockPreflightCheck } from "@/lib/mockPreflight";
import { getCheck } from "@/lib/preflightStore";
import { hasSupabase } from "@/lib/supabase/client";
import EvidenceMap from "@/components/EvidenceMap";
import PageTracker from "@/components/PageTracker";
import ScoreBar from "@/components/ScoreBar";
import BrandLogo from "@/components/BrandLogo";
import type { PreflightCheck } from "@/lib/types";

function scoreColor(score: number) {
  if (score >= 80) return "text-green-700";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

const RECOMMENDATION_CONFIG: Record<string, { label: string; style: string }> = {
  build_now: { label: "Ready to test", style: "bg-green-50 text-green-700 border border-green-200" },
  validate_first: { label: "Validate first", style: "bg-amber-50 text-amber-700 border border-amber-200" },
  reshape_idea: { label: "Clarify the idea", style: "bg-red-50 text-red-700 border border-red-200" },
};

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`font-mono text-[11px] font-semibold uppercase tracking-[0.16em] mb-3 ${light ? "text-indigo-600" : "text-gray-400"}`}>
      {children}
    </p>
  );
}

function formatCheckDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function NotPublicPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-sm text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-900 mb-8 hover:opacity-80 transition-opacity">
          <BrandLogo />
          <span className="font-semibold tracking-tight">Preflight</span>
        </Link>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
        >
          Start a Preflight Check
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function ShareContent({ check }: { check: PreflightCheck }) {
  const result = check.result!;
  const br = result.buildReadiness;
  const rec = RECOMMENDATION_CONFIG[br.recommendation];
  const title = check.title ?? result.title;
  const checkRef = check.id === "demo-check" ? "PF-SAMPLE" : `PF-${check.id.slice(0, 8).toUpperCase()}`;
  const checkDate = formatCheckDate(check.created_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="livery-stripe" aria-hidden />
      <PageTracker eventName="public_check_viewed" properties={{
        checkId: check.id,
        readinessScore: br.total,
        recommendation: br.recommendation,
        checkTitle: title,
      }} />
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
            <BrandLogo />
            <span className="font-semibold tracking-tight">Preflight</span>
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md">
            Public check
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* Decision Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>Decision Summary</SectionLabel>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400 mb-3 whitespace-nowrap">
              {checkRef}
              <span className="hidden sm:inline"> · {checkDate}</span>
            </p>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-tight">{title}</h1>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-4">
            <div className="flex-shrink-0 text-center">
              <p className="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 whitespace-nowrap">Preflight Score</p>
              <p className={`font-mono text-4xl font-bold tabular-nums leading-none ${scoreColor(br.total)}`}>{br.total}</p>
              <p className="font-mono text-gray-400 text-xs mt-0.5">/100</p>
              <span className={`inline-block font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mt-2 border ${rec.style}`}>
                {rec.label}
              </span>
            </div>
            <div className="w-full sm:flex-1 sm:min-w-0 sm:pt-1">
              <ScoreBar score={br.total} className="mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800">Your next move: </span>
                {br.explanation}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            This score reflects how clearly the idea is framed, not whether it will succeed.
          </p>

          <div className="border-t border-gray-100 pt-3">
            <p className="font-mono text-[11px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-1.5">Summary</p>
            <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>

        {/* Riskiest Assumption — amber focused warning, not a red alarm */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="font-mono text-[11px] font-semibold text-amber-600 uppercase tracking-[0.16em]">
              Riskiest Assumption
            </span>
          </div>
          <p className="text-gray-900 text-base font-semibold leading-snug mb-3">
            {result.riskiestAssumption.text}
          </p>
          <p className="text-amber-700 text-sm leading-relaxed">
            <span className="font-semibold">Why it&apos;s the riskiest: </span>
            {result.riskiestAssumption.reason}
          </p>
        </div>

        {/* Validation Experiment */}
        <div className="bg-white border border-gray-200 border-l-2 border-l-indigo-600 rounded-2xl p-6 space-y-4">
          <div>
            <SectionLabel light>24–48h Validation Experiment</SectionLabel>
            <p className="text-gray-900 font-semibold text-base">{result.validationExperiment.title}</p>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-1">
              <Clock className="w-3.5 h-3.5" />
              {result.validationExperiment.timeRequired}
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{result.validationExperiment.description}</p>
          <ol className="space-y-2.5">
            {result.validationExperiment.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 font-mono text-xs font-semibold text-gray-400 w-4 pt-0.5">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-1">Success signal</p>
              <p className="text-sm text-gray-700">{result.validationExperiment.successSignal}</p>
            </div>
          </div>
        </div>

        {/* Evidence Map */}
        <div>
          <SectionLabel>Evidence Map</SectionLabel>
          <p className="text-sm text-gray-500 leading-relaxed mb-4 -mt-1">
            The assumptions to test, risks to manage, questions to ask, and actions to take next.
          </p>
          <EvidenceMap
            assumptions={result.assumptions}
            risks={result.risks}
            interviewQuestions={result.interviewQuestions}
            nextActions={result.nextActions}
          />
        </div>

        {/* CTA */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <p className="text-indigo-200 text-sm mb-2">
            Building something with AI tools?
          </p>
          <h2 className="text-white text-xl font-bold mb-1">
            Run your own Preflight Check
          </h2>
          <p className="text-indigo-300 text-sm mb-6">
            Paste an idea, answer four questions, get your riskiest assumption and a 24–48h experiment.
          </p>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Run your own Preflight Check
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-indigo-400 text-xs mt-4">
            Not an idea validator. A pre-shipping checkpoint.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-gray-400 pb-4">
          {checkRef} · Created with Preflight — the pre-shipping checkpoint for AI builders
        </p>
      </div>
    </div>
  );
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "demo-check") {
    return <ShareContent check={mockPreflightCheck} />;
  }

  if (!hasSupabase) {
    return <NotPublicPage message="This check could not be loaded. Try the sample check to see how Preflight works." />;
  }

  const check = await getCheck(id);

  if (!check) {
    return <NotPublicPage message="Check not found." />;
  }

  if (!check.is_public) {
    return <NotPublicPage message="This Preflight Check is not public yet." />;
  }

  if (!check.result) {
    return <NotPublicPage message="This check has not been generated yet." />;
  }

  return <ShareContent check={check} />;
}
