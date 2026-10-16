// Home page feature announcing the mattress collection.
import Link from "next/link";
import { Photo } from "@/components/photo";
import { LIVING_WOOL_PATH, MATTRESS, MATTRESS_PATH } from "@/lib/mattress";

export function MattressFeature() {
  return (
    <section className="sec linen m-feature">
      <div className="wrap m-feature-in">
        <Link href={MATTRESS_PATH} className="m-feature-img" aria-label={`${MATTRESS.title}, shown in Mocha Mousse`}>
          <Photo src="mattress-mocha-bedroom" label="The Ashwick mattress in Mocha Mousse, shown in a sunlit bedroom" sizes="(max-width: 960px) 100vw, 50vw" />
        </Link>
        <div className="m-feature-t">
          <div className="eyebrow">Now introducing</div>
          <h2 className="h2">The Ashwick Home Luxury Organic Mattress Collection</h2>
          <p className="m-feature-tag">Dare to sleep in color.</p>
          <p className="body">
            Living Wool, Swedish horsehair and organic cotton, hand-tufted and made in color. An {MATTRESS.mattressHeight} mattress with a {MATTRESS.topperHeight} topper included: {MATTRESS.combinedHeight} of natural fiber, with no foam, no latex and no chemical flame retardants.
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
            <Link href={MATTRESS_PATH} className="btn">Discover the mattress</Link>
            <Link href={LIVING_WOOL_PATH} className="btn ghost">Living Wool</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
