import Image from "next/image";
import Link from "next/link";
import Eyebrow from "./components/Eyebrow";

const EXAMPLE_LOGOS = [
  { name: "Second Life", src: "/images/second-life-logo.png", widthClass: "h-10 md:h-12" },
  {
    name: "IPG Media Lab",
    src: "/images/ipg.svg",
    widthClass: "h-8 md:h-9",
  },
  {
    name: "Indivisible · No Kings",
    src: "/images/no-kings.jpg",
    widthClass: "h-12 md:h-14 rounded-full",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative px-5 md:px-8 pt-6 md:pt-10 pb-28 md:pb-36 lg:pb-44 border-b border-zinc-100 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(55% 55% at 85% 10%, rgba(0,182,240,0.10) 0%, transparent 60%), radial-gradient(45% 45% at 5% 90%, rgba(93,208,245,0.07) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-tint border border-[#a8dcf5] text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Movement, not marketing
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-zinc-900 mb-8 max-w-[16ch]">
            We turn promising ideas into{" "}
            <span className="text-brand">global movements.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug text-balance max-w-5xl mb-3">
            Movementum builds the machine to carry a category-defining idea
            into the world.
          </p>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug text-balance max-w-3xl mb-10">
            And the community that keeps it alive once it lands.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-movements"
              className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-6 py-3 text-sm font-extrabold tracking-wide rounded transition-colors shadow-[0_8px_22px_rgba(0,182,240,0.25)]"
            >
              How we work →
            </Link>
            <Link
              href="/engage#contact"
              className="inline-flex items-center border border-zinc-300 hover:border-zinc-900 text-zinc-900 px-6 py-3 text-sm font-extrabold tracking-wide rounded transition-colors"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT MOVEMENTS — teaser */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>About Movements</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            It begins with one letter.
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-8">
            Most of our engagements start the same way: a single,
            category-defining <strong className="text-zinc-900">Open Letter</strong>,
            published from a client&rsquo;s leadership, that frames the world
            they want to build. The letter is the anthem.{" "}
            <span className="text-brand font-semibold">
              Everything else amplifies it.
            </span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            <div className="bg-white p-6">
              <div className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-3">
                Step 01
              </div>
              <div className="text-lg font-black text-zinc-900 mb-1">
                Build Story Machine
              </div>
              <p className="text-sm text-zinc-600">
                A publication, a cadence, a voice.
              </p>
            </div>
            <div className="bg-white p-6">
              <div className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-3">
                Step 02
              </div>
              <div className="text-lg font-black text-zinc-900 mb-1">
                Cast the Drama
              </div>
              <p className="text-sm text-zinc-600">
                The personalities, founders, and dissenters who carry the story.
              </p>
            </div>
            <div className="bg-white p-6">
              <div className="text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-3">
                Step 03
              </div>
              <div className="text-lg font-black text-zinc-900 mb-1">
                Share &nbsp;/&nbsp; Repeat
              </div>
              <p className="text-sm text-zinc-600">
                Distribute deliberately. Compounding takes care of the rest.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/about-movements"
              className="inline-flex items-center text-brand text-sm font-extrabold tracking-wide hover:opacity-70"
            >
              Read the full process →
            </Link>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="px-5 md:px-8 py-24 md:py-32 border-b border-zinc-100 bg-brand-tint">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.05]">
            &ldquo;Life&rsquo;s so much easier when your customers{" "}
            <span className="text-brand">carry you.</span>&rdquo;
          </p>
        </div>
      </section>

      {/* EXAMPLES — teaser */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>Examples</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6 max-w-3xl">
            We&rsquo;ve run this play before.
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-3xl mb-10">
            The same sequence — letter, narrative, community, calendar,
            evaluate, expand — has worked across very different clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 rounded-md overflow-hidden">
            {EXAMPLE_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="bg-white p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]"
              >
                <div className="h-16 flex items-center">
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className={`${logo.widthClass} w-auto object-contain`}
                  />
                </div>
                <div className="text-sm font-bold text-zinc-900">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/examples"
              className="inline-flex items-center text-brand text-sm font-extrabold tracking-wide hover:opacity-70"
            >
              See the case studies →
            </Link>
          </div>
        </div>
      </section>

      {/* ENGAGE — CTA */}
      <section className="px-5 md:px-8 py-24 md:py-28 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Have an idea worth turning into a movement?
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-9">
            A typical first engagement runs six months and produces — at
            minimum — the letter, the publication, and the community that
            follows from them.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/engage#contact"
              className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
            >
              Get in touch
            </a>
            <a
              href="https://www.linkedin.com/in/reubensteiger/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-white/25 hover:border-white text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
