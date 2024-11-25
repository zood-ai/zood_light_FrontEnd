import { useState } from 'react';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateField } from '@/store/slices/orderSchema';
import { useNavigate, useParams } from 'react-router-dom';
import TrashIcon from '@/components/Icons/TrashIcon';
import CustomerFormEdits from './CustomerFormEdits';
import CustomerForm from './CustomerForm';
import { Textarea } from '@/components/ui/textarea';
import ShopCardSummeryPQEdit from '@/components/custom/ShopCardSummery/ShopCardSummeryPQEdit';
import ShopCardSummeryPQ from '@/components/custom/ShopCardSummery/ShopCardSummeryPQ';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';

const CustomerFormEdit = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const { data: WhoAmI } = createCrudService<any>('auth/whoami').useGetAll();
  const ShowCar = WhoAmI?.business?.business_type?.toLowerCase() === 'workshop';

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
  const { useGetAll: fetchAllCustomers } = allService;
  const { useGetAll: fetchAllProducts } = createCrudService<any>(
    'menu/products?not_default=1'
  );
  const { openDialog } = useGlobalDialog();

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const { data: allData, isLoading } = fetchAllCustomers();
  const { data: getAllPro } = fetchAllProducts();
  const { mutate: confirmOrder } = createCrudService<any>(
    'confirm-sales-order'
  ).useCreate();

  dispatch(updateField({ field: 'is_sales_order', value: 1 }));
  const handleSubmitOrder = async () => {
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
      console.log(e);
    }
  };

  const { data: getOrdersById } = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );
  return (
    <div className="mt-5 max-lg:flex-wrap flex xl:justify-between max-xl:flex-col gap-x-10">
      <div className="">
        <CustomerFormEdits />
        {/* <CustomerForm /> */}

        <div className="space-y-10 my-2">
          {getOrdersById?.data?.products.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-md">
              <SelectComp
                className="flex-grow"
                placeholder="اسم المنتج"
                options={[
                  {
                    value: item.id,
                    label:
                      item.name !== 'sku-zood-20001'
                        ? item.name
                        : item.pivot.kitchen_notes,
                  },
                ]}
                label="اسم المنتج"
                value={item.id}
                disabled
              />
              <IconInput
                value={item?.pivot?.quantity}
                label="الكمية"
                inputClassName="max-sm:flex-grow sm:w-[117px] sm:max-w-[117px] sm:min-w-[80px]"
                disabled
              />
              <IconInput
                label="السعر"
                inputClassName="max-sm:flex-grow sm:w-[138px] sm:max-w-[138px] sm:min-w-[80px]"
                iconSrcLeft="SR"
                defaultValue={
                  item.unit_price * item?.pivot?.quantity ||
                  item.pivot.unit_price * item?.pivot?.quantity
                }
                disabled
              />
            </div>
          ))}
        </div>
        {/* {ShowCar && ( */}
          <div className="flex gap-x-md mt-5">
            <IconInput
              disabled
              name="kitchen_received_at"
              value={getOrdersById?.data?.kitchen_received_at}
              label="نوع السيارة"
              inputClassName="w-[240px] min-w-[120px]"
              onChange={null}
            />
            <IconInput
              disabled
              name="kitchen_done_at"
              value={getOrdersById?.data?.kitchen_done_at}
              inputClassName="w-[240px] min-w-[120px] mb-sm "
              label="رقم اللوحة"
              onChange={null}
            />
          </div>
        {/* )} */}
        <Textarea
          disabled
          name="kitchen_notes"
          value={getOrdersById?.data?.kitchen_notes}
          className="w-[499px] my-sm"
          label="ملاحظات"
        />

        <div className="col-span-10 pb-5">
          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmitOrder}
            className="w-[144px] mt-md"
          >
            تأكيد
          </Button>
        </div>
      </div>

      <ShopCardSummeryPQEdit />
      {/* <ShopCardSummeryPQ /> */}
    </div>
  );
};

export default CustomerFormEdit;
