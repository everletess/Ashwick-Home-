import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StickySuite } from "@/components/bf-push";
import { BestFriendsDeal, DealsBar, FurnitureDeal, GiftsDeal, HolidayDelivery, HolidayHero, SuiteDeal } from "@/components/holiday-edit";
import { Stars } from "@/components/reviews";
import { getLivePrices } from "@/lib/live-prices";
import { PHOTOS } from "@/lib/photos";
import { reviewsFor } from "@/lib/reviews";
import { BUNDLE_CONFIG, SALE } from "@/lib/sale";

export const metadata: Metadata = {
  title: "The Holiday Edit: 20% off everything at Ashwick",
  description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
  alternates: { canonical: SALE.path },
  openGraph: {
    type: "website",
    siteName: "Ashwick Home",
    title: "The Holiday Edit: 20% off everything at Ashwick",
    description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
    images: [{ url: PHOTOS["bf-share"].src, width: 1200, height: 630, alt: "A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" }],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * /black-friday, the Holiday Edit (Tessa's brief, 05/11): a seasonal hero, a sticky deals bar, three numbered deals with
 * live Shopify prices, gifts under $300, holiday delivery, one review and the FAQ. After the sale it redirects to all
 * products (SALE.active turns off on its own at SALE.endsAt; pages regenerate every 5 minutes).
 */
export default async function BlackFridayPage() {
  if (!SALE.active) redirect("/collections/all");
  const prices = await getLivePrices();

  // The quote is an Ashbury review, so the stars and count are the Ashbury's: the same figures as its page and card.
  const { count: rvCount, average: avg } = reviewsFor("ashbury");
  const frag = "The Ashbury is not only gorgeous it’s the most comfortable mattress I’ve ever slept on";
  const rq = reviewsFor("ashbury").items.find((x) => x.body.includes(frag));
  if (!rq) throw new Error("review quote not found: " + frag);
  const faq: [string, string][] = [
    ["When will it ship?", "Mattresses and dog beds ship within 3–4 days of your order. Furniture as designed ships within 3–4 weeks; customized furniture within 8–12 weeks."],
    ["What is the return policy?", "Mattress: a 100-night trial, with a 30-night minimum before you request a return. Dog beds: 30 days from delivery. Furniture as designed: 14 days from delivery, unused, less return shipping and a 15% restocking fee. Customized furniture is final sale."],
    ["What does white glove delivery cost?", `$${BUNDLE_CONFIG.whiteGloveValue} per mattress and a flat $450 per order for furniture, however many pieces. It is free for the mattress in a bundle.`],
    ["Can I pay in installments?", "Yes. Shop Pay Installments is offered at checkout on the mattress and on furniture, subject to approval."],
  ];

  return (
    <main className="hx" data-price-source={prices.source}>
      <HolidayHero />
      <DealsBar />
      <SuiteDeal prices={prices} />
      <BestFriendsDeal prices={prices} />
      <FurnitureDeal prices={prices} />
      <GiftsDeal prices={prices} />
      <HolidayDelivery />
      <section className="wrap bf2-rs" aria-label="Customer reviews">
        <p className="bf2-rs-q">&ldquo;{frag}.&rdquo;</p>
        <p className="bf2-rs-top"><Stars rating={avg} /> <span>{rq.author} · {rvCount} Ashbury reviews</span></p>
      </section>

      <section className="wrap bf2-faq" aria-labelledby="bf2-faq-h">
        <h2 className="bf2-h" id="bf2-faq-h">Good to know</h2>
        <div className="bf-faq">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        <p className="bf-fine">Discount applied automatically at checkout. Taxes calculated at checkout. <Link href="/collections/all">All products</Link></p>
      </section>
      <StickySuite page="deals" />
    </main>
  );
}
