// Newsletter sign-up, shared by the pop-up, the homepage form and the footer form.
// Adds the email to the Klaviyo list (which starts the welcome flow with ASHWICK15) using Klaviyo's public
// client API, so only the public company ID is used, never a secret key. Also notifies the studio (best effort).

const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
export const SUBSCRIBED_KEY = "aw-popup-dismissed";

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
  return { klaviyo: k };
}
