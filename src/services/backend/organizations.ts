
/*
 * Module dependencies.
 */

import { Organization } from 'src/types/organizations';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Organization related methods.
 */

export async function getOrganizations() {
  return await easyFetch<Organization[]>(backendUri(endpoints.organizations)) as Organization[];
}
