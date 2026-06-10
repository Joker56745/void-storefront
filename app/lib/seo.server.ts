import {type SeoConfig} from '@shopify/hydrogen';
import type {
  Article,
  Blog,
  Collection,
  Page,
  Product,
  ProductVariant,
  ShopPolicy,
  Image,
} from '@shopify/hydrogen/storefront-api-types';
import type {
  Article as SeoArticle,
  BreadcrumbList,
  Blog as SeoBlog,
  CollectionPage,
  Offer,
  Organization,
  Product as SeoProduct,
  WebPage,
} from 'schema-dts';

import {
  VOID_COLLECTION_PATH,
  VOID_COLLECTION_TITLE,
  VOID_HERO_IMAGE,
  VOID_PRODUCTS,
  type VoidProductDetail,
} from '~/data/void-catalog';
import {BRAND_NAME, BRAND_TAGLINE} from '~/lib/brand';
import type {ShopFragment} from 'storefrontapi.generated';

function root({
  shop,
  url,
}: {
  shop: ShopFragment;
  url: Request['url'];
}): SeoConfig {
  return {
    title: BRAND_NAME,
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: truncate(shop?.description ?? BRAND_TAGLINE),
    handle: '@void',
    url,
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: BRAND_NAME,
      logo: shop.brand?.logo?.image?.url,
      sameAs: [
        'https://twitter.com/shopify',
        'https://facebook.com/shopify',
        'https://instagram.com/shopify',
        'https://youtube.com/shopify',
        'https://tiktok.com/@shopify',
      ],
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${url}search?q={search_term}`,
        query: "required name='search_term'",
      },
    },
  };
}

function home({url}: {url: Request['url']}): SeoConfig {
  const origin = new URL(url).origin;

  return {
    title: 'Home',
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: BRAND_TAGLINE,
    url,
    media: voidSeoImageMedia({
      origin,
      src: VOID_HERO_IMAGE,
      altText: `${BRAND_NAME} — ${BRAND_TAGLINE}`,
    }),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: BRAND_NAME,
      description: BRAND_TAGLINE,
      url: origin,
    },
  };
}

type SelectedVariantRequiredFields = Pick<ProductVariant, 'sku'> & {
  image?: null | Partial<Image>;
};

type ProductRequiredFields = Pick<
  Product,
  'title' | 'description' | 'vendor' | 'seo'
> & {
  variants: Array<
    Pick<
      ProductVariant,
      'sku' | 'price' | 'selectedOptions' | 'availableForSale'
    >
  >;
};

function productJsonLd({
  product,
  selectedVariant,
  url,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const origin = new URL(url).origin;
  const variants = product.variants;
  const description = truncate(
    product?.seo?.description ?? product?.description,
  );
  const offers: Offer[] = (variants || []).map((variant) => {
    const variantUrl = new URL(url);
    for (const option of variant.selectedOptions) {
      variantUrl.searchParams.set(option.name, option.value);
    }
    const availability = variant.availableForSale
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

    return {
      '@type': 'Offer',
      availability,
      price: parseFloat(variant.price.amount),
      priceCurrency: variant.price.currencyCode,
      sku: variant?.sku ?? '',
      url: variantUrl.toString(),
    };
  });
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Products',
          item: `${origin}/products`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: product.vendor,
      },
      description,
      image: [selectedVariant?.image?.url ?? ''],
      name: product.title,
      offers,
      sku: selectedVariant?.sku ?? '',
      url,
    },
  ];
}

function product({
  product,
  url,
  selectedVariant,
}: {
  product: ProductRequiredFields;
  selectedVariant: SelectedVariantRequiredFields;
  url: Request['url'];
}): SeoConfig {
  const description = truncate(
    product?.seo?.description ?? product?.description ?? '',
  );
  return {
    title: product?.seo?.title ?? product?.title,
    description,
    url,
    media: selectedVariant?.image,
    jsonLd: productJsonLd({product, selectedVariant, url}),
  };
}

type CollectionRequiredFields = Omit<
  Collection,
  'products' | 'descriptionHtml' | 'metafields' | 'image' | 'updatedAt'
> & {
  products: {nodes: Pick<Product, 'handle'>[]};
  image?: null | Pick<Image, 'url' | 'height' | 'width' | 'altText'>;
  descriptionHtml?: null | Collection['descriptionHtml'];
  updatedAt?: null | Collection['updatedAt'];
  metafields?: null | Collection['metafields'];
};

function collectionJsonLd({
  url,
  collection,
}: {
  url: Request['url'];
  collection: CollectionRequiredFields;
}): SeoConfig['jsonLd'] {
  const siteUrl = new URL(url);
  const itemListElement: CollectionPage['mainEntity'] =
    collection.products.nodes.map((product, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/products/${product.handle}`,
      };
    });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Collections',
          item: `${siteUrl.host}/collections`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: collection.title,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection?.seo?.title ?? collection?.title ?? '',
      description: truncate(
        collection?.seo?.description ?? collection?.description ?? '',
      ),
      image: collection?.image?.url,
      url: `/collections/${collection.handle}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement,
      },
    },
  ];
}

function collection({
  collection,
  url,
}: {
  collection: CollectionRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: collection?.seo?.title,
    description: truncate(
      collection?.seo?.description ?? collection?.description ?? '',
    ),
    titleTemplate: '%s | Collection',
    url,
    media: {
      type: 'image',
      url: collection?.image?.url,
      height: collection?.image?.height,
      width: collection?.image?.width,
      altText: collection?.image?.altText,
    },
    jsonLd: collectionJsonLd({collection, url}),
  };
}

type CollectionListRequiredFields = {
  nodes: Omit<CollectionRequiredFields, 'products'>[];
};

function collectionsJsonLd({
  url,
  collections,
}: {
  url: Request['url'];
  collections: CollectionListRequiredFields;
}): SeoConfig['jsonLd'] {
  const itemListElement: CollectionPage['mainEntity'] = collections.nodes.map(
    (collection, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/collections/${collection.handle}`,
      };
    },
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections',
    description: 'All collections',
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement,
    },
  };
}

