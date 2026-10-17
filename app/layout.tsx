import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
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
    "Organic furniture, handmade to order in the USA from solid hardwood, organic wool, coconut coir and linen. Nothing synthetic.",
};

// Matches the header, so the mobile browser chrome blends into the page.
export const viewport: Viewport = { themeColor: "#F6F2EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2374903172913431');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2374903172913431&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
