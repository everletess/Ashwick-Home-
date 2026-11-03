import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/components/cart";
import { Assistant } from "@/components/assistant";
import { EmailPopup } from "@/components/email-popup";
import { UtmCapture } from "@/components/utm-capture";
import { Footer } from "@/components/footer";
import { AnnouncementBar, CartDrawer, Header } from "@/components/shell";
import { PHOTOS } from "@/lib/photos";
import { SALE } from "@/lib/sale";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashwickhome.com"),
  title: { default: "Ashwick Home — Made of nature. Built to last.", template: "%s — Ashwick Home" },
  description:
    "Organic furniture and natural mattresses, handmade to order in the USA. Solid hardwood, organic wool, horsehair and linen — nothing synthetic. The Ashbury organic mattress from $3,800.",
  // The link preview (iMessage, Facebook, Instagram, X). During the sale it carries the Black Friday message; when
  // SALE.active goes false it reverts to the standard wording by itself.
  openGraph: SALE.active
    ? {
        type: "website",
        siteName: "Ashwick Home",
        title: `${SALE.name} at Ashwick: ${SALE.percent}% off everything`,
        description: `${SALE.percent}% off the whole collection, mattresses included. Plus two bundles with free white glove delivery for the mattress. Organic furniture and mattresses, handmade to order in the USA.`,
        images: [{ url: PHOTOS["bf-share"].src, width: 1200, height: 630, alt: "A terracotta Ashbury mattress, a boucle chair and a cream sofa on a rug in an autumn hillside landscape" }],
      }
    : { type: "website", siteName: "Ashwick Home", title: "Ashwick Home — Made of nature. Built to last.", images: [{ url: PHOTOS["mattress-mocha-bedroom"].src }] },
  twitter: { card: "summary_large_image" },
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
              n.queue=[];
              // The stub above queues every fbq() call; the library itself downloads after the page has loaded, so it
              // doesn't compete with the hero photo. Nothing is dropped: the queue is replayed when it arrives.
              var load=function(){t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)};
              if(b.readyState==='complete')setTimeout(load,0);else f.addEventListener('load',function(){setTimeout(load,0)})}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1118741870615996');
              fbq('track', 'PageView');
            `,
          }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DF7TVX6FPJ" strategy="lazyOnload" />
        <Script
          id="ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // Only the live site is measured: Vercel preview builds and bots on other hosts are left out.
              if (/(^|\\.)ashwickhome\\.com$/.test(location.hostname)) gtag('config', 'G-DF7TVX6FPJ');
            `,
          }}
        />
        <Script
          id="ms-clarity-tag"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              if (/(^|\\.)ashwickhome\\.com$/.test(location.hostname)) (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "z3cfi09a5t");
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1118741870615996&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <CartProvider>
          <UtmCapture />
          <AnnouncementBar />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <EmailPopup />
          {/* The chat button only shows once the Anthropic key is set in Vercel (redeploy after adding it). */}
          {process.env.ANTHROPIC_API_KEY ? <Assistant /> : null}
        </CartProvider>
      </body>
    </html>
  );
}
