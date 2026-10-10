// Catalogue data. Shaped so it can later be swapped for the Shopify Storefront
// API (handles = product ids, collections = categories).
import type { PhotoKey } from "@/lib/photos";

export type FabricId = "linen" | "boucle" | "wool" | "leather" | "italian" | "blend" | "cotton" | "irish" | "cork";
export type Category = "sofas" | "chairs";
export type CollectionHandle = "all" | Category;

export type FabricColor = { id: string; label: string; code?: string; swatch: string };
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
  irish: {
    id: "irish", label: "Irish Linen", swatch: "#E3DDD2", tex: "linen",
    colors: [
      { id: "white", label: "White", swatch: "#F1EEE7" },
      { id: "cream", label: "Cream", swatch: "#E8E0CF" },
      { id: "flax", label: "Flax", swatch: "#CDBE9F" },
      { id: "oatmeal", label: "Oatmeal", swatch: "#D8CDB9" },
    ],
  },
  cork: {
    id: "cork", label: "Cork", swatch: "#C9A57E", tex: "leather",
    colors: [
      { id: "natural", label: "Natural", swatch: "#B98E63" },
      { id: "ivory", label: "Ivory", swatch: "#DCD6CB" },
    ],
  },
};

/** Plinth woods for pieces that offer them (replaces the finish option). */
export const WOODS: Option[] = [
  { id: "walnut", label: "Walnut" },
  { id: "oak", label: "Oak" },
];
export const SWATCH_ORDER: FabricId[] = ["irish", "blend", "cotton", "italian"];


export type Product = {
  id: string;
  name: string;
  type: "Sofa" | "Loveseat" | "Chair" | "Ottoman";
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
  materials: string;
  /** Shown on the product page when set, e.g. pieces held ready to ship. */
  leadTime?: string;
  /** Price by fabric where it differs from the base price. */
  fabricPrices?: Partial<Record<FabricId, number>>;
  /** Caption under the main gallery image, e.g. a photo showing a custom fabric. */
  photoNotes?: Partial<Record<PhotoKey, string>>;
  /** What each photo shows, so picking options can jump to the closest match. */
  photoTags?: Partial<Record<PhotoKey, PhotoTag>>;
  /** Taken off the site for now (no page, card or link); set back to false to restore it. */
  hidden?: boolean;
  /** Pre-order only — not yet ready to ship. */
  preorder?: boolean;
  /** Leave out of the home page's list of names (e.g. the Marlowe's companion pieces). */
  hideInNames?: boolean;
  /** Plinth wood choice, in place of the finish option. */
  wood?: boolean;
  /** Delivery charged per piece on top of the price. */
  delivery?: { label: string; price: number };
  /** Measurements in inches: overall size first, then the detail rows. */
  dimensions?: { overall: string; rows: [string, string][] };
};

export type PhotoTag = { wood?: string; fabric?: FabricId; color?: string };

export const priceFor = (p: Product, fabric: FabricId) => p.fabricPrices?.[fabric] ?? p.price;

/** Lowest price, and whether to prefix it with "From" (several prices, or a "from" base price). */
export function cardPrice(p: Product) {
  const prices = p.fabrics.map((f) => priceFor(p, f));
  const min = Math.min(p.price, ...prices);
  return { price: min, from: !!p.priceFrom || prices.some((x) => x !== min) };
}

/** The photo whose tags best match a selection; tags that are set must all match, except ignored ones. */
export function photoFor(p: Product, sel: PhotoTag, ignore: (keyof PhotoTag)[] = []): PhotoKey | undefined {
  let best: PhotoKey | undefined;
  let bestScore = 0;
  for (const ph of p.photos) {
    const tag = p.photoTags?.[ph];
    if (!tag) continue;
    const keys = (Object.keys(tag) as (keyof PhotoTag)[]).filter((k) => !ignore.includes(k));
    if (keys.some((k) => tag[k] !== sel[k])) continue;
    if (keys.length > bestScore) [best, bestScore] = [ph, keys.length];
  }
  return best;
}

