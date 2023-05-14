
/*
 * Routes.
 */

export const routes = {
  home: '/',
  signIn: '/sign-in',
  styleguide: '/styleguide',
  knowledgeBasesListing: '/knowledge-bases',
  knowledgeBase: '/knowledge-bases/:knowledgeBaseId',
  answer: '/answer',
  getKnowledgeBase: (knowledgeBaseId: string) => `/knowledge-bases/${knowledgeBaseId}`
};
