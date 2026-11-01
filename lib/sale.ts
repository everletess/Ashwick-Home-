/**
 * The Black Friday event, in one place. Set `active` to false to take the whole event off the site: the
 * announcement bar, home banner, sale tags and prices, bundle and the /black-friday and /bundles pages all follow it.
 *
 * The discount itself is an automatic Shopify discount (20% off sitewide, mattresses included); it is applied at
 * checkout, not by this code. These values only decide what the site shows, so keep `percent` equal to Shopify's.
 * Deliberately no end date, countdown or scarcity wording anywhere on the site.
 */
import { MATTRESS } from "@/lib/mattress";

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
    pillowSize: { "twin-xl": "26×20", full: "26×20", queen: "30×20", "eastern-king": "36×20", "cal-king": "36×20" } as Record<string, string>,
  },
  /** Protector list price by size is $249 to $299 in Shopify. Per-size mapping not wired, so only the range is shown. */
  protectorListRange: "$249 to $299",
  /** Free white glove on the mattress applies to the bundle only; standalone mattresses keep the usual charge. */
  whiteGloveIncluded: true,
  /** Value of the free white glove (the standard mattress delivery charge). */
  whiteGloveValue: 200,
};

export const pillowSizeFor = (mattressSizeId: string) => BUNDLE_CONFIG.beddingSet.pillowSize[mattressSizeId] ?? "";

export const BUNDLE = {
  title: "The Best Friends Bundle",
  name: "Best Friends",
  path: "/bundles/best-friends",
  /** Cart line attribute on all three lines, so the bundle can be identified on the Shopify order (underscore keys stay hidden at checkout). */
  attribute: "_Bundle",
  idAttribute: "_Bundle ID",
};

/** The price after the sale, to the cent (Shopify rounds a percentage discount to the cent). */
export const salePrice = (n: number) => (SALE.active ? Math.round(n * (100 - SALE.percent)) / 100 : n);

/** A bundle line's price: the same sitewide percent off list (while the event is on). */
export const bundlePrice = salePrice;

/** Standalone mattresses always keep the usual white glove charge; the bundle's mattress line carries a free one. */
export const mattressDelivery = () => MATTRESS.delivery;
export const bundleMattressDelivery = () => ({ label: MATTRESS.delivery.label, price: BUNDLE_CONFIG.whiteGloveIncluded ? 0 : MATTRESS.delivery.price });

/** A cart line's delivery as stored. */
export const deliveryFor = (line: { id: string; delivery?: { label: string; price: number } }) => line.delivery;
