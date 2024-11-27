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

export const ShopCard: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  // abcd
  // const totalCost = useMemo(
  //   () => cardItemValue?.reduce((acc, item) => acc + item.price * item.qty, 0),
  //   [cardItemValue]
  // );

  // const taxAmount = useMemo(() => (totalCost * 15) / 100, [totalCost]);
  // useEffect(() => {
  //   if (cardItemValue && cardItemValue.length > 0) {
  //     const products = cardItemValue.map((item: any) => ({
  //       product_id: item.id || '',
  //       quantity: item.qty || 0,
  //       unit_price: item.price || 0,
  //       discount_amount: 0,
  //       discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
  //       discount_type: 2,
  //       total_price: item.price * item.qty || 0,
  //     }));

  //     dispatch(addProduct(products));
  //   }
  // }, [cardItemValue, dispatch]);
  // abcd

  // Load products to Redux on mount or cardItemValue update
  // useEffect(() => {
  //   if (params.id !== 'add' && cardItemValue.length > 0) {
  //     const products = cardItemValue.map((item: any) => ({
  //       product_id: item.id || '',
  //       quantity: item.qty || 0,
  //       unit_price: item.price || 0,
  //       total_price: item.price * item.qty || 0,
  //       discount_amount: 0,
  //       discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
  //       discount_type: 2,
  //     }));
  //     dispatch(addProduct(products));
  //   }
  // }, [cardItemValue, dispatch]);

  // Set default type on mount

  // abcd
  useEffect(() => {
    dispatch(updateField({ field: 'type', value: 2 }));
  }, []);
  // abcd

  // Fetch order details by ID and update Redux store

  // abcd
  // const getOrdersById = createCrudService<any>('orders').useGetById(
  //   params.id !== 'add' ? params.objId ?? '' : ''
  // );
  // abcd

  // Trigger fetching products based on params and fetched order data
  // useEffect(() => {
  //   if (params.id !== 'add' && getOrdersById?.data?.data) {
  //     const { data } = getOrdersById.data;

  //     // Map products data
  //     const products = data.products?.map((item: any) => ({
  //       id: item.id || '',
  //       image: item.image || '',
  //       qty: item.pivot?.quantity || 0,
  //       price: item.pivot?.unit_price || 0,
  //       total_price: item.pivot?.total_price || 0,
  //       name: item.name || '',
  //       discount_amount: item.pivot?.discount_amount,
  //       discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
  //       discount_type: item.pivot?.discount_type || 2,
  //     }));

  //     dispatch(setCardItem(products));
  //   }
  // }, [params.objId, getOrdersById?.data?.data]);

  // abcd
  // Handle customer ID update
  // useEffect(() => {
  //   if (params.objId && getOrdersById?.data?.data) {
  //     const { data } = getOrdersById.data;
  //     dispatch(updateField({ field: 'customer_id', value: data.customer?.id }));
  //   }
  // }, [params.objId, getOrdersById?.data?.data]);
  // const { data: branchData } =
  //   createCrudService<any>('manage/branches').useGetAll();
  // abcd

  // Map payments data and update subtotal
  // useEffect(() => {
  //   if (params.objId && getOrdersById?.data?.data) {
  //     const { data } = getOrdersById.data;

  //     const payments = data.payments?.map((item: any) => ({
  //       tendered: 180,
  //       amount: item.amount || 0,
  //       payment_method_id: item.payment_method_id || '',
  //       tips: 0,
  //       meta: { external_additional_payment_info: 'some info' },
  //     }));

  //     dispatch(addPayment(payments));

  //     // Update subtotal price
  //     dispatch(updateField({ field: 'subtotal_price', value: data.payments?.total_price }));
  //   }
  // }, [params.objId, getOrdersById?.data?.data]);

  // abcd
  // Set remaining fields
  // useEffect(() => {
  //   if (params.objId) {
  //     dispatch(
  //       updateField({
  //         field: 'branch_id',
  //         value: branchData && branchData?.data?.[0]?.id,
  //       })
  //     );
  //     dispatch(updateField({ field: 'discount_amount', value: taxAmount }));
  //     dispatch(updateField({ field: 'type', value: 2 }));
  //   }
  // }, [params.objId, taxAmount]);

  // // Calculate and update total price based on external dependencies
  // useEffect(() => {
  //   dispatch(
  //     updateField({ field: 'total_price', value: totalCost - taxAmount })
  //   );
  // }, [totalCost, taxAmount]);
  // abcd
  const handleBkAction = () => setIsOpen(true);

  return (
    <>
      <DetailsHeadWithOutFilter bkAction={handleBkAction} mainTittle="فاتورة مؤسسة"/>
      {/* <ShopCardTable /> */}
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
