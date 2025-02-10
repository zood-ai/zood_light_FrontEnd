import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
import XIcons from '@/components/Icons/XIcons';
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

const CustomerForm = forwardRef(
  ({ newCustomer, setNewCustomer, setLoading, loading }: any, ref) => {
    const allService = createCrudService<any>(
      'manage/customers?perPage=100000'
    );
    const allServiceOrder = createCrudService<any>('orders?per_page=100000');
    const params = useParams();
    const { t } = useTranslation();
    const allServiceOrderPay =
      createCrudService<any>('order-payments').useCreate();
    const orderSchema = useSelector((state: any) => state.orderSchema);
    const navigate = useNavigate();
    const location = useLocation();
    const [showAlert, setShowAlert] = useState(false);
    const [nextPath, setNextPath] = useState<string | null>(null);
    const [reload, setReload] = useState(false);
    const [showCustomer, setShowCustomer] = useState(params.id ? false : true);
    const [newCustomerData, setNewCustomerData] = useState<any>({
      name: '',
      phone: '',
      address: '',
      taxNum: '',
      coTax: '',
    });

    const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
    const { mutate: mutateOrderPay } = allServiceOrderPay;

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
    const [formState, setFormState] = useState(initialValue);
    const dispatch = useDispatch();
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
    const [orderSubmited, setOrderSubmited] = useState<any>(false);
    const cardItemValue = useSelector((state: any) => state.cardItems.value);
    const holder = useSelector(
      (state: any) => state.orderSchema.tax_exclusive_discount_amount
    );
    const { showToast } = useToast();
    useImperativeHandle(ref, () => ({
      submitOrder,
    }));

    const submitOrder = async ({ newCustomer }) => {
      if (newCustomer) {
        console.log({ newCustomerData, orderSchema });
      }
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
          let customer;
          if (newCustomer) {
            customer = await axiosInstance.post('/manage/customers', {
              ...newCustomerData,
              tax_registration_number: newCustomerData.taxNum,
              vat_registration_number: newCustomerData.coTax,
            });
            handleInputChangex('customer_id', customer?.data?.data?.id);
          }
          setTimeout(async () => {
            console.log(customer?.data?.data?.id);

            const res = await mutate(
              {
                ...orderSchema,
                customer_id: newCustomer
                  ? customer?.data?.data?.id
                  : orderSchema?.customer_id,
              },
              {
                onSuccess: async (data) => {
                  setOrderSubmited(true);
                  const res = await axiosInstance.get(
                    `/orders?filter[id]=${data.data.id}`
                  );
                  const orderData = res?.data?.data;
                  navigate(`/zood-dashboard/individual-invoices`);
                  dispatch(toggleActionView(true));
                  dispatch(toggleActionViewData(orderData[0]));
                  setLoading(false);
                },
                onError: (error) => {
                  setLoading(false);
                },
              }
            );
          }, 500);
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
    useEffect(() => {
      if (!setNewCustomer) return;
      if (!showCustomer) setNewCustomer(false);
    }, [showCustomer]);
    console.log({ newCustomerData, orderSchema });
    return (
      <div className="mt-5 flex xl:justify-between flex-col gap-x-4">
        {!params.id && !orderSubmited && (
          <Prompt
            when={true}
            message="هل أنت متأكد أنك تريد الخروج؟ لن تحفظ البيانات"
          />
        )}
        {!params.id && (
          <div className="w-full">
            {showCustomer ? (
              <button
                className="text-main flex"
                onClick={() => {
                  setShowCustomer(false);
                }}
              >
                <span>{t('ADD_CUSTOMER')}</span>
              </button>
            ) : (
              <div className="flex justify-between">
                <button
                  className="text-destructive mb-3 flex items-center gap-2"
                  onClick={() => {
                    setShowCustomer(true);
                  }}
                >
                  <XIcons color="#EF4444" /> <span>{t('CANCEL_ADD')}</span>
                </button>
                {!params.id && (
                  <>
                    {!newCustomer ? (
                      <button
                        className="text-main mb-3 flex items-center gap-2"
                        onClick={() => {
                          setNewCustomer(true);
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 1V11"
                            stroke="#7272F6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="bevel"
                          />
                          <path
                            d="M11 6H1"
                            stroke="#7272F6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="bevel"
                          />
                        </svg>
                        <span>عميل جديد</span>
                      </button>
                    ) : (
                      <button
                        className="text-main mb-3 flex items-center gap-2"
                        onClick={() => {
                          setNewCustomer(false);
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5352 11.5356L4.46409 4.46458"
                            stroke="#7272F6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="bevel"
                          />
                          <path
                            d="M4.46484 11.5356L11.5359 4.46458"
                            stroke="#7272F6"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="bevel"
                          />
                        </svg>
                        <span>عميل حالي</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {((params.id && orderSchema?.customer_id) || !params.id) &&
          !showCustomer &&
          (newCustomer ? (
            <div className="flex flex-wrap gap-x-5 gap-y-5 h-fit w-full max-w-full">
              <div className="flex gap-3 w-full">
                <IconInput
                  name="CUSTOMER_NAME"
                  className="w-1/2 flex-grow"
                  label={t('CUSTOMER_NAME')}
                  value={newCustomerData.name}
                  onChange={(e) => {
                    setNewCustomerData((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                />
                <IconInput
                  name="PHONE"
                  className="w-1/2 flex-grow"
                  label={t('PHONE')}
                  iconSrc={callIcon}
                  value={newCustomerData.phone}
                  onChange={(e) => {
                    setNewCustomerData((prevState) => ({
                      ...prevState,
                      phone: e.target.value,
                    }));
                  }}
                />
              </div>
              <IconInput
                name="STREAT_NAME"
                className=" md:col-span-4 min-w-full flex-grow"
                label={t('STREAT_NAME')}
                value={newCustomerData.address}
                onChange={(e) => {
                  setNewCustomerData((prevState) => ({
                    ...prevState,
                    address: e.target.value,
                  }));
                }}
              />
              <div className="flex gap-3 w-full">
                <IconInput
                  name="TAX_REGISTRATION_NUMBER"
                  className="w-1/2"
                  label={t('TAX_REGISTRATION_NUMBER')}
                  value={newCustomerData.TAX_REGISTRATION_NUMBER}
                  onChange={(e) => {
                    setNewCustomerData((prevState) => ({
                      ...prevState,
                      taxNum: e.target.value,
                    }));
                  }}
                />
                <IconInput
                  name="ANOTHER_ID"
                  className="w-1/2"
                  label={t('ANOTHER_ID')}
                  value={newCustomerData.coTax}
                  onChange={(e) => {
                    setNewCustomerData((prevState) => ({
                      ...prevState,
                      coTax: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-5 gap-y-5 h-fit w-full max-w-full">
              <div className="flex gap-3 w-full">
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
                  className="w-1/2 flex-grow h-[40px]"
                  value={orderSchema?.customer_id}
                  disabled={params.id}
                />

                <IconInput
                  disabled
                  name="name"
                  className="w-1/2 flex-grow"
                  label={t('PHONE')}
                  iconSrc={callIcon}
                  value={formState.phone}
                  onChange={null}
                />
              </div>
              <IconInput
                disabled
                name={formState.name}
                className=" md:col-span-4 min-w-full flex-grow"
                label={t('STREAT_NAME')}
                value={formState.address}
                onChange={null}
              />
              <div className="flex gap-3 w-full">
                <IconInput
                  disabled
                  className="w-1/2"
                  label={t('TAX_REGISTRATION_NUMBER')}
                  value={formState.tax_registration_number}
                  onChange={null}
                />
                <IconInput
                  disabled
                  className="w-1/2"
                  label={t('ANOTHER_ID')}
                  value={formState.vat_registration_number}
                  onChange={null}
                />
              </div>
            </div>
          ))}
        <ShopCardSummery />
        <FastAddActionsCustomerPQ
          setInvoice={() => {}}
          isOpen={fastActionBtn}
          onClose={() => setFastActionBtn(false)}
        />
      </div>
    );
  }
);

export default CustomerForm;
