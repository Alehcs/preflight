import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import ClarifyForm from "@/components/ClarifyForm";
import PageTracker from "@/components/PageTracker";
import { getCheck } from "@/lib/preflightStore";
import { hasSupabase } from "@/lib/supabase/client";

export default async function ClarifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let rawIdea: string | undefined;
  let targetUserHint: string | null = null;
  let context: string | null = null;
  let notFound = false;

  if (id !== "demo-check") {
    if (!hasSupabase) {
      notFound = true;
    } else {
      const check = await getCheck(id);
      if (!check) {
        notFound = true;
      } else {
        rawIdea = check.raw_idea;
        targetUserHint = check.target_user_hint;
        context = check.context;
      }
    }
  }

  if (notFound) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-500 mb-4">Check not found.</p>
          <Link
            href="/new"
            className="text-indigo-600 text-sm font-medium hover:underline"
          >
            Start a new Preflight Check
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <Link
            href="/new"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Link>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-2">
            Step 2 of 2
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Answer 4 questions before the check
          </h1>
          <p className="text-gray-500 leading-relaxed">
            The better the context, the sharper your Preflight Check.
          </p>
        </div>
        <PageTracker eventName="clarification_started" />
        <ClarifyForm
          id={id}
          rawIdea={rawIdea}
          targetUserHint={targetUserHint}
          context={context}
        />
      </div>
    </AppShell>
  );
}
