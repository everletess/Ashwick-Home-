import { MATTRESS_DESCRIPTION, SITE, mattressItems } from "@/lib/mattress-feed";
import { MATTRESS } from "@/lib/mattress";

/**
 * Google Merchant Center product feed (RSS 2.0, g: namespace) for The Ashbury.
 * Add in Merchant Center: Products → Add products → From a file → "Add a file from a link" → https://ashwickhome.com/feeds/google
 */
export const dynamic = "force-static";
export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = mattressItems()
    .map(
      (i) => `    <item>
      <g:id>${esc(i.id)}</g:id>
      <g:item_group_id>${i.groupId}</g:item_group_id>
      <g:title>${esc(i.title)}</g:title>
      <g:description>${esc(MATTRESS_DESCRIPTION)}</g:description>
      <g:link>${esc(i.link)}</g:link>
      <g:image_link>${esc(i.image)}</g:image_link>
${i.extraImages.map((u) => `      <g:additional_image_link>${esc(u)}</g:additional_image_link>`).join("\n")}
      <g:availability>in_stock</g:availability>
      <g:price>${i.price.toFixed(2)} USD</g:price>
      <g:brand>Ashwick Home</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:condition>new</g:condition>
      <g:google_product_category>2696</g:google_product_category>
      <g:product_type>Home &gt; Bedroom &gt; Mattresses &gt; Organic Mattresses</g:product_type>
      <g:size>${esc(i.size)}</g:size>
      <g:color>${esc(i.color)}</g:color>
      <g:material>Organic Wool/Horsehair/Organic Cotton</g:material>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>White glove</g:service>
        <g:price>${MATTRESS.delivery.price.toFixed(2)} USD</g:price>
      </g:shipping>
      <g:min_handling_time>3</g:min_handling_time>
      <g:max_handling_time>4</g:max_handling_time>
      <g:custom_label_0>ashbury</g:custom_label_0>
      <g:custom_label_1>${esc(i.size)}</g:custom_label_1>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Ashwick Home</title>
    <link>${SITE}</link>
    <description>Ashwick Home product feed</description>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
