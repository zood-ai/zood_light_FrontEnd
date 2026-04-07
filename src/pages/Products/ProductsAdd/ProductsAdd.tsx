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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const POS_PREFILL_SKU_KEY = 'pos_prefill_product_sku_v1';

const formSchema = z.object({
  name: z.string().nonempty('Name is required'),
  name_localized: z.string().optional(),
  description: z.string().optional(),
  price: z.string().nonempty('price is required'),
  sku: z.any(),
  quantity: z.string().optional(),
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
  const { useGetById, useUpdateNoDialog, useCreateNoDialog } = crudService;
  const { mutate: createNewProduct } = useCreateNoDialog();
  const { mutate: updateProductById } = useUpdateNoDialog();
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
      const timer = setTimeout(() => {
        form.setValue('category_id', getDataById?.data?.category?.id);
      }, 500);
      setfile(getDataById?.data?.image);
      // return () => clearTimeout(timer);
    }
    if (!isEditMode) {
      form.reset({});
      const prefilledSku =
        typeof window !== 'undefined'
          ? String(window.localStorage.getItem(POS_PREFILL_SKU_KEY) || '').trim()
          : '';
      if (prefilledSku) {
        form.setValue('sku', prefilledSku);
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(POS_PREFILL_SKU_KEY);
        }
      } else {
        (async () => {
          try {
            const skuData = await axiosInstance.post('manage/generate_sku', {
              model: 'products',
            });
            form.setValue('sku', `sk-${skuData?.data?.data}`);
          } catch (error) {
            console.error('Error generating SKU:', error);
          }
        })();
      }
    }
  }, [getDataById, form, isEditMode]);

  const { data: branchData } =
    createCrudService<any>('manage/branches').useGetAll();

  // Handle form submission for both add and edit scenarios
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    const requestData = {
      id: params.objId,
      data: {
        ...values,
        image: file,
      },
    };

    if (isEditMode) {
      await updateProductById(requestData, {
        onSuccess: async (proData) => {
          // setLoading(false);
          // form.reset(values);
          const itemPivotId = proData?.data.ingredients[0]?.pivot?.item_id;
          try {
            // setLoading(false);

            const inventoryPayload = {
              branch: Cookies.get('branch_id'),
              items: [{ id: itemPivotId }],
            };

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
                  openDialog('updated');
                  setLoading(false);
                  navigate('/zood-dashboard/products');
                } catch (error) {
                  console.error('Error updating inventory item:', error);
                  // openDialog('added');
                  setLoading(false);
                  // navigate('/zood-dashboard/products');
                }
              },
            });
          } catch (error) {
            console.error('Error in onSuccess for createNewUser:', error);
          }
        },
        onError,
      });
    } else {
      try {
        // const skuData = await axiosInstance.post('manage/generate_sku', {
        //   model: 'products',
        // });

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
  const allService = createCrudService<any>('menu/categories?not_default=1');
  const { useGetAll } = allService;
  const { data: allData, isLoading } = useGetAll();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DetailsHeadWithOutFilter
        mainTittle={isEditMode ? form.getValues('name') : t('ADD_PRODUCT')}
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
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('BASIC_INFO')}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('PRODUCT_NAME')}
                                inputClassName="w-full"
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
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                label={t('PRODUCT_NAME_EN')}
                                inputClassName="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectComp
                              {...field}
                              options={allData?.data?.map((item: any) => ({
                                value: item.id,
                                label: item.name,
                              }))}
                              onValueChange={field.onChange}
                              label={t('CATEGORY_NAME')}
                              className="w-full"
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
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t('DESCRIPTION')}
                              label={t('DESCRIPTION')}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Inventory & Pricing Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('INVENTORY_AND_PRICING')}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormControl>
                            <IconInput
                              {...field}
                              inputClassName="w-full"
                              label={t('BARCODE')}
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
                        <FormItem>
                          <FormControl>
                            <IconInput
                              {...field}
                              inputClassName="w-full"
                              label={t('CURRENT_QUANTITY')}
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
                        <FormItem>
                          <FormControl>
                            <IconInput
                              {...field}
                              inputClassName="w-full"
                              label={t('PRICE')}
                              iconSrcLeft={'﷼'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Image */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{t('PRODUCT_IMAGE')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 lg:h-auto">
                      <Previews
                        initialFile={file}
                        onFileChange={(files) => {
                          setfile(files);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Button
                dir="ltr"
                loading={loading}
                disabled={loading}
                className="h-[39px] w-[163px]"
                type="submit"
              >
                {isEditMode ? t('UPDATE_PRODUCT') : t('ADD_PRODUCT')}
              </Button>
              {isEditMode && <DelConfirm route={'menu/products'} />}
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
