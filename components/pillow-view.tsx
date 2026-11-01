"use client";

import { useRef, useState } from "react";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { ShipsFast, TrustRow } from "@/components/buy-icons";
import { useCart } from "@/components/cart";
import { BUY_OPTIONS_ID, StickyBuy } from "@/components/sticky-buy";
import { Price, SaleNote } from "@/components/sale";
import { PHOTOS } from "@/lib/photos";
import { fmt } from "@/lib/products";
import { PILLOW_HERO, salePrice } from "@/lib/sale";
import { PILLOW_COVERS, PILLOW_ID, PILLOW_SIZES, PILLOW_TYPES } from "@/lib/pillow";

/** Standalone Ashwick Pillow: fill, size and cover color; price follows the fill. */
export function PillowView() {
  const cart = useCart();
  const buyRef = useRef<HTMLButtonElement>(null);
  const [fillId, setFill] = useState<string>(PILLOW_TYPES[0].id);
  const [sizeId, setSize] = useState<string>(PILLOW_SIZES[0].id);
  const [coverId, setCover] = useState<string>("mocha");
  const fill = PILLOW_TYPES.find((f) => f.id === fillId) ?? PILLOW_TYPES[0];
  const size = PILLOW_SIZES.find((s) => s.id === sizeId) ?? PILLOW_SIZES[0];
  const cover = PILLOW_COVERS.find((c) => c.id === coverId) ?? PILLOW_COVERS[0];

  const add = () =>
    cart.add({
      id: PILLOW_ID,
      name: "The Ashwick Pillow",
      photo: PILLOW_HERO.photo,
      price: fill.price,
      qty: 1,
      mode: "As designed",
      options: [["Fill", fill.label], ["Size", size.label], ["Cover color", cover.label]],
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo">
            <Photo src={PILLOW_HERO.photo} label={PILLOW_HERO.alt} sizes="(max-width: 960px) 100vw, 56vw" preload />
          </div>
        </div>
      </div>
      <div className="info">
        <div className="eyebrow">Pillow · Made to order</div>
        <h1 className="pdp-name">The Ashwick Pillow</h1>
        <div className="pdp-price"><Price price={fill.price} /></div>
        <SaleNote />
        <p className="body">{fill.desc}</p>
        <div className="choices" id={BUY_OPTIONS_ID}>
          <OptGroup label="Fill" value={fill.label}>
            <Pills options={PILLOW_TYPES.map((f) => ({ id: f.id as string, label: f.label }))} value={fillId} onChange={setFill} />
          </OptGroup>
          <OptGroup label="Size" value={size.label}>
            <Pills options={PILLOW_SIZES.map((s) => ({ id: s.id as string, label: s.label }))} value={sizeId} onChange={setSize} />
          </OptGroup>
          <OptGroup label="Cover color" value={cover.label}>
            {PILLOW_COVERS.map((c) => (
              <button
                key={c.id}
                type="button"
                className={"chip color-chip mattress-chip" + (coverId === c.id ? " on" : "")}
                style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }}
                title={c.label}
                aria-label={`Cover ${c.label}`}
                aria-pressed={coverId === c.id}
                onClick={() => setCover(c.id)}
              />
            ))}
          </OptGroup>
        </div>
        <div className="designed">
          <ShipsFast when="3–4 days" note="Handmade to order in the USA." />
          <button ref={buyRef} className="btn full" onClick={add}>Add to cart · {fmt(salePrice(fill.price))}</button>
          <TrustRow items={[["hand", "Handmade to order"], ["returns", "Removable cover included"]]} />
          <StickyBuy watch={buyRef} photo={PILLOW_HERO.photo} name="The Ashwick Pillow" summary={`${fill.label} · ${size.label} · ${cover.label}`} price={salePrice(fill.price)} cta="Add to cart" onAdd={add} />
        </div>
        <p className="body small">Every pillow comes with a removable cover in your choice of Fleece, Flint, Flax or Sorrel, the mattress colors.</p>
      </div>
    </section>
  );
}
