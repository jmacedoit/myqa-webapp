
/*
 * Module dependencies.
 */

import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Email verification related methods.
 */

export async function verifyUserEmail(emailVerificationToken: string) {
  return await easyFetch(backendUri(endpoints.emailVerification), {
    method: 'POST',
    body: JSON.stringify({
      token: emailVerificationToken
    })
  });
}
