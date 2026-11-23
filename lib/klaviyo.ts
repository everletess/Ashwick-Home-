// Klaviyo on-site tracking (klaviyo.js), loaded in app/layout.tsx on the live site only.
// klaviyo.js recognises returning subscribers (from email links and its own cookie), records "Active on Site", and
// lets us record "Viewed Product" and "Added to Cart" for them, which the browse- and cart-abandonment flows need.
// Everything here is best effort: it never throws and never blocks the page.

type KlaviyoApi = {
  identify: (props: Record<string, unknown>) => Promise<unknown>;
  track: (event: string, props?: Record<string, unknown>) => Promise<unknown>;
  isIdentified: () => Promise<boolean>;
};

function api(): KlaviyoApi | null {
  if (typeof window === "undefined") return null;
  const k = (window as unknown as { klaviyo?: KlaviyoApi }).klaviyo;
  return k && typeof k === "object" ? k : null;
}

/** Ties this browser to the subscriber, so their visits and product views reach their Klaviyo profile. */
export function klaviyoIdentify(email: string | null | undefined): void {
  const e = (email ?? "").trim();
  if (!e.includes("@")) return;
  try {
    void api()?.identify({ email: e })?.catch?.(() => {});
  } catch {}
}

export function klaviyoTrack(event: string, props: Record<string, unknown>): void {
  try {
    void api()?.track(event, props)?.catch?.(() => {});
  } catch {}
}

/** True when klaviyo.js already knows who this visitor is (e.g. they arrived from an Ashwick email). */
export async function klaviyoKnowsVisitor(): Promise<boolean> {
  try {
    const k = api();
    if (!k) return false;
    return Boolean(await Promise.race([k.isIdentified(), new Promise<boolean>((r) => setTimeout(() => r(false), 1500))]));
  } catch {
    return false;
  }
}
