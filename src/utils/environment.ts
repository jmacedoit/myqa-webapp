
/*
 * Module dependencies.
 */

import config from 'src/config';

/*
 * Test if on client.
 */

export function onClient() {
  if (typeof window === 'undefined') {
    return false;
  }

  return true;
}

/*
 * Get static asset uri.
 */

export function staticUri(asset: string) {
  if (config.development.justClient) {
    return `/${asset}`;
  }

  return `/dist/client/${asset}`;
}
