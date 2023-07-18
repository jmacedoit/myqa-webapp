
/*
 * Endpoints.
 */

export const endpoints = {
  authentication: '/authentication',
  authenticatedUser: '/authenticated-user',
  users: '/users',
  organizations: '/organizations',
  knowledgeBase: '/knowledge-bases/:knowledgeBaseId',
  knowledgeBases: '/knowledge-bases',
  knowledgeBaseResources: '/knowledge-bases/:knowledgeBaseId/resources',
  knowledgeBaseResource: '/knowledge-bases/:knowledgeBaseId/resources/:resourceId',
  answerRequest: '/answer-request',
  answerSourcesRetrieval: '/answer-sources-retrieval',
  chatSession: '/chat-sessions/:chatSessionId',
  chatSessions: '/chat-sessions',
  emailVerification: '/email-verification',
  passwordRecoveryRequest: '/password-recovery-request',
  passwordReset: '/password-reset'
};
