import React, { useState } from 'react';

import './CategoriesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { BackBtn } from '@/components/custom/BackBtn';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import IconInput from '@/components/custom/InputWithIcon';
import { SelectComp } from '@/components/custom/SelectItem';
import useDirection from '@/hooks/useDirection';
import { CategoriesAddProps } from './CategoriesAdd.types';
import { Input } from '@/components/ui/input';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import { Button } from '@/components/custom/button';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
export const CategoriesAdd: React.FC<CategoriesAddProps> = () => {
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
        <div className="flex flex-col items-start rounded-none max-w-[580px] ">
          <div className="grid grid-cols-2 gap-6 self-stretch mt-5 w-full max-md:max-w-full">
            <IconInput
              label="اسم الفئه"
              // placeholder="ادخل اسم المورد"
              // iconSrc={personIcon}
            />
          </div>
          <Button
            className="mt-4 h-[39px] w-[163px]"
            onClick={() => {
              console.log('clicked');
            }}
          >
            {'اضافة الفئه'}
          </Button>
        </div>
      </div>
    </>
  );
};
