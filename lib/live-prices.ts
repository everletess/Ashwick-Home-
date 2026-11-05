/**
 * Live list prices from Shopify for the Black Friday page (server only). Every Ashbury size, the bedding set, both dog
 * beds by size, the pillow fills and each furniture piece's lowest variant. Matching follows /api/price-check. Anything
 * Shopify doesn't return (or if the Storefront API is unreachable) falls back to the site's own price for that item,
 * and `source` says which was used. Sale prices and savings are worked out from these with the sitewide percent, the
 * same way Shopify's automatic discount takes it off at checkout.
 */
import { fetchVariantPrices, type PricedVariant } from "@/lib/shopify";
import { MATTRESS } from "@/lib/mattress";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { PILLOW_ID, PILLOW_STANDALONE_FILLS, pillowFromPrice } from "@/lib/pillow";
import { BUNDLE_CONFIG } from "@/lib/sale";
import { PRODUCTS, cardPrice } from "@/lib/products";

export type LivePrices = {
  source: "shopify" | "site";
  /** Ashbury list price by size id. */
  mattress: Record<string, number>;
  bedding: number;
  dogBed: Record<string, number>;
  nook: Record<string, number>;
  /** Lowest list price by pillow fill id. */
  pillow: Record<string, number>;
  /** Lowest list price by furniture product id. */
  furniture: Record<string, number>;
};

const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
const parts = (title: string) => title.split(" / ").map(norm);
const minOf = (xs: number[]) => (xs.length ? Math.min(...xs) : undefined);

function siteFallback(): LivePrices {
  return {
    source: "site",
    mattress: Object.fromEntries(MATTRESS.sizes.map((s) => [s.id, s.price])),
    bedding: BUNDLE_CONFIG.beddingSet.price,
    dogBed: Object.fromEntries(DOG_BED.sizes.map((s) => [s.id, s.price])),
    nook: Object.fromEntries(NOOK.sizes.map((s) => [s.id, s.price])),
    pillow: Object.fromEntries(PILLOW_STANDALONE_FILLS.map((f) => [f.id, pillowFromPrice(f.id)])),
    furniture: Object.fromEntries(PRODUCTS.map((p) => [p.id, cardPrice(p).price])),
  };
}

export async function getLivePrices(): Promise<LivePrices> {
  const site = siteFallback();
  let all: PricedVariant[];
  try {
    all = await fetchVariantPrices();
  } catch {
    return site;
  }
  if (!all.length) return site;
  let hits = 0;
  const pick = (fallback: number, found: number | undefined) => (found != null && found > 0 ? (hits++, found) : fallback);

  const mHandle = ["luxury-organic-mattress", MATTRESS.handle, "the-ashbury"].find((h) => all.some((v) => v.handle === h));
  const mattress = Object.fromEntries(MATTRESS.sizes.map((s) => [s.id, pick(s.price, minOf(all.filter((v) => v.handle === mHandle && parts(v.title).some((p) => p === norm(s.label) || p.startsWith(norm(s.label) + " "))).map((v) => v.price)))]));
  const bedding = pick(BUNDLE_CONFIG.beddingSet.price, minOf(all.filter((v) => v.handle === BUNDLE_CONFIG.beddingSet.handle).map((v) => v.price)));
  const bySize = (bed: typeof DOG_BED) => Object.fromEntries(bed.sizes.map((z) => [z.id, pick(z.price, minOf(all.filter((v) => v.handle === bed.id && norm(v.title.split(" / ")[0]) === norm(z.label)).map((v) => v.price)))]));
  const pillow = Object.fromEntries(PILLOW_STANDALONE_FILLS.map((f) => [f.id, pick(pillowFromPrice(f.id), minOf(all.filter((v) => v.handle === PILLOW_ID && parts(v.title).includes(norm(f.label))).map((v) => v.price)))]));
  const furniture = Object.fromEntries(PRODUCTS.map((p) => [p.id, pick(cardPrice(p).price, minOf(all.filter((v) => v.handle === p.id).map((v) => v.price)))]));

  return { source: hits > 0 ? "shopify" : "site", mattress, bedding, dogBed: bySize(DOG_BED), nook: bySize(NOOK), pillow, furniture };
}
