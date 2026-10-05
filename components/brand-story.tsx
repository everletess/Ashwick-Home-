// Home page brand section: who we are, our commitments as badges, and a moving film panel.
import { Photo } from "@/components/photo";
import type { PhotoKey } from "@/lib/photos";

/**
 * Brand film. Put the file in /public/videos (e.g. public/videos/ashwick.mp4) and set its path here;
 * until then the panel plays a slow slideshow of the photos below.
 */
const FILM: string | null = null;
const FILM_STILLS: PhotoKey[] = ["burford-3", "marlowe-2", "csofa-c", "pembroke-2"];

type Badge = { top: string; bottom: string; icon: React.ReactNode };

const leaf = (
  <g>
    <path d="M50 70 C50 58 50 50 50 42" />
    <path d="M50 52 C40 52 32 46 30 34 C42 34 50 40 50 52 Z" className="fill" />
    <path d="M50 46 C58 46 66 40 69 29 C57 29 50 35 50 46 Z" className="fill" />
  </g>
);
const hand = (
  <g>
    <path d="M38 70 V50 C38 47 42 47 42 50 V44 C42 41 46 41 46 44 V42 C46 39 50 39 50 42 V44 C50 41 54 41 54 44 V58 L58 52 C60 49 64 51 62 55 L55 68 C53 71 50 72 47 72 H42 C40 72 38 71 38 70 Z" className="fill" />
  </g>
);
const drop = (
  <g>
    <path d="M50 30 C44 40 38 48 38 56 C38 63 43 68 50 68 C57 68 62 63 62 56 C62 48 56 40 50 30 Z" className="fill" />
    <path d="M33 33 L67 67" className="slash" />
  </g>
);
const rings = (
  <g>
    <circle cx="50" cy="50" r="18" className="fill" />
    <circle cx="50" cy="50" r="12" />
    <circle cx="50" cy="50" r="6" />
    <path d="M50 32 V24" />
  </g>
);

const BADGES: Badge[] = [
  { top: "100% organic", bottom: "& natural", icon: leaf },
  { top: "Handmade", bottom: "in the USA", icon: hand },
  { top: "Nothing", bottom: "synthetic", icon: drop },
  { top: "Solid", bottom: "hardwood", icon: rings },
];

function BadgeMark({ b, i }: { b: Badge; i: number }) {
  const top = `bt-${i}`;
  const bottom = `bb-${i}`;
  return (
    <figure className="badge">
      <svg viewBox="0 0 100 100" role="img" aria-label={`${b.top} ${b.bottom}`}>
        <defs>
          <path id={top} d="M16 50 A34 34 0 0 1 84 50" />
          <path id={bottom} d="M10 50 A40 40 0 0 0 90 50" />
        </defs>
        <circle cx="50" cy="50" r="47" className="arc" />
        <text><textPath href={`#${top}`} startOffset="50%" textAnchor="middle">{b.top.toUpperCase()}</textPath></text>
        <text><textPath href={`#${bottom}`} startOffset="50%" textAnchor="middle">{b.bottom.toUpperCase()}</textPath></text>
        <g className="icon" transform="translate(50 50) scale(.5) translate(-50 -50)">{b.icon}</g>
      </svg>
    </figure>
  );
}

export function BrandStory() {
  return (
    <section className="sec brand">
      <div className="wrap brand-in">
        <div className="brand-copy">
          <h2 className="brand-h">Ashwick Home</h2>
          <p className="brand-sub">From the forest floor to your living room.</p>
          <p className="body">
            Every piece is handmade to order in our American workshop from solid hardwood, organic latex, organic wool, coconut coir and linen. Materials you&apos;d recognize, put together by hand.
          </p>
          <p className="body">
            No petrochemicals, no plastic polyurethane foams and no chemical flame retardants. Just natural materials, built to last a lifetime and then be handed down.
          </p>
          <div className="badges">
            {BADGES.map((b, i) => <BadgeMark key={b.top} b={b} i={i} />)}
          </div>
        </div>

        <div className="film" aria-label="Ashwick Home: handmade from natural materials">
          {FILM ? (
            <video className="film-media" src={FILM} autoPlay muted loop playsInline preload="metadata" />
          ) : (
            <div className="film-stills" aria-hidden="true">
              {FILM_STILLS.map((s, i) => (
                <div key={s} className="film-still" style={{ animationDelay: `${i * 6}s` }}>
                  <Photo src={s} label="" fill sizes="(max-width: 960px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          )}
          <div className="film-scrim" />
          <div className="film-txt">
            <p className="film-h">No Petrochemicals</p>
            <p className="film-s">Natural fibers, made by hand</p>
          </div>
        </div>
      </div>
    </section>
  );
}
