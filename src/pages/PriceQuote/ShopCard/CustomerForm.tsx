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

  dispatch(updateField({ field: 'is_sales_order', value: 1 }));
  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      if (!params.id) {
        await mutate(orderSchema, {
          onSuccess: () => {
            setLoading(false);
            navigate('/zood-dashboard/price-quote');
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
        });
      } catch (error) {
        console.error('Failed to fetch product data', error);
      }
    } else if (field === 'quantity') {
      const updatedProducts = orderSchema.products.map((item, i) =>
        i === index ? { ...item, quantity: parseInt(value) || 1 } : item
      );
      dispatch(addProduct(updatedProducts));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-5 md:flex justify-between">
      <div className="col-span-3 md:col-span-1 grid grid-cols-1 md:grid-cols-10 gap-x-3xl gap-y-md">
 
 
        <div className="col-span-10 my-2 gap-y-md  ">
          <CustomerForms />
          {orderSchema.products.map((item, index) => (
            <div key={index} className="grid grid-cols-1   gap-md">
              <SelectCompInput
              
                className="md:w-[327px]  "
                placeholder="اسم المنتج"
                options={getAllPro?.data?.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                label="اسم المنتج"
                onValueChange={(value) =>
                  handleItemChange(index, 'product_id', value)
                }
                value={item.product_id}
              />
              <div className='flex gap-x-md '>

              <IconInput
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, 'quantity', e.target.value)
                }
                label="الكمية"
                inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
              />
              <IconInput
                onChange={(e) =>
                  handleItemChange(index, 'total', e.target.value)
                }
                label="السعر"
                inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
                iconSrcLeft="SR"
                value={item.unit_price}
                disabled
              />
              <IconInput
                onChange={(e) =>
                  handleItemChange(index, 'total', e.target.value)
                }
                label="المجموع"
                inputClassName="w-[151px] max-w-[151px] min-w-[80px]"
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
            </div>
          ))}
          <Button
            onClick={() =>
              dispatch(
                addProduct([
                  ...orderSchema.products,
                  {
                    product_id: '',
                    quantity: '1',
                    unit_price: '0',
                    discount_amount: 0,
                    discount_id: '0aaa23cb-2156-4778-b6dd-a69ba6642552',
                    discount_type: 2,
                    total_price: 0,
                  },
                ])
              )
            }
            type="button"
            className="justify-end  mb-sm"
            variant="link"
          >
            <div className="flex gap-2">
              <span className="font-semibold">اضافة منتج</span>
              <PlusIcon />
            </div>
          </Button>
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

      <ShopCardSummeryPQ />
    </div>
  );
};

export default CustomerForm;
