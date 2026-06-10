import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params}: LoaderFunctionArgs) {
  const target = params.locale ? `/${params.locale}/journal` : '/journal';
  throw redirect(target, 302);
}
