"use client";

// /black-friday as the Holiday Edit (Tessa's brief, 05/11): a seasonal hero, a sticky evergreen deals bar, three
// numbered deals (the Complete Sleep Suite, the Best Friends Bundle, 20% off furniture), gifts under $300 and
// holiday delivery. List prices arrive from the server (lib/live-prices.ts: Shopify, with the site's own price as the
// fallback); sale prices and savings are worked out from them with the sitewide percent, as checkout does.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { QuickAddSheet } from "@/components/catalog-card";
import { IncIcon, useNow } from "@/components/bf-push";
import { Photo } from "@/components/photo";
import { fmtWhole } from "@/components/sale";
import { SwipeGallery, type GalleryShot } from "@/components/swipe-gallery";
import type { LivePrices } from "@/lib/live-prices";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import type { PhotoKey } from "@/lib/photos";
import { PILLOW_STANDALONE_FILLS, PILLOW_STORY } from "@/lib/pillow";
import { getProduct } from "@/lib/products";
import { BUNDLE, BUNDLE_PILLOWS, SALE, SLEEP_SUITE, countdownFrom, saleEndShort, salePrice, sleepSuiteLines } from "@/lib/sale";

/** The page's photographs. Stand-ins until the seasonal photography (image prompts A–D) is in: change these keys only. */
export const HOLIDAY_PHOTOS: Record<"hero" | "suite" | "bestFriends" | "gifts", { photo: PhotoKey; alt: string }> = {
  hero: { photo: "holiday-hero", alt: "A living room in winter light: a cream sofa, a lit stone fireplace and an olive garland on the mantel" },
  suite: { photo: "holiday-suite", alt: "The Ashbury in Sorrel on a light oak bed, made up with two pillows and a wool throw" },
  bestFriends: { photo: "holiday-best-friends", alt: "The Ashbury Dog Bed in Sorrel with a dog curled up asleep on it, beside the bed" },
  gifts: { photo: "holiday-gifts", alt: "A stack of Ashwick pillows in cream, oat, sorrel and grey" },
};

/** Holiday delivery: the last order date for delivery before Christmas. Tessa to confirm; while null the band shows no date. */
export const HOLIDAY_ORDER_BY: string | null = null;

const money = (n: number) => fmtWhole(n);
function PriceLine({ list, sale, big }: { list: number; sale: number; big?: boolean }) {
  return (
    <p className={"hx-price" + (big ? " big" : "")}>
      <span className="hx-now">{money(sale)}</span>
      {SALE.active && sale < list && <s className="hx-was">{money(list)}</s>}
    </p>
  );
}

/* ---------- Countdown: "Ends Dec 1" until the final 72 hours, then live ---------- */

function SaleClock() {
  const now = useNow();
  const end = SALE.endsAt ? Date.parse(SALE.endsAt) : null;
  if (now != null && end != null && now >= countdownFrom() && now < end) {
    const mins = Math.floor((end - now) / 60_000);
    const p = (n: number) => String(n).padStart(2, "0");
    return <p className="hx-clock" role="timer">Ends in {p(Math.floor(mins / 1440))}D : {p(Math.floor((mins % 1440) / 60))}H : {p(mins % 60)}M</p>;
  }
  return <p className="hx-clock">{saleEndShort()}.</p>;
}

/* ---------- 2 · Hero ---------- */

export function HolidayHero() {
  const end = SALE.endsAt ? new Date(SALE.endsAt).toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/Los_Angeles" }) : "";
  return (
    <section className="hx-hero">
      <Photo src={HOLIDAY_PHOTOS.hero.photo} label={HOLIDAY_PHOTOS.hero.alt} className="hx-hero-img" fill preload sizes="100vw" />
      <div className="hx-hero-scrim" />
      <div className="hx-hero-t">
        <p className="hx-eyebrow">The Holiday Edit</p>
        <h1 className="hx-h1">Give the gift of home.</h1>
        <p className="hx-sub">{SALE.percent}% off everything, through {end}. No code needed.</p>
        <div className="hx-btns">
          <a href="#deals" className="btn light">Shop the deals</a>
          <a href="#gifts" className="btn light">Shop gifts</a>
        </div>
        <SaleClock />
      </div>
    </section>
  );
}

/* ---------- 3 · Sticky deals bar ---------- */

const TABS: [string, string][] = [["sleep-suite", "The Sleep Suite"], ["best-friends", "The Best Friends Bundle"], ["furniture", "Furniture"], ["gifts", "Gifts"]];

