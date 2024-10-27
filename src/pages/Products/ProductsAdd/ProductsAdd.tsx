import React, { useEffect, useMemo, useState } from 'react';

import './ProductsAdd.css';
import { useTranslation } from 'react-i18next';
import IconInput from '@/components/custom/InputWithIcon';
import useDirection from '@/hooks/useDirection';
import { ProductsAddProps } from './ProductsAdd.types';
import { Button } from '@/components/custom/button';
import { Textarea } from '@/components/ui/textarea';
import Previews from '@/components/custom/ImgFilesDND';
import { DetailsHeadWithOutFilter } from '@/components/custom/DetailsHeadWithOutFilter';
import { SelectComp } from '@/components/custom/SelectItem';
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
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  name_localized: z.string().nonempty('Phone is required'),
  description: z.string().nonempty('Address is required'),
  price: z.string().nonempty('Email is required'),
  barcode: z.string().nonempty('Email is required'),
  quantity: z.string().nonempty('Email is required'),
  category_id: z.string().nonempty('Email is required'),
});
export const ProductsAdd: React.FC<ProductsAddProps> = () => {
  const { t } = useTranslation();
  const isRtl = useDirection();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();
  // Fetch services and mutations
  const crudService = createCrudService<any>('menu/products');
  const { mutate: createInventoryCount } = createCrudService<any>(
    'inventory/inventory-count'
  ).useCreateNoDialog();
  const { useGetById, useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);
  const [file, setfile] = useState<any>();

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
      form.reset({
        ...getDataById?.data,
        category_id: getDataById?.data?.category?.id,
        quantity:
          getDataById?.data?.ingredients?.[0]?.pivot?.quantity?.toString(),
      });
    } else {
      form.reset({});
    }
  }, [getDataById, form, isEditMode]);
  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    if (isEditMode) {
      await updateDataUserById(
        {
          id: params.objId,
          data: { ...values, image: file },
        },
        {
          onSuccess: async (proData) => {
            setLoading(false);
            // form.reset(values);
            try {
              setLoading(false);
              console.log(proData);

              const inventoryPayload = {
                branch: branchData?.data?.[0]?.id,
                items: [{ id: proData.data?.ingredients?.[0]?.pivot?.item_id }],
              };

              await createInventoryCount(inventoryPayload, {
                onSuccess: async (invData) => {
                  try {
                    const inventoryId = invData.data.id;
                    const response = await axiosInstance.get(
                      `inventory/inventory-count/${inventoryId}`
                    );

                    const itemPivotId = response.data?.data?.items?.[0]?.id;

                    await axiosInstance.post(
                      `inventory/inventory-count/update_item/${inventoryId}`,
                      {
                        items: [
                          {
                            id: itemPivotId,
                            quantity: Number(values.quantity),
                          },
                        ],
                      }
                    );
                  } catch (error) {
                    console.error('Error updating inventory item:', error);
                  }
                },
              });
            } catch (error) {
              console.error('Error in onSuccess for createNewUser:', error);
            }
          },
          onError,
        }
      );
    } else {
      try {
        const userPayload = {
          ...values,
          is_stock_product: true,
          image: file,
          costing_method: 2,
          barcode: '',
          cost: 0,
          pricing_method: 1,
          selling_method: 1,
          sku: `PRO-${Math.floor(Math.random() * 100000)}`,
        };

        await createNewUser(userPayload, {
          onSuccess: async (proData) => {
            try {
              setLoading(false);
              console.log(proData);

              const inventoryPayload = {
                branch: branchData?.data?.[0]?.id,
                items: [{ id: proData.data?.ingredients?.[0]?.pivot?.item_id }],
              };
              const invData = await axiosInstance.post(
                'inventory/inventory-count',
                inventoryPayload
              );

              await createInventoryCount(inventoryPayload, {
                onSuccess: async (invData) => {
                  try {
                    const inventoryId = invData.data.id;
                    const response = await axiosInstance.get(
                      `inventory/inventory-count/${inventoryId}`
                    );

                    const itemPivotId = response.data?.data?.items?.[0]?.id;

                    await axiosInstance.post(
                      `inventory/inventory-count/update_item/${inventoryId}`,
                      {
                        items: [
                          {
                            id: itemPivotId,
                            quantity: Number(values.quantity),
                          },
                        ],
                      }
                    );
                    navigate('/zood-dashboard/products');
                  } catch (error) {
                    console.error('Error updating inventory item:', error);
                  }
                },
              });
            } catch (error) {
              console.error('Error in onSuccess for createNewUser:', error);
            }
          },
          onError: (error) => {
            console.error('Error creating new user:', error);
            onError();
          },
        });
      } catch (error) {
        console.error('Error in createNewUser or inventory process:', error);
      }
    }
  };
  const allService = createCrudService<any>('menu/categories');
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />{' '}
      <div className="flex flex-col items-start  mt-[19px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 self-stretch  ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px]  gap-y-[16px]   ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1  ">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="اسم المنتج"
                          inputClassName="w-[278px]"
                          // placeholder="ادخل اسم المورد"
                          // iconSrc={personIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name_localized"
                  render={({ field }) => (
                    <FormItem className="col-span-1  ">
                      <FormControl>
                        <IconInput
                          {...field}
                          label="اسم المنتج باللغة الإنجليزية"
                          inputClassName="w-[278px]"

                          // placeholder="ادخل اسم المورد"
                          // iconSrc={personIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem className="col-span-1  ">
                      <FormControl>
                        <SelectComp
                          {...field}
                          options={allData?.data?.map((item: any) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          onValueChange={field.onChange}
                          label="التصنيف"
                          className="col-span-1 md:col-span-2 w-[278px]"
                          // placeholder="ادخل اسم المورد"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="ادخل الوصف"
                          label="الوصف"
                          className="w-[499px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormControl>
                        <IconInput
                          {...field}
                          inputClassName=" w-[253px]"
                          label="رقم الباركود"
                          // placeholder="ادخل اسم المورد"
                          // iconSrc={personIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormControl>
                        <IconInput
                          {...field}
                          inputClassName=" w-[253px]"
                          label="كمية المخزون"
                          // placeholder="ادخل اسم المورد"
                          // iconSrc={personIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormControl>
                        <IconInput
                          {...field}
                          inputClassName=" w-[218px]"
                          label="سعر البيع"
                          // placeholder="ادخل اسم المورد"
                          iconSrcLeft={'SR'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-center -translate-y-10">
                <div className="w-[75%] h-[50%]  ">
                  <Previews
                    initialFile={''}
                    onFileChange={(files) => {
                      setfile(files);
                    }}
                  />
                </div>
              </div>
            </div>
            <Button
              dir="ltr"
              loading={loading}
              disabled={loading}
              className="mt-[32px] h-[39px] w-[163px]"
              type="submit"
            >
              {'اضافة منتج'}
            </Button>
            <DelConfirm route={'menu/products'} />
          </form>
        </Form>
      </div>
    </>
  );
};
