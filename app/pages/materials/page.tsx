import type { Metadata } from "next";
import Link from "next/link";
import { MovedAnchors } from "@/components/moved-anchors";
import { Photo } from "@/components/photo";
import { PageHero } from "@/components/sections";
import { ASHBURY_PATH, FURNITURE_MATERIALS_PATH } from "@/lib/materials";

export const metadata: Metadata = {
  title: "Our Materials",
  description: "Every Ashwick piece is built from materials you'd recognize: wool, cotton, linen, horsehair and solid wood.",
};

const HALF = "(max-width: 960px) 100vw, 50vw";

// Materials landing: the shared philosophy, then the two material pages. Copy is final (materials handoff).
// Kapok is left out of the hero list for now (Tessa, Oct 16).
export default function MaterialsPage() {
  return (
    <main>
      <MovedAnchors />
      <PageHero
        photo="materials-sheep"
        alt="Sheep grazing in a meadow by a dry stone wall, rolling green countryside beyond"
        eyebrow="Our Materials"
        title="What it's made of is the point."
        body="Every Ashwick piece is built from materials you'd recognize: wool, cotton, linen, horsehair and solid wood. Each one is there because of what it does."
      />

      <section className="sec linen">
        <div className="wrap center-head">
          <h2 className="h2">Chosen for what they do.</h2>
          <p className="body" style={{ marginTop: 24 }}>
            A natural material isn&apos;t automatically a good one. We choose each fiber for a job: to cushion, to spring back, to breathe, to hold its shape for years. Then we put it exactly where that job is done.
          </p>
        </div>
      </section>

      <section className="statement mat-leave statement-sm">
        <ul className="leave-list">
          {["No foam.", "No chemical flame retardants."].map((x) => <li key={x}>{x}</li>)}
        </ul>
      </section>

      <section className="sec">
        <div className="wrap grid2 mat-cards">
          <Link href={FURNITURE_MATERIALS_PATH} className="panel mat-card">
            <div className="panel-img"><Photo src="workshop-sofa" label="An upholsterer laying wool over a solid hardwood sofa frame in the workshop" sizes={HALF} /></div>
            <h2 className="proc-h">Our Furniture</h2>
            <p className="body">Solid hardwood, natural fills and woven fabrics, built by hand in the USA.</p>
            <span className="ulink">Explore furniture materials →</span>
          </Link>
          <Link href={ASHBURY_PATH} className="panel mat-card">
            <div className="panel-img"><Photo src="workshop-mattress" label="A maker hand-tying wool rosettes on an Ashbury in the workshop" sizes={HALF} /></div>
            <h2 className="proc-h">The Ashbury</h2>
            <p className="body">Living Wool, Swedish horsehair and organic cotton, hand-tufted into an all-natural, organic mattress.</p>
            <span className="ulink">Inside the Ashbury →</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
