import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

export default function MaticPage() {
  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>MATIC</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            MATIC.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Placeholder page. Tell me what MATIC is — the headline, the
            framing, the body content — and I&rsquo;ll fill it in.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Have an idea worth turning into a movement?
          </h2>
          <Link
            href="/engage#contact"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
