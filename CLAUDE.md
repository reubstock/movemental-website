# Movementum — Company Site

## What This Is
The Movementum company site. A Next.js (App Router) + Tailwind v4 multipage
site describing what Movementum does — beginning with the "Open Letter"
engagement, then generalized as a process (5 beats, dual-motion distribution,
the 3-step Movementum Formula).

## Source Material
- **Open Letter process**: adapted from the NJ AI Hub Six-Month Engagement
  Proposal (nj-ai-hub-proposal.vercel.app), described here as a general
  offering rather than client-specific work.
- **Bio (Reuben Steiger)**: from page 3 of the Second Life proposal deck
  ("The Proposer" section).
- **Logo**: the Movementum SVG (orange Apollonian disk) from the Second Life
  proposal site.

## Running Locally
```bash
npm install
npm run dev        # http://localhost:3000 (falls back to 3001 if taken)
npm run build      # production build
```

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- TypeScript, React 19
- Deploys as a Next.js app on Vercel

## Design System
- **Brand color**: `--color-brand: #E94B1E` (defined in `app/globals.css`).
  Accents `#FF8B4D` and `#FCD9C4` from the Movementum logo gradient.
- **Type**: Inter (Tailwind default sans). Bold/Black weights for headlines.
- **Logo**: `public/images/movemental.svg` — favicon, nav, hero, footer.
- **Pattern**: white backgrounds alternating with `#fafaf8` (soft) sections,
  closing with a `#0f0f10` dark CTA section.

## File Structure
```
app/
  layout.tsx                — root layout (Nav + Footer wrap children)
  page.tsx                  — Home
  globals.css               — Tailwind + brand tokens
  components/
    Nav.tsx                 — sticky nav, mobile drawer, active-route style
    Footer.tsx              — logo + tagline
    Eyebrow.tsx             — small uppercase orange label
  about-movements/page.tsx  — Open Letter process (5 beats, distribution, formula, outcomes)
  examples/page.tsx         — Case studies: TED, IPG, Indivisible/No Kings
  team/page.tsx             — Reuben Steiger bio (from SL proposal page 3)
  engage/page.tsx           — Contact + engagement structure

public/images/              — logo + proof-point logos + reuben.jpg
```

## Navigation
Primary nav: **About Movements** · **Examples** · **Team** · **Engage**.
The wordmark on the left links to `/`. The "Get in touch" pill on the right
also routes to `/engage`.

## Editing Notes
- Reuben's tagline lives in `app/team/page.tsx` and `app/page.tsx`.
  Currently: "Serial entrepreneur. Metaverse pioneer. Local organizer."
  Source: drawn from prior site copy as a stand-in for the LinkedIn headline
  — swap with the exact LinkedIn line when confirmed.
- Outcome benchmarks in `app/about-movements/page.tsx` are ranges from prior
  campaigns; update only with verifiable new client data.
- Proof points (TED / IPG / Indivisible · No Kings) and their results appear
  on `/team`, `/examples`, and `/` and should stay consistent.
