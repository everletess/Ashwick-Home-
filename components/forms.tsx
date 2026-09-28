"use client";

// Forms have no backend yet: submitting swaps to a thank-you state, as in the design.
// TODO: wire each onSubmit to a form endpoint (e.g. a route handler that emails the studio).
import { useRef, useState } from "react";

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

const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

/** Business contact fields shared by the trade application and the hospitality request. */
function ContactFields() {
  return (
    <>
      <label><span className="eyebrow">First name *</span><input name="firstName" autoComplete="given-name" required /></label>
      <label><span className="eyebrow">Last name *</span><input name="lastName" autoComplete="family-name" required /></label>
      <label><span className="eyebrow">Company *</span><input name="company" autoComplete="organization" required /></label>
      <label><span className="eyebrow">Title</span><input name="title" autoComplete="organization-title" /></label>
      <label><span className="eyebrow">Business phone *</span><input name="phone" type="tel" autoComplete="tel" required /></label>
      <label><span className="eyebrow">Email *</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className="full"><span className="eyebrow">Business address *</span><input name="address" autoComplete="street-address" required /></label>
      <label><span className="eyebrow">City *</span><input name="city" autoComplete="address-level2" required /></label>
      <div className="tform-pair">
        <label>
          <span className="eyebrow">State *</span>
          <select name="state" autoComplete="address-level1" defaultValue="" required>
            <option value="" disabled>Select</option>
            {US_STATES.map((st) => <option key={st}>{st}</option>)}
          </select>
        </label>
        <label><span className="eyebrow">ZIP *</span><input name="zip" inputMode="numeric" autoComplete="postal-code" pattern="\d{5}(-\d{4})?" title="5-digit ZIP code" required /></label>
      </div>
      <label><span className="eyebrow">Company website</span><input name="website" type="url" inputMode="url" autoComplete="url" placeholder="https://" /></label>
      <label><span className="eyebrow">Instagram or social link</span><input name="social" /></label>
    </>
  );
}

const DOC_TYPES = ".jpg,.jpeg,.png,.pdf";

export function TradeApplyForm() {
  const [sent, setSent] = useState(false);
  const [tax, setTax] = useState<"yes" | "no">("no");
  const card = useRef<HTMLInputElement>(null);
  const license = useRef<HTMLInputElement>(null);

  // At least one of business card / business license is required.
  const checkDocs = () => {
    const ok = !!(card.current?.files?.length || license.current?.files?.length);
    card.current?.setCustomValidity(ok ? "" : "Upload a business card or a business license.");
    return ok;
  };

  if (sent) return <ThankYou>We&apos;ve received your application and will be in touch.</ThankYou>;
  return (
    <form
      className="tform"
      onSubmit={(e) => {
        e.preventDefault();
        if (!checkDocs()) return card.current?.reportValidity();
        setSent(true);
      }}
    >
      <label className="full">
        <span className="eyebrow">Profession *</span>
        <select name="profession" defaultValue="" required>
          <option value="" disabled>Select</option>
          <option>Interior designer</option><option>Architect</option><option>Stylist</option><option>Hospitality</option><option>Developer</option><option>Other</option>
        </select>
      </label>
      <ContactFields />
      <div className="full tform-note">
        <span className="eyebrow">Business card or business license *</span>
        <p className="fine">Upload either one. JPG, PNG or PDF.</p>
      </div>
      <label className="file"><span className="eyebrow">Business card</span><input ref={card} name="businessCard" type="file" accept={DOC_TYPES} onChange={checkDocs} /></label>
      <label className="file"><span className="eyebrow">Business license</span><input ref={license} name="businessLicense" type="file" accept={DOC_TYPES} onChange={checkDocs} /></label>
      <div className="full tform-note" role="group" aria-label="Is your business eligible for tax exemption?">
        <span className="eyebrow">Is your business eligible for tax exemption?</span>
        <div className="opt-c" style={{ marginTop: 12 }}>
          {(["yes", "no"] as const).map((v) => (
            <button type="button" key={v} className={"pill" + (tax === v ? " on" : "")} aria-pressed={tax === v} onClick={() => setTax(v)}>
              {v === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
      {tax === "yes" && <label className="full"><span className="eyebrow">Tax ID</span><input name="taxId" /></label>}
      <button className="btn full" type="submit">Submit application</button>
    </form>
  );
}

export function HospitalityForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <ThankYou>We&apos;ve received your request and will be in touch.</ThankYou>;
  return (
    <form className="tform" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <ContactFields />
      <label className="full"><span className="eyebrow">Your project *</span><textarea name="project" rows={5} required placeholder="The property, the rooms, the pieces and quantities, your timeline"></textarea></label>
      <label className="full file"><span className="eyebrow">Plans, sketches or references</span><input name="files" type="file" multiple accept="image/*,.pdf" /></label>
      <button className="btn full" type="submit">Send request</button>
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
