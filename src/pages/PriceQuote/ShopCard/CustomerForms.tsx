import { useEffect, useState } from 'react';
import callIcon from '/icons/call.svg';
import { SelectComp } from '@/components/custom/SelectItem';
import IconInput from '@/components/custom/InputWithIcon';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import axiosInstance from '@/api/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import { updateField } from '@/store/slices/orderSchema';
import { useNavigate, useParams } from 'react-router-dom';
import FastAddActionsCustomer from '@/components/FastAddActionsCustomer';
import PlusIcon from '@/components/Icons/PlusIcon';
import FastAddActionsCustomerPQ from '@/components/FastAddActionsCustomerPQ';

const CustomerForms = () => {
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const allServiceOrderPay =
    createCrudService<any>('order-payments').useCreate();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  let navigate = useNavigate();

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();

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

  const submitOrder = async () => {
    try {
      setLoading(true);

      if (!params.id) {
        await mutate(orderSchema, {
          onSuccess: (data) => {
            setLoading(false);
            navigate(`/zood-dashboard/price-quote`);
          },
          onError: (error) => {
            setLoading(false);
          },
        });
      }
      // const res = await axiosInstance.post('orders', orderSchema);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!params.id) {
      handleInputChangex('customer_id', orderSchema?.customer_id);
    }
  }, [orderSchema?.customer_id]);

  const { useGetAll: useGetAllPro } = createCrudService<any>(
    'menu/products?not_default=1'
  );
  const { data: getAllPro } = useGetAllPro();


  return (
    <>
      <div className=" flex gap-md mb-md ">
        <div>
          <SelectComp
            options={allData?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            placeholder="اسم العميل"
            onValueChange={(value) => {
              if (params.id) {
                return;
              } else {
                handleInputChangex('customer_id', value);
              }
            }}
            label="اسم العميل"
            className="  md:w-[21vw]"
            value={orderSchema?.customer_id}
            disabled={params.id}
          />
        </div>

        {!params.id && (
          <div className="translate-y-[32px]">
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
      </div>

      <FastAddActionsCustomerPQ
        setInvoice={() => {}}
        isOpen={fastActionBtn}
        onClose={() => setFastActionBtn(false)}
      />
    </>
  );
};

export default CustomerForms;
