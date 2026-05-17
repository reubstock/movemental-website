export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const MAX_DOC_CHARS = 200_000;
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB

type Kind = "pdf" | "docx" | "text";

async function parsePdf(buffer: Buffer): Promise<string> {
  // unpdf is serverless-friendly: ships pdfjs-dist with browser-API shims
  // (DOMMatrix etc.) prebundled, so it runs in Vercel's Node runtime
  // without canvas or extra polyfills.
  const { extractText } = await import("unpdf");
  const bytes = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength
  );
  const { text } = await extractText(bytes, { mergePages: true });
  return typeof text === "string" ? text : (text as string[]).join("\n\n");
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function parsePlainText(buffer: Buffer): string {
  let text = buffer.toString("utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
  return text;
}

function inferKindFromName(name: string): Kind | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (
    lower.endsWith(".txt") ||
    lower.endsWith(".md") ||
    lower.endsWith(".markdown") ||
    lower.endsWith(".csv") ||
    lower.endsWith(".tsv")
  ) {
    return "text";
  }
  return null;
}

function inferKindFromMime(mime: string): Kind | null {
  if (mime === "application/pdf") return "pdf";
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/docx"
  ) {
    return "docx";
  }
  if (mime.startsWith("text/") || mime === "application/csv") return "text";
  return null;
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json(
      { error: "Expected a multipart/form-data upload." },
      { status: 400 }
    );
  }

  const fileField = formData.get("file");
  if (!fileField || !(fileField instanceof File)) {
    return Response.json(
      { error: "No file field on the request." },
      { status: 400 }
    );
  }
  const file = fileField;

  if (file.size === 0) {
    return Response.json({ error: "File is empty." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return Response.json(
      {
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(
          1
        )} MB). Max ${MAX_FILE_BYTES / 1024 / 1024} MB.`,
      },
      { status: 413 }
    );
  }

  const kind =
    inferKindFromName(file.name) || inferKindFromMime(file.type || "");
  if (!kind) {
    return Response.json(
      {
        error: `Unsupported file type. Accepts PDF, DOCX, TXT, MD, CSV. Got "${
          file.name
        }" (${file.type || "unknown MIME"}).`,
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let text: string;
  try {
    if (kind === "pdf") text = await parsePdf(buffer);
    else if (kind === "docx") text = await parseDocx(buffer);
    else text = parsePlainText(buffer);
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error
            ? `Failed to parse file: ${err.message}`
            : "Failed to parse file.",
      },
      { status: 422 }
    );
  }

  text = text.replace(/\r\n/g, "\n").trim();
  if (!text) {
    return Response.json(
      {
        error:
          "Couldn't extract any text from that file. If it's a scanned PDF, the text isn't selectable.",
      },
      { status: 400 }
    );
  }
  if (text.length > MAX_DOC_CHARS) {
    text = text.slice(0, MAX_DOC_CHARS);
  }

  const baseName = file.name.replace(/\.[^./\\]+$/, "");
  const suggestedName = baseName.slice(0, 200) || file.name.slice(0, 200);

  return Response.json({
    name: suggestedName,
    content: text,
    charCount: text.length,
    kind,
    originalFilename: file.name,
  });
}
