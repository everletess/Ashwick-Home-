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
