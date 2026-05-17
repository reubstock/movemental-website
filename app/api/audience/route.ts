import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Mode = "amplifiers" | "segmentation" | "profiles";

type Body = {
  mode?: Mode;
  industry?: string;
  context?: string;
  letter?: string;
  data?: string;
};

const SYSTEM_PROMPTS: Record<Mode, string> = {
  amplifiers: `You are an expert at identifying the LinkedIn voices most likely to amplify a given message in a given industry. Your job is to recommend a shortlist of 10–15 specific, real people — operators, executives, analysts, journalists, or independent commentators — who would be credible amplifiers for the letter or topic the user provides.

For each recommendation, return:
- NAME — Title at Company
- Why they're a fit (1–2 sentences referencing the letter's argument)
- Lead angle — the specific framing or hook to use when reaching out
- Cadence — their typical LinkedIn posting pattern (active poster, occasional, mostly silent — your best guess based on public reputation)

Group your shortlist by tier:
- TIER 1: high-leverage operators with large reach + credibility (3–5 picks)
- TIER 2: domain experts and respected practitioners (5–7 picks)
- TIER 3: rising voices and niche specialists (3–5 picks)

Be honest about uncertainty. If you don't know the person well, say "best-guess fit, verify before outreach." Never invent biographical details.

End with a short paragraph titled "How to sequence outreach" that recommends the order to approach them and what to send each tier.

OUTPUT FORMAT: Plain prose with clear section headers. No JSON, no bullet points beyond the per-person fields described above. Lead with the tier headings.`,

  segmentation: `You are an expert at analyzing professional networks. The user will provide a list of LinkedIn connections, followers, or contacts — typically as a CSV export from Sales Navigator or a paste of profile data.

Your job is to produce:

1. SEGMENTATION — break the list into 4–7 meaningful clusters by role × industry × seniority. For each cluster: name, approximate count or percentage, defining traits, what they care about.

2. PERSONA SUMMARY — for the 2–3 dominant clusters, write a one-paragraph persona describing how that group thinks, what they read, what moves them.

3. TARGETING RECOMMENDATIONS — given the letter or campaign context the user describes, recommend which segments to lead with, which to nurture, and which to skip. Be specific about why.

4. GAPS — flag who's missing from this list that the user probably wants to add (with reasoning).

Be honest about data limitations. If the input is thin or ambiguous, say so. Never invent counts or characteristics that aren't supported by the data.

OUTPUT FORMAT: Plain prose with the four numbered sections above. Use section headers in ALL CAPS as shown. No markdown beyond paragraph breaks.`,

  profiles: `You are an expert at preparing pre-outreach briefs on individual LinkedIn profiles. The user will provide a list of LinkedIn profile URLs, names, or pasted profile content.

For each person, produce a brief in this exact format:

NAME
— Title at Company. Background in 1–2 lines.
— Recent themes: what they appear to post or write about (based on what's provided; if not provided, say "needs verification").
— Lead angle: the specific framing of the campaign message that would land with this person.
— Avoid: framings or topics likely to misfire with this person.
— Confidence: HIGH / MEDIUM / LOW based on how much you can responsibly infer from the input.

Be rigorous about confidence levels. If the input is just a URL with no content, your confidence is LOW for anything beyond title and company. Never fabricate details. Say "needs verification" when you don't know.

End with a "BATCH SUMMARY" paragraph identifying the 3 highest-priority people in the list and why.

OUTPUT FORMAT: Plain prose with the per-person blocks above and a closing batch summary. No JSON, no markdown.`,
};

function buildUserPrompt(mode: Mode, body: Body): string {
  switch (mode) {
    case "amplifiers":
      return `Industry / sector: ${body.industry || "Not specified"}

Campaign context, topic, or letter excerpt:
${body.letter || body.context || "(none provided)"}

Recommend the LinkedIn amplifier shortlist now. Follow the system instructions exactly.`;

    case "segmentation":
      return `Industry / sector: ${body.industry || "Not specified"}

Campaign context (what we're trying to do with this audience):
${body.context || "(none provided — general analysis)"}

LinkedIn connection / follower data (CSV, paste, or notes):
${body.data || "(none provided)"}

Produce the segmentation, personas, targeting recommendations, and gaps now. Follow the system instructions exactly.`;

    case "profiles":
      return `Industry / sector: ${body.industry || "Not specified"}

Campaign context (the message we're sequencing for these people):
${body.context || "(none provided)"}

Profiles to brief (URLs, names, or pasted content):
${body.data || "(none provided)"}

Write the per-person briefs and the batch summary now. Follow the system instructions exactly.`;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "ANTHROPIC_API_KEY is not set. Add it in Vercel env vars to enable AUDIENCE.",
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const mode = body.mode;
  if (mode !== "amplifiers" && mode !== "segmentation" && mode !== "profiles") {
    return new Response(
      JSON.stringify({
        error: "Mode must be one of: amplifiers | segmentation | profiles.",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  if (mode === "amplifiers" && !(body.letter || body.context)?.trim()) {
    return new Response(
      JSON.stringify({
        error: "Provide a letter excerpt or campaign context to find amplifiers.",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }
  if ((mode === "segmentation" || mode === "profiles") && !body.data?.trim()) {
    return new Response(
      JSON.stringify({
        error:
          mode === "segmentation"
            ? "Paste or upload your connection / follower data."
            : "Paste or upload the profile URLs or content to brief.",
      }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  const systemPrompt = SYSTEM_PROMPTS[mode];
  const userPrompt = buildUserPrompt(mode, body);

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };

      try {
        const sdkStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userPrompt }],
        });

        sdkStream.on("text", (delta: string) => {
          send({ type: "text", delta });
        });

        const finalMessage = await sdkStream.finalMessage();

        send({
          type: "done",
          stop_reason: finalMessage.stop_reason,
          usage: {
            input_tokens: finalMessage.usage.input_tokens,
            output_tokens: finalMessage.usage.output_tokens,
            cache_read_input_tokens:
              finalMessage.usage.cache_read_input_tokens ?? 0,
            cache_creation_input_tokens:
              finalMessage.usage.cache_creation_input_tokens ?? 0,
          },
        });
      } catch (error) {
        let message = "Unknown error generating audience output.";
        let status = 500;
        if (error instanceof Anthropic.RateLimitError) {
          message = "Rate limit hit. Try again in a moment.";
          status = 429;
        } else if (error instanceof Anthropic.AuthenticationError) {
          message = "Invalid Anthropic API key.";
          status = 401;
        } else if (error instanceof Anthropic.APIError) {
          message = `Anthropic API error (${error.status}): ${error.message}`;
          status = error.status ?? 500;
        } else if (error instanceof Error) {
          message = error.message;
        }
        send({ type: "error", message, status });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
