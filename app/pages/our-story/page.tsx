import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our story",
  description: "Most furniture is built to be replaced. We build ours to be inherited.",
};

export default function StoryPage() {
  return (
    <main>
      <section className="statement tall">
        <div className="eyebrow light">Our story</div>
        <p>Most furniture is built to be replaced.</p>
        <div className="gap"></div>
        <p>We build ours to be inherited.</p>
      </section>
      <section className="sec">
        <div className="prose">
          <p>We started Ashwick because too much furniture isn&apos;t built to be lived with. It&apos;s built to be replaced: made fast and cheap, finished in chemicals you can&apos;t pronounce, and filled with things that shouldn&apos;t be in a home.</p>
          <p>We thought there should be another option. We wanted furniture made the way it used to be: slowly, by hand, from materials you&apos;d recognize and could trust.</p>
          <h2>Where the name comes from</h2>
          <p>Ashwick takes its name from the English countryside, a place of stone villages, hedgerows and old houses where a good chair outlived the person who bought it. That&apos;s the idea we build around, and every piece carries the name of a British place: the Marlowe, the Chatsworth, the Pembroke. We took the spirit of those places, not the address. Everything we make is made here, in America.</p>
          <h2>Made by hand, in the USA</h2>
          <p>Every piece is built to order by skilled craftspeople in our American workshop. Frames are cut and joined by hand, the fill is layered by hand, and the fabric is fitted and stitched by hand. Nothing sits in a warehouse. Your piece is started when you order it and finished for your home.</p>
          <h2>What goes into it</h2>
          <p>Solid hardwood frames. Organic latex, organic wool and coconut coir. Natural oils. Nothing synthetic: no polyurethane foam, no chemical flame retardants, no plastic. If we can&apos;t make a piece from materials we trust, we don&apos;t make it.</p>
          <h2>As designed, or as you&apos;d like it</h2>
          <p>Choose a piece as we designed it, or make it your own with a different fabric, depth, length or finish. Either way, it&apos;s made once, for one home.</p>
          <p className="prose-close">One piece at a time, for one home at a time. Built to last a lifetime, then handed down.</p>
          <p className="prose-sign">Made of nature. Built to last.</p>
        </div>
      </section>
    </main>
  );
}
