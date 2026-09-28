// Catalogue data. Shaped so it can later be swapped for the Shopify Storefront
// API (handles = product ids, collections = categories).
import type { PhotoKey } from "@/lib/photos";

export type FabricId = "linen" | "boucle" | "wool" | "leather";
export type Category = "sofas" | "chairs";
export type CollectionHandle = "all" | Category;

export type Fabric = { id: FabricId; label: string; swatch: string; tex: string };
export type Option = { id: string; label: string };

export const FABRICS: Record<FabricId, Fabric> = {
  linen: { id: "linen", label: "Organic linen", swatch: "#DDD3BE", tex: "linen" },
  boucle: { id: "boucle", label: "Organic wool bouclé", swatch: "#ECE5D8", tex: "boucle" },
  wool: { id: "wool", label: "Brushed organic wool", swatch: "#B8AB96", tex: "wool" },
  leather: { id: "leather", label: "Vegetable-tanned leather", swatch: "#A36A40", tex: "leather" },
};
export const SWATCH_ORDER: FabricId[] = ["linen", "boucle", "wool", "leather"];

export const DEPTHS: Option[] = [
  { id: "standard", label: "Standard" },
  { id: "deep", label: "Deep" },
];
export const LENGTHS: Option[] = [
  { id: "standard", label: "Standard" },
  { id: "long", label: "Long" },
];
export const FINISHES: Option[] = [
  { id: "natural", label: "Natural" },
  { id: "warm", label: "Warm" },
  { id: "deep", label: "Deep" },
];

export type Product = {
  id: string;
  name: string;
  type: "Sofa" | "Chair";
  category: Category;
  price: number;
  priceFrom?: boolean;
  line: string;
  /** First photo leads the gallery and is the card image unless cardPhoto is set. */
  photos: PhotoKey[];
  /** Square version of the first photo for cards and the cart, when the original is too wide to crop. */
  cardPhoto?: PhotoKey;
  /** Don't crossfade to the second photo on card hover. */
  cardSingle?: boolean;
  fabrics: FabricId[];
  designedFabric: FabricId;
  depth: boolean;
  length: boolean;
  finish: boolean;
  materials: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "marlowe", name: "The Marlowe", type: "Sofa", category: "sofas", price: 8500,
    line: "A deep, plush sofa on a hand-fluted solid oak plinth, in brushed organic wool.",
    photos: ["marlowe-studio", "marlowe-1", "marlowe-2"], cardSingle: true,
    fabrics: ["wool", "boucle", "linen"], designedFabric: "wool", depth: true, length: true, finish: true,
    materials: "Solid oak plinth, hand-fluted · Brushed organic wool · Organic wool and kapok fill · Natural oil finish",
  },
  {
    id: "chatsworth", name: "The Chatsworth", type: "Sofa", category: "sofas", price: 10500,
    line: "A sculptural curved sofa in ivory organic wool bouclé.",
    photos: ["chatsworth-s1"],
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Ivory organic wool bouclé · Organic wool and kapok fill",
  },
  {
    id: "cotswold", name: "The Cotswold", type: "Sofa", category: "sofas", price: 8500, priceFrom: true,
    line: "A deep, curved modular sofa in ivory organic wool bouclé, with a chaise.",
    photos: ["csofa-hero", "csofa-studio", "csofa-b", "csofa-c", "csofa-a", "cchair-c", "csofa-d"], cardSingle: true,
    cardPhoto: "csofa-hero-square",
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Ivory organic wool bouclé · Organic wool and kapok fill · Modular sections with chaise",
  },
  {
    id: "burford", name: "The Burford", type: "Sofa", category: "sofas", price: 6500, priceFrom: true,
    line: "A deep, slipcovered sofa in natural organic linen, with a tailored skirt.",
    photos: ["burford-hero", "burford-1", "burford-2", "burford-3"],
    fabrics: ["linen", "wool", "boucle"], designedFabric: "linen", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Removable organic linen slipcover · Organic wool and kapok fill",
  },
  {
    id: "pembroke", name: "The Pembroke", type: "Chair", category: "chairs", price: 5000,
    line: "A sculptural wingback lounge chair in warm organic wool bouclé, no visible legs.",
    photos: ["pembroke-1", "pembroke-2"], cardSingle: true,
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: false, finish: false,
    materials: "Solid hardwood frame · Warm organic wool bouclé · Organic wool and kapok fill",
  },
  {
    id: "cotswold-chair", name: "The Cotswold Chair", type: "Chair", category: "chairs", price: 4000,
    line: "A deep, rounded lounge chair in organic wool bouclé, made to sit beside the Cotswold sofa.",
    photos: ["cchair-studio", "cchair-c"], cardSingle: true,
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: false, finish: false,
    materials: "Solid hardwood frame · Organic wool bouclé · Organic wool and kapok fill",
  },
  {
    id: "clifton", name: "The Clifton", type: "Chair", category: "chairs", price: 5500,
    line: "A rounded swivel lounge chair in textured ivory weave, with an olive back, a stitched leather band and a walnut base.",
    photos: ["clifton-s1", "clifton-s2"],
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: false, finish: true,
    materials: "Solid walnut swivel base · Textured organic wool weave · Stitched vegetable-tanned leather band · Organic wool and kapok fill",
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const COLLECTIONS: Record<CollectionHandle, { title: string; description: string }> = {
  all: { title: "The collection", description: "Four sofas and three chairs. Order each as we designed it, or make it yours." },
  sofas: { title: "Sofas", description: "Four sofas, each made to order by hand." },
  chairs: { title: "Chairs", description: "Three chairs, each made to order by hand." },
};

export const productsIn = (handle: CollectionHandle) =>
  handle === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === handle);

/** Three more pieces, same category first. */
export const relatedTo = (p: Product) =>
  PRODUCTS.filter((o) => o.id !== p.id && o.category === p.category)
    .concat(PRODUCTS.filter((o) => o.category !== p.category))
    .slice(0, 3);

export const fmt = (n: number | null) => (n == null ? "[PRICE]" : "$" + n.toLocaleString("en-US"));

export const MATERIALS: [string, string][] = [
  ["Solid hardwood", "Frames built to hold for generations."],
  ["Organic wool", "Natural loft and resilience in every cushion."],
  ["Organic linen", "Breathable, and softer with every year."],
  ["Kapok", "A light, plant-based fill in place of foam."],
  ["Natural oils", "Plant-based finishes for the wood."],
];
