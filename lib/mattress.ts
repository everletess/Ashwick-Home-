/**
 * The Ashwick Natural Mattress: every price, size, name and policy value used on the mattress page, the Living Wool
 * page and the Guarantee & warranty page. Change values here, not in the page markup.
 *
 * Anything in [square brackets] is pending confirmation and is shown on the pages as written so it gets caught in
 * review.
 */
import type { PhotoKey } from "@/lib/photos";

export const MATTRESS_PATH = "/products/natural-mattress";
export const LIVING_WOOL_PATH = "/pages/living-wool";
export const GUARANTEE_PATH = "/pages/guarantee-warranty";

export type MattressSize = { id: string; label: string; dims: string; price: number };
/** photos: this color's own shots, first one leading the gallery; the shared shots in MATTRESS_GALLERY follow. */
export type MattressColor = { id: string; label: string; swatch: PhotoKey; photos: PhotoKey[]; alt: string };

export const MATTRESS = {
  id: "natural-mattress",
  /** Shopify product handle. */
  handle: "natural-mattress",
  title: "The Ashwick Natural Mattress",
  type: "Mattress",
  vendor: "Ashwick Home",

  /** Prices include the 3" topper and shipping. */
  sizes: [
    { id: "twin", label: "Twin", dims: '38" × 75"', price: 3200 },
    { id: "twin-xl", label: "Twin XL", dims: '38" × 80"', price: 3400 },
    { id: "full", label: "Full", dims: '54" × 75"', price: 3900 },
    { id: "queen", label: "Queen", dims: '60" × 80"', price: 4800 },
    { id: "eastern-king", label: "Eastern King", dims: '76" × 80"', price: 5800 },
    { id: "cal-king", label: "Cal King", dims: '72" × 84"', price: 5800 },
  ] satisfies MattressSize[],
  /** Size selected when the page opens. */
  defaultSize: "queen",

  /** Same price for both feels. */
  feels: [
    { id: "soft", label: "Soft" },
    { id: "firm", label: "Firm" },
  ],

  /** Same price for every color, in this order on the page. Names are editable ("Mocha Mousse" may be renamed). */
  colors: [
    { id: "mocha", label: "Mocha Mousse", swatch: "mattress-swatch-mocha", photos: ["mattress-mocha-bedroom", "mattress-studio-mocha", "mattress-mocha-room"], alt: "The Ashwick Natural Mattress in Mocha Mousse" },
    { id: "safari", label: "Safari", swatch: "mattress-swatch-safari", photos: ["mattress-studio-safari", "mattress-safari-room"], alt: "The Ashwick Natural Mattress in Safari" },
    { id: "dove", label: "Morning Dove", swatch: "mattress-swatch-dove", photos: [], alt: "The Ashwick Natural Mattress in Morning Dove" },
    { id: "khaki", label: "Khaki", swatch: "mattress-swatch-khaki", photos: ["mattress-studio-khaki"], alt: "The Ashwick Natural Mattress in Khaki" },
    { id: "natural", label: "Natural", swatch: "mattress-swatch-natural", photos: ["mattress-studio-natural"], alt: "The Ashwick Natural Mattress in Natural" },
  ] satisfies MattressColor[],

  /** false shows "Coming soon" in place of Add to cart (until the Shopify product and checkout are set up). */
  available: false,
  leadTime: "Made to order. Ships in 1–2 weeks.",
  shipping: "Free shipping.",
  guarantee: "30-night money-back guarantee",
  guaranteeNights: 30,
  warranty: "Lifetime limited warranty",
  mattressHeight: '8"',
  topperHeight: '3"',
  combinedHeight: '11"',
  customSize: "Custom sizes available. A surcharge applies; we'll quote it on request.",
  gotsManufacturer: "IDFL No. 32860",
};

/** Shots shown after the selected color's own, for every color. */
export const MATTRESS_GALLERY: { photo: PhotoKey; alt: string }[] = [
  { photo: "mattress-colors", alt: "The mattress in Mocha Mousse, Safari, Morning Dove, Khaki and Natural" },
  { photo: "mattress-cutaway", alt: "The Ashwick Natural Mattress: the layers inside" },
];

/** Values pending confirmation, shown as written until replaced. */
export const MATTRESS_PENDING = {
  feelRatings: "[Confirm feel descriptions and firmness ratings with the manufacturer, e.g. Soft 4/10, Firm 7/10.]",
  tolerance: '[confirm tolerance, e.g. within ½"]',
  foundation: "[Recommended bases and maximum slat spacing — to confirm.]",
  weight: "[Weight per size — to confirm.]",
  delivery: "[Confirm delivery method: doorstep or white glove, and whether old-mattress removal is offered.]",
  flammabilityReport: "[link test report when received]",
  flammabilityReportShort: "[link report]",
  refundDays: "[X business days]",
  customSizesCovered: "[Confirm whether custom sizes are covered.]",
  returnedMattresses: "[donated / recycled — confirm]",
  indentationDepth: '[X"]',
  warrantyRemedy: "[confirm: repair, replace, and who covers shipping]",
  supportEmail: "[support email]",
  damageWindow: "[X days]",
  topperTerms: "[Confirm terms for toppers bought separately.]",
  orderingPage: "[Ordering & Delivery page]",
};

export const sizeById = (id: string) => MATTRESS.sizes.find((s) => s.id === id) ?? MATTRESS.sizes[0];
export const colorById = (id: string) => MATTRESS.colors.find((c) => c.id === id) ?? MATTRESS.colors[0];
