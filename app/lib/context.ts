import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createCustomerAccountClient,
  createStorefrontClient,
} from '@shopify/hydrogen';
import {getStorefrontHeaders} from '@shopify/remix-oxygen';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    typeof caches !== 'undefined'
      ? caches.open('hydrogen')
      : Promise.resolve(undefined),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const {storefront} = createStorefrontClient({
    cache,
    waitUntil,
    i18n: getLocaleFromRequest(request),
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    storefrontId: env.PUBLIC_STOREFRONT_ID,
    storefrontHeaders: getStorefrontHeaders(request),
  });

  const customerAccount = createCustomerAccountClient({
    waitUntil,
    request,
    session,
    customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
    shopId: env.SHOP_ID,
  });

  const cart = createCartHandler({
    storefront,
    customerAccount,
    getCartId: cartGetIdDefault(request.headers),
    setCartId: cartSetIdDefault(),
  });

  return {
    session,
    waitUntil,
    storefront,
    customerAccount,
    cart,
    env,
  };
}
