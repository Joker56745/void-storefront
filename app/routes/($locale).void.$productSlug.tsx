import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {useLoaderData} from '@remix-run/react';

import {getSeoMeta} from '@shopify/hydrogen';

import invariant from 'tiny-invariant';



import {VoidProductPage} from '~/components/VoidProductPage';

import {getVoidProductBySlug} from '~/data/void-catalog';

import {
  getVoidShopifyFallbackVariants,
  getVoidShopifyHandle,
} from '~/data/void-shopify-demo';

import {loadVoidShopifyVariants} from '~/lib/void-shopify.server';

import {seoPayload} from '~/lib/seo.server';
import {assertLocaleParam} from '~/lib/utils';

import {routeHeaders} from '~/data/cache';



export const headers = routeHeaders;



export async function loader({params, request, context}: LoaderFunctionArgs) {
  assertLocaleParam(request, params.locale);

  const {productSlug} = params;

  invariant(productSlug, 'Missing productSlug');



  const product = getVoidProductBySlug(productSlug);

  if (!product) {

    throw new Response(null, {status: 404});

  }



  const shopifyHandle = getVoidShopifyHandle(product.slug);

  const shopifyVariants = shopifyHandle
    ? await loadVoidShopifyVariants(
        context.storefront,
        shopifyHandle,
        product.slug,
      )
    : getVoidShopifyFallbackVariants(product.slug);



  return {
    product,
    shopifyVariants,
    seo: seoPayload.voidProduct({product, url: request.url}),
  };

}



export const meta = ({matches}: MetaArgs<typeof loader>) => {

  return getSeoMeta(...matches.map((match) => (match.data as any).seo));

};



export default function VoidProductRoute() {

  const {product, shopifyVariants} = useLoaderData<typeof loader>();

  return (
    <VoidProductPage product={product} shopifyVariants={shopifyVariants} />
  );

}

