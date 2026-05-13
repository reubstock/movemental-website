import Image from "next/image";
import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

const PROOF_POINTS = [
  {
    name: "Second Life",
    src: "/images/second-life.svg",
    logoClass: "h-12 md:h-14",
    body: "As the Evangelist for a small virtual world platform, helped architect a story machine that allowed residents to tell their stories as a narrative that attracted millions.",
    metric: "Millions of residents at peak",
  },
  {
    name: "IPG Media Lab",
    src: "/images/ipg.svg",
    logoClass: "h-9 md:h-10",
    body: "Voice, publishing cadence, and audience strategy for IPG's media innovation lab.",
    metric: "+$4.8B in client spend",
  },
  {
    name: "Indivisible · No Kings",
    src: "/images/no-kings.jpg",
    logoClass: "h-12 md:h-14 rounded-full",
    body: "Editorial and community infrastructure for one of 2025's fastest-growing civic movements.",
    metric: "9M activists on the street",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* HERO / PROPOSER */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Team</Eyebrow>
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10 mb-8 md:mb-10">
            <Image
              src="/images/reuben.jpg"
              alt="Reuben Steiger"
              width={320}
              height={320}
              className="rounded-full object-cover w-32 h-32 md:w-40 md:h-40 border border-zinc-200 flex-shrink-0"
              priority
            />
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-[1.02] mb-3">
                Reuben Steiger.
              </h1>
              <p className="text-xl md:text-2xl font-semibold text-zinc-900 mb-4">
                Entrepreneur <span className="text-zinc-300">||</span>{" "}
                Movement Builder <span className="text-zinc-300">||</span>{" "}
                Writer
              </p>
              <p className="text-lg md:text-xl text-zinc-600 leading-snug max-w-2xl">
                Two decades turning promising ideas into global movements —
                from Fortune 500 media labs to civic organizing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK RECORD */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>I&rsquo;ve run this play before</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            Three engagements that shaped the playbook.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {PROOF_POINTS.map((p) => (
              <div
                key={p.name}
                className="bg-white p-7 md:p-8 flex flex-col gap-5 min-h-[280px]"
              >
                <div className="h-16 flex items-center">
                  <img
                    src={p.src}
                    alt={p.name}
                    className={`${p.logoClass} w-auto object-contain`}
                  />
                </div>
                <p className="text-base md:text-lg text-zinc-600 leading-snug flex-1">
                  {p.body}
                </p>
                <div className="pt-4 border-t border-zinc-100">
                  <div className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-zinc-400 mb-1">
                    Result
                  </div>
                  <div className="text-lg md:text-xl font-black text-zinc-900 leading-tight">
                    {p.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOOKING BACK */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <Eyebrow>Why this approach</Eyebrow>
          <p className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-8">
            Sometimes the only way forward is{" "}
            <span className="text-brand">looking back.</span>
          </p>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl">
            The mechanics behind every internet-native movement —{" "}
            <strong className="text-zinc-900">Wikipedia, Linux, Bitcoin, Indivisible</strong>{" "}
            — are simpler than they look: a founding text, a visible
            community, a publication of record, and a clear path from
            reader to protagonist. We&rsquo;ve spent two decades refining
            them.
          </p>
        </div>
      </section>

      {/* CONTACT LINKS */}
      <section className="px-5 md:px-8 py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:reubstock@gmail.com"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            reubstock@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/reubensteiger/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-zinc-300 hover:border-zinc-900 text-zinc-900 px-7 py-3 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            linkedin.com/in/reubensteiger
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Ready to start?
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
