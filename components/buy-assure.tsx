"use client";

// Directly under Add to cart on every product and bundle page (Tessa's audit, Nov 8): when it arrives, how to pay over
// time on a larger purchase, and a real person to call or text.
import { useEffect, useState } from "react";
import { Icon } from "@/components/buy-icons";
import { arrivalLine, closedNote, type ShipKind } from "@/lib/delivery-estimate";
import { STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";
import { GIFTS_PATH, holidayNote } from "@/lib/holiday";
import Link from "next/link";

export function BuyAssure({ ship, price }: { ship: ShipKind; price?: number }) {
  // The date is worked out after mount, in the shopper's time zone (the server doesn't know it).
  const [line, setLine] = useState<string | null>(null);
  const [closed, setClosed] = useState<string | null>(null);
  // Through Christmas: the order-by date for this kind of piece, or the new-year line once it has passed.
  const [holiday, setHoliday] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the shopper's clock and time zone, read once after mount
    setLine(arrivalLine(ship, now));
    setClosed(ship === "furniture" ? null : closedNote(now));
    setHoliday(holidayNote(ship, now.getTime()));
  }, [ship]);
  return (
    <div className="buy-assure">
      <p className="ba-row"><Icon name="truck" size={18} /><span>{line ?? " "}</span></p>
      {holiday && <p className="ba-row ba-holiday"><StarIcon /><span>{holiday} <Link href={GIFTS_PATH}>Holiday gifts</Link></span></p>}
      {closed && <p className="ba-row ba-closed"><span>{closed}</span></p>}
      {price != null && price >= 1000 && (
        <p className="ba-row ba-pay"><span>Or pay over time with Shop Pay Installments, subject to approval.</span></p>
      )}
      <p className="ba-row ba-call">Questions? Call or text <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a></p>
    </div>
  );
}

/** A small four-point star, for the holiday line. */
function StarIcon() {
  return (
    <svg className="icon" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" />
    </svg>
  );
}
