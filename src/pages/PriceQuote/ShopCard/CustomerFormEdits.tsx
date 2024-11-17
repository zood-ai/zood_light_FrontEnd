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

const CustomerFormEdits = () => {
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

  useEffect(() => {
    if (params.id) {
      handleInputChangex('customer_id', orderSchema?.customer_id);
    }
  }, [orderSchema?.customer_id]);

  console.log(orderSchema, 'orderSchema');

  return (
    <div className="space-y-4">
      <SelectComp
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
        label="اسم العميل"
        className="flex-grow"
        value={orderSchema?.customer_id}
        disabled={params.id}
      />
      {/* <IconInput
        disabled
        name="name"
        className="flex-grow"
        inputClassName="w-full"
        label="رقم العميل"
        iconSrc={callIcon}
        value={formState.phone}
        onChange={null}
      />
      <IconInput
        disabled
        name={formState.name}
        className="flex-grow"
        label="اسم الشارع"
        value={formState.address}
        onChange={null}
      />
      <IconInput
        disabled
        className="flex-grow"
        inputClassName="w-full"
        label="رقم تسجيل ضريبة القيمة المضافة"
        value={formState.tax_registration_number}
        onChange={null}
      />
      <IconInput
        disabled
        className="flex-grow"
        inputClassName="w-full"
        label="معرف اخر"
        value={formState.vat_registration_number}
        onChange={null}
      /> */}
    </div>
  );
};
export default CustomerFormEdits;
