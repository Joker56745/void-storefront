import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta} from '@shopify/hydrogen';

import {VoidHero} from '~/components/VoidHero';
import {Manifesto} from '~/components/Manifesto';
import {FeaturedProductsGrid} from '~/components/FeaturedProductsGrid';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  return {
    seo: seoPayload.home({url: request.url}),
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Homepage() {
  return (
    <div className="void-home overflow-x-hidden">
      <VoidHero />
      <FeaturedProductsGrid />
      <Manifesto />
    </div>
  );
}
