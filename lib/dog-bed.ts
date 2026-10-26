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
  id: DOG_BED_ID,
  path: DOG_BED_PATH,
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
  /** Colors are the Ashbury's, so the page shows the matching mattress. */
  matchesMattress: true,
  soonLede: "A bed for the newest member of the family, made to match the Ashbury.",
  /** Measurements by size (one value per size, in size order), shown as a table on the page. */
  specs: [] as { label: string; values: string[] }[],
  /** Questions and answers shown as drop-downs under the gallery. Facts only. */
  faqs: [] as { q: string; a: string }[],
  /** Editorial shots for the home page feature (they fade between each other) and the mattress page teaser. */
  editorial: [
    { photo: "dog-bed-sorrel-room", alt: "A chocolate doodle curled up on the Ashbury Dog Bed in Sorrel beside a bed" },
    { photo: "dog-bed-moss-room", alt: "A small terrier on the Ashbury Dog Bed in Moss in a sunlit living room" },
  ] as { photo: PhotoKey; alt: string }[],
};

/** Everything a dog bed page needs (the Ashbury's shape). */
export type DogBed = typeof DOG_BED;

export const NOOK_PATH = "/products/nook-dog-bed";

/**
 * The Nook (first called the Wren): a curved, bolstered bed in a textured weave. Live: set up in Shopify (handle nook-dog-bed, Size x Color variants) and mapped in app/api/checkout/route.ts.
 */
export const NOOK: DogBed = {
  id: "nook-dog-bed",
  path: NOOK_PATH,
  title: "The Nook Dog Bed",
  collection: "The Nook Dog Bed",
  tagline: "A curved bolster to curl up in.",
  comingSoon: false,
  sizes: [
    { id: "medium", label: "Medium", dims: '36" × 28"', price: 369 },
    { id: "large", label: "Large", dims: '46" × 36"', price: 449 },
  ],
  headline: "Their plans for the winter.",
  lede: "A deep, curved bolster bed in a soft textured weave, for the dog who likes to curl up. Handmade to order in the USA, with a cover you can machine wash.",
  materials: [
    { name: "Organic cotton", note: "" },
    { name: "Living Wool", note: "" },
    { name: "Cashmere", note: "" },
    { name: "Cover", note: "OEKO-TEX certified, 51% Belgian linen and 49% wool." },
    { name: "Removable cushion cover", note: "The inner cushion's cover comes off. Machine wash cold and hang dry." },
  ],
  matchNote: "A fire, a window, a bed built for curling up. The Nook has a high rear bolster and a low front entrance, so a dog can step in, turn around and settle against the curve. It comes in Olive, Oat and Toffee, and each size is one price in all three colors.",
  leadTime: DOG_BED.leadTime,
  returns: DOG_BED.returns,
  warranty: DOG_BED.warranty,
  colors: [
    { id: "olive", label: "Olive", swatch: "nook-swatch-olive", photos: ["nook-olive", "nook-olive-room", "nook-olive-sizes"] },
    { id: "oat", label: "Oat", swatch: "nook-swatch-oat", photos: ["nook-oat"] },
    { id: "toffee", label: "Toffee", swatch: "nook-swatch-toffee", photos: ["nook-toffee"] },
  ],
  defaultColor: "olive",
  matchesMattress: false,
  soonLede: "A deep, curved bolster bed in a soft textured weave, for the dog who likes to curl up. Handmade to order in the USA, with a cover you can machine wash.",
  specs: [
    { label: "Overall width × depth", values: ['36" × 28"', '46" × 36"'] },
    { label: "Sleeping area, approx.", values: ['26" × 19"', '36" × 26"'] },
    { label: "Rear bolster height", values: ['9"', '11"'] },
    { label: "Front entrance height", values: ['4"', '5"'] },
  ],
  faqs: [
    {
      q: "Which size should I choose?",
      a: "Go by the sleeping area inside the bolster: about 26\" × 19\" in the Medium and 36\" × 26\" in the Large. Measure your dog lying curled up, nose to tail, and choose the size it fits comfortably. If they're in between, size up.",
    },
    {
      q: "Can I wash it?",
      a: "Yes. The inner cushion's cover is removable: take it off, machine wash cold and hang dry.",
    },
    {
      q: "What's it made of?",
      a: "Organic cotton, Living Wool and cashmere, under a cover of 51% Belgian linen and 49% wool that is OEKO-TEX certified.",
    },
    {
      q: "How is it different from the Ashbury Dog Bed?",
      a: "The Nook is a curved bed with a raised bolster to rest a head on and curl into, and a low front to step in. The Ashbury Dog Bed is a flat, tufted bed made to match the Ashbury mattress, in the mattress's five colors.",
    },
    {
      q: "Where is it made?",
      a: "Made to order by hand in the USA.",
    },
    {
      q: "How fast does it ship?",
      a: "Each Nook is handmade to order in the USA and ships within 3–4 days.",
    },
    {
      q: "Can I return it?",
      a: "Yes, within 30 days. Returned beds are donated. It also comes with a 1-year warranty.",
    },
  ],
  editorial: [{ photo: "nook-olive-room", alt: "A chocolate doodle curled up in the Nook Dog Bed in Olive by the fire" }],
};
