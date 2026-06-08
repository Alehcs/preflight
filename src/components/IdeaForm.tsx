"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lightbulb, Loader2 } from "lucide-react";
import { hasSupabase } from "@/lib/supabase/client";
import { createDraftCheck } from "@/lib/preflightStore";
import { trackEvent } from "@/lib/analytics/novus";

export default function IdeaForm() {
  const router = useRouter();
  const [rawIdea, setRawIdea] = useState("");
  const [targetUserHint, setTargetUserHint] = useState("");
  const [context, setContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!hasSupabase) {
      trackEvent("idea_submitted", {
        demo: true,
        ideaLength: rawIdea.trim().length,
        hasTargetUser: !!targetUserHint.trim(),
        hasContext: !!context.trim(),
      });
      router.push("/clarify/demo-check");
      return;
    }

    setIsSubmitting(true);
    try {
      const check = await createDraftCheck({
        rawIdea,
        targetUserHint: targetUserHint || undefined,
        context: context || undefined,
      });
      trackEvent("idea_submitted", {
        checkId: check.id,
        ideaLength: rawIdea.trim().length,
        hasTargetUser: !!targetUserHint.trim(),
        hasContext: !!context.trim(),
      });
      router.push(`/clarify/${check.id}`);
    } catch {
      setError(
        "We could not save your Preflight Check. Please check your Supabase setup and try again."
      );
      setIsSubmitting(false);
    }
  }

  function useExample() {
    setRawIdea(
      "An AI study roadmap app for students who feel overwhelmed and don't know what to study next. It generates a personalized weekly plan based on their goal, current level, and available time."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="rawIdea">
            Your product idea <span className="text-red-400">*</span>
          </label>
          <button
            type="button"
            onClick={useExample}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            Use an example
          </button>
        </div>
        <textarea
          id="rawIdea"
          required
          rows={6}
          value={rawIdea}
          onChange={(e) => setRawIdea(e.target.value)}
          placeholder="Describe the product you're about to build. What does it do? Who is it for? What problem does it solve?&#10;&#10;e.g. An app that helps junior developers turn messy GitHub issues into clear implementation plans using AI."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none leading-relaxed"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Write as much or as little as you have. A few sentences is enough.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="targetUserHint">
          Who is your target user?{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="targetUserHint"
          type="text"
          value={targetUserHint}
          onChange={(e) => setTargetUserHint(e.target.value)}
          placeholder="e.g. freelance designers, students learning to code, early-stage founders"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="context">
          Anything else worth knowing?{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="context"
          rows={3}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g. I've already spoken to 3 potential users. The market is crowded but I think the differentiation is the weekly focus."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={!rawIdea.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating your check…
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Next: 4 quick product questions to sharpen your check.
        </p>
      </div>
    </form>
  );
}
