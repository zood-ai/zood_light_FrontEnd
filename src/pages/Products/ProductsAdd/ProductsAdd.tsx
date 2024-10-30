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
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/api/interceptors';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';
import Cookies from 'js-cookie';
import { useGlobalDialog } from '@/context/GlobalDialogProvider';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  name_localized: z.string().nonempty('Name is required'),
  description: z.string().nonempty('description is required'),
  price: z.string().nonempty('price is required'),
  sku: z.string().nonempty('barcode is required'),
  quantity: z.string().nonempty('quantity is required'),
  category_id: z.string().nonempty('category is required'),
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
  const { useGetById, useUpdate, useCreateNoDialog } = crudService;
  const { mutate: createNewProduct } = useCreateNoDialog();
  const { mutate: updateDataUserById } = useUpdate();
  const { data: getDataById } = useGetById(`${params.objId ?? ''}`);
  const [file, setfile] = useState<any>();
  const { openDialog } = useGlobalDialog();

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
        quantity: String(getDataById?.data?.quantity),
        price: String(getDataById?.data?.price),
      });
      setfile(getDataById?.data?.image);
    }
    if (!isEditMode) {
      form.reset({});

      async () => {
        const skuData = await axiosInstance.post('manage/generate_sku', {
          model: 'products',
        });
        form.setValue('sku', `sk-${skuData?.data?.data}`);
      };
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
                branch: Cookies.get('branch_id'),
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
        const skuData = await axiosInstance.post('manage/generate_sku', {
          model: 'products',
        });
        console.log(skuData);

        const productPayload = {
          ...values,
          is_stock_product: true,
          image: file,
          costing_method: 2,
          cost: 0,
          pricing_method: 1,
          selling_method: 1,
        };
        await createNewProduct(productPayload, {
          onSuccess: async (proData) => {
            try {
              console.log(proData);
              const itemPivotId = proData?.data.ingredients[0]?.pivot?.item_id;

              const inventoryPayload = {
                branch: Cookies.get('branch_id'),
                items: [{ id: itemPivotId }],
              };
              // const invData = await axiosInstance.post(
              //   'inventory/inventory-count',
              //   inventoryPayload
              // );

              await createInventoryCount(inventoryPayload, {
                onSuccess: async (invData) => {
                  try {
                    const inventoryId = invData.data.id;

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
                    await axiosInstance.put(
                      `inventory/inventory-count/${inventoryId}`,
                      {
                        status: 2,
                        branch: Cookies.get('branch_id'),
                      }
                    );
                    openDialog('added');
                    setLoading(false);
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
        mainTittle={isEditMode ? form.getValues('name') : 'اضافة منتج'}
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
                  name="sku"
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
                    initialFile={file}
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
              { isEditMode ? 'تعديل المنتج' : 'اضافة المنتج'}
            </Button>
            <DelConfirm route={'menu/products'} />
          </form>
        </Form>
      </div>
    </>
  );
};
