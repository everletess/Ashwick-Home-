"use client";

// Black Friday on the homepage and /black-friday, simplified to one message per screen (Tessa's brief, 05/11):
// a full-bleed hero, a one-line offer band (the ONLY countdown, in the final 72 hours), a slim NEW pillow band,
// name-and-price cards, the Ashbury upsell and the sticky "Shop" bar. Prices come from the catalog (lib/*), which
// /api/price-check compares with Shopify; cards and banners show whole dollars. The sale's end is SALE.endsAt.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuickAddSheet } from "@/components/catalog-card";
import { Photo } from "@/components/photo";
import { Price, fmtWhole } from "@/components/sale";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS } from "@/lib/mattress";
import { PILLOW_PATH, PILLOW_STANDALONE_FILLS, PILLOW_STORY, pillowFromPrice } from "@/lib/pillow";
import { fmt } from "@/lib/products";
import type { PhotoKey } from "@/lib/photos";
import { trackCustom } from "@/lib/pixel";
import { SALE, SLEEP_SUITE, countdownFrom, giftsShowing, pillowsAreNew, saleEndShort, salePrice, sleepSuitePrice, suiteHref, suiteVsAshbury } from "@/lib/sale";

/* ---------- Time ---------- */

/** Ticks every 30 seconds once mounted (null before), so the countdown moves and the sale switches off in the browser. */
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

/* ---------- Small pieces ---------- */

export function NewBadge({ className = "" }: { className?: string }) {
  return pillowsAreNew() ? <span className={"new-badge " + className}>New</span> : null;
}

/** Line icons for what a bundle includes. */
export function IncIcon({ k }: { k: "mattress" | "pillows" | "protector" | "glove" | "dog" }) {
  const P: Record<string, React.ReactNode> = {
    mattress: <><rect x="2.5" y="9" width="19" height="7" rx="1.5" /><path d="M2.5 12.5h19M5 16v2M19 16v2" /></>,
    pillows: <><path d="M4 9.5c3-2 13-2 16 0-1 2.2-1 3.8 0 6-3 2-13 2-16 0 1-2.2 1-3.8 0-6z" /></>,
    protector: <><path d="M12 3.5l7 2.6v5.4c0 4.4-3 7.2-7 8.5-4-1.3-7-4.1-7-8.5V6.1z" /><path d="M9 12l2 2 4-4" /></>,
    glove: <><rect x="2" y="7" width="12" height="9" /><path d="M14 10h4l3 3v3h-7M6 19.5a1.5 1.5 0 1 0 0 .01M17 19.5a1.5 1.5 0 1 0 0 .01" /></>,
    dog: <><circle cx="7" cy="9" r="1.6" /><circle cx="11" cy="6.5" r="1.6" /><circle cx="15" cy="7" r="1.6" /><circle cx="18" cy="10.5" r="1.6" /><path d="M8.5 16.5c0-3 2-5 4.5-5s4.5 2.5 4 5c-.4 2-2.4 2.3-4 1.6-1.4-.6-2.4.4-3.4 0-.8-.3-1.1-.9-1.1-1.6z" /></>,
  };
  return <svg className="inc-ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[k]}</svg>;
}

/* ---------- 1b · Hero: full-bleed photo, words over it ---------- */

/** A clean photo (no words in the image): the Ashbury in Sorrel on the light oak base, with two pillows and a throw. */
export const SUITE_HERO: { photo: PhotoKey; alt: string } = { photo: "mattress-mocha-bedroom", alt: "The Ashbury in Sorrel on a light oak bed, made up with two pillows and a cream throw, in a sunlit bedroom" };

/**
 * The sale hero, laid out like a brand campaign (Tessa, 05/11: "we are an organic furniture brand"): the home leads, the
 * event sits above the headline. Homepage: the family on the Cotswold sofa. /black-friday: the same, with the offer.
 */
