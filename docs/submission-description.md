# Preflight — Hackathon Submission

## What I built

**Preflight** is the pre-shipping checkpoint for AI builders.

You paste a product idea, answer four focused product questions (who is your user, what do they do today instead, what moment hurts most, what would make it worth trying this week), and get a structured build readiness check. The output includes:

- A **Build Readiness Score** (0–100) with five sub-dimensions
- Your **Riskiest Assumption** — the single belief most likely to invalidate the build
- A **24–48h Validation Experiment** with concrete steps, a success signal, and time required
- Supporting context: problem severity, critical assumptions, risks, interview questions, next actions

The check is editable, saveable, and shareable as a clean public artifact.

## Who it's for

Founders, PMs, and solo builders who ship with AI tools — Cursor, Lovable, Bolt, Replit, v0, Claude, or their own code.

The specific problem: AI tools compress build time to hours. That's powerful, but it makes it faster than ever to build the wrong thing. Most validation frameworks are either too slow (full lean canvas) or too soft ("talk to users"). Preflight gives you a 5-minute structure that produces something actionable before line one of code.

## How it works

1. User pastes their idea in plain language
2. They answer 4 product clarification questions
3. A structured prompt sends the input to OpenAI (gpt-4o-mini)
4. The AI returns a validated JSON result (with schema enforcement and a demo fallback)
5. The result is saved to Supabase and rendered as a Preflight Check
6. The user can edit, save, and publish a public share URL

## Tools used

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (Postgres, row-level storage)
- **OpenAI** (gpt-4o-mini via API)
- **Novus.ai** (product analytics, 10 tracked events)
- **Vercel** (deployment)

## What I learned shipping it

The hardest part was the prompt. Getting the AI to return a useful, non-generic riskiest assumption — not just "market risk" or "competition risk" — required multiple iterations. The final prompt forces specificity by grounding the assumption in the user's actual answers.

The second hard part was the fallback strategy. Real hackathon constraints (missing keys, rate limits, cold deploys) meant the demo had to work without any external dependencies. Building demo-mode into every layer from the start saved the demo.

The analytics wrapper taught me something: the right abstraction is a thin layer that says "track this thing" and lets the underlying provider be swapped without touching call sites. That held up.

## Why it matters now

AI coding tools are at peak adoption. The bottleneck has shifted from "can I build this?" to "should I build this, and what am I assuming?" Preflight is the five-minute answer to that question, designed to fit into the moment between "I have an idea" and "I open my editor."
