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

  return (
    <>
      <DeatilsHeaderWithFilter
        bkAction={() => {
          setIsOpen(true);
        }}
        setSearchInput={setSearchInput}
      />
      <div className="flex flex-wrap w-fit mx-auto gap-x-4 gap-y-6">
        {myData?.data?.map((item, index) => (
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
