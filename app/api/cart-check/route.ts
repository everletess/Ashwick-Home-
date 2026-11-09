/**
 * POST /api/cart-check: which cart lines still have a current Shopify variant.
 *
 * Body: { lines: CheckoutRequestLine[] }. Returns { bad: number[] } (indexes of lines with no variant). The cart calls
 * this once when it loads, removes those lines and tells the shopper; if Shopify can't be reached it returns
 * { bad: [] } and leaves the cart alone (checkout still skips a bad line).
 */
import { NextResponse } from "next/server";
import { fetchProductVariants } from "@/lib/shopify";
import { variantForLine, type CheckoutRequestLine } from "@/lib/checkout-match";

export async function POST(req: Request) {
  let lines: CheckoutRequestLine[] = [];
  try {
    lines = ((await req.json()) as { lines: CheckoutRequestLine[] }).lines ?? [];
  } catch {
    return NextResponse.json({ bad: [] }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > 50) return NextResponse.json({ bad: [] });
  try {
    const variants = await fetchProductVariants();
    const bad = lines.flatMap((l, i) => {
      try {
        variantForLine(variants, l);
        return [];
      } catch {
        return [i];
      }
    });
    return NextResponse.json({ bad });
  } catch {
    return NextResponse.json({ bad: [] });
  }
}
