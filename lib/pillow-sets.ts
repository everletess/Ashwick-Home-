import { salePrice } from "@/lib/sale";
import { PILLOW_ID } from "@/lib/pillow";

/**
 * Pillow sets (Tessa, Nov 25 2026): sold singly or in sets of 2 and 4, one cover color per set. The set saving is
 * 5% (2+) or 10% (4+) off the price after any sale, and counts every Ashwick Pillow in the cart, so mixing fills
 * still counts. Mirrors Shopify's automatic discounts on the Ashwick Pillow: while the Black Friday 20% runs they are
 * 24% (2+) and 28% (4+) off, the same as 20% then 5% or 10% more; from Dec 2 they are 5% and 10%. Keep the two in step.
 */
export const PILLOW_SETS = [
  { id: "1", qty: 1, label: "Single" },
  { id: "2", qty: 2, label: "Set of 2", save: 5 },
  { id: "4", qty: 4, label: "Set of 4", save: 10 },
] as const;

/** The set saving (percent) for this many pillows. */
export const pillowSetSave = (count: number) => (count >= 4 ? 10 : count >= 2 ? 5 : 0);

/** What one pillow costs when the cart holds `count` pillows: the sale price, less the set saving. */
export const pillowSetUnit = (price: number, count: number) => Math.round(salePrice(price) * (100 - pillowSetSave(count))) / 100;

/** How many Ashwick Pillows a cart holds (all fills). */
export const pillowCount = (lines: { id: string; qty: number }[]) => lines.filter((l) => l.id === PILLOW_ID).reduce((s, l) => s + l.qty, 0);
