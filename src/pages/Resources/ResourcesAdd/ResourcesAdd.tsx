import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import './ResourcesAdd.css';
import IconInput from '@/components/custom/InputWithIcon';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { Button } from '@/components/custom/button';
import createCrudService from '@/api/services/crudService';
import useDirection from '@/hooks/useDirection';

import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { ResourcesAddProps } from './ResourcesAdd.types';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';

// Validation schema using Zod

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

export const ResourcesAdd: React.FC<ResourcesAddProps> = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  // Fetch services and mutations
  const crudService = createCrudService<any>('inventory/suppliers');
  const { useGetById, useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);

  const [loading, setLoading] = useState(false);

  // Set default form values based on add/edit mode
  const defaultValues = useMemo(
    () => (isEditMode ? getDataById?.data : {}),
    [getDataById, isEditMode]
  );

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Reset form when data changes
  useEffect(() => {
    if (isEditMode) {
      form.reset(getDataById?.data);
    } else {
      form.reset({});
    }
  }, [getDataById, form, isEditMode]);

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    if (isEditMode) {
      await updateDataUserById(
        { id: params.objId, data: values },
        {
          onSuccess: (data) => {
            setLoading(false);
            form.reset({});
            navigate('/zood-dashboard/resources');
          },
          onError,
        }
      );
    } else {
      await createNewUser(
        { ...values },
        {
          onSuccess: (data) => {
            setLoading(false);
            form.reset({});
            navigate('/zood-dashboard/resources');
          },
          onError,
        }
      );
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? form.getValues('name') : 'اضافة مورد'}
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <div className="min-h-[70vh]">
        <div className="flex flex-col items-start max-w-[580px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="px-s4 my-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('SUPPLIER_NAME')}
                          iconSrc={personIcon}
                          inputClassName="w-[100%] md:col-span-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('اسم للتواصل')}
                          iconSrc={personIcon}
                          inputClassName="w-[100%] md:col-span-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('BARCODE')}
                          // iconSrc={callIcon}
                          inputClassName="w-[100%]"
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
                    <FormItem className="md:col-span-2 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('هاتف المورد')}
                          iconSrc={callIcon}
                          inputClassName="w-[100%]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primary_email"
                  render={({ field }) => (
                    <FormItem className="md:col-span-4 mt-md">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="البريد الإلكتروني"
                          inputClassName="w-[278px]"
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
                    <FormItem className="md:col-span-2 mt-md">
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
                  name="tax_registration_number"
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
              <div className="  ">
                <Button
                  dir="ltr"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="mt-4 h-[39px] w-[163px]"
                >
                  {isEditMode ? t('تعديل المورد') : t('اضافة المورد')}
                </Button>
                <DelConfirm route={'inventory/suppliers'} />
              </div>
            </form>
          </Form>
        </div>
      </div>
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
    </>
  );
};
