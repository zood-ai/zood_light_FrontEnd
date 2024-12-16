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
import CustomSearchInbox from '@/components/custom/CustomSearchInbox';
import { all } from 'axios';
import { useTranslation } from 'react-i18next';

const CustomerForms = () => {
  const { t } = useTranslation();
  const allService = createCrudService<any>('manage/customers');
  const allServiceOrder = createCrudService<any>('orders');
  const allServiceOrderPay =
    createCrudService<any>('order-payments').useCreate();
  const orderSchema = useSelector((state: any) => state.orderSchema);
  const navigate = useNavigate();

  const { mutate, isLoading: loadingOrder } = allServiceOrder.useCreate();

  const { useGetAll } = allService;
  const [loading, setLoading] = useState(false);

  const { data: allData, isLoading } = useGetAll();
  const [lastCustomerName, setLastCustomerName] = useState(
    allData?.data[0]?.name
  );
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
  const params = useParams();
  const [fastActionBtn, setFastActionBtn] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    if (lastCustomerName !== allData?.data[0]?.name) {
      setFormState((prevState) => ({ ...prevState, [field]: value }));
    }
  };
  const handleInputChangex = async (field: string, value: any) => {
    if (lastCustomerName !== allData?.data[0]?.name) {
      setFormState((prevState) => ({ ...prevState, [field]: value }));
    }
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

  const handleNewCustomerAdded = (newCustomer) => {
    // handleInputChange('customer_id', newCustomer.id);
    dispatch(
      updateField({
        field: 'customer_id',
        value: newCustomer.id,
      })
    );
  };

  useEffect(() => {
    if (!params.id) {
      handleInputChangex('customer_id', orderSchema?.customer_id);
    }
  }, [orderSchema?.customer_id]);

  const { useGetAll: useGetAllPro } = createCrudService<any>(
    'menu/products?not_default=1&per_page=1000'
  );

  return (
    <>
      <div className="flex-wrap flex gap-md mb-md ">
        <div className="flex-grow md:flex-grow-0">
          {/* <CustomSearchInbox
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
       //     label="اسم العميل" 
       //allData?.data[0]?.name!==lastCustomerName?allData?.data[0]?.name:'selectValue'
       label={'اسم العميل'}  
       className=" w-full  md:w-[21vw]"
            value={orderSchema?.customer_id}
            disabled={params.id}
          /> */}

          <CustomSearchInbox
            options={allData?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            onValueChange={(value) => {
              if (!params.id) {
                handleInputChangex('customer_id', value);
              }
            }}
            label={t('CUSTOMER_NAME')}
            className="w-full md:w-[21vw]"
            value={
              // allData?.data?.[0]?.name !== lastCustomerName
              //   ? allData?.data?.[0]?.id
              //   : orderSchema?.customer_id
              orderSchema?.customer_id
            }
            disabled={params.id}
          />
        </div>
        {!params.id && (
          <div className="flex items-end">
            <Button
              onClick={() => {
                setFastActionBtn(true);
              }}
              type="button"
              variant={'link'}
            >
              <div className="flex gap-2">
                <span className="font-semibold">{t('ADD_NEW_CUSTOMER')}</span>
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
        onNewCustomerAdded={handleNewCustomerAdded}
      />
    </>
  );
};

export default CustomerForms;
