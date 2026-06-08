"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/novus";

const QUESTIONS = [
  {
    id: "q1",
    label: "Who would use this first?",
    helper:
      "Think about the most specific person who has this problem right now — not the broadest possible audience.",
    placeholder:
      "e.g. Junior developers who just joined a startup and are overwhelmed by the issue backlog...",
  },
  {
    id: "q2",
    label: "What do they do today instead?",
    helper:
      "What tools, habits, or workarounds do they use now? This is your real competition.",
    placeholder:
      "e.g. They re-read the issue multiple times, ask a senior dev, or just start coding and hope for the best...",
  },
  {
    id: "q3",
    label: "What painful moment are you solving?",
    helper:
      "Describe the specific moment when the problem hurts most. The more concrete, the sharper your check.",
    placeholder:
      "e.g. Monday morning when they pick a new ticket and spend 30 minutes trying to understand what needs to be built...",
  },
  {
    id: "q4",
    label: "What would make this worth trying this week?",
    helper:
      "What is the minimum thing this product needs to do to make someone use it right now?",
    placeholder:
      "e.g. Generate a clear task breakdown with acceptance criteria in under 60 seconds...",
  },
];

interface ClarifyFormProps {
  id: string;
  rawIdea?: string;
  targetUserHint?: string | null;
  context?: string | null;
}

export default function ClarifyForm({
  id,
  rawIdea,
  targetUserHint,
  context,
}: ClarifyFormProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (id === "demo-check") {
      trackEvent("clarification_completed", { demo: true });
      router.push("/check/demo-check");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          rawIdea: rawIdea ?? "",
          targetUserHint: targetUserHint ?? null,
          context: context ?? null,
          clarificationAnswers: {
            firstUser: answers.q1 ?? "",
            currentWorkaround: answers.q2 ?? "",
            painfulMoment: answers.q3 ?? "",
            worthTrying: answers.q4 ?? "",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ??
            "Generation failed. Please try again."
        );
      }

      trackEvent("clarification_completed");
      trackEvent("check_generated");
      router.push(`/check/${id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {rawIdea && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Your idea
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{rawIdea}</p>
        </div>
      )}

      {QUESTIONS.map(({ id: qid, label, helper, placeholder }, index) => (
        <div key={qid}>
          <label
            className="block text-sm font-semibold text-gray-800 mb-1"
            htmlFor={qid}
          >
            <span className="text-indigo-600 mr-1.5">{index + 1}.</span>
            {label}
          </label>
          <p className="text-xs text-gray-500 mb-2 leading-relaxed">{helper}</p>
          <textarea
            id={qid}
            rows={3}
            value={answers[qid] ?? ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [qid]: e.target.value }))
            }
            placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running your Preflight Check…
            </>
          ) : (
            <>
              Generate Preflight Check
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Answers are optional but improve the quality of your check.
        </p>
      </div>
    </form>
  );
}
