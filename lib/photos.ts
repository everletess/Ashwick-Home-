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
import heroFamily from "@/assets/photos/hero-family.jpg";
import heroBedroom from "@/assets/photos/hero-bedroom.jpg";
import materialsSheep from "@/assets/photos/materials-sheep.jpg";
import fiberAgave from "@/assets/photos/fiber-agave.jpg";
import fiberAgaveCard from "@/assets/photos/fiber-agave-card.jpg";
import bespokeHero from "@/assets/photos/bespoke-hero.jpg";
import bespokeSwatches from "@/assets/photos/bespoke-swatches.jpg";
import bespokeDrawing from "@/assets/photos/bespoke-drawing.jpg";
import bespokeStitching from "@/assets/photos/bespoke-stitching.jpg";
import mattressLayers from "@/assets/photos/mattress-layers.jpg";
import materialsBandFill from "@/assets/photos/materials-band-fill.jpg";
import mattressFeelSoft from "@/assets/photos/mattress-feel-soft-2.jpg";
import mattressFeelFirm from "@/assets/photos/mattress-feel-firm-2.jpg";
import dogBedSorrel from "@/assets/photos/dog-bed-sorrel.jpg";
import dogBedSorrelFront from "@/assets/photos/dog-bed-sorrel-front.jpg";
import dogBedSorrelDetail from "@/assets/photos/dog-bed-sorrel-detail.jpg";
import dogBedFlint from "@/assets/photos/dog-bed-flint.jpg";
import dogBedFlax from "@/assets/photos/dog-bed-flax.jpg";
import dogBedMoss from "@/assets/photos/dog-bed-moss.jpg";
import dogBedFleece from "@/assets/photos/dog-bed-fleece.jpg";
import dogBedMossRoom from "@/assets/photos/dog-bed-moss-room.jpg";
import dogBedSorrelRoom from "@/assets/photos/dog-bed-sorrel-room.jpg";
import dogBedSorrelRoomGolden from "@/assets/photos/dog-bed-sorrel-room-golden.jpg";
import dogBedFleeceRoom from "@/assets/photos/dog-bed-fleece-room.jpg";
import dogBedFlintRoom from "@/assets/photos/dog-bed-flint-room.jpg";
import dogBedFlaxRoom from "@/assets/photos/dog-bed-flax-room.jpg";
import nookOliveRoom from "@/assets/photos/nook-olive-room.jpg";
import nookOliveSizes from "@/assets/photos/nook-olive-sizes.jpg";
import nookOat from "@/assets/photos/nook-oat.jpg";
import nookOlive from "@/assets/photos/nook-olive.jpg";
import nookToffee from "@/assets/photos/nook-toffee.jpg";
import nookSwatchOat from "@/assets/photos/nook-swatch-oat.jpg";
import nookSwatchOlive from "@/assets/photos/nook-swatch-olive.jpg";
import nookSwatchToffee from "@/assets/photos/nook-swatch-toffee.jpg";
import dogBedSorrelSmall from "@/assets/photos/dog-bed-sorrel-small.jpg";
import dogBedSorrelMedium from "@/assets/photos/dog-bed-sorrel-medium.jpg";
import dogBedSorrelLarge from "@/assets/photos/dog-bed-sorrel-large.jpg";
import dogBedFleeceRoom2 from "@/assets/photos/dog-bed-fleece-room-2.jpg";
import dogBedFlintRoom2 from "@/assets/photos/dog-bed-flint-room-2.jpg";
import dogBedMossRoom2 from "@/assets/photos/dog-bed-moss-room-2.jpg";
import dogBedFlaxRoom2 from "@/assets/photos/dog-bed-flax-room-2.jpg";
import dogBedSorrelRoom2 from "@/assets/photos/dog-bed-sorrel-room-2.jpg";
import materialsBandStructure from "@/assets/photos/materials-band-structure.jpg";
import bespokeShare from "@/assets/photos/bespoke-share.jpg";
import bespokeConsult from "@/assets/photos/bespoke-consult.jpg";
import bespokeDelivery from "@/assets/photos/bespoke-delivery.jpg";
import imagineHeadboard from "@/assets/photos/imagine-headboard.jpg";
import imagineBench from "@/assets/photos/imagine-bench.jpg";
import imagineChairs from "@/assets/photos/imagine-chairs.jpg";
import imagineFourPoster from "@/assets/photos/imagine-four-poster.jpg";
import imagineBaySofa from "@/assets/photos/imagine-bay-sofa.jpg";
import imagineDaybed from "@/assets/photos/imagine-daybed.jpg";
import bespokeSketch from "@/assets/photos/bespoke-sketch.jpg";
import mattressRoomDove from "@/assets/photos/mattress-room-dove.jpg";
import mattressRoomSafari from "@/assets/photos/mattress-room-safari.jpg";
import mattressRoomNatural from "@/assets/photos/mattress-room-natural.jpg";
import mattressRoomKhaki from "@/assets/photos/mattress-room-khaki.jpg";
import mattressRoomMoss from "@/assets/photos/mattress-room-moss.jpg";
import mattressRoomHazel from "@/assets/photos/mattress-room-hazel.jpg";
import mattressRoomFlax from "@/assets/photos/mattress-room-flax.jpg";
import mattressRoomSorrel from "@/assets/photos/mattress-room-sorrel.jpg";
import mattressRoomFleece from "@/assets/photos/mattress-room-fleece.jpg";
import mattressRoomFlint from "@/assets/photos/mattress-room-flint.jpg";
import materialsOil from "@/assets/photos/materials-oil.jpg";
import furnitureFamily from "@/assets/photos/furniture-family.jpg";
import materialsBandFurniture from "@/assets/photos/materials-band-furniture.jpg";
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
import mattressCutawayFleece from "@/assets/photos/mattress-cutaway-fleece.jpg";
import mattressCutawayFlint from "@/assets/photos/mattress-cutaway-flint.jpg";
import mattressCutawayFlax from "@/assets/photos/mattress-cutaway-flax.jpg";
import mattressCutawayMoss from "@/assets/photos/mattress-cutaway-moss.jpg";
// "Naturally layered" labelled cutaways, one per color (the first numbered versions are kept, unused).
import mattressLayersSorrel from "@/assets/photos/mattress-layers-sorrel-2.jpg";
import mattressLayersFleece from "@/assets/photos/mattress-layers-fleece-2.jpg";
import mattressLayersFlint from "@/assets/photos/mattress-layers-flint-2.jpg";
import mattressLayersFlax from "@/assets/photos/mattress-layers-flax-2.jpg";
import mattressLayersMoss from "@/assets/photos/mattress-layers-moss-2.jpg";
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
import pembrokeBelgianCoco from "@/assets/photos/pembroke-belgian-coco.jpg";
import pembrokeBelgianIvory from "@/assets/photos/pembroke-belgian-ivory.jpg";
import pembrokeBelgianMoss from "@/assets/photos/pembroke-belgian-moss.jpg";

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
  "hero-family": heroFamily,
  "hero-bedroom": heroBedroom,
  "materials-sheep": materialsSheep,
  "fiber-agave": fiberAgave,
  "fiber-agave-card": fiberAgaveCard,
  "bespoke-hero": bespokeHero,
  "bespoke-swatches": bespokeSwatches,
  "bespoke-drawing": bespokeDrawing,
  "bespoke-stitching": bespokeStitching,
  "mattress-layers": mattressLayers,
  "materials-band-fill": materialsBandFill,
  "mattress-feel-soft": mattressFeelSoft,
  "mattress-feel-firm": mattressFeelFirm,
  "dog-bed-sorrel": dogBedSorrel,
  "dog-bed-sorrel-front": dogBedSorrelFront,
  "dog-bed-sorrel-detail": dogBedSorrelDetail,
  "dog-bed-flint": dogBedFlint,
  "dog-bed-flax": dogBedFlax,
  "dog-bed-moss": dogBedMoss,
  "dog-bed-fleece": dogBedFleece,
  "dog-bed-moss-room": dogBedMossRoom,
  "dog-bed-sorrel-room": dogBedSorrelRoom,
  "dog-bed-sorrel-room-golden": dogBedSorrelRoomGolden,
  "dog-bed-fleece-room": dogBedFleeceRoom,
  "dog-bed-flint-room": dogBedFlintRoom,
  "dog-bed-flax-room": dogBedFlaxRoom,
  "nook-olive-room": nookOliveRoom,
  "nook-olive-sizes": nookOliveSizes,
  "nook-oat": nookOat,
  "nook-olive": nookOlive,
  "nook-toffee": nookToffee,
  "nook-swatch-oat": nookSwatchOat,
  "nook-swatch-olive": nookSwatchOlive,
  "nook-swatch-toffee": nookSwatchToffee,
  "dog-bed-sorrel-small": dogBedSorrelSmall,
  "dog-bed-sorrel-medium": dogBedSorrelMedium,
  "dog-bed-sorrel-large": dogBedSorrelLarge,
  "dog-bed-fleece-room-2": dogBedFleeceRoom2,
  "dog-bed-flint-room-2": dogBedFlintRoom2,
  "dog-bed-moss-room-2": dogBedMossRoom2,
  "dog-bed-flax-room-2": dogBedFlaxRoom2,
  "dog-bed-sorrel-room-2": dogBedSorrelRoom2,
  "materials-band-structure": materialsBandStructure,
  "bespoke-share": bespokeShare,
  "bespoke-consult": bespokeConsult,
  "bespoke-delivery": bespokeDelivery,
  "imagine-headboard": imagineHeadboard,
  "imagine-bench": imagineBench,
  "imagine-chairs": imagineChairs,
  "imagine-four-poster": imagineFourPoster,
  "imagine-bay-sofa": imagineBaySofa,
  "imagine-daybed": imagineDaybed,
  "bespoke-sketch": bespokeSketch,
  "mattress-room-dove": mattressRoomDove,
  "mattress-room-safari": mattressRoomSafari,
  "mattress-room-natural": mattressRoomNatural,
  "mattress-room-khaki": mattressRoomKhaki,
  "mattress-room-moss": mattressRoomMoss,
  "mattress-room-hazel": mattressRoomHazel,
  "mattress-room-flax": mattressRoomFlax,
  "mattress-room-sorrel": mattressRoomSorrel,
  "mattress-room-fleece": mattressRoomFleece,
  "mattress-room-flint": mattressRoomFlint,
  "materials-oil": materialsOil,
  "furniture-family": furnitureFamily,
  "materials-band-furniture": materialsBandFurniture,
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
  "mattress-cutaway-fleece": mattressCutawayFleece,
  "mattress-cutaway-flint": mattressCutawayFlint,
  "mattress-cutaway-flax": mattressCutawayFlax,
  "mattress-cutaway-moss": mattressCutawayMoss,
  "mattress-layers-sorrel": mattressLayersSorrel,
  "mattress-layers-fleece": mattressLayersFleece,
  "mattress-layers-flint": mattressLayersFlint,
  "mattress-layers-flax": mattressLayersFlax,
  "mattress-layers-moss": mattressLayersMoss,
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
  "pembroke-belgian-coco": pembrokeBelgianCoco,
  "pembroke-belgian-ivory": pembrokeBelgianIvory,
  "pembroke-belgian-moss": pembrokeBelgianMoss,
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
