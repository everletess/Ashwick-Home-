/**
 * The shop catalog for grids: one list of everything we sell, grouped by room. Home rows, Shop All, the Bedroom page
 * and the filter tabs all read from here, so a product is listed once. Order within a group is the order below;
 * ORDER_OVERRIDE (see lib/catalog-order.ts) can re-sort without touching this file.
 */
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { PILLOW_COVERS, PILLOW_COVER_PHOTOS, PILLOW_PATH, PILLOW_STANDALONE_FILLS, PILLOW_STORY, pillowFromPrice } from "@/lib/pillow";
import { PRODUCTS, cardPrice, type Product } from "@/lib/products";
import { BUNDLE, BUNDLE_CONFIG, BUNDLE_HERO, SLEEP_SUITE, SALE, bundlePrice, pillowsAreNew, salePrice } from "@/lib/sale";
import type { PhotoKey } from "@/lib/photos";
import type { ProductKey } from "@/lib/reviews";

export type Section = "sleep" | "living";
export type Group = "bundles" | "ashbury" | "pillows" | "dog-beds" | "sofas" | "chairs";
export type Dot = { id: string; label: string; swatch: PhotoKey; photo: PhotoKey };
export type QuickAdd = { kind: "pillow" | "dog-bed" | "nook" | "mattress"; href: string; fill?: string };

export type CatalogItem = {
  id: string;
  name: string;
  href: string;
  section: Section;
  group: Group;
  /** List price (before the sitewide percent). For bundles this is the "was" price. */
  price: number;
  /** Shown as "From $x". */
  from: boolean;
  /** For bundles: the price already after the sale. */
  nowPrice?: number;
  photo: PhotoKey;
  hover?: PhotoKey;
  review?: ProductKey;
  dots?: Dot[];
  /** A badge for a product with its own offer (not the sitewide percent). */
  badge?: string;
  quick?: QuickAdd;
  /** Ships within days (not weeks). */
  fast?: boolean;
};

const first = (p: Product): PhotoKey => (p.cardPhoto ?? p.photos[0]) as PhotoKey;
const second = (p: Product): PhotoKey | undefined => (p.cardSingle ? undefined : (p.photos[1] as PhotoKey | undefined));
const product = (id: string) => PRODUCTS.find((p) => p.id === id);

const m0 = MATTRESS.sizes[0].price;
const bed0 = DOG_BED.sizes[0].price;
const bedding = BUNDLE_CONFIG.beddingSet.price;

function furniture(id: string, group: Group): CatalogItem | null {
  const p = product(id);
  if (!p) return null;
  const c = cardPrice(p);
  return { id: p.id, name: p.name, href: "/products/" + p.id, section: "living", group, price: c.price, from: !!c.from, photo: first(p), hover: second(p) };
}