function listCollections({
  collections,
  url,
}: {
  collections: CollectionListRequiredFields;
  url: Request['url'];
}): SeoConfig {
  return {
    title: 'Collections',
    titleTemplate: '%s | Collections',
    description: 'All hydrogen collections',
    url,
    jsonLd: collectionsJsonLd({collections, url}),
  };
}

function article({
  article,
  url,
}: {
  article: Pick<
    Article,
    'title' | 'contentHtml' | 'seo' | 'publishedAt' | 'excerpt'
  > & {
    image?: null | Pick<
      NonNullable<Article['image']>,
      'url' | 'height' | 'width' | 'altText'
    >;
  };
  url: Request['url'];
}): SeoConfig {
  return {
    title: article?.seo?.title ?? article?.title,
    description: truncate(article?.seo?.description ?? ''),
    titleTemplate: '%s | Journal',
    url,
    media: {
      type: 'image',
      url: article?.image?.url,
      height: article?.image?.height,
      width: article?.image?.width,
      altText: article?.image?.altText,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      alternativeHeadline: article.title,
      articleBody: article.contentHtml,
      datePublished: article?.publishedAt,
      description: truncate(
        article?.seo?.description || article?.excerpt || '',
      ),
      headline: article?.seo?.title || '',
      image: article?.image?.url,
      url,
    },
  };
}

function blog({
  blog,
  url,
}: {
  blog: Pick<Blog, 'seo' | 'title'>;
  url: Request['url'];
}): SeoConfig {
  return {
    title: blog?.seo?.title,
    description: truncate(blog?.seo?.description || ''),
    titleTemplate: '%s | Blog',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: blog?.seo?.title || blog?.title || '',
      description: blog?.seo?.description || '',
      url,
    },
  };
}

