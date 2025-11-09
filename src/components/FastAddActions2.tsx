import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import personIcon from '/icons/name person.svg';

import callIcon from '/icons/call.svg';

import { IconLoader } from '@tabler/icons-react';
import { AlertDialog, AlertDialogContent } from './ui/alert-dialog';
import { Button } from './custom/button';
import { AlertDialogContentComp, AlertDialogComp } from './ui/alert-dialog2';
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
import IconInput from './custom/InputWithIcon';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  phone: z.string().nonempty('Phone is required'),
  address: z.string().nonempty('Address is required'),
  taxNum: z
    .string()
    .min(15, { message: 'Tax number is must be 15 number' })
    .optional(),
  coTax: z.string().optional().nullable(),
});
export default function FastAddActions2({ isOpen, onClose }) {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations
  const crudService = createCrudService<any>(
    'manage/customers?perPage=100000&includes=address'
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
            form.setValue('taxNum', customerData.tax_registration_number || '');
            form.setValue('coTax', customerData.vat_registration_number || '');

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
        await axiosInstance.put(`/manage/customers/${params.objId}`, {
          ...values,
          notes: '-',
          tax_registration_number: values.taxNum,
          vat_registration_number: values.coTax,
        });

        // Second API call to update the address
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

  return (
    <div className=" ">
      <AlertDialogComp open={isOpen} onOpenChange={onClose}>
        <AlertDialogContentComp className="    ">
          <div className="bg-white h-[100vh] w-[30vw] border border-red-500 relative">
            <>
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
                        <FormItem className="md:col-span-2 mt-md">
                          <FormControl>
                            <IconInput
                              {...field}
                              label={t('ADDRESS')}
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
                              label="الرقم الضريبي"
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
                              label="الرقم الضريبي للشركة"
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
                    {isEditMode ? t('UPDATE_CUSTOMER') : t('ADD_CUSTOMER')}
                  </Button>
                  <DelConfirm route={'manage/customers'} />
                </form>
              </Form>
            </>
            <img
              onClick={onClose}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute right-[-70px] top-0 cursor-pointer hover:scale-110"
            />
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
    </div>
  );
}
