// import { useTranslation } from 'react-i18next';
// import { changeLanguage as _storeChangeLanguage } from '@/store/global/global.slice';

// // change with context
// // import { useDispatch } from 'react-redux';

// export function useLanguage() {

//   // change with context
//   // const dispatch = useDispatch();
//   const { t, i18n } = useTranslation();
//   const language = i18n.language;

//   const changeLanguage = (language: 'en' | 'ar') => {
//     if (!language) {
//       throw new Error(
//         `The argument passed to useLanguage().language must be of type 'en' | 'ar'.`,
//       );
//     }
//     i18n.changeLanguage(language);

//       // change with context
//     // dispatch(_storeChangeLanguage({ language }));
//   };

//   const toggleLanguage = () => {
//     const target = i18n.language === 'en' ? 'ar' : 'en';
//     i18n.changeLanguage(target);
//       // change with context
//     // dispatch(_storeChangeLanguage({ language: target }));
//   };

//   return { t, i18n, language, changeLanguage, toggleLanguage };
// }
