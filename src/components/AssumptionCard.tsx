type RiskLevel = "high" | "medium" | "low";
type EvidenceLevel = "strong" | "moderate" | "weak" | "none";

const RISK_STYLES: Record<RiskLevel, string> = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

const EVIDENCE_STYLES: Record<EvidenceLevel, string> = {
  strong: "bg-emerald-50 text-emerald-700 border-emerald-100",
  moderate: "bg-blue-50 text-blue-700 border-blue-100",
  weak: "bg-amber-50 text-amber-700 border-amber-100",
  none: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AssumptionCard({
  text,
  whyItMatters,
  riskLevel,
  evidenceLevel,
}: {
  text: string;
  whyItMatters: string;
  riskLevel: RiskLevel;
  evidenceLevel: EvidenceLevel;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <p className="text-gray-900 text-sm font-medium leading-snug">{text}</p>
      <p className="text-gray-500 text-xs leading-relaxed">{whyItMatters}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-mono text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border ${RISK_STYLES[riskLevel]}`}>
          Risk: {riskLevel}
        </span>
        <span className={`font-mono text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md border ${EVIDENCE_STYLES[evidenceLevel]}`}>
          Evidence: {evidenceLevel}
        </span>
      </div>
    </div>
  );
}
