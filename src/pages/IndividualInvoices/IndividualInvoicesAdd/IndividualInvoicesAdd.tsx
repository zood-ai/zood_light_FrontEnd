import React, { useState } from 'react';

import { IndividualInvoicesAddProps } from './IndividualInvoicesAdd.types';

import './IndividualInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import useDirection from '@/hooks/useDirection';
import { useNavigate } from 'react-router-dom';
import { DeatilsHeaderWithFilter } from '@/components/custom/DeatilsHeaderWithFilter';
import saltImg from './salt.png';
import PlusIcon from '@/components/Icons/PlusIcon';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useDispatch, useSelector } from 'react-redux';
import { setCardItem } from '@/store/slices/cardItems';
import { RootState } from '@/store';

export const IndividualInvoicesAdd: React.FC<
  IndividualInvoicesAddProps
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

  const handleTotalCountChange = (newCount: number, type: string) => {
    if (type === 'plus') setTotalShopCardCount((prevTotal) => prevTotal + 1);
    if (type === 'minus') setTotalShopCardCount((prevTotal) => prevTotal - 1);
  };
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const allServiceUser = createCrudService<any>('menu/products');
  const { useGetAll } = allServiceUser;
  const { data: allUserData, isLoading } = useGetAll();
  console.log(allUserData, 'allUserData');
 
  return (
    <>
      <DeatilsHeaderWithFilter totalShopCardCount={totalShopCardCount} />
      <div className="grid grid-cols-1 md:grid-cols-6  mt-md gap-x-md gap-y-md">
        {allUserData?.data?.map((item, index) => (
          <CardItem
            key={item.id}
            index={index}
            setShopCardCount={handleTotalCountChange}
            item={item}
          />
        ))}
      </div>
    </>
  );
};
