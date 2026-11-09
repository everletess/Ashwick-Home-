/**
 * POST /api/checkout
 *
 * Body: { lines: { productId: string; qty: number; options: [string, string][] }[] }
 *
 * Returns: { checkoutUrl: string, skipped: number[] }
 *
 * Each line is matched to its Shopify variant (lib/checkout-match.ts), with the selected options as line item custom
 * attributes so they're visible on the Shopify order. A line with no current variant (an old cart's retired size, say)
 * is left out and reported in `skipped` (its index), so one bad line never blocks checkout; the cart removes it and
 * tells the shopper. Only a cart with nothing checkout-able fails.
 */

import { NextResponse } from "next/server";
import { createCheckout, fetchProductVariants } from "@/lib/shopify";
import { variantForLine, type CheckoutRequestLine } from "@/lib/checkout-match";

export type { CheckoutRequestLine };

export async function POST(req: Request) {
  try {
    const { lines } = (await req.json()) as { lines: CheckoutRequestLine[] };
    if (!lines?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    const variants = await fetchProductVariants();
    const skipped: number[] = [];
    const checkoutLines = lines.flatMap((line, i) => {
      try {
        const v = variantForLine(variants, line);
        return [{ variantId: v.variantId, quantity: line.qty, customAttributes: line.options.map(([key, value]) => ({ key, value })) }];
      } catch (err) {
        console.error("[/api/checkout] skipped line", i, err instanceof Error ? err.message : err);
        skipped.push(i);
        return [];
      }
    });
    if (!checkoutLines.length) {
      return NextResponse.json({ error: "The items in your cart are no longer available in those options. Please choose again.", skipped }, { status: 409 });
    }

    const rawUrl = await createCheckout(checkoutLines);
    // Shopify returns the checkoutUrl using the store's custom domain (ashwickhome.com),
    // but Next.js intercepts /cart/... paths. Send the browser directly to Shopify's own domain instead.
    const checkoutUrl = rawUrl.replace("https://ashwickhome.com", "https://1j0scj-ce.myshopify.com");
    return NextResponse.json({ checkoutUrl, skipped });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
