import { useState } from 'react';
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

const CustomerForm = () => {
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

  dispatch(updateField({ field: 'is_sales_order', value: 0 }));
  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      if (!params.id) {
        await mutate(orderSchema, {
          onSuccess: () => {
            setLoading(false);
            navigate(`/zood-dashboard/corporate-invoices`);
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

  const handleItemChange = async (
    index: number,
    field: string,
    value: string
  ) => {
    if (field === 'product_id') {
      try {
        const { data } = await axiosInstance.get(`/menu/products/${value}`);
        const productData = data?.data;

        updateCardItem({
          index,
          product_id: value,
          quantity: 1,
          name: productData.name,
          unit_price: productData.price,
          total_price:
            productData.price * productData.quantity || productData.price,
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
            }
          : item
      );
      dispatch(addProduct(updatedProducts));
    }
  };

  return (
    <div className="mt-5 flex xl:justify-between max-xl:flex-col gap-x-4 space-y-5">
      <div className="flex-grow">
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />
          <div className="flex gap-x-md">
            <IconInput
              // disabled
              // name={formState.name}
              // className="col-span-10 "
              label="نوع السيارة"
              inputClassName="w-[240px] min-w-[120px]"
              // value={formState.address}
              onChange={null}
              // inputClassName="md:col-span-5"
            />
            <IconInput
              // disabled
              // name={formState.name}
              inputClassName="w-[240px] min-w-[120px] mb-sm "
              label="رقم اللوحة"
              // value={formState.address}
              onChange={null}
            />
          </div>
          <Textarea
            name="purchaseDescription"
            // value={invoice.purchaseDescription}
            // onChange={(e) =>
            //   setInvoice({
            //     ...invoice,
            //     purchaseDescription: e.target.value,
            //   })
            // }
            className="w-[499px] my-sm"
            label="ملاحظات"
          />
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

      <ShopCardSummery />
    </div>
  );
};

export default CustomerForm;
