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
    slug: "second-life",
    name: "Second Life",
    logoSrc: "/images/second-life-logo.png",
    logoClass: "h-14 md:h-16",
    tag: "Virtual World",
    headline:
      "As the Evangelist for a small virtual world platform, helped architect a story machine that allowed residents to tell their stories as a narrative that attracted millions.",
    body: [
      "Second Life was the first true mass-market virtual world — and the first to answer the question every new platform now faces: how do you make a strange new place feel inevitable? The answer was editorial.",
      "We built the architecture that turned residents into protagonists: a live world map, a publication of record, and a press machine that broadcast their stories outward. The playbook Movementum still runs began here.",
    ],
    metric: "Millions of residents at peak",
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

      {/* FROM THE FIELD */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>From the field</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-12 max-w-3xl">
            What the field is saying.
          </h2>

          <article className="bg-white border border-zinc-200 rounded-lg p-7 md:p-10">
            <div className="flex items-center gap-4 mb-7 pb-5 border-b border-zinc-100">
              <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                Financial Services
              </div>
              <span className="text-zinc-300">·</span>
              <img
                src="/images/chime-logo.svg"
                alt="Chime"
                className="h-6 md:h-7 w-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              <img
                src="/images/vineet-mehra.png"
                alt="Vineet Mehra"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-zinc-200 flex-shrink-0"
              />
              <div className="flex-1">
                <blockquote className="text-lg md:text-xl text-zinc-800 leading-relaxed mb-5 italic">
                  &ldquo;If I were running an agency or holding company today
                  (which I am not), I wouldn&rsquo;t be tweaking the old model
                  — I&rsquo;d be throwing out the playbook. We&rsquo;re in
                  the middle of the biggest platform shift our industry has
                  ever seen (AI), and the clients who sit in my seat — CMOs
                  — are already recalibrating what &lsquo;value&rsquo; looks
                  like.&rdquo;
                </blockquote>
                <div className="text-sm font-bold text-zinc-900 mb-5">
                  Vineet Mehra · Chief Growth and Marketing Officer, Chime
                </div>
                <a
                  href="https://www.linkedin.com/posts/vineetmehra1_if-i-were-running-an-agency-or-holding-company-activity-7394411524892676096-B-_V/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-brand text-sm font-extrabold tracking-wide hover:opacity-70"
                >
                  Read the full post on LinkedIn ↗
                </a>
              </div>
            </div>
          </article>

          <p className="mt-10 text-sm md:text-base text-zinc-500 leading-relaxed text-center">
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
            href="/engage#contact"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
