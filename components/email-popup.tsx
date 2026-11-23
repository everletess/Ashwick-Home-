"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart";
import { SUBSCRIBED_EVENT, SUBSCRIBED_KEY, subscribeEmail } from "@/lib/subscribe";
import { SALE } from "@/lib/sale";

const STORAGE_KEY = SUBSCRIBED_KEY;
// When it opens (Tessa's brief, Nov 22): after 15 s on a page, at 40% scroll, or on desktop exit intent, once per session.
// Product pages (where every Meta ad lands): after 20 s or at 40% scroll or exit intent, never in the first 8 s,
// never with the cart drawer open, and not again this session once something has been added to the cart.
const SCROLL_FRACTION = 0.4;
const WAIT_MS = 15000;
const PRODUCT_WAIT_MS = 20000;
const PRODUCT_MIN_MS = 8000;
const SESSION_KEY = "aw-sheet-shown";
const ADDED_KEY = "aw-added-to-cart"; // set when something goes in the cart this session
// Pages where someone is mid-form or buying; the pop-up waits until they move on.
const QUIET_PATHS = ["/pages/bespoke", "/pages/trade", "/account", "/cart", "/checkout"];
const isProductPage = (path: string | null) => !!path?.startsWith("/products/");
const DISMISS_DAYS = 7; // "No thanks" or × hides the pop-up this long; subscribers never see it again
const TAB_HIDDEN_KEY = "aw-tab-hidden"; // closing the tab hides it for this browser session
const DISCOUNT_CODE = "ASHWICK15";
/** The sale's last day, "December 1" / "Dec 1" (Pacific), for the sale-time copy. */
export function saleEndDay(month: "long" | "short" = "long") {
  if (!SALE.endsAt) return "";
  return new Date(SALE.endsAt).toLocaleDateString("en-US", { month, day: "numeric", timeZone: "America/Los_Angeles" });
}
function addedThisSession() {
  try {
    return sessionStorage.getItem(ADDED_KEY) === "1";
  } catch {
    return false;
  }
}
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
  const { open: cartOpen, count } = useCart();
  const [due, setDue] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Something added to the cart: the drawer opens in the same moment, so a rise in count while it's open is an add
  // (a saved cart loading on arrival doesn't open the drawer). The pop-up then stays away for the session.
  const lastCount = useRef<number | null>(null);
  useEffect(() => {
    if (lastCount.current != null && count > lastCount.current && cartOpen) {
      try { sessionStorage.setItem(ADDED_KEY, "1"); } catch {}
      setDue(false);
    }
    lastCount.current = count;
  }, [count, cartOpen]);

  // Timers restart on each page, so "20 seconds" means 20 seconds on that product page.
  useEffect(() => {
    if (isSubscribed()) return;
    // Ad links with ?offer=15 open the 15% sign-up straight away, even for people who said "No thanks" before.
    try {
      if (new URLSearchParams(window.location.search).get("offer") === "15") {
        setDue(true);
        return;
      }
    } catch {}
    if (seen()) return;
    try { if (sessionStorage.getItem(SESSION_KEY) === "1") return; } catch {}
    const product = isProductPage(pathname);
    if (product && addedThisSession()) return;
    const start = Date.now();
    let early: number | undefined;
    // On a product page nothing opens in the first 8 seconds; an earlier scroll or exit waits for the 8-second mark.
    const fire = () => {
      const wait = product ? PRODUCT_MIN_MS - (Date.now() - start) : 0;
      if (wait <= 0) setDue(true);
      else if (early == null) early = window.setTimeout(() => setDue(true), wait);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_FRACTION) fire();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(fire, product ? PRODUCT_WAIT_MS : WAIT_MS);
    // Exit intent (desktop): if they head for the tabs or address bar, open now.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) fire();
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(early);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [pathname]);

  // Waits while the cart drawer is open or on a form or checkout page; on a product page, not after an add to cart.
  const quiet = cartOpen || QUIET_PATHS.some((p) => pathname?.startsWith(p)) || (isProductPage(pathname) && addedThisSession());
  const show = due && !quiet;
  const [shown, setShown] = useState(false);
  if (show && !shown) {
    setShown(true);
    setVisible(true);
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
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
    // No persistent bar or tab any more: the sign-up is one bottom sheet, shown once per session.
    return null;
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
              {SALE.active ? <>We&apos;ll remind you before {saleEndDay()}.</> : <>Here&apos;s 15% off your first order.{emailed && <> We&apos;ve sent it to your inbox too.</>} The first Ashwick Letter will land in your inbox soon.</>}
            </p>
            {!SALE.active && <><p className="ep-code">{DISCOUNT_CODE}</p>
            <p className="fine">Enter it at checkout. One use per customer.</p></>}
            <button type="button" className="btn full" onClick={dismiss}>Continue browsing</button>
          </div>
        ) : (
          <form className="ep-form" onSubmit={submit} noValidate>
            <button type="button" className="ep-x x" aria-label="Close" onClick={dismiss}>×</button>
            <p className="ep-eyebrow eyebrow">The Ashwick Letter</p>
            {/* Phones get the short version (ep-short), a compact card that leaves the page visible. */}
            <p className="ep-h h3" id="ep-title">
              <span className="ep-long">{SALE.active ? `${SALE.percent}% off ends ${saleEndDay()}.` : "Built to be inherited."}</span>
              <span className="ep-short">{SALE.active ? `${SALE.percent}% off ends ${saleEndDay("short")}` : "15% off your first order"}</span>
            </p>
            <p className="ep-body body small" id="ep-desc">
              <span className="ep-long">{SALE.active ? "Join the Ashwick Letter and we'll send you a reminder before it ends, plus first access to new pieces and colours." : "Join our exclusive organic design newsletter: material stories, natural interiors, and first access to new pieces. Plus 15% off your first order."}</span>
              <span className="ep-short">{SALE.active ? "We'll remind you before it ends." : "Join the Ashwick Letter for material stories, new pieces and your code."}</span>
            </p>

            <div className="ep-row">

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
              className="btn full ep-submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "One moment…" : (
                <>
                  <span className="ep-long">{SALE.active ? "Remind me" : "Get 15% off + the newsletter"}</span>
                  <span className="ep-short">Submit</span>
                </>
              )}
            </button>
            </div>

            <button type="button" className="ep-skip fine" onClick={dismiss}>
              No thanks
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/** Product pages, below the FAQ and above the footer (Tessa's brief, Nov 22). Hidden for subscribers. */
export function ProductLetter() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [known, setKnown] = useState(true); // hidden until we know they haven't subscribed (no flash for subscribers)
  useEffect(() => {
    setKnown(isSubscribed());
    const hide = () => setKnown(true);
    window.addEventListener(SUBSCRIBED_EVENT, hide);
    return () => window.removeEventListener(SUBSCRIBED_EVENT, hide);
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await subscribeEmail(email, "Ashwick product page");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Please try again.");
      setStatus("error");
    }
  }
  if (!isProductPage(pathname)) return null;
  if (known && status !== "done") return null;
  return (
    <section className="pl" aria-labelledby="pl-h">
      <div className="pl-in">
        <h2 className="eyebrow" id="pl-h">The Ashwick Letter</h2>
        {status === "done" ? (
          <p className="pl-line" role="status">{SALE.active ? <>You&apos;re on the list. We&apos;ll remind you before {saleEndDay()}.</> : <>You&apos;re on the list.</>}</p>
        ) : (
          <>
            <p className="pl-line">{SALE.active ? `Not ready yet? We'll remind you before ${SALE.percent}% off ends on ${saleEndDay()}.` : "Material stories, new pieces and colours, first."}</p>
            <form className="nl-form pl-form" onSubmit={submit} noValidate>
              <input type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} autoComplete="email" />
              <button type="submit" disabled={status === "loading"}>{status === "loading" ? "…" : SALE.active ? "Remind me" : "Join"}</button>
            </form>
            {status === "error" && <p className="form-error" role="alert">{errorMsg}</p>}
          </>
        )}
      </div>
    </section>
  );
}

/** Compact sign-up for the footer: same list, same 15% welcome code. */
export function FooterSignup() {
  // The homepage has its own full Ashwick Letter block just above the footer: one sign-up per page.
  const onHome = usePathname() === "/";
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
  if (onHome) return null;
  return (
    <div className="ftr-nl">
      <div className="fcol-t">The Ashwick Letter</div>
      {status === "done" ? (
        <p className="ftr-nl-done" role="status">{SALE.active ? "You’re on the list." : <>You&apos;re on the list. Your 15% code is on its way: {DISCOUNT_CODE}</>}</p>
      ) : (
        <>
          <p className="ftr-nl-copy">{SALE.active ? "Deals throughout the month, material stories and natural interiors." : "Material stories and natural interiors, weekly. 15% off your first order."}</p>
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
