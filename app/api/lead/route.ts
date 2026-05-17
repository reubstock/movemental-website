import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEAD_TO = "reubstock@gmail.com";
const LEAD_FROM = "Movementum Lead <onboarding@resend.dev>";

type Tool = "matic" | "cartographer" | "audience";

type Body = {
  tool?: Tool;
  name?: string;
  email?: string;
  message?: string;
  context?: string; // the tool output (letter / matches / analysis)
  intent?: string; // the CTA they clicked (for the subject line)
};

const TOOL_LABELS: Record<Tool, string> = {
  matic: "MATIC",
  cartographer: "CARTOGRAPHER",
  audience: "AUDIENCE",
};

function isValidEmail(s: string): boolean {
  // Permissive — proper validation happens when you reply
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "RESEND_API_KEY is not set. Add it in Vercel env vars to enable lead capture.",
      },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const tool = body.tool;
  if (tool !== "matic" && tool !== "cartographer" && tool !== "audience") {
    return Response.json({ error: "Unknown tool." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const context = (body.context || "").trim();
  const intent = (body.intent || "").trim();

  if (!name) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return Response.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  const toolLabel = TOOL_LABELS[tool];
  const subject = `[${toolLabel}] Lead from ${name}`;

  // Plain-text body (always works)
  const textLines: string[] = [
    `New lead from ${toolLabel} on movemental-website.vercel.app`,
    "",
    `Name:    ${name}`,
    `Email:   ${email}`,
  ];
  if (intent) textLines.push(`Intent:  ${intent}`);
  if (message) {
    textLines.push("", "Message:", message);
  }
  if (context) {
    textLines.push(
      "",
      "----- Tool output (full context) -----",
      "",
      context
    );
  }
  const text = textLines.join("\n");

  // Light HTML version for nicer inbox rendering
  const html = `<!doctype html>
<html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif; color:#18181b; max-width: 640px; margin: 0 auto; padding: 24px; line-height:1.55;">
  <p style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#0891b2; font-weight:bold;">${toolLabel} · NEW LEAD</p>
  <h2 style="margin:8px 0 16px; font-size:24px; line-height:1.2;">${escapeHtml(name)}</h2>
  <p style="margin:4px 0; color:#475569;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#0891b2; text-decoration:none;">${escapeHtml(email)}</a></p>
  ${intent ? `<p style="margin:4px 0; color:#475569;"><strong>Intent:</strong> ${escapeHtml(intent)}</p>` : ""}
  ${message ? `<div style="margin-top:16px; padding:12px 16px; background:#fafaf8; border-radius:8px; border-left:3px solid #0891b2;"><div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#0891b2; font-weight:bold; margin-bottom:6px;">MESSAGE</div><div style="white-space:pre-wrap; color:#18181b;">${escapeHtml(message)}</div></div>` : ""}
  ${context ? `<div style="margin-top:20px; padding:16px; background:#fafaf8; border-radius:8px;"><div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#475569; font-weight:bold; margin-bottom:8px;">TOOL OUTPUT (FULL CONTEXT)</div><pre style="white-space:pre-wrap; font-family:Georgia,serif; font-size:14px; color:#18181b; margin:0;">${escapeHtml(context)}</pre></div>` : ""}
  <hr style="margin:24px 0; border:0; border-top:1px solid #e7e5e4;" />
  <p style="font-size:11px; color:#a1a1aa;">Sent from /api/lead on movemental-website.vercel.app</p>
</body></html>`;

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: LEAD_FROM,
      to: LEAD_TO,
      replyTo: email,
      subject,
      text,
      html,
    });

    if (result.error) {
      return Response.json(
        { error: `Email send failed: ${result.error.message}` },
        { status: 502 }
      );
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error ? e.message : "Email send failed unexpectedly.",
      },
      { status: 502 }
    );
  }
}
