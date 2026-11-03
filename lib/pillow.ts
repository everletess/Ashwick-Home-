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
  { id: "living-wool-horse-hair", label: "Living Wool + Horse Hair", price: 269, desc: "Living Wool with horse hair. Removable cover in your mattress color. Handmade." },
  { id: "kapok", label: "Kapok", price: 229, desc: "Kapok fill. Removable cover in your mattress color. Handmade." },
  { id: "organic-cotton", label: "100% Organic Cotton", price: 199, desc: "Organic cotton fill. Removable cover in your mattress color. Handmade." },
] as const;

export const PILLOW_SIZES = [
  { id: "standard", label: "Standard 20x26" },
  { id: "queen", label: "Queen 20x30" },
  { id: "king", label: "King 20x36" },
] as const;

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
  full: "Return within 14 days. Unused pillows are fully refunded. A used pillow carries a 15% restocking fee. Email hello@ashwickhome.com to arrange it first.",
} as const;

/** Pillow FAQ, drawn from The Futon Shop's own product pages (they make the pillows; Tessa 03/11). */
export const PILLOW_FAQ: [string, string][] = [
  ["Is there a smell when it arrives?", "You may notice a slight, natural odor when you first unpack a new pillow. It is harmless and fades on its own within about a week, or a few extra days in a humid climate."],
  ["How firm is it?", "Medium-firm. The fill is adjustable, so you can add or remove fill material to set your own height and firmness, whether you sleep on your back, side or stomach."],
  ["Can I adjust the fill?", "Yes. Add or remove fill to find your level of support. Adjustable pillows adapt to your needs by changing their height and firmness."],
  ["How do I wash it?", "Do not machine wash the pillow itself. Air it out in the sun to refresh it. The removable cover washes in cold water and should be line dried."],
  ["What is it made of?", "A removable cover in 100% organic cotton twill, over your choice of fill: organic Living Wool with organic latex, organic Living Wool with horsehair, or 100% organic cotton. No synthetic fills."],
  ["What are the sizes?", "Standard 20 × 26 in, Queen 20 × 30 in and King 20 × 36 in."],
];

/** Side-by-side facts for the pillows collection page, from The Futon Shop's pages for the same pillows. */
export const PILLOW_COMPARE: Record<string, { fill: string; feel: string; notes: string }> = {
  "living-wool-latex": { fill: "Shredded organic latex (GOLS) with organic Living Wool (GOTS)", feel: "Medium-firm", notes: "Breathable, no off-gassing, naturally resistant to dust mites and mold, flame resistant." },
  "living-wool-horse-hair": { fill: "Three layers of OEKO-TEX certified horsehair wrapped in organic Living Wool (GOTS)", feel: "Medium-firm", notes: "Hollow strands move air and wick moisture, regulates temperature, holds its structure for years, flame resistant." },
  "organic-cotton": { fill: "Certified organic cotton (USDA organic), stuffing to case", feel: "Medium-firm", notes: "Soft and breathable, hypoallergenic, resistant to dust mites, mold and mildew." },
};
