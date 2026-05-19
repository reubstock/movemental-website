"use client";

import { useState } from "react";

type Tool = "matic" | "cartographer" | "audience";
type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function LeadForm({
  tool,
  ctaLabel,
  intent,
  getContext,
}: {
  tool: Tool;
  /** The big button label users click to expand the form. */
  ctaLabel: string;
  /** Subject-line addendum so Reuben sees what intent they clicked. */
  intent: string;
  /** Function that returns the current tool output to send as context. */
  getContext: () => string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = name.trim().length > 0 && validEmail && status !== "sending";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          name: name.trim(),
          email: email.trim(),
          message: message.trim() || undefined,
          context: getContext(),
          intent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status}).`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Send failed.");
    }
  }

  // ---- THEME -----------------------------------------------------
  const primaryBtn = "bg-brand hover:bg-[#0091c2] text-white";
  const linkColor = "text-brand";
  const focusBorder = "focus:border-brand";
  const cardBorder = "border-zinc-200";
  const cardBg = "bg-zinc-50";
  const labelText = "text-zinc-500";
  const inputBorder = "border-zinc-200";
  const headingText = "text-zinc-900";
  const mutedText = "text-zinc-600";

  // ---- STATES ----------------------------------------------------
  if (status === "success") {
    return (
      <div
        className={`rounded-2xl border ${cardBorder} bg-white p-5 sm:p-6`}
      >
        <div
          className={`text-[10px] font-mono font-bold tracking-[0.18em] uppercase ${linkColor}`}
        >
          ✓ Sent
        </div>
        <h3 className={`mt-1 text-xl font-bold ${headingText}`}>
          Reuben will follow up.
        </h3>
        <p className={`mt-2 text-sm ${mutedText}`}>
          Got it. Your message and the tool output landed in his inbox.
          Expect a reply at <strong>{email}</strong> within a day.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full ${primaryBtn} px-6 py-3 text-sm font-semibold transition-colors`}
      >
        {ctaLabel}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div
          className={`text-[10px] font-mono font-bold tracking-[0.18em] uppercase ${linkColor}`}
        >
          Have Reuben follow up
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setStatus("idle");
            setErrorMsg(null);
          }}
          aria-label="Close form"
          className={`text-xs font-mono ${labelText} hover:${headingText}`}
        >
          Cancel
        </button>
      </div>
      <p className={`mt-1 text-sm ${mutedText}`}>
        We&rsquo;ll send your message + the result above to Reuben at{" "}
        <span className="font-mono text-xs">reubstock@gmail.com</span>.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`lead-name-${tool}`}
            className={`block text-[10px] font-mono font-bold uppercase tracking-[0.18em] ${labelText}`}
          >
            Name
          </label>
          <input
            id={`lead-name-${tool}`}
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={`mt-1.5 w-full rounded-md border ${inputBorder} bg-white px-3 py-2.5 text-sm ${headingText} placeholder:text-zinc-400 ${focusBorder} focus:outline-none`}
          />
        </div>
        <div>
          <label
            htmlFor={`lead-email-${tool}`}
            className={`block text-[10px] font-mono font-bold uppercase tracking-[0.18em] ${labelText}`}
          >
            Email
          </label>
          <input
            id={`lead-email-${tool}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`mt-1.5 w-full rounded-md border ${inputBorder} bg-white px-3 py-2.5 text-sm ${headingText} placeholder:text-zinc-400 ${focusBorder} focus:outline-none`}
          />
        </div>
      </div>

      <div className="mt-3">
        <label
          htmlFor={`lead-msg-${tool}`}
          className={`block text-[10px] font-mono font-bold uppercase tracking-[0.18em] ${labelText}`}
        >
          Anything to add? (optional)
        </label>
        <textarea
          id={`lead-msg-${tool}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="A line about timing, scope, or what you&rsquo;re trying to ship."
          className={`mt-1.5 w-full resize-y rounded-md border ${inputBorder} bg-white px-3 py-2.5 text-sm ${headingText} placeholder:text-zinc-400 ${focusBorder} focus:outline-none`}
        />
      </div>

      {errorMsg && (
        <p className="mt-3 text-xs text-red-600">{errorMsg}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className={`inline-flex items-center rounded-full ${primaryBtn} px-6 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {status === "sending" ? "Sending…" : "Send to Reuben"}
        </button>
        <span className={`text-xs ${labelText}`}>
          We&rsquo;ll include the result above as context.
        </span>
      </div>
    </form>
  );
}
