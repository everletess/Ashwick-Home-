"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";

const STORAGE_KEY = "aw-popup-dismissed";
const DELAY_MS = 8000; // 8 seconds after arriving
const DISMISS_DAYS = 14; // "No thanks" hides it this long; subscribers never see it again
// Pages where someone is mid-form; the popup waits until they move on.
const QUIET_PATHS = ["/pages/bespoke", "/pages/trade", "/account"];
// Public Klaviyo IDs (safe to expose). Set in Vercel env vars.
const KLAVIYO_COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID ?? "";
const KLAVIYO_LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID ?? "";
const DISCOUNT_CODE = "ASHWICK15";
/** Dispatch on window to open the sign-up form on request (the site assistant does this). */
export const SHOW_SIGNUP_EVENT = "ashwick:show-signup";

// Storage can throw (private mode, blocked site data); treat that as "nothing stored".
function seen() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "subscribed" || (!!v && Date.now() < Number(v));
  } catch {
    return false;
  }
}
function remember(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}

export function EmailPopup() {
  const pathname = usePathname();
  const { open: cartOpen } = useCart();
  const [due, setDue] = useState(false);
  const [visible, setVisible] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (seen()) return;
    timerRef.current = setTimeout(() => setDue(true), DELAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Once the 8 seconds are up, open as soon as the visitor isn't in the cart or a form page.
  const quiet = cartOpen || QUIET_PATHS.some((p) => pathname?.startsWith(p));
  const show = due && !quiet;
  const [shown, setShown] = useState(false);
  if (show && !shown) {
    setShown(true);
    setVisible(true);
  }

  // Opened on request, e.g. by the assistant when someone asks about discounts.
  useEffect(() => {
    const open = () => {
      setStatus("idle");
      setVisible(true);
    };
    window.addEventListener(SHOW_SIGNUP_EVENT, open);
    return () => window.removeEventListener(SHOW_SIGNUP_EVENT, open);
  }, []);

  // Focus input when popup opens
  useEffect(() => {
    if (visible) inputRef.current?.focus();
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (!seen()) remember(String(Date.now() + DISMISS_DAYS * 86400000));
  }, []);

  // Escape key closes
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

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
      setEmailed(k);
      setStatus("done");
      remember("subscribed");
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
        {status === "done" ? (
          <div className="ep-done">
            <button className="ep-x x" aria-label="Close" onClick={dismiss}>×</button>
            <p className="ep-eyebrow eyebrow">Welcome</p>
            <p className="ep-h h3" id="ep-title">You&apos;re on the list.</p>
            <p className="ep-body body small" id="ep-desc">
              Here&apos;s 15% off your first order.{emailed && <> We&apos;ve sent it to your inbox too.</>} The first Ashwick Letter will land in your inbox soon.
            </p>
            <p className="ep-code">{DISCOUNT_CODE}</p>
            <p className="fine">Enter it at checkout. One use per customer.</p>
            <button type="button" className="btn full" onClick={dismiss}>Continue browsing</button>
          </div>
        ) : (
          <form className="ep-form" onSubmit={submit} noValidate>
            <button type="button" className="ep-x x" aria-label="Close" onClick={dismiss}>×</button>
            <p className="ep-eyebrow eyebrow">The Ashwick Letter</p>
            <p className="ep-h h3" id="ep-title">
              Built to be inherited.
            </p>
            <p className="ep-body body small" id="ep-desc">
              Join our exclusive organic design newsletter: material stories, natural interiors, and first access to new pieces. Plus 15% off your first order.
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
              {status === "loading" ? "One moment…" : "Get 15% off + the newsletter"}
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
