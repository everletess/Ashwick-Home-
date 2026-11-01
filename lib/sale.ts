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
 * TODO(owner approval): final Best Friends Bundle pricing is NOT approved. Everything the site shows about bundle
 * price and contents comes from this one object. `discountPercent` is what the pair shows off list; it is currently the
 * sitewide 20% (so it equals what Shopify's automatic discount takes off each line). If the owner approves a different
 * number, Shopify must be changed to match or checkout will not equal the page.
 */
export const BUNDLE_CONFIG = {
  discountPercent: 20,
  /** A Mattress Protector (organic cotton, machine washable) comes with the bundle. */
  protectorIncluded: true,
  /** Free white glove on the mattress applies to the bundle only; standalone mattresses keep the usual charge. */
  whiteGloveIncluded: true,
  protectorName: "Mattress Protector",
  protectorCopy: "Organic cotton and machine washable.",
};

export const BUNDLE = {
  title: "The Best Friends Bundle",
  name: "Best Friends",
  path: "/bundles/best-friends",
  /** Cart line attribute on both lines, so the pair can be identified on the Shopify order (underscore keys stay hidden at checkout). */
  attribute: "_Bundle",
  idAttribute: "_Bundle ID",
};

/** The price after the sale, to the cent (Shopify rounds a percentage discount to the cent). */
export const salePrice = (n: number) => (SALE.active ? Math.round(n * (100 - SALE.percent)) / 100 : n);

/** A bundle line's price: the bundle percent off list (while the event is on). */
export const bundlePrice = (n: number) => (SALE.active ? Math.round(n * (100 - BUNDLE_CONFIG.discountPercent)) / 100 : n);

/** Standalone mattresses always keep the usual white glove charge; the bundle's mattress line carries a free one. */
export const mattressDelivery = () => MATTRESS.delivery;
export const bundleMattressDelivery = () => ({ label: MATTRESS.delivery.label, price: BUNDLE_CONFIG.whiteGloveIncluded ? 0 : MATTRESS.delivery.price });

/** A cart line's delivery as stored. */
export const deliveryFor = (line: { id: string; delivery?: { label: string; price: number } }) => line.delivery;
