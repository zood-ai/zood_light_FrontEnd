import React, { useEffect, useState } from 'react';

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
import { resetCard, setCardItem } from '@/store/slices/cardItems';
import { RootState } from '@/store';
import ConfirmBk from '@/components/custom/ConfimBk';
import { resetOrder } from '@/store/slices/orderSchema';

export const IndividualInvoicesAdd: React.FC<
  IndividualInvoicesAddProps
> = () => {
  const { i18n, t } = useTranslation();

  
  const allServiceUser = createCrudService<any>('menu/products');
  const { useGetAll } = allServiceUser;
  const { data: allUserData } = useGetAll();
  // console.log(cardItemValue.map((item: any) => item), 'allUserData');
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
  
    // dispatch(resetCard());
    dispatch(resetOrder());
  }, [dispatch])

  return (
    <>
      <DeatilsHeaderWithFilter
        bkAction={() => {

          setIsOpen(true);
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-6  mt-md gap-x-md gap-y-md">
        {allUserData?.data?.map((item, index) => (
          <CardItem
            key={item.id}
            index={index}
            item={item}
          />
        ))}
      </div>
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
    </>
  );
};
