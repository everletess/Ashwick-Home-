"use client";

// Forms have no backend yet: submitting swaps to a thank-you state, as in the design.
// TODO: wire each onSubmit to a form endpoint (e.g. a route handler that emails the studio).
import { useState } from "react";

function ThankYou({ children }: { children: React.ReactNode }) {
  return (
    <div className="trade-done" role="status">
      <h3 className="proc-h">Thank you.</h3>
      <p className="body">{children}</p>
    </div>
  );
}

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="sec nl">
      <div className="wrap center-head">
        <h2 className="h2">New pieces, when they&apos;re ready.</h2>
        <p className="body" style={{ marginTop: 20 }}>A short letter when something new leaves the workshop. Nothing more.</p>
        {done ? (
          <p className="nl-done" role="status">Thank you. You&apos;re on the list.</p>
        ) : (
          <form className="nl-form" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <input type="email" name="email" required placeholder="Email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}

const BESPOKE_MATERIALS = ["Solid hardwood", "Organic wool", "Organic linen", "Organic wool bouclé", "Brushed organic wool", "Vegetable-tanned leather"];

export function BespokeForm() {
  const [sent, setSent] = useState(false);
  const [mats, setMats] = useState<string[]>([]);
  const toggle = (m: string) => setMats((c) => (c.includes(m) ? c.filter((x) => x !== m) : [...c, m]));
  if (sent) return <ThankYou>We&apos;ve received your idea and will be in touch to talk it through.</ThankYou>;
  return (
    <form className="tform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <label><span className="eyebrow">Name</span><input name="name" autoComplete="name" required /></label>
      <label><span className="eyebrow">Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label><span className="eyebrow">Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label>
        <span className="eyebrow">What would you like made?</span>
        <select name="piece" defaultValue="">
          <option value="" disabled>Select</option>
          <option>Sofa</option><option>Chair</option><option>Sectional</option><option>Bench</option><option>Ottoman</option><option>Other</option>
        </select>
      </label>
      <label className="full"><span className="eyebrow">Approximate size</span><input name="size" placeholder="Width × depth × height, or the space it needs to fit" /></label>
      <div className="full mat-pick">
        <span className="eyebrow">Materials you&apos;re drawn to</span>
        <div className="opt-c">
          {BESPOKE_MATERIALS.map((m) => (
            <button type="button" key={m} className={"pill" + (mats.includes(m) ? " on" : "")} aria-pressed={mats.includes(m)} onClick={() => toggle(m)}>{m}</button>
          ))}
        </div>
      </div>
      <label className="full"><span className="eyebrow">Describe your piece</span><textarea name="description" rows={5} placeholder="How you'll use it, the room it's for, the feeling you want"></textarea></label>
      <label className="full file"><span className="eyebrow">Sketches or inspiration photos</span><input name="files" type="file" multiple accept="image/*,.pdf" /></label>
      <button className="btn full" type="submit">Send your idea</button>
    </form>
  );
}

export function TradeForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <ThankYou>We&apos;ve received your application and will be in touch.</ThankYou>;
  return (
    <form className="tform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <label><span className="eyebrow">First name</span><input name="firstName" autoComplete="given-name" required /></label>
      <label><span className="eyebrow">Last name</span><input name="lastName" autoComplete="family-name" required /></label>
      <label className="full"><span className="eyebrow">Firm name</span><input name="firm" autoComplete="organization" required /></label>
      <label><span className="eyebrow">Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label><span className="eyebrow">Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      <label className="full"><span className="eyebrow">Website or portfolio</span><input name="website" type="url" autoComplete="url" /></label>
      <label>
        <span className="eyebrow">Profession</span>
        <select name="profession" defaultValue="">
          <option value="" disabled>Select</option>
          <option>Interior designer</option><option>Architect</option><option>Stylist</option><option>Hospitality</option><option>Other</option>
        </select>
      </label>
      <label><span className="eyebrow">State</span><input name="state" autoComplete="address-level1" /></label>
      <label className="full"><span className="eyebrow">Tell us about your project</span><textarea name="project" rows={4}></textarea></label>
      <button className="btn full" type="submit">Submit application</button>
    </form>
  );
}

export function SignInForm() {
  return (
    // TODO: Shopify customer accounts.
    <form className="acct-form" onSubmit={(e) => e.preventDefault()}>
      <label><span className="eyebrow">Email</span><input type="email" name="email" autoComplete="email" /></label>
      <label><span className="eyebrow">Password</span><input type="password" name="password" autoComplete="current-password" /></label>
      <button className="btn full" type="submit">Sign in</button>
    </form>
  );
}

/** In-page link that smooth-scrolls to an id, leaving room for the sticky header. */
export function ScrollLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={"#" + to}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(to);
        if (!el) return;
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
      }}
    >
      {children}
    </a>
  );
}
