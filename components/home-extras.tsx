import Link from "next/link";
import { CatalogCard } from "@/components/catalog-card";
import { Photo } from "@/components/photo";
import { Stars } from "@/components/reviews";
import { CATALOG } from "@/lib/catalog";
import { REVIEWS } from "@/lib/reviews";

const NAMES: Record<string, string> = { ashbury: "The Ashbury", "ashbury-dog-bed": "The Ashbury Dog Bed", nook: "The Nook Dog Bed" };

/** "Complete the bed": the other things people add to a mattress or a pillow. `skip` is the product you're already on. */
export function CompleteTheBed({ skip }: { skip: string }) {
  const ids = ["sleep-suite", "natural-mattress", "pillow", "ashbury-dog-bed"].filter((i) => i !== skip);
  const items = ids.map((id) => CATALOG.find((c) => c.id === id)).filter(Boolean).slice(0, 3) as typeof CATALOG;
  return (
    <section className="sec cbed">
      <div className="wrap">
        <div className="split-head">
          <div>
            <div className="eyebrow">Complete the bed</div>
            <h2 className="h2">Made to go together.</h2>
          </div>
          <Link href="/collections/bedroom" className="ulink">Shop bedroom →</Link>
        </div>
        <div className="cc-grid cbed-grid">{items.map((it) => <CatalogCard key={it.id} item={it} />)}</div>
      </div>
    </section>
  );
}

/** Real customer reviews, swipeable on a phone and three across on desktop, with the product named. */
/** Off until Tessa's verified reviews are in (the entries in lib/reviews.ts are not marked verified). */
export const REVIEWS_ROW = false;
export function ReviewsRow() {
  if (!REVIEWS_ROW) return null;
  const items = [...REVIEWS].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).slice(0, 6);
  if (!items.length) return null;
  return (
    <section className="sec linen rvrow">
      <div className="wrap">
        <div className="center-head">
          <div className="eyebrow">What customers say</div>
          <h2 className="h2">In their words.</h2>
        </div>
        <ul className="rail rvrow-list">
          {items.map((r) => (
            <li key={r.author + r.product} className="rvrow-card">
              <Stars rating={r.rating} />
              <p className="rvrow-body">&ldquo;{r.body}&rdquo;</p>
              <p className="rvrow-by">{r.author} · {NAMES[r.product] ?? r.product}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** "From our farm" band. Off until the farm photos and copy are in (FARM_BAND = true to show a labeled placeholder). */
export const FARM_BAND = false;
export function FarmBand() {
  if (!FARM_BAND) return null;
  return (
    <section className="sec farm-band">
      <div className="wrap">
        <div className="eyebrow">From our farm</div>
        <div className="farm-ph" role="img" aria-label="Photography placeholder: from our farm">Photography · From our farm</div>
      </div>
    </section>
  );
}

const INSIDE: Record<string, { photo: "pillow-inside-latex" | "pillow-inside-horsehair" | "pillow-inside-cotton"; alt: string }> = {
  "living-wool-latex": { photo: "pillow-inside-latex", alt: "A block of organic latex on a travertine ledge, with a sprig of leaves" },
  "living-wool-horse-hair": { photo: "pillow-inside-horsehair", alt: "Horsehair fill in a dark leather-handled basket" },
  "organic-cotton": { photo: "pillow-inside-cotton", alt: "Organic cotton bolls on a folded cotton cloth" },
};

/** What's inside a pillow: its own fill photo, then the washable cover (shared by all three). */
export function PillowInside({ fillId }: { fillId: string }) {
  const fill = INSIDE[fillId];
  if (!fill) return null;
  return (
    <section className="sec pinside">
      <div className="wrap">
        <div className="eyebrow">What&rsquo;s inside</div>
        <div className="pinside-grid">
          <div className="pinside-img"><Photo src={fill.photo} label={fill.alt} fill sizes="(max-width: 640px) 100vw, 420px" /></div>
          <div className="pinside-img"><Photo src="pillow-inside-cover" label="A folded organic cotton pillow cover with an Ashwick Home label" fill sizes="(max-width: 640px) 100vw, 420px" /></div>
        </div>
      </div>
    </section>
  );
}
