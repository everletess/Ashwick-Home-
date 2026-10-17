// Home page feature announcing the mattress collection.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { MATTRESS, MATTRESS_PATH } from "@/lib/mattress";
import { ASHBURY_PATH } from "@/lib/materials";

export function MattressFeature() {
  return (
    <section className="sec linen m-feature">
      <div className="wrap m-feature-in">
        <Link href={MATTRESS_PATH} className="m-feature-img" aria-label={`${MATTRESS.title}, shown in Sorrel`}>
          <Photo src="mattress-mocha-bedroom" label="The Ashbury in Sorrel, shown in a sunlit bedroom." sizes="(max-width: 960px) 100vw, 50vw" />
        </Link>
        <div className="m-feature-t">
          <div className="m-feature-new"><span>New</span>Now introducing</div>
          <h2 className="h2">{MATTRESS.title}</h2>
          <p className="m-feature-coll">{MATTRESS.collection}</p>
          <p className="m-feature-tag">Dare to dream in color.</p>
          <p className="body">
            An all-natural, organic mattress made from nature&apos;s finest materials: Living Wool, cashmere, Swedish horsehair and organic cotton, hand-tufted and made in five colors.
          </p>
          <ul className="m-feature-colors" aria-label="Colors">
            {MATTRESS.colors.map((c) => (
              <li key={c.id}>
                <Link href={MATTRESS_PATH} title={c.label}>
                  <span className="m-feature-chip"><Photo src={c.swatch} label="" sizes="56px" /></span>
                  <span className="m-feature-name">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="btns">
            <Link href={MATTRESS_PATH} className="btn">Discover the Ashbury</Link>
            <Link href={ASHBURY_PATH} className="btn ghost">Inside the Ashbury</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
