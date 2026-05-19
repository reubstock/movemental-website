import Eyebrow from "../components/Eyebrow";
import EngageForm from "../components/EngageForm";

const TERMS = [
  {
    label: "Engagement",
    value: "Six months",
    sub: "Single phase, with options to extend",
  },
  {
    label: "Cadence",
    value: "Weekly",
    sub: "Standing calls and check-ins throughout",
  },
  {
    label: "Start",
    value: "Immediate",
    sub: "As soon as the contract is signed",
  },
];

const PRINCIPLES = [
  "Engage on the full process — the letter, the publication, the community.",
  "Jointly agreed-upon success metrics, set in week one.",
  "Rapid iteration; adjust to findings, not to opinions.",
  "Phase 2 discussion contingent on Phase 1 signal.",
];

export default function EngagePage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Engage</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[16ch]">
            A simple engagement.{" "}
            <span className="text-brand">A quick start.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            The steps to building editorially-driven communities are always
            the same, and the sooner we begin, the sooner we flourish. The
            intent of this page is to be precise — to provide enough detail
            for a conversation and a go-forward decision.
          </p>
        </div>
      </section>

      {/* TERMS */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>The engagement</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-12 max-w-3xl">
            Six months. One phase.{" "}
            <span className="text-brand">Three workstreams in parallel.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {TERMS.map((t) => (
              <div key={t.label} className="bg-white p-6 md:p-7">
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-3">
                  {t.label}
                </div>
                <div className="text-2xl md:text-3xl font-black text-zinc-900 leading-tight mb-2">
                  {t.value}
                </div>
                <div className="text-sm text-zinc-500 leading-snug">
                  {t.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPERATING PRINCIPLES */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Operating principles</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            How we work together.
          </h2>
          <ul className="border border-zinc-200 rounded-md divide-y divide-zinc-100">
            {PRINCIPLES.map((p) => (
              <li
                key={p}
                className="flex gap-4 px-6 py-5 text-base md:text-lg text-zinc-700"
              >
                <span className="text-brand font-black flex-shrink-0">→</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact"
        className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8] scroll-mt-20"
      >
        <div className="max-w-3xl mx-auto">
          <Eyebrow>Get in touch</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-5">
            Tell us what you&rsquo;re trying to build.
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed mb-8 max-w-2xl">
            We&rsquo;ll tell you whether the Open Letter is the right shape
            for it — and what the first ninety days would look like.
          </p>
          <EngageForm />
          <p className="mt-6 text-sm text-zinc-500">
            Or message Reuben on{" "}
            <a
              href="https://www.linkedin.com/in/reubensteiger/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-900 underline underline-offset-2 hover:text-brand"
            >
              LinkedIn
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
