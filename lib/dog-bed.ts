/**
 * The organic dog bed collection, launching soon. Colors match the Ashbury's; each one appears on the page once it
 * has photos. Price, sizes and buying come at launch.
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
    { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha", photos: ["dog-bed-sorrel", "dog-bed-sorrel-front", "dog-bed-sorrel-detail"] },
    { id: "dove", label: "Flint", swatch: "mattress-swatch-dove", photos: ["dog-bed-flint"] },
  ] satisfies DogBedColor[],
  defaultColor: "mocha",
  /** Home page feature photo. */
  hero: "dog-bed-sorrel" as PhotoKey,
  /** The two shown in the teaser on the mattress page. */
  teaser: ["dog-bed-sorrel", "dog-bed-flint"] as PhotoKey[],
};
