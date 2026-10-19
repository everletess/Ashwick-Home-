/**
 * The Ashbury (Organic Luxury Collection): every price, size, name and policy value used on the mattress page, Inside
 * the Ashbury and the Guarantee & warranty page. Change values here, not in the page markup.
 *
 * Anything in [square brackets] is pending confirmation and is shown on the pages as written so it gets caught in
 * review.
 */
import type { PhotoKey } from "@/lib/photos";

export const MATTRESS_PATH = "/products/luxury-organic-mattress";
export const GUARANTEE_PATH = "/pages/guarantee-warranty";

export type MattressSize = { id: string; label: string; dims: string; price: number };
/** photos: this color's own shots, first one leading the gallery (and shown on the home page feature); the shared shots in MATTRESS_GALLERY follow. */
export type MattressColor = { id: string; label: string; swatch: PhotoKey; photos: PhotoKey[]; alt: string };

export const MATTRESS = {
  id: "natural-mattress",
  /** Shopify product handle. */
  handle: "natural-mattress",
  title: "The Ashbury",
  /** Shown beneath the title. */
  collection: "Organic Luxury Collection",
  /** Name in running copy and buttons ("the Ashbury", "Shop the Ashbury"). */
  shortName: "Ashbury",
  type: "Mattress",
  vendor: "Ashwick Home",

  /** Prices include the 3" topper and shipping. */
  sizes: [
    { id: "twin", label: "Twin", dims: '39" × 75"', price: 3200 },
    { id: "twin-xl", label: "Twin XL", dims: '38" × 80"', price: 3400 },
    { id: "full", label: "Full", dims: '54" × 75"', price: 3900 },
    { id: "queen", label: "Queen", dims: '60" × 80"', price: 4800 },
    { id: "eastern-king", label: "King", dims: '76" × 80"', price: 5800 },
    { id: "cal-king", label: "Cal King", dims: '72" × 84"', price: 5800 },
  ] satisfies MattressSize[],
  /** Size selected when the page opens. */
  defaultSize: "queen",

  /** Same price for both feels. */
  feels: [
    { id: "soft", label: "Soft" },
    { id: "firm", label: "Firm" },
  ],

  /**
   * Same price for every color, in this order on the page. Ids are the original color ids (kept so variants don't
   * change); labels are the current names. File names still use the old names (mocha, safari, dove, khaki, natural).
   */
  colors: [
    { id: "natural", label: "Fleece", swatch: "mattress-swatch-natural", photos: ["mattress-room-fleece", "mattress-studio-natural"], alt: "The Ashbury in Fleece" },
    { id: "dove", label: "Flint", swatch: "mattress-swatch-dove", photos: ["mattress-room-dove", "mattress-studio-dove"], alt: "The Ashbury in Flint" },
    { id: "khaki", label: "Moss", swatch: "mattress-swatch-khaki", photos: ["mattress-room-moss", "mattress-studio-khaki"], alt: "The Ashbury in Moss" },
    // The new Hazel render replaces the old Safari studio shot in the gallery (the old file is kept, unused).
    { id: "safari", label: "Hazel", swatch: "mattress-swatch-hazel", photos: ["mattress-room-hazel", "mattress-studio-hazel", "mattress-safari-room"], alt: "The Ashbury in Hazel" },
    { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha", photos: ["mattress-room-sorrel", "mattress-studio-mocha", "mattress-mocha-room"], alt: "The Ashbury in Sorrel" },
  ] satisfies MattressColor[],
  /** Color selected when the page opens (its first photo leads the gallery and the social preview). */
  defaultColor: "mocha",

  /** false shows "Coming soon" in place of Add to cart. */
  available: true,
  leadTime: "Made to order. Ships in 1–2 weeks.",
  shipping: "Delivery included.",
  guarantee: "100-night money-back guarantee",
  guaranteeNights: 100,
  /** Nights a mattress must be slept on before a return can be requested. */
  guaranteeMinNights: 30,
  warranty: "Lifetime limited warranty",
  mattressHeight: '8"',
  topperHeight: '3"',
  combinedHeight: '11"',
  customSize: "Custom sizes available. A surcharge applies; we'll quote it on request.",
  gotsManufacturer: "IDFL No. 32860",
};

/** Shots shown after the selected color's own, for every color. */
// The color lineup graphic (mattress-colors) is out of the gallery until it's regenerated with the new color names.
export const MATTRESS_GALLERY: { photo: PhotoKey; alt: string }[] = [
  { photo: "mattress-cutaway", alt: "The Ashbury: the layers inside" },
];

export const sizeById = (id: string) => MATTRESS.sizes.find((s) => s.id === id) ?? MATTRESS.sizes[0];
export const colorById = (id: string) => MATTRESS.colors.find((c) => c.id === id) ?? MATTRESS.colors[0];

/** Link to the mattress page with a color selected, by its current name (?color=sorrel). */
export const mattressColorHref = (id: string) => `${MATTRESS_PATH}?color=${colorById(id).label.toLowerCase()}`;
/** The color id for a ?color= value: its current name, or the original id that older links and the feed used. */
export const colorFromParam = (v: string | null) =>
  v ? MATTRESS.colors.find((c) => c.label.toLowerCase() === v.toLowerCase() || c.id === v)?.id : undefined;
