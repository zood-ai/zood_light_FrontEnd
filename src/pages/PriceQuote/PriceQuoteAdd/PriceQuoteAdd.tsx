import React, { useEffect, useState } from 'react';

import { PriceQuoteAddProps } from './PriceQuoteAdd.types';

import './PriceQuoteAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import useDirection from '@/hooks/useDirection';
import { DeatilsHeaderWithFilter } from '@/components/custom/DeatilsHeaderWithFilter';
import { useDispatch } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import { resetOrder } from '@/store/slices/orderSchema';
import ConfirmBk from '@/components/custom/ConfimBk';

export const PriceQuoteAdd: React.FC<PriceQuoteAddProps> = () => {
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
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
