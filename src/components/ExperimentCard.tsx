"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import CopyButton from "./CopyButton";
import EditableSection from "./EditableSection";

export default function ExperimentCard({
  title,
  description,
  steps,
  successSignal,
  timeRequired,
  onChangeDescription,
  onCopy,
}: {
  title: string;
  description: string;
  steps: string[];
  successSignal: string;
  timeRequired: string;
  onChangeDescription?: (val: string) => void;
  onCopy?: () => void;
}) {
  const copyText = [
    `Validation Experiment: ${title}`,
    "",
    description,
    "",
    "Steps:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Success signal: ${successSignal}`,
    `Time required: ${timeRequired}`,
  ].join("\n");

  return (
    <div className="print-avoid bg-white border border-gray-200 border-l-2 border-l-indigo-600 rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-semibold text-indigo-600 uppercase tracking-[0.14em] mb-1.5">
            24–48h Validation Experiment
          </p>
          <h3 className="text-gray-900 font-semibold text-base">{title}</h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mt-1">
            <Clock className="w-3.5 h-3.5" />
            {timeRequired}
          </div>
        </div>
        <span className="print-hidden">
          <CopyButton text={copyText} label="Copy" variant="ghost" onCopy={onCopy} />
        </span>
      </div>

      {onChangeDescription ? (
        <EditableSection value={description} onChange={onChangeDescription} />
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      )}

      <div>
        <p className="font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-2.5">Steps</p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 font-mono text-xs font-semibold text-gray-400 w-4 pt-0.5">
                {i + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-[10px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-0.5">Success signal</p>
          <p className="text-sm text-gray-700">{successSignal}</p>
        </div>
      </div>
    </div>
  );
}
