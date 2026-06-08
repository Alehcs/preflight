# Preflight

**The pre-shipping checkpoint for AI builders.**

Paste a product idea, answer four focused questions, and get a build readiness check with your riskiest assumption and a 24–48h validation experiment — before you start shipping.

---

## Built for

Founders, PMs, and solo builders using Cursor, Lovable, Bolt, Replit, v0, Claude, or their own code. AI makes it fast to build the wrong thing. Preflight helps you find out what you're assuming before you do.

---

## Features

- **Paste your idea** — plain language, any format
- **Answer 4 product questions** — who, workaround, pain moment, minimum value
- **Get a Preflight Check** — AI-generated build readiness score (0–100), riskiest assumption, and a 24–48h validation experiment with concrete steps
- **Edit and save** — refine the generated output
- **Share publicly** — a clean read-only artifact URL for sharing with teammates or advisors
- **Demo mode** — works without Supabase or OpenAI configured

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres) |
| AI | OpenAI (gpt-4o-mini default) |
| Analytics | Novus.ai |
| Deployment | Vercel |

---

## Environment variables

Add the following to your `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | No* | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Supabase anon key |
| `AI_PROVIDER` | No | `openai` or `deepseek` (default: `openai`) |
| `OPENAI_API_KEY` | No* | OpenAI API key |
| `OPENAI_MODEL` | No | Model override (default: `gpt-4o-mini`) |
| `DEEPSEEK_API_KEY` | No* | DeepSeek API key (when `AI_PROVIDER=deepseek`) |
| `DEEPSEEK_MODEL` | No | Model override (default: `deepseek-v4-flash`) |
| `DEEPSEEK_BASE_URL` | No | Base URL override (default: `https://api.deepseek.com`) |
| `NEXT_PUBLIC_NOVUS_API_KEY` | No | Novus.ai (Pendo) analytics key |

*Without these, the app runs in demo-only mode (no persistence, mock AI result).

---

## Supabase setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/` via the Supabase dashboard SQL editor or CLI:
   ```bash
   npx supabase db push
   ```
3. Copy your project URL and anon key into `.env.local`

---

## AI setup

**OpenAI (default)**
1. Get an API key at [platform.openai.com](https://platform.openai.com)
2. Set `OPENAI_API_KEY` in `.env.local` (leave `AI_PROVIDER` unset or set it to `openai`)

**DeepSeek**
1. Get an API key at [platform.deepseek.com](https://platform.deepseek.com)
2. Set `AI_PROVIDER=deepseek` and `DEEPSEEK_API_KEY` in `.env.local`

Without any AI key the app falls back to a built-in demo result — the full UI still works.

---

## Novus setup

Novus (novus.pendo.io) is a Pendo-powered product agent that auto-instruments your codebase.

1. Sign up at [novus.pendo.io](https://novus.pendo.io) and connect this repo
2. Novus scans your code and submits a PR with instrumentation
3. Copy your Pendo subscription API key and set `NEXT_PUBLIC_NOVUS_API_KEY` in `.env.local`
4. On deploy, the Pendo/Novus SDK is injected automatically via `layout.tsx`

Manual `trackEvent()` calls in `src/lib/analytics/novus.ts` forward to `window.pendo.track()` once the SDK loads.

Without the key, analytics calls are silent no-ops in production and logged to `console.debug` in development. The app never crashes due to missing analytics.

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The demo check at `/check/demo-check` works without any configuration.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

The app is safe to deploy without Supabase or OpenAI configured. Demo mode works out of the box.

---

## Known limitations

- Auth is not implemented — all checks are anonymous
- No payments or rate limiting
- Novus analytics requires a Pendo API key from [novus.pendo.io](https://novus.pendo.io) to activate; without it, events are no-ops
- The AI prompt is tuned for product ideas; it may produce generic output for very vague inputs

---

## Hackathon context

Built for the [Novus.ai Hackathon]. Preflight was designed and shipped in a single session using Cursor and Claude Code. It is intentionally scoped — no auth, no payments, no growth loops — just the core pre-shipping workflow.
