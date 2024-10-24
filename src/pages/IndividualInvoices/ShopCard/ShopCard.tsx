import React from 'react';

import { ShopCardProps } from './ShopCard.types';
import personIcon from '/icons/name person.svg';

import callIcon from '/icons/call.svg';

import './ShopCard.css';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';
import { ShopCardTable } from '@/components/custom/ShopCardTable';
import { ShopCardSummery } from '@/components/custom/ShopCardSummery';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { useSelector } from 'react-redux';

export const ShopCard: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  return (
    <>
      <DetailsHeadWithOutFilter />
      <ShopCardTable />
      <div className="  grid grid-cols-1 md:grid-cols-3 gap-0 self-stretch mt-5">
        <div className="md:max-h-[45vh] col-span-3 md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-x-3xl gap-y-0   ">
          <IconInput
            label="اسم العميل"
            iconSrc={personIcon}
            className="col-span-10 md:col-span-4   "
          />
          <IconInput
            className="col-span-10 md:col-span-4 "
            label="رقم العميل"
            iconSrc={callIcon}
          />
          <IconInput
            className="col-span-10 md:col-span-10 "
            label="اسم الشارع"
          />

          <IconInput
            className="col-span-10 md:col-span-4 "
            label="رقم تسجيل ضريبة القيمة المضافة"
          />
          <IconInput className="col-span-10 md:col-span-6 " label=" معرف اخر" />
          <div className="col-span-10">
            <CheckboxWithText className={''} label="اضافة التقرير الي Zatca" />
          </div>
        </div>
        <ShopCardSummery />
      </div>
    </>
  );
};