/** Closest photo for a selection: exact, then ignoring the wood, the color, and finally the fabric. */
export const nearestPhoto = (p: Product, sel: PhotoTag) =>
  photoFor(p, sel) ??
  photoFor(p, sel, ["wood"]) ??
  photoFor(p, sel, ["wood", "color"]) ??
  photoFor(p, sel, ["wood", "color", "fabric"]);

const WHITE_GLOVE = { label: "White glove delivery", price: 750 };

/** Construction spec from the workshop (Sue). Same for every sofa, and for every chair. */
export type Construction = { statement: string; intro: string; rows: [string, string][] };

const NO_PETROCHEMICALS = "No petrochemicals. No plastic polyurethane foams.";
const FOUNDATIONS = "Solid wood, coconut coir, organic natural latex, and wool.";
const VEGAN = "TENCEL\u2122 and cotton can replace the wool in the seats, backs and foundations.";

export function constructionFor(p: Product): Construction {
  const short = p.name.replace(/^The /, "");
  if (p.type === "Sofa" || p.type === "Loveseat") {
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
  if (p.type === "Ottoman") {
    return {
      statement: NO_PETROCHEMICALS,
      intro: `The ${short} is handcrafted using organic and natural materials.`,
      rows: [
        ["Foundations", FOUNDATIONS],
        ["Cushion", "Organic latex wrapped in organic wool."],
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

/** Price of one fabric swatch. */
export const SWATCH_PRICE = 2;

/** Every piece is made by hand to order. */
export const LEAD_TIME = "Available to ship within 4 weeks from the date of order.";

const ALL_PRODUCTS: Product[] = [
  {
    id: "marlowe", name: "The Marlowe Sofa", type: "Sofa", category: "sofas", price: 8500,
    line: "A deep sofa on a hand-fluted solid wood plinth, in Irish Linen or Cork.",
    photos: [
      "marlowe-studio", "marlowe-1", "marlowe-2",
      "marlowe-sofa-walnut-linen", "marlowe-sofa-oak-linen",
      "marlowe-sofa-oak-cork-natural", "marlowe-sofa-oak-cork-ivory", "marlowe-sofa-oak-cork-ivory-2",
    ],
    cardSingle: true,
    photoTags: {
      "marlowe-sofa-walnut-linen": { wood: "walnut", fabric: "irish" },
      "marlowe-sofa-oak-linen": { wood: "oak", fabric: "irish" },
      "marlowe-sofa-oak-cork-natural": { wood: "oak", fabric: "cork", color: "natural" },
      "marlowe-sofa-oak-cork-ivory": { wood: "oak", fabric: "cork", color: "ivory" },
    },
    fabricPrices: { cork: 9500 },
    fabrics: ["irish", "cork"], designedFabric: "irish", wood: true,
    delivery: WHITE_GLOVE,
    materials: "Hand-fluted solid walnut or oak plinth · Irish Linen or Cork upholstery · Natural oil finish",
    dimensions: {
      overall: "88.5″ W × 40″ D × 27″ H",
      rows: [
        ["Seat width", "80″"],
        ["Seat depth", "23″"],
        ["Arm height", "20″"],
        ["Seat cushion", "7″ thick"],
        ["Plinth", "80″ W × 32.5″ D × 7″ H"],
      ],
    },
  },
  {
    id: "marlowe-loveseat", name: "The Marlowe Loveseat", type: "Loveseat", category: "sofas", price: 6500,
    line: "The Marlowe as a two-seat loveseat, on the same hand-fluted solid wood plinth, in Irish Linen or Cork.",
    photos: ["marlowe-loveseat-walnut-linen"], hideInNames: true,
    photoTags: { "marlowe-loveseat-walnut-linen": { wood: "walnut", fabric: "irish" } },
    fabricPrices: { cork: 7000 },
    fabrics: ["irish", "cork"], designedFabric: "irish", wood: true,
    delivery: WHITE_GLOVE,
    materials: "Hand-fluted solid walnut or oak plinth · Irish Linen or Cork upholstery · Natural oil finish",
  },
  {
    id: "chatsworth", name: "The Chatsworth", type: "Sofa", category: "sofas", price: 10500,
    preorder: true,
    line: "A sculptural curved sofa, in Linen Blend, Organic Cotton, Italian Linen or Irish Linen.",
    photos: ["chatsworth-s1"],
    fabrics: ["blend", "cotton", "italian", "irish"], designedFabric: "blend",
    materials: "Solid hardwood frame · Linen Blend, Organic Cotton, Italian Linen or Irish Linen upholstery",
    delivery: WHITE_GLOVE,
  },
  {
    id: "cotswold", name: "The Cotswold", type: "Sofa", category: "sofas", price: 8500, priceFrom: true,
    preorder: true,
    line: "A deep, curved modular sofa with a chaise, in Linen Blend, Organic Cotton, Italian Linen or Irish Linen.",
    photos: ["csofa-hero", "csofa-studio", "csofa-b", "csofa-c", "csofa-a", "cchair-c", "csofa-d"], cardSingle: true,
    cardPhoto: "csofa-hero-square",
    fabrics: ["blend", "cotton", "italian", "irish"], designedFabric: "blend",
    materials: "Solid hardwood frame · Modular sections with chaise · Linen Blend, Organic Cotton, Italian Linen or Irish Linen upholstery",
    delivery: WHITE_GLOVE,
  },
  {
    id: "burford", name: "The Burford", type: "Sofa", category: "sofas", price: 6500, priceFrom: true,
    preorder: true,
    line: "A deep, slipcovered sofa with a tailored skirt, in Irish Linen, Linen Blend, Organic Cotton or Italian Linen.",
    photos: ["burford-hero", "burford-1", "burford-2", "burford-3"],
    fabrics: ["irish", "blend", "cotton", "italian"], designedFabric: "irish",
    materials: "Solid hardwood frame · Removable slipcover in Irish Linen, Linen Blend, Organic Cotton or Italian Linen",
    delivery: WHITE_GLOVE,
  },
  {
    id: "pembroke", name: "The Pembroke", type: "Chair", category: "chairs", price: 5000,
    line: "A sculptural wingback lounge chair on a swivel base, in Linen Blend, Organic Cotton or Italian Linen.",
    photos: [
      "pembroke-blend-ivory", "pembroke-blend-sand", "pembroke-blend-coco", "pembroke-blend-dove",
      "pembroke-cotton-cream", "pembroke-cotton-natural", "pembroke-cotton-khaki",
      "pembroke-italian-coco", "pembroke-italian-ivory", "pembroke-italian-moss",
      "pembroke-1", "pembroke-2",
    ],
    cardSingle: true,
    photoTags: {
      "pembroke-blend-ivory": { fabric: "blend", color: "ivory" },
      "pembroke-blend-sand": { fabric: "blend", color: "sand" },
      "pembroke-blend-coco": { fabric: "blend", color: "coco" },
      "pembroke-blend-dove": { fabric: "blend", color: "dove" },
      "pembroke-cotton-cream": { fabric: "cotton", color: "cream" },
      "pembroke-cotton-natural": { fabric: "cotton", color: "natural" },
      "pembroke-cotton-khaki": { fabric: "cotton", color: "khaki" },
      "pembroke-italian-coco": { fabric: "italian", color: "coco" },
      "pembroke-italian-ivory": { fabric: "italian", color: "ivory" },
      "pembroke-italian-moss": { fabric: "italian", color: "moss" },
    },
    photoNotes: { "pembroke-1": "Customized version", "pembroke-2": "Customized version" },
    fabrics: ["blend", "cotton", "italian"], designedFabric: "blend",
    fabricPrices: { cotton: 5200, italian: 5700 },
    delivery: WHITE_GLOVE,
    materials: "Solid hardwood frame · Swivel base · Linen Blend, Organic Cotton or Italian Linen upholstery",
    dimensions: {
      overall: "36″ W × 36.5″ D × 39″ H",
      rows: [
        ["Seat height", "18.5″"],
        ["Seat width", "22.5″"],
        ["Seat depth", "22.5″"],
        ["Arm height", "24″"],
        ["Inside back height", "23″"],
        ["Base width", "34.5″"],
      ],
    },
  },
  {
    id: "cotswold-chair", name: "The Cotswold Chair", type: "Chair", category: "chairs", price: 4000,
    preorder: true,
    line: "A deep, rounded lounge chair made to sit beside the Cotswold sofa, in Linen Blend, Organic Cotton, Italian Linen or Irish Linen.",
    photos: ["cchair-studio", "cchair-c"], cardSingle: true,
    fabrics: ["blend", "cotton", "italian", "irish"], designedFabric: "blend",
    materials: "Solid hardwood frame · Linen Blend, Organic Cotton, Italian Linen or Irish Linen upholstery",
    delivery: WHITE_GLOVE,
  },
  {
    id: "clifton", name: "The Clifton", type: "Chair", category: "chairs", price: 5500, hidden: true,
    line: "A rounded swivel lounge chair in textured ivory weave, with an olive back, a stitched leather band and a walnut base.",
    photos: ["clifton-s1", "clifton-s2"],
    fabrics: ["boucle", "wool", "linen"], designedFabric: "boucle",
    materials: "Solid walnut swivel base · Textured organic wool weave · Stitched vegetable-tanned leather band",
    delivery: WHITE_GLOVE,
  },
  {
    id: "marlowe-chair", name: "The Marlowe Chair", type: "Chair", category: "chairs", price: 4500,
    line: "A deep lounge chair on a hand-fluted solid wood plinth, made to sit beside the Marlowe sofa. In Irish Linen or Cork.",
    photos: ["marlowe-chair-walnut-linen"], hideInNames: true,
    photoTags: { "marlowe-chair-walnut-linen": { wood: "walnut", fabric: "irish" } },
    fabricPrices: { cork: 5000 },
    fabrics: ["irish", "cork"], designedFabric: "irish", wood: true,
    delivery: WHITE_GLOVE,
    materials: "Hand-fluted solid walnut or oak plinth · Irish Linen or Cork upholstery · Natural oil finish",
  },
  {
    id: "marlowe-ottoman", name: "The Marlowe Ottoman", type: "Ottoman", category: "chairs", price: 2500,
    line: "An ottoman on a hand-fluted solid wood plinth, to pair with the Marlowe sofa or chair. In Irish Linen or Cork.",
    photos: ["marlowe-ottoman-walnut-linen"], hideInNames: true,
    photoTags: { "marlowe-ottoman-walnut-linen": { wood: "walnut", fabric: "irish" } },
    fabricPrices: { cork: 3000 },
    fabrics: ["irish", "cork"], designedFabric: "irish", wood: true,
    delivery: WHITE_GLOVE,
    materials: "Hand-fluted solid walnut or oak plinth · Irish Linen or Cork upholstery · Natural oil finish",
  },
];

/** Products on the site. */
export const PRODUCTS = ALL_PRODUCTS.filter((p) => !p.hidden);

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const COLLECTIONS: Record<CollectionHandle, { title: string; description: string }> = {
  all: { title: "The collection", description: "Sofas, chairs and an ottoman. Order each as we designed it, or make it yours." },
  sofas: { title: "Sofas", description: "Sofas and a loveseat, each made to order by hand." },
  chairs: { title: "Chairs", description: "Chairs and an ottoman, each made to order by hand." },
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
