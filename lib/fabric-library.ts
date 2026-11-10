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
  const marlowe = visible.find((p) => p.colorNames?.[f])?.colorNames?.[f] ?? {};
  return (F.colors ?? []).map((c) => ({ id: c.id, label: c.label, code: c.code, swatch: c.swatch, tex: F.tex, alsoCalled: marlowe[c.id] ? `${marlowe[c.id]} on the Marlowe` : undefined }));
}

export const FABRIC_LIBRARY: LibraryFabric[] = [
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
    id: "nook", name: "Nook cover", room: "Bedroom",
    makeup: NOOK.materials.find((m) => m.name === "Cover")?.note,
    usedOn: [{ name: NOOK.title, href: NOOK.path }],
    colors: NOOK.colors.map((c) => ({ id: c.id, label: c.label, photo: c.swatch })),
  },
];

/** Old ?fabric= values that still arrive from older links. */
export const FABRIC_ALIASES: Record<string, string> = { italian: "belgian", mattress: "twill", ashbury: "twill", "dog-bed": "twill", pillow: "twill" };
