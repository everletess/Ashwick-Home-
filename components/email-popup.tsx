"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aw-popup-dismissed";
const DELAY_MS = 8000; // 8 seconds after page load
// Public Klaviyo IDs (safe to expose). Set in Vercel env vars.
const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
const DISCOUNT_CODE = "ASHWICK15";

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show if already dismissed / subscribed this session or previously
    if (typeof window !== "undefined" && (sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY))) return;
    timerRef.current = setTimeout(() => setVisible(true), DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Focus input when popup opens
  useEffect(() => {
    if (visible) inputRef.current?.focus();
  }, [visible]);

  // Escape key closes
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const value = email.trim();
      // 1) Klaviyo: adds them to the list, which triggers the welcome flow (sends ASHWICK15).
      //    Uses Klaviyo's public client API — only the public site ID, no secret key.
      const klaviyo = (async () => {
        if (!KLAVIYO_COMPANY_ID || !KLAVIYO_LIST_ID) return false;
        const r = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/vnd.api+json", revision: "2024-10-15" },
          body: JSON.stringify({
            data: {
              type: "subscription",
              attributes: {
                custom_source: "Ashwick website popup",
                profile: { data: { type: "profile", attributes: { email: value } } },
              },
              relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
            },
          }),
        });
        return r.ok; // 202 Accepted
      })().catch(() => false);
      // 2) Studio notification via the existing forms route (best effort).
      const studio = (async () => {
        const fd = new FormData();
        fd.append("form", "newsletter");
        fd.append("email", value);
        const r = await fetch("/api/forms", { method: "POST", body: fd });
        return r.ok;
      })().catch(() => false);
      const [k, s] = await Promise.all([klaviyo, studio]);
      if (!k && !s) throw new Error("We couldn't sign you up just now. Please try again.");
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      if (typeof fbq === "function") fbq("track", "Lead", { content_name: "Email popup" });
      setStatus("done");
      localStorage.setItem(STORAGE_KEY, "subscribed");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Please try again.");
      setStatus("error");
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="ep-scrim" onClick={dismiss} aria-hidden />

      {/* Modal */}
      <div
        className="ep"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ep-title"
        aria-describedby="ep-desc"
      >
        <button className="ep-x x" aria-label="Close" onClick={dismiss}>×</button>

        {status === "done" ? (
          <div className="ep-done">
            <p className="ep-eyebrow eyebrow">Welcome</p>
            <p className="ep-h h3" id="ep-title">You&apos;re on the list.</p>
            <p className="ep-body body small" id="ep-desc">
              Here&apos;s 15% off your first order. We&apos;ve sent it to your inbox too.
            </p>
            <p className="ep-code">{DISCOUNT_CODE}</p>
            <p className="fine">Enter it at checkout. One use per customer.</p>
            <button type="button" className="btn full" onClick={dismiss}>Continue browsing</button>
          </div>
        ) : (
          <form className="ep-form" onSubmit={submit} noValidate>
            <p className="ep-eyebrow eyebrow">For new arrivals &amp; the occasional edit</p>
            <p className="ep-h h3" id="ep-title">
              Built to be inherited.
            </p>
            <p className="ep-body body small" id="ep-desc">
              Join the list for early access to new pieces, material stories, and 15% off your first order.
            </p>

            <div className="ep-field">
              <label htmlFor="ep-email" className="ep-label eyebrow">Your email</label>
              <input
                ref={inputRef}
                id="ep-email"
                type="email"
                className="ep-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus("idle"); setErrorMsg(""); }}
                required
                autoComplete="email"
              />
            </div>

            {errorMsg && <p className="ep-err fine">{errorMsg}</p>}

            <button
              type="submit"
              className="btn full"
              disabled={status === "loading"}
            >
              {status === "loading" ? "One moment…" : "Get 15% off"}
            </button>

            <button type="button" className="ep-skip fine" onClick={dismiss}>
              No thanks
            </button>
          </form>
        )}
      </div>
    </>
  );
}
