// Meta Pixel helpers. The base pixel (PageView) is loaded in app/layout.tsx.
// Purchase is sent by Shopify's own Meta integration from the hosted checkout.

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead" | "Contact";

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

export function track(event: PixelEvent, params: Record<string, unknown> = {}) {
  try {
    fbq()?.("track", event, { currency: "USD", ...forCatalog(params) });
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
  window.setTimeout(then, fbq() ? waitMs : 0);
}
