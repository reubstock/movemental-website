"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
import {
  parseConnections,
  matchTargets,
  formatDate,
  type ParseResult,
  type Match,
  type Person,
} from "./lib";
import LeadForm from "../../components/LeadForm";

type View = "map" | "network";
type Status = "idle" | "parsing" | "done" | "error";

const ACCENT = "#0891b2";
const ACCENT_HOVER = "#0e7490";
const NAVY = "#0b1727";
const NAVY_SOFT = "#1a2942";
const MUTED = "#475569";
const SUBTLE = "#64748b";
const SELECTED = "#dc2626";

// Sequential color scale by company group size, used by both views.
const SIZE_TIERS = [
  { min: 20, color: "#0e7490", label: "20+" },
  { min: 10, color: "#0891b2", label: "10–19" },
  { min: 5, color: "#5dd0f5", label: "5–9" },
  { min: 2, color: "#b8e6f9", label: "2–4" },
];

function sizeToColor(n: number): string {
  for (const t of SIZE_TIERS) if (n >= t.min) return t.color;
  return SIZE_TIERS[SIZE_TIERS.length - 1].color;
}

// Force-directed graph caps so the layout stays interactive on big networks.
const NETWORK_MAX_COMPANIES = 80;
const NETWORK_MAX_PEOPLE_PER_COMPANY = 15;

