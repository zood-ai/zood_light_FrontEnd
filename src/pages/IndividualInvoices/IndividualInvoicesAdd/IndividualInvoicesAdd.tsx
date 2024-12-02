import React, { useEffect, useState } from 'react';

import { IndividualInvoicesAddProps } from './IndividualInvoicesAdd.types';

import './IndividualInvoicesAdd.css';
import { useTranslation } from 'react-i18next';
import { CardItem } from '@/components/CardItem';
import { useParams } from 'react-router-dom';
import { DeatilsHeaderWithFilter } from '@/components/custom/DeatilsHeaderWithFilter';
import createCrudService from '@/api/services/crudService';
import { useDispatch } from 'react-redux';
import ConfirmBk from '@/components/custom/ConfimBk';
import { resetOrder } from '@/store/slices/orderSchema';

export const IndividualInvoicesAdd: React.FC<
  IndividualInvoicesAddProps
> = () => {
  const { i18n, t } = useTranslation();

  const allServiceUser = createCrudService<any>('menu/products?not_default=1&sort=-created_at');
  const { useGetAll } = allServiceUser;
  const { data: allUserData } = useGetAll();
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(resetCard());
    dispatch(resetOrder());
  }, [dispatch]);

  return (
    <>
      <DeatilsHeaderWithFilter
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <div className="flex flex-wrap flex-grow gap-4">
        {allUserData?.data?.map((item, index) => (
          <CardItem key={item.id} index={index} item={item} />
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
