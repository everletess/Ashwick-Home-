/**
 * The organic dog bed collection, launching soon. Colors match the Ashbury's. Price, sizes and buying come at launch.
 */
import type { PhotoKey } from "@/lib/photos";

export const DOG_BED_PATH = "/products/organic-dog-bed";
/** Cart / checkout product id, mapped to the Shopify product in app/api/checkout/route.ts. */
export const DOG_BED_ID = "ashbury-dog-bed";

/** sizePhotos: a shot of each size (keyed by size id) in this color, shown when that size is picked. */
export type DogBedColor = { id: string; label: string; swatch: PhotoKey; photos: PhotoKey[]; sizePhotos?: Record<string, PhotoKey> };

export const DOG_BED = {
  title: "The Ashbury Dog Bed",
  collection: "The Ashbury Dog Bed",
  tagline: "Chemical free for the whole family.",
  /** Shows "Coming soon" and a sign-up button in place of buying, and keeps the page out of search until launch. */
  comingSoon: false,
  /** Ids and swatches are the Ashbury's (lib/mattress.ts), so a dog bed matches its mattress. */
  /** Same price for every color. */
  sizes: [
    { id: "small", label: "Small", dims: '20" × 26"', price: 249 },
    { id: "medium", label: "Medium", dims: '34" × 26"', price: 299 },
    { id: "large", label: "Large", dims: '44" × 34"', price: 329 },
  ],
  /** Marketing copy for the buy page. Facts only: materials, certifications, sizes, colors, how it is made. */
  headline: "Organic doesn't have to be beige.",
  lede: "The Ashbury, made for the one who sleeps at the foot of it. Handmade to order in the USA from GOTS and OEKO-TEX certified materials, and finished in the same five colors as the mattress, so the whole bedroom matches, dog included.",
  materials: [
    { name: "Organic cotton", note: "GOTS and OEKO-TEX certified." },
    { name: "Living Wool", note: "GOTS and OEKO-TEX certified." },
    { name: "Cashmere", note: "OEKO-TEX certified." },
    { name: "Organic cotton twill cover", note: "100% organic cotton, the same twill as the Ashbury." },
  ],
  matchNote: "Fleece, Flint, Moss, Flax and Sorrel: the Ashbury's five colors, so it can sit beside the bed it matches.",
  leadTime: "Handmade to order in the USA. Ships within 3–4 days.",
  returns: "30-day return window. Returned beds are donated.",
  warranty: "1-year warranty.",
  colors: [
    { id: "natural", label: "Fleece", swatch: "mattress-swatch-natural", photos: ["dog-bed-fleece", "dog-bed-fleece-room", "dog-bed-fleece-room-2"] },
    { id: "dove", label: "Flint", swatch: "mattress-swatch-dove", photos: ["dog-bed-flint", "dog-bed-flint-room", "dog-bed-flint-room-2"] },
    { id: "khaki", label: "Moss", swatch: "mattress-swatch-khaki", photos: ["dog-bed-moss", "dog-bed-moss-room", "dog-bed-moss-room-2"] },
    { id: "safari", label: "Flax", swatch: "mattress-swatch-safari", photos: ["dog-bed-flax", "dog-bed-flax-room", "dog-bed-flax-room-2"] },
    { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha", photos: ["dog-bed-sorrel", "dog-bed-sorrel-room-golden", "dog-bed-sorrel-room-2", "dog-bed-sorrel-front", "dog-bed-sorrel-detail"],
      sizePhotos: { small: "dog-bed-sorrel-small", medium: "dog-bed-sorrel-medium", large: "dog-bed-sorrel-large" } },
  ] as DogBedColor[],
  defaultColor: "mocha",
  /** Editorial shots for the home page feature (they fade between each other) and the mattress page teaser. */
  editorial: [
    { photo: "dog-bed-sorrel-room", alt: "A chocolate doodle curled up on the Ashbury Dog Bed in Sorrel beside a bed" },
    { photo: "dog-bed-moss-room", alt: "A small terrier on the Ashbury Dog Bed in Moss in a sunlit living room" },
  ] as { photo: PhotoKey; alt: string }[],
};
