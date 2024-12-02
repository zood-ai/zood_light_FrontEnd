import React, { useEffect, useState, useCallback, useRef } from 'react';
import callIcon from '/icons/call.svg';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';
import { Button } from '@/components/custom/button';
import { ShopCardSummery } from '@/components/custom/ShopCardSummery';
import createCrudService from '@/api/services/crudService';
import axiosInstance from '@/api/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import {
  addProduct,
  updateField,
  updatePayment,
} from '@/store/slices/orderSchema';
import {
  useNavigate,
  useParams,
  useLocation,
  useBeforeUnload,
  useBlocker,
} from 'react-router-dom';
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import axios from 'axios';
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { useToast } from '@/components/custom/useToastComp';
import PlusIcon from '@/components/Icons/PlusIcon';
import FastAddActionsCustomerPQ from '@/components/FastAddActionsCustomerPQ';
import { useTranslation } from 'react-i18next';

function usePrompt(message, { beforeUnload } = {}) {
  const blocker = useBlocker(
    useCallback(
      () => (typeof message === 'string' ? !window.confirm(message) : false),
      [message]
    )
  );
  const prevState = useRef(blocker.state);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    prevState.current = blocker.state;
  }, [blocker]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (beforeUnload && typeof message === 'string') {
          event.preventDefault();
          event.returnValue = message;
        }
      },
      [message, beforeUnload]
    ),
    { capture: true }
  );
}

function Prompt({ when, message, ...props }) {
  usePrompt(when ? message : false, props);
  return null;
}

const CustomerForm = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const { t } = useTranslation();
  const allServiceOrderPay =
    createCrudService<any>('order-payments').useCreate();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [reload, setReload] = useState(false);

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
  const dispatch = useDispatch();
  const params = useParams();
  const [fastActionBtn, setFastActionBtn] = useState(false);

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
  const holder = useSelector(
    (state: any) => state.orderSchema.tax_exclusive_discount_amount
  );
  const { showToast } = useToast();

  const submitOrder = async () => {
    setLoading(true);

    const totalPrice = orderSchema.total_price;
    const totalPayed = orderSchema.payments.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    if (totalPayed < totalPrice) {
      showToast({
        description: 'الرجاء ادخال المبلغ كاملا',
        duration: 4000,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      if (params.id) {
        try {
          const res = await axiosInstance.get(`/orders/${params.id}`);
          const orderData = res?.data?.data;
          orderData, 'orderData';

          if (orderData?.payments?.length < orderSchema?.payments?.length) {
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
                business_date: new Date().toISOString(),
                meta: 'well done',
                added_at: new Date().toISOString(),
              })),
            };

            await mutateOrderPay(newPayments, {
              onSuccess: (data) => {
                setLoading(false);
                navigate(`/zood-dashboard/individual-invoices`);
              },
            });
          }
          dispatch(toggleActionView(true));
          dispatch(toggleActionViewData(orderData));
        } catch (error) {
          console.error('Error fetching or processing order:', error);
          setLoading(false);
        } finally {
          navigate(`/zood-dashboard/individual-invoices`);
        }
      } else {
        const res = await mutate(orderSchema, {
          onSuccess: async (data) => {
            setLoading(false);
            const res = await axiosInstance.get(
              `/orders?filter[id]=${data.data.id}`
            );
            const orderData = res?.data?.data;
            navigate(`/zood-dashboard/individual-invoices`);
            dispatch(toggleActionView(true));
            dispatch(toggleActionViewData(orderData[0]));
          },
          onError: (error) => {
            setLoading(false);
          },
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleInputChangex('customer_id', orderSchema?.customer_id);
  }, [orderSchema?.customer_id]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      setShowAlert(true);
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleCancel = () => {
    setShowAlert(false);
    setNextPath(null);
  };

  const handleOk = () => {
    setShowAlert(false);
    navigate(nextPath!);
  };
  useEffect(() => {
    if (reload) {
      window.location.reload();
    }
  }, [reload]);
  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-4">
      {!params.id && (
        <Prompt
          when={true}
          message="هل أنت متأكد أنك تريد الخروج؟ لن تحفظ البيانات"
        />
      )}
      <div className="flex flex-wrap gap-x-5 gap-y-5 h-fit w-full xl:w-1/2">
        <CustomSearchInbox
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
          label={t('CUSTOMER_NAME')}
          className=" md:col-span-4 min-w-[327px] flex-grow"
          value={orderSchema?.customer_id}
          disabled={params.id}
        />
        {!params.id && (
          <div className="flex-grow mt-auto">
            <Button
              onClick={() => {
                setFastActionBtn(true);
              }}
              type="button"
              variant={'link'}
            >
              <div className="flex gap-2">
                <span className="font-semibold">اضافة عميل جديد</span>
                <span>
                  <PlusIcon />
                </span>
              </div>
            </Button>
          </div>
        )}
        <IconInput
          disabled
          name="name"
          className=" md:col-span-4 min-w-full flex-grow"
          label="رقم العميل"
          iconSrc={callIcon}
          value={formState.phone}
          onChange={null}
        />
        <IconInput
          disabled
          name={formState.name}
          className=" md:col-span-4 min-w-full flex-grow"
          label="اسم الشارع"
          value={formState.address}
          onChange={null}
        />
        <IconInput
          disabled
          className=" md:col-span-4 min-w-full flex-grow"
          label="رقم تسجيل ضريبة القيمة المضافة"
          value={formState.tax_registration_number}
          onChange={null}
        />
        <IconInput
          disabled
          className=" md:col-span-4 min-w-full flex-grow"
          label="معرف اخر"
          value={formState.vat_registration_number}
          onChange={null}
        />

        <div className=" mt-5 max-xl:hidden w-full">
          <CheckboxWithText
            label="اضافة التقرير الي Zatca"
            checked={formState.addToZatca}
            onChange={(e) => handleInputChange('addToZatca', e.target.checked)}
          />
        </div>
        <div className=" mt-5 max-xl:hidden">
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
      <div className=" mt-5 xl:hidden">
        <CheckboxWithText
          label="اضافة التقرير الي Zatca"
          checked={formState.addToZatca}
          onChange={(e) => handleInputChange('addToZatca', e.target.checked)}
        />
      </div>
      <div className=" mt-5 xl:hidden">
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
      <ShopCardSummery />
      <FastAddActionsCustomerPQ
        setInvoice={() => {}}
        isOpen={fastActionBtn}
        onClose={() => setFastActionBtn(false)}
      />
      {showAlert && (
        <div className="alert">
          <p>Data is not saved. Are you sure you want to leave?</p>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleOk}>OK</button>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;
