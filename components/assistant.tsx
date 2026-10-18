"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SHOW_SIGNUP_EVENT } from "@/components/email-popup";
import { track } from "@/lib/pixel";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi, I'm the Ashwick assistant (an AI). Ask me anything about our furniture, the Ashbury mattress, fabrics, delivery or Bespoke. If you'd like a person, I can pass you to the team.";
const SUGGESTIONS = ["Soft or firm, which is right for me?", "What fabrics can I choose for a sofa?", "How does the 100-night guarantee work?"];
// Pages where a floating button would get in the way.
const HIDDEN = ["/account"];

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
      if (data.handedOff) track("Contact", { content_name: "Assistant hand-off" });
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
              <p key={i} className={`asst-msg ${m.role}`}>{m.content}</p>
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
