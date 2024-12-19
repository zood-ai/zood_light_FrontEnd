import { useRef, useState } from 'react';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import axiosInstance from '@/api/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateField } from '@/store/slices/orderSchema';
import { useNavigate, useParams } from 'react-router-dom';
import PlusIcon from '@/components/Icons/PlusIcon';
import TrashIcon from '@/components/Icons/TrashIcon';
import ShopCardSummeryPQ from '@/components/custom/ShopCardSummery/ShopCardSummeryPQ';
import { ShopCardSummery } from '@/components/custom/ShopCardSummery/ShopCardSummery';
import { ShopCardSummeryCi } from '@/components/custom/ShopCardSummery/ShopCardSummeryCi';
import CustomerForms from './CustomerForms';
import { Textarea } from '@/components/ui/textarea';
import { SelectCompInput } from '@/components/custom/SelectItem/SelectCompInput';
import { useToast } from '@/components/custom/useToastComp';
import { useTranslation } from 'react-i18next';
import { currencyFormated } from '../../../utils/currencyFormated';

import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { TbMenuDeep } from 'react-icons/tb';
import { GrMenu } from 'react-icons/gr';

const CustomerForm = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const { t } = useTranslation();

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
  const { useGetAll: fetchAllProducts } = createCrudService<any>(
    'menu/products?not_default=1&per_page=1000&sort=-updated_at'
  );
  const { data: defaultProduct } = createCrudService<any>(
    'menu/products?filter[name]=sku-zood-20001'
  ).useGetAll();
  const { data: WhoAmI } = createCrudService<any>('auth/whoami').useGetAll();
  const ShowCar = WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';
  // const ShowCar = true;

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const myInputRef = useRef(null);
  const [isTextArea, setIsTextArea] = useState(false);

  const [loading, setLoading] = useState(false);
  const { data: getAllPro } = fetchAllProducts();
  dispatch(updateField({ field: 'is_sales_order', value: 0 }));
  const { showToast } = useToast();
  const handleSubmitOrder = async () => {
    setLoading(true);
    const totalPrice = orderSchema.total_price;
    if (totalPrice == 0) {
      showToast({
        description: 'الرجاء اختيار المنتجات',
        duration: 4000,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    try {
      if (!params.id) {
        const holder = [...orderSchema.payments];
        const newHolder = holder.filter((ele) => ele.notadd !== true);
        const updatedOrderSchema = {
          ...orderSchema,
          payments: newHolder,
          products: orderSchema.products.map((product) => ({
            ...product,
            product_id: product.product_id
              ? product.product_id
              : defaultProduct?.data[0]?.id,
            name: 'sku-zood-20001',
            discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
            discount_type: 2,
          })),
        };

        await mutate(updatedOrderSchema, {
          onSuccess: async (data) => {
            const res = await axiosInstance.get(
              `/orders?filter[id]=${data.data.id}`
            );
            const orderData = res?.data?.data;
            navigate('/zood-dashboard/corporate-invoices');
            dispatch(toggleActionView(true));
            dispatch(toggleActionViewData(orderData[0]));
            setLoading(false);
          },
          onError: () => setLoading(false),
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to submit order', error);
    }
  };

  const updateCardItem = (newItem: {
    product_id?: string;
    quantity: number;
    name?: string;
    unit_price?: number;
    index: number;
    total_price: number;
    kitchen_notes: string;
  }) => {
    const updatedItems = orderSchema.products.map((item, index) =>
      index === newItem.index ? { ...item, ...newItem } : item
    );
    if (newItem.index >= orderSchema.products.length) {
      dispatch(addProduct([...updatedItems, newItem]));
    } else {
      dispatch(addProduct(updatedItems));
    }
  };

  const handleEnglishNumbersOnly = (e) => {
    const arabicNumbers = /[٠-٩]/g;
    console.log(arabicNumbers.test(e.key));
    if (arabicNumbers.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleItemChange = async (index: number, field: string, value: any) => {
    // if (params.id) return;
    if (field === 'product_id') {
      if (!value) {
        updateCardItem({
          index,
          product_id: value,
          quantity: 1,
          name: '',
          unit_price: 0,
          total_price: 0,
          kitchen_notes: myInputRef?.current?.value,
        });
        return;
      }
      try {
        const { data } = await axiosInstance.get(`/menu/products/${value}`);
        const productData = data?.data;

        updateCardItem({
          index,
          product_id: value,
          quantity: 1,
          name: productData.name,
          unit_price: productData.price,
          kitchen_notes: '',
          total_price:
            productData.price * productData.quantity || productData.price,
        });
      } catch (error) {
        console.error('Failed to fetch product data', error);
      }
    } else if (field === 'quantity') {
      const updatedProducts = orderSchema.products.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Number(value) || 1,
              total_price: (Number(value) || 1) * item.unit_price || 0,
            }
          : item
      );
      dispatch(addProduct(updatedProducts));
    } else if (field === 'unit_price') {
      const updatedProducts = orderSchema.products.map((item, i) =>
        i === index
          ? {
              ...item,
              unit_price: Number(value),
              total_price: Number(value) * item.quantity || 0,
            }
          : item
      );
      dispatch(addProduct(updatedProducts));
    }
  };

  const changeToTextArea = () => {
    setIsTextArea(!isTextArea);
  };

  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-10 space-y-5">
      <div className="w-full xl:w-[550px] max-w-full">
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />
          {orderSchema.products.map((item, index) => (
            <div key={index} className="flex flex-col flex-wrap gap-x-5">
              <div className="flex md:w-fit max-md:flex-grow gap-x-2 mb-5">
                {!isTextArea ? (
                  <>
                    <SelectCompInput
                      disabled={params.id}
                      className="flex-grow w-full md:w-[327px] "
                      placeholder={t('PRODUCT_NAME')}
                      options={getAllPro?.data?.map((product) => ({
                        value: product.id,
                        label: product.name,
                      }))}
                      label={t('PRODUCT_NAME')}
                      ref={myInputRef}
                      onValueChange={(value) =>
                        handleItemChange(index, 'product_id', value)
                      }
                      onInputFieldChange={(value) =>
                        handleItemChange(index, 'name', value)
                      }
                      value={item.product_id}
                    />
                    <button
                      onClick={changeToTextArea}
                      className="w-fit h-fit mt-8"
                    >
                      <GrMenu size={25} />
                    </button>
                  </>
                ) : (
                  <>
                    <Textarea
                      placeholder="وصف المنتج"
                      defaultValue={
                        item.name === 'sku-zood-20001'
                          ? item?.kitchen_notes
                          : item?.name
                      }
                      ref={myInputRef}
                      onChange={() => handleItemChange(index, 'product_id', '')}
                      label={t('PRODUCT_NAME')}
                      className="w-full md:w-[327px] h-min"
                    />
                    <button onClick={changeToTextArea} className="h-fit mt-6">
                      <TbMenuDeep size={25} />
                    </button>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-x-2">
                <IconInput
                  disabled={params.id}
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                  }
                  label={t('QUANTITY')}
                  inputClassName="flex-wrap md:w-[151px] sm:max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  type="number"
                  disabled={item.product_id}
                  value={item.unit_price || 0}
                  //value={'٧٨٩٧٨٩٧٨٩٧٨٩٧٨٩٧٨٩٧٨٩٧٨٩'}
                  onChange={(e) => {
                    handleEnglishNumbersOnly(e);
                    const rawValue = e.target.value;
                    const numericValue = parseFloat(rawValue) || 0;
                    handleItemChange(index, 'unit_price', numericValue);
                  }}
                  label={t('PRICE')}
                  iconSrcLeft="SR"
                  inputClassName="flex-wrap md:w-[151px] sm:max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  label={t('TOTAL')}
                  inputClassName="flex-wrap md:w-[151px] sm:max-w-[151px] min-w-[80px]"
                  iconSrcLeft="SR"
                  value={currencyFormated(item.unit_price * item.quantity || 0)}
                  disabled
                />
                {!params.id && orderSchema.products.length > 1 && (
                  <TrashIcon
                    onClick={() => {
                      const updatedItems = orderSchema.products.filter(
                        (_, i) => i !== index
                      );
                      dispatch(addProduct(updatedItems));
                    }}
                    className="translate-y-[34px] cursor-pointer hover:scale-105"
                  />
                )}
              </div>
            </div>
          ))}
          {!params.id && (
            <Button
              onClick={() =>
                dispatch(
                  addProduct([
                    ...orderSchema.products,
                    {
                      product_id: '',
                      quantity: '1',
                      unit_price: '0',
                      discount_amount: 0,
                      discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
                      discount_type: 2,
                      total_price: 0,
                    },
                  ])
                )
              }
              type="button"
              className="justify-end  mb-sm"
              variant="link"
            >
              <div className="flex gap-2">
                <span className="font-semibold">{t('ADD_PRODUCT')}</span>
                <PlusIcon />
              </div>
            </Button>
          )}
          {ShowCar && (
            <div className="flex gap-x-md mt-5">
              <IconInput
                disabled={params.id}
                name="kitchen_received_at"
                // className="col-span-10 "
                label={t('CAR_TYPE')}
                inputClassName="lg:w-[240px] min-w-[120px]"
                value={orderSchema.kitchen_received_at}
                onChange={(e) =>
                  dispatch(
                    updateField({
                      field: 'kitchen_received_at',
                      value: e.target.value,
                    })
                  )
                }
                // value={formState.address}
                // inputClassName="md:col-span-5"
              />
              <IconInput
                disabled={params.id}
                name="kitchen_done_at"
                inputClassName="lg:w-[240px] min-w-[120px] mb-sm "
                label={t('CAR_PLATE')}
                value={orderSchema.kitchen_done_at}
                onChange={(e) =>
                  dispatch(
                    updateField({
                      field: 'kitchen_done_at',
                      value: e.target.value,
                    })
                  )
                }
                // value={formState.address}
              />
            </div>
          )}
          <Textarea
            disabled={params.id}
            name="kitchen_notes"
            value={orderSchema.kitchen_notes}
            onChange={(e) =>
              dispatch(
                updateField({ field: 'kitchen_notes', value: e.target.value })
              )
            }
            className="lg:w-full my-sm"
            label={t('NOTES')}
          />
        </div>
        {/* dispatch(toggleActionView(true));
            dispatch(toggleActionViewData(orderData[0])); */}
        <div className="col-span-10">
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmitOrder}
            className="w-[144px] mt-md"
          >
            {params.id ? t('CONFIRM') : t('SAVE')}
          </Button>
        </div>
      </div>

      {/* <ShopCardSummeryPQ /> */}
      {/* <ShopCardSummery /> */}
      <ShopCardSummeryCi />
    </div>
  );
};

export default CustomerForm;
