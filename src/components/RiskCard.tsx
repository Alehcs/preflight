import { ShieldAlert } from "lucide-react";

export default function RiskCard({
  text,
  mitigation,
}: {
  text: string;
  mitigation: string;
}) {
  return (
    <div className="print-avoid bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <ShieldAlert className="w-4 h-4 text-amber-600" />
      </div>
      <div className="space-y-1.5">
        <p className="text-gray-900 text-sm font-medium leading-snug">{text}</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          <span className="font-medium text-gray-600">Mitigation: </span>
          {mitigation}
        </p>
      </div>
    </div>
  );
}
