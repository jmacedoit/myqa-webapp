
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
          title: 'Sign in'
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
        email: {
          label: 'Email',
          requiredError: 'Email is required',
          invalidError: 'Write a valid email'
        },
        password: {
          label: 'Password',
          requiredError: 'Password is required',
          invalidError: 'Password is too short'
        },
        resourceFile: {
          label: 'File',
          requiredError: 'File is required'
        }
      }
    }
  }
};

export default translations;

export const translationKeys = propertiesLeaves<typeof translations.en.translation>(translations.en.translation);
