import Link from "next/link";
import { TRADE_TERMS as T, WARRANTY_PATH } from "@/lib/trade-terms";

const usd = (n: number) => "$" + n.toLocaleString("en-US");

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="terms-block">
      <h3 className="eyebrow terms-h">{title}</h3>
      {children}
    </div>
  );
}

/** "01 Trade terms" on the Trade page. Wording is deliberate business terms: don't reword; change figures in lib/trade-terms.ts. */
export function TradeTerms() {
  return (
    <div className="terms">
      <Block title="Eligibility">
        <p className="body small">
          The Ashwick Trade Program is open to interior designers, architects, stagers, developers and hospitality professionals. To apply, please provide one of the following: a business license, a resale certificate, a professional membership (ASID, IIDA, AIA or equivalent), or a website or portfolio showing current work. Applications are reviewed within {T.reviewDays} business days.
        </p>
      </Block>
      <Block title="Trade pricing">
        <p className="body small">Trade members receive tiered pricing based on net purchases in a calendar year:</p>
        <table className="terms-table">
          <thead>
            <tr><th scope="col">Tier</th><th scope="col">Annual spend</th><th scope="col">Discount off retail</th></tr>
          </thead>
          <tbody>
            {T.tiers.map((t) => (
              <tr key={t.name}>
                <th scope="row" data-label="Tier">{t.name}</th>
                <td data-label="Annual spend">{t.spend == null ? "On approval" : `${usd(t.spend)}+`}</td>
                <td data-label="Discount off retail">{t.discount}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="body small">
          Once a threshold is reached, the new tier applies to all future orders for the rest of that year and the year following. Spend is calculated on merchandise only, excluding tax, shipping and returned pieces. Trade pricing cannot be combined with other offers or promotions.
        </p>
      </Block>
      <Block title="Referral commission">
        <p className="body small">
          If your client prefers to purchase directly, you earn a {T.referralPercent}% commission on the merchandise total. Clients order at retail pricing using your personal trade code or link. Commission is paid within {T.referralPaidDays} days after delivery and the close of any return window, and excludes tax, shipping and returned or cancelled pieces. Commission and trade pricing cannot be applied to the same order, and a completed W-9 is required before the first payment. Members are responsible for any disclosure to their clients.
        </p>
      </Block>
      <Block title="Swatches and samples">
        <p className="body small">Fabric swatches are complimentary for trade members, up to {T.swatchLimit} per request.</p>
      </Block>
      <Block title="Ordering and payment">
        <p className="body small">
          In-stock pieces are paid in full at the time of order. Made-to-order and customized pieces require a {T.depositPercent}% deposit to begin production, with the balance due before shipment. Quotes are valid for {T.quoteDays} days.
        </p>
      </Block>
      <Block title="Lead times">
        <p className="body small">
          Made-to-order pieces typically ship within {T.leadTime} of deposit. Lead times are estimates and will be confirmed at the time of order. We will notify you promptly of any change.
        </p>
      </Block>
      <Block title="Shipping and delivery">
        <p className="body small">
          Delivery is quoted per order based on destination and service level. White-glove delivery is available in {T.whiteGloveArea}. We are happy to ship to a receiving warehouse of your choice.
        </p>
      </Block>
      <Block title="Sales tax">
        <p className="body small">
          Sales tax is charged where applicable unless a valid resale certificate for the destination state is on file before the order is placed.
        </p>
      </Block>
      <Block title="Changes and cancellations">
        <p className="body small">
          Made-to-order pieces may be changed or cancelled within {T.changeWindowHours} hours of deposit. After production begins, deposits are non-refundable.
        </p>
      </Block>
      <Block title="Returns">
        <p className="body small">
          Made-to-order and customized pieces are final sale. In-stock pieces may be returned within {T.returnDays} days of delivery in original condition, less return shipping and a {T.restockingPercent}% restocking fee.
        </p>
      </Block>
      <Block title="Damage and defects">
        <p className="body small">
          Please inspect all deliveries on arrival and report any damage, with photographs, within {T.damageReportDays} business days. We will repair or replace the piece at our discretion. All pieces carry a <Link href={WARRANTY_PATH} className="inl">{T.warranty}</Link> against defects in materials and workmanship.
        </p>
      </Block>
      <Block title="Use of trade pricing">
        <p className="body small">
          Trade pricing is for use on client projects and is not to be advertised publicly or used for online resale. Ashwick may update these terms or end a trade account that is inactive or not in good standing.
        </p>
      </Block>
    </div>
  );
}