function page({
  page,
  url,
}: {
  page: Pick<Page, 'title' | 'seo'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(page?.seo?.description || ''),
    title: page?.seo?.title ?? page?.title,
    titleTemplate: '%s | Page',
    url,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
    },
  };
}

function policy({
  policy,
  url,
}: {
  policy: Pick<ShopPolicy, 'title' | 'body'>;
  url: Request['url'];
}): SeoConfig {
  return {
    description: truncate(policy?.body ?? ''),
    title: policy?.title,
    titleTemplate: '%s | Policy',
    url,
  };
}

function policies({
  policies,
  url,
}: {
  policies: Array<Pick<ShopPolicy, 'title' | 'handle'>>;
  url: Request['url'];
}): SeoConfig {
  const origin = new URL(url).origin;
  const itemListElement: BreadcrumbList['itemListElement'] = policies
    .filter(Boolean)
    .map((policy, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: policy.title,
        item: `${origin}/policies/${policy.handle}`,
      };
    });
  return {
    title: 'Policies',
    titleTemplate: '%s | Policies',
    description: 'Hydroge store policies',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        description: 'Hydrogen store policies',
        name: 'Policies',
        url,
      },
    ],
  };
}

function voidLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/([a-z]{2}-[a-z]{2})(?=\/|$)/i);
  return match ? `/${match[1]}` : '';
}

