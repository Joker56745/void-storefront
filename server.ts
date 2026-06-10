// @ts-ignore
import * as remixBuild from 'virtual:remix/server-build';
import {createRequestHandler} from '@vercel/remix';
import {
  createStorefrontClient,
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
  createCustomerAccountClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {getStorefrontHeaders} from '@shopify/remix-oxygen';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

const handleRequest = createRequestHandler({
  build: remixBuild,
  mode: process.env.NODE_ENV,
  getLoadContext: async (req) => {
    const request = req as unknown as Request;

    if (!process.env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET environment variable is not set');
    }

    const session = await AppSession.init(request, [
      process.env.SESSION_SECRET,
    ]);

    const {storefront} = createStorefrontClient({
      i18n: getLocaleFromRequest(request),
      publicStorefrontToken: process.env.PUBLIC_STOREFRONT_API_TOKEN!,
      privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: process.env.PUBLIC_STORE_DOMAIN!,
      storefrontId: process.env.PUBLIC_STOREFRONT_ID,
      storefrontHeaders: getStorefrontHeaders(request),
    });

    const customerAccount = createCustomerAccountClient({
      waitUntil: (p) => p,
      request,
      session,
      customerAccountId: process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID!,
      shopId: process.env.SHOP_ID,
    });

    const cart = createCartHandler({
      storefront,
      customerAccount,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });

    return {
      session,
      waitUntil: (p: Promise<unknown>) => p,
      storefront,
      customerAccount,
      cart,
      env: process.env as unknown as Env,
    };
  },
});

export default handleRequest;
