"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function EngageForm() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit =
    name.trim().length > 0 &&
    organization.trim().length > 0 &&
    validEmail &&
    status !== "sending";

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
          tool: "engage",
          name: name.trim(),
          organization: organization.trim(),
          email: email.trim(),
          message: message.trim() || undefined,
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

  function reset() {
    setName("");
    setOrganization("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMsg(null);
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-7 md:p-9">
        <div className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-brand">
          ✓ Sent
        </div>
        <h3 className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-zinc-900">
          Got it.
        </h3>
        <p className="mt-3 text-base md:text-lg text-zinc-600 leading-relaxed">
          Your message is in. Expect a reply at{" "}
          <strong className="text-zinc-900">{email}</strong> within a day.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 text-xs font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-zinc-200 bg-white p-7 md:p-9"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="engage-name"
            className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500"
          >
            Name
          </label>
          <input
            id="engage-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="engage-org"
            className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500"
          >
            Organization
          </label>
          <input
            id="engage-org"
            type="text"
            required
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Where you work"
            className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="engage-email"
          className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          Email
        </label>
        <input
          id="engage-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-2 w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none transition-colors"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="engage-message"
          className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          What are you trying to build? <span className="font-sans normal-case tracking-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          id="engage-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="A line about the audience, the moment, the unsaid truth, or the change you want."
          className="mt-2 w-full resize-y rounded-md border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none transition-colors leading-relaxed"
        />
      </div>

      {errorMsg && (
        <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center bg-brand hover:bg-[#0091c2] disabled:opacity-40 disabled:cursor-not-allowed text-white px-7 py-3.5 text-sm font-extrabold tracking-wide rounded transition-colors"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <span className="text-xs text-zinc-500">
          Goes straight to Reuben. We&rsquo;ll reply within a day.
        </span>
      </div>
    </form>
  );
}
