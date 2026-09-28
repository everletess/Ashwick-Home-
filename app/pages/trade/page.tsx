import type { Metadata } from "next";
import { ScrollLink, TradeForm } from "@/components/forms";
import { PageHero } from "@/components/sections";

export const metadata: Metadata = {
  title: "Trade",
  description: "Organic furniture for residential and hospitality projects, handmade to order in the USA.",
};

const OFFERS: [string, string][] = [
  ["Every piece, customizable", "Specify fabric, seat depth, length and wood finish on any piece in the collection."],
  ["Fabric swatches", "Physical swatches of our organic linen, organic wool bouclé, brushed organic wool and vegetable-tanned leather."],
  ["Made to order in the USA", "Each piece is built by hand in our American workshop once the order is placed."],
  ["Trade pricing", "[TRADE TERMS]"],
];

const STEPS: [string, string, string][] = [
  ["01", "Apply", "Send us the form below with your firm details."],
  ["02", "Get approved", "We review your application and set up your trade account. [APPROVAL DETAILS]"],
  ["03", "Specify and order", "Choose pieces as designed or customized, request swatches, and place orders through your account."],
];

export default function TradePage() {
  return (
    <main>
      <PageHero
        photo="hero"
        alt="Ashwick interior"
        eyebrow="Trade"
        title="For designers and architects."
        body="Organic furniture for residential and hospitality projects, handmade to order in the USA."
      >
        <div className="btns">
          <ScrollLink to="apply" className="btn light">Apply for a trade account</ScrollLink>
        </div>
      </PageHero>

      <section className="sec">
        <div className="wrap">
          <div className="split-head">
            <div>
              <div className="eyebrow">The trade program</div>
              <h2 className="h2">What we offer the trade.</h2>
            </div>
            <p className="body">Solid hardwood, organic wool, organic linen, kapok and natural oils. No foam, no chemical flame retardants, no plastic. Specified to your project.</p>
          </div>
          <div className="offer-grid">
            {OFFERS.map(([t, d]) => (
              <div className="mat" key={t}>
                <div className="mat-t">{t}</div>
                <p className="mat-d">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec linen">
        <div className="wrap">
          <div className="center-head" style={{ marginBottom: 64 }}>
            <div className="eyebrow">How it works</div>
            <h2 className="h2">Three steps to your first order.</h2>
          </div>
          <div className="tsteps">
            {STEPS.map(([n, t, d]) => (
              <div className="tstep" key={n}>
                <div className="proc-n">{n}</div>
                <h3 className="proc-h">{t}</h3>
                <p className="body">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="apply">
        <div className="wrap trade-apply">
          <div>
            <div className="eyebrow">Apply</div>
            <h2 className="h2">Apply for a trade account.</h2>
            <p className="body" style={{ marginTop: 24 }}>Open to interior designers, architects, stylists and hospitality buyers.</p>
            <div className="trade-contact">
              <div className="eyebrow">Trade enquiries</div>
              <p>[TRADE EMAIL]</p>
            </div>
          </div>
          <TradeForm />
        </div>
      </section>
    </main>
  );
}
