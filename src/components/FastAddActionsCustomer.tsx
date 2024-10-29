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
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string(),
  phone: z.string(),
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
            form.reset(values);
          },
          onError,
        }
      );
    } else {
      await createNewUser(
        { ...values, code: `SUP-${Math.floor(Math.random() * 100000)}` },
        {
          onSuccess: (data) => {
            console.log(data, 'data');

            setInvoice(data.data.id);
            setLoading(false);
            form.reset({});
            onClose();
            queryClient.invalidateQueries(['inventory/suppliers']);
          },
          onError,
        }
      );
    }
  };
  return (
    <div className=" ">
      <AlertDialogComp open={isOpen} onOpenChange={onClose}>
        <AlertDialogContentComp className="    ">
          <div className="bg-mainBg h-[100vh] w-[422px]     relative ps-[24px]">
            <>
              <div className="grow shrink text-2xl col-span-1 font-semibold w-[102px]  mt-[35px]">
                فاتورة
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="my-md"
                >
                  <div className="grid grid-cols-1  gap-y-md">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <IconInput
                              {...field}
                              label={t('اسم المورد')}
                              iconSrc={personIcon}
                              inputClassName="w-[105%]"
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
                        <FormItem>
                          <FormControl>
                            <IconInput
                              {...field}
                              label={t('هاتف المورد')}
                              iconSrc={callIcon}
                              inputClassName="w-[105%]"
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
            </>
            <img
              onClick={onClose}
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/86098466758eefea48c424850dc7f8dc58fa0a42b1b3b43e6d08b5eb236f964e?placeholderIfAbsent=true&apiKey=8679f2257b144d7b937e32f7e767988e"
              className="object-contain shrink-0 self-start mt-4 w-11 aspect-square absolute left-[-60px] top-0 cursor-pointer hover:scale-110"
            />
          </div>
        </AlertDialogContentComp>
      </AlertDialogComp>
    </div>
  );
}
