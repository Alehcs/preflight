const SEGMENTS = 20;

function segmentColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-400";
}

/** Segmented gauge — reads as an instrument readout rather than a loading bar. */
export default function ScoreBar({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const filled = Math.round((score / 100) * SEGMENTS);
  const color = segmentColor(score);
  return (
    <div
      className={`flex gap-[3px] ${className}`}
      role="img"
      aria-label={`Score ${score} out of 100`}
    >
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <span
          key={i}
          className={`h-2 flex-1 rounded-[1px] ${i < filled ? color : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}
