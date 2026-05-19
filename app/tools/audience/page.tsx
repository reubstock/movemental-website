import Link from "next/link";
import Eyebrow from "../../components/Eyebrow";

export const metadata = {
  title: "Tools — AUDIENCE | Movementum",
};

const MODES = [
  {
    n: "01",
    title: "Find amplifiers",
    body: "Who on LinkedIn is most likely to share or repost this letter? A curated shortlist by tier with lead angles for each.",
  },
  {
    n: "02",
    title: "Analyze my following",
    body: "Paste or upload connections / followers. Get clusters, personas, and which segments to lead with.",
  },
  {
    n: "03",
    title: "Profile briefs",
    body: "Paste profile URLs or content. Get per-person briefs with lead angles, things to avoid, and confidence levels.",
  },
];

export default function AudiencePage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold tracking-[0.18em] uppercase text-zinc-500 hover:text-brand transition-colors"
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
                aria-hidden
              >
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>
              All tools
            </Link>
          </div>
          <Eyebrow>Tools · AUDIENCE</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            Letter <span className="text-brand">→ People</span>.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl mb-6">
            Three modes for finding the people who can carry a letter into the
            world: amplifiers, segmentation, per-person briefs.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-tint border border-[#a8dcf5] px-3 py-1.5 text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            In development
          </div>
        </div>
      </section>

      {/* THREE MODES */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Three modes</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            What AUDIENCE will do.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {MODES.map((m) => (
              <article
                key={m.n}
                className="bg-white p-6 md:p-7 flex flex-col gap-3 min-h-[200px]"
              >
                <div className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-brand">
                  Mode {m.n}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                  {m.title}
                </h3>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                  {m.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-500 max-w-3xl">
            Want early access? Use the Engage form below — note &ldquo;AUDIENCE&rdquo;
            in the message and we&rsquo;ll spin up the analysis manually
            while the tool finishes baking.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16 md:py-20 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Run MATIC first.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            The letter is the anthem. AUDIENCE finds the people to send it to
            — but until it ships, get the artifact first.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/matic"
              className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
            >
              Open MATIC →
            </Link>
            <Link
              href="/engage#contact"
              className="inline-flex items-center border border-white/25 hover:border-white text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
