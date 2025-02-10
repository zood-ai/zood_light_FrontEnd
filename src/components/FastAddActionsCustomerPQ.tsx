import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDirection from '@/hooks/useDirection';
import personIcon from '/icons/name person.svg';

import callIcon from '/icons/call.svg';

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
import DelConfirm from '@/components/custom/DelConfim';
import IconInput from './custom/InputWithIcon';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/interceptors';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';
import XIcons from '@/components/Icons/XIcons';

const formSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  taxNum: z
    .string()
    .min(15, { message: 'Tax number is must be 15 number' })
    .optional(),
  coTax: z
    .string()
    .min(15, { message: 'Tax number is must be 15 number' })
    .optional(),
});
export default function FastAddActionsCustomerPQ({
  isOpen,
  onClose,
  setInvoice,
  onNewCustomerAdded,
}) {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  const crudService1 = createCrudService<any>(
    'manage/customers?perPage=100000&includes=address'
  );
  const {
    useGetById: useGetById1,
    useUpdate: useUpdate1,
    useCreate: useCreate1,
  } = crudService1;
  const crudServiceAddress = createCrudService<any>(
    'manage/customers/addAddress'
  );
  const { useCreateById: useCreateAddress, useUpdate: useUpdateAddress } =
    crudServiceAddress;

  // Fetch services and mutations
  const crudService = createCrudService<any>('inventory/suppliers');
  const { useGetById, useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  // const { data: getDataById } = useGetById(`${params.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  // Set default form values based on add/edit mode
  const defaultValues = useMemo(() => (isEditMode ? {} : {}), [isEditMode]);

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when data changes
  useEffect(() => {
    if (isEditMode) {
      form.reset({});
    } else {
      form.reset({});
    }
  }, [form, isEditMode]);
  const queryClient: any = useQueryClient();
  const { openDialog } = useGlobalDialog();

  // Handle form submission for both add and edit scenarios
  const queryKey = ['manage/customers'];

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

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
      if (onNewCustomerAdded) onNewCustomerAdded(res?.data?.data);
      // Success actions
      openDialog('added');
      form.reset({});
      queryClient.invalidateQueries(queryKey);
    } catch (err) {
      // Error handling
      form.reset({});
    } finally {
      // Always executed actions
      setLoading(false);
      onClose();
      form.reset({});
    }
  };
  return (
    <div onClick={onClose} className="relative ">
      <AlertDialogComp open={isOpen} onOpenChange={onClose}>
        <AlertDialogContentComp className="-left-7 w-fit">
          {/* SET WIDTH TO FIT CONTENT AND GIVE PADDING */}
          <button
            onClick={onClose}
            style={{
              left: !isRtl ? 'unset' : '-32px',
              right: !isRtl ? '-32px' : 'unset',
            }}
            className="absolute top-[40px] w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full transition z-[100] bg-white"
          >
            <XIcons />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-mainBg h-screen overflow-y-scroll w-fit p-4  max-w-[326px] relative ps-[24px]"
          >
            <div className="grow shrink text-2xl col-span-1 font-semibold w-auto  mt-[35px]">
              {t('ADD_CUSTOMER')}
            </div>
            <div className="min-h-[70vh]">
              <div className="grid grid-cols-1  items-start">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className="px-s4 my-5"
                  >
                    <div className=" grid grid-cols-1   max-w-[580px] ">
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
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1 mt-md">
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('EMAIL')}
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
                                label={t('TAX_REGISTRATION_NUMBER')}
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
                                label={t(
                                  'SETTINGS_COMMERCIAL_REGISTRATION_NUMBER'
                                )}
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
                      className="mt-4 h-[39px] w-full"
                    >
                      {t('ADD_CUSTOMER')}
                    </Button>
                    <DelConfirm route={'manage/customers'} />
                  </form>
                </Form>
              </div>
            </div>

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
