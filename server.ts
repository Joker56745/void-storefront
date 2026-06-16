// @ts-ignore — virtual Remix server build
import * as remixBuild from 'virtual:remix/server-build';
import type {Context} from '@netlify/edge-functions';
import {
  createHydrogenAppLoadContext,
  createRequestHandler,
} from '@netlify/remix-edge-adapter';
import {storefrontRedirect} from '@shopify/hydrogen';

import {createAppLoadContext} from '~/lib/context';

const getEnv = (): Env => {
  if (globalThis.Netlify) {
    return globalThis.Netlify.env.toObject() as unknown as Env;
  }
  return process.env as unknown as Env;
};

export default async function handler(
  request: Request,
  netlifyContext: Context,
): Promise<Response | undefined> {
  try {
    const env = getEnv();

    const executionContext = {
      waitUntil: netlifyContext.waitUntil.bind(netlifyContext),
    } as ExecutionContext;

    const appLoadContext = await createHydrogenAppLoadContext(
      request,
      netlifyContext,
      createAppLoadContext,
    );

    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
      getLoadContext: async () => appLoadContext,
    });

    const response = await handleRequest(request, appLoadContext);

    if (!response) {
      return;
    }

    if (appLoadContext.session.isPending) {
      response.headers.set(
        'Set-Cookie',
        await appLoadContext.session.commit(),
      );
    }

    if (response.status === 404) {
      return storefrontRedirect({
        request,
        response,
        storefront: appLoadContext.storefront,
      });
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
