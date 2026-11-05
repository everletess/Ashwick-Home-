"use client";

// Black Friday mobile push (Tessa's brief, 05/11): the countdown, the Sleep Suite hero, the pillow strip, gifts under
// $300, the bundles band, the Suite's value breakdown, the Ashbury upsell and the sticky "Shop" bar. Every number is
// worked out from the catalog prices (lib/mattress, lib/pillow, lib/dog-bed, lib/sale), which must match Shopify; the
// /api/price-check route compares them. The sale's end is SALE.endsAt in lib/sale.ts, nowhere else.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuickAddSheet } from "@/components/catalog-card";
import { Photo } from "@/components/photo";
import { Price } from "@/components/sale";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS } from "@/lib/mattress";
import { PILLOW_PATH, PILLOW_STANDALONE_FILLS, PILLOW_STORY, pillowFromPrice } from "@/lib/pillow";
import { fmt } from "@/lib/products";
import type { PhotoKey } from "@/lib/photos";
import { trackCustom } from "@/lib/pixel";
import {
  BUNDLE, BUNDLE_CONFIG, BUNDLE_HERO, SALE, SLEEP_SUITE, bundlePrice, giftsShowing, pillowsAreNew, saleEndLabel, salePrice,
  sleepSuitePrice, suiteHref, suiteVsAshbury,
} from "@/lib/sale";

/* ---------- Time ---------- */

/** Ticks every 30 seconds once mounted (null before), so countdowns and the sale switch-off happen in the browser. */
export function useNow(every = 30_000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock starts after mount, so server and first paint agree
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(t);
  }, [every]);
  return now;
}

/** Time left in the sale: { d, h, m }, or null with no end date (or before mount, or once it's over). */
export function useSaleLeft() {
  const now = useNow();
  if (!now || !SALE.endsAt) return null;
  const ms = Date.parse(SALE.endsAt) - now;
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60_000);
  return { d: Math.floor(mins / 1440), h: Math.floor((mins % 1440) / 60), m: mins % 60 };
}

/** "3d 14h" (or "14h 22m" on the last day). */
export function CountdownShort() {
  const l = useSaleLeft();
  if (!l) return null;
  return <span className="cd-short">Ends in {l.d > 0 ? `${l.d}d ${l.h}h` : `${l.h}h ${l.m}m`}</span>;
}

/** "Ends in 3 days 14 hours", large. */
export function CountdownLarge() {
  const l = useSaleLeft();
  if (!l) return null;
  const p = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  return (
    <div className="cd-large" role="timer" aria-live="off">
      <span className="eyebrow">{SALE.name} ends in</span>
      <strong>{l.d > 0 ? `${p(l.d, "day")} ${p(l.h, "hour")}` : `${p(l.h, "hour")} ${p(l.m, "minute")}`}</strong>
    </div>
  );
}

/* ---------- Small pieces ---------- */

export function NewBadge({ className = "" }: { className?: string }) {
  return pillowsAreNew() ? <span className={"new-badge " + className}>New</span> : null;
}

/** Line icons for what a bundle includes. */
function IncIcon({ k }: { k: "mattress" | "pillows" | "protector" | "glove" | "dog" }) {
  const P: Record<string, React.ReactNode> = {
    mattress: <><rect x="2.5" y="9" width="19" height="7" rx="1.5" /><path d="M2.5 12.5h19M5 16v2M19 16v2" /></>,
    pillows: <><path d="M4 9.5c3-2 13-2 16 0-1 2.2-1 3.8 0 6-3 2-13 2-16 0 1-2.2 1-3.8 0-6z" /></>,
    protector: <><path d="M12 3.5l7 2.6v5.4c0 4.4-3 7.2-7 8.5-4-1.3-7-4.1-7-8.5V6.1z" /><path d="M9 12l2 2 4-4" /></>,
    glove: <><rect x="2" y="7" width="12" height="9" /><path d="M14 10h4l3 3v3h-7M6 19.5a1.5 1.5 0 1 0 0 .01M17 19.5a1.5 1.5 0 1 0 0 .01" /></>,
    dog: <><circle cx="7" cy="9" r="1.6" /><circle cx="11" cy="6.5" r="1.6" /><circle cx="15" cy="7" r="1.6" /><circle cx="18" cy="10.5" r="1.6" /><path d="M8.5 16.5c0-3 2-5 4.5-5s4.5 2.5 4 5c-.4 2-2.4 2.3-4 1.6-1.4-.6-2.4.4-3.4 0-.8-.3-1.1-.9-1.1-1.6z" /></>,
  };
  return <svg className="inc-ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[k]}</svg>;
}

