import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: enTranslation
    },
    fr: {
      translation: frTranslation
    }
  }
});
