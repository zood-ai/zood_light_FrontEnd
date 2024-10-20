import React, { useState } from 'react';

import './ResourcesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { BackBtn } from '@/components/custom/BackBtn';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import IconInput from '@/components/custom/InputWithIcon';
import { SelectComp } from '@/components/custom/SelectItem';
import useDirection from '@/hooks/useDirection';
import { ResourcesAddProps } from './ResourcesAdd.types';
import { Input } from '@/components/ui/input';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
export const ResourcesAdd: React.FC<ResourcesAddProps> = () => {
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const items = [
    { id: 1, name: 'Salt', price: 53, quantity: '100 gm' },
    { id: 2, name: 'Pepper', price: 30, quantity: '50 gm' },
    { id: 3, name: 'Sugar', price: 20, quantity: '200 gm' },
    { id: 4, name: 'Tea', price: 15, quantity: '50 gm' },
    { id: 4, name: 'Tea', price: 15, quantity: '50 gm' },
    { id: 4, name: 'Tea', price: 15, quantity: '50 gm' },
    { id: 4, name: 'Tea', price: 15, quantity: '50 gm' },
  ];

  const [totalShopCardCount, setTotalShopCardCount] = useState(0);

  const handleTotalCountChange = (newCount: number) => {
    setTotalShopCardCount((prevTotal) => prevTotal + 1);
  };

  return (
    <>
      <DetailsHeadWithOutFilter />

      <div className="min-h-[70vh]">
        <div className="flex flex-col items-start  max-w-[580px] ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="col-span-1">
              <IconInput
                label="اسم المورد"
                // placeholder="ادخل اسم المورد"
                iconSrc={personIcon}
                inputClassName="w-[100%]"
              />
            </div>
            <div className="col-span-1">
              <IconInput
                label="هاتف المورد"
                // placeholder="ادخل اسم المورد"
                iconSrc={callIcon}
                inputClassName="w-[100%]"
              />
            </div>
          </div>
          <Button
            className="mt-4 h-[39px] w-[163px]"
            onClick={() => {
              console.log('clicked');
            }}
          >
            {'اضافة المورد'}
          </Button>
        </div>
      </div>
    </>
  );
};
