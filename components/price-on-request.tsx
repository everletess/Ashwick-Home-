"use client";

// Which pieces are "Price upon request", for client components (cards, product page, cart). The layout reads the list
// from Shopify (lib/price-on-request.ts) and passes it down.
import { createContext, useContext } from "react";

const PorCtx = createContext<ReadonlySet<string>>(new Set());

export function PriceOnRequestProvider({ ids, children }: { ids: string[]; children: React.ReactNode }) {
  return <PorCtx.Provider value={new Set(ids)}>{children}</PorCtx.Provider>;
}

/** The set of site product ids priced upon request. */
export function usePriceOnRequest() {
  return useContext(PorCtx);
}

export const POR_LABEL = "Price upon request";
