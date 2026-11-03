"use client";

import { useRef, useState } from "react";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { ShipsFast, TrustRow } from "@/components/buy-icons";
import { Accordion } from "@/components/mattress";
import { useCart } from "@/components/cart";
import { BUY_OPTIONS_ID, StickyBuy } from "@/components/sticky-buy";
import { Price, SaleNote } from "@/components/sale";
import { PHOTOS } from "@/lib/photos";
import { fmt } from "@/lib/products";
import { PILLOW_HERO, SALE, salePrice } from "@/lib/sale";
import { PILLOW_COVERS, PILLOW_ID, PILLOW_RETURNS, PILLOW_SIZES, PILLOW_STANDALONE_FILLS } from "@/lib/pillow";

const FILLS = PILLOW_STANDALONE_FILLS;

/** Standalone Ashwick Pillow, mobile first: price and the three fills sit right under the photo; details fold away. */
export function PillowView() {
  const cart = useCart();
  const buyRef = useRef<HTMLButtonElement>(null);
  const [fillId, setFill] = useState<string>(FILLS[0].id);
  const [sizeId, setSize] = useState<string>(PILLOW_SIZES[0].id);
  const [coverId, setCover] = useState<string>("mocha");
  const fill = FILLS.find((f) => f.id === fillId) ?? FILLS[0];
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

  const details: [string, React.ReactNode][] = [
    [
      "Materials",
      <>
        <p>The cover is 100% organic cotton twill and removes from the pillow. The fill is your choice of three.</p>
        <ul className="pillow-list">
          {FILLS.map((f) => (
            <li key={f.id}><strong>{f.label}.</strong> {f.blurb}</li>
          ))}
        </ul>
      </>,
    ],
    [
      "Sizes",
      <table className="terms-table">
        <thead><tr><th scope="col">Size</th><th scope="col">Dimensions</th></tr></thead>
        <tbody>
          {PILLOW_SIZES.map((s) => {
            const [name, dims] = s.label.split(/ (?=\d)/);
            return (
              <tr key={s.id}>
                <th scope="row" data-label="Size">{name}</th>
                <td data-label="Dimensions">{dims.replace("x", " × ")} in</td>
              </tr>
            );
          })}
        </tbody>
      </table>,
    ],
    ["Delivery", <p>Handmade to order in the USA. Ships within 3–4 days.</p>],
    ["Returns", <p>{PILLOW_RETURNS.full}</p>],
  ];

  return (
    <section className="pdp wrap pillow-pdp">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo">
            <Photo src={PILLOW_HERO.photo} label={PILLOW_HERO.alt} sizes="(max-width: 960px) 100vw, 56vw" preload />
          </div>
        </div>
      </div>
      <div className="info">
        <div className="pillow-head">
          <div className="eyebrow">Pillow · Made to order</div>
          <h1 className="pdp-name">The Ashwick Pillow</h1>
          <div className="pdp-price"><Price price={fill.price} /></div>
          <SaleNote />
        </div>
        <div className="choices" id={BUY_OPTIONS_ID}>
          <OptGroup label="Fill" value={fill.label}>
            <div className="pillow-fills" role="radiogroup" aria-label="Fill">
              {FILLS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={fillId === f.id}
                  className={"pillow-fill" + (fillId === f.id ? " on" : "")}
                  onClick={() => setFill(f.id)}
                >
                  <span className="pillow-fill-t">{f.label}</span>
                  <span className="pillow-fill-d">{f.blurb}</span>
                  <span className="pillow-fill-p">
                    {SALE.active && <s className="price-was">{fmt(f.price)}</s>}
                    {fmt(salePrice(f.price))}
                  </span>
                </button>
              ))}
            </div>
          </OptGroup>
          <OptGroup label="Size" value={size.label}>
            <Pills options={PILLOW_SIZES.map((s) => ({ id: s.id as string, label: s.label }))} value={sizeId} onChange={setSize} />
          </OptGroup>
          <OptGroup label="Cover color" value={cover.label}>
            <div className="pillow-covers">
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
            </div>
          </OptGroup>
        </div>
        <div className="designed">
          <button ref={buyRef} className="btn full" onClick={add}>Add to cart · {fmt(salePrice(fill.price))}</button>
          <ShipsFast when="3–4 days" note="Handmade to order in the USA." />
          <TrustRow items={[["hand", "Handmade to order"], ["returns", PILLOW_RETURNS.short]]} />
          <StickyBuy watch={buyRef} photo={PILLOW_HERO.photo} name="The Ashwick Pillow" summary={`${fill.label} · ${size.label} · ${cover.label}`} price={salePrice(fill.price)} cta="Add to cart" onAdd={add} />
        </div>
        <Accordion items={details} />
      </div>
    </section>
  );
}
