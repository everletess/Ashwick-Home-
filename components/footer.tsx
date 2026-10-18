import Link from "next/link";
import { Wordmark } from "@/components/shell";

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
          </div>
          <FootCol
            title="Shop"
            links={[["All pieces", "/collections/all"], ["Sofas", "/collections/sofas"], ["Chairs", "/collections/chairs"], ["Mattress", "/products/luxury-organic-mattress"], ["Bespoke", "/pages/bespoke"], ["Fabric swatches", "/pages/fabric-swatches"]]}
          />
          <FootCol
            title="Ashwick"
            links={[["Our story", "/pages/our-story"], ["Materials", "/pages/materials"], ["Furniture materials", "/pages/furniture-materials"], ["Inside the Ashbury", "/pages/inside-the-ashbury"], ["Care", "/pages/care"], ["Trade", "/pages/trade"]]}
          />
          <FootCol title="Help" links={[["Guarantee & Warranty", "/pages/guarantee-warranty"], ["Delivery", "/pages/delivery"], ["Ordering", "/pages/ordering"], ["FAQs", "/pages/faqs"], ["Contact", "mailto:hello@ashwickhome.com"]]} />
        </div>
        <div className="ftr-bot">
          <span>© 2026 Ashwick Home, LLC</span>
          <span>Handmade in the USA</span>
          <Link href="/pages/trade-terms">Trade terms</Link>
          <Link href="/pages/warranty">Warranty</Link>
          <Link href="/pages/privacy">Privacy</Link>
          <Link href="/pages/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
