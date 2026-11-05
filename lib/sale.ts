/**
 * The Black Friday event, in one place. Set `active` to false to take the whole event off the site: the
 * announcement bar, home banner, sale tags and prices, bundle and the /black-friday and /bundles pages all follow it.
 *
 * The discount itself is an automatic Shopify discount (20% off sitewide, mattresses included); it is applied at
 * checkout, not by this code. These values only decide what the site shows, so keep `percent` equal to Shopify's.
 * Deliberately no end date, countdown or scarcity wording anywhere on the site.
 */
import { MATTRESS } from "@/lib/mattress";
import { FURNITURE_DELIVERY_PRICE } from "@/lib/products";
import { PILLOW_TYPES } from "@/lib/pillow";
import type { PhotoKey } from "@/lib/photos";

/**
 * HERO IMAGE SLOT for the Best Friends Bundle (bundle page and /black-friday). Until the owner supplies the final
 * hero, this falls back to existing site photography. To swap: add the image to lib/photos.ts, set `photo` to its key
 * and `isFinal` to true. Do not use third-party (e.g. competitor) imagery here.
 */
export const BUNDLE_HERO: { photo: PhotoKey; alt: string; isFinal: boolean } = {
  photo: "bundle-hero",
  alt: "A terracotta Ashbury mattress on an oak bed frame, with a matching dog bed in the foreground and a curly golden dog resting on it",
  isFinal: true,
};

/** The pillow photo (two cream pillows beside a stack of removable covers), used on the standalone pillow page. */
export const PILLOW_HERO: { photo: PhotoKey; alt: string } = {
  photo: "pillow-hero",
  alt: "Two cream pillows on a travertine ledge beside a stack of four removable covers in different colors",
};

/** The four approved pillows that can come in the bedding set (Shopify option "Pillow" values), with one factual line each. */
export const BUNDLE_PILLOWS = PILLOW_TYPES;

/** Bedding cover colors (Shopify option "Cover color"). The Ashbury's four colors map one to one by id, so the cover follows the mattress color. */
export const BUNDLE_COVER_BY_MATTRESS_COLOR: Record<string, string> = { natural: "Fleece", dove: "Flint", safari: "Flax", mocha: "Sorrel" };

/**
 * The ONE place the sale's end is set. ISO time with its offset, e.g. "2026-12-01T23:59:59-08:00". While null the sale
 * runs with no countdown. Once it passes, `active` turns false on its own: the server pages regenerate within five
 * minutes (revalidate in app/layout.tsx) and the bar, hero and countdown switch in the browser at the second.
 */
const SALE_ENDS_AT: string | null = "2026-12-01T23:59:59-08:00";

export const SALE = {
  /** Master switch: false takes the whole event off the site now, whatever the end date. */
  enabled: true,
  percent: 20,
  name: "Black Friday",
  path: "/black-friday",
  endsAt: SALE_ENDS_AT,
  /** On while enabled and before the end time. Read fresh on every render. */
  get active() {
    return this.enabled && (!this.endsAt || Date.now() < Date.parse(this.endsAt));
  },
};