export default function NetworkCartographer() {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [view, setView] = useState<View>("map");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [targetText, setTargetText] = useState("");
  const [matches, setMatches] = useState<Match[] | null>(null);

  const [dragOver, setDragOver] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<
    d3.SimulationNodeDatum,
    undefined
  > | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

  const zoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(220)
      .call(zoomRef.current.scaleBy, 1.5);
  }, []);

  const zoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(220)
      .call(zoomRef.current.scaleBy, 1 / 1.5);
  }, []);

  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(360)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  // ---------------------------------------------------------------------------
  // File handling
  // ---------------------------------------------------------------------------
  const handleFile = useCallback(async (file: File) => {
    setStatus("parsing");
    setErrorMsg(null);
    setSelectedKey(null);
    setMatches(null);
    try {
      const raw = await file.text();
      const parsed = parseConnections(raw);
      if (parsed.totalConnections === 0) {
        setStatus("error");
        setErrorMsg(
          "No connections found in that file. Make sure it's the LinkedIn Connections.csv export."
        );
        return;
      }
      setResult(parsed);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErrorMsg(
        e instanceof Error ? e.message : "Couldn't parse that file."
      );
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFilePicked = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const reset = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setErrorMsg(null);
    setView("map");
    setSelectedKey(null);
    setTargetText("");
    setMatches(null);
  }, []);

  // ---------------------------------------------------------------------------
  // Chart sizing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const el = chartContainerRef.current;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setChartWidth(Math.floor(entry.contentRect.width));
      }
    });
    obs.observe(el);
    setChartWidth(el.clientWidth);
    return () => obs.disconnect();
  }, [result]);

  // ---------------------------------------------------------------------------
  // Filtered company list (multi-connection)
  // ---------------------------------------------------------------------------
  const multiCompanies = useMemo(() => {
    if (!result) return [];
    return Array.from(result.groups.values())
      .filter((g) => g.people.length > 1)
      .sort((a, b) => b.people.length - a.people.length);
  }, [result]);

  // ---------------------------------------------------------------------------
  // D3 — draw chart (bubble pack or force-directed) on view / data change
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!result || !svgRef.current || chartWidth === 0) return;

    const width = chartWidth;
    const height = 560;

    // Tear down anything we previously drew
    simulationRef.current?.stop();
    simulationRef.current = null;
    zoomRef.current = null;
    const svg = d3.select(svgRef.current);
    svg.on(".zoom", null); // clear any previous zoom listeners
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    if (view === "map") {
      const zoom = drawBubbles(
        svg,
        multiCompanies,
        width,
        height,
        setSelectedKey
      );
      zoomRef.current = zoom;
    } else {
      const { simulation, zoom } = drawNetwork(
        svg,
        multiCompanies,
        width,
        height,
        setSelectedKey
      );
      simulationRef.current = simulation;
      zoomRef.current = zoom;
    }

    return () => {
      simulationRef.current?.stop();
      simulationRef.current = null;
      zoomRef.current = null;
    };
  }, [result, view, chartWidth, multiCompanies]);

  // ---------------------------------------------------------------------------
  // D3 — update selection highlight without redrawing
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll<SVGElement, unknown>(".cartographer-node").each(function () {
      const node = d3.select(this);
      const key = node.attr("data-company-key");
      const isSelected = !!selectedKey && key === selectedKey;
      const size = Number(node.attr("data-size")) || 2;
      const tintFill = sizeToColor(size);
      node.select("circle").attr("stroke", isSelected ? SELECTED : ACCENT);
      node
        .select("circle")
        .attr("stroke-width", isSelected ? 2.5 : 1);
      node
        .select("circle")
        .attr(
          "fill",
          isSelected
            ? view === "map"
              ? "rgba(220, 38, 38, 0.22)"
              : SELECTED
            : tintFill
        );
    });
  }, [selectedKey, view, result]);

  // ---------------------------------------------------------------------------
  // Target matching
  // ---------------------------------------------------------------------------
  const runMatch = useCallback(() => {
    if (!result) return;
    const lines = targetText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    setMatches(matchTargets(lines, result.groups));
  }, [result, targetText]);

  const downloadMatches = useCallback(() => {
    if (!matches) return;
    const rows: string[] = ["query,matched_company,connection_name,position"];
    for (const m of matches) {
      if (m.people.length === 0) {
        rows.push(`${csvCell(m.query)},${csvCell(m.matchedCompanyName ?? "")},,`);
      } else {
        for (const p of m.people) {
          rows.push(
            `${csvCell(m.query)},${csvCell(m.matchedCompanyName ?? "")},${csvCell(p.fullName)},${csvCell(p.position)}`
          );
        }
      }
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartographer-matches-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [matches]);

  // ---------------------------------------------------------------------------
  // Derived: selected company group + sorted people
  // ---------------------------------------------------------------------------
  const selectedGroup = useMemo(() => {
    if (!result || !selectedKey) return null;
    return result.groups.get(selectedKey) ?? null;
  }, [result, selectedKey]);

  const selectedPeople = useMemo(() => {
    if (!selectedGroup) return [];
    return [...selectedGroup.people].sort((a, b) =>
      a.lastName.localeCompare(b.lastName)
    );
  }, [selectedGroup]);

  const matchSummary = useMemo(() => {
    if (!matches) return null;
    const total = matches.reduce((acc, m) => acc + m.people.length, 0);
    const hit = matches.filter((m) => m.people.length > 0).length;
    return { total, hit, queried: matches.length };
  }, [matches]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <a
            href="/tools"
            className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-foreground-subtle hover:text-navy"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m11 18-6-6 6-6" />
            </svg>
            All tools
          </a>
          <div className="mt-3">
            <Eyebrow>Tools · CARTOGRAPHER</Eyebrow>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl md:text-6xl">
            Connections <span className="gradient-text">→ Warm Targets</span>.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground-muted sm:text-xl">
            Drop in your LinkedIn connections export. See where your network
            is dense, find the companies where you already know someone, and
            match against any target list — all in your browser. Nothing
            leaves this page.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
        {status !== "done" || !result ? (
          <DropZone
            status={status}
            errorMsg={errorMsg}
            dragOver={dragOver}
            setDragOver={setDragOver}
            onDrop={onDrop}
            onFilePicked={onFilePicked}
          />
        ) : (
          <>
            {/* STATS */}
            <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-7">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border-default sm:grid-cols-4">
                <Stat
                  label="Connections"
                  value={result.totalConnections.toLocaleString()}
                />
                <Stat
                  label="Unique companies"
                  value={result.uniqueCompanies.toLocaleString()}
                />
                <Stat
                  label="Multi-connection cos."
                  value={result.multiCompanies.toLocaleString()}
                  sub={`where you know 2+`}
                />
                <Stat
                  label="Range"
                  value={
                    result.earliest && result.latest
                      ? `${formatDate(result.earliest)} → ${formatDate(result.latest)}`
                      : "—"
                  }
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-foreground-subtle">
                  Processed locally. No upload, no analytics.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium uppercase tracking-wider text-foreground-subtle hover:text-navy"
                >
                  Clear &amp; start over
                </button>
              </div>
            </div>

            {/* CHART + SIDE PANEL */}
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-medium text-accent-hover">
                      THE NETWORK
                    </span>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                      Companies where you know 2 or more
                    </h2>
                  </div>
                  <ViewToggle view={view} setView={setView} />
                </div>

                <div
                  ref={chartContainerRef}
                  className="relative mt-5 w-full overflow-hidden rounded-2xl border border-border-default bg-background-soft"
                  style={{ minHeight: 560 }}
                >
                  <svg ref={svgRef} width="100%" height={560} />

                  {/* Zoom controls — top-right overlay */}
                  <div className="absolute right-3 top-3 flex flex-col gap-1.5">
                    <ZoomButton
                      onClick={zoomIn}
                      label="Zoom in"
                      iconKey="plus"
                    />
                    <ZoomButton
                      onClick={zoomOut}
                      label="Zoom out"
                      iconKey="minus"
                    />
                    <ZoomButton
                      onClick={resetZoom}
                      label="Reset view"
                      iconKey="reset"
                    />
                  </div>

                  {/* Hint — bottom-left overlay */}
                  <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                      scroll · pinch · drag to pan
                    </span>
                  </div>
                </div>

                {/* Size legend + caption */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-subtle">
                  <span className="font-mono font-bold tracking-wider uppercase">
                    Size
                  </span>
                  {SIZE_TIERS.slice()
                    .reverse()
                    .map((t) => (
                      <span
                        key={t.min}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-full border border-accent/30"
                          style={{ background: t.color }}
                          aria-hidden
                        />
                        {t.label}
                      </span>
                    ))}
                  <span className="inline-flex items-center gap-1.5 border-l border-border-default pl-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full border-2"
                      style={{ borderColor: SELECTED }}
                      aria-hidden
                    />
                    selected
                  </span>
                </div>

                <p className="mt-2 text-xs text-foreground-subtle">
                  {view === "map" ? (
                    <>
                      Each circle is a company. Size = how many people you
                      know there. Click a circle to see them.
                    </>
                  ) : (
                    <>
                      Each dot is a person, colored by the size of their
                      company group. Edges connect people at the same
                      company — inferred from coworker overlap, not actual
                      relationships. Limited to the top{" "}
                      {NETWORK_MAX_COMPANIES} multi-connection companies for
                      readability.
                    </>
                  )}
                </p>
              </div>

              <SidePanel
                group={selectedGroup}
                people={selectedPeople}
                onClose={() => setSelectedKey(null)}
              />
            </div>

            {/* TOP COMPANIES TABLE */}
            <div className="mt-8 rounded-3xl border border-border-default bg-white p-6 sm:p-7">
              <span className="font-mono text-xs font-medium text-accent-hover">
                TOP 30
              </span>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                Where your network is densest
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-border-default sm:grid-cols-2 lg:grid-cols-3">
                {multiCompanies.slice(0, 30).map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    onClick={() => setSelectedKey(g.key)}
                    className={`flex items-baseline justify-between gap-4 bg-white px-4 py-3 text-left transition-colors hover:bg-accent-soft ${
                      selectedKey === g.key ? "bg-accent-soft" : ""
                    }`}
                  >
                    <span className="truncate text-sm font-medium text-navy">
                      {g.name}
                    </span>
                    <span className="font-mono text-xs font-medium text-accent-hover">
                      {g.people.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* TARGET MATCHER */}
            <div className="mt-8 rounded-3xl border border-border-default bg-white p-6 sm:p-7">
              <span className="font-mono text-xs font-medium text-accent-hover">
                THE PROSPECTOR
              </span>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
                Match against a target list
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-foreground-muted">
                Paste a list of target companies (one per line). For each
                one, we&rsquo;ll show the people in your network who work
                there. Fuzzy-matched on common variants (Stripe ≈ Stripe
                Inc. ≈ Stripe AI).
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
                <textarea
                  value={targetText}
                  onChange={(e) => setTargetText(e.target.value)}
                  rows={8}
                  placeholder={
                    "Acme Corp\nNorthwind Logistics\nStripe\nAnthropic\n…"
                  }
                  className="w-full resize-y rounded-2xl border border-border-default bg-white px-4 py-3 text-sm leading-6 text-navy placeholder:text-foreground-subtle focus:border-accent focus:outline-none"
                />
                <div className="flex flex-row gap-2 md:flex-col">
                  <button
                    type="button"
                    onClick={runMatch}
                    disabled={!targetText.trim()}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy px-6 text-sm font-medium text-white transition-all hover:bg-navy-soft disabled:opacity-40 disabled:cursor-not-allowed md:px-8"
                  >
                    Match
                  </button>
                  {matches && matches.length > 0 && (
                    <button
                      type="button"
                      onClick={downloadMatches}
                      className="inline-flex h-12 items-center justify-center rounded-full border border-border-strong bg-white px-6 text-sm font-medium text-navy transition-all hover:border-navy md:px-8"
                    >
                      Export CSV
                    </button>
                  )}
                </div>
              </div>

              {matchSummary && matches && (
                <div className="mt-7">
                  <div className="font-mono text-xs uppercase tracking-wider text-foreground-subtle">
                    {matchSummary.hit} of {matchSummary.queried} targets had a
                    match · {matchSummary.total} warm contacts total
                  </div>
                  <div className="mt-4 grid gap-3">
                    {matches.map((m, i) => (
                      <MatchRow key={`${m.query}-${i}`} match={m} />
                    ))}
                  </div>
                </div>
              )}

              {matchSummary && matches && matchSummary.total > 0 && (
                <div className="mt-7">
                  <LeadForm
                    tool="cartographer"
                    ctaLabel="Have us follow up"
                    intent="Run outreach to warm contacts"
                    getContext={() => formatMatchesForLead(matches)}
                    theme="firstshift"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* PAIR WITH MATIC CTA */}
      {status === "done" && result && (
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-24">
          <div className="overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Pair with MATIC
              </div>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                You know the companies. Now write the letter that gets sent
                to them.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/70">
                The Cartographer tells you the warm contacts. MATIC writes
                the Open Letter they&rsquo;ll forward. Together, the first
                two weeks of a campaign collapse into an afternoon.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/matic"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-navy transition-all hover:bg-white/90"
                >
                  Open MATIC
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
                </a>
                <a
                  href="mailto:reubstock@gmail.com?subject=Movementum%20%E2%80%94%20Cartographer"
                  className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Get in touch
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ===========================================================================
// Subcomponents
// ===========================================================================

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-hover">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-xs text-foreground-subtle">{sub}</div>
      )}
    </div>
  );
}

function ViewToggle({
  view,
  setView,
}: {
  view: View;
  setView: (v: View) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border-default bg-background-soft p-1">
      {(["map", "network"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
            view === v
              ? "bg-navy text-white"
              : "text-foreground-subtle hover:text-navy"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

function DropZone({
  status,
  errorMsg,
  dragOver,
  setDragOver,
  onDrop,
  onFilePicked,
}: {
  status: Status;
  errorMsg: string | null;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFilePicked: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <label
        htmlFor="cartographer-file"
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={onDrop}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white px-8 py-20 text-center transition-colors ${
          dragOver
            ? "border-accent bg-accent-soft"
            : "border-border-strong hover:border-accent"
        }`}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground-subtle group-hover:text-accent-hover"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div className="mt-5 text-base font-semibold text-navy sm:text-lg">
          Drop your <code className="font-mono text-accent-hover">Connections.csv</code>{" "}
          here
        </div>
        <div className="mt-2 text-sm text-foreground-muted">
          Or click to browse. From LinkedIn:{" "}
          <em>Settings → Data privacy → Get a copy of your data → Connections</em>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border-default bg-background-soft px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground-subtle">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Local-only · nothing uploaded
        </div>
        <input
          id="cartographer-file"
          type="file"
          accept=".csv,text/csv"
          onChange={onFilePicked}
          className="hidden"
        />
      </label>
      {status === "parsing" && (
        <p className="mt-4 text-center text-sm text-foreground-muted">
          Parsing…
        </p>
      )}
      {status === "error" && errorMsg && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

function SidePanel({
  group,
  people,
  onClose,
}: {
  group: { name: string; key: string; people: Person[] } | null;
  people: Person[];
  onClose: () => void;
}) {
  return (
    <aside className="rounded-3xl border border-border-default bg-white p-6 sm:p-7">
      {!group ? (
        <div className="flex h-full flex-col items-start justify-start">
          <span className="font-mono text-xs font-medium text-accent-hover">
            SELECTION
          </span>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy">
            Click a circle
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground-muted">
            Each company in your network is shown. Click a circle (or a row
            in the Top 30 below) to see the people you know there.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-medium text-accent-hover">
                {group.people.length}{" "}
                {group.people.length === 1 ? "person" : "people"}
              </span>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy">
                {group.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="rounded-full p-1 text-foreground-subtle hover:bg-background-soft hover:text-navy"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <ul className="mt-5 divide-y divide-border-default">
            {people.map((p, i) => (
              <li key={`${p.fullName}-${i}`} className="py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm font-medium text-navy hover:text-accent-hover"
                      >
                        {p.fullName}
                      </a>
                    ) : (
                      <div className="truncate text-sm font-medium text-navy">
                        {p.fullName}
                      </div>
                    )}
                    {p.position && (
                      <div className="mt-0.5 truncate text-xs text-foreground-muted">
                        {p.position}
                      </div>
                    )}
                  </div>
                  {p.connectedDate && (
                    <div className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-foreground-subtle">
                      {formatDate(p.connectedDate)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

function ZoomButton({
  onClick,
  label,
  iconKey,
}: {
  onClick: () => void;
  label: string;
  iconKey: "plus" | "minus" | "reset";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-white text-navy shadow-sm transition-colors hover:border-accent hover:text-accent-hover"
    >
      {iconKey === "plus" && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
      {iconKey === "minus" && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
      {iconKey === "reset" && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="4 14 4 20 10 20" />
          <polyline points="20 10 20 4 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      )}
    </button>
  );
}

function MatchRow({ match }: { match: Match }) {
  const hit = match.people.length > 0;
  return (
    <div className="rounded-2xl border border-border-default bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-navy">
            {match.query}
          </div>
          {hit && match.matchedCompanyName !== match.query && (
            <div className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-wider text-foreground-subtle">
              Matched as {match.matchedCompanyName}
            </div>
          )}
        </div>
        <div
          className={`font-mono text-[11px] uppercase tracking-wider ${
            hit ? "text-accent-hover" : "text-foreground-subtle"
          }`}
        >
          {hit
            ? `${match.people.length} ${match.people.length === 1 ? "contact" : "contacts"}`
            : "No match"}
        </div>
      </div>
      {hit && (
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {match.people.map((p, i) => (
            <li key={`${p.fullName}-${i}`} className="text-sm">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy hover:text-accent-hover"
                >
                  {p.fullName}
                </a>
              ) : (
                <span className="text-navy">{p.fullName}</span>
              )}
              {p.position && (
                <span className="text-foreground-subtle"> · {p.position}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ===========================================================================
// D3 drawing
// ===========================================================================

type CompanyNode = {
  name: string;
  key: string;
  people: Person[];
};

function drawBubbles(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  companies: CompanyNode[],
  width: number,
  height: number,
  onSelect: (key: string) => void
): d3.ZoomBehavior<SVGSVGElement, unknown> | null {
  if (companies.length === 0) {
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", SUBTLE)
      .style("font-family", "Inter, sans-serif")
      .style("font-size", 14)
      .text(
        "No company has more than one connection — nothing to map. Add target list below."
      );
    return null;
  }

  type PackInput = { name: string; children: CompanyNode[] };
  const root = d3
    .hierarchy<PackInput | CompanyNode>(
      { name: "root", children: companies } as PackInput,
      (d) => (d as PackInput).children
    )
    .sum((d) => ("people" in d ? (d as CompanyNode).people.length : 0))
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  const pack = d3
    .pack<PackInput | CompanyNode>()
    .size([width, height])
    .padding(3);
  pack(root);

  const leaves = root.leaves() as d3.HierarchyCircularNode<CompanyNode>[];

  // Root <g> — everything inside gets zoomed/panned by the zoom behavior
  const zoomLayer = svg.append("g");

  const nodes = zoomLayer
    .selectAll<SVGGElement, d3.HierarchyCircularNode<CompanyNode>>("g")
    .data(leaves)
    .enter()
    .append("g")
    .attr("class", "cartographer-node")
    .attr("data-company-key", (d) => d.data.key)
    .attr("data-size", (d) => d.data.people.length)
    .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    .style("cursor", "pointer")
    .on("click", (_, d) => onSelect(d.data.key));

  nodes
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => sizeToColor(d.data.people.length))
    .attr("stroke", ACCENT)
    .attr("stroke-width", 1);

  nodes
    .filter((d) => d.r > 20)
    .append("text")
    .text((d) => d.data.name)
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .style("font-family", "Inter, sans-serif")
    .style("font-weight", 600)
    .style("font-size", (d) => `${Math.max(9, Math.min(d.r / 4, 14))}px`)
    .style("fill", NAVY)
    .style("pointer-events", "none");

  nodes
    .filter((d) => d.r > 30)
    .append("text")
    .text((d) => `${d.data.people.length}`)
    .attr("text-anchor", "middle")
    .attr("dy", "1.6em")
    .style("font-family", "ui-monospace, JetBrains Mono, monospace")
    .style("font-size", (d) => `${Math.max(8, Math.min(d.r / 6, 11))}px`)
    .style("fill", MUTED)
    .style("pointer-events", "none");

  // Hover tooltip via <title>
  nodes
    .append("title")
    .text((d) => `${d.data.name} — ${d.data.people.length} people`);

  // Zoom & pan
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 8])
    .on("zoom", (event) => {
      zoomLayer.attr("transform", event.transform.toString());
    });
  svg.call(zoom).on("dblclick.zoom", null);

  return zoom;
}

type FNode = d3.SimulationNodeDatum & {
  id: string;
  companyKey: string;
  companyName: string;
  person: Person;
};

type FLink = {
  source: string | FNode;
  target: string | FNode;
};

function drawNetwork(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  companies: CompanyNode[],
  width: number,
  height: number,
  onSelect: (key: string) => void
): {
  simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
} {
  // Cap for readability
  const capped = companies.slice(0, NETWORK_MAX_COMPANIES).map((c) => ({
    ...c,
    people: c.people.slice(0, NETWORK_MAX_PEOPLE_PER_COMPANY),
  }));

  // Lookup of company key → group size (for coloring person nodes by company size)
  const groupSize = new Map<string, number>();
  capped.forEach((c) => groupSize.set(c.key, c.people.length));

  const nodes: FNode[] = [];
  const links: FLink[] = [];

  capped.forEach((c) => {
    const peopleNodes: FNode[] = c.people.map((p, i) => ({
      id: `${c.key}::${i}::${p.fullName}`,
      companyKey: c.key,
      companyName: c.name,
      person: p,
    }));
    nodes.push(...peopleNodes);
    for (let i = 0; i < peopleNodes.length; i++) {
      for (let j = i + 1; j < peopleNodes.length; j++) {
        links.push({ source: peopleNodes[i].id, target: peopleNodes[j].id });
      }
    }
  });

  // Root <g> — everything inside gets zoomed/panned
  const zoomLayer = svg.append("g");

  const linkSel = zoomLayer
    .append("g")
    .attr("stroke", ACCENT)
    .attr("stroke-opacity", 0.12)
    .selectAll<SVGLineElement, FLink>("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 0.7);

  const nodeSel = zoomLayer
    .append("g")
    .selectAll<SVGGElement, FNode>("g.cartographer-node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "cartographer-node")
    .attr("data-company-key", (d) => d.companyKey)
    .attr("data-size", (d) => groupSize.get(d.companyKey) ?? 2)
    .style("cursor", "pointer")
    .on("click", (_, d) => onSelect(d.companyKey));

  nodeSel
    .append("circle")
    .attr("r", 5)
    .attr("fill", (d) => sizeToColor(groupSize.get(d.companyKey) ?? 2))
    .attr("stroke", ACCENT)
    .attr("stroke-width", 1);

  nodeSel
    .append("title")
    .text((d) => `${d.person.fullName} — ${d.companyName}`);

  // Company name labels at cluster centroids
  const labelSel = zoomLayer
    .append("g")
    .selectAll<SVGTextElement, CompanyNode>("text")
    .data(capped)
    .enter()
    .append("text")
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .style("font-family", "Inter, sans-serif")
    .style("font-weight", 600)
    .style("font-size", "11px")
    .style("fill", NAVY)
    .style("pointer-events", "none")
    .style("text-shadow", "0 0 4px rgba(255,255,255,0.9)");

  const simulation = d3
    .forceSimulation<FNode>(nodes)
    .force(
      "link",
      d3
        .forceLink<FNode, FLink>(links)
        .id((d) => d.id)
        .distance(18)
        .strength(0.4)
    )
    .force("charge", d3.forceManyBody<FNode>().strength(-22))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide<FNode>().radius(5))
    .alphaDecay(0.04);

  simulation.on("tick", () => {
    linkSel
      .attr("x1", (d) => (d.source as FNode).x ?? 0)
      .attr("y1", (d) => (d.source as FNode).y ?? 0)
      .attr("x2", (d) => (d.target as FNode).x ?? 0)
      .attr("y2", (d) => (d.target as FNode).y ?? 0);
    nodeSel.attr("transform", (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);

    // Compute centroid per company
    labelSel.each(function (d) {
      const peopleInCompany = nodes.filter((n) => n.companyKey === d.key);
      if (peopleInCompany.length === 0) return;
      const cx =
        peopleInCompany.reduce((acc, n) => acc + (n.x ?? 0), 0) /
        peopleInCompany.length;
      const cy =
        peopleInCompany.reduce((acc, n) => acc + (n.y ?? 0), 0) /
        peopleInCompany.length;
      d3.select(this).attr("x", cx).attr("y", cy);
    });
  });

  // Drag behavior
  const drag = d3
    .drag<SVGGElement, FNode>()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
  nodeSel.call(drag);

  // Zoom & pan — registered AFTER drag so node-drag takes priority on individual
  // nodes; zoom kicks in on the background.
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 8])
    .filter((event) => {
      // Don't start a zoom-pan when the user is starting a drag on a node
      const target = event.target as Element | null;
      if (target && target.closest(".cartographer-node")) return false;
      return !event.ctrlKey && !event.button;
    })
    .on("zoom", (event) => {
      zoomLayer.attr("transform", event.transform.toString());
    });
  svg.call(zoom).on("dblclick.zoom", null);

  return {
    simulation: simulation as unknown as d3.Simulation<
      d3.SimulationNodeDatum,
      undefined
    >,
    zoom,
  };
}

// ===========================================================================
// Utils
// ===========================================================================

function formatMatchesForLead(matches: Match[]): string {
  const lines: string[] = [];
  let totalHits = 0;
  let totalContacts = 0;
  for (const m of matches) {
    if (m.people.length > 0) {
      totalHits += 1;
      totalContacts += m.people.length;
    }
  }
  lines.push(
    `Target-list match — ${totalHits} of ${matches.length} targets had a match · ${totalContacts} warm contacts total.`
  );
  lines.push("");
  for (const m of matches) {
    if (m.people.length === 0) {
      lines.push(`${m.query} — no match`);
      continue;
    }
    const matchedAs =
      m.matchedCompanyName && m.matchedCompanyName !== m.query
        ? ` (matched as ${m.matchedCompanyName})`
        : "";
    lines.push(`${m.query}${matchedAs} — ${m.people.length} contact(s):`);
    for (const p of m.people) {
      lines.push(`  - ${p.fullName}${p.position ? ` — ${p.position}` : ""}`);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

function csvCell(v: string): string {
  if (v == null) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
