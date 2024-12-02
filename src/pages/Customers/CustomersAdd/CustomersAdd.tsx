import React, { useEffect, useMemo, useState } from 'react';
import './CustomersAdd.css';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import { CustomersAddProps } from './CustomersAdd.types';
import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';
import { Button } from '@/components/custom/button';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import createCrudService from '@/api/services/crudService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  taxNum: z.string().nullable().optional(),
  coTax: z.string().nullable().optional(),
});

export const CustomersAdd: React.FC<CustomersAddProps> = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations
  const crudService = createCrudService<any>(
    'manage/customers?includes=address'
  );
  const { useGetById, useUpdate, useCreate } = crudService;
  const crudServiceAddress = createCrudService<any>(
    'manage/customers/addAddress'
  );

  const { useCreateById: useCreateAddress, useUpdate: useUpdateAddress } =
    crudServiceAddress;

  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const { mutate: createNewAddress } = useCreateAddress();
  const { mutate: updateAddress } = useUpdateAddress();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(
    () => (isEditMode ? getDataById?.data : {}),
    [getDataById, isEditMode]
  );

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [currData, setcurrData] = useState<any>({});
  // Reset form when data changes
  useEffect(() => {
    if (isEditMode && getDataById?.data) {
      axiosInstance
        .get(`/manage/customers/${params.objId}`)
        .then((res) => {
          const customerData = res?.data?.data;
          setcurrData(customerData);
          if (customerData) {
            form.setValue('name', customerData.name || '');
            form.setValue('phone', customerData.phone || '');
            form.setValue('taxNum', customerData.vat_registration_number || '');
            form.setValue('coTax', customerData.tax_registration_number || '');
            form.setValue('email', customerData.email || '');
            // Check if the addresses array exists and has at least one entry
            const address = customerData.addresses?.[0]?.name || '';
            form.setValue('address', address);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch customer data', err);
        });
    } else {
      form.reset({});
    }
  }, [getDataById, form, isEditMode, params.objId]);

  const { openDialog } = useGlobalDialog();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    if (isEditMode) {
      try {
        // First API call to update the customer
        const res = await axiosInstance.put(
          `/manage/customers/${params.objId}`,
          {
            ...values,
            notes: '-',
            tax_registration_number: values.taxNum,
            vat_registration_number: values.coTax,
          }
        );

        // Second API call to update the address
        if (values.address)
          await axiosInstance.post(
            `/manage/customers/addAddress/${res?.data?.data.id}`,
            {
              name: values.address,
              description: '-',
            }
          );
        else
          await axiosInstance.post(
            `/manage/customers/updateAddress/${
              currData?.addresses?.[0]?.id || ''
            }`,
            {
              name: values.address,
            }
          );

        // Success actions
        openDialog('updated');
        setLoading(false);
        navigate('/zood-dashboard/customers');
      } catch (err) {
        // Error handling
        form.reset({});
        setLoading(false);
      }
    } else {
      try {
        // First API call to create a customer
        const res = await axiosInstance.post('/manage/customers', {
          ...values,
          notes: '-',
          tax_registration_number: values.taxNum,
          vat_registration_number: values.coTax,
        });

        // Second API call to add an address for the created customer
        if (values.address)
          await axiosInstance.post(
            `/manage/customers/addAddress/${res?.data?.data.id}`,
            {
              name: values.address,
              description: '-',
            }
          );

        // Success actions
        openDialog('added');
        setLoading(false);
        form.reset({});
        navigate('/zood-dashboard/customers');
      } catch (err) {
        // Error handling
        form.reset({});
        setLoading(false);
      }
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? form.getValues('name') : 'اضافة عميل'}
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
      <div className="min-h-[70vh]">
        <div className="grid grid-cols-1  items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="px-s4 my-5"
            >
              <div className=" grid grid-cols-1 md:grid-cols-2 max-w-[580px] ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('CUSTOMER_NAME')}
                          iconSrc={personIcon}
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="هاتف العميل"
                          iconSrc={callIcon}
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="عنوان العميل"
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="الايميل"
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxNum"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="رقم تسجيل ضريبة القيمة المضافة"
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coTax"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="رقم السجل التجاري"
                          inputClassName="w-[278px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                dir="ltr"
                type="submit"
                loading={loading}
                disabled={loading}
                className="mt-4 h-[39px] w-[163px]"
              >
                {isEditMode ? 'تعديل عميل' : 'اضافة عميل'}
              </Button>
              <DelConfirm route={'manage/customers'} />
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};
