"use client";

// Free swatch request (up to SWATCH_MAX): pick fabric/color swatches and a mailing address; emailed to the studio via
// /api/forms, and sent to Meta as a Lead.
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormError, Honeypot, useFormSend } from "@/components/forms";
import Link from "next/link";
import { FABRIC_ALIASES, FABRIC_LIBRARY } from "@/lib/fabric-library";
import { PHOTOS, type PhotoKey } from "@/lib/photos";
import { SWATCH_MAX } from "@/lib/products";
import { track } from "@/lib/pixel";

const MAX_SWATCHES = SWATCH_MAX;

type Swatch = { key: string; fabric: string; label: string; color?: string; photo?: PhotoKey; tex?: string; code?: string; alsoCalled?: string };

/**
 * The fabric library: every fabric we sell (lib/fabric-library.ts), each with what it is, where it's used and its
 * colors to pick, then one form for up to SWATCH_MAX free swatches. A bar shows the count and jumps to the form.
 */
export function SwatchOrder() {
  const params = useSearchParams();
  const all: Swatch[] = FABRIC_LIBRARY.flatMap((F) =>
    F.colors.map((c) => ({ key: `${F.id}:${c.id}`, fabric: F.id, label: `${F.name} · ${c.label}`, color: c.swatch, photo: c.photo, tex: c.tex, code: c.code, alsoCalled: c.alsoCalled })),
  );
  // ?fabric=irish&color=flax preselects the swatch the customer was looking at (older ids are mapped).
  const fab = params.get("fabric") ?? "";
  const pre = `${FABRIC_ALIASES[fab] ?? fab}:${params.get("color") ?? ""}`;
  const [picked, setPicked] = useState<string[]>(() => all.filter((s) => s.key === pre).map((s) => s.key).slice(0, 1));
  const [limitHit, setLimitHit] = useState(false);
  const [needOne, setNeedOne] = useState(false);
  const toggle = (k: string) =>
    setPicked((c) => {
      if (c.includes(k)) return setLimitHit(false), c.filter((x) => x !== k);
      if (c.length >= MAX_SWATCHES) return setLimitHit(true), c;
      setNeedOne(false);
      return [...c, k];
    });
  const { sent, sending, error, onSubmit } = useFormSend(
    "swatches",
    () => {
      setNeedOne(picked.length === 0);
      return picked.length > 0;
    },
    (data) => track("Lead", { content_name: "Free fabric swatches", num_items: picked.length }, String(data.get("email") ?? "")),
  );

  if (sent) {
    return (
      <div className="trade-done" role="status">
        <h3 className="proc-h">Thank you.</h3>
        <p className="body">We&apos;ve received your swatch request. Your free swatches will be on their way to you soon.</p>
      </div>
    );
  }

  return (
    <form className="swatch-order" onSubmit={onSubmit}>
      <Honeypot />
      <input type="hidden" name="total" value={`Free (${picked.length} swatch${picked.length === 1 ? "" : "es"})`} />
      <input type="hidden" name="swatches" value={all.filter((s) => picked.includes(s.key)).map((s) => s.label + (s.code ? ` (${s.code})` : "")).join("; ")} />
      {(["Furniture", "Bedroom"] as const).map((room) => (
        <div key={room} className="fl-room">
          <h2 className="fl-room-h">{room === "Furniture" ? "Furniture fabrics" : "Bedroom fabrics"}</h2>
          {FABRIC_LIBRARY.filter((F) => F.room === room).map((F) => (
            <fieldset className="fl-fabric" key={F.id} id={F.id}>
              <legend className="fl-name">{F.name}</legend>
              <div className="fl-about">
                {F.makeup && <p className="fl-makeup">{F.makeup}</p>}
                {F.body && <p className="body small">{F.body}</p>}
                {F.origin && <p className="fl-origin">{F.origin}</p>}
                {F.usedOn.length > 0 && (
                  <p className="fl-used">On {F.usedOn.map((u, i) => <span key={u.href}>{i > 0 && (i === F.usedOn.length - 1 ? " and " : ", ")}<Link href={u.href}>{u.name}</Link></span>)}.</p>
                )}
                {F.note && <p className="fl-used">{F.note}</p>}
              </div>
              <div className="fl-colors">
                {all.filter((s) => s.fabric === F.id).map((s) => {
                  const on = picked.includes(s.key);
                  return (
                    <button type="button" key={s.key} className={"fl-sw" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggle(s.key)}>
                      <span className={"fl-chip" + (s.tex ? " tex-" + s.tex : "")} style={s.photo ? { backgroundImage: `url(${PHOTOS[s.photo].src})` } : { background: s.color }}>
                        {on && <span className="fl-check" aria-hidden="true">✓</span>}
                      </span>
                      <span className="fl-sw-t">{s.label.split(" · ")[1]}</span>
                      {s.alsoCalled && <small>{s.alsoCalled}</small>}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ))}
      <div className="fl-bar" aria-live="polite">
        <span>{picked.length} of {MAX_SWATCHES} chosen · Free{limitHit ? ` · You can choose up to ${MAX_SWATCHES}.` : ""}</span>
        <a href="#swatch-form" className="btn light">{picked.length ? "Send my swatches" : "Choose up to " + MAX_SWATCHES}</a>
      </div>
      <div id="swatch-form" className="fl-form-h">
        <h2 className="h2">Where should we send them?</h2>
        <p className="body">
          {picked.length ? <>Your swatches: {all.filter((s) => picked.includes(s.key)).map((s) => s.label).join(", ")}.</> : "Choose up to " + MAX_SWATCHES + " swatches above."}
        </p>
      </div>
      {needOne && <p className="form-error" role="alert">Choose at least one swatch above.</p>}

      <div className="tform">
        <label><span className="eyebrow">Name *</span><input name="name" autoComplete="name" required /></label>
        <label><span className="eyebrow">Email *</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span className="eyebrow">Phone</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" /></label>
        <label className="full"><span className="eyebrow">Mailing address *</span><input name="address" autoComplete="street-address" required /></label>
        <label><span className="eyebrow">City *</span><input name="city" autoComplete="address-level2" required /></label>
        <div className="tform-pair">
          <label><span className="eyebrow">State *</span><input name="state" autoComplete="address-level1" required /></label>
          <label><span className="eyebrow">ZIP *</span><input name="zip" inputMode="numeric" autoComplete="postal-code" required /></label>
        </div>
        {/* SMS consent: unchecked by default. Wording pending the SMS plan (Tessa to confirm). */}
        <label className="full sw-consent">
          <input type="checkbox" name="textConsent" value="yes" />
          <span>Text me about my swatches and new pieces from Ashwick Home. Consent isn&apos;t a condition of purchase. Message frequency varies; message and data rates may apply. Reply STOP to opt out, HELP for help.</span>
        </label>
        <label className="full"><span className="eyebrow">Anything we should know?</span><textarea name="notes" rows={3} placeholder="The piece you're considering, the room it's for" /></label>
        <FormError message={error} />
        <button className="btn full" type="submit" disabled={sending}>{sending ? "Sending…" : "Send my free swatches"}</button>
      </div>
    </form>
  );
}
