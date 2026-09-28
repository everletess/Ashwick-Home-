import Link from "next/link";
import { Photo } from "@/components/photo";
import { MATERIALS, fmt, type Product } from "@/lib/products";

const CARD_SIZES = "(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 460px";

export function ProductCard({ p, custom }: { p: Product; custom?: boolean }) {
  return (
    <Link href={"/products/" + p.id + (custom ? "/customize" : "")} className="card">
      <div className="card-img">
        <Photo src={p.photos[0]} label={p.name} fill sizes={CARD_SIZES} />
        {p.photos[1] && !p.cardSingle && <Photo src={p.photos[1]} label={p.name} className="alt" fill sizes={CARD_SIZES} />}
        <span className="card-cta">{custom ? "Customize" : "Shop now"}</span>
      </div>
      <div className="card-row">
        <span className="card-name">{p.name}</span>
        <span className="card-price">{p.priceFrom ? "From " : ""}{fmt(p.price)}</span>
      </div>
      <p className="card-line">{p.line}</p>
      <div className="card-meta">{p.type} · Made to order · Customizable</div>
    </Link>
  );
}

export function ProductGrid({ products, custom }: { products: Product[]; custom?: boolean }) {
  return (
    <div className="grid3">
      {products.map((p) => <ProductCard key={p.id} p={p} custom={custom} />)}
    </div>
  );
}

export function MaterialsBlock({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && (
        <div className="center-head">
          <div className="eyebrow">What goes into it</div>
          <h2 className="h2">Materials you&apos;d recognize.</h2>
        </div>
      )}
      <div className="mat-grid">
        {MATERIALS.map(([t, d]) => (
          <div className="mat" key={t}>
            <div className="mat-t">{t}</div>
            <p className="mat-d">{d}</p>
          </div>
        ))}
      </div>
      <p className="closing">Nothing synthetic. No foam, no chemical flame retardants, no plastic.</p>
    </>
  );
}

export function MadeByHand() {
  const steps: [string, string][] = [
    ["The frame", "Cut and joined by hand."],
    ["The fill", "Layered by hand."],
    ["The cover", "Fitted and stitched by hand."],
  ];
  return (
    <section className="sec">
      <div className="wrap made">
        <Photo src="frame-fill-cover" label="The frame, the fill, the cover" className="made-img" sizes="(max-width: 960px) 100vw, 50vw" />
        <div>
          <div className="eyebrow">Made by hand, in the USA</div>
          <h2 className="h2">Started when you order it. Finished for your home.</h2>
          <p className="body" style={{ marginTop: 28 }}>
            Every piece is built to order by skilled craftspeople in our American workshop. Nothing sits in a warehouse.
          </p>
          <div className="steps">
            {steps.map(([t, d], i) => (
              <div className="step" key={t}>
                <span className="step-n">0{i + 1}</span>
                <div>
                  <div className="step-t">{t}</div>
                  <div className="step-d">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Short full-bleed photo header used by Design your own and Trade. */
export function PageHero({ photo, alt, eyebrow, title, body, children }: {
  photo: Parameters<typeof Photo>[0]["src"];
  alt: string;
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="hero hero-sm">
      <Photo src={photo} label={alt} fill preload />
      <div className="hero-scrim"></div>
      <div className="hero-txt">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h1">{title}</h1>
        <p className="hero-body">{body}</p>
        {children}
      </div>
    </section>
  );
}