/* ---------- 2a · The Sleep Suite hero ---------- */

const QUEEN = MATTRESS.sizes.find((s) => s.id === "queen") ?? MATTRESS.sizes[0];
/**
 * Hero image (Tessa, 05/11). It carries the title, "20% OFF" and labels in the picture, so it is shown whole (4:3,
 * never cropped) and, on a phone, the headline is read out but not repeated on screen.
 */
export const SUITE_HERO: { photo: PhotoKey; alt: string } = { photo: "sleep-suite-labeled", alt: "The Complete Sleep Suite, 20% off: the Ashbury mattress in Sorrel with two matching pillows and a folded Mattress Protector on a stool" };

export function SuiteHero({ as = "h1" }: { as?: "h1" | "h2" }) {
  const q = sleepSuitePrice(QUEEN.id);
  const from = sleepSuitePrice(0);
  const H = as;
  return (
    <section className="sh">
      <div className="sh-media"><Photo src={SUITE_HERO.photo} label={SUITE_HERO.alt} fill preload sizes="(max-width: 860px) 100vw, 55vw" /></div>
      <div className="sh-txt">
        <p className="sh-eyebrow">{SALE.name}{saleEndLabel() ? ` · ${saleEndLabel()}` : ` · ${SALE.percent}% off everything`}</p>
        <H className="sh-h">{SLEEP_SUITE.name}</H>
        <p className="sh-sub">The Ashbury, two pillows and a Mattress Protector, with free white glove delivery.</p>
        <p className="sh-price">
          <strong>{QUEEN.label} {fmt(q.sale)}</strong>
          {q.sale !== q.list && <s>{fmt(q.list)}</s>}
          <span>plus free white glove ({fmt(BUNDLE_CONFIG.whiteGloveValue)} value)</span>
        </p>
        <p className="sh-from">From {fmt(from.sale)} ({MATTRESS.sizes[0].label})</p>
        <div className="sh-btns">
          <Link href={SLEEP_SUITE.path} className="btn light">Shop the Sleep Suite</Link>
          <Link href={SALE.path} className="sh-link">Shop all {SALE.name} →</Link>
        </div>
        <p className="sh-trust">{MATTRESS.guaranteeNights}-night trial · Ships in 3–4 days · Pay over time with Shop Pay</p>
      </div>
    </section>
  );
}

/* ---------- Cards for pillows and dog beds (with Quick add) ---------- */

type Mini = { key: string; name: string; href: string; photo: PhotoKey; alt: string; from: number; quick: { kind: "pillow" | "dog-bed" | "nook"; fill?: string }; badge?: string; isNew?: boolean };

const FILL_ORDER = ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"];
const PILLOW_MINIS: Mini[] = [...PILLOW_STANDALONE_FILLS]
  .sort((a, b) => FILL_ORDER.indexOf(a.id) - FILL_ORDER.indexOf(b.id))
  .map((f) => ({
    key: f.id, name: f.label, href: f.path, photo: PILLOW_STORY[f.id].card, alt: PILLOW_STORY[f.id].cardAlt, from: pillowFromPrice(f.id),
    quick: { kind: "pillow", fill: f.id }, isNew: true,
  }));
const minSize = (sizes: { price: number }[]) => Math.min(...sizes.map((s) => s.price));
const DOG_MINIS: Mini[] = [
  { key: DOG_BED.id, name: DOG_BED.title, href: DOG_BED.path, photo: (DOG_BED.colors.find((c) => c.id === DOG_BED.defaultColor) ?? DOG_BED.colors[0]).photos[0], alt: DOG_BED.title, from: minSize(DOG_BED.sizes), quick: { kind: "dog-bed" } },
  { key: NOOK.id, name: NOOK.title, href: NOOK.path, photo: (NOOK.colors.find((c) => c.id === NOOK.defaultColor) ?? NOOK.colors[0]).photos[0], alt: NOOK.title, from: minSize(NOOK.sizes), quick: { kind: "nook" } },
];

