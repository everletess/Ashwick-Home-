import type { PhotoKey } from "@/lib/photos";

/**
 * The Ashwick Pillow (standalone). Shopify product `ashwick-pillow`: options Fill / Size / Cover color, flat price per
 * fill across sizes. NOT linked from navigation or collections until the owner approves; the direct URL works.
 * A removable cover in the mattress colors always comes with every pillow.
 */
export const PILLOW_PATH = "/collections/pillows";
/** The old single page; it redirects to the pillows collection. */
export const PILLOW_OLD_PATH = "/products/ashwick-pillow";
/** Cart / checkout product id and Shopify handle. */
export const PILLOW_ID = "ashwick-pillow";

/** The four approved fills (Shopify option values, also the bedding set's Pillow values). One factual line each. */
export const PILLOW_TYPES = [
  { id: "living-wool-latex", label: "Living Wool + Organic Latex", price: 269, desc: "Living Wool with an organic latex core. Removable cover in your mattress color. Handmade." },
  { id: "living-wool-horse-hair", label: "Living Wool + Horsehair", price: 269, desc: "Living Wool with horsehair. Removable cover in your mattress color. Handmade." },
  { id: "kapok", label: "Kapok", price: 229, desc: "Kapok fill. Removable cover in your mattress color. Handmade." },
  { id: "organic-cotton", label: "100% Organic Cotton", price: 199, desc: "Organic cotton fill. Removable cover in your mattress color. Handmade." },
] as const;

export const PILLOW_SIZES = [
  { id: "standard", label: "Standard 20x26" },
  { id: "queen", label: "Queen 20x30" },
  { id: "king", label: "King 20x36" },
] as const;

/** Regular price by fill and size (Tessa's brief, 04/11). The Black Friday 20% comes off automatically on top. */
export const PILLOW_PRICES: Record<string, Record<string, number>> = {
  "living-wool-horse-hair": { standard: 269, queen: 299, king: 329 },
  "living-wool-latex": { standard: 199, queen: 229, king: 249 },
  "organic-cotton": { standard: 129, queen: 149, king: 169 },
};
export const pillowPrice = (fillId: string, sizeId: string) => PILLOW_PRICES[fillId]?.[sizeId] ?? PILLOW_PRICES[fillId]?.standard ?? 0;
export const pillowFromPrice = (fillId: string) => Math.min(...Object.values(PILLOW_PRICES[fillId] ?? { x: 0 }));

