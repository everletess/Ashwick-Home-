"use client";

// "Request pricing" for pieces priced upon request (Tessa, Nov 22): a side panel on desktop, a bottom sheet on a phone.
// On submit: emailed to the studio (/api/forms), the Klaviyo profile updated (lib/subscribe.ts), and a Meta Lead from
// the browser and the server with one event ID (lib/pixel.ts). Never an AddToCart.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormError, Honeypot, useFormSend } from "@/components/forms";
import { track } from "@/lib/pixel";
import { normalizePhone, recordPriceRequest } from "@/lib/subscribe";

export function RequestPricing({ piece, selection, onClose }: { piece: string; selection: string; onClose: () => void }) {
  const [fabric, setFabric] = useState(selection);
  const [url, setUrl] = useState("");
  const { sent, sending, error, onSubmit } = useFormSend("price-request", undefined, (data) => {
    const email = String(data.get("email") ?? "").trim();
    const rawPhone = String(data.get("phone") ?? "").trim();
    const phone = rawPhone ? normalizePhone(rawPhone) : null;
    void recordPriceRequest(email, piece, phone, data.get("textConsent") === "yes");
    track("Lead", { content_name: piece }, email);
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the page address, read once after mount
    setUrl(window.location.href);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const body = (
    <div className="rp-scrim" onClick={onClose}>
      <aside className="rp-sheet" role="dialog" aria-modal="true" aria-labelledby="rp-h" onClick={(e) => e.stopPropagation()}>
        <div className="rp-head">
          <h2 className="h3" id="rp-h">Request pricing</h2>
          <button type="button" className="x" aria-label="Close" onClick={onClose}>×</button>
        </div>
        {sent ? (
          <div className="rp-body" role="status">
            <p className="body">Thank you. A member of our design team will be in touch within one business day.</p>
            <button type="button" className="btn full" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form className="rp-body rp-form" onSubmit={onSubmit}>
            <Honeypot />
            <p className="body small">Tell us a little about your space and we&apos;ll be in touch within one business day.</p>
            <input type="hidden" name="productUrl" value={url} />
            <label><span className="eyebrow">Name *</span><input name="name" autoComplete="name" required /></label>
            <label><span className="eyebrow">Email *</span><input name="email" type="email" autoComplete="email" required /></label>
            <label><span className="eyebrow">Phone</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" /></label>
            <label><span className="eyebrow">ZIP code *</span><input name="zip" inputMode="numeric" autoComplete="postal-code" required /></label>
            <label><span className="eyebrow">Piece</span><input name="piece" value={piece} readOnly /></label>
            <label><span className="eyebrow">Fabric and color</span><input name="fabricAndColor" value={fabric} onChange={(e) => setFabric(e.target.value)} /></label>
            <label><span className="eyebrow">Message</span><textarea name="message" rows={3} placeholder="Room, size or timing, anything helpful." /></label>
            <label className="rp-consent">
              <input type="checkbox" name="textConsent" value="yes" />
              <span>Text me about my request. Consent isn&apos;t a condition of purchase. Message frequency varies; message and data rates may apply. Reply STOP to opt out, HELP for help.</span>
            </label>
            <FormError message={error} />
            <button className="btn full" type="submit" disabled={sending}>{sending ? "Sending…" : "Send request"}</button>
          </form>
        )}
      </aside>
    </div>
  );
  return typeof document === "undefined" ? null : createPortal(body, document.body);
}
