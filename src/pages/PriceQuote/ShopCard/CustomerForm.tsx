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
import CustomerForms from './CustomerForms';
import { Textarea } from '@/components/ui/textarea';
import { SelectCompInput } from '@/components/custom/SelectItem/SelectCompInput';
import { useTranslation } from 'react-i18next';
import CustomInputDate from '@/components/custom/CustomInputDate';

const CustomerForm = () => {
  const allService = createCrudService<any>('manage/customers?perPage=100000');
  const allServiceOrder = createCrudService<any>('orders?per_page=100000');
  const { t } = useTranslation();

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { data: settings } =
    createCrudService<any>('manage/settings').useGetAll();
  const { useGetAll: fetchAllProducts } = createCrudService<any>(
    'menu/products?not_default=1&per_page=1000'
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

  const [loading, setLoading] = useState(false);
  const { data: getAllPro } = fetchAllProducts();

  dispatch(updateField({ field: 'is_sales_order', value: 1 }));
  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      if (!params.id) {
        const updatedOrderSchema = {
          ...orderSchema,
          products: orderSchema.products.map((product) => ({
            ...product,
            product_id: product.product_id
              ? product.product_id
              : defaultProduct?.data[0]?.id,
            name: 'sku-zood-20001',
          })),
        };
        await mutate(updatedOrderSchema, {
          onSuccess: () => {
            setLoading(false);
            navigate('/zood-dashboard/price-quote');
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
    taxes: any;
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

  const handleItemChange = async (index: number, field: string, value: any) => {
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
          is_tax_included: settings?.data?.tax_inclusive_pricing,
          taxes: [
            {
              id: taxes?.data[0]?.id,
              rate: taxes?.data[0]?.rate,
              amount: 0,
            },
          ],
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
          total_price: productData.price * 1 || productData.price,
          is_tax_included: settings?.data?.tax_inclusive_pricing,
          taxes: [
            {
              id: taxes?.data[0]?.id,
              rate: taxes?.data[0]?.rate,
              amount: !settings?.data?.tax_inclusive_pricing
                ? (productData.price * 1 || productData.price) *
                  ((taxes?.data[0]?.rate || 0) / 100)
                : (productData.price * 1 || productData.price) *
                  ((taxes?.data[0]?.rate || 0) /
                    (100 + taxes?.data[0]?.rate || 0)),
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch product data', error);
      }
    } else if (field === 'quantity') {
      const updatedProducts = orderSchema.products.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: parseInt(value) || 1,
              total_price: (parseInt(value) || 1) * item.unit_price || 0,
              taxes: [
                {
                  id: taxes?.data[0]?.id,
                  rate: taxes?.data[0]?.rate,
                  amount: !settings?.data?.tax_inclusive_pricing
                    ? item.unit_price *
                      (parseInt(value) || 1) *
                      ((taxes?.data[0]?.rate || 0) / 100)
                    : item.unit_price *
                      (parseInt(value) || 1) *
                      ((taxes?.data[0]?.rate || 0) /
                        (100 + taxes?.data[0]?.rate || 0)),
                },
              ],
            }
          : item
      );
      dispatch(addProduct(updatedProducts));
    } else if (field === 'unit_price') {
      const updatedProducts = orderSchema.products.map((item, i) =>
        i === index
          ? {
              ...item,
              unit_price: value,
              total_price: value * item.quantity || 0,
              is_tax_included: settings?.data?.tax_inclusive_pricing,
              taxes: [
                {
                  id: taxes?.data[0]?.id,
                  rate: taxes?.data[0]?.rate,
                  amount: !settings?.data?.tax_inclusive_pricing
                    ? (value * item.quantity || 0) *
                      ((taxes?.data[0]?.rate || 0) / 100)
                    : (value * item.quantity || 0) *
                      ((taxes?.data[0]?.rate || 0) /
                        (100 + taxes?.data[0]?.rate || 0)),
                },
              ],
            }
          : item
      );
      dispatch(addProduct(updatedProducts));
    }
  };
  const [businessDate, setBusinessDate] = useState(new Date().toISOString());

  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-4 space-y-5">
      <div className="w-full xl:w-[500px] max-w-full">
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />

          {!params.id && (
            <div className="my-md space-y-2">
              <p className="self-start text-sm font-medium text-right text-secText mb-xs">
                {t('DATE')}
              </p>
              <CustomInputDate
                date={businessDate}
                onSelect={(date) => {
                  // setBusinessDate(date);
                  const now = new Date();
                  const selectedDate = new Date(date);
                  const dateWithCurrentTime = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds(),
                    now.getMilliseconds()
                  );

                  const fullTimestamp = dateWithCurrentTime.toISOString();
                  setBusinessDate(fullTimestamp);
                  dispatch(
                    updateField({
                      field: 'business_date',
                      value: fullTimestamp,
                    })
                  );
                }}
                className="w-full lg:w-[21vw]"
              />
            </div>
          )}
          {orderSchema.products.map((item, index) => (
            <div key={index} className="my-2">
              <SelectCompInput
                disabled={params.id}
                className="md:w-[327px]  "
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
              <div className="flex gap-x-md mt-5">
                <IconInput
                  disabled={params.id}
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', e.target.value)
                  }
                  label={t('QUANTITY')}
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  // disabled={item.product_id}
                  value={item.unit_price || 0}
                  onChange={(e) => {
                    let rawValue = e.target.value;

                    // Normalize Arabic-Hindi numerals to Western Arabic numerals
                    rawValue = rawValue.replace(/[\u0660-\u0669]/g, (d) =>
                      String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48)
                    );

                    // Allow only numbers and a single decimal point
                    rawValue = rawValue.replace(/[^0-9.]/g, '');

                    // Prevent multiple decimal points
                    const parts = rawValue.split('.');
                    if (parts.length > 2) {
                      rawValue = `${parts[0]}.${parts[1]}`; // Keep only the first two parts
                    }

                    // Prevent leading zeros unless followed by a decimal point
                    if (
                      rawValue.startsWith('0') &&
                      rawValue[1] !== '.' &&
                      rawValue.length > 1
                    ) {
                      rawValue = rawValue.replace(/^0+/, '');
                    }

                    // Update the value
                    handleItemChange(index, 'unit_price', rawValue);
                  }}
                  label={t('PRICE')}
                  iconSrcLeft="SR"
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  label={t('TOTAL')}
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                  iconSrcLeft="SR"
                  value={item.unit_price * item.quantity || 0}
                  disabled
                />
                {!params.id && orderSchema.products.length > 1 && (
                  <TrashIcon
                    onClick={() => {
                      const updatedItems = orderSchema.products.filter(
                        (el) => el.index !== index
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
                      quantity: 1,
                      unit_price: '0',
                      discount_amount: 0,
                      discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
                      discount_type: 2,
                      total_price: 0,
                      is_tax_included: settings?.data?.tax_inclusive_pricing,
                      taxes: [
                        {
                          id: taxes?.data[0]?.id,
                          rate: taxes?.data[0]?.rate,
                          amount: 0,
                        },
                      ],
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
                inputClassName="w-[240px] min-w-[120px]"
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
                inputClassName="w-[240px] min-w-[120px] mb-sm "
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
            className="w-full my-sm"
            label={t('NOTES')}
          />
        </div>
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
      <ShopCardSummeryPQ />
      {/* <ShopCardSummery /> */}
    </div>
  );
};

export default CustomerForm;
