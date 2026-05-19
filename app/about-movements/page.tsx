import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

const STACK = [
  {
    name: "LinkedIn",
    role: "Public launch",
    body: "The Open Letter goes live here first. Decision-makers, journalists, and policymakers are already on it. We optimize for the comment thread as much as the impressions — the early community self-organizes in public.",
  },
  {
    name: "Substack",
    role: "The publication",
    body: "The right home for a story machine in 2026. Native email, threaded commenting, live video, and a subscription model that creates legitimacy. One surface holds the publication, the founding subscriber list, and the recurring video segment.",
  },
  {
    name: "Next.js + Vercel",
    role: "Custom on-ramps",
    body: "For specific campaigns we ship a one-page site — like this one — that puts a single ask in front of a defined audience. Built in days, not weeks. Owned, indexable, fast to iterate.",
  },
  {
    name: "Testing w/ Synthetic Audiences",
    role: "Tone, impact, reach",
    body: "Everything is written by an exceptional team. Results are tested against synthetic audiences for tone, impact, and reach — platform by platform.",
  },
];

const OFFER_PRINCIPLES = [
  {
    n: "01",
    title: "Movement, not marketing",
    body: "The letter sits in the tradition of writing for social change — concerned, hopeful, semi-formal. It ends with a call to join, not a call to buy.",
  },
  {
    n: "02",
    title: "Short by design",
    body: "1.5 pages, maximum. The constraint forces moral clarity. Readers feel the urgency rather than evaluate a product.",
  },
  {
    n: "03",
    title: "Names the danger, then the future",
    body: "It says out loud the thing everyone in a field is thinking but no one will state. The Jerry Maguire moment is what separates a press release from a movement.",
  },
  {
    n: "04",
    title: "One simple, immediate ask",
    body: "Subscribe, comment, share, contact. Each measurable. The most engaged readers self-organize into the early community in the comment thread itself.",
  },
];

const BEATS = [
  {
    label: "Beat 1",
    title: "The Hook",
    body: "Open with the danger. Name what is being lost, concentrated, ignored, or distorted right now. The reader has to feel a stake inside the first paragraph.",
  },
  {
    label: "Beat 2",
    title: "The Diagnosis",
    body: "Explain why the existing players can't fix it. The capital, the talent, and the narrative have organized around the wrong thing — and the field can sense it.",
  },
  {
    label: "Beat 3",
    title: "The Jerry Maguire Moment",
    body: "Say out loud what everyone is already thinking. The first working session focuses entirely on isolating this unspoken truth. Once we have it, the letter writes itself.",
  },
  {
    label: "Beat 4",
    title: "The Future",
    body: "Show what becomes possible — and why this organization, this place, this group of people is the natural one to lead the next chapter. Specifics over slogans.",
  },
  {
    label: "Beat 5",
    title: "The Call",
    body: "One ask, simple and immediate. Subscribe. Comment. Share. Reply. The movement begins the moment readers respond publicly.",
  },
];

const OUTCOMES = [
  { num: "1", label: "Movement", sub: "Category narrative owned by the client" },
  { num: "10k–100k", label: "Impressions", sub: "LinkedIn + amplification" },
  { num: "250–1,000", label: "Inbound leads", sub: "From a single open letter" },
  { num: "6 mo", label: "Time to authority", sub: "From letter to industry stage" },
];

