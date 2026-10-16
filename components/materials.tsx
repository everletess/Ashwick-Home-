// Shared building blocks for the materials pages (landing, Furniture Materials, Inside the Ashbury).
import { Photo } from "@/components/photo";
import type { Material, MaterialGroup } from "@/lib/materials";
import type { PhotoKey } from "@/lib/photos";

const HALF = "(max-width: 960px) 100vw, 50vw";

/** Full-width image band with an eyebrow and heading over it. */
export function Band({ photo, alt, eyebrow, title, center }: { photo?: PhotoKey; alt: string; eyebrow?: string; title: string; center?: boolean }) {
  return (
    <section className={"band" + (center ? " band-c" : "")}>
      <Photo src={photo} label={alt} fill sizes="100vw" />
      {photo && <div className="hero-scrim"></div>}
      <div className="band-txt">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className="h2">{title}</h2>
      </div>
    </section>
  );
}

function Entry({ m, group, rev, whereLabel }: { m: Material; group: string; rev: boolean; whereLabel: string }) {
  return (
    <article className={"proc mat-entry" + (rev ? " rev" : "")} id={m.id}>
      <div className="proc-v"><Photo src={m.photo} label={m.alt} sizes={HALF} /></div>
      <div className="proc-t">
        <div className="eyebrow">{group}</div>
        <h3 className="proc-h">{m.name}</h3>
        <p className="mat-desc">{m.descriptor}</p>
        <p className="body">{m.body}</p>
        <p className="body small"><strong>{whereLabel}:</strong> {m.where}</p>
        {m.origin && <p className="fine mat-origin">{m.origin}</p>}
      </div>
    </article>
  );
}

/**
 * A group's image band, then its entries alternating image left and right. `after` inserts a section after a given
 * entry (e.g. a band right after Living Wool).
 */
export function Group({ g, offset, whereLabel, after }: { g: MaterialGroup; offset: number; whereLabel: string; after?: Record<string, React.ReactNode> }) {
  // Split the entries into runs that end where an `after` section goes.
  const runs: { items: { m: Material; i: number }[]; tail?: React.ReactNode }[] = [{ items: [] }];
  g.materials.forEach((m, i) => {
    runs[runs.length - 1].items.push({ m, i });
    if (after?.[m.id]) {
      runs[runs.length - 1].tail = after[m.id];
      runs.push({ items: [] });
    }
  });
  return (
    <>
      {g.title && <Band photo={g.photo} alt={g.alt} eyebrow={g.eyebrow} title={g.title} />}
      {runs.filter((r) => r.items.length).map((r) => (
        <div key={r.items[0].m.id}>
          <section className="sec">
            <div className="wrap process">
              {r.items.map(({ m, i }) => <Entry key={m.id} m={m} group={g.eyebrow} rev={(offset + i) % 2 === 1} whereLabel={whereLabel} />)}
            </div>
          </section>
          {r.tail}
        </div>
      ))}
    </>
  );
}

/** Groups in order, alternating sides across the whole page. */
export function Groups({ groups, whereLabel, after }: { groups: MaterialGroup[]; whereLabel: string; after?: Record<string, React.ReactNode> }) {
  let offset = 0;
  return groups.map((g) => {
    const el = <Group key={g.id} g={g} offset={offset} whereLabel={whereLabel} after={after} />;
    offset += g.materials.length;
    return el;
  });
}

export function MatIndex({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="wrap mat-index" aria-label="Materials">
      {items.map((m) => <a key={m.id} href={`#${m.id}`}>{m.label}</a>)}
    </nav>
  );
}
