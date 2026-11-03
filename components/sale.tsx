import { SALE, salePrice } from "@/lib/sale";
import { fmt } from "@/lib/products";

/** A price: the sale price with the original struck through while the sale is on, otherwise just the price. */
export function Price({ price, from, was = true }: { price: number; from?: boolean; was?: boolean }) {
  if (!SALE.active) return <>{from ? "From " : ""}{fmt(price)}</>;
  return (
    <>
      {from ? "From " : ""}
      {was && <s className="price-was" aria-label={`Original price ${fmt(price)}`}>{fmt(price)}</s>}
      <span className="price-now" aria-label={`Sale price ${fmt(salePrice(price))}`}>{fmt(salePrice(price))}</span>
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
