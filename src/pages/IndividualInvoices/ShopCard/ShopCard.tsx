import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import { Button } from '@/components/custom/button';
import { useTranslation } from 'react-i18next';

export const ShopCard: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const dispatch = useDispatch();
  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const { t } = useTranslation();
  const ref = useRef<{ submitOrder: (newCustomer: any) => void }>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const [newCustomer, setNewCustomer] = useState(false);

  const totalCost = useMemo(
    () => cardItemValue?.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cardItemValue]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (cardItemValue.length <= 0) {
      navigate('/zood-dashboard/individual-invoices/add');
    }
  }, [cardItemValue.length, navigate]);

  const taxAmount = useMemo(() => (totalCost * 15) / 100, [totalCost]);
  useEffect(() => {
    if (cardItemValue && cardItemValue.length > 0) {
      const products = cardItemValue.map((item: any) => ({
        product_id: item.id || '',
        quantity: item.qty || 0,
        unit_price: item.price || 0,
        discount_amount: 0,
        discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
        discount_type: 2,
        total_price: item.price * item.qty || 0,
        is_tax_included: settings?.data?.tax_inclusive_pricing,
        taxes: [
          {
            id: taxes?.data[0]?.id,
            rate: taxes?.data[0]?.rate,
            amount: !settings?.data?.tax_inclusive_pricing
              ? (item.price * item.qty || 0) *
                ((taxes?.data[0]?.rate || 0) / 100)
              : (item.price * item.qty || 0) *
                ((taxes?.data[0]?.rate || 0) /
                  (100 + taxes?.data[0]?.rate || 0)),
          },
        ],
      }));

      dispatch(addProduct(products));
    }
  }, [cardItemValue, dispatch]);

  // Set default type on mount
  useEffect(() => {
    dispatch(updateField({ field: 'type', value: 1 }));
  }, []);

  // Fetch order details by ID and update Redux store
  const getOrdersById = createCrudService<any>('orders').useGetById(
    params.id !== 'add' ? params.objId ?? '' : ''
  );

  // Handle customer ID update
  useEffect(() => {
    if (params.objId && getOrdersById?.data?.data) {
      const { data } = getOrdersById.data;
      dispatch(updateField({ field: 'customer_id', value: data.customer?.id }));
    }
  }, [params.objId, getOrdersById?.data?.data]);
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

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

          <Button
            dir="ltr"
            loading={loading}
            disabled={loading || (params.id ? true : false)}
            onClick={() => {
              if (ref.current) {
                ref.current.submitOrder({ newCustomer }); // Call the child's function
              }
            }}
            className="w-[144px] mt-10"
          >
            {!params.id ? t('ADD_INVOICE') : t('SAVE')}
          </Button>
        </div>
        <div className="w-[45%] max-xl:w-full xl:mt-[-70px]">
          <CustomerForm
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            setLoading={setLoading}
            loading={loading}
            ref={ref}
          />
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
