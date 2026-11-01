/**
 * The Ashwick Pillow (standalone). Shopify product `ashwick-pillow`: options Fill / Size / Cover color, flat price per
 * fill across sizes. NOT linked from navigation or collections until the owner approves; the direct URL works.
 * A removable cover in the mattress colors always comes with every pillow.
 */
export const PILLOW_PATH = "/products/ashwick-pillow";
/** Cart / checkout product id and Shopify handle. */
export const PILLOW_ID = "ashwick-pillow";

/** The four approved fills (Shopify option values, also the bedding set's Pillow values). One factual line each. */
export const PILLOW_TYPES = [
  { id: "living-wool-latex", label: "Living Wool + Organic Latex", price: 269, desc: "Living Wool with an organic latex core. Removable cover in your mattress color. Handmade." },
  { id: "living-wool-horse-hair", label: "Living Wool + Horse Hair", price: 269, desc: "Living Wool with horse hair. Removable cover in your mattress color. Handmade." },
  { id: "kapok", label: "Kapok", price: 229, desc: "Kapok fill. Removable cover in your mattress color. Handmade." },
  { id: "organic-cotton", label: "100% Organic Cotton", price: 199, desc: "Organic cotton fill. Removable cover in your mattress color. Handmade." },
] as const;

export const PILLOW_SIZES = [
  { id: "standard", label: "Standard 20x26" },
  { id: "queen", label: "Queen 20x30" },
  { id: "king", label: "King 20x36" },
] as const;

/** Cover colors are the mattress colors (Shopify option "Cover color"). Swatches are the Ashbury's. */
export const PILLOW_COVERS = [
  { id: "natural", label: "Fleece", swatch: "mattress-swatch-natural" },
  { id: "dove", label: "Flint", swatch: "mattress-swatch-dove" },
  { id: "safari", label: "Flax", swatch: "mattress-swatch-safari" },
  { id: "mocha", label: "Sorrel", swatch: "mattress-swatch-mocha" },
] as const;
