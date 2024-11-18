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

const CustomerFormEdit = () => {
  const params = useParams();
  const allServiceOrder = createCrudService<any>('orders');
  const orderPayment = createCrudService<any>('order-payments');

  const { mutate, isLoading: loadingOrder } = orderPayment.useCreate();
  const getOrder = allServiceOrder.useGetById(params.id);
  const payment = getOrder?.data?.data?.payment_status;
  console.log(payment, params.id);

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myInputRef = useRef(null);
  const { showToast } = useToast();

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    const totalPrice = orderSchema.total_price;
    const totalPayed = orderSchema.payments.reduce(
      (acc, item) => acc + item.amount,
      0
    );
    // if (totalPayed < totalPrice) {
    //   showToast({
    //     description: 'الرجاء ادخال المبلغ كاملا',
    //     duration: 4000,
    //     variant: 'destructive',
    //   });
    //   setLoading(false);
    //   return;
    // } else 
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
        const myPayments = {...orderSchema.payments}
        const holder = Object.values(myPayments)
        holder.pop();
        console.log(holder);
        if(!holder)return;
        await mutate(
          {
            order_id: params.id,
            payment_data: holder,
          },
          {
            onSuccess: () => {
              setLoading(false);
              navigate('/zood-dashboard/corporate-invoices');
            },
            onError: () => setLoading(false),
          }
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to submit order', error);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-4 space-y-5">
      <div className="flex-grow">
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />
          {getOrder?.data?.data?.products.map((item, index) => (
            <div key={index} className="flex flex-wrap">
              <IconInput
                disabled
                value={
                  item.sku === 'sku-zood-20001'
                    ? item?.pivot?.kitchen_notes
                    : item?.name
                }
                label="اسم المنتج"
                // inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                inputClassName="md:w-[327px]  "
              />
              <div className="flex gap-x-md">
                <IconInput
                  disabled
                  value={item?.pivot?.quantity}
                  label="الكمية"
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  disabled
                  value={item?.pivot?.unit_price || 0}
                  label="السعر"
                  iconSrcLeft="SR"
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                />
                <IconInput
                  label="المجموع"
                  inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                  iconSrcLeft="SR"
                  value={item?.pivot?.unit_price * item?.pivot?.quantity || 0}
                  disabled
                />
              </div>
            </div>
          ))}
          <div className="flex gap-x-md mt-5">
            <IconInput
              disabled={params.id}
              name="kitchen_received_at"
              // className="col-span-10 "
              label="نوع السيارة"
              inputClassName="w-[240px] min-w-[120px]"
              value={getOrder?.data?.data?.kitchen_received_at || ''}
              // value={formState.address}
              // inputClassName="md:col-span-5"
            />
            <IconInput
              disabled={params.id}
              name="kitchen_done_at"
              inputClassName="w-[240px] min-w-[120px] mb-sm "
              label="رقم اللوحة"
              value={getOrder?.data?.data?.kitchen_done_at || ''}
            />
          </div>
          <Textarea
            disabled={params.id}
            name="kitchen_notes"
            value={getOrder?.data?.data?.kitchen_notes || ''}
            className="w-[499px] my-sm"
            label="ملاحظات"
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
