import React, { useEffect, useState } from 'react';

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
import createCrudService from '@/api/services/crudService';
import { useDispatch } from 'react-redux';
import { resetOrder } from '@/store/slices/orderSchema';
import ConfirmBk from '@/components/custom/ConfimBk';

export const CorporateInvoicesAdd: React.FC<CorporateInvoicesProps> = () => {
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const allServiceUser = createCrudService<any>('menu/products?not_default=1');
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
      <div className="flex flex-wrap flex-grow  gap-4">
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
