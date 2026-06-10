import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {getVoidProductBySlug, VOID_COLLECTION_PATH} from '~/data/void-catalog';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params}: LoaderFunctionArgs) {
  const {productHandle, locale} = params;
  invariant(productHandle, 'Missing productHandle');

  const prefix = locale ? `/${locale}` : '';

  if (getVoidProductBySlug(productHandle)) {
    throw redirect(`${prefix}/void/${productHandle}`, 302);
  }

  throw redirect(`${prefix}${VOID_COLLECTION_PATH}`, 302);
}