function MiniCard({ it, badge }: { it: Mini; badge?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mc">
      <Link href={it.href} className="mc-img" aria-label={it.name}>
        <Photo src={it.photo} label={it.alt} fill sizes="(max-width: 640px) 62vw, 260px" />
        <span className="mc-badges">{it.isNew && <NewBadge />}{badge && <span className="mc-badge">{badge}</span>}</span>
      </Link>
      <Link href={it.href} className="mc-name">{it.name}</Link>
      <span className="mc-price"><Price price={it.from} from /></span>
      <button type="button" className="mc-add" onClick={() => setOpen(true)}>Quick add</button>
      {open && <QuickAddSheet kind={it.quick.kind} href={it.href} fill={it.quick.fill} onClose={() => setOpen(false)} />}
    </div>
  );
}

/* ---------- 2b · New: the Ashwick Pillow ---------- */

export function PillowStrip() {
  if (!pillowsAreNew()) return null;
  return (
    <section className="pstrip">
      <div className="wrap pstrip-head">
        <p className="pstrip-t"><NewBadge /> Just launched: the Ashwick Pillow. Three natural fills, from {fmt(salePrice(Math.min(...PILLOW_MINIS.map((p) => p.from))))}.</p>
        <Link href={PILLOW_PATH} className="ulink">Shop pillows →</Link>
      </div>
      <div className="mrail">{PILLOW_MINIS.map((it) => <MiniCard key={it.key} it={{ ...it, isNew: false }} />)}</div>
    </section>
  );
}

/* ---------- 2c / 3.6 · Gifts under $300 ---------- */

export function GiftsRow({ id, heading = "h2" }: { id?: string; heading?: "h2" | "h3" }) {
  if (!giftsShowing()) return null;
  const H = heading;
  const gifts = [...PILLOW_MINIS, ...DOG_MINIS].filter((g) => salePrice(g.from) < 300);
  return (
    <section className="gifts" id={id}>
      <div className="wrap gifts-head">
        <div>
          <H className="gifts-h">{SALE.active ? "Gifts under $300" : "Gifts"}</H>
          <p className="gifts-sub">Ships in 1–2 days, in time for the holidays.</p>
        </div>
        {id !== "gifts" && <Link href={`${SALE.active ? SALE.path : PILLOW_PATH}${SALE.active ? "#gifts" : ""}`} className="ulink">Shop all gifts →</Link>}
      </div>
      <div className="mrail">{gifts.map((it) => <MiniCard key={it.key} it={it} badge="Gift" />)}</div>
    </section>
  );
}

/* ---------- 2d · The bundles ---------- */

type Bundle = { key: string; title: string; href: string; photo: PhotoKey; alt: string; inc: [Parameters<typeof IncIcon>[0]["k"], string][]; list: number; sale: number; best?: boolean };

function bundles(): Bundle[] {
  const m0 = MATTRESS.sizes[0].price;
  const bed = BUNDLE_CONFIG.beddingSet.price;
  const dog0 = DOG_BED.sizes[0].price;
  const ss = sleepSuitePrice(0);
  const glove = BUNDLE_CONFIG.whiteGloveIncluded ? BUNDLE_CONFIG.whiteGloveValue : 0;
  return [
    {
      key: "suite", title: SLEEP_SUITE.name, href: SLEEP_SUITE.path, photo: "sleep-suite-flint", alt: "The Complete Sleep Suite: an Ashbury mattress in Flint with matching pillows and a folded bedding set",
      inc: [["mattress", "The Ashbury"], ["pillows", "2 pillows"], ["protector", "Mattress Protector"], ["glove", "Free white glove"]],
      list: ss.list + glove, sale: ss.sale, best: true,
    },
    {
      key: "bf", title: BUNDLE.title, href: BUNDLE.path, photo: BUNDLE_HERO.photo, alt: BUNDLE_HERO.alt,
      inc: [["mattress", "The Ashbury"], ["dog", "Ashbury Dog Bed"], ["pillows", "2 pillows"], ["protector", "Mattress Protector"], ["glove", "Free white glove"]],
      list: m0 + dog0 + bed + glove, sale: bundlePrice(m0) + bundlePrice(dog0) + bundlePrice(bed),
    },
  ];
}

