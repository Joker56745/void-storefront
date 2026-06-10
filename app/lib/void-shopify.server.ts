import {
  getVoidShopifyFallbackVariants,
} from '~/data/void-shopify-demo';
import type {VoidShopifyVariant} from '~/lib/void-shopify';
import type {Storefront} from '~/lib/type';

const VOID_PRODUCT_VARIANTS_QUERY = `#graphql
  query VoidProductVariants(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
` as const;

export async function loadVoidShopifyVariants(
  storefront: Storefront,
  handle: string,
  slug: string,
): Promise<VoidShopifyVariant[]> {
  const fallback = getVoidShopifyFallbackVariants(slug);

  try {
    const {product} = await storefront.query(VOID_PRODUCT_VARIANTS_QUERY, {
      variables: {
        handle,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    const nodes = product?.variants?.nodes ?? [];
    return nodes.length > 0 ? nodes : fallback;
  } catch {
    return fallback;
  }
}
