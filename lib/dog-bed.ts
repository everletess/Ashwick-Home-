/**
 * The organic dog bed collection, launching soon. Colors match the Ashbury's. Price, sizes and buying come at launch.
 */
import type { PhotoKey } from "@/lib/photos";

export const DOG_BED_PATH = "/products/organic-dog-bed";

export type DogBedColor = { id: string; label: string; swatch: PhotoKey; photos: PhotoKey[] };

export const DOG_BED = {
  title: "The Organic Dog Bed",
  collection: "The Organic Dog Bed Collection",
  tagline: "Chemical free for the whole family.",
  /** Shows "Coming soon" and a sign-up button in place of buying, and keeps the page out of search until launch. */
  comingSoon: true,
  /** Ids and swatches are the Ashbury's (lib/mattress.ts), so a dog bed matches its mattress. */
  colors: [
    { id: "natural", label: "Fleece", swatch: "mattress-swatch-natural", photos: ["dog-bed-fleece"] },
    { id: "dove", label: "Flint", swatch: "mattress-swatch-dove", photos: ["dog-bed-flint"] },
    { id: "khaki", label: "Moss", swatch: "mattress-swatch-khaki", photos: ["dog-bed-moss"] },
    { id: "safari", label: "Flax", swatch: "mattress-swatch-safari", photos: ["dog-bed-flax"] },
    { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha", photos: ["dog-bed-sorrel", "dog-bed-sorrel-front", "dog-bed-sorrel-detail"] },
  ] satisfies DogBedColor[],
  defaultColor: "mocha",
  /** Editorial shots for the home page feature (they fade between each other) and the mattress page teaser. */
  editorial: [
    { photo: "dog-bed-sorrel-room", alt: "A chocolate doodle curled up on the Organic Dog Bed in Sorrel beside a bed" },
    { photo: "dog-bed-moss-room", alt: "A small terrier on the Organic Dog Bed in Moss in a sunlit living room" },
  ] as { photo: PhotoKey; alt: string }[],
};