export function BundlesBand() {
  if (!SALE.active) return null;
  return (
    <section className="bb">
      <div className="wrap">
        <p className="eyebrow">{SALE.name} bundles</p>
        <h2 className="bb-h">The best value of the year.</h2>
        <div className="bb-grid">
          {bundles().map((b) => (
            <Link key={b.key} href={b.href} className={"bb-card" + (b.best ? " best" : "")}>
              <span className="bb-img"><Photo src={b.photo} label={b.alt} fill sizes="(max-width: 860px) 100vw, 640px" />{b.best && <span className="bb-best">Best value</span>}</span>
              <span className="bb-t">{b.title}</span>
              <ul className="bb-inc">{b.inc.map(([k, t]) => <li key={t}><IncIcon k={k} />{t}</li>)}</ul>
              <span className="bb-price">From <strong>{fmt(b.sale)}</strong> <s>{fmt(b.list)}</s></span>
              <span className="bb-save">You save {fmt(Math.round((b.list - b.sale) * 100) / 100)}</span>
              <span className="btn full">{b.best ? "Shop the Sleep Suite" : "Shop the bundle"}</span>
            </Link>
          ))}
        </div>
        <p className="bb-fine">From prices are for a {MATTRESS.sizes[0].label}, and include the {fmt(BUNDLE_CONFIG.whiteGloveValue)} white glove delivery the bundles get free.</p>
      </div>
    </section>
  );
}

/* ---------- 3.4 / 3.5 · What's included, with a size picker ---------- */

export function BundleDetail({ which }: { which: "suite" | "bf" }) {
  const [sizeId, setSize] = useState<string>("queen");
  const m = MATTRESS.sizes.find((s) => s.id === sizeId) ?? MATTRESS.sizes[0];
  const bed = BUNDLE_CONFIG.beddingSet.price;
  const glove = BUNDLE_CONFIG.whiteGloveValue;
  const dog = DOG_BED.sizes[0];
  const rows: [string, number][] = which === "suite"
    ? [[`The Ashbury, ${m.label}`, m.price], ["Two pillows + Mattress Protector", bed]]
    : [[`The Ashbury, ${m.label}`, m.price], [`${DOG_BED.title}, ${dog.label}`, dog.price], ["Two pillows + Mattress Protector", bed]];
  const goods = rows.reduce((t, [, p]) => t + p, 0);
  const price = rows.reduce((t, [, p]) => t + bundlePrice(p), 0);
  const total = goods + glove;
  const title = which === "suite" ? SLEEP_SUITE.name : BUNDLE.title;
  const href = which === "suite" ? suiteHref({ sizeId }) : BUNDLE.path;
  return (
    <section className={"bd" + (which === "suite" ? " best" : "")} id={which === "suite" ? "suite" : "best-friends"} aria-labelledby={`bd-${which}`}>
      <div className="bd-img"><Photo src={which === "suite" ? "sleep-suite-flint" : BUNDLE_HERO.photo} label={which === "suite" ? "The Complete Sleep Suite: an Ashbury mattress in Flint with matching pillows and a folded bedding set" : BUNDLE_HERO.alt} fill sizes="(max-width: 860px) 100vw, 560px" />{which === "suite" && <span className="bb-best">Best value</span>}</div>
      <div className="bd-t">
        <h2 className="bd-h" id={`bd-${which}`}>{title}</h2>
        <p className="bd-l">Mattress size</p>
        <div className="bd-sizes" role="group" aria-label="Mattress size">
          {MATTRESS.sizes.map((z) => <button key={z.id} type="button" className={sizeId === z.id ? "on" : ""} aria-pressed={sizeId === z.id} onClick={() => setSize(z.id)}>{z.label}</button>)}
        </div>
        <table className="bd-table">
          <tbody>
            {rows.map(([n, p]) => <tr key={n}><th scope="row">{n}</th><td>{fmt(p)}</td></tr>)}
            <tr><th scope="row">White glove delivery</th><td><s>{fmt(glove)}</s> Free</td></tr>
            <tr className="bd-total"><th scope="row">Total value</th><td><s>{fmt(total)}</s></td></tr>
            <tr className="bd-now"><th scope="row">{SALE.active ? `${SALE.name} price` : "Your price"}</th><td>{fmt(price)}</td></tr>
          </tbody>
        </table>
        <p className="bd-save">You save {fmt(Math.round((total - price) * 100) / 100)}{which === "bf" ? ` (with a ${dog.label} dog bed; choose its size on the next page)` : ""}</p>
        <Link href={href} className="btn full">{which === "suite" ? "Shop the Sleep Suite" : "Shop the bundle"}</Link>
      </div>
    </section>
  );
}

