import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import i18n, { Resource } from 'i18next'
import en from './locales/en.json'
import ar from './locales/ar.json'

const resources: Resource = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
}

const supportedLngs: string[] = ['en', 'ar']

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      lookupLocalStorage: import.meta.env.VITE_LANGUAGE_CONFIG_KEY,
    },
    debug: process.env.NODE_ENV !== 'production',
    resources,
    fallbackLng: import.meta.env.VITE_DEFAULT_LANGUAGE,
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
  })
