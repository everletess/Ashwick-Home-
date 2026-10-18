"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { Photo } from "@/components/photo";
import { OptGroup, Pills } from "@/components/product-view";
import { GUARANTEE_PATH, MATTRESS, MATTRESS_GALLERY, colorById, sizeById } from "@/lib/mattress";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { fmt } from "@/lib/products";
import { track } from "@/lib/pixel";

const M = MATTRESS;

/** Gallery + buy box for the mattress. The gallery follows the Color selection. */
/** The buy box in the color named by ?color=<id> (from the home page feature). Render inside <Suspense>. */
export function MattressViewFromURL() {
  const c = useSearchParams().get("color");
  return <MattressView initialColor={c && M.colors.some((x) => x.id === c) ? c : undefined} />;
}

export function MattressView({ initialColor }: { initialColor?: string }) {
  const cart = useCart();
  const [size, setSize] = useState(M.defaultSize);
  const [feel, setFeel] = useState(M.feels[0].id);
  const [color, setColorState] = useState(initialColor ?? M.defaultColor);
  const [img, setImg] = useState(0);

  const sel = colorById(color);
  const sz = sizeById(size);
  // The color's own shots, then the five-color lineup and the construction.
  const gallery: { photo: PhotoKey; alt: string }[] = [...sel.photos.map((photo) => ({ photo, alt: sel.alt })), ...MATTRESS_GALLERY];
  // Horizontal swipe on the main image steps through the gallery on touch screens.
  const swipeX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") swipeX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeX.current == null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) < 40) return;
    setImg((i) => (i + (dx < 0 ? 1 : -1) + gallery.length) % gallery.length);
  };
  const setColor = (c: string) => {
    setColorState(c);
    setImg(0);
  };

  // Meta Pixel: one ViewContent per product page view (not per option change).
  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("ViewContent", { content_ids: [M.id], content_name: M.title, content_type: "product", value: sz.price });
  }, [sz.price]);

  const feelLabel = M.feels.find((f) => f.id === feel)!.label;
  const add = () =>
    cart.add({
      id: M.id,
      name: M.title,
      photo: sel.photos[0] ?? sel.swatch,
      price: sz.price,
      qty: 1,
      mode: "As designed",
      options: [["Size", `${sz.label} (${sz.dims})`], ["Feel", feelLabel], ["Color", sel.label]],
    });

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeX.current = null)}>
          <div className="gal-photo">
            <Photo src={gallery[img].photo} label={gallery[img].alt} sizes="(max-width: 960px) 100vw, 56vw" preload={img === 0} />
          </div>
        </div>
        <div className="gal-thumbs">
          {gallery.map(({ photo: ph }, i) => (
            <button key={i} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
              <Photo src={ph} label="" sizes="84px" />
            </button>
          ))}
        </div>
      </div>

      <div className="info">
        <div className="eyebrow">{M.type} · Made to order</div>
        <h1 className="pdp-name">{M.title}</h1>
        <div className="pdp-collection">{M.collection}</div>
        <div className="pdp-price">{fmt(sz.price)}</div>
        <p className="body">
          An all-natural, organic mattress made from nature&apos;s finest materials: organic Living Wool, organic cotton and Swedish horsehair, hand-tufted and made in color. An {M.mattressHeight} mattress with a {M.topperHeight} topper included: {M.combinedHeight} of natural fiber, with no foam, no latex and no chemical flame retardants.
        </p>

        <div className="choices">
          <OptGroup label="Size" value={`${sz.label} · ${sz.dims}`}>
            <Pills options={M.sizes} value={size} onChange={setSize} />
          </OptGroup>
          <OptGroup label="Feel" value={feelLabel}>
            <Pills options={M.feels} value={feel} onChange={setFeel} />
          </OptGroup>
          <OptGroup label="Color" value={sel.label}>
            {M.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                className={"chip color-chip mattress-chip" + (color === c.id ? " on" : "")}
                style={{ backgroundImage: `url(${PHOTOS[c.swatch].src})` }}
                title={c.label}
                aria-label={c.label}
                aria-pressed={color === c.id}
                onClick={() => setColor(c.id)}
              />
            ))}
          </OptGroup>
        </div>

        <div className="designed">
          {M.available ? (
            <button className="btn full" onClick={add}>Add to cart · {fmt(sz.price)}</button>
          ) : (
            <button className="btn full" disabled aria-disabled="true">Coming soon</button>
          )}
          <div className="buy-promise">
            <p className="buy-promise-h">Sleep on it for {M.guaranteeNights} nights.</p>
            <p className="buy-promise-b">
              If it isn&apos;t right after {M.guaranteeMinNights} nights, we collect it for free and refund you in full.{" "}
              <Link href={GUARANTEE_PATH} className="ulink">How it works</Link>
            </p>
          </div>
          <ul className="buy-notes">
            <li>{M.leadTime} {M.shipping}</li>
            <li>{M.warranty}.</li>
            <li>Pay over time with Affirm at checkout.</li>
          </ul>
        </div>

        <Link href="/pages/bespoke#mattresses" className="ulink">Request a custom size</Link>
        <Link href={GUARANTEE_PATH} className="ulink">Guarantee &amp; warranty</Link>
      </div>
    </section>
  );
}
