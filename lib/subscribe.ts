// Newsletter sign-up, shared by the pop-up, the homepage form and the footer form.
// Adds the email to the Klaviyo list (which starts the welcome flow with ASHWICK15) using Klaviyo's public
// client API, so only the public company ID is used, never a secret key. Also notifies the studio (best effort).

const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
export const SUBSCRIBED_KEY = "aw-popup-dismissed";
/** Fired on window after any successful sign-up, so the pop-up and the 15% tab hide everywhere. */
export const SUBSCRIBED_EVENT = "ashwick:subscribed";

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
            profile: { data: { type: "profile", attributes: { email: value } } },
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
export async function saveCart(email: string, lines: SavedCartLine[], total: number | null): Promise<void> {
  const value = email.trim();
  await subscribeEmail(value, "Ashwick saved cart");
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
