
/*
 * Module dependencies.
 */

import { AuthenticatedUser } from 'src/types/users';
import { backendUri } from './utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from './endpoints';

/*
 * Authentication related methods.
 */

export async function authenticate(credentials: { email: string, password: string }) {
  await easyFetch(backendUri(endpoints.authentication), {
    method: 'POST',
    body: JSON.stringify({
      ...credentials
    })
  });
}

export async function getAuthenticatedUser() {
  return await easyFetch<AuthenticatedUser>(backendUri(endpoints.authenticatedUser)) as AuthenticatedUser;
}
