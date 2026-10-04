import Link from "next/link";
import { Wordmark } from "@/components/shell";

// "#" links point at pages that are not designed yet (see docs/design-handoff/README.md).
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
            links={[["All pieces", "/collections/all"], ["Sofas", "/collections/sofas"], ["Chairs", "/collections/chairs"], ["Design your own", "/pages/design-your-own"], ["Fabric swatches", "/pages/fabric-swatches"]]}
          />
          <FootCol
            title="Ashwick"
            links={[["Our story", "/pages/our-story"], ["Materials", "/pages/materials"], ["Care", "#"], ["Trade", "/pages/trade"]]}
          />
          <FootCol title="Help" links={[["Delivery", "#"], ["Ordering", "#"], ["FAQs", "#"], ["Contact", "#"]]} />
        </div>
        <div className="ftr-bot">
          <span>© 2026 Ashwick Home, LLC</span>
          <span>Handmade in the USA</span>
          <a href="#">Instagram</a>
          <a href="#">Pinterest</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
