import { SALE, salePrice } from "@/lib/sale";
import { fmt } from "@/lib/products";

/** Whole dollars, rounded down ($103, not $103.20): for cards and banners. Exact cents stay in the cart and checkout. */
export const fmtWhole = (n: number) => "$" + Math.floor(n + 1e-9).toLocaleString("en-US");

/**
 * A price: the sale price, then the original struck through, while the sale is on ("$4,000 $5,000"); otherwise just
 * the price. `whole` rounds down to dollars (cards and banners).
 */
export function Price({ price, from, was = true, whole }: { price: number; from?: boolean; was?: boolean; whole?: boolean }) {
  const f = whole ? fmtWhole : fmt;
  if (!SALE.active) return <>{from ? "From " : ""}{f(price)}</>;
  return (
    <>
      {from ? "From " : ""}
      <span className="price-now" aria-label={`Sale price ${f(salePrice(price))}`}>{f(salePrice(price))}</span>
      {was && <> <s className="price-was" aria-label={`Original price ${f(price)}`}>{f(price)}</s></>}
    </>
  );
}

/** "20% off" tag, shown over a card photo. Renders nothing when the sale is off. */
export function SaleTag({ className = "" }: { className?: string }) {
  if (!SALE.active) return null;
  return <span className={("sale-tag " + className).trim()}>{SALE.percent}% off</span>;
}

/** The one-line explanation under a sale price on product pages. */
export function SaleNote() {
  if (!SALE.active) return null;
  return (
    <p className="fine sale-note">
      {SALE.name}: {SALE.percent}% off, applied automatically at checkout.
    </p>
  );
}