export const CATALOG: CatalogItem[] = [
  // Sleep
  {
    id: "sleep-suite", name: SLEEP_SUITE.name, href: SLEEP_SUITE.path, section: "sleep", group: "bundles", price: m0 + 200, from: true,
    get nowPrice() { return salePrice(m0 + 200); }, photo: "mattress-mocha-bedroom", badge: "Best value", fast: true,
  },
  {
    id: "best-friends", name: BUNDLE.title, href: BUNDLE.path, section: "sleep", group: "bundles", price: m0 + bed0 + bedding, from: true,
    get nowPrice() { return bundlePrice(m0) + bundlePrice(bed0) + bundlePrice(bedding); }, photo: BUNDLE_HERO.photo, fast: true,
  },
  {
    id: MATTRESS.id, name: MATTRESS.title, href: MATTRESS_PATH, section: "sleep", group: "ashbury", price: Math.min(...MATTRESS.sizes.map((s) => s.price)), from: true,
    photo: MATTRESS.colors.find((c) => c.id === MATTRESS.defaultColor)!.photos[0], hover: MATTRESS.colors.find((c) => c.id === MATTRESS.defaultColor)!.photos[1],
    review: "ashbury", fast: true,
    dots: MATTRESS.colors.map((c) => ({ id: c.id, label: c.label, swatch: c.swatch, photo: c.photos[0] })),
    quick: { kind: "mattress", href: MATTRESS_PATH },
  },
  {
    id: "pillow", name: "The Ashwick Pillow", href: PILLOW_PATH, section: "sleep", group: "pillows", price: pillowFromPrice("organic-cotton"), from: true,
    photo: "pillow-stack-ledge", hover: "pillow-stack-meadow", get badge() { return pillowsAreNew() ? "New" : undefined; }, fast: true,
    dots: PILLOW_COVERS.map((c) => ({ id: c.id, label: c.label, swatch: c.swatch, photo: PILLOW_COVER_PHOTOS[c.id].photo })),
    quick: { kind: "pillow", href: PILLOW_PATH },
  },
  // The three pillows, one card each, for the shop grids (Shop All, Bedroom). The single "pillow" card above stays for
  // "Complete the bed" and the homepage; the grids show these instead (itemsFor).
  ...[...PILLOW_STANDALONE_FILLS]
    .sort((a, b) => ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"].indexOf(a.id) - ["living-wool-horse-hair", "living-wool-latex", "organic-cotton"].indexOf(b.id))
    .map((f): CatalogItem => ({
      id: "pillow-" + f.id, name: `${f.label} Pillow`, href: f.path, section: "sleep", group: "pillows", price: pillowFromPrice(f.id), from: true,
      photo: PILLOW_STORY[f.id].card, get badge() { return pillowsAreNew() ? "New" : undefined; }, fast: true,
      quick: { kind: "pillow", href: f.path, fill: f.id },
    })),
  {
    id: DOG_BED.id, name: DOG_BED.title, href: DOG_BED.path, section: "sleep", group: "dog-beds", price: Math.min(...DOG_BED.sizes.map((s) => s.price)), from: true,
    photo: "dog-bed-sorrel-card", review: "ashbury-dog-bed", fast: true,
    dots: DOG_BED.colors.map((c) => ({ id: c.id, label: c.label, swatch: c.swatch, photo: (c.photos[0] + "-card") as PhotoKey })),
    quick: { kind: "dog-bed", href: DOG_BED.path },
  },
  {
    id: NOOK.id, name: NOOK.title, href: NOOK.path, section: "sleep", group: "dog-beds", price: Math.min(...NOOK.sizes.map((z) => z.price)), from: true,
    photo: "nook-olive-card", review: "nook", fast: true,
    quick: { kind: "nook", href: NOOK.path },
    dots: NOOK.colors.map((c) => ({ id: c.id, label: c.label, swatch: c.swatch, photo: (c.photos[0] + "-card") as PhotoKey })),
  },
  // Living
  ...(["marlowe", "marlowe-loveseat", "cotswold", "chatsworth", "burford"].map((id) => furniture(id, "sofas")).filter(Boolean) as CatalogItem[]),
  ...(["pembroke", "cotswold-chair", "marlowe-chair", "marlowe-ottoman"].map((id) => furniture(id, "chairs")).filter(Boolean) as CatalogItem[]),
];

export const SECTION_LABEL: Record<Section, string> = { sleep: "Sleep", living: "Living" };
export const GROUP_ORDER: Group[] = ["bundles", "ashbury", "pillows", "dog-beds", "sofas", "chairs"];

/** Homepage rows: four each. Bundles only during the sale; after it, the Ashbury family leads. */
export function homeRows() {
  const byId = (id: string) => CATALOG.find((c) => c.id === id)!;
  const bedroom = [SALE.active ? byId("sleep-suite") : byId("best-friends"), byId(MATTRESS.id), byId("pillow"), byId(DOG_BED.id)];
  const living = ["marlowe", "cotswold", "chatsworth", "pembroke"].map((id) => CATALOG.find((c) => c.id === id)).filter(Boolean) as CatalogItem[];
  return { bedroom, living };
}

/** Which items a Shop All filter tab shows. */
export const TABS: [label: string, handle: string, test: (c: CatalogItem) => boolean][] = [
  ["All", "all", () => true],
  ["Bedroom", "bedroom", (c) => c.section === "sleep"],
  ["Pillows", "pillows", (c) => c.group === "pillows"],
  ["Dog Beds", "dog-beds", (c) => c.group === "dog-beds"],
  ["Sofas", "sofas", (c) => c.group === "sofas"],
  ["Chairs", "chairs", (c) => c.group === "chairs"],
  ["Bundles", "bundles", (c) => c.group === "bundles"],
];

import { ORDER } from "@/lib/catalog-order";

/** Everything for a tab, in default group order, then any manual order from lib/catalog-order.ts. */
export function itemsFor(handle: string): CatalogItem[] {
  const tab = TABS.find((t) => t[1] === handle);
  const list = CATALOG.filter((c) => c.id !== "pillow" && (tab ? tab[2](c) : true));
  const rank = (c: CatalogItem) => ORDER[c.id] ?? GROUP_ORDER.indexOf(c.group) * 100 + CATALOG.indexOf(c);
  return [...list].sort((a, b) => rank(a) - rank(b));
}
