import React, { Suspense, useEffect, useState } from 'react';

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
import { CardGridSkeleton } from '@/components/CardItem/components/CardGridSkeleton';

export const IndividualInvoicesAdd: React.FC<
  IndividualInvoicesAddProps
> = () => {
  const { i18n, t } = useTranslation();

  const allServiceUser = createCrudService<any>(
    'menu/products?not_default=1&sort=-created_at'
  );
  const { useGetAll } = allServiceUser;
  const { data: allUserData } = useGetAll();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [myData, setMyData] = useState(allUserData);

  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(resetCard());
    dispatch(resetOrder());
  }, [dispatch]);

  useEffect(() => {
    if (!searchInput) {
      setMyData(allUserData);
      return;
    }
    const myData = allUserData?.data?.filter((item: any) => {
      return item.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    setMyData({
      ...allUserData,
      data: myData,
    });
  }, [searchInput, allUserData]);
  console.log({ ddd: myData?.data?.length });
  return (
    <>
      <DeatilsHeaderWithFilter
        bkAction={() => {
          setIsOpen(true);
        }}
        setSearchInput={setSearchInput}
      />
      <div className="flex flex-wrap justify-between gap-y-6">
        {myData?.data ? (
          myData?.data?.map((item: any, index: any) => (
            <CardItem key={item.id} index={index} item={item} />
          ))
        ) : (
          <CardGridSkeleton count={12} />
        )}
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
