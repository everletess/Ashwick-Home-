"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/subscribe";

/** Remembers which ad or link brought a visitor (UTM tags), so a later sign-up can be credited to it. */
export function UtmCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
