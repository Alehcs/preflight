"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/novus";

const TOOLS = [
  "Cursor",
  "Lovable",
  "Bolt",
  "Replit",
  "v0",
  "Claude",
  "their own code",
];

export default function LandingHero() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <div className="pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          The pre-shipping checkpoint for AI builders
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-5">
          Before you build it,{" "}
          <span className="text-indigo-600">see what you&apos;re assuming.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          Paste an idea, answer four product questions, and get a build readiness
          check with your riskiest assumption and a 24–48h validation experiment.
        </p>

        {/* Tool row */}
        <p className="text-xs text-gray-400 font-medium mb-2">
          Built for people shipping with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-10">
          {TOOLS.map((tool, i) => (
            <span key={tool} className="text-sm text-gray-500">
              {tool}
              {i < TOOLS.length - 1 && (
                <span className="text-gray-300 ml-3">·</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/new"
            onClick={() => trackEvent("preflight_started", { source: "hero_cta" })}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-base w-full sm:w-auto justify-center"
          >
            Start a Preflight Check
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/check/demo-check"
            onClick={() => trackEvent("sample_check_viewed", { source: "hero_link" })}
            className="inline-flex items-center gap-2 text-gray-600 font-medium px-5 py-3.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            See a sample check →
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Preflight does not validate your idea. It shows what you need to validate before building.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
        {[
          {
            step: "1",
            label: "Paste your product idea",
            sub: "Describe what you're about to build in plain language.",
          },
          {
            step: "2",
            label: "Answer 4 product questions",
            sub: "Who's it for, what do they do today, what moment hurts most.",
          },
          {
            step: "3",
            label: "Get your Preflight Check",
            sub: "A score, your riskiest assumption, and a 24–48h experiment to run.",
          },
        ].map(({ step, label, sub }) => (
          <div key={step} className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {step}
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm mb-1">{label}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Card */}
      <div className="mb-16">
        <p className="text-xs text-gray-400 uppercase tracking-widest text-center font-medium mb-5">
          Sample Preflight Check output
        </p>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-xl mx-auto">
          {/* Score header */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-3">
              Build Readiness Score
            </p>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-amber-500">68</span>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: "68%" }} />
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-lg w-fit">
                  <CheckCircle className="w-3 h-3" />
                  Validate first
                </div>
              </div>
            </div>
          </div>
          {/* Riskiest Assumption */}
          <div className="px-6 py-4 bg-red-50 border-b border-red-100">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">
                Riskiest Assumption
              </p>
            </div>
            <p className="text-sm text-gray-800 leading-snug">
              Students are willing to use a separate tool — not just ChatGPT — to plan and follow their study roadmap.
            </p>
          </div>
          {/* Experiment */}
          <div className="px-6 py-4 bg-indigo-50">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
                24–48h Validation Experiment
              </p>
            </div>
            <p className="text-sm text-gray-800 leading-snug">
              Interview 5 students, show them a sample weekly roadmap, and ask if they&apos;d use it this week.
            </p>
          </div>
        </div>
      </div>

      {/* Not an idea validator */}
      <div className="mb-20 max-w-xl mx-auto text-center bg-gray-50 border border-gray-200 rounded-2xl px-8 py-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Not an idea validator.
        </p>
        <p className="text-gray-700 text-base leading-relaxed">
          Preflight will not tell you your idea is good or bad.{" "}
          <span className="font-semibold text-gray-900">
            It shows what still needs evidence before you build.
          </span>
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/new"
            onClick={() => trackEvent("preflight_started", { source: "bottom_cta" })}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm shadow-sm"
          >
            Run your Preflight Check
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/share/demo-check"
            onClick={() => trackEvent("sample_check_viewed", { source: "bottom_link" })}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            See a public example →
          </Link>
        </div>
      </div>
    </div>
  );
}
