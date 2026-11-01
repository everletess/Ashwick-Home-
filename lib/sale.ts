/**
 * The Black Friday event, in one place. Set `active` to false to take the whole event off the site: the
 * announcement bar, home banner, sale tags and prices, bundle and the /black-friday and /bundles pages all follow it.
 *
 * The discount itself is an automatic Shopify discount (20% off sitewide, mattresses included); it is applied at
 * checkout, not by this code. These values only decide what the site shows, so keep `percent` equal to Shopify's.
 * Deliberately no end date, countdown or scarcity wording anywhere on the site.
 */
import { MATTRESS } from "@/lib/mattress";
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

export const SALE = {
  active: true,
  percent: 20,
  name: "Black Friday",
  path: "/black-friday",
};

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

/** Sleep Suite price for a mattress size (index into MATTRESS.sizes, or size id): mattress + bedding set, at list and after the sitewide percent. */
export function sleepSuitePrice(sizeIndexOrId: number | string = 0) {
  const m = typeof sizeIndexOrId === "number" ? MATTRESS.sizes[sizeIndexOrId] : MATTRESS.sizes.find((s) => s.id === sizeIndexOrId);
  const size = m ?? MATTRESS.sizes[0];
  const list = size.price + BUNDLE_CONFIG.beddingSet.price;
  return { list, sale: bundlePrice(size.price) + bundlePrice(BUNDLE_CONFIG.beddingSet.price) };
}
