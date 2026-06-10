import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {VOID_COLLECTION_PATH} from '~/data/void-catalog';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params}: LoaderFunctionArgs) {
  const target = params.locale
    ? `/${params.locale}${VOID_COLLECTION_PATH}`
    : VOID_COLLECTION_PATH;

  throw redirect(target, 302);
}
