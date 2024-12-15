
/*
 * Module dependencies.
 */

import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Account related methods.
 */

export async function changePassword(oldPassword: string, newPassword: string) {
  return await easyFetch(backendUri(endpoints.passwordChange), {
    method: 'POST',
    body: JSON.stringify({
      oldPassword,
      newPassword
    })
  });
}
