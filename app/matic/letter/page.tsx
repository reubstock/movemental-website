"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Eyebrow from "../../components/Eyebrow";

type Beat = {
  n: string;
  key: "hook" | "diagnosis" | "jm" | "future" | "call";
  label: string;
  title: string;
  body: string;
  prompt: string;
  placeholder: string;
};

const BEATS: Beat[] = [
  {
    n: "01",
    key: "hook",
    label: "Beat 1",
    title: "The Hook",
    body: "Open with the danger. Name what is being lost, concentrated, ignored, or distorted right now. The reader has to feel a stake inside the first paragraph.",
    prompt: "What is being lost, concentrated, or ignored right now?",
    placeholder:
      "Open with the present-tense danger. One short paragraph.",
  },
  {
    n: "02",
    key: "diagnosis",
    label: "Beat 2",
    title: "The Diagnosis",
    body: "Explain why the existing players can't fix it. The capital, the talent, and the narrative have organized around the wrong thing — and the field can sense it.",
    prompt: "Why can't the obvious players fix it?",
    placeholder:
      "What's structurally misaligned about the incumbents.",
  },
  {
    n: "03",
    key: "jm",
    label: "Beat 3",
    title: "The Jerry Maguire Moment",
    body: "Say out loud what everyone is already thinking — the unspoken truth at the center of the letter. Without this, you have a press release.",
    prompt: "State the unspoken truth in full. One paragraph.",
    placeholder:
      "Restate the keystone above and expand it. Be direct.",
  },
  {
    n: "04",
    key: "future",
    label: "Beat 4",
    title: "The Future",
    body: "Show what becomes possible — and why this organization, place, or group is the natural one to lead the next chapter. Specifics over slogans.",
    prompt: "What becomes possible, and why is this yours to lead?",
    placeholder:
      "Concrete future + the credibility that's specifically yours.",
  },
  {
    n: "05",
    key: "call",
    label: "Beat 5",
    title: "The Call",
    body: "One ask, simple and immediate. Subscribe. Comment. Share. Reply. The movement begins the moment readers respond publicly.",
    prompt: "What's the single, measurable ask?",
    placeholder: "One action. Simple, immediate, public.",
  },
];

type FrameField = {
  key: "author" | "byline" | "audience" | "endorsers";
  label: string;
  prompt: string;
  placeholder: string;
  multiline?: boolean;
};

const FRAME_FIELDS: FrameField[] = [
  {
    key: "author",
    label: "Author",
    prompt: "Who is signing it?",
    placeholder: "Jane Doe",
  },
  {
    key: "byline",
    label: "Byline",
    prompt: "Title and affiliation.",
    placeholder: "Chair, Acme Foundation",
  },
  {
    key: "audience",
    label: "Audience",
    prompt: "Who is this letter actually for?",
    placeholder:
      "Pharma operators. Sector policymakers. Not the general public.",
    multiline: true,
  },
  {
    key: "endorsers",
    label: "Endorsers",
    prompt: "5–10 names to seed privately before launch (one per line).",
    placeholder: "Jane Smith\nJohn Doe\n…",
    multiline: true,
  },
];

