"use client";

// Homepage below the offer band (Tessa's brief, 05/11): fewer, larger editorial sections that alternate through the
// palette (walnut, oat, alabaster, sage). No badges, no quick add, no words inside the pictures, one link per section.
// The materials ("Grown, not made") sit in components/fibers.tsx and come first; the Ashwick Letter is the Newsletter.
import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/photo";
import { fmtWhole } from "@/components/sale";
import { MATTRESS } from "@/lib/mattress";
import type { PhotoKey } from "@/lib/photos";
import { cardPrice, getProduct } from "@/lib/products";
import { SALE, salePrice } from "@/lib/sale";

/* ---------- 4 · Shop the home, by room ---------- */

const ROOMS: { name: string; href: string; photo: PhotoKey; alt: string; pos?: "right" }[] = [
  { name: "Living Room", href: "/collections/sofas", photo: "hero", alt: "The Cotswold sofa and chair beside a lit fireplace in a sunlit living room" },
  { name: "Bedroom", href: "/collections/bedroom", photo: "mattress-room-flint-clean", alt: "The Ashbury in Flint on a light oak bed in a sunlit bedroom" },
  { name: "Bespoke", href: "/pages/bespoke", photo: "bespoke-hero", alt: "A hand sketching a sofa beside fabric and wood samples", pos: "right" },
  { name: "Gifts", href: "/black-friday#gifts", photo: "pillow-stack-meadow", alt: "A stack of four Ashwick pillows in a sunlit meadow" },
];

export function ShopTheHome() {
  return (
    <section className="he he-oat he-rooms" aria-labelledby="he-rooms-h">
      <div className="wrap">
        <h2 className="eyebrow he-eyebrow" id="he-rooms-h">Shop the home</h2>
        <ul className="he-rooms-grid">
          {ROOMS.map((r) => (
            <li key={r.name}>
              <Link href={r.href} className="he-room">
                <span className="he-room-img"><Photo src={r.photo} label={r.alt} fill sizes="(max-width: 860px) 100vw, 640px" className={r.pos ? "he-pos-right" : undefined} /></span>
                <span className="he-room-name">{r.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 5 · The Living Room ---------- */

const LIVING = ["marlowe", "cotswold", "chatsworth", "pembroke"];

function LivingCard({ id }: { id: string }) {
  const p = getProduct(id);
  if (!p) return null;
  const { price } = cardPrice(p);
  const photo = (p.cardPhoto ?? p.photos[0]) as PhotoKey;
  return (
    <li className="he-card">
      <Link href={"/products/" + p.id}>
        <span className="he-card-img"><Photo src={photo} label={p.name} fill sizes="(max-width: 860px) 66vw, 260px" /></span>
        <span className="he-card-name">{p.name}</span>
        <span className="he-card-price">
          {SALE.active ? <><span className="price-now">{fmtWhole(salePrice(price))}</span> <s className="price-was">{fmtWhole(price)}</s></> : fmtWhole(price)}
        </span>
      </Link>
    </li>
  );
}

export function LivingRoom() {
  return (
    <section className="he he-alabaster he-living" aria-labelledby="he-living-h">
      <div className="he-living-img"><Photo src="marlowe-room-linen" label="The Marlowe Sofa in white Irish Linen on its fluted red oak plinth, in a sunlit room" fill sizes="(max-width: 860px) 100vw, 50vw" /></div>
      <div className="he-living-t">
        <p className="eyebrow">The Living Room</p>
        <h2 className="h2" id="he-living-h">Made to gather around.</h2>
        <ul className="he-cards">{LIVING.map((id) => <LivingCard key={id} id={id} />)}</ul>
        <Link href="/collections/sofas" className="ulink">Shop the living room →</Link>
      </div>
    </section>
  );
}

/* ---------- 6 · The Bedroom: the Ashbury in color ---------- */

/** Clean copies of the Ashbury room photos (the printed "shown in …" caption cut off). */
const CLEAN: Record<string, PhotoKey> = { natural: "mattress-room-fleece-clean", dove: "mattress-room-flint-clean", safari: "mattress-room-flax-clean", mocha: "mattress-room-sorrel-clean" };

export function Bedroom() {
  const [color, setColor] = useState("mocha");
  return (
    <section className="he he-sage he-bed" aria-labelledby="he-bed-h">
      <div className="he-bed-img">
        {MATTRESS.colors.map((c) => (
          <Photo key={c.id} src={CLEAN[c.id] ?? c.photos[0]} label={`${MATTRESS.title} in ${c.label} on a light oak bed in a sunlit bedroom`} className={c.id === color ? "on" : undefined} fill sizes="(max-width: 860px) 100vw, 55vw" />
        ))}
      </div>
      <div className="he-bed-t">
        <p className="eyebrow">The Bedroom</p>
        <h2 className="h2" id="he-bed-h">Dare to dream in color.</h2>
        <ul className="he-dots" aria-label="Colors">
          {MATTRESS.colors.map((c) => (
            <li key={c.id}>
              <button type="button" title={c.label} aria-label={c.label} aria-pressed={c.id === color} className={c.id === color ? "on" : undefined} onClick={() => setColor(c.id)}>
                <Photo src={c.swatch} label="" sizes="32px" />
              </button>
            </li>
          ))}
        </ul>
        <Link href="/collections/bedroom" className="ulink">Shop the bedroom →</Link>
      </div>
    </section>
  );
}

/* ---------- 7 · Built to be handed down ---------- */

export function HandedDown() {
  return (
    <section className="he he-walnut he-hand" aria-labelledby="he-hand-h">
      <div className="he-hand-img"><Photo src="workshop-sofa" label="A craftsman laying organic wool over the solid hardwood frame of a sofa in the Ashwick workshop" fill sizes="100vw" /></div>
      <div className="he-hand-t">
        <h2 className="h2" id="he-hand-h">Built to be handed down.</h2>
        <p className="he-line">Made one at a time from solid hardwood, organic wool and natural fiber.</p>
        <Link href="/pages/our-story" className="ulink">Our story →</Link>
      </div>
    </section>
  );
}
