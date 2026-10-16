/**
 * Figures used in the trade terms (Trade page) and the warranty page, kept in one place so they're easy to change.
 * Industry defaults pending confirmation against the manufacturer agreement and review by counsel, except where
 * marked confirmed.
 */
export const TRADE_TERMS = {
  reviewDays: 2,
  /** Tier names and discounts confirmed by Tessa; thresholds pending. `spend` null = on approval. */
  tiers: [
    { name: "Member", spend: null, discount: 10 },
    { name: "Studio", spend: 25000, discount: 15 },
    { name: "Atelier", spend: 75000, discount: 20 },
  ],
  swatchLimit: 10,
  depositPercent: 50,
  quoteDays: 30,
  leadTime: "8–12 weeks",
  whiteGloveArea: "the contiguous United States",
  changeWindowHours: 48,
  returnDays: 14,
  restockingPercent: 15,
  damageReportDays: 5,
  referralPercent: 10,
  referralPaidDays: 30,
  /** Confirmed by Tessa. */
  warranty: "lifetime warranty",
  warrantyClaimResponseDays: 5,
};

export const WARRANTY_PATH = "/pages/warranty";
export const TRADE_TERMS_PATH = "/pages/trade-terms";
