import { useEffect, useRef, useState } from 'react';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateField } from '@/store/slices/orderSchema';
import { useNavigate, useParams } from 'react-router-dom';
import PlusIcon from '@/components/Icons/PlusIcon';
import TrashIcon from '@/components/Icons/TrashIcon';
import CustomerFormEdits from './CustomerFormEdits';
import { Textarea } from '@/components/ui/textarea';
import ShopCardSummeryPQEdit from '@/components/custom/ShopCardSummery/ShopCardSummeryPQEdit';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import { useTranslation } from 'react-i18next';
import { SelectCompInput } from '@/components/custom/SelectItem/SelectCompInput';

const CustomerFormEdit = () => {
  const { t } = useTranslation();
  const allServiceOrder = createCrudService<any>('orders');
  const { data: WhoAmI } = createCrudService<any>('auth/whoami').useGetAll();
  const ShowCar = WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';

  const { useGetAll: fetchAllProducts } = createCrudService<any>(
    'menu/products?not_default=1&per_page=1000'
  );
  const { data: taxes } = createCrudService<any>('manage/taxes').useGetAll();
  const { data: settings } = createCrudService<any>('manage/settings').useGetAll();
  const { openDialog } = useGlobalDialog();

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const myInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { data: getAllPro } = fetchAllProducts();

  const { data: getOrdersById, refetch } = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );

  // Initialize orderSchema with existing order data
  useEffect(() => {
    if (getOrdersById?.data && !isInitialized && taxes?.data && settings?.data) {
      const orderData = getOrdersById.data;

      // Update customer info 
      dispatch(updateField({ field: 'customer_id', value: orderData.customer?.id || '' }));
      dispatch(updateField({ field: 'kitchen_received_at', value: orderData.kitchen_received_at || '' }));
      dispatch(updateField({ field: 'kitchen_done_at', value: orderData.kitchen_done_at || '' }));
      dispatch(updateField({ field: 'kitchen_notes', value: orderData.kitchen_notes || '' }));
      dispatch(updateField({ field: 'is_sales_order', value: 1 }));

      // Initialize products
      const products = orderData.products?.map((item: any) => ({
        product_id: item.id,
        quantity: item.pivot?.quantity || 1,
        name: item.name,
        unit_price: item.pivot?.unit_price || item.unit_price || 0,
        total_price: (item.pivot?.unit_price || item.unit_price || 0) * (item.pivot?.quantity || 1),
        kitchen_notes: item.pivot?.kitchen_notes || '',
        is_tax_included: settings?.data?.tax_inclusive_pricing,
        taxes: [
          {
            id: taxes?.data?.[0]?.id,
            rate: taxes?.data?.[0]?.rate,
            amount: 0,
          },
        ],
      })) || [];

      if (products.length > 0) {
        dispatch(addProduct(products));
      }

      setIsInitialized(true);
    }
  }, [getOrdersById?.data, isInitialized, taxes?.data, settings?.data, dispatch]);

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('confirm-sales-order', {
        order_id: params.id,
      });
      if (res.status === 200) {
        openDialog('added');
        navigate(`/zood-dashboard/corporate-invoices/edit/${params.id}`);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    try {
      const updatedOrderData = {
        kitchen_received_at: orderSchema.kitchen_received_at,
        kitchen_done_at: orderSchema.kitchen_done_at,
        kitchen_notes: orderSchema.kitchen_notes,
        products: orderSchema.products.map((product: any) => ({
          product_id: product.product_id,
          quantity: product.quantity,
          unit_price: product.unit_price,
          kitchen_notes: product.kitchen_notes || '',
          is_tax_included: product.is_tax_included,
          taxes: product.taxes,
        })),
      };

      const res = await axiosInstance.put(`orders/${params.id}`, updatedOrderData);

      if (res.status === 200) {
        openDialog('updated');
        refetch();
      }
      setSaveLoading(false);
    } catch (error) {
      setSaveLoading(false);
      console.error('Failed to save changes', error);
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
    const updatedItems = orderSchema.products.map((item: any, index: number) =>
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
          kitchen_notes: myInputRef?.current?.value || '',
          is_tax_included: settings?.data?.tax_inclusive_pricing,
          taxes: [
            {
              id: taxes?.data?.[0]?.id,
              rate: taxes?.data?.[0]?.rate,
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
              id: taxes?.data?.[0]?.id,
              rate: taxes?.data?.[0]?.rate,
              amount: !settings?.data?.tax_inclusive_pricing
                ? (productData.price * 1 || productData.price) *
                ((taxes?.data?.[0]?.rate || 0) / 100)
                : (productData.price * 1 || productData.price) *
                ((taxes?.data?.[0]?.rate || 0) /
                  (100 + taxes?.data?.[0]?.rate || 0)),
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch product data', error);
      }
    } else if (field === 'quantity') {
      const updatedProducts = orderSchema.products.map((item: any, i: number) =>
        i === index
          ? {
            ...item,
            quantity: parseInt(value) || 1,
            total_price: (parseInt(value) || 1) * item.unit_price || 0,
            taxes: [
              {
                id: taxes?.data?.[0]?.id,
                rate: taxes?.data?.[0]?.rate,
                amount: !settings?.data?.tax_inclusive_pricing
                  ? item.unit_price *
                  (parseInt(value) || 1) *
                  ((taxes?.data?.[0]?.rate || 0) / 100)
                  : item.unit_price *
                  (parseInt(value) || 1) *
                  ((taxes?.data?.[0]?.rate || 0) /
                    (100 + taxes?.data?.[0]?.rate || 0)),
              },
            ],
          }
          : item
      );
      dispatch(addProduct(updatedProducts));
    } else if (field === 'unit_price') {
      const updatedProducts = orderSchema.products.map((item: any, i: number) =>
        i === index
          ? {
            ...item,
            unit_price: value,
            total_price: value * item.quantity || 0,
            is_tax_included: settings?.data?.tax_inclusive_pricing,
            taxes: [
              {
                id: taxes?.data?.[0]?.id,
                rate: taxes?.data?.[0]?.rate,
                amount: !settings?.data?.tax_inclusive_pricing
                  ? (value * item.quantity || 0) *
                  ((taxes?.data?.[0]?.rate || 0) / 100)
                  : (value * item.quantity || 0) *
                  ((taxes?.data?.[0]?.rate || 0) /
                    (100 + taxes?.data?.[0]?.rate || 0)),
              },
            ],
          }
          : item
      );
      dispatch(addProduct(updatedProducts));
    }
  };
  return (
    <div className="mt-5 max-lg:flex-wrap flex xl:justify-between max-xl:flex-col gap-x-10">
      <div className="w-full xl:w-[500px] max-w-full">
        <div className="col-span-10 my-2 gap-y-md">
          <CustomerFormEdits />

          <div className="space-y-10 my-2">
            {orderSchema?.products?.map((item: any, index: number) => (
              <div key={index} className="my-2">
                <SelectCompInput
                  className="md:w-[327px]"
                  placeholder={t('PRODUCT_NAME')}
                  options={[...(getAllPro?.data || [])?.map((product: any) => ({
                    value: product?.id,
                    label: product?.name,
                  })), { label: item?.kitchen_notes, value: item?.product_id }]}
                  label={t('PRODUCT_NAME')}
                  ref={myInputRef}
                  onValueChange={(value) =>
                    handleItemChange(index, 'product_id', value)
                  }
                  onInputFieldChange={(value) =>
                    handleItemChange(index, 'name', value)
                  }
                  value={item?.product_id}
                />
                <div className="flex gap-x-md mt-5">
                  <IconInput
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                    label={t('QUANTITY')}
                    inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                  />
                  <IconInput
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
                        rawValue = `${parts[0]}.${parts[1]}`;
                      }

                      // Prevent leading zeros unless followed by a decimal point
                      if (
                        rawValue.startsWith('0') &&
                        rawValue[1] !== '.' &&
                        rawValue.length > 1
                      ) {
                        rawValue = rawValue.replace(/^0+/, '');
                      }

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
                  {orderSchema.products.length > 1 && (
                    <TrashIcon
                      onClick={() => {
                        const updatedItems = orderSchema.products.filter(
                          (_: any, idx: number) => idx !== index
                        );
                        dispatch(addProduct(updatedItems));
                      }}
                      className="translate-y-[34px] cursor-pointer hover:scale-105"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

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
                        id: taxes?.data?.[0]?.id,
                        rate: taxes?.data?.[0]?.rate,
                        amount: 0,
                      },
                    ],
                  },
                ])
              )
            }
            type="button"
            className="justify-end mb-sm"
            variant="link"
          >
            <div className="flex gap-2">
              <span className="font-semibold">{t('ADD_PRODUCT')}</span>
              <PlusIcon />
            </div>
          </Button>

          {ShowCar && (
            <div className="flex gap-x-md mt-5">
              <IconInput
                name="kitchen_received_at"
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
              />
              <IconInput
                name="kitchen_done_at"
                inputClassName="w-[240px] min-w-[120px] mb-sm"
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
              />
            </div>
          )}

          <Textarea
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

        <div className="col-span-10 pb-5 flex gap-3">
          <Button
            loading={saveLoading}
            disabled={saveLoading}
            onClick={handleSaveChanges}
            className="w-[144px] mt-md"
            variant="outline"
          >
            {t('SAVE')}
          </Button>
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleConfirmOrder}
            className="w-[144px] mt-md"
          >
            {t('CONFIRM')}
          </Button>
        </div>
      </div>
      <ShopCardSummeryPQEdit />
    </div>
  );
};

export default CustomerFormEdit;
