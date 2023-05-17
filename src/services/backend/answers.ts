
/*
 * Module dependencies.
 */

import { Answer } from 'src/types/answer';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Answer related methods.
 */

export async function requestAnswer(question: string, knowledgeBaseId: string, questionReference: string) {
  return await easyFetch<Answer>(backendUri(endpoints.answerRequest), {
    method: 'POST',
    body: JSON.stringify({
      question,
      knowledgeBaseId,
      questionReference
    })
  }) as Answer;
}
