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
  accent: string;
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
    accent: "from-accent/15 to-transparent",
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
    accent: "from-accent/15 to-transparent",
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
      "Once you have the letter, find the people. Amplifier shortlist, network segmentation, profile briefs — all from LinkedIn data you paste or upload.",
    accent: "from-navy/10 to-transparent",
    available: true,
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
              className={`group relative overflow-hidden rounded-3xl border border-border-default bg-gradient-to-br ${t.accent} bg-white p-8 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-navy/5`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs font-medium text-accent-hover">
                  TOOL {t.step}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                  {t.available ? "Live" : "Soon"}
                </span>
              </div>
              <h2 className="mt-6 text-4xl font-semibold tracking-tight text-navy">
                {t.name}
              </h2>
              <div className="mt-1 text-sm font-medium uppercase tracking-wider text-accent-hover">
                {t.subtitle}
              </div>
              <p className="mt-5 text-base leading-7 text-foreground-muted">
                {t.description}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-accent-hover">
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
