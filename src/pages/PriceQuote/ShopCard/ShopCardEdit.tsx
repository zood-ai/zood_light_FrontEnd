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
import CustomerFormEdit from './CustomerFormEdit';

export const ShopCardEditPQ: React.FC<ShopCardProps> = () => {
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

  const taxAmount = useMemo(
    () => (totalCost * getTaxes?.data?.[0]?.rate) / 100,
    [totalCost, getTaxes]
  );
 

  useEffect(() => {
    dispatch(updateField({ field: 'type', value: 2 }));
  }, []);

  
  const { data : getOrdersById} = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );
  useEffect(() => {
    dispatch(
      updateField({ field: 'total_price', value: totalCost - taxAmount })
    );
  }, [totalCost, taxAmount]);

  const handleBkAction = () => setIsOpen(true);
  
  useEffect(() => {
    if (params.id && getOrdersById) {
      
      dispatch(updateField({ field: 'discount_amount', value: getOrdersById.data.discount_amount}));
      updateField({ field: 'total_price', value: getOrdersById.data.total_price});
      dispatch(updateField({ field: 'type', value: 2 }));
      dispatch(updateField({ field: 'customer_id', value: getOrdersById.data.customer?.id }));
      dispatch(
        updateField({
          field: 'branch_id',
          value: Cookies.get('branch_id') || '',
        })
      );
 
      const products = getOrdersById?.data?.products?.map((item: any) => ({
        product_id: item.id || '',
        quantity: item.quantity || 0,
        unit_price: item.price || 0,
        discount_amount: 0,
        discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
        discount_type: 2,
        total_price: item.price * item.quantity || 0,
      }));
      
      dispatch(addProduct(products));
            // dispatch(addTax(products));

    }
  }, [getOrdersById]);
  
  return (
    <>
      <DetailsHeadWithOutFilter bkAction={handleBkAction} />
      <CustomerFormEdit />
      {/* <CustomerForm /> */}
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
    </>
  );
};
