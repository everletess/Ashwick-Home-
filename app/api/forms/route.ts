// Emails every site form submission to the studio through Resend (https://resend.com).
// Needs RESEND_API_KEY and a verified sending domain; see README "Forms".

const FORMS = {
  newsletter: "Newsletter sign-up",
  bespoke: "Bespoke enquiry",
  trade: "Trade application",
  hospitality: "Hospitality request",
  custom: "Customization request",
} as const;
type FormName = keyof typeof FORMS;

const TO = process.env.FORMS_TO ?? "hello@ashwickhome.com";
const FROM = process.env.FORMS_FROM ?? "Ashwick Home <forms@ashwickhome.com>";
const RESEND_URL = process.env.RESEND_API_URL ?? "https://api.resend.com/emails";
// Vercel caps request bodies at 4.5 MB, so attachments must fit under that.
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const MAX_FILES = 10;

// "firstName" -> "First name", for readable emails.
const label = (field: string) => {
  const words = field.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const isFormName = (v: unknown): v is FormName => typeof v === "string" && v in FORMS;
const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return fail(503, "Email is not set up yet.");

  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return fail(400, "Could not read the form.");
  }

  const form = data.get("form");
  if (!isFormName(form)) return fail(400, "Unknown form.");
  // Honeypot: real visitors never see or fill this field.
  if (data.get("_gotcha")) return Response.json({ ok: true });

  const email = String(data.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Please enter a valid email address.");

  const lines: string[] = [];
  const attachments: { filename: string; content: string }[] = [];
  let bytes = 0;
  for (const [name, value] of data) {
    if (name === "form" || name === "_gotcha") continue;
    if (typeof value === "string") {
      if (value.trim()) lines.push(`${label(name)}: ${value.trim()}`);
      continue;
    }
    if (value.size === 0) continue;
    bytes += value.size;
    if (attachments.length >= MAX_FILES || bytes > MAX_ATTACHMENT_BYTES) {
      return fail(413, "Attachments must be under 4 MB in total.");
    }
    attachments.push({
      filename: value.name || name,
      content: Buffer.from(await value.arrayBuffer()).toString("base64"),
    });
  }

  const who = String(data.get("name") ?? [data.get("firstName"), data.get("lastName")].filter(Boolean).join(" ")).trim();
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `${FORMS[form]}${who ? ` from ${who}` : ""}`,
      text: `${FORMS[form]} from ashwickhome.com\n\n${lines.join("\n")}`,
      attachments: attachments.length ? attachments : undefined,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("Form email failed", form, res?.status, res && (await res.text().catch(() => "")));
    return fail(502, "We couldn't send that just now.");
  }
  return Response.json({ ok: true });
}
