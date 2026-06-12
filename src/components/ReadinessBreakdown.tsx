const DIMENSIONS = [
  { key: "userClarity", label: "User clarity" },
  { key: "problemSharpness", label: "Problem sharpness" },
  { key: "evidenceStrength", label: "Evidence strength" },
  { key: "validationReadiness", label: "Validation readiness" },
  { key: "buildFocus", label: "Build focus" },
] as const;

type DimensionKey = (typeof DIMENSIONS)[number]["key"];

function barColor(score: number) {
  if (score >= 80) return "bg-green-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export default function ReadinessBreakdown(
  scores: Record<DimensionKey, number>
) {
  return (
    <div className="space-y-3">
      {DIMENSIONS.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-3">
          <span className="text-xs sm:text-sm text-gray-600 w-32 sm:w-44 flex-shrink-0">{label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${barColor(scores[key])}`}
              style={{ width: `${scores[key]}%` }}
            />
          </div>
          <span className="font-mono text-xs font-medium text-gray-700 w-8 text-right tabular-nums">
            {scores[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
