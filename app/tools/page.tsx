import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

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
  bgClass: string;
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
      "Once you have the letter, find the people. Amplifier shortlist, network segmentation, profile briefs. In development — preview the shape.",
    bgClass: "from-tint-butter/70 via-tint-butter/25 to-transparent",
    tintHex: "#ab8a30",
    available: false,
  },
];

export default function ToolsHub() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-100">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 55% at 85% 10%, rgba(0,182,240,0.08) 0%, transparent 60%), radial-gradient(45% 45% at 5% 90%, rgba(93,208,245,0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative px-5 md:px-8 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <Eyebrow>Tools</Eyebrow>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[16ch]">
              Movementum tools,{" "}
              <span className="text-brand">run live.</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
              Each tool encodes one of the methods Movementum uses on every
              engagement. The same workflows we&rsquo;d run with a client in
              the working sessions — useful on their own, and the starting
              point of the six-month program.
            </p>
          </div>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="px-5 md:px-8 py-12 md:py-16 bg-[#fafaf8] border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                className={`group relative overflow-hidden rounded-lg border border-zinc-200 bg-white bg-gradient-to-br ${t.bgClass} p-7 md:p-8 transition-all hover:shadow-lg hover:shadow-zinc-900/5`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    boxShadow: `inset 0 0 0 1.5px var(--card-tint)`,
                  }}
                />
                <div className="relative flex items-baseline justify-between">
                  <span
                    className="text-[11px] font-mono font-bold tracking-[0.18em]"
                    style={{ color: t.tintHex }}
                  >
                    TOOL {t.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold tracking-[0.18em] ${
                      t.available ? "text-zinc-500" : "text-zinc-400"
                    }`}
                  >
                    {t.available ? "LIVE" : "SOON"}
                  </span>
                </div>
                <h2 className="relative mt-5 text-3xl md:text-4xl font-black tracking-tight text-zinc-900">
                  {t.name}
                </h2>
                <div
                  className="relative mt-1 text-xs md:text-sm font-mono font-bold tracking-[0.16em] uppercase"
                  style={{ color: t.tintHex }}
                >
                  {t.subtitle}
                </div>
                <p className="relative mt-5 text-base md:text-lg text-zinc-600 leading-relaxed">
                  {t.description}
                </p>
                <div className="relative mt-7 inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.18em] uppercase text-zinc-900 transition-colors">
                  {t.available ? `Open ${t.name}` : `Preview ${t.name}`}
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
        </div>
      </section>
    </>
  );
}
