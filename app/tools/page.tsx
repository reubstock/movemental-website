import Link from "next/link";

export const metadata = {
  title: "Tools | Movementum",
};

type Tool = {
  slug: string;
  href: string;
  step: string;
  name: string;
  subtitle: string;
  description: string;
  // Gradient background wash for the card
  bgClass: string;
  // Color used for the step label, hover border, subtitle, and arrow
  tintHex: string;
  available: boolean;
  newTab?: boolean;
};

const TOOLS: Tool[] = [
  {
    slug: "matic",
    href: "/matic",
    step: "01",
    name: "MATIC",
    subtitle: "Inputs → Letter",
    description:
      "Four questions plus an industry. One short Open Letter. Under ninety seconds. The first deliverable on every Movementum engagement.",
    bgClass: "from-tint-peach/70 via-tint-peach/25 to-transparent",
    tintHex: "#ec7c5c",
    available: true,
  },
  {
    slug: "network",
    href: "/tools/network",
    step: "02",
    name: "CARTOGRAPHER",
    subtitle: "Connections → Warm Targets",
    description:
      "Drop your LinkedIn connections export. See where your network is dense, find companies where you already know someone, and match against any target list. Local-only.",
    bgClass: "from-tint-sage/70 via-tint-sage/25 to-transparent",
    tintHex: "#5e8463",
    available: true,
    newTab: true,
  },
  {
    slug: "audience",
    href: "/tools/audience",
    step: "03",
    name: "AUDIENCE",
    subtitle: "Letter → People",
    description:
      "Once you have the letter, find the people. Amplifier shortlist, network segmentation, profile briefs — generated from LinkedIn data you paste or upload.",
    bgClass: "from-tint-butter/70 via-tint-butter/25 to-transparent",
    tintHex: "#ab8a30",
    available: true,
    newTab: true,
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

export default function ToolsHub() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <Eyebrow>Tools</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl md:text-6xl">
            <span className="gradient-text">Movementum tools</span>, run live.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground-muted sm:text-xl">
            Each tool encodes one of the methods Movementum uses on every
            engagement. They&rsquo;re the same workflows we&rsquo;d run with a
            client in the working sessions — useful on their own, and the
            starting point of the six-month program.
          </p>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={t.href}
              {...(t.newTab
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              style={
                {
                  "--card-tint": t.tintHex,
                } as React.CSSProperties
              }
              className={`group relative overflow-hidden rounded-3xl border border-border-default bg-white bg-gradient-to-br ${t.bgClass} p-8 transition-all hover:shadow-lg hover:shadow-navy/5`}
              onMouseEnter={undefined}
            >
              {/* Hover border color via inline var so each card gets its own */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  boxShadow: `inset 0 0 0 1.5px var(--card-tint)`,
                }}
              />
              <div className="relative flex items-baseline justify-between">
                <span
                  className="font-mono text-xs font-medium"
                  style={{ color: t.tintHex }}
                >
                  TOOL {t.step}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                  {t.available ? "Live" : "Soon"}
                </span>
              </div>
              <h2 className="relative mt-6 text-4xl font-semibold tracking-tight text-navy">
                {t.name}
              </h2>
              <div
                className="relative mt-1 text-sm font-medium uppercase tracking-wider"
                style={{ color: t.tintHex }}
              >
                {t.subtitle}
              </div>
              <p className="relative mt-5 text-base leading-7 text-foreground-muted">
                {t.description}
              </p>
              <div
                className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy transition-colors"
                style={{ color: undefined }}
              >
                Open {t.name}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
