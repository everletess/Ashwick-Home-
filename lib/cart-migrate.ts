/**
 * Old carts (saved in the browser) can hold options the site no longer sells under that name: "Eastern King",
 * "Morning Dove", "Mocha Mousse", sizes written with ″ marks, an old price. `migrateLine` rewrites what maps one to
 * one onto today's options and prices; `isUnavailable` says a line has no current equivalent (a retired size such as
 * "Twin (39″ × 75″)", a retired color). The cart then checks what's left against Shopify (/api/cart-check).
 */
import { DOG_BED, NOOK, DOG_BED_ID } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PILLOW_ID, PILLOW_PATH } from "@/lib/pillow";
import { BUNDLE_CONFIG, SLEEP_SUITE } from "@/lib/sale";

type Line = { id: string; price: number | null; options: [string, string][] };

/** Old option names that mean exactly today's option. */
const SIZE_ALIASES: Record<string, string> = { "eastern king": "King", "california king": "Cal King" };
const COLOR_ALIASES: Record<string, string> = { natural: "Fleece", "morning dove": "Flint", dove: "Flint", hazel: "Flax", safari: "Flax", "mocha mousse": "Sorrel", mocha: "Sorrel" };

/** Ids the Ashbury has had in saved carts. */
const LEGACY_MATTRESS_IDS = ["luxury-organic-mattress", "the-ashbury", "ashbury"];

const sizeName = (v: string) => v.replace(/\s*\(.*$/, "").trim();
const opt = (l: Line, k: string) => l.options.find(([key]) => key === k)?.[1];
const setOpt = (l: Line, k: string, v: string): Line => ({ ...l, options: l.options.map(([key, val]) => (key === k ? [key, v] : [key, val])) });

function migrateSized<T extends Line>(l: T, sizes: readonly { label: string; dims: string; price: number }[], colors: readonly { label: string }[]): T {
  let out: Line = l;
  const sz = opt(out, "Size");
  if (sz) {
    const name = SIZE_ALIASES[sizeName(sz).toLowerCase()] ?? sizeName(sz);
    const cur = sizes.find((z) => z.label.toLowerCase() === name.toLowerCase());
    if (cur) {
      out = setOpt(out, "Size", `${cur.label} (${cur.dims})`);
      out = { ...out, price: cur.price };
    }
  }
  const c = opt(out, "Color");
  if (c && !colors.some((x) => x.label === c)) {
    const mapped = COLOR_ALIASES[c.toLowerCase()];
    if (mapped && colors.some((x) => x.label === mapped)) out = setOpt(out, "Color", mapped);
  }
  return out as T;
}

/** Today's names and prices for whatever maps one to one; anything else is left as it was. */
export function migrateLine<T extends Line>(l: T): T {
  if (LEGACY_MATTRESS_IDS.includes(l.id)) l = { ...l, id: MATTRESS.id };
  if (l.id === MATTRESS.id) return migrateSized(l, MATTRESS.sizes, MATTRESS.colors);
  if (l.id === DOG_BED_ID) return migrateSized(l, DOG_BED.sizes, DOG_BED.colors);
  if (l.id === NOOK.id) return migrateSized(l, NOOK.sizes, NOOK.colors);
  return l;
}

/** A line with no current equivalent (checked here first; /api/cart-check confirms the rest against Shopify). */
export function isUnavailable(l: Line): boolean {
  const sized = l.id === MATTRESS.id ? MATTRESS : l.id === DOG_BED_ID ? DOG_BED : l.id === NOOK.id ? NOOK : null;
  if (!sized) return false;
  const sz = opt(l, "Size") ?? "";
  const c = opt(l, "Color");
  return !sized.sizes.some((z) => sz.startsWith(`${z.label} (`)) || (c != null && !sized.colors.some((x) => x.label === c));
}

/** Where to choose a line's product again. */
export function productPathOf(id: string): string {
  if (id === MATTRESS.id) return MATTRESS_PATH;
  if (id === DOG_BED_ID) return DOG_BED.path;
  if (id === NOOK.id) return NOOK.path;
  if (id === PILLOW_ID) return PILLOW_PATH;
  if (id === BUNDLE_CONFIG.beddingSet.handle) return SLEEP_SUITE.path;
  return "/products/" + id;
}