export function DealsBar() {
  const [active, setActive] = useState(TABS[0][0]);
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const hdr = document.querySelector(".hdr") as HTMLElement | null;
    const setTop = () => bar.current?.style.setProperty("--hx-top", (hdr?.offsetHeight ?? 0) + "px");
    setTop();
    window.addEventListener("resize", setTop);
    const els = TABS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const o = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: "-35% 0px -55% 0px" });
    els.forEach((e) => o.observe(e));
    // Above the first deal, the first tab is the current one.
    const onScroll = () => { if (els[0] && els[0].getBoundingClientRect().top > window.innerHeight * 0.45) setActive(TABS[0][0]); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { o.disconnect(); window.removeEventListener("resize", setTop); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => {
    bar.current?.querySelector(`[data-id="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);
  return (
    <nav className="hx-bar" id="deals" ref={bar} aria-label="The deals">
      <div className="hx-bar-in">
        {TABS.map(([id, label]) => (
          <a key={id} href={"#" + id} data-id={id} className={"hx-tab" + (active === id ? " on" : "")} aria-current={active === id ? "true" : undefined}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

function SizeChips({ sizes, value, onChange, label }: { sizes: { id: string; label: string }[]; value: string; onChange: (id: string) => void; label: string }) {
  return (
    <div className="hx-chips" role="radiogroup" aria-label={label}>
      {sizes.map((s) => <button key={s.id} type="button" role="radio" aria-checked={value === s.id} className={"hx-chip" + (value === s.id ? " on" : "")} onClick={() => onChange(s.id)}>{s.label}</button>)}
    </div>
  );
}

/* ---------- 4 · No. 1, the Complete Sleep Suite ---------- */

export function SuiteDeal({ prices }: { prices: LivePrices }) {
  const cart = useCart();
  const [size, setSize] = useState("queen");
  const [color, setColor] = useState(MATTRESS.defaultColor);
  const [shot, setShot] = useState(0);
  const [added, setAdded] = useState(false);
  const m = prices.mattress[size] ?? MATTRESS.sizes[0].price;
  const list = m + prices.bedding;
  const sale = salePrice(m) + salePrice(prices.bedding);
  const ashburyAlone = salePrice(m) + MATTRESS.delivery.price;
  const shots: GalleryShot[] = [
    { photo: HOLIDAY_PHOTOS.suite.photo, alt: HOLIDAY_PHOTOS.suite.alt },
    { photo: "pillow-hero", alt: "The Ashwick Pillow" },
    { photo: "mattress-room-flint-clean", alt: "The Ashbury in Flint on a light oak bed" },
  ];
  const add = () => {
    cart.addMany(sleepSuiteLines({ sizeId: size, feelId: MATTRESS.feels[0].id, colorId: color, pillowId: BUNDLE_PILLOWS[0].id as string }));
    setAdded(true);
  };
  return (
    <section className="hx-deal hx-oat" id="sleep-suite" aria-labelledby="hx-suite-h">
      <div className="hx-deal-img hx-gal"><SwipeGallery shots={shots} index={shot} onIndex={setShot} aspect="4/5" /></div>
      <div className="hx-deal-t">
        <p className="hx-no"><em>No. 1</em> · The Sleep Suite</p>
        <h2 className="hx-h2" id="hx-suite-h">Everything for the bed.</h2>
        <ul className="hx-inc" aria-label="What's included">
          <li><IncIcon k="mattress" /><span>Ashbury mattress</span></li>
          <li><IncIcon k="pillows" /><span>Two pillows</span></li>
          <li><IncIcon k="protector" /><span>Mattress protector</span></li>
          <li><IncIcon k="glove" /><span>Free white glove</span></li>
        </ul>
        <SizeChips sizes={MATTRESS.sizes} value={size} onChange={(s) => { setSize(s); setAdded(false); }} label="Mattress size" />
        <div className="hx-colors" role="radiogroup" aria-label="Color">
          {MATTRESS.colors.map((c) => (
            <button key={c.id} type="button" role="radio" aria-checked={color === c.id} aria-label={c.label} title={c.label} className={color === c.id ? "on" : undefined} onClick={() => { setColor(c.id); setAdded(false); }}>
              <Photo src={c.swatch} label="" sizes="32px" />
            </button>
          ))}
          <span className="hx-colors-l">{MATTRESS.colors.find((c) => c.id === color)?.label} · {MATTRESS.feels[0].label}</span>
        </div>
        <PriceLine list={list} sale={sale} big />
        {SALE.active && list > sale && <p className="hx-save">You save {money(Math.floor(list + 1e-9) - Math.floor(sale + 1e-9))}</p>}
        <div className="hx-cta">
          <button type="button" className="btn" onClick={add}>{added ? "Added to cart" : "Add to cart"}</button>
          <Link href={`${SLEEP_SUITE.path}?size=${size}&color=${color}`} className="ulink">See details →</Link>
        </div>
        {sale < ashburyAlone && <p className="hx-note">Costs less than the Ashbury plus white glove on its own.</p>}
      </div>
    </section>
  );
}

/* ---------- 5 · No. 2, the Best Friends Bundle ---------- */

export function BestFriendsDeal({ prices }: { prices: LivePrices }) {
  const [size, setSize] = useState("queen");
  const [dog, setDog] = useState(DOG_BED.sizes.find((z) => z.id === "medium")?.id ?? DOG_BED.sizes[0].id);
  const m = prices.mattress[size] ?? MATTRESS.sizes[0].price;
  const d = prices.dogBed[dog] ?? DOG_BED.sizes[0].price;
  const list = m + d + prices.bedding;
  const sale = salePrice(m) + salePrice(d) + salePrice(prices.bedding);
  return (
    <section className="hx-deal hx-evergreen hx-mirror" id="best-friends" aria-labelledby="hx-bf-h">
      <div className="hx-deal-img"><Photo src={HOLIDAY_PHOTOS.bestFriends.photo} label={HOLIDAY_PHOTOS.bestFriends.alt} fill sizes="(max-width: 860px) 100vw, 55vw" /></div>
      <div className="hx-deal-t">
        <p className="hx-no"><em>No. 2</em> · {BUNDLE.title}</p>
        <h2 className="hx-h2" id="hx-bf-h">One for you. One for them.</h2>
        <p className="hx-line">An Ashbury mattress and a matching Ashbury Dog Bed, in the colors you love.</p>
        <ul className="hx-inc" aria-label="What's included">
          <li><IncIcon k="mattress" /><span>Ashbury mattress</span></li>
          <li><IncIcon k="dog" /><span>Ashbury Dog Bed</span></li>
          <li><IncIcon k="pillows" /><span>Two pillows and a Mattress Protector</span></li>
          <li><IncIcon k="glove" /><span>Free white glove delivery for the mattress</span></li>
        </ul>
        <p className="hx-l">Mattress</p>
        <SizeChips sizes={MATTRESS.sizes} value={size} onChange={setSize} label="Mattress size" />
        <p className="hx-l">Dog bed</p>
        <SizeChips sizes={DOG_BED.sizes} value={dog} onChange={setDog} label="Dog bed size" />
        <PriceLine list={list} sale={sale} big />
        {SALE.active && list > sale && <p className="hx-save">You save {money(Math.floor(list + 1e-9) - Math.floor(sale + 1e-9))}</p>}
        <div className="hx-cta"><Link href={`${BUNDLE.path}?size=${size}&dog=${dog}`} className="btn light">Build your bundle</Link></div>
      </div>
    </section>
  );
}

/* ---------- 6 · No. 3, 20% off all furniture ---------- */

const FURNITURE: Record<"Sofas" | "Chairs" | "Bedroom", string[]> = {
  Sofas: ["marlowe", "marlowe-loveseat", "chatsworth", "cotswold", "burford"],
  Chairs: ["pembroke", "cotswold-chair", "marlowe-chair", "marlowe-ottoman"],
  Bedroom: ["ashbury"],
};

function FurnitureCard({ id, prices }: { id: string; prices: LivePrices }) {
  if (id === "ashbury") {
    const list = Math.min(...Object.values(prices.mattress));
    return (
      <li className="hx-card">
        <Link href={MATTRESS_PATH}>
          <span className="hx-card-img"><Photo src="mattress-room-sorrel-clean" label={MATTRESS.title} fill sizes="(max-width: 860px) 46vw, 380px" /><Photo src="mattress-room-flint-clean" label="" className="alt" fill sizes="(max-width: 860px) 46vw, 380px" /></span>
          <span className="hx-card-name">{MATTRESS.title}</span>
          <PriceLine list={list} sale={salePrice(list)} />
        </Link>
      </li>
    );
  }
  const p = getProduct(id);
  if (!p) return null;
  const list = prices.furniture[id] ?? 0;
  const main = (p.cardPhoto ?? p.photos[0]) as PhotoKey;
  const second = p.cardSingle ? undefined : (p.photos.find((x) => x !== main) as PhotoKey | undefined);
  return (
    <li className="hx-card">
      <Link href={"/products/" + p.id}>
        <span className="hx-card-img">
          <Photo src={main} label={p.name} fill sizes="(max-width: 860px) 46vw, 380px" />
          {second && <Photo src={second} label="" className="alt" fill sizes="(max-width: 860px) 46vw, 380px" />}
        </span>
        <span className="hx-card-name">{p.name}</span>
        <PriceLine list={list} sale={salePrice(list)} />
      </Link>
    </li>
  );
}

export function FurnitureDeal({ prices }: { prices: LivePrices }) {
  const [tab, setTab] = useState<keyof typeof FURNITURE>("Sofas");
  return (
    <section className="hx-sec hx-alabaster" id="furniture" aria-labelledby="hx-fur-h">
      <div className="wrap">
        <p className="hx-no"><em>No. 3</em> · {SALE.percent}% off all furniture</p>
        <h2 className="hx-h2" id="hx-fur-h">For every room.</h2>
        <div className="hx-filters" role="tablist" aria-label="Furniture">
          {(Object.keys(FURNITURE) as (keyof typeof FURNITURE)[]).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} className={"hx-filter" + (tab === t ? " on" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <ul className="hx-grid" role="tabpanel">{FURNITURE[tab].map((id) => <FurnitureCard key={id} id={id} prices={prices} />)}</ul>
        <Link href="/collections/all" className="ulink">Shop all furniture →</Link>
      </div>
    </section>
  );
}

/* ---------- 7 · Gifts under $300 ---------- */

type Gift = { key: string; name: string; href: string; photo: PhotoKey; list: number; quick: { kind: "pillow" | "dog-bed" | "nook"; fill?: string }; isNew?: boolean };

function GiftCard({ g }: { g: Gift }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="hx-gift">
      <Link href={g.href} className="hx-gift-img"><Photo src={g.photo} label={g.name} fill sizes="(max-width: 860px) 58vw, 300px" /></Link>
      <Link href={g.href} className="hx-gift-name">{g.isNew && <span className="hx-new">New</span>}{g.name}</Link>
      <div className="hx-gift-row">
        <PriceLine list={g.list} sale={salePrice(g.list)} />
        <button type="button" className="hx-add" onClick={() => setOpen(true)} aria-label={`Add ${g.name}`}>Add</button>
      </div>
      {open && <QuickAddSheet kind={g.quick.kind} href={g.href} fill={g.quick.fill} onClose={() => setOpen(false)} />}
    </li>
  );
}

export function GiftsDeal({ prices }: { prices: LivePrices }) {
  const order = ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"];
  const pillows: Gift[] = [...PILLOW_STANDALONE_FILLS].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((f) => ({ key: f.id, name: f.label, href: f.path, photo: PILLOW_STORY[f.id].card, list: prices.pillow[f.id], quick: { kind: "pillow", fill: f.id }, isNew: true }));
  const minOf = (r: Record<string, number>) => Math.min(...Object.values(r));
  const dogs: Gift[] = [
    { key: "dog", name: DOG_BED.title, href: DOG_BED.path, photo: "dog-bed-sorrel-card", list: minOf(prices.dogBed), quick: { kind: "dog-bed" } },
    { key: "nook", name: NOOK.title, href: NOOK.path, photo: "nook-olive-card", list: minOf(prices.nook), quick: { kind: "nook" } },
  ];
  const gifts = [...pillows, ...dogs].filter((g) => salePrice(g.list) < 300);
  return (
    <section className="hx-gifts hx-oat" id="gifts" aria-labelledby="hx-gifts-h">
      <div className="hx-gifts-band"><Photo src={HOLIDAY_PHOTOS.gifts.photo} label={HOLIDAY_PHOTOS.gifts.alt} fill sizes="100vw" /></div>
      <div className="wrap hx-gifts-head">
        <h2 className="hx-h2" id="hx-gifts-h">Gifts under $300</h2>
        <p className="hx-line">Ships in 3–4 days.</p>
      </div>
      <ul className="hx-rail">{gifts.map((g) => <GiftCard key={g.key} g={g} />)}</ul>
    </section>
  );
}

/* ---------- 8 · Holiday delivery ---------- */

export function HolidayDelivery() {
  return (
    <section className="hx-deliv" aria-label="Holiday delivery">
      <div className="wrap hx-deliv-in">
        <p className="hx-deliv-h">{HOLIDAY_ORDER_BY ? `Order by ${HOLIDAY_ORDER_BY} for delivery before Christmas.` : "Holiday delivery"}</p>
        <p className="hx-deliv-s">In-stock pieces ship in 3–4 days. Custom pieces take 8–12 weeks.</p>
        <Link href="/pages/delivery" className="hx-deliv-l">Delivery details →</Link>
      </div>
    </section>
  );
}
