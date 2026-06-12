"use client";

import Link from "next/link";
import { ArrowRight, AlertTriangle, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics/novus";
import ScoreBar from "@/components/ScoreBar";

const TOOLS = [
  "Cursor",
  "Lovable",
  "Bolt",
  "Replit",
  "v0",
  "Claude",
  "their own code",
];

const STEPS = [
  {
    step: "01",
    label: "Paste your product idea",
    sub: "Describe what you're about to build in plain language.",
  },
  {
    step: "02",
    label: "Answer 4 product questions",
    sub: "Who's it for, what do they do today, what moment hurts most.",
  },
  {
    step: "03",
    label: "Get your Preflight Check",
    sub: "A score, your riskiest assumption, and a 24–48h experiment to run.",
  },
];

export default function LandingHero() {
  return (
    <div className="relative">
      {/* Blueprint dot grid behind the hero, fading out */}
      <div className="absolute inset-x-0 top-0 h-[480px] bg-blueprint pointer-events-none" aria-hidden />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-indigo-700 bg-white/80 border border-indigo-200 px-3.5 py-1.5 rounded-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
            <span className="whitespace-nowrap">Pre-shipping checkpoint</span>
            <span className="hidden sm:inline whitespace-nowrap text-indigo-400">
              · for AI builders
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-5">
            Before you build it,{" "}
            <span className="text-indigo-600">see what you&apos;re assuming.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Paste an idea, answer four product questions, and get a Preflight Check
            with your riskiest assumption and a 24–48h validation experiment.
          </p>

          {/* Tool row */}
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400 mb-2">
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

        {/* How it works — checklist sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          {STEPS.map(({ step, label, sub }) => (
            <div key={step} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-semibold text-indigo-600 tracking-wider">
                  {step}
                </span>
                <span className="flex-1 h-px bg-gray-200" aria-hidden />
              </div>
              <p className="text-gray-900 font-semibold text-sm mb-1">{label}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>

        {/* Preview Card — framed as a sample report document */}
        <div className="mb-16">
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.16em] text-center mb-5">
            Sample Preflight Check output
          </p>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-xl mx-auto">
            {/* Document header */}
            <div className="px-6 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
                Preflight Check
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gray-400">
                PF-SAMPLE
              </span>
            </div>
            {/* Score header */}
            <div className="px-6 pt-5 pb-5 border-b border-gray-100">
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.16em] mb-3">
                Preflight Score
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-4xl font-bold text-amber-500 tabular-nums">71</span>
                <div className="flex-1">
                  <ScoreBar score={71} className="mb-2.5" />
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    Validate first
                  </div>
                </div>
              </div>
            </div>
            {/* Riskiest Assumption */}
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <p className="font-mono text-[10px] font-semibold text-amber-600 uppercase tracking-[0.16em]">
                  Riskiest Assumption
                </p>
              </div>
              <p className="text-sm text-gray-800 leading-snug">
                AI builders will stop to run a structured check instead of opening Cursor and building immediately.
              </p>
            </div>
            {/* Experiment */}
            <div className="px-6 py-4 bg-indigo-50">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <p className="font-mono text-[10px] font-semibold text-indigo-600 uppercase tracking-[0.16em]">
                  24–48h Validation Experiment
                </p>
              </div>
              <p className="text-sm text-gray-800 leading-snug">
                Share Preflight with 10 builders mid-idea; count how many run a check before writing code.
              </p>
            </div>
          </div>
        </div>

        {/* Not an idea validator */}
        <div className="mb-20 max-w-xl mx-auto text-center bg-gray-50 border border-gray-200 rounded-2xl px-8 py-8">
          <p className="font-mono text-[10px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-3">
            Not an idea validator
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
    </div>
  );
}
