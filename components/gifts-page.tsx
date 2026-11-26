"use client";

// The Holiday Gifts page's own pieces (Tessa, Nov 26): the hero. The rest of the page reuses the Holiday Edit's
// sections (components/holiday-edit.tsx).
import Link from "next/link";
import { useNow } from "@/components/bf-push";
import { Photo } from "@/components/photo";
import { holidayDay, upcomingOrderBy } from "@/lib/holiday";
import { SALE, giftActive, giftLine } from "@/lib/sale";

export function GiftsHero() {
  const now = useNow();
  // The next order-by date still ahead (not furniture, whose date has passed), once the clock is known.
  const next = now == null ? null : upcomingOrderBy(now).find((l) => !l.kinds.includes("furniture"));
  return (
    <section className="hx-hero gx-hero">
      <Photo src="holiday-living-room" label="The Marlowe Sofa and Marlowe Chair beside a lit Christmas tree and a fireplace hung with stockings, a dog asleep on an Ashwick dog bed" className="hx-hero-img gx-hero-img" fill preload sizes="100vw" />
      <div className="hx-hero-scrim" />
      <div className="hx-hero-t">
        <p className="hx-eyebrow">Holiday gifts</p>
        <h1 className="hx-h1">Give the gift of home.</h1>
        <p className="hx-sub">
          Made by hand, from nature, to be handed down.
          {SALE.active && <><br />{SALE.name}: {SALE.percent}% off everything, through Dec 1.{giftActive() && " " + giftLine()}</>}
        </p>
        <div className="hx-btns">
          <a href="#gifts" className="btn light">Gifts under $300</a>
          <a href="#sleep-suite" className="btn light">The big gift</a>
        </div>
        {next && <p className="hx-clock">Order by {holidayDay(next.by)} for delivery before Christmas</p>}
      </div>
    </section>
  );
}

/** A closing line: where to ask, and everything else. */
export function GiftsHelp() {
  return (
    <section className="wrap gx-help">
      <p>Not sure what to give? Call or text us and we&rsquo;ll help you choose. Every piece is handmade to order in the USA.</p>
      <Link href="/collections/all" className="ulink">Shop everything →</Link>
    </section>
  );
}
