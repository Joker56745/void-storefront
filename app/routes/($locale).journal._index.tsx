import {type MetaArgs, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSeoMeta} from '@shopify/hydrogen';

import {VoidJournalPage} from '~/components/VoidJournalPage';
import {seoPayload} from '~/lib/seo.server';
import {assertLocaleParam} from '~/lib/utils';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, request}: LoaderFunctionArgs) {
  assertLocaleParam(request, params.locale);

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
