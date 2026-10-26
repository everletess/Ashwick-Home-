/**
 * Customer reviews, shown on the product pages. Only real reviews from real customers go here (no placeholders,
 * no invented quotes). Add one by appending to REVIEWS with the product key it belongs to.
 * With none for a product, its page shows the "No reviews yet" block and no star rating or rating markup.
 */
export type ProductKey = "ashbury" | "ashbury-dog-bed" | "nook";

export type Review = {
  product: ProductKey;
  /** 1 to 5. */
  rating: number;
  title?: string;
  body: string;
  /** First name and last initial, e.g. "Maya R." */
  author: string;
  /** ISO date, e.g. "2026-11-20". */
  date: string;
  /** Only true when the reviewer is a matched order in Shopify. */
  verified: boolean;
  /** What they bought, e.g. "Queen, Firm, Moss". */
  purchase?: string;
};

export const REVIEWS: Review[] = [];

export function reviewsFor(product: ProductKey) {
  const items = REVIEWS.filter((r) => r.product === product).sort((a, b) => b.date.localeCompare(a.date));
  const count = items.length;
  const average = count ? Math.round((items.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  return { items, count, average };
}
