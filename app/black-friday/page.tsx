import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GiftsRow, MiniGroup, NewBadge, OfferBand, StickySuite, SuiteHero, type Mini } from "@/components/bf-push";
import { PHOTOS } from "@/lib/photos";
import { DOG_BED, NOOK } from "@/lib/dog-bed";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { Stars } from "@/components/reviews";
import { cardPrice, productsIn } from "@/lib/products";
import { REVIEWS, reviewsFor } from "@/lib/reviews";
import { BUNDLE_CONFIG, SALE, SLEEP_SUITE, sleepSuitePrice } from "@/lib/sale";

export const metadata: Metadata = {
  title: "Black Friday at Ashwick: 20% off everything",
  description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
  alternates: { canonical: SALE.path },
  openGraph: {
    type: "website",
    siteName: "Ashwick Home",
    title: "Black Friday at Ashwick: 20% off everything",
    description: "20% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress: the Complete Sleep Suite and the Best Friends Bundle.",
    images: [{ url: PHOTOS["bf-share"].src, width: 1200, height: 630, alt: "A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" }],
  },
  twitter: { card: "summary_large_image" },
};

const minPrice = (sizes: { price: number }[]) => Math.min(...sizes.map((z) => z.price));

/** /black-friday, simplified (Tessa's brief, 05/11): hero, offer band, jump chips, name-and-price cards, one review, FAQ. */
export default function BlackFridayPage() {
  if (!SALE.active) notFound();

  const furniture = (cat: "sofas" | "chairs"): Mini[] => productsIn(cat).map((p) => ({ key: p.id, href: "/products/" + p.id, photo: p.cardPhoto ?? p.photos[0], alt: p.name, name: p.name, from: cardPrice(p).price }));
  const suite = sleepSuitePrice(0);
  const groups: { id: string; title: React.ReactNode; items?: Mini[]; pillows?: boolean }[] = [
    { id: "sleep-suite", title: SLEEP_SUITE.name, items: [{ key: "suite", href: SLEEP_SUITE.path, photo: "mattress-mocha-bedroom", alt: "The Ashbury in Sorrel on a light oak bed with two pillows", name: SLEEP_SUITE.name, from: suite.list, now: suite.sale, badge: "Best value" }] },
    { id: "pillows", title: <>Pillows <NewBadge /></>, pillows: true },
    { id: "mattress", title: "Mattress", items: [{ key: "mattress", href: MATTRESS_PATH, photo: "mattress-room-flint", alt: "The Ashbury in Flint on a light oak bed", name: MATTRESS.title, from: minPrice(MATTRESS.sizes), quick: { kind: "mattress" } }] },
    {
      id: "dog-beds", title: "Dog beds",
      items: [
        { key: "dog", href: DOG_BED.path, photo: "dog-bed-sorrel-card", alt: DOG_BED.title, name: DOG_BED.title, from: minPrice(DOG_BED.sizes), quick: { kind: "dog-bed" } },
        { key: "nook", href: NOOK.path, photo: "nook-olive-card", alt: NOOK.title, name: NOOK.title, from: minPrice(NOOK.sizes), quick: { kind: "nook" } },
      ],
    },
    { id: "sofas", title: "Sofas", items: furniture("sofas") },
    { id: "chairs", title: "Chairs", items: furniture("chairs") },
  ];
  const chips: [string, string][] = [
    ["sleep-suite", "Sleep Suite"], ["pillows", "Pillows"], ["gifts", "Gifts under $300"], ["mattress", "Mattress"], ["sofas", "Sofas"], ["chairs", "Chairs"],
  ];

  const rvAll = REVIEWS.filter((r) => ["ashbury", "ashbury-dog-bed", "nook"].includes(r.product));
  const rvCount = rvAll.length;
  const avg = Math.round((rvAll.reduce((a, r) => a + r.rating, 0) / rvCount) * 10) / 10;
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
    <main className="bf2" id="top">
      <SuiteHero />
      <OfferBand />

      <nav className="bf2-chips" aria-label="Jump to a section">
        {chips.map(([id, label]) => <a key={id} href={"#" + id} className="bf2-chip">{label}</a>)}
      </nav>

      {groups.slice(0, 2).map((g) => <MiniGroup key={g.id} {...g} />)}
      <GiftsRow id="gifts" />
      {groups.slice(2).map((g) => <MiniGroup key={g.id} {...g} />)}

      <section className="wrap bf2-rs" aria-label="Customer reviews">
        <p className="bf2-rs-q">&ldquo;{frag}.&rdquo;</p>
        <p className="bf2-rs-top"><Stars rating={avg} /> <span>{rq.author} · {rvCount} reviews</span></p>
      </section>

      <section className="wrap bf2-faq" aria-labelledby="bf2-faq-h">
        <h2 className="bf2-h" id="bf2-faq-h">Good to know</h2>
        <div className="bf-faq">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        <p className="bf-fine">Discount applied automatically at checkout. Taxes calculated at checkout. <Link href="/collections/all">All products</Link></p>
      </section>
      <StickySuite />
    </main>
  );
}
