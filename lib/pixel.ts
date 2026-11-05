// Meta Pixel helpers. The base pixel (PageView) is loaded in app/layout.tsx.
// Purchase is sent by Shopify's own Meta integration from the hosted checkout.
// Every event also goes to Meta from our server (Conversions API, app/api/meta-events) with the same event ID, so Meta
// keeps one of each pair and still gets the events the browser pixel loses.

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead" | "Contact";

/** A fresh ID shared by the browser event and its server copy. */
export function newEventId(prefix = "ev") {
  const r = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}-${r}`;
}

async function sha256(s: string) {
  if (typeof crypto === "undefined" || !crypto.subtle) return undefined;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.trim().toLowerCase()));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * The server copy of a pixel event (Conversions API). sendBeacon survives the redirect to
 * checkout. The email, when we have one (a subscriber, or the Lead itself), is hashed here before it is sent.
 */
export function sendServerEvent(name: string, eventId: string, customData: Record<string, unknown> = {}, email?: string) {
  if (typeof window === "undefined") return; // The server decides whether to send (live site, or a test code on previews).
  void (async () => {
    let em: string | undefined;
    try {
      const e = email ?? localStorage.getItem("aw-subscriber-email") ?? ""; // lib/subscribe.ts SUBSCRIBER_EMAIL_KEY
      if (e.includes("@")) em = await sha256(e);
    } catch {}
    const body = JSON.stringify({ event_name: name, event_id: eventId, event_source_url: location.href, custom_data: customData, em });
    try {
      if (!navigator.sendBeacon?.("/api/meta-events", new Blob([body], { type: "application/json" }))) {
        await fetch("/api/meta-events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
      }
    } catch {}
  })();
}

/**
 * Site product id → Shopify product id. Meta's catalog is synced from Shopify, where every size/colour variant
 * shares the Shopify product id as its item group, so sending these ids (with content_type "product_group")
 * lets Meta match site events to catalog items for dynamic/retargeting ads.
 */
const SHOPIFY_PRODUCT_IDS: Record<string, string> = {
  "natural-mattress": "15419423654114",
  "luxury-organic-mattress": "15419423654114",
  "the-ashbury": "15419423654114",
  marlowe: "15387070398690",
  "marlowe-loveseat": "15387070496994",
  chatsworth: "15387070562530",
  cotswold: "15387070628066",
  burford: "15387070726370",
  pembroke: "15387070857442",
  "cotswold-chair": "15387070922978",
  "marlowe-chair": "15387070988514",
  "marlowe-ottoman": "15387071086818",
};
const catalogId = (id: unknown) => {
  const k = String(id);
  return SHOPIFY_PRODUCT_IDS[k] ?? SHOPIFY_PRODUCT_IDS[k.replace(/^the-/, "")] ?? k;
};

/** Rewrites content_ids / contents[].id to catalog ids so Meta can match the event to a product. */
function forCatalog(params: Record<string, unknown>) {
  const out = { ...params };
  if (Array.isArray(out.content_ids)) {
    out.content_ids = [...new Set((out.content_ids as unknown[]).map(catalogId))];
    out.content_type = "product_group";
  }
  if (Array.isArray(out.contents)) {
    out.contents = (out.contents as { id: unknown }[]).map((c) => ({ ...c, id: catalogId(c.id) }));
  }
  return out;
}

// Meta event -> Google Analytics 4 recommended ecommerce event.
const GA_EVENTS: Record<PixelEvent, string> = {
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Lead: "generate_lead",
  Contact: "contact",
};

function gtagEvent(event: PixelEvent, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== "function") return;
  const items = Array.isArray(params.contents)
    ? (params.contents as { id: unknown; quantity?: number; item_price?: number }[]).map((c) => ({
        item_id: String(c.id),
        quantity: c.quantity ?? 1,
        price: c.item_price,
      }))
    : Array.isArray(params.content_ids)
      ? (params.content_ids as unknown[]).map((id) => ({ item_id: String(id) }))
      : undefined;
  g("event", GA_EVENTS[event], {
    currency: "USD",
    value: typeof params.value === "number" ? params.value : undefined,
    items,
  });
}

export function track(event: PixelEvent, params: Record<string, unknown> = {}, email?: string) {
  const eventID = newEventId();
  const data = { currency: "USD", ...forCatalog(params) };
  try {
    fbq()?.("track", event, data, { eventID });
  } catch {
    // Never let tracking break the site.
  }
  try {
    sendServerEvent(event, eventID, data, email);
  } catch {
    // Never let tracking break the site.
  }
  try {
    gtagEvent(event, params);
  } catch {
    // Never let tracking break the site.
  }
}

/**
 * Fire an event and give the browser a moment to send it before we navigate
 * away (e.g. redirecting to Shopify checkout). Without the pause the request
 * is often cancelled by the page unload and Meta never sees the event.
 */
export function trackThen(event: PixelEvent, params: Record<string, unknown>, then: () => void, waitMs = 400) {
  track(event, params);
  window.setTimeout(then, fbq() || (window as unknown as { gtag?: unknown }).gtag ? waitMs : 0);
}

/** A custom event (Meta trackCustom, and the same name to Google), e.g. SwitchToSleepSuite. Never throws. */
export function trackCustom(name: string, params: Record<string, unknown> = {}) {
  const eventID = newEventId();
  try {
    fbq()?.("trackCustom", name, { currency: "USD", ...params }, { eventID });
    sendServerEvent(name, eventID, { currency: "USD", ...params });
  } catch {
    // Never let tracking break the site.
  }
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", name, params);
  } catch {
    // Never let tracking break the site.
  }
}
