import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

type Recommendation = "build_now" | "validate_first" | "reshape_idea";

const RECOMMENDATION_CONFIG: Record<
  Recommendation,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  build_now: {
    label: "Build now",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  validate_first: {
    label: "Validate first",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  reshape_idea: {
    label: "Reshape idea",
    color: "text-red-700",
    bg: "bg-red-50",
    icon: <RefreshCw className="w-4 h-4" />,
  },
};

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

export default function ReadinessScore({
  total,
  recommendation,
}: {
  total: number;
  recommendation: Recommendation;
}) {
  const config = RECOMMENDATION_CONFIG[recommendation];
  return (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <p className={`text-5xl font-bold ${scoreColor(total)}`}>{total}</p>
        <p className="text-gray-400 text-sm mt-1">/ 100</p>
      </div>
      <div className="flex-1">
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
          <div
            className={`h-2.5 rounded-full ${barColor(total)} transition-all`}
            style={{ width: `${total}%` }}
          />
        </div>
        <div className={`inline-flex items-center gap-1.5 ${config.bg} ${config.color} text-sm font-semibold px-3 py-1.5 rounded-lg`}>
          {config.icon}
          {config.label}
        </div>
      </div>
    </div>
  );
}
