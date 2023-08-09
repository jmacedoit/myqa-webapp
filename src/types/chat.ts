
/*
 * Module dependencies.
 */

import { AnswerSource } from './answer';

/*
 * Chat related types.
 */

export type ChatSession = {
  id: string,
  createdAt: string
  updatedAt: string,
  metadata: {
    lastUserMessage?: Message,
    [key: string]: any
  }
} & {
  chatMessages?: Message[]
};

export type ChatSessionWithMessages = ChatSession & {
  messages: Message[]
};

export enum SenderType {
  AiEngine = 'AI_ENGINE',
  User = 'USER'
}

export type Message = {
  id: string,
  sender: SenderType,
  content: string,
  payload: ChatMessagePayload,
  createdAt: string,
  updatedAt: string
};

export type ChatMessagePayload = {
  knowledgeBaseId: string,
  questionMessageId?: string,
  sources?: AnswerSource[]
}
