// Catalogue data. Shaped so it can later be swapped for the Shopify Storefront
// API (handles = product ids, collections = categories).
import type { PhotoKey } from "@/lib/photos";

export type FabricId = "linen" | "boucle" | "wool" | "leather" | "italian" | "blend" | "cotton";
export type Category = "sofas" | "chairs";
export type CollectionHandle = "all" | Category;

export type FabricColor = { id: string; label: string; code: string; swatch: string };
export type Fabric = {
  id: FabricId;
  label: string;
  swatch: string;
  tex: string;
  /** Composition / mill line shown under the fabric picker. */
  detail?: string;
  /** Colorways; the first is the default. */
  colors?: FabricColor[];
};
export type Option = { id: string; label: string };

export const FABRICS: Record<FabricId, Fabric> = {
  linen: { id: "linen", label: "Organic linen", swatch: "#DDD3BE", tex: "linen" },
  boucle: { id: "boucle", label: "Organic wool bouclé", swatch: "#ECE5D8", tex: "boucle" },
  wool: { id: "wool", label: "Brushed organic wool", swatch: "#B8AB96", tex: "wool" },
  leather: { id: "leather", label: "Vegetable-tanned leather", swatch: "#A36A40", tex: "leather" },
  italian: {
    id: "italian", label: "Italian Linen", swatch: "#B9AD94", tex: "linen",
    detail: "Washed wool and linen blend: 51% linen, 49% wool.",
    colors: [
      { id: "coco", label: "Coco", code: "FAQ559 0007", swatch: "#B5A88D" },
      { id: "moss", label: "Moss", code: "FAQ559 0001", swatch: "#5F6752" },
      { id: "ivory", label: "Ivory", code: "FAQ559 0005", swatch: "#D8D5CC" },
    ],
  },
  blend: {
    id: "blend", label: "Linen Blend", swatch: "#D9D1C2", tex: "linen",
    colors: [
      { id: "ivory", label: "Ivory", code: "FA6025", swatch: "#E2DCCF" },
      { id: "sand", label: "Sand", code: "FA6053", swatch: "#CDC3B1" },
      { id: "coco", label: "Coco", code: "FA6059", swatch: "#A5896A" },
      { id: "dove", label: "Dove", code: "FA6078", swatch: "#B8B3A9" },
    ],
  },
  cotton: {
    id: "cotton", label: "Organic Cotton", swatch: "#D6D2C4", tex: "linen",
    detail: "100% certified organic cotton.",
    colors: [
      { id: "cream", label: "Cream", code: "FA152", swatch: "#E4E0D6" },
      { id: "natural", label: "Natural", code: "FA151", swatch: "#C9C5B5" },
      { id: "khaki", label: "Khaki", code: "FA154", swatch: "#8D957F" },
    ],
  },
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
  /** Shown on the product page when set, e.g. pieces held ready to ship. */
  leadTime?: string;
  /** Price by fabric where it differs from the base price. */
  fabricPrices?: Partial<Record<FabricId, number>>;
  /** Caption under the main gallery image, e.g. a photo showing a custom fabric. */
  photoNotes?: Partial<Record<PhotoKey, string>>;
  /** Photo of the piece in each fabric color, keyed "fabric:color" (e.g. "blend:sand"). */
  colorPhotos?: Partial<Record<string, PhotoKey>>;
  /** Delivery charged per piece on top of the price. */
  delivery?: { label: string; price: number };
};

export const priceFor = (p: Product, fabric: FabricId) => p.fabricPrices?.[fabric] ?? p.price;

/** Lowest price, and whether to prefix it with "From" (several prices, or a "from" base price). */
export function cardPrice(p: Product) {
  const prices = p.fabrics.map((f) => priceFor(p, f));
  const min = Math.min(p.price, ...prices);
  return { price: min, from: !!p.priceFrom || prices.some((x) => x !== min) };
}

const WHITE_GLOVE = { label: "White glove delivery", price: 750 };

/** Construction spec from the workshop (Sue). Same for every sofa, and for every chair. */
export type Construction = { statement: string; intro: string; rows: [string, string][] };

const NO_PETROCHEMICALS = "No petrochemicals. No plastic polyurethane foams.";
const FOUNDATIONS = "Solid wood, coconut coir, organic natural latex, and wool.";
const VEGAN = "TENCEL\u2122 and cotton can replace the wool in the seats, backs and foundations.";

export function constructionFor(p: Product): Construction {
  const short = p.name.replace(/^The /, "");
  if (p.type === "Sofa") {
    return {
      statement: NO_PETROCHEMICALS,
      intro: `The ${short} is handcrafted using only organic and natural materials.`,
      rows: [
        ["Foundations", FOUNDATIONS],
        ["Seat cushions", "Organic latex wrapped in organic wool."],
        ["Back and side cushions", "Organic wool."],
        ["Vegan models available", VEGAN],
      ],
    };
  }
  return {
    statement: NO_PETROCHEMICALS,
    intro: `The ${short} is handcrafted using organic and natural materials.`,
    rows: [
      ["Foundations", FOUNDATIONS],
      ["Seat and back support", "Organic latex wrapped in organic wool."],
      ["Vegan models available", VEGAN],
    ],
  };
}

