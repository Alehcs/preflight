import Link from "next/link";
import { Plane, ArrowRight } from "lucide-react";
import CheckPageClient from "./CheckPageClient";
import { getCheck } from "@/lib/preflightStore";
import { mockPreflightCheck } from "@/lib/mockPreflight";
import { hasSupabase } from "@/lib/supabase/client";

function ErrorPage({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-sm text-center px-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-900 mb-8 hover:opacity-80 transition-opacity">
          <Plane className="w-4 h-4 text-indigo-600" strokeWidth={2} />
          <span className="font-semibold tracking-tight">Preflight</span>
        </Link>
        <p className="text-gray-900 font-semibold mb-2">{message}</p>
        {sub && <p className="text-gray-500 text-sm mb-6">{sub}</p>}
        <Link
          href="/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
        >
          Start a Preflight Check
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default async function CheckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "demo-check") {
    return <CheckPageClient id={id} initialCheck={mockPreflightCheck} />;
  }

  if (!hasSupabase) {
    return (
      <ErrorPage
        message="Check not available."
        sub="This check requires a configured database. Try the sample check to see how Preflight works."
      />
    );
  }

  const check = await getCheck(id);

  if (!check) {
    return (
      <ErrorPage
        message="Check not found."
        sub="This Preflight Check does not exist or may have been removed."
      />
    );
  }

  return <CheckPageClient id={id} initialCheck={check} />;
}
