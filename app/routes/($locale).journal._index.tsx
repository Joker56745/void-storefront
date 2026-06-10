import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta} from '@shopify/hydrogen';

import {VoidJournalPage} from '~/components/VoidJournalPage';
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
    seo: seoPayload.voidJournal({url: request.url}),
  };
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function JournalRoute() {
  return <VoidJournalPage />;
}
