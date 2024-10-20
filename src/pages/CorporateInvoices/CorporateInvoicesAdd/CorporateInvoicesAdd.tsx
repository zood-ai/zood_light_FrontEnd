import React, { useState } from 'react';

import { CorporateInvoicesProps } from './CorporateInvoicesAdd.types';

import './CorporateInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { BackBtn } from '@/components/custom/BackBtn';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import IconInput from '@/components/custom/InputWithIcon';
import { SelectComp } from '@/components/custom/SelectItem';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import { DeatilsHeaderWithFilter } from '@/components/custom/DeatilsHeaderWithFilter';

export const CorporateInvoicesAdd: React.FC<
  CorporateInvoicesProps
> = () => {
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

  const handleTotalCountChange = (newCount: number , type : string) => {
    if(type === 'plus') setTotalShopCardCount((prevTotal) => prevTotal + 1);
    if(type === 'minus') setTotalShopCardCount((prevTotal) => prevTotal - 1);
  };
  const navigate = useNavigate();

 
  return (
    <>
    <DeatilsHeaderWithFilter totalShopCardCount={totalShopCardCount} />
    <div className="grid grid-cols-1 md:grid-cols-6  mt-md gap-x-md gap-y-0">
      {items.map((item, index) => (
        <CardItem
          key={item.id}
          index={index}
          setShopCardCount={handleTotalCountChange}
        />
      ))}
    </div>
  </>
  );
};
