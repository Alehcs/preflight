import { CircleHelp, ListChecks, ShieldAlert, Target } from "lucide-react";
import type { PreflightResult } from "@/lib/types";
import AssumptionCard from "./AssumptionCard";
import RiskCard from "./RiskCard";

type EvidenceMapProps = Pick<
  PreflightResult,
  "assumptions" | "risks" | "interviewQuestions" | "nextActions"
>;

function GroupHeader({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-indigo-600">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <span className="font-mono text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded-md px-2 py-0.5">
        {count}
      </span>
    </div>
  );
}

export default function EvidenceMap({
  assumptions,
  risks,
  interviewQuestions,
  nextActions,
}: EvidenceMapProps) {
  return (
    <div className="space-y-4">
      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <GroupHeader
          icon={<Target className="w-4 h-4" />}
          title="Assumptions"
          count={assumptions.length}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assumptions.map((assumption) => (
            <AssumptionCard key={assumption.id} {...assumption} />
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <GroupHeader
          icon={<ShieldAlert className="w-4 h-4" />}
          title="Risks"
          count={risks.length}
        />
        <div className="space-y-3">
          {risks.map((risk) => (
            <RiskCard key={risk.id} {...risk} />
          ))}
        </div>
      </section>

      <section className="print-avoid bg-white border border-gray-200 rounded-2xl p-5">
        <GroupHeader
          icon={<CircleHelp className="w-4 h-4" />}
          title="Questions"
          count={interviewQuestions.length}
        />
        <ol className="space-y-3">
          {interviewQuestions.map((question, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 font-mono text-gray-400 font-semibold w-4 text-xs pt-0.5">
                {index + 1}.
              </span>
              <span className="leading-relaxed">{question}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="print-avoid bg-white border border-gray-200 rounded-2xl p-5">
        <GroupHeader
          icon={<ListChecks className="w-4 h-4" />}
          title="Actions"
          count={nextActions.length}
        />
        <ol className="space-y-3">
          {nextActions.map((action, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 font-mono text-gray-400 font-semibold w-4 text-xs pt-0.5">
                {index + 1}.
              </span>
              <span className="leading-relaxed">{action}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
