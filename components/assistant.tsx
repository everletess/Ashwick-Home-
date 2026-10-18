"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SHOW_SIGNUP_EVENT } from "@/components/email-popup";
import { track } from "@/lib/pixel";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi, I'm the Ashwick assistant (an AI). Ask me anything about our furniture, the Ashbury mattress, fabrics, delivery or Bespoke. If you'd like a person, email hello@ashwickhome.com or call (773) 597-9629.";
const SUGGESTIONS = ["Soft or firm, which is right for me?", "What fabrics can I choose for a sofa?", "How does the 100-night guarantee work?"];
// Pages where a floating button would get in the way.
const HIDDEN = ["/account"];

// Emails, phone numbers and links in replies become clickable; tapping an email or phone number counts as a Meta "Contact".
const LINKS = /([\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/[^\s]+[^\s.,!?)]|\(?\b\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}\b)/g;
function Linked({ text }: { text: string }) {
  return (
    <>
      {text.split(LINKS).map((part, i) => {
        if (i % 2 === 0) return part;
        const email = part.includes("@") && !part.startsWith("http");
        const phone = !email && !part.startsWith("http");
        return (
          <a
            key={i}
            href={email ? `mailto:${part}` : phone ? `tel:+1${part.replace(/\D/g, "")}` : part}
            className="inl"
            onClick={email || phone ? () => track("Contact", { content_name: `Assistant ${email ? "email" : "phone"} link` }) : undefined}
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

export function Assistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [msgs, open]);
  if (HIDDEN.some((p) => pathname?.startsWith(p))) return null;

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const data = await res.json();
      setMsgs([...next, { role: "assistant", content: data.reply ?? "Sorry, something went wrong. Email hello@ashwickhome.com." }]);
      if (data.showSignup) window.dispatchEvent(new Event(SHOW_SIGNUP_EVENT));
    } catch {
      setMsgs([...next, { role: "assistant", content: "Sorry, something went wrong. Email hello@ashwickhome.com." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button className="asst-fab" onClick={() => setOpen(true)} aria-label="Ask us a question">
          Questions? Ask us
        </button>
      )}
      {open && (
        <div className="asst" role="dialog" aria-label="Ashwick assistant">
          <div className="asst-hd">
            <span>Ask Ashwick <em>AI assistant</em></span>
            <button className="linkbtn" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div className="asst-body" aria-live="polite">
            {msgs.map((m, i) => (
              <p key={i} className={`asst-msg ${m.role}`}>{m.role === "assistant" ? <Linked text={m.content} /> : m.content}</p>
            ))}
            {msgs.length === 1 && (
              <div className="asst-sugs">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}
            {busy && <p className="asst-msg assistant asst-typing">…</p>}
            <div ref={endRef} />
          </div>
          <form className="asst-in" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question" maxLength={1200} aria-label="Your question" />
            <button className="btn" disabled={busy || !input.trim()}>Send</button>
          </form>
        </div>
      )}
    </>
  );
}
