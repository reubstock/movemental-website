import Link from "next/link";

export const metadata = {
  title: "Tools — AUDIENCE | Movementum",
};

const MODES = [
  {
    key: "amplifiers",
    label: "Find amplifiers",
    body: "Who on LinkedIn is most likely to share or repost this letter? Curated shortlist.",
  },
  {
    key: "segmentation",
    label: "Analyze my following",
    body: "Paste or upload your connections. Get clusters, personas, and which segments to lead with.",
  },
  {
    key: "profiles",
    label: "Profile briefs",
    body: "Paste profile URLs or content. Get per-person briefs with lead angles and confidence levels.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-hover">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

export default function AudienceStub() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-foreground-subtle hover:text-navy"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>
            All tools
          </Link>
          <div className="mt-3">
            <Eyebrow>Tools · AUDIENCE</Eyebrow>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl md:text-6xl">
            Letter <span className="gradient-text">→ People</span>.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground-muted sm:text-xl">
            Three modes. Find the LinkedIn voices most likely to amplify your
            letter, segment your existing following, or prepare per-person
            briefs for a target list. Paste data or upload a file — no
            LinkedIn login required.
          </p>
        </div>
      </section>

      {/* MODES PREVIEW */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {MODES.map((m, i) => (
            <article
              key={m.key}
              className="rounded-3xl border border-border-default bg-white p-7"
            >
              <span className="font-mono text-xs font-medium text-accent-hover">
                MODE {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy">
                {m.label}
              </h3>
              <p className="mt-3 text-base leading-7 text-foreground-muted">
                {m.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-border-default bg-white p-7 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background-soft px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground-subtle animate-pulse" />
            Status · In development
          </div>
          <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
            We&rsquo;re finishing the working version of AUDIENCE. To run it
            on a specific letter in the meantime, email{" "}
            <a
              href="mailto:reubstock@gmail.com"
              className="font-medium text-accent-hover hover:underline"
            >
              reubstock@gmail.com
            </a>{" "}
            with the draft and we&rsquo;ll do the analysis by hand.
          </p>
        </div>
      </section>

      {/* PAIR WITH MATIC */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
        <div className="overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Pair with MATIC
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              The letter without an audience is just text on a page.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Run MATIC first to write the letter, then run AUDIENCE to find
              the people who can make it travel. Together they collapse the
              first two weeks of a campaign into an afternoon.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/matic"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-navy transition-all hover:bg-white/90"
              >
                Open MATIC
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <a
                href="mailto:reubstock@gmail.com?subject=Movementum%20%E2%80%94%20AUDIENCE"
                className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
