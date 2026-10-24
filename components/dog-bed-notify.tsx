"use client";

import { SHOW_SIGNUP_EVENT } from "@/components/email-popup";

/** Opens the email sign-up, so people hear when the dog beds launch. */
export function DogBedNotify() {
  return (
    <button type="button" className="btn full" onClick={() => window.dispatchEvent(new Event(SHOW_SIGNUP_EVENT))}>
      Be the first to know
    </button>
  );
}
