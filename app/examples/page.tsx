import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

type Example = {
  slug: string;
  name: string;
  logoSrc: string;
  logoClass: string;
  tag: string;
  headline: string;
  body: string[];
  metric: string;
  metricLabel: string;
};

const EXAMPLES: Example[] = [
  {
    slug: "ted",
    name: "TED",
    logoSrc: "/images/ted.svg",
    logoClass: "h-14 md:h-16",
    tag: "Ideas Platform",
    headline:
      "Built the editorial machine that turned a private speaker series into the world's premier ideas platform.",
    body: [
      "We helped TED define a voice, a cadence, and a publishing surface that could scale beyond the conference itself. The result was an editorial operation that put TED Talks at the center of a new global conversation about ideas.",
      "Same play we run for every client: a category-defining piece of writing, an ongoing publication, and a community organized around the people who carry the story forward.",
    ],
    metric: "Largest grassroots media company in the world",
    metricLabel: "Result",
  },
  {
    slug: "ipg-media-lab",
    name: "IPG Media Lab",
    logoSrc: "/images/ipg.svg",
    logoClass: "h-10 md:h-12",
    tag: "Media Lab",
    headline:
      "Voice, publishing cadence, and audience strategy for IPG&rsquo;s media innovation lab.",
    body: [
      "The Lab needed to operate as a public-facing voice — not a research department buried inside a holding company. We built the editorial program that gave it standing inside the marketing industry: a regular publication, signature point of view, and a clear way for clients to engage.",
      "From there, the Lab became the inbound surface for hundreds of client conversations and a credible authority on what was changing in marketing — at a moment when very little felt stable.",
    ],
    metric: "+$4.8B in client spend",
    metricLabel: "Result",
  },
  {
    slug: "indivisible-no-kings",
    name: "Indivisible · No Kings",
    logoSrc: "/images/no-kings.jpg",
    logoClass: "h-14 md:h-16 rounded-full",
    tag: "Civic Movement",
    headline:
      "Editorial and community infrastructure for one of 2025&rsquo;s fastest-growing civic movements.",
    body: [
      "Indivisible came to us when No Kings was scaling faster than its communications could carry. We helped them isolate the unspoken truth at the core of the movement, write the letter that made it legible, and build the surface that turned millions of readers into participants.",
      "The same five-beat anatomy, the same dual-motion launch. The output looked different — the engine didn&rsquo;t.",
    ],
    metric: "9M activists on the street",
    metricLabel: "Result",
  },
];

export default function ExamplesPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Examples</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            We&rsquo;ve run this play before.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            The same sequence — letter, narrative, community, calendar,
            evaluate, expand — has worked across very different clients.
            What changes is the audience, the language, and the unspoken
            truth at the center.
          </p>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto space-y-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
          {EXAMPLES.map((ex) => (
            <article
              key={ex.slug}
              className="bg-white p-7 md:p-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start"
            >
              <div className="flex flex-col gap-4">
                <div className="h-16 flex items-center">
                  <img
                    src={ex.logoSrc}
                    alt={ex.name}
                    className={`${ex.logoClass} w-auto object-contain`}
                  />
                </div>
                <div>
                  <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-1">
                    {ex.tag}
                  </div>
                  <div className="text-lg font-black text-zinc-900 leading-tight">
                    {ex.name}
                  </div>
                </div>
              </div>
              <div>
                <h2
                  className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight mb-5"
                  dangerouslySetInnerHTML={{ __html: ex.headline }}
                />
                {ex.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg text-zinc-600 leading-relaxed mb-4 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
                <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-5">
                  <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-zinc-400">
                    {ex.metricLabel}
                  </div>
                  <div className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                    {ex.metric}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NOTE */}
      <section className="px-5 md:px-8 py-16 border-b border-zinc-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-zinc-500 leading-relaxed">
            More recent work — including engagements in pharma, AI, and
            virtual worlds — is available on request.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Yours could be the next one.
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Tell us what you&rsquo;re trying to build. We&rsquo;ll tell
            you whether the Open Letter is the right shape for it.
          </p>
          <Link
            href="/engage"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
