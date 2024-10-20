import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en.json'
import ar from '../locales/ar.json'

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'ar', // Fallback language is Arabic
    lng:  'ar', // Always default to Arabic if no language is found
    detection: {
      order: ['localStorage', 'cookie'], // Only check localStorage or cookies
      caches: ['localStorage'], // Cache language selection in localStorage
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
