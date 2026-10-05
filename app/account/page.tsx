import type { Metadata } from "next";
import Link from "next/link";
import { STUDIO_EMAIL } from "@/lib/site";

export const metadata: Metadata = { title: "Account" };

// Customer accounts (sign in, create an account, order history) are hosted by Shopify.
const STORE = process.env.SHOPIFY_STORE_ASHWICK;
const ACCOUNT_URL = STORE ? `https://${STORE}/account` : null;

export default function AccountPage() {
  return (
    <main>
      <section className="acct">
        <div className="eyebrow">Account</div>
        <h1 className="h2">Your account</h1>
        <p className="body" style={{ marginTop: 24 }}>
          Sign in to see your orders, or create an account with your email address. You&apos;ll get a one-time code by email; there&apos;s no password to remember.
        </p>
        {ACCOUNT_URL ? (
          <a className="btn full" href={ACCOUNT_URL} style={{ marginTop: 40 }}>Sign in or create an account</a>
        ) : (
          <p className="fine" style={{ marginTop: 40 }}>Accounts are coming soon. For help with an order, email {STUDIO_EMAIL}.</p>
        )}
        <div className="acct-trade">
          <div className="eyebrow">Trade</div>
          <p className="body small">Designers and architects: apply for a trade account, then sign in with the email on your application.</p>
          <Link href="/pages/trade#apply" className="ulink">Apply for a trade account</Link>
        </div>
      </section>
    </main>
  );
}
