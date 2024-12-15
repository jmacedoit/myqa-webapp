
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
      languages: {
        en: 'English',
        'pt-PT': 'Portuguese',
        'pt-BR': 'Portuguese (Brazil)',
        fr: 'French',
        es: 'Spanish',
        de: 'German',
        it: 'Italian'
      },
      title: 'Myqa. Get answers out of your documents.',
      menu: {
        greetingPrefix: 'Hey there, '
      },
      questionBar: {
        title: 'What do you need to know?',
        placeholder: 'Ask your question...',
        emptyKnowledgeBaseLabel: 'Choose knowledge base',
        questionSettingsTitle: 'Question settings',
        wisdomLevel: {
          label: 'Wisdom (answer quality)',
          marks: {
            medium: 'Medium',
            high: 'High',
            veryHigh: 'Very high'
          }
        },
        language: {
          label: 'Answer language',
          inferredOptionLabel: 'Auto'
        },
        settingsState: {
          wisdomLevelLabel: 'Wisdom',
          languageLabel: 'Language',
          autoLanguage: 'Auto'
        }
      },
      footer: {
        termsAndConditionsLink: 'Terms & conditions',
        privacyPolicyLink: 'Privacy policy'
      },
      chatSessionNavigator: {
        emptyChatLabel: 'Empty chat',
        historyButton: 'Chat history'
      },
      screens: {
        landingPage: {
          hero: {
            signInButton: 'Sign in',
            titleHighlight: 'Get answers ',
            titleRest: 'out of your documents',
            yourDataEquationElement: 'your data',
            elevatorPitch: 'Upload your documents and let the AI process them. \nThen just ask away and get the answers you\'re looking for.',
            callToAction: 'Sign up now!'
          },
          howItWorks: {
            title: 'How it works',
            step1: {
              title: 'Create a knowledge base',
              description: 'A knowledge base groups related documents enabling the AI to search them collectively.'
            },
            step2: {
              title: 'Upload your documents',
              description: 'Upload the documents containing the information you want the AI to process into your knowledge base.'
            },
            step3: {
              title: 'Ask questions, get answers',
              description: 'Ask  all your questions. Get answers fast and easily!'
            }
          }
        },
        menu: {
          navigation: {
            account: 'Account',
            knowledgeBases: 'Knowledge bases',
            logout: 'Logout',
            qaChats: 'Q&A chats'
          },
          logoutSuccessMessage: 'You have been logged out'
        },
        account: {
          title: 'Account',
          personalInformationTitle: 'Personal information',
          securityTitle: 'Actions',
          changePasswordLabel: 'Change password'
        },
        changePassword: {
          title: 'Change password',
          successMessage: 'Password has been changed'
        },
        knowledgeBases: {
          title: 'Knowledge Bases',
          resourcesCountSufix: 'resources',
          noResources: 'No resources',
          editKnowledgeBase: 'Edit knowledge base',
          createKnowledgeBase: 'Add new knowledge base',
          createKnowledgeBaseButtonLabel: 'Add new',
          resourceDatePrefix: 'Added'
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
        passwordRecovery: {
          title: 'Password recovery'
        },
        passwordRecoveryEmailSent: {
          title: 'Good to go',
          description: 'We have sent you an email with a link to reset your password.'
        },
        resetPassword: {
          title: 'Reset password'
        },
        resetPasswordSuccess: {
          title: 'Password reset successful',
          description: 'You can now sign in with your new password.',
          signInLabel: 'Sign in'
        },
        knowledgeBase: {
          resourcesTitle: 'Resources',
          noResourcesMessage: 'You have still not added any resources to this knowledge base.',
          actionsTitle: 'Actions',
          addResourceButton: 'Add resource',
          editName: 'Change name',
          deleteKnowledgeBase: 'Delete',
          deleteKnowledgeBaseSuccessMessage: 'Knowledge base has been removed'
        },
        addResource: {
          title: 'Add resource',
          loadingMessge: 'Myqa is digesting your resource. This may take a few minutes.',
          successMessage: 'Resource has been added',
          errorMessage: 'There was an error adding your resource. Please try again later.'
        },
        sources: {
          title: 'Aswer sources'
        },
        chatSessions: {
          title: 'Previous chats',
          lastUpdatePrefix: 'Last message at'
        }
      },
      forms: {
        updateKnowledgeBase: {
          name: {
            label: 'Name',
            requiredError: 'Name is required',
            invalidError: 'Name is either too short or too long'
          },
          submitEditLabel: 'Save',
          submitAddLabel: 'Add'
        },
        signIn: {
          submitLabel: 'Sign in',
          signInSuccessMessage: 'You have been signed in',
          operationErrors: {
            wrongCredentials: 'Email not registered or wrong password'
          }
        },
        signUp: {
          submitLabel: 'Continue',
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
          },
          operationErrors: {
            emailAlreadyRegisteredError: 'Email already registered',
            genericError: 'There was an error creating your account. Please try again later.'
          }
        },
        passwordRecovery: {
          submitLabel: 'Request reset link'
        },
        resetPassword: {
          submitLabel: 'Reset password'
        },
        changePassword: {
          submitLabel: 'Update password',
          oldPassword: {
            label: 'Old password',
            requiredError: 'Password is required'
          },
          newPassword: {
            label: 'New password',
            requiredError: 'Password is required',
            patternError: 'Password must respect rules'
          },
          newPasswordRepetition: {
            label: 'New password repetition',
            requiredError: 'Password repetition is required',
            nonMatchingError: 'Passwords are not equal'
          },
          operationErrors: {
            wrongCredentials: 'The password is not correct'
          }
        },
        common: {
          email: {
            label: 'Email',
            requiredError: 'Email is required',
            invalidError: 'Write a valid email'
          },
          displayName: {
            label: 'Display name'
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
          },
          operationErrors: {
            genericError: 'There was an error. Please try again later.'
          }
        }
      }
    }
  }
};

export default translations;

export const translationKeys = propertiesLeaves<typeof translations.en.translation>(translations.en.translation);
