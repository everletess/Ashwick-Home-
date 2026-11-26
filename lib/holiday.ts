import type { PhotoKey } from "@/lib/photos";

/**
 * The holiday look (Tessa, Nov 25 2026: "to make it more festive"): the homepage hero becomes the decorated living room
 * and the homepage Bedroom shows the winter rooms, opening on Fleece. Runs until the start of Jan 4 2027 (Pacific), then
 * the site goes back to the year-round photos on its own. Set `enabled` to false to end it early.
 */
export const HOLIDAY = { enabled: true, endsAt: "2027-01-04T00:00:00-08:00" };
export const holidayActive = (now = Date.now()) => HOLIDAY.enabled && now < Date.parse(HOLIDAY.endsAt);

/** The homepage hero, holiday and year-round. */
export const homeHeroPhoto = (): { photo: PhotoKey; alt: string; holiday?: true } =>
  holidayActive()
    ? { photo: "holiday-living-room", holiday: true, alt: "The Marlowe Sofa and Marlowe Chair in cream on fluted oak plinths, a dog asleep on an Ashwick dog bed, beside a lit Christmas tree and a fireplace hung with stockings" }
    : { photo: "hero-family", alt: "A mother and daughter reading on the Cotswold sofa beside the Cotswold chair, a spaniel asleep beside them, in a sunlit living room" };

/** The winter bedroom by mattress color id (natural = Fleece, dove = Flint, safari = Flax, mocha = Sorrel). */
export const WINTER_ROOM_BY_COLOR: Record<string, PhotoKey> = { natural: "holiday-suite-fleece", dove: "holiday-suite-flint", safari: "holiday-suite-flax", mocha: "holiday-suite" };

/* ---------- Holiday gifting, Nov 26 – Dec 25 (Tessa, Nov 26: "more holiday focused and festive") ---------- */

/** The Holiday Gifts page. Live until the end of Christmas Day (Pacific), then it redirects to all products. */
export const GIFTS_PATH = "/gifts";
export const GIFTS_UNTIL = "2026-12-25T23:59:59-08:00";
export const giftsActive = (now = Date.now()) => HOLIDAY.enabled && now < Date.parse(GIFTS_UNTIL);

/** What a product ships as: "days" is the mattress (and its bundles), matching lib/delivery-estimate.ts. */
export type HolidayKind = "days" | "dog-bed" | "pillow" | "furniture";

/**
 * The last day to order for delivery before Christmas, by category (Tessa, Nov 5). End of day, Pacific. Each date
 * drops off the site on its own once it has passed.
 */
export const HOLIDAY_ORDER_BY: { what: string; kinds: HolidayKind[]; by: string }[] = [
  { what: "Furniture", kinds: ["furniture"], by: "2026-11-23T23:59:59-08:00" },
  { what: "Mattresses and dog beds", kinds: ["days", "dog-bed"], by: "2026-12-10T23:59:59-08:00" },
  { what: "Pillows", kinds: ["pillow"], by: "2026-12-19T23:59:59-08:00" },
];

/** "Dec 10" */
export const holidayDay = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Los_Angeles" });

/** The order-by dates still ahead. */
export const upcomingOrderBy = (now = Date.now()) => HOLIDAY_ORDER_BY.filter((l) => Date.parse(l.by) >= now);

/** Under Add to cart: "Order by Dec 10 for delivery before Christmas.", or, once that has passed, the new-year line. */
export function holidayNote(kind: HolidayKind, now = Date.now()): string | null {
  if (!giftsActive(now)) return null;
  const o = HOLIDAY_ORDER_BY.find((l) => l.kinds.includes(kind));
  if (!o) return null;
  if (now <= Date.parse(o.by)) return `Order by ${holidayDay(o.by)} for delivery before Christmas.`;
  return kind === "furniture" ? "Give it for Christmas, delivered in the new year." : "Arrives after Christmas: a gift for the new year.";
}

/** The cart's holiday line, for the kinds of things in it: the earliest date still ahead, and a note for furniture. */
export function cartHolidayNote(kinds: HolidayKind[], now = Date.now()): string | null {
  if (!giftsActive(now) || !kinds.length) return null;
  const parts: string[] = [];
  const ahead = HOLIDAY_ORDER_BY.filter((l) => l.kinds.some((k) => kinds.includes(k)) && Date.parse(l.by) >= now);
  if (ahead.length) parts.push(`Order by ${holidayDay(ahead[0].by)} for delivery before Christmas.`);
  if (kinds.includes("furniture")) parts.push("Furniture is delivered in the new year.");
  else if (!ahead.length) parts.push("Your order arrives after Christmas.");
  return parts.join(" ");
}

/** The top bar after Black Friday: the dates still ahead, then a thank-you once they have all passed. */
export function holidayBarLine(now = Date.now()): string | null {
  if (!giftsActive(now)) return null;
  const ahead = upcomingOrderBy(now).filter((l) => !l.kinds.includes("furniture"));
  if (!ahead.length) return "Happy holidays from the Ashwick workshop";
  const [first, ...rest] = ahead;
  return [`Order by ${holidayDay(first.by)} for Christmas delivery on ${first.what.toLowerCase()}`, ...rest.map((l) => `${holidayDay(l.by)} for ${l.what.toLowerCase()}`)].join(" · ");
}

/** Winter shots of the dog beds, by `${bed id}:${color id}`: the Ashbury Dog Bed in Flint by a frosty window, the Nook in Olive by the fire. */
export const HOLIDAY_DOG_BED_PHOTOS: Record<string, PhotoKey> = { "ashbury-dog-bed:mocha": "holiday-dog-bed-sorrel", "ashbury-dog-bed:natural": "holiday-dog-bed-fleece", "ashbury-dog-bed:dove": "holiday-best-friends", "nook-dog-bed:olive": "holiday-nook" };

/**
 * Holiday photos in the furniture galleries. `first` leads the gallery (and the collection card); otherwise the photo
 * goes second, after the photo of the selected fabric. Tessa's Higgsfield set, Nov 26.
 */
const HOLIDAY_GALLERY: Record<string, { photo: PhotoKey; first?: true }> = {
  marlowe: { photo: "holiday-living-room" },
  "marlowe-chair": { photo: "holiday-living-room" },
  cotswold: { photo: "holiday-cotswold", first: true },
  "cotswold-chair": { photo: "holiday-cotswold-chair", first: true },
  pembroke: { photo: "holiday-pembroke" },
};
export function withHolidayPhotos<T extends { id: string; photos: PhotoKey[] }>(p: T): T {
  const extra = holidayActive() ? HOLIDAY_GALLERY[p.id] : undefined;
  if (!extra || p.photos.includes(extra.photo)) return p;
  return { ...p, photos: extra.first ? [extra.photo, ...p.photos] : [p.photos[0], extra.photo, ...p.photos.slice(1)] };
}
/** The collection card photo over the holidays, for pieces whose holiday photo leads. */
/** Cards only (the gallery has its own per-color rule): the Ashbury Dog Bed card shows the Sorrel bed by the fire. */
const HOLIDAY_CARDS: Record<string, PhotoKey> = { "ashbury-dog-bed": "holiday-dog-bed-sorrel" };
export const holidayCardPhoto = (id: string): PhotoKey | undefined => {
  if (!holidayActive()) return undefined;
  const extra = HOLIDAY_GALLERY[id];
  return extra?.first ? extra.photo : HOLIDAY_CARDS[id];
};
