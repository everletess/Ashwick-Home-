/**
 * Where a shopper came from, saved on their Shopify order (Tessa, Nov 26 2026: "figure out where that sale came from").
 *
 * Checkout starts on this site, not Shopify's storefront, so Shopify never sees the ad link or the referring site and
 * its order page says "no conversion details". This records them in the browser and sends them with every checkout,
 * where they become order attributes, shown on the Shopify order under "Additional details":
 *
 *   _Source        this visit: "facebook / paid · bf_free_pillows · Pillows - WARNING video (BF gift)", "google / organic", "(direct)"
 *   _First source  the first visit we saw from this browser (same format), with its date
 *   _Landing page  where this visit started, e.g. /black-friday
 *   _Referrer      the site that sent them, when there was one, e.g. instagram.com
 *
 * Kept in localStorage only (no cookie, nothing sent anywhere else). The leading underscore keeps them out of the
 * shopper's view at checkout. Client-side only; every function is a safe no-op on the server or with storage blocked.
 */

export type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  referrer?: string;
  landing: string;
  at: string; // ISO date
};

type Stored = { first?: Touch; last?: Touch };

const KEY = "aw-attribution";
/** A first visit older than this is forgotten, so "first source" stays meaningful. */
const FIRST_TTL_DAYS = 90;
const OWN_HOSTS = /(^|\.)(ashwickhome\.com|myshopify\.com|shopify\.com|vercel\.app|localhost)$/;

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|brave|search\.yahoo)\./;
const SOCIAL: [RegExp, string][] = [
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|m\.facebook\.com|l\.facebook\.com|lm\.facebook\.com)$/, "facebook"],
  [/(^|\.)(instagram\.com|l\.instagram\.com)$/, "instagram"],
  [/(^|\.)(pinterest\.[a-z.]+|pin\.it)$/, "pinterest"],
  [/(^|\.)(tiktok\.com)$/, "tiktok"],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, "x"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "linkedin"],
  [/(^|\.)(reddit\.com)$/, "reddit"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "youtube"],
];
const EMAIL = /(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com|klaviyo\.com|klclick\d*\.com|ctrk\.klclick\.com)$/;

const clip = (s: string | null | undefined, n = 120) => (s ? s.trim().slice(0, n) : undefined) || undefined;

function read(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

/** The touch for the current page view, or null when it carries no new information (an internal click, a reload). */
function currentTouch(): Touch | null {
  const url = new URL(window.location.href);
  const p = url.searchParams;
  const landing = clip(url.pathname, 200) ?? "/";
  const at = new Date().toISOString();
  let refHost: string | undefined;
  try {
    if (document.referrer) refHost = new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {}
  const external = refHost && !OWN_HOSTS.test(refHost) ? refHost : undefined;

  const utmSource = clip(p.get("utm_source"), 60);
  if (utmSource) {
    return {
      source: utmSource.toLowerCase(),
      medium: (clip(p.get("utm_medium"), 40) ?? "(none)").toLowerCase(),
      campaign: clip(p.get("utm_campaign"), 80),
      content: clip(p.get("utm_content"), 100),
      referrer: external,
      landing,
      at,
    };
  }
  // Ad clicks without UTM tags still carry the network's click id.
  if (p.get("fbclid")) return { source: external?.includes("instagram") ? "instagram" : "facebook", medium: "paid (fbclid)", referrer: external, landing, at };
  if (p.get("gclid") || p.get("gbraid") || p.get("wbraid")) return { source: "google", medium: "cpc", referrer: external, landing, at };
  if (p.get("ttclid")) return { source: "tiktok", medium: "paid", referrer: external, landing, at };
  if (p.get("_kx") || p.get("klaviyo")) return { source: "klaviyo", medium: "email", referrer: external, landing, at };

  if (external) {
    if (SEARCH.test(external)) return { source: external.split(".").slice(-2, -1)[0] ?? external, medium: "organic", referrer: external, landing, at };
    const social = SOCIAL.find(([re]) => re.test(external));
    if (social) return { source: social[1], medium: "social", referrer: external, landing, at };
    if (EMAIL.test(external)) return { source: "email", medium: "email", referrer: external, landing, at };
    return { source: external, medium: "referral", referrer: external, landing, at };
  }
  return null;
}

/** Record this page view. Call once per full page load (components/attribution-capture.tsx does). */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const stored = read();
    const firstStale = stored.first && Date.now() - Date.parse(stored.first.at) > FIRST_TTL_DAYS * 864e5;
    const t = currentTouch();
    const direct: Touch = { source: "(direct)", medium: "(none)", landing: clip(window.location.pathname, 200) ?? "/", at: new Date().toISOString() };
    const next: Stored = {
      first: !stored.first || firstStale ? (t ?? direct) : stored.first,
      // A new source replaces the last one; a direct visit or internal click keeps it (the usual last non-direct rule).
      last: t ?? stored.last ?? direct,
    };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

const describe = (t: Touch) => [`${t.source} / ${t.medium}`, t.campaign, t.content].filter(Boolean).join(" · ").slice(0, 250);

/** Order attributes for /api/checkout. Empty when nothing was recorded (or on the server). */
export function attributionAttributes(): { key: string; value: string }[] {
  if (typeof window === "undefined") return [];
  const { first, last } = read();
  if (!last && !first) return [];
  const out: { key: string; value: string }[] = [];
  if (last) {
    out.push({ key: "_Source", value: describe(last) });
    out.push({ key: "_Landing page", value: last.landing });
    if (last.referrer) out.push({ key: "_Referrer", value: last.referrer });
  }
  if (first) out.push({ key: "_First source", value: `${describe(first)} (${first.at.slice(0, 10)})`.slice(0, 250) });
  return out;
}

/** Server side: keep only the attributes above, trimmed, so a request can't put anything else on an order. */
export const ATTRIBUTION_KEYS = ["_Source", "_Landing page", "_Referrer", "_First source"] as const;
export function cleanAttribution(input: unknown): { key: string; value: string }[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input.flatMap((a) => {
    const key = typeof a?.key === "string" ? a.key : "";
    const value = typeof a?.value === "string" ? a.value.trim().slice(0, 255) : "";
    if (!(ATTRIBUTION_KEYS as readonly string[]).includes(key) || !value || seen.has(key)) return [];
    seen.add(key);
    return [{ key, value }];
  });
}
