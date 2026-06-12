# Preflight — Hackathon Submission

## What I built

**Preflight** is the pre-shipping checkpoint for AI builders.

You paste a product idea, answer four focused product questions (who is your user, what do they do today instead, what moment hurts most, what would make it worth trying this week), and get a structured product decision artifact. The output includes:

- A **Preflight Score** (0–100) with five sub-dimensions — it reflects how clearly the idea is framed and how ready it is to validate, **not** whether it will succeed
- Your **Riskiest Assumption** — the single belief most likely to invalidate the build, naming a specific user group and behavior
- A **24–48h Validation Experiment** with concrete steps, a measurable success signal, and time required
- Supporting context: problem severity, falsifiable assumptions, risks, interview questions, next actions

Recommendations are framed as validation readiness — **Ready to test**, **Validate first**, or **Clarify the idea** — never as a verdict on idea quality. The check is editable, saveable, and shareable as a clean public artifact.

## Who it's for

Founders, PMs, and solo builders who ship with AI tools — Cursor, Lovable, Bolt, Replit, v0, Claude, or their own code.

The specific problem: AI tools compress build time to hours. That's powerful, but it makes it faster than ever to build the wrong thing. Most validation frameworks are either too slow (full lean canvas) or too soft ("talk to users"). Preflight gives you a 5-minute structure that produces something actionable before line one of code.

## How it works

1. User pastes their idea in plain language
2. They answer 4 product clarification questions
3. A structured prompt sends the input to DeepSeek (OpenAI-compatible API; OpenAI is also supported)
4. The AI returns a validated JSON result (with schema enforcement and a demo fallback)
5. The result is saved to Supabase and rendered as a Preflight Check
6. The user can edit, save, and publish a public share URL

## Tools used

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (Postgres, row-level storage)
- **DeepSeek** (LLM via OpenAI-compatible API; OpenAI is a drop-in alternative)
- **Novus / Pendo** (product analytics, 10+ tracked events)
- **Vercel** (deployment)

## What I learned shipping it

The hardest part was the prompt. Getting the AI to return a useful, non-generic riskiest assumption — not just "market risk" or "competition risk" — required multiple iterations. The final prompt forces specificity by grounding the assumption in the user's actual answers.

The second hard part was the fallback strategy. Real hackathon constraints (missing keys, rate limits, cold deploys) meant the demo had to work without any external dependencies. Building demo-mode into every layer from the start saved the demo.

The analytics wrapper taught me something: the right abstraction is a thin layer that says "track this thing" and lets the underlying provider be swapped without touching call sites. That held up — Novus (Pendo) auto-instrumented the codebase and the same `trackEvent()` calls now flow straight to the Pendo dashboard.

The biggest framing lesson came from **dogfooding Preflight on Preflight**. Running our own idea through the tool exposed that an early version read like an "idea validator" — a score that implied the idea was good or bad. That contradicts the whole point. We reframed the score as *clarity of framing and validation readiness*, not likelihood of success, and relabeled recommendations to "Ready to test / Validate first / Clarify the idea." The public sample check is that same Preflight-on-Preflight run, which doubles as the clearest explanation of what the product does.

## Why it matters now

AI coding tools are at peak adoption. The bottleneck has shifted from "can I build this?" to "should I build this, and what am I assuming?" Preflight is the five-minute answer to that question, designed to fit into the moment between "I have an idea" and "I open my editor."
