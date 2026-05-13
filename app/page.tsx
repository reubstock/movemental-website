import Image from "next/image";
import Link from "next/link";
import Eyebrow from "./components/Eyebrow";

const EXAMPLE_LOGOS = [
  { name: "TED", src: "/images/ted.svg", widthClass: "h-10 md:h-12" },
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
      <section className="relative px-5 md:px-8 py-20 md:py-28 border-b border-zinc-100 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 60% at 80% 0%, rgba(0,182,240,0.07) 0%, transparent 60%), radial-gradient(50% 50% at 0% 80%, rgba(93,208,245,0.05) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <Image
            src="/images/movemental.svg"
            alt=""
            width={104}
            height={104}
            className="w-20 h-20 md:w-24 md:h-24 mb-8 drop-shadow-[0_10px_30px_rgba(0,182,240,0.18)]"
            priority
          />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-tint border border-[#a8dcf5] text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Movement, not marketing
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-zinc-900 mb-7 max-w-[16ch]">
            We turn promising ideas into{" "}
            <span className="text-brand">global movements.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl mb-8">
            Movemental builds the editorial machine that carries a
            category-defining idea into the world — and the community that
            keeps it alive once it lands.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about-movements"
              className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-6 py-3 text-sm font-extrabold tracking-wide rounded transition-colors shadow-[0_8px_22px_rgba(0,182,240,0.25)]"
            >
              How we work →
            </Link>
            <Link
              href="/engage"
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
            they want to build. The letter is the keystone.{" "}
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
                Feature Interesting People
              </div>
              <p className="text-sm text-zinc-600">
                The residents, founders, and dissenters who carry the story.
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

      {/* TEAM — teaser */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <Eyebrow>Team</Eyebrow>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <Image
              src="/images/reuben.jpg"
              alt="Reuben Steiger"
              width={160}
              height={160}
              className="rounded-full object-cover w-28 h-28 md:w-36 md:h-36 border border-zinc-200 flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-3">
                Reuben Steiger.
              </h2>
              <p className="text-xl md:text-2xl font-semibold text-zinc-900 mb-3">
                Entrepreneur <span className="text-zinc-300">||</span>{" "}
                Movement Builder <span className="text-zinc-300">||</span>{" "}
                Writer
              </p>
              <p className="text-lg md:text-xl text-zinc-600 leading-snug max-w-2xl mb-5">
                Two decades turning promising ideas into global movements —
                from Fortune 500 media labs to civic organizing.
              </p>
              <Link
                href="/team"
                className="inline-flex items-center text-brand text-sm font-extrabold tracking-wide hover:opacity-70"
              >
                More on the team →
              </Link>
            </div>
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
            <Link
              href="/engage"
              className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
            >
              Get in touch
            </Link>
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
