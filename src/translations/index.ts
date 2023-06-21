
/*
 * Module dependencies.
 */

import { propertiesLeaves } from 'src/utils/types';

/*
 * Translations and helpers.
 */

const translations = {
  en: {
    translation: {
      title: 'Myqa. Chat with your data.',
      menu: {
        greetingPrefix: 'Hey there, '
      },
      screens: {
        knowledgeBases: {
          title: 'Knowledge Bases',
          resourcesCountSufix: 'resources',
          noResources: 'No resources',
          editKnowledgeBase: 'Edit knowledge base',
          createKnowledgeBase: 'Add new knowledge base',
          resourceDatePrefix: 'added'
        },
        signIn: {
          title: 'Sign in',
          signUpButton: 'Sign up',
          forgotPasswordButton: 'Forgot your password?'
        },
        signUp: {
          title: 'Sign up'
        },
        signUpSuccess: {
          title: 'Sign up successful',
          description: 'You will receive an email with a confirmation link. Please click on it to activate your account.',
          signInLabel: 'Sign in'
        },
        verifyEmail: {
          title: 'Verify email',
          description: 'Please activate your account by clicking on the link in the email we sent you.',
          signInLabel: 'Already did'
        },
        emailVerfication: {
          title: 'Email verification',
          success: 'Your email has been verified. You can now sign in.',
          error: 'There was an error verifying your email. Please try to sign in and request another verification email.',
          signInLabel: 'Sign in'
        },
        knowledgeBase: {
          resourcesTitle: 'Resources',
          addResourceButton: 'Add resource'
        },
        addResource: {
          title: 'Add resource'
        }
      },
      forms: {
        knowledgeBase: {
          name: {
            label: 'Name',
            requiredError: 'Name is required',
            invalidError: 'Name is too short'
          },
          submitEditLabel: 'Save',
          submitAddLabel: 'Add'
        },
        signIn: {
          submitLabel: 'Sign in'
        },
        signUp: {
          submitLabel: 'Sign up',
          passwordChecks: {
            title: 'Password rules:',
            length: {
              label: 'Between 8 and 24 characters'
            },
            lowercase: {
              label: 'Contains lowercase characters'
            },
            uppercase: {
              label: 'Contains uppercase characters'
            },
            number: {
              label: 'Contains numbers'
            },
            specialCharacter: {
              label: 'Contains symbols'
            }
          }
        },
        common: {
          email: {
            label: 'Email',
            requiredError: 'Email is required',
            invalidError: 'Write a valid email'
          },
          password: {
            label: 'Password',
            requiredError: 'Password is required',
            patternError: 'Password must respect rules'
          },
          passwordRepetition: {
            label: 'Password repetition',
            requiredError: 'Password repetition is required',
            nonMatchingError: 'Passwords are not equal'
          },
          resourceFile: {
            label: 'File',
            requiredError: 'File is required'
          },
          termsAndConditions: {
            label: 'I agree with the <0>terms and conditions</0> and <1>privacy policy</1>.',
            termsAndConditionsLink: 'terms and conditions',
            privacyPolicyLink: 'privacy policy',
            requiredError: 'You must agree with the terms and conditions and privacy policy to proceed'
          }
        }
      }
    }
  }
};

export default translations;

export const translationKeys = propertiesLeaves<typeof translations.en.translation>(translations.en.translation);
