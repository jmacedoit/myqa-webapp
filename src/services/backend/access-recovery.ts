
/*
 * Module dependencies.
 */

import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Access recovery related methods.
 */

export async function requestPasswordRecovery(email: string) {
  return await easyFetch(backendUri(endpoints.passwordRecoveryRequest), {
    method: 'POST',
    body: JSON.stringify({
      email
    })
  });
}

export async function resetPassword(passwordResetToken: string | null, password: string) {
  return await easyFetch(backendUri(endpoints.passwordReset), {
    method: 'POST',
    body: JSON.stringify({
      token: passwordResetToken,
      password
    })
  });
}
