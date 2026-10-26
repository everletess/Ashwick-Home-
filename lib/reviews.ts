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

export const REVIEWS: Review[] = [
  {
    product: "ashbury",
    rating: 5,
    body: "The Ashbury is not only gorgeous it\u2019s the most comfortable mattress I\u2019ve ever slept on. Knowing I\u2019m protecting my environment at the same time only makes it better. I don\u2019t know if it\u2019s their mix of materials or how they mix them, but run dont walk into this bed.",
    author: "Shannon M.",
    date: "2026-10-25",
    verified: false,
  },
  {
    product: "ashbury",
    rating: 5,
    body: "I didn\u2019t know what I didn\u2019t know when it came to organic and mattresses. As soon as I learned about the off gassing and chemicals used in mattress making I knew I needed to make a change. The Ashbury has been game changing in sleep, comfort, breathability and support. I love the way it looks, but I love the sleep more.",
    author: "Connor S.",
    date: "2026-10-25",
    verified: false,
  },
  {
    product: "ashbury",
    rating: 5,
    body: "This Ashbury mattress is so pretty!!! I never thought a mattress could be colorful before, what a treat. It\u2019s also so incredibly comfortable and I\u2019m so pleased to know I\u2019m finally sleeping toxin free!!",
    author: "Christine W.",
    date: "2026-10-25",
    verified: false,
  },
];

export function reviewsFor(product: ProductKey) {
  const items = REVIEWS.filter((r) => r.product === product).sort((a, b) => b.date.localeCompare(a.date));
  const count = items.length;
  const average = count ? Math.round((items.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;
  return { items, count, average };
}
