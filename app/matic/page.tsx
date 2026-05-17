"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Eyebrow from "../components/Eyebrow";
import ReferenceDocs, {
  useReferenceDocs,
} from "../components/ReferenceDocs";

const INDUSTRIES = [
  "Financial Services",
  "Healthcare & Pharma",
  "Technology & AI",
  "Media & Marketing",
  "Energy & Climate",
  "Education",
  "Civic & Political",
  "Other",
];

type Question = {
  n: string;
  key: "change" | "moment" | "unsaid" | "why" | "ask";
  prompt: string;
  placeholder: string;
};

const QUESTIONS: Question[] = [
  {
    n: "01",
    key: "change",
    prompt: "What would you like to change?",
    placeholder: "Name what's wrong, missing, or stuck.",
  },
  {
    n: "02",
    key: "moment",
    prompt: "What's a specific moment that made you realize this?",
    placeholder: "A meeting, a conversation, a line in a report — the scene that crystallized it.",
  },
  {
    n: "03",
    key: "unsaid",
    prompt: "What does everyone think but won't say?",
    placeholder: "The unspoken truth at the center of the field.",
  },
  {
    n: "04",
    key: "why",
    prompt: "Why is this yours to say?",
    placeholder: "Your stakes. Your standing. Your specific credibility.",
  },
  {
    n: "05",
    key: "ask",
    prompt: "What do you want readers to do?",
    placeholder: "One specific, immediate, public action.",
  },
];

type Status = "idle" | "composing" | "ready" | "error";

const STATUS_META: Record<Status, { dot: string; label: string }> = {
  idle: { dot: "bg-zinc-400", label: "IDLE" },
  composing: { dot: "bg-brand animate-pulse", label: "COMPOSING" },
  ready: { dot: "bg-green-500", label: "READY" },
  error: { dot: "bg-red-500", label: "ERROR" },
};

