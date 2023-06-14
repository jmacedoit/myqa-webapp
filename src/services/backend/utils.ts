
/*
 * Module dependencies.
 */

import { urlJoin } from 'url-join-ts';
import config from 'src/config';

/*
 * General backend utils.
 */

export function backendUri(endpoint: string): string {
  return urlJoin(config.backend.baseUri, config.backend.restApiPrefix, endpoint);
}
