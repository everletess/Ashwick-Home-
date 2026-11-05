"use client";

import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "@/components/photo";
import { useCart } from "@/components/cart";
import { Stars } from "@/components/reviews";
import { SALE, mattressDelivery, salePrice } from "@/lib/sale";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, colorById, sizeById } from "@/lib/mattress";
import { PILLOW_COVERS, PILLOW_ID, PILLOW_SIZES, PILLOW_STANDALONE_FILLS, pillowPrice } from "@/lib/pillow";
import { reviewsFor } from "@/lib/reviews";
import type { CatalogItem } from "@/lib/catalog";

const whole = (n: number) => "$" + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

const floorUsd = (n: number) => "$" + Math.floor(n + 1e-9).toLocaleString("en-US");
const BADGES = new Set(["New", "Best value"]);

/** Price line: sale price, then the original struck through; whole dollars on cards (cents only in the cart). */
function CardPrice({ item }: { item: CatalogItem }) {
  const now = item.nowPrice ?? salePrice(item.price);
  const sale = SALE.active && now !== item.price;
  return (
    <div className="cc-price">
      <span className="cc-now">{floorUsd(sale ? now : item.price)}</span>
      {sale && <s className="cc-was">{floorUsd(item.price)}</s>}
    </div>
  );
}

/** One product card, used by every grid: 4:5 photo (a small + on it opens Quick add), name, price, and small stars where reviews exist. */
export function CatalogCard({ item, priority }: { item: CatalogItem; priority?: boolean }) {
  const [quick, setQuick] = useState(false);
  const rv = item.review ? reviewsFor(item.review) : null;
  const badge = item.badge && BADGES.has(item.badge) ? item.badge : null;
  return (
    <div className="cc" data-price={item.price} data-name={item.name} data-group={item.group} data-fast={item.fast ? "1" : undefined}>
      <div className="cc-media">
        <Link href={item.href} className="cc-link" aria-label={item.name} tabIndex={-1}>
          <div className={"cc-img" + (String(item.photo).startsWith("mattress-room") ? " crop-cap" : "")}>
            <Photo src={item.photo} label={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 310px" preload={priority} />
            {item.hover && <Photo src={item.hover} label="" className="alt" fill sizes="(max-width: 640px) 50vw, 310px" />}
          </div>
        </Link>
        {badge && <span className="cc-badge">{badge}</span>}
        {item.quick && <button type="button" className="cc-plus" aria-label={`Quick add: ${item.name}`} onClick={() => setQuick(true)}>+</button>}
      </div>
      <Link href={item.href} className="cc-link">
        <h3 className="cc-name">{item.name}</h3>
        <CardPrice item={item} />
        {rv && rv.count > 0 && <div className="cc-stars"><Stars rating={rv.average} /><span>{rv.count}</span></div>}
      </Link>
      {quick && item.quick && <QuickAddSheet kind={item.quick.kind} href={item.quick.href} onClose={() => setQuick(false)} />}
    </div>
  );
}

type QuickKind = "pillow" | "dog-bed" | "nook" | "mattress";

/** Choose size and color (and fill, for a pillow) without leaving the grid. `fill` preselects a pillow fill. */
export function QuickAddSheet({ kind, href, onClose, fill: startFill }: { kind: QuickKind; href: string; onClose: () => void; fill?: string }) {
  const cart = useCart();
  const isPillow = kind === "pillow";
  const isMattress = kind === "mattress";
  const bed = kind === "nook" ? NOOK : DOG_BED;
  const [fillId, setFill] = useState<string>(startFill ?? PILLOW_STANDALONE_FILLS[2]?.id ?? PILLOW_STANDALONE_FILLS[0].id);
  const [sizeId, setSize] = useState<string>(isPillow ? PILLOW_SIZES[0].id : isMattress ? MATTRESS.defaultSize : bed.sizes[0].id);
  const [feelId, setFeel] = useState<string>(MATTRESS.feels[0].id);
  const [colorId, setColor] = useState<string>(isMattress ? MATTRESS.defaultColor : "mocha");
  const fill = PILLOW_STANDALONE_FILLS.find((f) => f.id === fillId) ?? PILLOW_STANDALONE_FILLS[0];
  const pSize = PILLOW_SIZES.find((s) => s.id === sizeId) ?? PILLOW_SIZES[0];
  const dSize = bed.sizes.find((s) => s.id === sizeId) ?? bed.sizes[0];
  const mSize = sizeById(sizeId);
  const feel = MATTRESS.feels.find((f) => f.id === feelId) ?? MATTRESS.feels[0];
  const cover = PILLOW_COVERS.find((c) => c.id === colorId) ?? PILLOW_COVERS[3];
  const dColor = bed.colors.find((c) => c.id === colorId) ?? bed.colors[0];
  const mColor = colorById(colorId);
  const price = isPillow ? pillowPrice(fill.id, sizeId) : isMattress ? mSize.price : dSize.price;
  const title = isPillow ? "The Ashwick Pillow" : isMattress ? MATTRESS.title : bed.title;
  const add = () => {
    if (isPillow) {
      cart.add({ id: PILLOW_ID, name: "The Ashwick Pillow", photo: "pillow-hero", price, qty: 1, mode: "As designed", options: [["Fill", fill.label], ["Size", pSize.label], ["Cover color", cover.label]] });
    } else if (isMattress) {
      // Same line the Ashbury page adds, including the white glove delivery.
      cart.add({ id: MATTRESS.id, name: MATTRESS.title, photo: mColor.photos[0] ?? mColor.swatch, price, qty: 1, mode: "As designed", options: [["Size", `${mSize.label} (${mSize.dims})`], ["Feel", feel.label], ["Color", mColor.label]], delivery: mattressDelivery() });
    } else {
      cart.add({ id: bed.id, name: bed.title, photo: dColor.photos[0] ?? dColor.swatch, price, qty: 1, mode: "As designed", options: [["Size", `${dSize.label} (${dSize.dims})`], ["Color", dColor.label]] });
    }
    onClose();
  };
  const colors = isPillow ? PILLOW_COVERS.map((c) => ({ id: c.id, label: c.label })) : isMattress ? MATTRESS.colors.map((c) => ({ id: c.id, label: c.label })) : bed.colors.map((c) => ({ id: c.id, label: c.label }));
  const sizes = isPillow ? PILLOW_SIZES.map((s) => ({ id: s.id, label: s.label })) : isMattress ? MATTRESS.sizes.map((s) => ({ id: s.id, label: s.label })) : bed.sizes.map((s) => ({ id: s.id, label: `${s.label} ${s.dims}` }));
  const body = (
    <div className="qa-scrim" onClick={onClose}>
      <div className="qa-sheet" role="dialog" aria-modal="true" aria-label="Choose size and color" onClick={(e) => e.stopPropagation()}>
        <div className="qa-head"><strong>{title}</strong><button type="button" className="x" aria-label="Close" onClick={onClose}>×</button></div>
        {isPillow && (
          <>
            <p className="qa-l">Fill</p>
            <div className="qa-opts">{PILLOW_STANDALONE_FILLS.map((f) => <button key={f.id} type="button" aria-pressed={fillId === f.id} className={fillId === f.id ? "on" : ""} onClick={() => setFill(f.id)}>{f.label}</button>)}</div>
          </>
        )}
        <p className="qa-l">Size</p>
        <div className="qa-opts">{sizes.map((s) => <button key={s.id} type="button" aria-pressed={sizeId === s.id} className={sizeId === s.id ? "on" : ""} onClick={() => setSize(s.id)}>{s.label}</button>)}</div>
        {isMattress && (
          <>
            <p className="qa-l">Feel</p>
            <div className="qa-opts">{MATTRESS.feels.map((f) => <button key={f.id} type="button" aria-pressed={feelId === f.id} className={feelId === f.id ? "on" : ""} onClick={() => setFeel(f.id)}>{f.label}</button>)}</div>
          </>
        )}
        <p className="qa-l">Color</p>
        <div className="qa-opts">{colors.map((c) => <button key={c.id} type="button" aria-pressed={colorId === c.id} className={colorId === c.id ? "on" : ""} onClick={() => setColor(c.id)}>{c.label}</button>)}</div>
        <button type="button" className="btn full qa-go" onClick={add}>Add to cart · {whole(salePrice(price))}</button>
        <Link href={href} className="ulink qa-more" onClick={onClose}>See all details</Link>
      </div>
    </div>
  );
  return typeof document === "undefined" ? null : createPortal(body, document.body);
}
