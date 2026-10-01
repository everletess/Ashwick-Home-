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
import pembroke1 from "@/assets/photos/pembroke-1.jpg";
import pembroke2 from "@/assets/photos/pembroke-2.jpg";
import pembrokeBlendDove from "@/assets/photos/pembroke-blend-dove.jpg";
import pembrokeBlendIvory from "@/assets/photos/pembroke-blend-ivory.jpg";
import pembrokeBlendSand from "@/assets/photos/pembroke-blend-sand.jpg";
import pembrokeBlendCoco from "@/assets/photos/pembroke-blend-coco.jpg";
import pembrokeCottonCream from "@/assets/photos/pembroke-cotton-cream.jpg";
import pembrokeCottonKhaki from "@/assets/photos/pembroke-cotton-khaki.jpg";
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
  "pembroke-1": pembroke1,
  "pembroke-2": pembroke2,
  "pembroke-blend-ivory": pembrokeBlendIvory,
  "pembroke-blend-dove": pembrokeBlendDove,
  "pembroke-blend-sand": pembrokeBlendSand,
  "pembroke-blend-coco": pembrokeBlendCoco,
  "pembroke-cotton-cream": pembrokeCottonCream,
  "pembroke-cotton-khaki": pembrokeCottonKhaki,
  "pembroke-italian-coco": pembrokeItalianCoco,
  "pembroke-italian-ivory": pembrokeItalianIvory,
  "pembroke-italian-moss": pembrokeItalianMoss,
} satisfies Record<string, StaticImageData>;

export type PhotoKey = keyof typeof PHOTOS;
