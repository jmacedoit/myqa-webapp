
/*
 * Module dependencies.
 */

import { Answer, AnswerSourceData, WisdomLevel } from 'src/types/answer';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Answer related methods.
 */

export async function requestAnswer(data: {
  question: string,
  knowledgeBaseId: string,
  chatSessionId: string,
  questionReference: string,
  language?: string,
  wisdomLevel: WisdomLevel
}) {
  const { chatSessionId, knowledgeBaseId, language, question, questionReference, wisdomLevel } = data;

  return await easyFetch<Answer>(backendUri(endpoints.answerRequest), {
    method: 'POST',
    body: JSON.stringify({
      question,
      chatSessionId,
      language,
      knowledgeBaseId,
      questionReference,
      wisdomLevel
    })
  }) as Answer;
}

export async function getAnswerSourcesData(messageId: string) {
  return await easyFetch<{ sources: AnswerSourceData[] }>(backendUri(endpoints.answerSourcesRetrieval), {
    method: 'POST',
    body: JSON.stringify({
      messageId
    })
  }) as { sources: AnswerSourceData[] };
}