export default function LetterBuilder() {
  const [keystone, setKeystone] = useState("");
  const [frame, setFrame] = useState<Record<string, string>>({});
  const [beats, setBeats] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const updateFrame = (key: string, v: string) =>
    setFrame((p) => ({ ...p, [key]: v }));
  const updateBeat = (key: string, v: string) =>
    setBeats((p) => ({ ...p, [key]: v }));

  const reset = () => {
    setKeystone("");
    setFrame({});
    setBeats({});
  };

  const filledBeats = BEATS.filter((b) => beats[b.key]?.trim()).length;
  const hasContent =
    keystone.trim().length > 0 ||
    filledBeats > 0 ||
    Object.values(frame).some((v) => v?.trim());

  const byline = useMemo(() => {
    const a = frame.author?.trim() ?? "";
    const b = frame.byline?.trim() ?? "";
    if (a && b) return `${a}, ${b}`;
    return a || b;
  }, [frame.author, frame.byline]);

  const endorserList = useMemo(
    () =>
      (frame.endorsers ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [frame.endorsers]
  );

  const copyDraft = async () => {
    const lines: string[] = [];
    if (keystone.trim()) {
      lines.push(`"${keystone.trim()}"`);
      lines.push("");
    }
    if (byline) lines.push(`From: ${byline}`);
    if (frame.audience?.trim()) lines.push(`To: ${frame.audience.trim()}`);
    lines.push("");
    BEATS.forEach((b) => {
      const v = beats[b.key]?.trim();
      if (v) {
        lines.push(v);
        lines.push("");
      }
    });
    if (byline) {
      lines.push(`— ${byline}`);
    }
    if (endorserList.length) {
      lines.push("");
      lines.push("---");
      lines.push("Seeded privately to:");
      endorserList.forEach((n) => lines.push(`- ${n}`));
    }
    try {
      await navigator.clipboard.writeText(lines.join("\n").trim() + "\n");
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
          <div className="mb-3">
            <Link
              href="/matic"
              className="text-xs font-extrabold tracking-[0.16em] uppercase text-zinc-400 hover:text-brand transition-colors"
            >
              ← MATIC
            </Link>
          </div>
          <Eyebrow>Open Letter Builder</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-7 max-w-[18ch]">
            One thesis. Five beats.{" "}
            <span className="text-brand">A page and a half.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            A scaffold for the artifact most engagements launch with. Write
            one keystone sentence, then a paragraph per beat. The preview
            assembles a draft on the right surface.
          </p>
        </div>
      </section>

      {/* FRAMING */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Framing</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-10 max-w-3xl">
            Who&rsquo;s signing it. Who it&rsquo;s for.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FRAME_FIELDS.map((f) => (
              <article
                key={f.key}
                className="bg-white border border-zinc-200 rounded-lg p-6 md:p-7 flex flex-col gap-3"
              >
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand">
                  {f.label}
                </div>
                <label
                  htmlFor={`frame-${f.key}`}
                  className="text-sm font-bold text-zinc-700"
                >
                  {f.prompt}
                </label>
                {f.multiline ? (
                  <textarea
                    id={`frame-${f.key}`}
                    value={frame[f.key] ?? ""}
                    onChange={(e) => updateFrame(f.key, e.target.value)}
                    rows={f.key === "endorsers" ? 6 : 3}
                    placeholder={f.placeholder}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors resize-y"
                  />
                ) : (
                  <input
                    id={`frame-${f.key}`}
                    type="text"
                    value={frame[f.key] ?? ""}
                    onChange={(e) => updateFrame(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors"
                  />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* KEYSTONE */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <label
            htmlFor="keystone"
            className="block text-[11px] font-extrabold tracking-[0.18em] uppercase text-brand mb-3"
          >
            The keystone · Write this first
          </label>
          <textarea
            id="keystone"
            value={keystone}
            onChange={(e) => setKeystone(e.target.value)}
            placeholder="The thing everyone in the field thinks but won't say. One sentence."
            rows={3}
            className="w-full bg-white border border-zinc-200 rounded-lg px-5 py-4 text-xl md:text-3xl font-black tracking-tight text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors leading-[1.2] resize-y"
          />
          <p className="mt-3 text-sm text-zinc-500">
            If you can&rsquo;t write this in one sentence, the letter
            isn&rsquo;t ready. Everything below expands from this line.
          </p>
        </div>
      </section>

      {/* BEATS */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <Eyebrow>The five beats</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05]">
                One paragraph each.
              </h2>
            </div>
            <div className="text-sm font-bold text-zinc-500">
              {filledBeats}/{BEATS.length} written
            </div>
          </div>

          <div className="space-y-4">
            {BEATS.map((b) => {
              const filled = !!beats[b.key]?.trim();
              return (
                <article
                  key={b.key}
                  className={`bg-white border rounded-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-10 transition-colors ${
                    filled ? "border-brand" : "border-zinc-200"
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-2">
                      {b.label}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight mb-3">
                      {b.title}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`beat-${b.key}`}
                      className="text-sm font-bold text-zinc-700"
                    >
                      {b.prompt}
                    </label>
                    <textarea
                      id={`beat-${b.key}`}
                      value={beats[b.key] ?? ""}
                      onChange={(e) => updateBeat(b.key, e.target.value)}
                      rows={5}
                      placeholder={b.placeholder}
                      className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors resize-y leading-relaxed"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE PREVIEW */}
      <section className="px-5 md:px-8 py-20 md:py-24 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Live preview</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] max-w-3xl">
              Your draft.
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
                onClick={copyDraft}
                disabled={!hasContent}
                className="inline-flex items-center bg-brand hover:bg-[#0091c2] disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 text-sm font-extrabold tracking-wide rounded transition-colors"
              >
                {copied ? "Copied ✓" : "Copy draft"}
              </button>
            </div>
          </div>

          <article className="bg-white border border-zinc-200 rounded-lg p-7 md:p-12 shadow-[0_4px_24px_rgba(15,15,16,0.04)]">
            {/* Thesis callout */}
            {keystone.trim() ? (
              <div className="border-l-4 border-brand pl-5 mb-9">
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-brand mb-2">
                  The thesis
                </div>
                <p className="text-xl md:text-2xl font-bold text-zinc-900 leading-[1.3] font-serif italic">
                  &ldquo;{keystone.trim()}&rdquo;
                </p>
              </div>
            ) : (
              <div className="border-l-4 border-zinc-200 pl-5 mb-9">
                <div className="text-[11px] font-extrabold tracking-[0.16em] uppercase text-zinc-300 mb-2">
                  The thesis
                </div>
                <p className="text-lg text-zinc-300 italic">
                  Write the keystone above.
                </p>
              </div>
            )}

            {/* Meta */}
            <div className="text-sm text-zinc-600 mb-9 space-y-1">
              {byline && (
                <div>
                  <span className="text-zinc-400">From: </span>
                  <strong className="text-zinc-900">{byline}</strong>
                </div>
              )}
              {frame.audience?.trim() && (
                <div>
                  <span className="text-zinc-400">To: </span>
                  {frame.audience.trim()}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="space-y-5 font-serif text-zinc-900 text-base md:text-lg leading-[1.65]">
              {BEATS.map((b) => {
                const v = beats[b.key]?.trim();
                if (!v) {
                  return (
                    <p
                      key={b.key}
                      className="text-zinc-300 italic text-base"
                    >
                      [{b.title} — not yet written]
                    </p>
                  );
                }
                return (
                  <p
                    key={b.key}
                    className={
                      b.key === "jm"
                        ? "font-semibold border-l-2 border-zinc-200 pl-4"
                        : ""
                    }
                  >
                    {v}
                  </p>
                );
              })}
            </div>

            {/* Signature */}
            {byline && (
              <div className="mt-10 pt-6 border-t border-zinc-100 text-base font-serif text-zinc-700">
                — {byline}
              </div>
            )}

            {/* Endorsers note */}
            {endorserList.length > 0 && (
              <div className="mt-6 pt-5 border-t border-zinc-100 text-xs text-zinc-500">
                <div className="font-bold uppercase tracking-[0.14em] text-zinc-400 mb-1.5">
                  Seeded privately to
                </div>
                <div>{endorserList.join(" · ")}</div>
              </div>
            )}
          </article>

          <p className="mt-6 text-sm text-zinc-500">
            Nothing is saved server-side. Copy your draft to keep it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-20 md:py-24 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Want this letter actually published?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Bring us the draft. We&rsquo;ll sharpen it, line up the
            endorsers, and run the public + private launch.
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