/** Cover colors are the mattress colors (Shopify option "Cover color"). Swatches are the Ashbury's. */
export const PILLOW_COVERS = [
  { id: "natural", label: "Fleece", swatch: "mattress-swatch-natural" },
  { id: "dove", label: "Flint", swatch: "mattress-swatch-dove" },
  { id: "safari", label: "Flax", swatch: "mattress-swatch-safari" },
  { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha" },
] as const;

/**
 * Fills offered on the standalone pillow page (Tessa, 03/11): three. Kapok stays a bedding-set option only.
 * Each line states only what the fill is made of.
 */
const PILLOW_SLUGS: Record<string, string> = {
  "living-wool-latex": "pillow-living-wool-latex",
  "living-wool-horse-hair": "pillow-living-wool-horsehair",
  "organic-cotton": "pillow-organic-cotton",
};

export const PILLOW_STANDALONE_FILLS = PILLOW_TYPES.filter((f) => f.id !== "kapok").map((f) => ({
  ...f,
  /** The "From" price (Standard). The price for the chosen size is pillowPrice(). */
  price: pillowFromPrice(f.id),
  blurb:
    f.id === "living-wool-latex" ? "Organic Living Wool around an organic latex core."
    : f.id === "living-wool-horse-hair" ? "Organic Living Wool with horsehair."
    : "Organic cotton fill throughout.",
  /** Each fill is its own product page (Tessa, 03/11). */
  slug: PILLOW_SLUGS[f.id as string],
  path: "/products/" + PILLOW_SLUGS[f.id as string],
  /** What it is made of and how it behaves, from The Futon Shop's pages for the same pillow. */
  story:
    f.id === "living-wool-latex"
      ? "Shredded organic latex (GOLS certified) with organic Living Wool (GOTS). Latex is breathable and naturally resistant to dust mites and mold, and it does not off-gas. Wool regulates temperature, wicks away moisture and is naturally flame resistant. Medium-firm."
      : f.id === "living-wool-horse-hair"
        ? "Three layers of OEKO-TEX certified horsehair wrapped in organic Living Wool (GOTS), in an organic cotton barrier case. The hollow hair strands let air move through and wick away moisture, so it stays dry and regulates temperature. Hypoallergenic, mold, mildew and dust mite resistant, and naturally flame resistant. Horsehair holds its structure for years. Medium-firm."
        : "Certified organic cotton (USDA organic) from the stuffing to the case, with no synthetics and no chemicals. Naturally breathable and soft, hypoallergenic, and resistant to dust mites, mold and mildew. Medium-firm.",
}));

/** Cover-color photos for the standalone pillow page. One photo per cover color. */
export const PILLOW_COVER_PHOTOS = {
  natural: { photo: "pillow-fleece", alt: "Two Fleece cream pillows stacked on a travertine ledge" },
  mocha: { photo: "pillow-sorrel", alt: "Two Sorrel terracotta pillows stacked on a travertine ledge" },
  safari: { photo: "pillow-flax", alt: "Two Flax sand-colored pillows stacked on a travertine ledge" },
  dove: { photo: "pillow-flint", alt: "Two Flint grey pillows stacked on a travertine ledge" },
} as const;

/** Pillow returns (Tessa, 03/11). */
export const PILLOW_RETURNS = {
  days: 14,
  short: "14-day returns",
  full: "Pillows can be returned within 14 days of delivery. An unused pillow is refunded in full to your original payment method. A used pillow carries a 15% restocking fee. Email hello@ashwickhome.com with your order number to arrange a return before sending anything back.",
} as const;

/** Pillow FAQ, drawn from The Futon Shop's own product pages (they make the pillows; Tessa 03/11). */
export const PILLOW_FAQ: [string, string][] = [
  ["Fresh out of the box", "You may notice a slight, natural odor when you first unpack a new pillow. It is harmless and fades on its own within about a week, or a few extra days in a humid climate."],
  ["How firm is it?", "Medium-firm. The fill is adjustable, so you can add or remove fill material to set your own height and firmness, whether you sleep on your back, side or stomach."],
  ["Can I adjust the fill?", "Yes. Add or remove fill to find your level of support. Adjustable pillows adapt to your needs by changing their height and firmness."],
  ["How do I wash it?", "Do not machine wash the pillow itself. Air it out in the sun to refresh it. The removable cover washes in cold water and should be line dried."],
  ["What is it made of?", "A removable cover in 100% organic cotton twill, over your choice of fill: organic Living Wool with organic latex, organic Living Wool with horsehair, or 100% organic cotton. No synthetic fills."],
  ["What are the sizes?", "Standard 20 × 26 in, Queen 20 × 30 in and King 20 × 36 in."],
];

/** Sleep positions, for the "Best for" icons. */
export type SleepPosition = "back" | "side" | "stomach";

/**
 * The Pillows page story (Tessa's brief, round 2, 04/11). `desc` is each pillow's full description, word for word.
 * Feel (1 soft – 5 firm), temperature (1 warm – 5 cool) and "best for" are the brief's suggested values and are
 * marked [confirm] there: change them here once Tessa confirms. Nothing here adds a claim the site doesn't already make.
 */
export const PILLOW_STORY: Record<string, {
  personality: string;
  bestFor: SleepPosition[];
  feel: number;
  feelLabel: string;
  feelsLike: string;
  temp: number;
  tempLabel: string;
  goodToKnow: string;
  certs: string[];
  desc: string;
  /** Card photo: its own cover color, so the three cards look different. Swap for the fill close-ups when they exist. */
  card: PhotoKey;
  cardAlt: string;
  /** Hover: the pillow with its fill in bowls. */
  hover: PhotoKey;
  cover: string;
}> = {
  "living-wool-horse-hair": {
    personality: "Our most breathable pillow. Wool and Swedish horsehair, layered by hand.",
    bestFor: ["back", "side"],
    feel: 4, feelLabel: "Medium-firm",
    feelsLike: "Holds its shape",
    temp: 5, tempLabel: "Coolest",
    goodToKnow: "Hollow strands move air and wick moisture; holds its structure for years; flame resistant.",
    certs: ["GOTS", "OEKO-TEX"],
    desc: "Three layers of OEKO-TEX certified horsehair wrapped in organic Living Wool (GOTS). Hollow strands move air and wick moisture, regulates temperature, holds its structure for years, flame resistant.",
    card: "pillow-sorrel", cardAlt: "Two Sorrel pillows stacked on a travertine ledge", hover: "pillow-fill-horsehair", cover: "mocha",
  },
  "living-wool-latex": {
    personality: "Buoyant support that springs back all night.",
    bestFor: ["side"],
    feel: 3, feelLabel: "Medium",
    feelsLike: "Cool and springy",
    temp: 4, tempLabel: "Cool",
    goodToKnow: "Breathable, no off-gassing, naturally resistant to dust mites and mold; flame resistant.",
    certs: ["GOTS", "GOLS"],
    desc: "Shredded organic latex (GOLS certified) with organic Living Wool (GOTS). Latex is breathable and naturally resistant to dust mites and mold, and it does not off-gas. Wool regulates temperature, wicks away moisture and is naturally flame resistant.",
    card: "pillow-flint", cardAlt: "Two Flint grey pillows stacked on a travertine ledge", hover: "pillow-fill-latex", cover: "dove",
  },
  "organic-cotton": {
    personality: "Pure, simple, and soft. Organic cotton, stuffing to case.",
    bestFor: ["stomach", "back"],
    feel: 2, feelLabel: "Medium-soft",
    feelsLike: "Soft and light",
    temp: 3, tempLabel: "Neutral",
    goodToKnow: "Soft and breathable, hypoallergenic, resistant to dust mites, mold and mildew.",
    certs: ["USDA organic"],
    desc: "Certified organic cotton (USDA organic), stuffing to case. Soft and breathable, hypoallergenic, resistant to dust mites, mold and mildew.",
    card: "pillow-fleece", cardAlt: "Two Fleece cream pillows stacked on a travertine ledge", hover: "pillow-fill-cotton", cover: "natural",
  },
};

/** "Back & side sleepers" from a list of positions. */
export const bestForText = (p: SleepPosition[]) =>
  p.map((x, i) => (i === 0 ? x[0].toUpperCase() + x.slice(1) : x)).join(" & ") + " sleepers";

/**
 * "What's inside": one panel per material (brief section 4). `in` lists the fills it's in; "cover" means every cover.
 * Photos are stand-ins until Tessa's sheep-pasture, horsehair-basket, latex and cotton images arrive.
 */
export const PILLOW_MATERIALS: { id: string; name: string; headline: string; copy: string; cert: string; in: string[]; photo: PhotoKey; alt: string; inset?: PhotoKey; insetAlt?: string }[] = [
  {
    id: "wool", name: "Living Wool", headline: "It starts in the pasture.",
    copy: "Our Living Wool is GOTS-certified organic wool from Lanas Trinidad in Uruguay. It keeps an even temperature, wicks away moisture and is naturally flame resistant.",
    cert: "GOTS", in: ["living-wool-horse-hair", "living-wool-latex"],
    photo: "materials-sheep", alt: "Sheep grazing on a green pasture", inset: "materials-wool", insetAlt: "A close-up of raw cream wool",
  },
  {
    id: "horsehair", name: "Swedish horsehair", headline: "Nature’s spring.",
    copy: "From tail clippings, so no horse is harmed. Each curled strand acts like a tiny spring, letting air move and holding its shape for years.",
    cert: "OEKO-TEX", in: ["living-wool-horse-hair"],
    photo: "materials-horsehair", alt: "A close-up of curled dark horsehair",
  },
  {
    id: "latex", name: "Organic latex", headline: "Tapped from the tree.",
    copy: "Shredded organic latex (GOLS certified), breathable and buoyant, naturally resistant to dust mites and mold, with no off-gassing.",
    cert: "GOLS", in: ["living-wool-latex"],
    photo: "pillow-fill-latex", alt: "A cream pillow with bowls of Living Wool and shredded organic latex beside it",
  },
  {
    id: "cotton", name: "Organic cotton", headline: "Soft by nature.",
    copy: "Certified organic cotton (USDA organic), soft and breathable, hypoallergenic, resistant to dust mites, mold and mildew.",
    cert: "USDA organic", in: ["organic-cotton", "cover"],
    photo: "pillow-fill-cotton", alt: "A cream pillow with a bowl of organic cotton fill beside it",
  },
];

/** "Not sure? Order two fills and keep the one you love." Off until Tessa confirms it (brief, section 2). */
export const PILLOW_TRY_TWO = false;
