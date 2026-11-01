"use client";
import { useEffect, useState } from "react";

/** Mobile-only bottom CTA: shows once the hero has scrolled away, hides near the footer. */
export function BfStickyCta({ href, label }: { href: string; label: string }) {
  const [heroGone, setHeroGone] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".bf-hero");
    const footer = document.querySelector("footer");
    const ios: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
      o.observe(hero); ios.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { threshold: 0 });
      o.observe(footer); ios.push(o);
    }
    return () => ios.forEach((o) => o.disconnect());
  }, []);
  const on = heroGone && !atFooter;
  useEffect(() => {
    document.body.classList.toggle("bf-sticky-on", on);
    return () => document.body.classList.remove("bf-sticky-on");
  }, [on]);
  return (
    <div className={"bf-sticky" + (on ? " on" : "")} aria-hidden={!on}>
      <a href={href} className="bf-sticky-btn" tabIndex={on ? 0 : -1}>{label}</a>
    </div>
  );
}
