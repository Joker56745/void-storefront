import {useRouteLoaderData} from '@remix-run/react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

import {DEFAULT_LOCALE, parseAsCurrency} from '~/lib/utils';
import type {I18nLocale} from '~/lib/type';
import type {RootLoader} from '~/root';

/** Demo FX from USD list prices — editorial catalog, not live Shopify rates. */
const USD_TO_CURRENCY: Partial<Record<CurrencyCode, number>> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149,
};

export function convertVoidPriceUsd(
  amountUsd: number,
  currency: CurrencyCode,
): number {
  const rate = USD_TO_CURRENCY[currency] ?? 1;

  if (currency === 'JPY') {
    return Math.round(amountUsd * rate);
  }

  return Math.round(amountUsd * rate * 100) / 100;
}

export function formatVoidPriceUsd(
  amountUsd: number,
  locale: I18nLocale,
): string {
  const amount = convertVoidPriceUsd(amountUsd, locale.currency);
  return parseAsCurrency(amount, locale);
}

export function useVoidPrice(amountUsd: number): string {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const locale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  return formatVoidPriceUsd(amountUsd, locale);
}

export function useSelectedLocale(): I18nLocale {
  const rootData = useRouteLoaderData<RootLoader>('root');
  return rootData?.selectedLocale ?? DEFAULT_LOCALE;
}
