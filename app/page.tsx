import type { Metadata } from "next";
import Link from "next/link";
import { Fibers } from "@/components/fibers";
import { HeroSlides } from "@/components/hero-slides";
import { Photo } from "@/components/photo";
import { Newsletter } from "@/components/forms";
import { Bedroom, Favorites, HandedDown, LivingRoom, ShopTheHome } from "@/components/home-editorial";
import { OfferBand, SaleHero, StickySuite } from "@/components/bf-push";
import { MATTRESS_PATH } from "@/lib/mattress";
import { SALE } from "@/lib/sale";
import { INSTAGRAM_URL, PINTEREST_URL, STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ashwick Home",
  url: "https://ashwickhome.com",
  email: STUDIO_EMAIL,
  telephone: "+1-773-597-9629",
  address: { "@type": "PostalAddress", streetAddress: "2150 Cesar Chavez St", addressLocality: "San Francisco", addressRegion: "CA", postalCode: "94124", addressCountry: "US" },
  sameAs: [INSTAGRAM_URL, PINTEREST_URL],
};


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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
    <main className="home-main">
      {/* During the sale the page opens on the Black Friday brand hero; the usual hero comes back on its own when it ends. */}
      {SALE.active ? <SaleHero /> : <HomeHero />}
      <OfferBand />
      <Favorites />
      <Fibers />
      <ShopTheHome />
      <LivingRoom />
      <Bedroom />
      <HandedDown />
      <Newsletter />
      <StickySuite />
    </main>
    </>
  );
}
