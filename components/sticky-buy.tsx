"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/photo";
import type { PhotoKey } from "@/lib/photos";
import { fmt } from "@/lib/products";

/** Where "Change options" scrolls back to: the product page's options. */
export const BUY_OPTIONS_ID = "buy-options";

/**
 * Add-to-cart bar that slides up from the bottom once the page's own Add to cart button has scrolled out of view
 * (above the screen), so it's always one tap away on long product pages. Mounted next to that button.
 */
export function StickyBuy({ watch, photo, name, summary, price, note, cta, onAdd }: {
  /** The page's own buy button; the bar shows while it's scrolled off the top of the screen. */
  watch: React.RefObject<HTMLElement | null>;
  photo?: PhotoKey;
  name: string;
  summary: string;
  price: number;
  note?: string;
  cta: string;
  onAdd: () => void;
}) {
  const [show, setShow] = useState(false);

  // Checked on scroll (not an IntersectionObserver, which misses a jump straight past the button).
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const el = watch.current;
      setShow(!!el && el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [watch]);

  // Lifts the chat button and the 15% tab above the bar while it's showing.
  useEffect(() => {
    document.documentElement.classList.toggle("has-sticky-buy", show);
    return () => document.documentElement.classList.remove("has-sticky-buy");
  }, [show]);

  const toOptions = () => document.getElementById(BUY_OPTIONS_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Rendered on <body> so no transformed or sticky ancestor can trap the fixed bar.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className={"sticky-buy" + (show ? " on" : "")} aria-hidden={!show} inert={!show}>
      <button type="button" className="sticky-buy-change" onClick={toOptions}>Change options</button>
      <div className="sticky-buy-in wrap">
        {photo && <div className="sticky-buy-img"><Photo src={photo} label="" sizes="64px" /></div>}
        <div className="sticky-buy-name">
          <p className="sticky-buy-title">{name}</p>
          <p className="sticky-buy-sum">{summary}</p>
        </div>
        <div className="sticky-buy-price">
          <p className="sticky-buy-amt">{fmt(price)}</p>
          {note && <p className="sticky-buy-note">{note}</p>}
        </div>
        <button type="button" className="btn sticky-buy-btn" onClick={onAdd}>{cta}</button>
      </div>
    </div>,
    document.body,
  );
}
