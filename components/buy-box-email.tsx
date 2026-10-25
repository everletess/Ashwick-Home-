"use client";

import { useEffect, useState } from "react";
import { SUBSCRIBED_EVENT, SUBSCRIBED_KEY, subscribeEmail } from "@/lib/subscribe";

const DISCOUNT_CODE = "ASHWICK15";

/** Email capture directly under Add to cart: 15% off for visitors who aren't ready to buy yet. Hidden for subscribers. */
export function BuyBoxEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [known, setKnown] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBED_KEY) === "subscribed") setKnown(true);
    } catch {}
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

  if (status === "done") {
    return (
      <p className="bb-email-done" role="status">
        You&apos;re on the list. Your 15% code is on its way: {DISCOUNT_CODE}
      </p>
    );
  }
  if (known) return null;
  return (
    <div className="bb-email">
      <p className="bb-email-h">Not ready yet? Take 15% off your first order.</p>
      <form className="bb-email-form" onSubmit={submit} noValidate>
        <input type="email" required placeholder="Email address" aria-label="Email address" value={email} onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }} autoComplete="email" />
        <button type="submit" disabled={status === "loading"}>{status === "loading" ? "…" : "Send my code"}</button>
      </form>
      {status === "error" && <p className="form-error" role="alert">{errorMsg}</p>}
      <p className="bb-email-fine">Joins The Ashwick Letter. Unsubscribe any time.</p>
    </div>
  );
}
