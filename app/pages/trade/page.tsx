import type { Metadata } from "next";
import Link from "next/link";
import { HospitalityForm, ScrollLink, TradeApplyForm } from "@/components/forms";
import { Photo, SwatchGrid } from "@/components/photo";
import { MaterialsBlock } from "@/components/sections";
import type { PhotoKey } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Trade",
  description: "Organic furniture for designers, architects and hospitality, handmade to order in the USA.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";

const BENEFITS: [string, string, string][] = [
  ["01", "Trade terms", "[TRADE TERMS]"],
  ["02", "Made to order", "Every piece is built by hand in our American workshop once the order is placed."],
  ["03", "Custom and bespoke", "Specify fabric, seat depth, length and wood finish, or commission a piece that doesn’t exist yet."],
  ["04", "Personal support", "Talk through proportions, materials and specification with us before you order."],
];

const TILES: [string, string, PhotoKey][] = [
  ["Sofas", "/collections/sofas", "csofa-b"],
  ["Chairs", "/collections/chairs", "cchair-studio"],
  ["Design your own", "/pages/design-your-own", "frame-fill-cover"],
];

export default function TradePage() {
  return (
    <main>
      <div className="wrap page-head">
        <div className="eyebrow">Ashwick Trade</div>
        <h1 className="h1">For designers, architects and hospitality.</h1>
        <p className="body">
          Already a member? <Link href="/account" className="inl">Sign in</Link> to your trade account.
        </p>
      </div>
      <div className="wrap">
        <nav className="tabs" aria-label="On this page">
          <ScrollLink to="program">Trade program</ScrollLink>
          <ScrollLink to="hospitality">Hospitality</ScrollLink>
          <ScrollLink to="swatches">Swatches</ScrollLink>
          <ScrollLink to="apply">Apply</ScrollLink>
        </nav>
        <div className="trade-hero">
          <Photo src="csofa-a" label="The Cotswold in a living room" sizes="(max-width: 1440px) 100vw, 1328px" preload />
        </div>
      </div>

      <section className="sec">
        <div className="wrap offer-grid">
          {BENEFITS.map(([n, t, d]) => (
            <div className="tstep" key={n}>
              <div className="proc-n">{n}</div>
              <h2 className="proc-h">{t}</h2>
              <p className="body small">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec linen" id="program">
        <div className="wrap process">
          <div className="proc">
            <div className="proc-v"><Photo src="marlowe-2" label="The Marlowe" sizes={HALF} /></div>
            <div className="proc-t">
              <div className="eyebrow">The trade program</div>
              <h2 className="proc-h">Organic furniture, specified to your project.</h2>
              <p className="body">For interior designers, architects and stylists working on residential projects. Order any piece as designed or customized, request fabric swatches, and place orders through your trade account.</p>
              <p className="body">Solid hardwood, organic latex, organic wool, coconut coir and natural oils. No polyurethane foam, no chemical flame retardants, no plastic.</p>
              <ScrollLink to="apply" className="ulink">Apply for a trade account</ScrollLink>
            </div>
          </div>
          <div className="proc rev" id="hospitality">
            <div className="proc-v"><Photo src="cchair-c" label="Cotswold sofa and chair by the fire" sizes={HALF} /></div>
            <div className="proc-t">
              <div className="eyebrow">Hospitality</div>
              <h2 className="proc-h">Rooms your guests will remember.</h2>
              <p className="body">For hotels, inns, restaurants and private members&rsquo; clubs. Send us the property, the rooms and the pieces you need, and we&rsquo;ll talk it through with you. [HOSPITALITY DETAILS]</p>
              <ScrollLink to="hospitality-form" className="ulink">Send a hospitality request</ScrollLink>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap"><MaterialsBlock /></div>
      </section>

      <section className="sec tint">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">The collection</div>
            <h2 className="h2">Explore the collection.</h2>
          </div>
          <div className="grid3">
            {TILES.map(([t, href, img]) => (
              <Link href={href} className="tile" key={t}>
                <div className="tile-img"><Photo src={img} label={t} sizes="(max-width: 620px) 100vw, (max-width: 1180px) 50vw, 460px" /></div>
                <div className="tile-row"><span className="card-name">{t}</span><span className="ulink">View</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="swatches">
        <div className="wrap proc">
          <div className="proc-t">
            <div className="eyebrow">Fabric swatches</div>
            <h2 className="proc-h">Feel the fabrics before you specify.</h2>
            <p className="body">Physical swatches of our organic linen, organic wool bouclé, brushed organic wool and vegetable-tanned leather, sent to your studio. [SWATCH TERMS]</p>
            <Link href="/pages/fabric-swatches" className="ulink">Request swatches</Link>
          </div>
          <SwatchGrid className="proc-v swgrid" />
        </div>
      </section>

      <section className="statement">
        <div className="eyebrow light">Trade membership</div>
        <div className="member">
          <div>
            <p>Not a member yet?</p>
            <span className="body">Apply below. [APPROVAL DETAILS]</span>
            <ScrollLink to="apply" className="btn light">Apply</ScrollLink>
          </div>
          <div>
            <p>Already a member?</p>
            <span className="body">Sign in to your trade account.</span>
            <Link href="/account" className="btn outline-light">Sign in</Link>
          </div>
        </div>
      </section>

      <section className="sec" id="apply">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">Apply</div>
            <h2 className="h2">Join the trade program.</h2>
            <p className="body" style={{ marginTop: 24 }}>Complete the application and we&apos;ll be in touch to set up your trade account.</p>
            <div className="trade-contact">
              <div className="eyebrow">Trade enquiries</div>
              <p>[TRADE EMAIL]</p>
            </div>
          </div>
          <TradeApplyForm />
        </div>
      </section>

      <section className="sec linen" id="hospitality-form">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">Hospitality</div>
            <h2 className="h2">Send a hospitality request.</h2>
            <p className="body" style={{ marginTop: 24 }}>Tell us about the property and what you need. We&apos;ll be in touch to talk it through.</p>
          </div>
          <HospitalityForm />
        </div>
      </section>
    </main>
  );
}
