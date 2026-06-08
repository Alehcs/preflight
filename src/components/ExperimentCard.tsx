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
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-semibold text-base">{title}</h3>
          <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-medium mt-1">
            <Clock className="w-3.5 h-3.5" />
            {timeRequired}
          </div>
        </div>
        <CopyButton text={copyText} label="Copy" variant="ghost" onCopy={onCopy} />
      </div>

      {onChangeDescription ? (
        <EditableSection value={description} onChange={onChangeDescription} />
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      )}

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Steps</p>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white border border-indigo-100 rounded-xl px-4 py-3 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Success signal</p>
          <p className="text-sm text-gray-700">{successSignal}</p>
        </div>
      </div>
    </div>
  );
}
