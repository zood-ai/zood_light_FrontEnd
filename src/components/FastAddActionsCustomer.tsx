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
import XIcons from '@/components/Icons/XIcons';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  tax_registration_number: z
    .string()
    .length(15, 'Tax registration number must be exactly 15 digits')
    .regex(/^\d{15}$/, 'Tax registration number must only contain 15 digits')
    .optional(),
  vat_registration_number: z
    .string()
    .length(15, 'Vat registration number must be exactly 15 digits')
    .regex(/^\d{15}$/, 'Tax registration number must only contain 15 digits')
    .optional(),
});

export default function FastAddActionsCustomer({
  isOpen,
  onClose,
  setInvoice,
}) {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  const crudService = createCrudService<any>('inventory/suppliers');
  const { useGetById, useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();

  const [loading, setLoading] = useState(false);
  const defaultValues = useMemo(() => (isEditMode ? {} : {}), [isEditMode]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditMode) {
      form.reset({});
    } else {
      form.reset({});
    }
  }, [form, isEditMode]);
  const queryClient: any = useQueryClient();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // The react-hook-form automatically checks errors, no need for custom check here
    setLoading(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phone', values.phone);
    formData.append('primary_email', values.email || '');
    formData.append(
      'tax_registration_number',
      values.tax_registration_number || ''
    );
    formData.append(
      'vat_registration_number',
      values.vat_registration_number || ''
    );

    try {
      if (isEditMode) {
        await updateDataUserById(
          { id: params.objId, data: formData },
          {
            onSuccess: (data) => {
              setLoading(false);
              form.reset(values);
            },
            onError: () => setLoading(false),
          }
        );
      } else {
        await createNewUser(formData, {
          onSuccess: (data) => {
            setInvoice(data.data.id);
            setLoading(false);
            form.reset({});
            onClose();
            queryClient.invalidateQueries(['inventory/suppliers']);
          },
          onError: () => setLoading(false),
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form data:', error);
    }
  };

  const handleClickSubmit = () => {
    // React Hook Form handleSubmit already takes care of validation
    form.handleSubmit(handleSubmit)(); // Call handleSubmit directly
  };

  return (
    <div onClick={onClose}>
      <AlertDialogComp open={isOpen} onOpenChange={onClose}>
        <AlertDialogContentComp className="-left-7">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-mainBg h-[100vh] w-[326px] relative px-4"
          >
            <button
              onClick={onClose}
              style={{
                left: !isRtl ? 'unset' : '-48px',
                right: !isRtl ? '-48px' : 'unset',
              }}
              className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full transition z-[100] bg-white"
            >
              <XIcons />
            </button>

            <div className="grow shrink text-2xl col-span-1 font-semibold w-fit mt-[50px]">
              {t('ADD_SUPPLIER')}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="my-md mt-6 space-y-4"
              >
                <div className="grid grid-cols-1 gap-y-md">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IconInput
                            {...field}
                            label={t('SUPPLIER_NAME')}
                            iconSrc={personIcon}
                            inputClassName="w-[105%] rounded-md mb-2 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IconInput
                            {...field}
                            label={t('phoneNumber')}
                            iconSrc={callIcon}
                            inputClassName="w-[105%] rounded-md mb-2 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <FormItem>
                        <FormControl>
                          <IconInput
                            {...field}
                            type="email"
                            label={t('EMAIL_ADDRESS')}
                            inputClassName="w-[105%] rounded-md mb-2 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax_registration_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IconInput
                            {...field}
                            label={t('TAX_REGISTRATION_NUMBER')}
                            inputClassName="w-[105%] rounded-md mb-2 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vat_registration_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <IconInput
                            {...field}
                            label={t('TAX_REGISTRATION_NUMBER')}
                            inputClassName="w-[105%] rounded-md mb-2 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    dir="ltr"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    onClick={handleClickSubmit}
                    className="h-[39px] w-full"
                  >
                    {isEditMode ? t('UPDATE_SUPPLIER') : t('ADD_SUPPLIER')}
                  </Button>
                  <DelConfirm route={'inventory/suppliers'} />
                </div>
              </form>
            </Form>
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
    </div>
  );
}
