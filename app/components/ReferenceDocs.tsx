"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RefDoc = {
  id: string;
  name: string;
  source: "text" | "gdoc" | "file";
  sourceUrl?: string;
  originalFilename?: string;
  fileKind?: "pdf" | "docx" | "text";
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "movementum_refdocs_v1";
const MAX_DOCS = 25;
const MAX_TOTAL_CHARS = 600_000;

function loadFromStorage(): RefDoc[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RefDoc[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(docs: RefDoc[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    // Quota exceeded most likely
    console.warn("Couldn't save reference docs to localStorage:", err);
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Single source of truth: useReferenceDocs returns the docs + setter so the
// parent component can include them in its API call.
export function useReferenceDocs(): [RefDoc[], (docs: RefDoc[]) => void] {
  const [docs, setDocsState] = useState<RefDoc[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    setDocsState(loadFromStorage());
    hydrated.current = true;
  }, []);

  const setDocs = useCallback((next: RefDoc[]) => {
    setDocsState(next);
    saveToStorage(next);
  }, []);

  return [docs, setDocs];
}

export default function ReferenceDocs({
  docs,
  setDocs,
}: {
  docs: RefDoc[];
  setDocs: (docs: RefDoc[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [mode, setMode] = useState<"gdoc" | "text" | "file">("gdoc");
  const [gdocUrl, setGdocUrl] = useState("");
  const [textName, setTextName] = useState("");
  const [textBody, setTextBody] = useState("");
  const [fileBusy, setFileBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalChars = useMemo(
    () => docs.reduce((acc, d) => acc + d.content.length, 0),
    [docs]
  );

  function resetForm() {
    setGdocUrl("");
    setTextName("");
    setTextBody("");
    setOpError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addDoc(partial: Omit<RefDoc, "id" | "createdAt">) {
    if (docs.length >= MAX_DOCS) {
      setOpError(`Reached the ${MAX_DOCS}-doc limit. Remove one to add another.`);
      return false;
    }
    const newTotal = totalChars + partial.content.length;
    if (newTotal > MAX_TOTAL_CHARS) {
      setOpError(
        `Adding this would exceed the total cap (${MAX_TOTAL_CHARS.toLocaleString()} chars across all docs). This doc has ${partial.content.length.toLocaleString()} chars; current total is ${totalChars.toLocaleString()}.`
      );
      return false;
    }
    const doc: RefDoc = {
      ...partial,
      id: newId(),
      createdAt: new Date().toISOString(),
    };
    setDocs([doc, ...docs]);
    return true;
  }

  async function handleFileChosen(file: File) {
    if (!file) return;
    setFileBusy(true);
    setOpError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-doc", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setOpError(data.error || "Couldn't parse that file.");
        return;
      }
      const ok = addDoc({
        name: data.name,
        content: data.content,
        source: "file",
        fileKind: data.kind,
        originalFilename: data.originalFilename,
      });
      if (ok) {
        resetForm();
        setAdding(false);
      }
    } catch {
      setOpError("Network error uploading the file.");
    } finally {
      setFileBusy(false);
    }
  }

  async function handleAddGdoc() {
    if (!gdocUrl.trim()) {
      setOpError("Paste a Google Docs URL.");
      return;
    }
    setBusy(true);
    setOpError(null);
    try {
      const res = await fetch("/api/fetch-doc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: gdocUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOpError(data.error || "Couldn't fetch that doc.");
        return;
      }
      const ok = addDoc({
        name: data.name,
        content: data.content,
        source: "gdoc",
        sourceUrl: data.sourceUrl,
      });
      if (ok) {
        resetForm();
        setAdding(false);
      }
    } catch {
      setOpError("Network error fetching the doc.");
    } finally {
      setBusy(false);
    }
  }

  function handleAddText() {
    if (!textName.trim() || !textBody.trim()) {
      setOpError("Both name and content are required.");
      return;
    }
    setBusy(true);
    const ok = addDoc({
      name: textName.trim(),
      content: textBody,
      source: "text",
    });
    if (ok) {
      resetForm();
      setAdding(false);
    }
    setBusy(false);
  }

  function handleDelete(id: string) {
    setDocs(docs.filter((d) => d.id !== id));
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-zinc-900 sm:text-2xl">
            Reference documents.
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Optional. Add prior letters, brand voice notes, or industry
            background. The model uses them to inform tone and substance —
            never quoted verbatim. Saved in this browser only.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {docs.length} / {MAX_DOCS} · {totalChars.toLocaleString()} chars
        </span>
      </div>

      {/* Existing docs */}
      {docs.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[9px] font-bold uppercase ${
                  d.source === "gdoc"
                    ? "bg-blue-100 text-blue-700"
                    : d.source === "file"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-zinc-200 text-zinc-700"
                }`}
                aria-hidden
              >
                {d.source === "gdoc"
                  ? "GD"
                  : d.source === "file"
                    ? d.fileKind === "pdf"
                      ? "PDF"
                      : d.fileKind === "docx"
                        ? "DOC"
                        : "TXT"
                    : "TX"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-zinc-900">
                  {d.name}
                </div>
                <div className="mt-0.5 font-mono text-[10px] tracking-wide text-zinc-500">
                  {d.content.length.toLocaleString()} chars
                  {d.sourceUrl && (
                    <>
                      {" · "}
                      <a
                        href={d.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-brand"
                      >
                        source
                      </a>
                    </>
                  )}
                  {d.originalFilename && <> {" · "}{d.originalFilename}</>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(d.id)}
                className="text-[10px] font-mono font-bold tracking-[0.18em] text-zinc-400 hover:text-red-600"
                aria-label={`Remove ${d.name}`}
              >
                REMOVE
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 font-mono text-xs text-zinc-400">
          // No reference documents yet.
        </p>
      )}

      {/* Add controls */}
      {!adding ? (
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setOpError(null);
          }}
          disabled={docs.length >= MAX_DOCS}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-xs font-mono font-bold tracking-[0.18em] text-zinc-900 transition-colors hover:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="font-mono text-base leading-none">+</span>
          ADD REFERENCE DOCUMENT
        </button>
      ) : (
        <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex flex-wrap gap-2">
            {(["gdoc", "file", "text"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setOpError(null);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === m
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                {m === "gdoc"
                  ? "Google Docs URL"
                  : m === "file"
                    ? "Upload file"
                    : "Paste text"}
              </button>
            ))}
          </div>

          {mode === "gdoc" ? (
            <div className="mt-4">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
                Public Google Docs URL
              </label>
              <input
                type="url"
                value={gdocUrl}
                onChange={(e) => setGdocUrl(e.target.value)}
                placeholder="https://docs.google.com/document/d/.../edit"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                The doc must be shared &ldquo;Anyone with the link · Viewer&rdquo;
                (no Google sign-in required to add it).
              </p>
            </div>
          ) : mode === "file" ? (
            <div className="mt-4">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
                Upload PDF, Word, text, markdown, or CSV
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md,.markdown,.csv,.tsv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileChosen(f);
                }}
                disabled={fileBusy}
                className="mt-2 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-5 file:py-2.5 file:text-xs file:font-mono file:font-bold file:uppercase file:tracking-[0.18em] file:text-white file:transition-colors hover:file:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
              />
              {fileBusy && (
                <p className="mt-2 font-mono text-xs text-brand">
                  Parsing file…
                </p>
              )}
              <p className="mt-1.5 text-xs text-zinc-500">
                Max 15 MB. PDFs need selectable text — scanned image-only
                PDFs won&rsquo;t work.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Document name
                </label>
                <input
                  type="text"
                  value={textName}
                  onChange={(e) => setTextName(e.target.value)}
                  placeholder="e.g. Brand voice notes"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Content
                </label>
                <textarea
                  rows={6}
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  placeholder="Paste the text…"
                  className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand focus:outline-none"
                />
              </div>
            </div>
          )}

          {opError && (
            <p className="mt-3 text-xs text-red-600">{opError}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {mode !== "file" && (
              <button
                type="button"
                onClick={mode === "gdoc" ? handleAddGdoc : handleAddText}
                disabled={busy}
                className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "Saving…" : "Save document"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                resetForm();
              }}
              disabled={busy || fileBusy}
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
