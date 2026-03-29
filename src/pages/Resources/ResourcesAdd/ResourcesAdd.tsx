import React, { useEffect, useState } from 'react';
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
import axiosInstance from '@/api/interceptors';

import personIcon from '/icons/name person.svg';
import callIcon from '/icons/call.svg';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { ResourcesAddProps } from './ResourcesAdd.types';
import ConfirmBk from '@/components/custom/ConfimBk';
import DelConfirm from '@/components/custom/DelConfim';

const inputFullWidth = 'w-full min-w-0';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contact_name: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  primary_email: z.string().optional().nullable(),
  tax_registration_number: z.string().optional().nullable(),
  vat_registration_number: z.string().optional().nullable(),
});

function SupplierFormSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      {[1, 2, 3].map((section) => (
        <Card key={section} className="border-mainBorder/80">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-[72px] w-full rounded-lg" />
            <Skeleton className="h-[72px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const ResourcesAdd: React.FC<ResourcesAddProps> = () => {
  const { t } = useTranslation();
  const params = useParams();
  const modalType = params.id;
  const isEditMode = modalType !== 'add';
  const navigate = useNavigate();

  const crudService = createCrudService<any>('inventory/suppliers');
  const { useUpdate, useCreate } = crudService;
  const { mutate: createNewUser } = useCreate();
  const { mutate: updateDataUserById } = useUpdate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contact_name: '',
      code: '',
      phone: '',
      primary_email: '',
      tax_registration_number: '',
      vat_registration_number: '',
    },
  });

  const [currData, setcurrData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [supplierLoading, setSupplierLoading] = useState(
    () => isEditMode && Boolean(params.objId)
  );

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: '',
        contact_name: '',
        code: '',
        phone: '',
        primary_email: '',
        tax_registration_number: '',
        vat_registration_number: '',
      });
      setcurrData({});
      setSupplierLoading(false);
      return;
    }

    if (!params.objId) {
      setSupplierLoading(false);
      return;
    }

    setSupplierLoading(true);
    axiosInstance
      .get(`/inventory/suppliers/${params.objId}`)
      .then((res) => {
        const d = res?.data?.data ?? res?.data;
        setcurrData(d);
        if (d) {
          form.reset({
            name: d.name ?? '',
            contact_name: d.contact_name ?? '',
            code: d.code ?? '',
            phone: d.phone ?? '',
            primary_email: d.primary_email ?? d.email ?? '',
            tax_registration_number: d.tax_registration_number ?? '',
            vat_registration_number: d.vat_registration_number ?? '',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch supplier', err);
      })
      .finally(() => {
        setSupplierLoading(false);
      });
  }, [isEditMode, params.objId, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const onError = () => setLoading(false);

    if (isEditMode) {
      await updateDataUserById(
        { id: params.objId, data: values },
        {
          onSuccess: () => {
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
          onSuccess: () => {
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
        mainTittle={isEditMode ? t('UPDATE_SUPPLIER') : t('ADD_SUPPLIER')}
        subTitle={
          isEditMode && currData?.name ? String(currData.name) : undefined
        }
        bkAction={() => {
          setIsOpen(true);
        }}
      />
      <ConfirmBk
        isOpen={isOpen}
        setIsOpen={undefined}
        closeDialog={() => setIsOpen(false)}
        getStatusMessage={undefined}
      />
      <div className="min-h-[70vh]">
        <div className="mx-auto max-w-3xl px-s4 pb-10 pt-1">
          {supplierLoading ? (
            <SupplierFormSkeleton />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('SUPPLIER_SECTION_BASIC')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('SUPPLIER_NAME')}
                                iconSrc={personIcon}
                                inputClassName={inputFullWidth}
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
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('communication_name')}
                                iconSrc={personIcon}
                                inputClassName={inputFullWidth}
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
                          <FormItem className="sm:col-span-2">
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('BARCODE')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('SUPPLIER_SECTION_CONTACT')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('PHONE')}
                                iconSrc={callIcon}
                                inputClassName={inputFullWidth}
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
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t('EMAIL_ADDRESS')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-mainBorder shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-mainText">
                      {t('SUPPLIER_SECTION_TAX')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="vat_registration_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <IconInput
                                {...field}
                                value={field.value ?? ''}
                                label={t(
                                  'SETTINGS_COMMERCIAL_REGISTRATION_NUMBER'
                                )}
                                inputClassName={inputFullWidth}
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
                                value={field.value ?? ''}
                                label={t('TAX_REGISTRATION_NUMBER')}
                                inputClassName={inputFullWidth}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    dir="ltr"
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="h-[39px] min-w-[163px]"
                  >
                    {isEditMode ? t('UPDATE_SUPPLIER') : t('ADD_SUPPLIER')}
                  </Button>
                  <DelConfirm route={'inventory/suppliers'} />
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};
