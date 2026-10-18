import { InfoPage } from "@/components/info-page";
import { fetchShopPolicy, type PolicyKind } from "@/lib/shopify";
import { STUDIO_EMAIL } from "@/lib/site";

// Privacy, Terms and the like are written in Shopify admin (Settings → Policies) and shown here as written.
export async function PolicyPage({ kind, title }: { kind: PolicyKind; title: string }) {
  const policy = await fetchShopPolicy(kind);
  return (
    <InfoPage eyebrow="Policies" title={policy?.title ?? title}>
      {policy ? (
        <div className="body policy" dangerouslySetInnerHTML={{ __html: policy.body }} />
      ) : (
        <p className="body">
          This page is being updated. For a copy, email <a href={`mailto:${STUDIO_EMAIL}`} className="inl">{STUDIO_EMAIL}</a>.
        </p>
      )}
    </InfoPage>
  );
}
