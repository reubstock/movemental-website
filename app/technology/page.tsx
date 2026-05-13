import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

type Platform = {
  name: string;
  role: string;
  body: string;
};

const STACK: Platform[] = [
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
    name: "AI in the loop",
    role: "The writing room",
    body: "Claude and similar tools do real work in the drafting process — research, sharpening, variation. The thinking is human. The drudgery isn't. Every artifact still ships under a named editor.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Public by default",
    body: "Every artifact should be linkable. If it lives behind a login, it can't carry a movement.",
  },
  {
    n: "02",
    title: "Owned distribution",
    body: "The email list is the asset — not the platform. We build on Substack, but the subscribers are yours from day one.",
  },
  {
    n: "03",
    title: "No custom CMS",
    body: "Every page should be replaceable in a week. The leverage is editorial, not technical.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Technology</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            Off-the-shelf platforms.{" "}
            <span className="text-brand">Used deliberately.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Every movement we&rsquo;ve helped build runs on a small,
            deliberate stack. No custom CMS, no bespoke software, no
            platform play. The leverage is editorial — not technical.
          </p>
        </div>
      </section>

      {/* THE STACK */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>The stack</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-12 max-w-3xl">
            Four surfaces. They reinforce each other.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {STACK.map((p) => (
              <article
                key={p.name}
                className="bg-white p-7 md:p-9 flex flex-col gap-3 min-h-[220px]"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {p.role}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight">
                  {p.name}
                </h3>
                <p className="text-base md:text-lg text-zinc-600 leading-relaxed mt-1">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Operating principles</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            How we choose tools.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.n}
                className="border border-zinc-200 rounded-md p-7 flex flex-col gap-3"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {p.n}
                </div>
                <div className="text-xl font-black text-zinc-900 leading-tight">
                  {p.title}
                </div>
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Want to see the stack in action?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Most engagements run six months and start as soon as the
            contract is signed.
          </p>
          <Link
            href="/engage"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
