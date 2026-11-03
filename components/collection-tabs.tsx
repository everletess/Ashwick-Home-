import Link from "next/link";
import { TABS } from "@/lib/catalog";

/** The Shop All filter tabs, for the collection pages that are their own routes (Pillows, Dog Beds). */
export function CollectionTabs({ current }: { current: string }) {
  return (
    <nav className="tabs wrap" aria-label="Collections">
      {TABS.map(([label, h]) => (
        <Link key={h} href={"/collections/" + h} className={current === h ? "on" : ""} aria-current={current === h ? "page" : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
