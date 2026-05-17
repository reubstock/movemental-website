import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a writer for Movementum, a movement-building consultancy. You draft category-defining open letters formatted as a long-form Twitter/X or LinkedIn/Facebook post — short paragraphs, generous whitespace, no labels.

VOICE
- Direct, declarative, semi-formal but personal. Concerned and hopeful.
- Names the unspoken truth. Specific over general. No platitudes, no hedging, no corporate filler.
- Sentences are short to medium. Plain language. Occasional single-sentence paragraphs for emphasis.

STRUCTURE (a five-beat arc, expressed as 8-12 short paragraphs)
1. HOOK — present-tense danger, loss, or stuck condition.
2. DIAGNOSIS — why the obvious players can't fix it.
3. JERRY MAGUIRE — say out loud the thing everyone thinks but won't. This is the anthem of the post.
4. FUTURE — what becomes possible, and why this falls to the author (their stakes, standing, credibility).
5. CALL — one specific, immediate, measurable ask.

Each beat is one or two paragraphs. Break paragraphs aggressively — most are 1-3 sentences. Use a single emphatic sentence as its own paragraph when it lands.

LENGTH
- 240 to 380 words total. Tight. Built to be read on a phone.

OUTPUT FORMAT
- Plain text. No headings, no labels, no bullet points, no numbered lists.
- No preamble ("Here is..."). No greeting ("Friends,", "Dear reader,").
- No signature line. No em-dash at the end.
- Double line breaks between paragraphs.
- Output only the post body, ready to paste into LinkedIn, X, or Facebook.

If an input is empty or weak, infer from the others. Never refuse.`;

type RefDocInput = {
  name?: string;
  content?: string;
  source?: string;
};

type Body = {
  industry?: string;
  change?: string;
  moment?: string;
  unsaid?: string;
  why?: string;
  ask?: string;
  audience?: string;
  refDocs?: RefDocInput[];
};

const MAX_REF_DOCS = 25;
const MAX_REF_CHARS_TOTAL = 600_000;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "ANTHROPIC_API_KEY is not configured on the server.",
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  const industry = body.industry?.trim() ?? "";
  const change = body.change?.trim() ?? "";
  const moment = body.moment?.trim() ?? "";
  const unsaid = body.unsaid?.trim() ?? "";
  const why = body.why?.trim() ?? "";
  const ask = body.ask?.trim() ?? "";
  const audience = body.audience?.trim() ?? "";

  if (!change && !moment && !unsaid && !why && !ask) {
    return new Response("Please fill in at least one input.", { status: 400 });
  }

  // Reference docs — cap the total chars sent to keep prompt cost bounded
  const refDocs = Array.isArray(body.refDocs)
    ? body.refDocs.slice(0, MAX_REF_DOCS)
    : [];
  let refTotal = 0;
  const refSections: string[] = [];
  for (const doc of refDocs) {
    if (!doc?.name || !doc?.content) continue;
    const room = MAX_REF_CHARS_TOTAL - refTotal;
    if (room <= 0) break;
    const content = doc.content.slice(0, room);
    refTotal += content.length;
    refSections.push(
      `--- ${doc.name.trim().slice(0, 200)} ---\n${content.trim()}`
    );
  }
  const refBlock =
    refSections.length > 0
      ? `REFERENCE MATERIAL (use to inform tone, voice, and substance — do NOT quote it directly in the output):\n\n${refSections.join(
          "\n\n"
        )}\n\n---\n\n`
      : "";

  const userMessage =
    refBlock +
    [
      "INPUTS",
      "",
      industry ? `Industry: ${industry}` : "",
      `What I want to change: ${change || "(not specified)"}`,
      `A specific moment that crystallized this: ${moment || "(not specified)"}`,
      `The unspoken truth: ${unsaid || "(not specified)"}`,
      `Why this is mine to say: ${why || "(not specified)"}`,
      `What I want readers to do: ${ask || "(not specified)"}`,
      audience ? `Audience: ${audience}` : "",
      "",
      industry
        ? `Ground the letter in ${industry}: use that field's vocabulary, name its actual players or recent shifts where it strengthens the case, and write as if a reader inside that industry will recognize themselves immediately. Do not name the industry as a label.`
        : "",
      moment
        ? "If a specific moment is provided, open Beat 1 (the Hook) with that scene — a concrete detail, in the present tense — before pulling out to the larger claim. Letters with a real moment outperform abstract ones; lean on it."
        : "",
      "",
      "Write the letter now. Five paragraphs. 280-420 words. No labels.",
    ]
      .filter((l) => l !== "")
      .join("\n");

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        });

        messageStream.on("text", (text: string) => {
          controller.enqueue(encoder.encode(text));
        });

        await messageStream.finalMessage();
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "generation failed";
        controller.enqueue(encoder.encode(`\n\n[Error: ${msg}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
