"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "../../components/LeadForm";

type Mode = "amplifiers" | "segmentation" | "profiles";
type Status = "idle" | "streaming" | "done" | "error";

const MODES: { key: Mode; label: string; tagline: string }[] = [
  {
    key: "amplifiers",
    label: "Find amplifiers",
    tagline:
      "Who on LinkedIn is most likely to share or repost this letter? Curated shortlist.",
  },
  {
    key: "segmentation",
    label: "Analyze my following",
    tagline:
      "Paste or upload your connections. Get clusters, personas, and which segments to lead with.",
  },
  {
    key: "profiles",
    label: "Profile briefs",
    tagline:
      "Paste profile URLs or content. Get per-person briefs with lead angles and confidence levels.",
  },
];

const INDUSTRIES = [
  "Supply Chain & Logistics",
  "Financial Services",
  "Healthcare & Pharma",
  "Technology & AI",
  "Media & Marketing",
  "Energy & Climate",
  "Education",
  "Civic & Political",
  "Other",
];

type Usage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens: number;
  cache_creation_input_tokens: number;
};

// Client-side text file readers for CSV / TXT / MD. PDF and DOCX users paste
// extracted text — keeping the dependency footprint small.
const TEXT_FILE_EXTS = new Set(["csv", "tsv", "txt", "md", "markdown"]);

