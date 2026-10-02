/**
 * POST /api/checkout
 *
 * Body: { lines: { productId: string; qty: number; options: [string, string][] }[] }
 *
 * Returns: { checkoutUrl: string }
 *
 * productId maps to our local product id (e.g. "marlowe"). We resolve it to the
 * correct Shopify variant via the Storefront API, encoding the selected options
 * as line item custom attributes so they're visible on the Shopify order.
 */

import { NextResponse } from "next/server";
import { createCheckout, fetchProductVariants } from "@/lib/shopify";

export type CheckoutRequestLine = {
  productId: string;
  qty: number;
  options: [string, string][];
};

/** Maps local product ids → Shopify product handles. */
const SHOPIFY_HANDLES: Record<string, string> = {
  "marlowe":          "the-marlowe-sofa",
  "marlowe-loveseat": "the-marlowe-loveseat",
  "chatsworth":       "the-chatsworth",
  "cotswold":         "the-cotswold",
  "burford":          "the-burford",
  "pembroke":         "the-pembroke",
  "cotswold-chair":   "the-cotswold-chair",
  "clifton":          "the-clifton",
  "marlowe-chair":    "the-marlowe-chair",
  "marlowe-ottoman":  "the-marlowe-ottoman",
};

export async function POST(req: Request) {
  try {
    const { lines } = (await req.json()) as { lines: CheckoutRequestLine[] };
    if (!lines?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    // Fetch all Shopify variants so we can match by product handle.
    // Ashwick products have a 1:1 product → "Default Title" variant structure on Shopify.
    const variants = await fetchProductVariants();

    const checkoutLines = lines.map((line) => {
      const handle = SHOPIFY_HANDLES[line.productId];
      if (!handle) throw new Error(`No Shopify handle mapped for product "${line.productId}"`);
      const variant = variants.find((v) => v.productHandle === handle);
      if (!variant) throw new Error(`No Shopify variant found for handle "${handle}"`);

      return {
        variantId: variant.variantId,
        quantity: line.qty,
        customAttributes: line.options.map(([key, value]) => ({ key, value })),
      };
    });

    const rawUrl = await createCheckout(checkoutLines);
    // Shopify returns the checkoutUrl using the store's custom domain (ashwickhome.com),
    // but Next.js intercepts /cart/... paths and 404s. Send the browser directly to
    // Shopify's own domain instead.
    const checkoutUrl = rawUrl.replace("https://ashwickhome.com", "https://1j0scj-ce.myshopify.com");
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
