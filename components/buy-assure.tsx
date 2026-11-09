"use client";

// Directly under Add to cart on every product and bundle page (Tessa's audit, Nov 8): when it arrives, how to pay over
// time on a larger purchase, and a real person to call or text.
import { useEffect, useState } from "react";
import { Icon } from "@/components/buy-icons";
import { arrivalLine, type ShipKind } from "@/lib/delivery-estimate";
import { STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";

export function BuyAssure({ ship, price }: { ship: ShipKind; price?: number }) {
  // The date is worked out after mount, in the shopper's time zone (the server doesn't know it).
  const [line, setLine] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the shopper's clock and time zone, read once after mount
    setLine(arrivalLine(ship, new Date()));
  }, [ship]);
  return (
    <div className="buy-assure">
      <p className="ba-row"><Icon name="truck" size={18} /><span>{line ?? " "}</span></p>
      {price != null && price >= 1000 && (
        <p className="ba-row ba-pay"><span>Or pay over time with Shop Pay Installments, subject to approval.</span></p>
      )}
      <p className="ba-row ba-call">Questions? Call or text <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a></p>
    </div>
  );
}
