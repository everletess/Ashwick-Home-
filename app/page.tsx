import Link from "next/link";
import { Newsletter } from "@/components/forms";
import { Fibers } from "@/components/fibers";
import { MattressFeature } from "@/components/mattress-feature";
import { Photo } from "@/components/photo";
import { BlackFridayBand, CategoryRail, Favorites } from "@/components/home-sections";
import { FarmBand, ReviewsRow } from "@/components/home-extras";
import { MATTRESS_PATH } from "@/lib/mattress";
import { SALE } from "@/lib/sale";

function HomeHero() {
  return (
    <section className="hero home-hero">
      <Photo src="hero-family" label="A mother and daughter reading on the Cotswold sofa beside the Cotswold chair, a spaniel asleep beside them, in a sunlit living room" className="hero-img" fill preload />
      {/* These two fade in over the first in turn (CSS only); with reduced motion only the first shows. */}
      <Photo src="mattress-meadow" label="A cutaway of the Ashbury in Sorrel in a meadow, showing the wool, horsehair and pocket coils inside" className="hero-img hero-slide hero-slide-2" fill />
      <Photo src="hero-bedroom" label="A sunlit bedroom with an upholstered bed in rust linen bedding and a pair of textured cream wingback chairs" className="hero-img hero-slide hero-slide-3" fill />
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
      <HomeHero />
      <CategoryRail />
      <BlackFridayBand />
      <MattressFeature />
      <FarmBand />
      <Favorites />
      <Fibers />
      <ReviewsRow />
      <Newsletter />
    </main>
  );
}
