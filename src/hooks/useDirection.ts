import { useTranslation } from 'react-i18next';

const useDirection = () => {
  const { i18n } = useTranslation();
  return i18n.dir(i18n.resolvedLanguage || i18n.language) === 'rtl';
};

export default useDirection;
