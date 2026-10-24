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
import { createCheckout, fetchProductVariants, type ShopifyVariant } from "@/lib/shopify";
import { MATTRESS } from "@/lib/mattress";
import { DOG_BED_ID } from "@/lib/dog-bed";

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

/** The Ashbury's likely Shopify handles; failing those, any product titled or typed as the Ashbury or a mattress. */
const MATTRESS_HANDLES = ["luxury-organic-mattress", MATTRESS.handle, "the-ashbury"];
const isMattress = (v: ShopifyVariant) => /ashbury|mattress/i.test(`${v.productHandle} ${v.productTitle} ${v.productType}`);

/** Names a Shopify variant option may use for a size or color, besides our current label. */
const ALIASES: Record<string, string[]> = {
  "eastern-king": ["Eastern King"],
  "cal-king": ["California King"],
  natural: ["Natural"],
  dove: ["Morning Dove", "Dove"],
  khaki: ["Khaki"],
  safari: ["Hazel", "Safari"],
  mocha: ["Mocha Mousse", "Mocha"],
};

const norm = (s: string) => s.trim().toLowerCase();

/**
 * The Ashbury has a Shopify variant per size (and per feel and color, if those are variant options too). Pick the
 * variant whose every option is one we chose, never a different size, so Shopify charges the right price.
 */
function mattressVariant(variants: ShopifyVariant[], options: [string, string][]) {
  const opt = (k: string) => options.find(([key]) => key === k)?.[1] ?? "";
  const size = MATTRESS.sizes.find((z) => opt("Size").startsWith(`${z.label} (`));
  const color = MATTRESS.colors.find((c) => c.label === opt("Color"));
  if (!size) throw new Error(`Unknown mattress size "${opt("Size")}"`);
  const sizeNames = [size.label, ...(ALIASES[size.id] ?? [])].map(norm);
  const wanted = new Set([...sizeNames, norm(opt("Feel")), ...(color ? [color.label, ...(ALIASES[color.id] ?? [])].map(norm) : [])]);

  const handle =
    MATTRESS_HANDLES.find((h) => variants.some((v) => v.productHandle === h)) ?? variants.find(isMattress)?.productHandle;
  if (!handle) {
    throw new Error(
      "The mattress isn't available to the website yet: in Shopify, make it available on the sales channel the website uses (the same one as the sofas).",
    );
  }
  const match = variants
    .filter((v) => v.productHandle === handle)
    .map((v) => ({ v, parts: v.title.split(" / ").map(norm) }))
    .filter(({ parts }) => parts.some((p) => sizeNames.includes(p)) && parts.every((p) => wanted.has(p)))
    .sort((a, b) => b.parts.length - a.parts.length)[0];
  if (!match) {
    const seen = [...new Set(variants.filter((v) => v.productHandle === handle).map((v) => v.title))].slice(0, 8).join("; ");
    throw new Error(`No Shopify option for the mattress in ${options.map(([, v]) => v).join(" / ")} (Shopify has: ${seen})`);
  }
  return match.v;
}

/** The dog bed has a Shopify variant per size and color, titled "Medium (30" × 20") / Flax". */
function dogBedVariant(variants: ShopifyVariant[], options: [string, string][]) {
  const opt = (k: string) => norm(options.find(([key]) => key === k)?.[1] ?? "");
  const wanted = `${opt("Size")} / ${opt("Color")}`;
  const match = variants.find((v) => v.productHandle === "ashbury-dog-bed" && norm(v.title) === wanted);
  if (!match) throw new Error(`No Shopify option for the dog bed in ${options.map(([, v]) => v).join(" / ")}`);
  return match;
}

export async function POST(req: Request) {
  try {
    const { lines } = (await req.json()) as { lines: CheckoutRequestLine[] };
    if (!lines?.length) return NextResponse.json({ error: "Empty cart" }, { status: 400 });

    // Fetch all Shopify variants so we can match by product handle.
    // Ashwick products have a 1:1 product → "Default Title" variant structure on Shopify.
    const variants = await fetchProductVariants();

    const checkoutLines = lines.map((line) => {
      if (line.productId === MATTRESS.id) {
        return {
          variantId: mattressVariant(variants, line.options).variantId,
          quantity: line.qty,
          customAttributes: line.options.map(([key, value]) => ({ key, value })),
        };
      }
      if (line.productId === DOG_BED_ID) {
        return {
          variantId: dogBedVariant(variants, line.options).variantId,
          quantity: line.qty,
          customAttributes: line.options.map(([key, value]) => ({ key, value })),
        };
      }
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
