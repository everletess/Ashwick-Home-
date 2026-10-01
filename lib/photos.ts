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
import marloweStudio from "@/assets/photos/marlowe-studio.jpg";
import pembroke1 from "@/assets/photos/pembroke-1.jpg";
import pembroke2 from "@/assets/photos/pembroke-2.jpg";
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
  "marlowe-studio": marloweStudio,
  "pembroke-1": pembroke1,
  "pembroke-2": pembroke2,
  "pembroke-italian-coco": pembrokeItalianCoco,
  "pembroke-italian-ivory": pembrokeItalianIvory,
  "pembroke-italian-moss": pembrokeItalianMoss,
} satisfies Record<string, StaticImageData>;

export type PhotoKey = keyof typeof PHOTOS;
