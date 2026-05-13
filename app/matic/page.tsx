"use client";

import { useState } from "react";
import Link from "next/link";
import Eyebrow from "../components/Eyebrow";

type Ingredient = {
  n: string;
  key: string;
  title: string;
  body: string;
  prompt: string;
  placeholder: string;
};

const INGREDIENTS: Ingredient[] = [
  {
    n: "01",
    key: "grievance",
    title: "Latent grievance or aspiration",
    body: "You can't manufacture a movement, only catalyze one that's already smoldering. People have to feel something — injustice, pain, longing — that hasn't been named. Your job is to name it.",
    prompt: "What is the unspoken feeling your movement names?",
    placeholder:
      "The thing everyone in your field already feels but won't say out loud…",
  },
  {
    n: "02",
    key: "us",
    title: `A clear "us."`,
    body: `Movements run on identity more than ideology. "I'm an alcoholic," "I'm a worker," "I'm a mother who lost a child to a drunk driver." Belonging usually precedes belief — get people to feel like part of a "we" and the rest follows.`,
    prompt: `Who is the "we" your movement creates?`,
    placeholder:
      "The identity members claim out loud. The sentence that begins 'I'm a…'",
  },
  {
    n: "03",
    key: "story",
    title: "A simple, sticky story",
    body: "Marshall Ganz calls it the story of self, the story of us, the story of now: what happened to me, why we share it, why we have to act today. If you can't tell it in thirty seconds, it isn't ready.",
    prompt: "Tell the 30-second story: what happened, why we share it, why now.",
    placeholder: "Self → Us → Now. Three sentences if you can.",
  },
  {
    n: "04",
    key: "first-ask",
    title: "A low-cost first ask",
    body: "Wear the pin, come to the meeting, sign the thing. The entry point has to be nearly frictionless. People commit by doing, then rationalize the doing.",
    prompt: "What's the first, almost-frictionless action a new person can take?",
    placeholder: "Sign. Subscribe. Show up. Wear it.",
  },
  {
    n: "05",
    key: "ladder",
    title: "A ladder of engagement",
    body: "Once they're in, there has to be somewhere to go — attendee to volunteer to organizer to leader. Movements die when there's no next step.",
    prompt: "Sketch the path: attendee → volunteer → organizer → leader.",
    placeholder: "What does the next rung look like at each stage?",
  },
  {
    n: "06",
    key: "units",
    title: "Replicable, distributed units",
    body: "AA chapters, union locals, church small groups, Mormon wards. Small enough that anyone can start one, structured enough that they all feel like the same thing. Centralized movements scale linearly; replicable ones scale exponentially.",
    prompt:
      "What's the smallest reproducible unit — and what makes them all feel the same?",
    placeholder: "The chapter. The cell. The local. The kit anyone can run.",
  },
  {
    n: "07",
    key: "rituals",
    title: "Rituals and symbols",
    body: "Meetings with a predictable shape, songs, chants, dress, shared language. These feel cosmetic and they're not — they're the glue.",
    prompt: "List the rituals, symbols, language, or signals members share.",
    placeholder: "Greetings. Colors. Gestures. Jargon. Meeting cadence.",
  },
  {
    n: "08",
    key: "adversary",
    title: "An adversary, real or symbolic",
    body: "Could be a person, a system, a disease, a status quo. Something to push against.",
    prompt: "What — or who — are you pushing against?",
    placeholder:
      "The thing the movement defines itself in opposition to.",
  },
  {
    n: "09",
    key: "wins",
    title: "Visible wins",
    body: "Even tiny ones. Momentum is a feeling before it's a fact.",
    prompt: "Name the first small win you can deliver in the first 30 days.",
    placeholder:
      "What can you point to and say 'we did that' inside a month?",
  },
];

