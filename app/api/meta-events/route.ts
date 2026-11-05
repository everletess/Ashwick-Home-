/**
 * POST /api/meta-events: Meta Conversions API (server events) for the website.
 *
 * The browser pixel sends each event (PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Contact and the custom
 * ones) with an event ID; lib/pixel.ts posts the same event and ID here, and this sends it to Meta from the server.
 * Meta keeps one of each pair (deduplication by event_name + event_id), so nothing is counted twice, and events the
 * browser loses (ad blockers, Safari limits, a page closed early) still arrive. Checkout events and Purchase come from
 * Shopify's own Meta integration, as before.
 *
 * Settings (Vercel → Project → Environment Variables; never in the code or the chat):
 *   META_CAPI_TOKEN         the Conversions API access token from Events Manager (required; without it this does nothing)
 *   META_PIXEL_ID           optional, defaults to the site's pixel
 *   META_TEST_EVENT_CODE    optional, sends to Events Manager's "Test events" tab instead (and works on previews)
 * Only the production site sends real events; preview builds stay quiet unless META_TEST_EVENT_CODE is set.
 */
import { NextResponse, type NextRequest } from "next/server";

const PIXEL_ID = process.env.META_PIXEL_ID || "1118741870615996";
const GRAPH = process.env.META_GRAPH_URL || "https://graph.facebook.com/v21.0"; // override only for local testing
const STANDARD = new Set(["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Lead", "Contact"]);
const HEX64 = /^[a-f0-9]{64}$/;

type Body = { event_name?: unknown; event_id?: unknown; event_source_url?: unknown; custom_data?: unknown; em?: unknown };

/** A custom_data object with only plain values Meta accepts (no nested surprises, nothing huge). */
function cleanCustomData(v: unknown): Record<string, unknown> | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 20)) {
    if (!/^[a-z_]{1,40}$/.test(k)) continue;
    if (typeof val === "string") out[k] = val.slice(0, 300);
    else if (typeof val === "number" && Number.isFinite(val)) out[k] = val;
    else if (Array.isArray(val)) out[k] = val.slice(0, 50);
  }
  return out;
}

export async function POST(req: NextRequest) {
  const token = process.env.META_CAPI_TOKEN;
  const testCode = process.env.META_TEST_EVENT_CODE;
  const live = process.env.VERCEL_ENV === "production";
  if (!token || (!live && !testCode)) return new NextResponse(null, { status: 204 });

  let body: Body;
  try {
    const text = await req.text();
    if (text.length > 8_000) return new NextResponse(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const name = typeof body.event_name === "string" ? body.event_name : "";
  if (!STANDARD.has(name) && !/^[A-Za-z]{3,40}$/.test(name)) return new NextResponse(null, { status: 400 });
  const eventId = typeof body.event_id === "string" ? body.event_id.slice(0, 64) : undefined;
  const sourceUrl = typeof body.event_source_url === "string" ? body.event_source_url.slice(0, 1000) : undefined;

  // Match keys: the browser's IP and user agent, Meta's own first-party cookies, and (for subscribers) the email,
  // already SHA-256 hashed in the browser so it never reaches us in plain text.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  let fbc = req.cookies.get("_fbc")?.value;
  if (!fbc && sourceUrl) {
    try {
      const clid = new URL(sourceUrl).searchParams.get("fbclid");
      if (clid) fbc = `fb.1.${Date.now()}.${clid}`;
    } catch {}
  }
  const em = typeof body.em === "string" && HEX64.test(body.em) ? [body.em] : undefined;

  const payload: Record<string, unknown> = {
    data: [{
      event_name: name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: sourceUrl,
      action_source: "website",
      user_data: { client_ip_address: ip, client_user_agent: ua, fbp, fbc, em },
      custom_data: cleanCustomData(body.custom_data),
    }],
  };
  if (testCode) payload.test_event_code = testCode;

  try {
    const r = await fetch(`${GRAPH}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!r.ok) {
      // Logged for Vercel's function logs; the token is never part of the message.
      console.error("Meta CAPI", r.status, (await r.text()).slice(0, 500));
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Meta CAPI", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
