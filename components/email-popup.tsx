"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aw-popup-dismissed";
const DELAY_MS = 8000; // 8 seconds after page load

export function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show if already dismissed / subscribed this session or previously
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;
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
      const fd = new FormData();
      fd.append("form", "newsletter");
      fd.append("email", email.trim());
      // Honeypot
      fd.append("_gotcha", "");
      const res = await fetch("/api/forms", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
      // Close after short celebration
      setTimeout(dismiss, 3200);
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
              Your 10% discount code is on its way to your inbox. Made slowly. Worth the wait.
            </p>
          </div>
        ) : (
          <form className="ep-form" onSubmit={submit} noValidate>
            <p className="ep-eyebrow eyebrow">For new arrivals &amp; the occasional edit</p>
            <p className="ep-h h3" id="ep-title">
              Built to be inherited.
            </p>
            <p className="ep-body body small" id="ep-desc">
              Join the list for early access to new pieces, material stories, and 10% off your first order.
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
              {status === "loading" ? "One moment…" : "Get 10% off"}
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
