import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useDirection = () => {
  const { i18n } = useTranslation();
  const [isRtl, setIsRtl] = useState<boolean>(i18n.language === 'ar');

  useEffect(() => {
    setIsRtl(i18n.language === 'ar');
  }, [i18n.language]);

  return isRtl;
};

export default useDirection;
