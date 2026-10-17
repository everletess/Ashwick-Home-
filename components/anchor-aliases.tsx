"use client";

import { useEffect } from "react";

/** Old anchors on a page that moved (e.g. Design your own → Bespoke), sent on to their new ids. */
export function AnchorAliases({ map }: { map: Record<string, string> }) {
  useEffect(() => {
    const to = map[window.location.hash.slice(1)];
    if (!to) return;
    history.replaceState(null, "", `#${to}`);
    document.getElementById(to)?.scrollIntoView();
  }, [map]);
  return null;
}
