
/*
 * Module dependencies.
 */

import { Resource } from 'src/types/resources';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Resource related methods.
 */

export async function addFileResourceToKnowledgeBase(knowledgeBaseId: string, file: File) {
  const formData = new FormData();

  formData.append('resource', file);

  return await easyFetch<Resource>(backendUri(endpoints.knowledgeBaseResources.replace(':knowledgeBaseId', knowledgeBaseId)), {
    method: 'POST',
    body: formData
  }, true) as Resource;
}

export async function getKnowledgeBaseResources(knowledgeBaseId: string) {
  return await easyFetch<Resource[]>(backendUri(endpoints.knowledgeBaseResources.replace(':knowledgeBaseId', knowledgeBaseId))) as Resource[];
}

export async function deleteKnowledgeBaseResource(knowledgeBaseId: string, resourceId: string) {
  return await easyFetch(backendUri(endpoints.knowledgeBaseResource.replace(':knowledgeBaseId', knowledgeBaseId).replace(':resourceId', resourceId)), {
    method: 'DELETE'
  });
}
