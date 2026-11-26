"use client";

import Link from "next/link";
import { useNow } from "@/components/bf-push";
import { GIFTS_PATH, holidayBarLine, holidayNote, type HolidayKind } from "@/lib/holiday";

/**
 * Under a collection's heading, through Christmas: the order-by date for that collection (or all the dates still ahead)
 * and a link to the Holiday Gifts page (Tessa, Nov 26). Shown after mount, once the date is known, so the server and
 * the first paint agree.
 */
export function HolidayLine({ kind }: { kind?: HolidayKind }) {
  const now = useNow();
  if (now == null) return null;
  const line = kind ? holidayNote(kind, now) : holidayBarLine(now);
  if (!line) return null;
  return (
    <p className="holiday-line">
      {line.replace(/\.$/, "")}. <Link href={GIFTS_PATH}>Shop holiday gifts</Link>
    </p>
  );
}
