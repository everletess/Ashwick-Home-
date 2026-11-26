import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GiftsHelp, GiftsHero } from "@/components/gifts-page";
import { BestFriendsDeal, FurnitureDeal, GiftsDeal, HolidayDelivery, SuiteDeal } from "@/components/holiday-edit";
import { GIFTS_PATH, giftsActive } from "@/lib/holiday";
import { getLivePrices } from "@/lib/live-prices";
import { PHOTOS } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Holiday Gifts — Ashwick Home",
  description: "Organic gifts, handmade to order in the USA: pillows and dog beds under $300, the Complete Sleep Suite, and furniture to be handed down. Order-by dates for delivery before Christmas.",
  alternates: { canonical: GIFTS_PATH },
  openGraph: {
    type: "website",
    siteName: "Ashwick Home",
    title: "Holiday Gifts — Ashwick Home",
    description: "Organic gifts, handmade to order in the USA. Order-by dates for delivery before Christmas.",
    images: [{ url: PHOTOS["holiday-living-room"].src, alt: "The Marlowe Sofa and Chair beside a lit Christmas tree" }],
  },
};

/**
 * /gifts, the Holiday Gifts page (Tessa, Nov 26: "more holiday focused and festive"). Live through Christmas Day, so the
 * gift guide and the order-by dates stay on the site after Black Friday ends; then it redirects to all products.
 * During the sale, prices show the sale (the sections work them out as checkout does).
 */
export default async function GiftsPage() {
  if (!giftsActive()) redirect("/collections/all");
  const prices = await getLivePrices();
  return (
    <main className="hx gx">
      <GiftsHero />
      <HolidayDelivery />
      <GiftsDeal prices={prices} />
      <SuiteDeal prices={prices} kicker="The big gift" />
      <BestFriendsDeal prices={prices} kicker="For them and the dog" />
      <FurnitureDeal prices={prices} kicker="For the home" title="Give it for Christmas." line="Our furniture is handmade to order and delivered in the new year. Order now and give the news under the tree." />
      <GiftsHelp />
    </main>
  );
}
