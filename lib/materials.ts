/**
 * The materials pages: /pages/materials (landing), /pages/furniture-materials and /pages/inside-the-ashbury.
 * Copy is final from the materials handoff; anything in [square brackets] is pending confirmation and shows on the
 * page as written. Set `photo` (a key in lib/photos.ts) on an entry once its image exists; until then it shows a
 * placeholder.
 */
import type { PhotoKey } from "@/lib/photos";

export const MATERIALS_PATH = "/pages/materials";
export const FURNITURE_MATERIALS_PATH = "/pages/furniture-materials";
export const ASHBURY_PATH = "/pages/inside-the-ashbury";

export type Material = {
  id: string;
  /** Label in the index row. */
  short: string;
  name: string;
  descriptor: string;
  body: string;
  /** "How we use it" (furniture) or "Where you'll find it" (the Ashbury). */
  where: string;
  origin?: string;
  photo?: PhotoKey;
  alt: string;
};

export type MaterialGroup = { id: string; eyebrow: string; title: string; photo?: PhotoKey; alt: string; materials: Material[] };

const LIVING_WOOL_BODY =
  "Our Living Wool comes from Lanas Trinidad in Uruguay, from sheep shorn as part of their natural seasonal cycle. Each fiber has a natural crimp that compresses under weight and springs back when you move. Wool holds warmth when the room is cool and releases heat when you run warm, and it draws moisture away from the body so the surface stays dry.";

/** Furniture Materials. Kapok and leather are left out for now (Tessa, Oct 16–17); restore their entries here to bring them back. */
export const FURNITURE_GROUPS: MaterialGroup[] = [
  {
    id: "frame", eyebrow: "The Frame", title: "What holds it up.", photo: "marlowe-sofa-walnut-linen", alt: "The hand-fluted solid walnut plinth of the Marlowe sofa",
    materials: [
      {
        id: "hardwood", short: "Hardwood", name: "Solid hardwood", descriptor: "Built to be inherited.",
        body: "Every frame is built by hand in the USA from solid, kiln-dried [species: confirm, e.g. oak, ash, walnut]. No particleboard and no plastic parts. It's the part of a sofa you'll never see, and the part that decides whether it lasts a decade or a lifetime.",
        where: "Frames, plinths and legs. [Confirm: any plywood or engineered wood? If so, adjust \"No particleboard.\"]",
        origin: "Handmade in the USA",
        photo: "fiber-wood",
        alt: "Blocks of solid oak and walnut showing end grain",
      },
      {
        id: "natural-oils", short: "Natural Oils", name: "Natural oils", descriptor: "Finished to be touched.",
        body: "Where the wood shows, we finish it with plant-based oils [confirm type, e.g. linseed or tung] that soak into the grain rather than sealing it under a plastic coating. The wood stays warm and tactile, and small marks can be refreshed with a new coat of oil.",
        where: "On exposed wood surfaces.",
        photo: "materials-oil",
        alt: "A hand wiping natural oil into a live-edge oak slab with a cotton cloth",
      },
    ],
  },
  {
    id: "fill", eyebrow: "The Fill", title: "What you sink into.", photo: "materials-band-fill", alt: "Soft natural fiber and curled cream wool spilling across linen beside an open seed pod",
    materials: [
      {
        id: "wool", short: "Wool", name: "Wool", descriptor: "Shape that springs back.",
        body: "Wool gives a cushion its body. Each fiber has a natural crimp that compresses when you sit and springs back when you stand, and wool lets air and moisture move, so a cushion stays fresh and even.",
        where: "Cushion fill and wrap.",
        origin: "[Confirm source — Lanas Trinidad or other — and whether it is GOTS-certified organic. Only then may this line say \"organic.\"]",
        photo: "materials-wool",
        alt: "Close-up of crimped cream wool",
      },
      {
        id: "coir", short: "Coir", name: "Coconut coir", descriptor: "Strength from the husk.",
        body: "Coir is the fiber from the outer husk of the coconut. It's firm, springy and breathable, which makes it a natural foundation in place of foam.",
        where: "Seat foundations and firm support layers.",
        origin: "[Origin and certification — confirm, or remove line]",
        photo: "fiber-coir",
        alt: "Coarse golden-brown coconut coir fiber",
      },
      {
        id: "agave", short: "Agave", name: "Organic agave", descriptor: "Strength from the desert.",
        body: "Agave is a hardy desert plant whose long leaves yield a strong natural fiber. It's tough, durable and breathable, and the plant grows with very little water. We're bringing organic agave fiber into our fills and foundations as another natural alternative to foam.",
        where: "Fills and foundations.",
        origin: "[Origin and organic certification — confirm]",
        photo: "fiber-agave",
        alt: "Long, pale golden agave fiber on linen and travertine",
      },
    ],
  },
  {
    id: "fabrics", eyebrow: "The Fabrics", title: "What you touch.", photo: "materials-band-fabrics", alt: "A stack of folded linen, bouclé and Sorrel cotton twill on an oak table",
    materials: [
      {
        id: "linen", short: "Linen", name: "Organic linen", descriptor: "Softer every year.",
        body: "Linen is woven from flax, one of the oldest fibers people have made cloth from. It's strong, breathable and cool to the touch, and it softens with use rather than wearing thin. Its natural slub gives every slipcover a relaxed, lived-in texture from the first day.",
        where: "Upholstery and slipcovers.",
        origin: "[Confirm organic certification and origin. If not certified, retitle \"Linen.\"]",
        photo: "materials-linen",
        alt: "Close-up of oat linen weave showing natural slubs",
      },
      {
        id: "wool-upholstery", short: "Wool Upholstery", name: "Wool upholstery", descriptor: "Texture you can feel from across the room.",
        body: "We upholster in wool because it's resilient and slow to show wear. Bouclé's looped yarn catches the light and softens the shape of a piece; brushed wool has a dense, velvety hand. Both keep their look through years of everyday use.",
        where: "Upholstery, in bouclé and brushed wool.",
        origin: "[Confirm certification and origin]",
        photo: "materials-boucle",
        alt: "Close-up of cream wool bouclé loops",
      },
    ],
  },
];

