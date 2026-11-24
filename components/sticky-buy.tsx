"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/photo";
import type { PhotoKey } from "@/lib/photos";
import { fmt } from "@/lib/products";

/** Where "Change options" scrolls back to: the product page's options. */
export const BUY_OPTIONS_ID = "buy-options";

/** Phones and small tablets, where the gallery fills the first screen and the buy button sits far below it. */
const PHONE_QUERY = "(max-width: 960px)";

/**
 * Add-to-cart bar fixed to the bottom of the screen, so the price and the buy button are always one tap away on long
 * product pages. Mounted next to the page's own buy button.
 *
 * Desktop: slides up once that button has scrolled off the top of the screen.
 * Phones (Clarity, Nov 23): showing from the first screen, because about half of ad visitors leave before scrolling
 * and two thirds never reached the buy button. It steps aside while the page's own button is on screen.
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
    const phone = window.matchMedia(PHONE_QUERY);
    const check = () => {
      frame = 0;
      const el = watch.current;
      if (!el) return setShow(false);
      const r = el.getBoundingClientRect();
      // On phones: shown unless the page's own button is on screen. On desktop: only once it has scrolled past.
      setShow(phone.matches ? r.bottom < 0 || r.top > window.innerHeight : r.bottom < 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    phone.addEventListener("change", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      phone.removeEventListener("change", onScroll);
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
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div className={"sticky-buy" + (show ? " on" : "")} aria-hidden={!show} inert={!show}>
      <div className="sticky-buy-in wrap">
        <button type="button" className="sticky-buy-go" onClick={toOptions} aria-label={`Change options for ${name}`}>
          {photo && <span className="sticky-buy-img"><Photo src={photo} label="" sizes="64px" /></span>}
          <span className="sticky-buy-name">
            <span className="sticky-buy-title">{name}</span>
            <span className="sticky-buy-sum">{summary}</span>
          </span>
        </button>
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