export function SaleHero({ page = "home" }: { page?: "home" | "sale" }) {
  const home = page === "home";
  return (
    <section className="sh">
      <Photo src="hero-family" label="A mother and daughter reading on the Cotswold sofa beside the Cotswold chair, a spaniel asleep beside them, in a sunlit living room" className="sh-img" fill preload sizes="100vw" />
      <div className="sh-scrim" />
      <div className="sh-txt">
        <p className="sh-eyebrow">{SALE.name}</p>
        <h1 className="sh-h">{home ? "Built by nature" : `${SALE.percent}% off everything`}</h1>
        <p className="sh-sub">{home ? "Organic furniture, handmade to be handed down." : "Organic furniture, handmade to be handed down. No code needed."}</p>
        <div className="sh-btns">
          {home
            ? <><Link href={SALE.path} className="btn light">Shop {SALE.name}</Link><Link href="/collections/all" className="btn light">Shop the collection</Link></>
            : <><a href="#sofas" className="btn light">Shop furniture</a><a href="#sleep-suite" className="btn light">Shop the Sleep Suite</a></>}
        </div>
      </div>
    </section>
  );
}

/* ---------- 1c · Offer band: the one place with a countdown ---------- */

export function OfferBand() {
  const now = useNow();
  if (!SALE.active) return null;
  const end = SALE.endsAt ? Date.parse(SALE.endsAt) : null;
  const live = now != null && end != null && now >= countdownFrom() && now < end;
  let clock = "";
  if (live) {
    const mins = Math.floor((end - now) / 60_000);
    const p = (n: number) => String(n).padStart(2, "0");
    clock = `${p(Math.floor(mins / 1440))}D : ${p(Math.floor((mins % 1440) / 60))}H : ${p(mins % 60)}M`;
  }
  return (
    <div className="ob">
      <p className="ob-lead">{SALE.name}</p>
      <p className="ob-t">{SALE.percent}% off everything</p>
      <p className="ob-s">{live ? <span className="ob-clock" role="timer">{clock}</span> : saleEndShort()}{(live || saleEndShort()) && " · "}No code needed</p>
    </div>
  );
}

/* ---------- 1d · NEW: the Ashwick Pillow (one slim band) ---------- */

export function PillowSlim() {
  if (!pillowsAreNew()) return null;
  return (
    <Link href={PILLOW_PATH} className="ps">
      <span className="ps-img"><Photo src="pillow-sorrel" label="" fill sizes="48px" /></span>
      <span className="ps-t"><NewBadge /> The Ashwick Pillow</span>
      <span className="ps-go">Shop pillows →</span>
    </Link>
  );
}

/* ---------- Cards: image, name, price. A small + on the image opens Quick add. ---------- */

export type Mini = { key: string; name: string; href: string; photo: PhotoKey; alt: string; from: number; quick?: { kind: "pillow" | "dog-bed" | "nook" | "mattress"; fill?: string }; isNew?: boolean; badge?: string; now?: number };

const FILL_ORDER = ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"];
const PILLOW_MINIS: Mini[] = [...PILLOW_STANDALONE_FILLS]
  .sort((a, b) => FILL_ORDER.indexOf(a.id) - FILL_ORDER.indexOf(b.id))
  .map((f) => ({ key: f.id, name: f.label, href: f.path, photo: PILLOW_STORY[f.id].card, alt: PILLOW_STORY[f.id].cardAlt, from: pillowFromPrice(f.id), quick: { kind: "pillow", fill: f.id }, isNew: true }));
const minSize = (sizes: { price: number }[]) => Math.min(...sizes.map((s) => s.price));
const DOG_MINIS: Mini[] = [
  { key: DOG_BED.id, name: DOG_BED.title, href: DOG_BED.path, photo: "dog-bed-sorrel-card", alt: "The Ashbury Dog Bed in Sorrel", from: minSize(DOG_BED.sizes), quick: { kind: "dog-bed" } },
  { key: NOOK.id, name: NOOK.title, href: NOOK.path, photo: "nook-olive-card", alt: "The Nook Dog Bed in Olive", from: minSize(NOOK.sizes), quick: { kind: "nook" } },
];

