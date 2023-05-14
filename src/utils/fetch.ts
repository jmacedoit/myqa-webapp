
/*
 * Module dependencies.
 */

import config from 'src/config';
import fetch from 'isomorphic-fetch';

/*
 * Export fetch with some friendly defaults like json content headers and throwing on non success.
 */

export async function easyFetch<T>(url: string, options: RequestInit = {}, noContentType = false) {
  const response = await fetch(url, {
    ...{
      credentials: config.fetch.crossOriginCredentials ? 'include' : 'same-origin'
    },
    ...options,
    headers: {
      ...noContentType ? {} : { 'Content-Type': 'application/json' },
      ...options.headers
    }
  });

  if (!response.ok) {
    throw response;
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response;
}
