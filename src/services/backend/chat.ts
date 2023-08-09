
/*
 * Module dependencies.
 */

import { ChatSession, ChatSessionWithMessages } from 'src/types/chat';
import { backendUri } from 'src/services/backend/utils';
import { easyFetch } from 'src/utils/fetch';
import { endpoints } from 'src/services/backend/endpoints';

/*
 * Resource related methods.
 */

export async function createChatSession() {
  return await easyFetch<ChatSession>(backendUri(endpoints.chatSessions), {
    method: 'POST'
  }, true) as ChatSession;
}

export async function deleteChatSession(chatSessionId: string) {
  return await easyFetch(backendUri(endpoints.chatSession.replace(':chatSessionId', chatSessionId)), {
    method: 'DELETE'
  });
}

export async function getChatSessionWithMessages(chatSessionId: string) {
  return await easyFetch<ChatSessionWithMessages>(backendUri(endpoints.chatSession.replace(':chatSessionId', chatSessionId))) as ChatSessionWithMessages;
}

export async function getChatSessions(beforeDate?: string) {
  return await easyFetch<ChatSession[]>(`${backendUri(endpoints.chatSessions)}?${new URLSearchParams({
    ...beforeDate ? { beforeDate } : {}
  })}`) as ChatSession[];
}
