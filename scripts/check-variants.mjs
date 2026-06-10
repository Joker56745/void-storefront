import {readFileSync} from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
);

const handles = [
  'the-apex',
  'the-ascend',
  'the-atlas',
  'the-blaze-x',
  'the-carbon',
];

for (const handle of handles) {
  const query = `{
    product(handle: "${handle}") {
      variants(first: 3) {
        nodes { id availableForSale selectedOptions { name value } }
      }
    }
  }`;

  const res = await fetch(
    `https://${env.PUBLIC_STORE_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': env.PUBLIC_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({query}),
    },
  );

  const json = await res.json();
  console.log(handle, json.data?.product?.variants?.nodes?.[0]?.id ?? json.errors);
}