/* ---------- 4 · On the Ashbury page: switch to the Suite ---------- */

export function SuiteUpsell({ sizeId, feelId, colorId }: { sizeId: string; feelId: string; colorId: string }) {
  const { diff } = suiteVsAshbury(sizeId);
  const href = suiteHref({ sizeId, feelId, colorId });
  const what = "two pillows, a Mattress Protector and free white glove delivery";
  const lead = !SALE.active || diff === 0
    ? <><strong>Complete your bed with the Sleep Suite:</strong> {what}.</>
    : diff < 0
      ? <><strong>Get the Sleep Suite instead and save {fmt(-diff)}:</strong> add {what}.</>
      : <><strong>Upgrade to the Sleep Suite for just {fmt(diff)} more:</strong> {what}.</>;
  return (
    <div className="su">
      <p className="su-t">{lead}</p>
      <Link href={href} className="btn btn-ghost full" onClick={() => trackCustom("SwitchToSleepSuite", { content_ids: [MATTRESS.id], size: sizeId, value: diff })}>Switch to the Sleep Suite</Link>
    </div>
  );
}

/* ---------- 6 · Sticky "Shop" bar on the homepage and Black Friday page ---------- */

/** Shows once `.sh` (the hero) has scrolled away and hides at the footer; hides the chat button while it shows. */
export function StickySuite() {
  const [on, setOn] = useState(false);
  const heroGone = useRef(false), atFooter = useRef(false);
  useEffect(() => {
    const hero = document.querySelector(".sh");
    const footer = document.querySelector("footer");
    const update = () => setOn(heroGone.current && !atFooter.current);
    const os: IntersectionObserver[] = [];
    if (hero) { const o = new IntersectionObserver(([e]) => { heroGone.current = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }); o.observe(hero); os.push(o); }
    if (footer) { const o = new IntersectionObserver(([e]) => { atFooter.current = e.isIntersecting; update(); }); o.observe(footer); os.push(o); }
    return () => os.forEach((o) => o.disconnect());
  }, []);
  useEffect(() => {
    document.body.classList.toggle("has-sticky-buy", on);
    return () => document.body.classList.remove("has-sticky-buy");
  }, [on]);
  if (!SALE.active) return null;
  return (
    <div className={"ss-bar" + (on ? " on" : "")} aria-hidden={!on}>
      <span className="ss-t"><strong>Sleep Suite</strong> · from {fmt(sleepSuitePrice(0).sale)}</span>
      <Link href={SLEEP_SUITE.path} className="btn light ss-btn" tabIndex={on ? 0 : -1}>Shop</Link>
    </div>
  );
}

/* ---------- 5 · "Complete the bed: add pillows" (Ashbury page) and extra pillows (cart) ---------- */

function PillowAddLine({ it, onAdded }: { it: Mini; onAdded?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="pa-line">
      <Link href={it.href} className="pa-img" aria-label={it.name}><Photo src={it.photo} label={it.alt} fill sizes="56px" /></Link>
      <span className="pa-t"><Link href={it.href}>{it.name}</Link><small><Price price={it.from} from /></small></span>
      <button type="button" className="pa-add" onClick={() => setOpen(true)}>Quick add</button>
      {open && <QuickAddSheet kind="pillow" href={it.href} fill={it.quick.fill} onClose={() => { setOpen(false); onAdded?.(); }} />}
    </li>
  );
}

export function PillowAddRow({ title = "Complete the bed: add pillows" }: { title?: string }) {
  return (
    <div className="pa">
      <p className="pa-h">{title} <NewBadge /></p>
      <ul className="pa-list">{PILLOW_MINIS.map((it) => <PillowAddLine key={it.key} it={it} />)}</ul>
    </div>
  );
}

/** Pillow fills, cheapest sale "from" price, for "from $103" lines. */
export const pillowsFrom = () => salePrice(Math.min(...PILLOW_MINIS.map((p) => p.from)));
