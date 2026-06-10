import type {VoidShopifyVariant} from '~/lib/void-shopify';

/**
 * Maps editorial Void slugs → Shopify product handles on the connected preview store.
 * Replace with client catalog handles when the store goes live.
 *
 * @see https://hydrogen-preview.myshopify.com (default Hydrogen demo)
 */
export const VOID_SHOPIFY_BY_SLUG: Record<string, string> = {
  'shell-jacket': 'the-apex',
  'heavy-hoodie': 'the-ascend',
  'cargo-pant': 'the-atlas',
  'combat-boot': 'the-blaze-x',
  'black-tee': 'the-carbon',
};

/** First in-stock variant per demo product — keeps cart working if the live query fails. */
const VOID_SHOPIFY_FALLBACK_VARIANT_ID: Record<string, string> = {
  'shell-jacket': 'gid://shopify/ProductVariant/43567672361016',
  'heavy-hoodie': 'gid://shopify/ProductVariant/43567672459320',
  'cargo-pant': 'gid://shopify/ProductVariant/43567672557624',
  'combat-boot': 'gid://shopify/ProductVariant/43567672754232',
  'black-tee': 'gid://shopify/ProductVariant/43567672950840',
};

export function getVoidShopifyHandle(slug: string): string | undefined {
  return VOID_SHOPIFY_BY_SLUG[slug];
}

export function getVoidShopifyFallbackVariants(
  slug: string,
): VoidShopifyVariant[] {
  const id = VOID_SHOPIFY_FALLBACK_VARIANT_ID[slug];
  if (!id) return [];

  return [
    {
      id,
      availableForSale: true,
      selectedOptions: [{name: 'Size', value: 'M'}],
    },
  ];
}