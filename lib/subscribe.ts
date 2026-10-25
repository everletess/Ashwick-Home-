// Newsletter sign-up, shared by the pop-up, the homepage form and the footer form.
// Adds the email to the Klaviyo list (which starts the welcome flow with ASHWICK15) using Klaviyo's public
// client API, so only the public company ID is used, never a secret key. Also notifies the studio (best effort).

const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
export const SUBSCRIBED_KEY = "aw-popup-dismissed";
/** The subscriber's email, kept on this device so add-to-cart can be matched to them in Klaviyo. */
export const SUBSCRIBER_EMAIL_KEY = "aw-subscriber-email";
/** Fired on window after any successful sign-up, so the pop-up and the 15% tab hide everywhere. */
export const SUBSCRIBED_EVENT = "ashwick:subscribed";

const ATTRIBUTION_KEY = "aw-attribution";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** Stores the UTM tags from the landing URL (first touch wins; only overwritten by a newer tagged visit). */
export function captureAttribution(): void {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_FIELDS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 120);
    }
    if (Object.keys(found).length === 0) return;
    found.landing_path = window.location.pathname;
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(found));
  } catch {}
}

/** Klaviyo profile properties describing the ad/link that brought this visitor ("Signup ..." fields). */
function attributionProps(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    const a: Record<string, string> = raw ? JSON.parse(raw) : {};
    const out: Record<string, string> = {};
    if (a.utm_source) out["Signup UTM Source"] = a.utm_source;
    if (a.utm_medium) out["Signup UTM Medium"] = a.utm_medium;
    if (a.utm_campaign) out["Signup UTM Campaign"] = a.utm_campaign;
    if (a.utm_content) out["Signup UTM Content"] = a.utm_content;
    if (a.utm_term) out["Signup UTM Term"] = a.utm_term;
    if (a.landing_path) out["Signup Landing Page"] = a.landing_path;
    out["Signup Page"] = window.location.pathname;
    return out;
  } catch {
    return {};
  }
}

export type SubscribeResult = { klaviyo: boolean };

export async function subscribeEmail(email: string, source: string): Promise<SubscribeResult> {
  const value = email.trim();
  const klaviyo = (async () => {
    if (!KLAVIYO_COMPANY_ID || !KLAVIYO_LIST_ID) return false;
    const r = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            custom_source: source,
            profile: { data: { type: "profile", attributes: { email: value, properties: attributionProps() } } },
          },
          relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
        },
      }),
    });
    return r.ok; // 202 Accepted
  })().catch(() => false);
  const studio = (async () => {
    const fd = new FormData();
    fd.append("form", "newsletter");
    fd.append("email", value);
    const r = await fetch("/api/forms", { method: "POST", body: fd });
    return r.ok;
  })().catch(() => false);
  const [k, s] = await Promise.all([klaviyo, studio]);
  if (!k && !s) throw new Error("We couldn't sign you up just now. Please try again.");
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") fbq("track", "Lead", { content_name: source });
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "subscribed"); // subscribers never see the pop-up or tab again
    localStorage.setItem(SUBSCRIBER_EMAIL_KEY, value);
  } catch {}
  window.dispatchEvent(new Event(SUBSCRIBED_EVENT));
  return { klaviyo: k };
}

export type SavedCartLine = { productId: string; name: string; qty: number; price: number | null; options: [string, string][] };

/**
 * "Email me my cart": subscribes the address (so the welcome series and ASHWICK15 follow), then records a
 * "Saved Cart" event in Klaviyo carrying the items, a one-click checkout link and the total, which triggers
 * the saved-cart email. Uses only Klaviyo's public client API, like subscribeEmail above.
 */
/** US numbers only: returns +1XXXXXXXXXX, or null if it doesn't look like a valid number. */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return null;
}

/**
 * Stores an optional phone number on the Klaviyo profile. This is a profile attribute only: it does not opt the
 * number in to SMS marketing. Used for a personal call or text about the customer's cart.
 */
async function saveProfilePhone(email: string, phone: string): Promise<void> {
  if (!KLAVIYO_COMPANY_ID) return;
  await fetch(`https://a.klaviyo.com/client/profiles/?company_id=${KLAVIYO_COMPANY_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
    body: JSON.stringify({ data: { type: "profile", attributes: { email, phone_number: phone } } }),
  }).catch(() => {});
}

export async function saveCart(email: string, lines: SavedCartLine[], total: number | null, phone?: string | null): Promise<void> {
  const value = email.trim();
  await subscribeEmail(value, "Ashwick saved cart");
  if (phone) await saveProfilePhone(value, phone);
  let checkoutUrl = "https://ashwickhome.com/products/luxury-organic-mattress";
  try {
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: lines.map((l) => ({ productId: l.productId, qty: l.qty, options: l.options })) }),
    });
    const d = await r.json();
    if (r.ok && d.checkoutUrl) checkoutUrl = d.checkoutUrl;
  } catch {}
  if (!KLAVIYO_COMPANY_ID) return;
  await fetch(`https://a.klaviyo.com/client/events/?company_id=${KLAVIYO_COMPANY_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          metric: { data: { type: "metric", attributes: { name: "Saved Cart" } } },
          profile: { data: { type: "profile", attributes: { email: value } } },
          value: total ?? 0,
          properties: {
            CheckoutURL: checkoutUrl,
            ItemNames: lines.map((l) => l.name),
            Items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price, options: l.options.map(([k, v]) => `${k}: ${v}`).join(" · ") })),
            Total: total,
          },
        },
      },
    }),
  }).catch(() => {});
}

/**
 * "Added to Cart": when a known subscriber (signed up via the pop-up, footer, homepage form or cart box) adds
 * something to their cart, record an "Added to Cart" event in Klaviyo with the items and a one-click checkout
 * link, so the abandoned-cart flow can follow up. Anonymous visitors are skipped (no email, nothing to match).
 * Public client API only; never blocks or breaks the add-to-cart.
 */
export async function trackAddedToCart(lines: SavedCartLine[], total: number | null): Promise<void> {
  try {
    if (!KLAVIYO_COMPANY_ID || lines.length === 0) return;
    const email = localStorage.getItem(SUBSCRIBER_EMAIL_KEY);
    if (!email) return;
    let checkoutUrl = "https://ashwickhome.com/products/luxury-organic-mattress";
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: lines.map((l) => ({ productId: l.productId, qty: l.qty, options: l.options })) }),
      });
      const d = await r.json();
      if (r.ok && d.checkoutUrl) checkoutUrl = d.checkoutUrl;
    } catch {}
    await fetch(`https://a.klaviyo.com/client/events/?company_id=${KLAVIYO_COMPANY_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            metric: { data: { type: "metric", attributes: { name: "Added to Cart" } } },
            profile: { data: { type: "profile", attributes: { email } } },
            value: total ?? 0,
            properties: {
              CheckoutURL: checkoutUrl,
              ItemNames: lines.map((l) => l.name),
              Items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price, options: l.options.map(([k, v]) => `${k}: ${v}`).join(" · ") })),
              Total: total,
            },
          },
        },
      }),
    });
  } catch {
    // Never let tracking break the site.
  }
}
