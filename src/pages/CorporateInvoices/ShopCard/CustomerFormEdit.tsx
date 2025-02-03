import { useEffect, useRef, useState } from 'react';
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
import {
  toggleActionView,
  toggleActionViewData,
} from '@/store/slices/toggleAction';
import { TbMenuDeep } from 'react-icons/tb';
import { GrMenu } from 'react-icons/gr';
import { currencyFormated } from '../../../utils/currencyFormated';
const CustomerFormEdit = () => {
  const { t } = useTranslation();
  const params = useParams();
  const allServiceOrder = createCrudService<any>('orders');
  const orderPayment = createCrudService<any>('order-payments');
  const { data: WhoAmI } = createCrudService<any>('auth/whoami').useGetAll();
  const ShowCar = WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';
  // const ShowCar = true;

  const { mutate, isLoading: loadingOrder } = orderPayment.useCreate();
  const Data = useSelector((state: any) => state.toggleAction.data);
  const [getOrder, setGetOrder] = useState<any>(Data);
  console.log({ Data, getOrder });
  useEffect(() => {
    axiosInstance.get(`/orders?filter[id]=${params.id}`).then((res) => {
      setGetOrder(res?.data?.data[0]);
    });
  }, []);
  const payment = getOrder?.payment_status;

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myInputRef = useRef(null);
  const { showToast } = useToast();
  const [isTextArea, setIsTextArea] = useState(false);

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
      if (payment !== 'fully') {
        const holder = [...orderSchema.payments];
        holder.pop();
        // if (!holder) return;

        const newHolder = holder.filter(
          (ele) => ele.business_date === undefined
        );
        const newHolder2 = holder.filter((ele) => ele.business_date);

        const holder2 = newHolder.map((ele) => ({
          ...ele,
          business_date: ele.business_date || new Date().toISOString(),
          added_at: ele.added_at || new Date().toISOString(),
        }));
        holder2.push(...newHolder2);
        if (holder2.length === 0) {
          showToast({
            description: 'الرجاء ادخال المبلغ',
            duration: 4000,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        await mutate(
          {
            order_id: params.id,
            payment_data: holder2,
          },
          {
            onSuccess: async (data) => {
              const res = await axiosInstance.get(
                `/orders?filter[id]=${data.data[0].order_id}`
              );
              const orderData = res?.data?.data;
              navigate('/zood-dashboard/corporate-invoices');
              dispatch(toggleActionView(true));
              dispatch(toggleActionViewData(orderData[0]));
              setLoading(false);
            },
            onError: () => setLoading(false),
          }
        );
      } else setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to submit order', error);
    }
  };

  const [loading, setLoading] = useState(false);

  const changeToTextArea = () => {
    setIsTextArea(!isTextArea);
  };
  // const n = item?.pivot?.unit_price * item?.pivot?.quantity || 0;
  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-4 space-y-5">
      <div className=" w-full xl:w-[550px] max-w-full">
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />
          {getOrder?.products.map((item, index) => (
            <div key={index} className="flex flex-wrap">
              <div className="flex md:w-fit max-md:flex-grow gap-x-2 mb-5">
                <IconInput
                  disabled={params.id}
                  className="flex-grow w-full md:w-[327px] "
                  placeholder={t('PRODUCT_NAME')}
                  label={t('PRODUCT_NAME')}
                  value={
                    item.name === 'sku-zood-20001'
                      ? item?.pivot?.kitchen_notes
                      : item?.name
                  }
                />
                {/* {!isTextArea ? (
                  <>
                    <IconInput
                      disabled={params.id}
                      className="flex-grow w-full md:w-[327px] "
                      placeholder={t('PRODUCT_NAME')}
                      label={t('PRODUCT_NAME')}
                      value={
                        item.name === 'sku-zood-20001'
                          ? item?.pivot?.kitchen_notes
                          : item?.name
                      }
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
                      disabled={params.id}
                      placeholder="وصف المنتج"
                      defaultValue={
                        item.name === 'sku-zood-20001'
                          ? item?.pivot?.kitchen_notes
                          : item?.name
                      }
                      label={t('PRODUCT_NAME')}
                      className="w-full md:w-[327px] h-min"
                    />
                    <button onClick={changeToTextArea} className="h-fit mt-6">
                      <TbMenuDeep size={25} />
                    </button>
                  </>
                )} */}
              </div>
              <div className="flex gap-x-md">
                <IconInput
                  disabled
                  //       value={item?.pivot?.quantity}
                  value={currencyFormated(item?.pivot?.quantity)}
                  label={t('QUANTITY')}
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  disabled
                  value={currencyFormated(item?.pivot?.unit_price || 0)}
                  // value={item?.pivot?.unit_price || 0}
                  label={t('PRICE')}
                  iconSrcLeft="SR"
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  label={t('TOTAL')}
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                  iconSrcLeft="SR"
                  // value={item?.pivot?.unit_price * item?.pivot?.quantity || 0}
                  value={currencyFormated(
                    item?.pivot?.unit_price * item?.pivot?.quantity || 0
                  )}
                  disabled
                />
              </div>
            </div>
          ))}
          {ShowCar && (
            <div className="flex gap-x-md mt-5">
              <IconInput
                disabled={params.id}
                name="kitchen_received_at"
                // className="col-span-10 "
                label={t('CAR_TYPE')}
                inputClassName="w-[240px] min-w-[120px]"
                value={getOrder?.kitchen_received_at || ''}
                // value={formState.address}
                // inputClassName="md:col-span-5"
              />
              <IconInput
                disabled={params.id}
                name="kitchen_done_at"
                inputClassName="w-[240px] min-w-[120px] mb-sm "
                label={t('CAR_PLATE')}
                value={getOrder?.kitchen_done_at || ''}
              />
            </div>
          )}
          <Textarea
            disabled={params.id}
            name="kitchen_notes"
            value={getOrder?.kitchen_notes || ''}
            className="w-full my-sm"
            label={t('NOTES')}
          />
        </div>
        {payment !== 'fully' && (
          <div className="col-span-10">
            <Button
              loading={loading}
              disabled={loading}
              onClick={handleSubmitOrder}
              className="w-[144px] mt-md"
            >
              حفظ
            </Button>
          </div>
        )}
      </div>

      {/* <ShopCardSummeryPQ /> */}
      {/* <ShopCardSummery /> */}
      <ShopCardSummeryCi payment={payment} />
    </div>
  );
};

export default CustomerFormEdit;
