/**
 * Ashwick Home — Shopify Storefront API client.
 * Used server-side only (API routes) to create carts and checkouts.
 * The public Storefront token is safe to ship in env; it's unauthenticated-read only.
 */

const STORE = process.env.SHOPIFY_STORE_ASHWICK!;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN_ASHWICK!;
const API = `https://${STORE}/api/2024-10/graphql.json`;

async function storefrontFetch(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Storefront API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

/** A single line in the Shopify cart — maps from our CartLine. */
export type CheckoutLine = {
  variantId: string; // Shopify variant GID
  quantity: number;
  customAttributes?: { key: string; value: string }[];
};

/**
 * Create a Shopify cart from the given lines and return the web checkout URL.
 * Each line must supply a Shopify variant GID:
 *   "gid://shopify/ProductVariant/<numeric_id>"
 */
export async function createCheckout(lines: CheckoutLine[]): Promise<string> {
  const data = await storefrontFetch(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { field message }
      }
    }`,
    {
      input: {
        lines: lines.map((l) => ({
          merchandiseId: l.variantId,
          quantity: l.quantity,
          attributes: l.customAttributes ?? [],
        })),
      },
    }
  );
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors.map((e: { message: string }) => e.message).join(", "));
  return cart.checkoutUrl as string;
}

/** Fetch all published product variants from Shopify for ID mapping. */
export async function fetchProductVariants(): Promise<
  { productHandle: string; variantId: string; title: string }[]
> {
  const data = await storefrontFetch(
    `{ products(first: 50) {
        edges { node {
          handle
          variants(first: 50) {
            edges { node { id title } }
          }
        }}
      }
    }`
  );
  const results: { productHandle: string; variantId: string; title: string }[] = [];
  for (const { node: product } of data.products.edges) {
    for (const { node: variant } of product.variants.edges) {
      results.push({ productHandle: product.handle, variantId: variant.id, title: variant.title });
    }
  }
  return results;
}
