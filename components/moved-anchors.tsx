"use client";

import { useEffect } from "react";
import { MOVED_ANCHORS } from "@/lib/materials";

/** Links to old /pages/materials#anchor addresses land on the page that material moved to. */
export function MovedAnchors() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const to = MOVED_ANCHORS[id];
    if (to) window.location.replace(`${to}#${id}`);
  }, []);
  return null;
}
