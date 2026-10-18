// "Ask us" site assistant: answers questions about Ashwick Home from the site's own data (lib/assistant-knowledge.ts)
// and sends anyone who wants a person, or asks something it can't answer, to the studio's email. Needs ANTHROPIC_API_KEY.
import Anthropic from "@anthropic-ai/sdk";
import { ASSISTANT_KNOWLEDGE, WELCOME_OFFER } from "@/lib/assistant-knowledge";
import { MATTRESS } from "@/lib/mattress";
import { STUDIO_EMAIL, STUDIO_PHONE } from "@/lib/site";

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-sonnet-5-5";
const MAX_TURNS = 24;
const MAX_CHARS = 1200;
// The sign-up prompt, plus the reply after it.
const MAX_TOOL_ROUNDS = 2;

const M = MATTRESS;

const SYSTEM = `You are the Ashwick Home assistant on ashwickhome.com, an AI that helps visitors with questions about Ashwick Home's furniture, the Ashbury mattress, Bespoke commissions and the Trade program. Be warm, calm and concise (2-4 short sentences unless asked for detail). Plain text only. Use American spelling, but keep brand and product names exactly as written (Living Wool, Fleece, Flint, Moss, Hazel, Sorrel, Irish Linen, Linen Blend).

RULES
- Only state facts found in the KNOWLEDGE below. If something isn't covered (e.g. shipping to a specific country, exact delivery dates, custom-size or bespoke pricing, trade pricing thresholds, medical or allergy outcomes, comparisons with named competitors' specs), say you don't want to guess and point them to the team (see A REAL PERSON).
- Never make medical or health claims, and don't infer benefits the knowledge doesn't state (no spine alignment, pressure relief, pain, allergy or posture claims). For soft vs firm, use only the knowledge's guidance and point to the ${M.guaranteeNights}-night guarantee.
- Discounts: the only offer is ${WELCOME_OFFER.percent}% off a first order for new email subscribers. If someone asks about discounts or codes, tell them about it and call show_email_signup so the sign-up form opens for them; the code is sent to their inbox. Don't invent other discounts or sales. Trade pricing is only for approved trade members.
- If asked about "Kashmir wool", explain the topper uses cashmere (plus Living Wool and Swedish horsehair). Don't repeat the phrase "Kashmir wool" otherwise.
- Never use markdown: no asterisks, bold, headings or bullet symbols. Share a page link when it helps.
- You are an AI. If asked, say so plainly.
- Be genuinely helpful, not pushy. When it fits naturally, point to the next step: the product page, the ${M.guaranteeNights}-night guarantee (${M.guaranteeMinNights}-night minimum), delivery, Affirm at checkout, fabric swatches, or Bespoke.
- A REAL PERSON: if the visitor wants to talk to a person, asks something you can't answer, is an interior designer or trade buyer, or is ready to buy but has a question, tell them to email the team at ${STUDIO_EMAIL} (the team usually replies within one business day) or call ${STUDIO_PHONE}. Don't ask for their name, email or phone, and don't say you've passed anything on: you can't contact the team yourself. Never invent other contact details.

KNOWLEDGE
${ASSISTANT_KNOWLEDGE}`;

const TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "show_email_signup",
    description: `Open the site's email sign-up form for the visitor, which gives new subscribers ${WELCOME_OFFER.percent}% off their first order by email.`,
    input_schema: { type: "object", properties: {} },
  },
];

type Msg = { role: "user" | "assistant"; content: string };

const client = new Anthropic();

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 40;
}

function ask(messages: Anthropic.Beta.BetaMessageParam[]) {
  return client.beta.messages.create({
    model: MODEL,
    max_tokens: 2000,
    // Short chat answers: thinking stays on (it can't be turned off), at low effort.
    output_config: { effort: "low" },
    // The instructions and knowledge are the same on every request, so they're cached: repeat messages read them at
    // a fraction of the price.
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    tools: TOOLS,
    messages,
    // If a safety check declines a request, Anthropic retries it on its recommended fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });
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
    const convo: Anthropic.Beta.BetaMessageParam[] = [...messages];
    let out = await ask(convo);
    let showSignup = false;
    for (let i = 0; i < MAX_TOOL_ROUNDS && out.stop_reason === "tool_use"; i++) {
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
      for (const b of out.content) {
        if (b.type !== "tool_use") continue;
        const ok = b.name === "show_email_signup";
        showSignup ||= ok;
        results.push({
          type: "tool_result",
          tool_use_id: b.id,
          content: ok ? "The sign-up form is open on their screen." : "Unknown tool.",
          is_error: !ok,
        });
      }
      convo.push({ role: "assistant", content: out.content }, { role: "user", content: results });
      out = await ask(convo);
    }
    if (out.stop_reason === "refusal") {
      return Response.json({ reply: `That's one for the team. Email ${STUDIO_EMAIL} and they'll help.`, showSignup });
    }
    const reply = out.content
      .flatMap((b) => (b.type === "text" ? [b.text] : []))
      .join("\n")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/^#+\s*/gm, "")
      .trim();
    return Response.json({ reply: reply || `Sorry, I didn't catch that. You can always email ${STUDIO_EMAIL}.`, showSignup });
  } catch (e) {
    console.error("assistant", e);
    return Response.json({ reply: `Sorry, I'm having trouble right now. Email ${STUDIO_EMAIL} and the team will help.` });
  }
}
