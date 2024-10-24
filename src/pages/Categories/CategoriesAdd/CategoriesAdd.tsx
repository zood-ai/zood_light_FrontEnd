import React, { useEffect, useMemo, useState } from 'react';

import './CategoriesAdd.css';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import { CategoriesAddProps } from './CategoriesAdd.types';
import { Button } from '@/components/custom/button';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import Previews from '@/components/custom/ImgFilesDND';
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

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
});
export const CategoriesAdd: React.FC<CategoriesAddProps> = () => {
  const { i18n, t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  // Fetch services and mutations

  const [loading, setLoading] = useState(false);
  const [file, setfile] = useState<any>('');

  const defaultValues = useMemo(
    () => (isEditMode ? { name: '' } : {}),
    [isEditMode]
  );

  // Initialize form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const [currData, setcurrData] = useState<any>({});
  // Reset form when data changes
  useEffect(() => {
    if (isEditMode) {
      axiosInstance
        .get(`menu/categories/${params.objId}`)
        .then((res) => {
          const customerData = res?.data?.data;
          setcurrData(customerData);
          if (customerData) {
            form.setValue('name', customerData.name || '');
          }
        })
        .catch((err) => {
          console.error('Failed to fetch customer data', err);
        });
    } else {
      form.reset({});
    }
  }, [form, isEditMode, params.objId]);

  const { openDialog } = useGlobalDialog();
  console.log(currData, 'currData');

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    if (isEditMode) {
      await axiosInstance
        .put(`menu/categories/${params.objId}`, {
          name: values.name,
        })
        .then(() => {
          openDialog('added');
          setLoading(false);
          form.reset({});
          navigate('/zood-dashboard/categories');
        })
        .catch((err) => {
          form.reset({});
          setLoading(false);
        });
    } else {
      await axiosInstance
        .post('menu/categories', { name: values.name })

        .then(() => {
          openDialog('added');
          setLoading(false);
          form.reset({});
          navigate('/zood-dashboard/categories');
        })
        .catch((err) => {
          form.reset({});
          setLoading(false);
        });
    }
  };
  return (
    <>
      <DetailsHeadWithOutFilter />
      <div className="min-h-[70vh]">
        <div className="flex flex-col items-start rounded-none max-w-[70vw] ">
          <div className="grid grid-cols-2 gap-6 self-stretch bg ">
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="px-s4 my-5"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 mt-md">
                        <FormControl>
                          <IconInput
                            {...field}
                            label="اسم الفئه"
                            // placeholder="ادخل اسم المورد"
                            // iconSrc={personIcon}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="mt-4 h-[39px] w-[163px]" type="submit">
                    {'اضافة الفئه'}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="flex justify-center translate-y-[-100px]">
              <div className=" ">
                <Previews
                  initialFile={''}
                  onFileChange={(files) => {
                    setfile(files);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