export default function AboutMovementsPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>About Movements</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            It begins with one letter.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Most of our engagements start the same way: a single,
            category-defining{" "}
            <strong className="text-zinc-900">Open Letter</strong>, published
            from a client&rsquo;s leadership, that frames the world they
            want to build. It is short by design — a page and a half — and
            almost always the most consequential thing the organization
            will publish that year.
          </p>
          <p className="text-lg md:text-xl text-zinc-700 leading-snug max-w-3xl mt-5">
            The letter is the anthem.{" "}
            <span className="text-brand font-semibold">
              Everything else amplifies it.
            </span>{" "}
            Once published, it feeds a six-month program that turns a
            single piece of writing into a category, a community, and a
            pipeline.
          </p>
        </div>
      </section>

      {/* OFFER PRINCIPLES */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>The Offer</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-12 max-w-3xl">
            Four principles. Every letter passes them.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {OFFER_PRINCIPLES.map((p) => (
              <div
                key={p.n}
                className="bg-white p-7 flex flex-col gap-3 min-h-[220px]"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {p.n}
                </div>
                <div className="text-xl font-black text-zinc-900 leading-tight">
                  {p.title}
                </div>
                <p className="text-sm md:text-base text-zinc-600 leading-snug">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANATOMY — 5 BEATS */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Anatomy of the Letter</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            Five beats. One movement.
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-12">
            The letter follows a tight rhetorical arc we&rsquo;ve refined
            across dozens of campaigns. Each beat does specific work —
            remove any one and the rest collapses.
          </p>

          <ol className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[7px] sm:left-[95px] top-2 bottom-2 w-px bg-gradient-to-b from-brand/40 to-zinc-200"
            />
            {BEATS.map((b) => (
              <li
                key={b.label}
                className="relative grid grid-cols-[28px_1fr] sm:grid-cols-[110px_1fr] gap-4 sm:gap-7 py-4"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 sm:left-[88px] top-7 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-brand shadow-[0_0_0_4px_white]"
                />
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand pt-6 pl-7 sm:pl-0">
                  {b.label}
                </div>
                <div className="bg-white border border-zinc-200 rounded-md p-6">
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-2 leading-tight">
                    {b.title}
                  </h3>
                  <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

{/* DISTRIBUTION */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>Distribution</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            Private to the few.{" "}
            <span className="text-brand">Public to many.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-12">
            Two motions, run in parallel. One creates legitimacy. The other
            creates volume. Together, they decide whether the letter is
            read as a press release or as a movement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            <article className="bg-white p-7 md:p-8">
              <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-4">
                Private motion
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-3">
                Influencer outreach
              </h3>
              <p className="text-base text-zinc-600 leading-relaxed mb-5">
                Sent privately to a curated group of industry figures
                before the public launch. We ask them to comment publicly,
                share, or offer a short response. These become the
                endorsement signals that shape how the letter is read.
              </p>
              <ul className="border-t border-zinc-100 pt-3">
                {[
                  "Sector executives & operators",
                  "Institutional leaders & academics",
                  "Policymakers & commentators",
                  "Trusted voices with audience overlap",
                ].map((item) => (
                  <li
                    key={item}
                    className="py-2 pl-6 relative text-sm md:text-base text-zinc-700"
                  >
                    <span className="absolute left-0 top-2 text-brand font-black">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="bg-white p-7 md:p-8">
              <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-4">
                Public motion
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-3">
                LinkedIn primary launch
              </h3>
              <p className="text-base text-zinc-600 leading-relaxed mb-5">
                Published from leadership and partner channels. Targeted
                amplification to the audiences who matter — across
                LinkedIn, email, and industry newsletters. Designed to
                perform on the platforms where decision-makers already are.
              </p>
              <ul className="border-t border-zinc-100 pt-3">
                {[
                  "LinkedIn (founder + organization page)",
                  "Email distribution to the existing ecosystem",
                  "Industry & sector newsletters",
                ].map((item) => (
                  <li
                    key={item}
                    className="py-2 pl-6 relative text-sm md:text-base text-zinc-700"
                  >
                    <span className="absolute left-0 top-2 text-brand font-black">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* FORMULA */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>After the Letter — The Movementum Formula</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            Three steps. <span className="text-brand">That&rsquo;s it.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-12">
            The letter establishes the category. The formula sustains it.
            We&rsquo;ve run this same sequence for commercial media labs,
            venture-backed startups, and civic movements. The tactics adapt
            to the client; the sequence does not.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                n: "01",
                title: "Build Story Machine.",
                body: "A publication, a cadence, a voice. The infrastructure that turns ongoing work into ongoing narrative.",
              },
              {
                n: "02",
                title: "Cast the Drama.",
                body: "Personalities, founders, builders, dissenters. The anthropologist's posture: surface them, co-create the mythology, broadcast outward.",
              },
              {
                n: "03",
                title: "Share / Repeat.",
                body: "Distribute deliberately. Watch what resonates. Sharpen, syndicate, and run it back. Compounding takes care of the rest.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="border border-zinc-200 rounded-md p-7 flex flex-col gap-3"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {s.n}
                </div>
                <div className="text-2xl font-black text-zinc-900 leading-tight">
                  {s.title}
                </div>
                <p className="text-sm md:text-base text-zinc-600 leading-snug">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>What it produces</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-5 max-w-3xl">
            Strong editorial movements move markets — and pipelines.
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-10">
            Benchmarks from dozens of prior campaigns we&rsquo;ve executed
            using this same framework.
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {OUTCOMES.map((o) => (
              <div key={o.label} className="bg-white p-6 md:p-7">
                <div className="text-xl md:text-3xl font-black text-zinc-900 leading-none mb-3">
                  {o.num}
                </div>
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-1.5">
                  {o.label}
                </div>
                <div className="text-sm text-zinc-500 leading-snug">
                  {o.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STACK */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>The stack</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            Off-the-shelf platforms.{" "}
            <span className="text-brand">Used deliberately.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-12">
            Every movement we&rsquo;ve helped build runs on a small,
            deliberate stack. No custom CMS, no bespoke software, no
            platform play. The leverage is editorial — not technical.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {STACK.map((p) => (
              <article
                key={p.name}
                className="bg-white p-7 md:p-9 flex flex-col gap-3 min-h-[200px]"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {p.role}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight">
                  {p.name}
                </h3>
                <p className="text-base text-zinc-600 leading-relaxed mt-1">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Have an idea worth turning into a movement?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            A typical first engagement runs six months.
          </p>
          <a
            href="/engage#contact"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  );
}