/** Every piece is made by hand to order. */
export const LEAD_TIME = "Handmade to order with a 3-week lead time, plus shipping.";

export const PRODUCTS: Product[] = [
  {
    id: "marlowe", name: "The Marlowe", type: "Sofa", category: "sofas", price: 8500,
    line: "A deep, plush sofa on a hand-fluted solid oak plinth, in brushed organic wool.",
    photos: ["marlowe-studio", "marlowe-1", "marlowe-2"], cardSingle: true,
    fabrics: ["wool", "boucle", "linen"], designedFabric: "wool", depth: true, length: true, finish: true,
    materials: "Solid oak plinth, hand-fluted · Brushed organic wool · Natural oil finish",
    delivery: WHITE_GLOVE,
  },
  {
    id: "chatsworth", name: "The Chatsworth", type: "Sofa", category: "sofas", price: 10500,
    line: "A sculptural curved sofa in ivory organic wool bouclé.",
    photos: ["chatsworth-s1"],
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Ivory organic wool bouclé",
    delivery: WHITE_GLOVE,
  },
  {
    id: "cotswold", name: "The Cotswold", type: "Sofa", category: "sofas", price: 8500, priceFrom: true,
    line: "A deep, curved modular sofa in ivory organic wool bouclé, with a chaise.",
    photos: ["csofa-hero", "csofa-studio", "csofa-b", "csofa-c", "csofa-a", "cchair-c", "csofa-d"], cardSingle: true,
    cardPhoto: "csofa-hero-square",
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Ivory organic wool bouclé · Modular sections with chaise",
    delivery: WHITE_GLOVE,
  },
  {
    id: "burford", name: "The Burford", type: "Sofa", category: "sofas", price: 6500, priceFrom: true,
    line: "A deep, slipcovered sofa in natural organic linen, with a tailored skirt.",
    photos: ["burford-hero", "burford-1", "burford-2", "burford-3"],
    fabrics: ["linen", "wool", "boucle"], designedFabric: "linen", depth: true, length: true, finish: false,
    materials: "Solid hardwood frame · Removable organic linen slipcover",
    delivery: WHITE_GLOVE,
  },
  {
    id: "pembroke", name: "The Pembroke", type: "Chair", category: "chairs", price: 5000,
    line: "A sculptural wingback lounge chair on a swivel base, in Linen Blend, Organic Cotton or Italian Linen.",
    photos: [
      "pembroke-blend-ivory", "pembroke-blend-sand", "pembroke-blend-coco",
      "pembroke-cotton-natural", "pembroke-cotton-khaki",
      "pembroke-italian-coco", "pembroke-italian-ivory", "pembroke-italian-moss",
      "pembroke-1", "pembroke-2",
    ],
    cardSingle: true,
    colorPhotos: {
      "blend:ivory": "pembroke-blend-ivory",
      "blend:sand": "pembroke-blend-sand",
      "blend:coco": "pembroke-blend-coco",
      "cotton:natural": "pembroke-cotton-natural",
      "cotton:khaki": "pembroke-cotton-khaki",
      "italian:coco": "pembroke-italian-coco",
      "italian:ivory": "pembroke-italian-ivory",
      "italian:moss": "pembroke-italian-moss",
    },
    photoNotes: { "pembroke-1": "Customized version", "pembroke-2": "Customized version" },
    fabrics: ["blend", "cotton", "italian"], designedFabric: "blend", depth: true, length: false, finish: false,
    fabricPrices: { cotton: 5200, italian: 5700 },
    delivery: WHITE_GLOVE,
    materials: "Solid hardwood frame · Swivel base · Linen Blend, Organic Cotton or Italian Linen upholstery",
  },
  {
    id: "cotswold-chair", name: "The Cotswold Chair", type: "Chair", category: "chairs", price: 4000,
    line: "A deep, rounded lounge chair in organic wool bouclé, made to sit beside the Cotswold sofa.",
    photos: ["cchair-studio", "cchair-c"], cardSingle: true,
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: false, finish: false,
    materials: "Solid hardwood frame · Organic wool bouclé",
    delivery: WHITE_GLOVE,
  },
  {
    id: "clifton", name: "The Clifton", type: "Chair", category: "chairs", price: 5500,
    line: "A rounded swivel lounge chair in textured ivory weave, with an olive back, a stitched leather band and a walnut base.",
    photos: ["clifton-s1", "clifton-s2"],
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle", depth: true, length: false, finish: true,
    materials: "Solid walnut swivel base · Textured organic wool weave · Stitched vegetable-tanned leather band",
    delivery: WHITE_GLOVE,
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
  ["Latex and coir", "Organic natural latex and coconut coir, in place of polyurethane foam."],
  ["Natural oils", "Plant-based finishes for the wood."],
];