export function MiniCard({ it }: { it: Mini }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mc">
      <div className="mc-img">
        <Link href={it.href} aria-label={it.name}><Photo src={it.photo} label={it.alt} fill sizes="(max-width: 640px) 46vw, 280px" /></Link>
        {it.isNew ? <span className="mc-badge"><NewBadge /></span> : it.badge && <span className="mc-badge"><span className="new-badge">{it.badge}</span></span>}
        {it.quick && <button type="button" className="mc-add" aria-label={`Quick add: ${it.name}`} onClick={() => setOpen(true)}>+</button>}
      </div>
      <Link href={it.href} className="mc-name">{it.name}</Link>
      <span className="mc-price">{it.now != null && SALE.active ? <><span className="price-now">{fmtWhole(it.now)}</span> <s className="price-was">{fmtWhole(it.from)}</s></> : <Price price={it.from} whole />}</span>
      {open && it.quick && <QuickAddSheet kind={it.quick.kind} href={it.href} fill={it.quick.fill} onClose={() => setOpen(false)} />}
    </div>
  );
}

/** A titled row of cards (Black Friday page). `pillows` fills it with the three pillow fills. */
export function MiniGroup({ id, title, items = [], pillows }: { id: string; title: React.ReactNode; items?: Mini[]; pillows?: boolean }) {
  return (
    <section className="bf2-group" id={id}>
      <h2 className="wrap bf2-gh">{title}</h2>
      <div className="mrail">{(pillows ? PILLOW_MINIS : items).map((it) => <MiniCard key={it.key} it={it} />)}</div>
    </section>
  );
}

/* ---------- Gifts under $300 ---------- */

export function GiftsRow({ id }: { id?: string }) {
  if (!giftsShowing()) return null;
  const gifts = [...PILLOW_MINIS, ...DOG_MINIS].filter((g) => salePrice(g.from) < 300);
  return (
    <section className="gifts" id={id}>
      <div className="wrap gifts-head">
        <h2 className="gifts-h">{SALE.active ? "Gifts under $300" : "Gifts"}</h2>
        <p className="gifts-sub">Ships in 1–2 days.</p>
      </div>
      <div className="mrail">{gifts.map((it) => <MiniCard key={it.key} it={it} />)}</div>
    </section>
  );
}

/* ---------- On the Ashbury page: switch to the Suite ---------- */

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

/* ---------- Sticky "Shop" bar on the homepage and Black Friday page ---------- */

/** Shows once `.sh` (the hero) has scrolled away and hides at the footer; hides the chat button while it shows. */
export function StickySuite({ page = "home" }: { page?: "home" | "sale" | "deals" }) {
  const [on, setOn] = useState(false);
  const heroGone = useRef(false), atFooter = useRef(false);
  useEffect(() => {
    const hero = document.querySelector(".sh, .hx-hero");
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
      {page === "deals"
        ? <span className="ss-t"><strong>{saleEndShort()}</strong></span>
        : page === "home"
          ? <span className="ss-t"><strong>{SALE.name}</strong> · {SALE.percent}% off everything</span>
          : <span className="ss-t"><strong>Sleep Suite</strong> · from {fmtWhole(sleepSuitePrice(0).sale)}</span>}
      {page === "deals"
        ? <a href="#deals" className="btn light ss-btn" tabIndex={on ? 0 : -1}>Shop the deals</a>
        : <Link href={page === "home" ? SALE.path : SLEEP_SUITE.path} className="btn light ss-btn" tabIndex={on ? 0 : -1}>Shop</Link>}
    </div>
  );
}

/* ---------- "Complete the bed: add pillows" (Ashbury page) ---------- */

function PillowAddLine({ it }: { it: Mini }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="pa-line">
      <Link href={it.href} className="pa-img" aria-label={it.name}><Photo src={it.photo} label={it.alt} fill sizes="56px" /></Link>
      <span className="pa-t"><Link href={it.href}>{it.name}</Link><small><Price price={it.from} from whole /></small></span>
      <button type="button" className="pa-add" onClick={() => setOpen(true)}>Quick add</button>
      {open && <QuickAddSheet kind="pillow" href={it.href} fill={it.quick?.fill} onClose={() => setOpen(false)} />}
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

/** Pillow fills, cheapest sale "from" price, whole dollars, for "from $103" lines. */
export const pillowsFrom = () => Math.floor(salePrice(Math.min(...PILLOW_MINIS.map((p) => p.from))));
