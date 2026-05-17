import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

type Tool = {
  slug: string;
  href: string;
  step: string;
  name: string;
  subtitle: string;
  description: string;
  available: boolean;
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
    available: true,
  },
  {
    slug: "audience",
    href: "/tools/audience",
    step: "02",
    name: "AUDIENCE",
    subtitle: "Letter → People",
    description:
      "Once you have the letter, find the people. Amplifier shortlist, network segmentation, profile briefs — all from LinkedIn data you paste or upload.",
    available: false,
  },
];

export default function ToolsHub() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Tools</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            Movementum tools,{" "}
            <span className="text-brand">run live.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Each tool encodes one of the methods Movementum uses on every
            engagement. Useful on their own, and the starting point of the
            six-month program.
          </p>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TOOLS.map((t) =>
              t.available ? (
                <Link
                  key={t.slug}
                  href={t.href}
                  className="group block bg-white border border-zinc-200 rounded-lg p-7 md:p-9 transition-colors hover:border-brand"
                >
                  <ToolCardInner tool={t} />
                </Link>
              ) : (
                <Link
                  key={t.slug}
                  href={t.href}
                  className="group block bg-white border border-zinc-200 rounded-lg p-7 md:p-9 transition-colors hover:border-zinc-400"
                >
                  <ToolCardInner tool={t} />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16 md:py-20 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Want to run these tools with the team that built them?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Most engagements run six months and start as soon as the contract
            is signed.
          </p>
          <a
            href="mailto:reubstock@gmail.com"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  );
}

function ToolCardInner({ tool }: { tool: Tool }) {
  return (
    <>
      <div className="flex items-baseline justify-between mb-6">
        <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-brand">
          TOOL {tool.step}
        </div>
        <div
          className={`text-[10px] font-mono font-bold tracking-[0.18em] ${
            tool.available ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {tool.available ? "LIVE" : "SOON"}
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
        {tool.name}
      </h2>
      <div className="mt-1 text-xs md:text-sm font-mono font-bold tracking-[0.16em] uppercase text-brand">
        {tool.subtitle}
      </div>
      <p className="mt-5 text-base md:text-lg text-zinc-600 leading-relaxed">
        {tool.description}
      </p>
      <div className="mt-8 inline-flex items-center gap-2 text-xs font-mono font-bold tracking-[0.18em] text-zinc-900 group-hover:text-brand transition-colors">
        {tool.available ? `OPEN ${tool.name}` : `PREVIEW ${tool.name}`}
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
    </>
  );
}
