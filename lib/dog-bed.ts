/**
 * The organic dog bed collection, launching soon. Photos aren't in yet: each spot shows the hatched placeholder until
 * a photo key is set here.
 */
import type { PhotoKey } from "@/lib/photos";

export const DOG_BED_PATH = "/products/organic-dog-bed";

export const DOG_BED = {
  title: "The Organic Dog Bed",
  collection: "The Organic Dog Bed Collection",
  tagline: "Chemical free for the whole family.",
  /** Shows "Coming soon" and a sign-up button in place of buying, and keeps the page out of search until launch. */
  comingSoon: true,
  photos: {
    hero: undefined as PhotoKey | undefined,
    gallery: [undefined, undefined, undefined] as (PhotoKey | undefined)[],
    /** The two shown in the teaser on the mattress page. */
    teaser: [undefined, undefined] as (PhotoKey | undefined)[],
  },
};