function voidAbsoluteAsset(origin: string, src: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${origin}${src.startsWith('/') ? src : `/${src}`}`;
}

function voidSeoImageMedia({
  origin,
  src,
  altText,
  width = 1200,
  height = 1500,
}: {
  origin: string;
  src: string;
  altText: string;
  width?: number;
  height?: number;
}): SeoConfig['media'] {
  return {
    type: 'image',
    url: voidAbsoluteAsset(origin, src),
    width,
    height,
    altText,
  };
}

function parseVoidPrice(
  price: string,
): {amount: number; currencyCode: 'USD'} | null {
  const match = price.replace(/,/g, '').match(/\$([\d.]+)/);
  if (!match) return null;
  return {amount: parseFloat(match[1]), currencyCode: 'USD'};
}

function voidCollectionUrl(origin: string, pathname: string): string {
  const prefix = voidLocalePrefix(pathname);
  return `${origin}${prefix}${VOID_COLLECTION_PATH}`;
}

function voidCollectionJsonLd({url}: {url: Request['url']}): SeoConfig['jsonLd'] {
  const {origin, pathname} = new URL(url);
  const collectionUrl = voidCollectionUrl(origin, pathname);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: VOID_COLLECTION_TITLE,
          item: collectionUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: VOID_COLLECTION_TITLE,
      description: BRAND_TAGLINE,
      url: collectionUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: BRAND_NAME,
        url: origin,
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: VOID_PRODUCTS.length,
        itemListElement: VOID_PRODUCTS.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: voidAbsoluteAsset(origin, item.handle),
        })),
      },
    },
  ];
}

function voidProductJsonLd({
  product,
  url,
}: {
  product: VoidProductDetail;
  url: Request['url'];
}): SeoConfig['jsonLd'] {
  const {origin, pathname} = new URL(url);
  const canonicalUrl = new URL(url);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';
  const productUrl = canonicalUrl.toString();
  const collectionUrl = voidCollectionUrl(origin, pathname);

  const images = [
    ...new Set([
      voidAbsoluteAsset(origin, product.image),
      ...product.gallery.map((image) => voidAbsoluteAsset(origin, image.src)),
    ]),
  ];

  const price = parseVoidPrice(product.price);
  const offers: Offer[] = product.sizes.map((size) => {
    const sizeUrl = new URL(productUrl);
    sizeUrl.searchParams.set('size', size);

    return {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: price?.amount,
      priceCurrency: price?.currencyCode ?? 'USD',
      url: sizeUrl.toString(),
      sku: `${product.slug}-${size}`,
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    };
  });

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: VOID_COLLECTION_TITLE,
          item: collectionUrl,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.title,
          item: productUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': productUrl,
      url: productUrl,
      name: product.title,
      description: truncate(product.longDescription, 320),
      image: images,
      sku: product.slug,
      category: 'Apparel',
      color: 'Black',
      material: product.material,
      brand: {
        '@type': 'Brand',
        name: BRAND_NAME,
      },
      offers,
    },
  ];
}

function voidSearch({
  url,
  searchTerm,
  resultCount,
}: {
  url: Request['url'];
  searchTerm: string;
  resultCount: number;
}): SeoConfig {
  const title = searchTerm ? `Search: ${searchTerm}` : 'Search';

  return {
    title,
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: searchTerm
      ? truncate(
          resultCount > 0
            ? `${resultCount} piece${resultCount === 1 ? '' : 's'} in Core Collection for “${searchTerm}”.`
            : `No pieces matched “${searchTerm}” in Core Collection.`,
        )
      : truncate('Search the VØID Core Collection.'),
    url,
    robots: {
      noIndex: true,
      noFollow: false,
    },
  };
}

function voidJournal({url}: {url: Request['url']}): SeoConfig {
  const {origin} = new URL(url);

  return {
    title: 'Journal',
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: truncate(
      'Editorial field notes and lookbooks from VØID. Core Collection drops and process — coming soon.',
    ),
    url,
    media: voidSeoImageMedia({
      origin,
      src: VOID_HERO_IMAGE,
      altText: `${BRAND_NAME} Journal`,
    }),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Journal',
      description: BRAND_TAGLINE,
      url,
      publisher: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    },
  };
}

function voidCollection({url}: {url: Request['url']}): SeoConfig {
  const {origin, pathname} = new URL(url);
  const collectionUrl = voidCollectionUrl(origin, pathname);
  const leadImage = VOID_PRODUCTS[0]?.image ?? VOID_HERO_IMAGE;

  return {
    title: VOID_COLLECTION_TITLE,
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: truncate(
      'Dark techwear essentials — shell, hoodie, cargo, boots, and tee. Brutalist silhouettes in black and charcoal.',
    ),
    url: collectionUrl,
    media: voidSeoImageMedia({
      origin,
      src: leadImage,
      altText: `${VOID_COLLECTION_TITLE} — ${BRAND_NAME}`,
    }),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: voidCollectionJsonLd({url}),
  };
}

function voidProduct({
  product,
  url,
}: {
  product: VoidProductDetail;
  url: Request['url'];
}): SeoConfig {
  const {origin} = new URL(url);
  const canonicalUrl = new URL(url);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';

  return {
    title: product.title,
    titleTemplate: `%s | ${BRAND_NAME}`,
    description: truncate(product.longDescription),
    url: canonicalUrl.toString(),
    media: voidSeoImageMedia({
      origin,
      src: product.image,
      altText: product.imageAlt,
    }),
    robots: {
      noIndex: false,
      noFollow: false,
    },
    jsonLd: voidProductJsonLd({product, url}),
  };
}

export const seoPayload = {
  article,
  blog,
  collection,
  home,
  listCollections,
  page,
  policies,
  policy,
  product,
  root,
  voidCollection,
  voidJournal,
  voidProduct,
  voidSearch,
};

/**
 * Truncate a string to a given length, adding an ellipsis if it was truncated
 * @param str - The string to truncate
 * @param num - The maximum length of the string
 * @returns The truncated string
 * @example
 * ```js
 * truncate('Hello world', 5) // 'Hello...'
 * ```
 */
function truncate(str: string, num = 155): string {
  if (typeof str !== 'string') return '';
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - 3) + '...';
}
