// Meta Pixel helpers. The base pixel (PageView) is loaded in app/layout.tsx.
// Purchase is sent by Shopify's own Meta integration from the hosted checkout.

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

export type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead";

export function track(event: PixelEvent, params: Record<string, unknown> = {}) {
  try {
    fbq()?.("track", event, { currency: "USD", ...params });
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
