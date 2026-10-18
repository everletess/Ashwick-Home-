// Plain help pages (Delivery, Ordering, Care, FAQs, Privacy, Terms), in the style of the warranty page.
export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main>
      <section className="page-head wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h1">{title}</h1>
        {intro && <p className="body">{intro}</p>}
      </section>
      <section className="sec terms-sec">
        <div className="wrap terms terms-page">{children}</div>
      </section>
    </main>
  );
}

export function Block({ title, id, level = 2, children }: { title: string; id?: string; level?: 2 | 3; children: React.ReactNode }) {
  const H = level === 3 ? "h3" : "h2";
  return (
    <div className="terms-block" id={id}>
      <H className="eyebrow terms-h">{title}</H>
      {children}
    </div>
  );
}
