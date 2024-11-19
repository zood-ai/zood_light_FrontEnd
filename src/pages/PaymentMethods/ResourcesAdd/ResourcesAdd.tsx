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
import { SelectComp } from '@/components/custom/SelectItem';
import { paymentmethod } from '@/constant/constant';
import { CheckboxWithText } from '@/components/custom/CheckboxWithText';

// Validation schema using Zod
const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  type: z.string().nonempty('type is required'),
  is_active: z.union([z.boolean(), z.number()]).optional().default(true),
});

export const ResourcesAdd: React.FC<ResourcesAddProps> = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  // Fetch services and mutations
  const crudService = createCrudService<any>('manage/payment_methods');
  const { useGetByFillter, useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const { data: getDataById } = useGetByFillter(
    `filter[id]=${params.objId ?? ''}`
  );

  const [loading, setLoading] = useState(false);

  // Set default form values based on add/edit mode
  const defaultValues = useMemo(
    () => (isEditMode ? getDataById?.data[0] : {}),
    [getDataById, isEditMode]
  );

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { is_active: true, ...defaultValues },
  });

  // Reset form when data changes
  useEffect(() => {
    if (isEditMode) {
      form.reset(getDataById?.data[0]);
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
        {
          id: params.objId,
          data: {
            ...values,
            is_active: values.is_active ? 1 : 0,
          },
        },
        {
          onSuccess: (data) => {
            setLoading(false);
            form.reset(values);
          },
          onError,
        }
      );
    } else {
      await createNewUser(
        {
          ...values,
          is_active: values.is_active ? 1 : 0,
        },
        {
          onSuccess: (data) => {
            setLoading(false);
            form.reset({});
            navigate('/zood-dashboard/payment-methods');
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IconInput
                          {...field}
                          label={t('اسم طريقة الدفع')}
                          inputClassName="w-[100%]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectComp
                          label={t('نوع طريقة الدفع')}
                          value={field.value}
                          options={paymentmethod}
                          placeholder={t('اختر نوع طريقة الدفع')}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CheckboxWithText
                          {...field}
                          label={t('تفعيل')}
                          checked={field.value ? true : false}
                          onChange={(value) => field.onChange(value)}
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
                  {isEditMode ? t('تعديل الدفع') : t('اضافة طريقة الدفع')}
                </Button>
                <DelConfirm route={'manage/payment_methods'} />
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