// Photography, imported statically so next/image knows each file's size and can
// generate responsive variants and blur placeholders.
import type { StaticImageData } from "next/image";

import burford1 from "@/assets/photos/burford-1.jpg";
import burford2 from "@/assets/photos/burford-2.jpg";
import burford3 from "@/assets/photos/burford-3.jpg";
import burfordHero from "@/assets/photos/burford-hero.jpg";
import cchairC from "@/assets/photos/cchair-c.jpg";
import cchairStudio from "@/assets/photos/cchair-studio.jpg";
import chatsworthS1 from "@/assets/photos/chatsworth-s1.jpg";
import cliftonS1 from "@/assets/photos/clifton-s1.jpg";
import cliftonS2 from "@/assets/photos/clifton-s2.jpg";
import csofaA from "@/assets/photos/csofa-a.jpg";
import csofaB from "@/assets/photos/csofa-b.jpg";
import csofaC from "@/assets/photos/csofa-c.jpg";
import csofaD from "@/assets/photos/csofa-d.jpg";
import csofaHero from "@/assets/photos/csofa-hero.jpg";
import csofaHeroSquare from "@/assets/photos/csofa-hero-square.jpg";
import csofaStudio from "@/assets/photos/csofa-studio.jpg";
import csofaLifestyle from "@/assets/photos/csofa-lifestyle.jpg";
import mattressMeadow from "@/assets/photos/mattress-meadow.jpg";
import materialsPocketCoils from "@/assets/photos/materials-pocket-coils.jpg";
import workshopMattress from "@/assets/photos/workshop-mattress.jpg";
import workshopSofa from "@/assets/photos/workshop-sofa.jpg";
import fiberWool from "@/assets/photos/fiber-wool.jpg";
import fiberHorsehair from "@/assets/photos/fiber-horsehair.jpg";
import fiberCotton from "@/assets/photos/fiber-cotton.jpg";
import fiberCoir from "@/assets/photos/fiber-coir.jpg";
import fiberWood from "@/assets/photos/fiber-wood.jpg";
import fiberKashmir from "@/assets/photos/fiber-kashmir.jpg";
import frameFillCover from "@/assets/photos/frame-fill-cover.jpg";
import hero from "@/assets/photos/hero.jpg";
import marlowe1 from "@/assets/photos/marlowe-1.jpg";
import marlowe2 from "@/assets/photos/marlowe-2.jpg";
import marloweSofaWalnutLinen from "@/assets/photos/marlowe-sofa-walnut-linen.jpg";
import marloweSofaOakLinen from "@/assets/photos/marlowe-sofa-oak-linen.jpg";
import marloweLoveseatWalnutLinen from "@/assets/photos/marlowe-loveseat-walnut-linen.jpg";
import marloweChairWalnutLinen from "@/assets/photos/marlowe-chair-walnut-linen.jpg";
import marloweOttomanWalnutLinen from "@/assets/photos/marlowe-ottoman-walnut-linen.jpg";
import marloweSofaOakCorkNatural from "@/assets/photos/marlowe-sofa-oak-cork-natural.jpg";
import marloweSofaOakCorkIvory from "@/assets/photos/marlowe-sofa-oak-cork-ivory.jpg";
import marloweSofaOakCorkIvory2 from "@/assets/photos/marlowe-sofa-oak-cork-ivory-2.jpg";
import marloweStudio from "@/assets/photos/marlowe-studio.jpg";
import materialsRosettes from "@/assets/photos/materials-rosettes.jpg";
import materialsCashmere from "@/assets/photos/materials-cashmere.jpg";
import materialsBandBlend from "@/assets/photos/materials-band-blend.jpg";
import materialsLinen from "@/assets/photos/materials-linen.jpg";
import materialsWool from "@/assets/photos/materials-wool.jpg";
import materialsHorsehair from "@/assets/photos/materials-horsehair.jpg";
import materialsBandFillings from "@/assets/photos/materials-band-fillings.jpg";
import materialsBandFabrics from "@/assets/photos/materials-band-fabrics.jpg";
import materialsBoucle from "@/assets/photos/materials-boucle.jpg";
import materialsCottonRosette from "@/assets/photos/materials-cotton-rosette.jpg";
import marloweLoveseatCard from "@/assets/photos/marlowe-loveseat-card.jpg";
import marloweChairCard from "@/assets/photos/marlowe-chair-card.jpg";
import marloweOttomanCard from "@/assets/photos/marlowe-ottoman-card.jpg";
import mattressMochaRoom from "@/assets/photos/mattress-mocha-room.jpg";
import mattressSafariRoom from "@/assets/photos/mattress-safari-room.jpg";
import mattressCutaway from "@/assets/photos/mattress-cutaway.jpg";
import mattressSwatchMocha from "@/assets/photos/mattress-swatch-mocha.jpg";
import mattressSwatchSafari from "@/assets/photos/mattress-swatch-safari.jpg";
import mattressSwatchDove from "@/assets/photos/mattress-swatch-dove.jpg";
import mattressStudioHazel from "@/assets/photos/mattress-studio-hazel.jpg";
import mattressSwatchHazel from "@/assets/photos/mattress-swatch-hazel.jpg";
import mattressStudioKhaki from "@/assets/photos/mattress-studio-khaki.jpg";
import mattressStudioSafari from "@/assets/photos/mattress-studio-safari.jpg";
import mattressStudioMocha from "@/assets/photos/mattress-studio-mocha.jpg";
import mattressStudioNatural from "@/assets/photos/mattress-studio-natural.jpg";
import mattressStudioDove from "@/assets/photos/mattress-studio-dove.jpg";
import mattressSwatchNatural from "@/assets/photos/mattress-swatch-natural.jpg";
import mattressColors from "@/assets/photos/mattress-colors.jpg";
import mattressMochaBedroom from "@/assets/photos/mattress-mocha-bedroom.jpg";
import mattressSwatchKhaki from "@/assets/photos/mattress-swatch-khaki.jpg";
import pembroke1 from "@/assets/photos/pembroke-1.jpg";
import pembroke2 from "@/assets/photos/pembroke-2.jpg";
import pembrokeBlendDove from "@/assets/photos/pembroke-blend-dove.jpg";
import pembrokeBlendIvory from "@/assets/photos/pembroke-blend-ivory.jpg";
import pembrokeBlendSand from "@/assets/photos/pembroke-blend-sand.jpg";
import pembrokeBlendCoco from "@/assets/photos/pembroke-blend-coco.jpg";
import pembrokeCottonCream from "@/assets/photos/pembroke-cotton-cream.jpg";
import pembrokeCottonKhaki from "@/assets/photos/pembroke-cotton-khaki.jpg";
import pembrokeCottonNatural from "@/assets/photos/pembroke-cotton-natural.jpg";
import pembrokeItalianCoco from "@/assets/photos/pembroke-italian-coco.jpg";
import pembrokeItalianIvory from "@/assets/photos/pembroke-italian-ivory.jpg";
import pembrokeItalianMoss from "@/assets/photos/pembroke-italian-moss.jpg";

