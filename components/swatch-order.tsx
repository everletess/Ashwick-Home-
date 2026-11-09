"use client";

// Free swatch request (up to SWATCH_MAX): pick fabric/color swatches and a mailing address; emailed to the studio via
// /api/forms, and sent to Meta as a Lead.
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormError, Honeypot, useFormSend } from "@/components/forms";
import { FABRICS, SWATCH_MAX, type FabricId } from "@/lib/products";
import { track } from "@/lib/pixel";

const MAX_SWATCHES = SWATCH_MAX;

type Swatch = { key: string; fabric: FabricId; label: string; color: string; tex: string; code?: string };

export function SwatchOrder({ fabrics }: { fabrics: FabricId[] }) {
  const params = useSearchParams();
  const all: Swatch[] = fabrics.flatMap((f): Swatch[] => {
    const F = FABRICS[f];
    return F.colors
      ? F.colors.map((c) => ({ key: `${f}:${c.id}`, fabric: f, label: `${F.label} · ${c.label}`, color: c.swatch, tex: F.tex, code: c.code }))
      : [{ key: f, fabric: f, label: F.label, color: F.swatch, tex: F.tex }];
  });
  // ?fabric=irish&color=flax preselects the swatch the customer was looking at.
  // "italian" was the Belgian linen's old id; older links still use it.
  const pre = [params.get("fabric")?.replace(/^italian$/, "belgian"), params.get("color")].filter(Boolean).join(":");
  const [picked, setPicked] = useState<string[]>(() => all.filter((s) => s.key === pre || s.key === params.get("fabric")).map((s) => s.key).slice(0, 1));
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
      {fabrics.map((f) => {
        const group = all.filter((s) => s.fabric === f);
        return (
          <fieldset className="sw-group" key={f}>
            <legend className="eyebrow">{FABRICS[f].label}</legend>
            {FABRICS[f].detail && <p className="fine">{FABRICS[f].detail}</p>}
            <div className="sw-pick">
              {group.map((s) => {
                const on = picked.includes(s.key);
                return (
                  <button type="button" key={s.key} className={"sw-opt" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggle(s.key)}>
                    <span className={"chip tex-" + s.tex} style={{ background: s.color }} />
                    <span>{s.label.split(" · ")[1] ?? s.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
      <p className="fine" aria-live="polite">
        {picked.length} of {MAX_SWATCHES} chosen · Free
        {limitHit ? `. You can choose up to ${MAX_SWATCHES} swatches.` : ""}
      </p>
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
