import type { Metadata } from "next";
import { CartDrawer } from "@/components/shell";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

/**
 * /cart: the cart as a full page, the same contents as the drawer. Shopify's cart permalinks (/cart/{variant}:{qty})
 * and recovery links (/cart/c/…, /checkouts/…) are sent to Shopify's own domain in next.config.ts, where they open
 * checkout with those items.
 */
export default function CartPage() {
  return (
    <main className="cart-page">
      <CartDrawer page />
    </main>
  );
}
