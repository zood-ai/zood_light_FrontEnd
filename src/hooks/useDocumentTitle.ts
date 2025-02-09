import { useTranslation } from 'react-i18next';
import { useLayoutEffect, useState } from 'react';

const useDocumentTitle = (title: string) => {
  const [documentTitle, setDocumentTitle] = useState(title);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    document.title = `${t('APP_NAME')} - ${documentTitle}`;
  }, [documentTitle, t]);

  return [documentTitle, setDocumentTitle];
};

export { useDocumentTitle };