export default function AudienceTool() {
  const [mode, setMode] = useState<Mode>("amplifiers");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [context, setContext] = useState("");
  const [letter, setLetter] = useState("");
  const [data, setData] = useState("");

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "streaming" && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, status]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const wordCount = output.trim().split(/\s+/).filter(Boolean).length;

  const requiredFilled =
    mode === "amplifiers"
      ? Boolean(letter.trim() || context.trim())
      : Boolean(data.trim());

  const statusLine = (() => {
    const word = String(wordCount).padStart(4, "0");
    const model = "MODEL: claude-sonnet-4-6";
    const words = `WORDS: ${word}`;
    const map: Record<Status, string> = {
      idle: "IDLE",
      streaming: "STREAMING…",
      done: "DONE",
      error: "ERROR",
    };
    return `${model} | ${words} | ${map[status]}`;
  })();

  async function handleFileUpload(file: File) {
    if (!file) return;
    setUploadBusy(true);
    setErrorMsg(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!TEXT_FILE_EXTS.has(ext)) {
        setErrorMsg(
          "Only text files (CSV, TSV, TXT, MD) are read in the browser. For PDF or DOCX, paste the extracted text into the field above."
        );
        return;
      }
      const text = await file.text();
      const block = `--- ${file.name} ---\n${text.trim()}`;
      if (mode === "amplifiers") {
        setLetter((prev) => (prev ? `${prev}\n\n${block}` : block));
      } else {
        setData((prev) => (prev ? `${prev}\n\n${block}` : block));
      }
    } catch {
      setErrorMsg("Couldn't read that file.");
    } finally {
      setUploadBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRun() {
    if (!requiredFilled || status === "streaming") return;
    setOutput("");
    setErrorMsg(null);
    setUsage(null);
    setSavedMsg(null);
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/audience", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode,
          industry,
          context: context.trim() || undefined,
          letter: letter.trim() || undefined,
          data: data.trim() || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Request failed." }));
        throw new Error(err.error || `Request failed (${res.status}).`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body.");

      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const ev = JSON.parse(line);
            if (ev.type === "text") {
              setOutput((prev) => prev + ev.delta);
            } else if (ev.type === "done") {
              setUsage(ev.usage as Usage);
              setStatus("done");
            } else if (ev.type === "error") {
              setErrorMsg(ev.message || "Generation failed.");
              setStatus("error");
            }
          } catch {
            // ignore malformed line
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setErrorMsg(err instanceof Error ? err.message : "Generation failed.");
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setStatus(output ? "done" : "idle");
  }

  function handleReset() {
    abortRef.current?.abort();
    setContext("");
    setLetter("");
    setData("");
    setOutput("");
    setErrorMsg(null);
    setUsage(null);
    setStatus("idle");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(output);
      setSavedMsg("Copied to clipboard.");
      setTimeout(() => setSavedMsg(null), 2500);
    } catch {
      setSavedMsg("Copy failed — select and copy manually.");
    }
  }

  async function handleSaveToGoogleDocs() {
    try {
      await navigator.clipboard.writeText(output);
      window.open("https://docs.new", "_blank", "noopener,noreferrer");
      setSavedMsg("Copied. Paste (Cmd/Ctrl-V) into the new Google Doc.");
      setTimeout(() => setSavedMsg(null), 6000);
    } catch {
      setSavedMsg(
        "Couldn't copy automatically. Select text and copy manually."
      );
    }
  }

  const currentMode = MODES.find((m) => m.key === mode)!;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* LEFT — inputs */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-8">
            {/* Mode picker */}
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-navy">
                Inputs.
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => {
                      setMode(m.key);
                      setOutput("");
                      setErrorMsg(null);
                      setStatus("idle");
                    }}
                    className={`rounded-xl border p-3 text-left text-sm transition-all ${
                      mode === m.key
                        ? "border-accent bg-accent-soft text-navy"
                        : "border-border-default bg-background-soft text-foreground-muted hover:border-navy/30"
                    }`}
                  >
                    <div className="font-semibold text-navy">{m.label}</div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-foreground-subtle">
                {currentMode.tagline}
              </p>
            </div>

            {/* Industry */}
            <div className="mt-6">
              <label
                htmlFor="audience-industry"
                className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle"
              >
                Industry
              </label>
              <select
                id="audience-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-2 w-full appearance-none rounded-xl border border-border-default bg-background-soft px-4 py-3 text-base text-navy focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode-specific fields */}
            <div className="mt-5 space-y-5">
              {mode === "amplifiers" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                      Letter or core message
                    </label>
                    <textarea
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
                      placeholder="Paste the letter, or the 2-3 sentence core message. Or upload a text file below."
                      rows={6}
                      className="mt-2 w-full resize-y rounded-xl border border-border-default bg-background-soft px-4 py-3 text-base text-navy placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                      Extra context (optional)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Audiences you've already reached, voices to avoid, recent industry moments to anchor on…"
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-border-default bg-background-soft px-4 py-3 text-base text-navy placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                      Campaign context (optional)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder={
                        mode === "segmentation"
                          ? "What you're trying to do with this audience — message, goal, sequencing notes."
                          : "The campaign message you'll be sequencing for these people."
                      }
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-border-default bg-background-soft px-4 py-3 text-base text-navy placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                      {mode === "segmentation"
                        ? "Connections / followers (paste or upload)"
                        : "Profiles to brief (paste URLs, names, or content)"}
                    </label>
                    <textarea
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      placeholder={
                        mode === "segmentation"
                          ? "Paste a CSV export, a list of names + titles + companies, or notes on your audience. Or upload below."
                          : "One per line — LinkedIn profile URLs, or 'Name — Title at Company'. Or upload a CSV / list below."
                      }
                      rows={10}
                      className="mt-2 w-full resize-y rounded-xl border border-border-default bg-background-soft px-4 py-3 font-mono text-sm text-navy placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </>
              )}

              {/* File upload (text files only — PDF/DOCX users paste) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
                  Or upload a text file
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt,.md,.markdown,text/plain,text/csv,text/markdown"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  disabled={uploadBusy}
                  className="mt-2 block w-full text-sm text-foreground-muted file:mr-4 file:rounded-full file:border-0 file:bg-navy file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-white file:transition-colors hover:file:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-40"
                />
                <p className="mt-1.5 text-xs leading-5 text-foreground-subtle">
                  CSV, TSV, TXT, or Markdown. For PDF / DOCX, paste the
                  extracted text into the field above. Contents append on
                  upload.
                </p>
                {uploadBusy && (
                  <p className="mt-2 font-mono text-xs text-accent-hover">
                    Reading file…
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={!requiredFilled || status === "streaming"}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-navy px-6 text-sm font-medium text-white transition-all hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-navy"
              >
                {status === "streaming" ? "Running…" : "Run"}
                <span className="font-mono text-xs text-white/60">↵</span>
              </button>
              {status === "streaming" && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="inline-flex h-12 items-center rounded-full border border-border-strong bg-white px-6 text-sm font-medium text-navy hover:border-navy"
                >
                  Stop
                </button>
              )}
              {(output || errorMsg) && status !== "streaming" && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-12 items-center rounded-full border border-border-default bg-white px-6 text-sm font-medium text-foreground-muted hover:border-navy hover:text-navy"
                >
                  Reset
                </button>
              )}
              <span className="font-mono text-xs text-foreground-subtle">
                Inputs are sent to Anthropic for generation only. Nothing is
                saved.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — output */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-navy">
                Result.
              </h2>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider sm:text-xs ${
                  status === "error"
                    ? "text-red-600"
                    : status === "streaming"
                      ? "text-accent-hover"
                      : "text-foreground-subtle"
                }`}
              >
                {statusLine}
              </span>
            </div>

            <div
              ref={outputRef}
              className="mt-6 max-h-[70vh] min-h-[400px] overflow-auto rounded-xl border border-border-default bg-background-soft p-5 font-serif text-[15px] leading-7 text-navy"
            >
              {output ? (
                <div className="whitespace-pre-wrap">{output}</div>
              ) : status === "error" ? (
                <p className="font-mono text-sm text-red-600">{errorMsg}</p>
              ) : (
                <p className="font-mono text-sm text-foreground-subtle">
                  Awaiting RUN command. Pick a mode on the left, fill in the
                  required field, then run.
                </p>
              )}
              {status === "streaming" && (
                <span
                  aria-hidden
                  className="ml-1 inline-block h-4 w-2 animate-pulse bg-accent align-middle"
                />
              )}
            </div>

            {usage && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-foreground-subtle">
                <span>in: {usage.input_tokens}</span>
                <span>out: {usage.output_tokens}</span>
                {usage.cache_read_input_tokens > 0 && (
                  <span className="text-accent-hover">
                    cached: {usage.cache_read_input_tokens}
                  </span>
                )}
              </div>
            )}

            {status === "done" && output && (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border-default pt-5">
                <button
                  type="button"
                  onClick={handleSaveToGoogleDocs}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition-all hover:bg-accent-hover"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 13h6M9 17h6" />
                  </svg>
                  Save to Google Docs
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex h-11 items-center rounded-full border border-border-strong bg-white px-5 text-sm font-medium text-navy hover:border-navy"
                >
                  Copy text
                </button>
                {savedMsg && (
                  <span className="font-mono text-xs text-accent-hover">
                    {savedMsg}
                  </span>
                )}
              </div>
            )}

            {status === "done" && output && (
              <div className="mt-5">
                <LeadForm
                  tool="audience"
                  ctaLabel="Have us follow up"
                  intent={`Working session on ${mode} analysis`}
                  getContext={() => output}
                  theme="firstshift"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
