"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Sort = "featured" | "low" | "high";
const TABS: [string, string][] = [["All", "/collections/all"], ["Bedroom", "/collections/bedroom"], ["Pillows", "/collections/pillows"], ["Dog Beds", "/collections/dog-beds"], ["Sofas", "/collections/sofas"], ["Chairs", "/collections/chairs"], ["Bundles", "/collections/bundles"]];

/**
 * A sticky "Filter · Sort" pill that opens a bottom sheet: category, sort by price, and "Ships fast" (made to order and shipped
 * within days, which is the mattress, so furniture that ships in weeks is hidden). Works on the cards already on the page.
 */
export function FilterSort({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const [fast, setFast] = useState(false);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLElement>("[data-grid]").forEach((grid) => {
      const cards = [...grid.querySelectorAll<HTMLElement>(".cc")];
      const order = [...cards].sort((x, y) => sort === "low" ? +x.dataset.price! - +y.dataset.price! : sort === "high" ? +y.dataset.price! - +x.dataset.price! : 0);
      cards.forEach((c) => {
        c.style.order = sort === "featured" ? "" : String(order.indexOf(c));
        c.style.display = fast && !c.dataset.fast ? "none" : "";
      });
    });
  }, [sort, fast]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement, prev = root.style.overflow;
    root.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    return () => { root.style.overflow = prev; window.removeEventListener("keydown", key); };
  }, [open]);

  const active = (sort !== "featured" ? 1 : 0) + (fast ? 1 : 0);
  return (
    <>
      <div className="fs-bar">
        <button type="button" className="fs-pill" onClick={() => setOpen(true)} aria-haspopup="dialog">Filter · Sort{active ? ` (${active})` : ""}</button>
      </div>
      {open && mounted && createPortal(
        <div className="fs-scrim" onClick={() => setOpen(false)}>
          <div className="fs-sheet" role="dialog" aria-modal="true" aria-label="Filter and sort" onClick={(e) => e.stopPropagation()}>
            <div className="fs-head"><strong>Filter · Sort</strong><button type="button" className="x" aria-label="Close" onClick={() => setOpen(false)}>×</button></div>
            <p className="fs-l">Category</p>
            <div className="fs-opts">{TABS.map(([t, h]) => <Link key={h} href={h} className={h.endsWith("/" + current) ? "on" : ""} onClick={() => setOpen(false)}>{t}</Link>)}</div>
            <p className="fs-l">Sort by price</p>
            <div className="fs-opts">
              {([["featured", "Featured"], ["low", "Low to high"], ["high", "High to low"]] as [Sort, string][]).map(([v, t]) => <button key={v} type="button" aria-pressed={sort === v} className={sort === v ? "on" : ""} onClick={() => setSort(v)}>{t}</button>)}
            </div>
            <p className="fs-l">Ships fast</p>
            <div className="fs-opts"><button type="button" aria-pressed={fast} className={fast ? "on" : ""} onClick={() => setFast((v) => !v)}>Ships within days</button></div>
            <button type="button" className="btn full fs-done" onClick={() => setOpen(false)}>Show results</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
