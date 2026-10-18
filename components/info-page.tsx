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

export function Block({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <div className="terms-block" id={id}>
      <h2 className="eyebrow terms-h">{title}</h2>
      {children}
    </div>
  );
}