export const PHOTOS = {
  "burford-1": burford1,
  "burford-2": burford2,
  "burford-3": burford3,
  "burford-hero": burfordHero,
  "cchair-c": cchairC,
  "cchair-studio": cchairStudio,
  "chatsworth-s1": chatsworthS1,
  "clifton-s1": cliftonS1,
  "clifton-s2": cliftonS2,
  "csofa-a": csofaA,
  "csofa-b": csofaB,
  "csofa-c": csofaC,
  "csofa-d": csofaD,
  "csofa-hero": csofaHero,
  "csofa-hero-square": csofaHeroSquare,
  "csofa-studio": csofaStudio,
  "csofa-lifestyle": csofaLifestyle,
  "mattress-meadow": mattressMeadow,
  "materials-pocket-coils": materialsPocketCoils,
  "workshop-mattress": workshopMattress,
  "workshop-sofa": workshopSofa,
  "fiber-wool": fiberWool,
  "fiber-horsehair": fiberHorsehair,
  "fiber-cotton": fiberCotton,
  "fiber-coir": fiberCoir,
  "fiber-wood": fiberWood,
  "fiber-kashmir": fiberKashmir,
  "frame-fill-cover": frameFillCover,
  "hero": hero,
  "marlowe-1": marlowe1,
  "marlowe-2": marlowe2,
  "marlowe-sofa-walnut-linen": marloweSofaWalnutLinen,
  "marlowe-sofa-oak-linen": marloweSofaOakLinen,
  "marlowe-loveseat-walnut-linen": marloweLoveseatWalnutLinen,
  "marlowe-chair-walnut-linen": marloweChairWalnutLinen,
  "marlowe-ottoman-walnut-linen": marloweOttomanWalnutLinen,
  "marlowe-sofa-oak-cork-natural": marloweSofaOakCorkNatural,
  "marlowe-sofa-oak-cork-ivory": marloweSofaOakCorkIvory,
  "marlowe-sofa-oak-cork-ivory-2": marloweSofaOakCorkIvory2,
  "marlowe-studio": marloweStudio,
  "materials-rosettes": materialsRosettes,
  "materials-cashmere": materialsCashmere,
  "materials-band-blend": materialsBandBlend,
  "materials-linen": materialsLinen,
  "materials-wool": materialsWool,
  "materials-horsehair": materialsHorsehair,
  "materials-band-fillings": materialsBandFillings,
  "materials-band-fabrics": materialsBandFabrics,
  "materials-boucle": materialsBoucle,
  "materials-cotton-rosette": materialsCottonRosette,
  "marlowe-loveseat-card": marloweLoveseatCard,
  "marlowe-chair-card": marloweChairCard,
  "marlowe-ottoman-card": marloweOttomanCard,
  "mattress-mocha-room": mattressMochaRoom,
  "mattress-safari-room": mattressSafariRoom,
  "mattress-cutaway": mattressCutaway,
  "mattress-swatch-mocha": mattressSwatchMocha,
  "mattress-swatch-safari": mattressSwatchSafari,
  "mattress-swatch-dove": mattressSwatchDove,
  "mattress-studio-hazel": mattressStudioHazel,
  "mattress-swatch-hazel": mattressSwatchHazel,
  "mattress-studio-khaki": mattressStudioKhaki,
  "mattress-studio-safari": mattressStudioSafari,
  "mattress-studio-mocha": mattressStudioMocha,
  "mattress-studio-natural": mattressStudioNatural,
  "mattress-studio-dove": mattressStudioDove,
  "mattress-swatch-natural": mattressSwatchNatural,
  "mattress-colors": mattressColors,
  "mattress-mocha-bedroom": mattressMochaBedroom,
  "mattress-swatch-khaki": mattressSwatchKhaki,
  "pembroke-1": pembroke1,
  "pembroke-2": pembroke2,
  "pembroke-blend-ivory": pembrokeBlendIvory,
  "pembroke-blend-dove": pembrokeBlendDove,
  "pembroke-blend-sand": pembrokeBlendSand,
  "pembroke-blend-coco": pembrokeBlendCoco,
  "pembroke-cotton-cream": pembrokeCottonCream,
  "pembroke-cotton-khaki": pembrokeCottonKhaki,
  "pembroke-cotton-natural": pembrokeCottonNatural,
  "pembroke-italian-coco": pembrokeItalianCoco,
  "pembroke-italian-ivory": pembrokeItalianIvory,
  "pembroke-italian-moss": pembrokeItalianMoss,
} satisfies Record<string, StaticImageData>;

