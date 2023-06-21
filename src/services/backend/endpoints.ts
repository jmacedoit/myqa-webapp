
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
  emailVerification: '/email-verification'
};
