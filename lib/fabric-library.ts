/**
 * Every fabric we sell, for the fabric library and free swatch page (/pages/fabric-swatches). Descriptions are the
 * site's own wording, word for word, from lib/products.ts (FABRICS), lib/materials.ts and lib/dog-bed.ts. Colors and
 * the pieces each fabric is on come from the same data, so a new color or piece shows up here on its own.
 */
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { ASHBURY_GROUPS, FURNITURE_GROUPS } from "@/lib/materials";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import type { PhotoKey } from "@/lib/photos";
import { FABRICS, PRODUCTS, type FabricId } from "@/lib/products";

export type LibraryColor = { id: string; label: string; code?: string; swatch?: string; photo?: PhotoKey; tex?: string; alsoCalled?: string };
export type LibraryFabric = {
  /** Also the ?fabric= value in links from product pages. */
  id: string;
  name: string;
  /** "Furniture" or "Bedroom", for the page's two parts. */
  room: "Furniture" | "Bedroom";
  /** One line: what it is (the site's own wording). */
  makeup?: string;
  /** Bold lead-in before `makeup`, e.g. "Wool." */
  makeupLead?: string;
  /** Small text under every color's name, e.g. "Wool". */
  colorNote?: string;
  /** Tile grid: 2 per row on a phone and 5 on desktop, square, no border. */
  wideGrid?: boolean;
  body?: string;
  origin?: string;
  usedOn: { name: string; href: string }[];
  note?: string;
  colors: LibraryColor[];
};

const material = (id: string) => [...FURNITURE_GROUPS, ...ASHBURY_GROUPS].flatMap((g) => g.materials).find((m) => m.id === id);
const linen = material("linen");
const twill = material("organic-cotton");
const visible = PRODUCTS.filter((p) => !p.hidden);
const usedOn = (f: FabricId) => visible.filter((p) => p.fabrics.includes(f)).map((p) => ({ name: p.name, href: "/products/" + p.id }));

/** A fabric's colors, with the Marlowe's own name where it has one (same swatch). */
function furnitureColors(f: FabricId): LibraryColor[] {
  const F = FABRICS[f];
  const marlowe = visible.find((p) => p.id === "marlowe")?.colorNames?.[f] ?? {};
  return (F.colors ?? []).map((c) => ({ id: c.id, label: c.label, code: c.code, swatch: c.swatch, tex: F.tex, alsoCalled: marlowe[c.id] ? `${marlowe[c.id]} on the Marlowe` : undefined }));
}

/** Fabrics left off the swatch page for now (Tessa, Nov 20: Belgian Linen). Take an id out to bring it back. */
export const SWATCHES_PAUSED = new Set(["belgian"]);

const ALL_FABRICS: LibraryFabric[] = [
  {
    id: "irish", name: FABRICS.irish.label, room: "Furniture",
    body: linen?.body, origin: linen?.origin,
    usedOn: usedOn("irish"), colors: furnitureColors("irish"),
  },
  {
    id: "cotton", name: FABRICS.cotton.label, room: "Furniture",
    makeup: FABRICS.cotton.detail,
    usedOn: usedOn("cotton"), colors: furnitureColors("cotton"),
  },
  {
    // Swatch page only for now; not a product option yet (Tessa, Nov 20). OEKO-TEX certified, not organic.
    id: "wool", name: "Wool", room: "Furniture",
    makeupLead: "Wool.", makeup: "A heavyweight, tightly woven 100% wool. Dense, durable and naturally soft. OEKO-TEX certified.",
    usedOn: [], colorNote: "Wool", wideGrid: true,
    colors: [
      { id: "chalk", label: "Chalk", photo: "wool-chalk", swatch: "#EEEDE8" },
      { id: "barley", label: "Barley", photo: "wool-barley", swatch: "#E8D9BC" },
      { id: "heron", label: "Heron", photo: "wool-heron", swatch: "#C9C0B6" },
      { id: "heather", label: "Heather", photo: "wool-heather", swatch: "#A7A8BE" },
      { id: "pebble", label: "Pebble", photo: "wool-pebble", swatch: "#9A958C" },
      { id: "gorse", label: "Gorse", photo: "wool-gorse", swatch: "#C49A38" },
      { id: "russet", label: "Russet", photo: "wool-russet", swatch: "#8A4632" },
      { id: "bark", label: "Bark", photo: "wool-bark", swatch: "#5E4C40" },
      { id: "slate", label: "Slate", photo: "wool-slate", swatch: "#4F535A" },
      { id: "ivy", label: "Ivy", photo: "wool-ivy", swatch: "#4B4A35" },
    ],
  },
  {
    id: "belgian", name: FABRICS.belgian.label, room: "Furniture",
    makeup: FABRICS.belgian.detail,
    usedOn: usedOn("belgian"), colors: furnitureColors("belgian"),
  },
  {
    id: "twill", name: "Organic cotton twill", room: "Bedroom",
    makeup: DOG_BED.materials.find((m) => m.name === "Organic cotton twill cover")?.note,
    // The first two sentences of the Ashbury's organic cotton entry: what the cover is.
    body: twill?.body.split(". ").slice(0, 2).join(". ") + ".",
    origin: twill?.origin,
    usedOn: [{ name: MATTRESS.title, href: MATTRESS_PATH }, { name: DOG_BED.title, href: DOG_BED.path }],
    note: "The Ashwick Pillow's removable covers come in the same four colors.",
    colors: MATTRESS.colors.map((c) => ({ id: c.id, label: c.label, photo: c.swatch })),
  },
  {
    // The Nook's cover fabric, also the Pembroke's Belgian Linen (Tessa, Nov 23); product pages link here for both.
    id: "nook", name: "Nook cover", room: "Bedroom",
    makeup: NOOK.materials.find((m) => m.name === "Cover")?.note,
    usedOn: [{ name: NOOK.title, href: NOOK.path }, ...visible.filter((p) => p.fabrics.includes("belgian") && p.colorNames?.belgian).map((p) => ({ name: p.name, href: "/products/" + p.id }))],
    colors: NOOK.colors.map((c) => ({ id: c.id, label: c.label, photo: c.swatch })),
  },
];

export const FABRIC_LIBRARY = ALL_FABRICS.filter((F) => !SWATCHES_PAUSED.has(F.id));

/**
 * Swatch page link for a furniture fabric and color. Belgian Linen swatches are ordered as the Nook cover (the same
 * cloth), under the Nook's color names, while the Belgian Linen entry stays paused.
 */
const BELGIAN_TO_NOOK: Record<string, string> = { moss: "olive", ivory: "oat", coco: "toffee" };
export function swatchHref(fabric: string, color?: string) {
  if (fabric === "belgian") return `/pages/fabric-swatches?fabric=nook${color && BELGIAN_TO_NOOK[color] ? `&color=${BELGIAN_TO_NOOK[color]}` : ""}`;
  return `/pages/fabric-swatches?fabric=${fabric}${color ? `&color=${color}` : ""}`;
}

/** Old ?fabric= values that still arrive from older links. */
export const FABRIC_ALIASES: Record<string, string> = { italian: "belgian", mattress: "twill", ashbury: "twill", "dog-bed": "twill", pillow: "twill" };
