import React, { useEffect, useMemo, useState } from 'react';
import { ShopCardProps } from './ShopCard.types';
import './ShopCard.css';
import useDirection from '@/hooks/useDirection';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import { addProduct, addTax, updateField } from '@/store/slices/orderSchema';
import ConfirmBk from '@/components/custom/ConfimBk';
import { useParams } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import Cookies from 'js-cookie';
import { StatusBadge } from '@/components/custom/StatusBadge';

export const ShopCardPQ: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const dispatch = useDispatch();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  const totalCost = useMemo(
    () =>
      orderSchema?.products.reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0
      ),
    [orderSchema]
  );
  const { data: getTaxes } = createCrudService<any>('manage/taxes').useGetAll();
  console.log(getTaxes, 'getTaxes');

  const taxAmount = useMemo(
    () => (totalCost * getTaxes?.data?.[0]?.rate) / 100,
    [totalCost, getTaxes]
  );
  useEffect(() => {
    if (orderSchema && orderSchema.products.length > 0) {
      const products = orderSchema.products.map((item: any) => ({
        product_id: item.product_id || '',
        quantity: item.quantity || 0,
        unit_price: item.unit_price || 0,
        discount_amount: 0,
        discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
        discount_type: 2,
        total_price: item.price * item.qty || 0,
      }));

      dispatch(addProduct(products));
    }
  }, []);

  useEffect(() => {
    dispatch(updateField({ field: 'type', value: 2 }));
  }, []);

  const { data: getOrdersById } = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );
  useEffect(() => {
    dispatch(
      updateField({ field: 'total_price', value: totalCost - taxAmount })
    );
  }, [totalCost, taxAmount]);

  const handleBkAction = () => setIsOpen(true);
  console.log(getOrdersById, 'getOrdersById');

  return (
    <>
      <DetailsHeadWithOutFilter
        subTitle={<StatusBadge status="Inactive" text={'draft'} />}
        bkAction={handleBkAction}
      />

      <CustomerForm />
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
    </>
  );
};
