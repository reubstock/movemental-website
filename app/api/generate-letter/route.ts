import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a writer for Movemental, a movement-building consultancy. You draft compact, category-defining open letters in the "movement, not marketing" tradition.

VOICE
- Concerned, hopeful, semi-formal. Direct.
- Names the unspoken truth. Specific over general. No platitudes.
- Sentences are short to medium. No clichés. No corporate hedging.

STRUCTURE (mandatory; exactly five short paragraphs, in this order, no labels):
1. HOOK — present-tense danger, loss, or stuck condition. 2-3 sentences.
2. DIAGNOSIS — why the obvious players can't fix it. 2-3 sentences.
3. JERRY MAGUIRE — say out loud the thing everyone thinks but won't. 2-3 sentences. This is the keystone of the letter.
4. FUTURE — what becomes possible, and why this falls to the author (their stakes, standing, credibility). 2-3 sentences.
5. CALL — one specific, immediate, measurable ask. 1-2 sentences.

LENGTH
- Total: 280 to 420 words. Compact. Not long.
- Five paragraphs separated by blank lines.

OUTPUT FORMAT
- No headings. No subheadings. No bullet points. No labels.
- No preamble ("Here is..."). No greetings ("Dear reader,").
- No signature line. No "—" at end.
- Output only the five-paragraph letter body.

If an input is empty or weak, infer from the others. Never refuse.`;

type Body = {
  industry?: string;
  change?: string;
  unsaid?: string;
  why?: string;
  ask?: string;
  audience?: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.REUBENKEY;
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
  const unsaid = body.unsaid?.trim() ?? "";
  const why = body.why?.trim() ?? "";
  const ask = body.ask?.trim() ?? "";
  const audience = body.audience?.trim() ?? "";

  if (!change && !unsaid && !why && !ask) {
    return new Response("Please fill in at least one input.", { status: 400 });
  }

  const userMessage = [
    "INPUTS",
    "",
    industry ? `Industry: ${industry}` : "",
    `What I want to change: ${change || "(not specified)"}`,
    `The unspoken truth: ${unsaid || "(not specified)"}`,
    `Why this is mine to say: ${why || "(not specified)"}`,
    `What I want readers to do: ${ask || "(not specified)"}`,
    audience ? `Audience: ${audience}` : "",
    "",
    industry
      ? `Ground the letter in ${industry}: use that field's vocabulary, name its actual players or recent shifts where it strengthens the case, and write as if a reader inside that industry will recognize themselves immediately. Do not name the industry as a label.`
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
