import Link from "next/link";
import Eyebrow from "../../components/Eyebrow";

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

export default function AudienceStub() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <Link
              href="/tools"
              className="text-xs font-extrabold tracking-[0.16em] uppercase text-zinc-400 hover:text-brand transition-colors"
            >
              ← Tools
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Eyebrow className="mb-0">AUDIENCE</Eyebrow>
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-zinc-400 border border-zinc-200 rounded-full px-2 py-0.5">
              SOON
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-6 max-w-[18ch]">
            Letter <span className="text-brand">→</span> People.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Once you have the letter, find the people. Amplifier shortlist,
            network segmentation, profile briefs — all from LinkedIn data
            you paste or upload.
          </p>
        </div>
      </section>

      {/* MODES PREVIEW */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>What it does</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            Three modes. One audience system.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODES.map((m, i) => (
              <article
                key={m.key}
                className="bg-white border border-zinc-200 rounded-lg p-6 md:p-7 flex flex-col gap-3"
              >
                <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-brand">
                  MODE {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                  {m.label}
                </h3>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                  {m.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 border border-zinc-200 rounded-lg bg-white p-6 md:p-7">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
              <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-zinc-500">
                STATUS · IN DEVELOPMENT
              </div>
            </div>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              We&rsquo;re finishing the working version of AUDIENCE. To run
              it on a specific letter in the meantime, email{" "}
              <a
                href="mailto:reubstock@gmail.com"
                className="text-brand font-bold hover:underline"
              >
                reubstock@gmail.com
              </a>{" "}
              with the draft and we&rsquo;ll do the analysis by hand.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16 md:py-20 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Try MATIC first</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Start with the letter.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            AUDIENCE needs a letter to operate on. Draft one in MATIC,
            then come back.
          </p>
          <Link
            href="/matic"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Open MATIC →
          </Link>
        </div>
      </section>
    </>
  );
}