/** Inside the Ashbury. */
export const ASHBURY_GROUPS: MaterialGroup[] = [
  {
    id: "comfort", eyebrow: "The Comfort", title: "What you sleep on.", photo: "materials-band-fillings", alt: "Lofty cream raw wool, close up",
    materials: [
      {
        id: "living-wool", short: "Living Wool", name: "Living Wool", descriptor: "Grown, not made.",
        body: LIVING_WOOL_BODY,
        where: "The topper, hand-tufted with cashmere and Swedish horsehair. [Confirm whether the base wool layers are also Lanas Trinidad / Living Wool.]",
        origin: "Lanas Trinidad, Uruguay · GOTS-certified organic",
        photo: "materials-wool",
        alt: "Close-up of crimped cream organic wool",
      },
      {
        id: "cashmere", short: "Cashmere", name: "Cashmere", descriptor: "The softest layer.",
        body: "Fine, light and exceptionally soft, cashmere sits in the topper beneath the cotton twill cover, adding a softness you feel the moment you lie down.",
        where: "The topper.",
        origin: "OEKO-TEX Standard 100",
        photo: "materials-cashmere",
        alt: "Close-up of long, silky cream cashmere fiber",
      },
      {
        id: "horsehair", short: "Horsehair", name: "Swedish horsehair", descriptor: "The spring inside the softness.",
        body: "Long, curled strands of horsehair act like thousands of small springs: they compress under weight, return to shape and leave space for air to move between them. Ours comes from tail clippings in Sweden, and no horse is harmed. Blended with Living Wool, it gives the topper its lift and breathability.",
        where: "The topper.",
        origin: "Sweden · OEKO-TEX certified [Optional: confirm how the horsehair is cleaned and prepared.]",
        photo: "materials-horsehair",
        alt: "Curled dark horsehair strands on a warm stone surface",
      },
    ],
  },
  {
    id: "structure", eyebrow: "The Structure", title: "What holds it together.", alt: "Fabric-wrapped pocket coils, wide",
    materials: [
      {
        id: "organic-cotton", short: "Organic Cotton", name: "Organic cotton", descriptor: "Breathable at every layer.",
        body: "Our cotton is GOTS-certified organic, grown without synthetic pesticides or fertilizers. Woven into a super soft 100% organic cotton twill and colored with GOTS-approved plant dyes, it covers the entire mattress. Inside, it wraps the pocket coils on both sides, keeping the layers quiet and letting the whole mattress breathe.",
        where: "The cover, in five plant-dyed colors, and around the coils.",
        origin: "GOTS-certified organic",
        photo: "materials-cotton-rosette",
        alt: "Cream cotton twill with a hand-tied wool rosette",
      },
      {
        id: "pocket-coils", short: "Pocket Coils", name: "Pocket coils", descriptor: "Support that moves with you.",
        body: "At the center of the Ashbury, double-tempered steel pocket coils are each wrapped individually, so every coil responds on its own as you move. They're cushioned on both sides by organic cotton and organic wool, so you feel the support, never the steel.",
        where: "The core of the 8\" mattress.",
        photo: "materials-pocket-coils",
        alt: "A bare steel coil and cotton-wrapped pocket coils on stone steps above a cutaway of the Ashbury",
      },
    ],
  },
];

/** Old anchors on /pages/materials, sent on to the page each material now lives on. */
export const MOVED_ANCHORS: Record<string, string> = Object.fromEntries([
  ...FURNITURE_GROUPS.flatMap((g) => g.materials.map((m) => [m.id, FURNITURE_MATERIALS_PATH])),
  ...ASHBURY_GROUPS.flatMap((g) => g.materials.map((m) => [m.id, ASHBURY_PATH])),
  ["hand-tufting", ASHBURY_PATH],
]);

export const MATERIALS_PENDING = {
  furnitureGlue: "[Add \"No glue\" only if confirmed for furniture.]",
  furnitureFire: "[Confirm the furniture flammability standard met, e.g. California TB 117-2013, and how it's met without chemical flame retardants.]",
  furnitureCerts: "[Add any confirmed certifications for linen, wool upholstery or fill. If none, show only the fire-safety item.]",
  furnitureFireAnswer: "[Answer once the furniture standard and method are confirmed.]",
  oilType: "[oil type]",
  swatchKit: "[If a swatch kit exists: Order a swatch kit and feel the linen, bouclé and brushed wool at home.]",
  consultation: "[Book a consultation]",
};
