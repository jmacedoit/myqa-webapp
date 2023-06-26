
/*
 * Routes.
 */

export const routes = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  signUpSuccess: '/sign-up-success',
  verifyEmail: '/verify-email',
  emailVerification: '/email-verification',
  termsAndConditions: '/terms-and-conditions',
  privacyPolicy: '/privacy-policy',
  styleguide: '/styleguide',
  knowledgeBasesListing: '/knowledge-bases',
  knowledgeBase: '/knowledge-bases/:knowledgeBaseId',
  answer: '/answer',
  recoverPassword: '/recover-password',
  recoverPasswordEmailSent: '/recover-password-email-sent',
  resetPassword: '/reset-password',
  resetPasswordSuccess: '/reset-password-success',
  getKnowledgeBase: (knowledgeBaseId: string) => `/knowledge-bases/${knowledgeBaseId}`
};
