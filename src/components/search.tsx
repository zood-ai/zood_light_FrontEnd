import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Search() {
  const { i18n , t } = useTranslation();

  return (
    <div>
      <Input
        type='search'
        placeholder={t('search')}
        className='md:w-[100px] lg:w-[300px]'
      />
    </div>
  )
}
