

/*
 * Module dependencies.
 */

import { KnowledgeBase, KnowledgeBaseCreation, KnowledgeBasePatch } from 'src/types/knowledge-bases';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Knowledge bases related methods.
 */

export async function createKnowledgeBase(organizationId: string, knowledgeBase: KnowledgeBaseCreation) {
  return await easyFetch<KnowledgeBase>(backendUri(endpoints.knowledgeBases), {
    method: 'POST',
    body: JSON.stringify({
      ...knowledgeBase,
      organizationId
    })
  }) as KnowledgeBase;
}

export async function getKnowledgeBases() {
  return await easyFetch<KnowledgeBase[]>(backendUri(endpoints.knowledgeBases)) as KnowledgeBase[];
}

export async function patchKnowledgeBase(knowledgeBaseId: string, modifications: KnowledgeBasePatch) {
  return await easyFetch<KnowledgeBase>(backendUri(endpoints.knowledgeBase.replace(':knowledgeBaseId', knowledgeBaseId)), {
    method: 'PATCH',
    body: JSON.stringify(modifications)
  }) as KnowledgeBase;
}

export async function deleteKnowledgeBase(knowledgeBaseId: string) {
  return await easyFetch(backendUri(endpoints.knowledgeBase.replace(':knowledgeBaseId', knowledgeBaseId)), {
    method: 'DELETE'
  });
}

export async function verifyUserEmail(emailVerificationToken: string) {
  return await easyFetch(backendUri(endpoints.emailVerification), {
    method: 'POST',
    body: JSON.stringify({
      token: emailVerificationToken
    })
  });
}
