import type {Localizations} from '~/lib/type';

/** Currency markets for the storefront — one row per currency, not per country. */
export const countries: Localizations = {
  default: {
    label: 'USD ($)',
    language: 'EN',
    country: 'US',
    currency: 'USD',
  },
  '/en-eu': {
    label: 'EUR (€)',
    language: 'EN',
    country: 'DE',
    currency: 'EUR',
  },
  '/en-gb': {
    label: 'GBP (£)',
    language: 'EN',
    country: 'GB',
    currency: 'GBP',
  },
  '/en-ca': {
    label: 'CAD ($)',
    language: 'EN',
    country: 'CA',
    currency: 'CAD',
  },
  '/en-au': {
    label: 'AUD ($)',
    language: 'EN',
    country: 'AU',
    currency: 'AUD',
  },
  '/en-jp': {
    label: 'JPY (¥)',
    language: 'EN',
    country: 'JP',
    currency: 'JPY',
  },
};
