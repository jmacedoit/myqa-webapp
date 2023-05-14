
/*
 * Module dependencies.
 */

import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import resources from 'src/translations';

/*
 * Setup.
 */

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

/*
 * Export i18n.
 */

export default i18n;
