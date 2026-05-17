import Papa from "papaparse";

export type Person = {
  firstName: string;
  lastName: string;
  fullName: string;
  company: string; // display name (original spelling)
  companyKey: string; // normalized
  position: string;
  url?: string;
  connectedOn?: string; // raw string
  connectedDate?: Date;
};

export type CompanyGroup = {
  name: string;
  key: string;
  people: Person[];
};

export type ParseResult = {
  people: Person[];
  groups: Map<string, CompanyGroup>;
  totalConnections: number;
  uniqueCompanies: number;
  multiCompanies: number;
  earliest?: Date;
  latest?: Date;
};

export type Match = {
  query: string;
  matchedKey?: string;
  matchedCompanyName?: string;
  people: Person[];
};

// ---------------------------------------------------------------------------
// Company-name normalization
// ---------------------------------------------------------------------------
// LinkedIn lets people type whatever they want for company, so the same
// company shows up as "Stripe", "Stripe, Inc.", "Stripe Inc", "Stripe AI",
// etc. We strip common corporate suffixes + filler so they all hash to
// the same key. Aggressive enough to catch variants, gentle enough to
// preserve identity for short names.

const COMPANY_STOPWORDS = new Set([
  "inc",
  "incorporated",
  "llc",
  "ltd",
  "limited",
  "corp",
  "corporation",
  "co",
  "company",
  "group",
  "holdings",
  "holding",
  "labs",
  "lab",
  "studio",
  "studios",
  "technologies",
  "technology",
  "tech",
  "ai",
  "ml",
  "io",
  "app",
  "the",
  "a",
  "an",
  "partners",
  "capital",
  "ventures",
]);

export function normalizeCompany(name: string): string {
  if (!name) return "";
  const cleaned = name
    .toLowerCase()
    .trim()
    .replace(/[.,/\\]/g, " ")
    .replace(/&/g, " and ")
    .replace(/\s+/g, " ");
  const words = cleaned.split(" ").filter((w) => w && !COMPANY_STOPWORDS.has(w));
  return words.join(" ").trim();
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------
// LinkedIn's Connections.csv export has a preamble of "Notes:" lines before
// the actual CSV header row. We scan for the first line that starts with
// "First Name" and parse from there.

function extractCsvBody(raw: string): string {
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (/^"?First Name"?\s*[,\t]/i.test(lines[i])) {
      return lines.slice(i).join("\n");
    }
  }
  return raw;
}

function parseDate(s: string): Date | undefined {
  if (!s) return undefined;
  // LinkedIn uses "15 Jan 2024" but some exports use ISO; Date handles both.
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d;
  return undefined;
}

export function parseConnections(raw: string): ParseResult {
  const body = extractCsvBody(raw);
  const parsed = Papa.parse<Record<string, string>>(body, {
    header: true,
    skipEmptyLines: "greedy",
  });

  const people: Person[] = [];
  const groups = new Map<string, CompanyGroup>();
  let earliest: Date | undefined;
  let latest: Date | undefined;

  for (const row of parsed.data) {
    if (!row || typeof row !== "object") continue;
    const firstName = (row["First Name"] || "").trim();
    const lastName = (row["Last Name"] || "").trim();
    const company = (row["Company"] || "").trim();
    const position = (row["Position"] || row["Title"] || "").trim();
    const url = (row["URL"] || row["Profile URL"] || "").trim();
    const connectedOn = (row["Connected On"] || "").trim();

    if (!firstName && !lastName) continue;

    const connectedDate = parseDate(connectedOn);
    if (connectedDate) {
      if (!earliest || connectedDate < earliest) earliest = connectedDate;
      if (!latest || connectedDate > latest) latest = connectedDate;
    }

    const companyKey = normalizeCompany(company);
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    const person: Person = {
      firstName,
      lastName,
      fullName,
      company,
      companyKey,
      position,
      url: url || undefined,
      connectedOn: connectedOn || undefined,
      connectedDate,
    };

    people.push(person);

    if (companyKey) {
      let group = groups.get(companyKey);
      if (!group) {
        group = { name: company, key: companyKey, people: [] };
        groups.set(companyKey, group);
      }
      group.people.push(person);
    }
  }

  // For each group, pick the most common original spelling as the display name
  for (const group of groups.values()) {
    const counts = new Map<string, number>();
    for (const p of group.people) {
      counts.set(p.company, (counts.get(p.company) || 0) + 1);
    }
    let topName = group.name;
    let topCount = -1;
    for (const [n, c] of counts.entries()) {
      if (c > topCount) {
        topCount = c;
        topName = n;
      }
    }
    group.name = topName;
  }

  const multiCompanies = Array.from(groups.values()).filter(
    (g) => g.people.length > 1
  ).length;

  return {
    people,
    groups,
    totalConnections: people.length,
    uniqueCompanies: groups.size,
    multiCompanies,
    earliest,
    latest,
  };
}

// ---------------------------------------------------------------------------
// Target matching
// ---------------------------------------------------------------------------

export function matchTargets(
  targets: string[],
  groups: Map<string, CompanyGroup>
): Match[] {
  return targets.map((t) => {
    const trimmed = t.trim();
    if (!trimmed) return { query: t, people: [] };

    const targetKey = normalizeCompany(trimmed);
    let matched = groups.get(targetKey);
    let matchedKey: string | undefined = matched ? targetKey : undefined;

    // Substring fallback in either direction
    if (!matched && targetKey) {
      // Prefer the longest containing match
      let bestLen = 0;
      for (const [key, group] of groups.entries()) {
        if (key.includes(targetKey) || targetKey.includes(key)) {
          const overlap = Math.min(key.length, targetKey.length);
          if (overlap > bestLen) {
            bestLen = overlap;
            matched = group;
            matchedKey = key;
          }
        }
      }
    }

    return {
      query: t,
      matchedKey,
      matchedCompanyName: matched?.name,
      people: matched ? [...matched.people] : [],
    };
  });
}

export function formatDate(d?: Date): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
