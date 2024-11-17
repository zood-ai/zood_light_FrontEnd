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
import ShopCardSummeryPQEdit from '@/components/custom/ShopCardSummery/ShopCardSummeryPQEdit';
import ShopCardSummeryPQ from '@/components/custom/ShopCardSummery/ShopCardSummeryPQ';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';

const CustomerFormEdit = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');

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
  console.log({ loading });

  dispatch(updateField({ field: 'is_sales_order', value: 1 }));
  const handleSubmitOrder = async () => {
    console.log(params.id);
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
  console.log(orderSchema, 'orderSchema');

  const { data: getOrdersById } = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );
  console.log({ hhhhh: getOrdersById });
  return (
    <div className="mt-5 flex-wrap flex xl:justify-between max-xl:flex-col gap-x-[120px]">
      <div className="flex-grow">
        <CustomerFormEdits />
        {/* <CustomerForm /> */}

        <div className="space-y-10 my-2">
          {getOrdersById?.data?.products.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-md">
              <SelectComp
                className="flex-grow"
                placeholder="اسم الصنف"
                options={[
                  {
                    value: item.id,
                    label: item.name,
                  },
                ]}
                label="اسم الصنف"
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
                defaultValue={item.unit_price || item.pivot.unit_price}
                disabled
              />
              {/* {orderSchema.products.length > 1 && (
                <TrashIcon
                  onClick={() => {
                    const updatedItems = orderSchema.products.filter(
                      (_, i) => i !== index
                    );
                    dispatch(addProduct(updatedItems));
                  }}
                  className="translate-y-[34px] cursor-pointer hover:scale-105"
                />
              )} */}
            </div>
          ))}
        </div>

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
