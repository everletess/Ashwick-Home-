"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { SUBSCRIBED_EVENT, SUBSCRIBED_KEY, subscribeEmail } from "@/lib/subscribe";

const STORAGE_KEY = SUBSCRIBED_KEY;
const DELAY_MS = 5000; // 5 seconds after arriving
// Pages where someone is mid-form; the pop-up and the tab wait until they move on.
const QUIET_PATHS = ["/pages/bespoke", "/pages/trade", "/account"];
const DISMISS_DAYS = 14; // "No thanks" hides the pop-up this long (the small tab stays); subscribers never see either again
const TAB_HIDDEN_KEY = "aw-tab-hidden"; // closing the tab hides it for this browser session
const DISCOUNT_CODE = "ASHWICK15";
/** Dispatch on window to open the sign-up form on request (the site assistant does this). */
export const SHOW_SIGNUP_EVENT = "ashwick:show-signup";

// Storage can throw (private mode, blocked site data); treat that as "nothing stored".
function stored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
const isSubscribed = () => stored() === "subscribed";
function seen() {
  const v = stored();
  return v === "subscribed" || (!!v && Date.now() < Number(v));
}
function remember(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
}
function tabHidden() {
  try {
    return sessionStorage.getItem(TAB_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function EmailPopup() {
  const pathname = usePathname();
  const { open: cartOpen } = useCart();
  const [due, setDue] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // First visit: open after 5 seconds. Someone who said "No thanks" gets the small tab instead.
  useEffect(() => {
    if (isSubscribed()) return;
    // Ad links with ?offer=15 open the 15% sign-up straight away, even for people who said "No thanks" before.
    try {
      if (new URLSearchParams(window.location.search).get("offer") === "15") {
        setDue(true);
        return;
      }
    } catch {}
    if (seen()) {
      if (!tabHidden()) setTab(true);
      return;
    }
    const t = setTimeout(() => setDue(true), DELAY_MS);
    // Exit intent (desktop): if they head for the tabs or address bar before the 5 seconds, open now.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) setDue(true);
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(t);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Shows on every page, even with items in the cart. Waits while the cart drawer is open or on a form page.
  const quiet = cartOpen || QUIET_PATHS.some((p) => pathname?.startsWith(p));
  const show = due && !quiet;
  const [shown, setShown] = useState(false);
  if (show && !shown) {
    setShown(true);
    setVisible(true);
  }

  const open = useCallback(() => {
    setStatus("idle");
    setErrorMsg("");
    setVisible(true);
  }, []);

  // Signed up anywhere (footer, homepage): hide the tab and stop the pop-up from opening.
  useEffect(() => {
    const done = () => { setTab(false); setDue(false); };
    window.addEventListener(SUBSCRIBED_EVENT, done);
    return () => window.removeEventListener(SUBSCRIBED_EVENT, done);
  }, []);

  // Opened on request, e.g. by the assistant when someone asks about discounts.
  useEffect(() => {
    window.addEventListener(SHOW_SIGNUP_EVENT, open);
    return () => window.removeEventListener(SHOW_SIGNUP_EVENT, open);
  }, [open]);

  // Focus the input when the pop-up opens (desktop only, so phones don't jump straight to the keyboard).
  useEffect(() => {
    if (visible && window.matchMedia("(min-width: 641px)").matches) inputRef.current?.focus();
  }, [visible]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (isSubscribed()) {
      setTab(false);
      return;
    }
    if (!seen()) remember(String(Date.now() + DISMISS_DAYS * 86400000));
    if (!tabHidden()) setTab(true);
  }, []);

  const hideTab = () => {
    setTab(false);
    try {
      sessionStorage.setItem(TAB_HIDDEN_KEY, "1");
    } catch {}
  };

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
      const { klaviyo } = await subscribeEmail(email, "Ashwick website popup");
      setEmailed(klaviyo);
      setStatus("done");
      setTab(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Please try again.");
      setStatus("error");
    }
  }

  if (!visible) {
    if (!tab || quiet) return null;
    return (
      <div className="ep-tab">
        <button type="button" className="ep-tab-open" onClick={open}>15% off · The Ashwick Letter</button>
        <button type="button" className="ep-tab-x" aria-label="Hide" onClick={hideTab}>×</button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop (desktop only; on phones the sheet sits at the bottom and the page stays visible) */}
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

/** Compact sign-up for the footer: same list, same 15% welcome code. */
export function FooterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeEmail(email, "Ashwick website footer");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Please try again.");
      setStatus("error");
    }
  }
  return (
    <div className="ftr-nl">
      <div className="fcol-t">The Ashwick Letter</div>
      {status === "done" ? (
        <p className="ftr-nl-done" role="status">You&apos;re on the list. Your 15% code is on its way: {DISCOUNT_CODE}</p>
      ) : (
        <>
          <p className="ftr-nl-copy">Material stories and natural interiors, weekly. 15% off your first order.</p>
          <form className="nl-form ftr-nl-form" onSubmit={submit} noValidate>
            <input type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} autoComplete="email" />
            <button type="submit" disabled={status === "loading"}>{status === "loading" ? "…" : "Join"}</button>
          </form>
          {status === "error" && <p className="form-error" role="alert">{errorMsg}</p>}
        </>
      )}
    </div>
  );
}
