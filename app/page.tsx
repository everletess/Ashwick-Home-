import Link from "next/link";
import { Fibers } from "@/components/fibers";
import { MattressFeature } from "@/components/mattress-feature";
import { HeroSlides } from "@/components/hero-slides";
import { Photo } from "@/components/photo";
import { CategoryRail, Favorites } from "@/components/home-sections";
import { GiftsRow, OfferBand, PillowSlim, SaleHero, StickySuite } from "@/components/bf-push";
import { MATTRESS_PATH } from "@/lib/mattress";
import { SALE } from "@/lib/sale";

function HomeHero() {
  return (
    <section className="hero home-hero">
      <Photo src="hero-family" label="A mother and daughter reading on the Cotswold sofa beside the Cotswold chair, a spaniel asleep beside them, in a sunlit living room" className="hero-img" fill preload />
      <HeroSlides />
      <div className="hero-scrim home-scrim"></div>
      <div className="hero-txt">
        <div className="eyebrow">Organic furniture · Handmade in the USA</div>
        <h1 className="h1">Made of nature. Built to last.</h1>
        <p className="hero-body">
          Furniture made by hand and born in nature.
        </p>
        <div className="btns">
          <Link href={SALE.active ? SALE.path : MATTRESS_PATH} className="btn light">{SALE.active ? `Shop ${SALE.name}` : "Shop the Ashbury"}</Link>
          <Link href="/collections/all" className="btn outline-light">Shop all</Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* During the sale the page opens on the Sleep Suite; the brand hero comes back on its own when it ends. */}
      {SALE.active ? <SaleHero /> : <HomeHero />}
      <OfferBand />
      <CategoryRail />
      <Favorites />
      <GiftsRow />
      <PillowSlim />
      <MattressFeature />
      <Fibers />
      <StickySuite />
    </main>
  );
}
