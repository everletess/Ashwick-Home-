"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { ShipsFast, TrustRow } from "@/components/buy-icons";
import { DogBedTeaser } from "@/components/dog-bed";
import { BuyBoxEmail } from "@/components/buy-box-email";
import { BUY_OPTIONS_ID, StickyBuy } from "@/components/sticky-buy";
import { Photo } from "@/components/photo";
import { RatingLink } from "@/components/reviews";
import { OptGroup, Pills } from "@/components/product-view";
import { GUARANTEE_PATH, MATTRESS, colorById, colorFromParam, sizeById } from "@/lib/mattress";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { fmt } from "@/lib/products";
import { track, trackThen } from "@/lib/pixel";
import { trackAddedToCart } from "@/lib/subscribe";

const M = MATTRESS;

/** Gallery + buy box for the mattress. The gallery follows the Color selection. */
/** The buy box in the color named by ?color=<name> (from the home page feature). Render inside <Suspense>. */
export function MattressViewFromURL() {
  return <MattressView initialColor={colorFromParam(useSearchParams().get("color"))} />;
}

export function MattressView({ initialColor }: { initialColor?: string }) {
  const cart = useCart();
  const [size, setSize] = useState(M.defaultSize);
  const [feel, setFeel] = useState(M.feels[0].id);
  const [color, setColorState] = useState(initialColor ?? M.defaultColor);
  const [img, setImg] = useState(0);
  const buyRef = useRef<HTMLButtonElement>(null);

  const sel = colorById(color);
  const sz = sizeById(size);
  // The color's own shots, then the five-color lineup and the construction.
  const gallery: { photo: PhotoKey; alt: string }[] = [
    ...sel.photos.map((photo) => ({ photo, alt: sel.alt })),
    ...(sel.layers ? [{ photo: sel.layers, alt: `${sel.alt}: the layers inside, numbered from the topper to the cover` }] : []),
  ];
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

  // Buy now: straight to Shopify checkout with this bed, skipping the cart. Fires the same AddToCart and
  // InitiateCheckout events (Meta, GA4, Klaviyo for known subscribers) so ads and flows keep learning.
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const buyNow = async () => {
    setBuying(true);
    setBuyError(null);
    const options: [string, string][] = [["Size", `${sz.label} (${sz.dims})`], ["Feel", feelLabel], ["Color", sel.label]];
    track("AddToCart", {
      content_ids: [M.id],
      content_name: M.title,
      content_type: "product",
      contents: [{ id: M.id, quantity: 1, item_price: sz.price }],
      value: sz.price,
    });
    void trackAddedToCart([{ productId: M.id, name: M.title, qty: 1, price: sz.price, options }], sz.price);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: [{ productId: M.id, qty: 1, options }] }),
      });
      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error ?? "Checkout failed");
      trackThen(
        "InitiateCheckout",
        {
          value: sz.price,
          num_items: 1,
          content_ids: [M.id],
          contents: [{ id: M.id, quantity: 1, item_price: sz.price }],
          content_type: "product",
        },
        () => {
          window.location.href = data.checkoutUrl;
        },
      );
    } catch {
      setBuyError("That didn\u2019t go through. Please try again, or add it to your cart.");
      setBuying(false);
    }
  };

  return (
    <section className="pdp wrap">
      <div className="gal">
        <div className="gal-main" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipeX.current = null)}>
          <div className="gal-photo">
            {/* Keyed and eager: each picture loads the moment it is chosen (a lazy swap could stay blank until scrolled into view). */}
            <Photo key={gallery[img].photo} src={gallery[img].photo} label={gallery[img].alt} sizes="(max-width: 960px) 100vw, 56vw" preload />
          </div>
        </div>
        <div className="gal-thumbs">
          {gallery.map(({ photo: ph }, i) => (
            <button key={i} className={i === img ? "on" : ""} aria-label={"Image " + (i + 1)} aria-pressed={i === img} onClick={() => setImg(i)}>
              <Photo src={ph} label="" sizes="84px" />
            </button>
          ))}
        </div>
        {/* Beside the gallery on wide screens; below the buy box on phones (the second copy). */}
        <div className="teaser-wide"><DogBedTeaser /></div>
      </div>

      <div className="info">
        <div className="eyebrow">{M.type} · Made to order</div>
        <h1 className="pdp-name">{M.title}</h1>
        <RatingLink product="ashbury" />
        <div className="pdp-collection">{M.collection}</div>
        <div className="pdp-price">{fmt(sz.price)}</div>
        <p className="body">
          An all-natural, organic mattress made from nature&apos;s finest materials: organic Living Wool, organic cotton and Swedish horsehair, hand-tufted and made in color. An {M.mattressHeight} mattress with a {M.topperHeight} topper included: {M.combinedHeight} of natural fiber, with no foam, no latex and no chemical flame retardants.
        </p>

        <div className="choices" id={BUY_OPTIONS_ID}>
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
          <ShipsFast when="3–4 days" note={`Handmade to order in the USA. ${M.shipping}`} />
          {M.available ? (
            <>
              <button ref={buyRef} className="btn full" onClick={buyNow} disabled={buying}>{buying ? "Taking you to checkout\u2026" : `Buy now \u00b7 ${fmt(sz.price)}`}</button>
              <button className="btn full btn-ghost" onClick={add} disabled={buying}>Add to cart</button>
              {buyError && <p className="fine" role="alert" style={{ color: "var(--err, #b00)", textAlign: "center" }}>{buyError}</p>}
              <p className="fine buy-direct">Goes straight to secure checkout. Free delivery, {M.guaranteeNights}-night trial.</p>
              <BuyBoxEmail />
              <TrustRow items={[["hand", "Handmade to order"], ["truck", "Free delivery"], ["moon", `${M.guaranteeNights}-night trial`]]} />
              <StickyBuy
                watch={buyRef}
                photo={sel.photos[0]}
                name={M.title}
                summary={`${feelLabel} · ${sz.label} · ${sel.label}`}
                price={sz.price}
                note="Pay over time with Shop Pay Installments"
                cta="Buy now"
                onAdd={buyNow}
              />
            </>
          ) : (
            <button className="btn full" disabled aria-disabled="true">Coming soon</button>
          )}
          <div className="buy-promise">
            <p className="buy-promise-h">Sleep on it for {M.guaranteeNights} nights.</p>
            <p className="buy-promise-b">
              Give it at least {M.guaranteeMinNights} nights. If it isn&apos;t right by night {M.guaranteeNights}, we collect it for free and refund you in full.{" "}
              <Link href={GUARANTEE_PATH} className="ulink">How it works</Link>
            </p>
          </div>
          <ul className="buy-notes">
            <li>{M.warranty}.</li>
            <li>Pay over time with Shop Pay Installments at checkout, subject to approval.</li>
          </ul>
        </div>

        <Link href="/pages/bespoke#mattresses" className="ulink">Request a custom size</Link>
        <Link href={GUARANTEE_PATH} className="ulink">Guarantee &amp; warranty</Link>
        <div className="teaser-narrow"><DogBedTeaser /></div>
      </div>
    </section>
  );
}
