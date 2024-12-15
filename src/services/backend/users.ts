
/*
 * Module dependencies.
 */

import { backendUri } from './utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from './endpoints';
import { omit } from 'lodash';

/*
 * User related methods.
 */

export async function registerUser(userData: { email: string, password: string, termsAndConditions: boolean }, captchaToken: string) {
  await easyFetch(backendUri(endpoints.users), {
    method: 'POST',
    body: JSON.stringify({
      ...omit(userData, 'termsAndConditions'),
      displayName: userData.email.split('@')[0],
      acceptedTerms: userData.termsAndConditions,
      captchaToken
    })
  });
}