export default function MaticPage() {
  const [name, setName] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const update = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const reset = () => {
    setName("");
    setValues({});
  };

  const filledCount = INGREDIENTS.filter((i) =>
    values[i.key]?.trim()
  ).length;
  const total = INGREDIENTS.length;
  const hasContent = name.trim().length > 0 || filledCount > 0;

  const copyKit = async () => {
    const blocks = INGREDIENTS.map((i) =>
      [
        `${i.n}. ${i.title}`,
        i.prompt,
        values[i.key]?.trim() || "(blank)",
      ].join("\n")
    );
    const text = [
      `MOVEMENT: ${name.trim() || "(Unnamed)"}`,
      "—",
      "MATIC kit — Movemental",
      "",
      ...blocks.map((b) => b + "\n"),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (_) {
      /* ignore */
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>MATIC</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            The movement builder.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Nine ingredients. One canvas. Pressure-test a movement before
            you launch one — or sharpen one that&rsquo;s already smoldering.
          </p>
        </div>
      </section>

      {/* NAME INPUT */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <label
            htmlFor="movement-name"
            className="block text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-3"
          >
            Step 00 · Name your movement
          </label>
          <input
            id="movement-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. No Kings"
            className="w-full bg-white border border-zinc-200 rounded-lg px-5 py-4 text-2xl md:text-4xl font-black tracking-tight text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors"
          />
          <p className="mt-3 text-sm text-zinc-500">
            A name you can imagine people saying out loud. It can change.
          </p>
        </div>
      </section>

      {/* INGREDIENTS GRID */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <Eyebrow>The ingredients</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05]">
                Nine to get right.
              </h2>
            </div>
            <div className="text-sm font-bold text-zinc-500">
              {filledCount}/{total} filled
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INGREDIENTS.map((i) => {
              const filled = !!values[i.key]?.trim();
              return (
                <article
                  key={i.key}
                  className={`bg-white border rounded-lg p-6 md:p-7 flex flex-col gap-3 transition-colors ${
                    filled ? "border-brand" : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                      {i.n}
                    </div>
                    {filled && (
                      <div className="text-[10px] font-extrabold tracking-[0.16em] uppercase text-brand">
                        ✓ Filled
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
                    {i.title}
                  </h3>
                  <p className="text-sm md:text-base text-zinc-600 leading-relaxed">
                    {i.body}
                  </p>
                  <label
                    htmlFor={`input-${i.key}`}
                    className="text-sm font-bold text-zinc-700 mt-2"
                  >
                    {i.prompt}
                  </label>
                  <textarea
                    id={`input-${i.key}`}
                    value={values[i.key] ?? ""}
                    onChange={(e) => update(i.key, e.target.value)}
                    rows={3}
                    placeholder={i.placeholder}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors resize-y"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* KIT SUMMARY */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Your kit</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] max-w-3xl">
              {name.trim() || (
                <span className="text-zinc-300">(Unnamed movement)</span>
              )}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={reset}
                disabled={!hasContent}
                className="inline-flex items-center border border-zinc-300 hover:border-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 px-5 py-3 text-sm font-extrabold tracking-wide rounded transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={copyKit}
                disabled={!hasContent}
                className="inline-flex items-center bg-brand hover:bg-[#0091c2] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 text-sm font-extrabold tracking-wide rounded transition-colors"
              >
                {copied ? "Copied ✓" : "Copy kit"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
            {INGREDIENTS.map((i) => (
              <div
                key={i.key}
                className="px-6 md:px-7 py-5 grid grid-cols-[40px_1fr] gap-4 md:gap-6"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand pt-1">
                  {i.n}
                </div>
                <div>
                  <div className="text-sm md:text-base font-bold text-zinc-900 mb-1">
                    {i.title}
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 leading-relaxed whitespace-pre-wrap">
                    {values[i.key]?.trim() || (
                      <span className="text-zinc-300 italic">
                        Not yet filled.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Nothing is saved server-side. Copy your kit to keep it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Built something worth pursuing?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Bring us your kit. We&rsquo;ll tell you whether the Open Letter
            is the right next move — and what the first ninety days look like.
          </p>
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
