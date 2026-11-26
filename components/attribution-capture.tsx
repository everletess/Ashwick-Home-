"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records where this visit came from (lib/attribution.ts). Renders nothing. Mounted once in the root layout. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
