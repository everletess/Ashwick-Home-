// "Ask us" site assistant: answers questions about the Ashbury from the site's own copy and hands anything else
// (or anyone ready to talk) to the team by email via Resend. Needs ANTHROPIC_API_KEY; RESEND_API_KEY for hand-offs.
import { ASSISTANT_KNOWLEDGE } from "@/lib/assistant-knowledge";
import { STUDIO_EMAIL } from "@/lib/site";

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-sonnet-4-5";
const MAX_TURNS = 24;
const MAX_CHARS = 1200;

const SYSTEM = `You are the Ashwick Home assistant on ashwickhome.com, an AI that helps visitors with questions about The Ashbury mattress and Ashwick Home. Be warm, calm and concise (2-4 short sentences unless asked for detail). Plain text only, no markdown headings or bullet symbols. Use American spelling for the site but keep the brand names exactly as written (Living Wool, Fleece, Flint, Moss, Hazel, Sorrel).

RULES
- Only state facts found in the KNOWLEDGE below. If something isn't covered (e.g. shipping to a specific country, exact delivery dates, custom-size pricing, trade pricing, medical or allergy outcomes, comparisons with named competitors' specs), say you don't want to guess and offer to pass the question to the team.
- Never make medical or health claims, and don't infer benefits the knowledge doesn't state (no spine alignment, pressure relief, pain, allergy or posture claims). For soft vs firm, use only the page's guidance (Soft: side sleepers and anyone who likes to sink in. Firm: back and stomach sleepers) and point to the 100 nights. No discounts or promo codes: prices are as listed.
- If asked about "Kashmir wool", explain the topper uses cashmere (plus Living Wool and Swedish horsehair). Don't repeat the phrase "Kashmir wool" otherwise.
- Never use markdown: no asterisks, bold, headings or bullet symbols.
- You are an AI. If asked, say so plainly.
- Be genuinely helpful, not pushy. When it fits naturally, point to the next step: choosing size/feel/color on the page, the 100-night guarantee (30-night minimum), delivery included, Affirm at checkout.
- HAND-OFF: if the visitor wants to talk to a person, asks something you can't answer, is an interior designer/trade buyer, or is ready to buy but has a question, ask for their name and email (and optionally phone), then call the handoff tool. Never invent contact details. After the tool succeeds, tell them the team will reply by email, usually within one business day. If it fails, give them ${STUDIO_EMAIL}.

KNOWLEDGE
${ASSISTANT_KNOWLEDGE}`;

const TOOLS = [
  {
    name: "handoff",
    description: "Send this visitor's details and question to the Ashwick team so a person follows up by email.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        topic: { type: "string", description: "One line: what they want help with." },
      },
      required: ["name", "email", "topic"],
    },
  },
];

type Msg = { role: "user" | "assistant"; content: string };
type Block = { type: string; text?: string; id?: string; name?: string; input?: Record<string, string> };

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 40;
}

async function claude(messages: unknown[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 600, system: SYSTEM, tools: TOOLS, messages }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as { content: Block[]; stop_reason: string };
}

async function sendHandoff(input: Record<string, string>, transcript: Msg[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email ?? "")) return false;
  const body = [
    `Name: ${input.name ?? ""}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    `Topic: ${input.topic ?? ""}`,
    "",
    "Conversation:",
    ...transcript.map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`),
  ].filter((l) => l !== null).join("\n");
  const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FORMS_FROM ?? "Ashwick Home <forms@ashwickhome.com>",
      to: [process.env.FORMS_TO ?? STUDIO_EMAIL],
      reply_to: input.email,
      subject: `Site chat: ${input.name ?? "visitor"} — ${input.topic ?? "question"}`,
      text: body,
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ reply: `Our assistant is offline right now. Email ${STUDIO_EMAIL} and the team will help.` });
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (limited(ip)) return Response.json({ reply: `Lots of questions! For more help, email ${STUDIO_EMAIL}.` }, { status: 429 });

  let messages: Msg[];
  try {
    const data = await req.json();
    messages = (Array.isArray(data.messages) ? data.messages : [])
      .filter((m: Msg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-MAX_TURNS)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const convo: unknown[] = [...messages];
    let out = await claude(convo);
    let handedOff = false;
    for (let i = 0; i < 2 && out.stop_reason === "tool_use"; i++) {
      const results = [];
      for (const b of out.content.filter((b) => b.type === "tool_use")) {
        const ok = b.name === "handoff" ? await sendHandoff(b.input ?? {}, messages) : false;
        handedOff ||= ok;
        results.push({ type: "tool_result", tool_use_id: b.id, content: ok ? "Sent to the team." : "Sending failed." });
      }
      convo.push({ role: "assistant", content: out.content }, { role: "user", content: results });
      out = await claude(convo);
    }
    const reply = out.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/^#+\s*/gm, "")
      .trim();
    return Response.json({ reply: reply || `Sorry, I didn't catch that. You can always email ${STUDIO_EMAIL}.`, handedOff });
  } catch (e) {
    console.error("assistant", e);
    return Response.json({ reply: `Sorry, I'm having trouble right now. Email ${STUDIO_EMAIL} and the team will help.` });
  }
}
