import type { Metadata } from "next";
import Link from "next/link";
import { Block, InfoPage } from "@/components/info-page";
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_PHONE_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply to ashwickhome.com and every purchase from Ashwick Home: orders, cancellations, returns, the Ashbury guarantee, delivery, Bespoke and warranty.",
};

/** Change this whenever the terms change. */
const LAST_UPDATED = "October 18, 2026";

// Copy is from the Terms handoff and is the legal text: change it only on instruction. The same text goes in Shopify
// admin (Settings → Policies → Terms of service) so checkout matches. Section anchors are linked from other pages.
const email = <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a>;
const P = ({ children }: { children: React.ReactNode }) => <p className="body">{children}</p>;
const List = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="body terms-list">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
);

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Policies" title="Terms of Service" intro={`Last updated ${LAST_UPDATED}`}>
      <Block title="Overview">
        <P>Welcome to Ashwick Home. These terms apply to ashwickhome.com and to every purchase you make from us. In these terms, &ldquo;Ashwick,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo; and &ldquo;our&rdquo; mean Ashwick Home, LLC, and &ldquo;you&rdquo; means anyone using our site or buying from us.</P>
        <P>By using our site or placing an order, you agree to these terms and to our <Link href="/pages/privacy" className="inl">Privacy Policy</Link>. Please read them carefully. Nothing in these terms limits any rights you have under consumer protection law that can&apos;t be waived.</P>
        <P>Our store runs on Shopify, which provides our online store platform. Your purchases are made directly with Ashwick Home, LLC.</P>
      </Block>
      <Block title="1. Your account">
        <P>To place an order you must be at least 18, or the age of majority where you live. Please give us accurate information and keep your account login secure. You&apos;re responsible for activity on your account.</P>
      </Block>
      <Block title="2. Our pieces">
        <P>Every Ashwick piece is made by hand from natural materials such as wool, linen, cotton, horsehair and solid wood. Natural variation in grain, color, texture and weave is part of their character and isn&apos;t a defect. Colors can look different on screen than in person, so we recommend ordering <Link href="/pages/fabric-swatches" className="inl">fabric swatches</Link> before you choose.</P>
        <P>We may update, change or discontinue any piece, fabric or finish at any time.</P>
      </Block>
      <Block title="3. Orders" id="orders">
        <P>When you place an order, you&apos;re making an offer to buy. Your order is accepted when we confirm it by email and your payment is processed. We may decline or cancel an order, for example if a piece or material becomes unavailable, if we can&apos;t verify payment, or if there&apos;s an error in a price or description. If we cancel your order, we&apos;ll refund you in full.</P>
        <P>Our pieces are sold for personal use, not resale. Interior designers and trade professionals buy under our separate <Link href="/pages/trade-terms" className="inl">Trade Terms</Link>.</P>
      </Block>
      <Block title="4. Prices and payment">
        <P>Prices are in US dollars. Taxes and any delivery fees are shown at checkout. Unless stated otherwise, orders are paid in full at checkout. Where we offer financing through Affirm, it&apos;s provided by Affirm under its own terms, and approval is up to Affirm.</P>
        <P>If a piece is listed at an incorrect price because of an error, we&apos;ll contact you before shipping. You can choose to pay the correct price or cancel for a full refund.</P>
      </Block>
      <Block title="5. Made to order">
        <P>Most Ashwick pieces are made to order. We begin making yours shortly after you order, using the size, fabric and finish you choose.</P>
        <List items={[
          <><strong>Furniture as designed:</strong> ships within 3–4 weeks of your order.</>,
          <><strong>Customized furniture:</strong> ships within 8–12 weeks of your order.</>,
          <><strong>The Ashbury mattress:</strong> ships within 1–2 weeks.</>,
          <><strong>Bespoke commissions:</strong> timeline confirmed with your quote.</>,
        ]} />
        <P>These are estimates. We&apos;ll keep you updated if anything changes.</P>
      </Block>
      <Block title="6. Changes and cancellations" id="cancellations">
        <P>You can change or cancel an order for a full refund within <strong>12 hours</strong> of placing it. Email {email} with your order number.</P>
        <P>After 12 hours, your piece is in production, and we can&apos;t accept changes or cancellations. This includes furniture ordered as designed or customized, custom-size mattresses and bespoke commissions.</P>
      </Block>
      <Block title="7. Returns" id="returns">
        <P><strong>The Ashbury mattress:</strong> standard sizes are covered by our 100-night guarantee (Section 8).</P>
        <P><strong>The Ashbury Dog Bed:</strong> can be returned within <strong>30 days</strong> of delivery. Email us to arrange the return. Returned dog beds are donated, never resold as new. The dog bed carries a 1-year warranty against defects in materials and workmanship.</P>
        <P><strong>Furniture as designed:</strong> every piece is made to order. Pieces ordered as designed, without customization, can be returned within <strong>14 days</strong> of delivery. They must be in their original, unused condition. Refunds are reduced by the return shipping cost and a <strong>15% restocking fee</strong>. Email us to arrange a return before sending anything back.</P>
        <P><strong>Final sale, with no returns unless they arrive damaged:</strong></P>
        <List items={["Customized furniture", "Custom-size mattresses", "Bespoke commissions", "Fabric swatches"]} />
        <P>None of this affects your rights if a piece arrives damaged (Section 9) or has a defect covered by our warranty (Section 11).</P>
      </Block>
      <Block title="8. The Ashbury 100-night guarantee" id="ashbury-guarantee">
        <P>A natural mattress takes time to settle in, so we give you 100 nights to decide.</P>
        <List items={[
          <>Sleep on your Ashbury for at least <strong>30 nights</strong>. If it isn&apos;t right, you can request a return any time from <strong>night 30 to night 100</strong> after delivery.</>,
          "We'll collect it from your home at no cost to you, and refund the full purchase price to your original payment method.",
          "The mattress must be clean and free of stains and damage. We recommend a breathable mattress protector from the first night.",
          "The guarantee covers standard sizes only. Custom sizes are final sale.",
          "The mattress and topper are sold as one system and are returned together.",
          "Returned mattresses are donated, never resold as new.",
        ]} />
        <P>Full details are on our <Link href="/pages/guarantee-warranty" className="inl">Guarantee &amp; Warranty</Link> page.</P>
      </Block>
      <Block title="9. Delivery and damage" id="delivery">
        <P>We deliver within the contiguous United States. Delivery options, fees and estimated timing are shown on each product page and on our <Link href="/pages/delivery" className="inl">Delivery</Link> page. Delivery dates are estimates and can be affected by events outside our control.</P>
        <P>Ownership and risk of loss pass to you when your order is delivered.</P>
        <P><strong>Please inspect your order on delivery.</strong> If anything arrives damaged, email {email} with photos within <strong>5 business days</strong> of delivery. We&apos;ll repair or replace it at no cost to you. For white-glove deliveries, please note any visible damage with the delivery team before they leave.</P>
      </Block>
      <Block title="10. Bespoke commissions" id="bespoke">
        <P><Link href="/pages/bespoke" className="inl">Bespoke</Link> commissions are designed and made for you. Before anything is made, you&apos;ll receive a scaled drawing, a material proposal, a quote and an estimated timeline. Commissions are paid in full when you commission, and production begins once you approve the drawing and pay.</P>
        <P>Because each commission is one of a kind, it&apos;s final sale and can&apos;t be cancelled once production has begun. Bespoke pieces are delivered by white glove and covered by our lifetime limited warranty.</P>
        <P>The drawings, designs and proposals we create remain our property. We may photograph finished commissions for our portfolio, and we&apos;ll never share your name or address without your permission.</P>
      </Block>
      <Block title="11. Warranty" id="warranty">
        <P>Every Ashwick piece, including the Ashbury, carries a lifetime limited warranty for the original purchaser. Coverage, exclusions and how to make a claim are set out in our <Link href="/pages/warranty" className="inl">Furniture warranty</Link> and, for the Ashbury, <Link href="/pages/guarantee-warranty" className="inl">Guarantee &amp; Warranty</Link> pages. Warranty repairs and replacements are free. You cover the cost of shipping the piece to and from our workshop. Following our <Link href="/pages/care" className="inl">Care guide</Link> helps keep your coverage. Damage from improper cleaning, direct sun, heat or excess moisture isn&apos;t covered.</P>
        <P>Apart from that warranty and any warranties required by law, our site and products are provided &ldquo;as is,&rdquo; to the fullest extent the law allows.</P>
      </Block>
      <Block title="12. Our content and designs">
        <P>Everything on our site, including our designs, product names, photography, text, logo and the Ashwick and Ashbury names, belongs to Ashwick Home, LLC or our licensors and is protected by intellectual property laws. You can use our site for personal, non-commercial purposes. Please don&apos;t copy, reproduce or sell our designs or content without written permission.</P>
      </Block>
      <Block title="13. Reviews and feedback">
        <P>If you send us feedback, ideas or reviews, you allow us to use them without payment or obligation to you. Any review you post must be honest and based on your own experience.</P>
      </Block>
      <Block title="14. Using our site">
        <P>Please use our site lawfully. You may not:</P>
        <List items={["interfere with its security or operation", "scrape or harvest data from it", "send spam or malicious code", "impersonate anyone", "use it to infringe anyone's rights"]} />
        <P><strong>Automated agents:</strong> if you use software or an AI agent to browse or buy on our site, it must:</P>
        <List items={["identify itself as automated", "answer truthfully if asked whether it's a person", "not get around access limits"]} />
        <P>We may block automated access.</P>
        <P>We may suspend or end access to our site for anyone who breaks these terms.</P>
      </Block>
      <Block title="15. Third-party services and links">
        <P>Our site uses third-party services, such as Shopify, payment processors, Affirm and delivery partners. Each is governed by its own terms. We&apos;re not responsible for third-party websites we link to.</P>
      </Block>
      <Block title="16. Limitation of liability">
        <P>To the fullest extent permitted by law, Ashwick Home, LLC is not liable for indirect, incidental, special or consequential damages arising from your use of our site or products. Our total liability for any claim is limited to the amount you paid for the product involved. Some states don&apos;t allow these limitations, so they may not apply to you.</P>
      </Block>
      <Block title="17. Indemnity">
        <P>You agree to cover any losses, claims and costs (including reasonable legal fees) that arise from your breach of these terms or misuse of our site, except where the law doesn&apos;t allow this.</P>
      </Block>
      <Block title="18. Disputes and governing law">
        <P>If something goes wrong, please email {email} first. Most issues can be resolved quickly and informally.</P>
        <P>These terms are governed by the laws of the State of California, without regard to its conflict of law rules. Any dispute that can&apos;t be resolved informally will be handled in the state or federal courts located in California, unless the law where you live gives you the right to bring a claim in your local courts.</P>
      </Block>
      <Block title="19. General">
        <List items={[
          "If any part of these terms is found unenforceable, the rest still applies.",
          "If we don't enforce a term right away, we haven't waived it.",
          "We may transfer our rights under these terms. You may not transfer yours without our consent.",
          "These terms, together with the policies they link to, are the entire agreement between you and us about your use of our site and purchases.",
          "We may send you notices by email. If we translate these terms, the English version controls.",
        ]} />
      </Block>
      <Block title="20. Changes to these terms">
        <P>We may update these terms from time to time. The &ldquo;Last updated&rdquo; date shows when they last changed. Changes apply to orders placed after the update.</P>
      </Block>
      <Block title="21. Contact us">
        <P>
          Ashwick Home, LLC<br />San Francisco, CA<br />{email}<br />
          <a href={STUDIO_PHONE_HREF} className="inl">{STUDIO_PHONE}</a>
        </P>
      </Block>
    </InfoPage>
  );
}