/** The live countdown shows only in the final 72 hours (from this time); before it, the offer band says "Ends Dec 1". */
export const countdownFrom = () => (SALE.endsAt ? Date.parse(SALE.endsAt) - 72 * 3600_000 : Infinity);
/** "Ends Dec 1" (Pacific), or "" with no end date set. */
export const saleEndShort = () =>
  SALE.endsAt ? "Ends " + new Date(SALE.endsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" }) : "";

/** "Ends Mon, Dec 1" (in Pacific time), or "" with no end date set. */
export const saleEndLabel = () =>
  SALE.endsAt ? "Ends " + new Date(SALE.endsAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Los_Angeles" }) : "";

/** Pillows carry a NEW badge through the end of this date (Pacific). */
export const PILLOWS_NEW_UNTIL = "2026-12-31T23:59:59-08:00";
export const pillowsAreNew = () => Date.now() < Date.parse(PILLOWS_NEW_UNTIL);
/** The gifts row stays, as "Gifts", through the same date once the sale is over. */
export const giftsShowing = () => SALE.active || pillowsAreNew();

/**
 * Best Friends Bundle (approved): an Ashbury, an Ashbury Dog Bed and a Best Friends Bedding Set (two pillows and a
 * Mattress Protector). The bedding set is a real third line, the Shopify product `best-friends-bedding-set` with one
 * variant per mattress size (all $200 list). The bundle discount is the sitewide percent (SALE.percent), applied by
 * Shopify's automatic discount to all three lines, so there is no separate bundle percentage.
 */
export const BUNDLE_CONFIG = {
  beddingSet: {
    name: "Best Friends Bedding Set",
    price: 200,
    handle: "best-friends-bedding-set",
    contents: "2 pillows and a Mattress Protector",
    /** Pillow size that comes with each mattress size (by MATTRESS size id). */
    pillowSize: { "twin-xl": "20×26", full: "20×26", queen: "20×30", "eastern-king": "20×36", "cal-king": "20×36" } as Record<string, string>,
  },
  /** Protector list price by size is $249 to $299 in Shopify. Per-size mapping not wired, so only the range is shown. */
  protectorListRange: "$249 to $299",
  /** Free white glove on the mattress applies to the bundle only; standalone mattresses keep the usual charge. */
  whiteGloveIncluded: true,
  /** Value of the free white glove (the standard mattress delivery charge). */
  whiteGloveValue: 200,
};

/** Pillow size name by mattress size id (Standard, Queen, King). */
export const pillowSizeNameFor = (id: string) => ({ "twin-xl": "Standard", full: "Standard", queen: "Queen", "eastern-king": "King", "cal-king": "King" } as Record<string, string>)[id] ?? "";
export const pillowSizeFor = (mattressSizeId: string) => BUNDLE_CONFIG.beddingSet.pillowSize[mattressSizeId] ?? "";

export const BUNDLE = {
  title: "The Best Friends Bundle",
  name: "Best Friends",
  path: "/bundles/best-friends",
  /** Cart line attribute on all three lines, so the bundle can be identified on the Shopify order (underscore keys stay hidden at checkout). */
  attribute: "_Bundle",
  idAttribute: "_Bundle ID",
};

/**
 * The Complete Sleep Suite: one Ashbury plus the same Best Friends Bedding Set (no dog bed). Same cart attributes,
 * same sitewide percent, same free white glove on the mattress (it checks out as the bundle mattress product).
 */
export const SLEEP_SUITE: { name: string; path: string; photo: PhotoKey; alt: string } = {
  name: "The Complete Sleep Suite",
  path: "/bundles/sleep-suite",
  photo: "sleep-suite-hero",
  alt: "A terracotta Ashbury mattress on an oak bed frame with two matching pillows and a folded cream mattress cover on a wooden stool",
};

/** Every bundle, by the value its lines carry in the `_Bundle` attribute. */
export const BUNDLES: { value: string; title: string; path: string }[] = [
  { value: BUNDLE.name, title: BUNDLE.title, path: BUNDLE.path },
  { value: SLEEP_SUITE.name, title: SLEEP_SUITE.name, path: SLEEP_SUITE.path },
];
/** Display title for a `_Bundle` attribute value (unknown values show as is). */
export const bundleTitleFor = (value: string) => BUNDLES.find((b) => b.value === value)?.title ?? value;

/** The price after the sale, to the cent (Shopify rounds a percentage discount to the cent). */
export const salePrice = (n: number) => (SALE.active ? Math.round(n * (100 - SALE.percent)) / 100 : n);

/** A bundle line's price: the same sitewide percent off list (while the event is on). */
export const bundlePrice = salePrice;

/** Standalone mattresses always keep the usual white glove charge; the bundle's mattress line carries a free one. */
export const mattressDelivery = () => MATTRESS.delivery;
export const bundleMattressDelivery = () => ({ label: MATTRESS.delivery.label, price: BUNDLE_CONFIG.whiteGloveIncluded ? 0 : MATTRESS.delivery.price });

/** A cart line's delivery as stored. */
export const deliveryFor = (line: { id: string; delivery?: { label: string; price: number } }) => line.delivery;

/** Furniture lines: any line with white glove that is not the mattress. Ignores a stale stored price (older saved carts say $750). */
export const isFurnitureLine = (line: { id: string; delivery?: { label: string; price: number } }) => !!line.delivery && line.id !== MATTRESS.id;

/** The one flat furniture delivery charge for the whole order: $450 if any furniture is in the cart, else $0. */
export const orderDelivery = (lines: { id: string; delivery?: { label: string; price: number } }[]) =>
  lines.some(isFurnitureLine) ? FURNITURE_DELIVERY_PRICE : 0;

/** Sleep Suite price for a mattress size (index into MATTRESS.sizes, or size id): mattress + bedding set, at list and after the sitewide percent. */
export function sleepSuitePrice(sizeIndexOrId: number | string = 0) {
  const m = typeof sizeIndexOrId === "number" ? MATTRESS.sizes[sizeIndexOrId] : MATTRESS.sizes.find((s) => s.id === sizeIndexOrId);
  const size = m ?? MATTRESS.sizes[0];
  const list = size.price + BUNDLE_CONFIG.beddingSet.price;
  return { list, sale: bundlePrice(size.price) + bundlePrice(BUNDLE_CONFIG.beddingSet.price) };
}

/**
 * The picture for a bundle in the cart and in emails: the bundle's own hero, not the separate product photos.
 * The Sleep Suite has one in Flint and one in Sorrel; `color` (the mattress color label) picks Flint for Flint orders.
 */
export function bundlePhotoFor(bundleName: string, color?: string): PhotoKey {
  if (bundleName !== SLEEP_SUITE.name) return BUNDLE_HERO.photo;
  return color === "Flint" ? "sleep-suite-flint" : "sleep-suite-thumb";
}

/** A bundle's mattress color, from its cart lines (the mattress line's "Color" option). */
export const bundleColorOf = (lines: { options: [string, string][] }[]) =>
  lines.map((l) => l.options.find(([k]) => k === "Color")?.[1]).find(Boolean);

/** What the Sleep Suite calls the shared bedding set (its Shopify product is named for the Best Friends Bundle). */
export const SLEEP_SUITE_BEDDING_NAME = "Bedding Set";

/** Products whose list price was raised before they sold at the old price: show only the sale price, no struck-through "was". */
export const NO_WAS_PRICE = new Set<string>([]);

/**
 * The Sleep Suite's two cart lines (the mattress and the bedding set), for a size, feel, color and pillow. The Suite
 * page and the cart's one-tap upgrade both add exactly these.
 */
export function sleepSuiteLines(o: { sizeId: string; feelId: string; colorId: string; pillowId?: string }) {
  const m = MATTRESS.sizes.find((s) => s.id === o.sizeId) ?? MATTRESS.sizes[0];
  const mc = MATTRESS.colors.find((c) => c.id === o.colorId) ?? MATTRESS.colors[0];
  const feel = MATTRESS.feels.find((f) => f.id === o.feelId) ?? MATTRESS.feels[0];
  const pil = BUNDLE_PILLOWS.find((x) => x.id === o.pillowId) ?? BUNDLE_PILLOWS[0];
  const tag: [string, string][] = [["_Bundle", SLEEP_SUITE.name], ["_Bundle ID", `sleep-suite-${Math.random().toString(36).slice(2, 8)}`]];
  return [
    {
      id: MATTRESS.id, name: MATTRESS.title, photo: mc.photos[0] ?? mc.swatch, price: m.price, qty: 1, mode: "As designed" as const,
      options: [["Size", `${m.label} (${m.dims})`], ["Feel", feel.label], ["Color", mc.label], ...tag] as [string, string][],
      delivery: bundleMattressDelivery(),
    },
    {
      id: BUNDLE_CONFIG.beddingSet.handle, name: SLEEP_SUITE_BEDDING_NAME, photo: mc.photos[0] ?? mc.swatch, price: BUNDLE_CONFIG.beddingSet.price, qty: 1, mode: "As designed" as const,
      options: [["Mattress size", m.label], ["Pillow", pil.label], ["Pillow size", `${pillowSizeNameFor(m.id)} ${pillowSizeFor(m.id).replace("×", "x")}`], ["Cover color", BUNDLE_COVER_BY_MATTRESS_COLOR[mc.id] ?? mc.label], ["Includes", "Two pillows and a Mattress Protector"], ...tag] as [string, string][],
    },
  ];
}

/**
 * The Sleep Suite against a standalone Ashbury of the same size with its paid white glove delivery, at today's prices.
 * `diff` < 0: the Suite costs less (save); > 0: it costs that much more; 0: the same.
 */
export function suiteVsAshbury(sizeId: string) {
  const m = MATTRESS.sizes.find((s) => s.id === sizeId) ?? MATTRESS.sizes[0];
  const suite = sleepSuitePrice(m.id).sale;
  const ashbury = salePrice(m.price) + MATTRESS.delivery.price;
  return { size: m, suite, ashbury, diff: Math.round((suite - ashbury) * 100) / 100 };
}

/** Link to the Suite with a size, feel and color already chosen. */
export const suiteHref = (o: { sizeId?: string; feelId?: string; colorId?: string }) =>
  `${SLEEP_SUITE.path}?${new URLSearchParams(Object.entries({ size: o.sizeId, feel: o.feelId, color: o.colorId }).filter(([, v]) => v) as [string, string][])}`;
