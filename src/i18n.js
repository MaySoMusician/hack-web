import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { initializeDefaultData } from './store';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV !== 'production',
    fallbackLng: 'en',
    returnEmptyString: false,
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      // not needed for react as it escapes by default
      escapeValue: false,
    },
  })
  .then(initializeDefaultData);

export default i18n;