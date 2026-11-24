/**
 * Arrival estimates under Add to cart, worked out in the shopper's own time zone: today + the ship time + transit,
 * counting business days (Mon–Fri). Ship times are the site's stated ones; TRANSIT_DAYS is an assumption for Tessa to
 * confirm (Nov 9) and is the one number to change.
 */
export const TRANSIT_DAYS: [number, number] = [3, 5];

export type ShipKind = "days" | "dog-bed" | "pillow" | "furniture";

/** Business days to ship, by kind (mattress 3–4, dog beds 3–4 business days, pillows 1–2); furniture is in weeks. */
const SHIP: Record<Exclude<ShipKind, "furniture">, [number, number]> = { days: [3, 4], "dog-bed": [3, 4], pillow: [1, 2] };

/**
 * Days the workshop is closed (YYYY-MM-DD, local). They don't count as business days, and while one is coming up the
 * arrival line says so. Add the next one here; past dates do nothing.
 */
export const CLOSED_DAYS: { dates: string[]; note: string }[] = [
  { dates: ["2026-11-26", "2026-11-27"], note: "Our workshop is closed Nov 26–27 for Thanksgiving." },
];

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const isClosed = (d: Date) => CLOSED_DAYS.some((c) => c.dates.includes(ymd(d)));

/** The closure note to show now: only while the closure is still ahead or under way. */
export function closedNote(now: Date): string | null {
  const today = ymd(now);
  return CLOSED_DAYS.find((c) => c.dates.some((d) => d >= today))?.note ?? null;
}

export function addBusinessDays(from: Date, n: number): Date {
  const d = new Date(from);
  let left = n;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6 && !isClosed(d)) left--;
  }
  return d;
}

const md = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** e.g. "Ships in 3–4 days · Estimated delivery Nov 17–21", or for furniture "Ships in 3–4 weeks · Arrives by Dec 12". */
export function arrivalLine(kind: ShipKind, now: Date): string {
  if (kind === "furniture") {
    const by = addBusinessDays(new Date(now.getTime() + 28 * 86_400_000), TRANSIT_DAYS[1]);
    return `Ships in 3–4 weeks · Arrives by ${md(by)}`;
  }
  const [s0, s1] = SHIP[kind];
  const a = addBusinessDays(now, s0 + TRANSIT_DAYS[0]);
  const b = addBusinessDays(now, s1 + TRANSIT_DAYS[1]);
  const range = a.getMonth() === b.getMonth() ? `${md(a)}–${b.getDate()}` : `${md(a)}–${md(b)}`;
  const ships = kind === "pillow" ? "1–2 business days" : kind === "dog-bed" ? "3–4 business days" : "3–4 days";
  return `Ships in ${ships} · Estimated delivery ${range}`;
}
