/**
 * POST /api/checkout
 *
 * Body: { lines: { productId: string; qty: number; options: [string, string][] }[], giftCover?: string,
 *         attribution?: { key, value }[] (where the shopper came from, lib/attribution.ts; saved on the order),
 *         gift?: { message?: string } ("This is a gift" in the cart: becomes the order note) }
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
import { getPriceOnRequestIds } from "@/lib/price-on-request";
import { GIFT, SALE, defaultGiftCover, giftActive, giftCounts, giftOptions, isGiftCover } from "@/lib/sale";
import { PILLOW_ID } from "@/lib/pillow";
import { cleanAttribution } from "@/lib/attribution";

export type { CheckoutRequestLine };

export async function POST(req: Request) {
  try {
    const { lines, giftCover, attribution, gift } = (await req.json()) as { lines: CheckoutRequestLine[]; giftCover?: string; attribution?: unknown; gift?: { message?: unknown } };
    if (!lines?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    const [variants, por] = await Promise.all([fetchProductVariants(), getPriceOnRequestIds()]);
    const skipped: number[] = [];
    /** What the order's qualifying products cost after the sale (pillows and the bedding set left out): the weekend gift's threshold. */
    let giftBasis = 0;
    const checkoutLines = lines.flatMap((line, i) => {
      try {
        // Pieces priced upon request can't be checked out (an old saved cart may still hold one).
        if (por.includes(line.productId)) throw new Error(`"${line.productId}" is priced upon request`);
        const v = variantForLine(variants, line);
        if (giftCounts(line.productId)) giftBasis += v.price * line.qty * (SALE.active ? (100 - SALE.percent) / 100 : 1);
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

    // Black Friday: two free organic pillows on qualifying orders, in the cover the shopper picked (or the one matching their
    // mattress, e.g. from Buy now). Shopify's automatic discount makes them $0.
    // If the pillow can't be matched, checkout goes ahead without it rather than failing.
    if (giftActive() && giftBasis >= GIFT.threshold) {
      try {
        const g = variantForLine(variants, { productId: PILLOW_ID, qty: GIFT.qty, options: giftOptions(isGiftCover(giftCover) ? giftCover : defaultGiftCover(lines)) });
        checkoutLines.push({ variantId: g.variantId, quantity: GIFT.qty, customAttributes: [GIFT.attribute] });
      } catch (err) {
        console.error("[/api/checkout] gift pillow not added", err instanceof Error ? err.message : err);
      }
    }

    // Where the shopper came from goes on the order; if Shopify ever refuses it, check out without it rather than fail.
    const attrs = cleanAttribution(attribution);
    // "This is a gift" in the cart: the order's note, so whoever packs it sees the message (and the _Gift order flag).
    const giftMsg = gift ? (typeof gift.message === "string" ? gift.message.replace(/\s+/g, " ").trim().slice(0, 300) : "") : null;
    if (giftMsg != null) attrs.push({ key: "_Gift order", value: "Yes" });
    const note = giftMsg != null ? (giftMsg ? `GIFT. Message to include: "${giftMsg}"` : "GIFT (no message).") : undefined;
    const rawUrl = await createCheckout(checkoutLines, attrs, note).catch((err) => {
      if (!attrs.length && !note) throw err;
      console.error("[/api/checkout] attributes or note refused, retrying without", err instanceof Error ? err.message : err);
      return createCheckout(checkoutLines);
    });
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
