import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { CartProvider } from "@/components/cart";
import { Footer } from "@/components/footer";
import { AnnouncementBar, CartDrawer, Header } from "@/components/shell";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Ashwick Home — Made of nature. Built to last.", template: "%s — Ashwick Home" },
  description:
    "Organic furniture, handmade to order in the USA from solid hardwood, organic wool, linen and kapok. Nothing synthetic.",
};

// Matches the header, so the mobile browser chrome blends into the page.
export const viewport: Viewport = { themeColor: "#F6F2EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
