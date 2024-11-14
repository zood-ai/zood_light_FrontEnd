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
import ShopCardSummeryPQEdit from '@/components/custom/ShopCardSummery/ShopCardSummeryPQEdit';

const CustomerFormEdit = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();
  const { useGetAll: fetchAllCustomers } = allService;
  const { useGetAll: fetchAllProducts } = createCrudService<any>(
    'menu/products?not_default=1'
  );

  const orderSchema = useSelector((state: any) => state.orderSchema);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const { data: allData, isLoading } = fetchAllCustomers();
  const { data: getAllPro } = fetchAllProducts();

  dispatch(updateField({ field: 'is_sales_order', value: 1 }));
  const handleSubmitOrder = async () => {};
  console.log(orderSchema, 'orderSchema');
 
  const { data : getOrdersById} = createCrudService<any>('orders').useGetById(
    `${params.id || ''}`
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-5 md:flex justify-between">
      <div className="col-span-3 md:col-span-2 grid grid-cols-1 md:grid-cols-10 gap-x-3xl gap-y-0">
        <CustomerFormEdits />

        <div className="col-span-10 my-2">
          {getOrdersById?.data?.products.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:flex gap-md">
              <SelectComp
                className="w-[220px] min-w-[120px] max-w-[220px]"
                placeholder="اسم الصنف"
                options={getAllPro?.data?.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                label="اسم الصنف"
                value={item.product_id}
                disabled
              />
              <IconInput
                value={item?.pivot?.quantity}
                label="الكمية"
                inputClassName="w-[117px] max-w-[117px] min-w-[80px]"
                disabled
              />
              <IconInput
                label="السعر"
                inputClassName="w-[138px] max-w-[138px] min-w-[80px]"
                iconSrcLeft="SR"
                value={item.unit_price}
                disabled
              />
              {orderSchema.products.length > 1 && (
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
          ))}
        </div>

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
      </div>

      {/* <ShopCardSummeryPQEdit /> */}
    </div>
  );
};

export default CustomerFormEdit;
