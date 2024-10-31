import React, { useEffect, useState } from 'react';
import callIcon from '/icons/call.svg';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';
import { Button } from '@/components/custom/button';
import { ShopCardSummery } from '@/components/custom/ShopCardSummery';
import createCrudService from '@/api/services/crudService';
import axiosInstance from '@/api/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateField } from '@/store/slices/orderSchema';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { on } from 'events';
import { Textarea } from '@/components/ui/textarea';
import PlusIcon from '@/components/Icons/PlusIcon';
import TrashIcon from '@/components/Icons/TrashIcon';
import ShopCardSummeryPQ from '@/components/custom/ShopCardSummery/ShopCardSummeryPQ';
import { setCardItem } from '@/store/slices/cardItems';

const CustomerForm = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const allServiceOrderPay =
    createCrudService<any>('order-payments').useCreate();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  let navigate = useNavigate();

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
  const { mutate: mutateOrderPay } = allServiceOrderPay;

  const { useGetAll } = allService;
  const [loading, setLoading] = useState(false);

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
  const [formState, setFormState] = useState(initialValue);
  let dispatch = useDispatch();
  let params = useParams();
  const handleInputChange = (field: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };
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
  const cardItemValue = useSelector((state: any) => state.cardItems.value);

  const submitOrder = async () => {
    // const products = cardItemValue.map((item: any) => ({
    //   product_id: item.id || '',
    //   quantity: item.qty || 0,
    //   unit_price: item.price || 0,
    //   total_price: item.price * item.qty || 0,
    //   discount_amount: 0,
    //   discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
    //   discount_type: 2,
    // }));
    // dispatch(addProduct(products));
    console.log(orderSchema, 'orderSchema');

    try {
      setLoading(true);
      if (params.id) {
        console.log(1, '1');

        try {
          const res = await axiosInstance.get(`/orders/${params.id}`);
          const orderData = res?.data?.data;
          console.log(orderData, 'orderData');

          if (orderData?.payments?.length < orderSchema?.payments?.length) {
            console.log(2, '2');
            const newData = orderSchema?.payments.slice(
              orderData?.payments.length
            );
            const newPayments = {
              order_id: params.id,
              payment_data: newData.map((item: any) => ({
                order_id: params.id,
                payment_method_id: item.payment_method_id,
                amount: item.amount,
                tendered: 2,
                tips: 20,
                business_date: new Date(),
                meta: 'well done',
                added_at: new Date(),
              })),
            };

            await mutateOrderPay(newPayments, {
              onSuccess: (data) => {
                setLoading(false);
                navigate(`/zood-dashboard/price-quote`);
                console.log(data, 'data');
              },
            });
          }
        } catch (error) {
          console.error('Error fetching or processing order:', error);
          setLoading(false);
        }
      }
      if (!params.id) {
        await mutate(orderSchema, {
          onSuccess: (data) => {
            setLoading(false);
            navigate(`/zood-dashboard/price-quote`);
            console.log(data, 'data');
          },
          onError: (error) => {
            setLoading(false);
          },
        });
      }
      // const res = await axiosInstance.post('orders', orderSchema);
      // console.log(res, 'res');
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
    }
  };
  useEffect(() => {
    handleInputChangex('customer_id', orderSchema?.customer_id);
  }, [orderSchema?.customer_id]);
  const [items, setItems] = useState([
    {
      qty: '',
      price: '',
      id: '',
      itemDescription: '',
    },
  ]);
  const { useGetAll: useGetAllPro } = createCrudService<any>(
    'menu/products?not_default=1'
  );
  const { data: getAllPro } = useGetAllPro();
  const processProducts = ({ updatedItems = [] }: any) => {
    const products = updatedItems.map((item) => ({
      product_id: item.id || '',
      quantity: item.qty || 0,
      unit_price: item.price || 0,
      discount_amount: 0,
      discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
      discount_type: 2,
      total_price: Number(item.price) * Number(item.qty) || 0,
    }));

    dispatch(setCardItem(updatedItems));
  };
  const updateCardItem = (newItem: {
    id?: string;
    qty: number;
    name?: string;
    price?: number;
    index: number;
  }) => {
    const updatedItems = cardItemValue.map((item, index) => {
      if (index === newItem.index) {
        return {
          ...item,
          qty: item.qty,
          name: newItem.name,
          price: newItem.price,
        };
      }
      return item;
    });

    // If newItem.index is out of bounds, it means we should add it as a new item
    if (newItem.index >= cardItemValue.length) {
      dispatch(setCardItem([...updatedItems, newItem]));
    } else {
      dispatch(setCardItem(updatedItems));
    }
  };

  const handleItemChange = async (
    index: number,
    field: string,
    value: string
  ) => {
    let indexPrice = 0;
    let indexName = '0';
    if (field === 'id') {
      const res = await axiosInstance
        .get(`/menu/products/${value}`)
        .then((res) => {
          const customerData = res?.data?.data;
          console.log(customerData, 'customerData');

          const updatedItems = [...items];
          updatedItems[index]['price'] = customerData.price;
          updatedItems[index]['id'] = value;
          updatedItems[index]['qty'] = '1';
          indexPrice = customerData.price;
          indexName = customerData.name;
          updateCardItem({
            index,
            id: value,
            qty: 1,
            name: customerData.name,
            price: customerData.price,
          });
          setItems(updatedItems);
        });
    }
    if (field === 'qty') {
      const updatedItems = items[index];
       updateCardItem({
         index,
         id: updatedItems.id,
         name: indexName,
         price: indexPrice,
         qty: Number(value)
      });
      const newItems = [...items];
      newItems[index][field] = value;
      setItems(newItems);
    }
  };
  return (
    <div className="  grid-cols-1 md:grid-cols-3 gap-0 self-stretch mt-5 flex justify-between">
      <div className="  col-span-3 md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-x-3xl gap-y-0">
        <SelectComp
          options={allData?.data?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          placeholder="Select Customer"
          onValueChange={(value) => {
            if (params.id) {
              return;
            } else {
              handleInputChangex('customer_id', value);
            }
          }}
          label="اسم العميل"
          className="col-span-10 md:col-span-4 md:w-[21vw]"
          value={orderSchema?.customer_id}
          disabled={params.id}
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
          className="col-span-10 md:col-span-4 md:w-[21vw]"
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

        <div className="col-span-10 my-2">
          {items?.map((item, index) => (
            <>
              <div className="grid grid-cols-1 md:flex gap-md  ">
                <SelectComp
                  className=" w-[220px] min-w-[120px] max-w-[220px] "
                  placeholder="اسم الصنف"
                  options={getAllPro?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                    // item_id: item.item_id,
                  }))}
                  onValueChange={(value) =>
                    handleItemChange(index, 'id', value)
                  }
                  label="اسم الصنف"
                  value={items[index]?.id}
                />
                <IconInput
                  value={items[index].qty}
                  onChange={(e) =>
                    handleItemChange(index, 'qty', e.target.value)
                  }
                  label="الكمية"
                  inputClassName="w-[117px] max-w-[117px] min-w-[80px]   "
                />
                <IconInput
                  onChange={(e) =>
                    handleItemChange(index, 'total', e.target.value)
                  }
                  label="السعر"
                  inputClassName="w-[138px] max-w-[138px] min-w-[80px]   "
                  iconSrcLeft={'SR'}
                  value={items[index].price}
                  disabled
                />
                {items.length > 1 && (
                  <>
                    <div
                      onClick={() => {
                        const newItems = [...items];
                        newItems.splice(index, 1);
                        setItems(newItems);
                      }}
                      className="translate-y-[34px] cursor-pointer hover:scale-105"
                    >
                      <TrashIcon />
                    </div>
                  </>
                )}
              </div>
              <Textarea
                name="itemDescription"
                value={items[index].itemDescription}
                onChange={(e) =>
                  handleItemChange(index, 'itemDescription', e.target.value)
                }
                className="w-[499px] my-2"
                label=" وصف الصنف"
              />
            </>
          ))}
          <Button
            onClick={() => {
              setItems(() => {
                return [
                  ...items,
                  {
                    id: '',
                    qty: '',
                    price: '',
                    itemDescription: '',
                  },
                ];
              });
            }}
            type="button"
            className=" justify-end   "
            variant={'link'}
          >
            <div className="flex gap-2">
              <span>
                <PlusIcon />
              </span>
              <span className="font-semibold">اضافة صنف جديد</span>
            </div>
          </Button>
        </div>
        {/* <div className='flex'> */}
        <div className="col-span-10">
          <CheckboxWithText
            label="اضافة التقرير الي Zatca"
            checked={formState.addToZatca}
            onChange={(e) => handleInputChange('addToZatca', e.target.checked)}
          />
        </div>
        <div className="col-span-10">
          <Button
            dir="ltr"
            loading={loading}
            disabled={loading}
            onClick={submitOrder}
            className="w-[144px] mt-md"
          >
            حفظ
          </Button>
        </div>
      </div>
      {/* <div className='col-span-1 max-w-[502px] place-self-end self-baseline bg-red-200 '> */}

      <ShopCardSummeryPQ />
      {/* </div> */}
    </div>
  );
};

export default CustomerForm;
