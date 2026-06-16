import {json} from '@shopify/remix-oxygen';

import {countries} from '~/data/countries';

export async function loader() {
  return json(
    {...countries},
    {
      headers: {
        'cache-control': 'public, max-age=60',
      },
    },
  );
}

// no-op
export default function CountriesApiRoute() {
  return null;
}
