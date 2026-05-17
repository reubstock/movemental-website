export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DOC_CHARS = 200_000;
const DOC_ID_RE = /\/document\/d\/([a-zA-Z0-9_-]+)/;

function extractDocId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (
      parsed.hostname !== "docs.google.com" &&
      parsed.hostname !== "drive.google.com"
    ) {
      return null;
    }
    const match = parsed.pathname.match(DOC_ID_RE);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = (await req.json()) as { url?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const url = (body.url || "").trim();
  if (!url) {
    return Response.json(
      { error: "Missing Google Docs URL." },
      { status: 400 }
    );
  }

  const docId = extractDocId(url);
  if (!docId) {
    return Response.json(
      {
        error:
          "That doesn't look like a Google Docs URL. Expected something like https://docs.google.com/document/d/.../edit",
      },
      { status: 400 }
    );
  }

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;

  let res: Response;
  try {
    res = await fetch(exportUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error && err.name === "TimeoutError"
            ? "Google Docs took too long to respond."
            : "Network error fetching Google Docs.",
      },
      { status: 502 }
    );
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      return Response.json(
        {
          error:
            "This Google Doc isn't shared publicly. Open the doc → Share → 'Anyone with the link' → Viewer, then try again.",
        },
        { status: 403 }
      );
    }
    if (res.status === 404) {
      return Response.json(
        { error: "Google Doc not found. Check the URL." },
        { status: 404 }
      );
    }
    return Response.json(
      { error: `Google Docs returned ${res.status}.` },
      { status: 502 }
    );
  }

  const contentType = res.headers.get("content-type") || "";
  // If the doc isn't public, Google often returns 200 with an HTML sign-in
  // page instead of plain text. Detect and surface a clearer error.
  if (
    !contentType.includes("text/plain") &&
    !contentType.includes("application/octet-stream")
  ) {
    return Response.json(
      {
        error:
          "Couldn't read this doc as plain text. Make sure it's shared 'Anyone with the link' (Viewer).",
      },
      { status: 403 }
    );
  }

  let text = await res.text();
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  text = text.trim();

  if (!text) {
    return Response.json(
      { error: "Google Doc is empty." },
      { status: 400 }
    );
  }
  if (text.length > MAX_DOC_CHARS) {
    text = text.slice(0, MAX_DOC_CHARS);
  }

  const firstLine = text.split("\n").find((l) => l.trim());
  const title = firstLine
    ? firstLine.slice(0, 200).trim()
    : `Doc ${docId.slice(0, 8)}`;

  return Response.json({
    name: title,
    content: text,
    sourceUrl: url,
    charCount: text.length,
  });
}
