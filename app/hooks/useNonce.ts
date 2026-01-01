import { useRouteError, useRouteLoaderData } from 'react-router';

// Cache the first document nonce on the client so SPA navigations
// don't pick up new loader nonces that don't match the original CSP header.
let cachedNonce: string | undefined;

/**
 * This hook retrieves the nonce value from the root route's loader data.
 * You may use this hook anywhere within root in client components.
 */
export const useNonce = () => {
  const loaderData: unknown = useRouteLoaderData('root');
  const error = useRouteError();

  const nonce =
    !error &&
    loaderData &&
    typeof loaderData === 'object' &&
    'nonce' in loaderData &&
    typeof loaderData.nonce === 'string'
      ? loaderData.nonce
      : undefined;

  if (typeof window !== 'undefined') {
    if (!cachedNonce && nonce) {
      cachedNonce = nonce;
    }

    return cachedNonce ?? nonce;
  }

  return nonce;
};
