import { MATTRESS, mattressColorHref } from "@/lib/mattress";
import { PHOTOS, type PhotoKey } from "@/lib/photos";

/** Public site origin, used for absolute URLs in structured data and the Google Merchant feed. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwickhome.com").replace(/\/$/, "");

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE}${path}`);
export const photoUrl = (key: PhotoKey) => abs(PHOTOS[key].src);

export const MATTRESS_TITLE = "The Ashbury Organic Mattress";
export const MATTRESS_DESCRIPTION =
  "A natural, organic mattress handmade to order in the USA from Living Wool (GOTS-certified organic wool), Swedish horsehair and GOTS-certified organic cotton over double-tempered steel pocket coils and a base of coconut coir and agave, with a 3\" cashmere topper included. No foam, no latex, no glue, no chemical flame retardants. Hand-tufted with wool rosettes, in four colors. OEKO-TEX Standard 100. 100-night guarantee (30-night minimum), lifetime limited warranty, delivery included.";

/** One row per size and color, matching the Shopify variants. */
export function mattressItems() {
  return MATTRESS.sizes.flatMap((s) =>
    MATTRESS.colors.map((c) => {
      const photos = c.photos as PhotoKey[];
      return {
        id: `ashbury-${s.id}-${c.id}`,
        groupId: "ashbury",
        title: `${MATTRESS_TITLE} — ${s.label}, ${c.label}`,
        size: s.label,
        color: c.label,
        price: s.price,
        link: abs(mattressColorHref(c.id)),
        image: photoUrl(photos[0]),
        extraImages: [...photos.slice(1), c.swatch as PhotoKey].map(photoUrl),
      };
    }),
  );
}
