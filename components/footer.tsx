import Link from "next/link";
import { Wordmark } from "@/components/shell";
import { INSTAGRAM_URL, PINTEREST_URL, STUDIO_EMAIL, STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="fcol">
      <div className="fcol-t">{title}</div>
      {links.map(([label, href]) =>
        href.startsWith("/") ? <Link key={label} href={href}>{label}</Link> : <a key={label} href={href}>{label}</a>,
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Wordmark />
            <p className="ftr-contact">
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
              <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>
            </p>
          </div>
          <FootCol
            title="Shop"
            links={[["All pieces", "/collections/all"], ["Sofas", "/collections/sofas"], ["Chairs", "/collections/chairs"], ["Mattress", "/products/luxury-organic-mattress"], ["Bespoke", "/pages/bespoke"], ["Fabric swatches", "/pages/fabric-swatches"]]}
          />
          <FootCol
            title="Ashwick"
            links={[["Our story", "/pages/our-story"], ["Materials", "/pages/materials"], ["Furniture materials", "/pages/furniture-materials"], ["Inside the Ashbury", "/pages/inside-the-ashbury"], ["Care", "/pages/care"], ["Trade", "/pages/trade"]]}
          />
          <FootCol title="Help" links={[["Guarantee & Warranty", "/pages/guarantee-warranty"], ["Delivery", "/pages/delivery"], ["Ordering", "/pages/ordering"], ["FAQs", "/pages/faqs"], ["Contact", `mailto:${STUDIO_EMAIL}`]]} />
        </div>
        <div className="ftr-bot">
          <span>© 2026 Ashwick Home, LLC</span>
          <span>Handmade in the USA</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={PINTEREST_URL} target="_blank" rel="noopener noreferrer">Pinterest</a>
          <Link href="/pages/trade-terms">Trade terms</Link>
          <Link href="/pages/warranty">Furniture warranty</Link>
          <Link href="/pages/privacy">Privacy</Link>
          <Link href="/pages/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
