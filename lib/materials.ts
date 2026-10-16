/**
 * "Our Materials" page (/pages/materials): every material entry, in page order. Copy is final from the materials
 * handoff; anything in [square brackets] is pending confirmation and shows on the page as written.
 *
 * The handoff calls the mattress "the Natural Mattress"; it uses the current name (MATTRESS.shortName) instead.
 * Set `photo` (a key in lib/photos.ts) on an entry once its image exists; until then it shows a placeholder.
 */
import { MATTRESS } from "@/lib/mattress";
import type { PhotoKey } from "@/lib/photos";

const MAT = MATTRESS.shortName;

export const MATERIALS_PATH = "/pages/materials";

export type Material = {
  id: string;
  /** Label in the index row. */
  short: string;
  name: string;
  descriptor: string;
  body: string;
  where: string;
  origin?: string;
  photo?: PhotoKey;
  alt: string;
};

export type MaterialGroup = { id: string; eyebrow: string; title: string; photo?: PhotoKey; alt: string; materials: Material[] };

export const MATERIAL_GROUPS: MaterialGroup[] = [
  {
    id: "fillings", eyebrow: "The Fillings", title: "What you sink into.", alt: "Lofty raw wool",
    materials: [
      {
        id: "living-wool", short: "Living Wool", name: "Living Wool", descriptor: "Grown, not made.",
        body: "Our Living Wool comes from Lanas Trinidad in Uruguay, from sheep shorn as part of their natural seasonal cycle. Each fiber has a natural crimp that compresses under weight and springs back when you move. Wool holds warmth when the room is cool and releases heat when you run warm, and it draws moisture away from the body so the surface stays dry.",
        where: `The comfort layers of the ${MAT} and its topper. [Confirm whether the base wool layers and furniture cushions also use Lanas Trinidad wool, and whether to call all of it Living Wool.]`,
        origin: "Lanas Trinidad, Uruguay · GOTS-certified organic",
        alt: "Macro of crimped cream organic wool fiber",
      },
      {
        id: "horsehair", short: "Horsehair", name: "Swedish horsehair", descriptor: "The spring inside the softness.",
        body: "Long, curled strands of horsehair act like thousands of small springs: they compress under weight, return to shape and leave space for air to move between them. Ours comes from tail clippings in Sweden, and no horse is harmed. Blended with Living Wool, it gives the mattress and topper their lift and breathability.",
        where: `The ${MAT} comfort layer and topper.`,
        origin: "Sweden · OEKO-TEX certified [Confirm how the horsehair is cleaned and prepared, if we want to describe it.]",
        alt: "Macro of long curled horsehair strands",
      },
      {
        id: "kapok", short: "Kapok", name: "Kapok", descriptor: "A fiber from the pod of a tree.",
        body: "Kapok is a silky fiber collected from the seed pods of the ceiba tree, harvested without cutting the tree down. Each fiber is hollow, which makes it remarkably light and airy. Blended with wool, it gives our cushions a soft, cloud-like sit, with no foam and no latex.",
        where: "[Confirm: sofa and chair seat cushions, back cushions, pillows.]",
        origin: "[Origin — confirm] · [Certification — confirm, or remove line]",
        alt: "An opened ceiba seed pod with silky white kapok fiber",
      },
    ],
  },
  {
    id: "fabrics", eyebrow: "The Fabrics", title: "What you touch.", alt: "A stack of folded linen, bouclé and cotton twill",
    materials: [
      {
        id: "organic-cotton", short: "Organic Cotton", name: "Organic cotton", descriptor: "Breathable at every layer.",
        body: "Our cotton is GOTS-certified organic, grown without synthetic pesticides or fertilizers. Inside the mattress it wraps the pocket coils on both sides, keeping the layers quiet and letting the whole mattress breathe. It also forms the quilted shell of the topper.",
        where: `The ${MAT} and topper. [Confirm what the colored mattress cover is made of, organic cotton or another fabric, and how it's colored (undyed fiber, plant dye or GOTS-approved dye). If it's cotton, add a sentence here about the color.]`,
        origin: "GOTS-certified organic",
        alt: "Quilted cotton twill with a hand-tied wool rosette",
      },
      {
        id: "linen", short: "Linen", name: "Organic linen", descriptor: "Softer every year.",
        body: "Linen is woven from flax, one of the oldest fibers people have made cloth from. It's strong, breathable and cool to the touch, and it softens with use rather than wearing thin. Its natural slub gives every slipcover a relaxed, lived-in texture from the first day.",
        where: "[Confirm pieces, e.g. the Cotswold slipcover.]",
        origin: "[Confirm: organic certification and origin]",
        alt: "Close-up of oat linen weave showing natural slubs",
      },
      {
        id: "wool-upholstery", short: "Wool Upholstery", name: "Wool upholstery", descriptor: "Texture you can feel from across the room.",
        body: "We upholster in wool because it's resilient and slow to show wear. Bouclé's looped yarn catches the light and softens the shape of a piece; brushed wool has a dense, velvety hand. Both are naturally resilient, so they keep their look through years of everyday use.",
        where: "[Confirm pieces and fabric names, e.g. Chatsworth, Pembroke, the sectional.]",
        origin: "[Confirm: organic certification and origin]",
        alt: "Macro of cream wool bouclé loops in raking light",
      },
      // Vegetable-tanned leather is left out: no piece in the current collection uses it (the Clifton is hidden).
      // Per the handoff, restore the entry and its index link if leather comes back.
    ],
  },
  {
    id: "structure", eyebrow: "The Structure", title: "What holds it up.", photo: "marlowe-sofa-walnut-linen", alt: "The hand-fluted solid walnut plinth of the Marlowe sofa",
    materials: [
      {
        id: "hardwood", short: "Hardwood", name: "Solid hardwood", descriptor: "Built to be inherited.",
        body: "Every frame is built by hand in the USA from solid, kiln-dried [species: confirm, e.g. oak, ash, walnut]. No particleboard and no plastic parts. Where the wood shows, on a plinth, a leg or a chair frame, it's finished with natural oils so the grain stays visible and warm to the touch.",
        where: "Every sofa, sectional and chair frame. [Confirm: any plywood or engineered wood used anywhere? If so, remove \"No particleboard\" or adjust.]",
        origin: "Handmade in the USA",
        alt: "End grain and oiled surface of solid oak",
      },
      {
        id: "pocket-coils", short: "Pocket Coils", name: "Pocket coils", descriptor: "Support that moves with you.",
        body: "Inside the mattress, double-tempered steel pocket coils are each wrapped individually, so every coil responds on its own as you move. They're cushioned on both sides by organic cotton and organic wool, so you feel the support, never the steel.",
        where: `The ${MAT}.`,
        photo: "mattress-cutaway",
        alt: "Cutaway of the mattress showing the wrapped pocket coils between wool and cotton layers",
      },
    ],
  },
  {
    id: "finish", eyebrow: "The Finish", title: "", alt: "",
    materials: [
      {
        id: "natural-oils", short: "Natural Oils", name: "Natural oils", descriptor: "Finished to be touched.",
        body: "We finish exposed wood with plant-based oils [confirm type, e.g. linseed or tung] that soak into the grain rather than sealing it under a plastic coating. The wood stays warm and tactile, and small marks can be refreshed with a new coat of oil.",
        where: "Every exposed wood surface.",
        alt: "Clear oil being wiped into oak grain",
      },
    ],
  },
];

export const ALL_MATERIALS = MATERIAL_GROUPS.flatMap((g) => g.materials.map((m) => ({ ...m, group: g.eyebrow })));

export const MATERIALS_PENDING = {
  latex: "[Our sofas, chairs and ottoman currently list organic latex in their seat cushions and foundations. Confirm before publishing, or scope this to the mattress.]",
  glue: "[Confirm \"no glue\" applies to the furniture as well as the mattress; if not, scope it: \"No glue in our mattresses.\"]",
  sofaCushions: "[Confirm cushion build, e.g. kapok core · wrapped in organic wool · organic cotton ticking · upholstery fabric.]",
  fireReport: "[Link test report.]",
  furnitureFire: "[Confirm furniture compliance, e.g. California TB 117-2013, and add it here.]",
  fireReportShort: "[Link report.]",
  furnitureFireShort: "[Add furniture standard once confirmed.]",
  swatchKit: "[If a swatch kit exists: Order a swatch kit and feel the wool, linen and bouclé at home.]",
  consultation: "[Book a consultation]",
};
