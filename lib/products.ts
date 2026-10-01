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
  irish: { id: "irish", label: "Irish Linen", swatch: "#E3DDD2", tex: "linen" },
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
  /** What each photo shows, so picking options can jump to the closest match. */
  photoTags?: Partial<Record<PhotoKey, PhotoTag>>;
  /** Sold as separate pieces (sofa, chair…), each with its own price; the first is the default. */
  pieces?: Piece[];
  /** Plinth wood choice, in place of the finish option. */
  wood?: boolean;
  /** Delivery charged per piece on top of the price. */
  delivery?: { label: string; price: number };
};

export type PhotoTag = { piece?: string; wood?: string; fabric?: FabricId; color?: string };
export type Piece = {
  id: string;
  label: string;
  price: number;
  fabricPrices?: Partial<Record<FabricId, number>>;
  /** Fabrics offered for this piece, when narrower than the product's. */
  fabrics?: FabricId[];
};

export const pieceOf = (p: Product, id?: string) => p.pieces?.find((x) => x.id === id) ?? p.pieces?.[0];
export const fabricsFor = (p: Product, pieceId?: string) => pieceOf(p, pieceId)?.fabrics ?? p.fabrics;

export function priceFor(p: Product, fabric: FabricId, pieceId?: string) {
  const piece = pieceOf(p, pieceId);
  if (piece) return piece.fabricPrices?.[fabric] ?? piece.price;
  return p.fabricPrices?.[fabric] ?? p.price;
}

/** Lowest price, and whether to prefix it with "From" (several prices, or a "from" base price). */
export function cardPrice(p: Product) {
  const prices = (p.pieces ?? [undefined]).flatMap((pc) => fabricsFor(p, pc?.id).map((f) => priceFor(p, f, pc?.id)));
  const min = Math.min(...prices);
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

/** Closest photo for a selection: exact, then ignoring the wood, then the color too. */
export const nearestPhoto = (p: Product, sel: PhotoTag) =>
  photoFor(p, sel) ?? photoFor(p, sel, ["wood"]) ?? photoFor(p, sel, ["wood", "color"]);

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
    line: "A deep sofa on a hand-fluted solid wood plinth, in Irish Linen or Cork. Also as a loveseat, chair and ottoman.",
    photos: [
      "marlowe-studio", "marlowe-1", "marlowe-2",
      "marlowe-sofa-walnut-linen", "marlowe-sofa-oak-linen",
      "marlowe-sofa-oak-cork-natural", "marlowe-sofa-oak-cork-ivory", "marlowe-sofa-oak-cork-ivory-2",
      "marlowe-loveseat-walnut-linen", "marlowe-chair-walnut-linen", "marlowe-ottoman-walnut-linen",
    ],
    cardSingle: true,
    photoTags: {
      "marlowe-sofa-walnut-linen": { piece: "sofa", wood: "walnut", fabric: "irish" },
      "marlowe-sofa-oak-linen": { piece: "sofa", wood: "oak", fabric: "irish" },
      "marlowe-sofa-oak-cork-natural": { piece: "sofa", wood: "oak", fabric: "cork", color: "natural" },
      "marlowe-sofa-oak-cork-ivory": { piece: "sofa", wood: "oak", fabric: "cork", color: "ivory" },
      "marlowe-loveseat-walnut-linen": { piece: "loveseat", wood: "walnut", fabric: "irish" },
      "marlowe-chair-walnut-linen": { piece: "chair", wood: "walnut", fabric: "irish" },
      "marlowe-ottoman-walnut-linen": { piece: "ottoman", wood: "walnut", fabric: "irish" },
    },
    pieces: [
      { id: "sofa", label: "Sofa", price: 8500, fabricPrices: { cork: 9500 } },
      { id: "loveseat", label: "Loveseat", price: 6500, fabricPrices: { cork: 7000 } },
      { id: "chair", label: "Chair", price: 4500, fabricPrices: { cork: 5000 } },
      { id: "ottoman", label: "Ottoman", price: 2500, fabricPrices: { cork: 3000 } },
    ],
    fabrics: ["irish", "cork"], designedFabric: "irish", depth: true, length: false, finish: false, wood: true,
    materials: "Hand-fluted solid walnut or oak plinth · Irish Linen or Cork upholstery · Natural oil finish",
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
