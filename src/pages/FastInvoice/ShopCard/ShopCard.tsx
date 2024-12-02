import React, { useEffect, useState } from 'react';

import { ShopCardProps } from './ShopCard.types';
import personIcon from '/icons/name person.svg';

import callIcon from '/icons/call.svg';

import './ShopCard.css';
import { BackBtn } from '@/components/custom/BackBtn';
import IconInput from '@/components/custom/InputWithIcon';
import { SelectComp } from '@/components/custom/SelectItem';
import { QRCodeComp } from '@/components/custom/QRCodeComp';
import useDirection from '@/hooks/useDirection';
import { Textarea } from '@/components/ui/textarea';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { ShopCardTable } from '@/components/custom/ShopCardTable';
import { ShopCardSummery } from '@/components/custom/ShopCardSummery';
import ConfirmBk from '@/components/custom/ConfimBk';
import { addProduct, updateField } from '@/store/slices/orderSchema';
import axiosInstance from '@/api/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import createCrudService from '@/api/services/crudService';
import { Button } from '@/components/custom/button';

import { useParams } from 'react-router-dom';
export const ShopCardCo: React.FC<ShopCardProps> = () => {
  const isRtl = useDirection();
  const params = useParams();

  const cardItemValue = useSelector((state: any) => state.cardItems.value);
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const allService = createCrudService<any>('manage/customers');
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();

  const initialValue = {
    name: '',
    phone: '',
    notes: '-',
    tax_registration_number: '',
    vat_registration_number: '',
    address: '',
    addToZatca: true,
  };
  // Initialize form state
  const [formState, setFormState] = useState(initialValue);
  const handleInputChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };
  let dispatch = useDispatch();
  const handleInputChangex = async (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
    dispatch(
      updateField({
        field: 'customer_id',
        value: value,
      })
    );
    const res = await axiosInstance
      .get(`/manage/customers/${value}`)
      .then((res) => {
        const customerData = res?.data?.data;
        // setFormState(customerData)
        if (customerData) {
          handleInputChange('name', customerData.id || '');
          handleInputChange('phone', customerData.phone || '');
          handleInputChange(
            'tax_registration_number',
            customerData.tax_registration_number || ''
          );
          handleInputChange(
            'vat_registration_number',
            customerData.vat_registration_number || ''
          );

          // Check if the addresses array exists and has at least one entry
          const address = customerData.addresses?.[0]?.name || '';
          handleInputChange('address', address);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch customer data', err);
      });
  };

  useEffect(() => {
    if (cardItemValue && cardItemValue.length > 0) {
      const products = cardItemValue.map((item: any) => ({
        product_id: item.id || '',
        quantity: item.qty || 0,
        unit_price: item.price || 0,
        total_price: item.price * item.qty || 0,
      }));

      dispatch(addProduct(products));
    }
  }, [cardItemValue, dispatch]);
  const [loading, setLoading] = useState(false);
  const submitOrder = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('orders', orderSchema);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const handleBkAction = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    dispatch(
      updateField({
        field: 'type',
        value: 1,
      })
    );
  }, []);
  return (
    <>
      <DetailsHeadWithOutFilter bkAction={handleBkAction} />
      {/* <ShopCardTable /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 self-stretch mt-5">
        <div className="md:max-h-[45vh] col-span-3 md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-x-3xl gap-y-0">
          <SelectComp
            options={allData?.data?.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            placeholder="Select Customer"
            onValueChange={(value) =>
              handleInputChangex('customerCategory', value)
            }
            label={t('CUSTOMER_NAME')}
            className="col-span-10 md:col-span-4 w-[327px]"
          />
          <IconInput
            disabled
            name="name"
            className="col-span-10 md:col-span-4"
            label="رقم العميل"
            iconSrc={callIcon}
            value={formState.phone}
            onChange={null}
          />
          <IconInput
            disabled
            name={formState.name}
            className="col-span-10 md:col-span-10"
            label="اسم الشارع"
            value={formState.address}
            onChange={null}
          />
          <IconInput
            disabled
            className="col-span-10 md:col-span-4"
            label="رقم تسجيل ضريبة القيمة المضافة"
            value={formState.tax_registration_number}
            onChange={null}
          />
          <IconInput
            disabled
            className="col-span-10 md:col-span-6"
            label="معرف اخر"
            value={formState.vat_registration_number}
            onChange={null}
          />
          <div className="col-span-10">
            <CheckboxWithText
              className=""
              label="اضافة التقرير الي Zatca"
              checked={formState.addToZatca}
              onChange={(e) =>
                handleInputChange('addToZatca', e.target.checked)
              }
            />
          </div>
          <div className="col-span-10 ">
            <Button
              dir="ltr"
              loading={loading}
              disabled={loading || (params.id ? true : false)}
              onClick={submitOrder}
              className="w-[144px]"
            >
              حفظ
            </Button>
          </div>
        </div>
        <ShopCardSummery />
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
