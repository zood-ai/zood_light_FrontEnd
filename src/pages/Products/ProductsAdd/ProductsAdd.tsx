import React, { useState } from 'react';

import './ProductsAdd.css';
import { useTranslation } from 'react-i18next';
import { BackBtn } from '@/components/custom/BackBtn';
import IconInput from '@/components/custom/InputWithIcon';
import personIcon from '/icons/name person.svg';
import useDirection from '@/hooks/useDirection';
import { ProductsAddProps } from './ProductsAdd.types';
import { Button } from '@/components/custom/button';
import { Textarea } from '@/components/ui/textarea';
import Previews from '@/components/custom/ImgFilesDND';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { SelectComp } from '@/components/custom/SelectItem';
export const ProductsAdd: React.FC<ProductsAddProps> = () => {
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
      <div className="flex flex-col items-start  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 self-stretch mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mt-5">
            <IconInput
              label="اسم المنتج"
              inputClassName="w-[100%]"
              // placeholder="ادخل اسم المورد"
              // iconSrc={personIcon}
            />
            <IconInput
              label="اسم المنتج"
              inputClassName="w-[100%]"

              // placeholder="ادخل اسم المورد"
              // iconSrc={personIcon}
            />
            <SelectComp
              options={[]}
              onValueChange={function (value: string): void {}}
              label="اسم المنتج"
              className="col-span-1 md:col-span-2 w-[48%]"
              // placeholder="ادخل اسم المورد"
            />
            <div className="col-span-1 md:col-span-2">
              <Textarea placeholder="ادخل الوصف" label="الوصف" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <IconInput
                inputClassName="md:w-[87%]"
                label="اسم المنتج"
                // placeholder="ادخل اسم المورد"
                // iconSrc={personIcon}
              />
            </div>
            <div className="col-span-1 md:col-span-1">
              <IconInput
                inputClassName="md:w-[100%]"
                label="اسم المنتج"
                // placeholder="ادخل اسم المورد"
                // iconSrc={personIcon}
              />
            </div>
            <div className="col-span-1 md:col-span-1">
              <IconInput
                inputClassName="md:w-[100%]"
                label="اسم المنتج"
                // placeholder="ادخل اسم المورد"
                iconSrcLeft={'SR'}
              />
            </div>
          
          </div>
          <div className="flex justify-center">
            <div className="w-[75%] h-[50%] mt-xl">
              <Previews
                onFilesChange={function (files: any[]): void {
                  throw new Error('Function not implemented.');
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="mt-4 h-[39px] w-[163px]"
          onClick={() => {
            console.log('clicked');
          }}
        >
          {'اضافة منتج'}
        </Button>
      </div>
    </>
  );
};
