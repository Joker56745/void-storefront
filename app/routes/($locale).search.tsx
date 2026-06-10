import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import {VoidLiveSearch} from '~/components/VoidLiveSearch';
import {searchVoidProducts} from '~/data/void-catalog';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({request}: LoaderFunctionArgs) {
  const searchTerm = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  const results = searchTerm ? searchVoidProducts(searchTerm) : [];

  return json({
    searchTerm,
    seo: seoPayload.voidSearch({
      url: request.url,
      searchTerm,
      resultCount: results.length,
    }),
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Search() {
  const {searchTerm} = useLoaderData<typeof loader>();

  return (
    <div className="void-search w-full min-w-0">
      <VoidLiveSearch initialQuery={searchTerm} />
    </div>
  );
}
