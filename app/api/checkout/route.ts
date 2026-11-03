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
import { DOG_BED_ID, NOOK } from "@/lib/dog-bed";
import { BUNDLE_CONFIG } from "@/lib/sale";
import { PILLOW_ID } from "@/lib/pillow";

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
/** The bundle's mattress: a separate Shopify product (same sizes, colors and prices) on the free white glove delivery profile. */
const BUNDLE_MATTRESS_HANDLE = "the-ashbury-best-friends";
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

const norm = (s: string) => s.trim().toLowerCase().replace(/horse\s*hair/g, "horsehair");

/**
 * The Ashbury has a Shopify variant per size (and per feel and color, if those are variant options too). Pick the
 * variant whose every option is one we chose, never a different size, so Shopify charges the right price.
 */
function mattressVariant(variants: ShopifyVariant[], options: [string, string][], bundle = false) {
  const opt = (k: string) => options.find(([key]) => key === k)?.[1] ?? "";
  const size = MATTRESS.sizes.find((z) => opt("Size").startsWith(`${z.label} (`));
  const color = MATTRESS.colors.find((c) => c.label === opt("Color"));
  if (!size) throw new Error(`Unknown mattress size "${opt("Size")}"`);
  const sizeNames = [size.label, ...(ALIASES[size.id] ?? [])].map(norm);
  const wanted = new Set([...sizeNames, norm(opt("Feel")), ...(color ? [color.label, ...(ALIASES[color.id] ?? [])].map(norm) : [])]);

  // Bundle mattresses are a separate Shopify product (same sizes/prices) whose delivery profile has free white
  // glove; standalone mattresses keep the paid white glove. Fail loudly rather than fall back to the paid product.
  const handle = bundle
    ? BUNDLE_MATTRESS_HANDLE
    : MATTRESS_HANDLES.find((h) => variants.some((v) => v.productHandle === h)) ?? variants.find(isMattress)?.productHandle;
  if (bundle && !variants.some((v) => v.productHandle === handle)) {
    throw new Error(`The Best Friends Bundle can't be checked out yet: the bundle mattress product (${handle}) isn't published to the website's sales channel in Shopify.`);
  }
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

/**
 * The dog bed has a Shopify variant per size and color, titled e.g. "Small (20" × 26") / Flax". Matched on the size
 * name and color only, so the measurements in brackets can be written either way in Shopify (or left out).
 */
function dogBedVariant(variants: ShopifyVariant[], options: [string, string][], handle = "ashbury-dog-bed") {
  const sizeName = (s: string) => norm(s.replace(/\(.*?\)/g, ""));
  const opt = (k: string) => options.find(([key]) => key === k)?.[1] ?? "";
  const wanted = `${sizeName(opt("Size"))} / ${norm(opt("Color"))}`;
  const match = variants.find((v) => {
    if (v.productHandle !== handle) return false;
    const [size = "", color = ""] = v.title.split(" / ");
    return `${sizeName(size)} / ${norm(color)}` === wanted;
  });
  if (!match) throw new Error(`No Shopify option for the dog bed (${handle}) in ${options.map(([, v]) => v).join(" / ")}`);
  return match;
}

/**
 * The Best Friends Bedding Set has one Shopify variant per mattress size / pillow / cover color, titled e.g.
 * "Queen / Living Wool / Sorrel". Matched on all three by title. While the product is a draft or not on the Storefront
 * channel it is not in `variants`, and we fail with a clear message rather than drop the line (wrong total).
 */
function beddingSetVariant(variants: ShopifyVariant[], options: [string, string][]) {
  const handle = BUNDLE_CONFIG.beddingSet.handle;
  const opt = (k: string) => options.find(([key]) => key === k)?.[1] ?? "";
  const size = opt("Mattress size"), pillow = opt("Pillow"), color = opt("Cover color");
  const mine = variants.filter((v) => v.productHandle === handle);
  if (!mine.length) {
    throw new Error(
      `The Best Friends Bundle can't be checked out yet: the "${BUNDLE_CONFIG.beddingSet.name}" product (${handle}) isn't Active and published to the website's sales channel in Shopify.`,
    );
  }
  const sizeNames = [size, ...(size === "King" ? ["Eastern King"] : []), ...(size === "Cal King" ? ["California King"] : [])].map(norm);
  const match = mine.find((v) => {
    const [s = "", p = "", c = ""] = v.title.split(" / ").map(norm);
    return v.title.split(" / ").length === 3 && sizeNames.includes(s) && p === norm(pillow) && c === norm(color);
  });
  if (!match) {
    throw new Error(`No "${BUNDLE_CONFIG.beddingSet.name}" variant for ${size} / ${pillow} / ${color} (Shopify has: ${mine.map((v) => v.title).slice(0, 8).join("; ")}${mine.length > 8 ? "; …" : ""})`);
  }
  return match;
}

/**
 * The standalone pillow has one Shopify variant per Fill / Size / Cover color, titled e.g.
 * "Kapok / Queen 20x30 / Sorrel". Matched on all three by title. While the product is a draft or unpublished it is
 * not in `variants`, and we fail with a clear message rather than drop the line (wrong total).
 */
function pillowVariant(variants: ShopifyVariant[], options: [string, string][]) {
  const opt = (k: string) => options.find(([key]) => key === k)?.[1] ?? "";
  const fill = opt("Fill"), size = opt("Size"), color = opt("Cover color");
  const mine = variants.filter((v) => v.productHandle === PILLOW_ID);
  if (!mine.length) {
    throw new Error(`The Ashwick Pillow can't be checked out yet: the product (${PILLOW_ID}) isn't Active and published to the website's sales channel in Shopify.`);
  }
  const match = mine.find((v) => {
    const parts = v.title.split(" / ").map(norm);
    return parts.length === 3 && parts[0] === norm(fill) && parts[1] === norm(size) && parts[2] === norm(color);
  });
  if (!match) {
    throw new Error(`No Ashwick Pillow variant for ${fill} / ${size} / ${color} (Shopify has: ${mine.map((v) => v.title).slice(0, 8).join("; ")}${mine.length > 8 ? "; …" : ""})`);
  }
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
      if (line.productId === BUNDLE_CONFIG.beddingSet.handle) {
        return {
          variantId: beddingSetVariant(variants, line.options).variantId,
          quantity: line.qty,
          customAttributes: line.options.map(([key, value]) => ({ key, value })),
        };
      }
      if (line.productId === PILLOW_ID) {
        return {
          variantId: pillowVariant(variants, line.options).variantId,
          quantity: line.qty,
          customAttributes: line.options.map(([key, value]) => ({ key, value })),
        };
      }
      if (line.productId === MATTRESS.id) {
        const inBundle = line.options.some(([k]) => k === "_Bundle");
        return {
          variantId: mattressVariant(variants, line.options, inBundle).variantId,
          quantity: line.qty,
          customAttributes: line.options.map(([key, value]) => ({ key, value })),
        };
      }
      if (line.productId === NOOK.id) {
        return {
          variantId: dogBedVariant(variants, line.options, "nook-dog-bed").variantId,
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
