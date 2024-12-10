import React, { useEffect, useMemo, useState } from 'react';
import { ShopCardProps } from './ShopCard.types';
import './ShopCard.css';
import useDirection from '@/hooks/useDirection';
import { ShopCardTable } from '@/components/custom/ShopCardTable';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import {
  addPayment,
  addProduct,
  updateField,
} from '@/store/slices/orderSchema';
import ConfirmBk from '@/components/custom/ConfimBk';
import { useNavigate, useParams } from 'react-router-dom';
import { setCardItem } from '@/store/slices/cardItems';
import CustomerForm from './CustomerForm';

export const ShopCardEdit: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const getOrdersById = createCrudService<any>('orders').useGetById(
    params.id || ''
  );

  const totalCost = useMemo(
    () => cardItemValue?.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cardItemValue]
  );

  const taxAmount = useMemo(() => (totalCost * 15) / 100, [totalCost]);

  useEffect(() => {
    dispatch(updateField({ field: 'type', value: 1 }));
  }, []);

  // Fetch order details by ID and update Redux store

  // Trigger fetching products based on params and fetched order data
  useEffect(() => {
    if (getOrdersById?.data?.data) {
      const { data } = getOrdersById?.data;

      // Map products data
      const products = data.products?.map((item: any) => ({
        id: item.id || '',
        image: item.image || '',
        qty: item.pivot?.quantity || 0,
        price: item.pivot?.unit_price || 0,
        total_price: item.pivot?.total_price || 0,
        name: item.name || '',
        discount_amount: item.pivot?.discount_amount,
        discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
        discount_type: item.pivot?.discount_type || 2,
      }));

      dispatch(setCardItem(products));
    }
  }, [getOrdersById?.data?.data]);
  useEffect(() => {
    const products1 = cardItemValue.map((item: any) => ({
      product_id: item.id || '',
      quantity: item.qty || 0,
      unit_price: item.price || 0,
      discount_amount: 0,
      discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
      discount_type: 2,
      total_price: item.price * item.qty || 0,
    }));

    dispatch(addProduct(products1));
  }, [cardItemValue]);

  // Handle customer ID update
  useEffect(() => {
    if (getOrdersById?.data?.data) {
      const { data } = getOrdersById.data;
      dispatch(updateField({ field: 'customer_id', value: data.customer?.id }));
      dispatch(
        updateField({ field: 'customer_notes', value: data.discount_amount })
      );
      dispatch(addPayment(data.payments || []));
    }
  }, [getOrdersById?.data?.data]);
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

  // Set remaining fields
  useEffect(() => {
    if (params.objId) {
      dispatch(
        updateField({
          field: 'branch_id',
          value: branchData && branchData?.data?.[0]?.id,
        })
      );
      dispatch(updateField({ field: 'discount_amount', value: taxAmount }));
      dispatch(updateField({ field: 'type', value: 1 }));
    }
  }, [params.objId, taxAmount]);

  // Calculate and update total price based on external dependencies
  useEffect(() => {
    dispatch(
      updateField({ field: 'total_price', value: totalCost - taxAmount })
    );
  }, [totalCost, taxAmount]);

  const handleBkAction = () => setIsOpen(true);

  return (
    <>
      <DetailsHeadWithOutFilter bkAction={handleBkAction} />
      <div className="flex gap-5 max-xl:flex-col">
        <div className="w-[55%] max-xl:w-full">
          <ShopCardTable />
        </div>
        <div className="w-[45%] max-xl:w-full">
          <CustomerForm />
        </div>
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
