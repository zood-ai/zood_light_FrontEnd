import React from 'react';

import { DeatilsHeaderWithFilterProps } from './DeatilsHeaderWithFilter.types';

import './DeatilsHeaderWithFilter.css';
import { QRCodeComp } from '../QRCodeComp';
import { BackBtn } from '../BackBtn';
import { SelectComp } from '../SelectItem';
import IconInput from '../InputWithIcon';
import { useNavigate } from 'react-router-dom';
import useDirection from '@/hooks/useDirection';
import { GoToShop } from '../GoToShop';
import search from '/icons/search.svg';
import { useTranslation } from 'react-i18next';

export const DeatilsHeaderWithFilter: React.FC<
  DeatilsHeaderWithFilterProps
> = ({ bkAction }) => {
  const navigate = useNavigate();
  const isRtl = useDirection();
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:translate-y-[-16px]">
        <BackBtn bkAction={bkAction ? bkAction : () => {}} />
        <div className="col-span-4 md:col-span-3 flex flex-col md:flex-row md:items-center gap-md">
          <IconInput
            placeholder={t('SEARCH_TABLE_PLACEHOLDER')}
            iconSrc={search}
          /> 
          <div className={`w-[250px]`} dir={isRtl ? 'rtl' : 'ltr'}>
            <SelectComp
              placeholder={t('SORT_BY')}
              options={[{ value: 'all', label: 'All' }]}
              onValueChange={function (value: string): any {}}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <GoToShop />
        </div>
        <div className="flex justify-end">{/* <QRCodeComp /> */}</div>
      </div>
    </>
  );
};
