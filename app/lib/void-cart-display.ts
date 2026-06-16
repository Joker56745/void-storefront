import type {CartLine} from '@shopify/hydrogen/storefront-api-types';

import {
  getVoidProductBySlug,
  type VoidProductDetail,
} from '~/data/void-catalog';
import {
  convertVoidPriceUsd,
  formatVoidPriceUsd,
} from '~/lib/void-pricing';
import type {I18nLocale} from '~/lib/type';

export const VOID_CART_ATTR = {
  piece: 'Piece',
  size: 'Size',
  slug: '_void_slug',
} as const;

export type VoidCartLineDisplay = {
  title: string;
  size: string;
  slug: string;
  image: string;
  imageAlt: string;
  priceUsd: number;
  path: string;
};

export function voidCartLineAttributes(
  product: VoidProductDetail,
  selectedSize: string,
): Array<{key: string; value: string}> {
  return [
    {key: VOID_CART_ATTR.piece, value: product.title},
    {key: VOID_CART_ATTR.size, value: selectedSize},
    {key: VOID_CART_ATTR.slug, value: product.slug},
  ];
}

export type VoidCartSubtotal = {
  amount: number;
  currencyCode: string;
  hasNonVoidLines: boolean;
};

/** Editorial subtotal from catalog prices when lines carry VØID attributes. */
export function computeVoidCartSubtotal(
  lines: Array<Pick<CartLine, 'attributes' | 'quantity'>>,
  locale: I18nLocale,
): VoidCartSubtotal | null {
  let total = 0;
  let voidLineCount = 0;
  let hasNonVoidLines = false;

  for (const line of lines) {
    const voidLine = parseVoidCartLine(line);
    if (!voidLine) {
      hasNonVoidLines = true;
      continue;
    }

    voidLineCount += 1;
    total += convertVoidPriceUsd(voidLine.priceUsd, locale.currency) * (line.quantity ?? 1);
  }

  if (voidLineCount === 0) return null;

  return {
    amount: total,
    currencyCode: locale.currency,
    hasNonVoidLines,
  };
}

export function formatVoidCartLinePrice(
  priceUsd: number,
  locale: I18nLocale,
): string {
  return formatVoidPriceUsd(priceUsd, locale);
}

export function parseVoidCartLine(
  line: Pick<CartLine, 'attributes'>,
): VoidCartLineDisplay | null {
  const attributes = line.attributes ?? [];
  const get = (key: string) =>
    attributes.find((attr) => attr.key === key)?.value?.trim();

  const slug = get(VOID_CART_ATTR.slug);
  if (!slug) return null;

  const catalog = getVoidProductBySlug(slug);
  const title = get(VOID_CART_ATTR.piece) ?? catalog?.title ?? 'VØID piece';
  const size = get(VOID_CART_ATTR.size) ?? '';

  return {
    title,
    size,
    slug,
    image: catalog?.image ?? '',
    imageAlt: catalog?.imageAlt ?? title,
    priceUsd: catalog?.priceUsd ?? 0,
    path: catalog?.handle ?? `/void/${slug}`,
  };
}
