export const changeDocumentDirection: (lng: 'en' | 'ar') => void = (lng: 'en' | 'ar') => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'en' ? 'ltr' : 'rtl'
}