export default function MaticPage() {
  const [industry, setIndustry] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [refDocs, setRefDocs] = useReferenceDocs();
  const [letter, setLetter] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const update = (key: string, v: string) =>
    setValues((p) => ({ ...p, [key]: v }));

  const filled = QUESTIONS.filter((q) => values[q.key]?.trim()).length;
  const canRun = filled >= 1 && status !== "composing";
  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0;

  const run = async () => {
    if (!canRun) return;

    setLetter("");
    setStatus("composing");
    setElapsed(null);
    const startTime = performance.now();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          industry,
          refDocs: refDocs.map((d) => ({
            name: d.name,
            content: d.content,
            source: d.source,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        setLetter(`[Error: ${text || res.statusText}]`);
        setStatus("error");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setLetter(acc);
      }

      setStatus("ready");
      setElapsed((performance.now() - startTime) / 1000);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        const msg = e instanceof Error ? e.message : "request failed";
        setLetter(`[Error: ${msg}]`);
        setStatus("error");
      }
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("ready");
  };

  const reset = () => {
    setIndustry("");
    setValues({});
    setLetter("");
    setStatus("idle");
    setElapsed(null);
  };

  const copy = async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const shareToTwitter = () => {
    if (!letter) return;
    const text = letter.trim();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareToFacebook = async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter.trim());
    } catch {
      /* ignore */
    }
    window.open(
      "https://www.facebook.com/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const s = STATUS_META[status];

  return (
    <>
      {/* HERO */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>MATIC</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.98] mb-6 max-w-[18ch]">
            Inputs <span className="text-brand">→</span> Letter.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-snug max-w-3xl">
            Four questions. One short open letter. Under ninety seconds.
          </p>
        </div>
      </section>

      {/* INDUSTRY SELECTOR */}
      <section className="px-5 md:px-8 py-10 md:py-12 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <label
            htmlFor="industry"
            className="block text-[10px] font-mono font-bold tracking-[0.18em] text-brand mb-3"
          >
            INDUSTRY
          </label>
          <div className="relative">
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className={`w-full appearance-none bg-white border rounded-lg px-5 py-4 pr-12 text-lg md:text-xl font-bold tracking-tight focus:outline-none focus:border-brand transition-colors cursor-pointer ${
                industry
                  ? "border-brand text-zinc-900"
                  : "border-zinc-200 text-zinc-400"
              }`}
            >
              <option value="">Select an industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i} className="text-zinc-900">
                  {i}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <p className="mt-3 text-xs font-mono text-zinc-400">
            // Frames the draft. Picks the players and references the letter
            leans on.
          </p>
        </div>
      </section>

      {/* INPUTS */}
      <section className="px-5 md:px-8 py-12 md:py-16 border-b border-zinc-100 bg-[#fafaf8]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUESTIONS.map((q) => {
              const isFilled = !!values[q.key]?.trim();
              return (
                <article
                  key={q.key}
                  className={`bg-white border rounded-lg p-6 flex flex-col gap-3 transition-colors ${
                    isFilled ? "border-brand" : "border-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono font-bold tracking-[0.18em] text-brand">
                      INPUT {q.n}
                    </div>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isFilled ? "bg-brand" : "bg-zinc-200"
                      }`}
                    />
                  </div>
                  <label
                    htmlFor={`q-${q.key}`}
                    className="text-lg md:text-xl font-black text-zinc-900 leading-tight"
                  >
                    {q.prompt}
                  </label>
                  <textarea
                    id={`q-${q.key}`}
                    value={values[q.key] ?? ""}
                    onChange={(e) => update(q.key, e.target.value)}
                    rows={3}
                    placeholder={q.placeholder}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-brand transition-colors resize-y leading-relaxed"
                  />
                </article>
              );
            })}
          </div>

          {/* REFERENCE DOCS — optional context */}
          <div className="mt-6">
            <ReferenceDocs docs={refDocs} setDocs={setRefDocs} />
          </div>

          {/* RUN BAR */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {status !== "composing" ? (
              <button
                type="button"
                onClick={run}
                disabled={!canRun}
                className="inline-flex items-center bg-brand hover:bg-[#0091c2] disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-4 text-sm font-mono font-bold tracking-[0.18em] rounded transition-colors"
              >
                RUN ↵
              </button>
            ) : (
              <button
                type="button"
                onClick={stop}
                className="inline-flex items-center border-2 border-brand text-brand hover:bg-brand hover:text-white px-8 py-4 text-sm font-mono font-bold tracking-[0.18em] rounded transition-colors"
              >
                STOP
              </button>
            )}
            {(letter || filled > 0) && status !== "composing" && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center text-zinc-500 hover:text-zinc-900 px-4 py-2 text-xs font-mono font-bold tracking-[0.18em] transition-colors"
              >
                RESET
              </button>
            )}
            <div className="ml-auto flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-500">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
              {elapsed && status === "ready" && (
                <span className="text-zinc-400">· {elapsed.toFixed(1)}s</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OUTPUT */}
      <section className="px-5 md:px-8 py-16 md:py-20 border-b border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <Eyebrow>Output</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.05] mb-6">
            Draft.
          </h2>

          <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <div className="border-b border-zinc-100 px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] font-mono font-bold tracking-[0.18em] text-zinc-500">
              <span>MODEL: claude-sonnet-4-6</span>
              <span className="text-zinc-200">|</span>
              <span>WORDS: {String(wordCount).padStart(3, "0")}</span>
              <span className="text-zinc-200">|</span>
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                {s.label}
              </span>
            </div>

            <div className="px-7 md:px-10 py-8 md:py-10 min-h-[320px]">
              {letter ? (
                <div className="text-zinc-900 text-[15px] md:text-base leading-[1.55] whitespace-pre-wrap max-w-[640px] mx-auto">
                  {letter}
                  {status === "composing" && (
                    <span className="inline-block w-2 h-5 align-middle bg-brand ml-0.5 animate-pulse" />
                  )}
                </div>
              ) : (
                <div className="text-sm font-mono text-zinc-300">
                  // Awaiting RUN command.
                </div>
              )}
            </div>

            {letter && status !== "composing" && (
              <div className="border-t border-zinc-100 px-5 py-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center bg-zinc-900 hover:bg-brand text-white px-4 py-2 text-xs font-mono font-bold tracking-[0.18em] rounded transition-colors"
                >
                  {copied ? "COPIED ✓" : "COPY"}
                </button>
                <button
                  type="button"
                  onClick={shareToTwitter}
                  aria-label="Share to Twitter"
                  title="Open X with full letter in compose"
                  className="inline-flex items-center justify-center w-9 h-9 border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white text-zinc-700 rounded transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={shareToFacebook}
                  aria-label="Share to Facebook"
                  title="Copy letter and open Facebook to paste"
                  className="inline-flex items-center justify-center w-9 h-9 border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white text-zinc-700 rounded transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.5 21.5v-8.01h2.7l.4-3.13h-3.1V8.36c0-.9.25-1.52 1.55-1.52H17V4.04c-.29-.04-1.26-.12-2.39-.12-2.37 0-3.99 1.45-3.99 4.1v2.34H8v3.13h2.62V21.5h2.88Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={run}
                  disabled={!canRun}
                  className="inline-flex items-center border border-zinc-300 hover:border-zinc-900 text-zinc-900 disabled:opacity-40 px-4 py-2 text-xs font-mono font-bold tracking-[0.18em] rounded transition-colors"
                >
                  REGENERATE
                </button>
              </div>
            )}
          </article>

          <p className="mt-4 text-xs text-zinc-400 font-mono">
            // Inputs are sent to Anthropic for generation only. Nothing is
            saved.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-8 py-16 md:py-20 bg-[#0f0f10] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="text-[#5dd0f5]">Engage</Eyebrow>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] mb-5">
            Want this letter actually published?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Bring us the draft. We&rsquo;ll sharpen it, line up the
            endorsers, and run the public + private launch.
          </p>
          <a
            href="mailto:reubstock@gmail.com"
            className="inline-flex items-center bg-brand hover:bg-[#0091c2] text-white px-7 py-3.5 text-base font-extrabold tracking-wide rounded transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  );
}
