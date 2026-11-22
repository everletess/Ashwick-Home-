/**
 * Pieces shown as "Price upon request" instead of a price and Add to cart (Tessa, Nov 22). The list comes from Shopify:
 * every product tagged `price-on-request` (no product names in the code). Shopify handles are mapped to the site's
 * product ids with the same table checkout uses.
 *
 * If Shopify can't be reached, PRICE_ON_REQUEST_FALLBACK (a comma-separated list of Shopify handles, set in Vercel) is
 * used, so a Shopify outage never puts these pieces back on sale on the site.
 */
import { SHOPIFY_HANDLES } from "@/lib/checkout-match";
import { fetchPriceOnRequestHandles } from "@/lib/shopify";

const BY_HANDLE = Object.fromEntries(Object.entries(SHOPIFY_HANDLES).map(([id, handle]) => [handle, id]));

/** Site product ids (e.g. "chatsworth") currently priced upon request. */
export async function getPriceOnRequestIds(): Promise<string[]> {
  const handles = (await fetchPriceOnRequestHandles()) ?? (process.env.PRICE_ON_REQUEST_FALLBACK ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return [...new Set(handles.map((h) => BY_HANDLE[h] ?? h))];
}