export type PhotoKey = keyof typeof PHOTOS;

/**
 * Photos whose upholstery can be recolored on the product page, with the fabric's lit color in the photo.
 * Each has a mask of just the upholstery in public/tint/<key>.png (made from the photo with background removal).
 */
export const TINTABLE: Partial<Record<PhotoKey, string>> = {
  "marlowe-sofa-walnut-linen": "#dfd7d1",
  "marlowe-sofa-oak-linen": "#e2dcd5",
  "marlowe-loveseat-walnut-linen": "#e1d6cd",
  "marlowe-chair-walnut-linen": "#ddd1c7",
  "marlowe-ottoman-walnut-linen": "#d8cbc0",
  "chatsworth-s1": "#ccbbac",
  "csofa-hero": "#dfd7d3",
  "csofa-studio": "#e9e1db",
  "burford-1": "#d4c4b9",
  "cchair-studio": "#d6c4b8",
};

/**
 * Color to multiply a tintable photo's upholstery by so it reads as `target`. `shown` is the swatch of the
 * fabric color the photo actually shows; scaling relative to it keeps the steps between swatches (White to
 * Cream to Oatmeal) as visible on the sofa as they are on the swatches.
 */
export function tintFor(key: PhotoKey, target: string, shown?: string): string | undefined {
  if (!TINTABLE[key]) return;
  const base = shown ?? TINTABLE[key];
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return "#" + [0, 1, 2]
    .map((i) => Math.min(255, Math.round((ch(target, i) / ch(base, i)) * 255)).toString(16).padStart(2, "0"))
    .join("");
}
