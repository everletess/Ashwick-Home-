import { reviewsFor, type ProductKey } from "@/lib/reviews";
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="rv-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= Math.round(rating) ? "on" : ""} aria-hidden="true">{"\u2605"}</span>
      ))}
    </span>
  );
}

/** Reviews section for a product page. Shows real reviews only; with none, an honest "no reviews yet" block. */
export function Reviews({ product, name }: { product: ProductKey; name: string }) {
  const { items, count, average } = reviewsFor(product);
  return (
    <section className="sec" id="reviews" aria-labelledby="rv-h">
      <div className="wrap rv">
        <div className="center-head">
          <div className="eyebrow">Reviews</div>
          <h2 className="h2" id="rv-h">{count ? "What customers say." : "No reviews yet."}</h2>
          {count > 0 ? (
            <p className="rv-sum"><Stars rating={average} /> <span>{average.toFixed(1)} out of 5 · {count} {count === 1 ? "review" : "reviews"}</span></p>
          ) : (
            <p className="body" style={{ marginTop: 24 }}>
              The {name} is made to order, so every review here will come from a real customer. Questions before you order? Email{" "}
              <a className="ulink" href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a> or call <a className="ulink" href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>.
            </p>
          )}
        </div>
        {count > 0 && (
          <ul className="rv-list">
            {items.map((r, i) => (
              <li className="rv-item" key={i}>
                <Stars rating={r.rating} />
                {r.title && <h3 className="rv-title">{r.title}</h3>}
                <p className="body small">{r.body}</p>
                <p className="rv-by">
                  {r.author}
                  {r.verified && <span className="rv-ok"> · Verified buyer</span>}
                  {r.purchase && <span> · {r.purchase}</span>}
                  <span> · {new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
