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
import { PILLOW_COVERS, PILLOW_COVER_PHOTOS, PILLOW_FAQ, PILLOW_ID, PILLOW_RETURNS, PILLOW_SIZES, PILLOW_STANDALONE_FILLS } from "@/lib/pillow";
import type { PhotoKey } from "@/lib/photos";

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
  // The gallery: the chosen color first, then the other shots. Picking a cover swaps the main photo.
  const gallery = ([
    PILLOW_COVER_PHOTOS[coverId as keyof typeof PILLOW_COVER_PHOTOS] ?? PILLOW_COVER_PHOTOS.natural,
    { photo: "pillow-covers", alt: "Cream pillows beside folded removable covers in Sorrel, Fleece, Flint and Flax" },
    { photo: "pillow-covers-wide", alt: "Two cream pillows on a travertine ledge beside a stack of four removable covers in different colors" },
  ] as { photo: PhotoKey; alt: string }[]).filter((g, i, a) => a.findIndex((x) => x.photo === g.photo) === i);
  const [shot, setShot] = useState(0);
  const main = gallery[Math.min(shot, gallery.length - 1)];

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
        <p>The cover is 100% organic cotton twill, in the same colors as the Ashbury, and it removes from the pillow. Every pillow is handmade to order in the USA.</p>
        <ul className="pillow-list">
          {FILLS.map((f) => (
            <li key={f.id}><strong>{f.label}.</strong> {f.story}</li>
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
    [
      "Care",
      <p>Do not machine wash the pillow. Air it out in the sun to refresh it. The removable cover washes in cold water and should be line dried.</p>,
    ],
    [
      "Adjustable comfort",
      <p>The fill is adjustable. Add or remove fill material to set your own height and firmness and the support that suits you, whether you sleep on your back, side or stomach.</p>,
    ],
    ["Delivery", <p>Free delivery. Handmade to order in the USA, shipping within 3–4 days.</p>],
    ["Returns", <p>{PILLOW_RETURNS.full}</p>],
    ...PILLOW_FAQ.filter(([q]) => q === "Is there a smell when it arrives?").map(([q, a]): [string, React.ReactNode] => [q, <p>{a}</p>]),
  ];

  return (
    <section className="pdp wrap pillow-pdp">
      <div className="gal">
        <div className="gal-main">
          <div className="gal-photo">
            <Photo src={main.photo} label={main.alt} sizes="(max-width: 960px) 100vw, 56vw" preload />
          </div>
        </div>
        <div className="gal-thumbs">
          {gallery.map((g, i) => (
            <button key={g.photo} className={i === shot ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === shot} onClick={() => setShot(i)}>
              <Photo src={g.photo} label="" sizes="84px" />
            </button>
          ))}
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
                  onClick={() => { setCover(c.id); setShot(0); }}
                />
              ))}
            </div>
          </OptGroup>
        </div>
        <div className="designed">
          <button ref={buyRef} className="btn full" onClick={add}>Add to cart · {fmt(salePrice(fill.price))}</button>
          <ShipsFast when="3–4 days" note="Free delivery. Handmade to order in the USA." />
          <TrustRow items={[["truck", "Free delivery"], ["hand", "Handmade to order"], ["returns", PILLOW_RETURNS.short]]} />
          <StickyBuy watch={buyRef} photo={main.photo} name="The Ashwick Pillow" summary={`${fill.label} · ${size.label} · ${cover.label}`} price={salePrice(fill.price)} cta="Add to cart" onAdd={add} />
        </div>
        <Accordion items={details} />
      </div>
    </section>
  );
}
