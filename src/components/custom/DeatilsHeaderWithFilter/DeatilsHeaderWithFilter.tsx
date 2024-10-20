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

export const DeatilsHeaderWithFilter: React.FC<
  DeatilsHeaderWithFilterProps
> = ({ totalShopCardCount }) => {
  const navigate = useNavigate();
  const isRtl = useDirection();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-10 md:translate-y-[-16px]">
        <BackBtn />
        <div className="col-span-4 md:col-span-3 flex flex-col md:flex-row md:items-center gap-md">
          <IconInput
            placeholder="بحث عن فاتورة, عميل, تاريخ"
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/cccbd13d86e96c7d597403139b3bca31e0ba15a35f6c7f727bfcddcc54ff2c34?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
          />
          <div className={`w-[250px]`} dir={isRtl ? 'rtl' : 'ltr'}>
            <SelectComp
              placeholder="فرز حسب التصنيف"
              options={[{ value: 'all', label: 'All' }]}
              onValueChange={function (value: string): any {
                console.log(value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <GoToShop totalShopCardCount={totalShopCardCount} />
        </div>
        <div className="flex justify-end">
          <QRCodeComp />
        </div>
      </div>
    </>
  );
};
